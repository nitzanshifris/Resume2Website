"""
Temporary directory utilities for portfolio generation.

Provides context managers and utilities for handling temporary files
and directories during portfolio generation.
"""
import logging
import shutil
import tempfile
from contextlib import contextmanager
from pathlib import Path
from typing import Optional, Generator

logger = logging.getLogger(__name__)


class TempDirectoryManager:
    """Manager for temporary directories with automatic cleanup."""
    
    def __init__(self, base_dir: Optional[Path] = None):
        """
        Initialize the manager.
        
        Args:
            base_dir: Base directory for temp files (uses system temp if None)
        """
        self.base_dir = base_dir or Path(tempfile.gettempdir())
        self.active_dirs: List[Path] = []
    
    @contextmanager
    def create_temp_dir(
        self, 
        prefix: str = "portfolio_",
        cleanup: bool = True
    ) -> Generator[Path, None, None]:
        """
        Create a temporary directory with automatic cleanup.
        
        Args:
            prefix: Prefix for the directory name
            cleanup: Whether to cleanup on exit
            
        Yields:
            Path to the temporary directory
        """
        temp_dir = Path(tempfile.mkdtemp(prefix=prefix, dir=self.base_dir))
        self.active_dirs.append(temp_dir)
        
        logger.debug(f"Created temp directory: {temp_dir}")
        
        try:
            yield temp_dir
        finally:
            if cleanup and temp_dir.exists():
                try:
                    shutil.rmtree(temp_dir)
                    logger.debug(f"Cleaned up temp directory: {temp_dir}")
                except Exception as e:
                    logger.error(f"Failed to cleanup temp directory {temp_dir}: {e}")
                    
            if temp_dir in self.active_dirs:
                self.active_dirs.remove(temp_dir)
    
    def cleanup_all(self):
        """Clean up all active temporary directories."""
        for temp_dir in self.active_dirs[:]:
            if temp_dir.exists():
                try:
                    shutil.rmtree(temp_dir)
                    logger.debug(f"Cleaned up temp directory: {temp_dir}")
                except Exception as e:
                    logger.error(f"Failed to cleanup temp directory {temp_dir}: {e}")
                    
        self.active_dirs.clear()


@contextmanager
def temp_file(
    suffix: str = "",
    prefix: str = "portfolio_",
    dir: Optional[Path] = None,
    delete: bool = True
) -> Generator[Path, None, None]:
    """
    Create a temporary file with automatic cleanup.
    
    Args:
        suffix: File suffix
        prefix: File prefix
        dir: Directory for the file
        delete: Whether to delete on exit
        
    Yields:
        Path to the temporary file
    """
    fd, path = tempfile.mkstemp(suffix=suffix, prefix=prefix, dir=dir)
    file_path = Path(path)
    
    try:
        yield file_path
    finally:
        try:
            import os
            os.close(fd)
        except:
            pass
            
        if delete and file_path.exists():
            try:
                file_path.unlink()
            except Exception as e:
                logger.error(f"Failed to delete temp file {file_path}: {e}")