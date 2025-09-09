#!/usr/bin/env python3
"""
Unit Tests for ExtractionConfig
Tests configuration values and singleton pattern
"""

import unittest
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent.parent))

from src.core.cv_extraction.extraction_config import ExtractionConfig, extraction_config


class TestExtractionConfig(unittest.TestCase):
    """Test ExtractionConfig class and configuration values."""
    
    def test_singleton_pattern(self):
        """Test that ExtractionConfig follows singleton pattern."""
        config1 = ExtractionConfig()
        config2 = ExtractionConfig()
        self.assertIs(config1, config2, "ExtractionConfig should be a singleton")
        self.assertIs(config1, extraction_config, "Module should export singleton instance")
    
    def test_retry_configuration(self):
        """Test retry configuration values."""
        self.assertEqual(extraction_config.MAX_RETRIES, 3)
        self.assertEqual(extraction_config.RETRY_MULTIPLIER, 1)
        self.assertEqual(extraction_config.RETRY_MIN_WAIT, 4)
        self.assertEqual(extraction_config.RETRY_MAX_WAIT, 10)
        self.assertIsInstance(extraction_config.MAX_RETRIES, int)
        self.assertGreater(extraction_config.MAX_RETRIES, 0)
    
    def test_extraction_limits(self):
        """Test extraction limit configurations."""
        self.assertEqual(extraction_config.MAX_CAREER_HIGHLIGHTS, 5)
        self.assertEqual(extraction_config.MAX_LINES_FOR_NAME, 5)
        self.assertEqual(extraction_config.MAX_LINES_FOR_TITLE, 10)
        self.assertEqual(extraction_config.TOTAL_SECTIONS, 17)
        self.assertIsInstance(extraction_config.TOTAL_SECTIONS, int)
    
    def test_tech_patterns_structure(self):
        """Test tech patterns configuration structure."""
        self.assertIsInstance(extraction_config.TECH_PATTERNS, dict)
        self.assertIn('backend', extraction_config.TECH_PATTERNS)
        self.assertIn('frontend', extraction_config.TECH_PATTERNS)
        self.assertIn('cloud', extraction_config.TECH_PATTERNS)
        
        # Test that each category is a list
        for category, patterns in extraction_config.TECH_PATTERNS.items():
            self.assertIsInstance(patterns, list, f"{category} should be a list")
            self.assertGreater(len(patterns), 0, f"{category} should have patterns")
    
    def test_availability_patterns(self):
        """Test availability extraction patterns."""
        self.assertIsInstance(extraction_config.AVAILABILITY_PATTERNS, list)
        self.assertGreater(len(extraction_config.AVAILABILITY_PATTERNS), 0)
        
        # Test pattern matching
        test_text = "Available immediately for new opportunities"
        import re
        matched = False
        for pattern in extraction_config.AVAILABILITY_PATTERNS:
            if re.search(pattern, test_text, re.IGNORECASE):
                matched = True
                break
        self.assertTrue(matched, "Should match common availability phrases")
    
    def test_title_keywords(self):
        """Test professional title keywords."""
        self.assertIsInstance(extraction_config.TITLE_KEYWORDS, list)
        self.assertGreater(len(extraction_config.TITLE_KEYWORDS), 0)
        self.assertIn('engineer', extraction_config.TITLE_KEYWORDS)
        self.assertIn('developer', extraction_config.TITLE_KEYWORDS)
        self.assertIn('manager', extraction_config.TITLE_KEYWORDS)
    
    def test_name_pattern(self):
        """Test name extraction pattern."""
        self.assertIsInstance(extraction_config.NAME_PATTERN, str)
        
        # Test pattern matching
        import re
        pattern = re.compile(extraction_config.NAME_PATTERN)
        
        # Should match typical names
        self.assertIsNotNone(pattern.match("John Doe"))
        self.assertIsNotNone(pattern.match("Jane Smith-Jones"))
        self.assertIsNotNone(pattern.match("Dr. Robert Johnson"))
    
    def test_confidence_weights(self):
        """Test confidence calculation weights."""
        weights = extraction_config.CONFIDENCE_WEIGHTS
        self.assertIsInstance(weights, dict)
        
        # Check all required keys exist
        required_keys = ['hero', 'experience', 'education', 'skills', 'contact']
        for key in required_keys:
            self.assertIn(key, weights, f"Missing weight for {key}")
            self.assertIsInstance(weights[key], (int, float))
            self.assertGreaterEqual(weights[key], 0)
        
        # Test that weights sum to reasonable value
        total_weight = sum(weights.values())
        self.assertGreater(total_weight, 0, "Total weights should be positive")
    
    def test_known_institutions(self):
        """Test known institutions locations."""
        self.assertIsInstance(extraction_config.KNOWN_INSTITUTIONS, dict)
        
        # Test some known institutions
        if extraction_config.KNOWN_INSTITUTIONS:
            for institution, location in extraction_config.KNOWN_INSTITUTIONS.items():
                self.assertIsInstance(institution, str)
                self.assertIsInstance(location, str)
                self.assertGreater(len(institution), 0)
                self.assertGreater(len(location), 0)
    
    def test_immutability(self):
        """Test that configuration values are not accidentally modified."""
        original_retries = extraction_config.MAX_RETRIES
        
        # Try to modify (this should not affect the actual config)
        try:
            extraction_config.MAX_RETRIES = 999
        except:
            pass  # Some configs might be read-only
        
        # Create new instance and check value
        new_config = ExtractionConfig()
        self.assertEqual(new_config.MAX_RETRIES, original_retries)


if __name__ == "__main__":
    unittest.main()