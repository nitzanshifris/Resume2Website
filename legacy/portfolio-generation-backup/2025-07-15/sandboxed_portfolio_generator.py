#!/usr/bin/env python3
"""
Sandboxed Portfolio Generator
Generates portfolios in isolated sandbox environments for security
"""
import asyncio
import json
import shutil
import uuid
from pathlib import Path
from datetime import datetime
from typing import Optional, Dict, Any
import sys

# Add parent directory to Python path
sys.path.append(str(Path(__file__).parent.parent.parent))

from src.core.local.text_extractor import text_extractor
from src.core.cv_extraction.data_extractor import data_extractor
from src.core.portfolio_gen.template_data_transformer import template_transformer
from src.utils.live_logger import LiveLogger

# Initialize logger
logger = LiveLogger(__name__)


class SandboxedPortfolioGenerator:
    """Generate portfolios in isolated sandbox environments."""
    
    def __init__(self):
        self.sandbox_base = Path("sandboxes/portfolios")
        self.sandbox_base.mkdir(parents=True, exist_ok=True)
        self.template_source = Path("src/utils/final_template")
        
        logger.info("Sandboxed Portfolio Generator initialized")
    
    def create_sandbox(self, job_id: Optional[str] = None) -> Path:
        """Create a new isolated sandbox for portfolio generation."""
        if not job_id:
            job_id = str(uuid.uuid4())
        
        sandbox_path = self.sandbox_base / job_id
        sandbox_path.mkdir(exist_ok=True)
        
        logger.step("Created sandbox", {
            "job_id": job_id,
            "path": str(sandbox_path)
        })
        
        return sandbox_path
    
    def cleanup_sandbox(self, sandbox_path: Path):
        """Remove a sandbox and all its contents."""
        try:
            if sandbox_path.exists() and sandbox_path.is_dir():
                shutil.rmtree(sandbox_path)
                logger.success(f"Cleaned up sandbox: {sandbox_path.name}")
        except Exception as e:
            logger.error(f"Failed to cleanup sandbox", error=e)
    
    async def generate_in_sandbox(
        self,
        cv_path: Path,
        job_id: Optional[str] = None,
        output_name: Optional[str] = None
    ) -> Dict[str, Any]:
        """Generate a complete portfolio in an isolated sandbox."""
        
        logger.section("Starting Sandboxed Portfolio Generation")
        
        # Create sandbox
        sandbox_path = self.create_sandbox(job_id)
        result = {
            "success": False,
            "job_id": sandbox_path.name,
            "sandbox_path": str(sandbox_path),
            "preview_url": None,
            "errors": []
        }
        
        try:
            # Step 1: Extract CV data
            logger.step("Extracting CV data", {"file": cv_path.name})
            text = text_extractor.extract_text(str(cv_path))
            cv_data = await data_extractor.extract_cv_data(text)
            cv_data_dict = cv_data.model_dump_nullable()
            
            person_name = cv_data.hero.fullName if cv_data.hero else "Portfolio"
            logger.step_complete("Extracting CV data", {"person": person_name})
            
            # Step 2: Transform to portfolio format
            logger.step("Transforming data to portfolio format")
            template_data = template_transformer.transform_cv_to_template(cv_data_dict)
            logger.step_complete("Transforming data to portfolio format")
            
            # Step 3: Copy template to sandbox
            logger.step("Setting up portfolio in sandbox")
            portfolio_path = sandbox_path / "portfolio"
            
            if not self.template_source.exists():
                raise FileNotFoundError(f"Template not found at: {self.template_source}")
            
            shutil.copytree(self.template_source, portfolio_path)
            logger.info("Template copied to sandbox")
            
            # Step 4: Inject personalized data
            logger.step("Injecting personalized data")
            page_path = portfolio_path / "app" / "page.tsx"
            
            with open(page_path, 'r', encoding='utf-8') as f:
                template_content = f.read()
            
            # Find and replace initialData
            import_end = template_content.find("const initialData")
            if import_end == -1:
                raise ValueError("Could not find initialData in template")
            
            # Find the end of initialData object
            data_start = import_end
            brace_count = 0
            data_end = data_start
            started = False
            
            for i, char in enumerate(template_content[data_start:], data_start):
                if char == '{' and not started:
                    started = True
                    brace_count = 1
                elif started:
                    if char == '{':
                        brace_count += 1
                    elif char == '}':
                        brace_count -= 1
                        if brace_count == 0:
                            data_end = i + 1
                            break
            
            # Generate new data section
            json_data = json.dumps(template_data, indent=2, ensure_ascii=False)
            # Convert to TypeScript object literal
            import re
            ts_data = re.sub(r'"(\w+)":', r'\1:', json_data)
            
            new_data_section = f"const initialData = {ts_data}"
            
            # Replace the data section
            new_content = (
                template_content[:import_end] +
                new_data_section +
                template_content[data_end:]
            )
            
            with open(page_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            logger.step_complete("Injecting personalized data")
            
            # Step 5: Save metadata
            logger.step("Saving portfolio metadata")
            metadata = {
                "job_id": sandbox_path.name,
                "created_at": datetime.now().isoformat(),
                "person_name": person_name,
                "cv_file": cv_path.name,
                "status": "generated",
                "sandbox_path": str(sandbox_path),
                "portfolio_path": str(portfolio_path)
            }
            
            with open(sandbox_path / "metadata.json", 'w') as f:
                json.dump(metadata, f, indent=2)
            
            # Save CV data and portfolio data
            data_dir = portfolio_path / "data"
            data_dir.mkdir(exist_ok=True)
            
            with open(data_dir / "cv-data.json", 'w', encoding='utf-8') as f:
                json.dump(cv_data_dict, f, indent=2, ensure_ascii=False)
            
            with open(data_dir / "portfolio-data.json", 'w', encoding='utf-8') as f:
                json.dump(template_data, f, indent=2, ensure_ascii=False)
            
            logger.step_complete("Saving portfolio metadata")
            
            # Step 6: Create preview instructions
            preview_file = sandbox_path / "preview.md"
            preview_content = f"""# Portfolio Preview Instructions

## Sandbox Information
- **Job ID**: {sandbox_path.name}
- **Person**: {person_name}
- **Generated**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## To Preview Locally
1. Navigate to the portfolio directory:
   ```bash
   cd {portfolio_path}
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm run dev
   ```

4. Open http://localhost:3000 in your browser

## To Deploy
Once approved, the portfolio can be deployed to Vercel or exported to the user's desired location.
"""
            
            with open(preview_file, 'w') as f:
                f.write(preview_content)
            
            # Success
            result["success"] = True
            result["preview_url"] = f"file://{portfolio_path}/README.md"
            result["portfolio_path"] = str(portfolio_path)
            
            logger.success("Portfolio generated successfully in sandbox!", {
                "job_id": sandbox_path.name,
                "location": str(portfolio_path)
            })
            
        except Exception as e:
            logger.error("Portfolio generation failed", error=e)
            result["errors"].append(str(e))
            # Cleanup on failure
            self.cleanup_sandbox(sandbox_path)
        
        return result
    
    async def export_from_sandbox(
        self,
        job_id: str,
        destination: Path,
        cleanup: bool = True
    ) -> bool:
        """Export approved portfolio from sandbox to final destination."""
        logger.step("Exporting portfolio from sandbox", {
            "job_id": job_id,
            "destination": str(destination)
        })
        
        sandbox_path = self.sandbox_base / job_id
        portfolio_path = sandbox_path / "portfolio"
        
        if not portfolio_path.exists():
            logger.error(f"Portfolio not found in sandbox: {job_id}")
            return False
        
        try:
            # Copy portfolio to destination
            if destination.exists():
                shutil.rmtree(destination)
            
            shutil.copytree(portfolio_path, destination)
            logger.success("Portfolio exported successfully")
            
            # Cleanup sandbox if requested
            if cleanup:
                self.cleanup_sandbox(sandbox_path)
            
            return True
            
        except Exception as e:
            logger.error("Failed to export portfolio", error=e)
            return False


# Example usage
async def main():
    """Demo the sandboxed portfolio generator."""
    generator = SandboxedPortfolioGenerator()
    
    # Example CV path
    cv_path = Path("/Users/nitzan_shifris/Desktop/CV2WEB-V4/data/cv_examples/pdf_examples/simple_pdf/Guy Sagee - CV 425.2 .pdf")
    
    if not cv_path.exists():
        logger.error(f"CV file not found: {cv_path}")
        return
    
    # Generate in sandbox
    result = await generator.generate_in_sandbox(cv_path)
    
    if result["success"]:
        logger.info("\n" + "="*60)
        logger.info("✅ SANDBOXED PORTFOLIO GENERATION COMPLETE!")
        logger.info("="*60)
        logger.tree("Results", [
            f"Job ID: {result['job_id']}",
            f"Sandbox: {result['sandbox_path']}",
            f"Portfolio: {result['portfolio_path']}"
        ])
        logger.info("\nThe portfolio is ready for preview in its isolated sandbox!")
    else:
        logger.error("Generation failed", details={"errors": result["errors"]})


if __name__ == "__main__":
    asyncio.run(main())