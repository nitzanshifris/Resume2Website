"""
Enhanced CV processing endpoint with real-time SSE logging
This shows how the new system integrates with actual CV processing
"""
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, BackgroundTasks
from fastapi.responses import StreamingResponse
from typing import Dict, Any, Optional
import uuid
from pathlib import Path
import logging
import asyncio
import aiofiles
import json

# Import our enhanced logging system
from src.utils.enhanced_sse_logger import EnhancedSSELogger, WorkflowPhase
from src.services.sse_service import sse_service

# Import existing services
from src.core.local.text_extractor import text_extractor
from src.core.cv_extraction.data_extractor import create_data_extractor
from src.core.schemas.unified_nullable import CVData
from src.api.schemas import UploadResponse
from src.api.routes.auth import get_current_user

import os
# Import config from project root
try:
    import config
except ImportError:
    # If running as a module, try relative import
    from ... import config

# Setup logging
logger = logging.getLogger(__name__)

# Create router
router = APIRouter(prefix="/api/v1/cv-enhanced", tags=["cv-enhanced"])

# Upload directory
BASE_DIR = Path(__file__).parent.parent.parent.parent  # Go up to project root
UPLOAD_DIR = BASE_DIR / "data" / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)  # Create parent directories if needed


@router.post("/upload", response_model=UploadResponse)
async def upload_cv_with_tracking(
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = BackgroundTasks(),
    current_user_id: str = Depends(get_current_user)
) -> UploadResponse:
    """
    Upload and process a CV file with real-time progress tracking.
    
    This endpoint demonstrates the integration of our enhanced logging system
    with actual CV processing.
    """
    job_id = str(uuid.uuid4())
    
    # Create enhanced logger for this job
    sse_logger = EnhancedSSELogger(
        name="cv_extraction",
        workflow_id=job_id,
        connection_id=job_id,
        custom_tags={
            "user_id": str(current_user_id),
            "file_name": file.filename,
        }
    )
    
    try:
        # === VALIDATION PHASE ===
        sse_logger.start_phase(WorkflowPhase.VALIDATION, expected_steps=4)
        
        # Step 1: Read file
        sse_logger.step("Reading uploaded file")
        file_content = await asyncio.wait_for(file.read(), timeout=config.UPLOAD_TIMEOUT)
        sse_logger.step_complete(f"File read successfully ({len(file_content)} bytes)")
        
        # Step 2: Validate file size
        sse_logger.step("Validating file size")
        if not file_content:
            raise HTTPException(status_code=400, detail="File is empty")
        
        if len(file_content) > config.MAX_UPLOAD_SIZE:
            raise HTTPException(
                status_code=413, 
                detail=f"File too large. Maximum size is {config.MAX_UPLOAD_SIZE / 1024 / 1024}MB"
            )
        sse_logger.step_complete(f"File size OK: {len(file_content) / 1024 / 1024:.2f}MB")
        
        # Step 3: Validate file type
        sse_logger.step("Checking file type")
        file_extension = Path(file.filename).suffix.lower()
        
        if file_extension not in config.ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid file type: {file_extension}"
            )
        sse_logger.step_complete(f"File type valid: {file_extension}")
        
        # Step 4: Save file
        sse_logger.step("Saving file to disk")
        file_path = UPLOAD_DIR / f"{job_id}{file_extension}"
        
        async with aiofiles.open(file_path, "wb") as f:
            await f.write(file_content)
        sse_logger.step_complete("File saved successfully")
        
        sse_logger.end_phase({"validation_status": "passed"})
        
        # === PROCESSING PHASE ===
        sse_logger.start_phase(WorkflowPhase.PROCESSING, expected_steps=4)
        
        # Step 1: Text extraction
        sse_logger.step("Extracting text from document")
        sse_logger.start_timer("text_extraction")
        
        image_extensions = {'.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif', '.tiff', '.tif', '.bmp'}
        needs_ocr = file_extension in image_extensions
        
        if needs_ocr:
            sse_logger.info("Using OCR for image file")
        
        text = text_extractor.extract_text(str(file_path))
        
        extraction_time = sse_logger.end_timer("text_extraction")
        sse_logger.step_complete(f"Extracted {len(text)} characters in {extraction_time:.2f}s")
        
        # Step 2: AI data extraction
        sse_logger.step("Analyzing CV with AI (Claude Opus)")
        sse_logger.start_timer("ai_extraction")
        sse_logger.set_gauge("text_length", len(text))
        
        # Create new extractor instance for this request
        extractor = create_data_extractor()
        cv_data = await extractor.extract_cv_data(text)
        
        ai_time = sse_logger.end_timer("ai_extraction")
        
        # Count extracted sections
        sections_found = len([f for f in cv_data.model_dump_nullable() if cv_data.model_dump_nullable()[f]])
        sse_logger.increment_counter("sections_found", sections_found)
        
        sse_logger.step_complete(f"AI extraction complete in {ai_time:.2f}s - Found {sections_found} sections")
        
        # Step 3: Data validation
        sse_logger.step("Validating extracted data")
        
        # Check key fields - using the new CV data structure
        validation_score = 0
        cv_dict = cv_data.model_dump_nullable()
        
        if cv_dict.get('hero') and cv_dict['hero'].get('fullName'):
            validation_score += 0.3
            sse_logger.info(f"✓ Name found: {cv_dict['hero']['fullName']}")
        if cv_dict.get('experience') and cv_dict['experience'].get('experienceItems') and len(cv_dict['experience']['experienceItems']) > 0:
            validation_score += 0.3
            sse_logger.info(f"✓ {len(cv_dict['experience']['experienceItems'])} work experiences found")
        if cv_dict.get('education') and cv_dict['education'].get('educationItems') and len(cv_dict['education']['educationItems']) > 0:
            validation_score += 0.2
            sse_logger.info(f"✓ {len(cv_dict['education']['educationItems'])} education entries found")
        if cv_dict.get('skills') and cv_dict['skills'].get('skillCategories') and len(cv_dict['skills']['skillCategories']) > 0:
            validation_score += 0.2
            sse_logger.info(f"✓ {len(cv_dict['skills']['skillCategories'])} skill categories found")
        
        sse_logger.set_gauge("validation_score", validation_score)
        sse_logger.step_complete(f"Data validation score: {validation_score * 100:.0f}%")
        
        # Step 4: Cleanup
        sse_logger.step("Cleaning up temporary files")
        try:
            if file_path.exists():
                file_path.unlink()
            sse_logger.step_complete("Cleanup complete")
        except Exception as e:
            sse_logger.warning(f"Cleanup failed: {e}")
        
        sse_logger.end_phase({"extraction_quality": validation_score})
        
        # === FINALIZATION ===
        sse_logger.finalize_workflow()
        
        # Get workflow summary
        summary = sse_logger.get_workflow_summary()
        
        logger.info(f"Job {job_id} completed in {summary['total_duration']:.2f}s")
        
        return UploadResponse(
            message=f"CV processed successfully in {summary['total_duration']:.2f}s. Found {sections_found} sections.",
            job_id=job_id
        )
        
    except Exception as e:
        sse_logger.error(f"Processing failed: {str(e)}", e)
        sse_logger.finalize_workflow()
        
        # Clean up file if it exists
        if 'file_path' in locals() and file_path.exists():
            file_path.unlink()
        
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail="Processing failed")


@router.get("/stream/{job_id}")
async def stream_job_progress(job_id: str):
    """
    Stream real-time progress updates for a CV processing job.
    
    Connect to this endpoint with EventSource to receive updates.
    """
    async def event_generator():
        """Generate SSE events for this job"""
        # Send initial connection message
        yield f"data: {json.dumps({'type': 'connected', 'job_id': job_id})}\n\n"
        
        # In a real implementation, this would connect to the actual job's SSE stream
        # For demo purposes, we'll send some sample events
        for i in range(5):
            await asyncio.sleep(1)
            event = {
                "type": "progress",
                "step": f"Processing step {i+1}",
                "progress": (i + 1) * 20
            }
            yield f"data: {json.dumps(event)}\n\n"
        
        # Send completion
        yield f"data: {json.dumps({'type': 'complete', 'job_id': job_id})}\n\n"
    
    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )


@router.get("/test-with-sample")
async def test_with_sample_cv(
    background_tasks: BackgroundTasks,
    current_user_id: str = Depends(get_current_user)
):
    """
    Test the enhanced CV processing with a sample CV from our data/cv_examples directory.
    This demonstrates real-time tracking without needing to upload a file.
    """
    # Use a sample CV from our test data
    sample_cv_path = BASE_DIR / "data" / "cv_examples" / "pdf_examples" / "simple_pdf" / "software-engineer-resume-example.pdf"
    
    if not sample_cv_path.exists():
        raise HTTPException(status_code=404, detail="Sample CV not found")
    
    job_id = str(uuid.uuid4())
    
    # Create a fake upload file object
    class FakeUploadFile:
        filename = sample_cv_path.name
        
        async def read(self):
            async with aiofiles.open(sample_cv_path, 'rb') as f:
                return await f.read()
    
    # Process using our enhanced endpoint
    fake_file = FakeUploadFile()
    
    # Run the processing
    result = await upload_cv_with_tracking(
        file=fake_file,
        background_tasks=background_tasks,
        current_user_id=current_user_id
    )
    
    return {
        "message": "Test completed successfully!",
        "result": result,
        "sample_file": sample_cv_path.name,
        "stream_url": f"/api/v1/cv-enhanced/stream/{result.job_id}"
    }