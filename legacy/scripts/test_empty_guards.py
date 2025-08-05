#!/usr/bin/env python3
"""
Test Empty Section Guards in Portfolio Generator
"""
import sys
from pathlib import Path

# Add parent dir to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from services.portfolio.portfolio_generator import PortfolioGenerator
from services.portfolio.component_selector import ComponentSelection

def test_empty_guards():
    """Test that empty section guards work properly"""
    print("=== Testing Empty Section Guards ===\n")
    
    generator = PortfolioGenerator()
    
    # Test cases
    test_cases = [
        {
            "name": "Timeline with empty data",
            "component_type": "timeline",
            "props_name": "experienceData",
            "expected_check": "(experienceData.items?.length > 0 || experienceData.cards?.length > 0 || experienceData.entries?.length > 0 || experienceData.people?.length > 0 || experienceData.testimonials?.length > 0)"
        },
        {
            "name": "Text effect with empty data",
            "component_type": "text-generate-effect",
            "props_name": "summaryData",
            "expected_check": "(summaryData.words || summaryData.text || summaryData.content)"
        },
        {
            "name": "Card stack with empty data",
            "component_type": "card-stack",
            "props_name": "educationData", 
            "expected_check": "(educationData.items?.length > 0 || educationData.cards?.length > 0 || educationData.entries?.length > 0 || educationData.people?.length > 0 || educationData.testimonials?.length > 0)"
        }
    ]
    
    for test in test_cases:
        print(f"Test: {test['name']}")
        empty_check = generator._get_empty_check(test['component_type'], test['props_name'])
        
        if empty_check == test['expected_check']:
            print(f"  ✓ Correct empty check generated")
        else:
            print(f"  ✗ Incorrect empty check")
            print(f"    Expected: {test['expected_check']}")
            print(f"    Got: {empty_check}")
        print()
    
    # Test component rendering with empty check
    print("Testing component rendering with empty guards:\n")
    
    test_selection = ComponentSelection(
        section="experience",
        component_type="timeline",
        import_path="@/components/ui/timeline/timeline-base",
        props={},
        priority=1
    )
    
    # Test rendering
    component_html = generator._render_component_tsx_with_adapter(
        "timeline",
        "Timeline", 
        "experience",
        "experienceData",
        "John Doe"
    )
    
    # Check if empty guard is present
    if "experienceData.items?.length > 0" in component_html and " && (" in component_html:
        print("✓ Empty guard properly integrated in component rendering")
    else:
        print("✗ Empty guard not found in component rendering")
    
    print("\nGenerated component:")
    print("-" * 50)
    print(component_html)
    print("-" * 50)

if __name__ == "__main__":
    test_empty_guards()