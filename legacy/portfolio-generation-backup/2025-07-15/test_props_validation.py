#!/usr/bin/env python3
"""
Test Props Schema Validation
"""
import sys
from pathlib import Path

# Add parent dir to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.core.portfolio_gen.props_schema import props_validator, PropSchema, PropType

def test_props_validation():
    """Test props validation"""
    print("=== Testing Props Schema Validation ===\n")
    
    # Test cases
    test_cases = [
        {
            "name": "Valid Timeline props",
            "component": "timeline",
            "props": {
                "data": [
                    {"title": "Job 1", "subtitle": "Company", "date": "2023"},
                    {"title": "Job 2", "content": "Description"}
                ],
                "show_icons": True
            },
            "expect_valid": True
        },
        {
            "name": "Missing required Timeline data",
            "component": "timeline",
            "props": {
                "show_icons": True
            },
            "expect_valid": False,
            "expected_errors": ["Missing required prop: data"]
        },
        {
            "name": "Invalid Timeline data type",
            "component": "timeline",
            "props": {
                "data": "not an array",
                "show_icons": True
            },
            "expect_valid": False,
            "expected_errors": ["Prop data has invalid type"]
        },
        {
            "name": "Valid BentoGrid props",
            "component": "bento-grid",
            "props": {
                "items": [
                    {"title": "Item 1", "description": "Desc 1"},
                    {"title": "Item 2", "description": "Desc 2", "className": "special"}
                ]
            },
            "expect_valid": True
        },
        {
            "name": "Valid CardStack props",
            "component": "card-stack",
            "props": {
                "items": [
                    {"id": 1, "name": "Card 1", "designation": "Role", "content": "Content here"},
                    {"id": 2, "name": "Card 2", "content": "More content"}
                ],
                "offset": 15
            },
            "expect_valid": True
        },
        {
            "name": "Invalid CardStack - missing content",
            "component": "card-stack",
            "props": {
                "items": [
                    {"id": 1, "name": "Card 1", "designation": "Role"}  # Missing content
                ]
            },
            "expect_valid": False,
            "expected_errors": ["Missing required property: items[0].content"]
        },
        {
            "name": "Valid AnimatedTooltip props",
            "component": "animated-tooltip",
            "props": {
                "items": [
                    {"id": 1, "name": "Person 1", "designation": "Role", "image": "url1"},
                    {"id": 2, "name": "Person 2", "designation": "Role", "image": "url2"}
                ]
            },
            "expect_valid": True
        },
        {
            "name": "Unknown component (should pass)",
            "component": "unknown-component",
            "props": {
                "anything": "goes"
            },
            "expect_valid": True
        }
    ]
    
    for test in test_cases:
        print(f"Test: {test['name']}")
        is_valid, errors = props_validator.validate(test['component'], test['props'])
        
        if is_valid == test['expect_valid']:
            print(f"  ✓ Validation result correct: {'Valid' if is_valid else 'Invalid'}")
        else:
            print(f"  ✗ Unexpected validation result")
            print(f"    Expected: {'Valid' if test['expect_valid'] else 'Invalid'}")
            print(f"    Got: {'Valid' if is_valid else 'Invalid'}")
        
        if errors:
            print(f"  Errors: {errors}")
            if 'expected_errors' in test:
                # Check if we got expected errors
                for expected_error in test['expected_errors']:
                    if any(expected_error in error for error in errors):
                        print(f"    ✓ Expected error found: {expected_error}")
                    else:
                        print(f"    ✗ Expected error not found: {expected_error}")
        
        print()
    
    # Test getting schema
    print("Testing schema retrieval:\n")
    timeline_schema = props_validator.get_schema("timeline")
    if timeline_schema:
        print(f"✓ Retrieved schema for timeline component")
        print(f"  Component: {timeline_schema.component_name}")
        print(f"  Props: {[p.name for p in timeline_schema.props]}")
    else:
        print("✗ Failed to retrieve timeline schema")

if __name__ == "__main__":
    test_props_validation()