#!/usr/bin/env python3
"""
Test script to verify CV limit enforcement fix.
Tests that:
1. File content is read correctly before CV limit check
2. All excess CVs are deleted when user has more than 10
3. Upload succeeds after cleanup
"""

import requests
import os
import sys
from pathlib import Path

# API Configuration
API_BASE = "http://localhost:2000/api/v1"
TEST_CV_FILE = Path(__file__).parent / "data" / "cv_examples" / "John_Smith_CV.pdf"

def test_cv_limit_enforcement(session_id: str):
    """Test CV limit enforcement with a user that has many CVs"""
    
    print("\n=== Testing CV Limit Enforcement ===")
    
    # First, check current CVs
    headers = {"X-Session-ID": session_id}
    response = requests.get(f"{API_BASE}/my-cvs", headers=headers)
    
    if response.status_code != 200:
        print(f"❌ Failed to get CVs: {response.status_code}")
        print(response.text)
        return False
    
    cv_data = response.json()
    print(f"📊 Current CVs: {cv_data['count']}")
    
    if cv_data.get('over_limit'):
        print(f"⚠️  User is over the 10 CV limit!")
        print(f"📝 Will delete {cv_data['num_to_delete']} CVs on next upload:")
        for cv in cv_data.get('cvs_to_delete_on_next_upload', []):
            print(f"   - {cv['filename']} (uploaded: {cv['upload_date']})")
    
    # Now try to upload a new CV
    print("\n📤 Uploading new CV...")
    
    if not TEST_CV_FILE.exists():
        print(f"❌ Test CV file not found: {TEST_CV_FILE}")
        return False
    
    with open(TEST_CV_FILE, 'rb') as f:
        files = {'file': ('test_cv.pdf', f, 'application/pdf')}
        response = requests.post(
            f"{API_BASE}/upload",
            headers=headers,
            files=files
        )
    
    if response.status_code != 200:
        print(f"❌ Upload failed: {response.status_code}")
        print(response.text)
        return False
    
    upload_result = response.json()
    print(f"✅ Upload successful! Job ID: {upload_result['job_id']}")
    
    # Check if CVs were deleted
    if upload_result.get('deleted_cvs'):
        print(f"\n🗑️  Deleted {len(upload_result['deleted_cvs'])} old CVs:")
        for cv in upload_result['deleted_cvs']:
            print(f"   - {cv['filename']} (uploaded: {cv['upload_date']})")
    
    # Verify final CV count
    response = requests.get(f"{API_BASE}/my-cvs", headers=headers)
    if response.status_code == 200:
        final_cv_data = response.json()
        print(f"\n📊 Final CV count: {final_cv_data['count']}")
        
        if final_cv_data['count'] <= 10:
            print("✅ CV limit enforced successfully!")
            return True
        else:
            print(f"❌ CV limit not enforced! User still has {final_cv_data['count']} CVs")
            return False
    
    return False


def main():
    """Main test function"""
    
    # Check if user provided session ID
    if len(sys.argv) < 2:
        print("Usage: python test_cv_limit_fix.py <session_id>")
        print("\nTo get a session ID:")
        print("1. Login to the app")
        print("2. Check browser DevTools > Application > Cookies > session_id")
        sys.exit(1)
    
    session_id = sys.argv[1]
    print(f"🔑 Using session ID: {session_id[:20]}...")
    
    # Run the test
    success = test_cv_limit_enforcement(session_id)
    
    if success:
        print("\n✅ All tests passed!")
    else:
        print("\n❌ Tests failed!")
        sys.exit(1)


if __name__ == "__main__":
    main()