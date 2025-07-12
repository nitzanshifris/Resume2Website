#!/usr/bin/env python3
"""
Test full automated portfolio generation
"""
import asyncio
import logging
from pathlib import Path

from services.local.text_extractor import text_extractor  
from services.llm.data_extractor import data_extractor
from services.portfolio.component_selector import component_selector
from services.portfolio.portfolio_generator import portfolio_generator

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def main():
    # Step 1: Extract text from CV
    cv_path = Path("data/cv_examples/pdf_examples/pdf/Lisbon-Resume-Template-Creative.pdf")
    logger.info(f"Step 1: Extracting text from {cv_path.name}...")
    text = text_extractor.extract_text(cv_path)
    
    # Step 2: Parse CV data
    logger.info("Step 2: Parsing CV data...")
    cv_data = await data_extractor.extract_cv_data(text)
    
    # Step 3: Select components
    logger.info("Step 3: Selecting components...")
    selections = component_selector.select_components(cv_data)
    
    # Step 4: Generate portfolio
    output_dir = Path("test-automated-portfolio")
    logger.info(f"Step 4: Generating portfolio to {output_dir}...")
    portfolio_generator.generate_portfolio(
        selections=selections,
        user_name=cv_data.hero.fullName if cv_data.hero else "Test Portfolio",
        output_dir=output_dir
    )
    
    logger.info("\n✅ Portfolio generated successfully!")
    logger.info(f"📁 Location: {output_dir.absolute()}")
    logger.info("\n🚀 To run:")
    logger.info("cd test-automated-portfolio")
    logger.info("npm install") 
    logger.info("npm run dev")

if __name__ == "__main__":
    asyncio.run(main())