#!/usr/bin/env python3
"""
Generate Portfolio from JSON CV Data
Command-line script to transform CV JSON data into a portfolio template
"""
import argparse
import asyncio
import json
import logging
import sys
from pathlib import Path

# Add parent directory to Python path
sys.path.append(str(Path(__file__).parent.parent))

from src.core.portfolio_gen.template_data_transformer import template_transformer

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def main():
    parser = argparse.ArgumentParser(
        description="Generate a portfolio from CV data JSON file",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Example usage:
  python generate_portfolio_from_json.py input.json
  python generate_portfolio_from_json.py input.json -o my-portfolio
  python generate_portfolio_from_json.py input.json --preview
        """
    )
    
    parser.add_argument(
        "input",
        type=str,
        help="Path to the CV data JSON file"
    )
    
    parser.add_argument(
        "-o", "--output",
        type=str,
        help="Output directory for the portfolio (default: portfolio-output)"
    )
    
    parser.add_argument(
        "--preview",
        action="store_true",
        help="Only preview the transformed data without generating files"
    )
    
    parser.add_argument(
        "--pretty",
        action="store_true",
        help="Pretty print the transformed data"
    )
    
    args = parser.parse_args()
    
    # Read input JSON
    input_path = Path(args.input)
    if not input_path.exists():
        logger.error(f"Input file not found: {input_path}")
        return 1
    
    try:
        with open(input_path, 'r', encoding='utf-8') as f:
            cv_data = json.load(f)
        logger.info(f"Loaded CV data from {input_path}")
    except json.JSONDecodeError as e:
        logger.error(f"Invalid JSON in input file: {e}")
        return 1
    except Exception as e:
        logger.error(f"Error reading input file: {e}")
        return 1
    
    # Transform the data
    try:
        logger.info("Transforming CV data to portfolio template format...")
        template_data = template_transformer.transform_cv_to_template(cv_data)
        logger.info("Transformation completed successfully")
        
        if args.preview:
            # Just print the transformed data
            if args.pretty:
                print(json.dumps(template_data, indent=2, ensure_ascii=False))
            else:
                print(json.dumps(template_data, ensure_ascii=False))
            return 0
        
        # Generate portfolio
        output_dir = Path(args.output) if args.output else Path("portfolio-output")
        
        # Create output directory
        output_dir.mkdir(parents=True, exist_ok=True)
        
        # Save transformed data
        data_path = output_dir / "portfolio-data.json"
        with open(data_path, 'w', encoding='utf-8') as f:
            json.dump(template_data, f, indent=2, ensure_ascii=False)
        logger.info(f"Saved transformed data to {data_path}")
        
        # Generate portfolio page
        try:
            page_path = output_dir / "page.tsx"
            template_transformer.generate_portfolio_page(cv_data, page_path)
            logger.info(f"Generated portfolio page at {page_path}")
        except FileNotFoundError:
            logger.warning("Template file not found - saved transformed data only")
        
        print(f"\n✅ Portfolio data generated successfully!")
        print(f"📁 Output directory: {output_dir}")
        print(f"📄 Transformed data: {data_path}")
        
        # Print summary of what was generated
        print(f"\n📊 Portfolio Summary:")
        if "hero" in template_data:
            print(f"   Name: {template_data['hero'].get('name', 'Unknown')}")
        if "experience" in template_data:
            print(f"   Experience items: {len(template_data['experience'].get('items', []))}")
        if "education" in template_data:
            print(f"   Education items: {len(template_data['education'].get('items', []))}")
        if "skills" in template_data:
            print(f"   Skill categories: {len(template_data['skills'].get('items', []))}")
        if "projects" in template_data:
            print(f"   Projects: {len(template_data['projects'].get('items', []))}")
        
        return 0
        
    except Exception as e:
        logger.error(f"Error during transformation: {e}")
        return 1


if __name__ == "__main__":
    sys.exit(main())