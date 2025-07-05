#!/usr/bin/env python3
"""
Test deduplication on real CV extractions
"""
import sys
import os
import json
from pathlib import Path

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.local.smart_deduplicator import smart_deduplicator

def analyze_cv_for_duplicates(json_file: str):
    """Analyze a single CV for duplicates"""
    print(f"\n{'='*80}")
    print(f"Analyzing: {Path(json_file).name}")
    print('='*80)
    
    # Load CV data
    with open(json_file, 'r') as f:
        cv_data = json.load(f)
    
    # Extract name for context
    name = "Unknown"
    if cv_data.get('hero') and cv_data['hero'].get('fullName'):
        name = cv_data['hero']['fullName']
    print(f"CV: {name}")
    
    # Collect all achievements
    all_achievements = []
    
    # From experience
    exp_count = 0
    if cv_data.get('experience') and cv_data['experience'].get('experienceItems'):
        for exp in cv_data['experience']['experienceItems']:
            company = exp.get('companyName', 'Unknown')
            # Check different possible field names
            if exp.get('responsibilities'):
                for resp in exp['responsibilities']:
                    all_achievements.append((resp, f"experience@{company}"))
                    exp_count += 1
            if exp.get('achievements'):
                for ach in exp['achievements']:
                    text = ach if isinstance(ach, str) else ach.get('text', str(ach))
                    all_achievements.append((text, f"experience@{company}"))
                    exp_count += 1
            if exp.get('responsibilitiesAndAchievements'):
                for item in exp['responsibilitiesAndAchievements']:
                    all_achievements.append((item, f"experience@{company}"))
                    exp_count += 1
    
    # From summary
    summary_count = 0
    if cv_data.get('summary') and cv_data['summary'].get('careerHighlights'):
        for highlight in cv_data['summary']['careerHighlights']:
            all_achievements.append((highlight, "summary"))
            summary_count += 1
    
    # From achievements section
    ach_count = 0
    if cv_data.get('achievements') and cv_data['achievements'].get('achievementItems'):
        for achievement in cv_data['achievements']['achievementItems']:
            if isinstance(achievement, dict):
                text = achievement.get('achievement', '')
                if text:
                    all_achievements.append((text, "achievements"))
                    ach_count += 1
            else:
                all_achievements.append((str(achievement), "achievements"))
                ach_count += 1
    
    print(f"\nFound achievements across sections:")
    print(f"  - Experience: {exp_count}")
    print(f"  - Summary: {summary_count}")
    print(f"  - Achievements: {ach_count}")
    print(f"  - Total: {len(all_achievements)}")
    
    if not all_achievements:
        print("\nNo achievements to analyze for duplicates")
        return
    
    # Run deduplication
    print("\nRunning deduplication...")
    results = smart_deduplicator.deduplicate_achievements(all_achievements)
    
    # Find duplicates
    duplicates = [r for r in results if r['similar_count'] > 1]
    
    if duplicates:
        print(f"\n🔍 Found {len(duplicates)} groups of duplicates:")
        for i, dup in enumerate(duplicates, 1):
            print(f"\n{i}. Duplicate group ({dup['similar_count']} instances):")
            print(f"   Text: {dup['text'][:100]}...")
            print(f"   Found in: {', '.join(dup['sources'])}")
            
            # Show the original variations
            originals = [text for text, source in all_achievements if source in dup['sources']]
            if len(set(originals)) > 1:
                print("   Variations:")
                for j, orig in enumerate(set(originals), 1):
                    print(f"     {j}. {orig[:80]}...")
    else:
        print("\n✅ No duplicates found!")
    
    # Summary statistics
    print(f"\nDeduplication Summary:")
    print(f"  - Original items: {len(all_achievements)}")
    print(f"  - Unique items: {len(results)}")
    print(f"  - Duplicates removed: {len(all_achievements) - len(results)}")
    reduction = ((len(all_achievements) - len(results)) / len(all_achievements) * 100) if all_achievements else 0
    print(f"  - Reduction: {reduction:.1f}%")

def main():
    """Test on all available CV extractions"""
    print("Testing Smart Deduplication on Real CVs")
    
    # Find all extracted JSON files
    test_outputs = Path("data/test_outputs")
    json_files = sorted(test_outputs.glob("*_extracted.json"))
    
    if not json_files:
        print("No extracted CV files found in data/test_outputs/")
        return
    
    print(f"\nFound {len(json_files)} CV extractions to analyze")
    
    # Analyze each CV
    for json_file in json_files[:3]:  # Test first 3
        try:
            analyze_cv_for_duplicates(str(json_file))
        except Exception as e:
            print(f"\n❌ Error analyzing {json_file.name}: {e}")
            import traceback
            traceback.print_exc()
    
    print("\n" + "="*80)
    print("✅ Deduplication analysis complete!")

if __name__ == "__main__":
    main()