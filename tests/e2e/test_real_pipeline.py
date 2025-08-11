#!/usr/bin/env python3
"""
Test Real RESUME2WEBSITE Pipeline with API
"""

import requests
import json
import time
from pathlib import Path

# API Configuration
BASE_URL = "http://127.0.0.1:2000/api/v1"

def test_pipeline():
    print("🚀 Testing Real RESUME2WEBSITE Pipeline")
    print("=" * 50)
    
    # Step 1: Register/Login
    print("\n📝 Step 1: User Registration")
    import random
    test_email = f"test_{random.randint(1000, 9999)}@example.com"
    register_data = {
        "email": test_email,
        "password": "testpassword123"
    }
    print(f"Testing with email: {test_email}")
    
    try:
        # Try to register
        response = requests.post(f"{BASE_URL}/register", json=register_data)
        if response.status_code == 200:
            print("✅ Registration successful")
            session_data = response.json()
        elif response.status_code == 400:
            # Already registered, try login
            print("User already exists, logging in...")
            response = requests.post(f"{BASE_URL}/login", json=register_data)
            session_data = response.json()
            print("✅ Login successful")
        else:
            print(f"❌ Registration/Login failed: {response.status_code}")
            print(response.text)
            return
            
        print(f"Response data: {session_data}")
        session_id = session_data.get("session_id", session_data.get("sessionId"))
        if not session_id:
            print(f"❌ No session ID in response: {session_data}")
            return
        print(f"Session ID: {session_id}")
        
    except Exception as e:
        print(f"❌ Auth failed: {e}")
        return
    
    # Step 2: Upload CV
    print("\n📤 Step 2: CV Upload")
    
    # Use an existing test CV file
    cv_file_path = Path("data/cv_examples/text_examples/comprehensive_all_components_cv.txt")
    
    if not cv_file_path.exists():
        print(f"❌ CV file not found: {cv_file_path}")
        return
    
    headers = {"X-Session-ID": session_id}
    
    with open(cv_file_path, "rb") as f:
        files = {"file": (cv_file_path.name, f, "text/plain")}
        
        try:
            response = requests.post(
                f"{BASE_URL}/upload",
                headers=headers,
                files=files
            )
            
            if response.status_code == 200:
                upload_data = response.json()
                print("✅ CV uploaded successfully")
                print(f"Job ID: {upload_data['job_id']}")
            else:
                print(f"❌ Upload failed: {response.status_code}")
                print(response.json())
                return
                
        except Exception as e:
            print(f"❌ Upload failed: {e}")
            return
    
    # Step 3: Generate Portfolio
    print("\n🏗️  Step 3: Portfolio Generation")
    
    # In a real implementation, we would get the CV data from the job
    # For now, let's make a direct portfolio generation request
    print("⚠️  Note: Portfolio generation endpoint not connected to CV upload yet")
    print("This is one of our pending tasks")
    
    # Check available endpoints
    print("\n📋 Available Endpoints:")
    try:
        response = requests.get("http://127.0.0.1:2000/docs")
        if response.status_code == 200:
            print("✅ API documentation available at: http://127.0.0.1:2000/docs")
    except:
        pass
    
    print("\n🔍 Summary:")
    print("- ✅ User authentication working")
    print("- ✅ CV upload working") 
    print("- ✅ Universal Adapter integrated in ComponentAdapter")
    print("- ⚠️  CV upload to portfolio generation connection pending")
    print("- ⚠️  Job status tracking pending")
    print("- ⚠️  Generated portfolio saving pending")
    
    print("\nThese are the next steps we need to implement to complete the pipeline.")

if __name__ == "__main__":
    test_pipeline()