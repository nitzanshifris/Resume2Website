#!/usr/bin/env python3
"""
Test Component Selector with real CV data
"""
import sys
import os
import asyncio
import json
from pathlib import Path

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.llm.data_extractor import data_extractor
from services.portfolio.component_selector import component_selector, UserArchetype

# Sample CV for testing
SAMPLE_CV = """
John Smith
Senior Software Engineer

PROFESSIONAL SUMMARY
Experienced software engineer with 8+ years building scalable web applications. 
Led teams of 5-10 engineers on critical projects that increased revenue by 40%.

EXPERIENCE
Senior Software Engineer | TechCorp Inc. | San Francisco, CA | 2020 - Present
• Architected microservices handling 1M+ requests/day using Python and Kubernetes
• Reduced deployment time by 60% through CI/CD pipeline optimization
• Mentored 3 junior developers, improving team velocity by 25%

Software Engineer | StartupXYZ | Remote | 2018 - 2020
• Built RESTful APIs serving 500K+ users with FastAPI and PostgreSQL
• Implemented real-time features using WebSockets and Redis
• Improved application performance by 45% through database optimization

SKILLS
Programming Languages: Python, JavaScript, TypeScript, Go
Frameworks: React, Next.js, FastAPI, Django, Express.js
Databases: PostgreSQL, MongoDB, Redis, Elasticsearch
DevOps: Docker, Kubernetes, AWS, GitHub Actions, Terraform
Tools: Git, VS Code, Postman, DataDog, Sentry

PROJECTS
E-commerce Platform (2023)
• Built scalable marketplace using Next.js and Python microservices
• Integrated Stripe payment processing handling $2M+ in transactions
• Technologies: React, FastAPI, PostgreSQL, Redis, Docker

Open Source CLI Tool (2022)
• Created developer productivity tool with 1K+ GitHub stars
• Published to npm with 5K+ weekly downloads
• Technologies: TypeScript, Node.js, Jest

EDUCATION
Bachelor of Science in Computer Science | MIT | 2014 - 2018
• GPA: 3.8/4.0
• Relevant Coursework: Algorithms, Distributed Systems, Machine Learning

ACHIEVEMENTS
• Increased system performance by 40% through optimization
• Led migration to cloud infrastructure saving $100K annually
• Speaker at PyCon 2023 on microservices architecture
• AWS Certified Solutions Architect

LANGUAGES
English: Native
Spanish: Professional Working Proficiency
Mandarin: Basic

CERTIFICATIONS
AWS Certified Solutions Architect | Amazon Web Services | 2023
Google Cloud Professional Developer | Google | 2022
"""

async def test_component_selector():
    """Test the component selector with real CV data"""
    print("🧪 Testing Component Selector")
    print("=" * 80)
    
    # Step 1: Extract CV data
    print("\n1️⃣ Extracting CV data...")
    try:
        cv_data = await data_extractor.extract_cv_data(SAMPLE_CV)
        print("✅ CV data extracted successfully")
        
        # Show what sections were extracted
        sections_found = []
        for field in cv_data.model_fields:
            section_data = getattr(cv_data, field)
            if section_data:
                sections_found.append(field)
        
        print(f"   Sections found: {', '.join(sections_found)}")
        
    except Exception as e:
        print(f"❌ Failed to extract CV data: {e}")
        return
    
    # Step 2: Detect archetype
    print("\n2️⃣ Detecting user archetype...")
    archetype = component_selector.detect_archetype(cv_data)
    print(f"✅ Detected archetype: {archetype.value}")
    
    # Step 3: Select components
    print("\n3️⃣ Selecting components...")
    selections = component_selector.select_components(cv_data, archetype)
    
    if not selections:
        print("❌ No components selected!")
        return
        
    print(f"✅ Selected {len(selections)} components:")
    
    for selection in selections:
        print(f"\n   Section: {selection.section}")
        print(f"   Component: {selection.component_type}")
        print(f"   Import: {selection.import_path}")
        print(f"   Props preview: {json.dumps(selection.props, indent=6)[:200]}...")
    
    # Step 4: Generate layout config
    print("\n4️⃣ Generating layout configuration...")
    layout_config = component_selector.generate_layout_config(selections)
    
    # Save results for inspection
    output_dir = Path("tests/outputs")
    output_dir.mkdir(exist_ok=True)
    
    output_file = output_dir / "component_selection_test.json"
    with open(output_file, "w") as f:
        json.dump({
            "archetype": archetype.value,
            "selections": [
                {
                    "section": s.section,
                    "component": s.component_type,
                    "import": s.import_path,
                    "props": s.props,
                    "priority": s.priority
                }
                for s in selections
            ],
            "layout_config": layout_config
        }, f, indent=2)
    
    print(f"✅ Layout configuration generated")
    print(f"   Results saved to: {output_file}")
    
    # Step 5: Validate results
    print("\n5️⃣ Validating results...")
    
    # Check that we have essential sections
    selected_sections = [s.section for s in selections]
    essential_sections = ["hero", "experience", "skills"]
    missing_essentials = [s for s in essential_sections if s not in selected_sections]
    
    if missing_essentials:
        print(f"⚠️  Missing essential sections: {missing_essentials}")
    else:
        print("✅ All essential sections included")
    
    # Check props are not empty
    empty_props = [s.section for s in selections if not s.props]
    if empty_props:
        print(f"⚠️  Sections with empty props: {empty_props}")
    else:
        print("✅ All components have props")
    
    print("\n" + "=" * 80)
    print("✅ Component selector test complete!")
    
    # Show example component usage
    print("\n📝 Example React component usage:")
    print("```tsx")
    for selection in selections[:3]:  # Show first 3
        # Convert kebab-case to PascalCase
        comp_name = ''.join(word.capitalize() for word in selection.component_type.split('-'))
        print(f"import {{ {comp_name} }} from '{selection.import_path}';")
    print("\n// In your component:")
    print("<>")
    for selection in selections[:3]:
        comp_name = ''.join(word.capitalize() for word in selection.component_type.split('-'))
        print(f"  <{comp_name} {{...{selection.section}Props}} />")
    print("</>")
    print("```")

if __name__ == "__main__":
    asyncio.run(test_component_selector())