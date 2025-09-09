#!/usr/bin/env python3
"""
Comprehensive Test Runner for Phase 10 - Unit Tests
Runs all unit tests for the refactored CV extraction modules
"""

import unittest
import sys
import time
from pathlib import Path
from io import StringIO

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.append(str(project_root))


def run_test_module(module_name: str, test_file: str) -> dict:
    """
    Run a single test module and return results.
    
    Args:
        module_name: Name of the module being tested
        test_file: Path to the test file
        
    Returns:
        Dictionary with test results
    """
    print(f"\n{'='*60}")
    print(f"Testing {module_name}")
    print(f"{'='*60}")
    
    # Create test suite
    loader = unittest.TestLoader()
    suite = loader.discover(
        start_dir=str(Path(__file__).parent),
        pattern=test_file
    )
    
    # Run tests with custom result tracking
    stream = StringIO()
    runner = unittest.TextTestRunner(stream=stream, verbosity=2)
    
    start_time = time.time()
    result = runner.run(suite)
    elapsed = time.time() - start_time
    
    # Print output
    output = stream.getvalue()
    print(output)
    
    # Compile results
    return {
        'module': module_name,
        'tests_run': result.testsRun,
        'failures': len(result.failures),
        'errors': len(result.errors),
        'skipped': len(result.skipped),
        'success': result.wasSuccessful(),
        'time': elapsed
    }


def print_summary(results: list):
    """Print a summary of all test results."""
    print("\n" + "="*80)
    print("PHASE 10 - UNIT TEST SUMMARY")
    print("="*80)
    
    # Overall stats
    total_tests = sum(r['tests_run'] for r in results)
    total_failures = sum(r['failures'] for r in results)
    total_errors = sum(r['errors'] for r in results)
    total_time = sum(r['time'] for r in results)
    all_passed = all(r['success'] for r in results)
    
    # Module breakdown
    print("\n📊 Module Test Results:")
    print("-" * 60)
    print(f"{'Module':<30} {'Tests':<10} {'Status':<10} {'Time':<10}")
    print("-" * 60)
    
    for result in results:
        status = "✅ PASS" if result['success'] else "❌ FAIL"
        print(f"{result['module']:<30} {result['tests_run']:<10} {status:<10} {result['time']:.2f}s")
    
    print("-" * 60)
    
    # Overall summary
    print(f"\n📈 Overall Statistics:")
    print(f"  Total Tests Run: {total_tests}")
    print(f"  Total Failures: {total_failures}")
    print(f"  Total Errors: {total_errors}")
    print(f"  Total Time: {total_time:.2f}s")
    
    if all_passed:
        print(f"\n✅ ALL TESTS PASSED!")
    else:
        print(f"\n❌ SOME TESTS FAILED")
        print(f"   Failures: {total_failures}")
        print(f"   Errors: {total_errors}")
    
    # Architecture summary
    print("\n🏗️ Refactored Architecture Tested:")
    print("  1. extraction_config.py - Configuration management")
    print("  2. prompt_templates.py - Template generation for 17 sections")
    print("  3. location_processor.py - Location parsing and normalization")
    print("  4. enhancement_processor.py - Data enhancement pipeline")
    print("  5. section_extractor.py - Section extraction logic")
    print("  6. post_processor.py - Post-processing and validation")
    print("  7. llm_service.py - LLM API management")
    print("  8. data_extractor.py - Coordinator orchestration")
    
    # Code metrics
    print("\n📉 Code Metrics:")
    print(f"  Original: 1022 lines (monolithic)")
    print(f"  Refactored: 228 lines (coordinator) + 7 specialized modules")
    print(f"  Reduction: 77.7% in main file")
    print(f"  Architecture: Clean separation of concerns")
    
    return all_passed


def main():
    """Run all unit tests for the refactored modules."""
    print("="*80)
    print("PHASE 10 - COMPREHENSIVE UNIT TESTS")
    print("CV Extraction Refactoring - Testing All Modules")
    print("="*80)
    
    # Define test modules in order of dependency
    test_modules = [
        ("ExtractionConfig", "test_extraction_config.py"),
        ("PromptTemplates", "test_prompt_templates.py"),
        ("LocationProcessor", "test_location_processor.py"),
        ("EnhancementProcessor", "test_enhancement_processor.py"),
        ("SectionExtractor", "test_section_extractor.py"),
        ("PostProcessor", "test_post_processor.py"),
        ("LLMService", "test_llm_service.py"),
        ("DataExtractor", "test_data_extractor.py"),
    ]
    
    results = []
    
    # Run each test module
    for module_name, test_file in test_modules:
        try:
            result = run_test_module(module_name, test_file)
            results.append(result)
        except Exception as e:
            print(f"❌ Failed to run tests for {module_name}: {e}")
            results.append({
                'module': module_name,
                'tests_run': 0,
                'failures': 0,
                'errors': 1,
                'skipped': 0,
                'success': False,
                'time': 0
            })
    
    # Print summary
    all_passed = print_summary(results)
    
    # Final status
    print("\n" + "="*80)
    if all_passed:
        print("✅ PHASE 10 COMPLETE - All unit tests passed!")
        print("The refactored CV extraction system is fully tested and verified.")
    else:
        print("⚠️ PHASE 10 - Some tests failed. Please review the failures above.")
    print("="*80)
    
    # Exit with appropriate code
    sys.exit(0 if all_passed else 1)


if __name__ == "__main__":
    main()