#!/usr/bin/env python3
"""
Debug Universal Adapter normalization
"""

import json
from pathlib import Path
from backend.schemas.unified import CVData
from services.portfolio.universal_adapter import universal_adapter

def debug_normalization():
    print("🔍 Debugging Normalization Process")
    print("=" * 60)
    
    # Load CV data
    data_path = Path("debug_extracted_data.json")
    with open(data_path, 'r') as f:
        cv_data_dict = json.load(f)
    
    cv_data = CVData(**cv_data_dict)
    
    # Test education normalization
    if cv_data.education:
        print("\n📋 Education Data:")
        edu_dict = cv_data.education.model_dump()
        print(f"Education items count: {len(edu_dict.get('educationItems', []))}")
        
        # Test normalization directly
        normalized = universal_adapter._normalize_data(edu_dict, "education")
        print(f"Normalized items count: {len(normalized)}")
        
        for i, item in enumerate(normalized[:2]):
            print(f"\nNormalized item {i+1}:")
            print(f"  Primary: {item.primary}")
            print(f"  Secondary: {item.secondary}")
            print(f"  Tertiary: {item.tertiary}")
            if isinstance(item.metadata, dict):
                print(f"  Metadata keys: {list(item.metadata.keys())[:5]}...")
    
    # Test skills normalization
    if cv_data.skills:
        print("\n\n📋 Skills Data:")
        skills_dict = cv_data.skills.model_dump()
        print(f"Skill categories count: {len(skills_dict.get('skillCategories', []))}")
        
        # Show first few categories
        for i, cat in enumerate(skills_dict.get('skillCategories', [])[:3]):
            print(f"\nCategory {i+1}: {cat.get('categoryName')}")
            print(f"  Skills: {cat.get('skills', [])}")
        
        # Test normalization
        normalized = universal_adapter._normalize_data(skills_dict, "skills")
        print(f"\nNormalized items count: {len(normalized)}")
        
        for i, item in enumerate(normalized[:3]):
            print(f"\nNormalized item {i+1}:")
            print(f"  Primary: {item.primary}")
            print(f"  Secondary: {item.secondary}")
    
    # Test languages normalization
    if cv_data.languages:
        print("\n\n📋 Languages Data:")
        lang_dict = cv_data.languages.model_dump()
        print(f"Language items count: {len(lang_dict.get('languageItems', []))}")
        
        # Test normalization
        normalized = universal_adapter._normalize_data(lang_dict, "languages")
        print(f"Normalized items count: {len(normalized)}")

if __name__ == "__main__":
    debug_normalization()