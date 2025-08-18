"""
Text Parsing Utilities for CV Data Extraction
Handles parsing of text patterns not related to specific domains
"""
import re
from typing import Optional, Tuple, Iterator, List, Dict, Any


def parse_year_range(text: str) -> Tuple[Optional[int], Optional[str]]:
    """
    Parse expressions like "more than 9 years" to extract years of experience.
    
    Args:
        text: Text containing year/experience information
        
    Returns:
        Tuple of (years, qualifier) where qualifier can be "exact", "more_than", "approximately", etc.
    """
    if not text:
        return None, None
    
    text = text.lower().strip()
    
    # Pattern: "more than X years"
    match = re.search(r'more\s+than\s+(\d+)\s*\+?\s*years?', text)
    if match:
        return int(match.group(1)), "more_than"
    
    # Pattern: "over X years"
    match = re.search(r'over\s+(\d+)\s*\+?\s*years?', text)
    if match:
        return int(match.group(1)), "more_than"
    
    # Pattern: "X+ years"
    match = re.search(r'(\d+)\s*\+\s*years?', text)
    if match:
        return int(match.group(1)), "more_than"
    
    # Pattern: "approximately X years"
    match = re.search(r'(?:approximately|approx\.?|about|around)\s+(\d+)\s*years?', text)
    if match:
        return int(match.group(1)), "approximately"
    
    # Pattern: "X years"
    match = re.search(r'(\d+)\s*years?', text)
    if match:
        return int(match.group(1)), "exact"
    
    return None, None


def safe_iter_dicts(list_like: Any) -> Iterator[Dict]:
    """
    Safely iterate over a list-like object, yielding only valid dict items.
    
    This utility function handles common patterns where we need to:
    1. Check if the input is actually a list
    2. Filter out None values
    3. Ensure items are dictionaries
    
    Args:
        list_like: Any object that might be a list of dicts
        
    Yields:
        Valid dictionary items from the input
    """
    if not list_like or not isinstance(list_like, (list, tuple)):
        return
    
    for item in list_like:
        if item and isinstance(item, dict):
            yield item


def safe_get_nested(data: Dict, *keys: str, default: Any = None) -> Any:
    """
    Safely get a nested value from a dictionary.
    
    Args:
        data: The dictionary to search
        *keys: Keys to traverse (e.g., 'section', 'subsection', 'field')
        default: Default value if key path doesn't exist
        
    Returns:
        The value at the key path or default
        
    Example:
        safe_get_nested(cv_data, 'experience', 'experienceItems', 0, 'jobTitle')
    """
    if not data:
        return default
    
    current = data
    for key in keys:
        if isinstance(current, dict):
            current = current.get(key)
        elif isinstance(current, (list, tuple)) and isinstance(key, int):
            if 0 <= key < len(current):
                current = current[key]
            else:
                return default
        else:
            return default
        
        if current is None:
            return default
    
    return current


def extract_numbers_from_text(text: str) -> List[int]:
    """
    Extract all numbers from a text string.
    
    Args:
        text: Input text
        
    Returns:
        List of integers found in the text
    """
    if not text:
        return []
    
    # Find all sequences of digits
    numbers = re.findall(r'\d+', text)
    return [int(n) for n in numbers]


def normalize_whitespace(text: str) -> str:
    """
    Normalize whitespace in text (multiple spaces/newlines to single space).
    
    Args:
        text: Input text
        
    Returns:
        Text with normalized whitespace
    """
    if not text:
        return ""
    
    # Replace multiple whitespace with single space
    return re.sub(r'\s+', ' ', text).strip()


def extract_email_from_text(text: str) -> Optional[str]:
    """
    Extract the first valid email address from text.
    
    Args:
        text: Input text
        
    Returns:
        First email address found, or None
    """
    if not text:
        return None
    
    # Basic email pattern
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    match = re.search(email_pattern, text)
    
    return match.group(0) if match else None


def extract_phone_from_text(text: str) -> Optional[str]:
    """
    Extract the first phone number from text.
    
    Args:
        text: Input text
        
    Returns:
        First phone number found, or None
    """
    if not text:
        return None
    
    # Common phone patterns (US-centric but flexible)
    phone_patterns = [
        r'\+?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}',
        r'\(\d{3}\)\s*\d{3}[-.\s]?\d{4}',
        r'\d{3}[-.\s]\d{3}[-.\s]\d{4}',
        r'\d{10,}'
    ]
    
    for pattern in phone_patterns:
        match = re.search(pattern, text)
        if match:
            return match.group(0)
    
    return None


def split_by_keywords(text: str, keywords: List[str]) -> Dict[str, str]:
    """
    Split text into sections based on keyword headers.
    
    Args:
        text: Input text
        keywords: List of section keywords to split by
        
    Returns:
        Dictionary mapping keywords to their content
    """
    if not text or not keywords:
        return {}
    
    # Create pattern for all keywords
    pattern = '|'.join(re.escape(kw) for kw in keywords)
    pattern = rf'\b({pattern})\b'
    
    # Split and pair up sections
    parts = re.split(pattern, text, flags=re.IGNORECASE)
    
    sections = {}
    for i in range(1, len(parts), 2):
        if i + 1 < len(parts):
            keyword = parts[i].lower()
            content = parts[i + 1].strip()
            sections[keyword] = content
    
    return sections