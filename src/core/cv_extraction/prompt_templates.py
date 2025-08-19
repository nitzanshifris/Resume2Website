"""
Prompt Template Registry for CV Data Extraction
Eliminates the massive if-elif chain in _create_section_prompt
"""
from abc import ABC, abstractmethod
from typing import Type, Optional, Dict, Any
from pydantic import BaseModel
import json

from .extraction_config import extraction_config


class PromptTemplate(ABC):
    """Base class for all prompt templates."""
    
    @abstractmethod
    def generate(self, schema_json: str, raw_text: str) -> str:
        """Generate the complete prompt for this section."""
        pass


class BasePromptTemplate(PromptTemplate):
    """Base template with common prompt structure."""
    
    def __init__(self, section_name: str):
        self.section_name = section_name
    
    def generate(self, schema_json: str, raw_text: str) -> str:
        """Generate the base prompt with section-specific instructions."""
        base_prompt = f"""You are a world-class CV parsing expert using Claude 4 Opus for maximum determinism. Extract information for the "{self.section_name}" section ONLY.

CRITICAL DETERMINISTIC REQUIREMENTS:
- Extract ONLY what is explicitly stated in the CV text
- Do NOT infer, guess, or hallucinate any information
- Use exact text from the CV when possible
- If uncertain about any field, leave it as null rather than guessing
- Be completely consistent in naming and formatting
- Do NOT add creative interpretations or assumptions

LANGUAGE & TEXT PRESERVATION:
- Never translate or normalize text; preserve original language and Unicode
- Preserve exact wording, capitalization, spelling (US/UK variants), punctuation
- Copy text exactly for fields like responsibilities, achievements, honors
- Preserve all accents, scripts, and non-Latin characters exactly as written

AMBIGUITY HANDLING:
- If uncertain or ambiguous, leave the field null (do not infer)
- Only extract information with clear evidence in the text
- Do not derive or assume information not explicitly stated

OUTPUT REQUIREMENTS:
- Return ONLY a single JSON object (no extra text or code fences)
- Adhere exactly to field names from schema; omit unknown fields
- If no relevant information is found, return an empty JSON object {{}}

JSON Schema:
```json
{schema_json}
```

CV Text:
---
{raw_text}
---

{self.get_section_specific_instructions()}"""
        
        return base_prompt
    
    def get_section_specific_instructions(self) -> str:
        """Override this to provide section-specific instructions."""
        return f"Extract the {self.section_name} data and return ONLY the JSON object. Be completely deterministic and consistent:"


class SkillsPromptTemplate(BasePromptTemplate):
    """Template for skills section extraction."""
    
    def get_section_specific_instructions(self) -> str:
        exclusions = "\n".join([f"- {ex}" for ex in extraction_config.SKILLS_EXCLUSIONS])
        return f"""Extract ONLY technical skills, software proficiencies, and professional competencies.
🚨 CRITICAL EXCLUSIONS - DO NOT INCLUDE:
{exclusions}

✅ ONLY INCLUDE:
- Programming languages (Python, JavaScript, Java, etc.)
- Frameworks and libraries (React, Django, Express, etc.)
- Software tools (Excel, Photoshop, AutoCAD, etc.)
- Technical methodologies (Agile, DevOps, CI/CD, etc.)
- Professional skills (Project Management, Data Analysis, etc.)

PRESERVATION RULES:
- Only include skills explicitly present in the CV text
- Do NOT derive synonyms or related skills
- Preserve group labels exactly as written (e.g., "Technical Skills", "Development Tools")
- If no group labels exist, categorize conservatively (e.g., "Programming Languages", "Frameworks", "Tools")
- Keep original spelling and capitalization of skills

IMPORTANT:
- Do not infer skills from job descriptions
- Do not add skills mentioned only in context (e.g., "worked with team" doesn't mean "Teamwork" skill)
- Extract skills from dedicated skills sections or clearly listed competencies"""


class LanguagesPromptTemplate(BasePromptTemplate):
    """Template for languages section extraction."""
    
    def get_section_specific_instructions(self) -> str:
        exclusions = "\n".join([f"- {ex}" for ex in extraction_config.LANGUAGES_EXCLUSIONS])
        return f"""Extract ONLY spoken/written natural languages and their proficiency levels.
🚨 CRITICAL EXCLUSIONS - DO NOT INCLUDE:
{exclusions}

✅ ONLY INCLUDE:
- Natural human languages (English, Spanish, French, Mandarin, etc.)
- Proficiency levels exactly as written
- Language certifications (if specifically mentioned)

PROFICIENCY PRESERVATION:
- Preserve proficiency labels VERBATIM (do not normalize)
- Keep exact wording: "Native" not "Native Speaker", "Fluent" not "Fluency"
- Preserve scale systems: if CV uses "A1-C2", keep it; if uses "Beginner-Expert", keep it
- DO NOT convert between scales (e.g., don't change "B2" to "Intermediate")
- If proficiency is not stated, use "Proficient" as default

EXTRACTION PATTERNS:
- Look for patterns like "Fluent in Spanish", "Native English", "Conversational French"
- Look for languages in sections labeled LANGUAGES, Language Skills, or similar
- Even simple lists like "English French" should be extracted

IMPORTANT: 
- DO NOT translate proficiency terms
- DO NOT list programming languages here
- DO NOT skip this section even if it seems minor
- DO NOT return null or empty languageItems if languages are found"""


class CertificationsPromptTemplate(BasePromptTemplate):
    """Template for certifications section extraction."""
    
    def get_section_specific_instructions(self) -> str:
        exclusions = "\n".join([f"- {ex}" for ex in extraction_config.CERTIFICATIONS_EXCLUSIONS])
        return f"""Extract ONLY formal certifications, licenses, and professional credentials.
🚨 CRITICAL EXCLUSIONS - DO NOT INCLUDE:
{exclusions}

✅ ONLY INCLUDE:
- Professional certifications (CompTIA A+, AWS Certified, PMP, etc.)
- Industry licenses (CPA, Bar License, Medical License, etc.)
- Vendor certifications (Microsoft Certified, Cisco CCNA, etc.)
- Safety certifications (First Aid, CPR, OSHA, etc.)

DISTINCTION FROM COURSES:
- Certifications grant formal credentials/licenses
- Courses are learning experiences without formal credentials
- If it's just a "course completion certificate", it belongs in Courses section
- If it grants a professional designation or license, include here

PRESERVATION RULES:
- Preserve issuing organization name exactly as written
- Keep certification ID/number if provided
- Preserve date format exactly
- Include verification URLs if present

URL EXTRACTION:
- verificationUrl: Direct verification/credential link
- linkUrl: Any other relevant certification links
- imageUrl: Certificate badge/logo images
- Extract ALL URLs related to certifications

EXTRACTION HINTS:
- Look for keywords: "Certified", "Certification", "Licensed", "Accredited"
- Look for issuing organizations: PMI, Microsoft, AWS, Google, Oracle, etc.
- Check for professional designations: PMP, CISSP, CPA, etc.

IMPORTANT:
- Do NOT include courses that don't grant certifications
- Do NOT include workshop attendance certificates
- Do NOT include training completion certificates unless they grant professional credentials
- Avoid duplicating content already in Education or Courses sections
- If uncertain which section, prefer the most specific (Certifications > Courses > Education)"""


class ExperiencePromptTemplate(BasePromptTemplate):
    """Template for experience section extraction."""
    
    def get_section_specific_instructions(self) -> str:
        return """Extract ALL work experience including internships, externships, and job shadowing.

REQUIRED FIELDS (extract only if explicitly stated):
- jobTitle: Exact title as written
- companyName: Exact company name
- dateRange: Preserve original date format (don't normalize)
- responsibilitiesAndAchievements: Keep exact bullet phrasing and order; preserve metrics with units
- technologiesUsed: Extract ONLY specific technologies mentioned IN THIS ROLE (see rules below)
- employmentType: ONLY if stated (Internship, Externship, Part-time, Contract, etc.)

TECHNOLOGIES EXTRACTION RULES:
✅ INCLUDE ONLY if explicitly mentioned for THIS specific job:
- Programming languages (Python, Java, JavaScript, C++, Go, Ruby, etc.)
- Frameworks/Libraries (React, Django, Spring, Angular, Vue.js, etc.)
- Databases (MySQL, PostgreSQL, MongoDB, Oracle, Redis, etc.)
- Cloud platforms (AWS, Azure, Google Cloud, specific services like EC2, S3, etc.)
- Specific software tools (Photoshop, AutoCAD, SAP, Salesforce, JIRA, etc.)
- DevOps tools (Docker, Kubernetes, Jenkins, Git, Terraform, Ansible, etc.)
- Data tools (Tableau, PowerBI, Spark, Hadoop, specific Excel features like VBA, etc.)
- Specific CMS/platforms (WordPress, Shopify, Drupal, etc.)
- Mobile technologies (iOS, Android, React Native, Flutter, etc.)
- Testing tools (Selenium, Jest, Cypress, JUnit, etc.)
- Version control (Git, SVN, Perforce, etc.)
- IDEs and editors ONLY if specialized (IntelliJ, Visual Studio, etc.)

❌ DO NOT INCLUDE:
- Generic terms: "teams", "team", "office", "computer", "software", "systems", "system", "data", "management", "project", "process", "business"
- Soft skills or methodologies: Agile, Scrum, communication, leadership, collaboration
- Basic office tools unless specifically advanced: just "Excel" no, but "Excel VBA" or "Excel Macros" yes
- Generic business terms: stakeholders, cross-functional, strategic, optimization
- Job-related nouns that aren't technologies: requirements, documentation, analysis, implementation
- Technologies mentioned in other jobs but not explicitly in THIS job's bullets
- Technologies from skills section unless explicitly stated as used in THIS role
- Duplicates - each technology should appear only once per job

CRITICAL: 
- Extract ONLY from the responsibility bullets for THIS specific position
- Look for concrete tool/technology names, not concepts
- If unsure whether something is a technology, err on the side of exclusion
- If no specific technologies are mentioned, return null (not an empty array)

DATE HANDLING:
- Preserve original date format exactly (e.g., "January 2024" not "01/2024")
- Use endDate="Present" and isCurrent=true for ongoing positions
- Keep date strings as written (don't standardize)
- Do not infer dates or locations for any role; include only explicitly stated values

SPECIAL EMPLOYMENT TYPES:
- Include externships/job shadowing/observation; set employmentType="Externship" ONLY if explicitly stated
- Include internships; set employmentType="Internship" ONLY if explicitly stated
- Do not infer employment type - leave null if not explicitly mentioned
- Do not infer dates or locations for externships unless explicitly present in the text

🚨 CRITICAL EXCLUSIONS - DO NOT INCLUDE:
- Skills lists that belong in Skills section
- Language proficiencies (belong in Languages)
- Certifications (belong in Certifications)
- Course names (belong in Education/Courses)
- Generic soft-skills laundry lists without context

PRESERVATION RULES:
- Keep original date format
- Keep bullet phrasing and order exactly
- Preserve all metrics with exact units (%, $, €, team size, etc.)
- Do NOT paraphrase or reword responsibilities"""


class AchievementsPromptTemplate(BasePromptTemplate):
    """Template for achievements section extraction."""
    
    def get_section_specific_instructions(self) -> str:
        return """Extract ONLY quantifiable achievements with impact metrics.

EXTRACTION RULES:
- Use exact metrics and units as written (%, $, €, team size, numbers)
- Do NOT rephrase or paraphrase - copy exact wording
- Preserve original figures exactly (e.g., "47%" not "nearly 50%")
- If unclear or ambiguous, leave null

URL EXTRACTION:
- linkUrl: Links to awards, recognition pages, or achievement details
- imageUrl: Award badges, certificates, or achievement visuals
- videoUrl: Videos showcasing the achievement
- Extract ALL URLs related to achievements

INCLUDE:
- Results with exact percentages (increased X by 47%)
- Financial impact with exact amounts ($2.3M revenue, €50K savings)
- Scale metrics with exact numbers (managed 12 people, 5 projects)
- Awards and recognitions with exact titles
- Quantified improvements (reduced time by 3 hours, improved accuracy to 99.5%)

🚨 CRITICAL EXCLUSIONS:
- Generic responsibilities without measurable impact
- Duplicates from summary section
- Vague statements without specific metrics
- Items without quantifiable outcomes (unless explicitly labeled as award/recognition)

PRESERVATION:
- Keep exact figures and wording
- Preserve currency symbols and units
- Maintain original phrasing - do not "improve" the language
- Extract contextOrDetail and timeframe exactly as written"""


class PublicationsPromptTemplate(BasePromptTemplate):
    """Template for publications section extraction."""
    
    def get_section_specific_instructions(self) -> str:
        return """Extract ALL publications, research papers, and articles.
Include:
- Title, authors, publication name
- Date published
- DOI/URL if available
- Brief description of research
- Citations if mentioned

URL EXTRACTION:
- publicationUrl: Direct link to publication
- linkUrl: Alternative links (journal site, preprint, etc.)
- videoUrl: Video presentations of the research
- Extract ALL URLs mentioned in publication descriptions"""


class SpeakingPromptTemplate(BasePromptTemplate):
    """Template for speaking engagements section extraction."""
    
    def get_section_specific_instructions(self) -> str:
        return """Extract ALL speaking engagements, presentations, talks, and training activities.
IMPORTANT: Include any mentions of:
- Training or educating employees/staff  
- Presenting concepts or reports to teams
- Leading workshops or educational sessions
- Any activity where someone spoke to or trained a group
- Writing reports or presentations for meetings (e.g., "Wrote up reports...for 180+ meetings")
- Educating employees on specific topics (e.g., "Frequently educated 130+ employees")
- Presenting to management or cross-functional teams
- Contributing to concept development through presentations

For each entry include:
- Event name (or infer from context like "Cross-functional Team Meetings", "Employee Training")
- Topic/title of presentation
- Date and location
- Audience size/type if mentioned (extract numbers like "180+ meetings", "130+ employees")
- Role (Educator, Trainer, Presenter, etc.)

URL EXTRACTION:
- presentationUrl: Link to slides or presentation materials
- videoUrl: Recording of the talk/presentation
- eventUrl: Event website
- linkUrl: Any other relevant links
- Extract ALL URLs related to speaking engagements"""


class PatentsPromptTemplate(BasePromptTemplate):
    """Template for patents section extraction."""
    
    def get_section_specific_instructions(self) -> str:
        return """Extract ALL patents and intellectual property.
Include:
- Patent title and number
- Filing/grant dates
- Co-inventors
- Brief description
- Status (pending/granted)"""


class MembershipsPromptTemplate(BasePromptTemplate):
    """Template for memberships section extraction."""
    
    def get_section_specific_instructions(self) -> str:
        return """Extract ALL professional memberships and affiliations.
Include:
- Organization name
- Membership level/type
- Date joined
- Role/position if any
- Active status

URL EXTRACTION:
- linkUrl: Organization website or member profile page
- imageUrl: Organization logos or membership badges
- Extract ALL URLs related to memberships"""


class ContactPromptTemplate(BasePromptTemplate):
    """Template for contact section extraction."""
    
    def get_section_specific_instructions(self) -> str:
        return """Extract ALL contact and demographic information including:

CONTACT INFORMATION:
- Email address (preserve exact format)
- Phone number (preserve exact format with country codes if present)
- Complete address (street, city, state/province, postal code, country)
- Professional links (LinkedIn, GitHub, Portfolio, Personal Website, etc.)
- Any other social media or professional platform links
- Availability information (e.g., "Willing to travel", "Available for remote work", etc.)

DEMOGRAPHIC INFORMATION (extract when present, leave null if not found):
- Place of birth (look for "Place of birth", "Born in", "Birthplace", "POB")
- Nationality (look for "Nationality", "Citizenship", "Citizen")
- Driving license (look for "Driving license", "Driver's license", "License")
- Date of birth (look for "Date of birth", "DOB", "Born", "Birthdate")
- Marital status (look for "Marital status", "Married", "Single", etc.)
- Visa status / Work authorization (look for "Visa status", "Work authorization", "Authorized to work")

IMPORTANT INSTRUCTIONS:
1. Preserve phone/email format exactly as written
2. Look for sections labeled "LINKS", "DETAILS", "PERSONAL INFO" or similar
3. If you find platform names without URLs, include platform with url="Not available"
4. Common platforms: LinkedIn, GitHub, Portfolio, Pinterest, Twitter, Instagram, Behance, Dribbble
5. For availability, check summary/profile for "Willing to travel", "Available for remote", etc.
6. Extract demographic fields ONLY if explicitly stated - do not infer or guess
7. Handle concatenated text: Recover boundaries when separators are missing in OCR'd/PDF text (e.g., "Place of birthSan Antonio" → place of birth: "San Antonio")
8. Never invent content - only extract what exists, even if formatting is poor
9. Tolerate missing spaces, commas, or other separators but maintain data integrity"""


class HobbiesPromptTemplate(BasePromptTemplate):
    """Template for hobbies section extraction."""
    
    def get_section_specific_instructions(self) -> str:
        return """Extract ALL hobbies and interests.
This is important for understanding the person's full profile.
Include all activities, interests, and pastimes mentioned.
DO NOT skip this section

URL EXTRACTION:
- linkUrl: Links to hobby-related websites, clubs, or projects
- imageUrl: Photos of hobby activities or achievements
- videoUrl: Videos of hobby performances or activities
- githubUrl: Hobby-related coding projects
- Extract ALL URLs mentioned with hobbies"""


class EducationPromptTemplate(BasePromptTemplate):
    """Template for education section extraction."""
    
    def get_section_specific_instructions(self) -> str:
        return """Extract ALL education information.

INSTITUTION NAME RULES:
- Extract the EXACT institution name without adding location prefixes
- Do NOT prepend state names to university names (e.g., use "University" not "Texas University")
- If institution name includes location (e.g. "Newtown Square University"), keep the full name
- NEVER extract just "University" as the institution name - look for the full name
- Keep location information separate in the location field

DATE PRESERVATION:
- Preserve date formats exactly as written
- Do not normalize date strings (keep "January 2024" not "01/2024")
- Keep original formatting for graduation dates

HONORS & COURSEWORK:
- Preserve honors text exactly as written
- Include all degrees, minors, majors, concentrations
- Extract GPA exactly as stated
- Include relevant coursework if listed

CERTIFICATIONS HANDLING:
- If a certification appears in Education section, note it but ALSO extract it under Certifications
- Do not move certifications here from other sections
- PMI (Project Management Institute) is often located in Newtown Square, Pennsylvania

LOCATION EXTRACTION:
- When extracting location, include ALL parts (city, state, country) if mentioned
- If you see "City, State" format, extract both city and state
- For certifications like CAPM with location (e.g. "Newtown Square, Texas"), extract city and state separately

EXCLUSIONS:
- Do not include work experience here
- Do not include professional certifications as degrees
- If a certification appears here, also extract it in Certifications section
- Avoid duplicating content from other sections unless it belongs in multiple places"""


class ProjectsPromptTemplate(BasePromptTemplate):
    """Template for projects section extraction."""
    
    def get_section_specific_instructions(self) -> str:
        return """Extract ALL projects, both personal and professional.

REQUIRED FIELDS (extract only if explicitly stated):
- title: Exact project name
- role: Role in project (if stated)
- description: Project description exactly as written
- outcomes/metrics: Quantified results, impact, or achievements
- technologies: Technologies used (ONLY if explicitly mentioned)
- dateRange: Keep original date format

URL EXTRACTION (CRITICAL):
- projectUrl: Main project website or demo link
- githubUrl: GitHub repository links (must be github.com/user/repo format)
- videoUrl: YouTube, Vimeo, or video file links
- imageUrl: Screenshots or project images
- linkUrl: Any other general website URLs

IMPORTANT: Extract ALL URLs mentioned, even if embedded in description text.
Example: "Built a portfolio site (https://example.com) using React"
Should extract: projectUrl = "https://example.com"

🚨 CRITICAL EXCLUSIONS:
- Job responsibilities that belong in Experience section
- Work duties from employment positions
- Routine tasks without project structure

METRICS & OUTCOMES:
- Explicitly capture outcomes, results, and metrics
- Preserve exact numbers and units
- Include user counts, performance improvements, etc.

DATE & URL HANDLING:
- Keep original date format (don't normalize)
- Include all project-related URLs
- Preserve URL format exactly"""


class VolunteerPromptTemplate(BasePromptTemplate):
    """Template for volunteer section extraction."""
    
    def get_section_specific_instructions(self) -> str:
        return """Extract ALL volunteer work, community service, and extra-curricular activities.

REQUIRED FIELDS:
- role: Position or role in organization
- organization: Name of organization/group
- dateRange: Preserve original date format
- description: Activities and responsibilities
- impact metrics: Quantified impact or achievements

URL EXTRACTION:
- linkUrl: Organization website or project links
- videoUrl: Videos of volunteer activities/events
- imageUrl: Photos from volunteer work
- Extract ALL URLs related to volunteer activities

INCLUDE:
- Volunteer positions
- Community service
- Extra-curricular activities (athletics, clubs, teams)
- Leadership positions in organizations
- Look for patterns like "Captain of", "President of", "Member of"

ATHLETICS & ACTIVITIES:
- Include athletics teams with achievements (e.g., "State Champions 2016")
- Include club memberships and leadership roles
- Extract extra-curricular activities even if brief

🚨 EXCLUSIONS:
- Paid employment (belongs in Experience)
- Internships (belongs in Experience)
- Academic coursework (belongs in Education)"""


class CoursesPromptTemplate(BasePromptTemplate):
    """Template for courses section extraction."""
    
    def get_section_specific_instructions(self) -> str:
        return """Extract ALL courses, training programs, and workshops.

REQUIRED FIELDS:
- title: Exact course name
- institution: Where the course was taken
- year/date: When completed (preserve format)
- certificateNumber: ONLY if explicitly provided
- certificateUrl: ONLY if URL is provided

URL EXTRACTION:
- certificateUrl: Direct link to course certificate
- linkUrl: Course platform or enrollment page
- videoUrl: Course preview or demo videos
- imageUrl: Course badge or certificate images
- Extract ALL URLs related to courses

INCLUDE:
- Online courses (Udemy, Coursera, etc.)
- Training programs
- Workshops and seminars
- Professional development courses

🚨 EXCLUSIONS:
- Formal certifications (belong in Certifications section)
- Degree programs (belong in Education)
- Courses that grant professional certifications

IMPORTANT:
- Do NOT confuse with Certifications
- These are learning experiences, not credentials
- Include completion dates if provided
- Avoid duplicating content from Certifications or Education sections
- If a course grants a certification, it belongs in Certifications, not here"""


class TestimonialsPromptTemplate(BasePromptTemplate):
    """Template for testimonials section extraction."""
    
    def get_section_specific_instructions(self) -> str:
        return """Extract ALL testimonials, recommendations, and quotes from others.

REQUIRED FIELDS:
- text: The exact quote or testimonial text
- name: Person who gave the testimonial (if provided)
- role: Their title/position (if provided)
- company: Their organization (if provided)
- date: When given (if provided)

PRESERVE:
- Extract quote text exactly as written
- Keep attribution details if present
- Maintain context if provided
- Preserve date format

INCLUDE:
- Direct quotes from supervisors/colleagues
- LinkedIn recommendations
- Performance review excerpts
- Client testimonials

EXCLUSIONS:
- Self-written summary statements
- Your own achievements"""


# Default template for sections without specific requirements
class DefaultPromptTemplate(BasePromptTemplate):
    """Default template for sections without specific requirements."""
    pass


# Registry mapping section names to their templates
class PromptTemplateRegistry:
    """Registry for managing prompt templates by section."""
    
    def __init__(self):
        self.templates: Dict[str, PromptTemplate] = {
            "skills": SkillsPromptTemplate("skills"),
            "languages": LanguagesPromptTemplate("languages"),
            "certifications": CertificationsPromptTemplate("certifications"),
            "experience": ExperiencePromptTemplate("experience"),
            "achievements": AchievementsPromptTemplate("achievements"),
            "publications": PublicationsPromptTemplate("publications"),
            "speaking": SpeakingPromptTemplate("speaking"),
            "patents": PatentsPromptTemplate("patents"),
            "memberships": MembershipsPromptTemplate("memberships"),
            "contact": ContactPromptTemplate("contact"),
            "hobbies": HobbiesPromptTemplate("hobbies"),
            "education": EducationPromptTemplate("education"),
            "projects": ProjectsPromptTemplate("projects"),
            "volunteer": VolunteerPromptTemplate("volunteer"),
            "courses": CoursesPromptTemplate("courses"),
            # NOTE: TestimonialsPromptTemplate exists but not wired to schema yet
            # "testimonials": TestimonialsPromptTemplate("testimonials"),
            # Default templates for other sections
            "hero": DefaultPromptTemplate("hero"),
            "summary": DefaultPromptTemplate("summary"),
        }
    
    def get_template(self, section_name: str) -> PromptTemplate:
        """Get the template for a specific section."""
        return self.templates.get(section_name, DefaultPromptTemplate(section_name))
    
    def create_prompt(self, section_name: str, section_schema: Optional[Type[BaseModel]], 
                     raw_text: str) -> str:
        """Create a prompt for the given section."""
        schema_json = json.dumps(section_schema.model_json_schema(), indent=2) if section_schema else "{}"
        template = self.get_template(section_name)
        return template.generate(schema_json, raw_text)


# Create singleton instance
prompt_registry = PromptTemplateRegistry()