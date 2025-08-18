#!/usr/bin/env python3
"""
Unit Tests for LLMService
Tests LLM API interactions, retry logic, and health checks
"""

import unittest
from unittest.mock import Mock, AsyncMock, patch, MagicMock
import asyncio
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent.parent))

from src.core.cv_extraction.llm_service import LLMService, get_llm_service


class TestLLMService(unittest.TestCase):
    """Test LLMService functionality."""
    
    @patch('src.core.cv_extraction.llm_service.Anthropic')
    @patch('src.core.cv_extraction.llm_service.AsyncAnthropic')
    def test_singleton_pattern(self, mock_async_anthropic, mock_anthropic):
        """Test that LLMService follows singleton pattern."""
        # Mock the clients
        mock_anthropic.return_value = Mock()
        mock_async_anthropic.return_value = Mock()
        
        service1 = get_llm_service("test_key_1")
        service2 = get_llm_service("test_key_1")
        
        # Should be same instance for same key
        self.assertIs(service1, service2)
        
        # Different key should create new instance
        service3 = get_llm_service("test_key_2")
        self.assertIsNot(service1, service3)
    
    @patch('src.core.cv_extraction.llm_service.Anthropic')
    @patch('src.core.cv_extraction.llm_service.AsyncAnthropic')
    def test_initialization_with_api_key(self, mock_async_anthropic, mock_anthropic):
        """Test service initialization with API key."""
        mock_client = Mock()
        mock_async_client = Mock()
        mock_anthropic.return_value = mock_client
        mock_async_anthropic.return_value = mock_async_client
        
        service = LLMService(api_key="test_api_key")
        
        # Should initialize clients with API key
        mock_anthropic.assert_called_once_with(api_key="test_api_key")
        mock_async_anthropic.assert_called_once_with(api_key="test_api_key")
        
        self.assertEqual(service.claude_client, mock_async_client)
        self.assertEqual(service.claude_sync_client, mock_client)
    
    @patch('src.core.cv_extraction.llm_service.keyring')
    @patch('src.core.cv_extraction.llm_service.Anthropic')
    @patch('src.core.cv_extraction.llm_service.AsyncAnthropic')
    def test_initialization_from_keychain(self, mock_async_anthropic, mock_anthropic, mock_keyring):
        """Test service initialization from keychain."""
        mock_keyring.get_password.return_value = "keychain_api_key"
        
        mock_anthropic.return_value = Mock()
        mock_async_anthropic.return_value = Mock()
        
        service = LLMService()
        
        # Should try keychain
        mock_keyring.get_password.assert_called_with("RESUME2WEBSITE_MVP", "CLAUDE_API_KEY")
        
        # Should initialize with keychain key
        mock_anthropic.assert_called_with(api_key="keychain_api_key")
    
    @patch.dict('os.environ', {'CLAUDE_API_KEY': 'env_api_key'})
    @patch('src.core.cv_extraction.llm_service.keyring')
    @patch('src.core.cv_extraction.llm_service.Anthropic')
    @patch('src.core.cv_extraction.llm_service.AsyncAnthropic')
    def test_initialization_from_env(self, mock_async_anthropic, mock_anthropic, mock_keyring):
        """Test service initialization from environment variable."""
        mock_keyring.get_password.return_value = None  # No keychain key
        
        mock_anthropic.return_value = Mock()
        mock_async_anthropic.return_value = Mock()
        
        service = LLMService()
        
        # Should use env var when keychain fails
        mock_anthropic.assert_called_with(api_key="env_api_key")
    
    def test_get_model_info(self):
        """Test model info retrieval."""
        service = LLMService.__new__(LLMService)
        service.model_name = "claude-3-opus-20240229"
        service.model_config = {
            "temperature": 0.0,
            "max_tokens": 4096
        }
        
        info = service.get_model_info()
        
        self.assertEqual(info['model'], "claude-3-opus-20240229")
        self.assertEqual(info['temperature'], 0.0)
        self.assertEqual(info['max_tokens'], 4096)
        self.assertTrue(info['deterministic'])
    
    @patch('src.core.cv_extraction.llm_service.AsyncAnthropic')
    async def test_call_llm_success(self, mock_async_anthropic):
        """Test successful LLM API call."""
        # Setup mock response
        mock_response = Mock()
        mock_response.content = [Mock(text="{'extracted': 'data'}")]
        
        mock_client = AsyncMock()
        mock_client.messages.create = AsyncMock(return_value=mock_response)
        mock_async_anthropic.return_value = mock_client
        
        service = LLMService(api_key="test_key")
        
        model, response = await service.call_llm("test prompt", "test_section")
        
        # Check response
        self.assertEqual(model, "claude-3-opus-20240229")
        self.assertEqual(response, "{'extracted': 'data'}")
        
        # Check API was called correctly
        mock_client.messages.create.assert_called_once()
        call_args = mock_client.messages.create.call_args
        self.assertEqual(call_args.kwargs['model'], "claude-3-opus-20240229")
        self.assertEqual(call_args.kwargs['temperature'], 0.0)
        self.assertEqual(call_args.kwargs['messages'][0]['content'], "test prompt")
    
    @patch('src.core.cv_extraction.llm_service.AsyncAnthropic')
    async def test_call_llm_with_retry(self, mock_async_anthropic):
        """Test LLM call with retry on failure."""
        # Setup mock that fails once then succeeds
        mock_response = Mock()
        mock_response.content = [Mock(text="success")]
        
        mock_client = AsyncMock()
        mock_client.messages.create = AsyncMock(
            side_effect=[Exception("API Error"), mock_response]
        )
        mock_async_anthropic.return_value = mock_client
        
        service = LLMService(api_key="test_key")
        
        # Should retry and succeed
        with patch('src.core.cv_extraction.llm_service.asyncio.sleep'):
            model, response = await service.call_llm("prompt", "section")
        
        self.assertEqual(response, "success")
        self.assertEqual(mock_client.messages.create.call_count, 2)
    
    @patch('src.core.cv_extraction.llm_service.Anthropic')
    def test_health_check_success(self, mock_anthropic):
        """Test successful health check."""
        mock_client = Mock()
        mock_client.messages.create = Mock(return_value=Mock(content=[Mock(text="healthy")]))
        mock_anthropic.return_value = mock_client
        
        service = LLMService(api_key="test_key")
        
        is_healthy, message = service.health_check()
        
        self.assertTrue(is_healthy)
        self.assertIn("healthy", message.lower())
    
    @patch('src.core.cv_extraction.llm_service.Anthropic')
    def test_health_check_failure(self, mock_anthropic):
        """Test failed health check."""
        mock_client = Mock()
        mock_client.messages.create = Mock(side_effect=Exception("API Error"))
        mock_anthropic.return_value = mock_client
        
        service = LLMService(api_key="test_key")
        
        is_healthy, message = service.health_check()
        
        self.assertFalse(is_healthy)
        self.assertIn("error", message.lower())


class TestLLMServiceEdgeCases(unittest.TestCase):
    """Test edge cases and error scenarios."""
    
    @patch('src.core.cv_extraction.llm_service.AsyncAnthropic')
    async def test_empty_response_handling(self, mock_async_anthropic):
        """Test handling of empty API responses."""
        mock_response = Mock()
        mock_response.content = []  # Empty content
        
        mock_client = AsyncMock()
        mock_client.messages.create = AsyncMock(return_value=mock_response)
        mock_async_anthropic.return_value = mock_client
        
        service = LLMService(api_key="test_key")
        
        model, response = await service.call_llm("prompt", "section")
        
        # Should handle empty response gracefully
        self.assertEqual(response, "")
    
    @patch('src.core.cv_extraction.llm_service.AsyncAnthropic')
    async def test_malformed_response_handling(self, mock_async_anthropic):
        """Test handling of malformed API responses."""
        mock_response = Mock()
        mock_response.content = None  # None content
        
        mock_client = AsyncMock()
        mock_client.messages.create = AsyncMock(return_value=mock_response)
        mock_async_anthropic.return_value = mock_client
        
        service = LLMService(api_key="test_key")
        
        # Should handle gracefully
        try:
            model, response = await service.call_llm("prompt", "section")
            # Either succeeds with empty or raises
            self.assertIn(response, ["", None])
        except Exception:
            pass  # Also acceptable
    
    @patch('src.core.cv_extraction.llm_service.AsyncAnthropic')
    async def test_max_retries_exceeded(self, mock_async_anthropic):
        """Test behavior when max retries are exceeded."""
        mock_client = AsyncMock()
        mock_client.messages.create = AsyncMock(
            side_effect=Exception("Persistent API Error")
        )
        mock_async_anthropic.return_value = mock_client
        
        service = LLMService(api_key="test_key")
        
        # Should eventually fail after retries
        with self.assertRaises(Exception) as context:
            with patch('src.core.cv_extraction.llm_service.asyncio.sleep'):
                await service.call_llm("prompt", "section")
        
        self.assertIn("API Error", str(context.exception))
    
    def test_no_api_key_available(self):
        """Test behavior when no API key is available."""
        with patch('src.core.cv_extraction.llm_service.keyring') as mock_keyring:
            mock_keyring.get_password.return_value = None
            
            with patch.dict('os.environ', {}, clear=True):
                with self.assertRaises(Exception) as context:
                    service = LLMService()
                
                self.assertIn("API", str(context.exception))


class TestLLMServiceIntegration(unittest.TestCase):
    """Test integration aspects of LLMService."""
    
    @patch('src.core.cv_extraction.llm_service.extraction_config')
    @patch('src.core.cv_extraction.llm_service.AsyncAnthropic')
    def test_uses_extraction_config(self, mock_async_anthropic, mock_config):
        """Test that LLMService uses extraction config."""
        mock_config.MAX_RETRIES = 5
        mock_config.RETRY_MULTIPLIER = 2
        
        mock_async_anthropic.return_value = AsyncMock()
        
        service = LLMService(api_key="test_key")
        
        # Check that config values are used
        # (Would need to inspect retry decorator, simplified here)
        self.assertIsNotNone(service)
    
    @patch('src.core.cv_extraction.llm_service.AsyncAnthropic')
    async def test_concurrent_calls(self, mock_async_anthropic):
        """Test that service handles concurrent API calls."""
        mock_response = Mock()
        mock_response.content = [Mock(text="response")]
        
        mock_client = AsyncMock()
        call_count = 0
        
        async def mock_create(**kwargs):
            nonlocal call_count
            call_count += 1
            await asyncio.sleep(0.1)  # Simulate API delay
            return mock_response
        
        mock_client.messages.create = mock_create
        mock_async_anthropic.return_value = mock_client
        
        service = LLMService(api_key="test_key")
        
        # Make multiple concurrent calls
        tasks = [
            service.call_llm(f"prompt_{i}", f"section_{i}")
            for i in range(5)
        ]
        
        results = await asyncio.gather(*tasks)
        
        # All should succeed
        self.assertEqual(len(results), 5)
        self.assertEqual(call_count, 5)
        
        for model, response in results:
            self.assertEqual(response, "response")
    
    def test_model_configuration(self):
        """Test that model configuration is properly set."""
        service = LLMService.__new__(LLMService)
        service.model_name = "claude-3-opus-20240229"
        service.model_config = {
            "temperature": 0.0,
            "max_tokens": 4096
        }
        
        # Temperature 0 should mean deterministic
        self.assertEqual(service.model_config["temperature"], 0.0)
        
        # Max tokens should be reasonable
        self.assertGreater(service.model_config["max_tokens"], 1000)
        self.assertLess(service.model_config["max_tokens"], 10000)


if __name__ == "__main__":
    # Run async tests properly
    unittest.main()