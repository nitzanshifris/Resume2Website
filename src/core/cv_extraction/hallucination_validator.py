"""
Hallucination Validator for CV Data
Validates that extracted content exists in the original CV text
Prevents LLM from inventing or elaborating on data
"""
import logging
import re
from typing import Dict, Any, List, Tuple, Optional, Set
from difflib import SequenceMatcher

logger = logging.getLogger(__name__)


class HallucinationValidator:
    """Validates extracted CV data against original text to prevent hallucinations."""
    
    # Phrases that indicate potential hallucination/elaboration
    # Note: These will be normalized (punctuation removed) before matching
    HALLUCINATION_INDICATORS = [
        "demonstrating strong",
        "qualified for the excellence",
        "exceptional performance",
        "outstanding achievement",
        "recognized for",
        "awarded for",
        "honored with",
        "distinguished by",
        "selected based on",
        "chosen due to",
        "excelled in",
        "successfully completed",
        "effectively managed",
        "skillfully handled",
        "professionally executed",
        "strategically developed",
        "innovative approach",
        "cutting edge",  # Removed hyphen for better matching
        "state of the art",  # Removed hyphens for better matching
        "industry leading",  # Removed hyphen for better matching
        "best in class",  # Removed hyphens for better matching
        "world class",  # Removed hyphen for better matching
        "transformative",
        "revolutionary",
        "groundbreaking"
    ]
    
    @staticmethod
    def normalize_text(text: str) -> str:
        """Normalize text for comparison."""
        if not text:
            return ""
        # Remove extra whitespace, lowercase, remove punctuation for comparison
        text = re.sub(r'\s+', ' ', text.lower().strip())
        text = re.sub(r'[^\w\s]', '', text)
        return text
    
    @staticmethod
    def text_exists_in_original(extracted_text: str, original_text: str, threshold: float = 0.7) -> bool:
        """
        Check if extracted text substantially exists in original CV.
        
        Args:
            extracted_text: Text extracted by LLM
            original_text: Original CV text
            threshold: Similarity threshold (0.7 = 70% similar)
            
        Returns:
            True if text exists in original, False if likely hallucinated
        """
        if not extracted_text:
            return True  # Empty text is not hallucination
            
        extracted_norm = HallucinationValidator.normalize_text(extracted_text)
        original_norm = HallucinationValidator.normalize_text(original_text)
        
        # Short strings (< 10 chars) should match exactly
        if len(extracted_norm) < 10:
            return extracted_norm in original_norm
        
        # For longer strings, check if substantial portion exists
        # Split into words and check how many exist in original
        extracted_words = extracted_norm.split()
        if len(extracted_words) <= 3:
            # For short phrases, check if they appear contiguously
            # Join words back and check if the phrase exists as-is
            phrase = ' '.join(extracted_words)
            return phrase in original_norm
        
        # For longer text, use sequence matching
        # Check if we can find a similar sequence in the original
        matcher = SequenceMatcher(None, extracted_norm, original_norm)
        
        # Find longest matching subsequence
        match = matcher.find_longest_match(0, len(extracted_norm), 0, len(original_norm))
        
        # If more than threshold of the text matches, it's likely real
        if match.size >= len(extracted_norm) * threshold:
            return True
        
        # Alternative check: How many words from extracted exist in original?
        words_found = sum(1 for word in extracted_words if word in original_norm)
        word_ratio = words_found / len(extracted_words)
        
        return word_ratio >= threshold
    
    @staticmethod
    def contains_hallucination_indicators(text: str) -> bool:
        """Check if text contains common hallucination indicators."""
        if not text:
            return False
            
        # Normalize text like we do for indicators (remove punctuation)
        text_normalized = HallucinationValidator.normalize_text(text)
        return any(indicator in text_normalized for indicator in HallucinationValidator.HALLUCINATION_INDICATORS)
    
    @staticmethod
    def validate_section(section_data: Any, original_text: str, section_name: str) -> Tuple[Any, List[str]]:
        """
        Validate a section's data against original text.
        
        Args:
            section_data: The section data to validate
            original_text: Original CV text
            section_name: Name of the section for logging
            
        Returns:
            Tuple of (cleaned_data, list_of_issues)
        """
        issues = []
        
        if not section_data:
            return section_data, issues
        
        # Handle different data types
        if isinstance(section_data, str):
            if not HallucinationValidator.text_exists_in_original(section_data, original_text):
                issues.append(f"{section_name}: Potential hallucination detected - text not found in original")
                if HallucinationValidator.contains_hallucination_indicators(section_data):
                    issues.append(f"{section_name}: Contains hallucination indicators")
                    return "", issues  # Return empty string instead of hallucinated content
                    
        elif isinstance(section_data, dict):
            for key, value in section_data.items():
                if isinstance(value, str) and value:
                    # Special handling for contextOrDetail and description fields
                    if key in ['contextOrDetail', 'description', 'responsibilitiesAndAchievements']:
                        if not HallucinationValidator.text_exists_in_original(value, original_text, threshold=0.5):
                            issues.append(f"{section_name}.{key}: Potential hallucination - content not in original")
                            if HallucinationValidator.contains_hallucination_indicators(value):
                                section_data[key] = ""  # Clear hallucinated content
                                
        elif isinstance(section_data, list):
            cleaned_list = []
            for item in section_data:
                item_clean, item_issues = HallucinationValidator.validate_section(
                    item, original_text, f"{section_name}[item]"
                )
                issues.extend(item_issues)
                # Only keep items that have some valid content
                if item_clean and (not isinstance(item_clean, dict) or any(v for v in item_clean.values() if v)):
                    cleaned_list.append(item_clean)
            return cleaned_list, issues
                    
        return section_data, issues
    
    @staticmethod
    def validate_cv_data(cv_data: Dict[str, Any], original_text: str) -> Tuple[Dict[str, Any], List[str]]:
        """
        Validate entire CV data against original text.
        
        Args:
            cv_data: Extracted CV data dictionary
            original_text: Original CV text
            
        Returns:
            Tuple of (cleaned_cv_data, list_of_issues)
        """
        logger.info("Starting hallucination validation...")
        all_issues = []
        cleaned_data = cv_data.copy()
        
        # Validate each section
        sections_to_validate = [
            'summary', 'experience', 'education', 'skills', 'achievements',
            'certifications', 'projects', 'volunteer', 'languages', 'hobbies'
        ]
        
        for section in sections_to_validate:
            if section in cleaned_data and cleaned_data[section]:
                section_data, issues = HallucinationValidator.validate_section(
                    cleaned_data[section], original_text, section
                )
                cleaned_data[section] = section_data
                all_issues.extend(issues)
        
        # Special validation for achievements to prevent duplication
        if 'achievements' in cleaned_data and cleaned_data['achievements']:
            cleaned_achievements = HallucinationValidator._deduplicate_achievements(
                cleaned_data.get('achievements', {}),
                cleaned_data.get('education', {}),
                cleaned_data.get('volunteer', {}),
                original_text
            )
            cleaned_data['achievements'] = cleaned_achievements
        
        if all_issues:
            logger.warning(f"Hallucination validation found {len(all_issues)} issues")
            for issue in all_issues:
                logger.warning(f"  - {issue}")
        
        return cleaned_data, all_issues
    
    @staticmethod
    def _deduplicate_achievements(achievements: Any, education: Any, volunteer: Any, original_text: str) -> Any:
        """Remove achievements that duplicate data from other sections."""
        if not achievements:
            return achievements
            
        # Handle both dict and object formats
        if isinstance(achievements, dict):
            achievement_items = achievements.get('achievementItems', [])
        elif hasattr(achievements, 'achievementItems'):
            achievement_items = achievements.achievementItems or []
        else:
            return achievements
            
        cleaned_items = []
        education_text = str(education).lower() if education else ""
        volunteer_text = str(volunteer).lower() if volunteer else ""
        
        for item in achievement_items:
            if not item:
                continue
                
            # Handle both dict and object formats for item
            if isinstance(item, dict):
                item_text = str(item).lower()
                context_detail = item.get('contextOrDetail', '')
                value = item.get('value', '')
            else:
                item_text = str(item).lower()
                context_detail = getattr(item, 'contextOrDetail', '')
                value = getattr(item, 'value', '')
            
            # Skip if it's about GPA and already in education
            if 'gpa' in item_text and 'gpa' in education_text:
                logger.info(f"Removing duplicate GPA achievement")
                continue
                
            # Skip if it's about volunteering and already in volunteer section
            if any(word in item_text for word in ['volunteer', 'scout', 'community service']):
                if any(word in volunteer_text for word in ['volunteer', 'scout', 'community service']):
                    logger.info(f"Removing duplicate volunteer achievement")
                    continue
            
            # Skip if the contextOrDetail contains hallucinated elaboration
            if context_detail and HallucinationValidator.contains_hallucination_indicators(context_detail):
                logger.warning(f"Found hallucination indicator in achievement: {context_detail[:100]}...")
                # Try to keep the core fact but remove elaboration
                if value:
                    logger.info(f"Replacing hallucinated text with simple value: {value}")
                    if isinstance(item, dict):
                        item['contextOrDetail'] = value  # Just use the simple value
                    else:
                        item.contextOrDetail = value
                else:
                    logger.info(f"Removing achievement entirely - no simple value to keep")
                    continue  # Skip entirely if no simple value
            
            cleaned_items.append(item)
        
        # Update achievements with cleaned items
        if isinstance(achievements, dict):
            achievements['achievementItems'] = cleaned_items
        else:
            achievements.achievementItems = cleaned_items
        return achievements