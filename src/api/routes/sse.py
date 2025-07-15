"""
Server-Sent Events (SSE) endpoints for real-time CV processing updates
"""

import asyncio
import uuid
import logging
from pathlib import Path
from typing import Optional
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Request
from fastapi.responses import StreamingResponse
from datetime import datetime

# Internal imports
from src.api.routes.auth import get_current_user, get_current_user_for_sse, validate_sse_permissions, require_admin
from src.services.rate_limiter import rate_limiter, apply_rate_limits
from src.services.sse_service import sse_service, SSEMessage
from src.core.local.text_extractor import text_extractor
from src.core.cv_extraction.data_extractor import data_extractor
from src.core.schemas.unified_nullable import CVData
from src.utils.sse_live_logger import SSELiveLogger, create_job_logger
import config

# Setup
router = APIRouter(prefix="/sse", tags=["sse"])
logger = logging.getLogger(__name__)

# SSE Headers
SSE_HEADERS = {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Cache-Control,Last-Event-ID",
}

# FastAPI dependency for rate limiting
async def check_sse_rate_limit(
    auth_info: dict = Depends(get_current_user_for_sse)
):
    """FastAPI dependency to check SSE rate limits"""
    user_id = auth_info["user_id"]
    
    # Apply rate limits
    allowed, reason = apply_rate_limits(user_id)
    if not allowed:
        raise HTTPException(status_code=429, detail=reason)
    
    return auth_info


@router.get("/cv/extract-streaming/{job_id}")
async def extract_cv_streaming(
    job_id: str,
    request: Request,
    current_user_id: str = Depends(get_current_user)
):
    """
    Stream CV extraction progress in real-time via SSE
    
    Args:
        job_id: Unique job identifier
        request: FastAPI request object for client disconnect detection
        current_user_id: Authenticated user ID
        
    Returns:
        StreamingResponse with text/event-stream content
    """
    connection_id = f"cv-extract-{job_id}-{uuid.uuid4().hex[:8]}"
    logger.info(f"Starting SSE CV extraction stream for job {job_id}, connection {connection_id}")
    
    async def event_generator():
        """Generate SSE events for CV extraction process"""
        live_logger = create_job_logger(job_id, "cv_extract", connection_id)
        
        try:
            # Send initial connection message
            initial_msg = sse_service.create_step_message(
                "connection_established", 1, 5,
                {"job_id": job_id, "user_id": current_user_id}
            )
            yield initial_msg.to_sse_format()
            
            # TODO: In real implementation, retrieve file path from job_id
            # For now, this is a placeholder structure
            
            # Send completion for demonstration
            complete_msg = sse_service.create_complete_message({
                "job_id": job_id,
                "status": "ready_for_extraction",
                "message": "CV extraction endpoint ready for file processing"
            })
            yield complete_msg.to_sse_format()
            
            # Keep connection alive until client disconnects
            while True:
                if await request.is_disconnected():
                    logger.info(f"Client disconnected from SSE stream: {connection_id}")
                    break
                await asyncio.sleep(1)
                
        except asyncio.CancelledError:
            logger.info(f"SSE stream cancelled for connection: {connection_id}")
        except Exception as e:
            logger.error(f"Error in CV extraction SSE stream: {e}")
            error_msg = sse_service.create_error_message(
                f"CV extraction failed: {str(e)}",
                "CV_EXTRACTION_ERROR"
            )
            yield error_msg.to_sse_format()
        finally:
            logger.info(f"SSE CV extraction stream ended: {connection_id}")

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers=SSE_HEADERS
    )


@router.post("/cv/extract-streaming")
async def extract_cv_streaming_upload(
    file: UploadFile = File(...),
    auth_info: dict = Depends(check_sse_rate_limit)
):
    """
    Upload CV file and stream extraction progress via SSE
    
    Args:
        file: CV file to process
        auth_info: Authenticated user information with permissions
        
    Returns:
        StreamingResponse with real-time extraction progress
    """
    # Validate SSE permissions
    if not validate_sse_permissions(auth_info, "can_stream_cv_extraction"):
        raise HTTPException(
            status_code=403,
            detail="CV extraction streaming not allowed for this user"
        )
    
    current_user_id = auth_info["user_id"]
    job_id = str(uuid.uuid4())
    connection_id = f"cv-upload-{job_id}-{uuid.uuid4().hex[:8]}"
    
    # Register connection with rate limiter
    if not rate_limiter.add_connection(current_user_id):
        raise HTTPException(
            status_code=429,
            detail="Could not establish connection - rate limit exceeded"
        )
    
    logger.info(f"Starting SSE CV upload and extraction for user {current_user_id}, job {job_id}")
    
    # Use the SSE service's streaming generator
    async def upload_and_extract_generator():
        """Process file upload and extraction with real-time updates"""
        # Start SSE stream
        async for sse_message in sse_service.stream_generator(connection_id):
            yield sse_message
            
        # This will not be reached as stream_generator runs indefinitely
        # The actual processing will be done in a background task
        
    # Background task for processing
    async def process_file_background():
        """Background task to process the file and emit SSE messages"""
        live_logger = create_job_logger(job_id, "cv_upload_extract", connection_id)
        live_logger.set_total_steps(5)  # validation, saving, text_extraction, ai_analysis, finalizing
        
        try:
            # Step 1: File validation
            live_logger.step("Validating uploaded file")
            
            # Read file content with timeout
            try:
                file_content = await asyncio.wait_for(file.read(), timeout=config.UPLOAD_TIMEOUT)
            except asyncio.TimeoutError:
                raise HTTPException(status_code=408, detail="File upload timed out")
            
            if not file_content:
                raise HTTPException(status_code=400, detail="File is empty")
            
            # Check file size
            if len(file_content) > config.MAX_UPLOAD_SIZE:
                raise HTTPException(
                    status_code=413, 
                    detail=f"File too large. Maximum size is {config.MAX_UPLOAD_SIZE / 1024 / 1024}MB"
                )
            
            file_extension = Path(file.filename).suffix.lower()
            if file_extension not in config.ALLOWED_EXTENSIONS:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Invalid file type: {file_extension}"
                )
            
            live_logger.step_complete("File validation successful")
            
            # Step 2: Save file temporarily
            live_logger.step("Saving file for processing")
            
            # Create temp file path
            BASE_DIR = Path(__file__).parent.parent.parent
            upload_dir = BASE_DIR / "data" / "uploads"
            upload_dir.mkdir(exist_ok=True)
            file_path = upload_dir / f"{job_id}{file_extension}"
            
            # Save file
            import aiofiles
            async with aiofiles.open(file_path, "wb") as f:
                await f.write(file_content)
            
            live_logger.step_complete("File saved successfully")
            
            # Step 3: Text extraction
            live_logger.step("Extracting text from document")
            
            # Determine if OCR is needed
            image_extensions = {'.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif', '.tiff', '.tif', '.bmp'}
            needs_ocr = file_extension in image_extensions
            
            if needs_ocr:
                live_logger.info("Image file detected, using OCR")
            
            text = text_extractor.extract_text(str(file_path))
            
            live_logger.step_complete(f"Text extraction complete: {len(text)} characters")
            
            # Step 4: AI data extraction
            live_logger.step("Analyzing content with AI")
            
            cv_data = await data_extractor.extract_cv_data(text)
            
            live_logger.step_complete("AI analysis complete")
            
            # Step 5: Cleanup and completion
            live_logger.step("Finalizing results")
            
            # Clean up uploaded file
            try:
                if file_path.exists():
                    file_path.unlink()
                    live_logger.info("Uploaded file cleaned up")
            except Exception as e:
                live_logger.warning(f"Failed to cleanup file: {e}")
            
            # Complete the process
            completion_result = {
                "job_id": job_id,
                "cv_data": cv_data.model_dump_nullable(),
                "filename": file.filename,
                "file_size": len(file_content),
                "extraction_method": "OCR" if needs_ocr else "Text Extraction",
                "extracted_sections": len([f for f in cv_data.model_dump_nullable() if cv_data.model_dump_nullable()[f]]),
                "processing_time": live_logger.get_total_time()
            }
            
            live_logger.success("CV extraction completed successfully", completion_result)
            
        except HTTPException as he:
            # Re-raise HTTP exceptions (they contain proper error codes)
            error_msg = sse_service.create_error_message(
                he.detail,
                f"HTTP_{he.status_code}"
            )
            yield error_msg.to_sse_format()
            
        except Exception as e:
            logger.error(f"CV extraction failed for job {job_id}: {e}")
            live_logger.error("CV extraction failed", error=e)
            
            # Clean up file if it exists
            try:
                if 'file_path' in locals() and file_path.exists():
                    file_path.unlink()
            except:
                pass
            
            error_msg = sse_service.create_error_message(
                f"CV extraction failed: {str(e)}",
                "CV_EXTRACTION_ERROR"
            )
            yield error_msg.to_sse_format()
        
        finally:
            # Always clean up connection
            rate_limiter.remove_connection(current_user_id)

    return StreamingResponse(
        upload_and_extract_generator(),
        media_type="text/event-stream",
        headers=SSE_HEADERS
    )


@router.get("/portfolio/generate-streaming/{job_id}")
async def generate_portfolio_streaming(
    job_id: str,
    request: Request,
    auth_info: dict = Depends(check_sse_rate_limit)
):
    """
    Stream portfolio generation progress via SSE
    
    Args:
        job_id: Job ID containing CV data to generate portfolio from
        request: FastAPI request object
        auth_info: Authenticated user information
        
    Returns:
        StreamingResponse with portfolio generation progress
    """
    # Validate permissions
    if not validate_sse_permissions(auth_info, "can_stream_portfolio_generation"):
        raise HTTPException(
            status_code=403,
            detail="Portfolio generation streaming not allowed for this user"
        )
    
    current_user_id = auth_info["user_id"]
    connection_id = f"portfolio-gen-{job_id}-{uuid.uuid4().hex[:8]}"
    logger.info(f"Starting SSE portfolio generation for job {job_id}, connection {connection_id}")
    
    async def portfolio_generator():
        """Generate portfolio with real-time progress updates"""
        live_logger = create_job_logger(job_id, "portfolio_gen", connection_id)
        live_logger.set_total_steps(5)  # template_selection, component_generation, styling, preview, finalization
        
        try:
            # Send initial message
            yield sse_service.create_step_message(
                "portfolio_generation_started", 1, 5,
                {"job_id": job_id, "user_id": current_user_id}
            ).to_sse_format()
            
            # Placeholder for portfolio generation steps
            steps = [
                ("template_selection", "Selecting portfolio template"),
                ("component_generation", "Generating custom components"),
                ("styling_application", "Applying styling and animations"),
                ("preview_preparation", "Preparing preview environment"),
                ("finalization", "Finalizing portfolio")
            ]
            
            for i, (step_name, step_description) in enumerate(steps, 1):
                live_logger.step(step_description)
                yield sse_service.create_progress_message(
                    step_name, i * 20, step_description
                ).to_sse_format()
                
                # Simulate processing time
                await asyncio.sleep(1)
                
                live_logger.step_complete(step_description)
            
            # Send completion
            result = {
                "job_id": job_id,
                "portfolio_url": f"https://preview.cv2web.com/{job_id}",
                "status": "ready",
                "processing_time": live_logger.get_total_time()
            }
            
            yield sse_service.create_complete_message(result).to_sse_format()
            
            # Keep connection alive until client disconnects
            while True:
                if await request.is_disconnected():
                    logger.info(f"Client disconnected from portfolio generation stream: {connection_id}")
                    break
                await asyncio.sleep(1)
                
        except asyncio.CancelledError:
            logger.info(f"Portfolio generation SSE stream cancelled: {connection_id}")
        except Exception as e:
            logger.error(f"Error in portfolio generation SSE stream: {e}")
            error_msg = sse_service.create_error_message(
                f"Portfolio generation failed: {str(e)}",
                "PORTFOLIO_GENERATION_ERROR"
            )
            yield error_msg.to_sse_format()
        finally:
            logger.info(f"Portfolio generation SSE stream ended: {connection_id}")

    return StreamingResponse(
        portfolio_generator(),
        media_type="text/event-stream",
        headers=SSE_HEADERS
    )


@router.get("/sandbox/status-streaming/{sandbox_id}")
async def sandbox_status_streaming(
    sandbox_id: str,
    request: Request,
    auth_info: dict = Depends(check_sse_rate_limit)
):
    """
    Stream sandbox status updates via SSE
    
    Args:
        sandbox_id: Sandbox identifier to monitor
        request: FastAPI request object
        auth_info: Authenticated user information
        
    Returns:
        StreamingResponse with sandbox status updates
    """
    # Validate permissions
    if not validate_sse_permissions(auth_info, "can_monitor_sandbox"):
        raise HTTPException(
            status_code=403,
            detail="Sandbox monitoring not allowed for this user"
        )
    
    current_user_id = auth_info["user_id"]
    connection_id = f"sandbox-{sandbox_id}-{uuid.uuid4().hex[:8]}"
    logger.info(f"Starting SSE sandbox status stream for sandbox {sandbox_id}, connection {connection_id}")
    
    async def sandbox_status_generator():
        """Generate sandbox status updates"""
        live_logger = create_job_logger(sandbox_id, "sandbox_status", connection_id)
        live_logger.set_total_steps(4)  # creating, building, starting, running
        
        try:
            # Initial status
            yield sse_service.create_step_message(
                "sandbox_monitoring_started", 1, 1,
                {"sandbox_id": sandbox_id, "user_id": current_user_id}
            ).to_sse_format()
            
            # Simulate sandbox lifecycle
            statuses = [
                ("creating", "Creating sandbox environment"),
                ("building", "Installing dependencies and building"),
                ("starting", "Starting portfolio server"),
                ("running", "Portfolio is live and accessible"),
            ]
            
            for i, (status, description) in enumerate(statuses, 1):
                live_logger.step(description)
                yield sse_service.create_progress_message(
                    status, i * 25, description
                ).to_sse_format()
                
                await asyncio.sleep(2)  # Simulate processing time
                live_logger.step_complete(description)
            
            # Send final status
            result = {
                "sandbox_id": sandbox_id,
                "status": "running",
                "preview_url": f"https://sandbox.cv2web.com/{sandbox_id}",
                "created_at": datetime.now().isoformat(),
                "expires_at": datetime.now().isoformat()  # TODO: Add actual expiration
            }
            
            yield sse_service.create_complete_message(result).to_sse_format()
            
            # Keep monitoring until disconnect
            while True:
                if await request.is_disconnected():
                    logger.info(f"Client disconnected from sandbox status stream: {connection_id}")
                    break
                await asyncio.sleep(5)  # Check every 5 seconds
                
        except asyncio.CancelledError:
            logger.info(f"Sandbox status SSE stream cancelled: {connection_id}")
        except Exception as e:
            logger.error(f"Error in sandbox status SSE stream: {e}")
            error_msg = sse_service.create_error_message(
                f"Sandbox monitoring failed: {str(e)}",
                "SANDBOX_MONITORING_ERROR"
            )
            yield error_msg.to_sse_format()
        finally:
            logger.info(f"Sandbox status SSE stream ended: {connection_id}")

    return StreamingResponse(
        sandbox_status_generator(),
        media_type="text/event-stream",
        headers=SSE_HEADERS
    )


@router.get("/heartbeat")
async def sse_heartbeat():
    """
    Simple SSE heartbeat endpoint for testing connections
    """
    connection_id = f"heartbeat-{uuid.uuid4().hex[:8]}"
    
    async def heartbeat_generator():
        count = 0
        while count < 10:  # Send 10 heartbeats then close
            heartbeat_msg = sse_service.create_heartbeat_message()
            yield heartbeat_msg.to_sse_format()
            await asyncio.sleep(2)
            count += 1
        
        # Send completion
        complete_msg = sse_service.create_complete_message({
            "message": "Heartbeat test completed",
            "total_beats": count
        })
        yield complete_msg.to_sse_format()

    return StreamingResponse(
        heartbeat_generator(),
        media_type="text/event-stream",
        headers=SSE_HEADERS
    )


@router.get("/test-error-handling")
async def test_error_handling():
    """
    Test endpoint for demonstrating error handling and sentinel events
    """
    connection_id = f"error-test-{uuid.uuid4().hex[:8]}"
    
    async def error_test_generator():
        try:
            # Step 1: Normal operation
            yield sse_service.create_step_message("normal_operation", 1, 4).to_sse_format()
            await asyncio.sleep(1)
            
            # Step 2: Warning
            yield sse_service.create_warning_message(
                "This is a test warning", 
                {"warning_type": "test"}
            ).to_sse_format()
            await asyncio.sleep(1)
            
            # Step 3: Non-critical error
            yield sse_service.create_error_message(
                "This is a non-critical test error",
                "TEST_ERROR",
                is_critical=False,
                recovery_suggestion="This is just a test, no action needed"
            ).to_sse_format()
            await asyncio.sleep(1)
            
            # Step 4: Critical error with sentinel
            yield sse_service.create_error_message(
                "This is a critical test error",
                "CRITICAL_TEST_ERROR",
                is_critical=True,
                recovery_suggestion="Connection will be closed"
            ).to_sse_format()
            
            # Send critical error sentinel
            yield sse_service.create_critical_error_sentinel(
                "Critical error demonstration - closing connection",
                "DEMO_CRITICAL_ERROR"
            ).to_sse_format()
            
        except Exception as e:
            # This should not happen in our test, but demonstrate error handling
            yield sse_service.create_error_message(
                f"Unexpected error in test: {str(e)}",
                "UNEXPECTED_ERROR",
                is_critical=True
            ).to_sse_format()

    return StreamingResponse(
        error_test_generator(),
        media_type="text/event-stream",
        headers=SSE_HEADERS
    )


@router.get("/test-timeout/{duration}")
async def test_timeout(duration: int):
    """
    Test endpoint for demonstrating timeout handling
    Args:
        duration: Duration in seconds before timeout
    """
    connection_id = f"timeout-test-{uuid.uuid4().hex[:8]}"
    
    async def timeout_test_generator():
        # Use enhanced stream generator with timeout
        async for message in sse_service.stream_generator(
            connection_id, 
            max_duration=duration,
            enable_timeout_protection=True
        ):
            yield message

    return StreamingResponse(
        timeout_test_generator(),
        media_type="text/event-stream",
        headers=SSE_HEADERS
    )


@router.get("/rate-limit-status")
async def get_rate_limit_status(
    auth_info: dict = Depends(get_current_user_for_sse)
):
    """
    Get current rate limit status for the authenticated user
    """
    user_id = auth_info["user_id"]
    user_limits = rate_limiter.get_user_limits_info(user_id)
    global_stats = rate_limiter.get_global_stats()
    
    return {
        "user_limits": user_limits,
        "global_stats": global_stats,
        "timestamp": datetime.now().isoformat()
    }


@router.get("/admin/rate-limit-stats")
async def get_admin_rate_limit_stats(
    admin_user: str = Depends(require_admin)
):
    """
    Admin endpoint to get comprehensive rate limiting statistics
    """
    
    global_stats = rate_limiter.get_global_stats()
    
    # Get stats for all active users
    active_user_stats = []
    for user_id, state in rate_limiter.user_states.items():
        if state.active_connections > 0 or state.is_blocked:
            active_user_stats.append(rate_limiter.get_user_limits_info(user_id))
    
    return {
        "global_stats": global_stats,
        "active_users": active_user_stats,
        "total_tracked_users": len(rate_limiter.user_states),
        "rate_limit_config": {
            "max_connections_per_user": rate_limiter.config.max_connections_per_user,
            "max_connections_global": rate_limiter.config.max_connections_global,
            "requests_per_minute": rate_limiter.config.requests_per_minute,
            "requests_per_hour": rate_limiter.config.requests_per_hour,
            "max_events_per_second": rate_limiter.config.max_events_per_second
        },
        "timestamp": datetime.now().isoformat()
    }