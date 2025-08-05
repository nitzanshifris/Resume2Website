"""
Storage abstraction layer for K8s compatibility
Allows easy switch from local files to S3/GCS in the future
"""
import os
from pathlib import Path
from typing import Union, Optional

class StorageConfig:
    """Centralized storage configuration"""
    UPLOAD_PATH = os.getenv("UPLOAD_PATH", "data/uploads")
    PORTFOLIO_PATH = os.getenv("PORTFOLIO_PATH", "sandboxes/portfolios")
    TEMP_PATH = os.getenv("TEMP_PATH", "data/temp")
    
    @classmethod
    def ensure_directories(cls):
        """Ensure all storage directories exist"""
        for path in [cls.UPLOAD_PATH, cls.PORTFOLIO_PATH, cls.TEMP_PATH]:
            Path(path).mkdir(parents=True, exist_ok=True)

class Storage:
    """
    Simple storage abstraction - currently uses local filesystem
    but can be easily swapped for S3/GCS in production
    """
    
    @staticmethod
    def get_upload_path(filename: str) -> Path:
        """Get full path for uploaded file"""
        return Path(StorageConfig.UPLOAD_PATH) / filename
    
    @staticmethod
    def get_portfolio_path(portfolio_id: str) -> Path:
        """Get full path for portfolio sandbox"""
        return Path(StorageConfig.PORTFOLIO_PATH) / portfolio_id
    
    @staticmethod
    def get_temp_path(filename: str) -> Path:
        """Get full path for temporary file"""
        return Path(StorageConfig.TEMP_PATH) / filename
    
    @staticmethod
    async def save_file(content: bytes, path: Union[str, Path]) -> Path:
        """
        Save file content to storage
        In K8s, this would upload to S3/GCS instead
        """
        path = Path(path)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(content)
        return path
    
    @staticmethod
    async def read_file(path: Union[str, Path]) -> bytes:
        """
        Read file content from storage
        In K8s, this would download from S3/GCS instead
        """
        return Path(path).read_bytes()
    
    @staticmethod
    async def delete_file(path: Union[str, Path]) -> bool:
        """
        Delete file from storage
        In K8s, this would delete from S3/GCS instead
        """
        path = Path(path)
        if path.exists():
            path.unlink()
            return True
        return False
    
    @staticmethod
    def file_exists(path: Union[str, Path]) -> bool:
        """Check if file exists in storage"""
        return Path(path).exists()

# Initialize storage directories on import
StorageConfig.ensure_directories()