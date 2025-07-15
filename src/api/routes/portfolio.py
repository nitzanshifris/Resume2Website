"""
Portfolio Generation API Endpoints
Simplified version - being refactored to use template-based approach
"""
import logging
from fastapi import APIRouter, HTTPException
from src.api.schemas import PortfolioGenerationRequest, PortfolioGenerationResponse

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/portfolio", tags=["portfolio"])


@router.post("/generate", response_model=PortfolioGenerationResponse)
async def generate_portfolio(request: PortfolioGenerationRequest):
    """
    Generate a portfolio website from CV data.
    
    Currently being refactored to use a simpler template-based approach.
    """
    raise HTTPException(
        status_code=503,
        detail="Portfolio generation is being refactored. Please check back soon."
    )


@router.get("/templates")
async def list_templates():
    """
    List available portfolio templates.
    """
    return {
        "templates": [
            {
                "id": "v0_template_1",
                "name": "Modern Professional",
                "description": "Clean, professional template with editable sections",
                "preview": "/templates/v0_template_1/preview.png"
            },
            {
                "id": "v0_template_2",
                "name": "Creative Portfolio",
                "description": "Dynamic template with animations and effects",
                "preview": "/templates/v0_template_2/preview.png"
            }
        ]
    }