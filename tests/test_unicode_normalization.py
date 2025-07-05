#!/usr/bin/env python3
"""
Test Unicode normalization in text extraction
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.local.text_extractor import TextExtractor

def test_normalization():
    """Test the Unicode normalization function"""
    extractor = TextExtractor()
    
    test_cases = [
        # Ligatures
        ("\ufb01xing the issue", "fixing the issue"),  # fi ligature
        ("e\ufb03cient work\ufb02ow", "efficient workflow"),  # ffi and fl ligatures
        
        # Curly quotes
        ("company\u2019s growth", "company's growth"),
        ("\u201Cquoted text\u201D", '"quoted text"'),
        
        # Spacing issues
        ("128 %", "128%"),
        ("increased by 50 %", "increased by 50%"),
        
        # Multiple spaces
        ("too    many     spaces", "too many spaces"),
        
        # Zero-width characters
        ("text\u200Bwith\u200Czero\u200Dwidth", "textwithzerowidth"),
        
        # Mixed issues
        ("We've increased efficiency by 45 %", "We've increased efficiency by 45%"),
    ]
    
    print("Testing Unicode Normalization")
    print("=" * 60)
    
    for input_text, expected in test_cases:
        result = extractor._normalize_text(input_text)
        status = "✅" if result == expected else "❌"
        print(f"{status} Input: {repr(input_text)}")
        print(f"   Expected: {repr(expected)}")
        print(f"   Got: {repr(result)}")
        if result != expected:
            print(f"   MISMATCH!")
        print()
    
    # Test with real problematic text from CVs
    print("\nReal CV Text Examples:")
    print("=" * 60)
    
    problem_text = """
    • Fixed bugs and increased efficiency by 18%
    • Built company's main product with 128 % improvement
    • Used "modern" techniques for development
    """
    
    normalized = extractor._normalize_text(problem_text)
    print("Original:")
    print(repr(problem_text))
    print("\nNormalized:")
    print(repr(normalized))

if __name__ == "__main__":
    test_normalization()