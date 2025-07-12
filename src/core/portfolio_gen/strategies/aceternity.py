"""
Aceternity Template Strategy for portfolio generation.

This strategy uses pre-designed Aceternity templates with CV data injection
for consistent, pixel-perfect portfolio output.
"""
import json
import logging
import shutil
from pathlib import Path
from typing import Dict, Any, List, Optional

from src.core.schemas.unified import CVData
from . import PortfolioStrategy
from ..component_adapter import ComponentAdapter

logger = logging.getLogger(__name__)


class AceternityStrategy(PortfolioStrategy):
    """Strategy that uses Aceternity templates for consistent portfolio generation."""
    
    def __init__(self):
        """Initialize the Aceternity strategy."""
        self.template_dir = Path("aceternity-gallery-app/templates")
        self.component_adapter = ComponentAdapter()
        self.available_templates = [
            "emma-portfolio",
            "modern-professional",
            "creative-designer",
            "tech-developer",
            "minimal-clean"
        ]
    
    async def generate(
        self, 
        cv_data: CVData, 
        output_dir: Path,
        options: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Generate portfolio using Aceternity template approach.
        
        Args:
            cv_data: Structured CV data
            output_dir: Directory to output the portfolio
            options: Options including template selection
            
        Returns:
            Generation results
        """
        options = options or {}
        template = options.get("template", "emma-portfolio")
        
        if template not in self.available_templates:
            template = "emma-portfolio"
            
        logger.info(f"Generating Aceternity portfolio with template: {template}")
        
        # Ensure output directory exists
        output_dir.mkdir(parents=True, exist_ok=True)
        
        # Copy template files
        template_path = self.template_dir / template
        if not template_path.exists():
            # Fallback to base template
            template_path = self.template_dir / "base"
            
        # Copy all template files
        shutil.copytree(template_path, output_dir, dirs_exist_ok=True)
        
        # Inject CV data into template
        self._inject_cv_data(cv_data, output_dir)
        
        # Generate component configurations
        components_used = self._configure_components(cv_data, output_dir)
        
        return {
            "success": True,
            "template": template,
            "output_path": str(output_dir),
            "components_used": components_used,
            "preview_url": f"http://localhost:3000",
            "files_generated": list(output_dir.rglob("*"))
        }
    
    def _inject_cv_data(self, cv_data: CVData, output_dir: Path):
        """Inject CV data into template files."""
        # Save CV data as JSON for client-side access
        cv_data_path = output_dir / "src" / "data" / "cv-data.json"
        cv_data_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(cv_data_path, "w") as f:
            json.dump(cv_data.model_dump(), f, indent=2)
        
        # Update template variables in key files
        self._update_template_files(cv_data, output_dir)
    
    def _update_template_files(self, cv_data: CVData, output_dir: Path):
        """Update template files with CV data."""
        # Update index page
        index_path = output_dir / "src" / "app" / "page.tsx"
        if index_path.exists():
            content = index_path.read_text()
            
            # Replace template variables
            replacements = {
                "{{FULL_NAME}}": cv_data.hero.fullName if cv_data.hero else "Portfolio",
                "{{TITLE}}": cv_data.hero.professionalTitle if cv_data.hero else "",
                "{{SUMMARY}}": cv_data.hero.summaryTagline if cv_data.hero else "",
                "{{EMAIL}}": cv_data.contact.email if cv_data.contact else ""
            }
            
            for placeholder, value in replacements.items():
                content = content.replace(placeholder, value or "")
                
            index_path.write_text(content)
    
    def _configure_components(self, cv_data: CVData, output_dir: Path) -> List[str]:
        """Configure Aceternity components based on CV data."""
        components = []
        
        # Hero section components
        if cv_data.hero:
            components.extend(["hero-highlight", "text-generate-effect"])
            
        # Experience timeline
        if cv_data.experience and cv_data.experience.experienceItems:
            components.append("timeline")
            
        # Skills grid
        if cv_data.skills:
            components.append("bento-grid")
            
        # Projects showcase
        if cv_data.projects and cv_data.projects.projectItems:
            components.extend(["3d-card", "hover-effect"])
            
        return components
    
    def get_required_components(self) -> List[str]:
        """Get required Aceternity components."""
        return [
            "hero-highlight",
            "timeline", 
            "bento-grid",
            "3d-card",
            "hover-effect",
            "text-generate-effect",
            "background-beams",
            "spotlight"
        ]
    
    def validate_cv_data(self, cv_data: CVData) -> tuple[bool, List[str]]:
        """Validate CV data for Aceternity generation."""
        issues = []
        
        # Check required sections
        if not cv_data.hero or not cv_data.hero.fullName:
            issues.append("Missing hero section with full name")
            
        if not cv_data.contact or not cv_data.contact.email:
            issues.append("Missing contact email")
            
        # Aceternity templates work well with any amount of content
        # Just provide warnings for optimal display
        if not cv_data.experience or not cv_data.experience.experienceItems:
            issues.append("Warning: No experience items - timeline will be hidden")
            
        if not cv_data.skills:
            issues.append("Warning: No skills - skills grid will be hidden")
        
        # All warnings, so still valid
        is_valid = all(not issue.startswith("Missing") for issue in issues)
        return is_valid, issues