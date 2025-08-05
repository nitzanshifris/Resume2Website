"""
Test Template Data Transformer
Tests the CV data to portfolio template transformation
"""
import asyncio
import json
from pathlib import Path
import pytest

from services.portfolio.template_data_transformer import template_transformer
from services.llm.data_extractor import data_extractor
from services.local.text_extractor import text_extractor


def test_hero_transformation():
    """Test hero section transformation with flip words extraction"""
    cv_data = {
        "hero": {
            "fullName": "Michelle Lopez",
            "professionalTitle": "Senior Fashion Designer & Creative Director",
            "summaryTagline": "Creating beautiful designs"
        }
    }
    
    result = template_transformer.transform_cv_to_template(cv_data)
    
    assert result["hero"]["name"] == "Michelle Lopez"
    assert result["hero"]["subTitle"] == "Senior Fashion"
    assert "Designer" in result["hero"]["flipWords"]
    assert "Director" in result["hero"]["flipWords"]


def test_experience_transformation():
    """Test experience section transformation"""
    cv_data = {
        "experience": {
            "sectionTitle": "Work Experience",
            "experienceItems": [
                {
                    "jobTitle": "Senior Designer",
                    "companyName": "Fashion House",
                    "location": {
                        "city": "Milan",
                        "state": None,
                        "country": "Italy"
                    },
                    "dateRange": {
                        "startDate": "2020-01-01",
                        "endDate": "2023-12-31",
                        "isCurrent": False
                    },
                    "responsibilitiesAndAchievements": [
                        "Led design team of 5 designers",
                        "Increased sales by 40% with new collection"
                    ]
                }
            ]
        }
    }
    
    result = template_transformer.transform_cv_to_template(cv_data)
    
    assert result["experience"]["title"] == "Work Experience"
    assert len(result["experience"]["items"]) == 1
    
    item = result["experience"]["items"][0]
    assert item["title"] == "Senior Designer"
    assert item["company"] == "Fashion House"
    assert "Milan" in item["location"]
    assert "2020" in item["location"]
    assert "2023" in item["location"]
    assert "Led design team" in item["details"]


def test_skills_transformation():
    """Test skills section transformation with icon mapping"""
    cv_data = {
        "skills": {
            "sectionTitle": "Technical Skills",
            "skillCategories": [
                {
                    "categoryName": "Programming Languages",
                    "skills": ["Python", "JavaScript", "TypeScript"]
                },
                {
                    "categoryName": "Design Tools",
                    "skills": ["Figma", "Adobe XD", "Sketch"]
                }
            ]
        }
    }
    
    result = template_transformer.transform_cv_to_template(cv_data)
    
    assert result["skills"]["title"] == "Technical Skills"
    assert len(result["skills"]["items"]) == 2
    
    # Check programming category
    prog_item = result["skills"]["items"][0]
    assert prog_item["title"] == "Programming Languages"
    assert prog_item["icon"] == "DraftingCompass"
    assert "Python" in prog_item["description"]
    
    # Check design category
    design_item = result["skills"]["items"][1]
    assert design_item["title"] == "Design Tools"
    assert design_item["icon"] == "Palette"
    assert "Figma" in design_item["description"]


def test_education_transformation():
    """Test education section transformation"""
    cv_data = {
        "education": {
            "sectionTitle": "Education",
            "educationItems": [
                {
                    "degree": "Master of Fine Arts",
                    "fieldOfStudy": "Fashion Design",
                    "institution": "Parsons School of Design",
                    "dateRange": {
                        "startDate": "2018",
                        "endDate": "2020"
                    },
                    "gpa": "3.9/4.0",
                    "relevantCoursework": [
                        "Advanced Pattern Making",
                        "Dissertation: Sustainable Fashion in the Digital Age"
                    ]
                }
            ]
        }
    }
    
    result = template_transformer.transform_cv_to_template(cv_data)
    
    assert result["education"]["title"] == "Education"
    assert len(result["education"]["items"]) == 1
    
    item = result["education"]["items"][0]
    assert item["title"] == "Parsons School of Design"
    assert item["degree"] == "Master of Fine Arts"
    assert "2018 - 2020" in item["years"]
    assert "Dissertation" in item["description"]
    assert "GPA: 3.9/4.0" in item["description"]


def test_publications_transformation():
    """Test publications section transformation"""
    cv_data = {
        "publications": {
            "sectionTitle": "Publications",
            "publications": [
                {
                    "title": "The Future of Sustainable Fashion",
                    "journalName": "Fashion Quarterly",
                    "publicationDate": "2023-05-15",
                    "publicationUrl": "https://example.com/article"
                }
            ]
        }
    }
    
    result = template_transformer.transform_cv_to_template(cv_data)
    
    assert result["publications"]["title"] == "Publications"
    assert len(result["publications"]["items"]) == 1
    
    item = result["publications"]["items"][0]
    assert item["title"] == "The Future of Sustainable Fashion"
    assert item["outlet"] == "Fashion Quarterly"
    assert item["date"] == "2023"
    assert item["link"] == "https://example.com/article"


def test_contact_transformation():
    """Test contact section transformation"""
    cv_data = {
        "contact": {
            "email": "michelle@example.com",
            "phone": "+1-555-0123",
            "availability": "Open to new opportunities"
        },
        "hero": {
            "fullName": "Michelle Lopez"
        }
    }
    
    result = template_transformer.transform_cv_to_template(cv_data)
    
    assert result["contact"]["title"] == "Let's Connect"
    assert result["contact"]["subtitle"] == "Open to new opportunities"
    assert result["contact"]["email"] == "michelle@example.com"
    assert result["contact"]["phone"] == "+1-555-0123"
    assert "Michelle Lopez" in result["contact"]["copyright"]


def test_missing_sections_handling():
    """Test handling of missing sections"""
    cv_data = {
        "hero": {
            "fullName": "Test User"
        }
    }
    
    result = template_transformer.transform_cv_to_template(cv_data)
    
    # Should have hero and contact at minimum
    assert "hero" in result
    assert "contact" in result
    
    # Other sections should not be present
    assert "experience" not in result
    assert "education" not in result
    assert "skills" not in result


@pytest.mark.asyncio
async def test_full_pipeline_with_real_cv():
    """Test the full pipeline with a real CV file"""
    # Check if test CV exists
    test_cv_path = Path(__file__).parent.parent / "data" / "cv_examples" / "pdf_examples" / "simple_pdf" / "Guy Sagee - CV 425.2 .pdf"
    
    if not test_cv_path.exists():
        pytest.skip("Test CV file not found")
    
    # Extract text
    text = text_extractor.extract_text(str(test_cv_path))
    assert text
    
    # Extract CV data
    cv_data = await data_extractor.extract_cv_data(text)
    cv_data_dict = cv_data.model_dump()
    
    # Transform to template format
    template_data = template_transformer.transform_cv_to_template(cv_data_dict)
    
    # Verify basic structure
    assert "hero" in template_data
    assert "name" in template_data["hero"]
    assert "flipWords" in template_data["hero"]
    
    # Save output for inspection
    output_path = Path(__file__).parent / "test_output" / "transformed_data.json"
    output_path.parent.mkdir(exist_ok=True)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(template_data, f, indent=2, ensure_ascii=False)
    
    print(f"Transformed data saved to: {output_path}")


def test_portfolio_page_generation():
    """Test portfolio page generation"""
    cv_data = {
        "hero": {
            "fullName": "Test User",
            "professionalTitle": "Software Developer"
        },
        "contact": {
            "email": "test@example.com",
            "phone": "555-0123"
        }
    }
    
    # Transform data
    template_data = template_transformer.transform_cv_to_template(cv_data)
    
    # Test that we can generate page content
    try:
        content = template_transformer.generate_portfolio_page(cv_data)
        assert content
        assert "Test User" in content
        assert "const initialData" in content
    except FileNotFoundError:
        pytest.skip("Template file not found - this is expected in test environment")


if __name__ == "__main__":
    # Run basic tests
    test_hero_transformation()
    test_experience_transformation()
    test_skills_transformation()
    test_education_transformation()
    test_publications_transformation()
    test_contact_transformation()
    test_missing_sections_handling()
    
    # Run async test
    asyncio.run(test_full_pipeline_with_real_cv())
    
    print("All tests completed!")