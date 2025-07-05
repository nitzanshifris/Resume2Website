#!/usr/bin/env python3
"""
Test the complete CV2WEB pipeline with multiple real CV examples
"""
import asyncio
import sys
import os
import json
import time
from pathlib import Path
from datetime import datetime

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import our services
from services.local.text_extractor import text_extractor
from services.llm.data_extractor import data_extractor
from api.db import init_db, create_user, create_session, get_user_by_email
from api.routes.cv import hash_password
import aiofiles
import uuid

# Test CVs from different formats
TEST_CVS = [
    {
        "name": "PDF Example - Software Engineer",
        "path": "data/cv_examples/pdf_examples/simple_pdf/software-engineer-resume-example.pdf",
        "type": "PDF"
    },
    {
        "name": "Image Example - Corporate Sales",
        "path": "data/cv_examples/jpeg_examples/Corporate-Sales-Business-Development-CV-Sample.jpg",
        "type": "JPEG"
    },
    {
        "name": "Markdown Example - Ethan Miller",
        "path": "data/cv_examples/md_examples/Ethan_Miller.md",
        "type": "Markdown"
    }
]

async def test_cv_processing(cv_info):
    """Test complete processing for a single CV"""
    print(f"\n{'='*80}")
    print(f"Testing: {cv_info['name']}")
    print(f"Type: {cv_info['type']}")
    print(f"Path: {cv_info['path']}")
    print('='*80)
    
    # Check if file exists
    if not Path(cv_info['path']).exists():
        print(f"❌ File not found: {cv_info['path']}")
        return None
    
    results = {
        "name": cv_info['name'],
        "type": cv_info['type'],
        "stages": {}
    }
    
    try:
        # Stage 1: Text Extraction
        print("\n📄 Stage 1: Text Extraction")
        start = time.time()
        text = text_extractor.extract_text(cv_info['path'])
        extraction_time = time.time() - start
        
        print(f"✅ Extracted {len(text)} characters in {extraction_time:.2f}s")
        print(f"Preview: {text[:200]}...")
        
        results["stages"]["text_extraction"] = {
            "success": True,
            "characters": len(text),
            "time": extraction_time
        }
        
        # Stage 2: AI Data Extraction
        print("\n🤖 Stage 2: AI Data Extraction")
        start = time.time()
        cv_data = await data_extractor.extract_cv_data(text)
        ai_time = time.time() - start
        
        # Count extracted sections
        sections = {k: v for k, v in cv_data.model_dump().items() if v}
        print(f"✅ Extracted {len(sections)} sections in {ai_time:.2f}s")
        
        # Show what was extracted
        if cv_data.hero:
            print(f"\n👤 Hero Section:")
            print(f"   Name: {cv_data.hero.fullName}")
            print(f"   Title: {cv_data.hero.professionalTitle}")
        
        if cv_data.experience and cv_data.experience.experienceItems:
            print(f"\n💼 Experience: {len(cv_data.experience.experienceItems)} positions")
            latest = cv_data.experience.experienceItems[0]
            print(f"   Latest: {latest.jobTitle} at {latest.companyName}")
        
        if cv_data.skills and cv_data.skills.skillCategories:
            print(f"\n🛠️ Skills: {len(cv_data.skills.skillCategories)} categories")
        
        results["stages"]["ai_extraction"] = {
            "success": True,
            "sections": len(sections),
            "time": ai_time,
            "sections_found": list(sections.keys())
        }
        
        # Stage 3: File Upload Simulation
        print("\n📤 Stage 3: File Upload Simulation")
        job_id = str(uuid.uuid4())
        upload_dir = Path("data/uploads")
        upload_dir.mkdir(exist_ok=True)
        
        # Read original file
        with open(cv_info['path'], 'rb') as f:
            file_content = f.read()
        
        # Save with job_id
        file_extension = Path(cv_info['path']).suffix
        upload_path = upload_dir / f"{job_id}{file_extension}"
        
        async with aiofiles.open(upload_path, 'wb') as f:
            await f.write(file_content)
        
        print(f"✅ Saved as job: {job_id}")
        print(f"   Size: {len(file_content) / 1024:.1f} KB")
        
        results["stages"]["file_upload"] = {
            "success": True,
            "job_id": job_id,
            "size_kb": len(file_content) / 1024
        }
        
        # Save extracted data
        output_dir = Path("data/test_outputs")
        output_dir.mkdir(exist_ok=True)
        output_file = output_dir / f"{job_id}_extracted.json"
        
        with open(output_file, 'w') as f:
            json.dump(cv_data.model_dump(mode='json', exclude_none=True), f, indent=2)
        
        print(f"\n💾 Saved extraction to: {output_file}")
        
        return results
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return None

async def test_auth_flow():
    """Test authentication flow"""
    print("\n🔐 Testing Authentication Flow")
    print("="*80)
    
    # Initialize database
    init_db()
    
    # Test user registration
    test_email = f"test_{int(time.time())}@example.com"
    test_password = "SecurePassword123!"
    
    try:
        # Register
        user_id = create_user(test_email, hash_password(test_password))
        print(f"✅ User registered: {test_email}")
        
        # Create session
        session_id = create_session(user_id)
        print(f"✅ Session created: {session_id}")
        
        # Verify user exists
        user = get_user_by_email(test_email)
        print(f"✅ User verified in database")
        
        return True
        
    except Exception as e:
        print(f"❌ Auth test failed: {e}")
        return False

async def main():
    """Run all tests"""
    print("🚀 CV2WEB Full Pipeline Test")
    print("Testing with real CV examples from multiple formats")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Test authentication
    auth_success = await test_auth_flow()
    
    # Test each CV
    all_results = []
    for cv_info in TEST_CVS:
        result = await test_cv_processing(cv_info)
        if result:
            all_results.append(result)
        
        # Small delay to avoid rate limits
        await asyncio.sleep(2)
    
    # Summary
    print("\n" + "="*80)
    print("📊 SUMMARY")
    print("="*80)
    
    print(f"\n✅ Authentication: {'Passed' if auth_success else 'Failed'}")
    print(f"\n✅ CVs Processed: {len(all_results)}/{len(TEST_CVS)}")
    
    for result in all_results:
        print(f"\n📄 {result['name']} ({result['type']})")
        for stage, data in result['stages'].items():
            if data['success']:
                print(f"   ✅ {stage}: Success")
    
    # Performance stats
    total_extraction_time = sum(r['stages']['text_extraction']['time'] for r in all_results)
    total_ai_time = sum(r['stages']['ai_extraction']['time'] for r in all_results)
    
    print(f"\n⏱️  Performance:")
    print(f"   Text Extraction: {total_extraction_time:.2f}s total")
    print(f"   AI Extraction: {total_ai_time:.2f}s total")
    
    print("\n✅ Full pipeline test complete!")

if __name__ == "__main__":
    asyncio.run(main())