#!/usr/bin/env python3
"""
Quick comparison test - Original vs Updated code
Tests 5 files from png_new folder
"""

import asyncio
import json
import time
from pathlib import Path
import sys
sys.path.append(str(Path(__file__).parent.parent.parent))

from src.core.cv_extraction.data_extractor import DataExtractor
from src.core.local.text_extractor import extract_text


async def test_file(filepath: str, extractor: DataExtractor) -> dict:
    """Test a single file."""
    print(f"  Testing: {Path(filepath).name}")
    
    # Extract text
    raw_text = extract_text(filepath)
    if not raw_text:
        return {"error": "No text extracted", "sections": 0}
    
    # Extract CV
    start = time.time()
    try:
        cv_data = await extractor.extract_cv_data(raw_text)
        elapsed = time.time() - start
        
        # Count sections
        cv_dict = cv_data.model_dump()
        sections = sum(1 for k, v in cv_dict.items() if v and not k.startswith('_'))
        
        return {
            "success": True,
            "time": round(elapsed, 2),
            "sections": sections,
            "text_length": len(raw_text),
            "name": cv_dict.get("hero", {}).get("fullName", "Not found") if cv_dict.get("hero") else "Not found"
        }
    except Exception as e:
        return {"error": str(e), "sections": 0}


async def main():
    """Run quick comparison test."""
    
    # Get 5 files from png_new
    png_new_dir = Path(__file__).parent.parent.parent / "data/cv_examples/png_examples/png_new"
    test_files = list(png_new_dir.glob("*.png"))[:5]
    
    print("="*60)
    print("QUICK COMPARISON TEST - ORIGINAL CODE")
    print("="*60)
    
    # Test with original
    original_extractor = DataExtractor()
    original_results = []
    
    for filepath in test_files:
        result = await test_file(str(filepath), original_extractor)
        original_results.append({
            "file": filepath.name,
            **result
        })
    
    # Print results
    print("\n" + "="*60)
    print("RESULTS SUMMARY")
    print("="*60)
    
    print("\n## ORIGINAL CODE RESULTS\n")
    print("| File | Status | Sections | Time | Name |")
    print("|------|--------|----------|------|------|")
    
    total_sections = 0
    total_time = 0
    success_count = 0
    
    for r in original_results:
        status = "✅" if r.get("success") else "❌"
        sections = r.get("sections", 0)
        time_str = f"{r.get('time', 0):.1f}s" if r.get("success") else "-"
        name = r.get("name", "-")[:20]
        
        print(f"| {r['file'][:20]} | {status} | {sections}/17 | {time_str} | {name} |")
        
        if r.get("success"):
            total_sections += sections
            total_time += r.get("time", 0)
            success_count += 1
    
    if success_count > 0:
        print(f"\n**Summary**:")
        print(f"- Success rate: {success_count}/{len(test_files)}")
        print(f"- Avg sections: {total_sections/success_count:.1f}/17")
        print(f"- Avg time: {total_time/success_count:.1f}s")
    
    # Save detailed results
    with open("quick_test_results.json", "w") as f:
        json.dump({
            "original": original_results
        }, f, indent=2)
    
    print(f"\n✅ Test complete! Results saved to quick_test_results.json")


if __name__ == "__main__":
    asyncio.run(main())