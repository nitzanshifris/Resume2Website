#!/usr/bin/env python3
"""
Test Model Router Integration
Verifies that Model Router is working and integrated properly
"""
import asyncio
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../apps/backend'))

from llm_handler.base_handler import model_router, test_model_router, test_async_route

async def test_cv_processing_pipeline():
    """Test the CV processing pipeline with Model Router"""
    print("\n=== Testing CV Processing Pipeline ===")
    
    # Test section identification
    test_cv_text = """
    John Doe
    Software Engineer
    john.doe@email.com
    (555) 123-4567
    
    PROFESSIONAL SUMMARY
    Experienced software engineer with 5 years in full-stack development.
    
    WORK EXPERIENCE
    Senior Developer - Tech Corp (2020-Present)
    - Led team of 5 developers
    - Implemented microservices architecture
    
    EDUCATION
    BS Computer Science - MIT (2018)
    
    SKILLS
    Python, JavaScript, React, Node.js
    """
    
    try:
        print("🔍 Testing section identification...")
        result = await model_router.route(
            task_type="section_identification",
            content=test_cv_text,
            require_json=True,
            metadata={"test": "cv_pipeline"}
        )
        
        print(f"✅ Section identification successful!")
        print(f"   Model used: {result['model_used']}")
        print(f"   Cost: ${result['cost_usd']:.4f}")
        print(f"   Latency: {result['latency_ms']}ms")
        
        # Test experience extraction
        print("\n🔍 Testing experience extraction...")
        exp_result = await model_router.route(
            task_type="experience_extraction",
            content="Senior Developer - Tech Corp (2020-Present)\n- Led team of 5 developers\n- Implemented microservices architecture",
            require_json=True,
            metadata={"test": "experience_extraction"}
        )
        
        print(f"✅ Experience extraction successful!")
        print(f"   Model used: {exp_result['model_used']}")
        print(f"   Cost: ${exp_result['cost_usd']:.4f}")
        
        return True
        
    except Exception as e:
        print(f"❌ Pipeline test failed: {e}")
        return False

async def test_component_selection():
    """Test component selection integration"""
    print("\n=== Testing Component Selection ===")
    
    # Mock CV data
    cv_data = {
        "data": {
            "structured_components": [
                {
                    "component_type": "HeroSection",
                    "data": {
                        "fullName": "John Doe",
                        "professionalTitle": "Software Engineer"
                    }
                },
                {
                    "component_type": "ExperienceSection", 
                    "data": {
                        "experienceItems": [
                            {
                                "jobTitle": "Senior Developer",
                                "companyName": "Tech Corp"
                            }
                        ]
                    }
                }
            ]
        }
    }
    
    try:
        from llm_handler.component_selector_enhanced import component_selector
        
        result = component_selector.select_components(cv_data)
        
        if result["success"]:
            print(f"✅ Component selection successful!")
            print(f"   Archetype: {result['archetype']}")
            print(f"   Components: {len(result['selected_components'])}")
            
            for comp in result['selected_components']:
                print(f"     - {comp['component_type']}: {comp['component_name']}")
            
            return True
        else:
            print(f"❌ Component selection failed: {result.get('error')}")
            return False
            
    except Exception as e:
        print(f"❌ Component selection test failed: {e}")
        return False

async def main():
    """Run all tests"""
    print("🧪 CV2WEB Model Router Integration Tests")
    print("=" * 50)
    
    # Test 1: Basic connection
    print("=== Testing Basic Connection ===")
    basic_connection = test_model_router()
    
    if not basic_connection:
        print("\n❌ Model Router not available. Make sure it's running:")
        print("   ./run_model_router.sh")
        return False
    
    # Test 2: Async routing
    async_test = await test_async_route()
    if not async_test:
        return False
    
    # Test 3: CV processing pipeline
    pipeline_test = await test_cv_processing_pipeline()
    
    # Test 4: Component selection
    component_test = await test_component_selection()
    
    # Test 5: Get final stats
    print("\n=== Final Model Router Stats ===")
    try:
        stats = await model_router.get_stats()
        print(f"Daily cost: ${stats['cost_tracker']['daily']:.4f}")
        print(f"Models available: {len(stats['models_available'])}")
        print(f"Daily budget remaining: ${stats['budget_status']['daily_remaining']:.2f}")
        
        # Show usage if any
        if stats.get('recent_usage'):
            print("\nRecent usage:")
            for usage in stats['recent_usage'][-3:]:
                print(f"  {usage['model']}: ${usage['cost_usd']:.4f} ({usage['latency_ms']}ms)")
                
    except Exception as e:
        print(f"❌ Failed to get stats: {e}")
    
    # Summary
    print("\n" + "=" * 50)
    all_tests = [basic_connection, async_test, pipeline_test, component_test]
    passed = sum(all_tests)
    total = len(all_tests)
    
    if passed == total:
        print(f"🎉 All tests passed! ({passed}/{total})")
        print("\n✅ Model Router integration is working correctly!")
        print("✅ CV processing pipeline is ready!")
        print("✅ Component selection is functional!")
        print("\n🚀 System is ready for full automatic CV processing!")
        return True
    else:
        print(f"⚠️  {passed}/{total} tests passed")
        print("\n❌ Some components need attention before full deployment")
        return False

if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1)