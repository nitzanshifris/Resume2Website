#!/usr/bin/env python3
"""
Test script to verify the Resume2Web branded template setup
"""

import os
import sys
from pathlib import Path
import json

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

def test_branded_template():
    """Test that the branded template is properly set up"""
    
    base_dir = Path(__file__).parent.parent
    template_dir = base_dir / "src" / "templates" / "resume2web_branded"
    
    print("🔍 Testing Resume2Web Branded Template Setup...")
    print(f"   Template directory: {template_dir}")
    
    # Check if template directory exists
    if not template_dir.exists():
        print("❌ ERROR: Template directory does not exist!")
        return False
    
    print("✅ Template directory exists")
    
    # Check required files
    required_files = [
        "package.json",
        "README.md",
        "app/layout.tsx",
        "app/page.tsx",
        "components/resume2web-branding.tsx",
        "components/brand-hero.tsx",
        "lib/cv-data-adapter.tsx"
    ]
    
    all_files_present = True
    for file_path in required_files:
        full_path = template_dir / file_path
        if full_path.exists():
            print(f"✅ {file_path} exists")
        else:
            print(f"❌ {file_path} is missing!")
            all_files_present = False
    
    if not all_files_present:
        return False
    
    # Check package.json content
    package_json_path = template_dir / "package.json"
    try:
        with open(package_json_path, 'r') as f:
            package_data = json.load(f)
        
        if package_data.get('name') == 'resume2web-branded-template':
            print("✅ package.json has correct name")
        else:
            print("❌ package.json has incorrect name")
            return False
            
    except Exception as e:
        print(f"❌ Error reading package.json: {e}")
        return False
    
    # Check if branding components are properly imported
    layout_path = template_dir / "app" / "layout.tsx"
    try:
        with open(layout_path, 'r') as f:
            layout_content = f.read()
        
        if 'Resume2WebBranding' in layout_content:
            print("✅ Resume2WebBranding component is imported in layout")
        else:
            print("❌ Resume2WebBranding component not found in layout")
            return False
            
    except Exception as e:
        print(f"❌ Error reading layout.tsx: {e}")
        return False
    
    # Check if brand hero is imported in page
    page_path = template_dir / "app" / "page.tsx"
    try:
        with open(page_path, 'r') as f:
            page_content = f.read()
        
        if 'BrandHero' in page_content:
            print("✅ BrandHero component is imported in page")
        else:
            print("❌ BrandHero component not found in page")
            return False
            
    except Exception as e:
        print(f"❌ Error reading page.tsx: {e}")
        return False
    
    print("\n🎉 All tests passed! Resume2Web branded template is properly set up.")
    return True

if __name__ == "__main__":
    success = test_branded_template()
    sys.exit(0 if success else 1)