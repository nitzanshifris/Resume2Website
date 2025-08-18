"""
Post-Processing Service for CV Data
Handles final processing, validation, and quality checks
"""
import logging
from typing import Dict, Any, List, Tuple, Optional

from .extraction_config import extraction_config
from .date_validator import date_validator

# Import schemas
from src.core.schemas.unified_nullable import CVData

logger = logging.getLogger(__name__)


class PostProcessor:
    """Handles post-processing of extracted CV data."""
    
    @staticmethod
    def deduplicate_certifications_courses(cv_data: CVData) -> CVData:
        """
        Remove duplicates between certifications and courses sections.
        
        Args:
            cv_data: The CV data object
            
        Returns:
            CV data with duplicates removed
        """
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
    
    @staticmethod
    def validate_and_fix_dates(cv_data_dict: Dict[str, Any]) -> Tuple[Dict[str, Any], List[str]]:
        """
        Validate and fix date issues in CV data.
        
        Args:
            cv_data_dict: The CV data as dictionary
            
        Returns:
            Tuple of (fixed data dict, list of validation issues)
        """
        cv_data_dict, validation_issues = date_validator.validate_and_fix_cv_data(cv_data_dict)
        
        if validation_issues:
            logger.warning(f"Found {len(validation_issues)} date validation issues")
            # Log validation issues for debugging instead of embedding in data
            for issue in validation_issues:
                logger.debug(f"Date validation issue: {issue}")
        
        return cv_data_dict, validation_issues
    
    @staticmethod
    def calculate_extraction_confidence(cv_data: Any, raw_text: str) -> float:
        """
        Calculate confidence score for extraction quality (0.0-1.0).
        
        Args:
            cv_data: The extracted CV data
            raw_text: The original CV text
            
        Returns:
            Confidence score between 0.0 and 1.0
        """
        try:
            if not cv_data:
                return 0.0
                
            sections = cv_data.model_dump_nullable() if hasattr(cv_data, 'model_dump_nullable') else cv_data
            
            # 1. Data completeness (using config weight)
            non_null_sections = len([v for v in sections.values() if v is not None and v != {}])
            completeness_score = min(non_null_sections / extraction_config.TOTAL_SECTIONS, 1.0) * extraction_config.CONFIDENCE_WEIGHTS['completeness']
            
            # 2. Text coverage (using config weight) - estimate how much of original text is represented
            extracted_text_length = PostProcessor._estimate_extracted_text_length(sections)
            coverage_score = min(extracted_text_length / len(raw_text), 1.0) * extraction_config.CONFIDENCE_WEIGHTS['coverage']
            
            # 3. Validation quality (using config weight) - using existing validation
            _, validation_issues = date_validator.validate_and_fix_cv_data(sections)
            validation_score = max(0, 1.0 - len(validation_issues) / 10) * extraction_config.CONFIDENCE_WEIGHTS['validation']
            
            total_score = completeness_score + coverage_score + validation_score
            
            # Use actual weights from config for logging
            c_weight = extraction_config.CONFIDENCE_WEIGHTS['completeness']
            cov_weight = extraction_config.CONFIDENCE_WEIGHTS['coverage']
            val_weight = extraction_config.CONFIDENCE_WEIGHTS['validation']
            
            logger.info(f"Confidence calculated: {total_score:.2f} "
                       f"(completeness: {completeness_score/c_weight:.2f}, "
                       f"coverage: {coverage_score/cov_weight:.2f}, "
                       f"validation: {validation_score/val_weight:.2f})")
            
            return total_score
            
        except Exception as e:
            logger.warning(f"Failed to calculate confidence score: {e}")
            return 0.5  # Default moderate confidence
    
    @staticmethod
    def _estimate_extracted_text_length(sections: dict) -> int:
        """
        Estimate total character count of extracted text.
        
        Args:
            sections: Dictionary of CV sections
            
        Returns:
            Estimated character count
        """
        total_chars = 0
        
        try:
            for section_name, section_data in sections.items():
                if not section_data:
                    continue
                    
                # Convert to string and count approximate characters
                if isinstance(section_data, dict):
                    total_chars += len(str(section_data))
                elif isinstance(section_data, list):
                    total_chars += sum(len(str(item)) for item in section_data)
                else:
                    total_chars += len(str(section_data))
                    
        except Exception as e:
            logger.warning(f"Error estimating text length: {e}")
            
        return total_chars
    
    @staticmethod
    def clean_empty_sections(data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Remove empty or null sections from the data.
        
        Args:
            data: The CV data dictionary
            
        Returns:
            Cleaned data with empty sections removed
        """
        return {k: v for k, v in data.items() if v}
    
    @staticmethod
    def process_all(cv_data: CVData, raw_text: str) -> Tuple[CVData, float, List[str]]:
        """
        Apply all post-processing steps to CV data.
        
        Args:
            cv_data: The extracted CV data
            raw_text: The original CV text
            
        Returns:
            Tuple of (processed CV data, confidence score, validation issues)
        """
        # 1. Deduplicate certifications and courses
        cv_data = PostProcessor.deduplicate_certifications_courses(cv_data)
        
        # 2. Validate and fix dates
        cv_data_dict = cv_data.model_dump()
        cv_data_dict, validation_issues = PostProcessor.validate_and_fix_dates(cv_data_dict)
        
        # 3. Clean empty sections  
        cv_data_dict = PostProcessor.clean_empty_sections(cv_data_dict)
        
        # 4. Recreate CVData with cleaned data
        try:
            cv_data = CVData(**cv_data_dict)
        except Exception as e:
            logger.error(f"Failed to recreate CVData after post-processing: {e}")
            # Return original if recreation fails
            pass
        
        # 5. Calculate confidence score
        confidence = PostProcessor.calculate_extraction_confidence(cv_data, raw_text)
        
        return cv_data, confidence, validation_issues


# Create singleton instance
post_processor = PostProcessor()