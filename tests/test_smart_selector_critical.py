#!/usr/bin/env python3
"""
Critical Testing of Smart Component Selector
Tests edge cases, error conditions, and performance limits
"""
import asyncio
import logging
import time
import json
from pathlib import Path
from typing import Dict, Any

from backend.schemas.unified import (
    CVData, HeroSection, ExperienceSection, ExperienceItem,
    EducationSection, EducationItem, SkillsSection, SkillCategory,
    ProjectsSection, ProjectItem, LanguagesSection, LanguageItem,
    CertificationsSection, CertificationItem, ContactSectionFooter,
    DateRange
)
from services.portfolio.smart_component_selector import smart_component_selector

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class CriticalTester:
    """Performs critical tests on the smart component selector"""
    
    def __init__(self):
        self.results = {
            "passed": [],
            "failed": [],
            "warnings": [],
            "performance": {}
        }
    
    async def run_all_tests(self):
        """Run all critical tests"""
        logger.info("="*60)
        logger.info("🔥 CRITICAL TESTING OF SMART COMPONENT SELECTOR")
        logger.info("="*60)
        
        # Test 1: Null/Empty Data
        await self._test_null_empty_data()
        
        # Test 2: Malformed Data
        await self._test_malformed_data()
        
        # Test 3: Extreme Data Volumes
        await self._test_extreme_volumes()
        
        # Test 4: Missing Attributes
        await self._test_missing_attributes()
        
        # Test 5: Performance Under Load
        await self._test_performance()
        
        # Test 6: Edge Case Scores
        await self._test_edge_case_scores()
        
        # Test 7: Component Variant Fallbacks
        await self._test_component_variants()
        
        # Test 8: Merge Logic Edge Cases
        await self._test_merge_logic()
        
        # Test 9: Layout Density Boundaries
        await self._test_layout_boundaries()
        
        # Test 10: Integration Stress Test
        await self._test_integration_stress()
        
        # Report results
        self._report_results()
    
    async def _test_null_empty_data(self):
        """Test 1: How does it handle null/empty data?"""
        logger.info("\n🧪 Test 1: Null/Empty Data Handling")
        
        test_cases = [
            ("Completely None CV", None),
            ("Empty CV object", CVData()),
            ("CV with all None sections", self._create_cv_with_none_sections()),
            ("CV with empty lists", self._create_cv_with_empty_lists())
        ]
        
        for test_name, cv_data in test_cases:
            try:
                start = time.time()
                selections = smart_component_selector.select_components(cv_data)
                elapsed = time.time() - start
                
                if cv_data is None and len(selections) == 0:
                    self.results["passed"].append(f"{test_name}: Correctly returned empty list")
                elif cv_data and len(selections) >= 0:
                    self.results["passed"].append(f"{test_name}: Handled gracefully ({len(selections)} components)")
                else:
                    self.results["failed"].append(f"{test_name}: Unexpected result")
                
                logger.info(f"  ✓ {test_name}: {len(selections)} components in {elapsed:.3f}s")
            except Exception as e:
                self.results["failed"].append(f"{test_name}: Crashed with {type(e).__name__}: {e}")
                logger.error(f"  ✗ {test_name}: {e}")
    
    async def _test_malformed_data(self):
        """Test 2: How does it handle malformed data structures?"""
        logger.info("\n🧪 Test 2: Malformed Data Structures")
        
        # Create CV with wrong data types
        malformed_cv = CVData()
        malformed_cv.hero = HeroSection(fullName="Test User", professionalTitle="Developer")
        
        # Intentionally malform data
        malformed_cv.experience = "This should be ExperienceSection object"  # Wrong type
        malformed_cv.skills = {"wrong": "structure"}  # Wrong type
        
        try:
            selections = smart_component_selector.select_components(malformed_cv)
            self.results["passed"].append("Malformed data: Handled without crash")
            logger.info(f"  ✓ Malformed data handled: {len(selections)} components")
        except Exception as e:
            self.results["failed"].append(f"Malformed data: Crashed with {e}")
            logger.error(f"  ✗ Malformed data crashed: {e}")
    
    async def _test_extreme_volumes(self):
        """Test 3: How does it handle extreme data volumes?"""
        logger.info("\n🧪 Test 3: Extreme Data Volumes")
        
        # Create CV with 100+ experiences
        extreme_cv = self._create_extreme_cv(
            experiences=100,
            skills=500,
            projects=50,
            languages=20,
            certifications=30
        )
        
        try:
            start = time.time()
            selections = smart_component_selector.select_components(extreme_cv)
            elapsed = time.time() - start
            
            self.results["performance"]["extreme_volume"] = elapsed
            
            if elapsed < 1.0:  # Should complete in under 1 second
                self.results["passed"].append(f"Extreme volume: Completed in {elapsed:.3f}s")
            else:
                self.results["warnings"].append(f"Extreme volume: Slow performance {elapsed:.3f}s")
            
            logger.info(f"  ✓ Extreme volume: {len(selections)} components in {elapsed:.3f}s")
            
            # Check layout recommendation
            recommendations = smart_component_selector.get_layout_recommendations(selections)
            if recommendations["layout_type"] == "rich":
                self.results["passed"].append("Extreme volume: Correctly identified as 'rich' layout")
            else:
                self.results["failed"].append(f"Extreme volume: Wrong layout type '{recommendations['layout_type']}'")
                
        except Exception as e:
            self.results["failed"].append(f"Extreme volume: Crashed with {e}")
            logger.error(f"  ✗ Extreme volume crashed: {e}")
    
    async def _test_missing_attributes(self):
        """Test 4: How does it handle missing expected attributes?"""
        logger.info("\n🧪 Test 4: Missing Attributes")
        
        # Create experience without expected attributes
        broken_cv = CVData()
        broken_cv.hero = HeroSection(fullName="Test", professionalTitle="Dev")
        
        # Experience with missing attributes
        broken_experience = ExperienceSection(experienceItems=[
            ExperienceItem(
                companyName="Company",
                jobTitle="Title"
                # Missing: responsibilitiesAndAchievements, dateRange, etc.
            )
        ])
        broken_cv.experience = broken_experience
        
        try:
            selections = smart_component_selector.select_components(broken_cv)
            self.results["passed"].append("Missing attributes: Handled gracefully")
            logger.info(f"  ✓ Missing attributes handled: {len(selections)} components")
        except Exception as e:
            self.results["failed"].append(f"Missing attributes: Crashed with {e}")
            logger.error(f"  ✗ Missing attributes crashed: {e}")
    
    async def _test_performance(self):
        """Test 5: Performance under various loads"""
        logger.info("\n🧪 Test 5: Performance Testing")
        
        test_sizes = [5, 10, 20, 50, 100]
        
        for size in test_sizes:
            cv = self._create_sized_cv(size)
            
            start = time.time()
            selections = smart_component_selector.select_components(cv)
            elapsed = time.time() - start
            
            self.results["performance"][f"sections_{size}"] = elapsed
            logger.info(f"  {size} sections: {elapsed:.3f}s ({len(selections)} components)")
            
            # Performance should scale linearly
            if elapsed > size * 0.01:  # 10ms per section max
                self.results["warnings"].append(f"Performance: Slow for {size} sections ({elapsed:.3f}s)")
    
    async def _test_edge_case_scores(self):
        """Test 6: Edge cases in richness scoring"""
        logger.info("\n🧪 Test 6: Edge Case Richness Scores")
        
        # Test with exactly threshold values
        edge_cv = CVData()
        edge_cv.hero = HeroSection(fullName="Edge Case", professionalTitle="Tester")
        
        # Exactly 3 languages (threshold for merge)
        edge_cv.languages = LanguagesSection(languageItems=[
            LanguageItem(language=f"Language{i}", proficiency="Native")
            for i in range(3)
        ])
        
        # Exactly 2 certifications (threshold for merge)
        edge_cv.certifications = CertificationsSection(certificationItems=[
            CertificationItem(title=f"Cert{i}", issuingOrganization="Org")
            for i in range(2)
        ])
        
        selections = smart_component_selector.select_components(edge_cv)
        recommendations = smart_component_selector.get_layout_recommendations(selections)
        
        # Check merge suggestions
        merge_count = len(recommendations["merge_suggestions"])
        logger.info(f"  Edge thresholds: {merge_count} merge suggestions")
        
        if merge_count > 0:
            self.results["warnings"].append("Edge thresholds: Suggested merges at exact thresholds")
        else:
            self.results["passed"].append("Edge thresholds: No merges at thresholds")
    
    async def _test_component_variants(self):
        """Test 7: Component variant selection and fallbacks"""
        logger.info("\n🧪 Test 7: Component Variant Selection")
        
        # Create CVs that should trigger different variants
        sparse_cv = self._create_sized_cv(3)  # Should get premium variants
        dense_cv = self._create_sized_cv(15)  # Should get compact variants
        
        sparse_selections = smart_component_selector.select_components(sparse_cv)
        dense_selections = smart_component_selector.select_components(dense_cv)
        
        # Check if variants are different
        sparse_components = {s.component_type for s in sparse_selections}
        dense_components = {s.component_type for s in dense_selections}
        
        logger.info(f"  Sparse CV components: {sparse_components}")
        logger.info(f"  Dense CV components: {dense_components}")
        
        if sparse_components != dense_components:
            self.results["passed"].append("Component variants: Different variants for different densities")
        else:
            self.results["warnings"].append("Component variants: Same components for different densities")
    
    async def _test_merge_logic(self):
        """Test 8: Merge suggestion logic edge cases"""
        logger.info("\n🧪 Test 8: Merge Logic Edge Cases")
        
        # Test when target section doesn't exist
        cv = CVData()
        cv.hero = HeroSection(fullName="Test", professionalTitle="Dev")
        cv.languages = LanguagesSection(languageItems=[
            LanguageItem(language="English", proficiency="Native")
        ])
        # No skills section - should not suggest merge
        
        selections = smart_component_selector.select_components(cv)
        recommendations = smart_component_selector.get_layout_recommendations(selections)
        
        language_merge = any(
            s["source"] == "languages" 
            for s in recommendations["merge_suggestions"]
        )
        
        if language_merge:
            self.results["failed"].append("Merge logic: Suggested merge to non-existent section")
        else:
            self.results["passed"].append("Merge logic: Correctly avoided merge to missing section")
    
    async def _test_layout_boundaries(self):
        """Test 9: Layout density boundary conditions"""
        logger.info("\n🧪 Test 9: Layout Density Boundaries")
        
        boundary_tests = [
            (5, "sparse"),    # Exactly at boundary
            (6, "balanced"),  # Just over sparse
            (9, "balanced"),  # Just under dense
            (10, "dense"),    # Exactly at dense boundary
            (14, "dense"),    # Just under rich
            (15, "rich")      # Exactly at rich boundary
        ]
        
        for section_count, expected_layout in boundary_tests:
            cv = self._create_sized_cv(section_count)
            selections = smart_component_selector.select_components(cv)
            recommendations = smart_component_selector.get_layout_recommendations(selections)
            
            actual_layout = recommendations["layout_type"]
            if actual_layout == expected_layout:
                self.results["passed"].append(f"Layout boundary {section_count}: Correct ({expected_layout})")
            else:
                self.results["failed"].append(f"Layout boundary {section_count}: Expected {expected_layout}, got {actual_layout}")
            
            logger.info(f"  {section_count} sections: {actual_layout} (expected {expected_layout})")
    
    async def _test_integration_stress(self):
        """Test 10: Integration stress test with rapid calls"""
        logger.info("\n🧪 Test 10: Integration Stress Test")
        
        cv = self._create_sized_cv(10)
        
        # Make 100 rapid calls
        start = time.time()
        for i in range(100):
            selections = smart_component_selector.select_components(cv)
            if i == 0:
                first_count = len(selections)
            elif len(selections) != first_count:
                self.results["failed"].append(f"Integration stress: Inconsistent results on call {i}")
                break
        
        elapsed = time.time() - start
        avg_time = elapsed / 100
        
        logger.info(f"  100 calls completed in {elapsed:.3f}s (avg {avg_time:.4f}s)")
        
        if avg_time < 0.1:  # Should average under 100ms
            self.results["passed"].append(f"Integration stress: Good performance ({avg_time:.4f}s avg)")
        else:
            self.results["warnings"].append(f"Integration stress: Slow performance ({avg_time:.4f}s avg)")
    
    # Helper methods
    def _create_cv_with_none_sections(self) -> CVData:
        """Create CV with all sections set to None"""
        cv = CVData()
        cv.hero = HeroSection(fullName="None Test", professionalTitle="Tester")
        cv.experience = None
        cv.education = None
        cv.skills = None
        cv.projects = None
        return cv
    
    def _create_cv_with_empty_lists(self) -> CVData:
        """Create CV with empty lists in all sections"""
        cv = CVData()
        cv.hero = HeroSection(fullName="Empty Test", professionalTitle="Tester")
        cv.experience = ExperienceSection(experienceItems=[])
        cv.education = EducationSection(educationItems=[])
        cv.skills = SkillsSection(skillCategories=[])
        cv.projects = ProjectsSection(projectItems=[])
        return cv
    
    def _create_extreme_cv(self, **kwargs) -> CVData:
        """Create CV with extreme amounts of data"""
        cv = CVData()
        cv.hero = HeroSection(fullName="Extreme Test", professionalTitle="Overachiever")
        
        # Add extreme experiences
        if "experiences" in kwargs:
            cv.experience = ExperienceSection(experienceItems=[
                ExperienceItem(
                    companyName=f"Company {i}",
                    jobTitle=f"Position {i}",
                    responsibilitiesAndAchievements=[f"Task {j}" for j in range(5)]
                ) for i in range(kwargs["experiences"])
            ])
        
        # Add extreme skills
        if "skills" in kwargs:
            cv.skills = SkillsSection(skillCategories=[
                SkillCategory(
                    categoryName=f"Category {i}",
                    skills=[f"Skill {j}" for j in range(20)]
                ) for i in range(kwargs["skills"] // 20)
            ])
        
        return cv
    
    def _create_sized_cv(self, section_count: int) -> CVData:
        """Create CV with specific number of sections"""
        cv = CVData()
        cv.hero = HeroSection(fullName=f"Test {section_count}", professionalTitle="Tester")
        
        sections = [
            "experience", "education", "skills", "projects", "achievements",
            "certifications", "languages", "volunteer", "courses", "hobbies",
            "publications", "speaking", "patents", "memberships", "contact"
        ]
        
        for i, section in enumerate(sections[:section_count-1]):  # -1 for hero
            if section == "experience":
                cv.experience = ExperienceSection(experienceItems=[
                    ExperienceItem(companyName="Company", jobTitle="Title")
                ])
            elif section == "education":
                cv.education = EducationSection(educationItems=[
                    EducationItem(institution="School", degree="Degree")
                ])
            elif section == "skills":
                cv.skills = SkillsSection(skillCategories=[
                    SkillCategory(categoryName="Tech", skills=["Python", "JS"])
                ])
            elif section == "projects":
                cv.projects = ProjectsSection(projectItems=[
                    ProjectItem(title="Project 1", description="Test")
                ])
            elif section == "languages":
                cv.languages = LanguagesSection(languageItems=[
                    LanguageItem(language="English", proficiency="Native")
                ])
            elif section == "certifications":
                cv.certifications = CertificationsSection(certificationItems=[
                    CertificationItem(title="Cert 1", issuingOrganization="Org")
                ])
            # Add more sections as needed
        
        return cv
    
    def _report_results(self):
        """Generate final test report"""
        logger.info("\n" + "="*60)
        logger.info("📊 CRITICAL TEST RESULTS")
        logger.info("="*60)
        
        total_tests = len(self.results["passed"]) + len(self.results["failed"])
        pass_rate = len(self.results["passed"]) / total_tests * 100 if total_tests > 0 else 0
        
        logger.info(f"\n✅ Passed: {len(self.results['passed'])}")
        for test in self.results["passed"][:5]:  # Show first 5
            logger.info(f"  • {test}")
        if len(self.results["passed"]) > 5:
            logger.info(f"  ... and {len(self.results['passed']) - 5} more")
        
        logger.info(f"\n❌ Failed: {len(self.results['failed'])}")
        for test in self.results["failed"]:
            logger.error(f"  • {test}")
        
        logger.info(f"\n⚠️  Warnings: {len(self.results['warnings'])}")
        for warning in self.results["warnings"]:
            logger.warning(f"  • {warning}")
        
        logger.info(f"\n📈 Performance Metrics:")
        for metric, value in self.results["performance"].items():
            logger.info(f"  • {metric}: {value:.3f}s")
        
        logger.info(f"\n🎯 Overall Pass Rate: {pass_rate:.1f}%")
        
        # Save detailed results
        output_file = Path("test_outputs/smart_selector_critical_results.json")
        output_file.parent.mkdir(exist_ok=True)
        
        with open(output_file, 'w') as f:
            json.dump(self.results, f, indent=2)
        
        logger.info(f"\n📝 Detailed results saved to: {output_file}")
        
        # Determine overall status
        if len(self.results["failed"]) == 0:
            logger.info("\n✨ ALL CRITICAL TESTS PASSED!")
        else:
            logger.error(f"\n⚠️  {len(self.results['failed'])} CRITICAL TESTS FAILED!")

async def main():
    tester = CriticalTester()
    await tester.run_all_tests()

if __name__ == "__main__":
    asyncio.run(main())