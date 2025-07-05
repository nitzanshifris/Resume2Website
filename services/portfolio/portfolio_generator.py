"""
Improved Portfolio Generator that properly uses Aceternity components
"""
import logging
import json
import shutil
from typing import Dict, List, Any, Optional, Set
from pathlib import Path
from datetime import datetime
from pydantic import HttpUrl
from pydantic_core import Url

from .component_selector import ComponentSelection
from .component_adapter import component_adapter
from .component_mappings import COMPONENT_PROP_MAPPINGS
from .universal_adapter import universal_adapter
from .portfolio_validator import portfolio_validator
from .component_registry import component_registry
from .component_import_fixer import ComponentImportFixer
from .text_sizing import text_sizing

logger = logging.getLogger(__name__)

# Path to Aceternity components library
ACETERNITY_COMPONENTS_PATH = Path(__file__).parent.parent.parent / "aceternity-components-library" / "components" / "ui"

class PydanticJSONEncoder(json.JSONEncoder):
    """Custom JSON encoder that handles Pydantic types"""
    def default(self, obj):
        if isinstance(obj, Url):
            return str(obj)
        elif hasattr(obj, 'model_dump'):
            return obj.model_dump()
        elif hasattr(obj, '__dict__'):
            return obj.__dict__
        return super().default(obj)

def sanitize_props_for_json(props: Any) -> Any:
    """Recursively convert all Pydantic types to JSON-serializable values"""
    if isinstance(props, dict):
        return {k: sanitize_props_for_json(v) for k, v in props.items()}
    elif isinstance(props, list):
        return [sanitize_props_for_json(item) for item in props]
    elif isinstance(props, Url):
        return str(props)
    elif hasattr(props, 'model_dump'):
        return sanitize_props_for_json(props.model_dump())
    else:
        return props

class PortfolioGenerator:
    """
    Generates Next.js portfolios using actual Aceternity component interfaces
    """
    
    def generate_portfolio(
        self, 
        selections: List[ComponentSelection],
        user_name: str,
        output_dir: Optional[Path] = None
    ) -> Dict[str, str]:
        """Generate portfolio with proper Aceternity component usage"""
        
        # Sanitize user name for filenames
        safe_name = user_name.lower().replace(' ', '-').replace('.', '').replace(',', '')
        
        # Generate all files
        files = {
            "app/page.tsx": self._generate_main_page(selections, user_name),
            "app/layout.tsx": self._generate_layout(user_name),
            "app/globals.css": self._generate_styles(),
            "lib/portfolio-data.ts": self._generate_data_file(selections),
            "lib/utils.ts": self._generate_utils(),
            "package.json": self._generate_package_json(safe_name),
            "components/ui/hero-content.tsx": self._generate_hero_content_component(),
            "components/ui/bento-grid-item.tsx": self._generate_bento_grid_item(),
            "README.md": self._generate_readme(user_name, selections),
            "tailwind.config.js": self._generate_tailwind_config(),
            "postcss.config.js": self._generate_postcss_config(),
            "tsconfig.json": self._generate_tsconfig(),
            ".env.local": self._generate_env_file(),
            "next.config.js": self._generate_next_config()
        }
        
        # Save files if output directory provided
        if output_dir:
            output_dir = Path(output_dir)
            output_dir.mkdir(parents=True, exist_ok=True)
            
            for filename, content in files.items():
                file_path = output_dir / filename
                file_path.parent.mkdir(parents=True, exist_ok=True)
                
                with open(file_path, 'w') as f:
                    f.write(content)
            
            # Copy required Aceternity components
            self._copy_aceternity_components(selections, output_dir)
            
            # Fix import paths in copied components
            self._fix_component_imports(output_dir)
                    
            logger.info(f"Portfolio generated at: {output_dir}")
            
            # Ensure all boilerplate files exist before validation
            self._ensure_boilerplate_files(output_dir)
            
            # Validate and fix the generated portfolio
            logger.info("Validating generated portfolio...")
            is_valid, errors, fixes = portfolio_validator.validate_and_fix_portfolio(output_dir)
            
            if not is_valid:
                logger.error(f"Portfolio validation failed with {len(errors)} errors")
                for error in errors:
                    logger.error(f"  - {error}")
            else:
                logger.info(f"Portfolio validated successfully with {fixes} automatic fixes applied")
            
            # Generate validation report
            report = portfolio_validator.generate_fix_report()
            report_path = output_dir / "validation_report.txt"
            report_path.write_text(report)
            logger.info(f"Validation report saved to: {report_path}")
            
        return files
    
    def _generate_main_page(self, selections: List[ComponentSelection], user_name: str) -> str:
        """Generate main page with proper component usage"""
        
        # Generate imports
        imports = set()  # Use set to avoid duplicates
        component_usage = []
        
        # Map component types to their base file imports
        component_file_mapping = {
            'background-gradient': 'background-gradient-base',
            'text-generate-effect': 'text-generate-effect-base',
            'timeline': 'timeline-base',
            'timeline-minimal': 'timeline',  # Use existing timeline component
            'text-simple': 'text-generate-effect',  # Use text-generate-effect component
            'bento-grid': 'bento-grid-base',
            'card-hover-effect': 'card-hover-effect-base',
            'animated-testimonials': 'animated-testimonials-base',
            'floating-dock': 'floating-dock-base'
        }
        
        # Check component registry for proper prop mapping
        
        for selection in selections:
            # Get component info from registry
            resolved_key, component_config = component_registry.resolve_component(selection.component_type)
            
            if not resolved_key:
                logger.warning(f"Component {selection.component_type} not in registry, skipping")
                continue
            
            # Get import path and named exports from registry
            import_path = component_config.get("import", "")
            named_exports = component_config.get("named_exports", [])
            
            if not import_path or not named_exports:
                logger.warning(f"Invalid registry entry for {resolved_key}")
                continue
            
            # Generate import statement
            imports.add(f"import {{ {', '.join(named_exports)} }} from '{import_path}';")
            
            # Store component info for usage
            props_name = f"{selection.section}Data"
            component_name = named_exports[0]  # Primary export
            
            # Get component prop mapping info
            component_info = COMPONENT_PROP_MAPPINGS.get(selection.component_type, {})
            required_props = component_info.get("required", [])
            
            # Generate component usage based on resolved component type
            component_html = self._generate_component_usage(
                resolved_key,
                component_name,
                props_name,
                selection.section,
                required_props,
                user_name
            )
            
            component_usage.append(component_html)
        
        # Combine everything
        imports_str = '\n'.join(sorted(imports))
        components_str = '\n'.join(component_usage)
        
        # Add special imports based on components used
        additional_imports = self._get_additional_imports(selections)
        if additional_imports:
            imports_str += "\n" + additional_imports
        
        # Add data extraction with proper defaults
        data_extractions = []
        for selection in selections:
            data_extractions.append(f"const {selection.section}Data = portfolioData.{selection.section} || {{}};")
        
        # Add skill items mapping if skills section exists
        skill_mapping = ""
        if any(sel.section == 'skills' for sel in selections):
            skill_mapping = """
  // Map skills to BentoGrid format
  const skillItems = skillsData.items?.map((skill: any, i: number) => ({
    title: skill.title,
    description: skill.description,
    header: skill.headerGradient ? (() => (
      <div className={`flex flex-1 w-full h-full min-h-[6rem] rounded-xl ${skill.headerGradient}`}></div>
    ))() : (() => (
      <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
    ))(),
    className: skill.className || ""
  })) || [];"""
        
        # Add dock items mapping if contact section exists
        dock_mapping = ""
        if any(sel.section == 'contact' for sel in selections):
            dock_mapping = """
  // Map contact items with icons
  const dockItems = contactData.items?.map((item: any) => ({
    title: item.title,
    icon: item.icon === 'email' ? IconMail : 
          item.icon === 'phone' ? IconUser : 
          IconHome,
    href: item.link
  })) || [];"""
        
        data_declarations = '\n  '.join(data_extractions)
        
        return f""""use client";

import {{ portfolioData }} from '@/lib/portfolio-data';
{imports_str}

export default function Portfolio() {{
  // Extract data for each section
  {data_declarations}
{skill_mapping}
{dock_mapping}

  return (
    <main className="relative min-h-screen bg-black">
      {components_str}
    </main>
  );
}}"""

    def _generate_component_usage(self, component_type: str, component_name: str, 
                                 props_name: str, section: str, required_props: List[str],
                                 user_name: str) -> str:
        """
        Generate component usage using Universal Adapter
        THIS REPLACES 300+ LINES OF IF/ELIF CODE WITH CLEAN ADAPTER LOGIC!
        """
        try:
            # Use Universal Adapter approach to render component TSX
            return self._render_component_tsx_with_adapter(
                component_type, 
                component_name,
                section, 
                props_name,
                user_name
            )
            
        except Exception as e:
            logger.error(f"Error in Universal Adapter for {component_type}: {e}")
            # Fallback to basic component
            return self._generate_fallback_component(component_type, component_name, props_name, section, user_name)
    
    def _render_component_tsx_with_adapter(self, component_type: str, component_name: str,
                                          section: str, props_name: str, user_name: str) -> str:
        """Render TSX component using Universal Adapter approach"""
        
        section_title = section.replace('_', ' ').title()
        
        # Helper function to check if data is empty
        empty_check = self._get_empty_check(component_type, props_name)
        
        # Text sizing classes
        text_size_hero = text_sizing.HERO_TITLE
        text_size_section = text_sizing.SECTION_TITLE
        text_size_subsection = text_sizing.SUBSECTION_TITLE
        text_size_lead = text_sizing.LEAD_TEXT
        text_size_body = text_sizing.BODY_TEXT
        text_size_small = text_sizing.SMALL_TEXT
        text_size_card_title = text_sizing.CARD_TITLE
        text_size_card_desc = text_sizing.CARD_DESCRIPTION
        
        # Handle different component categories using Universal Adapter logic
        if component_type in ['aurora-background', 'wavy-background', 'background-beams', 'background-gradient']:
            # Background wrapper components
            return f'''
      {{/* {section_title} Section */}}
      <section id="{section}" className="min-h-screen flex items-center justify-center relative">
        <{component_name} className="absolute inset-0" />
        <div className="relative z-10 text-center max-w-4xl mx-auto p-8">
          <h1 className="{text_size_hero} font-bold text-white mb-4">
            {{{props_name}.title || '{user_name}'}}
          </h1>
          <p className="{text_size_lead}">
            {{{props_name}.subtitle || 'Full Stack Developer'}}
          </p>
          {{{props_name}.description && (
            <p className="{text_size_body} text-gray-400 mt-4 max-w-2xl mx-auto">
              {{{props_name}.description}}
            </p>
          )}}
        </div>
      </section>'''
        
        elif component_type in ['hero-highlight', 'lamp', 'spotlight']:
            # Hero components with children  
            return f'''
      {{/* {section_title} Section */}}
      <section id="{section}" className="relative">
        <{component_name} className="min-h-screen">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4">
              <h1 className="{text_size_hero} font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
                {{{props_name}.title || '{user_name}'}}
              </h1>
              <p className="mt-4 {text_size_body} text-gray-300 max-w-2xl mx-auto">
                {{{props_name}.subtitle || 'Passionate Full Stack Developer'}}
              </p>
            </div>
          </div>
        </{component_name}>
      </section>'''
        
        elif component_type in ['text-generate-effect', 'typewriter-effect', 'flip-words']:
            # Text effect components
            prop_name = 'words' if component_type != 'typewriter-effect' else 'text'
            return f'''
      {{/* {section_title} Section */}}
      {{{empty_check} && (
        <section id="{section}" className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <{component_name} {prop_name}={{{props_name}.{prop_name} || '{user_name}'}} className="text-center" />
          </div>
        </section>
      )}}'''
        
        elif component_type == 'timeline':
            # Timeline with Universal Adapter format
            return f'''
      {{/* {section_title} Timeline */}}
      {{{empty_check} && (
        <section id="{section}" className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="{text_size_section} font-bold text-center mb-12 text-white">{section_title}</h2>
            <{component_name} data={{{props_name}.entries || []}} />
          </div>
        </section>
      )}}'''
        
        elif component_type == 'bento-grid':
            # BentoGrid with Universal Adapter format + fallback handling
            return f'''
      {{/* {section_title} Grid */}}
      {{({props_name}.items && {props_name}.items.length >= 3) ? (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="{text_size_section} font-bold text-center mb-12 text-white">{section_title}</h2>
            <BentoGrid className="max-w-5xl mx-auto">
              {{{props_name}.items.map((item: any, i: number) => (
                <BentoGridItem
                  key={{i}}
                  title={{item.title}}
                  description={{item.description}}
                  header={{(() => {{
                    const gradientClass = item.headerGradient || item.header?.className || 
                      "flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100";
                    return <div className={{gradientClass}}></div>;
                  }})()}}
                  className={{item.className || ""}}
                  icon={{item.icon}}
                />
              ))}}
            </BentoGrid>
          </div>
        </section>
      ) : (
        {{/* Fallback to WobbleCard for < 3 items */}}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="{text_size_section} font-bold text-center mb-12 text-white">{section_title}</h2>
            <div className={{{props_name}.className || "grid grid-cols-1 md:grid-cols-2 gap-4 max-w-7xl mx-auto w-full"}}>
              {{{props_name}.cards?.map((card: any, i: number) => (
                <div key={{i}} className={{card.containerClassName || "col-span-1 min-h-[6rem]"}}>
                  <h3 className="{text_size_card_title} text-white mb-2">{{card.title}}</h3>
                  <p className="{text_size_card_desc}">{{card.description}}</p>
                </div>
              ))}}
            </div>
          </div>
        </section>
      )}}'''
        
        elif component_type == 'card-hover-effect':
            # CardHoverEffect with carousel wrapping
            return f'''
      {{/* {section_title} Cards */}}
      {{{empty_check} && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="{text_size_section} font-bold text-center mb-12 text-white">{section_title}</h2>
            <HoverEffect items={{{props_name}.cards || {props_name}.items || []}} />
          </div>
        </section>
      )}}'''
        
        elif component_type == 'animated-testimonials':
            # AnimatedTestimonials with Universal Adapter format
            return f'''
      {{/* {section_title} */}}
      {{{empty_check} && (
        <section id="{section}" className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="{text_size_section} font-bold text-center mb-12 text-white">{section_title}</h2>
            <{component_name} 
              testimonials={{{props_name}.testimonials || []}} 
              autoplay={{{props_name}.autoplay || true}}
              autoplaySpeed={{{props_name}.autoplaySpeed || 5000}}
            />
          </div>
        </section>
      )}}'''
        
        elif component_type in ['floating-dock', 'floating-navbar']:
            # FloatingDock with Universal Adapter format
            return f'''
      {{/* {section_title} Navigation */}}
      {{{props_name}.items && {props_name}.items.length > 0 && (
        <FloatingDock 
          items={{{props_name}.items}}
          desktopClassName={{{props_name}.className || "fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50"}}
          mobileClassName="fixed bottom-5 right-5 z-50"
        />
      )}}'''
        
        elif component_type == 'infinite-moving-cards':
            # InfiniteMovingCards
            return f'''
      {{/* {section_title} - Moving Cards */}}
      {{{empty_check} && (
        <section id="{section}" className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="{text_size_section} font-bold text-center mb-12 text-white">{section_title}</h2>
            <{component_name} 
              items={{{props_name}.items || []}}
              direction="right"
              speed="slow"
              pauseOnHover={{true}}
              className="max-w-6xl mx-auto"
            />
          </div>
        </section>
      )}}'''
        
        else:
            # Generic adapter fallback
            return f'''
      {{/* {section_title} Section */}}
      {{{empty_check} && (
        <section id="{section}" className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="{text_size_section} font-bold text-center mb-12 text-white">{section_title}</h2>
            <{component_name} 
              items={{{props_name}.cards || {props_name}.items || []}}
              {{...{props_name}}}
            />
          </div>
        </section>
      )}}'''
    
    def _get_empty_check(self, component_type: str, props_name: str) -> str:
        """Generate appropriate empty check condition for component type"""
        # Components that use arrays
        array_components = [
            'timeline', 'bento-grid', 'card-hover-effect', 'card-stack',
            'animated-tooltip', 'animated-testimonials', 'floating-dock',
            'infinite-moving-cards', 'focus-cards', 'layout-grid'
        ]
        
        # Components that use text/words
        text_components = [
            'text-generate-effect', 'typewriter-effect', 'flip-words',
            'text-reveal-card', 'text-simple'
        ]
        
        if component_type in array_components:
            # Check for items, cards, entries, people, testimonials etc.
            return f"({props_name}.items?.length > 0 || {props_name}.cards?.length > 0 || {props_name}.entries?.length > 0 || {props_name}.people?.length > 0 || {props_name}.testimonials?.length > 0)"
        elif component_type in text_components:
            # Check for text content
            return f"({props_name}.words || {props_name}.text || {props_name}.content)"
        else:
            # Default check - has any content
            return f"(Object.keys({props_name} || {{}}).length > 0)"
    
    def _generate_fallback_component(self, component_type: str, component_name: str, 
                                   props_name: str, section: str, user_name: str) -> str:
        """Fallback component when Universal Adapter fails"""
        section_title = section.replace('_', ' ').title()
        
        return f'''
      {{/* {section_title} Section - Fallback */}}
      <section id="{section}" className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-white">{section_title}</h2>
          <div className="bg-gray-800 rounded-lg p-8">
            <p className="text-gray-300">Content for {section} section using {component_type}</p>
            <pre className="text-sm text-gray-400 mt-4">{{JSON.stringify({props_name}, null, 2)}}</pre>
          </div>
        </div>
      </section>'''
    def _get_additional_imports(self, selections: List[ComponentSelection]) -> str:
        """Get additional imports based on components used"""
        imports = []
        
        component_types = [sel.component_type for sel in selections]
        
        # Hero content for wrapper components
        if any(comp in ['background-gradient', 'background-beams', 'aurora-background'] 
               for comp in component_types):
            imports.append("import { HeroContent } from '@/components/ui/hero-content';")
        
        # Utils for className manipulation (but not BentoGridItem as it's already imported)
        if any('bento' in comp or 'grid' in comp for comp in component_types):
            imports.append("import { cn } from '@/lib/utils';")
            # Don't import BentoGridItem here as it's already imported with BentoGrid
        
        # Icons for various components
        if any(comp in ['floating-dock', 'floating-navbar', 'animated-tooltip'] 
               for comp in component_types):
            imports.append("import { IconHome, IconUser, IconMail } from '@tabler/icons-react';")
        
        return '\n'.join(imports)

    def _generate_data_declarations(self, selections: List[ComponentSelection]) -> str:
        """Generate data declarations for each section"""
        declarations = []
        for selection in selections:
            declarations.append(f"const {selection.section}Data = portfolioData.{selection.section};")
        return '\n  '.join(declarations)
    
    def _generate_hero_content_component(self) -> str:
        """Generate a reusable hero content component"""
        return '''import React from 'react';

interface HeroContentProps {
  data: {
    title?: string;
    subtitle?: string;
    description?: string;
  };
}

export function HeroContent({ data }: HeroContentProps) {
  return (
    <>
      <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">
        {data.subtitle || ''}
      </p>
      <h1 className="text-4xl md:text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600">
        {data.title || 'Portfolio'}
      </h1>
      <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mt-4 max-w-lg text-center">
        {data.description || ''}
      </p>
    </>
  );
}'''
    
    def _generate_utils(self) -> str:
        """Generate utils.ts file"""
        return '''import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}'''
    
    def _generate_bento_grid_item(self) -> str:
        """Generate BentoGridItem component"""
        return '''import { cn } from "@/lib/utils";

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border border-transparent justify-between flex flex-col space-y-4",
        className
      )}
    >
      {header}
      <div className="group-hover/bento:translate-x-2 transition duration-200">
        {icon}
        <div className="font-sans font-bold text-neutral-600 dark:text-neutral-200 mb-2 mt-2">
          {title}
        </div>
        <div className="font-sans font-normal text-neutral-600 text-xs dark:text-neutral-300">
          {description}
        </div>
      </div>
    </div>
  );
};'''
    
    def _generate_layout(self, user_name: str) -> str:
        """Generate layout.tsx"""
        return f"""import type {{ Metadata }} from 'next';
import {{ Inter }} from 'next/font/google';
import './globals.css';

const inter = Inter({{ subsets: ['latin'] }});

export const metadata: Metadata = {{
  title: '{user_name} - Portfolio',
  description: 'Professional portfolio of {user_name}',
}};

export default function RootLayout({{
  children,
}}: {{
  children: React.ReactNode;
}}) {{
  return (
    <html lang="en" className="dark">
      <body className={{inter.className}}>
        {{children}}
      </body>
    </html>
  );
}}"""

    def _generate_data_file(self, selections: List[ComponentSelection]) -> str:
        """Generate portfolio data file"""
        data_sections = []
        
        for selection in selections:
            # Ensure props are properly formatted for TypeScript
            # First sanitize props to remove any Pydantic types
            sanitized_props = sanitize_props_for_json(selection.props)
            props_str = json.dumps(sanitized_props, indent=2, cls=PydanticJSONEncoder)
            props_str = props_str.replace('null', 'undefined')
            
            data_sections.append(f"  {selection.section}: {props_str}")
        
        sections_joined = ',\n'.join(data_sections)
        
        return f"""// Portfolio data generated from CV
// Generated on: {datetime.now().isoformat()}

export const portfolioData = {{
{sections_joined}
}};

// Type exports for TypeScript support
export type PortfolioData = typeof portfolioData;"""

    def _generate_package_json(self, project_name: str) -> str:
        """Generate package.json with all required dependencies"""
        return f"""{{
  "name": "{project_name}-portfolio",
  "version": "0.1.0",
  "private": true,
  "scripts": {{
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }},
  "dependencies": {{
    "next": "14.0.4",
    "react": "^18",
    "react-dom": "^18",
    "framer-motion": "^10.16.16",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.2.0",
    "@radix-ui/react-icons": "^1.3.0",
    "@tabler/icons-react": "^2.47.0",
    "lucide-react": "^0.294.0",
    "aceternity-ui": "^0.1.0"
  }},
  "devDependencies": {{
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.0.1",
    "eslint": "^8",
    "eslint-config-next": "14.0.4",
    "postcss": "^8",
    "tailwindcss": "^3.3.0",
    "typescript": "^5"
  }}
}}"""

    def _generate_styles(self) -> str:
        """Generate globals.css"""
        return """@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 3.9%;
    --primary: 0 0% 9%;
    --primary-foreground: 0 0% 98%;
    --secondary: 0 0% 96.1%;
    --secondary-foreground: 0 0% 9%;
    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 45.1%;
    --accent: 0 0% 96.1%;
    --accent-foreground: 0 0% 9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --ring: 0 0% 3.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
    --card: 0 0% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 0 0% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 0 0% 9%;
    --secondary: 0 0% 14.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 0 0% 14.9%;
    --muted-foreground: 0 0% 63.9%;
    --accent: 0 0% 14.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 14.9%;
    --input: 0 0% 14.9%;
    --ring: 0 0% 83.1%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}"""

    def _generate_tailwind_config(self) -> str:
        """Generate tailwind config"""
        return """/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/aceternity-ui/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
    },
  },
  plugins: [],
}"""

    def _generate_postcss_config(self) -> str:
        """Generate postcss config"""
        return """module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}"""

    def _generate_tsconfig(self) -> str:
        """Generate tsconfig.json"""
        return """{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}"""

    def _generate_env_file(self) -> str:
        """Generate .env.local file"""
        return """# Environment variables
NEXT_PUBLIC_SITE_URL=http://localhost:3000"""

    def _generate_next_config(self) -> str:
        """Generate next.config.js"""
        return """/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'aceternity.com',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

module.exports = nextConfig"""

    def _generate_readme(self, user_name: str, selections: List[ComponentSelection]) -> str:
        """Generate README with setup instructions"""
        components_list = '\n'.join(f'- {sel.component_type}' for sel in selections)
        
        return f"""# {user_name} - Portfolio

This portfolio was generated by CV2WEB using Aceternity UI components.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Aceternity UI components:
   ```bash
   npm install aceternity-ui
   # OR manually copy components from aceternity-components-library
   ```

3. Create a `lib/utils.ts` file:
   ```typescript
   import {{ type ClassValue, clsx }} from "clsx"
   import {{ twMerge }} from "tailwind-merge"
   
   export function cn(...inputs: ClassValue[]) {{
     return twMerge(clsx(inputs))
   }}
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## 📦 Components Used

{components_list}

## 🎨 Customization

- Edit data in `lib/portfolio-data.ts`
- Modify styles in `app/globals.css`
- Adjust component props in `app/page.tsx`

## 🏗️ Project Structure

```
├── app/
│   ├── page.tsx          # Main portfolio page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   └── ui/              # UI components
├── lib/
│   ├── portfolio-data.ts # Portfolio data
│   └── utils.ts         # Utility functions
└── package.json
```

## 📝 Notes

- All Aceternity components expect specific prop structures
- Check component documentation for customization options
- Some components require additional setup (e.g., 3D components need Three.js)

---

Generated with ❤️ by [CV2WEB](https://cv2web.com)
"""
    
    def _ensure_boilerplate_files(self, output_dir: Path):
        """Ensure all essential boilerplate files exist"""
        essential_files = {
            "tailwind.config.js": self._generate_tailwind_config,
            "tailwind.config.ts": self._generate_tailwind_config,  # Some setups use .ts
            "postcss.config.js": self._generate_postcss_config,
            "tsconfig.json": self._generate_tsconfig,
            ".env.local": self._generate_env_file,
            "next.config.js": self._generate_next_config
        }
        
        for filename, generator_method in essential_files.items():
            file_path = output_dir / filename
            if not file_path.exists():
                logger.info(f"Creating missing boilerplate file: {filename}")
                content = generator_method()
                file_path.write_text(content)

    def _copy_aceternity_components(self, selections: List[ComponentSelection], output_dir: Path) -> None:
        """Copy required Aceternity components to the portfolio"""
        
        # Get unique component types and map to actual components
        component_types: Set[str] = set()
        for selection in selections:
            # Map non-existent components to existing ones
            if selection.component_type == 'timeline-minimal':
                component_types.add('timeline')
            elif selection.component_type == 'text-simple':
                component_types.add('text-generate-effect')
            else:
                component_types.add(selection.component_type)
        
        # Add any special components that are always needed
        always_needed = {'background-gradient', 'bento-grid', 'floating-dock'}
        component_types.update(always_needed)
        
        # Create components directory
        components_dir = output_dir / "components" / "ui"
        components_dir.mkdir(parents=True, exist_ok=True)
        
        # Copy each required component directory
        copied_count = 0
        for component_type in component_types:
            # Source directory for the component
            source_dir = ACETERNITY_COMPONENTS_PATH / component_type
            if not source_dir.exists():
                logger.warning(f"Component directory not found: {source_dir}")
                continue
                
            try:
                # Check if it's a directory with multiple files
                if source_dir.is_dir():
                    # Find index.tsx or main export file
                    index_file = source_dir / "index.tsx"
                    if index_file.exists():
                        # This is a multi-file component - copy the entire directory
                        dest_dir = components_dir / component_type
                        shutil.copytree(source_dir, dest_dir, dirs_exist_ok=True)
                        
                        # Create a re-export file at the top level for easier imports
                        reexport_file = components_dir / f"{component_type}.tsx"
                        with open(reexport_file, 'w') as f:
                            f.write(f'export * from "./{component_type}";\n')
                        
                        copied_count += 1
                        logger.debug(f"Copied component directory: {component_type}")
                    else:
                        # Single file component - copy all .tsx files
                        tsx_files = list(source_dir.glob("*.tsx"))
                        if tsx_files:
                            main_file = tsx_files[0]
                            dest_file = components_dir / f"{component_type}.tsx"
                            shutil.copy2(main_file, dest_file)
                            copied_count += 1
                            logger.debug(f"Copied single file component: {component_type}")
                else:
                    logger.warning(f"Expected directory but found file: {source_dir}")
                    
            except Exception as e:
                logger.error(f"Failed to copy {component_type}: {e}")
        
        logger.info(f"Copied {copied_count} Aceternity components to portfolio")

    def _fix_component_imports(self, output_dir: Path) -> None:
        """Fix import paths in copied Aceternity components using registry-based fixer"""
        components_dir = output_dir / "components" / "ui"
        
        if not components_dir.exists():
            return
            
        # Use ComponentImportFixer to fix imports based on registry
        import_fixer = ComponentImportFixer()
        files_fixed, total_fixes = import_fixer.fix_all_imports(output_dir)
        
        if total_fixes > 0:
            logger.info(f"Fixed {total_fixes} imports across {files_fixed} files")
        
        # Also fix common issues with sed
        import subprocess
        
        try:
            # Fix relative imports to use @/lib/utils
            subprocess.run([
                'find', str(components_dir), '-name', '*.tsx', '-type', 'f',
                '-exec', 'sed', '-i', '', 's|../../lib/utils|@/lib/utils|g', '{}', ';'
            ], check=True)
            
            # Fix framer-motion imports
            subprocess.run([
                'find', str(components_dir), '-name', '*.tsx', '-type', 'f',
                '-exec', 'sed', '-i', '', 's|"motion/react"|"framer-motion"|g', '{}', ';'
            ], check=True)
            
            logger.info("Fixed remaining import paths in Aceternity components")
        except subprocess.CalledProcessError as e:
            logger.error(f"Failed to fix additional imports: {e}")

# Export the generator
portfolio_generator = PortfolioGenerator()