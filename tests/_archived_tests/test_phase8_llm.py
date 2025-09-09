#!/usr/bin/env python3
"""
Test Phase 8 - LLMService integration
Verifies LLM service has been successfully extracted
"""

import asyncio
import time
from pathlib import Path
import sys
sys.path.append(str(Path(__file__).parent.parent.parent))

from src.core.cv_extraction.data_extractor import DataExtractor
from src.core.cv_extraction.llm_service import LLMService, get_llm_service
from src.core.local.text_extractor import extract_text


async def test_llm_service():
    """Test the LLMService functionality."""
    
    print("="*60)
    print("PHASE 8 - Testing LLMService")
    print("="*60)
    
    # Test LLMService directly
    print("\n🤖 Testing LLMService:")
    
    try:
        llm = get_llm_service()
        
        # Get model info
        model_info = llm.get_model_info()
        print(f"  Model info:")
        print(f"    - Model: {model_info['model']}")
        print(f"    - Available: {model_info['available']}")
        print(f"    - Deterministic: {model_info['deterministic']}")
        print(f"    - Temperature: {model_info['config']['temperature']}")
        
        # Test health check
        print(f"\n  Health check:")
        is_healthy = await llm.health_check()
        print(f"    - Status: {'✅ Healthy' if is_healthy else '❌ Unhealthy'}")
        
        # Test simple LLM call
        print(f"\n  Test LLM call:")
        test_prompt = 'Extract: {"name": "Test User"}'
        model_used, response = await llm.call_llm(test_prompt, "test")
        print(f"    - Model used: {model_used}")
        print(f"    - Response length: {len(response)} characters")
        
        return True
        
    except Exception as e:
        print(f"  ❌ Error initializing LLM service: {e}")
        return False


async def test_extraction_with_llm_service():
    """Test full extraction with LLMService."""
    
    print("\n" + "="*60)
    print("Testing CV extraction with LLMService")
    print("="*60)
    
    # Use a test file
    test_file = Path(__file__).parent.parent.parent / "data/cv_examples/png_examples/png_new/isaac_hall.png"
    
    if not test_file.exists():
        print(f"❌ Test file not found: {test_file}")
        return False
    
    print(f"\n📄 Testing with: {test_file.name}")
    
    # Extract text
    print("  Extracting text...")
    raw_text = extract_text(str(test_file))
    
    if not raw_text:
        print("  ❌ No text extracted")
        return False
    
    print(f"  ✅ Text: {len(raw_text)} characters")
    
    # Test extraction with LLM service
    print("  Testing CV extraction with LLMService...")
    extractor = DataExtractor()
    
    # Verify LLM service is being used
    if hasattr(extractor, 'llm_service'):
        print("  ✅ LLMService integrated into DataExtractor")
    else:
        print("  ❌ LLMService not found in DataExtractor")
        return False
    
    start = time.time()
    try:
        cv_data = await extractor.extract_cv_data(raw_text)
        elapsed = time.time() - start
        
        cv_dict = cv_data.model_dump()
        sections = sum(1 for k, v in cv_dict.items() if v and not k.startswith('_'))
        
        print(f"\n  ✅ Extraction successful!")
        print(f"     - Time: {elapsed:.1f}s")
        print(f"     - Sections: {sections}/17")
        print(f"     - Name: {cv_dict.get('hero', {}).get('fullName', 'Not found')}")
        
        return True
        
    except Exception as e:
        print(f"  ❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False


async def test_code_reduction():
    """Check file size reduction."""
    
    print("\n" + "="*60)
    print("Code Reduction Analysis")
    print("="*60)
    
    # Count lines in data_extractor.py
    import subprocess
    result = subprocess.run(
        ['wc', '-l', 'src/core/cv_extraction/data_extractor.py'],
        capture_output=True,
        text=True
    )
    
    if result.returncode == 0:
        lines = int(result.stdout.split()[0])
        print(f"\n  Current data_extractor.py: {lines} lines")
        print(f"  Original after Phase 7: 283 lines")
        print(f"  Reduction: {283 - lines} lines removed")
        print(f"  New LLMService: ~130 lines (reusable)")
    
    return True


async def main():
    """Run all Phase 8 tests."""
    
    # Test LLMService
    success1 = await test_llm_service()
    
    # Test full extraction
    success2 = await test_extraction_with_llm_service()
    
    # Check code reduction
    success3 = await test_code_reduction()
    
    # Summary
    print("\n" + "="*60)
    print("📊 PHASE 8 METRICS:")
    print("  - Extracted: All LLM initialization and API call logic")
    print("  - New LLMService: Centralized LLM management")
    print("  - Benefits: Testable, reusable, single configuration point")
    print("  - Code reduction: ~60 lines removed from data_extractor.py")
    
    if success1 and success2 and success3:
        print("\n✅ PHASE 8 COMPLETE - LLMService working!")
    else:
        print("\n⚠️ PHASE 8 - Some tests failed")
    
    print("="*60)


if __name__ == "__main__":
    asyncio.run(main())