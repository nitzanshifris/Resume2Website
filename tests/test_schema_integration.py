#!/usr/bin/env python3
"""
Integration tests to verify schema works with component selector
"""
import pytest
from backend.schemas.unified import (
    CVData, HeroSection, ExperienceSection, ExperienceItem,
    EducationSection, EducationItem, SkillsSection, SkillCategory, 
    ProjectsSection, ProjectItem, CertificationsSection, CertificationItem, 
    PublicationsResearchSection, PublicationItem, SpeakingEngagementsSection, 
    SpeakingEngagementItem, PatentsSection, PatentItem, 
    ProfessionalMembershipsSection, ProfessionalMembership, DateRange
)
from services.portfolio.component_selector import component_selector


class TestSchemaIntegration:
    """Test schema integration with component selector"""
    
    def test_component_selector_with_updated_schema(self):
        """Test component selector works with all renamed fields"""
        # Create CV with all updated sections
        cv = CVData(
            hero=HeroSection(
                fullName="Test User",
                professionalTitle="Senior Developer"
            ),
            experience=ExperienceSection(
                experienceItems=[
                    ExperienceItem(
                        jobTitle="Developer",
                        companyName="Tech Co",
                        responsibilitiesAndAchievements=["Built APIs", "Led team"]
                    )
                ]
            ),
            skills=SkillsSection(
                skillCategories=[
                    SkillCategory(
                        categoryName="Languages",
                        skills=["Python", "JavaScript", "Go"]
                    )
                ]
            ),
            projects=ProjectsSection(
                projectItems=[
                    ProjectItem(
                        title="API Platform",  # Correct field name
                        description="RESTful API platform",
                        technologiesUsed=["Python", "FastAPI"]
                    )
                ]
            ),
            certifications=CertificationsSection(  # Correct class name
                certificationItems=[
                    CertificationItem(
                        title="AWS Certified",  # Correct field name
                        issuingOrganization="Amazon"
                    )
                ]
            ),
            publications=PublicationsResearchSection(
                publications=[  # Correct field name
                    PublicationItem(
                        title="Research Paper",
                        publicationType="Journal",
                        journalName="AI Journal"
                    )
                ]
            ),
            speaking=SpeakingEngagementsSection(
                speakingEngagements=[  # Correct field name
                    SpeakingEngagementItem(
                        eventName="PyCon 2024",
                        topic="Python Performance"
                    )
                ]
            ),
            patents=PatentsSection(
                patents=[  # Correct field name
                    PatentItem(
                        title="Algorithm Patent",
                        status="Granted"
                    )
                ]
            ),
            memberships=ProfessionalMembershipsSection(
                memberships=[  # Correct field name
                    ProfessionalMembership(
                        organization="ACM",
                        membershipType="Professional"
                    )
                ]
            )
        )
        
        # Test component selection
        selections = component_selector.select_components(cv)
        
        # Verify selections were made
        assert len(selections) > 0
        
        # Verify sections are found
        section_names = [s.section for s in selections]
        assert "hero" in section_names
        assert "experience" in section_names
        assert "skills" in section_names
        
        # Print selections for debugging
        print(f"\nSelected {len(selections)} components:")
        for sel in selections:
            print(f"  - {sel.section}: {sel.component_type}")
    
    def test_field_access_in_component_selector(self):
        """Test that component selector can access renamed fields correctly"""
        # Create publications section with new field names
        cv = CVData(
            hero=HeroSection(fullName="Researcher"),
            publications=PublicationsResearchSection(
                publications=[  # Using correct field name
                    PublicationItem(
                        title="ML Paper",
                        publicationType="Conference",
                        authors=["John Doe", "Jane Smith"]
                    ),
                    PublicationItem(
                        title="AI Research",
                        publicationType="Journal",
                        journalName="Nature AI"
                    )
                ]
            )
        )
        
        # Run selection
        selections = component_selector.select_components(cv)
        
        # Verify it doesn't crash and returns selections
        assert selections is not None
        assert len(selections) >= 1
        
        # Verify publications are accessible
        assert hasattr(cv.publications, 'publications')
        assert len(cv.publications.publications) == 2
        assert cv.publications.publications[0].publicationType == "Conference"
    
    def test_empty_sections_with_correct_fields(self):
        """Test empty sections with correct field initialization"""
        # Create sections with empty lists
        cv = CVData(
            hero=HeroSection(fullName="Empty Test"),
            certifications=CertificationsSection(certificationItems=[]),
            publications=PublicationsResearchSection(publications=[]),
            speaking=SpeakingEngagementsSection(speakingEngagements=[]),
            patents=PatentsSection(patents=[]),
            memberships=ProfessionalMembershipsSection(memberships=[])
        )
        
        # Test selection - empty sections should be skipped
        selections = component_selector.select_components(cv)
        
        # Should only select hero
        assert len(selections) == 1
        assert selections[0].section == "hero"
    
    def test_smart_selector_with_updated_schema(self):
        """Test smart component selector with renamed fields"""
        # Create a rich CV that triggers smart selection
        cv = CVData(
            hero=HeroSection(fullName="Rich CV Test"),
            experience=ExperienceSection(experienceItems=[
                ExperienceItem(jobTitle=f"Role {i}", companyName=f"Company {i}")
                for i in range(5)
            ]),
            education=EducationSection(educationItems=[]),
            skills=SkillsSection(skillCategories=[
                SkillCategory(categoryName=f"Cat {i}", skills=[f"Skill {j}" for j in range(5)])
                for i in range(4)
            ]),
            projects=ProjectsSection(projectItems=[
                ProjectItem(title=f"Project {i}", description="Description")
                for i in range(3)
            ]),
            certifications=CertificationsSection(certificationItems=[
                CertificationItem(title=f"Cert {i}", issuingOrganization="Org")
                for i in range(2)
            ]),
            publications=PublicationsResearchSection(publications=[
                PublicationItem(title="Paper", publicationType="Journal")
            ]),
            speaking=SpeakingEngagementsSection(speakingEngagements=[
                SpeakingEngagementItem(eventName="Event", topic="Topic")
            ])
        )
        
        # This should trigger smart selection (7+ sections)
        selections = component_selector.select_components(cv)
        
        assert len(selections) > 0
        print(f"\nSmart selection made {len(selections)} component choices")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])