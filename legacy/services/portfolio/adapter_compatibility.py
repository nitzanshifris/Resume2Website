"""
Adapter Compatibility Layer
Ensures all adapters provide both standard and legacy property names
"""

# Property mappings: standard -> compatibility aliases
PROPERTY_ALIASES = {
    # AnimatedTooltip expects 'items', adapter provides 'people'
    'people': ['items'],
    
    # CardStack expects 'items', adapter provides 'cards'
    'cards': ['items'],
    
    # Various components expect different collection names
    'entries': ['items', 'data'],
    'testimonials': ['items', 'quotes'],
    'projects': ['items', 'cards'],
    
    # Content properties
    'content': ['description', 'text'],
    'title': ['name', 'heading'],
    'subtitle': ['designation', 'subheading'],
}

def ensure_compatibility(adapter_result: dict) -> dict:
    """
    Ensures adapter results have compatibility aliases
    
    Args:
        adapter_result: The original adapter result
        
    Returns:
        Enhanced result with compatibility aliases
    """
    enhanced = adapter_result.copy()
    
    # Add aliases for each property
    for key, value in adapter_result.items():
        if key in PROPERTY_ALIASES:
            for alias in PROPERTY_ALIASES[key]:
                if alias not in enhanced:
                    enhanced[alias] = value
    
    # Special handling for collections
    # If we have any collection-like property, also provide it as 'items'
    collection_keys = ['people', 'cards', 'entries', 'testimonials', 'projects']
    for key in collection_keys:
        if key in enhanced and isinstance(enhanced[key], list) and 'items' not in enhanced:
            enhanced['items'] = enhanced[key]
            break
    
    return enhanced