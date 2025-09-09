"""
Simple file validation for security
Prevents processing of potentially malicious files
"""
import logging
import uuid
from typing import BinaryIO, Optional, Tuple
import magic
from pathlib import Path

logger = logging.getLogger(__name__)

# File type configuration
ALLOWED_MIME_TYPES = {
    'application/pdf',
    'application/msword',  # .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',  # .docx
    'text/plain',  # .txt
    'text/rtf',
    'application/rtf',
    'image/png',
    'image/jpeg',
    'image/webp'
}

ALLOWED_EXTENSIONS = {'.pdf', '.doc', '.docx', '.txt', '.rtf', '.png', '.jpg', '.jpeg', '.webp'}

# Maximum file size (10 MB default, can be overridden by settings)
try:
    from src.core.settings import settings
    MAX_FILE_SIZE = settings.max_file_size_mb * 1024 * 1024
except ImportError:
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB in bytes


def validate_file_content(file_bytes: bytes) -> Tuple[bool, str]:
    """
    Validate file content using magic bytes (file signature).
    
    Args:
        file_bytes: The file content as bytes
        
    Returns:
        Tuple of (is_valid, mime_type)
    """
    try:
        # Check magic bytes to determine actual file type
        mime_type = magic.from_buffer(file_bytes, mime=True)
        
        if mime_type not in ALLOWED_MIME_TYPES:
            logger.warning(f"Rejected file with MIME type: {mime_type}")
            return False, mime_type
        
        # Extra hardening for PDFs - check signature
        if mime_type == 'application/pdf':
            if not file_bytes.startswith(b'%PDF-'):
                logger.warning("PDF file missing proper %PDF- signature")
                return False, mime_type
            
        return True, mime_type
    except Exception as e:
        logger.error(f"Error validating file content: {e}")
        return False, "unknown"


def validate_file_extension(filename: str) -> bool:
    """
    Validate file extension.
    
    Args:
        filename: The filename to validate
        
    Returns:
        True if extension is allowed, False otherwise
    """
    file_ext = Path(filename).suffix.lower()
    return file_ext in ALLOWED_EXTENSIONS


def validate_file_size(file_bytes: bytes, max_size: Optional[int] = None) -> bool:
    """
    Validate file size.
    
    Args:
        file_bytes: The file content as bytes
        max_size: Maximum allowed size in bytes (uses MAX_FILE_SIZE if not provided)
        
    Returns:
        True if file size is within limits, False otherwise
    """
    max_allowed = max_size or MAX_FILE_SIZE
    file_size = len(file_bytes)
    
    if file_size > max_allowed:
        logger.warning(f"Rejected file with size {file_size} bytes (max: {max_allowed})")
        return False
        
    return True


def validate_uploaded_file(
    file_bytes: bytes, 
    filename: str,
    max_size: Optional[int] = None
) -> Tuple[bool, str, str]:
    """
    Perform complete validation of an uploaded file.
    
    Args:
        file_bytes: The file content as bytes
        filename: The original filename
        max_size: Maximum allowed size in bytes
        
    Returns:
        Tuple of (is_valid, error_message, mime_type)
    """
    # Check file extension
    if not validate_file_extension(filename):
        return False, f"File type not allowed. Supported types: {', '.join(ALLOWED_EXTENSIONS)}", ""
    
    # Check file size
    if not validate_file_size(file_bytes, max_size):
        max_mb = (max_size or MAX_FILE_SIZE) / (1024 * 1024)
        return False, f"File too large. Maximum size: {max_mb:.1f} MB", ""
    
    # Check file content (magic bytes)
    is_valid, mime_type = validate_file_content(file_bytes)
    if not is_valid:
        return False, "File content does not match allowed types", mime_type
    
    return True, "", mime_type


def sanitize_filename(filename: str) -> str:
    """
    Sanitize filename to prevent directory traversal and other attacks.
    
    Args:
        filename: The original filename
        
    Returns:
        Sanitized filename
    """
    # Get just the filename without any path components
    filename = Path(filename).name
    
    # Remove any potentially dangerous characters
    # Keep only alphanumeric, dash, underscore, and dot
    import re
    sanitized = re.sub(r'[^a-zA-Z0-9._-]', '_', filename)
    
    # Ensure it doesn't start with a dot (hidden file)
    if sanitized.startswith('.'):
        sanitized = '_' + sanitized[1:]
    
    # Limit filename length
    max_length = 255
    if len(sanitized) > max_length:
        # Keep extension if possible
        name, ext = Path(sanitized).stem, Path(sanitized).suffix
        max_name_length = max_length - len(ext)
        sanitized = name[:max_name_length] + ext
    
    return sanitized


def generate_safe_filename(original_filename: str) -> str:
    """
    Generate a UUID-based filename while preserving the file extension.
    This provides maximum security by eliminating any user-controlled filename components.
    
    Args:
        original_filename: The original filename (used only for extension)
        
    Returns:
        UUID-based filename with original extension
    """
    # Get the file extension
    ext = Path(original_filename).suffix.lower()
    
    # Validate extension
    if ext not in ALLOWED_EXTENSIONS:
        ext = '.bin'  # Default safe extension
    
    # Generate UUID-based filename
    safe_name = f"{uuid.uuid4().hex}{ext}"
    
    return safe_name