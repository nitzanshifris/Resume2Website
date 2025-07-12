#!/usr/bin/env python3
"""
Run schema tests and generate report
"""
import subprocess
import sys
from pathlib import Path

def run_tests():
    """Run the schema tests with detailed output"""
    print("🧪 Running Unified Schema Tests...")
    print("=" * 60)
    
    # Run pytest with verbose output
    cmd = [
        sys.executable, 
        "-m", 
        "pytest", 
        "tests/test_unified_schema.py",
        "-v",
        "--tb=short",
        "-x"  # Stop on first failure
    ]
    
    result = subprocess.run(cmd, capture_output=True, text=True)
    
    print(result.stdout)
    if result.stderr:
        print("ERRORS:")
        print(result.stderr)
    
    if result.returncode == 0:
        print("\n✅ All tests passed!")
    else:
        print("\n❌ Some tests failed!")
        
    return result.returncode

if __name__ == "__main__":
    exit_code = run_tests()