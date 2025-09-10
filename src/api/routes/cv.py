"""
CV processing endpoints - MVP version
"""
# ========== IMPORTS ==========
from fastapi import APIRouter, UploadFile, File, HTTPException, Header, Form, Depends, Request
from fastapi.responses import FileResponse
from pydantic import BaseModel, HttpUrl, EmailStr
from typing import Dict, Any, Optional, List
import uuid
from pathlib import Path
import logging
from datetime import datetime, timedelta
import aiofiles
import hashlib  # For file hash calculation
import os  # For environment variables
import re  # For filename validation
from dotenv import load_dotenv  # For loading .env file
from passlib.context import CryptContext  # For secure password hashing
# Import config from project root
try:
    import config
except ImportError:
    # If running as a module, try relative import
    from ... import config

# ========== CONFIGURATION ==========
# Load environment variables from .env file
load_dotenv()

# Setup logging
logger = logging.getLogger(__name__)

# Check environment
IS_DEVELOPMENT = os.getenv("ENV", "development") == "development"
logger.info(f"Running in {'DEVELOPMENT' if IS_DEVELOPMENT else 'PRODUCTION'} mode")

# Create router
router = APIRouter()

# ========== DATABASE IMPORTS ==========
from src.api.db import (
    init_db,
    create_user,
    get_user_by_email,
    get_user_by_id,
    update_user_profile,
    create_session,
    get_user_id_from_session,
    cleanup_old_sessions as db_cleanup_old_sessions,
    create_cv_upload,
    get_user_cv_uploads,
    update_cv_upload_status,
    transfer_cv_ownership,  # Add the new function
    # Caching functions
    get_cached_extraction,
    cache_extraction_result,
    get_extraction_stats
)

# Initialize database on startup
init_db()

# ========== Service Imports ==========
from src.core.local.text_extractor import text_extractor
from src.core.cv_extraction.data_extractor import create_data_extractor
from src.core.schemas.unified_nullable import CVData
from src.utils.enhanced_sse_logger import EnhancedSSELogger, WorkflowPhase
from src.api.schemas import UserCreate, UserLogin, SessionResponse, UploadResponse, CleanupResponse, UserProfileUpdate

# Import authentication dependency
from src.api.routes.auth import get_current_user, get_current_user_optional

# Import file validation
from src.utils.file_validator import validate_uploaded_file, sanitize_filename, generate_safe_filename

# Import Resume Gate validator
from src.utils.cv_resume_gate import is_likely_resume, get_rejection_reason

# Import settings for Resume Gate configuration
from src.core.settings import settings

# ========== PASSWORD HASHING ==========
# Initialize password context with bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ========== HELPER FUNCTIONS ==========

def hash_password(password: str) -> str:
    """
    Hash password using bcrypt.
    Secure and industry-standard, even for MVP.
    """
    return pwd_context.hash(password)


def verify_password(password: str, hashed: str) -> bool:
    """Verify password against bcrypt hash"""
    return pwd_context.verify(password, hashed)


def validate_filename(filename: str) -> bool:
    """
    Validate that a filename is safe to use.
    
    Checks for:
    - Empty filenames  
    - Path traversal attempts (.., /, \\)
    - Invalid characters
    
    Args:
        filename: The filename to validate
        
    Returns:
        bool: True if safe, False otherwise
    """
    if not filename or not filename.strip():
        return False
    
    # Check for path traversal patterns
    dangerous_patterns = ['..', '/', '\\']
    for pattern in dangerous_patterns:
        if pattern in filename:
            logger.warning(f"Filename validation failed: '{pattern}' in '{filename}'")
            return False
    
    # Allow most characters except control characters and path separators
    # This includes letters, numbers, spaces, and common punctuation like ()[]{}+-=,._
    # Explicitly exclude: / \ : * ? " < > | and control characters (0x00-0x1F, 0x7F)
    if re.search(r'[/\\:*?"<>|\x00-\x1F\x7F]', filename):
        logger.warning(f"Filename validation failed: invalid character in '{filename}'")
        return False
    
    # Check reasonable length (most filesystems limit to 255)
    if len(filename) > 255:
        return False
    
    return True


def get_file_extension(filename: str) -> str:
    """
    Safely extract file extension from filename.
    
    Handles edge cases:
    - Empty or None filename returns empty string
    - No extension returns empty string  
    - Multiple dots (e.g., 'file.min.js' -> '.js')
    - Always returns lowercase
    - Preserves the dot (e.g., '.pdf' not 'pdf')
    
    Args:
        filename: The filename to extract extension from
        
    Returns:
        str: Lowercase extension with dot (e.g., '.pdf') or empty string
        
    Examples:
        >>> get_file_extension("resume.pdf")
        '.pdf'
        >>> get_file_extension("resume.PDF")
        '.pdf'
        >>> get_file_extension("my.resume.docx")
        '.docx'
        >>> get_file_extension("no_extension")
        ''
        >>> get_file_extension("")
        ''
        >>> get_file_extension(None)
        ''
    """
    if not filename:
        return ""
    
    # Convert to string in case we get a Path object
    filename = str(filename)
    
    # Use Path for robust extraction
    extension = Path(filename).suffix.lower()
    
    # Path.suffix returns empty string for no extension, which is what we want
    return extension


def get_mime_type(file_extension: str) -> str:
    """
    Get MIME type for a file extension.
    
    Args:
        file_extension: File extension with or without dot (e.g., '.pdf' or 'pdf')
        
    Returns:
        str: MIME type (e.g., 'application/pdf') or 'application/octet-stream' for unknown
        
    Examples:
        >>> get_mime_type('.pdf')
        'application/pdf'
        >>> get_mime_type('pdf')
        'application/pdf'
        >>> get_mime_type('.PDF')
        'application/pdf'
        >>> get_mime_type('.xyz')
        'application/octet-stream'
        >>> get_mime_type('')
        'application/octet-stream'
    """
    # Handle empty input
    if not file_extension:
        return 'application/octet-stream'
    
    # Normalize extension (ensure it has a dot and is lowercase)
    ext = file_extension.lower()
    if not ext.startswith('.'):
        ext = '.' + ext
    
    # Comprehensive MIME type mapping for all supported file types
    mime_map = {
        # Documents
        '.pdf': 'application/pdf',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.txt': 'text/plain',
        '.rtf': 'application/rtf',
        '.odt': 'application/vnd.oasis.opendocument.text',
        
        # Web formats
        '.html': 'text/html',
        '.htm': 'text/html',
        '.md': 'text/markdown',
        
        # Images
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.webp': 'image/webp',
        '.heic': 'image/heic',
        '.heif': 'image/heif',
        '.tiff': 'image/tiff',
        '.tif': 'image/tiff',
        '.bmp': 'image/bmp'
    }
    
    return mime_map.get(ext, 'application/octet-stream')


# ========== AUTHENTICATION ENDPOINTS ==========
# 
# IMPORTANT: Authentication routes have been moved to user_auth.py to avoid conflicts.
# 
# The following routes are now available in user_auth.py:
# - POST /api/v1/auth/register          -> User registration with email/password
# - POST /api/v1/auth/login             -> User login with email/password
# - POST /api/v1/auth/logout            -> User logout (session invalidation)
# - GET  /api/v1/auth/me                -> Get current user info
# - POST /api/v1/auth/google/callback   -> Google OAuth callback handler
# - POST /api/v1/auth/linkedin/callback -> LinkedIn OAuth callback handler
# - GET  /api/v1/auth/google/status     -> Check Google OAuth configuration
# 
# This separation ensures clean route organization and prevents duplicate endpoint conflicts.
# CV processing functionality remains in this file, while all authentication logic
# is centralized in the dedicated user_auth.py module.
#


# ========== MAIN CV PROCESSING ENDPOINT ==========

@router.post("/upload", response_model=UploadResponse)
async def upload_cv(
    file: UploadFile = File(...),
    current_user_id: str = Depends(get_current_user)
) -> UploadResponse:
    """
    Upload and process a CV file.
    
    Authentication handled by Depends(get_current_user).
    
    Args:
        file: The CV file (PDF, DOCX, TXT, images, etc.)
        current_user_id: Automatically injected by FastAPI
        
    Returns:
        Job details including job_id
    """
    # === 1. USER IS ALREADY AUTHENTICATED ===
    logger.info(f"User {current_user_id} uploading file: {file.filename}")
    
    # === 1.5 CLEANUP OLD PORTFOLIOS AND CVS ===
    # When a user uploads a new CV, delete their old portfolios
    try:
        from src.api.routes.portfolio_generator import PORTFOLIO_PROCESSES, cleanup_portfolio
        
        # Find and delete all portfolios for this user
        portfolios_to_delete = []
        for portfolio_id, info in PORTFOLIO_PROCESSES.items():
            if info.get('user_id') == current_user_id:
                portfolios_to_delete.append(portfolio_id)
        
        for portfolio_id in portfolios_to_delete:
            logger.info(f"Deleting old portfolio {portfolio_id} for user {current_user_id}")
            try:
                cleanup_portfolio(portfolio_id)
                if portfolio_id in PORTFOLIO_PROCESSES:
                    del PORTFOLIO_PROCESSES[portfolio_id]
            except Exception as e:
                logger.warning(f"Failed to cleanup portfolio {portfolio_id}: {e}")
        
        if portfolios_to_delete:
            logger.info(f"Cleaned up {len(portfolios_to_delete)} old portfolios for user {current_user_id}")
    except ImportError:
        # If portfolio_generator is not available, continue anyway
        logger.warning("Could not import portfolio cleanup functions, skipping portfolio cleanup")
    except Exception as e:
        logger.warning(f"Error during portfolio cleanup: {e}")
        # Don't fail the upload if cleanup fails
    
    # === 2. FILE VALIDATION (MUST BE DONE BEFORE CV LIMIT CHECK) ===
    # Add timeout protection
    import asyncio
    try:
        file_content = await asyncio.wait_for(file.read(), timeout=config.UPLOAD_TIMEOUT)
    except asyncio.TimeoutError:
        raise HTTPException(status_code=408, detail="File upload timed out. Please check your connection and try again.")
    if not file_content:
        raise HTTPException(status_code=400, detail="File is empty")
    
    # === 1.6 CHECK AND ENFORCE CV LIMIT (MAX 10 PER USER) ===
    from src.api.db import get_user_cv_count, enforce_cv_limit
    
    current_cv_count = get_user_cv_count(current_user_id)
    logger.info(f"User {current_user_id} currently has {current_cv_count} CVs")
    
    # If user has 10 or more CVs, enforce the limit (delete oldest ones)
    deleted_cvs = []
    if current_cv_count >= 10:
        logger.info(f"User {current_user_id} has {current_cv_count} CVs (limit: 10), enforcing limit...")
        # This will delete ALL excess CVs to bring the count down to 9 (leaving room for the new one)
        deleted_cvs = enforce_cv_limit(current_user_id, max_cvs=9)  # Keep 9 so new upload makes it 10
        if deleted_cvs:
            logger.info(f"Deleted {len(deleted_cvs)} old CVs to enforce limit:")
            for cv in deleted_cvs:
                logger.info(f"  - {cv['filename']} (uploaded: {cv['upload_date']})")
        else:
            logger.warning(f"No CVs were deleted despite user having {current_cv_count} CVs")

    # Validate file content with magic bytes checking
    is_valid, error_msg, mime_type = validate_uploaded_file(
        file_content,
        file.filename,
        max_size=config.MAX_UPLOAD_SIZE
    )
    
    if not is_valid:
        logger.warning(f"File validation failed for user {current_user_id}: {error_msg}")
        raise HTTPException(status_code=400, detail=error_msg)
    
    logger.info(f"File validated successfully: {mime_type}")
    
    # Sanitize filename for security
    safe_filename = sanitize_filename(file.filename)
    
    # === 2.5 GET FILE EXTENSION ===
    file_extension = get_file_extension(file.filename)
    
    # === 2.6 RESUME GATE VALIDATION ===
    if settings.cv_strict_cv_validation:
        # Extract text for Resume Gate validation
        import tempfile
        import os
        try:
            # Save to temporary file for text extraction
            with tempfile.NamedTemporaryFile(suffix=file_extension, delete=False) as tmp_file:
                tmp_file.write(file_content)
                tmp_file_path = tmp_file.name
            
            try:
                # Extract text from the temporary file
                extracted_text = text_extractor.extract_text(tmp_file_path)
                # Limit text for performance
                gate_text = extracted_text[:settings.cv_gate_max_chars] if extracted_text else ""
            finally:
                # Clean up temporary file
                if os.path.exists(tmp_file_path):
                    os.unlink(tmp_file_path)
            
            # Check if this is an image file
            is_image_file = mime_type and mime_type.startswith('image/')
            
            # Check if content is likely a resume
            is_resume, score, signals = is_likely_resume(
                gate_text, 
                threshold=settings.cv_min_resume_score,
                max_chars=settings.cv_gate_max_chars,
                is_image=is_image_file
            )
            
            if not is_resume:
                reason = get_rejection_reason(signals)
                from src.utils.cv_resume_gate import get_suggestion_for_rejection
                suggestion = get_suggestion_for_rejection(signals)
                error_response = {
                    "error": "Please upload a valid resume/CV file",
                    "score": score,
                    "reason": reason,
                    "suggestion": suggestion
                }
                
                # Include signals in debug mode
                if settings.debug:
                    error_response["signals"] = signals
                
                logger.warning(f"Resume Gate rejected file from user {current_user_id}: score={score}, reason={reason}")
                raise HTTPException(status_code=400, detail=error_response)
            
            logger.info(f"Resume Gate passed: score={score}")
            
        except HTTPException:
            raise  # Re-raise validation failures
        except Exception as e:
            logger.error(f"Resume Gate validation error: {e}")
            # Don't block on Resume Gate errors - continue processing
            logger.warning("Resume Gate check failed, continuing with upload")
    
    # === 2.6 CALCULATE FILE HASH FOR CACHING ===
    file_hash = hashlib.sha256(file_content).hexdigest()
    logger.info(f"File hash calculated: {file_hash[:8]}...")
    
    # Check if we have cached extraction result
    cached_result = get_cached_extraction(file_hash)
    if cached_result:
        logger.info(f"🎯 CACHE HIT! Using cached extraction for file hash {file_hash[:8]} (accessed {cached_result['access_count']} times)")
        
        # Create new job_id but use cached CV data
        job_id = str(uuid.uuid4())
        upload_id = create_cv_upload(
            user_id=current_user_id,
            job_id=job_id,
            filename=file.filename,
            file_type=file_extension,
            file_hash=file_hash
        )
        
        # Update status with cached data
        update_cv_upload_status(job_id, 'completed', cached_result['cv_data'])
        
        # Still save the file for display purposes
        BASE_DIR = Path(__file__).parent.parent.parent.parent
        upload_dir = BASE_DIR / "data" / "uploads"
        upload_dir.mkdir(parents=True, exist_ok=True)
        file_path = upload_dir / f"{job_id}{file_extension}"
        
        try:
            async with aiofiles.open(file_path, "wb") as f:
                await f.write(file_content)
            logger.info(f"File saved for display: {file_path}")
        except Exception as e:
            logger.warning(f"Failed to save cached file for display: {e}")
        
        return UploadResponse(
            message=f"CV processed instantly (cached result, confidence: {cached_result.get('confidence_score', 'N/A')})",
            job_id=job_id
        )

    # Check file extension against allowed types
    if file_extension not in config.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid file type: {file_extension}. Allowed types: {', '.join(sorted(config.ALLOWED_EXTENSIONS))}"
        )

    # === 3. FILE STORAGE ===
    job_id = str(uuid.uuid4())
    
    # Security check against path traversal
    if not validate_filename(file.filename):
        raise HTTPException(status_code=400, detail="Invalid filename")
    
    # Create uploads directory with absolute path
    BASE_DIR = Path(__file__).parent.parent.parent.parent  # Go up to project root (4 levels: cv.py -> routes -> api -> src -> root)
    upload_dir = BASE_DIR / "data" / "uploads"
    upload_dir.mkdir(parents=True, exist_ok=True)
    
    # Save with unique name
    file_path = upload_dir / f"{job_id}{file_extension}"
    
    try:
        # TODO: For large files, consider streaming instead of loading all in memory
        # TODO: Add cleanup job to remove old files after processing
        # TODO: Consider moving to cloud storage (S3) for production
        async with aiofiles.open(file_path, "wb") as f:
            await f.write(file_content)
        logger.info(f"File saved: {file_path}")
    except Exception as e:
        logger.error(f"Failed to save file: {e}")
        raise HTTPException(status_code=500, detail="Failed to save file")

    # === 4. CREATE DATABASE RECORD ===
    upload_id = create_cv_upload(
        user_id=current_user_id,
        job_id=job_id,
        filename=file.filename,
        file_type=file_extension,
        file_hash=file_hash
    )
    logger.info(f"Created CV upload record: {upload_id}")

    # === 5. CV PROCESSING ===
    try:
        # Determine if OCR is needed based on file extension
        image_extensions = {'.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif', '.tiff', '.tif', '.bmp'}
        needs_ocr = file_extension in image_extensions
        
        if needs_ocr:
            logger.info(f"Image file detected, will use OCR for: {file.filename}")
            text = text_extractor.extract_text(str(file_path))
        else:
            logger.info(f"Document file detected, using text extractor for: {file.filename}")
            text = text_extractor.extract_text(str(file_path))
        
        # Extract structured data from text using Claude 4 Opus
        logger.info(f"🤖 Extracting structured data using Claude 4 Opus from {len(text)} characters of text")
        try:
            # Create new extractor instance for this request
            extractor = create_data_extractor()
            cv_data = await extractor.extract_cv_data(text)
            
            if not cv_data:
                logger.error("❌ CV data extraction returned None")
                update_cv_upload_status(job_id, 'failed')
                # Return success with job_id even if extraction failed
                return UploadResponse(
                    status="success",
                    message="File uploaded but CV extraction failed. Please try again.",
                    job_id=job_id
                )
            
            sections_count = len([f for f in cv_data.model_dump_nullable() if cv_data.model_dump_nullable()[f]])
            logger.info(f"✅ Successfully extracted CV data with {sections_count} sections")
            
            # Calculate confidence score
            confidence_score = extractor.calculate_extraction_confidence(cv_data, text)
            logger.info(f"📊 Extraction confidence score: {confidence_score:.2f}")
            
            # Save CV data to database
            import json
            cv_data_json = json.dumps(cv_data.model_dump_nullable())
            update_cv_upload_status(job_id, 'completed', cv_data_json)
            
            # Cache extraction result if confidence is high enough
            if confidence_score >= 0.75:  # Only cache high-confidence extractions
                cache_success = cache_extraction_result(
                    file_hash=file_hash,
                    cv_data=cv_data_json,
                    extraction_model=config.PRIMARY_MODEL,  # claude-4-opus
                    temperature=config.EXTRACTION_TEMPERATURE,  # 0.0
                    confidence_score=confidence_score
                )
                if cache_success:
                    logger.info(f"💾 High-confidence extraction cached for future use (score: {confidence_score:.2f})")
                else:
                    logger.warning("❌ Failed to cache extraction result")
            else:
                logger.info(f"⚠️ Low confidence score ({confidence_score:.2f}) - not caching result")
            
        except Exception as e:
            logger.error(f"Failed to extract CV data: {e}")
            import traceback
            logger.error(f"Full traceback:\n{traceback.format_exc()}")
            # Mark as failed but still return job_id
            update_cv_upload_status(job_id, 'failed')
        
        # === 5. KEEP ORIGINAL FILE ===
        # Keep the original file for display purposes
        logger.info(f"Keeping original file: {file_path}")
        
        # Log internal details for debugging
        logger.info(f"Job {job_id} created for user {current_user_id}")
        logger.info(f"File: {file.filename} ({len(file_content)} bytes)")
        logger.info(f"Extension: {file_extension}, Needs OCR: {needs_ocr}")
        logger.debug(f"Saved to: {file_path}")
        
        # Simple response for the user
        response = UploadResponse(
            message="CV uploaded successfully. Building your portfolio website...",
            job_id=job_id
        )
        
        # Add info about deleted CVs if applicable
        if deleted_cvs:
            response.deleted_cvs = deleted_cvs
            # Also support legacy single deleted_cv field for backwards compatibility
            if len(deleted_cvs) == 1:
                response.deleted_cv = deleted_cvs[0]
        
        return response
        
    except Exception as e:
        logger.error(f"Processing failed for job {job_id}: {e}")  # פרטים מלאים בלוג
        
        # Clean up file if it exists
        if file_path.exists():
            file_path.unlink()
            
        raise HTTPException(status_code=500, detail="Processing failed. Please try again later")  # הודעה כללית למשתמש


# ========== MAINTENANCE ENDPOINTS ==========

@router.get("/my-cvs")
async def get_my_cvs(current_user_id: str = Depends(get_current_user)):
    """
    Get all CV uploads for the current user.
    
    Returns:
        List of CV upload records with status
    """
    uploads = get_user_cv_uploads(current_user_id)
    logger.info(f"User {current_user_id} has {len(uploads)} CV uploads")
    
    # Calculate how many CVs will be deleted on next upload
    cvs_to_delete_info = []
    if len(uploads) >= 10:
        # Calculate how many need to be deleted to make room for a new one
        num_to_delete = len(uploads) - 9  # Keep 9 to make room for 1 new upload
        # The last items in the list are the oldest (since we order by DESC)
        cvs_to_delete = uploads[-num_to_delete:] if num_to_delete > 0 else []
        cvs_to_delete_info = [
            {
                "filename": cv["filename"],
                "upload_date": cv["upload_date"],
                "job_id": cv["job_id"]
            }
            for cv in cvs_to_delete
        ]
    
    return {
        "cvs": uploads,
        "count": len(uploads),
        "max_cvs": 10,
        "at_limit": len(uploads) >= 10,
        "over_limit": len(uploads) > 10,
        "cvs_to_delete_on_next_upload": cvs_to_delete_info,
        "num_to_delete": len(cvs_to_delete_info)
    }


@router.get("/extraction-stats")
async def get_extraction_statistics(current_user_id: str = Depends(get_current_user)):
    """
    Get extraction quality and caching statistics.
    Shows performance metrics for Claude 4 Opus extraction system.
    """
    try:
        stats = get_extraction_stats()
        
        # Add real-time metrics
        stats['extraction_model'] = config.PRIMARY_MODEL
        stats['extraction_temperature'] = config.EXTRACTION_TEMPERATURE
        stats['cache_threshold'] = 0.75
        
        return {
            "status": "success",
            "stats": stats,
            "message": f"Claude 4 Opus deterministic extraction statistics"
        }
        
    except Exception as e:
        logger.error(f"Failed to get extraction stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve extraction statistics")


@router.delete("/cleanup", response_model=CleanupResponse)
async def cleanup_old_sessions() -> CleanupResponse:
    """
    Delete sessions older than 7 days.
    Helps keep the database clean and improves security.
    
    In production: Run this as a scheduled job, not an endpoint.
    """
    # Only allow in development
    if not IS_DEVELOPMENT:
        raise HTTPException(status_code=403, detail="Cleanup only available in development mode")
    
    try:
        deleted_count = db_cleanup_old_sessions(days=7)
        logger.info(f"Cleaned up {deleted_count} old sessions")
        
        cutoff = (datetime.now() - timedelta(days=7)).isoformat()
        
        return CleanupResponse(
            status="success",
            deleted_sessions=deleted_count,
            cutoff_date=cutoff
        )
    except Exception as e:
        logger.error(f"Cleanup failed: {e}")
        raise HTTPException(status_code=500, detail="Cleanup failed")


@router.get("/cv/{job_id}")
async def get_cv_data(job_id: str, current_user_id: Optional[str] = Depends(get_current_user_optional)):
    """
    Get CV data for a specific job ID.
    
    Args:
        job_id: The job ID of the CV upload
        current_user_id: Optional user ID
        
    Returns:
        CV data in structured format
    """
    # Query database directly to be more lenient
    from src.api.db import get_db_connection
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT job_id, filename, file_type, status, cv_data, user_id, upload_date FROM cv_uploads WHERE job_id = ?",
            (job_id,)
        )
        result = cursor.fetchone()
        
        if not result:
            raise HTTPException(status_code=404, detail="CV not found")
        
        cv_upload = dict(result)
    finally:
        conn.close()
    
    # Parse and return CV data
    if cv_upload.get('cv_data'):
        try:
            import json
            cv_data = json.loads(cv_upload['cv_data'])
            return {
                "job_id": job_id,
                "cv_data": cv_data,
                "status": cv_upload.get('status', 'unknown'),
                "filename": cv_upload.get('filename', ''),
                "upload_date": cv_upload.get('upload_date', '')
            }
        except json.JSONDecodeError:
            logger.error(f"Failed to parse CV data for job {job_id}")
            raise HTTPException(status_code=500, detail="Invalid CV data format")
    else:
        raise HTTPException(status_code=404, detail="CV data not available")


@router.put("/cv/{job_id}")
async def update_cv_data(
    job_id: str, 
    cv_data: CVData,
    current_user_id: str = Depends(get_current_user)
):
    """
    Update CV data for a specific job ID.
    
    Args:
        job_id: The job ID of the CV upload
        cv_data: Updated CV data
        current_user_id: Automatically injected by FastAPI
        
    Returns:
        Success message
    """
    # Get user's CV uploads to verify ownership
    uploads = get_user_cv_uploads(current_user_id)
    
    # Verify ownership
    cv_upload = None
    for upload in uploads:
        if upload['job_id'] == job_id:
            cv_upload = upload
            break
    
    if not cv_upload:
        raise HTTPException(status_code=404, detail="CV not found")
    
    # Update CV data
    try:
        import json
        cv_data_json = json.dumps(cv_data.model_dump_nullable())
        update_cv_upload_status(job_id, 'completed', cv_data_json)
        
        logger.info(f"Updated CV data for job {job_id} by user {current_user_id}")
        
        return {
            "message": "CV data updated successfully",
            "job_id": job_id
        }
    except Exception as e:
        logger.error(f"Failed to update CV data for job {job_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to update CV data")


@router.get("/download/{job_id}")
async def download_cv(job_id: str, current_user_id: str = Depends(get_current_user)):
    """
    Download the original CV file for a specific job ID.
    Supports both download and inline preview based on file type.
    
    Args:
        job_id: The job ID of the CV upload
        current_user_id: Automatically injected by FastAPI
        
    Returns:
        The original uploaded file with appropriate headers for preview/download
    """
    # Get user's CV uploads to verify ownership
    uploads = get_user_cv_uploads(current_user_id)
    
    # Find the specific upload
    cv_upload = None
    for upload in uploads:
        if upload['job_id'] == job_id:
            cv_upload = upload
            break
    
    if not cv_upload:
        raise HTTPException(status_code=404, detail="CV not found")
    
    # Construct file path using same logic as extraction endpoint
    BASE_DIR = Path(__file__).parent.parent.parent.parent  # Go up to project root
    file_extension = cv_upload['file_type'].lower() if cv_upload.get('file_type') else ''
    
    # First check if this is a multi-file upload
    multi_file_dir = BASE_DIR / "data" / "uploads" / job_id
    if multi_file_dir.exists() and multi_file_dir.is_dir():
        # This is a multi-file upload, return the first file for preview
        files = sorted(multi_file_dir.glob("*"))
        if files:
            file_path = files[0]  # Return first file
        else:
            raise HTTPException(status_code=404, detail="No files found in upload")
    else:
        # Single file upload - use glob to find file anywhere in uploads directory
        # This handles both direct uploads and anonymous->authenticated transfers
        import glob
        file_pattern = str(BASE_DIR / "data" / "uploads" / "**" / f"{job_id}*")
        matching_files = glob.glob(file_pattern, recursive=True)
        if matching_files:
            file_path = Path(matching_files[0])
            logger.info(f"Found file using glob pattern: {file_path}")
        else:
            # Fallback to old path construction
            file_path = BASE_DIR / "data" / "uploads" / f"{job_id}{file_extension}"
    
    # Check if file exists
    if not file_path.exists():
        logger.error(f"File not found: {file_path}")
        raise HTTPException(status_code=404, detail="Original file not found")
    
    # Determine MIME type based on file extension
    media_type = get_mime_type(file_extension)
    
    # Return the file with proper headers for inline display
    return FileResponse(
        path=str(file_path),
        filename=cv_upload['filename'],
        media_type=media_type,
        headers={
            "Content-Disposition": f"inline; filename=\"{cv_upload['filename']}\"",
            "Cache-Control": "public, max-age=3600",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "X-Session-ID"
        }
    )


@router.post("/extract/{job_id}")
async def extract_cv_data_endpoint(
    job_id: str,
    current_user_id: Optional[str] = Depends(get_current_user_optional)
) -> Dict[str, Any]:
    """
    Extract CV data from an uploaded file.
    Supports both authenticated and anonymous users.
    
    Args:
        job_id: The job ID from the upload
        current_user_id: Optional user ID if authenticated
        
    Returns:
        Extraction status and result
    """
    try:
        logger.info(f"Extract CV endpoint called for job_id: {job_id}, user: {current_user_id}")
        
        # Get CV upload record - be more lenient with ownership checks
        cv_upload = None
        
        # First, try to get the CV by job_id directly from database
        from src.api.db import get_db_connection
        conn = get_db_connection()
        try:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT job_id, filename, file_type, status, cv_data, user_id, file_hash FROM cv_uploads WHERE job_id = ?",
                (job_id,)
            )
            result = cursor.fetchone()
            
            if not result:
                logger.error(f"CV upload not found for job_id: {job_id}")
                # Try to debug - list recent uploads
                cursor.execute("SELECT job_id, upload_id FROM cv_uploads ORDER BY ROWID DESC LIMIT 5")
                recent = cursor.fetchall()
                logger.error(f"Recent uploads: {[dict(r) for r in recent]}")
                raise HTTPException(status_code=404, detail="CV upload not found")
            
            cv_upload = dict(result)
            
            # STRICT OWNERSHIP ENFORCEMENT
            upload_user_id = cv_upload.get('user_id')
            
            # If the CV belongs to an anonymous user and current user is authenticated
            if upload_user_id and upload_user_id.startswith("anonymous_"):
                if current_user_id and not current_user_id.startswith("anonymous_"):
                    # Authenticated user trying to extract anonymous CV - MUST claim first
                    logger.error(f"❌ User {current_user_id} trying to extract anonymous CV {job_id} without claiming it first")
                    raise HTTPException(
                        status_code=403, 
                        detail="Anonymous CV must be claimed before extraction. Call /api/v1/cv/claim first."
                    )
            
            # If CV belongs to a specific user, only that user can extract
            elif upload_user_id and upload_user_id != current_user_id:
                logger.error(f"❌ User {current_user_id} trying to access CV owned by {upload_user_id}")
                raise HTTPException(
                    status_code=403,
                    detail="You don't have permission to access this CV"
                )
        finally:
            conn.close()
        
        # If we need the file path, construct it
        if cv_upload and not cv_upload.get('file_path'):
            import glob
            BASE_DIR = Path(__file__).parent.parent.parent.parent
            file_pattern = str(BASE_DIR / "data" / "uploads" / "**" / f"{job_id}*")
            matching_files = glob.glob(file_pattern, recursive=True)
            if matching_files:
                cv_upload['file_path'] = matching_files[0]
        
        # Check if already extracted
        if cv_upload['status'] == 'completed' and cv_upload.get('cv_data'):
            import json
            return {
                "status": "completed",
                "cv_data": json.loads(cv_upload['cv_data'])
            }
        
        # Extract text from file
        file_path = cv_upload.get('file_path')
        if not file_path:
            # Construct file path if not in cv_upload
            BASE_DIR = Path(__file__).parent.parent.parent.parent
            file_extension = cv_upload['file_type'].lower() if cv_upload.get('file_type') else ''
            
            # Try multiple file path patterns
            possible_paths = [
                # Standard pattern for authenticated users
                str(BASE_DIR / "data" / "uploads" / f"{job_id}{file_extension}"),
                # Anonymous pattern with glob search
                str(BASE_DIR / "data" / "uploads" / "**" / f"{job_id}_*{file_extension}")
            ]
            
            for pattern in possible_paths:
                if '*' in pattern:
                    # Use glob for wildcard patterns
                    import glob
                    matches = glob.glob(pattern, recursive=True)
                    if matches:
                        file_path = matches[0]
                        logger.info(f"Found file using glob pattern: {file_path}")
                        break
                elif os.path.exists(pattern):
                    file_path = pattern
                    logger.info(f"Found file at: {file_path}")
                    break
            else:
                # If still not found, log available files for debugging
                import glob
                all_files = glob.glob(str(BASE_DIR / "data" / "uploads" / "**" / "*"), recursive=True)
                job_files = [f for f in all_files if job_id in f]
                logger.error(f"File not found for job {job_id}. Files containing job_id: {job_files}")
                raise HTTPException(status_code=404, detail="File not found")
        
        # Verify file exists after all the path resolution
        if not os.path.exists(file_path):
            logger.error(f"Resolved file path does not exist: {file_path}")
            raise HTTPException(status_code=404, detail="File not found after path resolution")
        
        logger.info(f"Processing file for extraction: {file_path}")
        
        # Update status to processing
        update_cv_upload_status(job_id, 'processing')
        
        # Extract text
        text = text_extractor.extract_text(str(file_path))
        
        if not text or len(text.strip()) < 10:
            update_cv_upload_status(job_id, 'failed')
            raise HTTPException(status_code=400, detail="No text content found in file")
        
        # Extract structured data using Claude 4 Opus
        logger.info(f"🤖 Extracting CV data for job {job_id} using Claude 4 Opus from {len(text)} characters of text")
        # Create new extractor instance for this request
        extractor = create_data_extractor()
        cv_data = await extractor.extract_cv_data(text)
        
        if not cv_data:
            logger.error("❌ CV data extraction returned None")
            update_cv_upload_status(job_id, 'failed')
            raise HTTPException(status_code=500, detail="Failed to extract CV data")
        
        sections_count = len([f for f in cv_data.model_dump_nullable() if cv_data.model_dump_nullable()[f]])
        logger.info(f"✅ Successfully extracted CV data with {sections_count} sections")
        
        # Calculate confidence score
        confidence_score = extractor.calculate_extraction_confidence(cv_data, text)
        logger.info(f"📊 Extraction confidence score: {confidence_score:.2f}")
        
        # Save CV data to database
        import json
        cv_data_json = json.dumps(cv_data.model_dump_nullable())
        update_cv_upload_status(job_id, 'completed', cv_data_json)
        
        # Get file hash for caching (if available)
        if cv_upload.get('file_hash'):
            file_hash = cv_upload['file_hash']
            # Cache extraction result if confidence is high enough
            if confidence_score >= 0.75:  # Only cache high-confidence extractions
                cache_success = cache_extraction_result(
                    file_hash=file_hash,
                    cv_data=cv_data_json,
                    extraction_model=config.PRIMARY_MODEL,  # claude-4-opus
                    temperature=config.EXTRACTION_TEMPERATURE,  # 0.0
                    confidence_score=confidence_score
                )
                if cache_success:
                    logger.info(f"💾 High-confidence extraction cached for future use (score: {confidence_score:.2f})")
                else:
                    logger.warning("❌ Failed to cache extraction result")
            else:
                logger.info(f"⚠️ Low confidence score ({confidence_score:.2f}) - not caching result")
        
        logger.info(f"✅ CV extraction completed for job {job_id}")
        
        return {
            "status": "completed",
            "cv_data": cv_data.model_dump_nullable(),
            "confidence_score": confidence_score
        }
            
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        logger.error(f"CV extraction error for job {job_id}: {e}")
        logger.error(f"Full traceback:\n{traceback.format_exc()}")
        update_cv_upload_status(job_id, 'failed')
        raise HTTPException(status_code=500, detail=f"Extraction failed: {str(e)}")

@router.post("/upload-anonymous", response_model=UploadResponse)
async def upload_cv_anonymous(
    request: Request,
    file: UploadFile = File(...),
    current_user_id: Optional[str] = Depends(get_current_user_optional)
) -> UploadResponse:
    """
    Upload and process a CV file anonymously (for demo purposes).
    
    Authentication is optional - allows anonymous users to try the service.
    Rate limited for anonymous users by IP address.
    
    Args:
        request: FastAPI request object for IP extraction
        file: The CV file (PDF, DOCX, TXT, images, etc.)
        current_user_id: Optional user ID if authenticated
        
    Returns:
        Job details including job_id
    """
    # Rate limiting for anonymous users
    if not current_user_id:
        # Get client IP address
        client_ip = request.client.host
        if request.headers.get("X-Forwarded-For"):
            # Handle proxy/load balancer
            client_ip = request.headers.get("X-Forwarded-For").split(",")[0].strip()
        
        # Import rate limiter
        from src.utils.upload_rate_limiter import upload_rate_limiter
        
        # Check rate limit
        allowed, reason = upload_rate_limiter.check_upload_allowed(client_ip)
        if not allowed:
            logger.warning(f"Rate limit exceeded for IP {client_ip}: {reason}")
            raise HTTPException(
                status_code=429,
                detail=reason,
                headers={"Retry-After": "3600"}  # Suggest retry after 1 hour
            )
        
        # Generate anonymous user ID
        current_user_id = f"anonymous_{uuid.uuid4().hex[:12]}"
        logger.info(f"Anonymous user from IP {client_ip} uploading file: {file.filename}")
        
        # Record the upload for rate limiting (will be done after successful validation)
    else:
        logger.info(f"Authenticated user {current_user_id} uploading file: {file.filename}")
    
    # === FILE VALIDATION ===
    # Add timeout protection
    import asyncio
    try:
        file_content = await asyncio.wait_for(file.read(), timeout=config.UPLOAD_TIMEOUT)
    except asyncio.TimeoutError:
        raise HTTPException(status_code=408, detail="File upload timed out. Please check your connection and try again.")
    
    if not file_content:
        raise HTTPException(status_code=400, detail="File is empty")
    
    # Validate file content with magic bytes checking
    is_valid, error_msg, mime_type = validate_uploaded_file(
        file_content,
        file.filename,
        max_size=config.MAX_UPLOAD_SIZE
    )
    
    if not is_valid:
        logger.warning(f"File validation failed for anonymous user: {error_msg}")
        raise HTTPException(status_code=400, detail=error_msg)
    
    logger.info(f"File validated successfully: {mime_type}")
    
    # Sanitize filename for security
    safe_filename = sanitize_filename(file.filename)
    
    # Get file extension
    file_extension = get_file_extension(safe_filename)
    
    # === RESUME GATE VALIDATION ===
    if settings.cv_strict_cv_validation:
        # Extract text for Resume Gate validation
        import tempfile
        import os
        try:
            # Save to temporary file for text extraction
            with tempfile.NamedTemporaryFile(suffix=file_extension, delete=False) as tmp_file:
                tmp_file.write(file_content)
                tmp_file_path = tmp_file.name
            
            try:
                # Extract text from the temporary file
                extracted_text = text_extractor.extract_text(tmp_file_path)
                # Limit text for performance
                gate_text = extracted_text[:settings.cv_gate_max_chars] if extracted_text else ""
            finally:
                # Clean up temporary file
                if os.path.exists(tmp_file_path):
                    os.unlink(tmp_file_path)
            
            # Check if this is an image file
            is_image_file = mime_type and mime_type.startswith('image/')
            
            # Check if content is likely a resume
            is_resume, score, signals = is_likely_resume(
                gate_text, 
                threshold=settings.cv_min_resume_score,
                max_chars=settings.cv_gate_max_chars,
                is_image=is_image_file
            )
            
            if not is_resume:
                reason = get_rejection_reason(signals)
                from src.utils.cv_resume_gate import get_suggestion_for_rejection
                suggestion = get_suggestion_for_rejection(signals)
                error_response = {
                    "error": "Please upload a valid resume/CV file",
                    "score": score,
                    "reason": reason,
                    "suggestion": suggestion
                }
                
                # Include signals in debug mode
                if settings.debug:
                    error_response["signals"] = signals
                
                logger.warning(f"Resume Gate rejected anonymous upload: score={score}, reason={reason}")
                raise HTTPException(status_code=400, detail=error_response)
            
            logger.info(f"Resume Gate passed for anonymous: score={score}")
            
        except HTTPException:
            raise  # Re-raise validation failures
        except Exception as e:
            logger.error(f"Resume Gate validation error: {e}")
            # Don't block on Resume Gate errors - continue processing
            logger.warning("Resume Gate check failed, continuing with upload")
    
    # === CALCULATE FILE HASH FOR CACHING ===
    import hashlib
    file_hash = hashlib.sha256(file_content).hexdigest()
    logger.info(f"File hash calculated: {file_hash[:8]}...")
    
    # Check if we have cached extraction result
    cached_result = get_cached_extraction(file_hash)
    if cached_result:
        logger.info(f"🎯 CACHE HIT! Using cached extraction for anonymous upload (hash {file_hash[:8]})")
        
        # Create new job_id but use cached CV data
        job_id = str(uuid.uuid4())
        upload_id = create_cv_upload(
            user_id=current_user_id,
            job_id=job_id,
            filename=file.filename,
            file_type=file_extension,
            file_hash=file_hash
        )
        
        # Update status with cached data
        update_cv_upload_status(job_id, 'completed', cached_result['cv_data'])
        
        # Still save the file for display purposes
        user_dir = os.path.join(config.UPLOAD_DIR, current_user_id)
        os.makedirs(user_dir, exist_ok=True)
        file_path = os.path.join(user_dir, f"{job_id}{file_extension}")
        
        with open(file_path, "wb") as f:
            f.write(file_content)
        logger.info(f"File saved for display: {file_path}")
        
        # Record successful upload for rate limiting (even cache hits count)
        if current_user_id.startswith("anonymous_") and 'client_ip' in locals():
            from src.utils.upload_rate_limiter import upload_rate_limiter
            upload_rate_limiter.record_upload(client_ip)
            logger.info(f"Recorded cached upload for IP {client_ip}")
        
        return UploadResponse(
            message=f"CV processed instantly (cached result)",
            job_id=job_id
        )
    
    # === CREATE JOB ID & SAVE FILE (NO CACHE HIT) ===
    job_id = str(uuid.uuid4())
    
    # Ensure user directory exists  
    user_dir = os.path.join(config.UPLOAD_DIR, current_user_id)
    os.makedirs(user_dir, exist_ok=True)
    
    # Build file path - use consistent naming scheme
    file_path = os.path.join(user_dir, f"{job_id}{file_extension}")
    
    # Save file
    with open(file_path, "wb") as f:
        f.write(file_content)
    
    logger.info(f"File saved for job {job_id}: {file_path}")
    
    # === CREATE CV UPLOAD RECORD ===
    create_cv_upload(
        user_id=current_user_id,
        job_id=job_id,
        filename=file.filename,
        file_type=file_extension,
        file_hash=file_hash
    )
    
    # === ANONYMOUS UPLOAD COMPLETE - NO EXTRACTION ===
    # The extraction will happen later via /extract/{job_id} after user signs up
    logger.info(f"✅ Anonymous file uploaded and validated successfully for job {job_id}")
    logger.info(f"📁 File saved, awaiting user signup for extraction")
    
    # Set status to 'uploaded' instead of 'completed' since no extraction happened yet
    update_cv_upload_status(job_id, 'uploaded')
    
    # === RECORD SUCCESSFUL UPLOAD FOR RATE LIMITING ===
    # Only record for anonymous users
    if current_user_id.startswith("anonymous_") and 'client_ip' in locals():
        from src.utils.upload_rate_limiter import upload_rate_limiter
        upload_rate_limiter.record_upload(client_ip)
        logger.info(f"Recorded successful upload for IP {client_ip}")
    
    # === RETURN SUCCESS ===
    return UploadResponse(
        message="CV uploaded successfully", 
        job_id=job_id
    )

@router.post("/upload-multiple", response_model=UploadResponse)
async def upload_multiple_files(
    files: List[UploadFile] = File(...),
    current_user_id: str = Depends(get_current_user)
) -> UploadResponse:
    """
    Upload multiple files to be processed as a single CV.
    Particularly useful for multi-page image CVs.
    
    Args:
        files: List of files (images, PDFs, etc.)
        current_user_id: Automatically injected by FastAPI
        
    Returns:
        Job details including job_id
    """
    logger.info(f"User {current_user_id} uploading {len(files)} files")
    
    # Validate all files first
    allowed_files = []
    total_size = 0
    
    for file in files:
        # Basic validation
        if not file.filename:
            continue
            
        # Read file content
        file_content = await file.read()
        file_size = len(file_content)
        total_size += file_size
        
        # Size check
        if total_size > config.MAX_UPLOAD_SIZE * 3:  # Allow 3x size for multiple files
            raise HTTPException(
                status_code=413,
                detail=f"Total file size exceeds limit of {config.MAX_UPLOAD_SIZE * 3 / 1024 / 1024:.1f}MB"
            )
        
        # Validate file content with magic bytes checking
        is_valid, error_msg, mime_type = validate_uploaded_file(
            file_content,
            file.filename,
            max_size=config.MAX_UPLOAD_SIZE * 3  # Per-file limit within total
        )
        
        if not is_valid:
            logger.warning(f"Skipping file {file.filename} - validation failed: {error_msg}")
            continue
        
        # Sanitize filename
        safe_filename = sanitize_filename(file.filename)
        file_extension = get_file_extension(safe_filename)
        
        allowed_files.append({
            'filename': safe_filename,
            'extension': file_extension,
            'content': file_content,
            'size': file_size,
            'mime_type': mime_type
        })
        
        # Reset file position
        await file.seek(0)
    
    if not allowed_files:
        raise HTTPException(status_code=400, detail="No valid files provided")
    
    # Generate single job ID for all files
    job_id = str(uuid.uuid4())
    
    # Create upload directory
    BASE_DIR = Path(__file__).parent.parent.parent.parent
    upload_dir = BASE_DIR / "data" / "uploads" / job_id
    upload_dir.mkdir(parents=True, exist_ok=True)
    
    # Save all files
    saved_files = []
    try:
        for idx, file_data in enumerate(allowed_files):
            # Save each file with index prefix
            file_path = upload_dir / f"{idx:02d}_{file_data['filename']}"
            async with aiofiles.open(file_path, "wb") as f:
                await f.write(file_data['content'])
            saved_files.append(str(file_path))
            logger.info(f"Saved file {idx + 1}/{len(allowed_files)}: {file_path}")
    except Exception as e:
        logger.error(f"Failed to save files: {e}")
        # Clean up on failure
        import shutil
        if upload_dir.exists():
            shutil.rmtree(upload_dir)
        raise HTTPException(status_code=500, detail="Failed to save uploaded files")
    
    # Create database record with actual filenames
    filenames = [f['filename'] for f in allowed_files]
    combined_filename = ", ".join(filenames) if len(filenames) <= 3 else f"{filenames[0]}, {filenames[1]} +{len(filenames)-2} more"
    
    # Determine primary file type based on first file
    primary_extension = allowed_files[0]['extension'] if allowed_files else '.multi'
    
    upload_id = create_cv_upload(
        user_id=current_user_id,
        job_id=job_id,
        filename=combined_filename,
        file_type=primary_extension,  # Use first file's extension
        file_hash=None  # No single hash for multiple files
    )
    
    # Process files asynchronously
    import asyncio
    asyncio.create_task(process_multiple_files(job_id, saved_files, current_user_id))
    
    return UploadResponse(
        message=f"Processing {len(allowed_files)} files as single CV",
        job_id=job_id
    )


async def process_multiple_files(job_id: str, file_paths: List[str], user_id: str):
    """
    Process multiple files as a single CV.
    Combines text from all files before extraction.
    """
    try:
        logger.info(f"Starting multi-file processing for job {job_id}")
        
        # Extract text from all files
        combined_text = ""
        for file_path in file_paths:
            try:
                text = text_extractor.extract_text(file_path)
                if text and text.strip():
                    combined_text += f"\n\n--- File: {Path(file_path).name} ---\n\n{text}"
            except Exception as e:
                logger.error(f"Failed to extract text from {file_path}: {e}")
        
        if not combined_text.strip():
            update_cv_upload_status(job_id, 'failed')
            return
        
        # Extract CV data from combined text
        logger.info(f"Extracting CV data from combined text ({len(combined_text)} chars)")
        # Create new extractor instance for this request
        extractor = create_data_extractor()
        cv_data = await extractor.extract_cv_data(combined_text)
        
        if cv_data:
            # Store extraction result
            import json
            cv_data_json = json.dumps(cv_data.model_dump_nullable())
            update_cv_upload_status(job_id, 'completed', cv_data_json)
            logger.info(f"✅ Multi-file CV extraction completed for job {job_id}")
        else:
            update_cv_upload_status(job_id, 'failed')
            logger.error(f"Failed to extract CV data for job {job_id}")
            
    except Exception as e:
        logger.error(f"Multi-file processing error for job {job_id}: {e}")
        update_cv_upload_status(job_id, 'failed')


@router.get("/download/{job_id}/all")
async def get_all_files(job_id: str, current_user_id: str = Depends(get_current_user)):
    """
    Get information about all files in a multi-file upload.
    
    Args:
        job_id: The job ID of the CV upload
        current_user_id: Automatically injected by FastAPI
        
    Returns:
        List of files with their details
    """
    # Get user's CV uploads to verify ownership
    uploads = get_user_cv_uploads(current_user_id)
    
    # Find the specific upload
    cv_upload = None
    for upload in uploads:
        if upload['job_id'] == job_id:
            cv_upload = upload
            break
    
    if not cv_upload:
        raise HTTPException(status_code=404, detail="CV not found")
    
    # Check if this is a multi-file upload
    BASE_DIR = Path(__file__).parent.parent.parent.parent
    multi_file_dir = BASE_DIR / "data" / "uploads" / job_id
    
    if multi_file_dir.exists() and multi_file_dir.is_dir():
        # Get all files in the directory
        files = []
        for file_path in sorted(multi_file_dir.glob("*")):
            files.append({
                "filename": file_path.name,
                "size": file_path.stat().st_size,
                "type": get_file_extension(file_path.name),
                "url": f"/api/v1/download/{job_id}/{file_path.name}"
            })
        
        return {
            "job_id": job_id,
            "is_multi_file": True,
            "files": files,
            "total_files": len(files)
        }
    else:
        # Single file upload
        return {
            "job_id": job_id,
            "is_multi_file": False,
            "files": [{
                "filename": cv_upload['filename'],
                "type": cv_upload['file_type'],
                "url": f"/api/v1/download/{job_id}"
            }],
            "total_files": 1
        }


@router.get("/download/{job_id}/{filename}")
async def download_specific_file(
    job_id: str, 
    filename: str, 
    current_user_id: str = Depends(get_current_user)
):
    """
    Download a specific file from a multi-file upload.
    
    Args:
        job_id: The job ID of the CV upload
        filename: The specific filename to download
        current_user_id: Automatically injected by FastAPI
        
    Returns:
        The requested file
    """
    # Get user's CV uploads to verify ownership
    uploads = get_user_cv_uploads(current_user_id)
    
    # Find the specific upload
    cv_upload = None
    for upload in uploads:
        if upload['job_id'] == job_id:
            cv_upload = upload
            break
    
    if not cv_upload:
        raise HTTPException(status_code=404, detail="CV not found")
    
    # Validate filename - prevent path traversal attempts
    if not validate_filename(filename):
        raise HTTPException(status_code=400, detail="Invalid filename")
    
    # Construct file path
    BASE_DIR = Path(__file__).parent.parent.parent.parent
    file_path = BASE_DIR / "data" / "uploads" / job_id / filename
    
    # Security check - ensure the file is within the job directory
    try:
        file_path = file_path.resolve()
        expected_dir = (BASE_DIR / "data" / "uploads" / job_id).resolve()
        if not str(file_path).startswith(str(expected_dir)):
            raise HTTPException(status_code=403, detail="Access denied")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid file path")
    
    # Check if file exists
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    # Determine MIME type based on file extension
    file_extension = get_file_extension(file_path.name)
    media_type = get_mime_type(file_extension)
    
    # Return the file
    return FileResponse(
        path=str(file_path),
        filename=filename,
        media_type=media_type,
        headers={
            "Content-Disposition": f"inline; filename=\"{filename}\"",
            "Cache-Control": "public, max-age=3600",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "X-Session-ID"
        }
    )


@router.get("/current-user-info")
async def get_current_user_info(current_user_id: str = Depends(get_current_user)):
    """
    Get current user information from registration data.
    
    Returns:
        User info with name and email from registration
    """
    from src.api.db import get_user_by_id
    
    logger.info(f"Getting user info for user_id: {current_user_id}")
    
    # Get user from database
    user_db = get_user_by_id(current_user_id)
    
    if not user_db:
        logger.error(f"User not found in database: {current_user_id}")
        raise HTTPException(status_code=404, detail="User not found")
    
    # Return user info from registration
    user_info = {
        "user_id": current_user_id,
        "name": user_db.get('name', ''),
        "email": user_db.get('email', '')
    }
    
    logger.info(f"Retrieved user info for {current_user_id}: name='{user_info['name']}', email='{user_info['email']}'")
    
    return user_info


@router.get("/profile")
async def get_user_profile(current_user_id: str = Depends(get_current_user)):
    """
    Get complete user profile information.
    
    Returns:
        Complete user profile with all fields
    """
    logger.info(f"Getting profile for user_id: {current_user_id}")
    
    # Get user from database
    user_db = get_user_by_id(current_user_id)
    
    if not user_db:
        logger.error(f"User not found in database: {current_user_id}")
        raise HTTPException(status_code=404, detail="User not found")
    
    # Return complete profile (excluding password)
    profile = {
        "user_id": current_user_id,
        "name": user_db.get('name', ''),
        "email": user_db.get('email', ''),
        "phone": user_db.get('phone', ''),
        "date_of_birth": user_db.get('date_of_birth', ''),
        "location": user_db.get('location', ''),
        "created_at": user_db.get('created_at', '')
    }
    
    logger.info(f"Retrieved profile for {current_user_id}")
    
    return profile


@router.put("/profile")
async def update_profile(
    profile_data: UserProfileUpdate,
    current_user_id: str = Depends(get_current_user)
):
    """
    Update user profile information.
    
    Args:
        profile_data: Updated profile data
        current_user_id: Automatically injected by FastAPI
        
    Returns:
        Success message and updated profile
    """
    logger.info(f"Updating profile for user_id: {current_user_id}")
    
    # Update profile in database
    success = update_user_profile(
        user_id=current_user_id,
        name=profile_data.name,
        phone=profile_data.phone,
        date_of_birth=profile_data.date_of_birth,
        location=profile_data.location
    )
    
    if not success:
        logger.error(f"Failed to update profile for user {current_user_id}")
        raise HTTPException(status_code=500, detail="Failed to update profile")
    
    # Get updated profile
    user_db = get_user_by_id(current_user_id)
    updated_profile = {
        "user_id": current_user_id,
        "name": user_db.get('name', ''),
        "email": user_db.get('email', ''),
        "phone": user_db.get('phone', ''),
        "date_of_birth": user_db.get('date_of_birth', ''),
        "location": user_db.get('location', ''),
        "created_at": user_db.get('created_at', '')
    }
    
    logger.info(f"Successfully updated profile for {current_user_id}")
    
    return {
        "message": "Profile updated successfully",
        "profile": updated_profile
    }


# ========== CV OWNERSHIP TRANSFER ==========

class ClaimRequest(BaseModel):
    """Request body for claiming an anonymous CV"""
    job_id: str


@router.post("/claim")
async def claim_anonymous_cv(
    request: ClaimRequest,
    current_user_id: str = Depends(get_current_user)
):
    """
    Transfer ownership of an anonymous CV to the authenticated user.
    This is used when an anonymous user signs up and needs to claim their uploaded CV.
    
    Args:
        request: Contains the job_id of the CV to claim
        current_user_id: Authenticated user's ID (injected by dependency)
        
    Returns:
        Success status and transfer details
    """
    logger.info(f"🔄 User {current_user_id} attempting to claim CV with job_id: {request.job_id}")
    
    # Transfer ownership in the database
    result = transfer_cv_ownership(request.job_id, current_user_id)
    
    if result["success"]:
        if result.get("already_owned"):
            logger.info(f"✅ CV {request.job_id} already owned by user {current_user_id}")
            return {
                "status": "success",
                "message": "CV already owned by user",
                "job_id": request.job_id,
                "already_owned": True
            }
        else:
            logger.info(f"✅ Successfully transferred CV {request.job_id} from {result['previous_owner']} to {current_user_id}")
            return {
                "status": "success", 
                "message": "CV ownership transferred successfully",
                "job_id": request.job_id,
                "previous_owner": result["previous_owner"],
                "new_owner": current_user_id
            }
    else:
        error_code = result.get("code", "UNKNOWN")
        error_message = result.get("error", "Failed to transfer CV ownership")
        
        if error_code == "NOT_FOUND":
            logger.warning(f"❌ CV not found for job_id: {request.job_id}")
            raise HTTPException(status_code=404, detail="CV not found")
        elif error_code == "FORBIDDEN":
            logger.warning(f"❌ CV {request.job_id} owned by another user, cannot transfer to {current_user_id}")
            raise HTTPException(status_code=403, detail="CV is owned by another user")
        else:
            logger.error(f"❌ Failed to transfer CV {request.job_id}: {error_message}")
            raise HTTPException(status_code=500, detail=error_message)