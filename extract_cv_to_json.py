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
    
    # Upload CV
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
    
    # Get extracted data
    response = requests.get(f'http://127.0.0.1:2000/api/v1/cv/{job_id}')
    
    if response.status_code != 200:
        print(f"❌ Failed to get CV data: {response.text}")
        return None
    
    cv_data = response.json()
    
    # Save to JSON
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(cv_data, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Saved to: {output_path}")
    
    # Show summary
    if 'cv_data' in cv_data:
        cv = cv_data['cv_data']
        if 'hero' in cv:
            print(f"\n📋 Extracted CV for: {cv['hero'].get('fullName', 'Unknown')}")
        if 'experience' in cv and cv['experience']:
            exp_items = cv['experience'].get('experienceItems', [])
            print(f"   - {len(exp_items)} experience items")
            
            # Count how many have technologies
            with_tech = sum(1 for e in exp_items if e.get('technologiesUsed'))
            print(f"   - {with_tech}/{len(exp_items)} with technologies extracted")
    
    return cv_data

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