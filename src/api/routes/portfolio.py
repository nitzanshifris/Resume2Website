"""
Portfolio Generation API Endpoints
Handles portfolio generation requests and file serving
"""
import asyncio
import json
import logging
import tempfile
import zipfile
from datetime import datetime
from pathlib import Path
from typing import Optional, Dict, Any

from fastapi import APIRouter, HTTPException, BackgroundTasks, UploadFile, File, Body
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
import aiofiles

from src.core.schemas.unified import CVData
from src.core.portfolio_gen.strategy_registry import strategy_registry
from src.core.portfolio_gen.utils import create_portfolio_zip
from src.core.portfolio_gen.template_data_transformer import template_transformer
from src.core.local.text_extractor import text_extractor
from src.core.cv_extraction.data_extractor import data_extractor
import config

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/portfolio", tags=["portfolio"])


class PortfolioGenerationRequest(BaseModel):
    cv_data: CVData
    user_name: str
    strategy: str = "magic-ui"  # "magic-ui" or "aceternity"
    options: Optional[dict] = None


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
        
        # Step 1: Get the requested strategy
        strategy = strategy_registry.get_strategy(request.strategy)
        if not strategy:
            raise HTTPException(
                status_code=400,
                detail=f"Unknown strategy: {request.strategy}. Available: magic-ui, aceternity"
            )
        
        # Step 2: Validate CV data for the strategy
        is_valid, issues = strategy.validate_cv_data(request.cv_data)
        if not is_valid:
            raise HTTPException(
                status_code=400,
                detail=f"CV data validation failed: {'; '.join(issues)}"
            )
        
        # Step 3: Create temporary directory for generation
        with tempfile.TemporaryDirectory() as temp_dir:
            portfolio_dir = Path(temp_dir) / "portfolio"
            
            # Step 4: Generate portfolio using strategy
            try:
                generation_result = await asyncio.wait_for(
                    strategy.generate(
                        cv_data=request.cv_data,
                        output_dir=portfolio_dir,
                        options=request.options
                    ),
                    timeout=config.UPLOAD_TIMEOUT * 3  # Allow more time for portfolio generation
                )
                
                if not generation_result.get("success"):
                    raise HTTPException(
                        status_code=500,
                        detail="Portfolio generation failed"
                    )
                
                logger.info(f"Portfolio generated successfully using {request.strategy} strategy")
                
            except asyncio.TimeoutError:
                raise HTTPException(
                    status_code=408,
                    detail="Portfolio generation timed out. Please try again."
                )
            
            # Step 5: Create downloadable ZIP archive
            portfolio_id = f"{request.user_name.lower().replace(' ', '-')}-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
            zip_path = Path(tempfile.gettempdir()) / f"{portfolio_id}.zip"
            
            # Use utility function for consistent ZIP creation
            create_portfolio_zip(portfolio_dir, zip_path)
            
            # Step 6: Store portfolio info for download
            _generated_portfolios[portfolio_id] = {
                "zip_path": zip_path,
                "user_name": request.user_name,
                "created_at": datetime.now(),
                "strategy": request.strategy,
                "generation_result": generation_result
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
        "strategy": portfolio_info.get("strategy", "unknown"),
        "components_used": portfolio_info.get("generation_result", {}).get("components_used", [])
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
            "strategy": info.get("strategy", "unknown")
        })
    
    return {"portfolios": portfolios}


@router.get("/strategies")
async def list_strategies():
    """
    List all available portfolio generation strategies
    
    Returns:
        Dictionary of available strategies with their metadata
    """
    return strategy_registry.list_strategies()


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


# New endpoints for template-based portfolio generation

class TemplatePortfolioRequest(BaseModel):
    cv_data: Dict[str, Any]
    user_name: Optional[str] = None
    template_type: str = "final_template"


class TemplatePortfolioResponse(BaseModel):
    success: bool
    message: str
    portfolio_id: str
    download_url: Optional[str] = None
    preview_data: Optional[Dict[str, Any]] = None


@router.post("/generate-template", response_model=TemplatePortfolioResponse)
async def generate_template_portfolio(
    request: TemplatePortfolioRequest,
    background_tasks: BackgroundTasks = BackgroundTasks()
) -> TemplatePortfolioResponse:
    """
    Generate portfolio using the final_template with transformed CV data.
    
    This endpoint transforms CV data to match the template structure
    and generates a ready-to-use Next.js portfolio.
    """
    portfolio_id = f"template-{datetime.now().strftime('%Y%m%d-%H%M%S')}-{hash(str(request.cv_data))}"
    
    try:
        logger.info(f"Starting template portfolio generation")
        
        # Transform CV data to template format
        try:
            template_data = template_transformer.transform_cv_to_template(request.cv_data)
            logger.info(f"Successfully transformed CV data to template format")
        except Exception as e:
            logger.error(f"Data transformation failed: {e}")
            raise HTTPException(
                status_code=422,
                detail=f"Failed to transform CV data: {str(e)}"
            )
        
        # Generate portfolio files
        try:
            with tempfile.TemporaryDirectory() as temp_dir:
                portfolio_dir = Path(temp_dir) / "portfolio"
                portfolio_dir.mkdir(parents=True)
                
                # Copy template structure
                template_source = Path(__file__).parent.parent.parent / "final_template"
                
                if not template_source.exists():
                    raise HTTPException(
                        status_code=500,
                        detail="Template source not found"
                    )
                
                # Copy all template files except page.tsx
                for item in template_source.rglob("*"):
                    if item.is_file() and item.name != "page.tsx":
                        relative_path = item.relative_to(template_source)
                        target_path = portfolio_dir / relative_path
                        target_path.parent.mkdir(parents=True, exist_ok=True)
                        
                        # Copy file
                        with open(item, 'rb') as src:
                            content = src.read()
                        with open(target_path, 'wb') as dst:
                            dst.write(content)
                
                # Generate customized page.tsx
                page_path = portfolio_dir / "app" / "page.tsx"
                page_content = template_transformer.generate_portfolio_page(
                    request.cv_data,
                    page_path
                )
                
                # Save transformed data as JSON
                data_path = portfolio_dir / "portfolio-data.json"
                with open(data_path, 'w', encoding='utf-8') as f:
                    json.dump(template_data, f, indent=2, ensure_ascii=False)
                
                # Create README
                readme_path = portfolio_dir / "README.md"
                user_name = request.user_name or template_data.get("hero", {}).get("name", "Professional")
                readme_content = f"""# Portfolio for {user_name}

## Installation

1. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This portfolio is ready to deploy on Vercel:

1. Push to a GitHub repository
2. Import the project on [Vercel](https://vercel.com)
3. Deploy with zero configuration

## Customization

- Edit content directly in the browser using built-in editing features
- Toggle sections on/off using the settings menu
- Switch between light and dark themes

Generated with CV2WEB on {datetime.now().strftime('%Y-%m-%d')}
"""
                with open(readme_path, 'w', encoding='utf-8') as f:
                    f.write(readme_content)
                
                # Create ZIP archive
                zip_filename = f"portfolio-{user_name.lower().replace(' ', '-')}-{datetime.now().strftime('%Y%m%d-%H%M%S')}.zip"
                zip_path = Path(tempfile.gettempdir()) / f"{portfolio_id}.zip"
                
                with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
                    for file_path in portfolio_dir.rglob("*"):
                        if file_path.is_file():
                            relative_path = file_path.relative_to(portfolio_dir)
                            zipf.write(file_path, relative_path)
                
                # Store portfolio info
                _generated_portfolios[portfolio_id] = {
                    "zip_path": zip_path,
                    "user_name": user_name,
                    "created_at": datetime.now(),
                    "strategy": "template",
                    "generation_result": {
                        "success": True,
                        "template_data": template_data
                    }
                }
                
                # Schedule cleanup
                background_tasks.add_task(cleanup_portfolio, portfolio_id, delay_hours=2)
                
                logger.info(f"Template portfolio generated successfully: {portfolio_id}")
                
        except Exception as e:
            logger.error(f"Portfolio generation failed: {e}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to generate portfolio files: {str(e)}"
            )
        
        return TemplatePortfolioResponse(
            success=True,
            message="Portfolio generated successfully!",
            portfolio_id=portfolio_id,
            download_url=f"/portfolio/download/{portfolio_id}",
            preview_data=template_data
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Template portfolio generation failed: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Portfolio generation failed: {str(e)}"
        )


@router.post("/generate-from-cv", response_model=TemplatePortfolioResponse)
async def generate_portfolio_from_cv(
    file: UploadFile = File(...),
    user_name: Optional[str] = None,
    background_tasks: BackgroundTasks = BackgroundTasks()
) -> TemplatePortfolioResponse:
    """
    Complete pipeline: Upload CV file -> Extract data -> Generate template portfolio
    
    This combines CV processing and portfolio generation in one step.
    """
    try:
        logger.info(f"Starting portfolio generation from CV file")
        
        # Validate file
        file_content = await file.read()
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
        
        # Save file temporarily
        with tempfile.NamedTemporaryFile(suffix=file_extension, delete=False) as tmp_file:
            tmp_file.write(file_content)
            tmp_path = tmp_file.name
        
        try:
            # Extract text
            text = text_extractor.extract_text(tmp_path)
            if not text or len(text) < 50:
                raise ValueError("Insufficient text extracted from CV")
            
            # Extract CV data
            cv_data = await data_extractor.extract_cv_data(text)
            cv_data_dict = cv_data.model_dump()
            
            # Use name from CV if not provided
            if not user_name and cv_data.hero and cv_data.hero.fullName:
                user_name = cv_data.hero.fullName
            
            # Generate portfolio using template
            portfolio_request = TemplatePortfolioRequest(
                cv_data=cv_data_dict,
                user_name=user_name,
                template_type="final_template"
            )
            
            return await generate_template_portfolio(
                portfolio_request,
                background_tasks
            )
            
        finally:
            # Cleanup temporary file
            Path(tmp_path).unlink(missing_ok=True)
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Portfolio generation from CV failed: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Processing failed: {str(e)}"
        )


@router.post("/transform-data")
async def transform_cv_data(
    cv_data: Dict[str, Any] = Body(...)
) -> Dict[str, Any]:
    """
    Transform CV data to portfolio template format without generating files.
    
    Useful for previewing how CV data will look in the portfolio.
    """
    try:
        template_data = template_transformer.transform_cv_to_template(cv_data)
        
        return {
            "success": True,
            "message": "Data transformed successfully",
            "template_data": template_data
        }
        
    except Exception as e:
        logger.error(f"Data transformation failed: {e}")
        raise HTTPException(
            status_code=422,
            detail=f"Failed to transform data: {str(e)}"
        )