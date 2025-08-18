#!/usr/bin/env python3
"""
Test AI Data Extraction Service
"""
import asyncio
import sys
import os
import logging
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.llm.data_extractor import data_extractor
from services.local.text_extractor import text_extractor

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

async def test_extraction():
    """Test CV data extraction with a sample file"""
    print("🤖 Testing AI Data Extraction")
    print("=" * 60)
    
    # Test file
    test_file = "data/test_files/sample_cv.txt"
    
    if not Path(test_file).exists():
        print(f"❌ Test file not found: {test_file}")
        return
    
    # Extract text
    print(f"\n1️⃣ Extracting text from {test_file}...")
    text = text_extractor.extract_text(test_file)
    print(f"✅ Extracted {len(text)} characters")
    
    # Extract structured data
    print(f"\n2️⃣ Extracting structured CV data using AI...")
    try:
        cv_data = await data_extractor.extract_cv_data(text)
        
        # Show what was extracted
        extracted_sections = []
        for field_name, field_value in cv_data.model_dump().items():
            if field_value:
                extracted_sections.append(field_name)
        
        print(f"✅ Successfully extracted {len(extracted_sections)} sections:")
        for section in extracted_sections:
            print(f"   - {section}")
        
        # Show sample data
        if cv_data.hero:
            print(f"\n📋 Hero Section:")
            print(f"   Name: {cv_data.hero.fullName}")
            print(f"   Title: {cv_data.hero.professionalTitle}")
        
        if cv_data.experience:
            print(f"\n💼 Experience: {len(cv_data.experience.experienceItems or [])} positions")
            if cv_data.experience.experienceItems:
                first_job = cv_data.experience.experienceItems[0]
                print(f"   Latest: {first_job.jobTitle} at {first_job.companyName}")
        
        if cv_data.skills:
            print(f"\n🛠️ Skills:")
            if cv_data.skills.skillCategories:
                for category in cv_data.skills.skillCategories[:3]:
                    print(f"   {category.categoryName}: {', '.join(category.skills[:5])}")
        
        # Save as JSON for inspection
        import json
        output_file = "data/test_extraction_output.json"
        with open(output_file, 'w') as f:
            json.dump(cv_data.model_dump(), f, indent=2)
        print(f"\n💾 Full extraction saved to: {output_file}")
        
    except Exception as e:
        print(f"❌ Extraction failed: {e}")
        import traceback
        traceback.print_exc()

async def test_with_real_cv():
    """Test with a real CV from examples"""
    print("\n\n3️⃣ Testing with real CV example...")
    
    real_cv = "data/cv_examples/pdf_examples/simple_pdf/software-engineer-resume-example.pdf"
    
    if Path(real_cv).exists():
        text = text_extractor.extract_text(real_cv)
        print(f"✅ Extracted {len(text)} characters from PDF")
        
        cv_data = await data_extractor.extract_cv_data(text)
        sections = [k for k, v in cv_data.model_dump().items() if v]
        print(f"✅ Extracted {len(sections)} sections from real CV")
    else:
        print(f"⚠️  Real CV example not found: {real_cv}")

if __name__ == "__main__":
    print("Testing CV Data Extraction Pipeline")
    print("This will use your Gemini/Claude API keys")
    print()
    
    # Run async tests
    asyncio.run(test_extraction())
    
    # Test with real CV if available
    asyncio.run(test_with_real_cv())
    
    print("\n✅ Data extraction test complete!")