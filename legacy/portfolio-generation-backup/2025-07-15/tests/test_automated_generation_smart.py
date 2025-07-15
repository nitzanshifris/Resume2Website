#!/usr/bin/env python3
"""
Test full automated portfolio generation with Smart Component Selection
"""
import asyncio
import logging
from pathlib import Path
import sys

from services.local.text_extractor import text_extractor  
from services.llm.data_extractor import data_extractor
from services.portfolio.smart_component_selector import smart_component_selector
from services.portfolio.portfolio_generator import portfolio_generator

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def main():
    # Allow CV path as argument
    if len(sys.argv) > 1:
        cv_path = Path(sys.argv[1])
    else:
        cv_path = Path("data/cv_examples/pdf_examples/pdf/Lisbon-Resume-Template-Creative.pdf")
    
    if not cv_path.exists():
        logger.error(f"CV file not found: {cv_path}")
        return
    
    logger.info("="*60)
    logger.info("🧠 Smart Portfolio Generation with Content Analysis")
    logger.info("="*60)
    
    # Step 1: Extract text from CV
    logger.info(f"\nStep 1: Extracting text from {cv_path.name}...")
    text = text_extractor.extract_text(cv_path)
    
    # Step 2: Parse CV data
    logger.info("\nStep 2: Parsing CV data with AI...")
    cv_data = await data_extractor.extract_cv_data(text)
    
    # Step 3: Smart component selection with content analysis
    logger.info("\nStep 3: Smart component selection based on content richness...")
    selections = smart_component_selector.select_components(cv_data)
    
    # Get layout recommendations
    recommendations = smart_component_selector.get_layout_recommendations(selections)
    
    logger.info(f"\n📊 Content Analysis Results:")
    logger.info(f"  - Total components selected: {len(selections)}")
    logger.info(f"  - Layout density: {recommendations['layout_type']}")
    logger.info(f"  - Merge suggestions: {len(recommendations['merge_suggestions'])}")
    
    # Show component details
    logger.info(f"\n🎨 Selected Components:")
    for selection in selections[:10]:  # Show first 10
        richness = selection.props.get("_richness", {})
        logger.info(f"  - {selection.section}: {selection.component_type}")
        logger.info(f"    Richness: {richness.get('score', 0):.2f}, Items: {richness.get('item_count', 0)}")
    
    if len(selections) > 10:
        logger.info(f"  ... and {len(selections) - 10} more components")
    
    # Show merge suggestions if any
    if recommendations['merge_suggestions']:
        logger.info(f"\n💡 Merge Suggestions (optional):")
        for suggestion in recommendations['merge_suggestions']:
            logger.info(f"  - {suggestion['source']} → {suggestion['target']}")
            logger.info(f"    Reason: {suggestion['reason']}")
    
    # Step 4: Generate portfolio with smart selections
    output_dir = Path("test-smart-portfolio")
    logger.info(f"\nStep 4: Generating smart portfolio to {output_dir}...")
    
    # Clean up metadata before generation
    for selection in selections:
        # Remove analysis metadata from props before generation
        selection.props.pop("_richness", None)
        selection.props.pop("_merge_suggestion", None)
        selection.props.pop("_layout_suggestion", None)
        selection.props.pop("_global_layout", None)
    
    portfolio_generator.generate_portfolio(
        selections=selections,
        user_name=cv_data.hero.fullName if cv_data.hero else "Test Portfolio",
        output_dir=output_dir
    )
    
    # Add layout recommendations to generated portfolio README
    readme_path = output_dir / "README.md"
    if readme_path.exists():
        content = readme_path.read_text()
        
        # Add smart selection info
        smart_info = f"""

## 🧠 Smart Component Selection

This portfolio was generated using smart content analysis:

- **Layout Type**: {recommendations['layout_type']}
- **Total Components**: {len(selections)}
- **Content Optimization**: Components were selected based on content richness

### Layout Recommendations:
"""
        
        if recommendations['spacing_recommendations']:
            for key, value in recommendations['spacing_recommendations'].items():
                smart_info += f"- **{key.replace('_', ' ').title()}**: {value}\n"
        
        if recommendations['merge_suggestions']:
            smart_info += "\n### Optional Merge Suggestions:\n"
            for suggestion in recommendations['merge_suggestions']:
                smart_info += f"- Consider merging {suggestion['source']} into {suggestion['target']}\n"
        
        readme_path.write_text(content + smart_info)
    
    logger.info("\n✅ Smart portfolio generated successfully!")
    logger.info(f"📁 Location: {output_dir.absolute()}")
    logger.info("\n🚀 To run:")
    logger.info(f"cd {output_dir}")
    logger.info("npm install") 
    logger.info("npm run dev")
    logger.info("\n💡 The portfolio has been optimized based on your CV's content density!")

if __name__ == "__main__":
    asyncio.run(main())