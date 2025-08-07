#!/usr/bin/env python3
"""
Run all unit tests for CV processing system
"""
import sys
import os
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))


def run_tests_with_pytest():
    """Run tests using pytest if available"""
    try:
        import pytest
        
        print("Running unit tests with pytest...")
        print("=" * 60)
        
        # Run all tests in unit directory
        exit_code = pytest.main([
            str(Path(__file__).parent),  # unit directory
            "-v",  # Verbose
            "--tb=short",  # Short traceback
            "-x",  # Stop on first failure
        ])
        
        return exit_code == 0
        
    except ImportError:
        return None


def run_tests_manually():
    """Run tests manually without pytest"""
    print("Running unit tests manually (install pytest for better output)")
    print("=" * 60)
    
    # Import test modules
    from test_cv_helpers import TestValidateFilename, TestGetFileExtension, TestGetMimeType
    from test_cv_auth import TestPasswordHashing
    
    test_classes = [
        TestValidateFilename(),
        TestGetFileExtension(), 
        TestGetMimeType(),
        TestPasswordHashing()
    ]
    
    total_tests = 0
    passed_tests = 0
    failed_tests = []
    
    for test_class in test_classes:
        class_name = test_class.__class__.__name__
        print(f"\n{class_name}:")
        
        # Get all test methods
        test_methods = [method for method in dir(test_class) if method.startswith("test_")]
        
        for method_name in test_methods:
            total_tests += 1
            try:
                method = getattr(test_class, method_name)
                method()
                print(f"  ✅ {method_name}")
                passed_tests += 1
            except AssertionError as e:
                print(f"  ❌ {method_name}: {e}")
                failed_tests.append(f"{class_name}.{method_name}")
            except Exception as e:
                print(f"  ❌ {method_name}: Unexpected error: {e}")
                failed_tests.append(f"{class_name}.{method_name}")
    
    # Summary
    print("\n" + "=" * 60)
    print(f"Test Summary: {passed_tests}/{total_tests} passed")
    
    if failed_tests:
        print(f"\n❌ {len(failed_tests)} tests failed:")
        for test in failed_tests:
            print(f"  - {test}")
        return False
    else:
        print("\n✅ All tests passed!")
        return True


def main():
    """Main test runner"""
    print("CV Processing Unit Tests")
    print("========================")
    
    # Try pytest first
    result = run_tests_with_pytest()
    
    if result is None:
        # Fallback to manual
        result = run_tests_manually()
    
    # Exit with appropriate code
    sys.exit(0 if result else 1)


if __name__ == "__main__":
    main()