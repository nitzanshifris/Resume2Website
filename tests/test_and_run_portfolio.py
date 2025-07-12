#!/usr/bin/env python3
"""
Download and run the generated portfolio
"""

import requests
import tempfile
import zipfile
import subprocess
import os
from pathlib import Path

# API Configuration
BASE_URL = "http://127.0.0.1:2000/api/v1"

def download_and_run_portfolio():
    print("🚀 Download and Run Generated Portfolio")
    print("=" * 60)
    
    # First, let's test with the last successful job
    # You'll need to run the pipeline first to get a job_id
    print("\n1️⃣ First, let's generate a new portfolio...")
    
    # Quick auth
    import random
    test_email = f"demo_{random.randint(1000, 9999)}@example.com"
    auth_data = {"email": test_email, "password": "testpassword123"}
    
    response = requests.post(f"{BASE_URL}/register", json=auth_data)
    session_data = response.json()
    session_id = session_data["session_id"]
    headers = {"X-Session-ID": session_id}
    
    # Upload CV
    cv_file_path = Path("data/cv_examples/text_examples/comprehensive_all_components_cv.txt")
    
    with open(cv_file_path, "rb") as f:
        files = {"file": (cv_file_path.name, f, "text/plain")}
        response = requests.post(
            f"{BASE_URL}/cv-to-portfolio/process",
            headers=headers,
            files=files
        )
    
    if response.status_code != 200:
        print(f"❌ Failed to generate portfolio: {response.status_code}")
        return
    
    result = response.json()
    job_id = result['job_id']
    print(f"✅ Portfolio generated! Job ID: {job_id}")
    
    # Download the portfolio
    print("\n2️⃣ Downloading portfolio ZIP...")
    download_response = requests.get(
        f"{BASE_URL}/cv-to-portfolio/download/{job_id}",
        headers=headers,
        stream=True
    )
    
    if download_response.status_code != 200:
        print(f"❌ Failed to download: {download_response.status_code}")
        return
    
    # Save and extract
    extract_dir = Path("generated_portfolio_preview")
    extract_dir.mkdir(exist_ok=True)
    
    zip_path = extract_dir / "portfolio.zip"
    with open(zip_path, "wb") as f:
        for chunk in download_response.iter_content(chunk_size=8192):
            f.write(chunk)
    
    print(f"✅ Downloaded to: {zip_path}")
    
    # Extract ZIP
    print("\n3️⃣ Extracting portfolio files...")
    portfolio_dir = extract_dir / "portfolio"
    portfolio_dir.mkdir(exist_ok=True)
    
    with zipfile.ZipFile(zip_path, 'r') as zip_file:
        zip_file.extractall(portfolio_dir)
        files = zip_file.namelist()
    
    print(f"✅ Extracted {len(files)} files")
    
    # Show file structure
    print("\n📁 Portfolio Structure:")
    for i, file in enumerate(sorted(files)[:20]):  # Show first 20 files
        print(f"   {file}")
    if len(files) > 20:
        print(f"   ... and {len(files) - 20} more files")
    
    # Check key files
    print("\n🔍 Key Files:")
    key_files = {
        "package.json": "Project configuration",
        "app/page.tsx": "Main page component",
        "lib/portfolio-data.ts": "Portfolio data",
        "app/layout.tsx": "Layout component",
        "tailwind.config.ts": "Tailwind configuration"
    }
    
    for file, desc in key_files.items():
        full_path = portfolio_dir / file
        if full_path.exists():
            print(f"   ✅ {file} - {desc}")
        else:
            print(f"   ❌ {file} - Missing!")
    
    # Show what components were used
    print("\n🎨 Components Used:")
    page_file = portfolio_dir / "app/page.tsx"
    if page_file.exists():
        content = page_file.read_text()
        # Extract component imports
        import re
        imports = re.findall(r'from\s+"@/components/ui/([^"]+)"', content)
        for comp in imports:
            print(f"   - {comp}")
    
    print("\n" + "=" * 60)
    print("📌 To run the portfolio:")
    print("=" * 60)
    print(f"cd {portfolio_dir}")
    print("npm install")
    print("npm run dev")
    print("\nThen open http://localhost:3000 in your browser")
    print("=" * 60)
    
    # Optional: Auto-run
    print("\n🤔 Do you want me to install dependencies and run the portfolio?")
    print("Note: This will run 'npm install' which may take a few minutes")
    
    return str(portfolio_dir)

if __name__ == "__main__":
    portfolio_path = download_and_run_portfolio()
    print(f"\n✅ Portfolio is ready at: {portfolio_path}")