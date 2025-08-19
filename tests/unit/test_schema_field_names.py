"""
Regression tests for schema field names
Ensures we don't break field names that the API routes expect
"""
import unittest
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from src.core.schemas.unified_nullable import CVData


class TestSchemaFieldNames(unittest.TestCase):
    """Test that all expected field names exist in the schema."""
    
    def test_hero_field_names(self):
        """Test hero section has correct field names."""
        cv_data = CVData(
            hero={
                "fullName": "Test Name",
                "professionalTitle": "Test Title"
            }
        )
        
        # These are the field names that cv_enhanced.py expects
        self.assertIsNotNone(cv_data.hero)
        self.assertTrue(hasattr(cv_data.hero, 'fullName'))
        self.assertFalse(hasattr(cv_data.hero, 'name'))  # Should NOT have 'name'
        
        # Verify the actual value
        self.assertEqual(cv_data.hero.fullName, "Test Name")
    
    def test_experience_field_names(self):
        """Test experience section has correct field names."""
        cv_data = CVData(
            experience={
                "experienceItems": [
                    {"jobTitle": "Developer", "companyName": "Tech Corp"}
                ]
            }
        )
        
        # cv_enhanced.py expects 'experienceItems' not 'items'
        self.assertIsNotNone(cv_data.experience)
        self.assertTrue(hasattr(cv_data.experience, 'experienceItems'))
        self.assertFalse(hasattr(cv_data.experience, 'items'))
        
        # Verify structure
        self.assertEqual(len(cv_data.experience.experienceItems), 1)
        self.assertEqual(cv_data.experience.experienceItems[0].jobTitle, "Developer")
    
    def test_education_field_names(self):
        """Test education section has correct field names."""
        cv_data = CVData(
            education={
                "educationItems": [
                    {"degree": "BS Computer Science", "institution": "MIT"}
                ]
            }
        )
        
        # cv_enhanced.py expects 'educationItems' not 'items'
        self.assertIsNotNone(cv_data.education)
        self.assertTrue(hasattr(cv_data.education, 'educationItems'))
        self.assertFalse(hasattr(cv_data.education, 'items'))
        
        # Verify structure
        self.assertEqual(len(cv_data.education.educationItems), 1)
        self.assertEqual(cv_data.education.educationItems[0].degree, "BS Computer Science")
    
    def test_skills_field_names(self):
        """Test skills section has correct field names."""
        cv_data = CVData(
            skills={
                "skillCategories": [
                    {"categoryName": "Programming", "skills": ["Python", "JavaScript"]}
                ],
                "ungroupedSkills": ["Docker", "AWS"]
            }
        )
        
        # cv_enhanced.py expects 'skillCategories' and 'ungroupedSkills'
        self.assertIsNotNone(cv_data.skills)
        self.assertTrue(hasattr(cv_data.skills, 'skillCategories'))
        self.assertTrue(hasattr(cv_data.skills, 'ungroupedSkills'))
        
        # Verify structure
        self.assertEqual(len(cv_data.skills.skillCategories), 1)
        self.assertEqual(cv_data.skills.skillCategories[0].categoryName, "Programming")
        self.assertEqual(len(cv_data.skills.ungroupedSkills), 2)
    
    def test_contact_demographic_fields(self):
        """Test that contact section accepts demographic fields."""
        cv_data = CVData(
            contact={
                "email": "test@example.com",
                "phone": "555-1234",
                "placeOfBirth": "San Antonio",
                "nationality": "American",
                "drivingLicense": "Full"
            }
        )
        
        # Verify demographic fields are accepted
        self.assertIsNotNone(cv_data.contact)
        self.assertEqual(cv_data.contact.email, "test@example.com")
        self.assertEqual(cv_data.contact.placeOfBirth, "San Antonio")
        self.assertEqual(cv_data.contact.nationality, "American")
        self.assertEqual(cv_data.contact.drivingLicense, "Full")
    
    def test_achievements_structure(self):
        """Test achievements section structure."""
        cv_data = CVData(
            achievements={
                "achievements": [
                    {"value": "100", "label": "Projects completed"}
                ]
            }
        )
        
        # cv_enhanced.py expects 'achievements' array
        self.assertIsNotNone(cv_data.achievements)
        self.assertTrue(hasattr(cv_data.achievements, 'achievements'))
        self.assertEqual(len(cv_data.achievements.achievements), 1)
        self.assertEqual(cv_data.achievements.achievements[0].value, "100")
    
    def test_volunteer_with_activities(self):
        """Test volunteer section with extra-curricular activities."""
        cv_data = CVData(
            volunteer={
                "volunteerItems": [
                    {"role": "Tutor", "organization": "Local School"}
                ],
                "extracurricularActivities": [
                    {"activity": "Athletics Team"}
                ]
            }
        )
        
        # Verify both volunteer items and activities are accepted
        self.assertIsNotNone(cv_data.volunteer)
        self.assertTrue(hasattr(cv_data.volunteer, 'volunteerItems'))
        self.assertTrue(hasattr(cv_data.volunteer, 'extracurricularActivities'))
    
    def test_all_main_sections_exist(self):
        """Test that all main CV sections are available."""
        cv_data = CVData()
        
        # List of all expected sections
        expected_sections = [
            'hero', 'contact', 'summary', 'experience', 'education',
            'skills', 'projects', 'achievements', 'certifications',
            'languages', 'courses', 'volunteer', 'publications',
            'speaking', 'hobbies'
        ]
        
        for section in expected_sections:
            self.assertTrue(
                hasattr(cv_data, section),
                f"CVData should have '{section}' field"
            )


if __name__ == '__main__':
    unittest.main()