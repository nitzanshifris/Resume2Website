"""
Data Extraction Service for CV2WEB MVP
Primary: Gemini 2.5 Pro | Fallback: Claude Sonnet
"""
import asyncio
import json
import logging
import re
import os
from typing import Dict, Any, Optional, Type, List

from pydantic import BaseModel, ValidationError
import google.generativeai as genai
from anthropic import AsyncAnthropic
from tenacity import retry, stop_after_attempt, wait_exponential

# URL normalization
from .url_normalizer import normalize_section_data
# Location parsing
from .location_parser import parse_location_string, parse_year_range
# Role inference
from .role_inferencer import infer_project_role, infer_speaking_event_name, infer_field_of_study

# Import schemas
from src.core.schemas.unified import (
    CVData, HeroSection, ProfessionalSummaryOverview, ExperienceSection, 
    EducationSection, SkillsSection, ProjectsSection, 
    CertificationsSection, AchievementsSection,
    VolunteerExperienceSection, LanguagesSection, ContactSectionFooter, 
    CoursesSection, HobbiesSection, PublicationsResearchSection,
    SpeakingEngagementsSection, PatentsSection, ProfessionalMembershipsSection
)
# Import date validator
from .date_validator import date_validator

# Import Keychain manager if available
try:
    from src.core.local.keychain_manager import (
        get_gemini_api_key,
        get_anthropic_api_key
    )
    KEYCHAIN_AVAILABLE = True
except ImportError:
    KEYCHAIN_AVAILABLE = False

logger = logging.getLogger(__name__)

# Import config
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
import config

# Configuration
GEMINI_MODEL = config.GEMINI_MODEL
CLAUDE_FALLBACK_MODEL = config.CLAUDE_MODEL
DEFAULT_MAX_TOKENS = 4000
DEFAULT_TEMPERATURE = 0.1


class DataExtractor:
    """
    Extracts structured data from CV text using Gemini 2.5 Pro.
    Excellent quality at 85% less cost than Opus.
    """
    
    def __init__(self, api_key: Optional[str] = None, claude_api_key: Optional[str] = None):
        """Initialize with API keys from keychain or environment"""
        # Setup Gemini (primary)
        google_api_key = api_key
        if not google_api_key:
            if KEYCHAIN_AVAILABLE:
                google_api_key = get_gemini_api_key()
            if not google_api_key:
                google_api_key = os.getenv('GEMINI_API_KEY') or os.getenv('GOOGLE_API_KEY')
                
        if google_api_key:
            try:
                genai.configure(api_key=google_api_key)
                self.gemini_model = genai.GenerativeModel(GEMINI_MODEL)
                self.gemini_available = True
                logger.info(f"Gemini {GEMINI_MODEL} initialized successfully")
            except Exception as e:
                logger.warning(f"Failed to initialize Gemini: {e}")
                self.gemini_available = False
        else:
            self.gemini_available = False
            
        # Setup Claude (fallback)
        anthropic_api_key = claude_api_key
        if not anthropic_api_key:
            if KEYCHAIN_AVAILABLE:
                anthropic_api_key = get_anthropic_api_key()
            if not anthropic_api_key:
                anthropic_api_key = os.getenv('ANTHROPIC_API_KEY')
                
        if anthropic_api_key:
            try:
                self.claude_client = AsyncAnthropic(api_key=anthropic_api_key)
                self.claude_available = True
                logger.info("Claude fallback initialized successfully")
            except Exception as e:
                logger.warning(f"Failed to initialize Claude: {e}")
                self.claude_available = False
        else:
            self.claude_available = False
            
        # Ensure at least one model is available
        if not self.gemini_available and not self.claude_available:
            raise ValueError("No LLM available! Need either GOOGLE_API_KEY or ANTHROPIC_API_KEY")
            
        self.generation_config = {
            "temperature": DEFAULT_TEMPERATURE,
            "max_output_tokens": DEFAULT_MAX_TOKENS,
            "response_mime_type": "application/json"
        }
        
        # Section to schema mapping
        self.section_schemas = {
            "hero": HeroSection,
            "summary": ProfessionalSummaryOverview,
            "experience": ExperienceSection,
            "education": EducationSection,
            "skills": SkillsSection,
            "projects": ProjectsSection,
            "certifications": CertificationsSection,
            "achievements": AchievementsSection,
            "volunteer": VolunteerExperienceSection,
            "languages": LanguagesSection,
            "contact": ContactSectionFooter,
            "courses": CoursesSection,
            "hobbies": HobbiesSection,
            "publications": PublicationsResearchSection,
            "speaking": SpeakingEngagementsSection,
            "patents": PatentsSection,
            "memberships": ProfessionalMembershipsSection
        }
        
        # Log available models
        models = []
        if self.gemini_available:
            models.append(f"Gemini ({GEMINI_MODEL})")
        if self.claude_available:
            models.append(f"Claude ({CLAUDE_FALLBACK_MODEL})")
        logger.info(f"DataExtractor initialized with: {', '.join(models)}")
    
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    async def _call_llm_with_retry(self, prompt: str, section_name: str) -> Any:
        """Call LLM with automatic fallback"""
        # Try Gemini first if available
        if self.gemini_available:
            try:
                logger.debug(f"Calling Gemini for {section_name}")
                response = await asyncio.get_event_loop().run_in_executor(
                    None,
                    lambda: self.gemini_model.generate_content(
                        prompt,
                        generation_config=self.generation_config
                    )
                )
                return ("gemini", response.text)
            except Exception as e:
                logger.warning(f"Gemini failed for {section_name}: {e}")
                if not self.claude_available:
                    raise
                    
        # Fallback to Claude
        if self.claude_available:
            try:
                logger.info(f"Using Claude fallback for {section_name}")
                response = await self.claude_client.messages.create(
                    model=CLAUDE_FALLBACK_MODEL,
                    max_tokens=DEFAULT_MAX_TOKENS,
                    temperature=DEFAULT_TEMPERATURE,
                    messages=[{"role": "user", "content": prompt}]
                )
                return ("claude", response.content[0].text)
            except Exception as e:
                logger.error(f"Claude also failed for {section_name}: {e}")
                raise
                
        raise Exception("No LLM available")
    
    def _create_section_prompt(self, section_name: str, section_schema: Optional[Type[BaseModel]], 
                              raw_text: str) -> str:
        """Create targeted prompt for each CV section"""
        
        schema_json = json.dumps(section_schema.model_json_schema(), indent=2) if section_schema else "{}"
        
        # Base instructions
        base_prompt = f"""You are a world-class CV parsing expert. Extract information for the "{section_name}" section ONLY.

Analyze the entire CV text and find information relevant to this section.
Return a single JSON object that strictly adheres to the provided schema.
If no relevant information is found, return an empty JSON object {{}}.

JSON Schema:
```json
{schema_json}
```

CV Text:
---
{raw_text}
---

Extract the {section_name} data and return ONLY the JSON object:"""

        # Section-specific enhancements
        if section_name == "experience":
            base_prompt = base_prompt.replace(
                "Extract the experience data",
                """Extract ALL work experience including internships.
CRITICAL RULES:
- Include complete descriptions with quantifiable results
- Preserve metrics (percentages, dollar amounts, team sizes)
- Set employmentType="Internship" for internships
- Use endDate="Present" and isCurrent=true for ongoing positions"""
            )
        
        elif section_name == "achievements":
            base_prompt = base_prompt.replace(
                "Extract the achievements data",
                """Extract ONLY quantifiable achievements with impact metrics.
Focus on:
- Results with percentages (increased X by Y%)
- Financial impact ($X revenue/savings)
- Scale metrics (managed X people/projects)
- Awards and recognitions
Exclude generic responsibilities without measurable outcomes"""
            )
            
        elif section_name == "skills":
            base_prompt = base_prompt.replace(
                "Extract the skills data",
                """Extract and intelligently categorize all skills.
Group into categories like:
- Programming Languages
- Frameworks & Libraries
- Databases
- Cloud & DevOps
- Leadership & Soft Skills
Include proficiency levels if mentioned"""
            )
            
        elif section_name == "publications":
            base_prompt = base_prompt.replace(
                "Extract the publications data",
                """Extract ALL publications, research papers, and articles.
Include:
- Title, authors, publication name
- Date published
- DOI/URL if available
- Brief description of research
- Citations if mentioned"""
            )
            
        elif section_name == "speaking":
            base_prompt = base_prompt.replace(
                "Extract the speaking data",
                """Extract ALL speaking engagements, presentations, talks, and training activities.
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
- Role (Educator, Trainer, Presenter, etc.)"""
            )
            
        elif section_name == "patents":
            base_prompt = base_prompt.replace(
                "Extract the patents data",
                """Extract ALL patents and intellectual property.
Include:
- Patent title and number
- Filing/grant dates
- Co-inventors
- Brief description
- Status (pending/granted)"""
            )
            
        elif section_name == "memberships":
            base_prompt = base_prompt.replace(
                "Extract the memberships data",
                """Extract ALL professional memberships and affiliations.
Include:
- Organization name
- Membership level/type
- Date joined
- Role/position if any
- Active status"""
            )
            
        elif section_name == "contact":
            base_prompt = base_prompt.replace(
                "Extract the contact data",
                """Extract ALL contact information including:
- Email address
- Phone number
- Complete address (street, city, state/province, postal code, country)
- Professional links (LinkedIn, GitHub, Portfolio, Personal Website, etc.)
- Any other social media or professional platform links
- Availability information (e.g., "Willing to travel", "Available for remote work", etc.)
IMPORTANT: 
1. Look for sections labeled "LINKS" or similar
2. If you find platform names (e.g., "LinkedIn", "Pinterest", "GitHub") without URLs, 
   still include them in professionalLinks with platform name and url as "Not available"
3. Common platforms to look for: LinkedIn, GitHub, Portfolio, Pinterest, Twitter, Instagram, 
   Personal Website, Behance, Dribbble, Medium, Dev.to, etc.
4. For availability, look in the summary/profile section for phrases like "Willing to travel", 
   "Available for remote work", "Open to relocation", etc."""
            )
        
        elif section_name == "languages":
            base_prompt = base_prompt.replace(
                "Extract the languages data",
                """Extract ALL language proficiencies.
Include:
- Language name
- Proficiency level (Native, Fluent, Professional, Conversational, Basic, or percentage/score)
- Any certifications (TOEFL, IELTS, etc.)

IMPORTANT: 
- If proficiency level is not explicitly stated, use "Proficient" as default
- Look for languages in sections labeled LANGUAGES, Language Skills, or similar
- Even simple lists like "English French" should be extracted
- DO NOT skip this section even if it seems minor
- DO NOT return null or empty languageItems if languages are found"""
            )
            
        elif section_name == "hobbies":
            base_prompt = base_prompt.replace(
                "Extract the hobbies data",
                """Extract ALL hobbies and interests.
This is important for understanding the person's full profile.
Include all activities, interests, and pastimes mentioned.
DO NOT skip this section"""
            )
            
        elif section_name == "education":
            base_prompt = base_prompt.replace(
                "Extract the education data",
                """Extract ALL education information.
IMPORTANT:
- For institution names, extract the EXACT institution name without adding location prefixes
- Do NOT prepend state names to university names (e.g., use "University" not "Texas University")
- If institution name includes location (e.g. "Newtown Square University"), keep the full name
- If you see patterns like "Texas University Newtown Square University", the actual institution is likely "Newtown Square University"
- NEVER extract just "University" as the institution name - look for the full name
- If the text has "University" followed by other words on the same line, include those words as part of the institution name
- If you can't find a proper institution name, look in nearby text for university names
- Keep location information separate in the location field
- When extracting location, include ALL parts (city, state, country) if mentioned
- If you see "City, State" format, extract both city and state
- Include all degrees, certifications, coursework, honors, etc.
- For certifications like CAPM, if location is mentioned (e.g. "Newtown Square, Texas"), extract city="Newtown Square" and state="Texas"
- PMI (Project Management Institute) is often located in Newtown Square, Pennsylvania"""
            )
        
        return base_prompt
    
    def _post_process_locations(self, section_name: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Post-process location data to ensure consistency"""
        if not data:
            return data
            
        # Process years of experience in summary
        if section_name == 'summary' and 'summaryText' in data:
            years, qualifier = parse_year_range(data['summaryText'])
            if years and 'yearsOfExperience' not in data:
                data['yearsOfExperience'] = years
            elif years and isinstance(data.get('yearsOfExperience'), str):
                # If it's a string like "more than 9", convert to just the number
                data['yearsOfExperience'] = years
        
        # Process professional links in contact
        if section_name == 'contact' and 'professionalLinks' in data and data['professionalLinks']:
            for link in data['professionalLinks']:
                if isinstance(link, dict):
                    # If URL is missing or is "Not available", keep it as is
                    if not link.get('url') or link.get('url') == 'Not available':
                        link['url'] = 'Not available (extracted from image)'
            
        # Process contact location
        if section_name == 'contact' and 'location' in data:
            if isinstance(data['location'], str):
                # Parse string location into structured format
                parsed = parse_location_string(data['location'])
                data['location'] = {
                    'city': parsed.city,
                    'state': parsed.state,
                    'country': parsed.country
                }
            elif isinstance(data['location'], dict):
                # Ensure all location fields are properly parsed
                location_str = ''
                if 'city' in data['location']:
                    location_str = data['location'].get('city', '')
                if 'state' in data['location']:
                    location_str += f", {data['location'].get('state', '')}"
                if 'country' in data['location']:
                    location_str += f", {data['location'].get('country', '')}"
                
                if location_str:
                    parsed = parse_location_string(location_str)
                    data['location']['city'] = parsed.city or data['location'].get('city')
                    data['location']['state'] = parsed.state or data['location'].get('state')
                    data['location']['country'] = parsed.country or data['location'].get('country')
        
        # Process experience locations
        elif section_name == 'experience' and 'experienceItems' in data:
            for item in data['experienceItems']:
                if 'location' in item:
                    if isinstance(item['location'], str):
                        parsed = parse_location_string(item['location'])
                        item['location'] = {
                            'city': parsed.city,
                            'state': parsed.state,
                            'country': parsed.country
                        }
                    elif isinstance(item['location'], dict) and item['location']:
                        # Reconstruct and reparse for consistency
                        location_parts = []
                        if item['location'].get('city'):
                            location_parts.append(item['location']['city'])
                        if item['location'].get('state'):
                            location_parts.append(item['location']['state'])
                        if item['location'].get('country'):
                            location_parts.append(item['location']['country'])
                        
                        if location_parts:
                            parsed = parse_location_string(', '.join(location_parts))
                            item['location']['city'] = parsed.city or item['location'].get('city')
                            item['location']['state'] = parsed.state or item['location'].get('state')
                            item['location']['country'] = parsed.country or item['location'].get('country')
                
                # Extract technologies from responsibilities
                if 'responsibilitiesAndAchievements' in item and not item.get('technologiesUsed'):
                    tech_patterns = [
                        r'\b(Excel|PowerPoint|Word|Outlook|Office)\b',
                        r'\b(Python|Java|JavaScript|C\+\+|C#|Ruby|Go|Swift|Kotlin)\b',
                        r'\b(React|Angular|Vue|Django|Flask|Spring|Node\.js)\b',
                        r'\b(AWS|Azure|GCP|Docker|Kubernetes)\b',
                        r'\b(SQL|MySQL|PostgreSQL|MongoDB|Redis)\b',
                        r'\b(Git|GitHub|GitLab|Jira|Confluence)\b'
                    ]
                    
                    found_techs = set()
                    for resp in item['responsibilitiesAndAchievements']:
                        for pattern in tech_patterns:
                            matches = re.findall(pattern, resp, re.IGNORECASE)
                            found_techs.update(matches)
                    
                    if found_techs:
                        item['technologiesUsed'] = list(found_techs)
                        logger.debug(f"Extracted technologies for {item.get('jobTitle', 'Unknown')}: {found_techs}")
        
        # Process education locations
        elif section_name == 'education' and 'educationItems' in data:
            for item in data['educationItems']:
                if 'location' in item:
                    if isinstance(item['location'], str):
                        parsed = parse_location_string(item['location'])
                        item['location'] = {
                            'city': parsed.city,
                            'state': parsed.state,
                            'country': parsed.country
                        }
                    elif isinstance(item['location'], dict) and item['location']:
                        location_parts = []
                        if item['location'].get('city'):
                            location_parts.append(item['location']['city'])
                        if item['location'].get('state'):
                            location_parts.append(item['location']['state'])
                        if item['location'].get('country'):
                            location_parts.append(item['location']['country'])
                        
                        if location_parts:
                            parsed = parse_location_string(', '.join(location_parts))
                            item['location']['city'] = parsed.city or item['location'].get('city')
                            item['location']['state'] = parsed.state or item['location'].get('state')
                            item['location']['country'] = parsed.country or item['location'].get('country')
        
        # Process summary for years of experience
        elif section_name == 'summary' and 'yearsOfExperience' in data:
            if isinstance(data['yearsOfExperience'], str):
                years, qualifier = parse_year_range(data['yearsOfExperience'])
                if years:
                    data['yearsOfExperience'] = years
                    if qualifier == 'more_than':
                        data['yearsOfExperienceQualifier'] = 'more_than'
        
        return data
    
    def _post_process_roles(self, section_name: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Post-process data to infer missing roles and fields"""
        if not data:
            return data
        
        # Process projects to infer missing roles
        if section_name == 'projects' and 'projectItems' in data:
            for project in data['projectItems']:
                if project and not project.get('role'):
                    title = project.get('title', '')
                    description = project.get('description', '')
                    inferred_role = infer_project_role(title, description)
                    if inferred_role:
                        project['role'] = inferred_role
                        logger.debug(f"Inferred role '{inferred_role}' for project '{title}'")
        
        # Process speaking engagements to infer missing event names
        elif section_name == 'speaking' and 'speakingEngagements' in data:
            for engagement in data['speakingEngagements']:
                if engagement and not engagement.get('eventName'):
                    topic = engagement.get('topic', '')
                    venue = engagement.get('venue', '')
                    role = engagement.get('role', '')
                    inferred_event = infer_speaking_event_name(topic, venue, role)
                    if inferred_event:
                        engagement['eventName'] = inferred_event
                        logger.debug(f"Inferred event name '{inferred_event}' for speaking topic '{topic}'")
        
        # Process education to infer missing fields of study
        elif section_name == 'education' and 'educationItems' in data:
            for item in data['educationItems']:
                if item and not item.get('fieldOfStudy'):
                    degree = item.get('degree', '')
                    institution = item.get('institution', '')
                    inferred_field = infer_field_of_study(degree, institution)
                    if inferred_field:
                        item['fieldOfStudy'] = inferred_field
                        logger.debug(f"Inferred field of study '{inferred_field}' for degree '{degree}'")
                
                # Fix common extraction errors with institution names
                if item and item.get('institution'):
                    inst = item['institution']
                    # Fix "University Newtown Square University" -> "Newtown Square University"
                    if inst.startswith('University ') and inst.endswith(' University'):
                        item['institution'] = inst[11:]  # Remove first "University "
                        logger.debug(f"Fixed institution name: {inst} -> {item['institution']}")
                    # Fix when only "University" is extracted (common OCR/parsing error)
                    elif inst == 'University' or inst.lower() == 'university':
                        # This is clearly an extraction error - mark for re-extraction
                        item['institution'] = '[University Name Not Extracted]'
                        logger.warning(f"Institution extracted as just 'University' - marking as incomplete")
                
                # Fix missing city for known institutions
                if item and item.get('institution') == 'Project Management Institute (PMI)':
                    if item.get('location') and not item['location'].get('city'):
                        # PMI headquarters is in Newtown Square, PA
                        item['location']['city'] = 'Newtown Square'
                        if not item['location'].get('state'):
                            item['location']['state'] = 'Pennsylvania'
                        logger.debug(f"Added known location for PMI: Newtown Square, PA")
        
        # Process certifications to infer missing fields of study
        elif section_name == 'certifications' and 'certificationItems' in data:
            for cert in data['certificationItems']:
                if cert:
                    title = cert.get('title', '')
                    org = cert.get('issuingOrganization', '')
                    # Try to infer field of study from certification title
                    inferred_field = infer_field_of_study(title, org)
                    if inferred_field and 'fieldOfStudy' not in cert:
                        cert['fieldOfStudy'] = inferred_field
                        logger.debug(f"Inferred field of study '{inferred_field}' for certification '{title}'")
        
        # Process contact to extract availability from summary if missing
        if section_name == 'contact' and not data.get('availability'):
            # This will be handled in _enhance_extracted_data when we have access to all sections
            pass
        
        return data
    
    async def _extract_single_section(self, section_name: str, raw_text: str) -> Dict[str, Any]:
        """Extract and validate a single CV section"""
        section_schema = self.section_schemas.get(section_name)
        prompt = self._create_section_prompt(section_name, section_schema, raw_text)
        
        try:
            model_used, response_text = await self._call_llm_with_retry(prompt, section_name)
            
            # Validate we got a response
            if not response_text:
                logger.warning(f"Empty response for section '{section_name}'")
                return {section_name: None}
            
            # Parse response based on model
            if model_used == "gemini":
                # Gemini with JSON mime type should return valid JSON
                try:
                    data = json.loads(response_text)
                except json.JSONDecodeError:
                    # Fallback: try to extract JSON
                    json_match = re.search(r'\{.*\}|\[.*\]', response_text, re.DOTALL)
                    if json_match:
                        data = json.loads(json_match.group())
                    else:
                        logger.warning(f"No valid JSON from Gemini for '{section_name}'")
                        return {section_name: None}
            else:  # Claude
                # Claude usually wraps JSON in text
                json_match = re.search(r'\{.*\}|\[.*\]', response_text, re.DOTALL)
                if not json_match:
                    logger.warning(f"No valid JSON from Claude for '{section_name}'")
                    return {section_name: None}
                data = json.loads(json_match.group())
            
            # Handle empty data
            if not data:
                return {section_name: None}
            
            # Normalize URLs before validation
            data = normalize_section_data(section_name, data)
            
            # Post-process location data
            data = self._post_process_locations(section_name, data)
            
            # Post-process roles and missing fields
            data = self._post_process_roles(section_name, data)
            
            # Special handling for certain sections
            if section_name == 'hobbies':
                hobbies_list = data if isinstance(data, list) else data.get('hobbies', [])
                return {'hobbies': HobbiesSection(
                    sectionTitle="Hobbies & Interests",
                    hobbies=hobbies_list if isinstance(hobbies_list, list) else []
                ).model_dump()}
            
            # Validate against schema
            if section_schema:
                validated = section_schema(**data)
                logger.info(f"Successfully extracted and validated section: {section_name}")
                return {section_name: validated.model_dump()}
            
            return {section_name: data}
            
        except (ValidationError, json.JSONDecodeError) as e:
            logger.error(f"Validation/parsing failed for section '{section_name}': {e}")
            return {section_name: None}
        except Exception as e:
            logger.error(f"Critical error during extraction of '{section_name}': {e}")
            return {section_name: None}
    
    def _deduplicate_certifications_courses(self, cv_data: CVData) -> CVData:
        """Remove duplicates between certifications and courses sections"""
        if not cv_data.certifications or not cv_data.courses:
            return cv_data
            
        cert_items = cv_data.certifications.certificationItems or []
        course_items = cv_data.courses.courseItems or []
        
        # Create a set of certification titles for comparison
        cert_titles = {cert.title.lower() for cert in cert_items if cert.title}
        
        # Filter courses to remove those that match certifications
        filtered_courses = []
        for course in course_items:
            if course.title and course.title.lower() not in cert_titles:
                filtered_courses.append(course)
        
        # Update courses if any were removed
        if len(filtered_courses) < len(course_items):
            cv_data.courses.courseItems = filtered_courses
            logger.info(f"Removed {len(course_items) - len(filtered_courses)} duplicate courses that were already in certifications")
        
        return cv_data
    
    async def extract_cv_data(self, raw_text: str) -> CVData:
        """
        Extract complete CV data using parallel processing.
        All sections processed with Claude Opus 4 for best quality.
        """
        if not raw_text or not raw_text.strip():
            logger.warning("Empty text provided for extraction")
            return CVData()
        
        logger.info(f"Starting CV data extraction (Gemini: {self.gemini_available}, Claude: {self.claude_available})")
        
        # Process all sections in parallel for speed
        tasks = [
            self._extract_single_section(section_name, raw_text)
            for section_name in self.section_schemas.keys()
        ]
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Combine results
        final_cv_data = {}
        failed_sections = []
        for i, result in enumerate(results):
            if isinstance(result, Exception):
                section_name = list(self.section_schemas.keys())[i]
                logger.error(f"Failed to extract section '{section_name}': {result}")
                failed_sections.append(section_name)
            elif result:
                final_cv_data.update(result)
        
        logger.info(f"Extraction complete. Sections found: {list(final_cv_data.keys())}")
        
        # Retry failed sections one by one (avoid rate limiting)
        if failed_sections:
            logger.warning(f"Retrying {len(failed_sections)} failed sections sequentially")
            for section_name in failed_sections:
                try:
                    result = await self._extract_single_section(section_name, raw_text)
                    if result:
                        final_cv_data.update(result)
                        logger.info(f"Successfully extracted '{section_name}' on retry")
                except Exception as e:
                    logger.error(f"Retry failed for '{section_name}': {e}")
        
        # Post-processing enhancements
        final_cv_data = self._enhance_extracted_data(final_cv_data, raw_text)
        
        # Create CVData object
        try:
            cv_data = CVData(**final_cv_data)
            # Deduplicate certifications and courses
            cv_data = self._deduplicate_certifications_courses(cv_data)
            
            # Validate dates and fix issues
            cv_data_dict = cv_data.model_dump()
            cv_data_dict, validation_issues = date_validator.validate_and_fix_cv_data(cv_data_dict)
            
            if validation_issues:
                logger.warning(f"Found {len(validation_issues)} validation issues")
                # Add validation report to the data
                cv_data_dict['_validation_issues'] = validation_issues
            
            # Recreate CVData with fixed data
            cv_data = CVData(**cv_data_dict)
            
            return cv_data
        except ValidationError as e:
            logger.error(f"Failed to create CVData object: {e}")
            # Return partial data
            return CVData(**{k: v for k, v in final_cv_data.items() 
                           if k in CVData.model_fields})
    
    def _enhance_extracted_data(self, data: Dict[str, Any], raw_text: str) -> Dict[str, Any]:
        """Post-process extracted data for quality enhancement"""
        enhanced = data.copy()
        
        # Extract dissertations from education and add to publications
        if enhanced.get('education') and enhanced['education'].get('educationItems'):
            dissertations_found = []
            for edu_item in enhanced['education']['educationItems']:
                if edu_item.get('relevantCoursework'):
                    for coursework in edu_item['relevantCoursework']:
                        if 'dissertation' in coursework.lower():
                            # Extract dissertation title and topic
                            dissertation_match = re.search(r'[Dd]issertation.*?["\'](.+?)["\']', coursework)
                            if dissertation_match:
                                dissertation_title = dissertation_match.group(1)
                                dissertations_found.append({
                                    'title': dissertation_title,
                                    'institution': edu_item.get('institution'),
                                    'degree': edu_item.get('degree'),
                                    'fieldOfStudy': edu_item.get('fieldOfStudy')
                                })
                                logger.debug(f"Found dissertation in education: {dissertation_title}")
            
            # Add dissertations to publications if not already there
            if dissertations_found:
                if not enhanced.get('publications'):
                    enhanced['publications'] = {
                        'sectionTitle': 'Publications & Research',
                        'publications': []
                    }
                elif not enhanced['publications'].get('publications'):
                    enhanced['publications']['publications'] = []
                
                # Check if dissertation already exists in publications
                existing_titles = {pub.get('title', '').lower() for pub in enhanced['publications']['publications'] if pub}
                
                for dissertation in dissertations_found:
                    if dissertation['title'].lower() not in existing_titles:
                        enhanced['publications']['publications'].append({
                            'title': dissertation['title'],
                            'authors': None,
                            'publicationType': 'Dissertation',
                            'journalName': dissertation.get('institution'),
                            'conferenceName': None,
                            'publicationDate': None,
                            'doi': None,
                            'publicationUrl': None,
                            'abstract': f"{dissertation.get('degree', 'Degree')} in {dissertation.get('fieldOfStudy', 'Field')}"
                        })
                        logger.info(f"Added dissertation to publications: {dissertation['title']}")
        
        # Extract availability from summary and add to contact if missing
        if enhanced.get('contact') and not enhanced['contact'].get('availability'):
            if enhanced.get('summary') and enhanced['summary'].get('summaryText'):
                summary_text = enhanced['summary']['summaryText']
                # Look for availability phrases
                availability_patterns = [
                    r'(Willing to travel[^.]*)',
                    r'(Available for remote work[^.]*)',
                    r'(Open to relocation[^.]*)',
                    r'(Available immediately[^.]*)',
                    r'(Currently seeking[^.]*)',
                    r'(Open to[^.]*opportunities)'
                ]
                
                for pattern in availability_patterns:
                    match = re.search(pattern, summary_text, re.IGNORECASE)
                    if match:
                        enhanced['contact']['availability'] = match.group(1).strip()
                        logger.debug(f"Extracted availability from summary: {match.group(1)}")
                        break
        
        # Optimize careerHighlights to avoid duplication with achievements
        if enhanced.get('summary') and enhanced['summary'].get('careerHighlights'):
            if enhanced.get('achievements') and enhanced['achievements'].get('achievements'):
                # If we have many achievements, limit careerHighlights to top 3-5 unique items
                highlights = enhanced['summary']['careerHighlights']
                if len(highlights) > 5:
                    # Keep only the most impactful highlights
                    enhanced['summary']['careerHighlights'] = highlights[:5]
                    logger.debug(f"Limited careerHighlights from {len(highlights)} to 5 items")
        
        # Apply smart deduplication
        try:
            from src.core.local.smart_deduplicator import smart_deduplicator
            enhanced = smart_deduplicator.deduplicate_cv_data(enhanced)
            
            # Log deduplication results if any
            if '_deduplication_report' in enhanced:
                report = enhanced.pop('_deduplication_report')
                if report['duplicates_found'] > 0:
                    logger.warning(f"Found and handled {report['duplicates_found']} duplicate achievements")
                    for dup in report['duplicate_groups']:
                        logger.debug(f"Duplicate: '{dup['text'][:60]}...' in {dup['sources']}")
        except Exception as e:
            logger.warning(f"Deduplication failed, continuing without it: {e}")
        
        # Enhance hero section with contact info
        if enhanced.get("contact") and not enhanced.get("hero"):
            # Create hero from contact if missing
            contact = enhanced["contact"]
            enhanced["hero"] = {
                "fullName": self._extract_name_from_text(raw_text) or "Professional",
                "professionalTitle": self._extract_title_from_text(raw_text) or "Professional",
                "summaryTagline": enhanced.get("summary", {}).get("summaryText", "")[:100] + "..."
                    if enhanced.get("summary") else "Experienced Professional"
            }
        
        # Ensure achievements have proper structure
        if enhanced.get("achievements"):
            achievements = enhanced["achievements"]
            if isinstance(achievements, list):
                # Convert list to proper structure
                enhanced["achievements"] = {
                    "sectionTitle": "Key Achievements",
                    "achievements": [
                        {"value": ach, "label": ach} if isinstance(ach, str) 
                        else ach for ach in achievements[:10]
                    ]
                }
        
        # Clean up empty sections
        enhanced = {k: v for k, v in enhanced.items() if v}
        
        return enhanced
    
    def _extract_name_from_text(self, text: str) -> Optional[str]:
        """Try to extract name from beginning of CV"""
        lines = text.strip().split('\n')[:5]  # Check first 5 lines
        
        for line in lines:
            line = line.strip()
            # Look for name patterns (2-3 capitalized words)
            if re.match(r'^[A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?$', line):
                return line
        
        return None
    
    def _extract_title_from_text(self, text: str) -> Optional[str]:
        """Try to extract professional title from CV"""
        lines = text.strip().split('\n')[:10]  # Check first 10 lines
        
        title_keywords = ['engineer', 'developer', 'manager', 'designer', 'analyst', 
                         'consultant', 'specialist', 'architect', 'lead', 'senior']
        
        for line in lines:
            line_lower = line.lower()
            if any(keyword in line_lower for keyword in title_keywords):
                return line.strip()
        
        return None


# Create singleton instance for easy import
data_extractor = DataExtractor()