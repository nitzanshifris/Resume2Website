"""
Unified CV data schemas with all fields nullable for RESUME2WEBSITE.

This module defines comprehensive Pydantic models for representing CV/resume data
in a structured format where ALL fields are nullable (can be null in JSON).
"""
from typing import List, Optional, Dict, Union, Any, Literal
from pydantic import BaseModel, Field, HttpUrl, EmailStr, ConfigDict


# Base Schema with Pydantic v2 configuration
class BaseSchema(BaseModel):
    """Base schema with proper Pydantic v2 configuration."""
    model_config = ConfigDict(
        validate_assignment=True,
        use_enum_values=True,
        # Note: json_encoders is deprecated in v2, handled differently
        arbitrary_types_allowed=True
    )


# Smart Card Fields Mixin
class SmartCardFields(BaseModel):
    """Mixin for smart card display fields used across multiple sections."""
    videoUrl: Optional[str] = None
    githubUrl: Optional[str] = None
    imageUrl: Optional[str] = None
    linkUrl: Optional[str] = None
    hasLink: Optional[bool] = None
    linkType: Optional[Literal['website', 'video', 'github', 'image', 'pdf', 'tweet']] = None
    viewMode: Optional[Literal['text', 'timeline', 'video', 'github', 'images', 'tweet', 'uri']] = None
    textVariant: Optional[Literal['detailed', 'simple']] = None


# Base Schemas
class Location(BaseModel):
    """Represents a geographical location."""
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None

class ProfessionalLink(BaseModel):
    """Represents a professional social media or portfolio link."""
    platform: Optional[str] = None
    url: Optional[str] = None

class DateRange(BaseModel):
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    isCurrent: Optional[bool] = None

# ===== CORE SECTIONS =====
# These are the most common sections found in CVs

class ContactSectionFooter(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[Location] = None
    professionalLinks: Optional[List[ProfessionalLink]] = None
    availability: Optional[str] = None
    # Demographic fields
    placeOfBirth: Optional[str] = None
    nationality: Optional[str] = None
    drivingLicense: Optional[str] = None
    dateOfBirth: Optional[str] = None
    maritalStatus: Optional[str] = None
    visaStatus: Optional[str] = None

class EducationItem(SmartCardFields):
    degree: Optional[str] = None
    fieldOfStudy: Optional[str] = None
    institution: Optional[str] = None
    description: Optional[str] = None  # Humanized description combining all details
    location: Optional[Location] = None
    dateRange: Optional[DateRange] = None
    gpa: Optional[str] = None
    honors: Optional[List[str]] = None
    minors: Optional[List[str]] = None
    relevantCoursework: Optional[List[str]] = None
    exchangePrograms: Optional[List[str]] = None
    # Smart card fields inherited from SmartCardFields mixin

class EducationSection(BaseModel):
    sectionTitle: Optional[str] = None
    educationItems: Optional[List[EducationItem]] = None

class ExperienceItem(SmartCardFields):
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
    # Smart card fields inherited from SmartCardFields mixin

class ExperienceSection(BaseModel):
    sectionTitle: Optional[str] = None
    experienceItems: Optional[List[ExperienceItem]] = None

class HeroSection(BaseModel):
    fullName: Optional[str] = None
    professionalTitle: Optional[str] = None
    profilePhotoUrl: Optional[str] = None

class AchievementItem(SmartCardFields):
    """Represents a quantifiable achievement or accomplishment."""
    value: Optional[str] = None
    label: Optional[str] = None
    contextOrDetail: Optional[str] = None
    timeframe: Optional[str] = None
    # Smart card fields inherited from SmartCardFields mixin

class AchievementsSection(BaseModel):
    sectionTitle: Optional[str] = None
    achievements: Optional[List[AchievementItem]] = None

class LanguageItem(BaseModel):
    """Represents language proficiency information."""
    language: Optional[str] = None
    proficiency: Optional[str] = None
    certification: Optional[str] = None

class LanguagesSection(BaseModel):
    sectionTitle: Optional[str] = None
    languageItems: Optional[List[LanguageItem]] = None

class CertificationItem(SmartCardFields):
    title: Optional[str] = None
    description: Optional[str] = None  # Humanized description combining all details
    issuingOrganization: Optional[str] = None
    issueDate: Optional[str] = None
    expirationDate: Optional[str] = None
    credentialId: Optional[str] = None
    verificationUrl: Optional[str] = None
    # Smart card fields inherited from SmartCardFields mixin

class CertificationsSection(BaseModel):
    sectionTitle: Optional[str] = None
    certificationItems: Optional[List[CertificationItem]] = None

class ProfessionalSummaryOverview(BaseModel):
    summaryText: Optional[str] = None
    yearsOfExperience: Optional[int] = None
    keySpecializations: Optional[List[str]] = None
    careerHighlights: Optional[List[str]] = None

class ProjectItem(SmartCardFields):
    title: Optional[str] = None
    role: Optional[str] = None
    duration: Optional[str] = None
    dateRange: Optional[DateRange] = None
    description: Optional[str] = None
    keyFeatures: Optional[List[str]] = None
    technologiesUsed: Optional[List[str]] = None
    projectUrl: Optional[str] = None
    projectMetrics: Optional[Dict[str, str]] = None
    # Smart card fields inherited from SmartCardFields mixin
    # Note: imageUrl is already defined in SmartCardFields

class ProjectsSection(BaseModel):
    sectionTitle: Optional[str] = None
    projectItems: Optional[List[ProjectItem]] = None

class SkillCategory(BaseModel):
    categoryName: Optional[str] = None
    skills: Optional[List[str]] = None
    description: Optional[str] = None  # Humanized description of skills in this category

class SkillsSection(BaseModel):
    sectionTitle: Optional[str] = None
    description: Optional[str] = None  # Overall skills summary description
    skillCategories: Optional[List[SkillCategory]] = None
    ungroupedSkills: Optional[List[str]] = None
    proficiencyIndicators: Optional[Dict[str, str]] = None

class VolunteerExperienceItem(SmartCardFields):
    role: Optional[str] = None
    organization: Optional[str] = None
    location: Optional[Location] = None
    dateRange: Optional[DateRange] = None
    description: Optional[str] = None
    responsibilities: Optional[List[str]] = None
    impactMetrics: Optional[Dict[str, str]] = None
    commitment: Optional[str] = None
    # For simpler format
    period: Optional[str] = None  # Alternative to dateRange
    # Smart card fields inherited from SmartCardFields mixin

class VolunteerExperienceSection(BaseModel):
    sectionTitle: Optional[str] = None
    volunteerItems: Optional[List[VolunteerExperienceItem]] = None
    extracurricularActivities: Optional[List[Dict[str, Any]]] = None  # For activities from demographic extractor

# ===== COMMON ADDITIONAL SECTIONS =====
# Frequently found but not universal

class CourseItem(SmartCardFields):
    title: Optional[str] = None
    institution: Optional[str] = None  # Changed from issuingOrganization
    year: Optional[str] = None  # Simplified date field
    dateRange: Optional[DateRange] = None
    certificateNumber: Optional[str] = None
    certificateUrl: Optional[str] = None
    description: Optional[str] = None
    # Smart card fields inherited from SmartCardFields mixin

class CoursesSection(BaseModel):
    sectionTitle: Optional[str] = None
    courseItems: Optional[List[CourseItem]] = None

# ===== SPECIALIZED SECTIONS =====
# Less common, typically for specific professions

class PublicationItem(SmartCardFields):
    title: Optional[str] = None
    description: Optional[str] = None  # Humanized description combining all details
    authors: Optional[List[str]] = None
    publicationType: Optional[str] = None
    journalName: Optional[str] = None
    conferenceName: Optional[str] = None
    publicationDate: Optional[str] = None
    doi: Optional[str] = None
    publicationUrl: Optional[str] = None
    abstract: Optional[str] = None
    # Smart card fields inherited from SmartCardFields mixin

class PublicationsResearchSection(BaseModel):
    sectionTitle: Optional[str] = None
    publications: Optional[List[PublicationItem]] = None

class SpeakingEngagementItem(SmartCardFields):
    title: Optional[str] = None  # Topic or presentation title
    description: Optional[str] = None  # Humanized description combining all details
    eventName: Optional[str] = None
    topic: Optional[str] = None
    date: Optional[str] = None
    venue: Optional[str] = None
    role: Optional[str] = None
    eventUrl: Optional[str] = None
    presentationUrl: Optional[str] = None
    audienceSize: Optional[int] = None
    # Smart card fields inherited from SmartCardFields mixin
    # Note: videoUrl can be recording of the talk

class SpeakingEngagementsSection(BaseModel):
    sectionTitle: Optional[str] = None
    speakingEngagements: Optional[List[SpeakingEngagementItem]] = None


class HobbyItem(SmartCardFields):
    """Individual hobby item with smart card support."""
    title: Optional[str] = None
    description: Optional[str] = None
    # Smart card fields inherited from SmartCardFields mixin
    # Note: textVariant defaults to 'simple' for hobbies

class HobbiesSection(BaseModel):
    sectionTitle: Optional[str] = None
    hobbies: Optional[List[str]] = None  # Simple string list (legacy)
    hobbyItems: Optional[List[HobbyItem]] = None  # Smart card items

# ===== MAIN CV SCHEMA =====
class CVData(BaseSchema):
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
    volunteer: Optional[Union[VolunteerExperienceSection, List[VolunteerExperienceItem]]] = None
    
    # Specialized sections (less common)
    publications: Optional[PublicationsResearchSection] = None
    speaking: Optional[SpeakingEngagementsSection] = None
    hobbies: Optional[HobbiesSection] = None
    
    # Catch-all for unstructured content
    unclassified_text: Optional[str] = None
    
    def model_dump_nullable(self, exclude_none: bool = False) -> Dict[str, Any]:
        """
        Custom serialization that ensures all fields are nullable in JSON.
        Empty strings become null, empty lists remain empty lists.
        """
        data = self.model_dump(exclude_none=exclude_none)
        return self._make_nullable(data)
    
    def _make_nullable(self, obj: Any) -> Any:
        """Recursively convert empty strings to None throughout the data structure."""
        if isinstance(obj, dict):
            return {k: self._make_nullable(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [self._make_nullable(item) for item in obj]
        elif isinstance(obj, str) and obj == "":
            return None
        else:
            return obj