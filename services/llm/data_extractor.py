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

# Import schemas
from backend.schemas.unified import (
    CVData, HeroSection, ProfessionalSummaryOverview, ExperienceSection, 
    EducationSection, SkillsSection, ProjectsSection, 
    CertificationsSection, AchievementsSection,
    VolunteerExperienceSection, LanguagesSection, ContactSectionFooter, 
    CoursesSection, HobbiesSection, PublicationsResearchSection,
    SpeakingEngagementsSection, PatentsSection, ProfessionalMembershipsSection
)

# Import Keychain manager if available
try:
    from services.local.keychain_manager import (
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
                """Extract ALL speaking engagements, presentations, and talks.
Include:
- Event name and organizer
- Topic/title of presentation
- Date and location
- Audience size/type if mentioned
- Key topics covered"""
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
        
        return base_prompt
    
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
        
        results = await asyncio.gather(*tasks)
        
        # Combine results
        final_cv_data = {}
        for result in results:
            if result:
                final_cv_data.update(result)
        
        logger.info(f"Extraction complete. Sections found: {list(final_cv_data.keys())}")
        
        # Post-processing enhancements
        final_cv_data = self._enhance_extracted_data(final_cv_data, raw_text)
        
        # Create CVData object
        try:
            return CVData(**final_cv_data)
        except ValidationError as e:
            logger.error(f"Failed to create CVData object: {e}")
            # Return partial data
            return CVData(**{k: v for k, v in final_cv_data.items() 
                           if k in CVData.model_fields})
    
    def _enhance_extracted_data(self, data: Dict[str, Any], raw_text: str) -> Dict[str, Any]:
        """Post-process extracted data for quality enhancement"""
        enhanced = data.copy()
        
        # Apply smart deduplication
        try:
            from services.local.smart_deduplicator import smart_deduplicator
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