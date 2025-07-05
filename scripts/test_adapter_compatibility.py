#!/usr/bin/env python3
"""
Test Adapter Compatibility Layer
"""
import sys
from pathlib import Path

# Add parent dir to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from services.portfolio.adapter_compatibility import ensure_compatibility

def test_adapter_compatibility():
    """Test the adapter compatibility layer"""
    print("=== Testing Adapter Compatibility ===\n")
    
    # Test cases
    test_cases = [
        {
            "name": "AnimatedTooltip with people",
            "input": {"people": [{"id": 1, "name": "Test"}], "className": "test"},
            "expected_keys": ["people", "items", "className"]
        },
        {
            "name": "CardStack with cards", 
            "input": {"cards": [{"id": 1, "content": "Test"}], "offset": 10},
            "expected_keys": ["cards", "items", "offset"]
        },
        {
            "name": "Timeline with entries",
            "input": {"entries": [{"title": "Test"}], "show_icons": True},
            "expected_keys": ["entries", "items", "data", "show_icons"]
        },
        {
            "name": "Content aliases",
            "input": {"content": "Test content", "title": "Test title"},
            "expected_keys": ["content", "description", "text", "title", "name", "heading"]
        }
    ]
    
    for test in test_cases:
        print(f"Test: {test['name']}")
        result = ensure_compatibility(test['input'])
        
        # Check all expected keys are present
        missing_keys = []
        for key in test['expected_keys']:
            if key not in result:
                missing_keys.append(key)
        
        if missing_keys:
            print(f"  ✗ Missing keys: {missing_keys}")
        else:
            print(f"  ✓ All expected keys present")
        
        # Show the result
        print(f"  Input: {test['input']}")
        print(f"  Output: {result}")
        print()

if __name__ == "__main__":
    test_adapter_compatibility()