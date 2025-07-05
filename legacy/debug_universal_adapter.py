#!/usr/bin/env python3
"""
Debug Universal Adapter data transformation
"""

import json
from pathlib import Path
from backend.schemas.unified import CVData
from services.portfolio.universal_adapter import universal_adapter

def debug_universal_adapter():
    print("🔍 Debugging Universal Adapter")
    print("=" * 60)
    
    # Load CV data
    data_path = Path("debug_extracted_data.json")
    with open(data_path, 'r') as f:
        cv_data_dict = json.load(f)
    
    cv_data = CVData(**cv_data_dict)
    
    # Test each section
    sections_to_test = [
        ("education", "card-stack", cv_data.education.model_dump() if cv_data.education else {}),
        ("skills", "bento-grid", cv_data.skills.model_dump() if cv_data.skills else {}),
        ("languages", "animated-tooltip", cv_data.languages.model_dump() if cv_data.languages else {})
    ]
    
    for section, component_type, section_data in sections_to_test:
        print(f"\n📋 Testing {section} -> {component_type}")
        print(f"Input data type: {type(section_data)}")
        print(f"Input data keys: {list(section_data.keys()) if isinstance(section_data, dict) else 'Not a dict'}")
        
        if section == "education" and isinstance(section_data, dict) and "educationItems" in section_data:
            print(f"Education items: {len(section_data['educationItems'])}")
            if section_data['educationItems']:
                item = section_data['educationItems'][0]
                print(f"First item keys: {list(item.keys())}")
                print(f"First item degree: {item.get('degree', 'None')}")
                print(f"First item institution: {item.get('institution', 'None')}")
        
        # Call Universal Adapter
        try:
            result = universal_adapter.adapt(component_type, section_data, section)
            print(f"\nResult keys: {list(result.keys())}")
            
            # Save result
            output_file = Path(f"debug_adapter_{section}.json")
            with open(output_file, 'w') as f:
                json.dump(result, f, indent=2)
            print(f"Saved to: {output_file}")
            
            # Show preview
            if "items" in result and result["items"]:
                print(f"Items count: {len(result['items'])}")
                if result["items"]:
                    print(f"First item: {json.dumps(result['items'][0], indent=2)[:200]}...")
            elif "cards" in result and result["cards"]:
                print(f"Cards count: {len(result['cards'])}")
                if result["cards"]:
                    print(f"First card: {json.dumps(result['cards'][0], indent=2)[:200]}...")
                    
        except Exception as e:
            print(f"❌ Error: {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    debug_universal_adapter()