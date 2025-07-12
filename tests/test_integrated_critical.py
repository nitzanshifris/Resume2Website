#!/usr/bin/env python3
"""
Critical Testing of Integrated Component Selector
Tests the unified system's decision making and edge cases
"""
import asyncio
import logging
import time
import json
from pathlib import Path
from typing import Dict, Any, List

from backend.schemas.unified import (
    CVData, HeroSection, ExperienceSection, ExperienceItem,
    EducationSection, EducationItem, SkillsSection, SkillCategory,
    ProjectsSection, ProjectItem, LanguagesSection, LanguageItem,
    CertificationsSection, CertificationItem,
    PublicationsResearchSection, PublicationItem,
    SpeakingEngagementsSection, SpeakingEngagementItem,
    PatentsSection, PatentItem, ContactSectionFooter
)
from services.portfolio.component_selector import ComponentSelector, component_selector
from services.local.text_extractor import text_extractor
from services.llm.data_extractor import data_extractor

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class IntegratedSelectorTester:
    """Performs critical tests on the integrated component selector"""
    
    def __init__(self):
        self.results = {
            "decision_accuracy": [],
            "performance_metrics": {},
            "edge_cases": [],
            "consistency_checks": []
        }
    
    async def run_all_tests(self):
        """Run comprehensive critical tests"""
        logger.info("="*60)
        logger.info("🔥 CRITICAL TESTING OF INTEGRATED SELECTOR")
        logger.info("="*60)
        
        # Test 1: Decision Boundary Testing
        await self._test_decision_boundaries()
        
        # Test 2: Performance Comparison
        await self._test_performance_comparison()
        
        # Test 3: Consistency Testing
        await self._test_consistency()
        
        # Test 4: Edge Case Handling
        await self._test_edge_cases()
        
        # Test 5: Real CV Testing
        await self._test_real_cvs()
        
        # Test 6: Configuration Testing
        await self._test_configuration_options()
        
        # Test 7: Smart Analysis Trigger Accuracy
        await self._test_smart_trigger_accuracy()
        
        # Generate report
        self._generate_report()
    
    async def _test_decision_boundaries(self):
        """Test 1: Test decision boundaries (6, 7, 8 sections)"""
        logger.info("\n🧪 Test 1: Decision Boundary Testing")
        
        test_cases = [
            (5, "Should use basic"),
            (6, "Should use basic"),
            (7, "Should use smart"),
            (8, "Should use smart"),
            (12, "Should use smart (rich)"),
        ]
        
        for section_count, expected in test_cases:
            cv = self._create_cv_with_sections(section_count)
            
            # Capture logs to detect which path was taken
            import io
            import contextlib
            
            f = io.StringIO()
            with contextlib.redirect_stderr(f):
                with self.capture_logs() as log_capture:
                    selections = component_selector.select_components(cv)
                    logs = log_capture.getvalue()
            
            # Check if smart analysis was triggered
            smart_triggered = "smart component analysis" in logs.lower() or "smart analysis recommended" in logs.lower()
            
            if section_count >= 7:
                expected_smart = True
            else:
                expected_smart = False
            
            result = {
                "sections": section_count,
                "expected_smart": expected_smart,
                "actual_smart": smart_triggered,
                "correct": smart_triggered == expected_smart,
                "components_selected": len(selections)
            }
            
            self.results["decision_accuracy"].append(result)
            
            status = "✅" if result["correct"] else "❌"
            logger.info(f"  {status} {section_count} sections: Smart={smart_triggered} (expected {expected_smart})")
    
    async def _test_performance_comparison(self):
        """Test 2: Compare performance between basic and smart selection"""
        logger.info("\n🧪 Test 2: Performance Comparison")
        
        # Create CVs of different complexities
        test_cvs = {
            "simple": self._create_cv_with_sections(4),
            "medium": self._create_cv_with_sections(6),
            "rich": self._create_cv_with_sections(10),
            "extreme": self._create_cv_with_sections(15)
        }
        
        for cv_type, cv_data in test_cvs.items():
            # Test with smart analysis disabled
            basic_selector = ComponentSelector(enable_smart_analysis=False)
            start = time.time()
            basic_selections = basic_selector.select_components(cv_data)
            basic_time = time.time() - start
            
            # Test with smart analysis enabled
            smart_selector = ComponentSelector(enable_smart_analysis=True)
            start = time.time()
            smart_selections = smart_selector.select_components(cv_data)
            smart_time = time.time() - start
            
            self.results["performance_metrics"][cv_type] = {
                "basic_time": basic_time,
                "smart_time": smart_time,
                "overhead": smart_time - basic_time,
                "basic_components": len(basic_selections),
                "smart_components": len(smart_selections)
            }
            
            logger.info(f"  {cv_type}: Basic={basic_time:.4f}s, Smart={smart_time:.4f}s, Overhead={smart_time-basic_time:.4f}s")
    
    async def _test_consistency(self):
        """Test 3: Ensure consistent results for same input"""
        logger.info("\n🧪 Test 3: Consistency Testing")
        
        cv_data = self._create_cv_with_sections(8)  # Should trigger smart
        
        results = []
        for i in range(5):
            selections = component_selector.select_components(cv_data)
            results.append({
                "run": i + 1,
                "count": len(selections),
                "components": [s.component_type for s in selections]
            })
        
        # Check consistency
        first_components = results[0]["components"]
        all_consistent = all(r["components"] == first_components for r in results)
        
        self.results["consistency_checks"].append({
            "test": "multiple_runs",
            "consistent": all_consistent,
            "runs": len(results)
        })
        
        status = "✅" if all_consistent else "❌"
        logger.info(f"  {status} Consistency across 5 runs: {all_consistent}")
    
    async def _test_edge_cases(self):
        """Test 4: Test edge cases and error conditions"""
        logger.info("\n🧪 Test 4: Edge Case Testing")
        
        edge_cases = [
            ("Empty CV", CVData()),
            ("Only Hero", self._create_hero_only_cv()),
            ("Complex GENERAL archetype", self._create_general_archetype_cv()),
            ("Exactly 7 sections sparse", self._create_sparse_cv_with_sections(7)),
            ("6 sections but complex", self._create_complex_cv_with_sections(6))
        ]
        
        for case_name, cv_data in edge_cases:
            try:
                with self.capture_logs() as log_capture:
                    selections = component_selector.select_components(cv_data)
                    logs = log_capture.getvalue()
                
                smart_triggered = "smart component analysis" in logs.lower() or "smart analysis recommended" in logs.lower()
                
                self.results["edge_cases"].append({
                    "case": case_name,
                    "success": True,
                    "components": len(selections),
                    "smart_triggered": smart_triggered,
                    "error": None
                })
                
                logger.info(f"  ✅ {case_name}: {len(selections)} components, Smart={smart_triggered}")
                
            except Exception as e:
                self.results["edge_cases"].append({
                    "case": case_name,
                    "success": False,
                    "error": str(e)
                })
                logger.error(f"  ❌ {case_name}: {e}")
    
    async def _test_real_cvs(self):
        """Test 5: Test with real CV files"""
        logger.info("\n🧪 Test 5: Real CV Testing")
        
        cv_dir = Path("data/cv_examples/pdf_examples/pdf")
        if not cv_dir.exists():
            logger.warning("  ⚠️  CV directory not found")
            return
        
        cv_files = list(cv_dir.glob("*.pdf"))[:3]  # Test first 3
        
        for cv_path in cv_files:
            try:
                # Extract and parse
                text = text_extractor.extract_text(cv_path)
                cv_data = await data_extractor.extract_cv_data(text)
                
                # Count sections
                section_count = sum(1 for field, value in cv_data.model_dump().items() 
                                  if value and field != 'metadata')
                
                # Test selection
                with self.capture_logs() as log_capture:
                    selections = component_selector.select_components(cv_data)
                    logs = log_capture.getvalue()
                
                smart_triggered = "smart component analysis" in logs.lower() or "smart analysis recommended" in logs.lower()
                
                logger.info(f"  {cv_path.name}: {section_count} sections, {len(selections)} components, Smart={smart_triggered}")
                
            except Exception as e:
                logger.error(f"  ❌ {cv_path.name}: {e}")
    
    async def _test_configuration_options(self):
        """Test 6: Test configuration options"""
        logger.info("\n🧪 Test 6: Configuration Testing")
        
        cv_data = self._create_cv_with_sections(8)
        
        # Test with smart disabled
        basic_only = ComponentSelector(enable_smart_analysis=False)
        with self.capture_logs() as log_capture:
            basic_selections = basic_only.select_components(cv_data)
            basic_logs = log_capture.getvalue()
        
        # Test with smart enabled
        smart_enabled = ComponentSelector(enable_smart_analysis=True)
        with self.capture_logs() as log_capture:
            smart_selections = smart_enabled.select_components(cv_data)
            smart_logs = log_capture.getvalue()
        
        basic_used_smart = "smart component analysis" in basic_logs.lower()
        smart_used_smart = "smart component analysis" in smart_logs.lower()
        
        logger.info(f"  Basic only: Used smart = {basic_used_smart} (should be False)")
        logger.info(f"  Smart enabled: Used smart = {smart_used_smart} (should be True)")
        
        config_correct = not basic_used_smart and smart_used_smart
        status = "✅" if config_correct else "❌"
        logger.info(f"  {status} Configuration respected: {config_correct}")
    
    async def _test_smart_trigger_accuracy(self):
        """Test 7: Test smart analysis trigger accuracy"""
        logger.info("\n🧪 Test 7: Smart Analysis Trigger Accuracy")
        
        # Test complex content trigger
        cv_complex = self._create_cv_with_sections(5)  # Below threshold
        # Add complex content
        cv_complex.experience = ExperienceSection(experienceItems=[
            ExperienceItem(companyName=f"Company {i}", jobTitle=f"Role {i}",
                         responsibilitiesAndAchievements=[f"Task {j}" for j in range(5)])
            for i in range(5)
        ])
        cv_complex.skills = SkillsSection(skillCategories=[
            SkillCategory(categoryName=f"Category {i}", skills=[f"Skill {j}" for j in range(10)])
            for i in range(4)
        ])
        
        with self.capture_logs() as log_capture:
            selections = component_selector.select_components(cv_complex)
            logs = log_capture.getvalue()
        
        smart_triggered = "smart component analysis" in logs.lower() or "smart analysis recommended" in logs.lower()
        
        logger.info(f"  Complex content (5 sections): Smart triggered = {smart_triggered} (should be True)")
        
        # Test GENERAL archetype trigger
        cv_general = self._create_general_archetype_cv()
        with self.capture_logs() as log_capture:
            selections = component_selector.select_components(cv_general)
            logs = log_capture.getvalue()
        
        general_smart = "smart component analysis" in logs.lower() or "smart analysis recommended" in logs.lower()
        
        logger.info(f"  GENERAL archetype: Smart triggered = {general_smart} (should be True)")
    
    # Helper methods
    def _create_cv_with_sections(self, count: int) -> CVData:
        """Create CV with specific number of sections"""
        cv = CVData()
        cv.hero = HeroSection(fullName=f"Test User {count}", professionalTitle="Tester")
        
        sections = [
            ("experience", lambda: ExperienceSection(experienceItems=[
                ExperienceItem(companyName="Company", jobTitle="Role")
            ])),
            ("education", lambda: EducationSection(educationItems=[
                EducationItem(institution="School", degree="Degree")
            ])),
            ("skills", lambda: SkillsSection(skillCategories=[
                SkillCategory(categoryName="Tech", skills=["Python", "JS"])
            ])),
            ("projects", lambda: ProjectsSection(projectItems=[
                ProjectItem(title="Project", description="Desc")
            ])),
            ("certifications", lambda: CertificationsSection(certificationItems=[
                CertificationItem(title="Cert", issuingOrganization="Org")
            ])),
            ("languages", lambda: LanguagesSection(languageItems=[
                LanguageItem(language="English", proficiency="Native")
            ])),
            ("publications", lambda: PublicationsResearchSection(publicationItems=[
                PublicationItem(title="Paper", publicationType="Journal")
            ])),
            ("speaking", lambda: SpeakingEngagementsSection(speakingEngagements=[
                SpeakingEngagementItem(eventName="Conference", topic="AI")
            ])),
            ("patents", lambda: PatentsSection(patents=[
                PatentItem(title="Innovation", status="Granted")
            ])),
        ]
        
        # Add sections up to count - 1 (hero is always present)
        for i, (name, creator) in enumerate(sections[:count-1]):
            setattr(cv, name, creator())
        
        return cv
    
    def _create_hero_only_cv(self) -> CVData:
        """Create CV with only hero section"""
        cv = CVData()
        cv.hero = HeroSection(fullName="Minimal User", professionalTitle="Basic")
        return cv
    
    def _create_general_archetype_cv(self) -> CVData:
        """Create CV that should be detected as GENERAL archetype"""
        cv = CVData()
        cv.hero = HeroSection(fullName="Jack of All", professionalTitle="Professional")
        cv.skills = SkillsSection(skillCategories=[
            SkillCategory(categoryName="Mixed", skills=["Excel", "Python", "Photoshop", "Management"])
        ])
        return cv
    
    def _create_sparse_cv_with_sections(self, count: int) -> CVData:
        """Create CV with many sections but sparse content"""
        cv = self._create_cv_with_sections(count)
        # All sections have minimal content
        return cv
    
    def _create_complex_cv_with_sections(self, count: int) -> CVData:
        """Create CV with few sections but complex content"""
        cv = CVData()
        cv.hero = HeroSection(fullName="Complex User", professionalTitle="Expert")
        
        # Add fewer sections but with rich content
        cv.experience = ExperienceSection(experienceItems=[
            ExperienceItem(
                companyName=f"Company {i}", 
                jobTitle=f"Senior Role {i}",
                responsibilitiesAndAchievements=[f"Achievement {j}" for j in range(5)]
            ) for i in range(5)
        ])
        
        cv.skills = SkillsSection(skillCategories=[
            SkillCategory(categoryName=f"Category {i}", skills=[f"Skill {j}" for j in range(8)])
            for i in range(4)
        ])
        
        cv.projects = ProjectsSection(projectItems=[
            ProjectItem(title=f"Project {i}", description=f"Complex project with many details")
            for i in range(4)
        ])
        
        return cv
    
    def capture_logs(self):
        """Context manager to capture log output"""
        import io
        import contextlib
        
        class LogCapture:
            def __init__(self):
                self.buffer = io.StringIO()
                self.handler = logging.StreamHandler(self.buffer)
                self.handler.setLevel(logging.DEBUG)
                
            def __enter__(self):
                logging.getLogger().addHandler(self.handler)
                return self
                
            def __exit__(self, *args):
                logging.getLogger().removeHandler(self.handler)
                
            def getvalue(self):
                return self.buffer.getvalue()
        
        return LogCapture()
    
    def _generate_report(self):
        """Generate comprehensive test report"""
        logger.info("\n" + "="*60)
        logger.info("📊 CRITICAL TEST REPORT")
        logger.info("="*60)
        
        # Decision accuracy
        logger.info("\n🎯 Decision Accuracy:")
        correct = sum(1 for r in self.results["decision_accuracy"] if r["correct"])
        total = len(self.results["decision_accuracy"])
        accuracy = (correct / total * 100) if total > 0 else 0
        logger.info(f"  Accuracy: {accuracy:.1f}% ({correct}/{total} correct)")
        
        for result in self.results["decision_accuracy"]:
            status = "✅" if result["correct"] else "❌"
            logger.info(f"  {status} {result['sections']} sections: Smart={result['actual_smart']}")
        
        # Performance metrics
        logger.info("\n⚡ Performance Metrics:")
        for cv_type, metrics in self.results["performance_metrics"].items():
            logger.info(f"  {cv_type}:")
            logger.info(f"    Basic: {metrics['basic_time']:.4f}s")
            logger.info(f"    Smart: {metrics['smart_time']:.4f}s")
            logger.info(f"    Overhead: {metrics['overhead']:.4f}s")
        
        # Edge cases
        logger.info("\n🔧 Edge Cases:")
        edge_success = sum(1 for r in self.results["edge_cases"] if r["success"])
        edge_total = len(self.results["edge_cases"])
        logger.info(f"  Success rate: {edge_success}/{edge_total}")
        
        # Consistency
        logger.info("\n🔄 Consistency:")
        consistent = all(r["consistent"] for r in self.results["consistency_checks"])
        logger.info(f"  All tests consistent: {consistent}")
        
        # Save detailed results
        output_file = Path("test_outputs/integrated_selector_critical_results.json")
        output_file.parent.mkdir(exist_ok=True)
        
        with open(output_file, 'w') as f:
            json.dump(self.results, f, indent=2, default=str)
        
        logger.info(f"\n📝 Detailed results saved to: {output_file}")
        
        # Overall assessment
        overall_pass = accuracy >= 90 and consistent and edge_success == edge_total
        if overall_pass:
            logger.info("\n✅ INTEGRATED SELECTOR PASSED ALL CRITICAL TESTS")
        else:
            logger.error("\n❌ INTEGRATED SELECTOR FAILED SOME TESTS")

async def main():
    tester = IntegratedSelectorTester()
    await tester.run_all_tests()

if __name__ == "__main__":
    asyncio.run(main())