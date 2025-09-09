"""
Resume Gate Validator - Validates if uploaded content is likely a resume/CV
With enhanced support for OCR-extracted text
"""
import re
import logging
import unicodedata
from typing import Tuple, Dict
from collections import defaultdict

logger = logging.getLogger(__name__)


def normalize_text_for_gate(text: str) -> str:
    """
    Normalize text for better Resume Gate detection, especially for OCR text.
    
    Args:
        text: Raw text to normalize
        
    Returns:
        Normalized text suitable for pattern matching
    """
    if not text:
        return ""
    
    # Replace non-breaking spaces and other Unicode spaces with regular spaces
    text = unicodedata.normalize('NFKC', text)
    text = re.sub(r'[\u00A0\u1680\u2000-\u200B\u202F\u205F\u3000]', ' ', text)
    
    # Fix hyphenation at line breaks (e.g., "devel-\nopment" → "development")
    text = re.sub(r'(\w+)-\s*\n\s*(\w+)', r'\1\2', text)
    
    # Normalize line endings (CRLF/CR to LF)
    text = text.replace('\r\n', '\n').replace('\r', '\n')
    
    # Collapse multiple spaces (but preserve newlines)
    text = re.sub(r'[ \t]+', ' ', text)
    
    # Normalize common bullet points to a standard marker
    bullet_chars = '•·▪▫◦‣⁃※→➤➢∙°●■□▸▹►▻◆◇★☆✓✔✗✘'
    text = re.sub(f'[{re.escape(bullet_chars)}]', '• ', text)
    
    # Trim trailing spaces from each line
    text = '\n'.join(line.rstrip() for line in text.split('\n'))
    
    return text


def detect_ocr_like_text(text: str) -> bool:
    """
    Detect if text appears to be from OCR extraction.
    
    Args:
        text: Text to analyze
        
    Returns:
        True if text appears to be OCR-extracted
    """
    if not text or len(text) < 100:
        return False
    
    # Check for non-breaking spaces (common in OCR)
    if '\u00A0' in text:
        return True
    
    # Check newline density - OCR often has fewer newlines
    lines = text.split('\n')
    avg_line_length = len(text) / max(len(lines), 1)
    if avg_line_length > 150:  # Very long lines suggest OCR
        return True
    
    # Check for unusual character patterns common in OCR
    unusual_chars = sum(1 for c in text if unicodedata.category(c) in ['Zs', 'Cc', 'Cf'])
    if unusual_chars / len(text) > 0.02:  # More than 2% unusual spaces/control chars
        return True
    
    # Check for typical OCR artifacts
    ocr_patterns = [
        r'\b[A-Z]{2,}\s+[A-Z]{2,}\s+[A-Z]{2,}\b',  # Multiple consecutive all-caps words
        r'[a-z][A-Z][a-z]',  # Mixed case within words (common OCR error)
        r'\s{3,}',  # Multiple spaces (OCR spacing issues)
    ]
    
    for pattern in ocr_patterns:
        if len(re.findall(pattern, text[:1000])) > 3:
            return True
    
    return False


# Pre-compiled regex patterns for performance
# Relaxed patterns for better OCR text handling
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
    
    # Section heading patterns - very relaxed for OCR/PDF text
    # Match the word anywhere in text, even as part of longer text
    'experience': re.compile(
        r'(?:WORK\s+EXPERIENCE|EXPERIENCE|EMPLOYMENT|PROFESSIONAL\s+EXPERIENCE|WORK\s+HISTORY|CAREER)',
        re.IGNORECASE
    ),
    'education': re.compile(
        r'(?:EDUCATION|ACADEMIC|QUALIFICATION|DEGREE|UNIVERSITY|COLLEGE|SCHOOL)',
        re.IGNORECASE
    ),
    'skills': re.compile(
        r'(?:SKILL|COMPETENC|EXPERTISE|ABILIT|PROFICIENC)',
        re.IGNORECASE
    ),
    'projects': re.compile(
        r'(?:PROJECT|PORTFOLIO)',
        re.IGNORECASE
    ),
    'certifications': re.compile(
        r'(?:CERTIFICATION|LICENSE|CREDENTIAL)',
        re.IGNORECASE
    ),
    'summary': re.compile(
        r'(?:SUMMARY|PROFILE|OBJECTIVE|ABOUT)',
        re.IGNORECASE
    ),
    'achievements': re.compile(
        r'(?:ACHIEVEMENT|AWARD|HONOR|ACCOMPLISHMENT)',
        re.IGNORECASE
    ),
    'volunteer': re.compile(
        r'(?:VOLUNTEER|COMMUNITY)',
        re.IGNORECASE
    ),
    'publications': re.compile(
        r'(?:PUBLICATION|RESEARCH)',
        re.IGNORECASE
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
    Now with better OCR text handling.
    
    Args:
        text: The text content to analyze
        max_chars: Maximum characters to analyze (default 5000)
    
    Returns:
        Tuple of (score, signals_dict) where signals_dict contains individual signal scores
    """
    if not text:
        return 0, {}
    
    # Normalize text for better detection
    original_text = text
    text = normalize_text_for_gate(text[:max_chars])
    
    # Detect if this is OCR-like text
    is_ocr = detect_ocr_like_text(original_text[:max_chars])
    
    signals = defaultdict(int)
    
    # Track if OCR mode for debugging
    if is_ocr:
        signals['ocr_mode'] = 1
    
    # Short text penalty - reduced for OCR text
    if len(text) < 200 and not is_ocr:
        signals['short_text_penalty'] = -10
    elif len(text) < 100:  # Only penalize very short text in OCR mode
        signals['short_text_penalty'] = -5
    
    # Contact signals (max 20 points)
    if PATTERNS['email'].search(text):
        signals['email'] = 10
    if PATTERNS['phone'].search(text):
        signals['phone'] = 5
    if PATTERNS['linkedin'].search(text):
        signals['professional_url'] = 5
    
    # Cap contact signals at 20
    contact_total = sum([signals.get('email', 0), signals.get('phone', 0), signals.get('professional_url', 0)])
    if contact_total > 20:
        scale = 20 / contact_total
        if 'email' in signals:
            signals['email'] = int(signals['email'] * scale)
        if 'phone' in signals:
            signals['phone'] = int(signals['phone'] * scale)
        if 'professional_url' in signals:
            signals['professional_url'] = int(signals['professional_url'] * scale)
    
    # Section heading signals (max 45 points - increased for better detection)
    section_scores = {
        'experience': 20,  # Increased from 15
        'education': 15,   # Increased from 10
        'skills': 15,      # Increased from 10
        'projects': 8,     # Increased from 5
        'certifications': 8,  # Increased from 5
        'summary': 8,      # Increased from 5
        'achievements': 5,  # Increased from 3
        'volunteer': 5,     # Increased from 3
        'publications': 5   # Increased from 3
    }
    
    sections_found = []
    for section, score in section_scores.items():
        if PATTERNS[section].search(text):
            # Boost section scores for OCR text since headers are harder to detect
            bonus = 3 if is_ocr and section in ['experience', 'education', 'skills'] else 1 if is_ocr else 0
            signals[f'section_{section}'] = score + bonus
            sections_found.append(section)
    
    # Cap section signals at 45 points (increased from 35/40)
    section_cap = 45
    section_total = sum(signals.get(f'section_{s}', 0) for s in sections_found)
    if section_total > section_cap:
        scale = section_cap / section_total
        for section in sections_found:
            signals[f'section_{section}'] = int(signals[f'section_{section}'] * scale)
    
    # Date patterns (max 20 points, boosted for OCR)
    year_ranges = len(PATTERNS['year_range'].findall(text))
    month_years = len(PATTERNS['month_year'].findall(text))
    standalone_years = len(PATTERNS['standalone_year'].findall(text))
    
    # Score based on date frequency (boost for OCR since dates are reliable indicators)
    if year_ranges > 0:
        signals['date_ranges'] = min(12 if is_ocr else 10, year_ranges * 3)
    if month_years > 0:
        signals['month_year_dates'] = min(6 if is_ocr else 5, month_years * 2)
    if standalone_years > 2:
        signals['year_mentions'] = min(6 if is_ocr else 5, standalone_years)
    
    # Cap date signals at 20
    date_total = signals.get('date_ranges', 0) + signals.get('month_year_dates', 0) + signals.get('year_mentions', 0)
    if date_total > 20:
        scale = 20 / date_total
        if 'date_ranges' in signals:
            signals['date_ranges'] = int(signals['date_ranges'] * scale)
        if 'month_year_dates' in signals:
            signals['month_year_dates'] = int(signals['month_year_dates'] * scale)
        if 'year_mentions' in signals:
            signals['year_mentions'] = int(signals['year_mentions'] * scale)
    
    # Bullet structure (max 10 points, reduced importance for OCR)
    lines = text.split('\n')
    bullet_lines = sum(1 for line in lines if PATTERNS['bullet'].match(line))
    if bullet_lines > 3:
        signals['bullet_structure'] = min(10 if not is_ocr else 5, bullet_lines)
    
    # Job title lexicon (max 10 points, boosted for OCR)
    job_titles = PATTERNS['job_titles'].findall(text)
    unique_titles = len(set(word.lower() for word in job_titles))
    if unique_titles > 0:
        multiplier = 3 if is_ocr else 2
        signals['job_titles'] = min(10, unique_titles * multiplier)
    
    # Calculate total score
    total_score = sum(v for k, v in signals.items() if k != 'ocr_mode')
    
    # Special bonus: If we have at least 2 critical sections + contact info, ensure passing
    critical_sections = ['section_experience', 'section_education', 'section_skills']
    critical_count = sum(1 for s in critical_sections if s in signals and signals[s] > 0)
    has_contact = ('email' in signals and signals['email'] > 0) or ('phone' in signals and signals['phone'] > 0)
    
    if critical_count >= 2 and has_contact:
        # Give a bonus to ensure this passes (bring score to at least 65)
        if total_score < 65:
            bonus = 65 - total_score
            signals['critical_sections_bonus'] = bonus
            total_score = 65
    
    # Clamp between 0 and 100
    total_score = max(0, min(100, total_score))
    
    # Convert defaultdict to regular dict for cleaner output
    signals_dict = dict(signals)
    
    return total_score, signals_dict


def is_likely_resume(text: str, threshold: int = 60, max_chars: int = 5000, is_image: bool = False) -> Tuple[bool, int, Dict[str, int]]:
    """
    Determine if the text is likely a resume based on scoring threshold.
    
    Args:
        text: The text content to analyze
        threshold: Minimum score to be considered a resume (default 60)
        max_chars: Maximum characters to analyze (default 5000)
        is_image: Whether the source is an image file (requires stricter validation)
    
    Returns:
        Tuple of (is_resume, score, signals_dict)
    """
    score, signals = score_resume_likelihood(text, max_chars)
    
    # For image files, apply stricter validation
    if is_image:
        # Require minimum text length for images (screenshots often have less text)
        if len(text) < 500:
            score = max(0, score - 20)  # Penalize short text from images
            signals['image_short_text_penalty'] = -20
        
        # Check signal diversity - require at least 3 different types of signals
        signal_types = set()
        for key in signals.keys():
            if signals[key] > 0:
                if key.startswith('section_'):
                    signal_types.add('section')
                elif key in ['email', 'phone', 'professional_url']:
                    signal_types.add('contact')
                elif key in ['date_ranges', 'month_year_dates', 'year_mentions']:
                    signal_types.add('dates')
                elif key == 'job_titles':
                    signal_types.add('job_titles')
                elif key == 'bullet_structure':
                    signal_types.add('structure')
        
        # Require at least 3 different signal types for images
        if len(signal_types) < 3:
            diversity_penalty = (3 - len(signal_types)) * 10
            score = max(0, score - diversity_penalty)
            signals['image_diversity_penalty'] = -diversity_penalty
        
        # For images, require both contact info AND experience section
        has_contact = any(signals.get(k, 0) > 0 for k in ['email', 'phone'])
        has_experience = signals.get('section_experience', 0) > 0
        
        if not (has_contact and has_experience):
            score = max(0, score - 15)  # Additional penalty
            signals['image_missing_core_penalty'] = -15
    
    is_resume = score >= threshold
    
    # Log decision and top signals
    if logger.isEnabledFor(logging.INFO):
        # Get top 3 signals
        sorted_signals = sorted(signals.items(), key=lambda x: abs(x[1]), reverse=True)[:3]
        top_signals_str = ', '.join(f"{k}={v}" for k, v in sorted_signals)
        logger.info(f"Resume Gate: score={score}, threshold={threshold}, "
                   f"is_image={is_image}, decision={'PASS' if is_resume else 'FAIL'}, "
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
    if not any(k.startswith('section_experience') for k in signals):
        missing.append("Experience")
    if not any(k.startswith('section_education') for k in signals):
        missing.append("Education")
    if not any(k.startswith('section_skills') for k in signals):
        missing.append("Skills")
    
    # Check for contact info
    has_contact = 'email' in signals or 'phone' in signals
    
    # Check for image-specific penalties
    is_image_rejection = any(k in signals for k in ['image_short_text_penalty', 'image_diversity_penalty', 'image_missing_core_penalty'])
    
    if is_image_rejection:
        if 'image_short_text_penalty' in signals:
            return "The image doesn't contain enough readable text for a resume"
        elif 'image_diversity_penalty' in signals:
            return "The image lacks the variety of content expected in a resume"
        elif 'image_missing_core_penalty' in signals:
            return "The image is missing core resume elements (contact info and experience)"
    
    if missing and not has_contact:
        return f"Your file is missing: contact information and resume sections ({', '.join(missing)})"
    elif missing:
        return f"Your file is missing: resume sections ({', '.join(missing)})"
    elif not has_contact:
        return "Your file is missing: contact information (email, phone)"
    else:
        return "Your file doesn't appear to be a structured resume"


def get_suggestion_for_rejection(signals: Dict[str, int]) -> str:
    """
    Generate a helpful suggestion based on what's missing.
    
    Args:
        signals: The signals dictionary from scoring
    
    Returns:
        A suggestion for the user
    """
    # Check for image-specific penalties
    is_image_rejection = any(k in signals for k in ['image_short_text_penalty', 'image_diversity_penalty', 'image_missing_core_penalty'])
    
    if is_image_rejection:
        if 'image_short_text_penalty' in signals:
            return "Please upload a complete resume document or a high-quality scan with all resume sections visible."
        elif 'image_diversity_penalty' in signals:
            return "Upload a full resume with multiple sections (Experience, Education, Skills, Contact info)."
        elif 'image_missing_core_penalty' in signals:
            return "Make sure your resume image includes both contact information and work experience."
    
    has_sections = any(k.startswith('section_') for k in signals)
    has_contact = 'email' in signals or 'phone' in signals
    
    if not has_sections and not has_contact:
        return "Make sure your file contains standard resume sections like Experience, Education, Skills, and contact information."
    elif not has_sections:
        return "Add clear section headers like 'Experience', 'Education', and 'Skills' to your resume."
    elif not has_contact:
        return "Include your email address and phone number in your resume."
    else:
        return "Ensure your resume has a clear structure with standard sections and formatting."