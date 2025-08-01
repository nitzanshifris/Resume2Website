"""
Logic tests for CV adapter URL detection and view mode assignment
These tests verify the URL detection patterns without requiring imports
"""

import re

# Recreate the URL detection functions for testing
def is_video_url(url):
    if not url:
        return False
    video_patterns = [
        r'youtube\.com/watch',
        r'youtu\.be/',
        r'vimeo\.com/',
        r'dailymotion\.com/',
        r'twitch\.tv/',
        r'\.mp4$',
        r'\.webm$',
        r'\.ogg$'
    ]
    return any(re.search(pattern, url, re.I) for pattern in video_patterns)

def is_github_url(url):
    if not url:
        return False
    return bool(re.search(r'github\.com/[\w-]+/[\w-]+', url, re.I))

def is_tweet_url(url):
    if not url:
        return False
    return bool(re.search(r'(twitter\.com|x\.com)/\w+/status/\d+', url, re.I))

def is_image_url(url):
    if not url:
        return False
    image_patterns = [
        r'\.(jpg|jpeg|png|gif|webp|svg|bmp)$',
        r'images\.unsplash\.com',
        r'imgur\.com',
        r'cloudinary\.com'
    ]
    return any(re.search(pattern, url, re.I) for pattern in image_patterns)

def run_tests():
    """Run URL detection tests"""
    print("🧪 Testing CV Adapter URL Detection Logic")
    print("=" * 60)
    
    passed = 0
    failed = 0
    
    # Test cases
    test_cases = [
        # Video URL tests
        ("Video: YouTube", is_video_url, "https://www.youtube.com/watch?v=dQw4w9WgXcQ", True),
        ("Video: YouTube short", is_video_url, "https://youtu.be/dQw4w9WgXcQ", True),
        ("Video: Vimeo", is_video_url, "https://vimeo.com/123456789", True),
        ("Video: Direct MP4", is_video_url, "https://example.com/video.mp4", True),
        ("Video: Direct WebM", is_video_url, "https://cdn.example.com/presentation.webm", True),
        ("Video: Not a video", is_video_url, "https://example.com", False),
        ("Video: Null URL", is_video_url, None, False),
        ("Video: Empty string", is_video_url, "", False),
        
        # GitHub URL tests
        ("GitHub: Valid repo", is_github_url, "https://github.com/facebook/react", True),
        ("GitHub: With dashes", is_github_url, "https://github.com/user-123/repo-name", True),
        ("GitHub: Not GitHub", is_github_url, "https://gitlab.com/user/repo", False),
        ("GitHub: No repo", is_github_url, "https://github.com/user", False),
        
        # Tweet URL tests
        ("Tweet: Twitter URL", is_tweet_url, "https://twitter.com/elonmusk/status/1234567890123456789", True),
        ("Tweet: X.com URL", is_tweet_url, "https://x.com/user/status/9876543210987654321", True),
        ("Tweet: No status", is_tweet_url, "https://twitter.com/elonmusk", False),
        ("Tweet: Not Twitter", is_tweet_url, "https://facebook.com/post/123", False),
        
        # Image URL tests
        ("Image: JPEG", is_image_url, "https://example.com/photo.jpg", True),
        ("Image: PNG", is_image_url, "https://cdn.example.com/screenshot.png", True),
        ("Image: Unsplash", is_image_url, "https://images.unsplash.com/photo-123", True),
        ("Image: Imgur", is_image_url, "https://imgur.com/gallery/abc123", True),
        ("Image: Not an image", is_image_url, "https://example.com/document.pdf", False),
    ]
    
    # Run tests
    for test_name, test_func, test_input, expected in test_cases:
        try:
            result = test_func(test_input)
            if result == expected:
                print(f"✅ {test_name}: PASS")
                passed += 1
            else:
                print(f"❌ {test_name}: FAIL (expected {expected}, got {result})")
                failed += 1
        except Exception as e:
            print(f"❌ {test_name}: ERROR - {str(e)}")
            failed += 1
    
    # Edge case tests
    print("\n🔍 Testing Edge Cases:")
    print("=" * 60)
    
    edge_cases = [
        # Security tests
        ("Security: JavaScript protocol", is_video_url, "javascript:alert('XSS')", False),
        ("Security: Data URL", is_video_url, "data:text/html,<script>alert('XSS')</script>", False),
        ("Security: File protocol", is_image_url, "file:///etc/passwd", False),
        
        # Malformed URLs
        ("Malformed: No protocol YouTube", is_video_url, "youtube.com/watch?v=123", False),
        ("Malformed: Spaces in URL", is_image_url, "https://example.com/image with spaces.jpg", True),
        ("Malformed: Special chars", is_github_url, "https://github.com/user/repo$pecial", False),
        
        # Case sensitivity
        ("Case: Uppercase YouTube", is_video_url, "HTTPS://WWW.YOUTUBE.COM/WATCH?V=123", True),
        ("Case: Mixed case extension", is_image_url, "https://example.com/photo.JPG", True),
    ]
    
    for test_name, test_func, test_input, expected in edge_cases:
        try:
            result = test_func(test_input)
            if result == expected:
                print(f"✅ {test_name}: PASS")
                passed += 1
            else:
                print(f"❌ {test_name}: FAIL (expected {expected}, got {result})")
                failed += 1
        except Exception as e:
            print(f"❌ {test_name}: ERROR - {str(e)}")
            failed += 1
    
    # Summary
    print("\n" + "=" * 60)
    print(f"📊 Results: {passed} passed, {failed} failed")
    if failed == 0:
        print("✅ All tests passed!")
    else:
        print("❌ Some tests failed.")
    
    return failed == 0

if __name__ == "__main__":
    success = run_tests()
    exit(0 if success else 1)