"""
Portfolio Generator V2 - With Universal Adapter Integration
Replaces 1000+ lines of if/elif code with clean Universal Adapter calls
"""
import logging
import json
import shutil
from typing import Dict, List, Any, Optional, Set
from pathlib import Path
from datetime import datetime

from .component_selector import ComponentSelection
from .universal_adapter import universal_adapter

logger = logging.getLogger(__name__)

# Path to Aceternity components library
ACETERNITY_COMPONENTS_PATH = Path(__file__).parent.parent.parent / "aceternity-components-library" / "components" / "ui"

class PortfolioGeneratorV2:
    """
    Next-generation Portfolio Generator using Universal Adapter
    Replaces the massive if/elif nightmare with clean, maintainable code
    """
    
    def generate_portfolio(
        self, 
        selections: List[ComponentSelection],
        user_name: str,
        output_dir: Optional[Path] = None
    ) -> Dict[str, str]:
        """Generate portfolio with Universal Adapter magic"""
        
        # Sanitize user name for filenames
        safe_name = user_name.lower().replace(' ', '-').replace('.', '').replace(',', '')
        
        # Generate all files using Universal Adapter
        files = {
            "app/page.tsx": self._generate_main_page(selections, user_name),
            "app/layout.tsx": self._generate_layout(user_name),
            "app/globals.css": self._generate_styles(),
            "lib/portfolio-data.ts": self._generate_data_file(selections),
            "lib/utils.ts": self._generate_utils(),
            "package.json": self._generate_package_json(safe_name),
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
            
            logger.info(f"Portfolio generated at: {output_dir}")
            
        return files
    
    def _generate_main_page(self, selections: List[ComponentSelection], user_name: str) -> str:
        """Generate main page using Universal Adapter for ALL components"""
        
        # Generate imports
        imports = set()
        component_usage = []
        
        # Component file mapping for imports
        component_file_mapping = {
            'hero-highlight': 'hero-highlight-base',
            'aurora-background': 'aurora-background-base',
            'wavy-background': 'wavy-background-base',
            'background-beams': 'background-beams-base',
            'text-generate-effect': 'text-generate-effect-base',
            'typewriter-effect': 'typewriter-effect-base',
            'timeline': 'timeline-base',
            'bento-grid': 'bento-grid-base',
            'card-hover-effect': 'card-hover-effect-base',
            '3d-card': '3d-card-base',
            'glare-card': 'glare-card',
            'wobble-card': 'wobble-card',
            'evervault-card': 'evervault-card-base',
            'animated-testimonials': 'animated-testimonials-base',
            'animated-tooltip': 'animated-tooltip-base',
            'floating-dock': 'floating-dock-base',
            'infinite-moving-cards': 'infinite-moving-cards',
            'animated-tabs': 'animated-tabs-base',
            'sticky-scroll-reveal': 'sticky-scroll-reveal',
            'tracing-beam': 'tracing-beam',
            'flip-words': 'flip-words'
        }
        
        for selection in selections:
            component_name = ''.join(word.capitalize() for word in selection.component_type.split('-'))
            
            # Add import
            file_name = component_file_mapping.get(selection.component_type, selection.component_type)
            imports.add(f'import {{ {component_name} }} from "@/components/ui/{file_name}";')
            
            # Generate component usage using Universal Adapter
            usage = self._generate_component_usage_v2(selection, user_name)
            component_usage.append(usage)
        
        # Create main page template
        imports_str = '\n'.join(sorted(imports))
        components_str = '\n'.join(component_usage)
        
        return f'''import React from "react";
{imports_str}
import {{ portfolioData }} from "@/lib/portfolio-data";

export default function Home() {{
  return (
    <main className="min-h-screen bg-black text-white">
      {components_str}
    </main>
  );
}}'''

    def _generate_component_usage_v2(self, selection: ComponentSelection, user_name: str) -> str:
        """
        Generate component usage using Universal Adapter
        THIS REPLACES 1000+ LINES OF IF/ELIF CODE!
        """
        try:
            # Use Universal Adapter to get component props
            adapted_props = universal_adapter.adapt(
                selection.component_type,
                selection.data,
                selection.section,
                selection.options if hasattr(selection, 'options') else {}
            )
            
            # Convert Python props to TypeScript/React props
            tsx_props = self._convert_props_to_tsx(adapted_props, selection)
            
            # Generate the actual component usage
            return self._render_component_tsx(
                selection.component_type,
                selection.section,
                tsx_props,
                user_name
            )
            
        except Exception as e:
            logger.error(f"Error adapting {selection.component_type}: {e}")
            # Fallback to basic component
            return self._generate_fallback_component(selection, user_name)
    
    def _convert_props_to_tsx(self, props: Dict[str, Any], selection: ComponentSelection) -> str:
        """Convert Python props dict to TSX props string"""
        tsx_parts = []
        
        for key, value in props.items():
            if key == 'className':
                tsx_parts.append(f'className="{value}"')
            elif isinstance(value, str):
                tsx_parts.append(f'{key}="{value}"')
            elif isinstance(value, bool):
                tsx_parts.append(f'{key}={{{str(value).lower()}}}')
            elif isinstance(value, (list, dict)):
                # Convert to JSON for complex objects
                json_value = json.dumps(value, indent=2)
                tsx_parts.append(f'{key}={{{json_value}}}')
            elif isinstance(value, (int, float)):
                tsx_parts.append(f'{key}={{{value}}}')
            else:
                tsx_parts.append(f'{key}={{{json.dumps(value)}}}')
        
        return ' '.join(tsx_parts)
    
    def _render_component_tsx(self, component_type: str, section: str, 
                             props_str: str, user_name: str) -> str:
        """Render the final TSX component with Universal Adapter props"""
        
        component_name = ''.join(word.capitalize() for word in component_type.split('-'))
        section_title = section.replace('_', ' ').title()
        
        # Handle different component categories
        if component_type in ['aurora-background', 'wavy-background', 'background-beams']:
            # Background wrapper components
            return f'''
      {{/* {section_title} Section */}}
      <section id="{section}" className="min-h-screen flex items-center justify-center relative">
        <{component_name} className="absolute inset-0" />
        <div className="relative z-10 text-center max-w-4xl mx-auto p-8">
          <h1 className="text-4xl md:text-7xl font-bold text-white mb-4">
            {user_name}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300">
            Full Stack Developer
          </p>
        </div>
      </section>'''
        
        elif component_type in ['hero-highlight']:
            # Hero components with children
            return f'''
      {{/* {section_title} Section */}}
      <section id="{section}" className="relative">
        <{component_name} className="min-h-screen">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4">
              <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
                {user_name}
              </h1>
              <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
                Passionate Full Stack Developer
              </p>
            </div>
          </div>
        </{component_name}>
      </section>'''
        
        elif component_type in ['text-generate-effect', 'typewriter-effect']:
            # Text effect components
            return f'''
      {{/* {section_title} Section */}}
      <section id="{section}" className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <{component_name} {props_str} />
        </div>
      </section>'''
        
        else:
            # Standard components with props
            return f'''
      {{/* {section_title} Section */}}
      <section id="{section}" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            {section_title}
          </h2>
          <{component_name} {props_str} />
        </div>
      </section>'''
    
    def _generate_fallback_component(self, selection: ComponentSelection, user_name: str) -> str:
        """Fallback component when Universal Adapter fails"""
        section_title = selection.section.replace('_', ' ').title()
        
        return f'''
      {{/* {section_title} Section - Fallback */}}
      <section id="{selection.section}" className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-white">{section_title}</h2>
          <div className="bg-gray-800 rounded-lg p-8">
            <p className="text-gray-300">Content for {selection.section} section</p>
          </div>
        </div>
      </section>'''
    
    def _generate_data_file(self, selections: List[ComponentSelection]) -> str:
        """Generate portfolio data file with Universal Adapter processed data"""
        
        data_sections = {}
        
        for selection in selections:
            try:
                # Use Universal Adapter to process data
                adapted_data = universal_adapter.adapt(
                    selection.component_type,
                    selection.data,
                    selection.section
                )
                
                # Store processed data
                data_sections[f"{selection.section}Data"] = adapted_data
                
            except Exception as e:
                logger.error(f"Error processing data for {selection.section}: {e}")
                # Fallback to raw data
                data_sections[f"{selection.section}Data"] = selection.data
        
        # Convert to TypeScript
        data_json = json.dumps(data_sections, indent=2)
        
        return f'''// Portfolio data processed by Universal Adapter
export const portfolioData = {data_json};

export type PortfolioData = typeof portfolioData;
'''
    
    def _copy_aceternity_components(self, selections: List[ComponentSelection], output_dir: Path):
        """Copy required Aceternity components to project"""
        
        components_dir = output_dir / "components" / "ui"
        components_dir.mkdir(parents=True, exist_ok=True)
        
        # Get unique component types
        component_types = set(selection.component_type for selection in selections)
        
        for component_type in component_types:
            # Copy component files
            source_component = ACETERNITY_COMPONENTS_PATH / component_type
            
            if source_component.exists():
                if source_component.is_dir():
                    # Copy entire directory
                    target_dir = components_dir / component_type
                    if target_dir.exists():
                        shutil.rmtree(target_dir)
                    shutil.copytree(source_component, target_dir)
                else:
                    # Copy single file
                    shutil.copy2(source_component, components_dir)
                
                logger.info(f"Copied component: {component_type}")
            else:
                logger.warning(f"Component not found: {component_type}")
    
    # Utility file generators (same as original)
    def _generate_layout(self, user_name: str) -> str:
        """Generate Next.js layout"""
        return f'''import './globals.css'
import type {{ Metadata }} from 'next'
import {{ Inter }} from 'next/font/google'

const inter = Inter({{ subsets: ['latin'] }})

export const metadata: Metadata = {{
  title: '{user_name} - Portfolio',
  description: 'Professional portfolio built with CV2WEB',
}}

export default function RootLayout({{
  children,
}}: {{
  children: React.ReactNode
}}) {{
  return (
    <html lang="en" className="dark">
      <body className={{inter.className}}>{{children}}</body>
    </html>
  )
}}'''

    def _generate_styles(self) -> str:
        """Generate global styles"""
        return '''@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
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
}'''

    def _generate_utils(self) -> str:
        """Generate utility functions"""
        return '''import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}'''

    def _generate_package_json(self, safe_name: str) -> str:
        """Generate package.json"""
        return f'''{{
  "name": "{safe_name}-portfolio",
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
    "@tabler/icons-react": "^2.47.0",
    "class-variance-authority": "^0.7.0",
    "lucide-react": "^0.303.0"
  }},
  "devDependencies": {{
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.0.1",
    "postcss": "^8",
    "tailwindcss": "^3.3.0",
    "eslint": "^8",
    "eslint-config-next": "14.0.4"
  }}
}}'''

    def _generate_readme(self, user_name: str, selections: List[ComponentSelection]) -> str:
        """Generate README file"""
        components_used = [sel.component_type for sel in selections]
        
        return f'''# {user_name} - Portfolio

This portfolio was generated using **CV2WEB** with Universal Adapter technology.

## Features

- ⚡ Built with Next.js 14 and TypeScript
- 🎨 Beautiful Aceternity UI components  
- 🚀 Universal Adapter for seamless component integration
- 📱 Fully responsive design
- 🌙 Dark mode optimized

## Components Used

{chr(10).join(f"- {comp}" for comp in components_used)}

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portfolio.

## Built with CV2WEB

This portfolio was automatically generated using CV2WEB's Universal Adapter system.

---

*Generated by CV2WEB Universal Adapter*
'''

    def _generate_tailwind_config(self) -> str:
        """Generate Tailwind config"""
        return '''/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
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
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
}'''

    def _generate_postcss_config(self) -> str:
        """Generate PostCSS config"""
        return '''module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}'''

    def _generate_tsconfig(self) -> str:
        """Generate TypeScript config"""
        return '''{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
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
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}'''

    def _generate_env_file(self) -> str:
        """Generate environment file"""
        return '''# Generated by CV2WEB
NEXT_PUBLIC_APP_NAME="CV2WEB Portfolio"
'''

    def _generate_next_config(self) -> str:
        """Generate Next.js config"""
        return '''/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
'''

# Create instance for easy import
portfolio_generator_v2 = PortfolioGeneratorV2()