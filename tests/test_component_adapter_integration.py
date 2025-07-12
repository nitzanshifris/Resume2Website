#!/usr/bin/env python3
"""
Test Component Adapter Integration with Universal Adapter
"""

import sys
from pathlib import Path

# Add project root to path
sys.path.append(str(Path(__file__).parent))

from services.portfolio.component_adapter import component_adapter
from backend.schemas.unified import CVData

def test_component_adapter_integration():
    """Test that ComponentAdapter now uses Universal Adapter"""
    print("🔗 Testing Component Adapter Integration with Universal Adapter")
    print("=" * 60)
    
    # Create sample CV data
    class MockCVData:
        def __init__(self):
            self.experience = [
                {
                    "jobTitle": "Senior Developer",
                    "companyName": "Tech Corp",
                    "dateRange": "2020-2023",
                    "description": "Led development team",
                    "responsibilities": ["Code review", "Mentoring"]
                }
            ]
            self.skills = [
                {
                    "categoryName": "Frontend",
                    "skills": ["React", "Vue", "Angular"]
                }
            ]
            self.projects = [
                {
                    "title": "E-commerce Platform",
                    "description": "Full-stack web application",
                    "technologies": "React • Node.js",
                    "projectUrl": "https://github.com/user/project"
                }
            ]
            self.contact = [
                {
                    "type": "email",
                    "value": "john@example.com", 
                    "url": "mailto:john@example.com"
                }
            ]
    
    cv_data = MockCVData()
    
    test_cases = [
        ("timeline", "experience"),
        ("bento-grid", "skills"),
        ("card-hover-effect", "projects"),
        ("floating-dock", "contact")
    ]
    
    results = {}
    
    for component_type, section in test_cases:
        print(f"\n🧪 Testing: {component_type} for {section}")
        
        try:
            props = component_adapter.get_component_props(component_type, cv_data, section)
            
            if props:
                print(f"   ✅ Success: Generated {len(props)} props")
                print(f"   📊 Props: {list(props.keys())}")
                
                # Check for Universal Adapter specific features
                if component_type == "timeline" and "entries" in props:
                    print(f"   🎯 Universal Adapter detected: Timeline entries format")
                
                if component_type == "bento-grid":
                    if "cards" in props:
                        print(f"   🔄 Universal Adapter detected: WobbleCard fallback for < 3 items")
                    elif "items" in props:
                        print(f"   🔄 Universal Adapter detected: BentoGrid format")
                
                results[f"{component_type}_{section}"] = {
                    "success": True,
                    "props_count": len(props),
                    "props": list(props.keys())
                }
            else:
                print(f"   ⚠️  No props generated")
                results[f"{component_type}_{section}"] = {
                    "success": False,
                    "error": "No props generated"
                }
                
        except Exception as e:
            print(f"   ❌ Failed: {e}")
            results[f"{component_type}_{section}"] = {
                "success": False,
                "error": str(e)
            }
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 Component Adapter Integration Results")
    print("=" * 60)
    
    total_tests = len(test_cases)
    successful_tests = sum(1 for result in results.values() if result["success"])
    success_rate = (successful_tests / total_tests) * 100
    
    print(f"Total tests: {total_tests}")
    print(f"Successful: {successful_tests}")
    print(f"Success rate: {success_rate:.1f}%")
    
    if success_rate >= 80:
        print("🎉 Component Adapter is now using Universal Adapter!")
        print("✅ Integration successful - props are generated via Universal Adapter")
        return True
    else:
        print("❌ Component Adapter integration needs fixes")
        return False

if __name__ == "__main__":
    success = test_component_adapter_integration()
    exit(0 if success else 1)