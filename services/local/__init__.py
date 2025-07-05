"""
Local services that don't require external APIs
"""
from .text_extractor import text_extractor, extract_text
from .keychain_manager import (
    KeychainManager,
    get_google_credentials_path,
    get_aws_credentials,
    get_openai_api_key,
    get_anthropic_api_key,
    get_gemini_api_key,
    get_vercel_credentials,
    get_pinecone_credentials
)
from .smart_deduplicator import smart_deduplicator, SmartDeduplicator

__all__ = [
    'text_extractor',
    'extract_text',
    'KeychainManager',
    'get_google_credentials_path',
    'get_aws_credentials',
    'get_openai_api_key',
    'get_anthropic_api_key',
    'get_gemini_api_key',
    'get_vercel_credentials',
    'get_pinecone_credentials',
    'smart_deduplicator',
    'SmartDeduplicator'
]