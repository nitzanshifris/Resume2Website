"""
CV processing endpoints - MVP version
"""
# ========== IMPORTS ==========
from fastapi import APIRouter, UploadFile, File, HTTPException, Header, Form, Depends
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
from dotenv import load_dotenv  # For loading .env file
from passlib.context import CryptContext  # For secure password hashing
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
import config

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
    create_session,
    get_user_id_from_session,
    cleanup_old_sessions as db_cleanup_old_sessions,
    create_cv_upload,
    get_user_cv_uploads,
    update_cv_upload_status,
    # Caching functions
    get_cached_extraction,
    cache_extraction_result,
    get_extraction_stats
)

# Initialize database on startup
init_db()

# ========== Service Imports ==========
from src.core.local.text_extractor import text_extractor
from src.core.cv_extraction.data_extractor import data_extractor
from src.core.schemas.unified_nullable import CVData
from src.utils.enhanced_sse_logger import EnhancedSSELogger, WorkflowPhase
from src.api.schemas import UserCreate, UserLogin, SessionResponse, UploadResponse, CleanupResponse

# Import authentication dependency
from src.api.routes.auth import get_current_user

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


# ========== AUTHENTICATION ENDPOINTS ==========

@router.post("/register", response_model=SessionResponse)
async def register(user_data: UserCreate) -> SessionResponse:
    """
    Register a new user.
    
    Args:
        user_data: User registration data (email and password)
    
    Returns:
        SessionResponse with session_id and user_id
    """
    # Check if email already exists and create user
    try:
        user_id = create_user(user_data.email, hash_password(user_data.password), user_data.name)
    except ValueError:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create session
    session_id = create_session(user_id)
    
    logger.info(f"New user registered: {user_data.email}")
    
    return SessionResponse(
        message="Registration successful",
        session_id=session_id,
        user_id=user_id,
        user={
            "id": user_id,
            "email": user_data.email,
            "name": user_data.name
        }
    )


@router.post("/login", response_model=SessionResponse)
async def login(user_data: UserLogin) -> SessionResponse:
    """
    Login existing user.
    
    Args:
        user_data: User login credentials
        
    Returns:
        SessionResponse with session_id for authenticated requests
    """
    # Find user by email
    user_db = get_user_by_email(user_data.email)
    
    # Verify credentials
    if not user_db or not verify_password(user_data.password, user_db["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Create new session
    session_id = create_session(user_db["user_id"])
    
    logger.info(f"User logged in: {user_data.email}")
    
    return SessionResponse(
        message="Login successful",
        session_id=session_id,
        user_id=user_db["user_id"],
        user={
            "id": user_db["user_id"],
            "email": user_db["email"],
            "name": user_db.get("name", "")
        }
    )


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

    # === 2. FILE VALIDATION ===
    # Add timeout protection
    import asyncio
    try:
        file_content = await asyncio.wait_for(file.read(), timeout=config.UPLOAD_TIMEOUT)
    except asyncio.TimeoutError:
        raise HTTPException(status_code=408, detail="File upload timed out. Please check your connection and try again.")
    if not file_content:
        raise HTTPException(status_code=400, detail="File is empty")

    # Check file size
    if len(file_content) > config.MAX_UPLOAD_SIZE:
        raise HTTPException(
            status_code=413, 
            detail=f"File too large. Maximum size is {config.MAX_UPLOAD_SIZE / 1024 / 1024}MB"
        )
    
    # === 2.5 CALCULATE FILE HASH FOR CACHING ===
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

    # Check file extension
    file_extension = Path(file.filename).suffix.lower()
    
    if file_extension not in config.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid file type: {file_extension}. Allowed types: {', '.join(sorted(config.ALLOWED_EXTENSIONS))}"
        )

    # === 3. FILE STORAGE ===
    job_id = str(uuid.uuid4())
    file_extension = Path(file.filename).suffix.lower()
    
    # Security check against path traversal
    if '..' in file.filename or '/' in file_extension or '\\' in file_extension:
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
            cv_data = await data_extractor.extract_cv_data(text)
            sections_count = len([f for f in cv_data.model_dump_nullable() if cv_data.model_dump_nullable()[f]])
            logger.info(f"✅ Successfully extracted CV data with {sections_count} sections")
            
            # Calculate confidence score
            confidence_score = data_extractor.calculate_extraction_confidence(cv_data, text)
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
        return UploadResponse(
            message="CV uploaded successfully. Building your portfolio website...",
            job_id=job_id
        )
        
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
    
    return {
        "cvs": uploads,
        "count": len(uploads)
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
async def get_cv_data(job_id: str, current_user_id: str = Depends(get_current_user)):
    """
    Get CV data for a specific job ID.
    
    Args:
        job_id: The job ID of the CV upload
        current_user_id: Automatically injected by FastAPI
        
    Returns:
        CV data in structured format
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
    
    # Construct file path
    BASE_DIR = Path(__file__).parent.parent.parent.parent  # Go up to project root
    file_extension = cv_upload['file_type'].lower()
    file_path = BASE_DIR / "data" / "uploads" / f"{job_id}{file_extension}"
    
    # Check if file exists
    if not file_path.exists():
        logger.error(f"File not found: {file_path}")
        raise HTTPException(status_code=404, detail="Original file not found")
    
    # Determine MIME type based on file extension
    mime_type_map = {
        '.pdf': 'application/pdf',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.txt': 'text/plain',
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
    
    media_type = mime_type_map.get(file_extension, 'application/octet-stream')
    
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