#!/usr/bin/env python3
"""
Unit Tests for DataExtractor (Coordinator)
Tests the orchestration of all services in the extraction pipeline
"""

import unittest
from unittest.mock import Mock, AsyncMock, patch, MagicMock
import asyncio
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent.parent))

from src.core.cv_extraction.data_extractor import DataExtractor


class TestDataExtractor(unittest.TestCase):
    """Test DataExtractor coordinator functionality."""
    
    @patch('src.core.cv_extraction.data_extractor.get_llm_service')
    @patch('src.core.cv_extraction.data_extractor.SectionExtractor')
    def test_initialization(self, mock_section_extractor, mock_get_llm):
        """Test DataExtractor initialization."""
        mock_llm = Mock()
        mock_llm.get_model_info.return_value = {
            'model': 'claude-3-opus',
            'deterministic': True
        }
        mock_get_llm.return_value = mock_llm
        
        mock_extractor = Mock()
        mock_section_extractor.return_value = mock_extractor
        
        extractor = DataExtractor(api_key="test_key")
        
        # Should initialize services
        mock_get_llm.assert_called_once_with("test_key")
        self.assertEqual(extractor.llm_service, mock_llm)
        self.assertEqual(extractor.section_extractor, mock_extractor)
        
        # Should have section schemas
        self.assertEqual(len(extractor.SECTION_SCHEMAS), 17)
        self.assertIn('hero', extractor.SECTION_SCHEMAS)
        self.assertIn('experience', extractor.SECTION_SCHEMAS)
    
    async def test_extract_cv_data_empty_input(self):
        """Test extraction with empty input."""
        extractor = DataExtractor.__new__(DataExtractor)
        extractor.llm_service = Mock()
        extractor.section_extractor = Mock()
        extractor.SECTION_SCHEMAS = {}
        
        # Empty string
        result = await extractor.extract_cv_data("")
        self.assertIsNotNone(result)
        
        # None input
        result = await extractor.extract_cv_data(None)
        self.assertIsNotNone(result)
        
        # Whitespace only
        result = await extractor.extract_cv_data("   \n\t  ")
        self.assertIsNotNone(result)
    
    @patch('src.core.cv_extraction.data_extractor.get_llm_service')
    @patch('src.core.cv_extraction.data_extractor.SectionExtractor')
    async def test_extract_all_sections_parallel(self, mock_section_extractor_class, mock_get_llm):
        """Test parallel extraction of all sections."""
        # Setup mocks
        mock_llm = Mock()
        mock_llm.call_llm = AsyncMock(return_value=("claude", "response"))
        mock_get_llm.return_value = mock_llm
        
        mock_section_extractor = Mock()
        
        # Create async extract method
        async def mock_extract(section_name, raw_text, llm_caller):
            await asyncio.sleep(0.01)  # Simulate work
            return {section_name: {'data': f'{section_name}_data'}}
        
        mock_section_extractor.extract = mock_extract
        mock_section_extractor_class.return_value = mock_section_extractor
        
        extractor = DataExtractor()
        
        # Test extraction
        raw_text = "Test CV content"
        result = await extractor._extract_all_sections(raw_text)
        
        # Should have extracted all sections
        self.assertIn('hero', result)
        self.assertIn('experience', result)
        self.assertIn('education', result)
        self.assertEqual(len(result), 17)
    
    @patch('src.core.cv_extraction.data_extractor.get_llm_service')
    @patch('src.core.cv_extraction.data_extractor.SectionExtractor')
    async def test_retry_failed_sections(self, mock_section_extractor_class, mock_get_llm):
        """Test retry logic for failed sections."""
        mock_llm = Mock()
        mock_get_llm.return_value = mock_llm
        
        mock_section_extractor = Mock()
        
        # First attempt fails for some sections
        call_count = {}
        
        async def mock_extract_with_retry(section_name, raw_text, llm_caller):
            if section_name not in call_count:
                call_count[section_name] = 0
            call_count[section_name] += 1
            
            if call_count[section_name] == 1 and section_name in ['hero', 'experience']:
                raise Exception(f"Failed to extract {section_name}")
            
            return {section_name: {'data': f'{section_name}_data'}}
        
        mock_section_extractor.extract = mock_extract_with_retry
        mock_section_extractor_class.return_value = mock_section_extractor
        
        extractor = DataExtractor()
        
        result = await extractor._extract_all_sections("Test CV")
        
        # Should retry failed sections
        self.assertEqual(call_count['hero'], 2)
        self.assertEqual(call_count['experience'], 2)
        
        # Should still have all sections
        self.assertIn('hero', result)
        self.assertIn('experience', result)
    
    @patch('src.core.cv_extraction.data_extractor.enhancement_processor')
    def test_apply_enhancements(self, mock_enhancement):
        """Test enhancement application."""
        mock_enhancement.enhance_all.return_value = {
            'hero': {'enhanced': True},
            'extra_field': 'added'
        }
        
        extractor = DataExtractor.__new__(DataExtractor)
        
        data = {'hero': {'original': True}}
        raw_text = "Test CV"
        
        result = extractor._apply_enhancements(data, raw_text)
        
        # Should call enhancement processor
        mock_enhancement.enhance_all.assert_called_once_with(data, raw_text)
        
        # Should return enhanced data
        self.assertTrue(result['hero']['enhanced'])
        self.assertEqual(result['extra_field'], 'added')
    
    @patch('src.core.cv_extraction.data_extractor.enhancement_processor')
    def test_apply_enhancements_error_handling(self, mock_enhancement):
        """Test enhancement error handling."""
        mock_enhancement.enhance_all.side_effect = Exception("Enhancement failed")
        
        extractor = DataExtractor.__new__(DataExtractor)
        
        data = {'hero': {'original': True}}
        
        result = extractor._apply_enhancements(data, "text")
        
        # Should return original data on error
        self.assertEqual(result, data)
        self.assertTrue(result['hero']['original'])
    
    @patch('src.core.cv_extraction.data_extractor.post_processor')
    @patch('src.core.cv_extraction.data_extractor.CVData')
    def test_create_and_process_cv_data(self, mock_cv_class, mock_post):
        """Test CV data creation and post-processing."""
        # Setup mocks
        mock_cv = Mock()
        mock_cv_class.return_value = mock_cv
        
        mock_post.process_all.return_value = (mock_cv, 0.85)
        
        extractor = DataExtractor.__new__(DataExtractor)
        
        data = {'hero': {'fullName': 'Test'}}
        
        result = extractor._create_and_process_cv_data(data, "raw text")
        
        # Should create CVData object
        mock_cv_class.assert_called_once_with(**data)
        
        # Should apply post-processing
        mock_post.process_all.assert_called_once_with(mock_cv, "raw text")
        
        # Should return processed CV
        self.assertEqual(result, mock_cv)
    
    @patch('src.core.cv_extraction.data_extractor.post_processor')
    @patch('src.core.cv_extraction.data_extractor.CVData')
    def test_validation_error_handling(self, mock_cv_class, mock_post):
        """Test handling of validation errors."""
        from pydantic import ValidationError
        
        # Make CVData raise validation error
        mock_cv_class.side_effect = ValidationError.from_exception_data(
            "test", [{'type': 'missing', 'loc': ('field',), 'msg': 'Field required'}]
        )
        
        # Second call should work (partial data)
        mock_cv_partial = Mock()
        mock_cv_class.side_effect = [
            ValidationError.from_exception_data(
                "test", [{'type': 'missing', 'loc': ('field',), 'msg': 'Field required'}]
            ),
            mock_cv_partial
        ]
        
        extractor = DataExtractor.__new__(DataExtractor)
        
        data = {'hero': {'fullName': 'Test'}, 'invalid_field': 'bad'}
        
        result = extractor._create_and_process_cv_data(data, "text")
        
        # Should create partial CV with valid fields only
        self.assertEqual(mock_cv_class.call_count, 2)
        
    async def test_full_pipeline_integration(self):
        """Test complete extraction pipeline."""
        # Create extractor with all mocked services
        extractor = DataExtractor.__new__(DataExtractor)
        
        # Mock LLM service
        mock_llm = Mock()
        mock_llm.call_llm = AsyncMock(return_value=("claude", '{"data": "extracted"}'))
        extractor.llm_service = mock_llm
        
        # Mock section extractor
        mock_section_extractor = Mock()
        async def mock_extract(section_name, raw_text, llm_caller):
            return {section_name: {'field': f'{section_name}_value'}}
        mock_section_extractor.extract = mock_extract
        extractor.section_extractor = mock_section_extractor
        
        # Set schemas
        extractor.SECTION_SCHEMAS = {
            'hero': Mock(),
            'experience': Mock(),
            'education': Mock()
        }
        
        # Mock enhancement and post-processing
        with patch('src.core.cv_extraction.data_extractor.enhancement_processor') as mock_enhance:
            mock_enhance.enhance_all.return_value = {
                'hero': {'field': 'hero_value', 'enhanced': True},
                'experience': {'field': 'experience_value'},
                'education': {'field': 'education_value'}
            }
            
            with patch('src.core.cv_extraction.data_extractor.post_processor') as mock_post:
                mock_cv = Mock()
                mock_post.process_all.return_value = (mock_cv, 0.75)
                
                with patch('src.core.cv_extraction.data_extractor.CVData') as mock_cv_class:
                    mock_cv_class.return_value = mock_cv
                    
                    # Run full pipeline
                    result = await extractor.extract_cv_data("John Doe\nSoftware Engineer")
                    
                    # Verify pipeline execution
                    self.assertEqual(result, mock_cv)
                    
                    # Verify all steps were called
                    mock_enhance.enhance_all.assert_called_once()
                    mock_post.process_all.assert_called_once()
                    mock_cv_class.assert_called_once()


class TestDataExtractorEdgeCases(unittest.TestCase):
    """Test edge cases and error scenarios."""
    
    async def test_all_sections_fail(self):
        """Test behavior when all sections fail to extract."""
        extractor = DataExtractor.__new__(DataExtractor)
        
        # Mock section extractor that always fails
        mock_section_extractor = Mock()
        async def mock_extract_fail(section_name, raw_text, llm_caller):
            raise Exception(f"Failed to extract {section_name}")
        mock_section_extractor.extract = mock_extract_fail
        extractor.section_extractor = mock_section_extractor
        
        # Mock LLM service
        mock_llm = Mock()
        mock_llm.call_llm = AsyncMock()
        extractor.llm_service = mock_llm
        
        extractor.SECTION_SCHEMAS = {'hero': Mock(), 'experience': Mock()}
        
        # Should handle gracefully
        result = await extractor._extract_all_sections("Test CV")
        
        # Should return empty dict or handle gracefully
        self.assertIsInstance(result, dict)
    
    async def test_partial_extraction_success(self):
        """Test handling when only some sections extract successfully."""
        extractor = DataExtractor.__new__(DataExtractor)
        
        # Mock section extractor with partial success
        mock_section_extractor = Mock()
        async def mock_extract_partial(section_name, raw_text, llm_caller):
            if section_name == 'hero':
                return {'hero': {'fullName': 'Test'}}
            else:
                raise Exception(f"Failed {section_name}")
        
        mock_section_extractor.extract = mock_extract_partial
        extractor.section_extractor = mock_section_extractor
        
        mock_llm = Mock()
        mock_llm.call_llm = AsyncMock()
        extractor.llm_service = mock_llm
        
        extractor.SECTION_SCHEMAS = {
            'hero': Mock(),
            'experience': Mock(),
            'education': Mock()
        }
        
        result = await extractor._extract_all_sections("Test")
        
        # Should have successful section
        self.assertIn('hero', result)
        self.assertEqual(result['hero']['fullName'], 'Test')
        
        # Failed sections should not be in result
        self.assertNotIn('experience', result)
        self.assertNotIn('education', result)
    
    def test_calculate_extraction_confidence(self):
        """Test confidence calculation delegation."""
        with patch('src.core.cv_extraction.data_extractor.post_processor') as mock_post:
            mock_post.calculate_extraction_confidence.return_value = 0.82
            
            extractor = DataExtractor.__new__(DataExtractor)
            
            mock_cv = Mock()
            confidence = extractor.calculate_extraction_confidence(mock_cv, "raw text")
            
            # Should delegate to post processor
            mock_post.calculate_extraction_confidence.assert_called_once_with(mock_cv, "raw text")
            self.assertEqual(confidence, 0.82)


class TestDataExtractorSingleton(unittest.TestCase):
    """Test singleton instance creation."""
    
    @patch('src.core.cv_extraction.data_extractor.get_llm_service')
    @patch('src.core.cv_extraction.data_extractor.SectionExtractor')
    def test_module_singleton(self, mock_section_extractor, mock_get_llm):
        """Test that module exports singleton instance."""
        mock_llm = Mock()
        mock_llm.get_model_info.return_value = {'model': 'claude', 'deterministic': True}
        mock_get_llm.return_value = mock_llm
        
        from src.core.cv_extraction.data_extractor import data_extractor
        
        # Should be DataExtractor instance
        self.assertIsInstance(data_extractor, DataExtractor)


if __name__ == "__main__":
    unittest.main()