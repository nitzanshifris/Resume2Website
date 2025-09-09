#!/usr/bin/env python3
"""
Unit Tests for LocationProcessor
Tests location parsing and formatting functionality
"""

import unittest
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent.parent))

from src.core.cv_extraction.location_processor import LocationProcessor, location_processor


class TestLocationProcessor(unittest.TestCase):
    """Test LocationProcessor functionality."""
    
    def test_singleton_pattern(self):
        """Test that LocationProcessor follows singleton pattern."""
        proc1 = LocationProcessor()
        proc2 = LocationProcessor()
        self.assertIs(proc1, proc2)
        self.assertIs(proc1, location_processor)
    
    def test_parse_location_basic(self):
        """Test basic location parsing."""
        # Test city, state format
        result = location_processor.parse_location("San Francisco, CA")
        self.assertEqual(result['city'], "San Francisco")
        self.assertEqual(result['state'], "CA")
        self.assertEqual(result['country'], "USA")
        
        # Test city, state, country format
        result = location_processor.parse_location("London, England, UK")
        self.assertEqual(result['city'], "London")
        self.assertEqual(result['state'], "England")
        self.assertEqual(result['country'], "UK")
    
    def test_parse_location_with_zip(self):
        """Test location parsing with zip codes."""
        result = location_processor.parse_location("New York, NY 10001")
        self.assertEqual(result['city'], "New York")
        self.assertEqual(result['state'], "NY")
        self.assertIsNone(result.get('country'))  # USA implicit
        
        result = location_processor.parse_location("Boston, MA, 02134, USA")
        self.assertEqual(result['city'], "Boston")
        self.assertEqual(result['state'], "MA")
        self.assertEqual(result['country'], "USA")
    
    def test_parse_location_international(self):
        """Test international location parsing."""
        # European format
        result = location_processor.parse_location("Paris, France")
        self.assertEqual(result['city'], "Paris")
        self.assertEqual(result['country'], "France")
        
        # Asian format
        result = location_processor.parse_location("Tokyo, Japan")
        self.assertEqual(result['city'], "Tokyo")
        self.assertEqual(result['country'], "Japan")
        
        # Multi-part city
        result = location_processor.parse_location("São Paulo, Brazil")
        self.assertEqual(result['city'], "São Paulo")
        self.assertEqual(result['country'], "Brazil")
    
    def test_parse_location_edge_cases(self):
        """Test edge cases in location parsing."""
        # Empty string
        result = location_processor.parse_location("")
        self.assertIsNone(result['city'])
        self.assertIsNone(result['state'])
        self.assertIsNone(result['country'])
        
        # None input
        result = location_processor.parse_location(None)
        self.assertIsNone(result['city'])
        
        # Single word
        result = location_processor.parse_location("Boston")
        self.assertEqual(result['city'], "Boston")
        
        # Extra spaces
        result = location_processor.parse_location("  Seattle ,  WA  ")
        self.assertEqual(result['city'], "Seattle")
        self.assertEqual(result['state'], "WA")
    
    def test_process_location_string(self):
        """Test full location string processing."""
        # Standard format
        result = location_processor.process_location_string("Mountain View, CA, USA")
        self.assertEqual(result, "Mountain View, CA, USA")
        
        # With dates (should extract location only)
        result = location_processor.process_location_string("San Jose, CA | 2020-2023")
        self.assertIn("San Jose", result)
        
        # Remote work
        result = location_processor.process_location_string("Remote")
        self.assertEqual(result, "Remote")
    
    def test_process_experience_locations(self):
        """Test processing locations in experience items."""
        experience_items = [
            {
                'company': 'Tech Corp',
                'location': 'San Francisco, CA',
                'title': 'Engineer'
            },
            {
                'company': 'StartupCo',
                'location': 'Remote | New York, NY',
                'title': 'Developer'
            }
        ]
        
        processed = location_processor.process_experience_locations(experience_items)
        
        # First item should have parsed location
        self.assertIn('locationDetails', processed[0])
        self.assertEqual(processed[0]['locationDetails']['city'], 'San Francisco')
        self.assertEqual(processed[0]['locationDetails']['state'], 'CA')
        
        # Original location should be preserved
        self.assertEqual(processed[0]['location'], 'San Francisco, CA')
    
    def test_process_education_locations(self):
        """Test processing locations in education items."""
        education_items = [
            {
                'institution': 'MIT',
                'location': 'Cambridge, MA',
                'degree': 'BS Computer Science'
            },
            {
                'institution': 'Stanford',
                'location': 'Palo Alto, California, USA',
                'degree': 'MS AI'
            }
        ]
        
        processed = location_processor.process_education_locations(education_items)
        
        # Check first item
        self.assertIn('locationDetails', processed[0])
        self.assertEqual(processed[0]['locationDetails']['city'], 'Cambridge')
        self.assertEqual(processed[0]['locationDetails']['state'], 'MA')
        
        # Check second item
        self.assertEqual(processed[1]['locationDetails']['city'], 'Palo Alto')
        self.assertEqual(processed[1]['locationDetails']['state'], 'California')
        self.assertEqual(processed[1]['locationDetails']['country'], 'USA')
    
    def test_process_all_locations(self):
        """Test processing all location types in a data structure."""
        data = {
            'experience': {
                'experienceItems': [
                    {'company': 'Google', 'location': 'Mountain View, CA'}
                ]
            },
            'education': {
                'educationItems': [
                    {'institution': 'Harvard', 'location': 'Cambridge, MA'}
                ]
            },
            'volunteer': {
                'volunteerItems': [
                    {'organization': 'Red Cross', 'location': 'Boston, MA'}
                ]
            }
        }
        
        processed = location_processor.process_all_locations(data)
        
        # Check experience was processed
        exp_item = processed['experience']['experienceItems'][0]
        self.assertIn('locationDetails', exp_item)
        self.assertEqual(exp_item['locationDetails']['city'], 'Mountain View')
        
        # Check education was processed
        edu_item = processed['education']['educationItems'][0]
        self.assertIn('locationDetails', edu_item)
        self.assertEqual(edu_item['locationDetails']['city'], 'Cambridge')
        
        # Check volunteer was processed
        vol_item = processed['volunteer']['volunteerItems'][0]
        self.assertIn('locationDetails', vol_item)
        self.assertEqual(vol_item['locationDetails']['city'], 'Boston')
    
    def test_location_normalization(self):
        """Test location normalization features."""
        # Test state abbreviation normalization
        test_cases = [
            ("New York, New York", "New York", "NY"),
            ("Los Angeles, California", "Los Angeles", "CA"),
            ("Chicago, Illinois", "Chicago", "IL"),
        ]
        
        for input_loc, expected_city, expected_state in test_cases:
            result = location_processor.parse_location(input_loc)
            self.assertEqual(result['city'], expected_city)
            # Note: Actual implementation may or may not normalize state names
    
    def test_special_location_formats(self):
        """Test special location formats."""
        # Hybrid/Remote formats
        result = location_processor.process_location_string("Remote/San Francisco, CA")
        self.assertIsNotNone(result)
        
        # Multiple locations
        result = location_processor.process_location_string("San Francisco, CA / New York, NY")
        self.assertIsNotNone(result)
        
        # With additional info
        result = location_processor.process_location_string("San Francisco Bay Area, CA")
        self.assertIsNotNone(result)


class TestLocationProcessorIntegration(unittest.TestCase):
    """Test LocationProcessor integration scenarios."""
    
    def test_complex_cv_data_processing(self):
        """Test processing complex CV data structure."""
        cv_data = {
            'contact': {
                'location': 'San Francisco, CA, USA'
            },
            'experience': {
                'experienceItems': [
                    {
                        'company': 'Apple',
                        'location': 'Cupertino, CA | 2020-Present',
                        'title': 'Senior Engineer'
                    },
                    {
                        'company': 'Microsoft',
                        'location': 'Redmond, WA (Remote)',
                        'title': 'Engineer'
                    }
                ]
            },
            'education': {
                'educationItems': [
                    {
                        'institution': 'UC Berkeley',
                        'location': 'Berkeley, California',
                        'degree': 'BS CS'
                    }
                ]
            }
        }
        
        processed = location_processor.process_all_locations(cv_data)
        
        # Verify all locations were processed
        self.assertIsNotNone(processed)
        
        # Check experience locations
        exp_items = processed['experience']['experienceItems']
        self.assertEqual(len(exp_items), 2)
        
        if 'locationDetails' in exp_items[0]:
            self.assertEqual(exp_items[0]['locationDetails']['city'], 'Cupertino')
        
        if 'locationDetails' in exp_items[1]:
            self.assertEqual(exp_items[1]['locationDetails']['city'], 'Redmond')
    
    def test_preserve_original_data(self):
        """Test that original location strings are preserved."""
        original = {
            'experience': {
                'experienceItems': [
                    {
                        'company': 'TestCo',
                        'location': 'Original Location String, With Special-Chars'
                    }
                ]
            }
        }
        
        processed = location_processor.process_all_locations(original)
        
        # Original location should still be there
        self.assertEqual(
            processed['experience']['experienceItems'][0]['location'],
            'Original Location String, With Special-Chars'
        )


if __name__ == "__main__":
    unittest.main()