#!/usr/bin/env python3
"""
Test full extraction on Lisbon Resume Template PDF
"""

import asyncio
import json
import sys
import time
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent.parent))

from src.core.cv_extraction.data_extractor import DataExtractor
from src.core.local.text_extractor import extract_text


async def test_lisbon_resume():
    """Test extraction on Lisbon Resume Template PDF."""
    
    print("="*80)
    print("TESTING FULL EXTRACTION - Lisbon Resume Template")
    print("="*80)
    
    # Path to the PDF
    pdf_path = Path(__file__).parent.parent.parent / "data/cv_examples/pdf_examples/pdf/Lisbon-Resume-Template-Creative.pdf"
    
    if not pdf_path.exists():
        print(f"❌ File not found: {pdf_path}")
        return None
    
    print(f"\n📄 Input file: {pdf_path.name}")
    print(f"📏 File size: {pdf_path.stat().st_size / 1024:.1f} KB")
    
    try:
        # Step 1: Extract text from PDF
        print(f"\n{'='*60}")
        print("STEP 1: TEXT EXTRACTION")
        print(f"{'='*60}")
        
        start = time.time()
        raw_text = extract_text(str(pdf_path))
        text_time = time.time() - start
        
        if not raw_text:
            print("❌ No text extracted from PDF")
            return None
        
        print(f"✅ Extracted {len(raw_text)} characters in {text_time:.2f}s")
        print(f"\n📝 Text preview (first 500 chars):")
        print("-" * 40)
        print(raw_text[:500])
        print("-" * 40)
        
        # Step 2: Extract CV data using refactored pipeline
        print(f"\n{'='*60}")
        print("STEP 2: CV DATA EXTRACTION")
        print(f"{'='*60}")
        
        print("\n🔄 Initializing DataExtractor...")
        extractor = DataExtractor()
        
        print("🧠 Running AI extraction (Claude 4 Opus)...")
        start = time.time()
        cv_data = await extractor.extract_cv_data(raw_text)
        extract_time = time.time() - start
        
        print(f"✅ Extraction complete in {extract_time:.2f}s")
        
        # Step 3: Analyze results
        print(f"\n{'='*60}")
        print("STEP 3: RESULTS ANALYSIS")
        print(f"{'='*60}")
        
        cv_dict = cv_data.model_dump()
        
        # Count sections
        sections_found = []
        sections_missing = []
        
        all_sections = [
            'hero', 'contact', 'summary', 'experience', 'education',
            'skills', 'projects', 'achievements', 'certifications',
            'languages', 'volunteer', 'publications', 'speaking',
            'courses', 'memberships', 'hobbies', 'patents'
        ]
        
        for section in all_sections:
            if section in cv_dict and cv_dict[section]:
                sections_found.append(section)
            else:
                sections_missing.append(section)
        
        print(f"\n📊 Extraction Summary:")
        print(f"  • Sections found: {len(sections_found)}/17")
        print(f"  • Extraction time: {extract_time:.2f}s")
        print(f"  • Total processing: {text_time + extract_time:.2f}s")
        
        # Calculate confidence
        confidence = extractor.calculate_extraction_confidence(cv_data, raw_text)
        print(f"  • Confidence score: {confidence:.2%}")
        
        # Show found sections
        print(f"\n✅ Sections extracted ({len(sections_found)}):")
        for section in sections_found:
            data = cv_dict[section]
            if isinstance(data, dict):
                # Count non-empty fields
                non_empty = sum(1 for v in data.values() if v)
                print(f"  • {section}: {non_empty} fields")
                
                # Show key fields for important sections
                if section == 'hero' and data.get('fullName'):
                    print(f"    - Name: {data['fullName']}")
                    if data.get('professionalTitle'):
                        print(f"    - Title: {data['professionalTitle']}")
                elif section == 'experience' and data.get('experienceItems'):
                    print(f"    - Jobs: {len(data['experienceItems'])}")
                    for job in data['experienceItems'][:2]:  # Show first 2
                        print(f"      • {job.get('jobTitle', 'Unknown')} at {job.get('company', 'Unknown')}")
                elif section == 'education' and data.get('educationItems'):
                    print(f"    - Degrees: {len(data['educationItems'])}")
                    for edu in data['educationItems'][:2]:  # Show first 2
                        print(f"      • {edu.get('degree', 'Unknown')} from {edu.get('institution', 'Unknown')}")
                elif section == 'skills':
                    if data.get('skillCategories'):
                        total_skills = sum(len(cat.get('skills', [])) for cat in data['skillCategories'])
                        print(f"    - Categories: {len(data['skillCategories'])}, Total skills: {total_skills}")
                    elif data.get('ungroupedSkills'):
                        print(f"    - Ungrouped skills: {len(data['ungroupedSkills'])}")
                        print(f"      • {', '.join(data['ungroupedSkills'][:5])}")  # Show first 5
            else:
                print(f"  • {section}: present")
        
        # Show missing sections
        if sections_missing:
            print(f"\n❌ Sections not found ({len(sections_missing)}):")
            print(f"  {', '.join(sections_missing)}")
        
        # Step 4: Export JSON
        print(f"\n{'='*60}")
        print("STEP 4: JSON OUTPUT")
        print(f"{'='*60}")
        
        # Clean the output (remove None values for cleaner JSON)
        def clean_dict(d):
            if not isinstance(d, dict):
                return d
            return {
                k: clean_dict(v) if isinstance(v, dict) else (
                    [clean_dict(i) for i in v] if isinstance(v, list) else v
                )
                for k, v in d.items()
                if v is not None
            }
        
        cleaned_cv = clean_dict(cv_dict)
        
        # Pretty print JSON
        json_output = json.dumps(cleaned_cv, indent=2, ensure_ascii=False)
        
        # Save to file
        output_file = Path(__file__).parent / "lisbon_resume_extracted.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(json_output)
        
        print(f"\n💾 Full JSON saved to: {output_file}")
        print(f"📏 JSON size: {len(json_output)} characters")
        
        # Show JSON preview
        print(f"\n📋 JSON Preview (first 2000 characters):")
        print("=" * 60)
        print(json_output[:2000])
        if len(json_output) > 2000:
            print(f"\n... (truncated, showing 2000/{len(json_output)} characters)")
        print("=" * 60)
        
        return cleaned_cv
        
    except Exception as e:
        print(f"\n❌ Error during extraction: {e}")
        import traceback
        traceback.print_exc()
        return None


async def main():
    """Run the test."""
    result = await test_lisbon_resume()
    
    if result:
        print(f"\n{'='*80}")
        print("✅ EXTRACTION SUCCESSFUL")
        print(f"{'='*80}")
        print("\nThe full JSON has been saved to: tests/refactoring/lisbon_resume_extracted.json")
        print("You can view the complete extracted data there.")
    else:
        print(f"\n{'='*80}")
        print("❌ EXTRACTION FAILED")
        print(f"{'='*80}")


if __name__ == "__main__":
    asyncio.run(main())