#!/usr/bin/env python3
"""
Unit Tests for PromptTemplateRegistry
Tests template generation for all CV sections
"""

import unittest
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent.parent))

from src.core.cv_extraction.prompt_templates import (
    PromptTemplateRegistry, BasePromptTemplate,
    HeroTemplate, ContactTemplate, SummaryTemplate,
    ExperienceTemplate, EducationTemplate, SkillsTemplate,
    prompt_registry
)


class TestBasePromptTemplate(unittest.TestCase):
    """Test the base template class."""
    
    def test_base_template_abstract(self):
        """Test that BasePromptTemplate is abstract."""
        with self.assertRaises(TypeError):
            BasePromptTemplate()
    
    def test_template_format_method_exists(self):
        """Test that format method is defined."""
        self.assertTrue(hasattr(BasePromptTemplate, 'format'))


class TestPromptTemplateRegistry(unittest.TestCase):
    """Test the template registry functionality."""
    
    def test_singleton_pattern(self):
        """Test that registry follows singleton pattern."""
        reg1 = PromptTemplateRegistry()
        reg2 = PromptTemplateRegistry()
        self.assertIs(reg1, reg2)
        self.assertIs(reg1, prompt_registry)
    
    def test_all_sections_registered(self):
        """Test that all 17 sections have templates."""
        expected_sections = [
            'hero', 'contact', 'summary', 'experience', 'education',
            'skills', 'projects', 'achievements', 'certifications',
            'languages', 'volunteer', 'publications', 'speaking',
            'courses', 'memberships', 'hobbies', 'patents'
        ]
        
        for section in expected_sections:
            self.assertIn(section, prompt_registry.templates,
                         f"Missing template for {section}")
    
    def test_create_prompt_method(self):
        """Test prompt creation for various sections."""
        test_schema = {'test': 'schema'}
        test_text = "John Doe\nSoftware Engineer\nExperienced developer"
        
        # Test hero section
        prompt = prompt_registry.create_prompt('hero', test_schema, test_text)
        self.assertIsInstance(prompt, str)
        self.assertIn('John Doe', prompt)
        self.assertIn('hero', prompt.lower())
        
        # Test experience section
        prompt = prompt_registry.create_prompt('experience', test_schema, test_text)
        self.assertIn('experience', prompt.lower())
        self.assertIn('work history', prompt.lower())
    
    def test_unknown_section_handling(self):
        """Test handling of unknown sections."""
        with self.assertRaises(ValueError) as context:
            prompt_registry.create_prompt('unknown_section', {}, "test")
        self.assertIn('unknown_section', str(context.exception))


class TestIndividualTemplates(unittest.TestCase):
    """Test individual template classes."""
    
    def test_hero_template(self):
        """Test HeroTemplate formatting."""
        template = HeroTemplate()
        schema = {'fullName': 'string', 'professionalTitle': 'string'}
        text = "Jane Smith\nData Scientist"
        
        prompt = template.format(schema, text)
        self.assertIn('hero', prompt.lower())
        self.assertIn('name', prompt.lower())
        self.assertIn('professional', prompt.lower())
        self.assertIn(str(schema), prompt)
    
    def test_contact_template(self):
        """Test ContactTemplate formatting."""
        template = ContactTemplate()
        schema = {'email': 'string', 'phone': 'string'}
        text = "Email: john@example.com\nPhone: 555-1234"
        
        prompt = template.format(schema, text)
        self.assertIn('contact', prompt.lower())
        self.assertIn('email', prompt.lower())
        self.assertIn('phone', prompt.lower())
    
    def test_experience_template(self):
        """Test ExperienceTemplate formatting."""
        template = ExperienceTemplate()
        schema = {'experienceItems': 'array'}
        text = "Software Engineer at Tech Corp\n2020-2023"
        
        prompt = template.format(schema, text)
        self.assertIn('experience', prompt.lower())
        self.assertIn('work', prompt.lower())
        self.assertIn('employment', prompt.lower())
    
    def test_education_template(self):
        """Test EducationTemplate formatting."""
        template = EducationTemplate()
        schema = {'educationItems': 'array'}
        text = "MIT\nComputer Science\n2016-2020"
        
        prompt = template.format(schema, text)
        self.assertIn('education', prompt.lower())
        self.assertIn('degree', prompt.lower())
        self.assertIn('institution', prompt.lower())
    
    def test_skills_template(self):
        """Test SkillsTemplate formatting."""
        template = SkillsTemplate()
        schema = {'skillCategories': 'array'}
        text = "Python, JavaScript, React, Node.js"
        
        prompt = template.format(schema, text)
        self.assertIn('skills', prompt.lower())
        self.assertIn('technical', prompt.lower())
        self.assertIn('categorize', prompt.lower())
    
    def test_template_consistency(self):
        """Test that all templates follow consistent format."""
        test_schema = {'test': 'schema'}
        test_text = "Test content for extraction"
        
        for section_name, template_class in prompt_registry.templates.items():
            template = template_class()
            prompt = template.format(test_schema, test_text)
            
            # All prompts should include the schema
            self.assertIn(str(test_schema), prompt,
                         f"{section_name} template missing schema")
            
            # All prompts should include the text
            self.assertIn(test_text, prompt,
                         f"{section_name} template missing input text")
            
            # All prompts should mention JSON
            self.assertIn('JSON', prompt,
                         f"{section_name} template should mention JSON format")


class TestPromptQuality(unittest.TestCase):
    """Test the quality and structure of generated prompts."""
    
    def test_prompt_length(self):
        """Test that prompts are reasonable length."""
        schema = {'field': 'type'}
        text = "Sample CV text content"
        
        for section in prompt_registry.templates:
            prompt = prompt_registry.create_prompt(section, schema, text)
            
            # Prompts should be substantial but not too long
            self.assertGreater(len(prompt), 100,
                             f"{section} prompt too short")
            self.assertLess(len(prompt), 10000,
                           f"{section} prompt too long")
    
    def test_prompt_structure(self):
        """Test that prompts have proper structure."""
        schema = {'field': 'type'}
        text = "Sample CV text"
        
        critical_sections = ['hero', 'experience', 'education', 'skills']
        
        for section in critical_sections:
            prompt = prompt_registry.create_prompt(section, schema, text)
            
            # Should have clear instructions
            self.assertTrue(
                'extract' in prompt.lower() or 'parse' in prompt.lower(),
                f"{section} should have extraction instructions"
            )
            
            # Should specify output format
            self.assertIn('JSON', prompt,
                         f"{section} should specify JSON output")
    
    def test_schema_formatting(self):
        """Test that schema is properly formatted in prompts."""
        complex_schema = {
            'field1': 'string',
            'field2': {'type': 'array', 'items': 'string'},
            'field3': {'nested': {'field': 'value'}}
        }
        text = "Test text"
        
        prompt = prompt_registry.create_prompt('hero', complex_schema, text)
        
        # Schema should be included and formatted
        self.assertIn(str(complex_schema), prompt)


if __name__ == "__main__":
    unittest.main()