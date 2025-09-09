#!/usr/bin/env python3
"""
Performance test for optimized CV extraction
Tests the new batch processing vs old individual section processing
"""
import asyncio
import time
import sys
import os

# Add src to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'src'))

from core.cv_extraction.data_extractor import DataExtractor

# Sample CV text for testing
SAMPLE_CV_TEXT = """
John Smith
Senior Software Engineer
john.smith@email.com | (555) 123-4567 | LinkedIn: linkedin.com/in/johnsmith

PROFESSIONAL SUMMARY
Experienced software engineer with 8+ years developing scalable web applications.
Expert in Python, JavaScript, and cloud technologies. Led teams of 5+ developers.

EXPERIENCE
Senior Software Engineer | TechCorp Inc. | 2020 - Present | San Francisco, CA
- Developed microservices architecture serving 1M+ users
- Led migration to AWS cloud reducing costs by 40%
- Mentored 5 junior developers and improved team productivity by 25%

Software Engineer | StartupXYZ | 2018 - 2020 | Seattle, WA
- Built full-stack applications using React and Django
- Implemented CI/CD pipelines reducing deployment time by 60%
- Collaborated with product team on user experience improvements

EDUCATION
Bachelor of Science in Computer Science | Stanford University | 2014-2018 | Stanford, CA
GPA: 3.8/4.0
Relevant Coursework: Data Structures, Algorithms, Software Engineering

SKILLS
Programming Languages: Python, JavaScript, Java, Go
Frameworks: React, Django, Flask, Express.js
Databases: PostgreSQL, MongoDB, Redis
Cloud: AWS (EC2, S3, Lambda), Docker, Kubernetes
Tools: Git, Jenkins, Jira, Confluence

CERTIFICATIONS
AWS Certified Solutions Architect | Amazon Web Services | 2021
Certified Scrum Master | Scrum Alliance | 2020

LANGUAGES
English: Native
Spanish: Conversational
French: Basic
"""

async def test_extraction_performance():
    """Test extraction performance with metrics"""
    print("🧪 Testing CV Extraction Performance")
    print("=" * 50)
    
    try:
        # Initialize extractor
        extractor = DataExtractor()
        
        # Test 1: First extraction (no cache)
        print("\n📊 Test 1: First extraction (no cache)")
        start_time = time.time()
        
        result1 = await extractor.extract_cv_data(SAMPLE_CV_TEXT)
        
        first_extraction_time = time.time() - start_time
        print(f"⏱️  First extraction time: {first_extraction_time:.2f}s")
        print(f"📋 Sections extracted: {len([k for k, v in result1.model_dump().items() if v])}")
        
        # Test 2: Second extraction (should hit cache)
        print("\n📊 Test 2: Second extraction (cache test)")
        start_time = time.time()
        
        result2 = await extractor.extract_cv_data(SAMPLE_CV_TEXT)
        
        cached_extraction_time = time.time() - start_time
        print(f"⚡ Cached extraction time: {cached_extraction_time:.2f}s")
        print(f"🚀 Cache speedup: {(first_extraction_time / cached_extraction_time):.1f}x faster")
        
        # Test 3: Different CV (no cache)
        modified_cv = SAMPLE_CV_TEXT.replace("John Smith", "Jane Doe")
        print("\n📊 Test 3: Different CV (no cache)")
        start_time = time.time()
        
        result3 = await extractor.extract_cv_data(modified_cv)
        
        third_extraction_time = time.time() - start_time
        print(f"⏱️  Third extraction time: {third_extraction_time:.2f}s")
        
        # Performance Summary
        print("\n" + "=" * 50)
        print("📈 PERFORMANCE SUMMARY")
        print("=" * 50)
        print(f"🎯 Target time: <5.0s")
        print(f"⏱️  Average extraction: {(first_extraction_time + third_extraction_time) / 2:.2f}s")
        print(f"⚡ Cache hit time: {cached_extraction_time:.2f}s")
        print(f"✅ Target achieved: {'YES' if first_extraction_time < 5.0 else 'NO'}")
        
        if first_extraction_time < 5.0:
            improvement = ((14.5 - first_extraction_time) / 14.5) * 100
            print(f"🚀 Performance improvement: {improvement:.1f}% faster than before")
        
        # Show metrics
        print(f"\n📊 Performance Metrics:")
        for metric, value in extractor._performance_metrics.items():
            print(f"   {metric}: {value}")
        
        return {
            'first_time': first_extraction_time,
            'cached_time': cached_extraction_time,
            'target_met': first_extraction_time < 5.0,
            'sections_count': len([k for k, v in result1.model_dump().items() if v])
        }
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
        return None

if __name__ == "__main__":
    # Run the performance test
    result = asyncio.run(test_extraction_performance())
    
    if result and result['target_met']:
        print("\n🎉 SUCCESS: Performance target achieved!")
        sys.exit(0)
    else:
        print("\n⚠️  WARNING: Performance target not met")
        sys.exit(1)