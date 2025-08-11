#!/usr/bin/env python3
"""
Test script for SSE infrastructure
Run this to test SSE endpoints
"""

import asyncio
import requests
import json
from datetime import datetime

def test_sse_heartbeat():
    """Test the SSE heartbeat endpoint"""
    print("🧪 Testing SSE Heartbeat Endpoint...")
    
    try:
        response = requests.get(
            "http://localhost:2000/api/v1/sse/heartbeat",
            stream=True,
            timeout=30
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Headers: {dict(response.headers)}")
        print("\n📡 SSE Stream Output:")
        print("-" * 50)
        
        for line in response.iter_lines():
            if line:
                decoded_line = line.decode('utf-8')
                print(decoded_line)
                
                # Break after a few messages for demo
                if "event: complete" in decoded_line:
                    print("✅ Heartbeat test completed!")
                    break
                    
    except Exception as e:
        print(f"❌ Error testing SSE: {e}")

def test_sse_with_curl():
    """Show curl command for testing"""
    print("\n🔧 Manual testing with curl:")
    print("curl -N -H 'Accept: text/event-stream' http://localhost:2000/api/v1/sse/heartbeat")

if __name__ == "__main__":
    print("🚀 RESUME2WEBSITE SSE Infrastructure Test")
    print("=" * 50)
    
    # Check if server is running
    try:
        health_check = requests.get("http://localhost:2000/health", timeout=5)
        if health_check.status_code == 200:
            print("✅ Server is running")
            test_sse_heartbeat()
        else:
            print("⚠️ Server returned non-200 status")
    except requests.exceptions.ConnectionError:
        print("❌ Server is not running. Start it with:")
        print("   uvicorn main:app --reload --port 2000")
    except Exception as e:
        print(f"❌ Error checking server: {e}")
    
    test_sse_with_curl()
    print("\n🏁 Test completed")