#!/usr/bin/env python3
"""
Generate Test Portfolio - Creates numbered test portfolios with fresh data
"""
import asyncio
import json
import shutil
import logging
from pathlib import Path
import sys
from datetime import datetime

# Add parent directory to Python path
sys.path.append(str(Path(__file__).parent))

from src.core.local.text_extractor import text_extractor
from src.core.cv_extraction.data_extractor import data_extractor
from src.core.portfolio_gen.template_data_transformer import template_transformer

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


async def generate_test_portfolio(cv_path: Path, test_number: int = 1):
    """
    Generate a test portfolio with a specific test number
    
    Args:
        cv_path: Path to the CV file
        test_number: Test iteration number
    """
    
    logger.info(f"Generating test_{test_number} portfolio for: {cv_path.name}")
    
    # Create output directory
    output_base = Path(f"portfolio_tests/test_{test_number}")
    output_base.mkdir(parents=True, exist_ok=True)
    
    # Step 1: Extract CV data
    logger.info("Step 1: Extracting CV data...")
    text = text_extractor.extract_text(str(cv_path))
    cv_data = await data_extractor.extract_cv_data(text)
    cv_data_dict = cv_data.model_dump_nullable()
    
    person_name = cv_data.hero.fullName if cv_data.hero else "Portfolio"
    logger.info(f"✓ Extracted CV data for: {person_name}")
    
    # Save raw CV data
    with open(output_base / "1_raw_cv_data.json", 'w', encoding='utf-8') as f:
        json.dump(cv_data_dict, f, indent=2, ensure_ascii=False)
    logger.info(f"  Saved raw CV data to: {output_base / '1_raw_cv_data.json'}")
    
    # Step 2: Transform to portfolio format
    logger.info("Step 2: Transforming data to portfolio format...")
    template_data = template_transformer.transform_cv_to_template(cv_data_dict)
    logger.info("✓ Data transformation complete")
    
    # Save transformed data
    with open(output_base / "2_transformed_data.json", 'w', encoding='utf-8') as f:
        json.dump(template_data, f, indent=2, ensure_ascii=False)
    logger.info(f"  Saved transformed data to: {output_base / '2_transformed_data.json'}")
    
    # Step 3: Generate complete portfolio
    portfolio_path = output_base / "portfolio"
    
    # Remove existing portfolio folder if it exists
    if portfolio_path.exists():
        shutil.rmtree(portfolio_path)
    
    logger.info("Step 3: Creating portfolio application...")
    template_source = Path(__file__).parent / "final_template"
    
    if not template_source.exists():
        logger.error(f"Template not found at: {template_source}")
        return None
    
    # Copy entire template
    shutil.copytree(template_source, portfolio_path)
    logger.info(f"✓ Copied template to: {portfolio_path}")
    
    # Step 4: Inject personalized data
    logger.info("Step 4: Injecting personalized data...")
    page_path = portfolio_path / "app" / "page.tsx"
    
    # Read the template page.tsx
    with open(page_path, 'r', encoding='utf-8') as f:
        template_content = f.read()
    
    # Find where initialData starts
    import_end = template_content.find("const initialData")
    if import_end == -1:
        logger.error("Could not find initialData in template")
        return None
    
    # Find the end of initialData object
    data_start = import_end
    brace_count = 0
    data_end = data_start
    started = False
    
    for i, char in enumerate(template_content[data_start:], data_start):
        if char == '{' and not started:
            started = True
            brace_count = 1
        elif started:
            if char == '{':
                brace_count += 1
            elif char == '}':
                brace_count -= 1
                if brace_count == 0:
                    data_end = i + 1
                    break
    
    # Generate new data section
    json_data = json.dumps(template_data, indent=2, ensure_ascii=False)
    # Convert to TypeScript object literal
    import re
    ts_data = re.sub(r'"(\w+)":', r'\1:', json_data)
    
    new_data_section = f"const initialData = {ts_data}"
    
    # Replace the data section
    new_content = (
        template_content[:import_end] +
        new_data_section +
        template_content[data_end:]
    )
    
    # Write the customized page.tsx
    with open(page_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    logger.info("✓ Injected personalized data into page.tsx")
    
    # Save a copy of the modified page.tsx for inspection
    with open(output_base / "3_modified_page.tsx", 'w', encoding='utf-8') as f:
        f.write(new_content)
    logger.info(f"  Saved modified page.tsx to: {output_base / '3_modified_page.tsx'}")
    
    # Step 5: Update package.json
    package_json_path = portfolio_path / "package.json"
    if package_json_path.exists():
        with open(package_json_path, 'r') as f:
            package_data = json.load(f)
        
        package_data["name"] = f"test-{test_number}-portfolio"
        package_data["description"] = f"Test {test_number} - Portfolio for {person_name}"
        
        with open(package_json_path, 'w') as f:
            json.dump(package_data, f, indent=2)
    
    # Step 6: Create test info file
    test_info = {
        "test_number": test_number,
        "generated_at": datetime.now().isoformat(),
        "cv_file": cv_path.name,
        "person_name": person_name,
        "sections_extracted": list(template_data.keys()),
        "portfolio_path": str(portfolio_path.absolute()),
        "commands_to_run": [
            f"cd {portfolio_path}",
            "npm install",
            "npm run dev"
        ]
    }
    
    with open(output_base / "test_info.json", 'w', encoding='utf-8') as f:
        json.dump(test_info, f, indent=2)
    
    # Create README for this test
    readme_content = f"""# Test {test_number} - {person_name} Portfolio

Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Files in this test:
1. `1_raw_cv_data.json` - Original extracted CV data
2. `2_transformed_data.json` - Transformed data for portfolio template
3. `3_modified_page.tsx` - The page.tsx file with injected data
4. `portfolio/` - Complete Next.js portfolio application
5. `test_info.json` - Test metadata

## To run the portfolio:
```bash
cd portfolio
npm install
npm run dev
```

Then open http://localhost:3000

## Data Summary:
- Name: {person_name}
- Sections: {', '.join(template_data.keys())}
"""
    
    with open(output_base / "README.md", 'w', encoding='utf-8') as f:
        f.write(readme_content)
    
    # Summary
    logger.info("\n" + "="*60)
    logger.info(f"✅ TEST {test_number} PORTFOLIO GENERATION COMPLETE!")
    logger.info("="*60)
    logger.info(f"📁 Test directory: {output_base.absolute()}")
    logger.info(f"📁 Portfolio location: {portfolio_path.absolute()}")
    logger.info(f"👤 Generated for: {person_name}")
    logger.info("\n📋 Files created:")
    logger.info(f"   1. Raw CV data: 1_raw_cv_data.json")
    logger.info(f"   2. Transformed data: 2_transformed_data.json")
    logger.info(f"   3. Modified page: 3_modified_page.tsx")
    logger.info(f"   4. Complete portfolio: portfolio/")
    logger.info("\n🚀 To run the portfolio:")
    logger.info(f"   cd {portfolio_path}")
    logger.info("   npm install")
    logger.info("   npm run dev")
    
    return output_base


async def main():
    """Generate test_1 portfolio for Guy Sagee"""
    
    # Guy Sagee's CV path
    cv_path = Path("/Users/nitzan_shifris/Desktop/CV2WEB-V4/data/cv_examples/pdf_examples/simple_pdf/Guy Sagee - CV 425.2 .pdf")
    
    if not cv_path.exists():
        logger.error(f"CV file not found: {cv_path}")
        return
    
    # Generate test_1
    test_path = await generate_test_portfolio(cv_path, test_number=1)
    
    if test_path:
        print(f"\n✅ Test 1 portfolio successfully generated!")
        print(f"📁 Location: {test_path}")
        print("\nNext steps:")
        print(f"1. cd {test_path}/portfolio")
        print("2. npm install")
        print("3. npm run dev")
        print("4. Open http://localhost:3000")
        print("\n📋 Check the generated files to verify the data!")


if __name__ == "__main__":
    asyncio.run(main())