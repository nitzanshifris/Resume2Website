"""
URL Normalizer for CV Data
Ensures URLs are properly formatted before Pydantic validation
"""
import re
import logging
from typing import Dict, Any, List, Union
from urllib.parse import urlparse, urlunparse

logger = logging.getLogger(__name__)

def normalize_url(url: str) -> str:
    """
    Normalize a URL to ensure it's valid for Pydantic HttpUrl validation
    
    Args:
        url: Raw URL string from LLM
        
    Returns:
        Normalized URL string
    """
    if not url or not isinstance(url, str):
        return url
    
    # Clean whitespace and quotes
    url = url.strip().strip('"\'')
    
    # Fix common typos first
    url = url.replace('htpp://', 'http://')
    url = url.replace('htpps://', 'https://')
    url = url.replace('htp://', 'http://')
    
    # Handle malformed protocols early (https:/ should be https://)
    url = re.sub(r'^(https?):/?(?!/)', r'\1://', url)
    
    # Special handling for LinkedIn paths
    if url.startswith('/in/'):
        url = 'https://www.linkedin.com' + url
    
    # Add protocol if missing
    if not url.startswith(('http://', 'https://', 'ftp://')):
        # LinkedIn specific
        if 'linkedin.com/in/' in url:
            url = 'https://www.' + url if not url.startswith('www.') else 'https://' + url
        # GitHub specific
        elif url.startswith('github.com/'):
            url = 'https://' + url
        # Generic domain
        elif '.' in url and not url.startswith('/'):
            url = 'https://' + url
    
    # Ensure LinkedIn uses https and www
    if 'linkedin.com' in url:
        url = url.replace('http://linkedin.com', 'https://www.linkedin.com')
        url = url.replace('https://linkedin.com', 'https://www.linkedin.com')
        url = url.replace('http://www.linkedin.com', 'https://www.linkedin.com')
    
    # Ensure GitHub uses https
    if 'github.com' in url:
        url = url.replace('http://github.com', 'https://github.com')
    
    # Remove trailing slashes for consistency
    if url.endswith('/') and url.count('/') > 2:
        url = url.rstrip('/')
    
    # Final validation
    try:
        parsed = urlparse(url)
        # Ensure we have a scheme and netloc
        if parsed.scheme and parsed.netloc:
            return urlunparse(parsed)
        else:
            # Last attempt - add https:// if still missing
            if not parsed.scheme:
                test_url = 'https://' + url
                test_parsed = urlparse(test_url)
                if test_parsed.netloc:
                    return test_url
    except Exception as e:
        logger.warning(f"URL parsing error: {e}")
    
    return url

def normalize_urls_in_dict(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Recursively normalize all URLs in a dictionary
    
    Args:
        data: Dictionary potentially containing URLs
        
    Returns:
        Dictionary with normalized URLs
    """
    if not isinstance(data, dict):
        return data
    
    normalized = {}
    
    for key, value in data.items():
        # Check for URL fields
        if key in ['url', 'profilePhotoUrl', 'verificationUrl', 'projectUrl', 'companyWebsite']:
            if isinstance(value, str):
                normalized[key] = normalize_url(value)
            else:
                normalized[key] = value
        
        # Handle nested dictionaries
        elif isinstance(value, dict):
            normalized[key] = normalize_urls_in_dict(value)
        
        # Handle lists
        elif isinstance(value, list):
            normalized[key] = [
                normalize_urls_in_dict(item) if isinstance(item, dict) 
                else normalize_url(item) if isinstance(item, str) and key in ['urls', 'links']
                else item
                for item in value
            ]
        
        # Handle ProfessionalLink objects
        elif key == 'professionalLinks' and isinstance(value, list):
            normalized[key] = []
            for link in value:
                if isinstance(link, dict) and 'url' in link:
                    link_copy = link.copy()
                    link_copy['url'] = normalize_url(link.get('url', ''))
                    normalized[key].append(link_copy)
                else:
                    normalized[key].append(link)
        
        else:
            normalized[key] = value
    
    return normalized

def normalize_section_data(section_name: str, data: Union[Dict, List]) -> Union[Dict, List]:
    """
    Normalize URLs in section data before Pydantic validation
    
    Args:
        section_name: Name of the CV section
        data: Raw data from LLM
        
    Returns:
        Data with normalized URLs
    """
    if isinstance(data, dict):
        return normalize_urls_in_dict(data)
    elif isinstance(data, list):
        return [normalize_urls_in_dict(item) if isinstance(item, dict) else item for item in data]
    else:
        return data