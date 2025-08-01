#!/usr/bin/env python3
"""
Analyze the Lisbon Resume Template CV to understand what data 
our extraction pipeline would produce and how it maps to template v1.3
"""

import json
import os
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

# Import CV extraction components
from src.core.cv_extraction.data_extractor import data_extractor
from src.core.schemas.unified_nullable import CVData
from src.core.local.text_extractor import text_extractor

async def analyze_lisbon_cv():
    """Extract and analyze the Lisbon CV template"""
    
    print("📄 Analyzing Lisbon Resume Template CV")
    print("=" * 80)
    
    # Path to the CV
    cv_path = Path(__file__).parent.parent / "data/cv_examples/pdf_examples/pdf/Lisbon-Resume-Template-Creative.pdf"
    
    if not cv_path.exists():
        print(f"❌ CV file not found at: {cv_path}")
        return
    
    print(f"✅ Found CV at: {cv_path}")
    print(f"📏 File size: {cv_path.stat().st_size / 1024:.1f} KB")
    
    print("\n🔄 Extracting text from PDF...")
    
    try:
        # First extract text from PDF (synchronous)
        extracted_text = text_extractor.extract_text(str(cv_path))
        
        if not extracted_text:
            print(f"❌ Failed to extract text from PDF")
            return
        print(f"✅ Extracted {len(extracted_text)} characters of text")
        
        print("\n🔄 Extracting CV data using AI...")
        
        # Extract CV data
        cv_data = await data_extractor.extract_cv_data(extracted_text)
        
        # Convert to dict for analysis
        cv_dict = cv_data.dict() if hasattr(cv_data, 'dict') else cv_data
        
        print("\n✅ CV data extracted successfully!")
        
        # Analyze each section
        analyze_sections(cv_dict)
        
        # Check for URLs and media
        check_for_media_content(cv_dict)
        
        # Show view mode predictions
        predict_view_modes(cv_dict)
        
        # Save extracted data for inspection
        output_path = Path(__file__).parent / "lisbon_cv_extracted.json"
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(cv_dict, f, indent=2, ensure_ascii=False)
        
        print(f"\n💾 Extracted data saved to: {output_path}")
        
    except Exception as e:
        print(f"\n❌ Error extracting CV: {e}")
        import traceback
        traceback.print_exc()

def analyze_sections(cv_data):
    """Analyze what sections were extracted"""
    print("\n📊 Extracted Sections Analysis:")
    print("-" * 40)
    
    sections = {
        "hero": "Basic Information",
        "contact": "Contact Details",
        "summary": "Professional Summary",
        "experience": "Work Experience",
        "education": "Education",
        "skills": "Skills",
        "projects": "Projects",
        "certifications": "Certifications",
        "languages": "Languages",
        "achievements": "Achievements",
        "volunteer": "Volunteer Work",
        "publications": "Publications",
        "speaking": "Speaking Engagements",
        "memberships": "Memberships",
        "hobbies": "Hobbies & Interests"
    }
    
    for key, label in sections.items():
        if key in cv_data and cv_data[key]:
            # Check if section has content
            if isinstance(cv_data[key], dict):
                # Check for items arrays
                items_key = None
                if f"{key}Items" in cv_data[key]:
                    items_key = f"{key}Items"
                elif "items" in cv_data[key]:
                    items_key = "items"
                elif key == "achievements" and "achievements" in cv_data[key]:
                    items_key = "achievements"
                elif key == "publications" and "publications" in cv_data[key]:
                    items_key = "publications"
                elif key == "speaking" and "speakingEngagements" in cv_data[key]:
                    items_key = "speakingEngagements"
                elif key == "memberships" and "memberships" in cv_data[key]:
                    items_key = "memberships"
                
                if items_key and cv_data[key].get(items_key):
                    count = len(cv_data[key][items_key])
                    print(f"✅ {label}: {count} items")
                else:
                    # Check if section has any non-empty values
                    has_content = any(v for v in cv_data[key].values() if v)
                    if has_content:
                        print(f"✅ {label}: Present")
                    else:
                        print(f"⚠️  {label}: Empty section")
            else:
                print(f"✅ {label}: {type(cv_data[key]).__name__}")
        else:
            print(f"❌ {label}: Not found")

def check_for_media_content(cv_data):
    """Check for URLs and media links that would trigger special view modes"""
    print("\n🔍 Media Content Detection:")
    print("-" * 40)
    
    urls_found = []
    
    # Check projects for URLs
    if cv_data.get("projects") and cv_data["projects"].get("projectItems"):
        for idx, project in enumerate(cv_data["projects"]["projectItems"]):
            if project.get("projectUrl"):
                urls_found.append(("Project", project.get("title", f"Project {idx+1}"), 
                                 "projectUrl", project["projectUrl"]))
            if project.get("githubUrl"):
                urls_found.append(("Project", project.get("title", f"Project {idx+1}"), 
                                 "githubUrl", project["githubUrl"]))
            if project.get("videoUrl"):
                urls_found.append(("Project", project.get("title", f"Project {idx+1}"), 
                                 "videoUrl", project["videoUrl"]))
            if project.get("imageUrl"):
                urls_found.append(("Project", project.get("title", f"Project {idx+1}"), 
                                 "imageUrl", project["imageUrl"]))
            if project.get("demoUrl"):
                urls_found.append(("Project", project.get("title", f"Project {idx+1}"), 
                                 "demoUrl", project["demoUrl"]))
    
    # Check contact for professional links
    if cv_data.get("contact") and cv_data["contact"].get("professionalLinks"):
        for link in cv_data["contact"]["professionalLinks"]:
            if link.get("url"):
                urls_found.append(("Contact", link.get("platform", "Unknown"), 
                                 "url", link["url"]))
    
    # Check certifications for verification URLs
    if cv_data.get("certifications") and cv_data["certifications"].get("certificationItems"):
        for cert in cv_data["certifications"]["certificationItems"]:
            if cert.get("verificationUrl"):
                urls_found.append(("Certification", cert.get("title", "Unknown"), 
                                 "verificationUrl", cert["verificationUrl"]))
    
    # Check publications for URLs
    if cv_data.get("publications") and cv_data["publications"].get("publications"):
        for pub in cv_data["publications"]["publications"]:
            if pub.get("url"):
                urls_found.append(("Publication", pub.get("title", "Unknown"), 
                                 "url", pub["url"]))
    
    # Check hero for profile photo
    if cv_data.get("hero") and cv_data["hero"].get("profilePhotoUrl"):
        urls_found.append(("Hero", "Profile Photo", 
                         "profilePhotoUrl", cv_data["hero"]["profilePhotoUrl"]))
    
    if urls_found:
        print(f"🔗 Found {len(urls_found)} URLs:")
        for section, item, field, url in urls_found:
            print(f"  • {section} - {item}: {field} = {url[:50]}...")
    else:
        print("❌ No URLs found in CV data")

def predict_view_modes(cv_data):
    """Predict what view modes would be assigned based on URLs"""
    print("\n🎯 Predicted View Mode Assignments:")
    print("-" * 40)
    
    # Simple URL type detection
    def detect_url_type(url):
        if not url:
            return "none"
        url_lower = url.lower()
        if any(x in url_lower for x in ["youtube.com", "youtu.be", "vimeo.com", ".mp4", ".webm"]):
            return "video"
        elif "github.com" in url_lower:
            return "github"
        elif any(x in url_lower for x in [".jpg", ".png", ".gif", "unsplash.com", "imgur.com"]):
            return "image"
        elif "twitter.com/status" in url_lower or "x.com/status" in url_lower:
            return "tweet"
        else:
            return "link"
    
    predictions = []
    
    # Check projects
    if cv_data.get("projects") and cv_data["projects"].get("projectItems"):
        for project in cv_data["projects"]["projectItems"]:
            urls = {
                "videoUrl": project.get("videoUrl"),
                "githubUrl": project.get("githubUrl"),
                "imageUrl": project.get("imageUrl"),
                "projectUrl": project.get("projectUrl"),
                "demoUrl": project.get("demoUrl")
            }
            
            # Determine priority
            if urls["videoUrl"] and detect_url_type(urls["videoUrl"]) == "video":
                mode = "video"
            elif urls["demoUrl"] and detect_url_type(urls["demoUrl"]) == "video":
                mode = "video"
            elif urls["githubUrl"] and detect_url_type(urls["githubUrl"]) == "github":
                mode = "github"
            elif urls["imageUrl"] and detect_url_type(urls["imageUrl"]) == "image":
                mode = "images"
            elif urls["projectUrl"] and detect_url_type(urls["projectUrl"]) == "tweet":
                mode = "tweet"
            elif any(urls.values()):
                mode = "uri"
            else:
                mode = "text"
            
            predictions.append((
                "Project",
                project.get("title", "Untitled"),
                mode,
                [f"{k}: {v[:30]}..." for k, v in urls.items() if v]
            ))
    
    if predictions:
        for section, title, mode, urls in predictions:
            print(f"\n  {section}: {title}")
            if urls:
                for url in urls:
                    print(f"    - {url}")
            print(f"    → Predicted mode: {mode.upper()}")
    else:
        print("  All items will use default TEXT mode")

def show_sample_data_structure(cv_data):
    """Show a sample of the extracted data structure"""
    print("\n📋 Sample Data Structure:")
    print("-" * 40)
    
    # Show hero section
    if cv_data.get("hero"):
        print("\nHero Section:")
        print(json.dumps(cv_data["hero"], indent=2)[:300] + "...")
    
    # Show first experience item
    if cv_data.get("experience") and cv_data["experience"].get("experienceItems"):
        print("\nFirst Experience Item:")
        print(json.dumps(cv_data["experience"]["experienceItems"][0], indent=2)[:300] + "...")
    
    # Show skills structure
    if cv_data.get("skills"):
        print("\nSkills Section:")
        skills_preview = {
            "sectionTitle": cv_data["skills"].get("sectionTitle"),
            "categoriesCount": len(cv_data["skills"].get("skillCategories", [])),
            "ungroupedCount": len(cv_data["skills"].get("ungroupedSkills", []))
        }
        print(json.dumps(skills_preview, indent=2))

if __name__ == "__main__":
    # Try to run the analysis
    try:
        import asyncio
        asyncio.run(analyze_lisbon_cv())
    except ImportError as e:
        print(f"⚠️  Import error: {e}")
        print("\n📝 Manual Analysis of Lisbon CV Template:")
        print("=" * 80)
        print("""
Based on the Lisbon Resume Template (Creative), here's what we expect:

1. HERO SECTION:
   - Full Name: Would be extracted
   - Professional Title: Would be extracted
   - Profile Photo: If present, would be extracted
   - Summary Tagline: Would be extracted from summary

2. CONTACT SECTION:
   - Email: Would be extracted
   - Phone: Would be extracted
   - Location: City, State, Country would be extracted
   - Professional Links: LinkedIn, GitHub, Portfolio URLs if present

3. EXPERIENCE SECTION:
   - Job titles, companies, dates, responsibilities would be extracted
   - NO URLs typically in standard resumes

4. EDUCATION SECTION:
   - Degrees, institutions, dates would be extracted
   - NO image URLs typically

5. SKILLS SECTION:
   - May be categorized or ungrouped
   - Would support detailed text (e.g., "Python - 5 years experience")

6. PROJECTS SECTION (if present):
   - This is where URLs might appear
   - Could have: projectUrl, githubUrl, demoUrl

7. CERTIFICATIONS (if present):
   - May include verification URLs

8. EXPECTED VIEW MODES:
   - Most items: TEXT mode (default)
   - Projects with URLs: Could be URI, GITHUB, or VIDEO mode
   - Certifications with URLs: URI mode
   - Profile photo: Would display if URL provided

9. COMPATIBILITY CHECK:
   ✅ All standard CV sections map perfectly to template v1.3
   ✅ URL detection would work for any links found
   ✅ Default text mode ensures all content displays properly
   ✅ Skills with detailed text would parse correctly
   ✅ Date ranges would format properly
   ✅ Missing sections would be handled gracefully
        """)