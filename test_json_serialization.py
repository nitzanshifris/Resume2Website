#!/usr/bin/env python3
"""
Test JSON serialization of Pydantic HttpUrl
"""
import json
from pydantic import HttpUrl, BaseModel
from pydantic_core import Url
from services.portfolio.portfolio_generator import PydanticJSONEncoder, sanitize_props_for_json

class TestModel(BaseModel):
    name: str
    website: HttpUrl
    
# Test data
test_data = {
    "hero": {
        "fullName": "John Doe",
        "profilePhotoUrl": HttpUrl("https://example.com/photo.jpg")
    },
    "contact": {
        "professionalLinks": [
            {"platform": "LinkedIn", "url": HttpUrl("https://linkedin.com/in/johndoe")}
        ]
    }
}

print("Testing JSON serialization of Pydantic HttpUrl:\n")

# Test 1: Direct serialization (should fail)
try:
    result = json.dumps(test_data)
    print("❌ Direct serialization unexpectedly succeeded")
except TypeError as e:
    print(f"✓ Direct serialization failed as expected: {e}")

# Test 2: With custom encoder
try:
    result = json.dumps(test_data, cls=PydanticJSONEncoder)
    print(f"✓ Custom encoder succeeded: {result[:100]}...")
except Exception as e:
    print(f"❌ Custom encoder failed: {e}")

# Test 3: With sanitization
try:
    sanitized = sanitize_props_for_json(test_data)
    result = json.dumps(sanitized)
    print(f"✓ Sanitization succeeded: {result[:100]}...")
    
    # Verify URLs are strings
    assert isinstance(sanitized["hero"]["profilePhotoUrl"], str)
    assert isinstance(sanitized["contact"]["professionalLinks"][0]["url"], str)
    print("✓ URLs properly converted to strings")
except Exception as e:
    print(f"❌ Sanitization failed: {e}")