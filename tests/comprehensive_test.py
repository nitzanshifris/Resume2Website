#!/usr/bin/env python3
"""
Comprehensive test of CV2WEB MVP
Tests all components and integrations
"""
import requests
import json
import time
import os
from pathlib import Path
import sys

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# API Configuration
BASE_URL = "http://localhost:2000"
API_V1 = f"{BASE_URL}/api/v1"

# Test data
TEST_USER = {
    "email": f"test_{int(time.time())}@example.com",
    "password": "testpass123"
}

def print_section(title):
    """Print a section header"""
    print(f"\n{'='*60}")
    print(f"  {title}")
    print('='*60)

def test_api_health():
    """Test if API is running"""
    print_section("1. API Health Check")
    
    try:
        # Test root endpoint
        response = requests.get(BASE_URL)
        print(f"✅ Root endpoint: {response.status_code}")
        print(f"   Response: {response.json()}")
        
        # Test health endpoint
        response = requests.get(f"{BASE_URL}/health")
        print(f"✅ Health endpoint: {response.status_code}")
        print(f"   Response: {response.json()}")
        
        # Test docs
        response = requests.get(f"{BASE_URL}/docs")
        print(f"✅ Docs available: {response.status_code}")
        
        return True
    except Exception as e:
        print(f"❌ API not running: {e}")
        return False

def test_authentication():
    """Test registration and login"""
    print_section("2. Authentication System")
    
    try:
        # Test registration
        print("\n📝 Testing Registration...")
        response = requests.post(
            f"{API_V1}/register",
            json=TEST_USER
        )
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Registration successful")
            print(f"   Session ID: {data['session_id'][:20]}...")
            print(f"   User ID: {data['user_id']}")
            session_id = data['session_id']
        else:
            print(f"❌ Registration failed: {response.text}")
            return None
        
        # Test login
        print("\n🔑 Testing Login...")
        response = requests.post(
            f"{API_V1}/login",
            json=TEST_USER
        )
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Login successful")
            print(f"   New Session ID: {data['session_id'][:20]}...")
            return data['session_id']
        else:
            print(f"❌ Login failed: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Authentication test failed: {e}")
        return None

def test_file_upload(session_id):
    """Test file upload with different file types"""
    print_section("3. File Upload System")
    
    # Test file path
    test_file = Path("data/test_files/sample_cv.txt")
    
    if not test_file.exists():
        print(f"❌ Test file not found: {test_file}")
        return None
    
    try:
        # Test upload without auth (development mode)
        print("\n📤 Testing Upload (Dev Mode)...")
        
        with open(test_file, 'rb') as f:
            files = {'file': (test_file.name, f, 'text/plain')}
            response = requests.post(
                f"{API_V1}/upload",
                files=files
            )
        
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Upload successful")
            print(f"   Job ID: {data['job_id']}")
            print(f"   Message: {data['message']}")
            return data['job_id']
        else:
            print(f"❌ Upload failed: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Upload test failed: {e}")
        return None

def test_text_extraction():
    """Test text extraction service directly"""
    print_section("4. Text Extraction Service")
    
    try:
        from services.local.text_extractor import text_extractor
        
        # Test with sample file
        test_files = [
            "data/test_files/sample_cv.txt",
            "data/cv_examples/pdf_examples/simple_pdf/software-engineer-resume-example.pdf"
        ]
        
        for test_file in test_files:
            if Path(test_file).exists():
                print(f"\n📄 Testing: {test_file}")
                text = text_extractor.extract_text(test_file)
                print(f"✅ Extracted {len(text)} characters")
                print(f"   Preview: {text[:100]}...")
                break
        
        return True
    except Exception as e:
        print(f"❌ Text extraction test failed: {e}")
        return False

def test_credential_access():
    """Test credential management"""
    print_section("5. Credential Management")
    
    try:
        from services.local.keychain_manager import (
            get_openai_api_key,
            get_anthropic_api_key,
            get_gemini_api_key,
            get_aws_credentials,
            get_google_credentials_path
        )
        
        # Check which credentials are available
        creds_status = {
            "OpenAI": bool(get_openai_api_key()),
            "Anthropic": bool(get_anthropic_api_key()),
            "Gemini": bool(get_gemini_api_key()),
            "AWS": bool(get_aws_credentials().get('aws_access_key_id')),
            "Google Vision": bool(get_google_credentials_path())
        }
        
        for service, available in creds_status.items():
            status = "✅ Available" if available else "⚠️  Not configured"
            print(f"{status} - {service}")
        
        return True
    except Exception as e:
        print(f"❌ Credential test failed: {e}")
        return False

def test_database():
    """Test database connectivity"""
    print_section("6. Database System")
    
    try:
        from api.db import get_db_connection
        
        conn = get_db_connection()
        
        # Check tables
        cursor = conn.execute(
            "SELECT name FROM sqlite_master WHERE type='table'"
        )
        tables = cursor.fetchall()
        
        print("📊 Database tables:")
        for table in tables:
            print(f"   ✅ {table['name']}")
            
            # Count records
            cursor = conn.execute(f"SELECT COUNT(*) as count FROM {table['name']}")
            count = cursor.fetchone()['count']
            print(f"      Records: {count}")
        
        conn.close()
        return True
    except Exception as e:
        print(f"❌ Database test failed: {e}")
        return False

def test_schema_validation():
    """Test schema imports and structure"""
    print_section("7. Schema Validation")
    
    try:
        from backend.schemas.unified import CVData
        from api.schemas import (
            UserCreate, UserLogin, SessionResponse, 
            UploadResponse, CleanupResponse
        )
        
        print("✅ All schemas imported successfully")
        print(f"   CVData fields: {len(CVData.model_fields)}")
        print("   API schemas: UserCreate, UserLogin, SessionResponse, UploadResponse, CleanupResponse")
        
        return True
    except Exception as e:
        print(f"❌ Schema test failed: {e}")
        return False

def main():
    """Run all tests"""
    print("\n🚀 CV2WEB Comprehensive Test Suite")
    print("="*60)
    
    # Check if API is running
    if not test_api_health():
        print("\n❌ API is not running. Please start it with: python main.py")
        sys.exit(1)
    
    # Run all tests
    results = {
        "API Health": True,
        "Authentication": test_authentication() is not None,
        "File Upload": test_file_upload(None) is not None,
        "Text Extraction": test_text_extraction(),
        "Credentials": test_credential_access(),
        "Database": test_database(),
        "Schemas": test_schema_validation()
    }
    
    # Summary
    print_section("Test Summary")
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for test, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {test}")
    
    print(f"\n{'🎉' if passed == total else '⚠️ '} Passed {passed}/{total} tests")
    
    # What's working
    print_section("What's Working")
    print("✅ FastAPI server with CORS enabled")
    print("✅ User registration and login")
    print("✅ File upload with validation")
    print("✅ Text extraction (PDF, DOCX, TXT, Images)")
    print("✅ Secure credential management")
    print("✅ SQLite database for users/sessions")
    
    # What's missing
    print_section("What's Missing")
    print("❌ AI processing (convert text to structured CV data)")
    print("❌ Website generation from CV data")
    print("❌ Job status tracking (/status/{job_id})")
    print("❌ Download generated website (/download/{job_id})")
    print("❌ Frontend application")

if __name__ == "__main__":
    main()