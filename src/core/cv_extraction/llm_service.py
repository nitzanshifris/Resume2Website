"""
LLM Service for CV Data Extraction
Handles all interactions with Claude 4 Opus API
"""
import os
import logging
from typing import Optional, Tuple, Any

from anthropic import AsyncAnthropic
from tenacity import retry, stop_after_attempt, wait_exponential

from .extraction_config import extraction_config
from .circuit_breaker import llm_circuit_breaker, CircuitBreakerOpenError

logger = logging.getLogger(__name__)

# Import Keychain manager if available
try:
    from src.core.local.keychain_manager import get_anthropic_api_key
    KEYCHAIN_AVAILABLE = True
except ImportError:
    KEYCHAIN_AVAILABLE = False

# Import config from project root
try:
    import config
except ImportError:
    # Fallback if running from different context
    from ....config import config


class LLMService:
    """Manages all LLM API interactions for CV extraction."""
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize LLM service with Claude 4 Opus.
        
        Args:
            api_key: Optional Anthropic API key. If not provided, will try keychain and env vars.
        """
        # Setup Claude 4 Opus as primary and only model
        anthropic_api_key = api_key
        if not anthropic_api_key:
            if KEYCHAIN_AVAILABLE:
                anthropic_api_key = get_anthropic_api_key()
            if not anthropic_api_key:
                anthropic_api_key = os.getenv('ANTHROPIC_API_KEY')
                
        if not anthropic_api_key:
            raise ValueError("ANTHROPIC_API_KEY required for Claude 4 Opus extraction")
        
        # Store API key for metrics (only first 8 chars will be used for hashing)
        self.api_key = anthropic_api_key
                
        try:
            self.claude_client = AsyncAnthropic(api_key=anthropic_api_key)
            self.claude_available = True
            logger.info(f"Claude 4 Opus ({config.PRIMARY_MODEL}) initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Claude 4 Opus: {e}")
            raise ValueError(f"Failed to initialize Claude 4 Opus: {e}")
        
        # Model configuration
        self.model_name = config.PRIMARY_MODEL  # claude-4-opus
        self.model_config = {
            "temperature": config.EXTRACTION_TEMPERATURE,  # 0.0 for maximum determinism
            "max_tokens": config.EXTRACTION_MAX_TOKENS,    # 4000
            "top_p": config.EXTRACTION_TOP_P               # 0.1 for restricted token selection
        }
        
        logger.info(f"LLMService initialized with Claude 4 Opus ({self.model_name}) - Maximum Determinism Mode")
    
    @retry(
        stop=stop_after_attempt(extraction_config.MAX_RETRIES), 
        wait=wait_exponential(
            multiplier=extraction_config.RETRY_MULTIPLIER, 
            min=extraction_config.RETRY_MIN_WAIT, 
            max=extraction_config.RETRY_MAX_WAIT
        )
    )
    async def call_llm(self, prompt: str, section_name: str) -> Tuple[str, str]:
        """
        Call Claude 4 Opus with retry logic and circuit breaker protection.
        
        Args:
            prompt: The prompt to send to the LLM
            section_name: Name of the section being extracted (for logging)
            
        Returns:
            Tuple of (model_used, response_text)
            
        Raises:
            CircuitBreakerOpenError: If the circuit breaker is open due to failures
        """
        try:
            # Use circuit breaker to protect against cascade failures
            async with llm_circuit_breaker:
                logger.debug(f"Calling Claude 4 Opus for {section_name}")
                response = await self.claude_client.messages.create(
                    model=self.model_name,
                    max_tokens=self.model_config["max_tokens"],
                    temperature=self.model_config["temperature"],
                    top_p=self.model_config["top_p"],
                    messages=[{"role": "user", "content": prompt}]
                )
                return (self.model_name, response.content[0].text)
        except CircuitBreakerOpenError:
            # Circuit is open, service is unavailable
            logger.error(f"Circuit breaker open for LLM service - {section_name} extraction blocked")
            raise
        except Exception as e:
            logger.error(f"Claude 4 Opus failed for {section_name}: {e}")
            raise
    
    def get_model_info(self) -> dict:
        """
        Get information about the configured model.
        
        Returns:
            Dictionary with model information
        """
        return {
            "model": self.model_name,
            "available": self.claude_available,
            "config": self.model_config,
            "deterministic": self.model_config["temperature"] == 0.0
        }
    
    async def health_check(self) -> bool:
        """
        Check if the LLM service is healthy and can make API calls.
        
        Returns:
            True if service is healthy, False otherwise
        """
        try:
            # Simple test prompt
            test_prompt = "Return the JSON: {\"status\": \"healthy\"}"
            _, response = await self.call_llm(test_prompt, "health_check")
            return "healthy" in response.lower()
        except Exception as e:
            logger.error(f"LLM health check failed: {e}")
            return False
    
    def get_circuit_breaker_status(self) -> dict:
        """
        Get the current status of the circuit breaker.
        
        Returns:
            Dictionary with circuit breaker status and statistics
        """
        return llm_circuit_breaker.get_status()


# Singleton instance management
# WARNING: First API key wins - subsequent calls with different keys are ignored
# This is by design for performance, but be aware in multi-tenant scenarios
_llm_service_instance = None
_llm_service_key = None

def get_llm_service(api_key: Optional[str] = None) -> LLMService:
    """
    Get or create the LLM service singleton.
    
    WARNING: This uses a singleton pattern where the first API key provided
    is cached. Subsequent calls with different API keys will be ignored and
    the original instance returned. This is intentional for performance but
    may not be suitable for multi-tenant scenarios.
    
    Args:
        api_key: Optional API key for initialization
        
    Returns:
        LLMService instance (singleton)
    """
    global _llm_service_instance, _llm_service_key
    
    if _llm_service_instance is None:
        _llm_service_instance = LLMService(api_key)
        _llm_service_key = api_key
        logger.info(f"LLM Service initialized with {'provided' if api_key else 'default'} API key")
    elif api_key and api_key != _llm_service_key:
        logger.warning(
            "Attempted to reinitialize LLMService with different API key. "
            "Returning existing instance. Use create_llm_service() for new instance."
        )
    
    return _llm_service_instance

def create_llm_service(api_key: Optional[str] = None) -> LLMService:
    """
    Create a new LLM service instance (non-singleton).
    
    Use this when you need a fresh instance with a different API key,
    bypassing the singleton pattern.
    
    Args:
        api_key: Optional API key for initialization
        
    Returns:
        New LLMService instance
    """
    return LLMService(api_key)