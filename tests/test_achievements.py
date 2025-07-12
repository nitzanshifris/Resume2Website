#!/usr/bin/env python3
"""
Test if achievements are properly extracted and rendered
"""

import json
import asyncio
from pathlib import Path
from services.llm.data_extractor import data_extractor
from services.portfolio.component_selector import component_selector
from services.portfolio.universal_adapter import universal_adapter

async def test_achievements():
    # Test with a CV that has achievements
    test_cv_path = Path("/Users/nitzan_shifris/Desktop/CV2WEB-V4/data/cv_examples/pdf_examples/pdf/Software Engineer.pdf")

    if test_cv_path.exists():
        print("📄 Extracting CV data...")
        # Extract data
        extracted_data = await data_extractor.extract_cv_data(str(test_cv_path))
        
        # Check if achievements exist
        if hasattr(extracted_data, 'achievements') and extracted_data.achievements:
            print(f"\n✅ Found {len(extracted_data.achievements.achievements)} achievements:")
            for i, achievement in enumerate(extracted_data.achievements.achievements):
                print(f"  {i+1}. Value: {achievement.value}")
                print(f"     Label: {achievement.label}")
                print(f"     Context: {getattr(achievement, 'contextOrDetail', 'N/A')}")
            
            # Test component selection
            selections = component_selector.select_components(extracted_data)
            achievement_selection = next((s for s in selections if s.section == 'achievements'), None)
            
            if achievement_selection:
                print("\n✅ Achievements component selected:", achievement_selection.component_type)
                
                # Test universal adapter
                adapted_props = universal_adapter.adapt(
                    achievement_selection.component_type,
                    extracted_data.achievements,
                    'achievements'
                )
                
                print("\n📊 Adapted props:")
                print(json.dumps(adapted_props, indent=2))
            else:
                print("\n❌ Achievements section was not selected")
        else:
            print("\n❌ No achievements found in CV")
    else:
        print(f"❌ Test CV not found: {test_cv_path}")

# Run the async test
asyncio.run(test_achievements())