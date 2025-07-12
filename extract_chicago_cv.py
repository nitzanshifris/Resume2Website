#!/usr/bin/env python3
"""
Extract CV data from Chicago Resume Template PDF
"""
import asyncio
import json
import sys
from pathlib import Path

# Add project root to path
sys.path.append(str(Path(__file__).parent))

# Import from the correct locations
from src.core.cv_extraction.data_extractor import data_extractor
from src.core.local.text_extractor import text_extractor

async def extract_cv_to_json():
    """Extract CV data from PDF and save as JSON"""
    
    # PDF file path
    pdf_path = "data/cv_examples/pdf_examples/pdf/Chicago-Resume-Template-Creative.pdf"
    
    print(f"📄 Processing CV: {pdf_path}")
    
    try:
        # Step 1: Extract text from PDF
        print("📖 Extracting text from PDF...")
        text = text_extractor.extract_text(pdf_path)
        
        if not text:
            print("❌ Failed to extract text from PDF")
            return
            
        print(f"✅ Extracted {len(text)} characters of text")
        
        # Step 2: Extract structured CV data
        print("🤖 Extracting structured data using AI...")
        cv_data = await data_extractor.extract_cv_data(text)
        
        # Step 3: Convert to dictionary
        cv_dict = cv_data.model_dump(exclude_none=True)
        
        # Step 4: Save to JSON file
        output_path = "chicago_cv_extracted.json"
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(cv_dict, indent=2, fp=f, ensure_ascii=False)
        
        print(f"✅ CV data saved to: {output_path}")
        
        # Print summary
        print("\n📊 Extraction Summary:")
        print(f"   - Name: {cv_dict.get('hero', {}).get('fullName', 'Unknown')}")
        print(f"   - Title: {cv_dict.get('hero', {}).get('professionalTitle', 'Unknown')}")
        
        sections_found = [key for key, value in cv_dict.items() if value]
        print(f"   - Sections found: {len(sections_found)}")
        for section in sections_found:
            print(f"     • {section}")
        
        return cv_dict
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return None

if __name__ == "__main__":
    # Run the extraction
    result = asyncio.run(extract_cv_to_json())
    
    if result:
        print("\n✨ Extraction completed successfully!")
        print(f"📁 Check 'chicago_cv_extracted.json' for the full data")
    else:
        print("\n❌ Extraction failed!")