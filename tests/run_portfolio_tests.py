#!/usr/bin/env python3
"""
Test runner for portfolio generator v1.3 tests
Run this script to execute all tests and see results
"""

import subprocess
import sys
import os
from pathlib import Path

def run_tests():
    """Run the portfolio generator tests"""
    print("🧪 Running Portfolio Generator v1.3 Tests...")
    print("=" * 60)
    
    # Get the test file path
    test_file = Path(__file__).parent / "test_portfolio_generator_v1_3.py"
    
    # Check if pytest is installed
    try:
        import pytest
    except ImportError:
        print("❌ pytest not installed. Installing...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "pytest"])
        print("✅ pytest installed successfully")
    
    # Run the tests with verbose output
    result = subprocess.run(
        [sys.executable, "-m", "pytest", str(test_file), "-v", "--tb=short"],
        capture_output=True,
        text=True
    )
    
    print(result.stdout)
    if result.stderr:
        print("Errors:", result.stderr)
    
    # Summary
    print("\n" + "=" * 60)
    if result.returncode == 0:
        print("✅ All tests passed!")
    else:
        print("❌ Some tests failed. Check output above.")
    
    return result.returncode

if __name__ == "__main__":
    exit_code = run_tests()