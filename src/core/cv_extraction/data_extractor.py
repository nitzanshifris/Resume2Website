"""
Data Extraction Coordinator for RESUME2WEBSITE MVP
Orchestrates CV extraction using specialized services
"""
import asyncio
import logging
import time
import uuid
from typing import Dict, Any, Optional, Tuple

from pydantic import ValidationError

# Import all services
from .llm_service import get_llm_service
from .section_extractor import SectionExtractor
from .enhancement_processor import enhancement_processor
from .post_processor import post_processor
from .metrics import ExtractionMetrics, metrics_collector, Timer, SectionTimer, estimate_tokens

# Import schemas
from src.core.schemas.unified_nullable import (
    CVData, HeroSection, ProfessionalSummaryOverview, ExperienceSection, 
    EducationSection, SkillsSection, ProjectsSection, 
    CertificationsSection, AchievementsSection,
    VolunteerExperienceSection, LanguagesSection, ContactSectionFooter, 
    CoursesSection, HobbiesSection, PublicationsResearchSection,
    SpeakingEngagementsSection, PatentsSection, ProfessionalMembershipsSection
)

logger = logging.getLogger(__name__)


class DataExtractor:
    """
    Coordinates CV data extraction using specialized services.
    Acts as the orchestrator for the entire extraction pipeline.
    """
    
    # Define section schemas as class attribute for clarity
    SECTION_SCHEMAS = {
        "hero": HeroSection,
        "summary": ProfessionalSummaryOverview,
        "experience": ExperienceSection,
        "education": EducationSection,
        "skills": SkillsSection,
        "projects": ProjectsSection,
        "certifications": CertificationsSection,
        "achievements": AchievementsSection,  # Now includes patents and memberships
        "volunteer": VolunteerExperienceSection,
        "languages": LanguagesSection,
        "contact": ContactSectionFooter,
        "courses": CoursesSection,
        "hobbies": HobbiesSection,
        "publications": PublicationsResearchSection,
        "speaking": SpeakingEngagementsSection
        # Removed: patents and memberships (now part of achievements)
    }
    
    def __init__(self, api_key: Optional[str] = None):
        """Initialize the extraction coordinator with all necessary services."""
        # Initialize services - create new instance, don't use singleton
        from .llm_service import create_llm_service
        self.llm_service = create_llm_service(api_key)
        self.section_extractor = SectionExtractor(self.SECTION_SCHEMAS)
        
        # Log initialization
        model_info = self.llm_service.get_model_info()
        logger.info(f"DataExtractor initialized - Model: {model_info['model']}, Deterministic: {model_info['deterministic']}")
    
    async def extract_cv_data(self, raw_text: str) -> CVData:
        """
        Main extraction pipeline - coordinates all services to extract CV data.
        Now with comprehensive performance metrics!
        
        Args:
            raw_text: The raw CV text to extract from
            
        Returns:
            CVData object with all extracted information
        """
        # Start metrics collection (use sync version since we're already in async context)
        extraction_id = str(uuid.uuid4())[:8]
        api_key_hash = self.llm_service.api_key[:8] if self.llm_service.api_key else "default"
        metrics = metrics_collector.start_extraction_sync(extraction_id, api_key_hash)
        
        # Track overall time
        start_time = time.time()
        
        try:
            # Validate input
            if not raw_text or not raw_text.strip():
                logger.warning("Empty text provided for extraction")
                metrics.errors.append({"type": "empty_input", "message": "Empty text provided"})
                metrics_collector.end_extraction_sync(extraction_id, success=False)
                return CVData()
            
            # Track input size
            metrics.input_text_length = len(raw_text)
            metrics.total_tokens_used = estimate_tokens(raw_text)
            
            logger.info(f"Starting CV extraction pipeline - {len(raw_text)} characters")
            
            # Step 1: Extract sections in parallel (with timing)
            extraction_start = time.time()
            extracted_sections = await self._extract_all_sections_with_metrics(raw_text, metrics)
            metrics.text_extraction_time = time.time() - extraction_start
            
            # Step 2: Apply enhancements (with timing)
            with Timer(metrics, 'post_processing_time'):
                enhanced_data = self._apply_enhancements(extracted_sections, raw_text)
            
            # Step 3: Create CV object and apply post-processing (with timing)
            validation_start = time.time()
            cv_data = self._create_and_process_cv_data(enhanced_data, raw_text)
            metrics.validation_time = time.time() - validation_start
            
            # Calculate total time
            metrics.total_time = time.time() - start_time
            
            # Calculate extraction confidence
            metrics.extraction_confidence = self.calculate_extraction_confidence(cv_data, raw_text)
            
            # Mark as successful
            metrics_collector.end_extraction_sync(extraction_id, success=True)
            
            return cv_data
            
        except Exception as e:
            # Track error
            logger.error(f"Extraction failed: {e}")
            metrics.errors.append({"type": "extraction_error", "message": str(e)})
            metrics.total_time = time.time() - start_time
            metrics_collector.end_extraction_sync(extraction_id, success=False)
            raise
    
    async def _extract_all_sections_with_metrics(self, raw_text: str, metrics: ExtractionMetrics) -> Dict[str, Any]:
        """
        Extract all CV sections in parallel with metrics tracking.
        Now with concurrency limiting to prevent API overload.
        
        Args:
            raw_text: The raw CV text
            metrics: Metrics object to track performance
            
        Returns:
            Dictionary of extracted sections
        """
        metrics.sections_requested = len(self.SECTION_SCHEMAS)
        
        # Limit concurrent API calls to prevent overload
        MAX_CONCURRENT_CALLS = 4  # Process 4 sections at a time
        semaphore = asyncio.Semaphore(MAX_CONCURRENT_CALLS)
        
        # Create extraction tasks for all sections with timing and concurrency control
        async def extract_with_timing(section_name: str):
            async with semaphore:  # Acquire semaphore before making API call
                with SectionTimer(metrics, section_name):
                    logger.debug(f"Starting extraction for section: {section_name}")
                    result = await self.section_extractor.extract(
                        section_name=section_name,
                        raw_text=raw_text,
                        llm_caller=self.llm_service.call_llm
                    )
                    if result and result.get(section_name) is not None:
                        metrics.sections_extracted += 1
                        logger.debug(f"Successfully extracted section: {section_name}")
                    else:
                        metrics.sections_failed += 1
                        logger.debug(f"Failed to extract section: {section_name}")
                    return result
        
        tasks = [extract_with_timing(section_name) for section_name in self.SECTION_SCHEMAS.keys()]
        
        # Execute all tasks with controlled concurrency
        logger.info(f"Starting extraction of {len(tasks)} sections with max {MAX_CONCURRENT_CALLS} concurrent calls")
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Combine results
        combined_data = {}
        for result in results:
            if isinstance(result, dict):
                combined_data.update(result)
            elif isinstance(result, Exception):
                logger.error(f"Section extraction error: {result}")
                metrics.errors.append({"type": "section_error", "message": str(result)})
        
        logger.info(f"Extracted {metrics.sections_extracted}/{metrics.sections_requested} sections")
        return combined_data
    
    async def _extract_all_sections(self, raw_text: str) -> Dict[str, Any]:
        """
        Extract all CV sections in parallel with concurrency limiting.
        
        Args:
            raw_text: The raw CV text
            
        Returns:
            Dictionary of extracted sections
        """
        # Limit concurrent API calls
        MAX_CONCURRENT_CALLS = 4
        semaphore = asyncio.Semaphore(MAX_CONCURRENT_CALLS)
        
        async def extract_with_limit(section_name: str):
            async with semaphore:
                return await self.section_extractor.extract(
                    section_name=section_name,
                    raw_text=raw_text,
                    llm_caller=self.llm_service.call_llm
                )
        
        # Create extraction tasks for all sections
        tasks = [extract_with_limit(section_name) for section_name in self.SECTION_SCHEMAS.keys()]
        
        # Execute with controlled concurrency
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Process results
        extracted_data = {}
        failed_sections = []
        
        for i, result in enumerate(results):
            section_name = list(self.SECTION_SCHEMAS.keys())[i]
            
            if isinstance(result, Exception):
                logger.error(f"Failed to extract '{section_name}': {result}")
                failed_sections.append(section_name)
            elif result:
                extracted_data.update(result)
        
        logger.info(f"Initial extraction complete - {len(extracted_data)}/{len(self.SECTION_SCHEMAS)} sections")
        
        # Retry failed sections sequentially
        if failed_sections:
            extracted_data = await self._retry_failed_sections(failed_sections, raw_text, extracted_data)
        
        return extracted_data
    
    async def _retry_failed_sections(self, failed_sections: list, raw_text: str, 
                                    extracted_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Retry extraction for failed sections sequentially.
        
        Args:
            failed_sections: List of section names that failed
            raw_text: The raw CV text
            extracted_data: Already extracted data
            
        Returns:
            Updated extracted data dictionary
        """
        logger.warning(f"Retrying {len(failed_sections)} failed sections")
        
        for section_name in failed_sections:
            try:
                result = await self.section_extractor.extract(
                    section_name=section_name,
                    raw_text=raw_text,
                    llm_caller=self.llm_service.call_llm
                )
                if result:
                    extracted_data.update(result)
                    logger.info(f"Successfully extracted '{section_name}' on retry")
            except Exception as e:
                logger.error(f"Retry failed for '{section_name}': {e}")
        
        return extracted_data
    
    def _apply_enhancements(self, data: Dict[str, Any], raw_text: str) -> Dict[str, Any]:
        """
        Apply all enhancement processing to extracted data.
        
        Args:
            data: Extracted section data
            raw_text: Original CV text
            
        Returns:
            Enhanced data dictionary
        """
        try:
            enhanced = enhancement_processor.enhance_all(data, raw_text)
            logger.info("Enhancement processing completed successfully")
            return enhanced
        except Exception as e:
            logger.error(f"Enhancement processing failed: {e}")
            return data  # Return unenhanced data
    
    def _create_and_process_cv_data(self, data: Dict[str, Any], raw_text: str) -> CVData:
        """
        Create CVData object and apply post-processing.
        
        Args:
            data: Enhanced section data
            raw_text: Original CV text
            
        Returns:
            Final processed CVData object
        """
        try:
            # Create CVData object
            cv_data = CVData(**data)
            
            # Apply post-processing
            cv_data, confidence, validation_issues = post_processor.process_all(cv_data, raw_text)
            
            # Log validation issues if any (not embedded in data)
            if validation_issues:
                logger.info(f"Extraction had {len(validation_issues)} validation issues (logged separately)")
            
            logger.info(f"CV extraction complete - Confidence: {confidence:.2f}")
            return cv_data
            
        except ValidationError as e:
            logger.error(f"Failed to create CVData object: {e}")
            # Return partial data that validates
            return CVData(**{k: v for k, v in data.items() if k in CVData.model_fields})
    
    def calculate_extraction_confidence(self, cv_data: Any, raw_text: str) -> float:
        """
        Calculate confidence score for extraction quality.
        
        Args:
            cv_data: Extracted CV data
            raw_text: Original CV text
            
        Returns:
            Confidence score between 0.0 and 1.0
        """
        return post_processor.calculate_extraction_confidence(cv_data, raw_text)


# Factory function to create new instances
def create_data_extractor(api_key: Optional[str] = None) -> DataExtractor:
    """
    Create a new DataExtractor instance with the given API key.
    
    Args:
        api_key: Optional API key for the LLM service
        
    Returns:
        New DataExtractor instance
        
    Example:
        # In your API route:
        extractor = create_data_extractor(api_key="sk-...")
        cv_data = await extractor.extract_cv_data(text)
    """
    return DataExtractor(api_key=api_key)