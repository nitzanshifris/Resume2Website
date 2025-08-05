#!/usr/bin/env python3
"""
Fixed MCP-based Portfolio Generation for CV2WEB
Improved data extraction and filtering
"""

import json
import asyncio
import subprocess
import shutil
from pathlib import Path
from typing import Dict, List, Optional
import sys
import re

# Add parent directory to path for imports
sys.path.append(str(Path(__file__).parent))

# Use existing CV2WEB extraction system
from services.local.text_extractor import TextExtractor
from services.llm.data_extractor import DataExtractor

class FixedPortfolioGenerator:
    """Generates portfolios with better data extraction"""
    
    BASE_TEMPLATE = Path("portfolio-base-template")
    OUTPUT_DIR = Path("magic-ui-portfolios-fixed")
    CV_DIR = Path("data/cv_examples/pdf_examples/pdf")
    
    # Skills that are too generic or not real skills
    SKILL_BLACKLIST = [
        "personable", "professional", "experienced", "skilled", "competent",
        "deadline management", "quality assurance", "standards adherence",
        "active listening", "team player", "self starter", "detail oriented",
        "issue tracking", "process documentation", "business requirements gathering"
    ]
    
    # Real technical skills keywords
    TECH_SKILLS_KEYWORDS = [
        "python", "javascript", "java", "react", "node", "angular", "vue",
        "html", "css", "sql", "mongodb", "aws", "azure", "docker", "kubernetes",
        "git", "ci/cd", "api", "rest", "graphql", "typescript", "php", "ruby",
        "c++", "c#", ".net", "swift", "kotlin", "flutter", "tensorflow", "pytorch"
    ]
    
    PORTFOLIO_CONFIGS = [
        {
            "id": "dark-tech",
            "name": "Dark Tech Professional",
            "cv": "Berlin-Simple-Resume-Template.pdf",
            "port": 3026,
            "theme": "dark-modern"
        },
        {
            "id": "creative-bright",
            "name": "Creative Bright",
            "cv": "Chicago-Resume-Template-Creative.pdf",
            "port": 3027,
            "theme": "colorful"
        },
        {
            "id": "corporate-clean",
            "name": "Corporate Clean",
            "cv": "London-Resume-Template-Professional.pdf",
            "port": 3028,
            "theme": "professional"
        },
        {
            "id": "modern-gradient",
            "name": "Modern Gradient",
            "cv": "Amsterdam-Modern-Resume-Template.pdf",
            "port": 3029,
            "theme": "gradient"
        },
        {
            "id": "bold-minimal",
            "name": "Bold Minimal",
            "cv": "Madrid-Resume-Template-Modern.pdf",
            "port": 3030,
            "theme": "minimal"
        }
    ]
    
    def __init__(self):
        self.text_extractor = TextExtractor()
        self.data_extractor = DataExtractor()
        
    async def generate_all_portfolios(self) -> Dict:
        """Generate portfolios with better extraction"""
        
        self.OUTPUT_DIR.mkdir(exist_ok=True)
        results = []
        
        for config in self.PORTFOLIO_CONFIGS:
            print(f"\n🎨 Generating {config['name']} portfolio...")
            
            # Extract CV data
            cv_path = self.CV_DIR / config['cv']
            if not cv_path.exists():
                print(f"⚠️  CV not found: {config['cv']}")
                cv_path = self.CV_DIR / "Lisbon-Resume-Template-Creative.pdf"
            
            print(f"📄 Extracting from: {cv_path.name}")
            
            # Extract raw text first to help find name
            raw_text = self.text_extractor.extract_text(str(cv_path))
            
            # Try to extract name from raw text
            name = self._extract_name_from_text(raw_text)
            
            # Get structured data
            cv_data = await self.data_extractor.extract_cv_data(raw_text)
            
            # Transform with name fix
            portfolio_data = self._transform_cv_data(cv_data, name, raw_text)
            
            # Generate portfolio
            result = self._generate_portfolio(portfolio_data, config)
            results.append(result)
            
        self._create_runner_script()
        
        return {
            "success": True,
            "portfolios": results
        }
    
    def _extract_name_from_text(self, text: str) -> str:
        """Try to extract name from raw text"""
        lines = text.strip().split('\n')
        
        # Usually the name is in the first few lines
        for i, line in enumerate(lines[:10]):
            line = line.strip()
            
            # Skip empty lines
            if not line:
                continue
                
            # Skip common headers
            if any(keyword in line.lower() for keyword in ['resume', 'curriculum', 'cv', 'portfolio']):
                continue
                
            # Check if it looks like a name (2-4 words, title case)
            words = line.split()
            if 2 <= len(words) <= 4:
                # Check if words are capitalized (likely a name)
                if all(word[0].isupper() for word in words if word):
                    # Skip if it contains numbers or special chars
                    if not any(char.isdigit() or char in '@#$%^&*()_+-=' for char in line):
                        return line
        
        return ""
    
    def _transform_cv_data(self, cv_data, extracted_name: str, raw_text: str) -> Dict:
        """Transform CV data with fixes"""
        cv_dict = cv_data.dict() if hasattr(cv_data, 'dict') else cv_data
        
        # Fix name - look in the correct place (hero section)
        hero_section = cv_dict.get("hero", {})
        name = hero_section.get("fullName", "")
        
        if not name or name.lower() in ["professional", "nan", "none", ""]:
            name = extracted_name
        
        if not name:
            # Try other common fields
            name = cv_dict.get("name", "") or cv_dict.get("fullName", "") or cv_dict.get("personalInfo", {}).get("name", "")
        
        if not name:
            # Last resort - use a placeholder
            name = "John Doe"
        
        # Extract summary
        summary = self._extract_summary(cv_dict, raw_text)
        
        # Extract job title from hero section or experience
        title = hero_section.get("professionalTitle", "")
        if not title:
            # Try to get from experience section
            experience = cv_dict.get("experience", {})
            if isinstance(experience, dict):
                items = experience.get("experienceItems", [])
                if items and len(items) > 0:
                    title = items[0].get("jobTitle", "")
        
        # Extract and filter skills
        skills = self._extract_and_filter_skills(cv_dict)
        
        return {
            "hero": {
                "fullName": name,
                "summaryTagline": summary or hero_section.get("summaryTagline", ""),
                "title": title,
                "location": cv_dict.get("contact", {}).get("location", {})
            },
            "contact": {
                "email": cv_dict.get("contact", {}).get("email", "") or "contact@example.com",
                "phone": cv_dict.get("contact", {}).get("phone", ""),
                "location": cv_dict.get("contact", {}).get("location", {"city": "", "state": ""})
            },
            "experience": self._transform_experience(cv_dict.get("experience", {})),
            "skills": skills,
            "education": self._transform_education(cv_dict.get("education", {}))
        }
    
    def _extract_summary(self, cv_dict: Dict, raw_text: str) -> str:
        """Extract a proper summary"""
        # Try structured data first - check the correct schema location
        summary_section = cv_dict.get("summary", {})
        if isinstance(summary_section, dict):
            # According to schema, it should be in summaryDescription
            text = summary_section.get("summaryDescription", "") or summary_section.get("summaryText", "") or summary_section.get("objective", "")
            if text and len(text) > 50:
                return text
        elif isinstance(summary_section, str) and len(summary_section) > 50:
            return summary_section
        
        # Try to find summary/objective in raw text
        lines = raw_text.lower().split('\n')
        summary_keywords = ['summary', 'objective', 'profile', 'about']
        
        for i, line in enumerate(lines):
            if any(keyword in line for keyword in summary_keywords):
                # Get next few lines as summary
                summary_lines = []
                for j in range(i+1, min(i+5, len(lines))):
                    if lines[j].strip() and not any(k in lines[j] for k in ['experience', 'education', 'skills']):
                        summary_lines.append(lines[j].strip())
                
                if summary_lines:
                    return ' '.join(summary_lines).capitalize()
        
        return "Experienced professional seeking new opportunities to leverage skills and expertise."
    
    def _extract_and_filter_skills(self, cv_dict: Dict) -> Dict:
        """Extract and intelligently filter skills"""
        raw_skills = self._get_all_skills(cv_dict)
        
        # Filter out non-skills
        filtered_skills = []
        for skill in raw_skills:
            skill_lower = skill.lower().strip()
            
            # Skip if in blacklist
            if any(blacklist in skill_lower for blacklist in self.SKILL_BLACKLIST):
                continue
            
            # Skip if too long (probably a sentence)
            if len(skill) > 40:
                continue
            
            # Skip if it's a number or just one character
            if len(skill) < 2 or skill.isdigit():
                continue
            
            filtered_skills.append(skill)
        
        # Remove duplicates while preserving order
        seen = set()
        unique_skills = []
        for skill in filtered_skills:
            skill_lower = skill.lower()
            if skill_lower not in seen:
                seen.add(skill_lower)
                unique_skills.append(skill)
        
        # Limit to reasonable number
        unique_skills = unique_skills[:30]
        
        # Categorize skills
        return self._categorize_skills(unique_skills)
    
    def _get_all_skills(self, cv_dict: Dict) -> List[str]:
        """Get all skills from various sources"""
        skills = []
        
        # From skills field - according to our schema
        skills_section = cv_dict.get("skills", {})
        if isinstance(skills_section, dict):
            # Check for skillCategories (our schema)
            skill_categories = skills_section.get("skillCategories", [])
            if skill_categories:
                for category in skill_categories:
                    if isinstance(category, dict):
                        category_skills = category.get("skills", [])
                        if isinstance(category_skills, list):
                            skills.extend([s for s in category_skills if isinstance(s, str)])
            
            # Also check for ungroupedSkills
            ungrouped = skills_section.get("ungroupedSkills", [])
            if isinstance(ungrouped, list):
                skills.extend([s for s in ungrouped if isinstance(s, str)])
        elif isinstance(skills_section, list):
            skills.extend([s for s in skills_section if isinstance(s, str)])
        
        # From certifications
        certs = cv_dict.get("certifications", [])
        if isinstance(certs, list):
            for cert in certs:
                if isinstance(cert, dict):
                    cert_name = cert.get("name", "")
                    if cert_name and len(cert_name) < 40:
                        skills.append(cert_name)
                elif isinstance(cert, str) and len(cert) < 40:
                    skills.append(cert)
        
        return skills
    
    def _categorize_skills(self, skills: List[str]) -> Dict:
        """Categorize skills intelligently"""
        categories = {
            "Technical Skills": [],
            "Tools & Technologies": [],
            "Professional Skills": [],
            "Certifications": []
        }
        
        for skill in skills:
            skill_lower = skill.lower()
            
            # Check for certifications
            if any(cert in skill_lower for cert in ['certified', 'certification', 'comptia', 'cisco', 'microsoft certified', 'aws certified']):
                categories["Certifications"].append(skill)
            # Check for programming languages and tech
            elif any(tech in skill_lower for tech in self.TECH_SKILLS_KEYWORDS):
                categories["Technical Skills"].append(skill)
            # Check for tools
            elif any(tool in skill_lower for tool in ['excel', 'word', 'powerpoint', 'jira', 'slack', 'git', 'docker', 'adobe']):
                categories["Tools & Technologies"].append(skill)
            # Everything else is professional
            else:
                categories["Professional Skills"].append(skill)
        
        # Return only non-empty categories
        return {
            "skillCategories": [
                {"categoryName": cat, "skills": skills[:8]}  # Limit skills per category
                for cat, skills in categories.items()
                if skills
            ]
        }
    
    def _transform_experience(self, experience):
        """Transform experience data"""
        if isinstance(experience, dict) and "experienceItems" in experience:
            items = experience["experienceItems"]
        elif isinstance(experience, list):
            items = experience
        else:
            items = []
        
        # Limit responsibilities per job
        for item in items:
            if isinstance(item, dict) and "responsibilitiesAndAchievements" in item:
                responsibilities = item["responsibilitiesAndAchievements"]
                if isinstance(responsibilities, list) and len(responsibilities) > 5:
                    item["responsibilitiesAndAchievements"] = responsibilities[:5]
        
        return {"experienceItems": items[:4]}  # Limit to 4 experiences
    
    def _transform_education(self, education):
        """Transform education data"""
        if isinstance(education, dict) and "educationItems" in education:
            items = education["educationItems"]
        elif isinstance(education, list):
            items = education
        else:
            items = []
        
        return {"educationItems": items[:3]}  # Limit to 3 education items
    
    def _generate_portfolio(self, cv_data: Dict, config: Dict) -> Dict:
        """Generate a single portfolio"""
        portfolio_path = self.OUTPUT_DIR / f"portfolio-{config['id']}"
        
        # Copy base template
        if portfolio_path.exists():
            shutil.rmtree(portfolio_path)
        shutil.copytree(self.BASE_TEMPLATE, portfolio_path, symlinks=True)
        
        # Save CV data
        with open(portfolio_path / "cv-data.json", "w") as f:
            json.dump(cv_data, f, indent=2)
        
        # Generate custom files
        self._generate_app_files(portfolio_path, cv_data, config)
        
        # Setup node_modules
        self._setup_node_modules(portfolio_path)
        
        return {
            "style": config["name"],
            "path": str(portfolio_path),
            "port": config["port"],
            "cv": config["cv"]
        }
    
    def _setup_node_modules(self, portfolio_path: Path):
        """Setup node_modules"""
        base_node_modules = Path.cwd() / self.BASE_TEMPLATE / "node_modules"
        portfolio_node_modules = portfolio_path / "node_modules"
        
        if portfolio_node_modules.exists():
            if portfolio_node_modules.is_symlink():
                portfolio_node_modules.unlink()
            else:
                shutil.rmtree(portfolio_node_modules)
        
        try:
            portfolio_node_modules.symlink_to(base_node_modules)
        except:
            pass
    
    def _generate_app_files(self, portfolio_path: Path, cv_data: Dict, config: Dict):
        """Generate app files for portfolio"""
        app_dir = portfolio_path / "app"
        app_dir.mkdir(exist_ok=True)
        
        # Different themes
        themes = {
            "dark-modern": {
                "dark": True,
                "colors": {"primary": "#06b6d4", "secondary": "#8b5cf6"},
                "hero_bg": "bg-gradient-to-br from-gray-900 via-black to-gray-900",
                "skill_style": "grid"
            },
            "colorful": {
                "dark": False,
                "colors": {"primary": "#f97316", "secondary": "#ec4899"},
                "hero_bg": "bg-gradient-to-br from-orange-50 to-pink-50",
                "skill_style": "cards"
            },
            "professional": {
                "dark": False,
                "colors": {"primary": "#2563eb", "secondary": "#64748b"},
                "hero_bg": "bg-white",
                "skill_style": "list"
            },
            "gradient": {
                "dark": True,
                "colors": {"primary": "#10b981", "secondary": "#a855f7"},
                "hero_bg": "bg-gradient-to-br from-emerald-900 to-purple-900",
                "skill_style": "tags"
            },
            "minimal": {
                "dark": False,
                "colors": {"primary": "#000000", "secondary": "#ef4444"},
                "hero_bg": "bg-gray-50",
                "skill_style": "simple"
            }
        }
        
        theme = themes.get(config["theme"], themes["professional"])
        
        # Generate files
        with open(app_dir / "layout.tsx", "w") as f:
            f.write(self._get_layout_content(config, theme))
        
        with open(app_dir / "globals.css", "w") as f:
            f.write(self._get_css_content(theme))
        
        with open(app_dir / "page.tsx", "w") as f:
            f.write(self._get_page_content(cv_data, config, theme))
    
    def _get_layout_content(self, config: Dict, theme: Dict) -> str:
        """Generate layout.tsx"""
        return f'''import "./globals.css";

export const metadata = {{
  title: '{config["name"]} Portfolio',
  description: 'Professional portfolio showcasing skills and experience',
}}

export default function RootLayout({{
  children,
}}: {{
  children: React.ReactNode
}}) {{
  return (
    <html lang="en"{' className="dark"' if theme["dark"] else ''}>
      <body>{{children}}</body>
    </html>
  )
}}
'''
    
    def _get_css_content(self, theme: Dict) -> str:
        """Generate CSS"""
        return f'''@tailwind base;
@tailwind components;
@tailwind utilities;

:root {{
  --color-primary: {theme["colors"]["primary"]};
  --color-secondary: {theme["colors"]["secondary"]};
}}

@layer base {{
  :root {{
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
  }}
  
  .dark {{
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
  }}
}}

@layer base {{
  * {{
    @apply border-border;
  }}
  body {{
    @apply bg-background text-foreground;
  }}
}}

/* Custom animations */
@keyframes fadeUp {{
  from {{
    opacity: 0;
    transform: translateY(20px);
  }}
  to {{
    opacity: 1;
    transform: translateY(0);
  }}
}}

.animate-fadeUp {{
  animation: fadeUp 0.6s ease-out;
}}

/* Skill styles */
.skill-tag {{
  @apply inline-block px-3 py-1 rounded-full text-sm font-medium;
  background-color: var(--color-primary);
  color: white;
  opacity: 0.9;
}}

.skill-tag:hover {{
  opacity: 1;
  transform: scale(1.05);
  transition: all 0.2s;
}}
'''
    
    def _get_page_content(self, cv_data: Dict, config: Dict, theme: Dict) -> str:
        """Generate page.tsx with better skills display"""
        
        # Generate skills section based on style
        skill_sections = {
            "grid": self._generate_grid_skills,
            "cards": self._generate_card_skills,
            "list": self._generate_list_skills,
            "tags": self._generate_tag_skills,
            "simple": self._generate_simple_skills
        }
        
        skill_generator = skill_sections.get(theme["skill_style"], self._generate_simple_skills)
        skills_html = skill_generator(cv_data, theme)
        
        # Prepare theme variables
        text_primary = 'text-white' if theme['dark'] else 'text-gray-900'
        text_secondary = 'text-gray-300' if theme['dark'] else 'text-gray-600'
        bg_card = 'bg-gray-800' if theme['dark'] else 'bg-white'
        bg_section = 'bg-gray-900' if theme['dark'] else 'bg-gray-50'
        bg_section_alt = 'bg-gray-950' if theme['dark'] else 'bg-white'
        
        # Add theme-specific imports
        extra_imports = {
            "dark-modern": 'import { RetroGrid } from "@/components/magicui/retro-grid";\nimport { AnimatedBeam } from "@/components/magicui/animated-beam";',
            "colorful": 'import { Rainbow } from "@/components/magicui/rainbow";\nimport { SparklesCore } from "@/components/magicui/sparkles";',
            "professional": 'import { BorderBeam } from "@/components/magicui/border-beam";',
            "gradient": 'import { BackgroundGradient } from "@/components/magicui/background-gradient";\nimport { NeonGradientCard } from "@/components/magicui/neon-gradient-card";',
            "minimal": 'import { DotPattern } from "@/components/magicui/dot-pattern";'
        }
        
        theme_import = extra_imports.get(config["theme"], "")
        
        return f'''
"use client";

import {{ Button }} from "@/components/ui/button";
import {{ BlurFade }} from "@/components/magicui/blur-fade";
{theme_import}
import cvDataJson from "../cv-data.json";
import {{ Mail, Phone, MapPin, GraduationCap, Briefcase, Award, Code, Wrench }} from "lucide-react";

export default function Portfolio() {{
  const getIcon = (categoryName: string) => {{
    switch (categoryName.toLowerCase()) {{
      case 'technical skills':
        return <Code className="h-5 w-5" />;
      case 'tools & technologies':
        return <Wrench className="h-5 w-5" />;
      case 'certifications':
        return <Award className="h-5 w-5" />;
      default:
        return <Briefcase className="h-5 w-5" />;
    }}
  }};

  return (
    <main className="min-h-screen">
      {{/* Hero Section */}}
      <section className="min-h-screen flex items-center justify-center px-4 py-20 {theme['hero_bg']} relative overflow-hidden">
        {self._get_hero_background(config['theme'])}
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <BlurFade delay={{0.25}} inView>
            <h1 className="{self._get_hero_title_style(config['theme'])} {text_primary}">
              {{cvDataJson.hero.fullName}}
            </h1>
          </BlurFade>
          <BlurFade delay={{0.5}} inView>
            {{cvDataJson.hero.title && (
              <p className="text-2xl md:text-3xl mb-4 text-[var(--color-primary)]">
                {{cvDataJson.hero.title}}
              </p>
            )}}
            <p className="text-xl md:text-2xl mb-12 {text_secondary} max-w-3xl mx-auto">
              {{cvDataJson.hero.summaryTagline}}
            </p>
          </BlurFade>
          <BlurFade delay={{0.75}} inView>
            <Button size="lg" className="bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white text-xl px-8 py-6">
              Get In Touch
            </Button>
          </BlurFade>
        </div>
      </section>
      
      {{/* Experience Section */}}
      <section className="py-24 px-4 {bg_section}">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 {text_primary}">
            Experience
          </h2>
          <div className="space-y-6">
            {{cvDataJson.experience.experienceItems.map((exp, idx) => (
              <BlurFade key={{idx}} delay={{0.1 * idx}} inView>
                <div className="{bg_card} rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-semibold {text_primary}">
                        {{exp.jobTitle}}
                      </h3>
                      <p className="text-lg text-[var(--color-primary)]">
                        {{exp.companyName}}
                      </p>
                    </div>
                    <span className="text-sm {text_secondary}">
                      {{exp.dateRange?.startDate}} - {{exp.dateRange?.endDate || 'Present'}}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {{exp.responsibilitiesAndAchievements?.map((item, i) => (
                      <li key={{i}} className="text-sm {text_secondary} flex items-start">
                        <span className="text-[var(--color-secondary)] mr-2">▸</span>
                        {{item}}
                      </li>
                    ))}}
                  </ul>
                </div>
              </BlurFade>
            ))}}
          </div>
        </div>
      </section>
      
      {{/* Skills Section */}}
      <section className="py-24 px-4 {bg_section_alt}">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 {text_primary}">
            Skills & Expertise
          </h2>
          {skills_html}
        </div>
      </section>
      
      {{/* Education Section */}}
      <section className="py-24 px-4 {bg_section}">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 {text_primary}">
            Education
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {{cvDataJson.education.educationItems.map((edu, idx) => (
              <BlurFade key={{idx}} delay={{0.1 * idx}} inView>
                <div className="text-center p-6 rounded-lg {bg_card} shadow-lg">
                  <GraduationCap className="mx-auto mb-4 h-12 w-12 text-[var(--color-primary)]" />
                  <h3 className="text-xl font-semibold mb-2 {text_primary}">
                    {{edu.degree}}
                  </h3>
                  <p className="text-lg mb-2 text-[var(--color-secondary)]">
                    {{edu.institution}}
                  </p>
                  <p className="text-sm {text_secondary}">
                    {{edu.dateRange?.startDate}} - {{edu.dateRange?.endDate || 'Present'}}
                  </p>
                </div>
              </BlurFade>
            ))}}
          </div>
        </div>
      </section>
      
      {{/* Contact Section */}}
      <section className="py-24 px-4 {theme['hero_bg']}">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 {text_primary}">
            Let's Connect
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            {{cvDataJson.contact.email && (
              <div className="flex items-center gap-2 text-lg {text_secondary}">
                <Mail className="h-5 w-5 text-[var(--color-primary)]" />
                {{cvDataJson.contact.email}}
              </div>
            )}}
          </div>
          <Button size="lg" className="bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white text-xl px-10 py-6">
            <Mail className="mr-2 h-5 w-5" />
            Contact Me
          </Button>
        </div>
      </section>
    </main>
  );
}}
'''
    
    def _generate_grid_skills(self, cv_data: Dict, theme: Dict) -> str:
        """Generate grid-style skills"""
        return '''
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cvDataJson.skills.skillCategories.map((category, idx) => (
              <BlurFade key={idx} delay={0.1 * idx} inView>
                <div className="p-6 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white">
                  <div className="flex items-center gap-2 mb-4">
                    {getIcon(category.categoryName)}
                    <h3 className="text-xl font-semibold">
                      {category.categoryName}
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {category.skills.map((skill, i) => (
                      <div key={i} className="text-sm opacity-90">
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>'''
    
    def _generate_card_skills(self, cv_data: Dict, theme: Dict) -> str:
        """Generate card-style skills"""
        return '''
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cvDataJson.skills.skillCategories.map((category, idx) => (
              <BlurFade key={idx} delay={0.1 * idx} inView>
                <div className="p-8 rounded-xl shadow-xl bg-white hover:shadow-2xl transition-shadow">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-full bg-[var(--color-primary)] text-white">
                      {getIcon(category.categoryName)}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {category.categoryName}
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {category.skills.map((skill, i) => (
                      <div key={i} className="text-gray-700 font-medium">
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>'''
    
    def _generate_list_skills(self, cv_data: Dict, theme: Dict) -> str:
        """Generate list-style skills"""
        text_primary = 'text-white' if theme['dark'] else 'text-gray-900'
        text_secondary = 'text-gray-300' if theme['dark'] else 'text-gray-700'
        return f'''
          <div className="max-w-4xl mx-auto space-y-8">
            {{cvDataJson.skills.skillCategories.map((category, idx) => (
              <BlurFade key={{idx}} delay={{0.1 * idx}} inView>
                <div>
                  <h3 className="text-2xl font-semibold mb-4 {text_primary} border-b-2 border-[var(--color-primary)] pb-2">
                    {{category.categoryName}}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {{category.skills.map((skill, i) => (
                      <div key={{i}} className="flex items-center gap-2 {text_secondary}">
                        <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]"></span>
                        {{skill}}
                      </div>
                    ))}}
                  </div>
                </div>
              </BlurFade>
            ))}}
          </div>'''
    
    def _generate_tag_skills(self, cv_data: Dict, theme: Dict) -> str:
        """Generate tag-style skills"""
        return '''
          <div className="space-y-8">
            {cvDataJson.skills.skillCategories.map((category, idx) => (
              <BlurFade key={idx} delay={0.1 * idx} inView>
                <div className="text-center">
                  <h3 className="text-2xl font-semibold mb-6 text-[var(--color-primary)]">
                    {category.categoryName}
                  </h3>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {category.skills.map((skill, i) => (
                      <span key={i} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>'''
    
    def _generate_simple_skills(self, cv_data: Dict, theme: Dict) -> str:
        """Generate simple skills display"""
        text_primary = 'text-white' if theme['dark'] else 'text-gray-900'
        text_secondary = 'text-gray-400' if theme['dark'] else 'text-gray-600'
        return f'''
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {{cvDataJson.skills.skillCategories.map((category, idx) => (
              <BlurFade key={{idx}} delay={{0.1 * idx}} inView>
                <div>
                  <h3 className="text-lg font-semibold mb-3 {text_primary}">
                    {{category.categoryName}}
                  </h3>
                  <ul className="space-y-1">
                    {{category.skills.map((skill, i) => (
                      <li key={{i}} className="text-sm {text_secondary}">
                        {{skill}}
                      </li>
                    ))}}
                  </ul>
                </div>
              </BlurFade>
            ))}}
          </div>'''
    
    def _get_hero_background(self, theme_id: str) -> str:
        """Get theme-specific hero background elements"""
        backgrounds = {
            "dark-modern": '<RetroGrid className="absolute inset-0" />',
            "colorful": '<SparklesCore className="absolute inset-0" particleColor="#f97316" />',
            "professional": '',
            "gradient": '<div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-purple-500/20" />',
            "minimal": '<DotPattern className="absolute inset-0 opacity-20" />'
        }
        return backgrounds.get(theme_id, '')
    
    def _get_hero_title_style(self, theme_id: str) -> str:
        """Get theme-specific title styles"""
        styles = {
            "dark-modern": "text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent",
            "colorful": "text-6xl md:text-8xl font-bold mb-8 animate-pulse",
            "professional": "text-6xl md:text-8xl font-bold mb-8",
            "gradient": "text-6xl md:text-8xl font-bold mb-8",
            "minimal": "text-6xl md:text-8xl font-light mb-8 tracking-tight"
        }
        return styles.get(theme_id, 'text-6xl md:text-8xl font-bold mb-8')
    
    def _create_runner_script(self):
        """Create runner script"""
        script_content = f'''#!/bin/bash
echo "🚀 Running Fixed MCP Portfolios"
echo "=============================="

cd {self.OUTPUT_DIR}

# Start each portfolio
'''
        
        for config in self.PORTFOLIO_CONFIGS:
            script_content += f'''
echo "Starting {config['name']} on port {config['port']}..."
(cd portfolio-{config['id']} && PORT={config['port']} npm run dev) &
'''
        
        script_content += f'''

echo "
✅ All portfolios running!

Access at:
'''
        
        for config in self.PORTFOLIO_CONFIGS:
            script_content += f"- http://localhost:{config['port']} ({config['name']}) - CV: {config['cv']}\n"
        
        script_content += '''
Press Ctrl+C to stop all portfolios
"

wait
'''
        
        runner_path = self.OUTPUT_DIR / "run-all.sh"
        with open(runner_path, "w") as f:
            f.write(script_content)
        runner_path.chmod(0o755)


async def main():
    """Run the fixed portfolio generator"""
    generator = FixedPortfolioGenerator()
    results = await generator.generate_all_portfolios()
    
    print("\n✅ Portfolio generation complete!")
    print(f"Generated {len(results['portfolios'])} portfolios with improved data extraction")
    print(f"Output directory: {generator.OUTPUT_DIR}")
    print("\nRun ./magic-ui-portfolios-fixed/run-all.sh to start all portfolios")


if __name__ == "__main__":
    asyncio.run(main())