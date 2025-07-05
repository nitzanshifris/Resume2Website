#!/usr/bin/env python3
"""
Debug the data flow from CV to Portfolio
"""

import json
from pathlib import Path
from services.local.text_extractor import text_extractor
from services.llm.data_extractor import data_extractor
from services.portfolio.component_selector import component_selector
from services.portfolio.universal_adapter import universal_adapter
import asyncio

async def debug_data_flow():
    print("🔍 Debugging CV to Portfolio Data Flow")
    print("=" * 60)
    
    # Step 1: Extract text from PDF
    cv_path = Path("data/cv_examples/pdf_examples/pdf/Software Engineer.pdf")
    print(f"\n1️⃣ Extracting text from: {cv_path.name}")
    
    text = text_extractor.extract_text(str(cv_path))
    print(f"   ✅ Extracted {len(text)} characters")
    print(f"   Preview: {text[:200]}...")
    
    # Step 2: Extract structured data
    print("\n2️⃣ Extracting structured CV data...")
    cv_data = await data_extractor.extract_cv_data(text)
    
    print(f"   ✅ Extracted CV data")
    
    # Check what sections have data
    cv_dict = cv_data.model_dump()
    sections_with_data = [k for k, v in cv_dict.items() if v]
    print(f"   Sections with data: {sections_with_data}")
    
    # Show sample data from each section
    for section in ['hero', 'experience', 'skills', 'summary']:
        if section in cv_dict and cv_dict[section]:
            print(f"\n   📊 {section.upper()} section:")
            data = cv_dict[section]
            print(f"   {json.dumps(data, indent=2)[:300]}...")
    
    # Step 3: Component selection
    print("\n3️⃣ Selecting components...")
    selections = component_selector.select_components(cv_data)
    print(f"   ✅ Selected {len(selections)} components")
    
    for sel in selections[:5]:  # Show first 5
        print(f"   - {sel.component_type} for {sel.section}")
    
    # Step 4: Test Universal Adapter for each selection
    print("\n4️⃣ Testing Universal Adapter...")
    
    for sel in selections[:3]:  # Test first 3
        print(f"\n   Testing {sel.component_type} for {sel.section}:")
        
        # Get section data
        section_data = getattr(cv_data, sel.section, None)
        if not section_data:
            print(f"   ❌ No data for section {sel.section}")
            continue
            
        # Convert to dict if it's a model
        if hasattr(section_data, 'model_dump'):
            section_data = section_data.model_dump()
        
        print(f"   Input data type: {type(section_data)}")
        print(f"   Input data: {json.dumps(section_data, indent=2)[:200]}...")
        
        # Run Universal Adapter
        props = universal_adapter.adapt(sel.component_type, section_data, sel.section)
        
        print(f"   Output props: {json.dumps(props, indent=2)[:200]}...")
        
        # Check if props are empty
        if props.get('items'):
            first_item = props['items'][0] if props['items'] else {}
            if isinstance(first_item, dict):
                content = first_item.get('content', first_item)
                if isinstance(content, dict):
                    if all(not v for v in content.values()):
                        print("   ⚠️  WARNING: Generated empty content!")

if __name__ == "__main__":
    asyncio.run(debug_data_flow())