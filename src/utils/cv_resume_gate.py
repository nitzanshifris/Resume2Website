"""
Resume Gate Validator - English-only pre-processing validator
Checks if uploaded content is likely an English resume before extraction
"""
import re
import logging
from typing import Tuple, Dict
from collections import defaultdict

logger = logging.getLogger(__name__)

# Pre-compiled regex patterns for performance
PATTERNS = {
    # Contact patterns
    'email': re.compile(
        r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
        re.IGNORECASE
    ),
    'phone': re.compile(
        r'(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\+\d{1,3}[-.\s]?\d{4,14}',
        re.IGNORECASE
    ),
    'linkedin': re.compile(
        r'(?:linkedin\.com/in/|github\.com/|portfolio\.|website:|www\.)',
        re.IGNORECASE
    ),
    
    # Section heading patterns - must be on their own line or start of line
    'experience': re.compile(
        r'^[\s]*(?:WORK\s+)?EXPERIENCE|^[\s]*EMPLOYMENT|^[\s]*PROFESSIONAL\s+EXPERIENCE',
        re.IGNORECASE | re.MULTILINE
    ),
    'education': re.compile(
        r'^[\s]*EDUCATION|^[\s]*ACADEMIC\s+BACKGROUND',
        re.IGNORECASE | re.MULTILINE
    ),
    'skills': re.compile(
        r'^[\s]*(?:TECHNICAL\s+)?SKILLS|^[\s]*COMPETENCIES',
        re.IGNORECASE | re.MULTILINE
    ),
    'projects': re.compile(
        r'^[\s]*(?:PERSONAL\s+)?PROJECTS|^[\s]*PORTFOLIO',
        re.IGNORECASE | re.MULTILINE
    ),
    'certifications': re.compile(
        r'^[\s]*CERTIFICATIONS?|^[\s]*LICENSES?|^[\s]*CREDENTIALS',
        re.IGNORECASE | re.MULTILINE
    ),
    'summary': re.compile(
        r'^[\s]*(?:PROFESSIONAL\s+)?SUMMARY|^[\s]*PROFILE|^[\s]*OBJECTIVE',
        re.IGNORECASE | re.MULTILINE
    ),
    'achievements': re.compile(
        r'^[\s]*ACHIEVEMENTS?|^[\s]*AWARDS?|^[\s]*HONORS',
        re.IGNORECASE | re.MULTILINE
    ),
    'volunteer': re.compile(
        r'^[\s]*VOLUNTEER(?:ING)?|^[\s]*COMMUNITY\s+SERVICE',
        re.IGNORECASE | re.MULTILINE
    ),
    'publications': re.compile(
        r'^[\s]*PUBLICATIONS?|^[\s]*RESEARCH',
        re.IGNORECASE | re.MULTILINE
    ),
    
    # Date patterns
    'year_range': re.compile(
        r'\b(19[9][0-9]|20[0-9][0-9])\s*[-–—]\s*(19[9][0-9]|20[0-9][0-9]|Present|Current)\b',
        re.IGNORECASE
    ),
    'month_year': re.compile(
        r'\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}\b',
        re.IGNORECASE
    ),
    'standalone_year': re.compile(
        r'\b(199[0-9]|20[0-9][0-9])\b'
    ),
    
    # Bullet patterns
    'bullet': re.compile(
        r'^[\s]*[•·▪▫◦‣⁃※→➤➢∙°]\s+.+|^[\s]*[-*]\s+.+',
        re.MULTILINE
    ),
    
    # Job title patterns
    'job_titles': re.compile(
        r'\b(?:Engineer|Developer|Manager|Designer|Analyst|Consultant|'
        r'Architect|Lead|Senior|Junior|Intern|Assistant|Director|'
        r'Coordinator|Specialist|Administrator|Technician|Supervisor|'
        r'Executive|Officer|Programmer|Scientist|Researcher|Teacher|'
        r'Professor|Instructor|Advisor|Accountant|Lawyer|Attorney|'
        r'Nurse|Doctor|Physician|Therapist|Sales|Marketing|Product|'
        r'Project|Data|Software|Hardware|Network|System|Database|'
        r'Quality|Finance|HR|Human Resources|Operations|Business)\b',
        re.IGNORECASE
    )
}


def score_resume_likelihood(text: str, max_chars: int = 5000) -> Tuple[int, Dict[str, int]]:
    """
    Score the likelihood that the text is a resume (0-100).
    
    Args:
        text: The text content to analyze
        max_chars: Maximum characters to analyze (default 5000)
    
    Returns:
        Tuple of (score, signals_dict) where signals_dict contains individual signal scores
    """
    if not text:
        return 0, {}
    
    # Cap text length for performance
    text = text[:max_chars]
    
    signals = defaultdict(int)
    
    # Extremely short text penalty (only for very short text)
    if len(text) < 200:  # Reduced from 500 to 200 characters
        signals['short_text_penalty'] = -10
    
    # Contact signals (max 20 points)
    if PATTERNS['email'].search(text):
        signals['email'] = 10
    if PATTERNS['phone'].search(text):
        signals['phone'] = 5
    if PATTERNS['linkedin'].search(text):
        signals['professional_url'] = 5
    
    # Cap contact signals at 20
    contact_total = sum([signals['email'], signals['phone'], signals['professional_url']])
    if contact_total > 20:
        scale = 20 / contact_total
        signals['email'] = int(signals['email'] * scale)
        signals['phone'] = int(signals['phone'] * scale)
        signals['professional_url'] = int(signals['professional_url'] * scale)
    
    # Section heading signals (max 40 points)
    section_scores = {
        'experience': 15,
        'education': 10,
        'skills': 10,
        'projects': 7,
        'certifications': 7,
        'summary': 5,
        'achievements': 5,
        'volunteer': 5,
        'publications': 5
    }
    
    sections_found = []
    for section, score in section_scores.items():
        if PATTERNS[section].search(text):
            signals[f'section_{section}'] = score
            sections_found.append(section)
    
    # Cap section signals at 40
    section_total = sum(signals[f'section_{s}'] for s in sections_found)
    if section_total > 40:
        scale = 40 / section_total
        for section in sections_found:
            signals[f'section_{section}'] = int(signals[f'section_{section}'] * scale)
    
    # Date patterns (max 20 points)
    year_ranges = len(PATTERNS['year_range'].findall(text))
    month_years = len(PATTERNS['month_year'].findall(text))
    standalone_years = len(PATTERNS['standalone_year'].findall(text))
    
    # Score based on date frequency
    if year_ranges > 0:
        signals['date_ranges'] = min(10, year_ranges * 3)
    if month_years > 0:
        signals['month_year_dates'] = min(5, month_years * 2)
    if standalone_years > 2:
        signals['year_mentions'] = min(5, standalone_years)
    
    # Cap date signals at 20
    date_total = signals['date_ranges'] + signals['month_year_dates'] + signals['year_mentions']
    if date_total > 20:
        scale = 20 / date_total
        signals['date_ranges'] = int(signals['date_ranges'] * scale)
        signals['month_year_dates'] = int(signals['month_year_dates'] * scale)
        signals['year_mentions'] = int(signals['year_mentions'] * scale)
    
    # Bullet structure (max 10 points)
    lines = text.split('\n')
    bullet_lines = sum(1 for line in lines if PATTERNS['bullet'].match(line))
    if bullet_lines > 3:
        signals['bullet_structure'] = min(10, bullet_lines)
    
    # Job title lexicon (max 10 points)
    job_titles = PATTERNS['job_titles'].findall(text)
    unique_titles = len(set(word.lower() for word in job_titles))
    if unique_titles > 0:
        signals['job_titles'] = min(10, unique_titles * 2)
    
    # Calculate total score
    total_score = sum(signals.values())
    
    # Clamp between 0 and 100
    total_score = max(0, min(100, total_score))
    
    # Convert defaultdict to regular dict for cleaner output
    signals_dict = dict(signals)
    
    return total_score, signals_dict


def is_likely_resume(text: str, threshold: int = 60, max_chars: int = 5000) -> Tuple[bool, int, Dict[str, int]]:
    """
    Determine if the text is likely a resume based on scoring threshold.
    
    Args:
        text: The text content to analyze
        threshold: Minimum score to be considered a resume (default 60)
        max_chars: Maximum characters to analyze (default 5000)
    
    Returns:
        Tuple of (is_resume, score, signals_dict)
    """
    score, signals = score_resume_likelihood(text, max_chars)
    is_resume = score >= threshold
    
    # Log decision and top signals
    if logger.isEnabledFor(logging.INFO):
        # Get top 3 signals
        sorted_signals = sorted(signals.items(), key=lambda x: abs(x[1]), reverse=True)[:3]
        top_signals_str = ', '.join(f"{k}={v}" for k, v in sorted_signals)
        logger.info(f"Resume Gate: score={score}, threshold={threshold}, "
                   f"decision={'PASS' if is_resume else 'FAIL'}, "
                   f"top_signals=[{top_signals_str}]")
    
    return is_resume, score, signals


def get_rejection_reason(signals: Dict[str, int]) -> str:
    """
    Generate a human-readable reason for rejection based on missing signals.
    
    Args:
        signals: The signals dictionary from scoring
    
    Returns:
        A descriptive reason for rejection
    """
    missing = []
    
    # Check for missing critical components
    has_contact = any(k in signals for k in ['email', 'phone', 'professional_url'])
    has_sections = any(k.startswith('section_') for k in signals)
    has_dates = any(k in signals for k in ['date_ranges', 'month_year_dates', 'year_mentions'])
    has_structure = 'bullet_structure' in signals or 'job_titles' in signals
    
    if not has_contact:
        missing.append("contact information")
    if not has_sections:
        missing.append("standard resume sections (Experience, Education, Skills)")
    if not has_dates:
        missing.append("employment dates or time periods")
    if not has_structure:
        missing.append("professional structure or job titles")
    
    if missing:
        return f"Missing key resume components: {', '.join(missing)}"
    else:
        return "Content does not match typical resume patterns"