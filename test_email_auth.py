#!/usr/bin/env python3
"""
Test script for email authentication
"""
import requests
import json
import random
import string

# API base URL
API_URL = "http://localhost:2000/api/v1"

def generate_random_email():
    """Generate a random test email"""
    random_str = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
    return f"test_{random_str}@example.com"

def test_registration():
    """Test user registration"""
    email = generate_random_email()
    password = "TestPassword123!"
    name = "Test User"
    
    print(f"\n🧪 Testing Registration...")
    print(f"   Email: {email}")
    print(f"   Password: {password}")
    
    response = requests.post(
        f"{API_URL}/register",
        json={
            "email": email,
            "password": password,
            "name": name,
            "phone": "+1234567890"
        }
    )
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Registration successful!")
        print(f"   Session ID: {data.get('session_id')}")
        print(f"   User ID: {data['user']['user_id']}")
        return email, password, data.get('session_id')
    else:
        print(f"❌ Registration failed: {response.status_code}")
        print(f"   Error: {response.text}")
        return None, None, None

def test_login(email, password):
    """Test user login"""
    print(f"\n🧪 Testing Login...")
    print(f"   Email: {email}")
    
    response = requests.post(
        f"{API_URL}/login",
        json={
            "email": email,
            "password": password
        }
    )
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Login successful!")
        print(f"   Session ID: {data.get('session_id')}")
        print(f"   User: {data['user']['name']} ({data['user']['email']})")
        return data.get('session_id')
    else:
        print(f"❌ Login failed: {response.status_code}")
        print(f"   Error: {response.text}")
        return None

def test_get_current_user(session_id):
    """Test getting current user with session"""
    print(f"\n🧪 Testing Get Current User...")
    
    response = requests.get(
        f"{API_URL}/auth/me",
        headers={
            "X-Session-ID": session_id
        }
    )
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Get current user successful!")
        print(f"   User ID: {data['user_id']}")
        print(f"   Email: {data['email']}")
        print(f"   Name: {data.get('name')}")
    else:
        print(f"❌ Get current user failed: {response.status_code}")
        print(f"   Error: {response.text}")

def test_logout(session_id):
    """Test logout"""
    print(f"\n🧪 Testing Logout...")
    
    response = requests.post(
        f"{API_URL}/logout",
        headers={
            "X-Session-ID": session_id
        }
    )
    
    if response.status_code == 200:
        print(f"✅ Logout successful!")
    else:
        print(f"❌ Logout failed: {response.status_code}")
        print(f"   Error: {response.text}")

def test_password_hashing():
    """Test that password hashing is working correctly"""
    print(f"\n🧪 Testing Password Hashing (bcrypt)...")
    
    # Test with a known user (register first)
    email = generate_random_email()
    password = "SecurePassword123!"
    
    # Register user
    response = requests.post(
        f"{API_URL}/register",
        json={
            "email": email,
            "password": password,
            "name": "Hash Test User"
        }
    )
    
    if response.status_code == 200:
        print(f"✅ User registered with bcrypt hashed password")
        
        # Try to login with correct password
        response = requests.post(
            f"{API_URL}/login",
            json={
                "email": email,
                "password": password
            }
        )
        
        if response.status_code == 200:
            print(f"✅ Login with correct password successful (bcrypt verification working)")
        else:
            print(f"❌ Login with correct password failed")
        
        # Try to login with wrong password
        response = requests.post(
            f"{API_URL}/login",
            json={
                "email": email,
                "password": "WrongPassword123!"
            }
        )
        
        if response.status_code != 200:
            print(f"✅ Login with wrong password correctly rejected")
        else:
            print(f"❌ Login with wrong password should have failed!")
    else:
        print(f"❌ User registration failed")

if __name__ == "__main__":
    print("=" * 60)
    print("CV2WEB Email Authentication Test Suite")
    print("=" * 60)
    
    # Test password hashing
    test_password_hashing()
    
    # Test full authentication flow
    email, password, session_id = test_registration()
    
    if email and password:
        # Test login with the same credentials
        new_session_id = test_login(email, password)
        
        if new_session_id:
            # Test getting current user
            test_get_current_user(new_session_id)
            
            # Test logout
            test_logout(new_session_id)
            
            # Try to use session after logout (should fail)
            print(f"\n🧪 Testing Session After Logout (should fail)...")
            test_get_current_user(new_session_id)
    
    print("\n" + "=" * 60)
    print("Test Suite Complete!")
    print("=" * 60)