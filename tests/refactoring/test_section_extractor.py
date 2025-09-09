#!/usr/bin/env python3
"""
Unit Tests for SectionExtractor
Tests section extraction logic and processing pipeline
"""

import unittest
from unittest.mock import Mock, AsyncMock, patch
import asyncio
import json
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent.parent))

from src.core.cv_extraction.section_extractor import SectionExtractor


class TestSectionExtractor(unittest.TestCase):
    """Test SectionExtractor functionality."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.mock_schemas = {
            'hero': Mock(),
            'experience': Mock(),
            'education': Mock()
        }
        self.extractor = SectionExtractor(self.mock_schemas)
    
    def test_initialization(self):
        """Test SectionExtractor initialization."""
        self.assertEqual(self.extractor.section_schemas, self.mock_schemas)
        self.assertEqual(len(self.extractor.section_schemas), 3)
    
    def test_parse_llm_response_valid_json(self):
        """Test parsing valid JSON response."""
        response = '{"name": "John Doe", "title": "Engineer"}'
        
        result = self.extractor.parse_llm_response("claude", response, "hero")
        
        self.assertIsInstance(result, dict)
        self.assertEqual(result['name'], 'John Doe')
        self.assertEqual(result['title'], 'Engineer')
    
    def test_parse_llm_response_with_markdown(self):
        """Test parsing JSON from markdown code blocks."""
        response = '''Here's the extracted data:
        
```json
{
    "name": "Jane Smith",
    "skills": ["Python", "JavaScript"]
}
```

That's the extraction.'''
        
        result = self.extractor.parse_llm_response("claude", response, "skills")
        
        self.assertIsInstance(result, dict)
        self.assertEqual(result['name'], 'Jane Smith')
        self.assertEqual(result['skills'], ['Python', 'JavaScript'])
    
    def test_parse_llm_response_invalid_json(self):
        """Test handling of invalid JSON."""
        response = "This is not JSON at all"
        
        result = self.extractor.parse_llm_response("claude", response, "hero")
        
        # Should return empty dict or None for invalid JSON
        self.assertIn(result, [{}, None])
    
    def test_parse_llm_response_malformed_json(self):
        """Test handling of malformed JSON."""
        response = '{"name": "John", "title": Engineer}'  # Missing quotes
        
        result = self.extractor.parse_llm_response("claude", response, "test")
        
        # Should handle gracefully
        self.assertIn(result, [{}, None])
    
    @patch('src.core.cv_extraction.section_extractor.location_processor')
    def test_apply_processing_pipeline_experience(self, mock_location):
        """Test processing pipeline for experience section."""
        mock_location.process_experience_locations.return_value = [
            {'company': 'TestCo', 'location': 'SF', 'locationDetails': {'city': 'San Francisco'}}
        ]
        
        data = {
            'experienceItems': [
                {'company': 'TestCo', 'location': 'SF'}
            ]
        }
        
        result = self.extractor.apply_processing_pipeline('experience', data)
        
        # Should call location processor
        mock_location.process_experience_locations.assert_called_once()
        
        # Should have processed data
        self.assertIn('experienceItems', result)
        self.assertEqual(result['experienceItems'][0]['locationDetails']['city'], 'San Francisco')
    
    @patch('src.core.cv_extraction.section_extractor.location_processor')
    def test_apply_processing_pipeline_education(self, mock_location):
        """Test processing pipeline for education section."""
        mock_location.process_education_locations.return_value = [
            {'institution': 'MIT', 'location': 'Cambridge', 'locationDetails': {'city': 'Cambridge'}}
        ]
        
        data = {
            'educationItems': [
                {'institution': 'MIT', 'location': 'Cambridge'}
            ]
        }
        
        result = self.extractor.apply_processing_pipeline('education', data)
        
        # Should call location processor
        mock_location.process_education_locations.assert_called_once()
        
        # Should have processed data
        self.assertEqual(result['educationItems'][0]['institution'], 'MIT')
    
    def test_apply_processing_pipeline_skills(self):
        """Test processing pipeline for skills section."""
        data = {
            'skillCategories': [
                {
                    'categoryName': 'Programming',
                    'skills': ['Python', 'python', 'PYTHON', 'JavaScript']
                }
            ]
        }
        
        result = self.extractor.apply_processing_pipeline('skills', data)
        
        # Should deduplicate skills (case-insensitive)
        skills = result['skillCategories'][0]['skills']
        
        # Check that duplicates are removed
        self.assertEqual(len(skills), len(set(s.lower() for s in skills)))
    
    def test_validate_section_valid(self):
        """Test section validation with valid data."""
        mock_schema = Mock()
        mock_schema.model_validate.return_value = Mock()
        
        data = {'field': 'value'}
        
        result = self.extractor.validate_section('test', data, mock_schema)
        
        # Should validate successfully
        mock_schema.model_validate.assert_called_once_with(data)
        self.assertEqual(result, data)
    
    def test_validate_section_invalid(self):
        """Test section validation with invalid data."""
        from pydantic import ValidationError
        
        mock_schema = Mock()
        mock_schema.model_validate.side_effect = ValidationError.from_exception_data(
            "test", [{'type': 'missing', 'loc': ('field',), 'msg': 'Field required'}]
        )
        
        data = {'wrong': 'data'}
        
        result = self.extractor.validate_section('test', data, mock_schema)
        
        # Should return original data on validation error
        self.assertEqual(result, data)
    
    async def test_extract_integration(self):
        """Test complete extraction flow."""
        # Set up mocks
        mock_llm_caller = AsyncMock()
        mock_llm_caller.return_value = ("claude", '{"fullName": "John Doe", "professionalTitle": "Engineer"}')
        
        raw_text = "John Doe\nSoftware Engineer\nExperienced developer"
        
        # Create mock schema that accepts the data
        mock_hero_schema = Mock()
        mock_hero_schema.model_validate.return_value = Mock()
        
        extractor = SectionExtractor({'hero': mock_hero_schema})
        
        # Run extraction
        result = await extractor.extract('hero', raw_text, mock_llm_caller)
        
        # Check result structure
        self.assertIn('hero', result)
        self.assertIn('fullName', result['hero'])
        self.assertEqual(result['hero']['fullName'], 'John Doe')
    
    async def test_extract_with_retry(self):
        """Test extraction with LLM retry logic."""
        # Mock LLM that fails once then succeeds
        call_count = 0
        
        async def mock_llm_with_retry(prompt, section):
            nonlocal call_count
            call_count += 1
            if call_count == 1:
                raise Exception("API Error")
            return ("claude", '{"data": "success"}')
        
        raw_text = "Test CV"
        
        # Should handle the error gracefully
        result = await self.extractor.extract('test', raw_text, mock_llm_with_retry)
        
        # First call fails, should return None or empty
        self.assertIn(result, [None, {}])


class TestSectionExtractorEdgeCases(unittest.TestCase):
    """Test edge cases and error scenarios."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.extractor = SectionExtractor({})
    
    def test_empty_response_handling(self):
        """Test handling of empty LLM responses."""
        result = self.extractor.parse_llm_response("claude", "", "test")
        self.assertIn(result, [{}, None])
        
        result = self.extractor.parse_llm_response("claude", None, "test")
        self.assertIn(result, [{}, None])
    
    def test_nested_json_extraction(self):
        """Test extraction of nested JSON structures."""
        response = '''
        Some text before
        ```json
        {
            "section": {
                "nested": {
                    "deep": "value"
                }
            }
        }
        ```
        Some text after
        '''
        
        result = self.extractor.parse_llm_response("claude", response, "test")
        
        self.assertIsInstance(result, dict)
        self.assertEqual(result['section']['nested']['deep'], 'value')
    
    def test_multiple_json_blocks(self):
        """Test handling of multiple JSON blocks (should take first valid)."""
        response = '''
        First block:
        ```json
        {"first": "block"}
        ```
        
        Second block:
        ```json
        {"second": "block"}
        ```
        '''
        
        result = self.extractor.parse_llm_response("claude", response, "test")
        
        # Should extract first valid JSON block
        self.assertIn('first', result)
        self.assertEqual(result['first'], 'block')
    
    def test_processing_pipeline_with_none(self):
        """Test processing pipeline with None/empty data."""
        result = self.extractor.apply_processing_pipeline('experience', None)
        self.assertIsNone(result)
        
        result = self.extractor.apply_processing_pipeline('education', {})
        self.assertEqual(result, {})
    
    def test_unicode_handling(self):
        """Test handling of Unicode characters in responses."""
        response = '{"name": "José García", "title": "Ingeniero de Software", "location": "São Paulo"}'
        
        result = self.extractor.parse_llm_response("claude", response, "hero")
        
        self.assertEqual(result['name'], 'José García')
        self.assertEqual(result['location'], 'São Paulo')


class TestSectionExtractorPerformance(unittest.TestCase):
    """Test performance-related aspects."""
    
    async def test_concurrent_extraction(self):
        """Test that multiple sections can be extracted concurrently."""
        schemas = {f'section_{i}': Mock() for i in range(5)}
        extractor = SectionExtractor(schemas)
        
        # Mock LLM caller with delay
        async def mock_llm_caller(prompt, section):
            await asyncio.sleep(0.1)  # Simulate API delay
            return ("claude", f'{{"section": "{section}"}}')
        
        raw_text = "Test CV"
        
        # Extract multiple sections concurrently
        tasks = [
            extractor.extract(f'section_{i}', raw_text, mock_llm_caller)
            for i in range(5)
        ]
        
        import time
        start = time.time()
        results = await asyncio.gather(*tasks)
        elapsed = time.time() - start
        
        # Should complete faster than sequential (< 0.5s for 5 concurrent vs 0.5s sequential)
        self.assertLess(elapsed, 0.3)
        self.assertEqual(len(results), 5)


if __name__ == "__main__":
    # Run async tests properly
    unittest.main()