#!/usr/bin/env python3
"""
Non-interactive version of validate_postcss_config.py that automatically fixes issues.
"""

import os
import re
from pathlib import Path
from typing import List, Dict

def find_postcss_configs(base_dir: Path) -> List[Path]:
    """Find all postcss config files in the project."""
    configs = []
    
    # Common PostCSS config filenames
    patterns = ['postcss.config.js', 'postcss.config.mjs', 'postcss.config.cjs', '.postcssrc.js', '.postcssrc.json']
    
    for root, dirs, files in os.walk(base_dir):
        # Skip node_modules and .next directories
        if 'node_modules' in dirs:
            dirs.remove('node_modules')
        if '.next' in dirs:
            dirs.remove('.next')
            
        for file in files:
            if file in patterns:
                configs.append(Path(root) / file)
                
    return configs

def validate_postcss_config(config_path: Path) -> Dict[str, bool]:
    """Validate that a PostCSS config includes required plugins."""
    content = config_path.read_text()
    
    # Check for required plugins
    has_tailwind = bool(re.search(r'tailwindcss\s*[:{\s]', content))
    has_autoprefixer = bool(re.search(r'autoprefixer\s*[:{\s]', content))
    
    return {
        'path': str(config_path),
        'has_tailwind': has_tailwind,
        'has_autoprefixer': has_autoprefixer,
        'is_valid': has_tailwind and has_autoprefixer
    }

def fix_postcss_config(config_path: Path) -> bool:
    """Fix a PostCSS config by adding missing plugins."""
    content = config_path.read_text()
    
    # Check if it's already valid
    validation = validate_postcss_config(config_path)
    if validation['is_valid']:
        return True
        
    # For .mjs or .js files
    if config_path.suffix in ['.mjs', '.js', '.cjs']:
        # Special case for array-style plugins
        if 'plugins: ["@tailwindcss/postcss", "autoprefixer"]' in content:
            # Convert array style to object style
            new_content = content.replace(
                'plugins: ["@tailwindcss/postcss", "autoprefixer"]',
                'plugins: {\n    tailwindcss: {},\n    autoprefixer: {},\n  }'
            )
            config_path.write_text(new_content)
            return True
            
        # If missing tailwindcss
        if not validation['has_tailwind'] and validation['has_autoprefixer']:
            # Add tailwindcss before autoprefixer
            new_content = re.sub(
                r'(plugins\s*:\s*\{\s*)',
                r'\1\n    tailwindcss: {},',
                content
            )
            config_path.write_text(new_content)
            return True
            
        # If missing autoprefixer but has tailwindcss
        if validation['has_tailwind'] and not validation['has_autoprefixer']:
            # Add autoprefixer after tailwindcss
            new_content = re.sub(
                r'(tailwindcss\s*:\s*\{\s*\})\s*,?',
                r'\1,\n    autoprefixer: {},',
                content
            )
            
            # If no comma after the closing brace, ensure proper formatting
            if new_content == content:
                new_content = re.sub(
                    r'(tailwindcss\s*:\s*\{\s*\})\s*(\})',
                    r'\1,\n    autoprefixer: {}\n  \2',
                    content
                )
            
            config_path.write_text(new_content)
            return True
            
    return False

def main():
    """Main function."""
    # Get project root (CV2WEB-V4)
    project_root = Path(__file__).parent.parent.parent
    
    print("🔍 Scanning for PostCSS configuration files...")
    configs = find_postcss_configs(project_root)
    
    if not configs:
        print("⚠️  No PostCSS configuration files found!")
        return
        
    print(f"\n📋 Found {len(configs)} PostCSS config file(s)\n")
    
    invalid_configs = []
    
    for config in configs:
        validation = validate_postcss_config(config)
        relative_path = config.relative_to(project_root)
        
        if not validation['is_valid']:
            invalid_configs.append(config)
            print(f"❌ {relative_path}")
            print(f"   ├─ tailwindcss: {'✓' if validation['has_tailwind'] else '✗'}")
            print(f"   └─ autoprefixer: {'✓' if validation['has_autoprefixer'] else '✗'}")
    
    # Automatically fix invalid configs
    if invalid_configs:
        print(f"\n🔧 Fixing {len(invalid_configs)} invalid PostCSS configuration(s)...")
        for config in invalid_configs:
            if fix_postcss_config(config):
                print(f"✅ Fixed: {config.relative_to(project_root)}")
            else:
                print(f"❌ Could not fix: {config.relative_to(project_root)} (manual fix required)")
        
        print("\n✨ PostCSS configuration fixing complete!")
    else:
        print("✨ All PostCSS configurations are valid!")

if __name__ == "__main__":
    main()