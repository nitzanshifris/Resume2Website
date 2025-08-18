"""
Test the improved prompt templates from review2.md
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

import json
from src.core.cv_extraction.prompt_templates import (
    prompt_registry,
    BasePromptTemplate,
    SkillsPromptTemplate,
    LanguagesPromptTemplate,
    CertificationsPromptTemplate,
    ExperiencePromptTemplate,
    ContactPromptTemplate,
    EducationPromptTemplate,
    AchievementsPromptTemplate,
    ProjectsPromptTemplate,
    VolunteerPromptTemplate,
    CoursesPromptTemplate,
    TestimonialsPromptTemplate
)
from src.core.schemas.unified_nullable import (
    ContactSectionFooter,
    ExperienceSection,
    SkillsSection,
    LanguagesSection,
    CertificationsSection,
    EducationSection,
    AchievementsSection,
    ProjectsSection,
    VolunteerExperienceSection,
    CoursesSection
)


def test_base_template_has_preservation_rules():
    """Test that BasePromptTemplate includes language preservation rules"""
    template = BasePromptTemplate("test")
    prompt = template.generate("{}", "test text")
    
    # Check for language preservation instructions
    assert "Never translate or normalize text" in prompt
    assert "preserve original language and Unicode" in prompt
    assert "Preserve exact wording, capitalization, spelling" in prompt
    assert "If uncertain or ambiguous, leave the field null" in prompt
    print("✅ BasePromptTemplate has language preservation rules")


def test_contact_template_requests_demographics():
    """Test that ContactPromptTemplate requests demographic fields"""
    template = ContactPromptTemplate("contact")
    prompt = template.get_section_specific_instructions()
    
    # Check for demographic field requests
    assert "Place of birth" in prompt
    assert "Nationality" in prompt
    assert "Driving license" in prompt
    assert "Date of birth" in prompt
    assert "Marital status" in prompt
    assert "Visa status" in prompt
    assert "extract when present, leave null if not found" in prompt
    print("✅ ContactPromptTemplate requests demographic fields")


def test_experience_template_has_exclusions():
    """Test that ExperiencePromptTemplate has proper exclusions"""
    template = ExperiencePromptTemplate("experience")
    prompt = template.get_section_specific_instructions()
    
    # Check for exclusions
    assert "CRITICAL EXCLUSIONS" in prompt
    assert "Skills lists that belong in Skills section" in prompt
    assert "Language proficiencies" in prompt
    assert "Certifications" in prompt
    assert "externships" in prompt.lower()
    assert "job shadowing" in prompt.lower()
    assert "Preserve original date format" in prompt
    print("✅ ExperiencePromptTemplate has proper exclusions")


def test_skills_template_preserves_groups():
    """Test that SkillsPromptTemplate preserves group labels"""
    template = SkillsPromptTemplate("skills")
    prompt = template.get_section_specific_instructions()
    
    # Check for preservation rules
    assert "Only include skills explicitly present" in prompt
    assert "Do NOT derive synonyms" in prompt
    assert "Preserve group labels exactly as written" in prompt
    assert "categorize conservatively" in prompt
    print("✅ SkillsPromptTemplate preserves group labels")


def test_languages_template_preserves_proficiency():
    """Test that LanguagesPromptTemplate preserves proficiency verbatim"""
    template = LanguagesPromptTemplate("languages")
    prompt = template.get_section_specific_instructions()
    
    # Check for proficiency preservation
    assert "Preserve proficiency labels VERBATIM" in prompt
    assert "DO NOT convert between scales" in prompt
    assert "Keep exact wording" in prompt
    assert "DO NOT translate proficiency terms" in prompt
    print("✅ LanguagesPromptTemplate preserves proficiency labels")


def test_certifications_template_clarifies_exclusions():
    """Test that CertificationsPromptTemplate clarifies course exclusions"""
    template = CertificationsPromptTemplate("certifications")
    prompt = template.get_section_specific_instructions()
    
    # Check for course distinction
    assert "DISTINCTION FROM COURSES" in prompt
    assert "Certifications grant formal credentials" in prompt
    assert "Courses are learning experiences" in prompt
    assert "course completion certificate" in prompt
    print("✅ CertificationsPromptTemplate clarifies exclusions")


def test_achievements_template_preserves_metrics():
    """Test that AchievementsPromptTemplate preserves exact metrics"""
    template = AchievementsPromptTemplate("achievements")
    prompt = template.get_section_specific_instructions()
    
    # Check for metric preservation
    assert "Use exact metrics and units as written" in prompt
    assert "Do NOT rephrase" in prompt
    assert "Preserve original figures exactly" in prompt
    assert "reduced time by 3 hours" in prompt  # Example of exact preservation
    print("✅ AchievementsPromptTemplate preserves metrics")


def test_education_template_preserves_dates():
    """Test that EducationPromptTemplate preserves date formats"""
    template = EducationPromptTemplate("education")
    prompt = template.get_section_specific_instructions()
    
    # Check for date preservation
    assert "DATE PRESERVATION" in prompt
    assert "Preserve date formats exactly as written" in prompt
    assert "Do not normalize date strings" in prompt
    print("✅ EducationPromptTemplate preserves dates")


def test_new_templates_created():
    """Test that new templates were created for Projects, Volunteer, Courses, Testimonials"""
    
    # Test ProjectsPromptTemplate
    template = ProjectsPromptTemplate("projects")
    prompt = template.get_section_specific_instructions()
    assert "CRITICAL EXCLUSIONS" in prompt
    assert "Job responsibilities that belong in Experience" in prompt
    assert "METRICS & OUTCOMES" in prompt
    print("✅ ProjectsPromptTemplate created with exclusions")
    
    # Test VolunteerPromptTemplate
    template = VolunteerPromptTemplate("volunteer")
    prompt = template.get_section_specific_instructions()
    assert "volunteer work, community service" in prompt
    assert "Extra-curricular activities" in prompt
    assert "Captain of" in prompt
    print("✅ VolunteerPromptTemplate created for extra-curriculars")
    
    # Test CoursesPromptTemplate
    template = CoursesPromptTemplate("courses")
    prompt = template.get_section_specific_instructions()
    assert "training programs, and workshops" in prompt
    assert "Formal certifications (belong in Certifications" in prompt
    assert "learning experiences, not credentials" in prompt
    print("✅ CoursesPromptTemplate created with certification distinction")
    
    # Test TestimonialsPromptTemplate
    template = TestimonialsPromptTemplate("testimonials")
    prompt = template.get_section_specific_instructions()
    assert "testimonials, recommendations" in prompt
    assert "Extract quote text exactly as written" in prompt
    assert "Self-written summary statements" in prompt  # Exclusion
    print("✅ TestimonialsPromptTemplate created for recommendations")


def test_registry_uses_new_templates():
    """Test that the registry uses new templates instead of defaults"""
    
    # These should NOT be DefaultPromptTemplate anymore
    projects_template = prompt_registry.get_template("projects")
    assert isinstance(projects_template, ProjectsPromptTemplate)
    
    volunteer_template = prompt_registry.get_template("volunteer")
    assert isinstance(volunteer_template, VolunteerPromptTemplate)
    
    courses_template = prompt_registry.get_template("courses")
    assert isinstance(courses_template, CoursesPromptTemplate)
    
    testimonials_template = prompt_registry.get_template("testimonials")
    assert isinstance(testimonials_template, TestimonialsPromptTemplate)
    
    print("✅ Registry correctly uses new templates")


def run_all_tests():
    """Run all prompt template improvement tests"""
    print("\n" + "="*60)
    print("Testing Prompt Template Improvements from review2.md")
    print("="*60 + "\n")
    
    test_base_template_has_preservation_rules()
    test_contact_template_requests_demographics()
    test_experience_template_has_exclusions()
    test_skills_template_preserves_groups()
    test_languages_template_preserves_proficiency()
    test_certifications_template_clarifies_exclusions()
    test_achievements_template_preserves_metrics()
    test_education_template_preserves_dates()
    test_new_templates_created()
    test_registry_uses_new_templates()
    
    print("\n" + "="*60)
    print("✅ ALL PROMPT TEMPLATE IMPROVEMENTS VERIFIED!")
    print("="*60 + "\n")


if __name__ == "__main__":
    run_all_tests()