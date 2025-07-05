#!/usr/bin/env python3
"""Debug Universal Adapter data flow"""

import json
import logging
from services.portfolio.universal_adapter import universal_adapter

# Enable debug logging
logging.basicConfig(level=logging.DEBUG, format='%(name)s - %(levelname)s - %(message)s')

# Test with actual CV data structure
test_cases = [
    {
        "name": "Experience with dict wrapper",
        "section": "experience",
        "component": "card-hover-effect",
        "data": {
            "experienceItems": [
                {
                    "jobTitle": "Software Engineer",
                    "companyName": "Tech Solutions Inc.",
                    "dateRange": {"startDate": "2019-06", "endDate": "Present"},
                    "location": "San Francisco, CA",
                    "responsibilitiesAndAchievements": [
                        "Developed web applications",
                        "Led team of 5 developers"
                    ]
                }
            ]
        }
    },
    {
        "name": "Education with dict wrapper",
        "section": "education", 
        "component": "card-stack",
        "data": {
            "educationItems": [
                {
                    "degree": "Master of Science",
                    "fieldOfStudy": "Computer Science",
                    "institution": "Stanford University",
                    "dateRange": {"startDate": "2015-09", "endDate": "2017-06"},
                    "gpa": "3.8/4.0"
                }
            ]
        }
    },
    {
        "name": "Skills with categories",
        "section": "skills",
        "component": "bento-grid",
        "data": {
            "skillCategories": [
                {
                    "categoryName": "Programming Languages",
                    "skills": ["Python", "JavaScript", "TypeScript"]
                }
            ]
        }
    }
]

print("=== Testing Universal Adapter Data Flow ===\n")

for test in test_cases:
    print(f"\n--- {test['name']} ---")
    print(f"Input data: {json.dumps(test['data'], indent=2)}")
    
    try:
        result = universal_adapter.adapt(
            test['component'],
            test['data'],
            test['section']
        )
        
        print(f"\nResult: {json.dumps(result, indent=2)}")
        
        # Check for empty values
        if 'cards' in result:
            for i, card in enumerate(result['cards']):
                if any(not v for k, v in card.items() if k not in ['id', 'gradient', 'link']):
                    print(f"⚠️  Card {i} has empty fields: {card}")
        elif 'items' in result:
            for i, item in enumerate(result['items']):
                if not item.get('title') or not item.get('description'):
                    print(f"⚠️  Item {i} has empty fields: {item}")
                    
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

print("\n=== Test Complete ===")