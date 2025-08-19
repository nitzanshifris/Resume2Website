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

OUTPUT FORMAT (CRITICAL):
For each certification:
- title: The certification name (e.g., "AWS Certified Solutions Architect")
- description: Natural, humanized text combining ALL details into one flowing paragraph
- issuingOrganization: Keep separate for reference (but also include in description)
- Other fields: Extract as usual but ALSO include in description

DESCRIPTION BUILDING:
Combine these elements naturally into complete sentences:
- Issuing organization ("Issued by Amazon Web Services")
- Issue date and expiry date ("in March 2023, valid until March 2026")
- What the certification demonstrates ("demonstrates expertise in...")
- Credential ID if present ("Credential ID: AWS-PSA-123456")
- Any additional context about the certification

EXAMPLE:
title="AWS Certified Solutions Architect - Professional"
description="Issued by Amazon Web Services in March 2023, valid until March 2026. This advanced certification demonstrates expertise in designing distributed systems on AWS cloud platform and validates skills in architecting complex solutions. Credential ID: AWS-PSA-123456."

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
✅ INCLUDE if mentioned or clearly implied for THIS specific job:
- Programming languages (Python, Java, JavaScript, C++, C, Go, Ruby, etc.)
  * Extract "C/C++" or "C++" if mentioned in job title or responsibilities
- Frameworks/Libraries (React, Django, Spring, Angular, Vue.js, etc.)
- Databases (MySQL, PostgreSQL, MongoDB, Oracle, Redis, etc.)
- Cloud platforms (AWS, Azure, Google Cloud, specific services like EC2, S3, etc.)
- Operating Systems when used for development (Linux, Windows, Unix, macOS, etc.)
  * Extract if mentioned as development environment (e.g., "Linux environments")
- Embedded/System technologies (UEFI, BSP, Kernel Development, Device Drivers, etc.)
  * Extract "Kernel Development" if "kernel modules" or "kernel-level" mentioned
  * Extract "BSP" if "BSP layers" mentioned
  * Extract "UEFI" if "UEFI bootloader" mentioned
- Specific software tools (Photoshop, AutoCAD, SAP, Salesforce, JIRA, etc.)
- DevOps tools and practices (Docker, Kubernetes, Jenkins, Git, Terraform, Ansible, CI/CD, etc.)
  * Extract "DevOps" if "DevOps pipelines" mentioned
  * Extract "CI/CD" if "CI/CD processes" or "CI/CD pipelines" mentioned
- Data tools (Tableau, PowerBI, Spark, Hadoop, specific Excel features like VBA, etc.)
- Specific CMS/platforms (WordPress, Shopify, Drupal, etc.)
- Mobile technologies (iOS, Android, React Native, Flutter, SwiftUI, etc.)
- Testing tools (Selenium, Jest, Cypress, JUnit, etc.)
- Version control (Git, SVN, Perforce, etc.)
- IDEs and editors ONLY if specialized (IntelliJ, Visual Studio, etc.)
- Hardware/Embedded tools (JTAG, GDB, Valgrind, Make, CMake, etc.)

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
- Extract from the responsibility bullets AND job title for THIS specific position
- Look for concrete tool/technology names AND contextual mentions (e.g., "kernel modules" → "Kernel Development")
- Include technologies clearly implied by the work described (e.g., "DevOps pipelines" → "DevOps")
- If no technologies are mentioned or implied, return null (not an empty array)

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
    """Template for achievements section extraction - includes patents and memberships."""
    
    def get_section_specific_instructions(self) -> str:
        return """Extract ALL achievements, patents, professional memberships, awards, and quantifiable accomplishments.

OUTPUT FORMAT:
For each achievement, patent, or membership, create a simple structure:
- value: The main identifier (achievement name, patent title, organization name, award)
- label: Short descriptive label
- contextOrDetail: Natural, humanized text combining ALL details into one flowing paragraph
- timeframe: When it occurred or duration

PATENTS (CRITICAL - MUST EXTRACT):
Look for sections labeled "Patents", "Intellectual Property", "IP", "Inventions"
- Patent titles and numbers (US Patent #1234567, Patent Pending, etc.)
- Patent status (granted, pending, provisional, published)
- Filing/grant dates
- Co-inventors if mentioned
- Brief description of the invention
FORMAT AS: 
  value="Patent Title or Number"
  label="Patent" or "Patent Pending"
  contextOrDetail="Granted in 2023 for innovative system that [description]. Filed with co-inventors..."
  timeframe="2023" or date range

PROFESSIONAL MEMBERSHIPS (CRITICAL - MUST EXTRACT):
Look for sections labeled "Memberships", "Professional Organizations", "Affiliations", "Associations"
- Organization names (IEEE, ACM, PMI, AMA, etc.)
- Membership levels (Fellow, Senior Member, Member, Student Member)
- Leadership roles (Board Member, Committee Chair, Chapter President)
- Active dates or duration
FORMAT AS:
  value="IEEE"
  label="Senior Member"
  contextOrDetail="Active senior member of the Institute of Electrical and Electronics Engineers since 2018, serving on the local chapter's advisory board and contributing to technical standards committees"
  timeframe="2018 - Present"

AWARDS & RECOGNITIONS:
- Employee of the Month/Year awards
- Industry awards and honors
- Academic honors (Dean's List, Honors, etc.)
- Competition wins and rankings
FORMAT AS:
  value="Employee of the Year"
  label="Company Award"
  contextOrDetail="Recognized for exceptional performance, leading three major projects to successful completion ahead of schedule"
  timeframe="2023"

QUANTIFIABLE ACHIEVEMENTS:
- Results with exact metrics (increased sales by 47%)
- Financial impact ($2.3M revenue, €50K cost savings)
- Scale metrics (managed 12 people, led 5 projects)
- Performance improvements (reduced processing time by 3 hours)
FORMAT AS:
  value="$2.3M Revenue Growth"
  label="Sales Achievement"
  contextOrDetail="Increased quarterly revenue by $2.3M through strategic account management and new client acquisition"
  timeframe="Q3 2023"

EXTRACTION RULES:
1. Look for SEPARATE sections labeled "Patents" or "Memberships" and extract them here
2. Combine all related details into natural, flowing contextOrDetail text
3. Don't use robotic comma-separated lists in contextOrDetail
4. Write contextOrDetail as if telling someone about the achievement
5. Include context, dates, and impact in the contextOrDetail naturally
6. Preserve exact numbers and metrics
7. Extract ALL patents even if in separate "Patents" section
8. Extract ALL memberships even if in separate "Memberships" section

URL EXTRACTION:
- linkUrl: Patent databases, membership portals, award pages
- verificationUrl: Patent office links, membership verification
- imageUrl: Award certificates, patent diagrams
- Extract ALL URLs related to achievements, patents, or memberships

🚨 CRITICAL:
- MUST scan entire CV for "Patents" section and extract all patents here
- MUST scan entire CV for "Memberships" or "Professional Organizations" section and extract all here
- Combine everything into value + label + contextOrDetail format
- Make contextOrDetail human-readable full sentences, not technical lists
- If you find a dedicated Patents section, extract EVERY patent from it
- If you find a dedicated Memberships section, extract EVERY membership from it"""


class PublicationsPromptTemplate(BasePromptTemplate):
    """Template for publications section extraction."""
    
    def get_section_specific_instructions(self) -> str:
        return """Extract ALL publications, research papers, and articles.

OUTPUT FORMAT (CRITICAL):
For each publication:
- title: The publication title (keep as is)
- description: Natural, humanized text combining ALL details into one flowing paragraph
- Other fields: Extract as usual but ALSO include in description

DESCRIPTION BUILDING:
Combine these elements naturally:
- Authors list ("Co-authored with..." or "Lead author with...")
- Publication venue and type ("Published in IEEE Journal..." or "Presented at...")
- Publication date
- Brief summary of the work or its impact
- DOI or other identifiers if present

EXAMPLE:
title="Machine Learning Approaches for Network Security"
description="Published in IEEE Transactions on Network Security, March 2023, co-authored with Dr. Smith and Prof. Johnson. This peer-reviewed paper presents novel algorithms for detecting network intrusions using deep learning, achieving 99.5% accuracy in real-world deployments. DOI: 10.1109/TNS.2023.123456."
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

OUTPUT FORMAT (CRITICAL):
For each speaking engagement:
- title: The topic or presentation title (primary field)
- description: Natural, humanized text combining ALL details into one flowing paragraph
- eventName: Keep separate for reference
- Other fields: Extract as usual but ALSO include in description

DESCRIPTION BUILDING:
Combine these elements naturally:
- Event name and type
- Venue and date
- Audience size and type if known
- Key topics covered
- Any special recognition or invitation details

EXAMPLE:
title="Future of Cloud Computing"
description="Keynote presentation at TechConf 2023 in San Francisco, delivered to an audience of 500+ technology professionals. Discussed emerging trends in serverless architecture and edge computing, with live demonstrations of cutting-edge deployment strategies. Invited as industry expert based on 10+ years of cloud architecture experience."

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

OUTPUT FORMAT (CRITICAL):
For each hobby:
- title: The hobby or interest name
- description: Brief, natural text about this interest (1-2 sentences)

DESCRIPTION BUILDING (SIMPLE):
- Keep descriptions short and conversational
- Mention any achievements or special aspects
- Don't over-explain, keep it light

EXAMPLE:
title="Photography"
description="Passionate landscape photographer with work featured in local galleries. Enjoy capturing natural beauty during weekend hiking trips."

title="Chess"
description="Competitive chess player rated 1800+ on chess.com. Regular participant in local tournaments."

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

OUTPUT FORMAT (CRITICAL):
For each volunteer activity:
- role: Position or role (keep separate)
- organization: Organization name (keep separate)  
- description: Natural, humanized text combining ALL details into one flowing paragraph
- dateRange: Keep separate for dates

DESCRIPTION BUILDING:
Combine these elements naturally into complete sentences:
- What you did and your responsibilities
- Impact metrics or achievements
- Duration and time commitment
- Any leadership roles or special recognition
- Skills developed or community impact

EXAMPLE:
role="Youth Soccer Coach"
organization="Community Sports League"
description="Volunteered as head coach for under-12 soccer team from 2021 to 2023, dedicating 10 hours weekly during the season. Led team to regional championships while mentoring 15 young athletes in sportsmanship and teamwork. Organized fundraising events that raised $5,000 for new equipment and created an inclusive environment where every child could develop their skills."

REQUIRED FIELDS:
- role: Position or role in organization
- organization: Name of organization/group
- dateRange: Preserve original date format
- description: Natural paragraph combining activities, responsibilities, and impact
- impact metrics: Include in description naturally

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

OUTPUT FORMAT (CRITICAL):
For each course:
- title: The course name (keep as is)
- description: Natural, humanized text combining ALL details into one flowing paragraph
- institution: Keep separate for reference
- Other fields: Extract as usual but ALSO include in description

DESCRIPTION BUILDING:
Combine these elements naturally:
- Institution or platform
- Completion date
- Key topics covered
- Skills gained
- Certificate number if applicable
- Duration or hours if mentioned

EXAMPLE:
title="Advanced Machine Learning Specialization"
description="Completed through Coursera in partnership with Stanford University, finished in December 2023. This 6-month specialization covered deep learning, natural language processing, and computer vision, with hands-on projects in TensorFlow and PyTorch. Earned certificate with distinction, Certificate ID: COURSERA-ML-2023-45678."


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