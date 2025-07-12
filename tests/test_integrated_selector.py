#!/usr/bin/env python3
"""
Test the Integrated Component Selector with Smart Analysis
"""
import asyncio
import logging
from pathlib import Path

from services.local.text_extractor import text_extractor  
from services.llm.data_extractor import data_extractor
from services.portfolio.component_selector import component_selector

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def main():
    # Test with different CV types
    test_cases = [
        ("data/cv_examples/pdf_examples/pdf/Lisbon-Resume-Template-Creative.pdf", "Rich CV"),
        ("data/cv_examples/pdf_examples/pdf/simple-resume.pdf", "Simple CV"),
    ]
    
    for cv_path_str, cv_type in test_cases:
        cv_path = Path(cv_path_str)
        if not cv_path.exists():
            logger.warning(f"Skipping {cv_type}: File not found")
            continue
            
        logger.info(f"\n{'='*60}")
        logger.info(f"Testing Integrated Selector with {cv_type}")
        logger.info(f"File: {cv_path.name}")
        logger.info(f"{'='*60}\n")
        
        # Extract and parse CV
        logger.info("Step 1: Extracting text...")
        text = text_extractor.extract_text(cv_path)
        
        logger.info("Step 2: Parsing CV data...")
        cv_data = await data_extractor.extract_cv_data(text)
        
        # Count sections
        section_count = 0
        for field_name, field_value in cv_data.model_dump().items():
            if field_value and field_name != 'metadata':
                section_count += 1
        
        logger.info(f"\nDetected {section_count} populated sections")
        
        # Run integrated selection (will automatically use smart analysis if needed)
        logger.info("\nStep 3: Running integrated component selection...")
        selections = component_selector.select_components(cv_data)
        
        logger.info(f"\nResults:")
        logger.info(f"- Total components selected: {len(selections)}")
        logger.info(f"- Smart analysis triggered: {section_count >= 7}")
        
        # Show selected components
        logger.info(f"\nSelected Components:")
        for selection in selections:
            logger.info(f"  - {selection.section}: {selection.component_type}")
            
            # Check if smart analysis added metadata
            if "_richness" in selection.props:
                richness = selection.props["_richness"]
                logger.info(f"    Smart Analysis: score={richness['score']:.2f}, items={richness['item_count']}")

if __name__ == "__main__":
    asyncio.run(main())