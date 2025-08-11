"""
Portfolio Generation API V2 - With Template Selection Support
"""
from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
from typing import Dict, Any, Optional
import logging
import json
import uuid
from pathlib import Path
import shutil
import subprocess
import os
from datetime import datetime

# Import authentication dependency
from src.api.routes.auth import get_current_user
from src.api.db import get_user_cv_uploads
from src.api.routes.portfolio_generator import NextJSServerManager, server_manager

logger = logging.getLogger(__name__)

# Create router
router = APIRouter(prefix="/portfolio", tags=["portfolio-v2"])

# Base directories
BASE_DIR = Path(__file__).parent.parent.parent.parent
TEMPLATES_DIR = BASE_DIR / "src" / "templates"
PORTFOLIOS_DIR = BASE_DIR / "data" / "generated_portfolios"

# Available templates
AVAILABLE_TEMPLATES = {
    "v0_template_1": {
        "name": "Modern Portfolio",
        "description": "Clean, modern portfolio with animated components",
        "tier": "standard",
        "path": TEMPLATES_DIR / "v0_template_1"
    },
    "resume2web_branded": {
        "name": "RESUME2WEBSITE Branded",
        "description": "Portfolio with RESUME2WEBSITE branding - perfect for Go Live tier",
        "tier": "go-live",
        "path": TEMPLATES_DIR / "resume2web_branded"
    }
}

# Ensure portfolios directory exists
PORTFOLIOS_DIR.mkdir(parents=True, exist_ok=True)

class GeneratePortfolioRequest(BaseModel):
    template: str = "v0_template_1"
    config: Optional[Dict[str, Any]] = None

@router.get("/templates")
async def get_available_templates():
    """Get list of available portfolio templates"""
    templates = []
    for key, template in AVAILABLE_TEMPLATES.items():
        templates.append({
            "id": key,
            "name": template["name"],
            "description": template["description"],
            "tier": template["tier"]
        })
    return {
        "status": "success",
        "templates": templates
    }

@router.post("/generate/{job_id}")
async def generate_portfolio_with_template(
    job_id: str,
    request: GeneratePortfolioRequest,
    current_user_id: str = Depends(get_current_user)
):
    """
    Generate a portfolio website from CV data with template selection
    
    Args:
        job_id: The CV job ID to generate portfolio from
        request: Template selection and configuration
        current_user_id: Automatically injected by FastAPI
        
    Returns:
        Portfolio generation result with URL and status
    """
    try:
        logger.info(f"🚀 Starting portfolio generation with template '{request.template}' for job_id: {job_id}, user: {current_user_id}")
        
        # Validate template
        if request.template not in AVAILABLE_TEMPLATES:
            raise HTTPException(status_code=400, detail=f"Invalid template: {request.template}")
        
        template_info = AVAILABLE_TEMPLATES[request.template]
        template_source = template_info["path"]
        
        if not template_source.exists():
            raise HTTPException(status_code=500, detail=f"Template not found: {request.template}")
        
        # === 1. VERIFY CV OWNERSHIP ===
        uploads = get_user_cv_uploads(current_user_id)
        cv_upload = None
        
        for upload in uploads:
            if upload['job_id'] == job_id:
                cv_upload = upload
                break
        
        if not cv_upload:
            raise HTTPException(status_code=404, detail="CV not found or access denied")
        
        if cv_upload.get('status') != 'completed':
            raise HTTPException(status_code=400, detail="CV processing not completed yet")
        
        if not cv_upload.get('cv_data'):
            raise HTTPException(status_code=400, detail="No CV data available for portfolio generation")
        
        logger.info(f"✅ CV verification passed for job_id: {job_id}")
        
        # === 2. CREATE PORTFOLIO INSTANCE ===
        portfolio_id = str(uuid.uuid4())
        portfolio_dir = PORTFOLIOS_DIR / f"{current_user_id}_{portfolio_id}"
        
        # Copy template to portfolio directory (excluding node_modules and lock files)
        logger.info(f"📁 Creating portfolio from template: {request.template}")
        
        def ignore_patterns(dir, files):
            """Ignore node_modules, lock files, and other build artifacts"""
            ignore = set()
            for file in files:
                if file in ['node_modules', '.next', 'dist', 'build', '.git']:
                    ignore.add(file)
                elif file.endswith(('.log', '.pid')):
                    ignore.add(file)
                elif file in ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml']:
                    ignore.add(file)
            return ignore
        
        shutil.copytree(template_source, portfolio_dir, ignore=ignore_patterns)
        logger.info(f"✅ Template '{request.template}' copied successfully")
        
        # === 3. INJECT CV DATA INTO TEMPLATE ===
        cv_data = json.loads(cv_upload['cv_data'])
        
        # Create a data injection script
        data_injection_content = f'''/**
 * Auto-generated CV data for portfolio
 * Generated at: {datetime.now().isoformat()}
 * User: {current_user_id}
 * Job ID: {job_id}
 * Template: {request.template}
 */

import {{ adaptResume2WebsiteToTemplate }} from './cv-data-adapter'

// CV Data from extraction
const extractedCVData = {json.dumps(cv_data, indent=2)}

// Convert CV data to template format
export const portfolioData = adaptResume2WebsiteToTemplate(extractedCVData)

// Force use of real data instead of sample data
export const useRealData = true

// Template configuration
export const templateConfig = {json.dumps(request.config or {}, indent=2)}
'''
        
        # Write the injected data
        data_file = portfolio_dir / "lib" / "injected-data.tsx"
        data_file.write_text(data_injection_content)
        
        # === 4. MODIFY TEMPLATE TO USE INJECTED DATA ===
        page_file = portfolio_dir / "app" / "page.tsx"
        page_content = page_file.read_text()
        
        # Replace the data loading logic
        modified_content = page_content.replace(
            'import { initialData, contentIconMap, type PortfolioData } from "@/lib/data"',
            '''import { initialData, contentIconMap, type PortfolioData } from "@/lib/data"
import { portfolioData, useRealData } from "@/lib/injected-data"'''
        ).replace(
            'const [data, setData] = useState<PortfolioData>(initialData)',
            'const [data, setData] = useState<PortfolioData>(useRealData ? portfolioData : initialData)'
        )
        
        # Remove or simplify the API loading logic
        modified_content = modified_content.replace(
            'const [isLoading, setIsLoading] = useState(true)',
            'const [isLoading, setIsLoading] = useState(false)'
        )
        
        page_file.write_text(modified_content)
        logger.info("✅ Template modified to use injected CV data")
        
        # === 5. INSTALL DEPENDENCIES ===
        logger.info("📦 Installing dependencies...")
        
        try:
            # Use pnpm for installation
            install_result = subprocess.run(
                ['pnpm', 'install'],
                cwd=portfolio_dir,
                capture_output=True,
                text=True,
                timeout=300
            )
            
            if install_result.returncode != 0:
                logger.error(f"❌ pnpm install failed: {install_result.stderr}")
                raise HTTPException(status_code=500, detail="Failed to install dependencies")
            
            logger.info("✅ Dependencies installed successfully")
            
        except subprocess.TimeoutExpired:
            logger.error("❌ Dependency installation timed out")
            raise HTTPException(status_code=500, detail="Dependency installation timed out")
        except FileNotFoundError:
            logger.error("❌ pnpm not found")
            raise HTTPException(status_code=500, detail="pnpm not found. Please ensure pnpm is installed.")
        
        # === 6. BUILD THE PORTFOLIO (if needed) ===
        # Skip build for development - Next.js will build on demand
        
        # === 7. START THE PORTFOLIO SERVER ===
        logger.info("🚀 Starting portfolio server...")
        
        try:
            # Use the enhanced server manager
            server_config = server_manager.create_server_instance(
                portfolio_id=portfolio_id,
                project_path=str(portfolio_dir)
            )
            
            port = server_config['port']
            logger.info(f"✅ Portfolio server successfully started on port {port}")
            
        except Exception as e:
            logger.error(f"❌ Failed to start portfolio server: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to start portfolio server: {str(e)}")
        
        # === 8. SAVE PORTFOLIO METADATA ===
        portfolio_metadata = {
            "portfolio_id": portfolio_id,
            "user_id": current_user_id,
            "job_id": job_id,
            "created_at": datetime.now().isoformat(),
            "port": port,
            "url": f"http://localhost:{port}",
            "directory": str(portfolio_dir),
            "status": "active",
            "template": request.template,
            "template_info": {
                "name": template_info["name"],
                "tier": template_info["tier"]
            },
            "cv_filename": cv_upload.get('filename', 'Unknown'),
            "config": request.config
        }
        
        metadata_file = portfolio_dir / "portfolio_metadata.json"
        metadata_file.write_text(json.dumps(portfolio_metadata, indent=2))
        
        logger.info(f"🎉 Portfolio generation completed successfully!")
        logger.info(f"   Portfolio ID: {portfolio_id}")
        logger.info(f"   Template: {request.template}")
        logger.info(f"   URL: http://localhost:{port}")
        logger.info(f"   Directory: {portfolio_dir}")
        
        return {
            "status": "success",
            "message": "Portfolio generated successfully!",
            "portfolio_id": portfolio_id,
            "url": f"http://localhost:{port}",
            "port": port,
            "created_at": portfolio_metadata["created_at"],
            "template": request.template,
            "template_info": template_info,
            "cv_filename": cv_upload.get('filename', 'Unknown')
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Portfolio generation failed: {e}")
        raise HTTPException(status_code=500, detail=f"Portfolio generation failed: {str(e)}")