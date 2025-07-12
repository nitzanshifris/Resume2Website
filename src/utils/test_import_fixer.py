#!/usr/bin/env python3
"""
Test the registry-based ComponentImportFixer
"""
import sys
from pathlib import Path

# Add parent dir to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.core.portfolio_gen.component_import_fixer import ComponentImportFixer

def test_import_fixer():
    """Test the import fixer with registry"""
    print("=== Testing Registry-Based Import Fixer ===\n")
    
    # Create import fixer
    fixer = ComponentImportFixer()
    
    # Show loaded components
    print(f"Loaded {len(fixer.component_map)} component mappings from registry")
    
    # Generate report
    report = fixer.generate_import_map_report()
    print("\n" + report)
    
    # Test specific lookups
    test_components = [
        "BentoGrid",
        "BentoGridItem", 
        "HoverEffect",
        "Timeline",
        "TextGenerateEffect",
        "AnimatedTooltip"
    ]
    
    print("\n=== Component Lookup Test ===")
    for component in test_components:
        if component in fixer.component_map:
            print(f"✓ {component}: {fixer.component_map[component]}")
        else:
            print(f"✗ {component}: NOT FOUND")
    
    # Test alias resolution
    print("\n=== Alias Test ===")
    # Check if aliases were mapped correctly
    alias_tests = [
        ("TextSimple", "text-simple alias"),
        ("BentoGridSmall", "bento-grid-small alias"),
        ("TimelineMinimal", "timeline-minimal alias")
    ]
    
    for component, description in alias_tests:
        if component in fixer.component_map:
            print(f"✓ {component} ({description}): {fixer.component_map[component]}")
        else:
            print(f"✗ {component} ({description}): NOT FOUND")

if __name__ == "__main__":
    test_import_fixer()