#!/usr/bin/env python3
"""
End-to-End Test: CV Data → Component Selection → Universal Adapter → Portfolio
"""

import asyncio
import json
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from services.portfolio.component_selector import component_selector
from services.portfolio.portfolio_generator import portfolio_generator
from backend.schemas.unified import CVData

def create_test_cv_data():
    """Create comprehensive test CV data"""
    return {
        "hero": {
            "fullName": "John Doe",
            "title": "Senior Full Stack Developer",
            "location": "San Francisco, CA"
        },
        "summary": "Passionate full-stack developer with 8+ years of experience building scalable web applications",
        "experience": [
            {
                "jobTitle": "Senior Developer",
                "companyName": "Tech Corp",
                "dateRange": "2020-2023",
                "description": "Led development team",
                "responsibilities": ["Code review", "Mentoring", "Architecture design"]
            },
            {
                "position": "Full Stack Developer",
                "organization": "StartupXYZ",
                "duration": "2018-2020",
                "summary": "Built scalable web applications"
            }
        ],
        "skills": {
            "sectionTitle": "Skills",
            "skillCategories": [
                {
                    "categoryName": "Frontend",
                    "skills": ["React", "Vue", "Angular", "TypeScript"]
                },
                {
                    "categoryName": "Backend", 
                    "skills": ["Python", "Node.js", "Java"]
                },
                {
                    "categoryName": "Database",
                    "skills": ["PostgreSQL", "MongoDB", "Redis"]
                },
                {
                    "categoryName": "DevOps",
                    "skills": ["Docker", "Kubernetes", "AWS"]
                }
            ]
        },
        "projects": [
            {
                "title": "E-commerce Platform",
                "description": "Full-stack web application with payment processing",
                "technologies": "React • Node.js • PostgreSQL",
                "projectUrl": "https://github.com/johndoe/ecommerce"
            },
            {
                "title": "AI Chat Application", 
                "description": "Real-time chat with AI integration",
                "technologies": "Next.js • Socket.io • OpenAI API",
                "projectUrl": "https://github.com/johndoe/ai-chat"
            }
        ],
        "contact": [
            {
                "type": "email",
                "value": "john@example.com",
                "url": "mailto:john@example.com"
            },
            {
                "type": "github",
                "value": "GitHub Profile",
                "url": "https://github.com/johndoe"
            },
            {
                "type": "linkedin",
                "value": "LinkedIn Profile", 
                "url": "https://linkedin.com/in/johndoe"
            }
        ]
    }

def test_end_to_end_pipeline():
    """Test the complete pipeline from CV data to portfolio generation"""
    print("🚀 End-to-End Universal Adapter Pipeline Test")
    print("=" * 50)
    
    # Step 1: Create test CV data
    print("\n📋 Step 1: Creating Test CV Data")
    cv_data_dict = create_test_cv_data()
    
    # Convert to CVData object
    class MockSkillCategory:
        def __init__(self, data):
            self.categoryName = data.get("categoryName")
            self.skills = data.get("skills", [])
    
    class MockSkillsSection:
        def __init__(self, data):
            self.sectionTitle = data.get("sectionTitle", "Skills")
            self.skillCategories = [MockSkillCategory(cat) for cat in data.get("skillCategories", [])]
    
    class MockCVData:
        def __init__(self, data_dict):
            for key, value in data_dict.items():
                if key == "skills" and isinstance(value, dict):
                    setattr(self, key, MockSkillsSection(value))
                else:
                    setattr(self, key, value)
        
        def model_dump(self):
            """Mock model_dump method for compatibility with component selector"""
            return {key: getattr(self, key, None) for key in [
                'hero', 'summary', 'experience', 'education', 'skills', 'projects',
                'achievements', 'certifications', 'languages', 'courses', 'volunteer',
                'publications', 'speaking', 'patents', 'memberships', 'hobbies', 'contact'
            ]}
    
    cv_data = MockCVData(cv_data_dict)
    print(f"✅ Created CV data with {len(cv_data_dict)} sections")
    
    # Step 2: Component Selection
    print("\n🎯 Step 2: Component Selection")
    try:
        selections = component_selector.select_components(cv_data)
        print(f"✅ Selected {len(selections)} components")
        
        for i, selection in enumerate(selections):
            print(f"   {i+1}. {selection.component_type} for {selection.section}")
            print(f"      Props: {list(selection.props.keys()) if selection.props else 'None'}")
            
    except Exception as e:
        print(f"❌ Component selection failed: {e}")
        return False
    
    # Step 3: Verify Universal Adapter Integration
    print("\n🔮 Step 3: Verify Universal Adapter Integration")
    universal_adapter_detected = False
    
    for selection in selections:
        # Check for Universal Adapter specific patterns in props
        if selection.component_type == "timeline" and "entries" in selection.props:
            print(f"   ✅ {selection.component_type}: Universal Adapter timeline format detected")
            universal_adapter_detected = True
            
        elif selection.component_type == "bento-grid":
            if "cards" in selection.props:
                print(f"   ✅ {selection.component_type}: Universal Adapter fallback to WobbleCard")
                universal_adapter_detected = True
            elif "items" in selection.props:
                print(f"   ✅ {selection.component_type}: Universal Adapter BentoGrid format")
                universal_adapter_detected = True
                
        elif selection.component_type == "card-hover-effect" and "cards" in selection.props:
            print(f"   ✅ {selection.component_type}: Universal Adapter cards format detected")
            universal_adapter_detected = True
            
        elif selection.component_type == "floating-dock" and "items" in selection.props:
            print(f"   ✅ {selection.component_type}: Universal Adapter dock items format detected")
            universal_adapter_detected = True
    
    if not universal_adapter_detected:
        print("   ⚠️  Universal Adapter patterns not clearly detected")
    
    # Step 4: Portfolio Generation
    print("\n🏗️  Step 4: Portfolio Generation")
    output_dir = Path("test_outputs/end_to_end_universal_adapter")
    
    try:
        files = portfolio_generator.generate_portfolio(
            selections,
            "John Doe",
            output_dir
        )
        
        print(f"✅ Generated {len(files)} portfolio files")
        print(f"   Portfolio saved to: {output_dir}")
        
        # List key generated files
        key_files = ["app/page.tsx", "lib/portfolio-data.ts", "package.json"]
        for key_file in key_files:
            file_path = output_dir / key_file
            if file_path.exists():
                print(f"   ✅ {key_file} ({file_path.stat().st_size} bytes)")
            else:
                print(f"   ❌ {key_file} missing")
        
    except Exception as e:
        print(f"❌ Portfolio generation failed: {e}")
        return False
    
    # Step 5: Validate Generated Portfolio
    print("\n🔍 Step 5: Portfolio Validation")
    
    # Check main page for Universal Adapter patterns
    main_page_path = output_dir / "app/page.tsx"
    if main_page_path.exists():
        content = main_page_path.read_text()
        
        # Look for Universal Adapter TSX patterns
        universal_patterns = [
            "entries || []",  # Timeline
            "cards || items || []",  # CardHoverEffect
            "items && items.length > 0",  # FloatingDock
            "testimonials || []"  # AnimatedTestimonials
        ]
        
        found_patterns = [pattern for pattern in universal_patterns if pattern in content]
        print(f"   Universal Adapter TSX patterns found: {len(found_patterns)}")
        
        if found_patterns:
            print("   ✅ Universal Adapter integration detected in generated TSX")
        else:
            print("   ⚠️  Universal Adapter patterns not found in generated TSX")
    
    # Check portfolio data
    portfolio_data_path = output_dir / "lib/portfolio-data.ts"
    if portfolio_data_path.exists():
        content = portfolio_data_path.read_text()
        
        if "Universal Adapter" in content:
            print("   ✅ Universal Adapter processing detected in portfolio data")
        else:
            print("   ⚠️  Universal Adapter signature not found in portfolio data")
    
    # Final Results
    print("\n" + "=" * 50)
    print("🎉 END-TO-END TEST COMPLETED")
    print("=" * 50)
    
    success_metrics = {
        "cv_data_created": bool(cv_data_dict),
        "components_selected": len(selections) > 0,
        "universal_adapter_detected": universal_adapter_detected,
        "portfolio_generated": len(files) > 0 if 'files' in locals() else False,
        "key_files_generated": all((output_dir / f).exists() for f in key_files)
    }
    
    print(f"📊 Success Metrics:")
    for metric, success in success_metrics.items():
        status = "✅" if success else "❌"
        print(f"   {status} {metric.replace('_', ' ').title()}")
    
    overall_success = all(success_metrics.values())
    
    if overall_success:
        print("\n🎉 SUCCESS: Universal Adapter is fully integrated!")
        print("✅ Complete pipeline working: CV Data → Component Selection → Universal Adapter → Portfolio")
    else:
        print("\n❌ PARTIAL SUCCESS: Some components need attention")
    
    print(f"\n📁 Generated portfolio: {output_dir}")
    
    return overall_success

if __name__ == "__main__":
    success = test_end_to_end_pipeline()
    exit(0 if success else 1)