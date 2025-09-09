"""
Test that the singleton pattern fix works correctly for multi-tenant safety
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import asyncio
from unittest.mock import patch, MagicMock

# Test the refactored versions
from src.core.cv_extraction.llm_service_refactored import create_llm_service, LLMService
from src.core.cv_extraction.data_extractor_refactored import create_data_extractor, DataExtractor


def test_llm_service_no_singleton():
    """Test that LLMService creates independent instances"""
    
    # Mock environment to avoid needing real API keys
    with patch.dict(os.environ, {"ANTHROPIC_API_KEY": "default-key"}):
        # Create multiple services
        service1 = create_llm_service()
        service2 = create_llm_service()
        service3 = create_llm_service(api_key="custom-key")
        
        # They should be different instances
        assert service1 is not service2
        assert service2 is not service3
        assert service1 is not service3
        
        # Different API keys should result in different hashes
        assert service1.get_api_key_hash() == service2.get_api_key_hash()  # Both use default
        assert service1.get_api_key_hash() != service3.get_api_key_hash()  # Different keys
        
        print("✅ LLMService creates independent instances")


def test_data_extractor_no_singleton():
    """Test that DataExtractor creates independent instances"""
    
    with patch.dict(os.environ, {"ANTHROPIC_API_KEY": "default-key"}):
        # Create multiple extractors
        extractor1 = create_data_extractor()
        extractor2 = create_data_extractor()
        extractor3 = create_data_extractor(api_key="custom-key")
        
        # They should be different instances
        assert extractor1 is not extractor2
        assert extractor2 is not extractor3
        assert extractor1 is not extractor3
        
        # Their LLM services should also be different instances
        assert extractor1.llm_service is not extractor2.llm_service
        assert extractor2.llm_service is not extractor3.llm_service
        
        print("✅ DataExtractor creates independent instances")


def test_multi_tenant_isolation():
    """Test that different tenants' API keys are properly isolated"""
    
    with patch.dict(os.environ, {"ANTHROPIC_API_KEY": "default-key"}):
        # Simulate two tenants with different API keys
        tenant1_key = "tenant1-api-key"
        tenant2_key = "tenant2-api-key"
        
        # Create extractors for each tenant
        tenant1_extractor = create_data_extractor(api_key=tenant1_key)
        tenant2_extractor = create_data_extractor(api_key=tenant2_key)
        
        # Verify they have different API keys
        hash1 = tenant1_extractor.llm_service.get_api_key_hash()
        hash2 = tenant2_extractor.llm_service.get_api_key_hash()
        
        assert hash1 != hash2, "Different tenants should have different API key hashes"
        
        # Verify the actual keys are different (without exposing them)
        assert tenant1_extractor.llm_service.api_key == tenant1_key
        assert tenant2_extractor.llm_service.api_key == tenant2_key
        
        print("✅ Multi-tenant API key isolation verified")


async def test_concurrent_requests():
    """Test that concurrent requests don't interfere with each other"""
    
    with patch.dict(os.environ, {"ANTHROPIC_API_KEY": "default-key"}):
        # Mock the Claude client to avoid actual API calls
        with patch('src.core.cv_extraction.llm_service_refactored.AsyncAnthropic'):
            
            async def process_request(api_key: str, request_id: int):
                """Simulate processing a request with a specific API key"""
                extractor = create_data_extractor(api_key=api_key)
                
                # Verify this extractor has the right key
                assert extractor.llm_service.api_key == api_key
                
                # Simulate some async work
                await asyncio.sleep(0.01)
                
                # Verify the key hasn't changed
                assert extractor.llm_service.api_key == api_key
                
                return f"Request {request_id} completed with key {api_key[:5]}..."
            
            # Create multiple concurrent requests with different API keys
            tasks = []
            for i in range(10):
                api_key = f"api-key-{i}"
                task = process_request(api_key, i)
                tasks.append(task)
            
            # Run all requests concurrently
            results = await asyncio.gather(*tasks)
            
            # Verify all completed successfully
            assert len(results) == 10
            for i, result in enumerate(results):
                assert f"Request {i}" in result
                assert f"api-key-{i}"[:5] in result
            
            print("✅ Concurrent requests properly isolated")


def test_dependency_injection_pattern():
    """Test that dependency injection pattern works correctly"""
    
    with patch.dict(os.environ, {"ANTHROPIC_API_KEY": "default-key"}):
        # Create LLM service separately
        llm_service = create_llm_service(api_key="injected-key")
        
        # Inject it into extractor
        extractor = DataExtractor(llm_service=llm_service)
        
        # Verify the injected service is used
        assert extractor.llm_service is llm_service
        assert extractor.llm_service.api_key == "injected-key"
        
        # Create another extractor with different service
        another_llm = create_llm_service(api_key="another-key")
        another_extractor = DataExtractor(llm_service=another_llm)
        
        # Verify they're independent
        assert another_extractor.llm_service is not extractor.llm_service
        assert another_extractor.llm_service.api_key != extractor.llm_service.api_key
        
        print("✅ Dependency injection pattern works correctly")


def run_all_tests():
    """Run all singleton fix tests"""
    print("\n" + "="*60)
    print("Testing Singleton Pattern Fix")
    print("="*60 + "\n")
    
    test_llm_service_no_singleton()
    test_data_extractor_no_singleton()
    test_multi_tenant_isolation()
    test_dependency_injection_pattern()
    
    # Run async test
    asyncio.run(test_concurrent_requests())
    
    print("\n" + "="*60)
    print("✅ ALL SINGLETON FIX TESTS PASSED!")
    print("Multi-tenant safety verified!")
    print("="*60 + "\n")


if __name__ == "__main__":
    run_all_tests()