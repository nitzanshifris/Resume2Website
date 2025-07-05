#!/usr/bin/env python3
"""
Test the Smart Component Selector
"""
import asyncio
import logging
from pathlib import Path
import json

from services.local.text_extractor import text_extractor  
from services.llm.data_extractor import data_extractor
from services.portfolio.smart_component_selector import smart_component_selector

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def test_smart_selection():
    """Test smart component selection with different CV types"""
    
    # Test with a rich CV (many sections)
    cv_path = Path("data/cv_examples/pdf_examples/pdf/Lisbon-Resume-Template-Creative.pdf")
    
    logger.info(f"\n{'='*60}")
    logger.info(f"Testing Smart Component Selection")
    logger.info(f"CV: {cv_path.name}")
    logger.info(f"{'='*60}\n")
    
    # Extract and parse CV
    logger.info("Step 1: Extracting text from CV...")
    text = text_extractor.extract_text(cv_path)
    
    logger.info("Step 2: Parsing CV data...")
    cv_data = await data_extractor.extract_cv_data(text)
    
    # Count populated sections
    populated_sections = []
    for field_name, field_value in cv_data.model_dump().items():
        if field_value and field_name != 'metadata':
            if hasattr(cv_data, field_name):
                section_data = getattr(cv_data, field_name)
                # Check if section has actual content
                if hasattr(section_data, 'model_dump'):
                    data_dict = section_data.model_dump()
                    # Check for non-empty lists or non-null values
                    has_content = any(
                        v for v in data_dict.values() 
                        if v and (not isinstance(v, list) or len(v) > 0)
                    )
                    if has_content:
                        populated_sections.append(field_name)
    
    logger.info(f"\nFound {len(populated_sections)} populated sections:")
    for section in populated_sections:
        logger.info(f"  - {section}")
    
    # Run smart selection
    logger.info("\nStep 3: Running smart component selection...")
    selections = smart_component_selector.select_components(cv_data)
    
    logger.info(f"\nSelected {len(selections)} components:")
    
    # Display results with richness analysis
    for selection in selections:
        richness_info = selection.props.get("_richness", {})
        merge_suggestion = selection.props.get("_merge_suggestion")
        layout_suggestion = selection.props.get("_layout_suggestion")
        
        logger.info(f"\n  {selection.section}:")
        logger.info(f"    Component: {selection.component_type}")
        logger.info(f"    Priority: {selection.priority}")
        logger.info(f"    Richness Score: {richness_info.get('score', 'N/A'):.2f}")
        logger.info(f"    Items: {richness_info.get('item_count', 'N/A')}")
        logger.info(f"    Recommendation: {richness_info.get('recommendation', 'N/A')}")
        
        if merge_suggestion:
            logger.info(f"    💡 Merge Suggestion: Consider merging into {merge_suggestion['target']}")
            logger.info(f"       Reason: {merge_suggestion['reason']}")
        
        if layout_suggestion:
            logger.info(f"    📐 Layout: Group with {layout_suggestion['group']} using {layout_suggestion['type']}")
    
    # Get layout recommendations
    logger.info("\n" + "="*60)
    logger.info("Layout Recommendations:")
    logger.info("="*60)
    
    recommendations = smart_component_selector.get_layout_recommendations(selections)
    
    logger.info(f"\nLayout Type: {recommendations['layout_type']}")
    logger.info(f"Total Merge Suggestions: {len(recommendations['merge_suggestions'])}")
    
    if recommendations['spacing_recommendations']:
        logger.info("\nSpacing Recommendations:")
        for key, value in recommendations['spacing_recommendations'].items():
            logger.info(f"  - {key}: {value}")
    
    # Save results
    output_file = Path("test_outputs/smart_selection_results.json")
    output_file.parent.mkdir(exist_ok=True)
    
    results = {
        "cv_file": cv_path.name,
        "populated_sections": populated_sections,
        "total_sections": len(populated_sections),
        "selected_components": len(selections),
        "layout_type": recommendations['layout_type'],
        "components": [
            {
                "section": s.section,
                "component": s.component_type,
                "richness_score": s.props.get("_richness", {}).get("score", 0),
                "item_count": s.props.get("_richness", {}).get("item_count", 0),
                "recommendation": s.props.get("_richness", {}).get("recommendation", ""),
                "has_merge_suggestion": "_merge_suggestion" in s.props
            }
            for s in selections
        ],
        "merge_suggestions": recommendations['merge_suggestions']
    }
    
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=2)
    
    logger.info(f"\n✅ Results saved to: {output_file}")
    
    # Test with sparse CV
    logger.info(f"\n\n{'='*60}")
    logger.info("Testing with a sparse CV (fewer sections)")
    logger.info(f"{'='*60}\n")
    
    # Create a sparse CV data for testing
    sparse_cv = cv_data.model_copy(deep=True)
    
    # Remove some sections to simulate sparse CV
    sparse_cv.projects = None
    sparse_cv.volunteer = None
    sparse_cv.languages = None
    sparse_cv.certifications = None
    sparse_cv.courses = None
    sparse_cv.publications = None
    sparse_cv.speaking = None
    sparse_cv.patents = None
    sparse_cv.memberships = None
    
    # Run smart selection on sparse CV
    sparse_selections = smart_component_selector.select_components(sparse_cv)
    
    logger.info(f"Sparse CV: Selected {len(sparse_selections)} components")
    sparse_recommendations = smart_component_selector.get_layout_recommendations(sparse_selections)
    logger.info(f"Layout Type: {sparse_recommendations['layout_type']}")
    
    # Compare layouts
    logger.info(f"\n📊 Comparison:")
    logger.info(f"  Rich CV: {len(selections)} components, {recommendations['layout_type']} layout")
    logger.info(f"  Sparse CV: {len(sparse_selections)} components, {sparse_recommendations['layout_type']} layout")

if __name__ == "__main__":
    asyncio.run(test_smart_selection())