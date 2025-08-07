#!/usr/bin/env python3
"""
Unit tests for CV helper functions
Tests validate_filename, get_file_extension, get_mime_type
"""
import sys
import os
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from src.api.routes.cv import validate_filename, get_file_extension, get_mime_type


class TestValidateFilename:
    """Test filename validation for security"""
    
    def test_valid_filenames(self):
        """Test that valid filenames pass validation"""
        valid_names = [
            "resume.pdf",
            "John_Doe_CV.docx",
            "my-resume-2024.pdf",
            "CV with spaces.doc",
            "resume_v1.2.pdf",
            "file.name.with.dots.pdf"
        ]
        
        for filename in valid_names:
            assert validate_filename(filename) == True, f"Failed for: {filename}"
            
    def test_invalid_filenames_security(self):
        """Test that dangerous filenames are rejected"""
        dangerous_names = [
            "../../../etc/passwd",
            "..\\..\\windows\\system32",
            "resume/../secret.pdf",
            "/etc/passwd",
            "C:\\Windows\\System32\\config",
            "resume\\..\\..\\secret.pdf",
            "..",
            "....",
            "../",
            "..\\",
        ]
        
        for filename in dangerous_names:
            assert validate_filename(filename) == False, f"Should reject: {filename}"
            
    def test_invalid_filenames_format(self):
        """Test that invalid formats are rejected"""
        invalid_names = [
            "",  # Empty
            "   ",  # Whitespace only
            "a" * 300,  # Too long
            "file*name.pdf",  # Invalid chars
            "file?name.pdf",
            "file<name>.pdf",
            "file|name.pdf",
            "file:name.pdf",
            "file\"name.pdf",
        ]
        
        for filename in invalid_names:
            assert validate_filename(filename) == False, f"Should reject: {filename}"
            
    def test_edge_cases(self):
        """Test edge cases"""
        assert validate_filename(None) == False
        assert validate_filename("a") == True  # Single char
        assert validate_filename("a" * 255) == True  # Max length
        assert validate_filename("a" * 256) == False  # Over max


class TestGetFileExtension:
    """Test file extension extraction"""
    
    def test_normal_extensions(self):
        """Test common file extensions"""
        test_cases = [
            ("resume.pdf", ".pdf"),
            ("resume.PDF", ".pdf"),  # Case insensitive
            ("CV.docx", ".docx"),
            ("file.txt", ".txt"),
            ("image.png", ".png"),
            ("document.doc", ".doc"),
        ]
        
        for filename, expected in test_cases:
            assert get_file_extension(filename) == expected, f"Failed for {filename}"
            
    def test_multiple_dots(self):
        """Test files with multiple dots"""
        test_cases = [
            ("my.resume.pdf", ".pdf"),
            ("file.min.js", ".js"),
            ("archive.tar.gz", ".gz"),  # Gets last extension
            ("no.dots.in.name.docx", ".docx"),
        ]
        
        for filename, expected in test_cases:
            assert get_file_extension(filename) == expected, f"Failed for {filename}"
            
    def test_no_extension(self):
        """Test files without extensions"""
        test_cases = [
            ("README", ""),
            ("Makefile", ""),
            ("dockerfile", ""),
            (".gitignore", ""),  # Hidden file, no extension
        ]
        
        for filename, expected in test_cases:
            assert get_file_extension(filename) == expected, f"Failed for {filename}"
            
    def test_edge_cases(self):
        """Test edge cases"""
        assert get_file_extension("") == ""
        assert get_file_extension(None) == ""
        assert get_file_extension(".pdf") == ""  # Just extension
        assert get_file_extension("file.") == "."  # Trailing dot
        
    def test_path_objects(self):
        """Test with Path objects"""
        from pathlib import Path
        assert get_file_extension(Path("resume.pdf")) == ".pdf"
        assert get_file_extension(Path("my.resume.PDF")) == ".pdf"


class TestGetMimeType:
    """Test MIME type mapping"""
    
    def test_document_types(self):
        """Test document MIME types"""
        test_cases = [
            (".pdf", "application/pdf"),
            ("pdf", "application/pdf"),  # Without dot
            (".PDF", "application/pdf"),  # Case insensitive
            (".doc", "application/msword"),
            (".docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"),
            (".txt", "text/plain"),
            (".rtf", "application/rtf"),
            (".odt", "application/vnd.oasis.opendocument.text"),
        ]
        
        for ext, expected in test_cases:
            assert get_mime_type(ext) == expected, f"Failed for {ext}"
            
    def test_web_formats(self):
        """Test web format MIME types"""
        test_cases = [
            (".html", "text/html"),
            (".htm", "text/html"),
            (".md", "text/markdown"),
        ]
        
        for ext, expected in test_cases:
            assert get_mime_type(ext) == expected, f"Failed for {ext}"
            
    def test_image_types(self):
        """Test image MIME types"""
        test_cases = [
            (".jpg", "image/jpeg"),
            (".jpeg", "image/jpeg"),
            (".png", "image/png"),
            (".webp", "image/webp"),
            (".heic", "image/heic"),
            (".heif", "image/heif"),
            (".tiff", "image/tiff"),
            (".tif", "image/tiff"),
            (".bmp", "image/bmp"),
        ]
        
        for ext, expected in test_cases:
            assert get_mime_type(ext) == expected, f"Failed for {ext}"
            
    def test_unknown_types(self):
        """Test unknown file types"""
        unknown_types = [".xyz", ".abc", ".unknown", ".123"]
        
        for ext in unknown_types:
            assert get_mime_type(ext) == "application/octet-stream", f"Failed for {ext}"
            
    def test_edge_cases(self):
        """Test edge cases"""
        assert get_mime_type("") == "application/octet-stream"
        assert get_mime_type(None) == "application/octet-stream"
        assert get_mime_type(".") == "application/octet-stream"


def run_all_tests():
    """Run all test classes"""
    import pytest
    
    # Run with pytest if available
    try:
        pytest.main([__file__, "-v"])
    except ImportError:
        # Manual test running
        print("Running tests manually (install pytest for better output)")
        
        test_classes = [
            TestValidateFilename(),
            TestGetFileExtension(),
            TestGetMimeType()
        ]
        
        for test_class in test_classes:
            class_name = test_class.__class__.__name__
            print(f"\n{class_name}:")
            
            # Get all test methods
            test_methods = [method for method in dir(test_class) if method.startswith("test_")]
            
            for method_name in test_methods:
                try:
                    method = getattr(test_class, method_name)
                    method()
                    print(f"  ✅ {method_name}")
                except AssertionError as e:
                    print(f"  ❌ {method_name}: {e}")
                except Exception as e:
                    print(f"  ❌ {method_name}: Unexpected error: {e}")


if __name__ == "__main__":
    run_all_tests()