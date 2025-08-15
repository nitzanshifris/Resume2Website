#!/usr/bin/env python3
"""
Upload a test CV for preview mode testing
"""

import requests
import os

API_URL = "http://localhost:2000/api/v1"

# Use an existing CV from uploads
CV_FILE = "data/uploads/cf0b2713-2f5f-448e-b39c-27365025d0d6.pdf"

def upload_cv(session_id):
    """Upload test CV"""
    if not os.path.exists(CV_FILE):
        print(f"❌ Test CV not found: {CV_FILE}")
        return None
    
    headers = {"X-Session-ID": session_id}
    
    with open(CV_FILE, 'rb') as f:
        files = {'file': ('test_cv.pdf', f, 'application/pdf')}
        response = requests.post(
            f"{API_URL}/upload",
            headers=headers,
            files=files
        )
    
    if response.status_code == 200:
        data = response.json()
        job_id = data.get("job_id")
        print(f"✅ CV uploaded successfully! Job ID: {job_id}")
        return job_id
    else:
        print(f"❌ Upload failed: {response.status_code}")
        print(f"   Response: {response.text}")
        return None

def main():
    # Login first
    response = requests.post(f"{API_URL}/login", json={
        "email": "preview-test@example.com",
        "password": "test123"
    })
    
    if response.status_code != 200:
        print("❌ Login failed")
        return
    
    session_id = response.json().get("session_id")
    print(f"✅ Logged in. Session ID: {session_id[:8]}...")
    
    # Upload CV
    job_id = upload_cv(session_id)
    if job_id:
        print(f"\n✅ Test CV ready for preview mode testing")
        print(f"   Job ID: {job_id}")

if __name__ == "__main__":
    main()