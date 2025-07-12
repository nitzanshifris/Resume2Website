#!/usr/bin/env python3
"""
Generate Complete Portfolio Application
Creates a ready-to-deploy Next.js portfolio with CV data injected
"""
import asyncio
import json
import shutil
import logging
from pathlib import Path
import sys

# Add parent directory to Python path
sys.path.append(str(Path(__file__).parent))

from src.core.local.text_extractor import text_extractor
from src.core.cv_extraction.data_extractor import data_extractor
from src.core.portfolio_gen.template_data_transformer import template_transformer

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


async def generate_complete_portfolio(cv_path: Path, output_name: str = None):
    """
    Generate a complete, ready-to-deploy portfolio application
    
    Args:
        cv_path: Path to the CV file
        output_name: Name for the output folder (default: based on person's name)
    """
    
    logger.info(f"Generating complete portfolio for: {cv_path.name}")
    
    # Step 1: Extract CV data
    logger.info("Step 1: Extracting CV data...")
    text = text_extractor.extract_text(str(cv_path))
    cv_data = await data_extractor.extract_cv_data(text)
    cv_data_dict = cv_data.model_dump()
    
    person_name = cv_data.hero.fullName if cv_data.hero else "Portfolio"
    logger.info(f"✓ Extracted CV data for: {person_name}")
    
    # Step 2: Transform to portfolio format
    logger.info("Step 2: Transforming data to portfolio format...")
    template_data = template_transformer.transform_cv_to_template(cv_data_dict)
    logger.info("✓ Data transformation complete")
    
    # Step 3: Determine output folder name
    if not output_name:
        # Create folder name from person's name
        output_name = person_name.lower().replace(" ", "-") + "-portfolio"
    
    output_path = Path(f"generated-portfolios/{output_name}")
    
    # Remove existing folder if it exists
    if output_path.exists():
        logger.info(f"Removing existing portfolio at: {output_path}")
        shutil.rmtree(output_path)
    
    # Step 4: Copy entire template structure
    logger.info("Step 3: Copying template structure...")
    template_source = Path(__file__).parent / "final_template"
    
    if not template_source.exists():
        logger.error(f"Template not found at: {template_source}")
        return None
    
    # Copy everything from template
    shutil.copytree(template_source, output_path)
    logger.info(f"✓ Copied template to: {output_path}")
    
    # Step 5: Generate customized page.tsx with injected data
    logger.info("Step 4: Injecting personalized data...")
    page_path = output_path / "app" / "page.tsx"
    
    # Read the template page.tsx
    with open(page_path, 'r', encoding='utf-8') as f:
        template_content = f.read()
    
    # Find where initialData starts and ends
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
    
    # Generate new data section with personalized data
    json_data = json.dumps(template_data, indent=2, ensure_ascii=False)
    # Convert to TypeScript object literal
    ts_data = json_data.replace('"', "'")  # Use single quotes
    ts_data = ts_data.replace("'", '"')   # Actually, keep double quotes for strings
    # Remove quotes from keys
    import re
    ts_data = re.sub(r'"(\w+)":', r'\1:', ts_data)
    
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
    
    # Step 6: Save data files for reference
    data_dir = output_path / "data"
    data_dir.mkdir(exist_ok=True)
    
    # Save original CV data
    with open(data_dir / "cv-data.json", 'w', encoding='utf-8') as f:
        json.dump(cv_data_dict, f, indent=2, ensure_ascii=False)
    
    # Save transformed portfolio data
    with open(data_dir / "portfolio-data.json", 'w', encoding='utf-8') as f:
        json.dump(template_data, f, indent=2, ensure_ascii=False)
    
    # Step 7: Update package.json with portfolio name
    package_json_path = output_path / "package.json"
    if package_json_path.exists():
        with open(package_json_path, 'r') as f:
            package_data = json.load(f)
        
        package_data["name"] = output_name
        package_data["description"] = f"Portfolio for {person_name}"
        
        with open(package_json_path, 'w') as f:
            json.dump(package_data, f, indent=2)
    
    # Step 8: Create a custom README
    readme_content = f"""# {person_name} - Portfolio

This is a personalized portfolio website generated from CV data using CV2WEB.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   # or
   pnpm dev
   # or
   yarn dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Features

- ✏️ **Editable Content**: Click any text to edit it directly in the browser
- 🌓 **Theme Support**: Toggle between light and dark themes
- 📱 **Responsive Design**: Looks great on all devices
- ⚡ **Fast Performance**: Built with Next.js for optimal performance
- 🎭 **Smooth Animations**: Engaging transitions and effects
- 🔧 **Section Management**: Toggle sections on/off as needed

## 📦 Deployment

### Deploy to Vercel (Recommended)

1. Push this folder to a GitHub repository
2. Visit [Vercel](https://vercel.com) and import your repository
3. Deploy with zero configuration!

### Deploy to Netlify

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `.next` folder to Netlify

### Self-Hosting

1. Build the project:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## 📝 Customization

- Edit content directly in the browser using the built-in editing features
- Modify styles in `app/globals.css`
- Update components in `components/ui/`
- Change theme settings in `lib/themes.ts`

## 📊 Portfolio Data

- Original CV data: `data/cv-data.json`
- Transformed portfolio data: `data/portfolio-data.json`

---

Generated with ❤️ by CV2WEB on {Path(__file__).parent.name}
"""
    
    with open(output_path / "README.md", 'w', encoding='utf-8') as f:
        f.write(readme_content)
    
    logger.info("✓ Created custom README.md")
    
    # Summary
    logger.info("\n" + "="*60)
    logger.info("✅ PORTFOLIO GENERATION COMPLETE!")
    logger.info("="*60)
    logger.info(f"📁 Portfolio location: {output_path.absolute()}")
    logger.info(f"👤 Generated for: {person_name}")
    logger.info("\n🚀 To run the portfolio:")
    logger.info(f"   cd {output_path}")
    logger.info("   npm install")
    logger.info("   npm run dev")
    logger.info("\n🌐 Then open: http://localhost:3000")
    logger.info("\n✨ The portfolio is ready to deploy!")
    
    return output_path


async def main():
    """Main function to generate Guy Sagee's portfolio"""
    
    # Guy Sagee's CV path
    cv_path = Path("/Users/nitzan_shifris/Desktop/CV2WEB-V4/data/cv_examples/pdf_examples/simple_pdf/Guy Sagee - CV 425.2 .pdf")
    
    if not cv_path.exists():
        logger.error(f"CV file not found: {cv_path}")
        return
    
    # Generate the complete portfolio
    portfolio_path = await generate_complete_portfolio(cv_path)
    
    if portfolio_path:
        print(f"\n✅ Portfolio successfully generated at: {portfolio_path}")
        print("\nNext steps:")
        print("1. Open a terminal")
        print(f"2. cd {portfolio_path}")
        print("3. npm install (or pnpm install)")
        print("4. npm run dev")
        print("5. Open http://localhost:3000 in your browser")
        print("\nThe portfolio is ready to use and deploy! 🎉")


if __name__ == "__main__":
    asyncio.run(main())