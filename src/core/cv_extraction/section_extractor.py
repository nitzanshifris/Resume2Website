"""
Section Extraction Service for CV Data
Handles extraction of individual CV sections with clean separation of concerns
"""
import json
import re
import logging
from typing import Dict, Any, Optional, Type, Tuple
from pydantic import BaseModel, ValidationError

from .prompt_templates import prompt_registry
from .url_normalizer import normalize_section_data
from .location_processor import location_processor
from .role_inferencer import infer_project_role, infer_speaking_event_name, infer_field_of_study
from .extraction_config import extraction_config
from .text_parsing import safe_iter_dicts

# Import schemas
from src.core.schemas.unified_nullable import HobbiesSection

logger = logging.getLogger(__name__)


class SectionExtractor:
    """Extracts and processes individual CV sections."""
    
    def __init__(self, section_schemas: Dict[str, Type[BaseModel]]):
        """Initialize with section schema mapping."""
        self.section_schemas = section_schemas
    
    async def extract(self, section_name: str, raw_text: str, 
                      llm_caller) -> Dict[str, Any]:
        """
        Extract a single CV section.
        
        Args:
            section_name: Name of the section to extract
            raw_text: Raw CV text
            llm_caller: Async function to call LLM
            
        Returns:
            Dictionary with section_name as key and extracted data as value
        """
        try:
            # Get schema and create prompt
            section_schema = self.section_schemas.get(section_name)
            prompt = prompt_registry.create_prompt(section_name, section_schema, raw_text)
            
            # Call LLM
            model_used, response_text = await llm_caller(prompt, section_name)
            
            # Parse response
            parsed_data = self.parse_llm_response(model_used, response_text, section_name)
            if not parsed_data:
                return {section_name: None}
            
            # Apply all processing steps
            processed_data = self.apply_processing_pipeline(section_name, parsed_data)
            
            # Validate against schema
            validated_data = self.validate_section(section_name, processed_data, section_schema)
            
            return {section_name: validated_data}
            
        except Exception as e:
            logger.error(f"Critical error during extraction of '{section_name}': {e}")
            return {section_name: None}
    
    def parse_llm_response(self, model_used: str, response_text: str, 
                          section_name: str) -> Optional[Dict[str, Any]]:
        """
        Parse LLM response into JSON data.
        
        Args:
            model_used: Which model was used (gemini/claude)
            response_text: Raw response from LLM
            section_name: Section being parsed (for logging)
            
        Returns:
            Parsed JSON data or None if parsing fails
        """
        if not response_text:
            logger.warning(f"Empty response for section '{section_name}'")
            return None
        
        def extract_json_object(text: str) -> Optional[str]:
            """Extract the first valid JSON object from text using brace counting"""
            start_idx = text.find('{')
            if start_idx == -1:
                return None
            
            brace_count = 0
            in_string = False
            escape_next = False
            
            for i in range(start_idx, len(text)):
                char = text[i]
                
                if escape_next:
                    escape_next = False
                    continue
                    
                if char == '\\':
                    escape_next = True
                    continue
                    
                if char == '"' and not escape_next:
                    in_string = not in_string
                    continue
                    
                if not in_string:
                    if char == '{':
                        brace_count += 1
                    elif char == '}':
                        brace_count -= 1
                        if brace_count == 0:
                            return text[start_idx:i+1]
            
            return None
        
        try:
            # Try direct parsing first
            if model_used == "gemini":
                try:
                    data = json.loads(response_text)
                    return data
                except json.JSONDecodeError:
                    pass
            
            # Extract JSON object using brace counting
            json_str = extract_json_object(response_text)
            if json_str:
                data = json.loads(json_str)
                return data
            
            # Fallback: try array extraction
            if '[' in response_text:
                start_idx = response_text.find('[')
                bracket_count = 0
                for i in range(start_idx, len(response_text)):
                    if response_text[i] == '[':
                        bracket_count += 1
                    elif response_text[i] == ']':
                        bracket_count -= 1
                        if bracket_count == 0:
                            array_str = response_text[start_idx:i+1]
                            data = json.loads(array_str)
                            return data
            
            logger.warning(f"No valid JSON found for section '{section_name}'")
            return None
            
        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing failed for section '{section_name}': {e}")
            return None
    
    def apply_processing_pipeline(self, section_name: str, 
                                 data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Apply all processing steps to extracted data.
        
        Args:
            section_name: Name of the section
            data: Raw extracted data
            
        Returns:
            Processed data
        """
        if not data:
            return data
        
        # 1. Normalize URLs
        data = normalize_section_data(section_name, data)
        
        # 2. Process locations
        data = location_processor.process_section_locations(section_name, data)
        
        # 3. Process additional location-related fields
        data = self._process_additional_fields(section_name, data)
        
        # 4. Process roles and infer missing fields
        data = self._process_roles(section_name, data)
        
        return data
    
    def _process_additional_fields(self, section_name: str, 
                                  data: Dict[str, Any]) -> Dict[str, Any]:
        """Process non-location fields that were in _post_process_locations."""
        if not data:
            return data
        
        # Process years of experience in summary
        if section_name == 'summary':
            if 'summaryText' in data:
                from .text_parsing import parse_year_range
                years, qualifier = parse_year_range(data['summaryText'])
                if years and 'yearsOfExperience' not in data:
                    data['yearsOfExperience'] = years
                elif years and isinstance(data.get('yearsOfExperience'), str):
                    data['yearsOfExperience'] = years
            
            # Handle yearsOfExperience field directly
            if 'yearsOfExperience' in data and isinstance(data['yearsOfExperience'], str):
                from .text_parsing import parse_year_range
                years, qualifier = parse_year_range(data['yearsOfExperience'])
                if years:
                    data['yearsOfExperience'] = years
                    if qualifier == 'more_than':
                        data['yearsOfExperienceQualifier'] = 'more_than'
        
        # Process professional links in contact
        elif section_name == 'contact' and 'professionalLinks' in data and data['professionalLinks']:
            for link in data['professionalLinks']:
                if isinstance(link, dict):
                    if not link.get('url') or link.get('url') == 'Not available':
                        link['url'] = 'Not available (extracted from image)'
        
        # Extract technologies from experience
        elif section_name == 'experience' and 'experienceItems' in data:
            for item in safe_iter_dicts(data['experienceItems']):
                if 'responsibilitiesAndAchievements' in item and not item.get('technologiesUsed'):
                    found_techs = set()
                    for resp in item['responsibilitiesAndAchievements']:
                        for compiled_pattern in extraction_config.get_compiled_tech_patterns():
                            matches = compiled_pattern.findall(resp)
                            found_techs.update(matches)
                    
                    if found_techs:
                        item['technologiesUsed'] = list(found_techs)
                        logger.debug(f"Extracted technologies for {item.get('jobTitle', 'Unknown')}: {found_techs}")
        
        # Deduplicate skills (case-insensitive)
        elif section_name == 'skills':
            if 'skillCategories' in data and data['skillCategories']:
                for category in safe_iter_dicts(data['skillCategories']):
                    if 'skills' in category and category['skills']:
                        # Deduplicate while preserving first occurrence's case
                        seen = {}
                        deduped = []
                        for skill in category['skills']:
                            skill_lower = skill.lower() if isinstance(skill, str) else str(skill).lower()
                            if skill_lower not in seen:
                                seen[skill_lower] = True
                                deduped.append(skill)
                        category['skills'] = deduped
            
            if 'ungroupedSkills' in data and data['ungroupedSkills']:
                # Deduplicate ungrouped skills
                seen = {}
                deduped = []
                for skill in data['ungroupedSkills']:
                    skill_lower = skill.lower() if isinstance(skill, str) else str(skill).lower()
                    if skill_lower not in seen:
                        seen[skill_lower] = True
                        deduped.append(skill)
                data['ungroupedSkills'] = deduped
        
        return data
    
    def _process_roles(self, section_name: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Process data to infer missing roles and fields."""
        if not data:
            return data
        
        # Process projects to infer missing roles
        if section_name == 'projects' and 'projectItems' in data:
            for project in safe_iter_dicts(data['projectItems']):
                if not project.get('role'):
                    title = project.get('title', '')
                    description = project.get('description', '')
                    inferred_role = infer_project_role(title, description)
                    if inferred_role:
                        project['role'] = inferred_role
                        logger.debug(f"Inferred role '{inferred_role}' for project '{title}'")
        
        # Process speaking engagements
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
        
        # Process education
        elif section_name == 'education' and 'educationItems' in data:
            for item in safe_iter_dicts(data['educationItems']):
                if not item.get('fieldOfStudy'):
                    degree = item.get('degree', '')
                    institution = item.get('institution', '')
                    inferred_field = infer_field_of_study(degree, institution)
                    if inferred_field:
                        item['fieldOfStudy'] = inferred_field
                        logger.debug(f"Inferred field of study '{inferred_field}' for degree '{degree}'")
                
                # Fix common extraction errors with institution names
                if item and item.get('institution'):
                    inst = item['institution']
                    if inst and isinstance(inst, str):
                        # Fix "University Newtown Square University" -> "Newtown Square University"
                        if inst.startswith('University ') and inst.endswith(' University'):
                            item['institution'] = inst[11:]
                            logger.debug(f"Fixed institution name: {inst} -> {item['institution']}")
                        # Fix when only "University" is extracted
                        elif inst == 'University' or inst.lower() == 'university':
                            item['institution'] = '[University Name Not Extracted]'
                            logger.warning(f"Institution extracted as just 'University' - marking as incomplete")
                
                # Fix missing city for known institutions
                for known_inst, location_info in extraction_config.KNOWN_INSTITUTIONS.items():
                    if item and item.get('institution') == known_inst:
                        if item.get('location') and not item['location'].get('city'):
                            item['location']['city'] = location_info['city']
                            if not item['location'].get('state'):
                                item['location']['state'] = location_info['state']
                            logger.debug(f"Added known location for {known_inst}")
        
        # Process certifications
        elif section_name == 'certifications' and 'certificationItems' in data:
            for cert in safe_iter_dicts(data['certificationItems']):
                if cert:
                    title = cert.get('title', '')
                    org = cert.get('issuingOrganization', '')
                    inferred_field = infer_field_of_study(title, org)
                    if inferred_field and 'fieldOfStudy' not in cert:
                        cert['fieldOfStudy'] = inferred_field
                        logger.debug(f"Inferred field of study '{inferred_field}' for certification '{title}'")
        
        return data
    
    def validate_section(self, section_name: str, data: Dict[str, Any], 
                        section_schema: Optional[Type[BaseModel]]) -> Any:
        """
        Validate section data against schema.
        
        Args:
            section_name: Name of the section
            data: Processed data to validate
            section_schema: Pydantic schema for validation
            
        Returns:
            Validated data or original data if no schema
        """
        # Special handling for hobbies section
        if section_name == 'hobbies':
            hobbies_list = data if isinstance(data, list) else data.get('hobbies', [])
            return HobbiesSection(
                sectionTitle="Hobbies & Interests",
                hobbies=hobbies_list if isinstance(hobbies_list, list) else []
            ).model_dump()
        
        # Validate against schema if available
        if section_schema:
            try:
                validated = section_schema(**data)
                logger.info(f"Successfully extracted and validated section: {section_name}")
                return validated.model_dump()
            except ValidationError as e:
                logger.error(f"Validation failed for section '{section_name}': {e}")
                return None
        
        return data


# Create singleton instance
section_extractor = SectionExtractor({})