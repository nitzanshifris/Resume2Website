#!/usr/bin/env python3
"""
Validate Component Registry
Ensures all components in registry exist and are properly configured
"""
import json
import sys
from pathlib import Path

def validate_registry():
    """Validate the component registry"""
    # Find registry file
    registry_path = Path(__file__).parent.parent / "aceternity-components-library" / "registry" / "component-registry.json"
    
    if not registry_path.exists():
        print(f"❌ Registry file not found: {registry_path}")
        return False
    
    # Load registry
    try:
        with open(registry_path, 'r') as f:
            registry = json.load(f)
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON in registry: {e}")
        return False
    
    # Check aceternity components path
    components_path = Path(__file__).parent.parent / "aceternity-components-library" / "components" / "ui"
    if not components_path.exists():
        print(f"❌ Components directory not found: {components_path}")
        return False
    
    errors = []
    warnings = []
    
    # Validate each component
    for component_key, config in registry.items():
        import_path = config.get("import", "")
        
        # Convert import path to file path
        file_path = import_path.replace("@/components/ui/", "") + ".tsx"
        full_path = components_path / file_path
        
        if not full_path.exists():
            errors.append(f"Component file not found: {component_key} -> {full_path}")
        
        # Check aliases don't conflict with real components
        aliases = config.get("aliases", [])
        for alias in aliases:
            if alias in registry and alias != component_key:
                errors.append(f"Alias conflict: {alias} is both an alias of {component_key} and a real component")
        
        # Check fallback exists
        fallback = config.get("fallback")
        if fallback and fallback not in registry:
            warnings.append(f"Fallback component not found: {component_key} -> {fallback}")
        
        # Validate constraints
        min_items = config.get("min_items", 0)
        max_items = config.get("max_items", 100)
        if min_items > max_items:
            errors.append(f"Invalid constraints for {component_key}: min_items ({min_items}) > max_items ({max_items})")
    
    # Print results
    print("=== Component Registry Validation ===\n")
    print(f"Total components: {len(registry)}")
    print(f"Errors: {len(errors)}")
    print(f"Warnings: {len(warnings)}")
    
    if errors:
        print("\n❌ ERRORS:")
        for error in errors:
            print(f"  - {error}")
    
    if warnings:
        print("\n⚠️  WARNINGS:")
        for warning in warnings:
            print(f"  - {warning}")
    
    if not errors:
        print("\n✅ Registry validation passed!")
        return True
    else:
        print("\n❌ Registry validation failed!")
        return False

if __name__ == "__main__":
    success = validate_registry()
    sys.exit(0 if success else 1)