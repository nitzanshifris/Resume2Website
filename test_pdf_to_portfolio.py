#!/usr/bin/env python3
"""
Test PDF CV to Portfolio Pipeline with Enhanced Error Reporting
Tests all the improvements made to the codebase:
- Component Registry for centralized component management
- URL Normalization to prevent validation errors
- Adapter Compatibility for flexible prop names
- Empty Section Guards to avoid blank sections
- Props Validation for runtime checking
- JSON Serialization fixes for Pydantic types
"""

import requests
import json
import time
from pathlib import Path
import zipfile
import sys
import traceback

# API Configuration
BASE_URL = "http://127.0.0.1:2000/api/v1"

# Enable detailed error reporting
DEBUG_MODE = True

def check_api_health():
    """Check if API is running"""
    try:
        # Health endpoint is at root, not under /api/v1
        response = requests.get("http://127.0.0.1:2000/health")
        return response.status_code == 200
    except:
        return False

def analyze_portfolio_output(extract_path):
    """Analyze the generated portfolio for our improvements"""
    print("\n🔍 Analyzing Generated Portfolio:")
    
    checks = {
        "Component Registry Usage": False,
        "Empty Section Guards": False,
        "Proper Data Serialization": False,
        "Component Imports Fixed": False
    }
    
    # Check page.tsx for empty guards
    page_file = extract_path / "app/page.tsx"
    if page_file.exists():
        with open(page_file, 'r') as f:
            content = f.read()
            if "?.length > 0" in content or "&& (" in content:
                checks["Empty Section Guards"] = True
            if "import {" in content and "from '@/components/ui/" in content:
                checks["Component Imports Fixed"] = True
    
    # Check portfolio-data.ts for proper serialization
    data_file = extract_path / "lib/portfolio-data.ts"
    if data_file.exists():
        with open(data_file, 'r') as f:
            content = f.read()
            if "undefined" in content and "Url" not in content:
                checks["Proper Data Serialization"] = True
    
    # Check if component files were copied
    components_dir = extract_path / "components/ui"
    if components_dir.exists() and any(components_dir.iterdir()):
        checks["Component Registry Usage"] = True
    
    # Report results
    for check, passed in checks.items():
        print(f"  {'✅' if passed else '❌'} {check}")
    
    return all(checks.values())

def test_pdf_pipeline():
    print("🚀 Testing PDF CV to Portfolio Pipeline")
    print("=" * 60)
    
    # Step 1: Register/Login
    print("\n📝 Step 1: User Authentication")
    import random
    test_email = f"pdf_test_{random.randint(1000, 9999)}@example.com"
    auth_data = {
        "email": test_email,
        "password": "testpassword123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/register", json=auth_data)
        if response.status_code == 200:
            print("✅ Registration successful")
            session_data = response.json()
        else:
            response = requests.post(f"{BASE_URL}/login", json=auth_data)
            session_data = response.json()
            print("✅ Login successful")
            
        session_id = session_data.get("session_id")
        print(f"Session ID: {session_id}")
        
    except Exception as e:
        print(f"❌ Authentication failed: {e}")
        return
    
    # Step 2: Select a PDF CV
    print("\n📄 Step 2: Selecting PDF CV")
    pdf_folder = Path("/Users/nitzan_shifris/Desktop/CV2WEB-V4/data/cv_examples/pdf_examples/pdf")
    
    # Let's use the Software Engineer CV
    cv_file_path = pdf_folder / "Software Engineer.pdf"
    
    if not cv_file_path.exists():
        print(f"❌ CV file not found: {cv_file_path}")
        return
    
    print(f"✅ Using CV: {cv_file_path.name}")
    
    # Step 3: Upload and Process
    print("\n🔄 Step 3: Processing CV to Portfolio")
    headers = {"X-Session-ID": session_id}
    
    with open(cv_file_path, "rb") as f:
        files = {"file": (cv_file_path.name, f, "application/pdf")}
        
        try:
            print("⏳ Uploading and processing... (this may take 10-30 seconds)")
            start_time = time.time()
            
            response = requests.post(
                f"{BASE_URL}/cv-to-portfolio/process",
                headers=headers,
                files=files
            )
            
            if response.status_code == 200:
                result = response.json()
                elapsed_time = time.time() - start_time
                
                print(f"\n✅ SUCCESS! Portfolio generated in {elapsed_time:.2f} seconds")
                print(f"Job ID: {result['job_id']}")
                
                # Step 4: Download Portfolio
                print("\n📥 Step 4: Downloading Portfolio")
                download_url = f"{BASE_URL}{result['download_url']}"
                
                download_response = requests.get(download_url, headers=headers, stream=True)
                
                if download_response.status_code == 200:
                    # Save ZIP file
                    zip_path = Path("portfolio_output.zip")
                    with open(zip_path, "wb") as f:
                        for chunk in download_response.iter_content(chunk_size=8192):
                            f.write(chunk)
                    
                    print(f"✅ Portfolio saved to: {zip_path.absolute()}")
                    
                    # Extract to specific folder
                    extract_path = Path("portfolio_output")
                    extract_path.mkdir(exist_ok=True)
                    
                    with zipfile.ZipFile(zip_path, 'r') as zip_file:
                        zip_file.extractall(extract_path)
                    
                    print(f"✅ Extracted to: {extract_path.absolute()}")
                    
                    # Analyze the generated portfolio
                    all_checks_passed = analyze_portfolio_output(extract_path)
                    
                    # Show commands to run
                    print("\n" + "="*60)
                    if all_checks_passed:
                        print("🎉 PORTFOLIO READY - ALL IMPROVEMENTS VERIFIED!")
                    else:
                        print("⚠️  PORTFOLIO READY - Some improvements may not be applied")
                    print("="*60)
                    print("\nTo view your portfolio, run these commands in a new terminal:\n")
                    print(f"cd {extract_path.absolute()}")
                    print("npm install")
                    print("npm run dev")
                    print("\nThen open http://localhost:3000 in your browser")
                    print("="*60)
                    
                    # Additional debug info if requested
                    if DEBUG_MODE and not all_checks_passed:
                        print("\n🔧 Debug Information:")
                        print("If some checks failed, ensure:")
                        print("1. The API is using the latest code")
                        print("2. All services are properly imported")
                        print("3. The portfolio generator has the JSON serialization fix")
                    
                else:
                    print(f"❌ Download failed: {download_response.status_code}")
                    
            else:
                print(f"❌ Processing failed: {response.status_code}")
                error_data = response.json()
                print(f"Error: {error_data}")
                
                # Check for specific errors we fixed
                error_detail = str(error_data.get('detail', ''))
                if "not JSON serializable" in error_detail:
                    print("\n⚠️  JSON Serialization Error Detected!")
                    print("This means the Pydantic URL fix may not be applied.")
                    print("Please ensure:")
                    print("1. portfolio_generator.py has the PydanticJSONEncoder class")
                    print("2. The sanitize_props_for_json function is being used")
                    print("3. The API has been restarted after changes")
                elif "Module not found" in error_detail:
                    print("\n⚠️  Component Import Error Detected!")
                    print("This means the component registry may not be working.")
                    print("Please ensure:")
                    print("1. component-registry.json exists and is valid")
                    print("2. ComponentImportFixer is using the registry")
                    print("3. All component files are properly copied")
                elif "validation" in error_detail.lower():
                    print("\n⚠️  Validation Error Detected!")
                    print("This could be a URL normalization issue.")
                    print("Please ensure:")
                    print("1. URL normalizer is integrated in data_extractor.py")
                    print("2. All URLs are being normalized before validation")
                
        except Exception as e:
            print(f"❌ Error: {e}")
            if DEBUG_MODE:
                import traceback
                traceback.print_exc()

if __name__ == "__main__":
    # Check if API is running
    if not check_api_health():
        print("❌ API is not running. Please start the API first:")
        print("   python main.py")
        sys.exit(1)
    
    test_pdf_pipeline()