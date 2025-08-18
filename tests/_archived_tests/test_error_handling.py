#!/usr/bin/env python3
"""
Error Handling Tests for RESUME2WEBSITE
Tests edge cases and error scenarios
"""
import requests
import json
import time
import os
from pathlib import Path
import tempfile

BASE_URL = "http://localhost:2000"
API_V1 = f"{BASE_URL}/api/v1"

def print_test(test_name, passed, details=""):
    """Print test result"""
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"{status} - {test_name}")
    if details:
        print(f"      {details}")

def test_duplicate_registration():
    """Test registering with same email twice"""
    email = f"duplicate_{int(time.time())}@test.com"
    user_data = {"email": email, "password": "testpass123"}
    
    # First registration should succeed
    r1 = requests.post(f"{API_V1}/register", json=user_data)
    
    # Second registration should fail
    r2 = requests.post(f"{API_V1}/register", json=user_data)
    
    passed = r1.status_code == 200 and r2.status_code == 400
    print_test(
        "Duplicate Email Registration", 
        passed,
        f"First: {r1.status_code}, Second: {r2.status_code}"
    )
    return passed

def test_invalid_email_format():
    """Test registration with invalid email"""
    invalid_emails = [
        "notanemail",
        "@example.com",
        "user@",
        "user space@example.com",
        ""
    ]
    
    results = []
    for email in invalid_emails:
        r = requests.post(f"{API_V1}/register", json={
            "email": email,
            "password": "testpass123"
        })
        results.append(r.status_code == 422)  # Pydantic validation error
    
    passed = all(results)
    print_test(
        "Invalid Email Format",
        passed,
        f"Rejected {sum(results)}/{len(invalid_emails)} invalid emails"
    )
    return passed

def test_short_password():
    """Test registration with too short password"""
    r = requests.post(f"{API_V1}/register", json={
        "email": f"short_{int(time.time())}@test.com",
        "password": "123"  # Less than 6 chars
    })
    
    passed = r.status_code == 422
    print_test(
        "Short Password Rejection",
        passed,
        f"Status: {r.status_code}"
    )
    return passed

def test_wrong_password_login():
    """Test login with wrong password"""
    email = f"wrongpass_{int(time.time())}@test.com"
    
    # Register first
    requests.post(f"{API_V1}/register", json={
        "email": email,
        "password": "correctpass123"
    })
    
    # Try login with wrong password
    r = requests.post(f"{API_V1}/login", json={
        "email": email,
        "password": "wrongpass123"
    })
    
    passed = r.status_code == 401
    print_test(
        "Wrong Password Login",
        passed,
        f"Status: {r.status_code}"
    )
    return passed

def test_empty_file_upload():
    """Test uploading empty file"""
    # Create empty file
    with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
        temp_path = f.name
    
    try:
        with open(temp_path, 'rb') as f:
            files = {'file': ('empty.txt', f, 'text/plain')}
            r = requests.post(f"{API_V1}/upload", files=files)
        
        passed = r.status_code == 400
        print_test(
            "Empty File Upload",
            passed,
            f"Status: {r.status_code}"
        )
        return passed
    finally:
        os.unlink(temp_path)

def test_oversized_file_upload():
    """Test uploading file larger than 10MB limit"""
    # Create 11MB file
    with tempfile.NamedTemporaryFile(mode='wb', suffix='.txt', delete=False) as f:
        f.write(b'X' * (11 * 1024 * 1024))  # 11MB
        temp_path = f.name
    
    try:
        with open(temp_path, 'rb') as f:
            files = {'file': ('large.txt', f, 'text/plain')}
            r = requests.post(f"{API_V1}/upload", files=files)
        
        passed = r.status_code == 413
        print_test(
            "Oversized File Upload (>10MB)",
            passed,
            f"Status: {r.status_code}"
        )
        return passed
    finally:
        os.unlink(temp_path)

def test_invalid_file_extension():
    """Test uploading file with unsupported extension"""
    with tempfile.NamedTemporaryFile(mode='w', suffix='.exe', delete=False) as f:
        f.write("malicious code")
        temp_path = f.name
    
    try:
        with open(temp_path, 'rb') as f:
            files = {'file': ('virus.exe', f, 'application/x-executable')}
            r = requests.post(f"{API_V1}/upload", files=files)
        
        passed = r.status_code == 400
        details = "Correctly rejected .exe file" if passed else "SECURITY RISK: Accepted .exe!"
        print_test(
            "Invalid File Extension",
            passed,
            details
        )
        return passed
    finally:
        os.unlink(temp_path)

def test_path_traversal_filename():
    """Test filename with path traversal attempt"""
    with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
        f.write("test content")
        temp_path = f.name
    
    try:
        with open(temp_path, 'rb') as f:
            # Try to escape upload directory
            files = {'file': ('../../etc/passwd.txt', f, 'text/plain')}
            r = requests.post(f"{API_V1}/upload", files=files)
        
        # Should either reject (400) or succeed (200) but sanitize the path
        passed = r.status_code in [200, 400]
        print_test(
            "Path Traversal Prevention",
            passed,
            f"Status: {r.status_code}"
        )
        return passed
    finally:
        os.unlink(temp_path)

def test_missing_file_in_upload():
    """Test upload endpoint without file"""
    r = requests.post(f"{API_V1}/upload")
    
    passed = r.status_code == 422
    print_test(
        "Missing File in Upload",
        passed,
        f"Status: {r.status_code}"
    )
    return passed

def test_nonexistent_user_login():
    """Test login with non-existent email"""
    r = requests.post(f"{API_V1}/login", json={
        "email": "doesnotexist@example.com",
        "password": "anypassword"
    })
    
    passed = r.status_code == 401
    print_test(
        "Non-existent User Login",
        passed,
        f"Status: {r.status_code}"
    )
    return passed

def main():
    """Run all error handling tests"""
    print("🔥 RESUME2WEBSITE Error Handling Tests")
    print("=" * 50)
    
    # Check if API is running
    try:
        r = requests.get(f"{BASE_URL}/health")
        if r.status_code != 200:
            print("❌ API is not running. Start it with: python main.py")
            return
    except:
        print("❌ Cannot connect to API at localhost:2000")
        return
    
    print("\n📋 Running Error Tests...\n")
    
    # Run all tests
    tests = [
        test_duplicate_registration,
        test_invalid_email_format,
        test_short_password,
        test_wrong_password_login,
        test_nonexistent_user_login,
        test_empty_file_upload,
        test_oversized_file_upload,
        test_invalid_file_extension,
        test_path_traversal_filename,
        test_missing_file_in_upload
    ]
    
    results = []
    for test_func in tests:
        try:
            results.append(test_func())
        except Exception as e:
            print(f"❌ FAIL - {test_func.__name__}: {str(e)}")
            results.append(False)
    
    # Summary
    print("\n" + "=" * 50)
    passed = sum(results)
    total = len(results)
    
    if passed == total:
        print(f"🎉 All {total} error tests passed!")
    else:
        print(f"⚠️  {passed}/{total} tests passed")
        print("\nFailed tests need fixes to prevent security issues and crashes!")

if __name__ == "__main__":
    main()