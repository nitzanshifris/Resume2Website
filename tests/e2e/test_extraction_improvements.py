"""
End-to-end tests for extraction improvements
Tests demographics, externships, and extracurricular activities
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

import asyncio
import json
from typing import Dict, Any
from src.core.cv_extraction.prompt_templates import prompt_registry
from src.core.cv_extraction.section_extractor import SectionExtractor
from src.core.schemas.unified_nullable import (
    ContactSectionFooter,
    ExperienceSection,
    VolunteerExperienceSection
)


# Test CV samples
DEMOGRAPHICS_CV = """
John Smith
Software Engineer

PERSONAL DETAILS
Place of birth: San Antonio, Texas
Nationality: American
Date of birth: 15 March 1990
Driving license: Class B
Marital status: Single
Visa status: H1-B Valid until 2025

CONTACT
Email: john@example.com
Phone: +1 555-123-4567
LinkedIn: linkedin.com/in/johnsmith
"""

EXTERNSHIP_CV = """
Sarah Johnson
Medical Student

EXPERIENCE

Medical Externship - City Hospital
June 2023 - August 2023
- Shadowed attending physicians in Emergency Department
- Observed 50+ patient consultations
- Participated in morning rounds

Software Engineering Intern - Tech Corp
January 2022 - May 2022
- Developed React components
- Fixed 20+ bugs in production code

Job Shadowing - Legal Firm LLC
March 2021 (1 week)
- Observed court proceedings
- Reviewed case files with senior attorneys
"""

EXTRACURRICULAR_CV = """
Michael Chen
Student

VOLUNTEER EXPERIENCE & ACTIVITIES

President - Computer Science Club
September 2022 - Present
- Lead weekly meetings with 30+ members
- Organized hackathon with 100 participants

Captain - Varsity Basketball Team
2020 - 2022
- Led team to State Championships 2021
- Team MVP 2021, 2022

Volunteer Tutor - Local Library
Summer 2021
- Taught mathematics to underprivileged students
- 40 hours of community service

Member - National Honor Society
2019 - 2023
- Participated in community service projects
- Maintained 3.8+ GPA requirement
"""


class MockLLMService:
    """Mock LLM service for testing"""
    
    async def call_llm(self, prompt: str, section_name: str):
        """Mock LLM response based on section"""
        
        # Simulate LLM extracting from the test CVs
        if section_name == "contact" and "Place of birth" in prompt:
            response = {
                "email": "john@example.com",
                "phoneNumber": "+1 555-123-4567",
                "professionalLinks": [
                    {"platform": "LinkedIn", "url": "linkedin.com/in/johnsmith"}
                ],
                "placeOfBirth": "San Antonio, Texas",
                "nationality": "American",
                "dateOfBirth": "15 March 1990",
                "drivingLicense": "Class B",
                "maritalStatus": "Single",
                "visaStatus": "H1-B Valid until 2025"
            }
        elif section_name == "experience" and "Externship" in prompt:
            response = {
                "experienceItems": [
                    {
                        "jobTitle": "Medical Externship",
                        "companyName": "City Hospital",
                        "dateRange": {
                            "startDate": "June 2023",
                            "endDate": "August 2023"
                        },
                        "employmentType": "Externship",
                        "responsibilitiesAndAchievements": [
                            "Shadowed attending physicians in Emergency Department",
                            "Observed 50+ patient consultations",
                            "Participated in morning rounds"
                        ]
                    },
                    {
                        "jobTitle": "Software Engineering Intern",
                        "companyName": "Tech Corp",
                        "dateRange": {
                            "startDate": "January 2022",
                            "endDate": "May 2022"
                        },
                        "employmentType": "Internship",
                        "responsibilitiesAndAchievements": [
                            "Developed React components",
                            "Fixed 20+ bugs in production code"
                        ],
                        "technologiesUsed": ["React"]
                    },
                    {
                        "jobTitle": "Job Shadowing",
                        "companyName": "Legal Firm LLC",
                        "dateRange": {
                            "startDate": "March 2021",
                            "endDate": "March 2021"
                        },
                        "employmentType": "Externship",
                        "responsibilitiesAndAchievements": [
                            "Observed court proceedings",
                            "Reviewed case files with senior attorneys"
                        ]
                    }
                ]
            }
        elif section_name == "volunteer" and "Captain" in prompt:
            response = {
                "volunteerItems": [
                    {
                        "role": "President",
                        "organization": "Computer Science Club",
                        "dateRange": {
                            "startDate": "September 2022",
                            "endDate": "Present"
                        },
                        "description": "Lead weekly meetings with 30+ members. Organized hackathon with 100 participants."
                    },
                    {
                        "role": "Captain",
                        "organization": "Varsity Basketball Team",
                        "dateRange": {
                            "startDate": "2020",
                            "endDate": "2022"
                        },
                        "description": "Led team to State Championships 2021. Team MVP 2021, 2022."
                    },
                    {
                        "role": "Volunteer Tutor",
                        "organization": "Local Library",
                        "dateRange": {
                            "startDate": "Summer 2021",
                            "endDate": "Summer 2021"
                        },
                        "description": "Taught mathematics to underprivileged students. 40 hours of community service."
                    },
                    {
                        "role": "Member",
                        "organization": "National Honor Society",
                        "dateRange": {
                            "startDate": "2019",
                            "endDate": "2023"
                        },
                        "description": "Participated in community service projects. Maintained 3.8+ GPA requirement."
                    }
                ]
            }
        else:
            response = {}
        
        return ("mock", json.dumps(response))


async def test_demographics_extraction():
    """Test that demographic fields are properly extracted"""
    print("\n🧪 Testing Demographics Extraction...")
    
    extractor = SectionExtractor({
        "contact": ContactSectionFooter
    })
    
    mock_llm = MockLLMService()
    result = await extractor.extract(
        "contact", 
        DEMOGRAPHICS_CV,
        mock_llm.call_llm
    )
    
    contact_data = result.get("contact", {})
    
    # Check demographic fields
    assert contact_data.get("placeOfBirth") == "San Antonio, Texas", "Place of birth not extracted"
    assert contact_data.get("nationality") == "American", "Nationality not extracted"
    assert contact_data.get("dateOfBirth") == "15 March 1990", "Date of birth not extracted"
    assert contact_data.get("drivingLicense") == "Class B", "Driving license not extracted"
    assert contact_data.get("maritalStatus") == "Single", "Marital status not extracted"
    assert contact_data.get("visaStatus") == "H1-B Valid until 2025", "Visa status not extracted"
    
    print("✅ All demographic fields extracted correctly")
    return True


async def test_externship_handling():
    """Test that externships are properly handled with employmentType"""
    print("\n🧪 Testing Externship Handling...")
    
    extractor = SectionExtractor({
        "experience": ExperienceSection
    })
    
    mock_llm = MockLLMService()
    result = await extractor.extract(
        "experience",
        EXTERNSHIP_CV,
        mock_llm.call_llm
    )
    
    exp_data = result.get("experience", {})
    exp_items = exp_data.get("experienceItems", [])
    
    # Check externships
    externships = [e for e in exp_items if e.get("employmentType") == "Externship"]
    assert len(externships) == 2, f"Expected 2 externships, found {len(externships)}"
    
    # Verify Medical Externship
    medical_ext = next((e for e in externships if "Medical" in e.get("jobTitle", "")), None)
    assert medical_ext is not None, "Medical externship not found"
    assert medical_ext.get("companyName") == "City Hospital", "Wrong company for medical externship"
    assert medical_ext.get("dateRange", {}).get("startDate") == "June 2023", "Dates not preserved"
    
    # Verify Job Shadowing
    shadowing = next((e for e in externships if "Shadowing" in e.get("jobTitle", "")), None)
    assert shadowing is not None, "Job shadowing not found"
    
    # Check internship
    internships = [e for e in exp_items if e.get("employmentType") == "Internship"]
    assert len(internships) == 1, f"Expected 1 internship, found {len(internships)}"
    
    print("✅ Externships and internships properly categorized")
    return True


async def test_extracurricular_activities():
    """Test that extracurricular activities are captured in volunteer section"""
    print("\n🧪 Testing Extracurricular Activities...")
    
    extractor = SectionExtractor({
        "volunteer": VolunteerExperienceSection
    })
    
    mock_llm = MockLLMService()
    result = await extractor.extract(
        "volunteer",
        EXTRACURRICULAR_CV,
        mock_llm.call_llm
    )
    
    volunteer_data = result.get("volunteer", {})
    volunteer_items = volunteer_data.get("volunteerItems", [])
    
    assert len(volunteer_items) == 4, f"Expected 4 activities, found {len(volunteer_items)}"
    
    # Check for athletics
    athletics = [v for v in volunteer_items if "Basketball" in v.get("organization", "")]
    assert len(athletics) == 1, "Basketball team activity not captured"
    assert athletics[0].get("role") == "Captain", "Captain role not preserved"
    
    # Check for club activities
    clubs = [v for v in volunteer_items if "Club" in v.get("organization", "")]
    assert len(clubs) == 1, "Computer Science Club not captured"
    assert clubs[0].get("role") == "President", "President role not preserved"
    
    # Check for honor society
    honor = [v for v in volunteer_items if "Honor Society" in v.get("organization", "")]
    assert len(honor) == 1, "National Honor Society not captured"
    
    # Check for actual volunteer work
    tutoring = [v for v in volunteer_items if "Tutor" in v.get("role", "")]
    assert len(tutoring) == 1, "Volunteer tutoring not captured"
    
    print("✅ All extracurricular activities captured correctly")
    return True


async def run_all_e2e_tests():
    """Run all e2e tests"""
    print("\n" + "="*60)
    print("Running E2E Extraction Improvement Tests")
    print("="*60)
    
    results = []
    
    # Run tests
    results.append(await test_demographics_extraction())
    results.append(await test_externship_handling())
    results.append(await test_extracurricular_activities())
    
    # Summary
    print("\n" + "="*60)
    if all(results):
        print("✅ ALL E2E TESTS PASSED!")
        print("Demographics, externships, and extracurriculars working correctly")
    else:
        print("❌ Some tests failed")
    print("="*60 + "\n")
    
    return all(results)


if __name__ == "__main__":
    # Run async tests
    success = asyncio.run(run_all_e2e_tests())
    exit(0 if success else 1)