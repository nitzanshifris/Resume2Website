#!/usr/bin/env python3
"""
Unit Tests for EnhancementProcessor
Tests data enhancement and enrichment functionality
"""

import unittest
from unittest.mock import Mock, patch
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent.parent))

from src.core.cv_extraction.enhancement_processor import EnhancementProcessor, enhancement_processor


class TestEnhancementProcessor(unittest.TestCase):
    """Test EnhancementProcessor functionality."""
    
    def test_singleton_pattern(self):
        """Test that EnhancementProcessor follows singleton pattern."""
        proc1 = EnhancementProcessor()
        proc2 = EnhancementProcessor()
        self.assertIs(proc1, enhancement_processor)
    
    def test_extract_dissertations_to_publications(self):
        """Test dissertation extraction from education."""
        data = {
            'education': {
                'educationItems': [
                    {
                        'institution': 'MIT',
                        'degree': 'PhD',
                        'fieldOfStudy': 'Computer Science',
                        'relevantCoursework': [
                            'Machine Learning',
                            'Dissertation: "Deep Learning for NLP"',
                            'Algorithms'
                        ]
                    }
                ]
            }
        }
        
        result = enhancement_processor.extract_dissertations_to_publications(data)
        
        # Should create publications section
        self.assertIn('publications', result)
        self.assertIn('publications', result['publications'])
        
        # Should have the dissertation
        pubs = result['publications']['publications']
        self.assertEqual(len(pubs), 1)
        self.assertEqual(pubs[0]['title'], 'Deep Learning for NLP')
        self.assertEqual(pubs[0]['publicationType'], 'Dissertation')
        self.assertEqual(pubs[0]['journalName'], 'MIT')
    
    def test_extract_availability_from_summary(self):
        """Test availability extraction from summary text."""
        data = {
            'summary': {
                'summaryText': 'Experienced developer seeking new opportunities. Available immediately for full-time positions.'
            },
            'contact': {
                'email': 'test@example.com'
            }
        }
        
        result = enhancement_processor.extract_availability_from_summary(data)
        
        # Should add availability to contact
        self.assertIn('availability', result['contact'])
        self.assertEqual(result['contact']['availability'], 'immediately')
    
    def test_optimize_career_highlights(self):
        """Test career highlights optimization."""
        data = {
            'summary': {
                'careerHighlights': [
                    'Highlight 1', 'Highlight 2', 'Highlight 3',
                    'Highlight 4', 'Highlight 5', 'Highlight 6',
                    'Highlight 7', 'Highlight 8'
                ]
            },
            'achievements': {
                'achievements': [
                    {'value': 'Achievement 1'},
                    {'value': 'Achievement 2'}
                ]
            }
        }
        
        result = enhancement_processor.optimize_career_highlights(data)
        
        # Should limit to MAX_CAREER_HIGHLIGHTS (5)
        self.assertEqual(len(result['summary']['careerHighlights']), 5)
        self.assertEqual(result['summary']['careerHighlights'][0], 'Highlight 1')
        self.assertEqual(result['summary']['careerHighlights'][4], 'Highlight 5')
    
    def test_extract_years_of_experience(self):
        """Test years of experience extraction."""
        data = {
            'summary': {
                'summaryText': 'Software engineer with over 10 years of experience in web development.'
            }
        }
        
        result = enhancement_processor.extract_years_of_experience_from_summary(data)
        
        # Should extract years
        self.assertIn('yearsOfExperience', result['summary'])
        self.assertEqual(result['summary']['yearsOfExperience'], 10)
        self.assertEqual(result['summary'].get('yearsOfExperienceQualifier'), 'more_than')
    
    def test_ensure_achievements_structure(self):
        """Test achievements structure normalization."""
        # Test with list input
        data = {
            'achievements': [
                'Increased sales by 50%',
                'Led team of 10 developers',
                'Reduced costs by $1M'
            ]
        }
        
        result = enhancement_processor.ensure_achievements_structure(data)
        
        # Should convert to proper structure
        self.assertIsInstance(result['achievements'], dict)
        self.assertIn('sectionTitle', result['achievements'])
        self.assertIn('achievements', result['achievements'])
        
        achievements = result['achievements']['achievements']
        self.assertEqual(len(achievements), 3)
        self.assertEqual(achievements[0]['value'], 'Increased sales by 50%')
        self.assertEqual(achievements[0]['label'], 'Increased sales by 50%')
    
    def test_extract_name_from_text(self):
        """Test name extraction from CV text."""
        text = """John Doe
Software Engineer
San Francisco, CA

Experienced developer with 10 years..."""
        
        name = enhancement_processor.extract_name_from_text(text)
        self.assertEqual(name, "John Doe")
        
        # Test with Dr. prefix
        text2 = """Dr. Jane Smith
Data Scientist"""
        
        name2 = enhancement_processor.extract_name_from_text(text2)
        self.assertEqual(name2, "Dr. Jane Smith")
    
    def test_extract_title_from_text(self):
        """Test professional title extraction."""
        text = """John Doe
Senior Software Engineer
San Francisco, CA"""
        
        title = enhancement_processor.extract_title_from_text(text)
        self.assertEqual(title, "Senior Software Engineer")
        
        # Test with different title
        text2 = """Jane Smith
Product Manager
New York, NY"""
        
        title2 = enhancement_processor.extract_title_from_text(text2)
        self.assertEqual(title2, "Product Manager")
    
    def test_create_hero_if_missing(self):
        """Test hero section creation when missing."""
        raw_text = """Jane Doe
Data Scientist
Experienced in ML and AI"""
        
        data = {
            'contact': {
                'email': 'jane@example.com'
            },
            'summary': {
                'summaryText': 'Experienced data scientist with expertise in machine learning and artificial intelligence.'
            }
        }
        
        result = enhancement_processor.create_hero_if_missing(data, raw_text)
        
        # Should create hero section
        self.assertIn('hero', result)
        self.assertEqual(result['hero']['fullName'], 'Jane Doe')
        self.assertEqual(result['hero']['professionalTitle'], 'Data Scientist')
        self.assertIn('Experienced data scientist', result['hero']['summaryTagline'])
    
    @patch('src.core.cv_extraction.enhancement_processor.smart_deduplicator')
    def test_apply_smart_deduplication(self, mock_deduplicator):
        """Test smart deduplication integration."""
        data = {
            'achievements': {
                'achievements': [
                    {'value': 'Increased sales by 50%'},
                    {'value': 'Increased sales by 50%'},  # Duplicate
                ]
            }
        }
        
        # Mock the deduplicator
        mock_deduplicator.deduplicate_cv_data.return_value = {
            'achievements': {
                'achievements': [
                    {'value': 'Increased sales by 50%'}
                ]
            },
            '_deduplication_report': {
                'duplicates_found': 1,
                'duplicate_groups': [
                    {'text': 'Increased sales by 50%', 'sources': ['achievements']}
                ]
            }
        }
        
        result = enhancement_processor.apply_smart_deduplication(data)
        
        # Should call deduplicator
        mock_deduplicator.deduplicate_cv_data.assert_called_once()
        
        # Should not have report in result
        self.assertNotIn('_deduplication_report', result)
    
    def test_enhance_all_integration(self):
        """Test complete enhancement pipeline."""
        raw_text = """John Smith
Senior Software Engineer
San Francisco, CA

Experienced engineer with 15+ years in software development.
Available for remote opportunities starting immediately.

Education:
PhD Computer Science, MIT
Dissertation: "Distributed Systems at Scale"
"""
        
        data = {
            'contact': {
                'email': 'john@example.com'
            },
            'summary': {
                'summaryText': 'Experienced engineer with 15+ years in software development. Available for remote opportunities starting immediately.',
                'careerHighlights': ['Highlight ' + str(i) for i in range(10)]
            },
            'education': {
                'educationItems': [
                    {
                        'institution': 'MIT',
                        'degree': 'PhD',
                        'fieldOfStudy': 'Computer Science',
                        'relevantCoursework': ['Dissertation: "Distributed Systems at Scale"']
                    }
                ]
            },
            'achievements': [
                'Led team to success',
                'Improved performance'
            ]
        }
        
        result = enhancement_processor.enhance_all(data, raw_text)
        
        # Check hero was created
        self.assertIn('hero', result)
        self.assertEqual(result['hero']['fullName'], 'John Smith')
        
        # Check availability was extracted
        self.assertIn('availability', result['contact'])
        
        # Check years of experience
        self.assertEqual(result['summary']['yearsOfExperience'], 15)
        
        # Check career highlights were limited
        self.assertEqual(len(result['summary']['careerHighlights']), 5)
        
        # Check dissertation was extracted
        self.assertIn('publications', result)
        
        # Check achievements structure
        self.assertIsInstance(result['achievements'], dict)
        self.assertIn('achievements', result['achievements'])
    
    def test_edge_cases(self):
        """Test edge cases and error handling."""
        # Test with None data
        result = enhancement_processor.enhance_all(None, "text")
        self.assertEqual(result, {})
        
        # Test with empty data
        result = enhancement_processor.enhance_all({}, "text")
        self.assertIsInstance(result, dict)
        
        # Test with malformed data
        data = {
            'education': 'not a dict',
            'summary': None
        }
        result = enhancement_processor.enhance_all(data, "text")
        self.assertIsInstance(result, dict)


class TestEnhancementQuality(unittest.TestCase):
    """Test the quality of enhancements."""
    
    def test_no_data_loss(self):
        """Test that enhancement doesn't lose existing data."""
        original = {
            'contact': {'email': 'test@example.com', 'phone': '555-1234'},
            'experience': {'experienceItems': [{'company': 'TestCo'}]},
            'skills': {'skillCategories': [{'name': 'Programming'}]}
        }
        
        enhanced = enhancement_processor.enhance_all(original.copy(), "text")
        
        # All original data should still be present
        self.assertEqual(enhanced['contact']['email'], 'test@example.com')
        self.assertEqual(enhanced['contact']['phone'], '555-1234')
        self.assertEqual(enhanced['experience']['experienceItems'][0]['company'], 'TestCo')
        self.assertEqual(enhanced['skills']['skillCategories'][0]['name'], 'Programming')
    
    def test_enhancement_idempotency(self):
        """Test that running enhancement twice gives same result."""
        data = {
            'summary': {
                'summaryText': 'Developer with 5 years of experience',
                'careerHighlights': ['Highlight 1', 'Highlight 2']
            }
        }
        
        result1 = enhancement_processor.enhance_all(data.copy(), "text")
        result2 = enhancement_processor.enhance_all(result1.copy(), "text")
        
        # Should be the same after second run
        self.assertEqual(
            result1['summary']['yearsOfExperience'],
            result2['summary']['yearsOfExperience']
        )


if __name__ == "__main__":
    unittest.main()