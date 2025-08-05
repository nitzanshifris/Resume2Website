#!/usr/bin/env python3
"""Extract CV data from PDF for Magic UI experiment"""

import asyncio
import json
import os
from pathlib import Path

# Add project root to Python path
import sys
sys.path.append(str(Path(__file__).parent))

from services.local.text_extractor import TextExtractor
from services.llm.data_extractor import DataExtractor

async def extract_cv_data(pdf_path: str, output_path: str):
    """Extract CV data from PDF and save to JSON"""
    
    # Extract text from PDF
    print("Extracting text from PDF...")
    text_extractor = TextExtractor()
    text = text_extractor.extract_text(pdf_path)
    print(f"Extracted {len(text)} characters")
    
    # Extract structured CV data
    print("\nExtracting CV data using LLM...")
    data_extractor = DataExtractor()
    cv_data = await data_extractor.extract_cv_data(text)
    
    # Save to JSON
    with open(output_path, 'w') as f:
        json.dump(cv_data.model_dump(), f, indent=2)
    
    print(f"\nSaved CV data to: {output_path}")
    
    # Print summary
    print("\n=== CV Summary ===")
    print(f"Name: {cv_data.hero.fullName}")
    print(f"Title: {cv_data.hero.professionalTitle}")
    if cv_data.skills and cv_data.skills.skillCategories:
        print(f"Skills: {len(cv_data.skills.skillCategories)} categories")
    if cv_data.experience and cv_data.experience.experienceItems:
        print(f"Experience: {len(cv_data.experience.experienceItems)} positions")
    
    return cv_data

if __name__ == "__main__":
    pdf_path = "/Users/nitzan_shifris/Desktop/CV2WEB-V4/data/cv_examples/pdf_examples/pdf/Lisbon-Resume-Template-Creative.pdf"
    output_path = "/Users/nitzan_shifris/Desktop/CV2WEB-V4/magic-ui-experiment/cv-data.json"
    
    asyncio.run(extract_cv_data(pdf_path, output_path))