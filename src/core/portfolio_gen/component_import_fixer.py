"""
Component Import Fixer
Ensures correct component imports based on component registry
"""

import re
import json
import logging
from pathlib import Path
from typing import Dict, Set, Tuple, Optional

logger = logging.getLogger(__name__)


class ComponentImportFixer:
    """Fixes component import paths based on component registry"""
    
    def __init__(self, registry_path: Optional[Path] = None):
        self.component_map: Dict[str, str] = {}
        self.registry_data: Dict = {}
        self._load_registry(registry_path)
        
    def _load_registry(self, registry_path: Optional[Path] = None):
        """Load component registry"""
        if registry_path is None:
            registry_path = Path(__file__).parent.parent.parent.parent / "aceternity-components-library" / "registry" / "component-registry.json"
        
        try:
            with open(registry_path, 'r') as f:
                self.registry_data = json.load(f)
                logger.info(f"Loaded component registry with {len(self.registry_data)} components")
        except (FileNotFoundError, json.JSONDecodeError) as e:
            logger.error(f"Failed to load component registry: {e}")
            self.registry_data = {}
        
        # Build component map from registry
        self._build_component_map()
    
    def _build_component_map(self):
        """Build component map from registry data"""
        self.component_map = {}
        
        for component_key, config in self.registry_data.items():
            import_path = config.get("import", "")
            named_exports = config.get("named_exports", [])
            aliases = config.get("aliases", [])
            
            # Map all exports to their import path
            for export_name in named_exports:
                self.component_map[export_name] = import_path
            
            # Map aliases to the same import path
            for alias in aliases:
                # Convert alias to component name format
                alias_component = ''.join(word.capitalize() for word in alias.split('-'))
                for export_name in named_exports:
                    # Create aliased export name
                    if export_name in self.component_map:
                        self.component_map[alias_component] = import_path
        
        logger.info(f"Built component map with {len(self.component_map)} entries")
        
    def scan_components(self, components_dir: Path) -> Dict[str, str]:
        """
        Return component map based on registry (no filesystem scanning needed)
        
        Returns:
            Dict mapping component names to their correct import paths
        """
        # Registry already loaded in __init__, just return the map
        return self.component_map
    
    
    def fix_imports_in_file(self, file_path: Path) -> int:
        """
        Fix component imports in a TypeScript/JSX file using registry data
        
        Returns:
            Number of fixes applied
        """
        if not file_path.exists():
            return 0
        
        try:
            content = file_path.read_text(encoding='utf-8')
            original_content = content
            fixes = 0
            
            # Find all component imports
            import_pattern = r'import\s*{\s*([^}]+)\s*}\s*from\s*[\'"]([^\'\"]+)[\'"]'
            
            def fix_import(match):
                nonlocal fixes
                imports_str = match.group(1)
                current_path = match.group(2)
                
                # Skip non-component imports
                if not current_path.startswith('@/components/ui/'):
                    return match.group(0)
                
                # Parse individual imports
                imports = [imp.strip() for imp in imports_str.split(',')]
                needs_fix = False
                correct_path = None
                
                for imp in imports:
                    # Handle "Name as Alias"
                    import_name = imp.split(' as ')[0].strip()
                    
                    if import_name in self.component_map:
                        expected_path = self.component_map[import_name]
                        if expected_path != current_path:
                            needs_fix = True
                            correct_path = expected_path
                            logger.info(f"Fixing import: {import_name} from {current_path} to {expected_path}")
                            break
                
                if needs_fix and correct_path:
                    fixes += 1
                    return f'import {{ {imports_str} }} from \'{correct_path}\''
                
                return match.group(0)
            
            # Apply fixes
            content = re.sub(import_pattern, fix_import, content)
            
            # Write back if changed
            if content != original_content:
                file_path.write_text(content, encoding='utf-8')
                logger.info(f"Fixed {fixes} imports in {file_path.name}")
            
            return fixes
            
        except Exception as e:
            logger.error(f"Error fixing imports in {file_path}: {e}")
            return 0
    
    def fix_all_imports(self, project_dir: Path) -> Tuple[int, int]:
        """
        Fix all component imports in a project using registry data
        
        Returns:
            (files_fixed, total_fixes)
        """
        if not self.component_map:
            logger.warning("No components in registry")
            return 0, 0
        
        # Fix imports in all TSX files
        files_fixed = 0
        total_fixes = 0
        
        for tsx_file in project_dir.rglob("*.tsx"):
            # Skip node_modules
            if "node_modules" in str(tsx_file):
                continue
                
            fixes = self.fix_imports_in_file(tsx_file)
            if fixes > 0:
                files_fixed += 1
                total_fixes += fixes
        
        logger.info(f"Fixed {total_fixes} imports across {files_fixed} files")
        return files_fixed, total_fixes
    
    def generate_import_map_report(self) -> str:
        """Generate a report of the component import map"""
        lines = ["=== Component Import Map (from Registry) ===\n"]
        
        # Group by import path for better readability
        path_to_components = {}
        for component_name, import_path in self.component_map.items():
            if import_path not in path_to_components:
                path_to_components[import_path] = []
            path_to_components[import_path].append(component_name)
        
        for import_path, components in sorted(path_to_components.items()):
            lines.append(f"\n{import_path}:")
            for component in sorted(components):
                lines.append(f"  - {component}")
        
        lines.append(f"\nTotal components: {len(self.component_map)}")
        lines.append(f"Total import paths: {len(path_to_components)}")
        
        return "\n".join(lines)


# Singleton instance
import_fixer = ComponentImportFixer()