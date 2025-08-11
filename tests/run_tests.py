#!/usr/bin/env python3
"""
Quick test runner from root directory
"""
import subprocess
import sys

print("🧪 Running RESUME2WEBSITE Tests\n")

tests = [
    ("Comprehensive Integration Test", "tests/comprehensive_test.py"),
    ("CV Data Extraction", "tests/test_data_extraction.py"),
    ("Error Handling", "tests/test_error_handling.py"),
    ("API Integration", "tests/integration/test_api.py"),
    ("MVP Edge Cases", "tests/integration/test_mvp_edge_cases.py"),
    ("Portfolio Integration", "tests/test_portfolio_integration.py")
]

for name, path in tests:
    print(f"\n{'='*60}")
    print(f"Running {name}...")
    print('='*60)
    
    result = subprocess.run([sys.executable, path])
    
    if result.returncode != 0:
        print(f"❌ {name} failed!")
        break
else:
    print("\n✅ All tests completed!")
    
print("\nTo run individual tests:")
for name, path in tests:
    print(f"  python3 {path}")