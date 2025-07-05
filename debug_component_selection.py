#!/usr/bin/env python3
"""
Debug component selection and prop generation
"""

import json
import asyncio
from pathlib import Path
from services.llm.data_extractor import DataExtractor
from services.local.text_extractor import extract_text
from services.portfolio.component_selector import component_selector
from backend.schemas.unified import CVData

async def debug_component_selection():
    print("🔍 Debugging Component Selection Pipeline")
    print("=" * 60)
    
    # Use existing extracted data
    data_path = Path("debug_extracted_data.json")
    
    if not data_path.exists():
        print("❌ No extracted data found. Run debug_cv_extraction.py first.")
        return
    
    print(f"✅ Loading CV data from: {data_path}")
    
    # Load CV data
    with open(data_path, 'r') as f:
        cv_data_dict = json.load(f)
    
    # Convert to CVData object
    cv_data = CVData(**cv_data_dict)
    
    print("\n📋 CV Data Summary:")
    print(f"- Name: {cv_data.hero.fullName if cv_data.hero else 'None'}")
    print(f"- Title: {cv_data.hero.professionalTitle if cv_data.hero else 'None'}")
    print(f"- Experience: {len(cv_data.experience.experienceItems) if cv_data.experience else 0} items")
    print(f"- Education: {len(cv_data.education.educationItems) if cv_data.education else 0} items")
    
    # Select components
    print("\n🎯 Selecting Components...")
    selections = component_selector.select_components(cv_data)
    
    print(f"\n✅ Selected {len(selections)} components:")
    
    for selection in selections:
        print(f"\n[{selection.section}] -> {selection.component_type}")
        print(f"  Props keys: {list(selection.props.keys())}")
        
        # Show sample of props
        if selection.props:
            props_preview = json.dumps(selection.props, indent=2)[:200]
            print(f"  Props preview: {props_preview}...")
    
    # Save selections for inspection
    selections_data = []
    for sel in selections:
        selections_data.append({
            "section": sel.section,
            "component_type": sel.component_type,
            "import_path": sel.import_path,
            "props": sel.props,
            "priority": sel.priority
        })
    
    output_path = Path("debug_component_selections.json")
    with open(output_path, 'w') as f:
        json.dump(selections_data, f, indent=2)
    
    print(f"\n💾 Selections saved to: {output_path}")

if __name__ == "__main__":
    asyncio.run(debug_component_selection())