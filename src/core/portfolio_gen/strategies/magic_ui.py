"""
Magic UI MCP Strategy for portfolio generation.

This strategy uses Magic UI components and MCP scripts to dynamically
generate personalized portfolio websites.
"""
import asyncio
import json
import logging
import subprocess
import shutil
from pathlib import Path
from typing import Dict, Any, List, Optional

from src.core.schemas.unified import CVData
from . import PortfolioStrategy

logger = logging.getLogger(__name__)


class MagicUIStrategy(PortfolioStrategy):
    """Strategy that uses Magic UI MCP scripts for dynamic portfolio generation."""
    
    def __init__(self):
        """Initialize the Magic UI strategy."""
        self.mcp_script_path = Path("mcp_portfolio_generation_fixed.py")
        self.supported_themes = [
            "dark-modern",
            "colorful", 
            "professional",
            "gradient",
            "minimal"
        ]
    
    async def generate(
        self, 
        cv_data: CVData, 
        output_dir: Path,
        options: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Generate portfolio using Magic UI MCP approach.
        
        Args:
            cv_data: Structured CV data
            output_dir: Directory to output the portfolio
            options: Options including theme selection
            
        Returns:
            Generation results
        """
        options = options or {}
        theme = options.get("theme", "professional")
        
        if theme not in self.supported_themes:
            theme = "professional"
            
        logger.info(f"Generating Magic UI portfolio with theme: {theme}")
        
        # Ensure output directory exists
        output_dir.mkdir(parents=True, exist_ok=True)
        
        # Save CV data to temporary file for MCP script
        temp_cv_path = output_dir / "cv_data_temp.json"
        with open(temp_cv_path, "w") as f:
            json.dump(cv_data.model_dump(), f, indent=2)
        
        try:
            # Run MCP script
            cmd = [
                "python3",
                str(self.mcp_script_path),
                "--cv-data", str(temp_cv_path),
                "--output-dir", str(output_dir),
                "--theme", theme
            ]
            
            result = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            
            stdout, stderr = await result.communicate()
            
            if result.returncode != 0:
                logger.error(f"MCP script failed: {stderr.decode()}")
                raise RuntimeError("Portfolio generation failed")
            
            # Parse output paths from script
            output_data = json.loads(stdout.decode())
            
            return {
                "success": True,
                "theme": theme,
                "output_path": str(output_dir),
                "components_used": output_data.get("components", []),
                "preview_url": output_data.get("preview_url"),
                "files_generated": output_data.get("files", [])
            }
            
        except Exception as e:
            logger.error(f"Error in Magic UI generation: {e}")
            raise
        finally:
            # Cleanup temp file
            if temp_cv_path.exists():
                temp_cv_path.unlink()
    
    def get_required_components(self) -> List[str]:
        """Get required Magic UI components."""
        return [
            "blur-fade",
            "retro-grid",
            "sparkles",
            "border-beam",
            "background-gradient",
            "neon-gradient-card",
            "dot-pattern",
            "animated-beam",
            "rainbow"
        ]
    
    def validate_cv_data(self, cv_data: CVData) -> tuple[bool, List[str]]:
        """Validate CV data for Magic UI generation."""
        issues = []
        
        # Check required sections
        if not cv_data.hero or not cv_data.hero.fullName:
            issues.append("Missing hero section with full name")
            
        if not cv_data.experience or not cv_data.experience.experienceItems:
            issues.append("Missing experience section")
            
        if not cv_data.skills:
            issues.append("Missing skills section")
            
        # Magic UI works best with rich content
        if cv_data.experience and cv_data.experience.experienceItems:
            if len(cv_data.experience.experienceItems) < 2:
                issues.append("Recommended: At least 2 experience items for better layout")
        
        is_valid = len(issues) == 0
        return is_valid, issues