"""
ZIP utilities for portfolio packaging.

Provides functions for creating ZIP archives of generated portfolios.
"""
import logging
import zipfile
from pathlib import Path
from typing import List, Optional

logger = logging.getLogger(__name__)


def create_portfolio_zip(
    source_dir: Path,
    output_path: Path,
    exclude_patterns: Optional[List[str]] = None
) -> Path:
    """
    Create a ZIP archive of a portfolio directory.
    
    Args:
        source_dir: Directory containing the portfolio
        output_path: Path for the output ZIP file
        exclude_patterns: List of patterns to exclude (e.g., "node_modules", "*.log")
        
    Returns:
        Path to the created ZIP file
    """
    exclude_patterns = exclude_patterns or [
        "node_modules",
        ".next",
        ".git",
        "*.log",
        ".DS_Store",
        "__pycache__",
        "*.pyc"
    ]
    
    logger.info(f"Creating ZIP archive: {output_path}")
    
    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for file_path in source_dir.rglob('*'):
            # Skip directories
            if file_path.is_dir():
                continue
                
            # Check exclusions
            relative_path = file_path.relative_to(source_dir)
            if _should_exclude(relative_path, exclude_patterns):
                continue
                
            # Add file to archive
            arcname = str(relative_path)
            zipf.write(file_path, arcname)
            
    logger.info(f"ZIP archive created: {output_path} ({output_path.stat().st_size} bytes)")
    return output_path


def _should_exclude(path: Path, patterns: List[str]) -> bool:
    """
    Check if a path should be excluded based on patterns.
    
    Args:
        path: Path to check
        patterns: List of exclusion patterns
        
    Returns:
        True if path should be excluded
    """
    path_str = str(path)
    
    for pattern in patterns:
        if pattern.startswith("*"):
            # Extension pattern
            if path_str.endswith(pattern[1:]):
                return True
        elif pattern in path.parts:
            # Directory pattern
            return True
        elif pattern in path_str:
            # General pattern
            return True
            
    return False


def extract_portfolio_zip(
    zip_path: Path,
    output_dir: Path,
    overwrite: bool = False
) -> Path:
    """
    Extract a portfolio ZIP archive.
    
    Args:
        zip_path: Path to the ZIP file
        output_dir: Directory to extract to
        overwrite: Whether to overwrite existing files
        
    Returns:
        Path to the extracted directory
    """
    if not zip_path.exists():
        raise FileNotFoundError(f"ZIP file not found: {zip_path}")
        
    if output_dir.exists() and not overwrite:
        raise FileExistsError(f"Output directory already exists: {output_dir}")
        
    logger.info(f"Extracting ZIP archive: {zip_path} to {output_dir}")
    
    output_dir.mkdir(parents=True, exist_ok=True)
    
    with zipfile.ZipFile(zip_path, 'r') as zipf:
        zipf.extractall(output_dir)
        
    logger.info(f"Extraction complete: {output_dir}")
    return output_dir