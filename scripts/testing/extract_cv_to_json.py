#!/usr/bin/env python3
"""
Extract CV and save to JSON file for testing
Usage: python3 extract_cv_to_json.py <pdf_file> <output_json>
"""

import sys
import json
import requests
import os
from pathlib import Path

def extract_cv(pdf_path, output_path=None):
    """Extract CV using the API and save to JSON"""
    
    # Check if file exists
    if not os.path.exists(pdf_path):
        print(f"❌ File not found: {pdf_path}")
        return None
    
    # Default output name based on input
    if not output_path:
        output_path = Path(pdf_path).stem + "_extracted.json"
    
    print(f"📄 Extracting: {pdf_path}")
    print(f"⏳ This may take 60-90 seconds...")
    
    # Note: This requires authentication for extraction to work
    # For testing, you need to either:
    # 1. Use an authenticated endpoint with session
    # 2. Or use upload-anonymous + extract after signup
    
    print("⚠️  Note: Anonymous uploads don't extract automatically.")
    print("    For testing extraction, use authenticated upload or")
    print("    call /extract/{job_id} after authentication.")
    
    # Upload CV (anonymous - validation only)
    with open(pdf_path, 'rb') as f:
        files = {'file': f}
        response = requests.post(
            'http://127.0.0.1:2000/api/v1/upload-anonymous',
            files=files,
            timeout=180
        )
    
    if response.status_code != 200:
        print(f"❌ Upload failed: {response.text}")
        return None
    
    result = response.json()
    job_id = result.get('job_id')
    print(f"✅ Uploaded successfully! Job ID: {job_id}")
    print(f"ℹ️  File validated but not extracted (anonymous upload)")
    
    # To actually extract, you would need to:
    # 1. Authenticate first
    # 2. Call POST /api/v1/extract/{job_id}
    # 3. Then GET /api/v1/cv/{job_id}
    
    print(f"\n💡 To extract this CV:")
    print(f"   1. Authenticate with the API")
    print(f"   2. POST to /api/v1/extract/{job_id}")
    print(f"   3. GET from /api/v1/cv/{job_id}")
    
    # Save validation result
    validation_result = {
        "job_id": job_id,
        "status": "validated",
        "message": "File validated successfully. Authentication required for extraction.",
        "next_steps": [
            "Authenticate with API", 
            f"POST to /api/v1/extract/{job_id}",
            f"GET from /api/v1/cv/{job_id}"
        ]
    }
    
    # Save to JSON
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(validation_result, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Saved validation result to: {output_path}")
    
    return validation_result

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 extract_cv_to_json.py <pdf_file> [output_json]")
        print("\nExamples:")
        print("  python3 extract_cv_to_json.py data/cv_examples/pdf_examples/pdf/Gal_Levinsky_CV.pdf")
        print("  python3 extract_cv_to_json.py my_cv.pdf my_cv_extracted.json")
        sys.exit(1)
    
    pdf_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None
    
    extract_cv(pdf_file, output_file)