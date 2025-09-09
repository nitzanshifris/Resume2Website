#!/usr/bin/env python3
"""
Test text extraction with different file types
"""
import sys
import logging
from pathlib import Path
from services.local.text_extractor import text_extractor

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

def test_file(file_path: str):
    """Test text extraction on a single file"""
    print(f"\n{'='*60}")
    print(f"Testing: {file_path}")
    print('='*60)
    
    try:
        # Extract text
        text = text_extractor.extract_text(file_path)
        
        # Show results
        print(f"\n✅ Success! Extracted {len(text)} characters")
        print(f"\nFirst 500 characters:")
        print("-" * 40)
        print(text[:500])
        if len(text) > 500:
            print("...")
        print("-" * 40)
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()


def main():
    if len(sys.argv) < 2:
        print("Usage: python test_extraction.py <file_path> [file_path2] ...")
        print("\nExample:")
        print("  python test_extraction.py test_files/resume.pdf")
        print("  python test_extraction.py test_files/cv.docx test_files/scan.jpg")
        sys.exit(1)
    
    # Test each provided file
    for file_path in sys.argv[1:]:
        if Path(file_path).exists():
            test_file(file_path)
        else:
            print(f"\n❌ File not found: {file_path}")
    
    print("\n✅ Testing complete!")


if __name__ == "__main__":
    main()