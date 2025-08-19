"""
Enhancement Processing Service for CV Data
Handles post-extraction data enhancement and enrichment
"""
import re
import logging
from typing import Dict, Any, List, Optional

from .extraction_config import extraction_config
from .text_parsing import parse_year_range
from .demographic_extractor import demographic_extractor

logger = logging.getLogger(__name__)

# URL pattern definitions for categorization
URL_PATTERNS = {
    'github': r'^https?://github\.com/[\w-]+/[\w-]+/?$',
    'youtube': r'(?:youtube\.com/watch\?v=|youtu\.be/|youtube\.com/embed/)',
    'vimeo': r'vimeo\.com/(?:channels/(?:\w+/)?|groups/(?:[^/]*/)?|video/)?(\d+)',
    'image': r'\.(jpg|jpeg|png|gif|webp|svg|bmp)(?:\?.*)?$',
    'tweet': r'(?:twitter\.com|x\.com)/\w+/status/\d+',
    'linkedin': r'linkedin\.com/in/[\w-]+',
    'pdf': r'\.pdf(?:\?.*)?$',
    'video': r'\.(mp4|webm|ogg|mov|avi)(?:\?.*)?$'
}


class EnhancementProcessor:
    """Processes and enhances extracted CV data with additional intelligence."""
    
    @staticmethod
    def extract_dissertations_to_publications(enhanced: Dict[str, Any]) -> Dict[str, Any]:
        """
        Extract dissertations from education and add to publications.
        
        Args:
            enhanced: The CV data dictionary
            
        Returns:
            Enhanced data with dissertations added to publications
        """
        if not enhanced.get('education') or not isinstance(enhanced['education'], dict):
            return enhanced
        
        education_items = enhanced['education'].get('educationItems', [])
        if not isinstance(education_items, list):
            return enhanced
        
        dissertations_found = []
        
        for edu_item in education_items:
            if not isinstance(edu_item, dict):
                continue
                
            if edu_item.get('relevantCoursework'):
                for coursework in edu_item['relevantCoursework']:
                    if coursework and isinstance(coursework, str) and 'dissertation' in coursework.lower():
                        # Extract dissertation title and topic
                        dissertation_match = re.search(r'[Dd]issertation.*?["\'](.*?)["\']', coursework)
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
                if dissertation.get('title') and dissertation['title'].lower() not in existing_titles:
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
        
        return enhanced
    
    @staticmethod
    def extract_availability_from_summary(enhanced: Dict[str, Any]) -> Dict[str, Any]:
        """
        Extract availability information from summary and add to contact.
        
        Args:
            enhanced: The CV data dictionary
            
        Returns:
            Enhanced data with availability added to contact
        """
        if not enhanced.get('contact') or enhanced.get('contact', {}).get('availability'):
            return enhanced
        
        if not enhanced.get('summary') or not enhanced['summary'].get('summaryText'):
            return enhanced
        
        summary_text = enhanced['summary']['summaryText']
        
        # Look for availability phrases using compiled patterns
        for pattern in extraction_config.get_compiled_availability_patterns():
            match = pattern.search(summary_text)
            if match:
                enhanced['contact']['availability'] = match.group(1).strip()
                logger.debug(f"Extracted availability from summary: {match.group(1)}")
                break
        
        return enhanced
    
    @staticmethod
    def optimize_career_highlights(enhanced: Dict[str, Any]) -> Dict[str, Any]:
        """
        Optimize careerHighlights to avoid duplication with achievements.
        
        Args:
            enhanced: The CV data dictionary
            
        Returns:
            Enhanced data with optimized career highlights
        """
        if not enhanced.get('summary') or not enhanced['summary'].get('careerHighlights'):
            return enhanced
        
        if not enhanced.get('achievements') or not enhanced['achievements'].get('achievements'):
            return enhanced
        
        # If we have many achievements, limit careerHighlights using config
        highlights = enhanced['summary']['careerHighlights']
        if len(highlights) > extraction_config.MAX_CAREER_HIGHLIGHTS:
            # Keep only the most impactful highlights
            enhanced['summary']['careerHighlights'] = highlights[:extraction_config.MAX_CAREER_HIGHLIGHTS]
            logger.debug(f"Limited careerHighlights from {len(highlights)} to {extraction_config.MAX_CAREER_HIGHLIGHTS} items")
        
        return enhanced
    
    @staticmethod
    def apply_smart_deduplication(enhanced: Dict[str, Any]) -> Dict[str, Any]:
        """
        Apply smart deduplication for achievements and other sections.
        
        Args:
            enhanced: The CV data dictionary
            
        Returns:
            Enhanced data with duplicates removed
        """
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
            logger.warning(f"Achievement deduplication failed, continuing without it: {e}")
        
        return enhanced
    
    @staticmethod
    def extract_years_of_experience_from_summary(enhanced: Dict[str, Any]) -> Dict[str, Any]:
        """
        Extract years of experience from summary text if not already present.
        
        Args:
            enhanced: The CV data dictionary
            
        Returns:
            Enhanced data with years of experience extracted
        """
        if not enhanced.get('summary'):
            return enhanced
        
        summary = enhanced['summary']
        
        # Extract from summary text if not already present
        if summary.get('summaryText') and not summary.get('yearsOfExperience'):
            years, qualifier = parse_year_range(summary['summaryText'])
            if years:
                summary['yearsOfExperience'] = years
                if qualifier == 'more_than':
                    summary['yearsOfExperienceQualifier'] = 'more_than'
                logger.debug(f"Extracted {years} years of experience from summary text")
        
        return enhanced
    
    @staticmethod
    def ensure_achievements_structure(enhanced: Dict[str, Any]) -> Dict[str, Any]:
        """
        Ensure achievements have proper structure.
        
        Args:
            enhanced: The CV data dictionary
            
        Returns:
            Enhanced data with properly structured achievements
        """
        if not enhanced.get("achievements"):
            return enhanced
        
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
            logger.debug("Converted achievements list to proper structure")
        
        return enhanced
    
    @staticmethod
    def extract_name_from_text(text: str) -> Optional[str]:
        """Try to extract name from beginning of CV"""
        lines = text.strip().split('\n')[:extraction_config.MAX_LINES_FOR_NAME]
        
        for line in lines:
            line = line.strip()
            # Look for name patterns using compiled pattern
            if extraction_config.get_compiled_name_pattern().match(line):
                return line
        
        return None
    
    @staticmethod
    def extract_title_from_text(text: str) -> Optional[str]:
        """Try to extract professional title from CV"""
        lines = text.strip().split('\n')[:extraction_config.MAX_LINES_FOR_TITLE]
        
        for line in lines:
            line_lower = line.lower()
            if any(keyword in line_lower for keyword in extraction_config.TITLE_KEYWORDS):
                return line.strip()
        
        return None
    
    @staticmethod
    def create_hero_if_missing(enhanced: Dict[str, Any], raw_text: str) -> Dict[str, Any]:
        """Create hero section from contact info if missing"""
        # DISABLED: No default values or inference allowed
        # if enhanced.get("contact") and not enhanced.get("hero"):
        #     contact = enhanced["contact"]
        #     enhanced["hero"] = {
        #         "fullName": EnhancementProcessor.extract_name_from_text(raw_text) or "Professional",
        #         "professionalTitle": EnhancementProcessor.extract_title_from_text(raw_text) or "Professional"
        #     }
        return enhanced
    
    @staticmethod
    def filter_technologies_in_experience(enhanced: Dict[str, Any]) -> Dict[str, Any]:
        """
        Filter and validate technologies in experience items.
        Remove generic terms and ensure only valid tech is included.
        """
        # List of generic terms to exclude
        EXCLUDED_TERMS = {
            'teams', 'team', 'office', 'computer', 'software', 'systems', 
            'system', 'data', 'management', 'project', 'process', 'business',
            'communication', 'collaboration', 'leadership', 'analysis',
            'documentation', 'requirements', 'testing', 'development',
            'implementation', 'design', 'architecture', 'infrastructure'
        }
        
        # Common tech terms that should be preserved even if they contain excluded words
        TECH_WHITELIST = {
            'microsoft teams', 'ms teams', 'team foundation server', 'tfs',
            'systems manager', 'aws systems manager', 'office 365', 'ms office',
            'data science', 'data engineering', 'database', 'data warehouse',
            'project server', 'software engineering', 'system design',
            'test automation', 'infrastructure as code'
        }
        
        if not enhanced.get('experience') or not isinstance(enhanced['experience'], dict):
            return enhanced
            
        experience_items = enhanced['experience'].get('experienceItems', [])
        if not isinstance(experience_items, list):
            return enhanced
            
        for item in experience_items:
            if not isinstance(item, dict) or not item.get('technologiesUsed'):
                continue
                
            if not isinstance(item['technologiesUsed'], list):
                continue
                
            # Filter technologies
            filtered_techs = []
            for tech in item['technologiesUsed']:
                if not tech or not isinstance(tech, str):
                    continue
                    
                tech_lower = tech.lower().strip()
                
                # Skip if it's a single excluded word
                if tech_lower in EXCLUDED_TERMS:
                    logger.debug(f"Filtering out generic term: {tech}")
                    continue
                    
                # Check if it's in whitelist (preserve even if contains excluded words)
                if any(whitelist_term in tech_lower for whitelist_term in TECH_WHITELIST):
                    filtered_techs.append(tech)
                    continue
                    
                # Check if all words in the tech are excluded terms
                words = tech_lower.split()
                if all(word in EXCLUDED_TERMS for word in words):
                    logger.debug(f"Filtering out phrase with all generic terms: {tech}")
                    continue
                    
                # Keep the technology
                filtered_techs.append(tech)
            
            # Remove duplicates while preserving order
            seen = set()
            unique_techs = []
            for tech in filtered_techs:
                tech_normalized = tech.lower().strip()
                if tech_normalized not in seen:
                    seen.add(tech_normalized)
                    unique_techs.append(tech)
            
            # Update the technologies list
            item['technologiesUsed'] = unique_techs if unique_techs else None
            
        return enhanced
    
    @staticmethod
    def classify_url(url: str) -> str:
        """
        Classify a URL by its type.
        Returns: 'github', 'youtube', 'vimeo', 'image', 'tweet', 'pdf', 'video', or 'website'
        """
        if not url:
            return 'website'
            
        url_lower = url.lower()
        
        # Check each pattern
        for url_type, pattern in URL_PATTERNS.items():
            if re.search(pattern, url_lower, re.IGNORECASE):
                return url_type
                
        # Default to website
        return 'website'
    
    @staticmethod
    def extract_urls_from_text(text: str) -> List[str]:
        """Extract all URLs from a text string."""
        if not text:
            return []
            
        # Comprehensive URL regex pattern
        url_pattern = r'https?://(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&/=]*)'
        urls = re.findall(url_pattern, text)
        
        # Clean and deduplicate
        return list(set(url.strip() for url in urls))
    
    @staticmethod
    def determine_view_mode(item: Dict[str, Any], section_name: str) -> str:
        """
        Determine the best view mode for a smart card item.
        Special cases:
        - Education/Experience: Always 'timeline'
        - Hobbies: Default textVariant='simple'
        - Others: Based on URL type
        """
        # Special case for Education and Experience
        if section_name in ['education', 'experience']:
            return 'timeline'
        
        # Check for video URLs first (highest priority)
        if item.get('videoUrl'):
            return 'video'
        
        # Check for GitHub
        if item.get('githubUrl'):
            return 'github'
        
        # Check for images
        if item.get('imageUrl'):
            return 'images'
        
        # Check for general links
        for url_field in ['linkUrl', 'projectUrl', 'verificationUrl', 'publicationUrl', 
                         'eventUrl', 'presentationUrl', 'certificateUrl']:
            url = item.get(url_field)
            if url:
                url_type = EnhancementProcessor.classify_url(url)
                if url_type == 'tweet':
                    return 'tweet'
                elif url_type in ['youtube', 'vimeo', 'video']:
                    return 'video'
                elif url_type == 'github':
                    return 'github'
                elif url_type == 'image':
                    return 'images'
                else:
                    return 'uri'
        
        # Default to text
        return 'text'
    
    @staticmethod
    def set_text_variant(section_name: str) -> str:
        """
        Set appropriate text variant for each section.
        Hobbies uses 'simple', all others use 'detailed'.
        """
        return 'simple' if section_name == 'hobbies' else 'detailed'
    
    @staticmethod
    def process_smart_card_urls(item: Dict[str, Any], section_name: str) -> Dict[str, Any]:
        """
        Process URLs for a smart card item.
        Sets hasLink, linkType, viewMode, and textVariant.
        """
        if not isinstance(item, dict):
            return item
            
        # Check all URL fields
        url_fields = ['projectUrl', 'linkUrl', 'videoUrl', 'githubUrl', 'imageUrl',
                     'verificationUrl', 'publicationUrl', 'eventUrl', 'presentationUrl',
                     'certificateUrl', 'url']
        
        has_any_url = False
        primary_url = None
        primary_url_type = None
        
        # Find the primary URL and its type
        for field in url_fields:
            url = item.get(field)
            if url:
                has_any_url = True
                if not primary_url:  # First URL found becomes primary
                    primary_url = url
                    primary_url_type = EnhancementProcessor.classify_url(url)
                
                # Special handling for specific URL types
                if field == 'videoUrl':
                    primary_url_type = 'video'
                    primary_url = url
                    break
                elif field == 'githubUrl':
                    primary_url_type = 'github'
                    primary_url = url
                    break
        
        # Extract URLs from description if no explicit URLs found
        if not has_any_url and item.get('description'):
            urls = EnhancementProcessor.extract_urls_from_text(item['description'])
            if urls:
                has_any_url = True
                primary_url = urls[0]
                primary_url_type = EnhancementProcessor.classify_url(primary_url)
                
                # Set appropriate URL field based on type
                if primary_url_type == 'video':
                    item['videoUrl'] = primary_url
                elif primary_url_type == 'github':
                    item['githubUrl'] = primary_url
                elif primary_url_type == 'image':
                    item['imageUrl'] = primary_url
                else:
                    item['linkUrl'] = primary_url
        
        # Set smart card fields
        item['hasLink'] = has_any_url
        item['linkType'] = primary_url_type if has_any_url else None
        item['viewMode'] = EnhancementProcessor.determine_view_mode(item, section_name)
        item['textVariant'] = EnhancementProcessor.set_text_variant(section_name)
        
        return item
    
    @staticmethod
    def enhance_all_smart_card_sections(enhanced: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process all sections that use smart cards to add URL metadata.
        """
        # Define sections and their item field names
        smart_card_sections = {
            'experience': 'experienceItems',
            'education': 'educationItems',
            'projects': 'projectItems',
            'achievements': 'achievements',
            'certifications': 'certificationItems',
            'volunteer': 'volunteerItems',
            'courses': 'courseItems',
            'publications': 'publications',
            'speaking': 'speakingEngagements',
            'memberships': 'memberships',
            'hobbies': 'hobbyItems'
        }
        
        for section_name, items_field in smart_card_sections.items():
            section = enhanced.get(section_name)
            if section and isinstance(section, dict):
                items = section.get(items_field)
                if items and isinstance(items, list):
                    # Process each item
                    for i, item in enumerate(items):
                        items[i] = EnhancementProcessor.process_smart_card_urls(item, section_name)
        
        return enhanced
    
    @staticmethod
    def enhance_all(data: Dict[str, Any], raw_text: str) -> Dict[str, Any]:
        """
        Apply all enhancement processors to the extracted data.
        
        Args:
            data: The extracted CV data
            raw_text: The original CV text
            
        Returns:
            Fully enhanced CV data
        """
        if data is None:
            logger.error("enhance_all received None data")
            return {}
        
        enhanced = data.copy()
        
        # Apply all enhancement processors in sequence
        enhanced = EnhancementProcessor.extract_dissertations_to_publications(enhanced)
        enhanced = EnhancementProcessor.extract_availability_from_summary(enhanced)
        enhanced = EnhancementProcessor.optimize_career_highlights(enhanced)
        enhanced = EnhancementProcessor.apply_smart_deduplication(enhanced)
        enhanced = EnhancementProcessor.extract_years_of_experience_from_summary(enhanced)
        enhanced = EnhancementProcessor.ensure_achievements_structure(enhanced)
        # Patents and memberships now extracted directly in achievements section
        enhanced = EnhancementProcessor.create_hero_if_missing(enhanced, raw_text)
        enhanced = EnhancementProcessor.filter_technologies_in_experience(enhanced)
        enhanced = EnhancementProcessor.enhance_all_smart_card_sections(enhanced)
        
        # Apply demographic enhancements
        if enhanced.get('contact'):
            logger.info(f"Contact before demographics: {enhanced['contact'].keys()}")
            enhanced['contact'] = demographic_extractor.enhance_contact_with_demographics(
                enhanced['contact'], raw_text
            )
            logger.info(f"Contact after demographics: {enhanced['contact'].keys()}")
        
        # Merge externships into experience
        if 'experience' in enhanced or 'externship' in raw_text.lower():
            enhanced['experience'] = demographic_extractor.merge_externships_to_experience(
                enhanced.get('experience', {}), raw_text
            )
        
        # Add extra-curricular activities to volunteer section
        if 'volunteer' in enhanced or 'extra' in raw_text.lower() or 'activities' in raw_text.lower():
            enhanced['volunteer'] = demographic_extractor.enhance_volunteer_with_activities(
                enhanced.get('volunteer', {}), raw_text
            )
        
        # Clean up empty sections
        enhanced = {k: v for k, v in enhanced.items() if v}
        
        return enhanced


# Create singleton instance
enhancement_processor = EnhancementProcessor()