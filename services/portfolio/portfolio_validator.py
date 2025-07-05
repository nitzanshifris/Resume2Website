"""
Portfolio Validator and Fixer
Ensures generated portfolios are error-free before deployment
"""

import re
import json
import logging
from pathlib import Path
from typing import List, Dict, Tuple, Set

from .component_import_fixer import import_fixer

logger = logging.getLogger(__name__)


class PortfolioValidator:
    """Validates and fixes common issues in generated portfolios"""
    
    def __init__(self):
        self.errors = []
        self.warnings = []
        self.fixed_count = 0
        
    def validate_and_fix_portfolio(self, portfolio_dir: Path) -> Tuple[bool, List[str], int]:
        """
        Validate and fix a generated portfolio
        
        Returns:
            (is_valid, error_messages, fixes_applied)
        """
        self.errors = []
        self.warnings = []
        self.fixed_count = 0
        
        logger.info(f"Validating portfolio at: {portfolio_dir}")
        
        # 1. Fix JSX syntax issues
        self._fix_jsx_syntax_issues(portfolio_dir)
        
        # 2. Fix component imports
        files_fixed, import_fixes = import_fixer.fix_all_imports(portfolio_dir)
        self.fixed_count += import_fixes
        
        # 3. Verify all imported components exist
        self._verify_component_imports(portfolio_dir)
        
        # 4. Fix TypeScript/JSX common errors
        self._fix_common_tsx_errors(portfolio_dir)
        
        # 4. Validate package.json
        self._validate_package_json(portfolio_dir)
        
        # 5. Ensure all required files exist
        self._ensure_required_files(portfolio_dir)
        
        is_valid = len(self.errors) == 0
        
        logger.info(f"Validation complete. Valid: {is_valid}, Fixes applied: {self.fixed_count}")
        
        return is_valid, self.errors, self.fixed_count
    
    def _fix_jsx_syntax_issues(self, portfolio_dir: Path):
        """Fix common JSX syntax errors"""
        
        # Find all TSX files
        tsx_files = list(portfolio_dir.rglob("*.tsx"))
        
        for tsx_file in tsx_files:
            try:
                content = tsx_file.read_text(encoding='utf-8')
                original_content = content
                
                # Fix 1: JSX in object literals
                # Replace: header: <div>...</div>
                # With: header: (() => <div>...</div>)()
                content = re.sub(
                    r'(\w+):\s*(<[^>]+>.*?</[^>]+>)',
                    r'\1: (() => \2)()',
                    content,
                    flags=re.DOTALL
                )
                
                # Fix 2: Comments inside JSX expressions
                # Replace: ) : ( {/* comment */} <section>
                # With: ) : ( <section>
                content = re.sub(
                    r'\)\s*:\s*\(\s*{/\*.*?\*/}\s*(<)',
                    r') : (\1',
                    content,
                    flags=re.DOTALL
                )
                
                # Fix 3: Ensure proper spacing around JSX
                content = re.sub(
                    r'>\s*{/\*.*?\*/}\s*<',
                    r'>\n<',
                    content,
                    flags=re.DOTALL
                )
                
                # Fix 4: Fix header prop with gradient div
                content = re.sub(
                    r'header:\s*<div\s+className="flex.*?rounded-xl.*?"></div>',
                    r'header: (() => (<div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>))()',
                    content,
                    flags=re.DOTALL
                )
                
                if content != original_content:
                    tsx_file.write_text(content, encoding='utf-8')
                    self.fixed_count += 1
                    logger.info(f"Fixed JSX syntax in: {tsx_file.name}")
                    
            except Exception as e:
                self.errors.append(f"Error processing {tsx_file.name}: {e}")
    
    def _verify_component_imports(self, portfolio_dir: Path):
        """Verify all imported components exist"""
        
        components_dir = portfolio_dir / "components" / "ui"
        app_dir = portfolio_dir / "app"
        
        # Extract all component imports from TSX files
        imported_components = set()
        tsx_files = list(app_dir.rglob("*.tsx"))
        
        for tsx_file in tsx_files:
            try:
                content = tsx_file.read_text(encoding='utf-8')
                
                # Find all imports from @/components/ui/
                import_pattern = r'from\s+[\'"]@/components/ui/([^/\'"]+)'
                matches = re.findall(import_pattern, content)
                
                for match in matches:
                    # Remove the file extension if present
                    component_name = match.replace('.tsx', '').replace('.ts', '')
                    imported_components.add(component_name)
                    
            except Exception as e:
                self.warnings.append(f"Could not read {tsx_file.name}: {e}")
        
        # Check if all imported components exist
        for component in imported_components:
            component_path = components_dir / component
            
            # Check for various possible file structures
            possible_paths = [
                component_path / f"{component}.tsx",
                component_path / f"{component}-base.tsx",
                component_path / "index.tsx",
                components_dir / f"{component}.tsx"
            ]
            
            if not any(p.exists() for p in possible_paths):
                self.errors.append(f"Missing component: {component}")
                logger.error(f"Component not found: {component}")
    
    def _fix_common_tsx_errors(self, portfolio_dir: Path):
        """Fix common TypeScript/JSX errors"""
        
        page_tsx = portfolio_dir / "app" / "page.tsx"
        
        if not page_tsx.exists():
            self.errors.append("Missing app/page.tsx")
            return
        
        try:
            content = page_tsx.read_text(encoding='utf-8')
            original_content = content
            
            # Fix 1: Ensure proper function component structure
            if "export default function" not in content:
                # Wrap in proper component if needed
                content = re.sub(
                    r'^(.*?)return\s*\(',
                    r'export default function Portfolio() {\n\1return (',
                    content,
                    flags=re.DOTALL
                )
            
            # Fix 2: Ensure closing tags match
            # Count opening and closing tags
            main_open = content.count("<main")
            main_close = content.count("</main>")
            
            if main_open != main_close:
                self.errors.append(f"Mismatched <main> tags: {main_open} opening, {main_close} closing")
            
            # Fix 3: Remove duplicate imports
            lines = content.split('\n')
            seen_imports = set()
            fixed_lines = []
            
            for line in lines:
                if line.strip().startswith('import'):
                    if line in seen_imports:
                        continue
                    seen_imports.add(line)
                fixed_lines.append(line)
            
            content = '\n'.join(fixed_lines)
            
            if content != original_content:
                page_tsx.write_text(content, encoding='utf-8')
                self.fixed_count += 1
                logger.info("Fixed common TSX errors in page.tsx")
                
        except Exception as e:
            self.errors.append(f"Error fixing page.tsx: {e}")
    
    def _validate_package_json(self, portfolio_dir: Path):
        """Validate package.json structure"""
        
        package_json_path = portfolio_dir / "package.json"
        
        if not package_json_path.exists():
            self.errors.append("Missing package.json")
            return
        
        try:
            with open(package_json_path, 'r') as f:
                package_data = json.load(f)
            
            # Ensure required fields
            required_fields = ["name", "version", "scripts", "dependencies"]
            for field in required_fields:
                if field not in package_data:
                    self.errors.append(f"Missing {field} in package.json")
            
            # Ensure required scripts
            if "scripts" in package_data:
                required_scripts = ["dev", "build", "start"]
                for script in required_scripts:
                    if script not in package_data["scripts"]:
                        self.errors.append(f"Missing script: {script}")
                        
        except json.JSONDecodeError as e:
            self.errors.append(f"Invalid package.json: {e}")
        except Exception as e:
            self.errors.append(f"Error reading package.json: {e}")
    
    def _ensure_required_files(self, portfolio_dir: Path):
        """Ensure all required files exist"""
        
        required_files = [
            "package.json",
            "tsconfig.json",
            "tailwind.config.ts",
            "postcss.config.js",
            "next.config.js",
            "app/layout.tsx",
            "app/page.tsx",
            "app/globals.css",
            "lib/utils.ts",
            "lib/portfolio-data.ts"
        ]
        
        for file_path in required_files:
            full_path = portfolio_dir / file_path
            if not full_path.exists():
                self.errors.append(f"Missing required file: {file_path}")
    
    def generate_fix_report(self) -> str:
        """Generate a detailed fix report"""
        
        report = []
        report.append("=== Portfolio Validation Report ===\n")
        
        if self.fixed_count > 0:
            report.append(f"✅ Applied {self.fixed_count} automatic fixes\n")
        
        if self.errors:
            report.append(f"\n❌ Found {len(self.errors)} errors:")
            for error in self.errors:
                report.append(f"  - {error}")
        
        if self.warnings:
            report.append(f"\n⚠️  Found {len(self.warnings)} warnings:")
            for warning in self.warnings:
                report.append(f"  - {warning}")
        
        if not self.errors and not self.warnings:
            report.append("\n✅ Portfolio is valid and ready to run!")
        
        return "\n".join(report)


# Singleton instance
portfolio_validator = PortfolioValidator()