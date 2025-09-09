"""
Location Processing Service for CV Data Extraction
Centralizes all location parsing and processing logic
"""
from typing import Dict, Any, List, Optional
import logging

from .location_parser import parse_location_string

logger = logging.getLogger(__name__)


class LocationProcessor:
    """Processes and standardizes location data across all CV sections."""
    
    @staticmethod
    def process_location_field(location_data: Any) -> Dict[str, Optional[str]]:
        """
        Process a single location field into standardized format.
        
        Args:
            location_data: Either a string or dict containing location info
            
        Returns:
            Dict with city, state, country fields
        """
        if not location_data:
            return {'city': None, 'state': None, 'country': None}
        
        if isinstance(location_data, str):
            # Parse string location into structured format
            parsed = parse_location_string(location_data)
            return {
                'city': parsed.city,
                'state': parsed.state,
                'country': parsed.country
            }
        
        elif isinstance(location_data, dict):
            # Reconstruct and reparse for consistency
            location_parts = []
            if location_data.get('city'):
                location_parts.append(location_data['city'])
            if location_data.get('state'):
                location_parts.append(location_data['state'])
            if location_data.get('country'):
                location_parts.append(location_data['country'])
            
            if location_parts:
                parsed = parse_location_string(', '.join(location_parts))
                return {
                    'city': parsed.city or location_data.get('city'),
                    'state': parsed.state or location_data.get('state'),
                    'country': parsed.country or location_data.get('country')
                }
            
            return location_data
        
        return {'city': None, 'state': None, 'country': None}
    
    @staticmethod
    def process_items_with_location(items: List[Dict[str, Any]], 
                                   item_type: str = "item") -> List[Dict[str, Any]]:
        """
        Process a list of items that contain location fields.
        
        Args:
            items: List of dictionaries potentially containing 'location' field
            item_type: Type of item for logging (e.g., "experience", "education")
            
        Returns:
            Items with processed location data
        """
        if not items:
            return items
        
        for item in items:
            if 'location' in item:
                original_location = item['location']
                item['location'] = LocationProcessor.process_location_field(original_location)
                
                # Log if location was transformed
                if original_location != item['location']:
                    item_name = item.get('jobTitle') or item.get('institution') or item.get('title', 'Unknown')
                    logger.debug(f"Processed location for {item_type} '{item_name}'")
        
        return items
    
    @staticmethod
    def process_section_locations(section_name: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process all location fields in a CV section.
        
        Args:
            section_name: Name of the CV section
            data: Section data containing potential location fields
            
        Returns:
            Data with processed locations
        """
        if not data:
            return data
        
        # Process contact location
        if section_name == 'contact' and 'location' in data:
            data['location'] = LocationProcessor.process_location_field(data['location'])
        
        # Process experience locations
        elif section_name == 'experience' and 'experienceItems' in data:
            data['experienceItems'] = LocationProcessor.process_items_with_location(
                data['experienceItems'], 
                item_type="experience"
            )
        
        # Process education locations
        elif section_name == 'education' and 'educationItems' in data:
            data['educationItems'] = LocationProcessor.process_items_with_location(
                data['educationItems'],
                item_type="education"
            )
        
        # Process volunteer locations (future-proofing)
        elif section_name == 'volunteer' and 'volunteerItems' in data:
            data['volunteerItems'] = LocationProcessor.process_items_with_location(
                data['volunteerItems'],
                item_type="volunteer"
            )
        
        return data


# Create singleton instance
location_processor = LocationProcessor()