"""
CV Processing API - Handles CV upload and data extraction.

This module provides endpoints for uploading CVs and extracting structured data.
Portfolio generation is handled separately by MCP scripts.
"""
import asyncio
import logging
import json
from datetime import datetime
from pathlib import Path
from typing import Optional, Dict, Any
import uuid

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, BackgroundTasks
from fastapi.responses import JSONResponse
import aiofiles

from src.api.routes.auth import get_current_user
from src.api.schemas import UploadResponse
from src.core.local.text_extractor import TextExtractor
from src.core.cv_extraction.data_extractor import DataExtractor
from src.core.schemas.unified import CVData
import config

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/cv", tags=["cv-processing"])

# Initialize services
text_extractor = TextExtractor()
data_extractor = DataExtractor()


@router.post("/upload", response_model=UploadResponse)
async def upload_cv(
    file: UploadFile = File(...),
    current_user_id: str = Depends(get_current_user)
) -> UploadResponse:
    """
    Upload a CV file and extract structured data.
    
    Args:
        file: The uploaded CV file
        current_user_id: ID of the authenticated user
        
    Returns:
        UploadResponse with job_id for tracking
    """
    job_id = str(uuid.uuid4())
    logger.info(f"Starting CV upload job {job_id} for user {current_user_id}")
    
    try:
        # Validate file
        if not file.filename:
            raise HTTPException(status_code=400, detail="No filename provided")
            
        file_extension = Path(file.filename).suffix.lower()
        if file_extension not in config.ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type: {file_extension}. Allowed: {config.ALLOWED_EXTENSIONS}"
            )
        
        # Read file content
        file_content = await file.read()
        
        if not file_content:
            raise HTTPException(status_code=400, detail="File is empty")
            
        if len(file_content) > config.MAX_UPLOAD_SIZE:
            raise HTTPException(
                status_code=413,
                detail=f"File too large. Maximum size is {config.MAX_UPLOAD_SIZE / 1024 / 1024}MB"
            )
        
        # Save file temporarily
        upload_dir = Path(config.UPLOAD_DIR) / current_user_id
        upload_dir.mkdir(exist_ok=True, parents=True)
        
        file_path = upload_dir / f"{job_id}{file_extension}"
        
        async with aiofiles.open(file_path, "wb") as f:
            await f.write(file_content)
        
        logger.info(f"File saved: {file_path}")
        
        # Extract text
        try:
            text = text_extractor.extract_text(str(file_path))
            logger.info(f"Extracted {len(text)} characters of text")
            
            if not text or len(text) < 50:
                raise ValueError("Insufficient text extracted from CV")
                
        except Exception as e:
            logger.error(f"Text extraction failed: {e}")
            raise HTTPException(
                status_code=422,
                detail="Failed to extract text from CV. Please ensure the file contains readable text."
            )
        
        # Extract structured data
        try:
            cv_data = await data_extractor.extract_cv_data(text)
            
            # Save extracted data
            data_path = upload_dir / f"{job_id}_data.json"
            
            async with aiofiles.open(data_path, "w") as f:
                await f.write(json.dumps(cv_data.model_dump(), indent=2))
            
            logger.info(f"CV data saved: {data_path}")
            
        except Exception as e:
            logger.error(f"CV data extraction failed: {e}")
            raise HTTPException(
                status_code=422,
                detail="Failed to extract structured data from CV."
            )
        
        return UploadResponse(
            message="CV uploaded and processed successfully",
            job_id=job_id
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in CV upload: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/data/{job_id}")
async def get_cv_data(
    job_id: str,
    current_user_id: str = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    Retrieve extracted CV data by job ID.
    
    Args:
        job_id: The job ID from upload
        current_user_id: ID of the authenticated user
        
    Returns:
        Extracted CV data as JSON
    """
    data_path = Path(config.UPLOAD_DIR) / current_user_id / f"{job_id}_data.json"
    
    if not data_path.exists():
        raise HTTPException(status_code=404, detail="CV data not found")
    
    try:
        async with aiofiles.open(data_path, "r") as f:
            content = await f.read()
            return json.loads(content)
    except Exception as e:
        logger.error(f"Error reading CV data: {e}")
        raise HTTPException(status_code=500, detail="Error reading CV data")


@router.delete("/{job_id}")
async def delete_cv_data(
    job_id: str,
    current_user_id: str = Depends(get_current_user)
) -> Dict[str, str]:
    """
    Delete CV data and associated files.
    
    Args:
        job_id: The job ID to delete
        current_user_id: ID of the authenticated user
        
    Returns:
        Success message
    """
    user_dir = Path(config.UPLOAD_DIR) / current_user_id
    
    # Find and delete all files for this job
    deleted_count = 0
    for file_path in user_dir.glob(f"{job_id}*"):
        try:
            file_path.unlink()
            deleted_count += 1
        except Exception as e:
            logger.error(f"Error deleting {file_path}: {e}")
    
    if deleted_count == 0:
        raise HTTPException(status_code=404, detail="No files found for this job")
    
    return {"message": f"Deleted {deleted_count} files for job {job_id}"}