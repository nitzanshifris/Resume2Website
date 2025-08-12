"""
Secure credential management using macOS Keychain
This prevents keys from being exposed in files
"""
import subprocess
import json
import os
import logging

logger = logging.getLogger(__name__)


class KeychainManager:
    """Manage credentials securely using macOS Keychain"""
    
    SERVICE_NAME = "cv2web"
    
    @staticmethod
    def get_credential(key_name: str) -> str:
        """
        Retrieve credential from macOS Keychain
        
        Args:
            key_name: Name of the credential (e.g., 'google_vision_key', 'aws_access_key')
            
        Returns:
            The credential value or None if not found
        """
        try:
            # Use security command to get password from keychain
            cmd = [
                'security', 'find-generic-password',
                '-s', KeychainManager.SERVICE_NAME,
                '-a', key_name,
                '-w'  # Output password only
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            if result.returncode == 0:
                return result.stdout.strip()
            else:
                logger.warning(f"Credential '{key_name}' not found in Keychain")
                return None
                
        except Exception as e:
            logger.error(f"Failed to retrieve credential from Keychain: {e}")
            return None
    
    @staticmethod
    def set_credential(key_name: str, value: str) -> bool:
        """
        Store credential in macOS Keychain
        
        Usage:
            KeychainManager.set_credential('aws_access_key', 'AKIAIOSFODNN7EXAMPLE')
        """
        try:
            # Delete existing entry if it exists (ignore errors)
            delete_cmd = [
                'security', 'delete-generic-password',
                '-s', KeychainManager.SERVICE_NAME,
                '-a', key_name
            ]
            subprocess.run(delete_cmd, capture_output=True)
            
            # Add new entry
            add_cmd = [
                'security', 'add-generic-password',
                '-s', KeychainManager.SERVICE_NAME,
                '-a', key_name,
                '-w', value
            ]
            
            result = subprocess.run(add_cmd, capture_output=True, text=True)
            
            if result.returncode == 0:
                logger.info(f"Credential '{key_name}' stored in Keychain")
                return True
            else:
                logger.error(f"Failed to store credential: {result.stderr}")
                return False
                
        except Exception as e:
            logger.error(f"Failed to store credential in Keychain: {e}")
            return False


# Convenience functions for specific credentials
def get_google_credentials_path() -> str:
    """Get Google Cloud credentials from Keychain or fallback to env"""
    # First try Keychain
    path = KeychainManager.get_credential('google_credentials_path')
    if path and os.path.exists(path):
        return path
    
    # Fallback to environment variable
    return os.getenv('GOOGLE_APPLICATION_CREDENTIALS', '')


def get_aws_credentials() -> dict:
    """Get AWS credentials from Keychain or fallback to env"""
    # Try Keychain first
    access_key = KeychainManager.get_credential('aws_access_key_id')
    secret_key = KeychainManager.get_credential('aws_secret_access_key')
    
    if access_key and secret_key:
        return {
            'aws_access_key_id': access_key,
            'aws_secret_access_key': secret_key,
            'region_name': KeychainManager.get_credential('aws_region') or 'us-east-1'
        }
    
    # Fallback to environment variables
    return {
        'aws_access_key_id': os.getenv('AWS_ACCESS_KEY_ID'),
        'aws_secret_access_key': os.getenv('AWS_SECRET_ACCESS_KEY'),
        'region_name': os.getenv('AWS_REGION', 'us-east-1')
    }


def get_openai_api_key() -> str:
    """Get OpenAI API key from Keychain or fallback to env"""
    # Try Keychain first
    key = KeychainManager.get_credential('openai_api_key')
    if key:
        return key
    
    # Fallback to environment variable
    return os.getenv('OPENAI_API_KEY', '')


def get_anthropic_api_key() -> str:
    """Get Anthropic API key from Keychain or fallback to env"""
    key = KeychainManager.get_credential('anthropic_api_key')
    if key:
        return key
    return os.getenv('ANTHROPIC_API_KEY', '')


def get_gemini_api_key() -> str:
    """Get Gemini API key from Keychain or fallback to env"""
    key = KeychainManager.get_credential('gemini_api_key')
    if key:
        return key
    return os.getenv('GEMINI_API_KEY', '')


def get_vercel_credentials() -> dict:
    """Get Vercel credentials from Keychain or fallback to env"""
    vercel_id = KeychainManager.get_credential('vercel_id')
    vercel_secret = KeychainManager.get_credential('vercel_secret')
    
    if vercel_id and vercel_secret:
        return {
            'id': vercel_id,
            'secret': vercel_secret
        }
    
    return {
        'id': os.getenv('VERCEL_ID', ''),
        'secret': os.getenv('VERCEL_SECRET', '')
    }


def get_pinecone_credentials() -> dict:
    """Get Pinecone credentials from Keychain or fallback to env"""
    api_key = KeychainManager.get_credential('pinecone_api_key')
    environment = KeychainManager.get_credential('pinecone_environment')
    
    if api_key:
        return {
            'api_key': api_key,
            'environment': environment or os.getenv('PINECONE_ENVIRONMENT', '')
        }
    
    return {
        'api_key': os.getenv('PINECONE_API_KEY', ''),
        'environment': os.getenv('PINECONE_ENVIRONMENT', '')
    }


# Setup script to help users store credentials
if __name__ == "__main__":
    print("RESUME2WEBSITE Keychain Setup")
    print("=" * 50)
    print("This will help you store credentials securely in macOS Keychain")
    print()
    
    # Example of how to set credentials
    print("To store credentials, run these commands in Python:")
    print()
    print("from src.core.local.keychain_manager import KeychainManager")
    print()
    print("# Store Google Cloud credentials path:")
    print("KeychainManager.set_credential('google_credentials_path', '/path/to/your/google-key.json')")
    print()
    print("# Store AWS credentials:")
    print("KeychainManager.set_credential('aws_access_key_id', 'your-access-key')")
    print("KeychainManager.set_credential('aws_secret_access_key', 'your-secret-key')")
    print("KeychainManager.set_credential('aws_region', 'us-east-1')")
    print()
    print("# Store OpenAI API key:")
    print("KeychainManager.set_credential('openai_api_key', 'sk-...')")