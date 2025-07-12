"""
Unified CV data schemas for CV2WEB.

This module defines comprehensive Pydantic models for representing CV/resume data
in a structured format that can be used across the application.
"""
from typing import List, Optional, Dict
from pydantic import BaseModel, Field, HttpUrl, EmailStr


# Base Schemas
class Location(BaseModel):
    """Represents a geographical location."""
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None

class ProfessionalLink(BaseModel):
    """Represents a professional social media or portfolio link."""
    platform: str = Field(..., min_length=1, description="Platform name (e.g., LinkedIn, GitHub)")
    url: HttpUrl = Field(..., description="Full URL to the profile")

class DateRange(BaseModel):
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    isCurrent: Optional[bool] = False

# ===== CORE SECTIONS =====
# These are the most common sections found in CVs

class ContactSectionFooter(BaseModel):
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    location: Optional[Location] = None
    professionalLinks: Optional[List[ProfessionalLink]] = None
    availability: Optional[str] = None

class EducationItem(BaseModel):
    degree: Optional[str] = None
    fieldOfStudy: Optional[str] = None
    institution: Optional[str] = None
    location: Optional[Location] = None
    dateRange: Optional[DateRange] = None
    gpa: Optional[str] = None
    honors: Optional[List[str]] = None
    minors: Optional[List[str]] = None
    relevantCoursework: Optional[List[str]] = None
    exchangePrograms: Optional[List[str]] = None

class EducationSection(BaseModel):
    sectionTitle: str = "Education"
    educationItems: Optional[List[EducationItem]] = None

class ExperienceItem(BaseModel):
    jobTitle: Optional[str] = None
    companyName: Optional[str] = None
    location: Optional[Location] = None
    dateRange: Optional[DateRange] = None
    remoteWork: Optional[str] = None
    responsibilitiesAndAchievements: Optional[List[str]] = None
    technologiesUsed: Optional[List[str]] = None
    summary: Optional[str] = None
    employmentType: Optional[str] = None
    teamSize: Optional[int] = None
    reportingTo: Optional[str] = None

class ExperienceSection(BaseModel):
    sectionTitle: str = "Experience"
    experienceItems: Optional[List[ExperienceItem]] = None

class HeroSection(BaseModel):
    fullName: Optional[str] = None
    professionalTitle: Optional[str] = None
    summaryTagline: Optional[str] = None
    profilePhotoUrl: Optional[HttpUrl] = None

class AchievementItem(BaseModel):
    """Represents a quantifiable achievement or accomplishment."""
    value: str = Field(..., min_length=1, description="Quantified value (e.g., '40%', '$2M+', 'Best Employee Award')")
    label: str = Field(..., min_length=1, description="Description of the achievement")
    contextOrDetail: Optional[str] = Field(None, description="Additional context or details")
    timeframe: Optional[str] = Field(None, description="Time period (e.g., 'in 6 months', 'Q1 2024')")

class AchievementsSection(BaseModel):
    sectionTitle: str = "Key Achievements"
    achievements: Optional[List[AchievementItem]] = None

class LanguageItem(BaseModel):
    """Represents language proficiency information."""
    language: str = Field(..., min_length=1, description="Language name (e.g., 'English', 'Hebrew', 'Spanish')")
    proficiency: str = Field(..., min_length=1, description="Proficiency level (e.g., 'Native', 'Fluent', '4/5', '80%', 'B2')")
    certification: Optional[str] = Field(None, description="Language certification (e.g., 'TOEFL 110', 'IELTS 8.0')")

class LanguagesSection(BaseModel):
    sectionTitle: str = "Languages"
    languageItems: Optional[List[LanguageItem]] = None

class CertificationItem(BaseModel):
    title: Optional[str] = None
    issuingOrganization: Optional[str] = None
    issueDate: Optional[str] = None
    expirationDate: Optional[str] = None
    credentialId: Optional[str] = None
    verificationUrl: Optional[HttpUrl] = None

class CertificationsSection(BaseModel):
    sectionTitle: str = "Certifications"
    certificationItems: Optional[List[CertificationItem]] = None

class ProfessionalSummaryOverview(BaseModel):
    summaryText: Optional[str] = None
    yearsOfExperience: Optional[int] = None
    keySpecializations: Optional[List[str]] = None
    careerHighlights: Optional[List[str]] = None

class ProjectItem(BaseModel):
    title: Optional[str] = None
    role: Optional[str] = None
    duration: Optional[str] = None  # e.g., "3 months", "Summer 2023"
    dateRange: Optional[DateRange] = None  # alternative to duration
    description: Optional[str] = None
    keyFeatures: Optional[List[str]] = None
    technologiesUsed: Optional[List[str]] = None
    projectUrl: Optional[HttpUrl] = None
    imageUrl: Optional[HttpUrl] = None
    projectMetrics: Optional[Dict[str, str]] = None

class ProjectsSection(BaseModel):
    sectionTitle: str = "Projects"
    projectItems: Optional[List[ProjectItem]] = None

class SkillCategory(BaseModel):
    categoryName: str
    skills: List[str]

class SkillsSection(BaseModel):
    sectionTitle: str = "Skills"
    skillCategories: Optional[List[SkillCategory]] = None
    ungroupedSkills: Optional[List[str]] = None
    proficiencyIndicators: Optional[Dict[str, str]] = None

class VolunteerExperienceItem(BaseModel):
    role: Optional[str] = None
    organization: Optional[str] = None
    location: Optional[Location] = None
    dateRange: Optional[DateRange] = None
    description: Optional[str] = None
    responsibilities: Optional[List[str]] = None
    impactMetrics: Optional[Dict[str, str]] = None
    commitment: Optional[str] = None

class VolunteerExperienceSection(BaseModel):
    sectionTitle: str = "Volunteer Experience"
    volunteerItems: Optional[List[VolunteerExperienceItem]] = None

# ===== COMMON ADDITIONAL SECTIONS =====
# Frequently found but not universal

class CourseItem(BaseModel):
    title: Optional[str] = None
    issuingOrganization: Optional[str] = None
    dateRange: Optional[DateRange] = None
    certificateNumber: Optional[str] = None
    certificateUrl: Optional[HttpUrl] = None
    description: Optional[str] = None

class CoursesSection(BaseModel):
    sectionTitle: str = "Courses & Training"
    courseItems: Optional[List[CourseItem]] = None

# ===== SPECIALIZED SECTIONS =====
# Less common, typically for specific professions

class PublicationItem(BaseModel):
    title: Optional[str] = None
    authors: Optional[List[str]] = None
    publicationType: Optional[str] = None  # "Journal", "Conference", "Book Chapter"
    journalName: Optional[str] = None  # For journal papers
    conferenceName: Optional[str] = None  # For conference papers
    publicationDate: Optional[str] = None
    doi: Optional[str] = None  # "10.1038/nature12373"
    publicationUrl: Optional[HttpUrl] = None  # Full link to paper
    abstract: Optional[str] = None

class PublicationsResearchSection(BaseModel):
    sectionTitle: str = "Publications & Research"
    publications: Optional[List[PublicationItem]] = None

class SpeakingEngagementItem(BaseModel):
    eventName: Optional[str] = None
    topic: Optional[str] = None
    date: Optional[str] = None
    venue: Optional[str] = None
    role: Optional[str] = None  # "Keynote Speaker", "Panelist", "Workshop Leader"
    eventUrl: Optional[HttpUrl] = None
    presentationUrl: Optional[HttpUrl] = None
    audienceSize: Optional[int] = None

class SpeakingEngagementsSection(BaseModel):
    sectionTitle: str = "Speaking Engagements"
    speakingEngagements: Optional[List[SpeakingEngagementItem]] = None

class PatentItem(BaseModel):
    title: Optional[str] = None
    patentNumber: Optional[str] = None
    applicationNumber: Optional[str] = None
    status: Optional[str] = None  # "Granted", "Pending", "Published", "Expired"
    filingDate: Optional[str] = None
    grantDate: Optional[str] = None
    inventors: Optional[List[str]] = None
    issuingAuthority: Optional[str] = None  # "USPTO", "EPO", "IL Patent Office"
    patentUrl: Optional[HttpUrl] = None
    description: Optional[str] = None

class PatentsSection(BaseModel):
    sectionTitle: str = "Patents"
    patents: Optional[List[PatentItem]] = None

class ProfessionalMembership(BaseModel):
    organization: Optional[str] = None
    role: Optional[str] = None
    membershipType: Optional[str] = None  # "Full Member", "Associate", "Fellow"
    membershipId: Optional[str] = None
    dateRange: Optional[DateRange] = None
    description: Optional[str] = None

class ProfessionalMembershipsSection(BaseModel):
    sectionTitle: str = "Professional Memberships"
    memberships: Optional[List[ProfessionalMembership]] = None

class HobbiesSection(BaseModel):
    sectionTitle: str = "Hobbies & Interests"
    hobbies: Optional[List[str]] = None

# ===== MAIN CV SCHEMA =====
class CVData(BaseModel):
    # Core sections (most common)
    hero: Optional[HeroSection] = None
    contact: Optional[ContactSectionFooter] = None
    summary: Optional[ProfessionalSummaryOverview] = None
    experience: Optional[ExperienceSection] = None
    education: Optional[EducationSection] = None
    skills: Optional[SkillsSection] = None
    
    # Common additional sections
    projects: Optional[ProjectsSection] = None
    achievements: Optional[AchievementsSection] = None
    certifications: Optional[CertificationsSection] = None
    languages: Optional[LanguagesSection] = None
    courses: Optional[CoursesSection] = None
    volunteer: Optional[VolunteerExperienceSection] = None
    
    # Specialized sections (less common)
    publications: Optional[PublicationsResearchSection] = None
    speaking: Optional[SpeakingEngagementsSection] = None
    patents: Optional[PatentsSection] = None
    memberships: Optional[ProfessionalMembershipsSection] = None
    hobbies: Optional[HobbiesSection] = None
    
    # Catch-all for unstructured content
    unclassified_text: Optional[List[str]] = Field(None, description="A catch-all for text that could not be categorized into other sections.")
    
    class Config:
        """Pydantic configuration."""
        json_encoders = {
            HttpUrl: str  # Convert HttpUrl to string for JSON serialization
        }
        validate_assignment = True  # Validate on assignment
        use_enum_values = True
