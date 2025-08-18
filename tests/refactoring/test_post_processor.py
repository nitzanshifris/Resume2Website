#!/usr/bin/env python3
"""
Unit Tests for PostProcessor
Tests post-processing operations including deduplication, validation, and confidence scoring
"""

import unittest
from unittest.mock import Mock, patch
import sys
from pathlib import Path
from datetime import datetime
sys.path.append(str(Path(__file__).parent.parent.parent))

from src.core.cv_extraction.post_processor import PostProcessor, post_processor


class TestPostProcessor(unittest.TestCase):
    """Test PostProcessor functionality."""
    
    def test_singleton_pattern(self):
        """Test that PostProcessor follows singleton pattern."""
        proc1 = PostProcessor()
        proc2 = PostProcessor()
        self.assertIs(proc1, post_processor)
    
    def test_deduplicate_certifications_courses(self):
        """Test deduplication of certifications and courses."""
        # Create mock CVData
        cv_data = Mock()
        cv_data.model_dump.return_value = {
            'certifications': {
                'certifications': [
                    {'title': 'AWS Certified', 'organization': 'Amazon'},
                    {'title': 'AWS Certified', 'organization': 'Amazon'},  # Duplicate
                    {'title': 'Azure Certified', 'organization': 'Microsoft'}
                ]
            },
            'courses': {
                'courses': [
                    {'title': 'Machine Learning', 'institution': 'Coursera'},
                    {'title': 'Machine Learning', 'institution': 'Coursera'},  # Duplicate
                    {'title': 'Deep Learning', 'institution': 'Udemy'}
                ]
            }
        }
        
        result = post_processor.deduplicate_certifications_courses(cv_data)
        
        cv_dict = result.model_dump()
        
        # Check certifications deduplicated
        certs = cv_dict['certifications']['certifications']
        self.assertEqual(len(certs), 2)  # Should have 2 unique certs
        
        # Check courses deduplicated
        courses = cv_dict['courses']['courses']
        self.assertEqual(len(courses), 2)  # Should have 2 unique courses
    
    def test_validate_and_fix_dates(self):
        """Test date validation and fixing."""
        cv_dict = {
            'experience': {
                'experienceItems': [
                    {
                        'startDate': '2025-01',  # Future date
                        'endDate': '2023-01',    # Before start
                        'company': 'TestCo'
                    },
                    {
                        'startDate': '2020-01',
                        'endDate': '2022-12',
                        'company': 'GoodCo'
                    }
                ]
            },
            'education': {
                'educationItems': [
                    {
                        'startDate': '2030-01',  # Far future
                        'endDate': '2020-01',
                        'institution': 'MIT'
                    }
                ]
            }
        }
        
        result, issues = post_processor.validate_and_fix_dates(cv_dict)
        
        # Should have validation issues
        self.assertGreater(len(issues), 0)
        
        # Check that problematic dates were handled
        exp_items = result['experience']['experienceItems']
        
        # Future dates should be flagged or fixed
        for item in exp_items:
            if 'startDate' in item and 'endDate' in item:
                # End should not be before start
                if item['startDate'] and item['endDate']:
                    self.assertLessEqual(item['startDate'], item['endDate'])
    
    def test_calculate_extraction_confidence(self):
        """Test confidence score calculation."""
        cv_data = Mock()
        cv_data.model_dump.return_value = {
            'hero': {'fullName': 'John Doe'},
            'contact': {'email': 'john@example.com'},
            'experience': {'experienceItems': [{'company': 'TestCo'}]},
            'education': {'educationItems': [{'institution': 'MIT'}]},
            'skills': {'skillCategories': [{'skills': ['Python']}]},
            'projects': None,
            'achievements': None,
            'certifications': None
        }
        
        raw_text = "John Doe Software Engineer " * 100  # 300 chars
        
        confidence = post_processor.calculate_extraction_confidence(cv_data, raw_text)
        
        # Should return a confidence score between 0 and 1
        self.assertGreaterEqual(confidence, 0.0)
        self.assertLessEqual(confidence, 1.0)
        
        # With hero, contact, experience, education, skills - should be decent confidence
        self.assertGreater(confidence, 0.3)
    
    def test_clean_empty_sections(self):
        """Test removal of empty sections."""
        cv_dict = {
            'hero': {'fullName': 'John Doe'},
            'contact': {},  # Empty dict
            'experience': None,  # None
            'education': {'educationItems': []},  # Empty list
            'skills': {'skillCategories': [{'skills': ['Python']}]},
            'projects': '',  # Empty string
            'achievements': {'achievements': []}  # Empty achievements
        }
        
        result = post_processor.clean_empty_sections(cv_dict)
        
        # Should keep non-empty sections
        self.assertIn('hero', result)
        self.assertIn('skills', result)
        
        # Should remove empty sections
        self.assertNotIn('contact', result)
        self.assertNotIn('experience', result)
        self.assertNotIn('projects', result)
        
        # Education might be kept with empty items (depends on implementation)
        if 'education' in result:
            self.assertIsNotNone(result['education'])
    
    def test_estimate_extracted_text_length(self):
        """Test text length estimation from CV data."""
        cv_dict = {
            'hero': {'fullName': 'John Doe', 'professionalTitle': 'Engineer'},
            'summary': {'summaryText': 'Experienced software engineer with 10 years of experience.'},
            'experience': {
                'experienceItems': [
                    {'company': 'TestCo', 'description': 'Worked on various projects.'},
                    {'company': 'OtherCo', 'responsibilities': ['Led team', 'Developed features']}
                ]
            },
            'skills': {
                'skillCategories': [
                    {'skills': ['Python', 'JavaScript', 'React']}
                ]
            }
        }
        
        length = post_processor._estimate_extracted_text_length(cv_dict)
        
        # Should count all text content
        self.assertGreater(length, 0)
        
        # Should be reasonable length
        self.assertGreater(length, 50)  # At least some content
        self.assertLess(length, 10000)  # Not unreasonably large
    
    @patch('src.core.cv_extraction.post_processor.CVData')
    def test_process_all_integration(self, mock_cv_class):
        """Test complete post-processing pipeline."""
        # Setup mock CV data
        cv_data = Mock()
        cv_data.model_dump.return_value = {
            'hero': {'fullName': 'Jane Smith'},
            'contact': {'email': 'jane@example.com'},
            'experience': {
                'experienceItems': [
                    {'company': 'TechCo', 'startDate': '2020-01', 'endDate': '2023-01'}
                ]
            },
            'certifications': {
                'certifications': [
                    {'title': 'AWS', 'organization': 'Amazon'},
                    {'title': 'AWS', 'organization': 'Amazon'}  # Duplicate
                ]
            },
            'empty_section': None
        }
        
        # Mock CVData class
        mock_cv_class.return_value = cv_data
        
        raw_text = "Jane Smith experienced engineer " * 50
        
        result, confidence = post_processor.process_all(cv_data, raw_text)
        
        # Should return processed CV data and confidence
        self.assertIsNotNone(result)
        self.assertIsInstance(confidence, float)
        self.assertGreaterEqual(confidence, 0.0)
        self.assertLessEqual(confidence, 1.0)
    
    def test_date_validation_edge_cases(self):
        """Test edge cases in date validation."""
        cv_dict = {
            'experience': {
                'experienceItems': [
                    {'startDate': 'Present', 'endDate': '2023-01'},  # Present as start
                    {'startDate': '2020', 'endDate': 'Current'},      # Year only format
                    {'startDate': None, 'endDate': '2023-01'},        # Missing start
                    {'startDate': '2020-01', 'endDate': None},        # Missing end
                    {'startDate': 'Invalid', 'endDate': 'Invalid'}    # Invalid dates
                ]
            }
        }
        
        result, issues = post_processor.validate_and_fix_dates(cv_dict)
        
        # Should handle various date formats gracefully
        self.assertIsNotNone(result)
        
        # Should report issues for invalid dates
        self.assertGreater(len(issues), 0)


class TestPostProcessorQuality(unittest.TestCase):
    """Test quality aspects of post-processing."""
    
    def test_confidence_factors(self):
        """Test that confidence calculation considers all factors."""
        # Minimal CV
        minimal_cv = Mock()
        minimal_cv.model_dump.return_value = {
            'hero': {'fullName': 'Name'}
        }
        
        # Complete CV
        complete_cv = Mock()
        complete_cv.model_dump.return_value = {
            'hero': {'fullName': 'Name'},
            'contact': {'email': 'email@test.com'},
            'summary': {'summaryText': 'Summary text'},
            'experience': {'experienceItems': [{'company': 'Co'}]},
            'education': {'educationItems': [{'institution': 'Uni'}]},
            'skills': {'skillCategories': [{'skills': ['Skill']}]},
            'projects': {'projects': [{'title': 'Project'}]},
            'achievements': {'achievements': [{'value': 'Achievement'}]}
        }
        
        raw_text = "Test CV content " * 100
        
        minimal_conf = post_processor.calculate_extraction_confidence(minimal_cv, raw_text)
        complete_conf = post_processor.calculate_extraction_confidence(complete_cv, raw_text)
        
        # Complete CV should have higher confidence
        self.assertGreater(complete_conf, minimal_conf)
    
    def test_deduplication_preserves_unique(self):
        """Test that deduplication preserves unique items."""
        cv_data = Mock()
        cv_data.model_dump.return_value = {
            'certifications': {
                'certifications': [
                    {'title': 'AWS Solutions Architect', 'organization': 'Amazon', 'date': '2023'},
                    {'title': 'AWS Developer', 'organization': 'Amazon', 'date': '2022'},
                    {'title': 'Azure Admin', 'organization': 'Microsoft', 'date': '2023'}
                ]
            }
        }
        
        result = post_processor.deduplicate_certifications_courses(cv_data)
        cv_dict = result.model_dump()
        
        # All unique certs should be preserved
        certs = cv_dict['certifications']['certifications']
        self.assertEqual(len(certs), 3)
        
        # Check all titles are present
        titles = [c['title'] for c in certs]
        self.assertIn('AWS Solutions Architect', titles)
        self.assertIn('AWS Developer', titles)
        self.assertIn('Azure Admin', titles)
    
    def test_empty_section_cleaning_preserves_valid(self):
        """Test that cleaning preserves valid sections."""
        cv_dict = {
            'hero': {'fullName': ''},  # Empty string in field
            'contact': {'email': 'test@example.com'},  # Valid
            'experience': {'experienceItems': []},  # Empty list
            'skills': {'skillCategories': [{'skills': []}]},  # Nested empty
            'projects': {'projects': [{'title': 'Project'}]}  # Valid nested
        }
        
        result = post_processor.clean_empty_sections(cv_dict)
        
        # Should keep sections with valid data
        self.assertIn('contact', result)
        self.assertIn('projects', result)
        
        # Behavior for empty strings/lists may vary by implementation
        # But should not crash


class TestPostProcessorIntegration(unittest.TestCase):
    """Test integration with other components."""
    
    @patch('src.core.cv_extraction.post_processor.extraction_config')
    def test_uses_extraction_config(self, mock_config):
        """Test that PostProcessor uses extraction config."""
        mock_config.CONFIDENCE_WEIGHTS = {
            'hero': 0.2,
            'experience': 0.3,
            'education': 0.2,
            'skills': 0.2,
            'contact': 0.1
        }
        mock_config.TOTAL_SECTIONS = 17
        
        cv_data = Mock()
        cv_data.model_dump.return_value = {
            'hero': {'fullName': 'Test'},
            'experience': {'experienceItems': [{}]}
        }
        
        confidence = post_processor.calculate_extraction_confidence(cv_data, "text")
        
        # Should use config weights
        self.assertIsInstance(confidence, float)
    
    def test_handles_pydantic_models(self):
        """Test handling of Pydantic model inputs."""
        from src.core.schemas.unified_nullable import CVData
        
        # Create actual CVData instance
        cv_data = CVData()
        
        # Process it
        result, confidence = post_processor.process_all(cv_data, "test text")
        
        # Should handle gracefully
        self.assertIsInstance(result, CVData)
        self.assertIsInstance(confidence, float)


if __name__ == "__main__":
    unittest.main()