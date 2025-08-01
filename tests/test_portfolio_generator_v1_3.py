"""
Comprehensive tests for Portfolio Generator with v0_template_1.3
Tests focus on smart view mode detection, edge cases, and security
"""

import pytest
import json
import os
import sys
from pathlib import Path
from unittest.mock import Mock, patch, MagicMock
import tempfile
import shutil

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.templates.v0_template_1_3.lib.cv_data_adapter import (
    adaptCV2WebToTemplate,
    isVideoUrl,
    isImageUrl,
    isGitHubUrl,
    isTweetUrl,
    extractTweetId,
    determineViewMode
)


class TestPortfolioGeneratorV13:
    """Test suite for portfolio generator with template v1.3"""
    
    # ========== TEST 1: Basic CV with no URLs (text-only mode) ==========
    def test_basic_cv_text_only_mode(self):
        """Test that basic CV data without URLs defaults to text mode"""
        cv_data = {
            "hero": {
                "fullName": "John Doe",
                "professionalTitle": "Software Engineer",
                "summaryTagline": "Building amazing software",
                "profilePhotoUrl": None
            },
            "contact": {
                "email": "john@example.com",
                "phone": "+1234567890",
                "location": {"city": "San Francisco", "country": "USA"}
            },
            "experience": {
                "sectionTitle": "Experience",
                "experienceItems": [{
                    "jobTitle": "Senior Developer",
                    "companyName": "Tech Corp",
                    "dateRange": {"startDate": "2020", "endDate": "2023"},
                    "responsibilitiesAndAchievements": ["Built APIs", "Led team"]
                }]
            },
            "projects": {
                "sectionTitle": "Projects",
                "projectItems": [{
                    "title": "Simple Project",
                    "description": "A basic project with no URLs",
                    "technologiesUsed": ["Python", "Django"]
                }]
            }
        }
        
        result = adaptCV2WebToTemplate(cv_data)
        
        # Verify basic data mapping
        assert result["hero"]["fullName"] == "John Doe"
        assert result["experience"]["experienceItems"][0]["title"] == "Senior Developer"
        
        # Verify default text mode for projects without URLs
        assert result["projects"]["projectItems"][0]["viewMode"] == "text"
        assert result["projects"]["projectItems"][0]["textVariant"] == "detailed"
        assert "videoUrl" not in result["projects"]["projectItems"][0]
        assert "githubUrl" not in result["projects"]["projectItems"][0]
    
    # ========== TEST 2: CV with mixed media URLs ==========
    def test_mixed_media_urls_detection(self):
        """Test correct view mode detection for various URL types"""
        cv_data = {
            "projects": {
                "sectionTitle": "Projects",
                "projectItems": [
                    {
                        "title": "Video Demo Project",
                        "description": "Project with YouTube video",
                        "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        "projectUrl": "https://example.com"
                    },
                    {
                        "title": "GitHub Project",
                        "description": "Open source project",
                        "githubUrl": "https://github.com/facebook/react",
                        "projectUrl": "https://reactjs.org"
                    },
                    {
                        "title": "Image Gallery Project",
                        "description": "Visual project",
                        "imageUrl": "https://example.com/screenshot.png",
                        "projectUrl": "https://gallery.com"
                    },
                    {
                        "title": "Tweet Project",
                        "description": "Social media integration",
                        "projectUrl": "https://twitter.com/elonmusk/status/1234567890123456789"
                    },
                    {
                        "title": "Vimeo Demo",
                        "description": "Alternative video platform",
                        "demoUrl": "https://vimeo.com/123456789"
                    }
                ]
            },
            "certifications": {
                "sectionTitle": "Certifications",
                "certificationItems": [{
                    "title": "AWS Certified",
                    "issuingOrganization": "Amazon",
                    "verificationUrl": "https://aws.amazon.com/verify/cert123"
                }]
            },
            "publications": {
                "sectionTitle": "Publications",
                "publications": [{
                    "title": "Video Paper Presentation",
                    "publicationVenue": "Conference 2023",
                    "url": "https://youtu.be/abc123def"
                }]
            },
            "speaking": {
                "sectionTitle": "Speaking",
                "speakingEngagements": [{
                    "topic": "AI Talk",
                    "eventName": "TechConf 2023",
                    "venue": "https://www.youtube.com/watch?v=speaking123"
                }]
            }
        }
        
        result = adaptCV2WebToTemplate(cv_data)
        projects = result["projects"]["projectItems"]
        
        # Test video detection (YouTube)
        assert projects[0]["viewMode"] == "video"
        assert projects[0]["videoUrl"] == "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        
        # Test GitHub detection
        assert projects[1]["viewMode"] == "github"
        assert projects[1]["githubUrl"] == "https://github.com/facebook/react"
        
        # Test image detection
        assert projects[2]["viewMode"] == "images"
        assert projects[2]["images"] == ["https://example.com/screenshot.png"]
        
        # Test tweet detection
        assert projects[3]["viewMode"] == "tweet"
        assert projects[3]["tweetId"] == "1234567890123456789"
        
        # Test Vimeo video detection via demoUrl
        assert projects[4]["viewMode"] == "video"
        assert projects[4]["videoUrl"] == "https://vimeo.com/123456789"
        
        # Test certifications with verification URL
        assert result["certifications"]["certificationItems"][0]["viewMode"] == "uri"
        assert result["certifications"]["certificationItems"][0]["linkUrl"] == "https://aws.amazon.com/verify/cert123"
        
        # Test publications with video URL
        assert result["publications"]["publicationItems"][0]["viewMode"] == "video"
        assert result["publications"]["publicationItems"][0]["videoUrl"] == "https://youtu.be/abc123def"
        
        # Test speaking with video venue
        assert result["speakingEngagements"]["engagementItems"][0]["viewMode"] == "video"
        assert result["speakingEngagements"]["engagementItems"][0]["location"] == "Online Event"
    
    # ========== TEST 3: Edge cases - malformed URLs, empty data, null values ==========
    def test_edge_cases_and_null_handling(self):
        """Test handling of edge cases, malformed data, and null values"""
        cv_data = {
            "projects": {
                "projectItems": [
                    {
                        "title": None,  # Null title
                        "description": "",  # Empty description
                        "projectUrl": "not-a-valid-url",  # Invalid URL
                        "videoUrl": None,  # Null video URL
                        "technologiesUsed": []  # Empty array
                    },
                    {
                        "title": "Project with malformed video URL",
                        "videoUrl": "youtube.com/watch",  # Missing protocol
                        "githubUrl": "github.com/user/repo",  # Missing protocol
                        "imageUrl": "image.png"  # No domain
                    },
                    {
                        # Completely empty project
                    },
                    {
                        "title": "Project with spaces in URL",
                        "projectUrl": "https://example.com/my project/demo",
                        "imageUrl": "https://example.com/image with spaces.jpg"
                    }
                ]
            },
            "skills": {
                "skillCategories": [
                    {
                        "categoryName": None,
                        "skills": [None, "", "Python - Expert level with 5+ years"]
                    }
                ],
                "ungroupedSkills": None  # Null instead of array
            },
            "education": {
                "educationItems": None  # Null instead of array
            },
            "hero": None,  # Entire section null
            "contact": {}  # Empty object
        }
        
        result = adaptCV2WebToTemplate(cv_data)
        
        # Test null/empty handling in projects
        assert result["projects"]["projectItems"][0]["title"] == "Project"  # Default title
        assert result["projects"]["projectItems"][0]["description"] == "Project description."  # Default
        assert result["projects"]["projectItems"][0]["viewMode"] == "uri"  # Invalid URL treated as link
        
        # Test malformed URLs default to text mode
        assert result["projects"]["projectItems"][1]["viewMode"] == "text"
        
        # Test empty project gets defaults
        assert result["projects"]["projectItems"][2]["title"] == "Project"
        assert result["projects"]["projectItems"][2]["viewMode"] == "text"
        
        # Test URLs with spaces
        assert result["projects"]["projectItems"][3]["viewMode"] == "uri"
        
        # Test skills handling
        assert result["skills"]["skillCategories"][0]["categoryName"] == "Skills"  # Default
        assert len(result["skills"]["skillCategories"][0]["skills"]) == 1  # Only valid skill
        assert result["skills"]["skillCategories"][0]["skills"][0]["name"] == "Python"
        assert result["skills"]["ungroupedSkills"] == []  # Null converted to empty array
        
        # Test null sections get defaults
        assert result["hero"]["fullName"] == "Portfolio Owner"
        assert result["education"]["educationItems"] == []
    
    # ========== TEST 4: Security test - malicious URLs and XSS attempts ==========
    def test_security_malicious_urls_xss(self):
        """Test protection against malicious URLs and XSS attempts"""
        cv_data = {
            "projects": {
                "projectItems": [
                    {
                        "title": "<script>alert('XSS')</script>",  # XSS in title
                        "description": "Normal description",
                        "projectUrl": "javascript:alert('XSS')",  # JavaScript protocol
                        "videoUrl": "data:text/html,<script>alert('XSS')</script>"  # Data URL with script
                    },
                    {
                        "title": "SQL Injection Test",
                        "description": "'; DROP TABLE users; --",
                        "githubUrl": "https://github.com/../../etc/passwd",  # Path traversal attempt
                        "imageUrl": "file:///etc/passwd"  # File protocol
                    },
                    {
                        "title": "Protocol Test",
                        "projectUrl": "ftp://example.com/file",  # FTP protocol
                        "demoUrl": "ssh://server.com",  # SSH protocol
                        "videoUrl": "rtsp://stream.com/video"  # RTSP protocol
                    }
                ]
            },
            "speaking": {
                "speakingEngagements": [{
                    "topic": "XSS Test",
                    "venue": "<img src=x onerror=alert('XSS')>",  # XSS in venue
                    "eventName": "Event\"; system('rm -rf /')"  # Command injection attempt
                }]
            },
            "hero": {
                "fullName": "<img src=x onerror=alert('XSS')>",
                "profilePhotoUrl": "javascript:void(0)"
            }
        }
        
        result = adaptCV2WebToTemplate(cv_data)
        projects = result["projects"]["projectItems"]
        
        # JavaScript protocol should not be detected as valid URL
        assert projects[0]["viewMode"] == "text"  # Not URI mode
        assert "videoUrl" not in projects[0]  # Data URL not treated as video
        
        # File protocol should not be detected as image
        assert projects[1]["viewMode"] == "text"
        assert "images" not in projects[1]
        
        # Non-HTTP protocols should not be detected as special modes
        assert projects[2]["viewMode"] == "uri"  # FTP might be valid link
        assert "videoUrl" not in projects[2]  # RTSP not detected as video
        
        # XSS attempts are preserved (sanitization should happen at render time)
        # but they don't affect view mode detection
        assert result["hero"]["fullName"] == "<img src=x onerror=alert('XSS')>"
        assert result["hero"]["profilePhotoUrl"] == "javascript:void(0)"
        
        # Venue with XSS is not detected as video
        assert result["speakingEngagements"]["engagementItems"][0]["viewMode"] == "text"
        assert result["speakingEngagements"]["engagementItems"][0]["location"] == "<img src=x onerror=alert('XSS')>"
    
    # ========== TEST 5: Performance test - large CV with many items ==========
    def test_performance_large_cv(self):
        """Test handling of large CV with many items"""
        # Create a large CV with many items
        large_cv_data = {
            "projects": {
                "projectItems": []
            },
            "experience": {
                "experienceItems": []
            },
            "skills": {
                "skillCategories": [],
                "ungroupedSkills": []
            },
            "certifications": {
                "certificationItems": []
            },
            "publications": {
                "publications": []
            }
        }
        
        # Add 100 projects with various URL types
        for i in range(100):
            project = {
                "title": f"Project {i}",
                "description": f"Description for project {i} with lots of text " * 10,
                "technologiesUsed": [f"Tech{j}" for j in range(20)]  # 20 technologies each
            }
            
            # Vary the URL types
            if i % 5 == 0:
                project["videoUrl"] = f"https://youtube.com/watch?v=video{i}"
            elif i % 5 == 1:
                project["githubUrl"] = f"https://github.com/user/repo{i}"
            elif i % 5 == 2:
                project["imageUrl"] = f"https://example.com/image{i}.png"
            elif i % 5 == 3:
                project["projectUrl"] = f"https://twitter.com/user/status/{i}234567890123456"
            else:
                project["projectUrl"] = f"https://example.com/project{i}"
                
            large_cv_data["projects"]["projectItems"].append(project)
        
        # Add 50 experience items
        for i in range(50):
            large_cv_data["experience"]["experienceItems"].append({
                "jobTitle": f"Position {i}",
                "companyName": f"Company {i}",
                "responsibilitiesAndAchievements": [f"Achievement {j}" for j in range(10)]
            })
        
        # Add 200 skills in 20 categories
        for i in range(20):
            large_cv_data["skills"]["skillCategories"].append({
                "categoryName": f"Category {i}",
                "skills": [f"Skill {j} - Expert with {j} years experience" for j in range(10)]
            })
        
        # Add 100 ungrouped skills
        large_cv_data["skills"]["ungroupedSkills"] = [
            f"Skill {i} - Advanced level" for i in range(100)
        ]
        
        # Performance test - should complete without timeout
        import time
        start_time = time.time()
        
        result = adaptCV2WebToTemplate(large_cv_data)
        
        end_time = time.time()
        processing_time = end_time - start_time
        
        # Should process in reasonable time (less than 1 second)
        assert processing_time < 1.0, f"Processing took too long: {processing_time:.2f}s"
        
        # Verify correct processing
        assert len(result["projects"]["projectItems"]) == 100
        assert len(result["experience"]["experienceItems"]) == 50
        assert len(result["skills"]["skillCategories"]) == 20
        assert len(result["skills"]["ungroupedSkills"]) == 100
        
        # Verify view modes are correctly assigned
        video_projects = [p for p in result["projects"]["projectItems"] if p["viewMode"] == "video"]
        github_projects = [p for p in result["projects"]["projectItems"] if p["viewMode"] == "github"]
        image_projects = [p for p in result["projects"]["projectItems"] if p["viewMode"] == "images"]
        tweet_projects = [p for p in result["projects"]["projectItems"] if p["viewMode"] == "tweet"]
        
        assert len(video_projects) == 20  # Every 5th is video
        assert len(github_projects) == 20  # Every 5th is github
        assert len(image_projects) == 20  # Every 5th is image
        assert len(tweet_projects) == 20  # Every 5th is tweet
        
        # Verify skill parsing with detailed text
        first_skill = result["skills"]["skillCategories"][0]["skills"][5]
        assert first_skill["name"] == "Skill 5"
        assert first_skill["detailedDisplayText"] == "Skill 5 - Expert with 5 years experience"


# ========== Helper function tests ==========
class TestHelperFunctions:
    """Test the URL detection helper functions"""
    
    def test_is_video_url(self):
        """Test video URL detection"""
        # Valid video URLs
        assert isVideoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ") == True
        assert isVideoUrl("https://youtu.be/dQw4w9WgXcQ") == True
        assert isVideoUrl("https://vimeo.com/123456789") == True
        assert isVideoUrl("https://example.com/video.mp4") == True
        assert isVideoUrl("https://example.com/video.webm") == True
        
        # Invalid video URLs
        assert isVideoUrl("https://example.com") == False
        assert isVideoUrl("https://github.com/user/repo") == False
        assert isVideoUrl(None) == False
        assert isVideoUrl("") == False
        assert isVideoUrl("youtube.com/watch?v=123") == False  # Missing protocol
    
    def test_is_github_url(self):
        """Test GitHub URL detection"""
        assert isGitHubUrl("https://github.com/facebook/react") == True
        assert isGitHubUrl("http://github.com/user/repo-name") == True
        assert isGitHubUrl("https://github.com/user-123/repo_456") == True
        
        assert isGitHubUrl("https://gitlab.com/user/repo") == False
        assert isGitHubUrl("github.com/user/repo") == False  # Missing protocol
        assert isGitHubUrl("https://github.com/") == False  # No user/repo
    
    def test_is_tweet_url(self):
        """Test tweet URL detection"""
        assert isTweetUrl("https://twitter.com/elonmusk/status/1234567890123456789") == True
        assert isTweetUrl("https://x.com/user/status/1234567890123456789") == True
        
        assert isTweetUrl("https://twitter.com/elonmusk") == False  # No status
        assert isTweetUrl("https://facebook.com/post/123") == False
    
    def test_extract_tweet_id(self):
        """Test tweet ID extraction"""
        assert extractTweetId("https://twitter.com/user/status/1234567890123456789") == "1234567890123456789"
        assert extractTweetId("https://x.com/user/status/9876543210987654321") == "9876543210987654321"
        assert extractTweetId("https://example.com") == None


if __name__ == "__main__":
    # Run tests
    pytest.main([__file__, "-v"])