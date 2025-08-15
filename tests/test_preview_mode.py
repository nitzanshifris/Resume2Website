#!/usr/bin/env python3
"""
Test script to verify that portfolio generation works in preview mode
without deploying to Vercel.
"""

import requests
import json
import time

# Configuration
API_URL = "http://localhost:2000/api/v1"
SESSION_ID = None  # Will be set after login

def login():
    """Login to get session ID"""
    global SESSION_ID
    
    # Try to login with test credentials
    response = requests.post(f"{API_URL}/login", json={
        "email": "preview-test@example.com",
        "password": "test123"
    })
    
    if response.status_code == 200:
        data = response.json()
        SESSION_ID = data.get("session_id")
        print(f"✅ Logged in successfully. Session ID: {SESSION_ID[:8]}...")
        return True
    else:
        print(f"❌ Login failed: {response.status_code}")
        print(f"   Response: {response.text}")
        return False

def get_test_cv():
    """Get a test CV job_id from existing uploads"""
    headers = {"X-Session-ID": SESSION_ID}
    response = requests.get(f"{API_URL}/my-cvs", headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        # Handle both array and object response formats
        cvs = data if isinstance(data, list) else data.get("uploads", [])
        
        if cvs and len(cvs) > 0:
            job_id = cvs[0].get("job_id")
            print(f"✅ Found test CV with job_id: {job_id}")
            return job_id
    
    print("❌ No test CVs found")
    print("   Please upload a CV first using the web interface")
    print("   or run: python3 tests/upload_test_cv.py")
    return None

def test_preview_generation(job_id):
    """Test portfolio generation in preview mode"""
    headers = {"X-Session-ID": SESSION_ID}
    
    print(f"\n🚀 Testing portfolio generation for job_id: {job_id}")
    
    response = requests.post(
        f"{API_URL}/portfolio/generate/{job_id}",
        headers=headers,
        json={"template": "v0_template_v1.5"}
    )
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Portfolio generated successfully!")
        print(f"   Status: {data.get('status')}")
        print(f"   Portfolio ID: {data.get('portfolio_id')}")
        print(f"   Local URL: {data.get('local_url')}")
        print(f"   Is Local: {data.get('is_local')}")
        print(f"   Deployment Status: {data.get('deployment_status')}")
        print(f"   Message: {data.get('message')}")
        
        # Check that it's NOT deployed to Vercel
        if data.get('is_local') == True and data.get('deployment_status') == 'preview':
            print(f"\n✅ SUCCESS: Portfolio is in preview mode (not deployed to Vercel)")
            return data.get('portfolio_id')
        else:
            print(f"\n❌ FAILED: Portfolio was deployed to Vercel (should be preview only)")
            return None
    else:
        print(f"❌ Portfolio generation failed: {response.status_code}")
        print(f"   Response: {response.text}")
        return None

def test_deploy_endpoint(portfolio_id):
    """Test the new deploy endpoint"""
    headers = {"X-Session-ID": SESSION_ID}
    
    print(f"\n🚀 Testing deployment endpoint for portfolio: {portfolio_id}")
    
    response = requests.post(
        f"{API_URL}/portfolio/{portfolio_id}/deploy",
        headers=headers
    )
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Deployment endpoint works!")
        print(f"   Status: {data.get('status')}")
        print(f"   Vercel URL: {data.get('vercel_url')}")
        print(f"   Custom Domain: {data.get('custom_domain_url')}")
        print(f"   Message: {data.get('message')}")
        return True
    else:
        print(f"❌ Deployment failed: {response.status_code}")
        print(f"   Response: {response.text}")
        return False

def main():
    print("=" * 60)
    print("TESTING PORTFOLIO PREVIEW MODE")
    print("=" * 60)
    
    # Step 1: Login
    if not login():
        print("\n⚠️ Cannot proceed without login. Please check credentials.")
        return
    
    # Step 2: Get test CV
    job_id = get_test_cv()
    if not job_id:
        print("\n⚠️ No test CV available. Please upload a CV first.")
        return
    
    # Step 3: Test preview generation
    portfolio_id = test_preview_generation(job_id)
    if not portfolio_id:
        print("\n⚠️ Preview generation failed.")
        return
    
    # Step 4: Ask if user wants to test deployment
    print("\n" + "=" * 60)
    print("Preview mode test completed successfully!")
    print("The portfolio is running locally and NOT deployed to Vercel.")
    print("\nWould you like to test the deployment endpoint?")
    print("(This will actually deploy to Vercel)")
    
    choice = input("\nTest deployment? (y/n): ").lower()
    if choice == 'y':
        test_deploy_endpoint(portfolio_id)
    else:
        print("\nSkipping deployment test. Portfolio remains in preview mode.")
    
    print("\n" + "=" * 60)
    print("TEST COMPLETED")
    print("=" * 60)

if __name__ == "__main__":
    main()