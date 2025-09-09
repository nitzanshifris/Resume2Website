#!/usr/bin/env python3
"""
Super quick test - just 2 files
"""

import asyncio
import time
from pathlib import Path
import sys
sys.path.append(str(Path(__file__).parent.parent.parent))

from src.core.cv_extraction.data_extractor import DataExtractor
from src.core.local.text_extractor import extract_text


async def main():
    """Run super quick test on 2 files."""
    
    # Get 2 files from png_new
    png_new_dir = Path(__file__).parent.parent.parent / "data/cv_examples/png_examples/png_new"
    test_files = list(png_new_dir.glob("*.png"))[:2]
    
    print("="*60)
    print("SUPER QUICK TEST - 2 FILES ONLY")
    print("="*60)
    
    extractor = DataExtractor()
    
    results = []
    for filepath in test_files:
        print(f"\nFile: {filepath.name}")
        
        # Extract text
        print("  Extracting text...")
        text_start = time.time()
        raw_text = extract_text(str(filepath))
        text_time = time.time() - text_start
        
        if not raw_text:
            print("  ❌ No text extracted")
            results.append({"file": filepath.name, "error": "No text"})
            continue
        
        print(f"  ✅ Text: {len(raw_text)} chars in {text_time:.1f}s")
        
        # Extract CV
        print("  Extracting CV data...")
        cv_start = time.time()
        try:
            cv_data = await extractor.extract_cv_data(raw_text)
            cv_time = time.time() - cv_start
            
            # Count sections
            cv_dict = cv_data.model_dump()
            sections = sum(1 for k, v in cv_dict.items() if v and not k.startswith('_'))
            
            name = cv_dict.get("hero", {}).get("fullName", "Not found") if cv_dict.get("hero") else "Not found"
            
            print(f"  ✅ CV: {sections}/17 sections in {cv_time:.1f}s")
            print(f"  Name: {name}")
            
            results.append({
                "file": filepath.name,
                "success": True,
                "sections": sections,
                "time": round(cv_time, 1),
                "name": name
            })
            
        except Exception as e:
            print(f"  ❌ Error: {e}")
            results.append({"file": filepath.name, "error": str(e)})
    
    print("\n" + "="*60)
    print("RESULTS")
    print("="*60)
    
    for r in results:
        if r.get("success"):
            print(f"✅ {r['file']}: {r['sections']}/17 sections, {r['time']}s, Name: {r['name']}")
        else:
            print(f"❌ {r['file']}: {r.get('error', 'Failed')}")


if __name__ == "__main__":
    asyncio.run(main())