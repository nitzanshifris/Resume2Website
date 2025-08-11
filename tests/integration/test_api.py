#!/usr/bin/env python3
"""
Test API startup and basic functionality
"""
import sys

def test_imports():
    """Test that all imports work"""
    print("Testing imports...")
    try:
        from main import app
        print("✅ Main app imports successfully")
        
        # Test that routes are included
        routes = [route.path for route in app.routes]
        print(f"✅ Found {len(routes)} routes")
        
        # Print all available endpoints
        print("\nAvailable endpoints:")
        for route in app.routes:
            if hasattr(route, 'methods'):
                for method in route.methods:
                    print(f"  {method} {route.path}")
        
        return True
    except Exception as e:
        print(f"❌ Import error: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_app_info():
    """Test app configuration"""
    from main import app
    print(f"\n✅ App title: {app.title}")
    print(f"✅ App version: {app.version}")
    print(f"✅ OpenAPI URL: {app.openapi_url}")
    print(f"✅ Docs URL: {app.docs_url}")

if __name__ == "__main__":
    print("RESUME2WEBSITE API Test")
    print("=" * 50)
    
    if test_imports():
        test_app_info()
        print("\n✅ All tests passed! API is ready to run.")
        print("\nTo start the API, run:")
        print("  python3 main.py")
        print("\nOr with uvicorn directly:")
        print("  uvicorn main:app --reload")
    else:
        print("\n❌ Tests failed. Please fix errors before running.")
        sys.exit(1)