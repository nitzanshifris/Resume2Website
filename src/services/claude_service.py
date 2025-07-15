"""
Claude Service with Best Practices
Implements retry logic, caching, streaming, and persistent memory
"""
import os
import json
import time
import asyncio
from pathlib import Path
from typing import Optional, Dict, Any, AsyncGenerator
from datetime import datetime, timedelta
import anthropic
from anthropic import AsyncAnthropic, APIError, RateLimitError
import logging
from functools import wraps
import hashlib

from src.utils.live_logger import LiveLogger

# Initialize logger
logger = LiveLogger(__name__)

class ClaudeService:
    """Enhanced Claude API service with best practices."""
    
    def __init__(
        self,
        api_key: Optional[str] = None,
        model: str = "claude-3-5-sonnet-20241022",
        max_retries: int = 3,
        retry_delay: float = 1.0,
        cache_ttl: int = 3600  # 1 hour cache
    ):
        self.api_key = api_key or os.getenv("ANTHROPIC_API_KEY")
        if not self.api_key:
            raise ValueError("Anthropic API key not found")
        
        self.client = AsyncAnthropic(api_key=self.api_key)
        self.model = model
        self.max_retries = max_retries
        self.retry_delay = retry_delay
        self.cache_ttl = cache_ttl
        
        # Initialize cache and memory directories
        self.cache_dir = Path(".claude/cache")
        self.memory_dir = Path(".claude/memory")
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        self.memory_dir.mkdir(parents=True, exist_ok=True)
        
        logger.success(f"Claude service initialized with model: {model}")
    
    def _get_cache_key(self, prompt: str, system: Optional[str] = None) -> str:
        """Generate cache key from prompt and system message."""
        content = f"{system or ''}{prompt}"
        return hashlib.sha256(content.encode()).hexdigest()
    
    def _get_cached_response(self, cache_key: str) -> Optional[str]:
        """Retrieve cached response if valid."""
        cache_file = self.cache_dir / f"{cache_key}.json"
        
        if not cache_file.exists():
            return None
        
        try:
            with open(cache_file, 'r') as f:
                cache_data = json.load(f)
            
            # Check if cache is still valid
            cached_time = datetime.fromisoformat(cache_data['timestamp'])
            if datetime.now() - cached_time > timedelta(seconds=self.cache_ttl):
                cache_file.unlink()  # Remove expired cache
                return None
            
            logger.step("Using cached response", {"cache_key": cache_key[:8]})
            return cache_data['response']
        
        except Exception as e:
            logger.warning(f"Failed to read cache: {str(e)}")
            return None
    
    def _save_to_cache(self, cache_key: str, response: str):
        """Save response to cache."""
        cache_file = self.cache_dir / f"{cache_key}.json"
        
        try:
            cache_data = {
                'timestamp': datetime.now().isoformat(),
                'response': response
            }
            with open(cache_file, 'w') as f:
                json.dump(cache_data, f)
            
            logger.step("Saved to cache", {"cache_key": cache_key[:8]})
        
        except Exception as e:
            logger.warning(f"Failed to save cache: {str(e)}")
    
    async def _retry_with_backoff(self, func, *args, **kwargs):
        """Execute function with exponential backoff retry."""
        last_error = None
        
        for attempt in range(self.max_retries):
            try:
                return await func(*args, **kwargs)
            
            except RateLimitError as e:
                last_error = e
                wait_time = self.retry_delay * (2 ** attempt)
                logger.warning(f"Rate limit hit, waiting {wait_time}s (attempt {attempt + 1}/{self.max_retries})")
                await asyncio.sleep(wait_time)
            
            except APIError as e:
                last_error = e
                if attempt < self.max_retries - 1:
                    wait_time = self.retry_delay * (2 ** attempt)
                    logger.warning(f"API error, retrying in {wait_time}s: {str(e)}")
                    await asyncio.sleep(wait_time)
                else:
                    break
            
            except Exception as e:
                last_error = e
                logger.error(f"Unexpected error: {str(e)}")
                break
        
        raise last_error
    
    async def generate(
        self,
        prompt: str,
        system: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 4096,
        use_cache: bool = True
    ) -> str:
        """Generate response with caching and retry logic."""
        logger.step("Generating response", {
            "model": self.model,
            "temperature": temperature,
            "max_tokens": max_tokens
        })
        
        # Check cache first
        if use_cache:
            cache_key = self._get_cache_key(prompt, system)
            cached = self._get_cached_response(cache_key)
            if cached:
                return cached
        
        # Prepare messages
        messages = [{"role": "user", "content": prompt}]
        
        # Make API call with retry
        async def _api_call():
            return await self.client.messages.create(
                model=self.model,
                messages=messages,
                system=system,
                temperature=temperature,
                max_tokens=max_tokens
            )
        
        response = await self._retry_with_backoff(_api_call)
        result = response.content[0].text
        
        # Save to cache
        if use_cache:
            self._save_to_cache(cache_key, result)
        
        logger.success("Response generated successfully")
        return result
    
    async def stream_generate(
        self,
        prompt: str,
        system: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 4096
    ) -> AsyncGenerator[str, None]:
        """Stream response for real-time feedback."""
        logger.step("Starting streaming response", {"model": self.model})
        
        messages = [{"role": "user", "content": prompt}]
        
        async def _stream_call():
            return await self.client.messages.create(
                model=self.model,
                messages=messages,
                system=system,
                temperature=temperature,
                max_tokens=max_tokens,
                stream=True
            )
        
        stream = await self._retry_with_backoff(_stream_call)
        
        async for chunk in stream:
            if chunk.type == "content_block_delta":
                yield chunk.delta.text
    
    def save_memory(self, key: str, data: Dict[str, Any]):
        """Save data to persistent memory."""
        memory_file = self.memory_dir / f"{key}.json"
        
        try:
            # Load existing memory if exists
            existing = {}
            if memory_file.exists():
                with open(memory_file, 'r') as f:
                    existing = json.load(f)
            
            # Update with new data
            existing.update(data)
            existing['_updated'] = datetime.now().isoformat()
            
            # Save back
            with open(memory_file, 'w') as f:
                json.dump(existing, f, indent=2)
            
            logger.step("Memory saved", {"key": key, "entries": len(existing)})
        
        except Exception as e:
            logger.error(f"Failed to save memory: {str(e)}")
    
    def load_memory(self, key: str) -> Dict[str, Any]:
        """Load data from persistent memory."""
        memory_file = self.memory_dir / f"{key}.json"
        
        if not memory_file.exists():
            return {}
        
        try:
            with open(memory_file, 'r') as f:
                data = json.load(f)
            
            logger.step("Memory loaded", {"key": key, "entries": len(data)})
            return data
        
        except Exception as e:
            logger.error(f"Failed to load memory: {str(e)}")
            return {}
    
    async def generate_code(
        self,
        description: str,
        language: str = "python",
        context: Optional[str] = None,
        stream: bool = False
    ) -> str:
        """Generate code with specific formatting."""
        system_prompt = f"""You are an expert {language} developer. Generate clean, well-documented code.
        Follow best practices and include error handling where appropriate."""
        
        prompt = f"Generate {language} code for: {description}"
        if context:
            prompt += f"\n\nContext:\n{context}"
        
        if stream:
            result = ""
            async for chunk in self.stream_generate(prompt, system_prompt):
                result += chunk
            return result
        else:
            return await self.generate(prompt, system_prompt, temperature=0.3)
    
    async def analyze_code(
        self,
        code: str,
        language: str = "python",
        focus: Optional[str] = None
    ) -> str:
        """Analyze code for improvements, bugs, or specific aspects."""
        system_prompt = f"You are an expert {language} code reviewer. Analyze the provided code thoroughly."
        
        prompt = f"Analyze this {language} code:\n\n```{language}\n{code}\n```"
        if focus:
            prompt += f"\n\nFocus on: {focus}"
        
        return await self.generate(prompt, system_prompt, temperature=0.3)


# Singleton instance
_claude_service: Optional[ClaudeService] = None

def get_claude_service() -> ClaudeService:
    """Get or create Claude service singleton."""
    global _claude_service
    if _claude_service is None:
        _claude_service = ClaudeService()
    return _claude_service