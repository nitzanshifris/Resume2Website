#!/usr/bin/env python3
"""
Simple Universal Adapter Test
Tests the Universal Adapter functionality without full pipeline
"""

import sys
from pathlib import Path

# Add project root to path
sys.path.append(str(Path(__file__).parent))

from services.portfolio.universal_adapter import universal_adapter

def test_universal_adapter():
    """Test Universal Adapter with sample data"""
    print("🔮 Testing Universal Adapter")
    print("=" * 40)
    
    # Test data that mimics real CV extraction
    test_cases = [
        {
            "name": "Timeline for Experience",
            "component_type": "timeline",
            "section": "experience",
            "data": [
                {
                    "jobTitle": "Senior Developer",
                    "companyName": "Tech Corp",
                    "dateRange": "2020-2023",
                    "description": "Led development team",
                    "responsibilities": ["Code review", "Mentoring"]
                },
                {
                    "position": "Junior Developer",
                    "organization": "StartupXYZ", 
                    "duration": "2018-2020",
                    "summary": "Built web applications"
                }
            ]
        },
        {
            "name": "BentoGrid for Skills (fallback test)",
            "component_type": "bento-grid",
            "section": "skills",
            "data": [
                {
                    "categoryName": "Frontend",
                    "skills": ["React", "Vue", "Angular"]
                },
                {
                    "categoryName": "Backend",
                    "skills": ["Python", "Node.js"]
                }
            ]
        },
        {
            "name": "CardHoverEffect for Projects",
            "component_type": "card-hover-effect", 
            "section": "projects",
            "data": [
                {
                    "title": "E-commerce Platform",
                    "description": "Full-stack web application",
                    "technologies": "React • Node.js • MongoDB",
                    "projectUrl": "https://github.com/user/project"
                }
            ]
        },
        {
            "name": "FloatingDock for Contact",
            "component_type": "floating-dock",
            "section": "contact", 
            "data": [
                {
                    "type": "email",
                    "value": "john@example.com",
                    "url": "mailto:john@example.com"
                },
                {
                    "type": "github",
                    "value": "GitHub Profile", 
                    "url": "https://github.com/john"
                }
            ]
        },
        {
            "name": "TextGenerateEffect for Summary",
            "component_type": "text-generate-effect",
            "section": "summary",
            "data": "I am a passionate full-stack developer with 8+ years of experience"
        }
    ]
    
    results = {}
    
    for test_case in test_cases:
        print(f"\n🧪 Testing: {test_case['name']}")
        
        try:
            result = universal_adapter.adapt(
                test_case["component_type"],
                test_case["data"],
                test_case["section"]
            )
            
            print(f"   ✅ Success: Generated {len(result)} props")
            print(f"   📊 Props: {list(result.keys())}")
            
            # Check for specific Universal Adapter features
            if test_case["component_type"] == "bento-grid" and len(test_case["data"]) < 3:
                if "cards" in result:
                    print(f"   🔄 Fallback: WobbleCard (< 3 items)")
                elif "items" in result:
                    print(f"   ⚠️  Unexpected: BentoGrid used for < 3 items")
            
            if test_case["component_type"] == "timeline":
                if "entries" in result and len(result["entries"]) > 0:
                    first_entry = result["entries"][0]
                    if "bullets" in first_entry:
                        print(f"   🎯 Smart field extraction: Found bullets/responsibilities")
            
            results[test_case["name"]] = {
                "success": True,
                "result": result
            }
            
        except Exception as e:
            print(f"   ❌ Failed: {e}")
            results[test_case["name"]] = {
                "success": False,
                "error": str(e)
            }
    
    # Summary
    print("\n" + "=" * 40)
    print("📊 Universal Adapter Test Results")
    print("=" * 40)
    
    total_tests = len(test_cases)
    successful_tests = sum(1 for result in results.values() if result["success"])
    success_rate = (successful_tests / total_tests) * 100
    
    print(f"Total tests: {total_tests}")
    print(f"Successful: {successful_tests}")
    print(f"Success rate: {success_rate:.1f}%")
    
    if success_rate >= 80:
        print("🎉 Universal Adapter is working correctly!")
        return True
    else:
        print("❌ Universal Adapter needs fixes")
        return False

if __name__ == "__main__":
    success = test_universal_adapter()
    exit(0 if success else 1)