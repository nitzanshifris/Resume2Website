"""
Unit tests for Universal Component Adapter
"""

import pytest
from unittest.mock import patch
from services.portfolio.universal_adapter import (
    UniversalComponentAdapter, 
    UniversalContent, 
    LayoutType,
    UniversalConstants
)

class TestUniversalComponentAdapter:
    """Test suite for Universal Component Adapter"""
    
    @pytest.fixture
    def adapter(self):
        """Create adapter instance for testing"""
        return UniversalComponentAdapter()
    
    @pytest.fixture
    def sample_experience_data(self):
        """Sample experience data for testing"""
        return [
            {
                'jobTitle': 'Senior Developer',
                'companyName': 'Tech Corp',
                'dateRange': '2020-2023',
                'description': 'Led development team',
                'responsibilities': ['Code review', 'Mentoring']
            },
            {
                'position': 'Junior Developer',
                'organization': 'StartupXYZ',
                'duration': '2018-2020',
                'summary': 'Built web applications'
            }
        ]
    
    @pytest.fixture
    def sample_skills_data(self):
        """Sample skills data for testing"""
        return [
            {
                'categoryName': 'Frontend',
                'skills': ['React', 'Vue', 'Angular']
            },
            {
                'categoryName': 'Backend',
                'skills': ['Python', 'Node.js', 'Java']
            }
        ]
    
    @pytest.fixture
    def sample_contact_data(self):
        """Sample contact data for testing"""
        return [
            {
                'type': 'email',
                'value': 'john@example.com',
                'url': 'mailto:john@example.com'
            },
            {
                'type': 'linkedin',
                'value': 'LinkedIn Profile',
                'url': 'https://linkedin.com/in/john'
            }
        ]

    def test_smart_layout_logic(self, adapter):
        """Test the 3/4+ layout logic"""
        # 3 or fewer = ROW
        assert adapter._get_smart_layout(1) == LayoutType.ROW
        assert adapter._get_smart_layout(3) == LayoutType.ROW
        
        # 4-9 = GRID
        assert adapter._get_smart_layout(4) == LayoutType.GRID
        assert adapter._get_smart_layout(9) == LayoutType.GRID
        
        # 10+ = CAROUSEL
        assert adapter._get_smart_layout(10) == LayoutType.CAROUSEL
        assert adapter._get_smart_layout(15) == LayoutType.CAROUSEL
    
    def test_field_extraction_experience(self, adapter):
        """Test intelligent field extraction for experience"""
        item = {
            'jobTitle': 'Senior Developer',
            'companyName': 'Tech Corp',
            'dateRange': '2020-2023'
        }
        
        primary = adapter._extract_field(item, 'experience', 'primary')
        secondary = adapter._extract_field(item, 'experience', 'secondary')
        tertiary = adapter._extract_field(item, 'experience', 'tertiary')
        
        assert primary == 'Senior Developer'
        assert secondary == 'Tech Corp'
        assert tertiary == '2020-2023'
    
    def test_field_extraction_fallback(self, adapter):
        """Test fallback field extraction"""
        item = {
            'position': 'Developer',  # Alternative field name
            'employer': 'Company'     # Alternative field name
        }
        
        primary = adapter._extract_field(item, 'experience', 'primary')
        secondary = adapter._extract_field(item, 'experience', 'secondary')
        
        assert primary == 'Developer'
        assert secondary == 'Company'
    
    def test_skills_array_handling(self, adapter):
        """Test handling of skills arrays"""
        item = {
            'categoryName': 'Frontend',
            'skills': ['React', 'Vue', 'Angular']
        }
        
        secondary = adapter._extract_field(item, 'skills', 'secondary')
        assert secondary == 'React, Vue, Angular'
    
    def test_normalize_data(self, adapter, sample_experience_data):
        """Test data normalization"""
        normalized = adapter._normalize_data(sample_experience_data, 'experience')
        
        assert len(normalized) == 2
        assert isinstance(normalized[0], UniversalContent)
        assert normalized[0].primary == 'Senior Developer'
        assert normalized[0].secondary == 'Tech Corp'
        assert normalized[0].tertiary == '2020-2023'
        
        # Second item uses alternative field names
        assert normalized[1].primary == 'Junior Developer'
        assert normalized[1].secondary == 'StartupXYZ'
    
    def test_timeline_adaptation(self, adapter, sample_experience_data):
        """Test Timeline component adaptation"""
        result = adapter.adapt('timeline', sample_experience_data, 'experience')
        
        assert 'entries' in result
        assert len(result['entries']) == 2
        assert result['entries'][0]['title'] == 'Senior Developer'
        assert result['entries'][0]['subtitle'] == 'Tech Corp'
        assert result['entries'][0]['date'] == '2020-2023'
        assert 'bullets' in result['entries'][0]  # Should include responsibilities
    
    def test_bento_grid_adaptation(self, adapter, sample_skills_data):
        """Test BentoGrid component adaptation"""
        result = adapter.adapt('bento-grid', sample_skills_data, 'skills')
        
        # Should fall back to WobbleCard since < 3 items
        assert 'cards' in result  # WobbleCard format
        assert len(result['cards']) == 2
    
    def test_bento_grid_with_enough_items(self, adapter):
        """Test BentoGrid with minimum required items"""
        skills_data = [
            {'categoryName': 'Frontend', 'skills': ['React', 'Vue']},
            {'categoryName': 'Backend', 'skills': ['Python', 'Django']},
            {'categoryName': 'Database', 'skills': ['PostgreSQL', 'MongoDB']},
            {'categoryName': 'DevOps', 'skills': ['Docker', 'Kubernetes']}
        ]
        
        result = adapter.adapt('bento-grid', skills_data, 'skills')
        
        assert 'items' in result  # BentoGrid format
        assert len(result['items']) == 4
        assert result['items'][0]['title'] == 'Frontend'
        assert result['items'][0]['description'] == 'React, Vue'
    
    def test_card_hover_effect_adaptation(self, adapter):
        """Test CardHoverEffect component adaptation"""
        projects_data = [
            {
                'title': 'Project A',
                'description': 'Web application',
                'technologies': 'React • Node.js',
                'projectUrl': 'https://project-a.com'
            }
        ]
        
        result = adapter.adapt('card-hover-effect', projects_data, 'projects')
        
        assert 'cards' in result
        assert len(result['cards']) == 1
        assert result['cards'][0]['title'] == 'Project A'
        assert result['cards'][0]['description'] == 'Web application'
        assert result['cards'][0]['tags'] == ['React', 'Node.js']
        assert result['cards'][0]['link'] == 'https://project-a.com'
    
    def test_floating_dock_adaptation(self, adapter, sample_contact_data):
        """Test FloatingDock component adaptation"""
        result = adapter.adapt('floating-dock', sample_contact_data, 'contact')
        
        assert 'items' in result
        assert len(result['items']) == 2
        assert result['items'][0]['title'] == 'email'
        assert result['items'][0]['icon'] == 'IconMail'
        assert result['items'][0]['href'] == 'mailto:john@example.com'
    
    def test_text_content_adaptation(self, adapter):
        """Test text content adaptation"""
        text = "I am a passionate developer"
        
        result = adapter.adapt('text-generate-effect', text, 'summary')
        
        assert 'words' in result
        assert result['words'] == text
        assert 'className' in result
        assert 'duration' in result
    
    def test_animated_testimonials_adaptation(self, adapter):
        """Test AnimatedTestimonials adaptation"""
        achievements_data = [
            {
                'title': 'Employee of the Year',
                'description': 'Outstanding performance in 2023',
                'context': 'Tech Corp'
            }
        ]
        
        result = adapter.adapt('animated-testimonials', achievements_data, 'achievements')
        
        assert 'testimonials' in result
        assert len(result['testimonials']) == 1
        assert result['testimonials'][0]['quote'] == 'Outstanding performance in 2023'
        assert result['testimonials'][0]['name'] == 'Employee of the Year'
        assert result['testimonials'][0]['designation'] == 'Tech Corp'
    
    def test_carousel_wrapping(self, adapter):
        """Test automatic carousel wrapping for many items"""
        many_projects = [{'title': f'Project {i}'} for i in range(10)]
        
        result = adapter.adapt('card-hover-effect', many_projects, 'projects')
        
        # Should wrap in carousel due to many items
        assert result['type'] == 'carousel'
        assert result['component'] == 'card-hover-effect'
        assert 'slidesToShow' in result
    
    def test_gradient_generation_consistency(self, adapter):
        """Test that gradient generation is consistent"""
        # Same seed should produce same gradient
        gradient1 = adapter._generate_gradient_class('React', 0)
        gradient2 = adapter._generate_gradient_class('React', 0)
        
        assert gradient1 == gradient2
        
        # Different seeds should produce different gradients
        gradient3 = adapter._generate_gradient_class('Python', 0)
        assert gradient1 != gradient3
    
    def test_initials_generation(self, adapter):
        """Test initials generation"""
        assert adapter._generate_initials('John Doe') == 'JD'
        assert adapter._generate_initials('Alice') == 'AL'
        assert adapter._generate_initials('Mary Jane Watson') == 'MW'
    
    def test_icon_mapping(self, adapter):
        """Test contact icon mapping"""
        assert adapter._get_contact_icon('email') == 'IconMail'
        assert adapter._get_contact_icon('github') == 'IconBrandGithub'
        assert adapter._get_contact_icon('unknown') == 'IconUser'
    
    @patch('services.portfolio.universal_adapter.logger')
    def test_logging(self, mock_logger, adapter, sample_experience_data):
        """Test that logging works correctly"""
        adapter.adapt('timeline', sample_experience_data, 'experience')
        
        mock_logger.debug.assert_called_with(
            'Adapting timeline for experience with 2 items'
        )
    
    def test_constants_usage(self):
        """Test that constants are properly defined"""
        assert UniversalConstants.MIN_BENTO_ITEMS == 3
        assert UniversalConstants.CAROUSEL_THRESHOLD == 9
        assert 'IconMail' in UniversalConstants.ICON_MAPPING.values()
    
    def test_generic_adapter_fallback(self, adapter):
        """Test generic adapter for unknown components"""
        sample_data = [{'title': 'Test', 'description': 'Description'}]
        
        result = adapter.adapt('unknown-component', sample_data, 'test')
        
        assert 'items' in result
        assert result['component'] == 'unknown-component'
        assert result['layout'] == 'row'

if __name__ == '__main__':
    pytest.main([__file__])