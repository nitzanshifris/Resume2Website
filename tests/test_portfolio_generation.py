#!/usr/bin/env python3
"""
Test complete portfolio generation pipeline
"""
import sys
import os
import asyncio
import json
from pathlib import Path

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.llm.data_extractor import data_extractor
from services.portfolio.component_selector import component_selector
from services.portfolio.portfolio_generator import portfolio_generator

# Sample CV for testing
SAMPLE_CV = """
Sarah Johnson
Full Stack Developer & UI/UX Designer

PROFESSIONAL SUMMARY
Creative full-stack developer with 6 years of experience building beautiful, user-centric web applications. 
Passionate about creating seamless user experiences and writing clean, maintainable code.

EXPERIENCE
Senior Full Stack Developer | CreativeTech Studios | San Francisco, CA | 2021 - Present
• Led frontend architecture redesign resulting in 50% faster page loads
• Designed and implemented responsive UI components used across 5 products
• Mentored 2 junior developers on React best practices and design patterns

Full Stack Developer | DesignFlow Inc. | Remote | 2019 - 2021  
• Built design system with 30+ reusable React components
• Developed real-time collaboration features using Socket.io
• Improved accessibility compliance to WCAG 2.1 AA standards

UI/UX Developer | StartupHub | New York, NY | 2018 - 2019
• Created interactive prototypes in Figma for client presentations
• Implemented pixel-perfect designs with React and Tailwind CSS
• Conducted user testing sessions with 50+ participants

SKILLS
Frontend: React, Next.js, TypeScript, Tailwind CSS, Framer Motion
Backend: Node.js, Express, Python, Django, PostgreSQL
Design: Figma, Adobe XD, Sketch, Photoshop, Illustrator
Tools: Git, Docker, AWS, Vercel, Storybook, Jest

PROJECTS
Design System Library (2023)
• Open-source React component library with 2K+ GitHub stars
• Features dark mode, accessibility, and TypeScript support
• Technologies: React, TypeScript, Storybook, Tailwind CSS

Portfolio Website Builder (2022)
• No-code tool for designers to create portfolios
• Drag-and-drop interface with custom animations
• Technologies: Next.js, Framer Motion, Supabase

EDUCATION
Bachelor of Fine Arts in Digital Design | Parsons School of Design | 2014 - 2018
• Minor in Computer Science
• Dean's List: 2016, 2017

ACHIEVEMENTS
• Best UI Design Award at HackNYC 2022
• Increased user engagement by 65% through UX improvements
• Published article on "Bridging Design and Development" with 10K+ reads

LANGUAGES
English: Native
French: Conversational
Japanese: Basic

sarah@example.com | (555) 123-4567 | LinkedIn: /in/sarahjohnson | GitHub: @sarahj
"""

async def test_portfolio_generation():
    """Test the complete portfolio generation pipeline"""
    print("🚀 Testing Portfolio Generation Pipeline")
    print("=" * 80)
    
    # Step 1: Extract CV data
    print("\n1️⃣ Extracting CV data...")
    try:
        cv_data = await data_extractor.extract_cv_data(SAMPLE_CV)
        print("✅ CV data extracted successfully")
        
        # Show extracted name and title
        if cv_data.hero:
            print(f"   Name: {cv_data.hero.fullName}")
            print(f"   Title: {cv_data.hero.professionalTitle}")
        
    except Exception as e:
        print(f"❌ Failed to extract CV data: {e}")
        return
    
    # Step 2: Detect archetype
    print("\n2️⃣ Detecting user archetype...")
    archetype = component_selector.detect_archetype(cv_data)
    print(f"✅ Detected archetype: {archetype.value}")
    print("   (Should be 'creative' for this CV)")
    
    # Step 3: Select components
    print("\n3️⃣ Selecting components...")
    selections = component_selector.select_components(cv_data, archetype)
    
    if not selections:
        print("❌ No components selected!")
        return
        
    print(f"✅ Selected {len(selections)} components:")
    for s in selections:
        print(f"   - {s.section}: {s.component_type}")
    
    # Step 4: Generate portfolio
    print("\n4️⃣ Generating portfolio code...")
    
    output_dir = Path("tests/outputs/generated-portfolio")
    
    try:
        files = portfolio_generator.generate_portfolio(
            selections=selections,
            user_name=cv_data.hero.fullName if cv_data.hero else "Portfolio",
            output_dir=output_dir
        )
        
        print(f"✅ Generated {len(files)} files:")
        for filename in files.keys():
            print(f"   - {filename}")
        
        print(f"\n📁 Portfolio saved to: {output_dir}")
        
    except Exception as e:
        print(f"❌ Failed to generate portfolio: {e}")
        import traceback
        traceback.print_exc()
        return
    
    # Step 5: Show sample of generated code
    print("\n5️⃣ Sample generated code:")
    print("\n--- app/page.tsx ---")
    print(files["app/page.tsx"][:500] + "...")
    
    print("\n--- lib/portfolio-data.ts ---")
    print(files["lib/portfolio-data.ts"][:500] + "...")
    
    # Step 6: Validate generated files
    print("\n6️⃣ Validating generated files...")
    
    validations = {
        "Has imports": "import {" in files["app/page.tsx"],
        "Has portfolio data": "portfolioData" in files["lib/portfolio-data.ts"],
        "Has layout": "RootLayout" in files["app/layout.tsx"],
        "Has styles": "@tailwind" in files["app/globals.css"],
        "Has package.json": '"dependencies"' in files["package.json"]
    }
    
    all_valid = True
    for check, result in validations.items():
        status = "✅" if result else "❌"
        print(f"   {status} {check}")
        if not result:
            all_valid = False
    
    print("\n" + "=" * 80)
    if all_valid:
        print("✅ Portfolio generation complete and valid!")
        print(f"\nTo use the generated portfolio:")
        print(f"1. cd {output_dir}")
        print(f"2. npm install")
        print(f"3. npm run dev")
        print(f"4. Open http://localhost:3000")
    else:
        print("⚠️  Some validations failed. Check the generated files.")
    
    # Save test results
    test_results = {
        "timestamp": str(asyncio.get_event_loop().time()),
        "cv_name": cv_data.hero.fullName if cv_data.hero else "Unknown",
        "archetype": archetype.value,
        "components_selected": len(selections),
        "files_generated": len(files),
        "validations": validations,
        "all_valid": all_valid
    }
    
    results_file = Path("tests/outputs/portfolio_generation_results.json")
    with open(results_file, "w") as f:
        json.dump(test_results, f, indent=2)
    
    print(f"\n📊 Test results saved to: {results_file}")

if __name__ == "__main__":
    asyncio.run(test_portfolio_generation())