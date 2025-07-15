"""
Component Registry Manager
Ensures all component references are valid and provides fallbacks
"""
import json
import logging
import os
from pathlib import Path
from typing import Dict, Optional, List, Tuple

logger = logging.getLogger(__name__)

class ComponentRegistry:
    """
    Centralized component registry that provides:
    - Component resolution with aliases
    - Fallback mechanisms
    - Import path validation
    - Min/max item constraints
    """
    
    def __init__(self, registry_path: Optional[Path] = None):
        """Initialize the registry"""
        if registry_path is None:
            registry_path = Path(__file__).parent.parent.parent.parent / "aceternity-components-library" / "registry" / "component-registry.json"
        
        self.registry_path = registry_path
        self.registry_data = self._load_registry()
        self._validate_registry()
    
    def _load_registry(self) -> Dict:
        """Load the component registry from JSON"""
        try:
            with open(self.registry_path, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            # Silently return empty registry - not critical for API operation
            return {}
        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON in component registry: {e}")
            return {}
    
    def _validate_registry(self):
        """Validate that all import paths in registry exist"""
        aceternity_path = self.registry_path.parent.parent / "components" / "ui"
        invalid_components = []
        
        for component_key, config in self.registry_data.items():
            import_path = config.get("import", "")
            # Convert import path to file path
            file_path = import_path.replace("@/components/ui/", "").replace("/", os.sep) + ".tsx"
            full_path = aceternity_path / file_path
            
            if not full_path.exists():
                logger.warning(f"Component file not found: {full_path}")
                invalid_components.append(component_key)
        
        if invalid_components:
            logger.warning(f"Registry contains {len(invalid_components)} invalid components: {invalid_components}")
    
    def resolve_component(self, component_key: str) -> Tuple[str, Dict]:
        """
        Resolve a component key to its canonical form and config
        Returns: (resolved_key, config)
        """
        # Direct match
        if component_key in self.registry_data:
            return component_key, self.registry_data[component_key]
        
        # Check aliases
        for canonical_key, config in self.registry_data.items():
            aliases = config.get("aliases", [])
            if component_key in aliases:
                logger.info(f"Resolved alias {component_key} -> {canonical_key}")
                return canonical_key, config
        
        # No match found
        logger.warning(f"Component '{component_key}' not found in registry")
        return None, {}
    
    def get_import_path(self, component_key: str) -> str:
        """Get the import path for a component"""
        resolved_key, config = self.resolve_component(component_key)
        if resolved_key:
            return config.get("import", "")
        return ""
    
    def get_named_exports(self, component_key: str) -> List[str]:
        """Get the named exports for a component"""
        resolved_key, config = self.resolve_component(component_key)
        if resolved_key:
            return config.get("named_exports", [])
        return []
    
    def get_fallback(self, component_key: str) -> Optional[str]:
        """Get the fallback component for a given component"""
        resolved_key, config = self.resolve_component(component_key)
        if resolved_key:
            fallback = config.get("fallback")
            if fallback and fallback in self.registry_data:
                return fallback
        return None
    
    def get_constraints(self, component_key: str) -> Tuple[int, int]:
        """Get min/max item constraints for a component"""
        resolved_key, config = self.resolve_component(component_key)
        if resolved_key:
            return config.get("min_items", 0), config.get("max_items", 100)
        return 0, 100
    
    def is_valid_for_item_count(self, component_key: str, item_count: int) -> bool:
        """Check if a component is valid for the given item count"""
        min_items, max_items = self.get_constraints(component_key)
        return min_items <= item_count <= max_items
    
    def suggest_component(self, section: str, item_count: int, excluded: List[str] = None) -> Optional[str]:
        """Suggest a component based on section and item count"""
        excluded = excluded or []
        
        # Section-specific preferences
        section_preferences = {
            "hero": ["background-gradient", "hero-parallax"],
            "summary": ["text-generate-effect", "typewriter-effect"],
            "experience": ["timeline", "card-hover-effect", "card-stack"],
            "education": ["card-stack", "timeline", "card-hover-effect"],
            "skills": ["bento-grid", "card-hover-effect"],
            "languages": ["animated-tooltip", "card-stack"],
            "contact": ["floating-dock", "floating-navbar"]
        }
        
        preferences = section_preferences.get(section, [])
        
        # Try preferences first
        for component in preferences:
            if component not in excluded and self.is_valid_for_item_count(component, item_count):
                return component
        
        # Try any valid component
        for component_key in self.registry_data:
            if component_key not in excluded and self.is_valid_for_item_count(component_key, item_count):
                return component_key
        
        return None
    
    def get_all_components(self) -> List[str]:
        """Get list of all registered components"""
        return list(self.registry_data.keys())

# Singleton instance
component_registry = ComponentRegistry()