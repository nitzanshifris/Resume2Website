#!/usr/bin/env python3
"""
Debug script to investigate skills section extraction issue
"""

import asyncio
import json
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent.parent))

from src.core.cv_extraction.data_extractor import DataExtractor
from src.core.cv_extraction.prompt_templates import prompt_registry
from src.core.local.text_extractor import extract_text


async def debug_skills_extraction():
    """Debug why skills section is not being extracted."""
    
    print("="*60)
    print("DEBUGGING SKILLS SECTION EXTRACTION")
    print("="*60)
    
    # Use a test file
    test_file = Path(__file__).parent.parent.parent / "data/cv_examples/png_examples/png_new/isaac_hall.png"
    
    if not test_file.exists():
        print(f"❌ Test file not found: {test_file}")
        return
    
    print(f"\n📄 Testing with: {test_file.name}")
    
    # Extract text
    print("\n1️⃣ Extracting text...")
    raw_text = extract_text(str(test_file))
    print(f"   Extracted {len(raw_text)} characters")
    
    # Check if text contains skill-related keywords
    print("\n2️⃣ Checking for skill-related content in text...")
    skill_keywords = ['skill', 'proficien', 'technolog', 'language', 'framework', 
                      'tool', 'expert', 'python', 'java', 'javascript']
    
    found_keywords = []
    for keyword in skill_keywords:
        if keyword.lower() in raw_text.lower():
            found_keywords.append(keyword)
    
    if found_keywords:
        print(f"   ✅ Found skill keywords: {', '.join(found_keywords)}")
        
        # Show some context
        text_lower = raw_text.lower()
        for keyword in found_keywords[:3]:
            idx = text_lower.find(keyword.lower())
            if idx != -1:
                start = max(0, idx - 50)
                end = min(len(raw_text), idx + 100)
                context = raw_text[start:end]
                print(f"\n   Context for '{keyword}':")
                print(f"   ...{context}...")
    else:
        print(f"   ⚠️ No obvious skill keywords found")
    
    # Check prompt template for skills
    print("\n3️⃣ Checking skills prompt template...")
    from src.core.schemas.unified_nullable import SkillsSection
    
    skills_prompt = prompt_registry.create_prompt(
        'skills', 
        SkillsSection,  # Pass the class, not the schema
        raw_text[:500]  # Use first 500 chars for testing
    )
    
    print(f"   Prompt length: {len(skills_prompt)} characters")
    print(f"   Prompt preview (first 300 chars):")
    print(f"   {skills_prompt[:300]}...")
    
    # Extract with full pipeline
    print("\n4️⃣ Running full extraction...")
    extractor = DataExtractor()
    cv_data = await extractor.extract_cv_data(raw_text)
    
    cv_dict = cv_data.model_dump()
    
    # Check skills section specifically
    print("\n5️⃣ Analyzing skills extraction result...")
    
    if 'skills' in cv_dict and cv_dict['skills']:
        skills = cv_dict['skills']
        print(f"   ✅ Skills section found!")
        
        if isinstance(skills, dict):
            if 'skillCategories' in skills:
                categories = skills['skillCategories']
                print(f"   Categories: {len(categories) if categories else 0}")
                
                if categories:
                    for cat in categories[:3]:  # Show first 3 categories
                        if isinstance(cat, dict):
                            print(f"   - {cat.get('categoryName', 'Unknown')}: {len(cat.get('skills', []))} skills")
                            if cat.get('skills'):
                                print(f"     Skills: {', '.join(cat['skills'][:5])}")
            
            if 'ungroupedSkills' in skills:
                ungrouped = skills['ungroupedSkills']
                if ungrouped:
                    print(f"   Ungrouped skills: {len(ungrouped)}")
                    print(f"     {', '.join(ungrouped[:10])}")
    else:
        print(f"   ❌ Skills section is None or missing")
    
    # Check all sections to see what was extracted
    print("\n6️⃣ All extracted sections:")
    for section_name, section_data in cv_dict.items():
        if section_data and not section_name.startswith('_'):
            # Count non-empty items
            if isinstance(section_data, dict):
                non_empty = sum(1 for v in section_data.values() if v)
                print(f"   ✅ {section_name}: {non_empty} fields")
            else:
                print(f"   ✅ {section_name}: present")
    
    # Try direct extraction of skills section
    print("\n7️⃣ Attempting direct skills extraction...")
    try:
        from src.core.cv_extraction.llm_service import get_llm_service
        from src.core.cv_extraction.section_extractor import SectionExtractor
        
        llm_service = get_llm_service()
        section_extractor = SectionExtractor({'skills': SkillsSection})
        
        result = await section_extractor.extract(
            section_name='skills',
            raw_text=raw_text,
            llm_caller=llm_service.call_llm
        )
        
        if result and 'skills' in result:
            print(f"   ✅ Direct extraction succeeded!")
            skills_data = result['skills']
            if skills_data:
                print(f"   Result: {json.dumps(skills_data, indent=2)[:500]}...")
        else:
            print(f"   ❌ Direct extraction returned None or empty")
            
    except Exception as e:
        print(f"   ❌ Direct extraction failed: {e}")
        import traceback
        traceback.print_exc()
    
    return cv_dict


async def check_skills_processing():
    """Check if skills processing pipeline has issues."""
    
    print("\n" + "="*60)
    print("CHECKING SKILLS PROCESSING PIPELINE")
    print("="*60)
    
    # Test with mock data
    print("\n1️⃣ Testing skills processing with mock data...")
    
    from src.core.cv_extraction.section_extractor import SectionExtractor
    from src.core.schemas.unified_nullable import SkillsSection
    
    # Create mock skills data
    mock_skills_raw = {
        'skillCategories': [
            {
                'categoryName': 'Programming',
                'skills': ['Python', 'python', 'PYTHON', 'JavaScript', 'Java']
            },
            {
                'categoryName': 'Databases',
                'skills': ['MySQL', 'PostgreSQL', 'MySQL']  # Duplicate
            }
        ]
    }
    
    section_extractor = SectionExtractor({'skills': SkillsSection})
    
    # Apply processing pipeline
    processed = section_extractor.apply_processing_pipeline('skills', mock_skills_raw)
    
    print(f"   Original skills in Programming: {mock_skills_raw['skillCategories'][0]['skills']}")
    print(f"   Processed skills in Programming: {processed['skillCategories'][0]['skills']}")
    
    # Test validation
    print("\n2️⃣ Testing skills validation...")
    validated = section_extractor.validate_section('skills', processed, SkillsSection)
    
    if validated:
        print(f"   ✅ Validation passed")
    else:
        print(f"   ❌ Validation failed")
    
    # Check if issue is in post-processing
    print("\n3️⃣ Testing post-processor clean_empty_sections...")
    
    from src.core.cv_extraction.post_processor import post_processor
    
    test_data = {
        'skills': {
            'skillCategories': [],  # Empty categories
            'ungroupedSkills': []   # Empty ungrouped
        }
    }
    
    cleaned = post_processor.clean_empty_sections(test_data)
    
    if 'skills' in cleaned:
        print(f"   ⚠️ Empty skills section was kept")
    else:
        print(f"   ✅ Empty skills section was removed")
    
    # Test with non-empty skills
    test_data2 = {
        'skills': {
            'skillCategories': [
                {'categoryName': 'Test', 'skills': ['Python']}
            ]
        }
    }
    
    cleaned2 = post_processor.clean_empty_sections(test_data2)
    
    if 'skills' in cleaned2:
        print(f"   ✅ Non-empty skills section was kept")
    else:
        print(f"   ❌ Non-empty skills section was incorrectly removed")


async def main():
    """Run all debugging checks."""
    
    # Debug extraction
    cv_dict = await debug_skills_extraction()
    
    # Check processing pipeline
    await check_skills_processing()
    
    # Summary
    print("\n" + "="*60)
    print("DEBUGGING SUMMARY")
    print("="*60)
    
    if cv_dict and 'skills' in cv_dict and cv_dict['skills']:
        print("\n✅ Skills extraction is working!")
        print("The issue may have been temporary or related to specific test data.")
    else:
        print("\n❌ Skills extraction issue confirmed")
        print("\nPossible causes:")
        print("1. LLM not returning skills data in expected format")
        print("2. Post-processing removing valid skills data")
        print("3. Validation failing on valid skills data")
        print("4. Skills section being cleaned as 'empty' incorrectly")


if __name__ == "__main__":
    asyncio.run(main())