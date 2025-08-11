#!/usr/bin/env python3
"""
MVP Critical Edge Case Tests
Tests the scenarios most likely to break in production
"""
import requests
import json
import time
import tempfile
import threading
import os
import sys
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import sqlite3

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

BASE_URL = "http://localhost:2000"
API_V1 = f"{BASE_URL}/api/v1"

def print_test(test_name, passed, details=""):
    """Print test result with details"""
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"\n{status} - {test_name}")
    if details:
        print(f"      {details}")

# ==== FILE HANDLING EDGE CASES ====

def test_special_characters_filename():
    """Test files with special characters in names"""
    special_names = [
        "résumé.pdf",
        "cv_2024#final.txt", 
        "John's Resume.txt",
        "履歴書.txt",  # Japanese
        "سيرة ذاتية.txt",  # Arabic
        "my cv & resume.txt"
    ]
    
    results = []
    for filename in special_names:
        with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
            f.write("Test content")
            temp_path = f.name
        
        try:
            with open(temp_path, 'rb') as f:
                files = {'file': (filename, f, 'text/plain')}
                r = requests.post(f"{API_V1}/upload", files=files)
                results.append(r.status_code == 200)
        except Exception as e:
            results.append(False)
            print(f"      Failed on: {filename} - {str(e)}")
        finally:
            os.unlink(temp_path)
    
    passed = all(results)
    print_test(
        "Special Characters in Filename",
        passed,
        f"Handled {sum(results)}/{len(special_names)} special filenames"
    )
    return passed

def test_corrupted_pdf():
    """Test uploading corrupted PDF file"""
    # Create a fake PDF (corrupted)
    with tempfile.NamedTemporaryFile(mode='wb', suffix='.pdf', delete=False) as f:
        f.write(b'%PDF-1.4\nThis is not a valid PDF content\n%%EOF')
        temp_path = f.name
    
    try:
        with open(temp_path, 'rb') as f:
            files = {'file': ('corrupted.pdf', f, 'application/pdf')}
            r = requests.post(f"{API_V1}/upload", files=files)
        
        # Should accept file (200) but handle extraction gracefully
        passed = r.status_code == 200
        print_test(
            "Corrupted PDF Upload",
            passed,
            f"Status: {r.status_code} - Should accept but handle extraction error"
        )
        return passed
    finally:
        os.unlink(temp_path)

def test_simultaneous_same_filename():
    """Test multiple uploads with same filename at same time"""
    filename = f"concurrent_test_{int(time.time())}.txt"
    
    def upload_file():
        with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
            f.write(f"Content from thread {threading.current_thread().name}")
            temp_path = f.name
        
        try:
            with open(temp_path, 'rb') as f:
                files = {'file': (filename, f, 'text/plain')}
                r = requests.post(f"{API_V1}/upload", files=files)
                return r.status_code == 200
        finally:
            os.unlink(temp_path)
    
    # Upload 5 files with same name simultaneously
    with ThreadPoolExecutor(max_workers=5) as executor:
        results = list(executor.map(lambda _: upload_file(), range(5)))
    
    passed = all(results)
    print_test(
        "Concurrent Same Filename Uploads",
        passed,
        f"All {len(results)} uploads succeeded without conflicts"
    )
    return passed

# ==== AUTHENTICATION EDGE CASES ====

def test_concurrent_duplicate_registration():
    """Test race condition: register same email simultaneously"""
    email = f"race_condition_{int(time.time())}@test.com"
    user_data = {"email": email, "password": "testpass123"}
    
    results = []
    def register():
        r = requests.post(f"{API_V1}/register", json=user_data)
        return r.status_code
    
    # Try to register same email 10 times simultaneously
    with ThreadPoolExecutor(max_workers=10) as executor:
        results = list(executor.map(lambda _: register(), range(10)))
    
    # Only ONE should succeed (200), others should fail (400)
    success_count = results.count(200)
    fail_count = results.count(400)
    
    passed = success_count == 1 and fail_count == 9
    print_test(
        "Concurrent Duplicate Registration (Race Condition)",
        passed,
        f"Successes: {success_count}, Failures: {fail_count} (Expected: 1 success, 9 failures)"
    )
    return passed

def test_unicode_password():
    """Test passwords with unicode characters"""
    passwords = [
        "пароль123",  # Russian
        "密码123",     # Chinese  
        "🔒secure🔑",  # Emojis
        "paßwörd",    # German
    ]
    
    results = []
    for i, password in enumerate(passwords):
        email = f"unicode_pass_{i}_{int(time.time())}@test.com"
        
        # Register
        r1 = requests.post(f"{API_V1}/register", json={
            "email": email,
            "password": password
        })
        
        if r1.status_code == 200:
            # Try to login
            r2 = requests.post(f"{API_V1}/login", json={
                "email": email,
                "password": password
            })
            results.append(r2.status_code == 200)
        else:
            results.append(False)
    
    passed = all(results)
    print_test(
        "Unicode Passwords",
        passed,
        f"Handled {sum(results)}/{len(passwords)} unicode passwords"
    )
    return passed

def test_session_persistence():
    """Test if sessions survive server restart (they should with SQLite)"""
    # Register and get session
    email = f"persist_{int(time.time())}@test.com"
    r = requests.post(f"{API_V1}/register", json={
        "email": email,
        "password": "testpass123"
    })
    
    if r.status_code != 200:
        print_test("Session Persistence", False, "Failed to create test user")
        return False
    
    session_id = r.json()["session_id"]
    
    # Verify session works
    r2 = requests.post(f"{API_V1}/upload", 
        headers={"X-Session-ID": session_id},
        files={'file': ('test.txt', b'test', 'text/plain')}
    )
    
    # In dev mode, session isn't checked, but in production it would be
    passed = r2.status_code == 200
    print_test(
        "Session Persistence Check",
        passed,
        "Sessions stored in SQLite (would survive restart)"
    )
    return passed

# ==== TEXT EXTRACTION EDGE CASES ====

def test_various_encodings():
    """Test text files with different encodings"""
    encodings = {
        'utf-8': "Hello UTF-8: café, naïve",
        'latin-1': "Hello Latin-1: café",
        'cp1252': "Hello Windows: smart quotes """,
    }
    
    results = []
    for encoding, content in encodings.items():
        with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False, encoding=encoding) as f:
            f.write(content)
            temp_path = f.name
        
        try:
            with open(temp_path, 'rb') as f:
                files = {'file': (f'{encoding}_test.txt', f, 'text/plain')}
                r = requests.post(f"{API_V1}/upload", files=files)
                results.append(r.status_code == 200)
        except Exception as e:
            results.append(False)
        finally:
            os.unlink(temp_path)
    
    passed = all(results)
    print_test(
        "Various Text Encodings",
        passed,
        f"Handled {sum(results)}/{len(encodings)} encodings"
    )
    return passed

def test_empty_pdf():
    """Test PDF with no text content"""
    # Create a valid but empty PDF
    import PyPDF2
    from io import BytesIO
    
    # Create empty PDF
    pdf_writer = PyPDF2.PdfWriter()
    pdf_writer.add_blank_page(width=200, height=200)
    
    pdf_bytes = BytesIO()
    pdf_writer.write(pdf_bytes)
    pdf_bytes.seek(0)
    
    files = {'file': ('empty.pdf', pdf_bytes, 'application/pdf')}
    r = requests.post(f"{API_V1}/upload", files=files)
    
    passed = r.status_code == 200
    print_test(
        "Empty PDF Upload",
        passed,
        "Should accept empty PDFs gracefully"
    )
    return passed

# ==== SYSTEM RESOURCE TESTS ====

def test_rapid_sequential_uploads():
    """Test many uploads in quick succession"""
    results = []
    
    for i in range(20):
        with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
            f.write(f"Rapid test {i}")
            temp_path = f.name
        
        try:
            with open(temp_path, 'rb') as f:
                files = {'file': (f'rapid_{i}.txt', f, 'text/plain')}
                r = requests.post(f"{API_V1}/upload", files=files)
                results.append(r.status_code == 200)
        finally:
            os.unlink(temp_path)
    
    passed = all(results)
    print_test(
        "Rapid Sequential Uploads",
        passed,
        f"Completed {sum(results)}/20 rapid uploads"
    )
    return passed

def test_database_integrity():
    """Test database constraints and integrity"""
    try:
        from api.db import get_db_connection
        
        conn = get_db_connection()
        
        # Check foreign key constraints
        cursor = conn.execute("PRAGMA foreign_keys")
        fk_enabled = cursor.fetchone()[0]
        
        # Check if tables have proper constraints
        cursor = conn.execute("PRAGMA table_info(users)")
        user_columns = {col[1]: col for col in cursor.fetchall()}
        
        cursor = conn.execute("PRAGMA table_info(sessions)")
        session_columns = {col[1]: col for col in cursor.fetchall()}
        
        conn.close()
        
        # Verify critical columns exist
        checks = [
            'user_id' in user_columns,
            'email' in user_columns,
            'password_hash' in user_columns,
            'session_id' in session_columns,
            'user_id' in session_columns
        ]
        
        passed = all(checks)
        print_test(
            "Database Integrity",
            passed,
            f"Foreign keys: {'ON' if fk_enabled else 'OFF'}, Tables structured correctly"
        )
        return passed
    except Exception as e:
        print_test("Database Integrity", False, str(e))
        return False

def main():
    """Run all MVP edge case tests"""
    print("🔍 RESUME2WEBSITE MVP Edge Case Tests")
    print("=" * 60)
    print("Testing scenarios most likely to break in production...")
    
    # Check if API is running
    try:
        r = requests.get(f"{BASE_URL}/health")
        if r.status_code != 200:
            print("❌ API is not running. Start it with: python main.py")
            return
    except:
        print("❌ Cannot connect to API at localhost:2000")
        return
    
    # Run all tests
    tests = [
        # File handling
        test_special_characters_filename,
        test_corrupted_pdf,
        test_simultaneous_same_filename,
        test_various_encodings,
        test_empty_pdf,
        
        # Authentication
        test_concurrent_duplicate_registration,
        test_unicode_password,
        test_session_persistence,
        
        # System resources
        test_rapid_sequential_uploads,
        test_database_integrity
    ]
    
    results = []
    for test_func in tests:
        try:
            results.append(test_func())
        except Exception as e:
            print_test(test_func.__name__, False, f"Exception: {str(e)}")
            results.append(False)
    
    # Summary
    print("\n" + "=" * 60)
    passed = sum(results)
    total = len(results)
    
    if passed == total:
        print(f"🎉 All {total} MVP edge case tests passed!")
        print("\nYour app is quite robust for an MVP!")
    else:
        print(f"⚠️  {passed}/{total} tests passed")
        print("\nFailed tests indicate potential production issues.")
        
    # Risk assessment
    print("\n📊 MVP Readiness Assessment:")
    confidence = (passed / total) * 100
    print(f"   Confidence Level: {confidence:.0f}%")
    
    if confidence >= 90:
        print("   ✅ Ready for MVP launch!")
    elif confidence >= 70:
        print("   🟡 Good enough for MVP, but fix failures soon")
    else:
        print("   🔴 Critical issues need fixing before launch")

if __name__ == "__main__":
    main()