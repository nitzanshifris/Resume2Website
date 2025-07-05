#!/usr/bin/env python3
"""
Quick test runner from root directory
"""
import subprocess
import sys

print("🧪 Running CV2WEB Tests\n")

tests = [
    ("Comprehensive Test", "tests/comprehensive_test.py"),
    ("Error Handling", "tests/test_error_handling.py"),
    ("Edge Cases", "tests/test_mvp_edge_cases.py")
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