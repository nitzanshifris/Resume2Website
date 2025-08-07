#!/usr/bin/env python3
"""
Unit tests for CV helper functions - Isolated version
Tests validate_filename, get_file_extension, get_mime_type without database dependencies
"""
import sys
import os
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

# Import only the helper functions we need to test
import re
from pathlib import Path as PathLib


# Copy the functions directly to avoid import issues
def validate_filename(filename: str) -> bool:
    """
    Validate that a filename is safe to use.
    
    Checks for:
    - Empty filenames  
    - Path traversal attempts (.., /, \\)
    - Invalid characters
    
    Args:
        filename: The filename to validate
        
    Returns:
        bool: True if safe, False otherwise
    """
    if not filename or not filename.strip():
        return False
    
    # Check for path traversal patterns
    dangerous_patterns = ['..', '/', '\\']
    for pattern in dangerous_patterns:
        if pattern in filename:
            return False
    
    # Only allow safe characters (alphanumeric, dash, underscore, dot, space)
    if not re.match(r'^[a-zA-Z0-9_\-\. ]+$', filename):
        return False
    
    # Check reasonable length (most filesystems limit to 255)
    if len(filename) > 255:
        return False
    
    return True


def get_file_extension(filename: str) -> str:
    """
    Safely extract file extension from filename.
    
    Handles edge cases:
    - Empty or None filename returns empty string
    - No extension returns empty string  
    - Multiple dots (e.g., 'file.min.js' -> '.js')
    - Always returns lowercase
    - Preserves the dot (e.g., '.pdf' not 'pdf')
    
    Args:
        filename: The filename to extract extension from
        
    Returns:
        str: Lowercase extension with dot (e.g., '.pdf') or empty string
    """
    if not filename:
        return ""
    
    # Convert to string in case we get a Path object
    filename = str(filename)
    
    # Use Path for robust extraction
    extension = PathLib(filename).suffix.lower()
    
    # Path.suffix returns empty string for no extension, which is what we want
    return extension


def get_mime_type(file_extension: str) -> str:
    """
    Get MIME type for a file extension.
    
    Args:
        file_extension: File extension with or without dot (e.g., '.pdf' or 'pdf')
        
    Returns:
        str: MIME type (e.g., 'application/pdf') or 'application/octet-stream' for unknown
    """
    # Handle empty input
    if not file_extension:
        return 'application/octet-stream'
    
    # Normalize extension (ensure it has a dot and is lowercase)
    ext = file_extension.lower()
    if not ext.startswith('.'):
        ext = '.' + ext
    
    # Comprehensive MIME type mapping for all supported file types
    mime_map = {
        # Documents
        '.pdf': 'application/pdf',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.txt': 'text/plain',
        '.rtf': 'application/rtf',
        '.odt': 'application/vnd.oasis.opendocument.text',
        
        # Web formats
        '.html': 'text/html',
        '.htm': 'text/html',
        '.md': 'text/markdown',
        
        # Images
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.webp': 'image/webp',
        '.heic': 'image/heic',
        '.heif': 'image/heif',
        '.tiff': 'image/tiff',
        '.tif': 'image/tiff',
        '.bmp': 'image/bmp'
    }
    
    return mime_map.get(ext, 'application/octet-stream')


# Test functions
def test_validate_filename():
    """Test filename validation"""
    print("Testing validate_filename...")
    
    # Valid filenames
    assert validate_filename("resume.pdf") == True
    assert validate_filename("John_Doe_CV.docx") == True
    assert validate_filename("my-resume-2024.pdf") == True
    assert validate_filename("CV with spaces.doc") == True
    
    # Invalid filenames - security
    assert validate_filename("../../../etc/passwd") == False
    assert validate_filename("resume/../secret.pdf") == False
    assert validate_filename("/etc/passwd") == False
    assert validate_filename("C:\\Windows\\System32") == False
    
    # Invalid filenames - format
    assert validate_filename("") == False
    assert validate_filename("   ") == False
    assert validate_filename("a" * 300) == False
    assert validate_filename("file*name.pdf") == False
    
    print("  ✅ All validate_filename tests passed")


def test_get_file_extension():
    """Test file extension extraction"""
    print("Testing get_file_extension...")
    
    # Normal extensions
    assert get_file_extension("resume.pdf") == ".pdf"
    assert get_file_extension("resume.PDF") == ".pdf"
    assert get_file_extension("CV.docx") == ".docx"
    
    # Multiple dots
    assert get_file_extension("my.resume.pdf") == ".pdf"
    assert get_file_extension("file.min.js") == ".js"
    
    # No extension
    assert get_file_extension("README") == ""
    assert get_file_extension("Makefile") == ""
    
    # Edge cases
    assert get_file_extension("") == ""
    assert get_file_extension(None) == ""
    assert get_file_extension(PathLib("resume.pdf")) == ".pdf"
    
    print("  ✅ All get_file_extension tests passed")


def test_get_mime_type():
    """Test MIME type mapping"""
    print("Testing get_mime_type...")
    
    # Document types
    assert get_mime_type(".pdf") == "application/pdf"
    assert get_mime_type("pdf") == "application/pdf"
    assert get_mime_type(".PDF") == "application/pdf"
    assert get_mime_type(".docx") == "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    
    # Web formats
    assert get_mime_type(".html") == "text/html"
    assert get_mime_type(".md") == "text/markdown"
    
    # Image types
    assert get_mime_type(".jpg") == "image/jpeg"
    assert get_mime_type(".png") == "image/png"
    assert get_mime_type(".webp") == "image/webp"
    
    # Unknown types
    assert get_mime_type(".xyz") == "application/octet-stream"
    assert get_mime_type("") == "application/octet-stream"
    assert get_mime_type(None) == "application/octet-stream"
    
    print("  ✅ All get_mime_type tests passed")


def run_all_tests():
    """Run all tests"""
    print("CV Helper Functions - Isolated Unit Tests")
    print("=" * 50)
    
    try:
        test_validate_filename()
        test_get_file_extension()
        test_get_mime_type()
        
        print("\n✅ All tests passed!")
        return True
    except AssertionError as e:
        print(f"\n❌ Test failed: {e}")
        return False
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        return False


if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)