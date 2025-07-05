"""
Test Portfolio Generation with Actual CV Data
Verifies that generated portfolios display real CV content instead of generic text
"""
import asyncio
import logging
import json
from pathlib import Path
import tempfile
import shutil
import re

from services.local.text_extractor import text_extractor
from services.llm.data_extractor import data_extractor
from services.portfolio.component_selector import component_selector
from services.portfolio.portfolio_generator import portfolio_generator

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PortfolioTester:
    def __init__(self):
        pass
        
    async def test_portfolio_generation(self, cv_path: str):
        """Test complete portfolio generation pipeline"""
        logger.info(f"\n{'='*60}")
        logger.info(f"Testing Portfolio Generation Pipeline")
        logger.info(f"CV File: {cv_path}")
        logger.info(f"{'='*60}\n")
        
        # Step 1: Extract text from CV
        logger.info("Step 1: Extracting text from CV...")
        extracted_text = text_extractor.extract_text(cv_path)
        logger.info(f"Extracted {len(extracted_text)} characters")
        
        # Step 2: Parse CV data
        logger.info("\nStep 2: Parsing CV data...")
        cv_data = await data_extractor.extract_cv_data(extracted_text)
        
        # Log extracted data
        if cv_data.hero:
            logger.info(f"✓ Hero Data:")
            logger.info(f"  - Name: {cv_data.hero.fullName}")
            logger.info(f"  - Title: {cv_data.hero.professionalTitle}")
            logger.info(f"  - Summary: {cv_data.hero.summaryTagline[:100]}..." if cv_data.hero.summaryTagline else "  - Summary: None")
        else:
            logger.warning("✗ No hero data extracted")
            
        # Step 3: Select components
        logger.info("\nStep 3: Selecting components...")
        selections = component_selector.select_components(cv_data)
        logger.info(f"Selected {len(selections)} components:")
        for sel in selections:
            logger.info(f"  - {sel.section}: {sel.component_type}")
            
        # Step 4: Generate portfolio
        logger.info("\nStep 4: Generating portfolio...")
        with tempfile.TemporaryDirectory() as temp_dir:
            output_dir = Path(temp_dir) / "test-portfolio"
            files = portfolio_generator.generate_portfolio(
                selections=selections,
                user_name=cv_data.hero.fullName if cv_data.hero else "Test Portfolio",
                output_dir=output_dir
            )
            
            # Step 5: Validate generated content
            logger.info("\nStep 5: Validating generated content...")
            validation_results = self._validate_portfolio_content(output_dir, cv_data)
            
            # Show results
            logger.info(f"\n{'='*60}")
            logger.info("VALIDATION RESULTS")
            logger.info(f"{'='*60}")
            
            passed = 0
            failed = 0
            
            for check, result in validation_results.items():
                if result['passed']:
                    logger.info(f"✓ {check}: {result['message']}")
                    passed += 1
                else:
                    logger.error(f"✗ {check}: {result['message']}")
                    failed += 1
                    
            logger.info(f"\n{'='*60}")
            logger.info(f"Total: {passed} passed, {failed} failed")
            logger.info(f"{'='*60}")
            
            # Save test output if there were failures
            if failed > 0:
                test_output_dir = Path("test_outputs") / "portfolio_test"
                test_output_dir.mkdir(parents=True, exist_ok=True)
                
                # Copy generated files
                for file_path, content in files.items():
                    output_file = test_output_dir / file_path
                    output_file.parent.mkdir(parents=True, exist_ok=True)
                    with open(output_file, 'w') as f:
                        f.write(content)
                        
                logger.info(f"\nTest output saved to: {test_output_dir}")
                
            return passed > 0 and failed == 0
            
    def _validate_portfolio_content(self, output_dir: Path, cv_data):
        """Validate that CV data appears in generated portfolio"""
        results = {}
        
        # Read main page file
        page_file = output_dir / "app" / "page.tsx"
        if not page_file.exists():
            results['page_file_exists'] = {
                'passed': False,
                'message': 'page.tsx not found'
            }
            return results
            
        with open(page_file, 'r') as f:
            page_content = f.read()
            
        # Read data file
        data_file = output_dir / "lib" / "portfolio-data.ts"
        if not data_file.exists():
            results['data_file_exists'] = {
                'passed': False,
                'message': 'portfolio-data.ts not found'
            }
            return results
            
        with open(data_file, 'r') as f:
            data_content = f.read()
            
        # Check 1: No generic text in page
        generic_patterns = [
            r"The Ultimate\s*development studio",
            r"We build beautiful products",
            r"Lorem ipsum",
            r"John Doe|Jane Smith|Demo User",
            r"Acme Corp|Example Inc|Demo Company"
        ]
        
        generic_found = []
        for pattern in generic_patterns:
            if re.search(pattern, page_content, re.IGNORECASE):
                generic_found.append(pattern)
                
        results['no_generic_text'] = {
            'passed': len(generic_found) == 0,
            'message': f"Found generic text: {', '.join(generic_found)}" if generic_found else "No generic text found"
        }
        
        # Check 2: CV holder name appears
        if cv_data.hero and cv_data.hero.fullName:
            name_appears = cv_data.hero.fullName in data_content
            results['cv_name_appears'] = {
                'passed': name_appears,
                'message': f"'{cv_data.hero.fullName}' found in data" if name_appears else f"'{cv_data.hero.fullName}' NOT found in data"
            }
        else:
            results['cv_name_appears'] = {
                'passed': False,
                'message': "No CV name to check"
            }
            
        # Check 3: Professional title appears
        if cv_data.hero and cv_data.hero.professionalTitle:
            title_appears = cv_data.hero.professionalTitle in data_content
            results['cv_title_appears'] = {
                'passed': title_appears,
                'message': f"'{cv_data.hero.professionalTitle}' found" if title_appears else f"'{cv_data.hero.professionalTitle}' NOT found"
            }
            
        # Check 4: Hero section has CV data props
        hero_section_pattern = r'hero:\s*{([^}]+)}'
        hero_match = re.search(hero_section_pattern, data_content, re.DOTALL)
        
        if hero_match:
            hero_content = hero_match.group(1)
            has_title = '"title"' in hero_content
            has_subtitle = '"subtitle"' in hero_content
            has_description = '"description"' in hero_content
            
            results['hero_has_props'] = {
                'passed': has_title and has_subtitle,
                'message': f"Hero has: title={has_title}, subtitle={has_subtitle}, description={has_description}"
            }
        else:
            results['hero_has_props'] = {
                'passed': False,
                'message': "Hero section not found in data"
            }
            
        # Check 5: Hero components use props correctly
        # Check if HeroContent component is used with heroData
        hero_content_pattern = r'<HeroContent\s+data=\{heroData\}'
        hero_uses_props = bool(re.search(hero_content_pattern, page_content))
        
        # Also check in the HeroContent component itself
        hero_content_file = output_dir / "components" / "ui" / "hero-content.tsx"
        if hero_content_file.exists() and not hero_uses_props:
            with open(hero_content_file, 'r') as f:
                hero_content = f.read()
                # Check if HeroContent uses data.title, data.subtitle, etc.
                data_props_used = all(
                    pattern in hero_content 
                    for pattern in ['data.title', 'data.subtitle', 'data.description']
                )
                hero_uses_props = data_props_used
        
        results['hero_uses_props'] = {
            'passed': hero_uses_props,
            'message': "Hero component uses data props" if hero_uses_props else "Hero component NOT using data props correctly"
        }
        
        # Check 6: Skills appear if present
        if cv_data.skills and cv_data.skills.skillCategories:
            first_skill_category = cv_data.skills.skillCategories[0]
            skill_name = first_skill_category.categoryName
            skill_appears = skill_name in data_content
            
            results['skills_appear'] = {
                'passed': skill_appears,
                'message': f"Skill '{skill_name}' found" if skill_appears else f"Skill '{skill_name}' NOT found"
            }
            
        # Check 7: Experience appears if present
        if cv_data.experience and cv_data.experience.experienceItems:
            first_exp = cv_data.experience.experienceItems[0]
            company_name = first_exp.companyName if hasattr(first_exp, 'companyName') else None
            
            if company_name:
                exp_appears = company_name in data_content
                results['experience_appears'] = {
                    'passed': exp_appears,
                    'message': f"Company '{company_name}' found" if exp_appears else f"Company '{company_name}' NOT found"
                }
                
        # Check 8: Projects appear if present
        if cv_data.projects and cv_data.projects.projectItems:
            first_project = cv_data.projects.projectItems[0]
            project_name = first_project.name if hasattr(first_project, 'name') else None
            
            if project_name:
                project_appears = project_name in data_content
                results['projects_appear'] = {
                    'passed': project_appears,
                    'message': f"Project '{project_name}' found" if project_appears else f"Project '{project_name}' NOT found"
                }
                
        return results


async def main():
    """Run portfolio generation test"""
    tester = PortfolioTester()
    
    # Test with the Lisbon Creative CV
    test_cv = "data/cv_examples/pdf_examples/pdf/Lisbon-Resume-Template-Creative.pdf"
    
    if not Path(test_cv).exists():
        logger.error(f"Test CV not found: {test_cv}")
        return
        
    success = await tester.test_portfolio_generation(test_cv)
    
    if success:
        logger.info("\n✅ All tests passed! Portfolio generation is working correctly.")
    else:
        logger.error("\n❌ Some tests failed. Check the output above for details.")
        

if __name__ == "__main__":
    asyncio.run(main())