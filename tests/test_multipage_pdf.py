#!/usr/bin/env python3
"""
Test multi-page PDF extraction
"""
import sys
from pathlib import Path

# Add project root to path
sys.path.append(str(Path(__file__).parent.parent))

from services.local.text_extractor import text_extractor

def test_multipage_pdf():
    """Test extraction from multi-page PDF"""
    pdf_path = "data/cv_examples/pdf_examples/pdf/Paris-Resume-Template-Modern.pdf"
    
    print(f"Testing multi-page PDF: {pdf_path}")
    print("="*60)
    
    # Extract text
    text = text_extractor.extract_text(pdf_path)
    
    print(f"Total characters extracted: {len(text)}")
    print(f"Total words: {len(text.split())}")
    print(f"Total lines: {len(text.splitlines())}")
    
    # Check for content from different pages
    print("\nChecking for multi-page content...")
    
    # Page 1 content indicators
    page1_indicators = ["Jennifer Adams", "Project Assistant", "email@email.com", "PROFILE"]
    # Page 2 content indicators (from your image showing hobbies, languages)
    page2_indicators = ["HOBBIES", "Hockey", "Tennis", "Basketball", "LINKS", "LinkedIn", "Pinterest"]
    
    print("\nPage 1 content found:")
    for indicator in page1_indicators:
        found = indicator in text
        print(f"  {indicator}: {'✓' if found else '✗'}")
    
    print("\nPage 2 content found:")
    for indicator in page2_indicators:
        found = indicator in text
        print(f"  {indicator}: {'✓' if found else '✗'}")
    
    # Show text around key sections
    print("\n" + "="*60)
    print("Text excerpts:")
    print("="*60)
    
    # Find and show LINKS section
    if "LINKS" in text:
        links_idx = text.find("LINKS")
        print(f"\nLINKS section (position {links_idx}):")
        print(text[links_idx:links_idx+200])
    
    # Find and show HOBBIES section
    if "HOBBIES" in text:
        hobbies_idx = text.find("HOBBIES")
        print(f"\nHOBBIES section (position {hobbies_idx}):")
        print(text[hobbies_idx:hobbies_idx+100])
    
    # Find and show LANGUAGES section
    if "LANGUAGES" in text:
        languages_idx = text.find("LANGUAGES")
        print(f"\nLANGUAGES section (position {languages_idx}):")
        print(text[languages_idx:languages_idx+100])

if __name__ == "__main__":
    test_multipage_pdf()