#!/usr/bin/env python3
"""
Debug CV extraction to see why data is empty
"""

import json
import asyncio
from pathlib import Path
from services.llm.data_extractor import DataExtractor
from services.local.text_extractor import extract_text

async def debug_extraction():
    print("🔍 Debugging CV Extraction Pipeline")
    print("=" * 60)
    
    # Use the Software Engineer PDF
    cv_path = Path("/Users/nitzan_shifris/Desktop/CV2WEB-V4/data/cv_examples/pdf_examples/pdf/Software Engineer.pdf")
    
    if not cv_path.exists():
        print(f"❌ CV file not found: {cv_path}")
        return
    
    print(f"✅ Using CV: {cv_path.name}")
    
    # Step 1: Extract text
    print("\n📄 Step 1: Extracting text from PDF...")
    text = extract_text(str(cv_path))
    
    if not text:
        print("❌ No text extracted!")
        return
    
    print(f"✅ Extracted {len(text)} characters")
    print("\nFirst 500 characters:")
    print("-" * 40)
    print(text[:500])
    print("-" * 40)
    
    # Step 2: Extract structured data
    print("\n🤖 Step 2: Extracting structured data with LLM...")
    extractor = DataExtractor()
    
    try:
        cv_data = await extractor.extract_cv_data(text)
        
        # Save extracted data
        output_path = Path("debug_extracted_data.json")
        with open(output_path, 'w') as f:
            json.dump(cv_data.model_dump(), f, indent=2)
        
        print(f"✅ Data extracted and saved to: {output_path}")
        
        # Show summary
        print("\n📊 Extraction Summary:")
        print(f"- Hero: {bool(cv_data.hero and cv_data.hero.fullName)}")
        print(f"- Summary: {bool(cv_data.summary and cv_data.summary.summaryText)}")
        print(f"- Experience items: {len(cv_data.experience.experienceItems) if cv_data.experience else 0}")
        print(f"- Education items: {len(cv_data.education.educationItems) if cv_data.education else 0}")
        print(f"- Skills categories: {len(cv_data.skills.skillCategories) if cv_data.skills else 0}")
        
        # Show hero data
        if cv_data.hero:
            print(f"\n👤 Hero Data:")
            print(f"- Name: {cv_data.hero.fullName}")
            print(f"- Title: {cv_data.hero.professionalTitle}")
            print(f"- Tagline: {cv_data.hero.summaryTagline[:100] if cv_data.hero.summaryTagline else 'None'}...")
        
        # Show experience data
        if cv_data.experience and cv_data.experience.experienceItems:
            print(f"\n💼 Experience Data ({len(cv_data.experience.experienceItems)} items):")
            for i, exp in enumerate(cv_data.experience.experienceItems[:2]):
                print(f"\nItem {i+1}:")
                print(f"- Company: {exp.companyName}")
                print(f"- Job Title: {exp.jobTitle}")
                print(f"- Summary: {exp.summary[:100] if exp.summary else 'None'}...")
                
    except Exception as e:
        print(f"❌ Extraction failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(debug_extraction())