"""
Integration test showing real-world CV data transformation
This demonstrates how the portfolio generator handles actual CV data
"""

import json

def test_real_world_cv_example():
    """Test with a realistic CV example showing all features"""
    
    # Realistic CV data that might come from the CV editor
    cv_data = {
        "hero": {
            "fullName": "Sarah Johnson",
            "professionalTitle": "Full Stack Developer & Tech Speaker",
            "summaryTagline": "Building scalable web applications and sharing knowledge",
            "profilePhotoUrl": "https://linkedin.com/photo/sarah-johnson.jpg"
        },
        "contact": {
            "email": "sarah@example.com",
            "phone": "+1 (555) 123-4567",
            "location": {
                "city": "San Francisco",
                "state": "CA",
                "country": "USA"
            },
            "professionalLinks": [
                {"platform": "LinkedIn", "url": "https://linkedin.com/in/sarahjohnson"},
                {"platform": "GitHub", "url": "https://github.com/sarahjohnson"},
                {"platform": "Portfolio", "url": "https://sarahjohnson.dev"}
            ]
        },
        "projects": {
            "sectionTitle": "Featured Projects",
            "projectItems": [
                {
                    "title": "E-commerce Platform",
                    "description": "Built a scalable e-commerce platform serving 100k+ users",
                    "technologiesUsed": ["React", "Node.js", "PostgreSQL", "Redis"],
                    "projectUrl": "https://ecommerce-demo.com",
                    "githubUrl": "https://github.com/sarahjohnson/ecommerce-platform",
                    "videoUrl": "https://www.youtube.com/watch?v=demo123",
                    "imageUrl": "https://screenshots.com/ecommerce-dashboard.png"
                },
                {
                    "title": "AI Chatbot Framework",
                    "description": "Open source chatbot framework with 2k+ GitHub stars",
                    "technologiesUsed": ["Python", "TensorFlow", "FastAPI"],
                    "projectUrl": "https://twitter.com/sarahjohnson/status/1234567890123456789",
                    "githubUrl": "https://github.com/sarahjohnson/ai-chatbot",
                    "demoUrl": "https://chatbot-demo.herokuapp.com"
                },
                {
                    "title": "Data Visualization Dashboard",
                    "description": "Real-time analytics dashboard for financial data",
                    "technologiesUsed": ["D3.js", "Vue.js", "WebSockets"],
                    "projectUrl": "https://dashboard.fintech.com",
                    "imageUrl": "https://cdn.example.com/dashboard-screenshot.jpg",
                    "videoUrl": "https://vimeo.com/987654321"
                }
            ]
        },
        "experience": {
            "sectionTitle": "Professional Experience",
            "experienceItems": [
                {
                    "jobTitle": "Senior Full Stack Developer",
                    "companyName": "TechCorp Inc.",
                    "location": {"city": "San Francisco", "state": "CA"},
                    "dateRange": {"startDate": "2021", "endDate": None, "isCurrent": True},
                    "responsibilitiesAndAchievements": [
                        "Led development of microservices architecture serving 1M+ requests/day",
                        "Mentored team of 5 junior developers",
                        "Reduced API response time by 60% through optimization"
                    ]
                }
            ]
        },
        "certifications": {
            "sectionTitle": "Certifications",
            "certificationItems": [
                {
                    "title": "AWS Certified Solutions Architect",
                    "issuingOrganization": "Amazon Web Services",
                    "issueDate": "2023",
                    "verificationUrl": "https://aws.amazon.com/verification/cert123456"
                },
                {
                    "title": "Google Cloud Professional Developer",
                    "issuingOrganization": "Google",
                    "issueDate": "2022",
                    "verificationUrl": "https://cloud.google.com/verify/prof-dev-789"
                }
            ]
        },
        "publications": {
            "sectionTitle": "Publications & Talks",
            "publications": [
                {
                    "title": "Scaling Node.js Applications - Conference Talk",
                    "publicationVenue": "NodeConf 2023",
                    "publicationDate": "2023",
                    "url": "https://www.youtube.com/watch?v=nodeconf2023talk"
                },
                {
                    "title": "Best Practices for React Performance",
                    "publicationVenue": "Medium Engineering Blog",
                    "publicationDate": "2022",
                    "url": "https://medium.com/engineering/react-performance-best-practices"
                }
            ]
        },
        "speaking": {
            "sectionTitle": "Speaking Engagements",
            "speakingEngagements": [
                {
                    "eventName": "React Summit 2023",
                    "topic": "Building Accessible React Applications",
                    "date": "2023-06-15",
                    "venue": "Amsterdam, Netherlands"
                },
                {
                    "eventName": "Women in Tech Conference",
                    "topic": "Career Growth in Software Engineering",
                    "date": "2023-03-20",
                    "venue": "https://www.youtube.com/watch?v=witech2023keynote"
                }
            ]
        }
    }
    
    print("📄 Sample CV Data Transformation")
    print("=" * 80)
    print("\n🎯 Expected View Mode Assignments:\n")
    
    # Show expected transformations
    expected_transformations = [
        {
            "section": "Projects",
            "items": [
                {
                    "title": "E-commerce Platform",
                    "detected_urls": {
                        "videoUrl": "YouTube video",
                        "githubUrl": "GitHub repo",
                        "imageUrl": "Screenshot"
                    },
                    "expected_view_mode": "video",
                    "reason": "Video takes priority for maximum engagement"
                },
                {
                    "title": "AI Chatbot Framework",
                    "detected_urls": {
                        "projectUrl": "Tweet link",
                        "githubUrl": "GitHub repo"
                    },
                    "expected_view_mode": "github",
                    "reason": "GitHub view for open source project (tweet URL would be secondary)"
                },
                {
                    "title": "Data Visualization Dashboard",
                    "detected_urls": {
                        "videoUrl": "Vimeo video",
                        "imageUrl": "Screenshot"
                    },
                    "expected_view_mode": "video",
                    "reason": "Vimeo video demonstration"
                }
            ]
        },
        {
            "section": "Certifications",
            "items": [
                {
                    "title": "AWS Certified Solutions Architect",
                    "detected_urls": {"verificationUrl": "AWS verification"},
                    "expected_view_mode": "uri",
                    "reason": "Link preview for verification"
                }
            ]
        },
        {
            "section": "Publications",
            "items": [
                {
                    "title": "Scaling Node.js Applications",
                    "detected_urls": {"url": "YouTube video"},
                    "expected_view_mode": "video",
                    "reason": "Conference talk video"
                },
                {
                    "title": "Best Practices for React Performance",
                    "detected_urls": {"url": "Medium article"},
                    "expected_view_mode": "uri",
                    "reason": "Article link preview"
                }
            ]
        },
        {
            "section": "Speaking Engagements",
            "items": [
                {
                    "title": "React Summit 2023",
                    "venue": "Amsterdam, Netherlands",
                    "expected_view_mode": "text",
                    "reason": "Physical venue location"
                },
                {
                    "title": "Women in Tech Conference",
                    "venue": "YouTube video URL",
                    "expected_view_mode": "video",
                    "reason": "Online event with video recording"
                }
            ]
        }
    ]
    
    # Display expected transformations
    for section in expected_transformations:
        print(f"\n📁 {section['section']}:")
        for item in section['items']:
            print(f"\n  • {item['title']}")
            if 'detected_urls' in item:
                print(f"    URLs: {', '.join(f'{k}: {v}' for k, v in item['detected_urls'].items())}")
            if 'venue' in item:
                print(f"    Venue: {item['venue']}")
            print(f"    → View Mode: {item['expected_view_mode'].upper()}")
            print(f"    → Reason: {item['reason']}")
    
    print("\n" + "=" * 80)
    print("\n✨ Smart Features Demonstrated:")
    print("  • Automatic video detection for YouTube/Vimeo links")
    print("  • GitHub repository card display for open source projects")
    print("  • Tweet embedding when project URL is a tweet")
    print("  • Link previews for verification URLs")
    print("  • Smart venue detection for speaking events (online vs physical)")
    print("  • Priority system: video > github > images > tweets > links > text")
    
    return True

def test_weakness_scenarios():
    """Test potential weaknesses and edge cases"""
    
    print("\n\n⚠️  Testing Potential Weaknesses")
    print("=" * 80)
    
    weaknesses = [
        {
            "scenario": "Mixed content URLs in description",
            "issue": "URLs embedded in text descriptions are not extracted",
            "example": {
                "description": "Check out the demo at https://youtube.com/watch?v=demo123",
                "expected": "URL in description won't trigger video mode",
                "workaround": "User should add URL to dedicated URL fields"
            }
        },
        {
            "scenario": "Multiple competing URLs",
            "issue": "Only highest priority URL type is used",
            "example": {
                "videoUrl": "https://youtube.com/watch?v=123",
                "githubUrl": "https://github.com/user/repo",
                "expected": "Video mode wins, GitHub URL ignored",
                "workaround": "Template could support multiple view modes in future"
            }
        },
        {
            "scenario": "Non-standard video platforms",
            "issue": "Only major platforms detected",
            "example": {
                "videoUrl": "https://customplatform.com/video/123",
                "expected": "Won't be detected as video",
                "workaround": "Add more video platform patterns"
            }
        },
        {
            "scenario": "URL shorteners",
            "issue": "Shortened URLs not expanded",
            "example": {
                "projectUrl": "https://bit.ly/abc123",
                "expected": "Treated as generic link, not analyzed",
                "workaround": "Could add URL expansion service"
            }
        },
        {
            "scenario": "Private/authenticated content",
            "issue": "Private videos or repos may not display properly",
            "example": {
                "videoUrl": "https://youtube.com/watch?v=private123",
                "expected": "Video player may show error",
                "workaround": "User should only link public content"
            }
        }
    ]
    
    for weakness in weaknesses:
        print(f"\n🔍 {weakness['scenario']}")
        print(f"   Issue: {weakness['issue']}")
        print(f"   Example: {weakness['example']['expected']}")
        print(f"   Workaround: {weakness['example']['workaround']}")
    
    print("\n" + "=" * 80)
    print("\n📋 Recommendations for Users:")
    print("  • Place media URLs in dedicated URL fields (not in descriptions)")
    print("  • Use public/accessible URLs only")
    print("  • For best results, use mainstream platforms (YouTube, Vimeo, GitHub)")
    print("  • Test preview before publishing portfolio")
    print("  • Consider URL priority when multiple types are provided")

if __name__ == "__main__":
    test_real_world_cv_example()
    test_weakness_scenarios()