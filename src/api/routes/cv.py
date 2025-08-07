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
import re  # For filename validation
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
    get_user_by_id,
    update_user_profile,
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
from src.api.schemas import UserCreate, UserLogin, SessionResponse, UploadResponse, CleanupResponse, UserProfileUpdate

# Import authentication dependency
from src.api.routes.auth import get_current_user, get_current_user_optional

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
    
    # Only allow safe characters (alphanumeric, dash, underscore, dot, space)
    if not re.match(r'^[a-zA-Z0-9_\-\. ]+$', filename):
        return False
    
    # Check reasonable length (most filesystems limit to 255)
    if len(filename) > 255:
        return False
    
    return True


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
        user_id = create_user(user_data.email, hash_password(user_data.password), user_data.name, user_data.phone)
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


@router.post("/auth/google/callback", response_model=SessionResponse)
async def google_oauth_callback(request: Dict[str, Any]) -> SessionResponse:
    """
    Handle Google OAuth callback.
    
    Args:
        request: Contains 'code' and 'redirect_uri' from Google OAuth
        
    Returns:
        SessionResponse with session_id and user_id
    """
    try:
        import requests
        import json
        
        code = request.get('code')
        redirect_uri = request.get('redirect_uri')
        
        if not code:
            raise HTTPException(status_code=400, detail="Authorization code missing")
        
        # Exchange code for tokens
        google_client_id = os.getenv('GOOGLE_CLIENT_ID')
        google_client_secret = os.getenv('GOOGLE_CLIENT_SECRET')
        
        if not google_client_id:
            logger.error("GOOGLE_CLIENT_ID not configured.")
            raise HTTPException(
                status_code=500, 
                detail="Google OAuth Client ID is missing. Please configure GOOGLE_CLIENT_ID environment variable."
            )
        
        if not google_client_secret or google_client_secret == 'YOUR_GOOGLE_CLIENT_SECRET_HERE':
            logger.error("GOOGLE_CLIENT_SECRET not configured properly.")
            raise HTTPException(
                status_code=500, 
                detail="Google OAuth Client Secret is missing. Please get the secret from Google Cloud Console and update the GOOGLE_CLIENT_SECRET environment variable."
            )
        
        # Get tokens from Google
        token_response = requests.post('https://oauth2.googleapis.com/token', data={
            'client_id': google_client_id,
            'client_secret': google_client_secret,
            'code': code,
            'grant_type': 'authorization_code',
            'redirect_uri': redirect_uri
        })
        
        if not token_response.ok:
            logger.error(f"Google token exchange failed: {token_response.text}")
            raise HTTPException(status_code=400, detail="Failed to exchange authorization code")
        
        tokens = token_response.json()
        access_token = tokens.get('access_token')
        
        if not access_token:
            raise HTTPException(status_code=400, detail="No access token received")
        
        # Get user info from Google
        user_response = requests.get(
            'https://www.googleapis.com/oauth2/v2/userinfo',
            headers={'Authorization': f'Bearer {access_token}'}
        )
        
        if not user_response.ok:
            logger.error(f"Google user info failed: {user_response.text}")
            raise HTTPException(status_code=400, detail="Failed to get user information")
        
        user_info = user_response.json()
        email = user_info.get('email')
        name = user_info.get('name', '')
        
        if not email:
            raise HTTPException(status_code=400, detail="Email not provided by Google")
        
        # Check if user exists
        existing_user = get_user_by_email(email)
        
        if existing_user:
            # User exists - log them in
            user_id = existing_user["user_id"]
            session_id = create_session(user_id)
            
            logger.info(f"Google OAuth login for existing user: {email}")
            
            return SessionResponse(
                message="Welcome back! Logged in successfully with Google.",
                session_id=session_id,
                user_id=user_id,
                user={
                    "id": user_id,
                    "email": email,
                    "name": existing_user.get("name", name)
                }
            )
        else:
            # User doesn't exist - create new account
            # For OAuth users, we'll generate a random password since they won't use it
            import secrets
            random_password = secrets.token_urlsafe(32)
            
            user_id = create_user(email, hash_password(random_password), name)
            session_id = create_session(user_id)
            
            logger.info(f"Google OAuth registration for new user: {email}")
            
            return SessionResponse(
                message="Welcome to CV2WEB! Account created successfully with Google.",
                session_id=session_id,
                user_id=user_id,
                user={
                    "id": user_id,
                    "email": email,
                    "name": name
                }
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Google OAuth callback error: {e}")
        raise HTTPException(status_code=500, detail="Authentication failed. Please try again.")


@router.get("/auth/google/status")
async def google_oauth_status():
    """
    Check if Google OAuth is configured and available
    """
    google_client_id = os.getenv('GOOGLE_CLIENT_ID')
    google_client_secret = os.getenv('GOOGLE_CLIENT_SECRET')
    
    has_client_id = bool(google_client_id)
    has_client_secret = bool(google_client_secret and google_client_secret != 'YOUR_GOOGLE_CLIENT_SECRET_HERE')
    is_available = has_client_id and has_client_secret
    
    status_details = {
        "available": is_available,
        "client_id_configured": has_client_id,
        "client_secret_configured": has_client_secret
    }
    
    if is_available:
        status_details["message"] = "Google OAuth is fully configured"
    elif has_client_id and not has_client_secret:
        status_details["message"] = "Google OAuth Client Secret missing. Please get it from Google Cloud Console."
    elif not has_client_id:
        status_details["message"] = "Google OAuth Client ID missing"
    else:
        status_details["message"] = "Google OAuth is not configured"
    
    return status_details


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
    
    # === 2.5 GET FILE EXTENSION ===
    file_extension = Path(file.filename).suffix.lower()
    
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
            cv_data = await data_extractor.extract_cv_data(text)
            
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
    
    # Check if this is a multi-file upload
    multi_file_dir = BASE_DIR / "data" / "uploads" / job_id
    if multi_file_dir.exists() and multi_file_dir.is_dir():
        # This is a multi-file upload, return the first file for preview
        files = sorted(multi_file_dir.glob("*"))
        if files:
            file_path = files[0]  # Return first file
        else:
            raise HTTPException(status_code=404, detail="No files found in upload")
    else:
        # Single file upload
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


@router.post("/cv/extract/{job_id}")
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
        # Get CV upload record based on user authentication status
        cv_upload = None
        if current_user_id and not current_user_id.startswith("anonymous_"):
            # For authenticated users, get their uploads and verify ownership
            uploads = get_user_cv_uploads(current_user_id)
            for upload in uploads:
                if upload['job_id'] == job_id:
                    cv_upload = upload
                    break
            if not cv_upload:
                raise HTTPException(status_code=404, detail="CV upload not found")
        else:
            # For anonymous users, check database by job_id directly
            from src.api.db import get_db_connection
            conn = get_db_connection()
            try:
                cursor = conn.cursor()
                cursor.execute(
                    "SELECT job_id, filename, file_type, status, cv_data FROM cv_uploads WHERE job_id = ?",
                    (job_id,)
                )
                result = cursor.fetchone()
                
                if not result:
                    raise HTTPException(status_code=404, detail="CV upload not found")
                
                cv_upload = dict(result)
                
                # If we need the file path, construct it
                if not cv_upload.get('file_path'):
                    import glob
                    BASE_DIR = Path(__file__).parent.parent.parent.parent
                    file_pattern = str(BASE_DIR / "data" / "uploads" / "**" / f"{job_id}*")
                    matching_files = glob.glob(file_pattern, recursive=True)
                    if matching_files:
                        cv_upload['file_path'] = matching_files[0]
            finally:
                conn.close()
        
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
            file_extension = cv_upload['file_type'].lower()
            
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
        logger.info(f"🤖 Extracting CV data for job {job_id} using Claude 4 Opus")
        cv_data = await data_extractor.extract_cv_data(text)
        
        if cv_data:
            # Store extraction result
            import json
            cv_data_json = json.dumps(cv_data.model_dump_nullable())
            update_cv_upload_status(job_id, 'completed', cv_data_json)
            
            return {
                "status": "completed",
                "cv_data": cv_data.model_dump_nullable()
            }
        else:
            update_cv_upload_status(job_id, 'failed')
            raise HTTPException(status_code=500, detail="Failed to extract CV data")
            
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
    file: UploadFile = File(...),
    current_user_id: Optional[str] = Depends(get_current_user_optional)
) -> UploadResponse:
    """
    Upload and process a CV file anonymously (for demo purposes).
    
    Authentication is optional - allows anonymous users to try the service.
    
    Args:
        file: The CV file (PDF, DOCX, TXT, images, etc.)
        current_user_id: Optional user ID if authenticated
        
    Returns:
        Job details including job_id
    """
    # Generate anonymous user ID if not authenticated
    if not current_user_id:
        current_user_id = f"anonymous_{uuid.uuid4().hex[:12]}"
        logger.info(f"Anonymous user uploading file: {file.filename}")
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
    
    # Check file size
    if len(file_content) > config.MAX_UPLOAD_SIZE:
        raise HTTPException(
            status_code=413, 
            detail=f"File too large. Maximum size is {config.MAX_UPLOAD_SIZE / 1024 / 1024:.0f}MB"
        )
    
    # Check file type
    file_extension = Path(file.filename).suffix.lower()
    if file_extension not in config.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400, 
            detail=f"File type {file_extension} not supported. Allowed types: {', '.join(config.ALLOWED_EXTENSIONS)}"
        )
    
    # === CREATE JOB ID & SAVE FILE ===
    job_id = str(uuid.uuid4())
    
    # Ensure user directory exists
    user_dir = os.path.join(config.UPLOAD_DIR, current_user_id)
    os.makedirs(user_dir, exist_ok=True)
    
    # Build file path
    file_path = os.path.join(user_dir, f"{job_id}_{file.filename}")
    
    # Save file
    with open(file_path, "wb") as f:
        f.write(file_content)
    
    logger.info(f"File saved for job {job_id}: {file_path}")
    
    # Calculate file hash for caching
    import hashlib
    file_hash = hashlib.sha256(file_content).hexdigest()
    
    # === CREATE CV UPLOAD RECORD ===
    create_cv_upload(
        user_id=current_user_id,
        job_id=job_id,
        filename=file.filename,
        file_type=file_extension,
        file_hash=file_hash
    )
    
    # === CV PROCESSING (SAME AS REGULAR UPLOAD) ===
    try:
        # Extract text from file
        text = text_extractor.extract_text(file_path)
        
        if not text or len(text.strip()) < 10:
            # Update status to failed
            update_cv_upload_status(job_id, 'failed')
            raise HTTPException(status_code=400, detail="File appears to be empty or unreadable")
        
        # Extract structured data from text using Claude 4 Opus
        logger.info(f"🤖 Extracting structured data using Claude 4 Opus from {len(text)} characters of text")
        try:
            cv_data = await data_extractor.extract_cv_data(text)
            
            if not cv_data:
                logger.error("❌ CV data extraction returned None")
                update_cv_upload_status(job_id, 'failed')
                # Return success with job_id even if extraction failed
                return UploadResponse(
                    message="File uploaded but CV extraction failed. Please try again.",
                    job_id=job_id
                )
            
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
            
            logger.info(f"✅ Anonymous CV upload and extraction completed for job {job_id}")
            
        except Exception as e:
            logger.error(f"Failed to extract CV data: {e}")
            import traceback
            logger.error(f"Full traceback:\n{traceback.format_exc()}")
            # Mark as failed but still return job_id
            update_cv_upload_status(job_id, 'failed')
            return UploadResponse(
                message="File uploaded but CV extraction failed. Please try again.",
                job_id=job_id
            )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"CV processing failed for job {job_id}: {e}")
        update_cv_upload_status(job_id, 'failed')
        raise HTTPException(status_code=500, detail=f"CV processing failed: {str(e)}")
    
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
            
        # Get file extension
        file_extension = Path(file.filename).suffix.lower()
        if file_extension not in config.ALLOWED_EXTENSIONS:
            logger.warning(f"Skipping file {file.filename} - invalid type {file_extension}")
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
        
        allowed_files.append({
            'filename': file.filename,
            'extension': file_extension,
            'content': file_content,
            'size': file_size
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
        cv_data = await data_extractor.extract_cv_data(combined_text)
        
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
                "type": file_path.suffix.lower(),
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
    file_extension = file_path.suffix.lower()
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