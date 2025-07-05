#!/usr/bin/env python3
"""
Full Pipeline Test: CV Upload to Portfolio with Universal Adapter
Tests the complete flow from CV upload to portfolio generation using Universal Adapter
"""

import asyncio
import json
import logging
import tempfile
from pathlib import Path
from typing import Dict, Any

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import all the pipeline components
from services.local.text_extractor import text_extractor
from services.llm.data_extractor import data_extractor
from services.portfolio.component_selector import component_selector
from services.portfolio.portfolio_generator import portfolio_generator
from services.portfolio.universal_adapter import universal_adapter
from backend.schemas.unified import CVData

class FullPipelineTest:
    """Test the complete CV2WEB pipeline with Universal Adapter"""
    
    def __init__(self):
        self.test_cv_path = Path("data/cv_examples/text_examples/comprehensive_all_components_cv.txt")
        self.output_dir = Path("test_outputs/full_pipeline_universal_adapter")
        self.output_dir.mkdir(parents=True, exist_ok=True)
    
    async def test_full_pipeline(self):
        """Test the complete pipeline from CV text to portfolio generation"""
        print("🚀 Testing Full CV2WEB Pipeline with Universal Adapter")
        print("=" * 60)
        
        # Step 1: Extract text from CV file
        print("\n📄 Step 1: Text Extraction")
        if not self.test_cv_path.exists():
            # Create a comprehensive test CV
            self._create_test_cv()
        
        raw_text = text_extractor.extract_text(str(self.test_cv_path))
        print(f"✅ Extracted {len(raw_text)} characters from CV")
        
        # Step 2: Extract structured data using LLM
        print("\n🧠 Step 2: LLM Data Extraction")
        cv_data = await data_extractor.extract_cv_data(raw_text)
        print(f"✅ Extracted structured CV data")
        print(f"   - Sections found: {list(cv_data.model_dump().keys())}")
        
        # Save extracted data for inspection
        extracted_path = self.output_dir / "extracted_cv_data.json"
        with open(extracted_path, 'w') as f:
            json.dump(cv_data.model_dump(), f, indent=2, default=str)
        print(f"   - Saved to: {extracted_path}")
        
        # Step 3: Component Selection
        print("\n🎯 Step 3: Component Selection")
        selections = component_selector.select_components(cv_data)
        print(f"✅ Selected {len(selections)} components")
        
        selections_data = []
        for selection in selections:
            selections_data.append({
                "section": selection.section,
                "component_type": selection.component_type,
                "priority": selection.priority,
                "data_keys": list(selection.data.keys()) if isinstance(selection.data, dict) else "string_data"
            })
        
        selections_path = self.output_dir / "component_selections.json"
        with open(selections_path, 'w') as f:
            json.dump(selections_data, f, indent=2)
        print(f"   - Saved to: {selections_path}")
        
        # Step 4: Test Universal Adapter for each component
        print("\n🔮 Step 4: Universal Adapter Testing")
        adapter_results = {}
        
        for selection in selections:
            print(f"   Testing {selection.component_type} for {selection.section}...")
            try:
                adapted_props = universal_adapter.adapt(
                    selection.component_type,
                    selection.data,
                    selection.section
                )
                
                adapter_results[f"{selection.section}_{selection.component_type}"] = {
                    "success": True,
                    "adapted_props": adapted_props,
                    "original_data_size": len(str(selection.data)),
                    "adapted_props_size": len(str(adapted_props))
                }
                print(f"   ✅ {selection.component_type}: {len(adapted_props)} props generated")
                
            except Exception as e:
                adapter_results[f"{selection.section}_{selection.component_type}"] = {
                    "success": False,
                    "error": str(e)
                }
                print(f"   ❌ {selection.component_type}: {e}")
        
        adapter_path = self.output_dir / "universal_adapter_results.json"
        with open(adapter_path, 'w') as f:
            json.dump(adapter_results, f, indent=2, default=str)
        print(f"   - Saved to: {adapter_path}")
        
        # Step 5: Portfolio Generation with Universal Adapter
        print("\n🏗️  Step 5: Portfolio Generation")
        portfolio_dir = self.output_dir / "generated_portfolio"
        
        try:
            files = portfolio_generator.generate_portfolio(
                selections,
                "John Doe",  # Test user name
                portfolio_dir
            )
            
            print(f"✅ Generated {len(files)} portfolio files")
            print(f"   - Portfolio saved to: {portfolio_dir}")
            
            # List generated files
            if portfolio_dir.exists():
                generated_files = list(portfolio_dir.rglob("*"))
                print(f"   - Files created: {len(generated_files)}")
                for file_path in sorted(generated_files):
                    if file_path.is_file():
                        print(f"     • {file_path.relative_to(portfolio_dir)}")
            
        except Exception as e:
            print(f"❌ Portfolio generation failed: {e}")
            return False
        
        # Step 6: Validate Generated Portfolio
        print("\n🔍 Step 6: Portfolio Validation")
        validation_results = self._validate_portfolio(portfolio_dir)
        
        validation_path = self.output_dir / "portfolio_validation.json"
        with open(validation_path, 'w') as f:
            json.dump(validation_results, f, indent=2)
        
        if validation_results["valid"]:
            print("✅ Portfolio validation passed")
        else:
            print("❌ Portfolio validation failed")
            print(f"   - Issues: {validation_results['issues']}")
        
        # Step 7: Test Universal Adapter Integration
        print("\n🔗 Step 7: Universal Adapter Integration Test")
        integration_test = self._test_universal_adapter_integration(portfolio_dir)
        
        integration_path = self.output_dir / "integration_test.json"
        with open(integration_path, 'w') as f:
            json.dump(integration_test, f, indent=2)
        
        # Final Results
        print("\n" + "=" * 60)
        print("🎉 FULL PIPELINE TEST COMPLETED")
        print("=" * 60)
        
        success_rate = sum(1 for r in adapter_results.values() if r.get("success", False)) / len(adapter_results) * 100
        
        print(f"📊 Results Summary:")
        print(f"   - Text extracted: {len(raw_text):,} characters")
        print(f"   - CV sections extracted: {len([k for k, v in cv_data.model_dump().items() if v])}")
        print(f"   - Components selected: {len(selections)}")
        print(f"   - Universal Adapter success rate: {success_rate:.1f}%")
        print(f"   - Portfolio files generated: {len(files) if 'files' in locals() else 0}")
        print(f"   - Portfolio validation: {'✅ PASSED' if validation_results['valid'] else '❌ FAILED'}")
        
        print(f"\n📁 Output files saved to: {self.output_dir}")
        
        return validation_results["valid"] and success_rate > 80
    
    def _create_test_cv(self):
        """Create a comprehensive test CV with all component types"""
        cv_content = """
John Doe
Senior Full Stack Developer
john.doe@email.com | +1-555-123-4567 | github.com/johndoe | linkedin.com/in/johndoe

PROFESSIONAL SUMMARY
Passionate full-stack developer with 8+ years of experience building scalable web applications. 
Expert in React, Node.js, Python, and cloud technologies. Led teams of 5+ developers and 
delivered 20+ successful projects for Fortune 500 companies.

EXPERIENCE

Senior Full Stack Developer
Tech Innovations Inc. | San Francisco, CA | 2020 - Present
• Led development of microservices architecture serving 100K+ daily users
• Implemented CI/CD pipelines reducing deployment time by 75%
• Mentored junior developers and conducted code reviews
• Technologies: React, Node.js, Python, Docker, AWS

Full Stack Developer  
Digital Solutions LLC | Remote | 2018 - 2020
• Built responsive web applications using modern JavaScript frameworks
• Developed RESTful APIs and integrated third-party services
• Collaborated with UX/UI designers on user experience improvements
• Technologies: Vue.js, Express.js, MongoDB, Redis

Junior Developer
StartupXYZ | Austin, TX | 2016 - 2018
• Developed frontend components and backend services
• Participated in agile development and sprint planning
• Fixed bugs and implemented new features based on user feedback
• Technologies: Angular, PHP, MySQL

EDUCATION

Bachelor of Science in Computer Science
University of California, Berkeley | 2012 - 2016
• Graduated Magna Cum Laude (GPA: 3.8/4.0)
• Dean's List: Fall 2014, Spring 2015, Fall 2015
• Relevant Coursework: Data Structures, Algorithms, Database Systems

TECHNICAL SKILLS

Frontend Development
React, Vue.js, Angular, TypeScript, HTML5, CSS3, SASS, Tailwind CSS

Backend Development  
Node.js, Python, Django, Flask, Express.js, FastAPI, PHP

Databases & Storage
PostgreSQL, MongoDB, Redis, MySQL, Firebase, AWS DynamoDB

Cloud & DevOps
AWS (EC2, S3, Lambda, RDS), Docker, Kubernetes, CI/CD, Jenkins, GitHub Actions

PROJECTS

E-commerce Platform
• Full-stack web application with payment processing and inventory management
• Built with React, Node.js, PostgreSQL, and Stripe integration
• Deployed on AWS with auto-scaling and load balancing
• GitHub: github.com/johndoe/ecommerce-platform

AI Chat Application
• Real-time chat application with AI-powered responses
• Technologies: Next.js, Socket.io, OpenAI API, Redis
• Features: Real-time messaging, AI integration, user authentication
• Live Demo: chatapp.johndoe.com

Task Management System
• Collaborative project management tool for remote teams
• Built with Vue.js, Express.js, MongoDB, and WebSocket integration
• Supports file sharing, time tracking, and team collaboration
• GitHub: github.com/johndoe/task-manager

CERTIFICATIONS

AWS Certified Solutions Architect - Associate (2023)
MongoDB Certified Developer (2022)
Google Cloud Professional Cloud Architect (2021)

ACHIEVEMENTS & AWARDS

Employee of the Year - Tech Innovations Inc. (2023)
Best Mobile App Award - TechCrunch Disrupt (2022)
Dean's List - UC Berkeley (2014-2015)

LANGUAGES

English (Native)
Spanish (Professional Working Proficiency)
French (Conversational)

VOLUNTEER EXPERIENCE

Code Mentor - Code.org | 2019 - Present
• Mentor high school students in programming fundamentals
• Organize coding workshops and hackathons
• Help underrepresented students enter tech industry

INTERESTS & HOBBIES

Photography - Landscape and street photography enthusiast
Rock Climbing - Member of local climbing club, lead climber
Open Source - Contributor to various React and Node.js projects
Travel - Visited 25+ countries, enjoy cultural immersion experiences
"""
        
        self.test_cv_path.parent.mkdir(parents=True, exist_ok=True)
        with open(self.test_cv_path, 'w') as f:
            f.write(cv_content.strip())
        
        print(f"Created comprehensive test CV: {self.test_cv_path}")
    
    def _validate_portfolio(self, portfolio_dir: Path) -> Dict[str, Any]:
        """Validate the generated portfolio structure and files"""
        validation = {
            "valid": True,
            "issues": [],
            "files_found": [],
            "required_files": [
                "package.json",
                "app/layout.tsx",
                "app/page.tsx",
                "lib/portfolio-data.ts",
                "lib/utils.ts",
                "tailwind.config.js",
                "tsconfig.json"
            ]
        }
        
        if not portfolio_dir.exists():
            validation["valid"] = False
            validation["issues"].append("Portfolio directory does not exist")
            return validation
        
        # Check for required files
        for required_file in validation["required_files"]:
            file_path = portfolio_dir / required_file
            if file_path.exists():
                validation["files_found"].append(required_file)
            else:
                validation["valid"] = False
                validation["issues"].append(f"Missing required file: {required_file}")
        
        # Check portfolio data file for Universal Adapter usage
        portfolio_data_path = portfolio_dir / "lib/portfolio-data.ts"
        if portfolio_data_path.exists():
            content = portfolio_data_path.read_text()
            if "Universal Adapter" in content:
                validation["universal_adapter_detected"] = True
            else:
                validation["universal_adapter_detected"] = False
                validation["issues"].append("Universal Adapter not detected in portfolio data")
        
        # Check main page for component usage
        main_page_path = portfolio_dir / "app/page.tsx"
        if main_page_path.exists():
            content = main_page_path.read_text()
            
            # Look for Universal Adapter patterns
            universal_patterns = [
                "entries || []",  # Timeline adapter pattern
                "items && items.length >= 3",  # BentoGrid fallback pattern
                "cards || items || []",  # CardHoverEffect adapter pattern
                "testimonials || []"  # AnimatedTestimonials adapter pattern
            ]
            
            found_patterns = [pattern for pattern in universal_patterns if pattern in content]
            validation["universal_adapter_patterns"] = found_patterns
            
            if len(found_patterns) > 0:
                validation["universal_adapter_integration"] = True
            else:
                validation["issues"].append("Universal Adapter patterns not found in main page")
        
        return validation
    
    def _test_universal_adapter_integration(self, portfolio_dir: Path) -> Dict[str, Any]:
        """Test Universal Adapter specific functionality"""
        integration_test = {
            "adapter_imports": False,
            "adapter_usage": False,
            "fallback_logic": False,
            "component_patterns": []
        }
        
        # Check for Universal Adapter imports
        main_page_path = portfolio_dir / "app/page.tsx"
        if main_page_path.exists():
            content = main_page_path.read_text()
            
            # Check for Universal Adapter patterns
            if "entries || []" in content:
                integration_test["component_patterns"].append("Timeline adapter")
            
            if "items && items.length >= 3" in content:
                integration_test["component_patterns"].append("BentoGrid fallback")
                integration_test["fallback_logic"] = True
            
            if "cards || items || []" in content:
                integration_test["component_patterns"].append("CardHoverEffect adapter")
            
            if "testimonials || []" in content:
                integration_test["component_patterns"].append("AnimatedTestimonials adapter")
            
            integration_test["adapter_usage"] = len(integration_test["component_patterns"]) > 0
        
        # Check portfolio data for Universal Adapter processing
        portfolio_data_path = portfolio_dir / "lib/portfolio-data.ts"
        if portfolio_data_path.exists():
            content = portfolio_data_path.read_text()
            if "Universal Adapter" in content:
                integration_test["adapter_imports"] = True
        
        return integration_test

async def main():
    """Run the full pipeline test"""
    test = FullPipelineTest()
    success = await test.test_full_pipeline()
    
    if success:
        print("\n🎉 FULL PIPELINE TEST PASSED!")
        print("Universal Adapter integration is working correctly.")
    else:
        print("\n❌ FULL PIPELINE TEST FAILED!")
        print("Check the output files for details.")
    
    return success

if __name__ == "__main__":
    asyncio.run(main())