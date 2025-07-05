#!/usr/bin/env python3
"""
Test URL Normalizer
"""
import sys
from pathlib import Path

# Add parent dir to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from services.llm.url_normalizer import normalize_url, normalize_urls_in_dict

def test_url_normalizer():
    """Test URL normalization"""
    print("=== Testing URL Normalizer ===\n")
    
    # Test cases
    test_urls = [
        # Missing protocol
        ("example.com", "https://example.com"),
        ("www.linkedin.com/in/johndoe", "https://www.linkedin.com/in/johndoe"),
        
        # LinkedIn specific
        ("linkedin.com/in/johndoe", "https://www.linkedin.com/in/johndoe"),
        ("/in/johndoe", "https://www.linkedin.com/in/johndoe"),
        ("http://linkedin.com/in/johndoe", "https://www.linkedin.com/in/johndoe"),
        
        # GitHub specific
        ("github.com/user/repo", "https://github.com/user/repo"),
        
        # Protocol typos
        ("htpp://example.com", "http://example.com"),
        ("htpps://example.com", "https://example.com"),
        
        # Already valid
        ("https://example.com", "https://example.com"),
        ("https://example.com/path/to/page", "https://example.com/path/to/page"),
        
        # Trailing slashes
        ("https://example.com/", "https://example.com"),
        ("https://example.com/path/", "https://example.com/path"),
        
        # Malformed
        ("https:/example.com", "https://example.com"),
        ("https:example.com", "https://example.com"),
    ]
    
    print("URL Normalization Tests:")
    for input_url, expected in test_urls:
        result = normalize_url(input_url)
        status = "✓" if result == expected else "✗"
        print(f"{status} '{input_url}' → '{result}'")
        if result != expected:
            print(f"   Expected: '{expected}'")
    
    # Test dictionary normalization
    print("\n\nDictionary Normalization Test:")
    test_data = {
        "profilePhotoUrl": "example.com/photo.jpg",
        "contact": {
            "professionalLinks": [
                {"platform": "LinkedIn", "url": "linkedin.com/in/johndoe"},
                {"platform": "GitHub", "url": "github.com/johndoe"}
            ]
        },
        "certifications": {
            "certificationItems": [
                {
                    "title": "AWS Certified",
                    "verificationUrl": "aws.amazon.com/verify/123"
                }
            ]
        }
    }
    
    normalized = normalize_urls_in_dict(test_data)
    
    print("Original:")
    print(f"  profilePhotoUrl: {test_data['profilePhotoUrl']}")
    print(f"  LinkedIn: {test_data['contact']['professionalLinks'][0]['url']}")
    print(f"  GitHub: {test_data['contact']['professionalLinks'][1]['url']}")
    print(f"  AWS: {test_data['certifications']['certificationItems'][0]['verificationUrl']}")
    
    print("\nNormalized:")
    print(f"  profilePhotoUrl: {normalized['profilePhotoUrl']}")
    print(f"  LinkedIn: {normalized['contact']['professionalLinks'][0]['url']}")
    print(f"  GitHub: {normalized['contact']['professionalLinks'][1]['url']}")
    print(f"  AWS: {normalized['certifications']['certificationItems'][0]['verificationUrl']}")

if __name__ == "__main__":
    test_url_normalizer()