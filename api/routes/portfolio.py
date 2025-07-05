"""
Portfolio Generation API Endpoints
Handles portfolio generation requests and file serving
"""
import asyncio
import logging
import tempfile
import zipfile
from datetime import datetime
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from pydantic import BaseModel

from backend.schemas.unified import CVData
from services.portfolio.component_selector import component_selector
from services.portfolio.portfolio_generator import portfolio_generator
import config

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/portfolio", tags=["portfolio"])


class PortfolioGenerationRequest(BaseModel):
    cv_data: CVData
    user_name: str
    include_aceternity_components: bool = True


class PortfolioGenerationResponse(BaseModel):
    success: bool
    message: str
    portfolio_id: Optional[str] = None
    download_url: Optional[str] = None
    preview_url: Optional[str] = None


# Store generated portfolios temporarily
_generated_portfolios = {}


@router.post("/generate", response_model=PortfolioGenerationResponse)
async def generate_portfolio(request: PortfolioGenerationRequest, background_tasks: BackgroundTasks):
    """
    Generate a complete Next.js portfolio from CV data
    
    Args:
        request: Portfolio generation request with CV data and options
        background_tasks: Background tasks for cleanup
        
    Returns:
        Portfolio generation response with download links
    """
    try:
        logger.info(f"Starting portfolio generation for: {request.user_name}")
        
        # Step 1: Select appropriate components based on CV data
        selections = component_selector.select_components(request.cv_data)
        
        if not selections:
            raise HTTPException(
                status_code=400, 
                detail="Unable to select appropriate components for the provided CV data"
            )
        
        logger.info(f"Selected {len(selections)} components for portfolio")
        
        # Step 2: Create temporary directory for generation
        with tempfile.TemporaryDirectory() as temp_dir:
            portfolio_dir = Path(temp_dir) / "portfolio"
            
            # Step 3: Generate portfolio files
            try:
                files = await asyncio.wait_for(
                    asyncio.to_thread(
                        portfolio_generator.generate_portfolio,
                        selections,
                        request.user_name,
                        portfolio_dir
                    ),
                    timeout=config.UPLOAD_TIMEOUT * 3  # Allow more time for portfolio generation
                )
                
                logger.info(f"Generated {len(files)} portfolio files")
                
            except asyncio.TimeoutError:
                raise HTTPException(
                    status_code=408,
                    detail="Portfolio generation timed out. Please try again."
                )
            
            # Step 4: Create downloadable ZIP archive
            portfolio_id = f"{request.user_name.lower().replace(' ', '-')}-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
            zip_path = Path(tempfile.gettempdir()) / f"{portfolio_id}.zip"
            
            with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
                for file_path in portfolio_dir.rglob("*"):
                    if file_path.is_file():
                        # Create relative path for ZIP archive
                        relative_path = file_path.relative_to(portfolio_dir)
                        zipf.write(file_path, relative_path)
            
            # Step 5: Store portfolio info for download
            _generated_portfolios[portfolio_id] = {
                "zip_path": zip_path,
                "user_name": request.user_name,
                "created_at": datetime.now(),
                "selections": selections
            }
            
            # Schedule cleanup after 1 hour
            background_tasks.add_task(cleanup_portfolio, portfolio_id, delay_hours=1)
            
            download_url = f"/portfolio/download/{portfolio_id}"
            
            logger.info(f"Portfolio generation completed: {portfolio_id}")
            
            return PortfolioGenerationResponse(
                success=True,
                message="Portfolio generated successfully",
                portfolio_id=portfolio_id,
                download_url=download_url,
                preview_url=None  # TODO: Add preview functionality
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Portfolio generation failed: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Portfolio generation failed: {str(e)}"
        )


@router.get("/download/{portfolio_id}")
async def download_portfolio(portfolio_id: str):
    """
    Download a generated portfolio as a ZIP file
    
    Args:
        portfolio_id: ID of the generated portfolio
        
    Returns:
        ZIP file containing the complete Next.js portfolio
    """
    if portfolio_id not in _generated_portfolios:
        raise HTTPException(
            status_code=404,
            detail="Portfolio not found or has expired"
        )
    
    portfolio_info = _generated_portfolios[portfolio_id]
    zip_path = portfolio_info["zip_path"]
    
    if not zip_path.exists():
        # Clean up stale entry
        del _generated_portfolios[portfolio_id]
        raise HTTPException(
            status_code=404,
            detail="Portfolio file not found"
        )
    
    user_name = portfolio_info["user_name"]
    filename = f"{user_name.replace(' ', '-')}-portfolio.zip"
    
    return FileResponse(
        path=zip_path,
        filename=filename,
        media_type="application/zip",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


@router.get("/info/{portfolio_id}")
async def get_portfolio_info(portfolio_id: str):
    """
    Get information about a generated portfolio
    
    Args:
        portfolio_id: ID of the generated portfolio
        
    Returns:
        Portfolio information including components used
    """
    if portfolio_id not in _generated_portfolios:
        raise HTTPException(
            status_code=404,
            detail="Portfolio not found or has expired"
        )
    
    portfolio_info = _generated_portfolios[portfolio_id]
    
    return {
        "portfolio_id": portfolio_id,
        "user_name": portfolio_info["user_name"],
        "created_at": portfolio_info["created_at"],
        "components_used": [
            {
                "section": selection.section,
                "component_type": selection.component_type,
                "priority": selection.priority
            }
            for selection in portfolio_info["selections"]
        ]
    }


@router.get("/list")
async def list_portfolios():
    """
    List all currently available portfolios
    
    Returns:
        List of available portfolios with basic info
    """
    portfolios = []
    for portfolio_id, info in _generated_portfolios.items():
        portfolios.append({
            "portfolio_id": portfolio_id,
            "user_name": info["user_name"],
            "created_at": info["created_at"],
            "component_count": len(info["selections"])
        })
    
    return {"portfolios": portfolios}


async def cleanup_portfolio(portfolio_id: str, delay_hours: int = 1):
    """
    Background task to clean up generated portfolio files
    
    Args:
        portfolio_id: ID of the portfolio to clean up
        delay_hours: Hours to wait before cleanup
    """
    # Wait for the specified delay
    await asyncio.sleep(delay_hours * 3600)
    
    if portfolio_id in _generated_portfolios:
        portfolio_info = _generated_portfolios[portfolio_id]
        zip_path = portfolio_info["zip_path"]
        
        # Remove the ZIP file
        if zip_path.exists():
            try:
                zip_path.unlink()
                logger.info(f"Cleaned up portfolio file: {portfolio_id}")
            except Exception as e:
                logger.error(f"Failed to clean up portfolio file {portfolio_id}: {e}")
        
        # Remove from memory
        del _generated_portfolios[portfolio_id]
        logger.info(f"Cleaned up portfolio from memory: {portfolio_id}")


@router.delete("/cleanup")
async def force_cleanup():
    """
    Force cleanup of all generated portfolios (admin endpoint)
    """
    cleaned_count = 0
    for portfolio_id in list(_generated_portfolios.keys()):
        portfolio_info = _generated_portfolios[portfolio_id]
        zip_path = portfolio_info["zip_path"]
        
        if zip_path.exists():
            try:
                zip_path.unlink()
                cleaned_count += 1
            except Exception as e:
                logger.error(f"Failed to clean up {portfolio_id}: {e}")
        
        del _generated_portfolios[portfolio_id]
    
    return {"message": f"Cleaned up {cleaned_count} portfolios"}