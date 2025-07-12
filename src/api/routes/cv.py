"""
CV processing endpoints - MVP version
"""
# ========== IMPORTS ==========
from fastapi import APIRouter, UploadFile, File, HTTPException, Header, Form, Depends
from pydantic import BaseModel, HttpUrl, EmailStr
from typing import Dict, Any, Optional, List
import uuid
from pathlib import Path
import logging
from datetime import datetime, timedelta
import aiofiles
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
    cleanup_old_sessions as db_cleanup_old_sessions
)

# Initialize database on startup
init_db()

# ========== Service Imports ==========
from src.core.local.text_extractor import text_extractor
from src.core.cv_extraction.data_extractor import data_extractor
from src.core.schemas.unified import CVData
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
        user_id = create_user(user_data.email, hash_password(user_data.password))
    except ValueError:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create session
    session_id = create_session(user_id)
    
    logger.info(f"New user registered: {user_data.email}")
    
    return SessionResponse(
        message="Registration successful",
        session_id=session_id,
        user_id=user_id
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
        user_id=user_db["user_id"]
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
    BASE_DIR = Path(__file__).parent.parent.parent  # Go up to project root
    upload_dir = BASE_DIR / "data" / "uploads"
    upload_dir.mkdir(exist_ok=True)
    
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

    # === 4. CV PROCESSING ===
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
        
        # Extract structured data from text
        logger.info(f"Extracting structured data from {len(text)} characters of text")
        try:
            cv_data = await data_extractor.extract_cv_data(text)
            logger.info(f"Successfully extracted CV data with {len([f for f in cv_data.model_dump() if cv_data.model_dump()[f]])} sections")
            
            # TODO: Save cv_data to database for job_id
            # TODO: Trigger website generation
            
        except Exception as e:
            logger.error(f"Failed to extract CV data: {e}")
            # Continue anyway - we can still return job_id
        
        # === 5. CLEANUP ===
        # Delete uploaded file after processing (we have the extracted data)
        try:
            if file_path.exists():
                file_path.unlink()
                logger.info(f"Cleaned up uploaded file: {file_path}")
        except Exception as e:
            logger.warning(f"Failed to cleanup file {file_path}: {e}")
            # Non-critical error, continue
        
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