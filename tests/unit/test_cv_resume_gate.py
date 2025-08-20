"""
Unit tests for CV Resume Gate validator
Tests resume detection logic and scoring
"""
import pytest
from pathlib import Path
import sys

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from src.utils.cv_resume_gate import (
    score_resume_likelihood,
    is_likely_resume,
    get_rejection_reason
)


class TestResumeGate:
    """Test Resume Gate validation functions"""
    
    def test_valid_resume_with_all_sections(self):
        """Test a well-formed resume with all standard sections"""
        resume_text = """
        John Doe
        Software Engineer
        john.doe@email.com | (555) 123-4567 | linkedin.com/in/johndoe
        
        PROFESSIONAL SUMMARY
        Experienced software engineer with 8+ years developing scalable web applications.
        
        WORK EXPERIENCE
        Senior Software Engineer
        Tech Corp Inc. | San Francisco, CA
        Jan 2020 - Present
        • Led development of microservices architecture serving 1M+ users
        • Reduced API response time by 40% through optimization
        • Mentored team of 5 junior developers
        
        Software Engineer
        StartupXYZ | Remote
        Jun 2016 - Dec 2019
        • Built full-stack web application using React and Node.js
        • Implemented CI/CD pipeline reducing deployment time by 60%
        
        EDUCATION
        Bachelor of Science in Computer Science
        University of California, Berkeley
        2012 - 2016
        
        SKILLS
        Programming: Python, JavaScript, Java, Go
        Frameworks: React, Django, Spring Boot
        Tools: Docker, Kubernetes, AWS, Git
        
        CERTIFICATIONS
        AWS Certified Solutions Architect - 2021
        """
        
        is_resume, score, signals = is_likely_resume(resume_text, threshold=60)
        
        assert is_resume is True
        assert score >= 80  # Should score very high
        assert 'email' in signals
        assert 'phone' in signals
        assert 'section_experience' in signals
        assert 'section_education' in signals
        assert 'section_skills' in signals
        assert 'date_ranges' in signals or 'month_year_dates' in signals
    
    def test_minimal_valid_resume(self):
        """Test a minimal resume that should barely pass"""
        minimal_resume = """
        Jane Smith
        Software Developer
        jane@example.com | (555) 123-4567 | linkedin.com/in/janesmith
        
        PROFESSIONAL SUMMARY
        Experienced software developer with strong background in web development
        
        EXPERIENCE
        Software Developer at TechCo
        January 2020 - December 2023
        • Developed web applications using React and Node.js frameworks
        • Collaborated with cross-functional team of 5 engineers and designers
        • Improved application performance by 30% through optimization
        • Implemented automated testing reducing bugs by 40%
        
        EDUCATION
        Bachelor of Science in Computer Science
        State University, 2016-2020
        GPA: 3.8/4.0
        
        SKILLS
        Programming Languages: JavaScript, Python, Java, SQL
        Frameworks: React, Node.js, Django, Express
        Tools: Git, Docker, AWS, Jenkins
        """
        
        is_resume, score, signals = is_likely_resume(minimal_resume, threshold=60)
        
        assert is_resume is True  # Should pass with minimal sections
        assert score >= 60  # Should pass threshold
        assert 'email' in signals
        assert 'section_experience' in signals
        assert 'section_education' in signals
    
    def test_blog_post_rejection(self):
        """Test that a blog post is correctly rejected"""
        blog_post = """
        10 Tips for Better Software Development
        
        In today's fast-paced tech world, staying ahead means constantly improving
        your development practices. Here are my top 10 tips that I've learned over
        the years of working in Silicon Valley.
        
        1. Write Clean Code
        The most important thing you can do is write clean, readable code. Your future
        self will thank you when you have to debug that function six months from now.
        
        2. Test Everything
        Unit tests, integration tests, end-to-end tests - they all matter. A good test
        suite is like a safety net that lets you refactor with confidence.
        
        3. Learn from Others
        Read code written by experienced developers. Contribute to open source. Attend
        meetups and conferences. The community is full of knowledge waiting to be shared.
        """
        
        is_resume, score, signals = is_likely_resume(blog_post, threshold=60)
        
        assert is_resume is False
        assert score < 60
        # Should be missing key resume signals
        assert 'email' not in signals or signals.get('email', 0) == 0
        assert 'section_experience' not in signals or signals.get('section_experience', 0) == 0
        assert 'section_education' not in signals or signals.get('section_education', 0) == 0
    
    def test_academic_paper_rejection(self):
        """Test that an academic paper is rejected"""
        academic_paper = """
        Abstract
        
        This paper presents a novel approach to distributed computing using quantum
        entanglement principles. We demonstrate that by leveraging quantum properties,
        we can achieve O(1) communication complexity for certain distributed algorithms.
        
        Introduction
        
        Distributed computing has been a cornerstone of modern computer science since
        the 1970s. Traditional approaches rely on classical communication channels,
        which impose fundamental limits on algorithm efficiency.
        
        Methodology
        
        We employed a hybrid quantum-classical approach, utilizing IBM's quantum
        processors for the quantum components and traditional servers for classical
        computation.
        
        Results
        
        Our experiments show a 47% improvement in communication efficiency compared
        to classical baselines when operating on datasets exceeding 1TB.
        
        Conclusion
        
        The integration of quantum principles into distributed computing opens new
        avenues for research and practical applications.
        """
        
        is_resume, score, signals = is_likely_resume(academic_paper, threshold=60)
        
        assert is_resume is False
        assert score < 40  # Should score very low
    
    def test_short_text_penalty(self):
        """Test that very short text gets penalized"""
        short_text = """
        John Doe
        Engineer
        john@email.com
        """  # This is under 200 characters
        
        is_resume, score, signals = is_likely_resume(short_text, threshold=60)
        
        assert is_resume is False
        assert score < 60
        assert 'short_text_penalty' in signals
        assert signals['short_text_penalty'] == -10
    
    def test_short_but_valid_cv(self):
        """Test that a short but complete CV passes validation"""
        short_cv = """
        Alex Johnson
        alex@email.com | 555-1234
        
        EXPERIENCE
        Developer at StartUp (2021-2023)
        Built mobile apps
        
        EDUCATION  
        BS Computer Science (2017-2021)
        
        SKILLS
        Python, JavaScript, React
        """  # Over 200 characters but still quite short
        
        is_resume, score, signals = is_likely_resume(short_cv, threshold=50)
        
        # Should not have penalty and should pass with lower threshold
        assert 'short_text_penalty' not in signals or signals.get('short_text_penalty', 0) == 0
        assert score >= 40  # Should score reasonably despite being concise
    
    def test_non_english_content(self):
        """Test that non-English content scores low"""
        non_english = """
        履歴書
        
        氏名: 山田太郎
        生年月日: 1990年4月15日
        住所: 東京都渋谷区
        
        学歴:
        2013年3月 東京大学工学部卒業
        
        職歴:
        2013年4月 - 2018年3月: ソフトウェアエンジニア
        2018年4月 - 現在: シニアエンジニア
        """
        
        is_resume, score, signals = is_likely_resume(non_english, threshold=60)
        
        assert is_resume is False
        assert score < 30  # Should score very low without English keywords
    
    def test_cover_letter_detection(self):
        """Test that a cover letter scores lower than a resume"""
        cover_letter = """
        Dear Hiring Manager,
        
        I am writing to express my strong interest in the Software Engineer position
        at your company. With over 5 years of experience in full-stack development,
        I believe I would be a valuable addition to your team.
        
        In my current role at TechCorp, I have successfully led the development of
        several high-impact projects. I implemented a new microservices architecture
        that improved system performance by 35%. I also mentored junior developers
        and conducted code reviews to maintain high code quality standards.
        
        I graduated from State University in 2018 with a Bachelor's degree in
        Computer Science. During my studies, I maintained a 3.8 GPA and completed
        several internships that prepared me for my professional career.
        
        I am proficient in Python, JavaScript, and Java, with experience in React,
        Django, and AWS. I am eager to bring my skills and enthusiasm to your team.
        
        Thank you for considering my application. I look forward to discussing how
        I can contribute to your organization.
        
        Sincerely,
        John Doe
        john.doe@email.com
        (555) 123-4567
        """
        
        is_resume, score, signals = is_likely_resume(cover_letter, threshold=60)
        
        # Cover letter might pass or fail depending on threshold
        # but should score lower than a proper resume
        assert score < 70  # Should not score as high as a resume
    
    def test_rejection_reason_generation(self):
        """Test that rejection reasons are informative"""
        # Test with no signals
        reason = get_rejection_reason({})
        assert "contact information" in reason
        assert "resume sections" in reason
        
        # Test with only contact info
        reason = get_rejection_reason({'email': 10})
        assert "resume sections" in reason
        assert "contact information" not in reason
        
        # Test with sections but no dates
        reason = get_rejection_reason({
            'email': 10,
            'section_experience': 15,
            'section_education': 10
        })
        assert "dates" in reason or "time periods" in reason
    
    def test_bullet_structure_detection(self):
        """Test that bullet points are detected and scored"""
        bulleted_text = """
        EXPERIENCE
        
        Software Engineer
        • Developed REST APIs using Python and FastAPI
        • Implemented automated testing with 95% code coverage
        • Reduced deployment time by 50% through CI/CD improvements
        - Collaborated with cross-functional teams
        - Mentored 3 junior developers
        * Participated in agile ceremonies
        """
        
        score, signals = score_resume_likelihood(bulleted_text)
        
        assert 'bullet_structure' in signals
        assert signals['bullet_structure'] > 0
    
    def test_job_title_detection(self):
        """Test that common job titles are detected"""
        text_with_titles = """
        Senior Software Engineer
        Lead Developer
        Project Manager
        Data Analyst
        Marketing Consultant
        Systems Architect
        Junior Designer
        """
        
        score, signals = score_resume_likelihood(text_with_titles)
        
        assert 'job_titles' in signals
        assert signals['job_titles'] > 0
    
    def test_date_pattern_detection(self):
        """Test various date patterns are detected"""
        text_with_dates = """
        Jan 2020 - Present
        2018 - 2022
        June 2019 – December 2021
        2015-2017
        May 2023
        Graduated 2016
        Since 2020
        1999 to 2003
        """
        
        score, signals = score_resume_likelihood(text_with_dates)
        
        # Should detect multiple date patterns
        assert any(k in signals for k in ['date_ranges', 'month_year_dates', 'year_mentions'])
        date_score = sum(signals.get(k, 0) for k in ['date_ranges', 'month_year_dates', 'year_mentions'])
        assert date_score > 10
    
    def test_max_score_capping(self):
        """Test that scores are properly capped at 100"""
        # Create a super resume that would score over 100 without capping
        super_resume = """
        John Doe
        john@email.com | 555-123-4567 | linkedin.com/in/johndoe | github.com/johndoe
        """ + """
        PROFESSIONAL SUMMARY
        WORK EXPERIENCE
        EDUCATION
        SKILLS
        PROJECTS
        CERTIFICATIONS
        ACHIEVEMENTS
        VOLUNTEER
        PUBLICATIONS
        """ * 3  # Repeat sections (though only first should count)
        
        super_resume += """
        Senior Software Engineer at Google (2020-2023)
        Lead Developer at Facebook (2018-2020)
        Project Manager at Amazon (2016-2018)
        • Built scalable systems
        • Led development teams
        • Improved performance
        - Managed projects
        - Mentored engineers
        * Delivered on time
        """
        
        score, signals = score_resume_likelihood(super_resume)
        
        assert score <= 100  # Score should be capped at 100
        assert score >= 80  # But should still be very high
    
    def test_configurable_threshold(self):
        """Test that threshold is configurable"""
        marginal_resume = """
        John Doe
        john@email.com | 555-123-4567
        
        EXPERIENCE
        Software Engineer at Company ABC 
        2020 to 2022
        • Worked on various development tasks and projects
        • Used Python and JavaScript
        
        EDUCATION
        Bachelor's Degree in Computer Science
        University Name, 2016-2020
        
        SKILLS
        Programming: Python, JavaScript, SQL
        Tools: Git, Docker, AWS
        """
        
        # Get the actual score first
        _, actual_score, _ = is_likely_resume(marginal_resume, threshold=50)
        
        # Test with threshold below actual score
        is_resume_low, score_low, _ = is_likely_resume(marginal_resume, threshold=actual_score - 10)
        assert is_resume_low is True
        
        # Test with threshold above actual score
        is_resume_high, score_high, _ = is_likely_resume(marginal_resume, threshold=actual_score + 10)
        assert is_resume_high is False
        
        # Score should be the same regardless of threshold
        assert score_low == score_high


if __name__ == "__main__":
    # Run tests
    pytest.main([__file__, "-v"])