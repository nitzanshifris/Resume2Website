#!/usr/bin/env python3
"""
Comprehensive test for CV text extraction and data parsing pipeline.
Tests the complete flow from file upload to structured data extraction.
"""
import asyncio
import json
import logging
import sys
from pathlib import Path
from typing import Dict, Any
import time

# Add project root to path
sys.path.append(str(Path(__file__).parent.parent))

from services.local.text_extractor import text_extractor
from services.llm.data_extractor import DataExtractor
from services.local.smart_deduplicator import SmartDeduplicator
from services.cv_extraction import MultiFileHandler
from backend.schemas.unified import CVData

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class CVExtractionPipelineTest:
    """Comprehensive CV extraction pipeline testing"""
    
    def __init__(self):
        self.text_extractor = text_extractor
        self.data_extractor = DataExtractor()
        self.deduplicator = SmartDeduplicator()
        self.test_results = []
        
    async def test_single_cv(self, cv_path: Path) -> Dict[str, Any]:
        """Test complete extraction pipeline on a single CV"""
        result = {
            "file": str(cv_path),
            "file_type": cv_path.suffix,
            "success": False,
            "stages": {},
            "errors": [],
            "timing": {}
        }
        
        print(f"\n{'='*80}")
        print(f"Testing: {cv_path.name}")
        print('='*80)
        
        # Stage 0: Check for multi-file CV
        multi_file_handler = MultiFileHandler()
        related_files = multi_file_handler.find_related_files(cv_path)
        
        if len(related_files) > 1:
            print(f"\n🔗 Found {len(related_files)} related files:")
            for f in related_files:
                print(f"   - {f.name}")
        
        # Stage 1: Text Extraction
        print("\n📄 Stage 1: Text Extraction")
        start_time = time.time()
        try:
            if len(related_files) > 1:
                # Extract text from all related files
                texts = []
                for file_path in related_files:
                    file_text = self.text_extractor.extract_text(str(file_path))
                    texts.append(file_text)
                    print(f"   Extracted {len(file_text)} chars from {file_path.name}")
                
                # Merge texts
                text = multi_file_handler.merge_texts(texts)
                print(f"   Merged {len(texts)} files into {len(text)} total characters")
            else:
                # Single file extraction
                text = self.text_extractor.extract_text(str(cv_path))
            
            extraction_time = time.time() - start_time
            
            result["stages"]["text_extraction"] = {
                "success": True,
                "characters": len(text),
                "words": len(text.split()),
                "time": extraction_time
            }
            result["timing"]["text_extraction"] = extraction_time
            
            print(f"✅ Extracted {len(text)} characters in {extraction_time:.2f}s")
            print(f"   First 200 chars: {text[:200]}...")
            
            if len(text) < 50:
                raise ValueError("Insufficient text extracted")
                
        except Exception as e:
            result["stages"]["text_extraction"] = {"success": False, "error": str(e)}
            result["errors"].append(f"Text extraction failed: {e}")
            print(f"❌ Text extraction failed: {e}")
            return result
        
        # Stage 2: Data Extraction
        print("\n🤖 Stage 2: AI Data Extraction")
        start_time = time.time()
        try:
            cv_data = await self.data_extractor.extract_cv_data(text)
            extraction_time = time.time() - start_time
            
            # Count extracted sections
            sections_found = []
            if cv_data.hero and cv_data.hero.fullName:
                sections_found.append("hero")
            if cv_data.experience and cv_data.experience.experienceItems:
                sections_found.append(f"experience ({len(cv_data.experience.experienceItems)} items)")
            if cv_data.education and cv_data.education.educationItems:
                sections_found.append(f"education ({len(cv_data.education.educationItems)} items)")
            if cv_data.skills:
                sections_found.append("skills")
            if cv_data.projects and cv_data.projects.projectItems:
                sections_found.append(f"projects ({len(cv_data.projects.projectItems)} items)")
            if cv_data.certifications and cv_data.certifications.certificationItems:
                sections_found.append(f"certifications ({len(cv_data.certifications.certificationItems)} items)")
            
            result["stages"]["data_extraction"] = {
                "success": True,
                "sections_found": sections_found,
                "time": extraction_time
            }
            result["timing"]["data_extraction"] = extraction_time
            
            print(f"✅ Data extraction completed in {extraction_time:.2f}s")
            print(f"   Sections found: {', '.join(sections_found)}")
            
            if cv_data.hero:
                print(f"   Name: {cv_data.hero.fullName}")
                print(f"   Title: {cv_data.hero.professionalTitle}")
                
        except Exception as e:
            result["stages"]["data_extraction"] = {"success": False, "error": str(e)}
            result["errors"].append(f"Data extraction failed: {e}")
            print(f"❌ Data extraction failed: {e}")
            return result
        
        # Stage 3: Deduplication
        print("\n🔍 Stage 3: Deduplication")
        start_time = time.time()
        try:
            # Check for duplicates in achievements
            if cv_data.achievements and cv_data.achievements.achievements:
                original_count = len(cv_data.achievements.achievements)
                achievements = [item.label for item in cv_data.achievements.achievements]
                
                # Find duplicates
                duplicates = []
                for i in range(len(achievements)):
                    for j in range(i + 1, len(achievements)):
                        similarity = self.deduplicator.calculate_similarity(
                            achievements[i], 
                            achievements[j]
                        )
                        if similarity > 0.85:
                            duplicates.append((i, j, similarity))
                
                dedup_time = time.time() - start_time
                
                result["stages"]["deduplication"] = {
                    "success": True,
                    "original_count": original_count,
                    "duplicates_found": len(duplicates),
                    "time": dedup_time
                }
                result["timing"]["deduplication"] = dedup_time
                
                print(f"✅ Deduplication completed in {dedup_time:.2f}s")
                print(f"   Found {len(duplicates)} potential duplicates out of {original_count} items")
            else:
                result["stages"]["deduplication"] = {
                    "success": True,
                    "message": "No achievements to deduplicate",
                    "time": 0
                }
                print("ℹ️  No achievements section to deduplicate")
                
        except Exception as e:
            result["stages"]["deduplication"] = {"success": False, "error": str(e)}
            result["errors"].append(f"Deduplication failed: {e}")
            print(f"❌ Deduplication failed: {e}")
        
        # Stage 4: Data Validation
        print("\n✅ Stage 4: Data Validation")
        validation_issues = []
        
        # Validate required fields
        if not cv_data.hero or not cv_data.hero.fullName:
            validation_issues.append("Missing required field: hero.fullName")
        if not cv_data.contact or not cv_data.contact.email:
            validation_issues.append("Missing required field: contact.email")
            
        # Validate data quality
        if cv_data.experience and cv_data.experience.experienceItems:
            for exp in cv_data.experience.experienceItems:
                if not exp.companyName:
                    validation_issues.append(f"Experience item missing company name")
                if not exp.responsibilitiesAndAchievements:
                    validation_issues.append(f"Experience item missing responsibilities")
                    
        result["stages"]["validation"] = {
            "success": len(validation_issues) == 0,
            "issues": validation_issues
        }
        
        if validation_issues:
            print(f"⚠️  Found {len(validation_issues)} validation issues:")
            for issue in validation_issues[:3]:
                print(f"   - {issue}")
        else:
            print("✅ All validation checks passed")
        
        # Overall success
        result["success"] = all(
            stage.get("success", False) 
            for stage in result["stages"].values()
        )
        
        # Save extracted data
        if result["success"]:
            output_path = Path("test_outputs") / f"{cv_path.stem}_extracted.json"
            output_path.parent.mkdir(exist_ok=True)
            
            cv_data_dict = cv_data.model_dump(mode='json')
            with open(output_path, "w") as f:
                json.dump(cv_data_dict, f, indent=2)
            
            result["output_file"] = str(output_path)
            print(f"\n💾 Saved extracted data to: {output_path}")
            
            # Print detailed extracted data
            print("\n📋 EXTRACTED DATA SUMMARY:")
            print("="*60)
            
            # Hero section
            if cv_data.hero:
                print(f"\n👤 HERO SECTION:")
                print(f"   Name: {cv_data.hero.fullName}")
                print(f"   Title: {cv_data.hero.professionalTitle}")
                if cv_data.hero.summaryTagline:
                    print(f"   Tagline: {cv_data.hero.summaryTagline[:80]}...")
            
            # Contact
            if cv_data.contact:
                print(f"\n📞 CONTACT:")
                print(f"   Email: {cv_data.contact.email}")
                print(f"   Phone: {cv_data.contact.phone}")
                if cv_data.contact.location:
                    print(f"   Location: {cv_data.contact.location.city if cv_data.contact.location.city else cv_data.contact.location.country}")
                if cv_data.contact.professionalLinks:
                    for link in cv_data.contact.professionalLinks:
                        if link.platform == "LinkedIn":
                            print(f"   LinkedIn: {link.url}")
            
            # Experience
            if cv_data.experience and cv_data.experience.experienceItems:
                print(f"\n💼 EXPERIENCE ({len(cv_data.experience.experienceItems)} positions):")
                for i, exp in enumerate(cv_data.experience.experienceItems[:2]):  # Show first 2
                    print(f"\n   Position {i+1}:")
                    print(f"   - Role: {exp.jobTitle}")
                    print(f"   - Company: {exp.companyName}")
                    if exp.dateRange:
                        print(f"   - Period: {exp.dateRange.startDate} - {exp.dateRange.endDate}")
                    if exp.responsibilitiesAndAchievements:
                        print(f"   - Responsibilities: {len(exp.responsibilitiesAndAchievements)} items")
                        for resp in exp.responsibilitiesAndAchievements[:2]:
                            print(f"     • {resp[:80]}...")
            
            # Education
            if cv_data.education and cv_data.education.educationItems:
                print(f"\n🎓 EDUCATION ({len(cv_data.education.educationItems)} items):")
                for edu in cv_data.education.educationItems:
                    print(f"   - {edu.degree} in {edu.fieldOfStudy}")
                    print(f"     {edu.institution}")
                    if edu.gpa:
                        print(f"     GPA: {edu.gpa}")
            
            # Skills
            if cv_data.skills:
                print(f"\n🛠️ SKILLS:")
                if cv_data.skills.skillCategories:
                    for cat in cv_data.skills.skillCategories[:3]:  # Show first 3 categories
                        print(f"   - {cat.categoryName}: {', '.join(cat.skills[:5])}")
                        if len(cat.skills) > 5:
                            print(f"     ... and {len(cat.skills) - 5} more")
            
            # Projects
            if cv_data.projects and cv_data.projects.projectItems:
                print(f"\n📁 PROJECTS ({len(cv_data.projects.projectItems)} items):")
                for proj in cv_data.projects.projectItems[:2]:
                    print(f"   - {proj.title}")
                    if proj.description:
                        print(f"     {proj.description[:80]}...")
            
            # Achievements
            if cv_data.achievements and cv_data.achievements.achievements:
                print(f"\n🏆 ACHIEVEMENTS ({len(cv_data.achievements.achievements)} items):")
                for ach in cv_data.achievements.achievements[:3]:
                    print(f"   - {ach.value}: {ach.label}")
            
            # Certifications
            if cv_data.certifications and cv_data.certifications.certificationItems:
                print(f"\n📜 CERTIFICATIONS ({len(cv_data.certifications.certificationItems)} items):")
                for cert in cv_data.certifications.certificationItems:
                    print(f"   - {cert.title}")
                    if cert.issuingOrganization:
                        print(f"     Issued by: {cert.issuingOrganization}")
            
            print("\n" + "="*60)
        
        return result
    
    async def test_multiple_cvs(self, cv_paths: list[Path]):
        """Test multiple CVs and generate summary report"""
        print("\n" + "🚀 " * 40)
        print("STARTING COMPREHENSIVE CV EXTRACTION PIPELINE TEST")
        print("🚀 " * 40)
        
        for cv_path in cv_paths:
            if cv_path.exists():
                result = await self.test_single_cv(cv_path)
                self.test_results.append(result)
            else:
                print(f"\n❌ File not found: {cv_path}")
        
        # Generate summary report
        self.generate_summary_report()
    
    def generate_summary_report(self):
        """Generate comprehensive test summary"""
        print("\n" + "="*80)
        print("📊 TEST SUMMARY REPORT")
        print("="*80)
        
        total_tests = len(self.test_results)
        successful_tests = sum(1 for r in self.test_results if r["success"])
        
        print(f"\nTotal CVs tested: {total_tests}")
        print(f"Successful: {successful_tests}/{total_tests} ({successful_tests/total_tests*100:.1f}%)")
        
        # File type breakdown
        print("\n📁 File Type Breakdown:")
        file_types = {}
        for result in self.test_results:
            ft = result["file_type"]
            if ft not in file_types:
                file_types[ft] = {"total": 0, "success": 0}
            file_types[ft]["total"] += 1
            if result["success"]:
                file_types[ft]["success"] += 1
        
        for ft, stats in file_types.items():
            success_rate = stats["success"] / stats["total"] * 100
            print(f"  {ft}: {stats['success']}/{stats['total']} ({success_rate:.1f}%)")
        
        # Stage success rates
        print("\n🔄 Stage Success Rates:")
        stages = ["text_extraction", "data_extraction", "deduplication", "validation"]
        for stage in stages:
            successes = sum(
                1 for r in self.test_results 
                if r["stages"].get(stage, {}).get("success", False)
            )
            print(f"  {stage}: {successes}/{total_tests} ({successes/total_tests*100:.1f}%)")
        
        # Performance metrics
        print("\n⏱️  Average Processing Times:")
        for metric in ["text_extraction", "data_extraction", "deduplication"]:
            times = [
                r["timing"].get(metric, 0) 
                for r in self.test_results 
                if r["timing"].get(metric)
            ]
            if times:
                avg_time = sum(times) / len(times)
                print(f"  {metric}: {avg_time:.2f}s")
        
        # Common errors
        print("\n❌ Common Errors:")
        all_errors = []
        for result in self.test_results:
            all_errors.extend(result["errors"])
        
        if all_errors:
            from collections import Counter
            error_counts = Counter(all_errors)
            for error, count in error_counts.most_common(5):
                print(f"  {error}: {count} occurrences")
        else:
            print("  No errors encountered!")
        
        print("\n✅ Test suite completed!")


async def main():
    """Run comprehensive CV extraction tests"""
    # Define test CVs
    test_cvs = [
        # PDF files
        Path("data/cv_examples/pdf_examples/pdf/Paris-Resume-Template-Modern.pdf"),
        
        # PNG files - only include the first one, MultiFileHandler will find the second
        Path("data/cv_examples/png_examples/untitled folder 7/Screenshot 2025-06-04 at 1.20.01.png"),
    ]
    
    # Create test instance
    tester = CVExtractionPipelineTest()
    
    # Run tests
    await tester.test_multiple_cvs(test_cvs)
    
    # Show the extracted JSON for verification
    print("\n" + "="*80)
    print("📝 SAMPLE EXTRACTED JSON (first CV):")
    print("="*80)
    
    json_file = Path("test_outputs/comprehensive_all_components_cv_extracted.json")
    if json_file.exists():
        with open(json_file, "r") as f:
            data = json.load(f)
            # Show a subset of the data
            print(json.dumps({
                "hero": data.get("hero"),
                "contact": data.get("contact"),
                "experience_count": len(data.get("experience", {}).get("experienceItems", [])),
                "education_count": len(data.get("education", {}).get("educationItems", [])),
                "skills_count": len(data.get("skills", {}).get("skillCategories", [])),
                "achievements_count": len(data.get("achievements", {}).get("achievements", []))
            }, indent=2))


if __name__ == "__main__":
    asyncio.run(main())