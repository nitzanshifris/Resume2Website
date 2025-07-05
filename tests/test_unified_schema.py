#!/usr/bin/env python3
"""
Comprehensive tests for the unified CV schema
Tests all sections, field names, and data validation
"""
import pytest
from typing import List, Optional
from datetime import datetime

from backend.schemas.unified import (
    # Base schemas
    Location, ProfessionalLink, DateRange,
    
    # Core sections
    CVData, HeroSection, ContactSectionFooter, 
    ProfessionalSummaryOverview, ExperienceSection, ExperienceItem,
    EducationSection, EducationItem, SkillsSection, SkillCategory,
    
    # Common sections
    ProjectsSection, ProjectItem, AchievementsSection, AchievementItem,
    CertificationsSection, CertificationItem, LanguagesSection, LanguageItem,
    CoursesSection, CourseItem, VolunteerExperienceSection, VolunteerExperienceItem,
    
    # Specialized sections
    PublicationsResearchSection, PublicationItem,
    SpeakingEngagementsSection, SpeakingEngagementItem,
    PatentsSection, PatentItem,
    ProfessionalMembershipsSection, ProfessionalMembership,
    HobbiesSection
)


class TestBaseSchemas:
    """Test base schema classes"""
    
    def test_location_creation(self):
        """Test Location model creation"""
        location = Location(
            city="Tel Aviv",
            state="Central",
            country="Israel"
        )
        assert location.city == "Tel Aviv"
        assert location.state == "Central"
        assert location.country == "Israel"
        
        # Test optional fields
        location_minimal = Location()
        assert location_minimal.city is None
        assert location_minimal.state is None
        assert location_minimal.country is None
    
    def test_professional_link_creation(self):
        """Test ProfessionalLink model creation"""
        link = ProfessionalLink(
            platform="LinkedIn",
            url="https://linkedin.com/in/johndoe"
        )
        assert link.platform == "LinkedIn"
        assert str(link.url) == "https://linkedin.com/in/johndoe"
    
    def test_date_range_creation(self):
        """Test DateRange model creation"""
        date_range = DateRange(
            startDate="2022-01",
            endDate="2024-01",
            isCurrent=False
        )
        assert date_range.startDate == "2022-01"
        assert date_range.endDate == "2024-01"
        assert date_range.isCurrent is False
        
        # Test current position
        current_range = DateRange(
            startDate="2024-01",
            isCurrent=True
        )
        assert current_range.endDate is None
        assert current_range.isCurrent is True


class TestCoreSchemas:
    """Test core CV sections"""
    
    def test_hero_section(self):
        """Test HeroSection model"""
        hero = HeroSection(
            fullName="John Doe",
            professionalTitle="Senior Software Engineer",
            summaryTagline="Building scalable solutions",
            profilePhotoUrl="https://example.com/photo.jpg"
        )
        assert hero.fullName == "John Doe"
        assert hero.professionalTitle == "Senior Software Engineer"
        assert hero.summaryTagline == "Building scalable solutions"
        assert str(hero.profilePhotoUrl) == "https://example.com/photo.jpg"
    
    def test_contact_section(self):
        """Test ContactSectionFooter model"""
        contact = ContactSectionFooter(
            email="john@example.com",
            phone="+1-234-567-8900",
            location=Location(city="New York", country="USA"),
            professionalLinks=[
                ProfessionalLink(platform="GitHub", url="https://github.com/johndoe"),
                ProfessionalLink(platform="LinkedIn", url="https://linkedin.com/in/johndoe")
            ],
            availability="Available for remote work"
        )
        assert contact.email == "john@example.com"
        assert contact.phone == "+1-234-567-8900"
        assert contact.location.city == "New York"
        assert len(contact.professionalLinks) == 2
        assert contact.professionalLinks[0].platform == "GitHub"
    
    def test_experience_section(self):
        """Test ExperienceSection with items"""
        experience = ExperienceSection(
            experienceItems=[
                ExperienceItem(
                    jobTitle="Senior Developer",
                    companyName="Tech Corp",
                    location=Location(city="San Francisco"),
                    dateRange=DateRange(startDate="2022-01", isCurrent=True),
                    responsibilitiesAndAchievements=[
                        "Led team of 5 developers",
                        "Improved performance by 40%"
                    ],
                    technologiesUsed=["Python", "React", "AWS"],
                    summary="Leading development of cloud-native applications"
                )
            ]
        )
        assert len(experience.experienceItems) == 1
        assert experience.experienceItems[0].jobTitle == "Senior Developer"
        assert len(experience.experienceItems[0].technologiesUsed) == 3
    
    def test_education_section(self):
        """Test EducationSection with items"""
        education = EducationSection(
            educationItems=[
                EducationItem(
                    degree="B.Sc.",
                    fieldOfStudy="Computer Science",
                    institution="MIT",
                    location=Location(city="Cambridge", state="MA"),
                    dateRange=DateRange(startDate="2018", endDate="2022"),
                    gpa="3.8/4.0",
                    honors=["Dean's List", "Cum Laude"],
                    relevantCoursework=["Data Structures", "Algorithms", "Machine Learning"]
                )
            ]
        )
        assert len(education.educationItems) == 1
        assert education.educationItems[0].degree == "B.Sc."
        assert education.educationItems[0].gpa == "3.8/4.0"
        assert len(education.educationItems[0].honors) == 2
    
    def test_skills_section(self):
        """Test SkillsSection with categories"""
        skills = SkillsSection(
            skillCategories=[
                SkillCategory(
                    categoryName="Programming Languages",
                    skills=["Python", "JavaScript", "TypeScript", "Go"]
                ),
                SkillCategory(
                    categoryName="Frameworks",
                    skills=["React", "Django", "FastAPI", "Next.js"]
                )
            ],
            ungroupedSkills=["Docker", "Kubernetes", "Git"]
        )
        assert len(skills.skillCategories) == 2
        assert skills.skillCategories[0].categoryName == "Programming Languages"
        assert len(skills.skillCategories[0].skills) == 4
        assert len(skills.ungroupedSkills) == 3


class TestCommonSections:
    """Test common additional sections"""
    
    def test_projects_section(self):
        """Test ProjectsSection with correct field names"""
        projects = ProjectsSection(
            projectItems=[
                ProjectItem(
                    title="E-commerce Platform",  # Note: 'title' not 'name'
                    role="Lead Developer",
                    dateRange=DateRange(startDate="2023-01", endDate="2023-06"),
                    description="Built scalable e-commerce platform",
                    keyFeatures=["Real-time inventory", "Payment integration"],
                    technologiesUsed=["Python", "React", "PostgreSQL"],
                    projectUrl="https://github.com/johndoe/ecommerce"
                )
            ]
        )
        assert len(projects.projectItems) == 1
        assert projects.projectItems[0].title == "E-commerce Platform"
        assert projects.projectItems[0].role == "Lead Developer"
    
    def test_achievements_section(self):
        """Test AchievementsSection"""
        achievements = AchievementsSection(
            achievements=[
                AchievementItem(
                    value="40%",
                    label="Reduced deployment time",
                    contextOrDetail="Implemented CI/CD pipeline",
                    timeframe="in 3 months"
                ),
                AchievementItem(
                    value="$500K",
                    label="Cost savings achieved",
                    contextOrDetail="Through infrastructure optimization"
                )
            ]
        )
        assert len(achievements.achievements) == 2
        assert achievements.achievements[0].value == "40%"
        assert achievements.achievements[0].timeframe == "in 3 months"
    
    def test_certifications_section(self):
        """Test renamed CertificationsSection (not LicensesAndCertificationsSection)"""
        certifications = CertificationsSection(
            certificationItems=[
                CertificationItem(
                    title="AWS Solutions Architect",  # Note: 'title' not 'name'
                    issuingOrganization="Amazon Web Services",
                    issueDate="2023-01",
                    expirationDate="2026-01",
                    credentialId="AWS-123456",
                    verificationUrl="https://aws.amazon.com/verify/123456"
                )
            ]
        )
        assert len(certifications.certificationItems) == 1
        assert certifications.certificationItems[0].title == "AWS Solutions Architect"
    
    def test_languages_section(self):
        """Test LanguagesSection"""
        languages = LanguagesSection(
            languageItems=[
                LanguageItem(
                    language="English",
                    proficiency="Native",
                    certification="TOEFL 115/120"
                ),
                LanguageItem(
                    language="Spanish",
                    proficiency="Fluent"
                )
            ]
        )
        assert len(languages.languageItems) == 2
        assert languages.languageItems[0].language == "English"
        assert languages.languageItems[0].certification == "TOEFL 115/120"


class TestSpecializedSections:
    """Test specialized/less common sections"""
    
    def test_publications_section(self):
        """Test PublicationsResearchSection with correct field name"""
        publications = PublicationsResearchSection(
            publications=[  # Note: 'publications' not 'publicationItems'
                PublicationItem(
                    title="Machine Learning in Production",
                    authors=["John Doe", "Jane Smith"],
                    publicationType="Journal",  # New field
                    journalName="Journal of AI Research",
                    publicationDate="2023-06",
                    doi="10.1234/jair.2023.001",
                    publicationUrl="https://jair.org/papers/001",
                    abstract="This paper presents..."
                )
            ]
        )
        assert len(publications.publications) == 1
        assert publications.publications[0].title == "Machine Learning in Production"
        assert publications.publications[0].publicationType == "Journal"
    
    def test_speaking_engagements_section(self):
        """Test SpeakingEngagementsSection with correct field name"""
        speaking = SpeakingEngagementsSection(
            speakingEngagements=[  # Note: 'speakingEngagements' not 'speakingItems'
                SpeakingEngagementItem(
                    eventName="PyCon 2023",
                    topic="Scaling Python Applications",
                    date="2023-04-15",
                    venue="Salt Lake City, UT",
                    role="Keynote Speaker",
                    audienceSize=500
                )
            ]
        )
        assert len(speaking.speakingEngagements) == 1
        assert speaking.speakingEngagements[0].eventName == "PyCon 2023"
    
    def test_patents_section(self):
        """Test PatentsSection with correct field name"""
        patents = PatentsSection(
            patents=[  # Note: 'patents' not 'patentItems'
                PatentItem(
                    title="Method for Optimizing Database Queries",
                    patentNumber="US10123456B2",
                    status="Granted",
                    filingDate="2021-06-01",
                    grantDate="2023-03-15",
                    inventors=["John Doe", "Jane Smith"],
                    issuingAuthority="USPTO",
                    description="A novel method for..."
                )
            ]
        )
        assert len(patents.patents) == 1
        assert patents.patents[0].title == "Method for Optimizing Database Queries"
    
    def test_memberships_section(self):
        """Test ProfessionalMembershipsSection with correct field name"""
        memberships = ProfessionalMembershipsSection(
            memberships=[  # Note: 'memberships' not 'membershipItems'
                ProfessionalMembership(
                    organization="Association for Computing Machinery",
                    role="Senior Member",
                    membershipType="Professional",
                    membershipId="ACM-12345",
                    dateRange=DateRange(startDate="2020-01", isCurrent=True),
                    description="Active participant in SIG groups"
                )
            ]
        )
        assert len(memberships.memberships) == 1
        assert memberships.memberships[0].organization == "Association for Computing Machinery"


class TestCVDataIntegration:
    """Test full CVData model integration"""
    
    def test_empty_cv_data(self):
        """Test creating empty CV data"""
        cv = CVData()
        assert cv.hero is None
        assert cv.contact is None
        assert cv.experience is None
        assert cv.education is None
        assert cv.skills is None
    
    def test_full_cv_data(self):
        """Test creating CV with all sections"""
        cv = CVData(
            hero=HeroSection(
                fullName="John Doe",
                professionalTitle="Senior Software Engineer"
            ),
            contact=ContactSectionFooter(
                email="john@example.com",
                phone="+1-234-567-8900"
            ),
            summary=ProfessionalSummaryOverview(
                summaryText="Experienced software engineer with 10+ years...",
                yearsOfExperience=10,
                keySpecializations=["Cloud Architecture", "Machine Learning"]
            ),
            experience=ExperienceSection(
                experienceItems=[
                    ExperienceItem(
                        jobTitle="Senior Developer",
                        companyName="Tech Corp"
                    )
                ]
            ),
            education=EducationSection(
                educationItems=[
                    EducationItem(
                        degree="B.Sc.",
                        institution="MIT"
                    )
                ]
            ),
            skills=SkillsSection(
                skillCategories=[
                    SkillCategory(
                        categoryName="Languages",
                        skills=["Python", "JavaScript"]
                    )
                ]
            ),
            projects=ProjectsSection(
                projectItems=[
                    ProjectItem(
                        title="Open Source Project",
                        description="Contributing to community"
                    )
                ]
            ),
            certifications=CertificationsSection(
                certificationItems=[
                    CertificationItem(
                        title="AWS Certified",
                        issuingOrganization="Amazon"
                    )
                ]
            ),
            publications=PublicationsResearchSection(
                publications=[
                    PublicationItem(
                        title="Research Paper",
                        publicationType="Conference"
                    )
                ]
            ),
            speaking=SpeakingEngagementsSection(
                speakingEngagements=[
                    SpeakingEngagementItem(
                        eventName="Tech Conference",
                        topic="Cloud Computing"
                    )
                ]
            ),
            patents=PatentsSection(
                patents=[
                    PatentItem(
                        title="Innovation",
                        status="Pending"
                    )
                ]
            ),
            memberships=ProfessionalMembershipsSection(
                memberships=[
                    ProfessionalMembership(
                        organization="IEEE",
                        membershipType="Professional"
                    )
                ]
            )
        )
        
        # Verify all sections are present
        assert cv.hero is not None
        assert cv.contact is not None
        assert cv.summary is not None
        assert cv.experience is not None
        assert cv.education is not None
        assert cv.skills is not None
        assert cv.projects is not None
        assert cv.certifications is not None
        assert cv.publications is not None
        assert cv.speaking is not None
        assert cv.patents is not None
        assert cv.memberships is not None
    
    def test_cv_serialization(self):
        """Test CV data can be serialized to dict/JSON"""
        cv = CVData(
            hero=HeroSection(fullName="Test User"),
            skills=SkillsSection(
                skillCategories=[
                    SkillCategory(categoryName="Tech", skills=["Python"])
                ]
            )
        )
        
        # Test dict serialization
        cv_dict = cv.model_dump(exclude_none=True)
        assert "hero" in cv_dict
        assert cv_dict["hero"]["fullName"] == "Test User"
        
        # Test JSON serialization
        cv_json = cv.model_dump_json(exclude_none=True)
        assert isinstance(cv_json, str)
        assert "Test User" in cv_json


class TestFieldValidation:
    """Test field validation and constraints"""
    
    def test_email_validation(self):
        """Test email field validation"""
        # Valid email
        contact = ContactSectionFooter(email="valid@example.com")
        assert contact.email == "valid@example.com"
        
        # Invalid email should raise validation error
        with pytest.raises(ValueError):
            ContactSectionFooter(email="invalid-email")
    
    def test_url_validation(self):
        """Test URL field validation"""
        # Valid URL
        link = ProfessionalLink(
            platform="Website",
            url="https://example.com"
        )
        assert str(link.url) == "https://example.com/"
        
        # Invalid URL should raise validation error
        with pytest.raises(ValueError):
            ProfessionalLink(
                platform="Website",
                url="not-a-url"
            )
    
    def test_optional_fields(self):
        """Test that optional fields can be None"""
        exp = ExperienceItem(jobTitle="Developer")
        assert exp.companyName is None
        assert exp.location is None
        assert exp.dateRange is None
        assert exp.responsibilitiesAndAchievements is None


if __name__ == "__main__":
    pytest.main([__file__, "-v"])