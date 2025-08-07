#!/usr/bin/env python3
"""
Unit tests for CV authentication functions
Tests password hashing and verification
"""
import sys
import os
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from src.api.routes.cv import hash_password, verify_password


class TestPasswordHashing:
    """Test password hashing and verification"""
    
    def test_hash_password_basic(self):
        """Test basic password hashing"""
        password = "MySecurePassword123!"
        hashed = hash_password(password)
        
        # Hash should be different from original
        assert hashed != password
        
        # Hash should be consistent format (bcrypt)
        assert hashed.startswith("$2b$") or hashed.startswith("$2a$")
        
        # Hash should be reasonable length
        assert len(hashed) > 50
        
    def test_hash_different_passwords(self):
        """Test that different passwords produce different hashes"""
        password1 = "Password123"
        password2 = "Password124"
        
        hash1 = hash_password(password1)
        hash2 = hash_password(password2)
        
        assert hash1 != hash2
        
    def test_hash_same_password_different_salts(self):
        """Test that same password produces different hashes (due to salt)"""
        password = "SamePassword123"
        
        hash1 = hash_password(password)
        hash2 = hash_password(password)
        
        # Bcrypt uses random salt, so hashes should differ
        assert hash1 != hash2
        
    def test_verify_password_correct(self):
        """Test password verification with correct password"""
        password = "CorrectPassword123!"
        hashed = hash_password(password)
        
        assert verify_password(password, hashed) == True
        
    def test_verify_password_incorrect(self):
        """Test password verification with incorrect password"""
        password = "CorrectPassword123!"
        wrong_password = "WrongPassword123!"
        hashed = hash_password(password)
        
        assert verify_password(wrong_password, hashed) == False
        
    def test_verify_password_case_sensitive(self):
        """Test that password verification is case sensitive"""
        password = "CaseSensitive123"
        hashed = hash_password(password)
        
        assert verify_password("casesensitive123", hashed) == False
        assert verify_password("CASESENSITIVE123", hashed) == False
        assert verify_password("CaseSensitive123", hashed) == True
        
    def test_special_characters_in_password(self):
        """Test passwords with special characters"""
        special_passwords = [
            "Pass@word!123",
            "P@$$w0rd!",
            "Password with spaces",
            "🔒SecurePassword",  # Unicode
            "Password\nNewline",  # Newline
            "Tab\tPassword",  # Tab
            "Quote\"Password'123",  # Quotes
        ]
        
        for password in special_passwords:
            hashed = hash_password(password)
            assert verify_password(password, hashed) == True
            assert verify_password(password + "x", hashed) == False
            
    def test_empty_password(self):
        """Test handling of empty passwords"""
        # Should still hash empty password (validation is done elsewhere)
        hashed = hash_password("")
        assert hashed != ""
        assert verify_password("", hashed) == True
        assert verify_password("not empty", hashed) == False
        
    def test_long_password(self):
        """Test handling of very long passwords"""
        # Bcrypt has a 72-byte limit, passwords longer are truncated
        long_password = "a" * 100
        hashed = hash_password(long_password)
        
        assert verify_password(long_password, hashed) == True
        # Bcrypt truncates at 72 bytes, so removing chars past that won't matter
        assert verify_password(long_password[:72], hashed) == True
        # But changing within first 72 chars should fail
        assert verify_password("b" + long_password[1:71], hashed) == False


def run_all_tests():
    """Run all test classes"""
    import pytest
    
    # Run with pytest if available
    try:
        pytest.main([__file__, "-v"])
    except ImportError:
        # Manual test running
        print("Running tests manually (install pytest for better output)")
        
        test_class = TestPasswordHashing()
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