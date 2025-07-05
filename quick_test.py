#!/usr/bin/env python3
import requests
import time

print("🔍 Testing API connection...")

# Test if API is running
try:
    response = requests.get("http://127.0.0.1:2000/health", timeout=2)
    if response.status_code == 200:
        print("✅ API server is running!")
    else:
        print(f"❌ API returned status: {response.status_code}")
except requests.exceptions.ConnectionError:
    print("❌ Cannot connect to API server at http://127.0.0.1:2000")
    print("\nPlease make sure the API server is running:")
    print("1. Open a new terminal")
    print("2. Run: cd /Users/nitzan_shifris/Desktop/CV2WEB-V4")
    print("3. Run: python3 main.py")
    print("4. Wait for: Starting CV2WEB API on 127.0.0.1:2000")
    exit(1)
except Exception as e:
    print(f"❌ Error: {e}")
    exit(1)

# If we get here, API is running
print("\n📤 Now testing registration...")

test_email = f"test_{int(time.time())}@example.com"
auth_data = {
    "email": test_email,
    "password": "testpassword123"
}

try:
    response = requests.post("http://127.0.0.1:2000/api/v1/register", json=auth_data, timeout=5)
    print(f"Response status: {response.status_code}")
    print(f"Response: {response.text[:200]}")
except Exception as e:
    print(f"❌ Registration failed: {e}")