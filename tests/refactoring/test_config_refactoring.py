#!/usr/bin/env python3
"""
Test the refactored data extractor with config extraction.
Compare results with baseline to ensure no regression.
"""

import asyncio
import json
import time
from pathlib import Path
import sys
sys.path.append(str(Path(__file__).parent.parent.parent))

# Import both versions
from src.core.cv_extraction.data_extractor import DataExtractor as OriginalExtractor
from src.core.cv_extraction.data_extractor_refactored import DataExtractor as RefactoredExtractor
from src.core.local.text_extractor import extract_text


async def test_extractor_comparison():
    """Compare original vs refactored extractor."""
    
    # Test file
    test_file = Path(__file__).parent.parent.parent / "data/cv_examples/text_examples/comprehensive_all_components_cv.txt"
    
    if not test_file.exists():
        print(f"❌ Test file not found: {test_file}")
        return
    
    # Extract text
    print(f"📄 Testing with: {test_file.name}")
    raw_text = extract_text(str(test_file))
    
    if not raw_text:
        print("❌ Failed to extract text")
        return
    
    print(f"✅ Extracted {len(raw_text)} characters\n")
    
    # Test original
    print("🔵 Testing ORIGINAL extractor...")
    original_extractor = OriginalExtractor()
    
    start_time = time.time()
    try:
        original_result = await original_extractor.extract_cv_data(raw_text)
        original_time = time.time() - start_time
        original_success = True
        print(f"✅ Original extraction: {original_time:.2f}s")
    except Exception as e:
        print(f"❌ Original failed: {e}")
        original_success = False
        original_result = None
        original_time = 0
    
    # Test refactored
    print("\n🟢 Testing REFACTORED extractor...")
    refactored_extractor = RefactoredExtractor()
    
    start_time = time.time()
    try:
        refactored_result = await refactored_extractor.extract_cv_data(raw_text)
        refactored_time = time.time() - start_time
        refactored_success = True
        print(f"✅ Refactored extraction: {refactored_time:.2f}s")
    except Exception as e:
        print(f"❌ Refactored failed: {e}")
        refactored_success = False
        refactored_result = None
        refactored_time = 0
    
    # Compare results
    print("\n" + "="*60)
    print("📊 COMPARISON RESULTS")
    print("="*60)
    
    if original_success and refactored_success:
        # Convert to dicts for comparison
        original_dict = original_result.model_dump()
        refactored_dict = refactored_result.model_dump()
        
        # Count sections
        original_sections = sum(1 for v in original_dict.values() if v and not str(v).startswith('_'))
        refactored_sections = sum(1 for v in refactored_dict.values() if v and not str(v).startswith('_'))
        
        print(f"Sections extracted:")
        print(f"  Original:   {original_sections}")
        print(f"  Refactored: {refactored_sections}")
        
        print(f"\nExtraction time:")
        print(f"  Original:   {original_time:.2f}s")
        print(f"  Refactored: {refactored_time:.2f}s")
        print(f"  Difference: {refactored_time - original_time:+.2f}s")
        
        # Check if results are identical
        original_json = json.dumps(original_dict, sort_keys=True, default=str)
        refactored_json = json.dumps(refactored_dict, sort_keys=True, default=str)
        
        if original_json == refactored_json:
            print("\n✅ Results are IDENTICAL - refactoring successful!")
        else:
            print("\n⚠️  Results differ - checking differences...")
            
            # Find differences
            for key in set(original_dict.keys()) | set(refactored_dict.keys()):
                if key.startswith('_'):
                    continue
                    
                orig_val = original_dict.get(key)
                ref_val = refactored_dict.get(key)
                
                if orig_val != ref_val:
                    print(f"\n  Difference in '{key}':")
                    if orig_val is None:
                        print(f"    Original: None")
                        print(f"    Refactored: {type(ref_val).__name__}")
                    elif ref_val is None:
                        print(f"    Original: {type(orig_val).__name__}")
                        print(f"    Refactored: None")
                    else:
                        # Just show types if both exist but differ
                        print(f"    Content differs (both have data)")
    
    else:
        print("❌ Cannot compare - one or both extractions failed")
        
    print("\n" + "="*60)
    print("✅ Config refactoring test complete")
    print("="*60)


if __name__ == "__main__":
    asyncio.run(test_extractor_comparison())