"""
CV to Portfolio Pipeline - Complete end-to-end processing
Connects CV upload with portfolio generation using Universal Adapter
"""
import asyncio
import logging
import tempfile
import zipfile
from datetime import datetime
from pathlib import Path
from typing import Optional, Dict, Any
import uuid

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, BackgroundTasks
from fastapi.responses import FileResponse
from pydantic import BaseModel
import aiofiles

from api.routes.auth import get_current_user
from services.local.text_extractor import text_extractor
from services.llm.data_extractor import data_extractor
from services.portfolio.component_selector import component_selector
from services.portfolio.portfolio_generator import portfolio_generator
from backend.schemas.unified import CVData
import config

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/cv-to-portfolio", tags=["cv-to-portfolio"])


class CVToPortfolioResponse(BaseModel):
    success: bool
    message: str
    job_id: str
    portfolio_id: Optional[str] = None
    download_url: Optional[str] = None
    cv_data_extracted: bool = False
    components_selected: int = 0
    portfolio_generated: bool = False


# Store job information
_job_registry: Dict[str, Dict[str, Any]] = {}


@router.post("/process", response_model=CVToPortfolioResponse)
async def process_cv_to_portfolio(
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = BackgroundTasks(),
    current_user_id: str = Depends(get_current_user),
    user_name: Optional[str] = None
) -> CVToPortfolioResponse:
    """
    Complete CV to Portfolio pipeline:
    1. Upload CV file
    2. Extract text
    3. Extract structured CV data
    4. Select components using Universal Adapter
    5. Generate portfolio
    6. Return download link
    
    This endpoint demonstrates the complete integration with Universal Adapter.
    """
    job_id = str(uuid.uuid4())
    
    # Initialize job tracking
    _job_registry[job_id] = {
        "user_id": current_user_id,
        "status": "started",
        "started_at": datetime.now(),
        "cv_data_extracted": False,
        "components_selected": 0,
        "portfolio_generated": False
    }
    
    try:
        logger.info(f"Starting CV to Portfolio pipeline for user {current_user_id}")
        
        # === Step 1: File Validation ===
        file_content = await asyncio.wait_for(file.read(), timeout=config.UPLOAD_TIMEOUT)
        
        if not file_content:
            raise HTTPException(status_code=400, detail="File is empty")
        
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
        
        # === Step 2: Save File Temporarily ===
        BASE_DIR = Path(__file__).parent.parent.parent
        upload_dir = BASE_DIR / "data" / "temp_uploads"
        upload_dir.mkdir(exist_ok=True, parents=True)
        
        file_path = upload_dir / f"{job_id}{file_extension}"
        
        async with aiofiles.open(file_path, "wb") as f:
            await f.write(file_content)
        
        logger.info(f"File saved temporarily: {file_path}")
        
        # === Step 3: Extract Text ===
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
        
        # === Step 4: Extract Structured CV Data ===
        try:
            cv_data = await data_extractor.extract_cv_data(text)
            logger.info(f"Successfully extracted CV data with sections: {[f for f in cv_data.model_dump() if cv_data.model_dump()[f]]}")
            
            _job_registry[job_id]["cv_data_extracted"] = True
            _job_registry[job_id]["cv_data"] = cv_data
            
        except Exception as e:
            logger.error(f"CV data extraction failed: {e}")
            raise HTTPException(
                status_code=422,
                detail="Failed to extract structured data from CV. Please check the CV format."
            )
        
        # === Step 5: Select Components ===
        try:
            selections = component_selector.select_components(cv_data)
            
            if not selections:
                raise ValueError("No components could be selected for the CV data")
            
            logger.info(f"Selected {len(selections)} components using Universal Adapter")
            _job_registry[job_id]["components_selected"] = len(selections)
            
            # Log components selected for debugging
            for selection in selections:
                logger.info(f"  - {selection.component_type} for {selection.section}")
                
        except Exception as e:
            logger.error(f"Component selection failed: {e}")
            raise HTTPException(
                status_code=500,
                detail="Failed to select appropriate components for portfolio"
            )
        
        # === Step 6: Generate Portfolio ===
        try:
            # Use provided user_name or extract from CV
            if not user_name:
                if hasattr(cv_data, 'hero') and cv_data.hero and hasattr(cv_data.hero, 'fullName'):
                    user_name = cv_data.hero.fullName
                else:
                    user_name = f"User_{job_id[:8]}"
            
            with tempfile.TemporaryDirectory() as temp_dir:
                portfolio_dir = Path(temp_dir) / "portfolio"
                
                # Generate portfolio with timeout protection
                files = await asyncio.wait_for(
                    asyncio.to_thread(
                        portfolio_generator.generate_portfolio,
                        selections,
                        user_name,
                        portfolio_dir
                    ),
                    timeout=config.UPLOAD_TIMEOUT * 3
                )
                
                logger.info(f"Generated {len(files)} portfolio files")
                
                # Create ZIP archive
                portfolio_id = f"{user_name.lower().replace(' ', '-')}-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
                zip_path = Path(tempfile.gettempdir()) / f"portfolio-{job_id}.zip"
                
                with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
                    for file_path in portfolio_dir.rglob("*"):
                        if file_path.is_file():
                            relative_path = file_path.relative_to(portfolio_dir)
                            zipf.write(file_path, relative_path)
                
                _job_registry[job_id]["portfolio_generated"] = True
                _job_registry[job_id]["portfolio_id"] = portfolio_id
                _job_registry[job_id]["zip_path"] = str(zip_path)
                
                # Schedule cleanup
                background_tasks.add_task(cleanup_job, job_id, delay_hours=1)
                
        except asyncio.TimeoutError:
            raise HTTPException(
                status_code=408,
                detail="Portfolio generation timed out. Please try again."
            )
        except Exception as e:
            logger.error(f"Portfolio generation failed: {e}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to generate portfolio: {str(e)}"
            )
        
        # === Step 7: Cleanup temporary CV file ===
        try:
            if file_path.exists():
                file_path.unlink()
                logger.info(f"Cleaned up temporary CV file")
        except Exception as e:
            logger.warning(f"Failed to cleanup CV file: {e}")
        
        # === Success Response ===
        download_url = f"/cv-to-portfolio/download/{job_id}"
        
        return CVToPortfolioResponse(
            success=True,
            message="CV processed and portfolio generated successfully!",
            job_id=job_id,
            portfolio_id=portfolio_id,
            download_url=download_url,
            cv_data_extracted=True,
            components_selected=len(selections),
            portfolio_generated=True
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"CV to Portfolio pipeline failed: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Processing failed: {str(e)}"
        )


@router.get("/download/{job_id}")
async def download_portfolio(job_id: str):
    """Download the generated portfolio ZIP file"""
    if job_id not in _job_registry:
        raise HTTPException(
            status_code=404,
            detail="Job not found or has expired"
        )
    
    job_info = _job_registry[job_id]
    
    if not job_info.get("portfolio_generated"):
        raise HTTPException(
            status_code=404,
            detail="Portfolio not yet generated for this job"
        )
    
    zip_path = Path(job_info["zip_path"])
    
    if not zip_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Portfolio file not found"
        )
    
    portfolio_id = job_info.get("portfolio_id", job_id)
    filename = f"{portfolio_id}-portfolio.zip"
    
    return FileResponse(
        path=zip_path,
        filename=filename,
        media_type="application/zip",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


@router.get("/status/{job_id}")
async def get_job_status(job_id: str):
    """Get the status of a CV to Portfolio job"""
    if job_id not in _job_registry:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )
    
    job_info = _job_registry[job_id]
    
    return {
        "job_id": job_id,
        "status": job_info.get("status", "unknown"),
        "started_at": job_info.get("started_at"),
        "cv_data_extracted": job_info.get("cv_data_extracted", False),
        "components_selected": job_info.get("components_selected", 0),
        "portfolio_generated": job_info.get("portfolio_generated", False),
        "download_url": f"/cv-to-portfolio/download/{job_id}" if job_info.get("portfolio_generated") else None
    }


async def cleanup_job(job_id: str, delay_hours: int = 1):
    """Background task to clean up job files"""
    await asyncio.sleep(delay_hours * 3600)
    
    if job_id in _job_registry:
        job_info = _job_registry[job_id]
        
        # Remove ZIP file
        if "zip_path" in job_info:
            zip_path = Path(job_info["zip_path"])
            if zip_path.exists():
                try:
                    zip_path.unlink()
                    logger.info(f"Cleaned up portfolio ZIP for job {job_id}")
                except Exception as e:
                    logger.error(f"Failed to cleanup ZIP file: {e}")
        
        # Remove from registry
        del _job_registry[job_id]
        logger.info(f"Cleaned up job from registry: {job_id}")