"""
Configuration for CV Data Extraction
Centralizes all hardcoded values and patterns
"""
import re
from dataclasses import dataclass, field
from typing import List, Dict, Pattern


@dataclass
class ExtractionConfig:
    """Configuration for CV extraction process."""
    
    # Model configuration
    MODEL_NAME: str = "claude-4-opus"
    TEMPERATURE: float = 0.0  # Deterministic responses for consistency
    MAX_TOKENS: int = 4000  # Sufficient for CV sections without hitting limits
    TOP_P: float = 0.1  # Low diversity for predictable extraction
    
    # Retry configuration
    MAX_RETRIES: int = 3  # Balance between reliability and speed
    RETRY_MIN_WAIT: int = 4  # Minimum seconds between retries (rate limit safety)
    RETRY_MAX_WAIT: int = 10  # Cap retry wait to avoid long delays
    RETRY_MULTIPLIER: int = 1  # Linear backoff (not exponential) for predictability
    
    # Extraction configuration
    TOTAL_SECTIONS: int = 17  # Number of CV sections we attempt to extract
    CONFIDENCE_THRESHOLD: float = 0.8  # Minimum confidence for "good" extraction
    
    # Technology patterns for extraction
    TECH_PATTERNS: List[str] = field(default_factory=lambda: [
        r'\b(Excel|PowerPoint|Word|Outlook|Office|Teams|SharePoint|OneNote)\b',
        r'\b(Python|Java|JavaScript|TypeScript|C\+\+|C#|Ruby|Go|Swift|Kotlin|Rust|PHP|Scala|R|MATLAB)\b',
        r'\b(React|Angular|Vue|Svelte|Next\.js|Nuxt|Django|Flask|FastAPI|Spring|Node\.js|Express|Rails)\b',
        r'\b(AWS|Azure|GCP|Docker|Kubernetes|Jenkins|CircleCI|GitLab CI|GitHub Actions|Terraform)\b',
        r'\b(SQL|MySQL|PostgreSQL|MongoDB|Redis|Cassandra|DynamoDB|Firebase|Elasticsearch)\b',
        r'\b(Git|GitHub|GitLab|Bitbucket|Jira|Confluence|Slack|Trello|Asana)\b',
        r'\b(TensorFlow|PyTorch|Keras|scikit-learn|pandas|NumPy|Jupyter|Tableau|Power BI)\b'
    ])
    
    # Availability patterns for extraction from summary
    AVAILABILITY_PATTERNS: List[str] = field(default_factory=lambda: [
        r'(Willing to travel[^.]*)',
        r'(Available for remote work[^.]*)',
        r'(Open to relocation[^.]*)',
        r'(Available immediately[^.]*)',
        r'(Currently seeking[^.]*)',
        r'(Open to[^.]*opportunities)',
        r'(Ready to start[^.]*)',
        r'(Flexible on location[^.]*)',
        r'(Can work[^.]*remotely)',
        r'(Authorized to work in[^.]*)'
    ])
    
    # Professional title keywords for extraction
    TITLE_KEYWORDS: List[str] = field(default_factory=lambda: [
        'engineer', 'developer', 'manager', 'designer', 'analyst',
        'consultant', 'specialist', 'architect', 'lead', 'senior',
        'director', 'coordinator', 'administrator', 'officer', 'executive',
        'scientist', 'researcher', 'professor', 'teacher', 'instructor',
        'technician', 'associate', 'assistant', 'advisor', 'strategist'
    ])
    
    # Section-specific prompts exclusions (for cross-contamination prevention)
    SKILLS_EXCLUSIONS: List[str] = field(default_factory=lambda: [
        "Language names (English, Spanish, French, etc.) → These belong in Languages section",
        "Certification titles (CompTIA A+, AWS Certified, etc.) → These belong in Certifications section",
        "Course names or training programs → These belong in Courses/Education section",
        "Job titles or roles → These belong in Experience section"
    ])
    
    LANGUAGES_EXCLUSIONS: List[str] = field(default_factory=lambda: [
        "Programming languages (Python, JavaScript, Java, etc.) → These belong in Skills section",
        "Technical terms or software names → These belong in Skills section",
        "Framework names → These belong in Skills section"
    ])
    
    CERTIFICATIONS_EXCLUSIONS: List[str] = field(default_factory=lambda: [
        "General skills without certification → These belong in Skills section",
        "Course completions without formal certification → These belong in Courses section",
        "Language proficiencies → These belong in Languages section",
        "Educational degrees → These belong in Education section"
    ])
    
    # Limits and thresholds
    MAX_CAREER_HIGHLIGHTS: int = 5  # Prevent duplication with achievements section
    MIN_ACHIEVEMENT_LENGTH: int = 10  # Filter out trivial achievements
    MAX_ACHIEVEMENT_LENGTH: int = 200  # Keep achievements concise and readable
    
    # Name patterns for extraction
    NAME_PATTERN: str = r'^[A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?$'  # Firstname Lastname [Middlename]
    
    # Text processing limits
    MAX_LINES_FOR_NAME: int = 5  # Name typically in first 5 lines of CV
    MAX_LINES_FOR_TITLE: int = 10  # Professional title within first 10 lines
    
    # Confidence calculation weights (must sum to 1.0)
    CONFIDENCE_WEIGHTS: Dict[str, float] = field(default_factory=lambda: {
        'completeness': 0.4,  # How many sections were extracted
        'coverage': 0.3,      # How much of original text is represented
        'validation': 0.3     # Quality of dates and data structure
    })
    
    # Institution known locations (for fixing missing data)
    KNOWN_INSTITUTIONS: Dict[str, Dict[str, str]] = field(default_factory=lambda: {
        'Project Management Institute (PMI)': {
            'city': 'Newtown Square',
            'state': 'Pennsylvania',
            'country': 'USA'
        }
    })
    
    # Compiled regex patterns (for performance)
    _compiled_patterns: Dict[str, List[Pattern]] = field(default_factory=dict)
    
    def get_compiled_tech_patterns(self) -> List[Pattern]:
        """Get compiled technology patterns, caching for reuse."""
        if 'tech' not in self._compiled_patterns:
            self._compiled_patterns['tech'] = [
                re.compile(pattern, re.IGNORECASE) for pattern in self.TECH_PATTERNS
            ]
        return self._compiled_patterns['tech']
    
    def get_compiled_availability_patterns(self) -> List[Pattern]:
        """Get compiled availability patterns, caching for reuse."""
        if 'availability' not in self._compiled_patterns:
            self._compiled_patterns['availability'] = [
                re.compile(pattern, re.IGNORECASE) for pattern in self.AVAILABILITY_PATTERNS
            ]
        return self._compiled_patterns['availability']
    
    def get_compiled_name_pattern(self) -> Pattern:
        """Get compiled name pattern, caching for reuse."""
        if 'name' not in self._compiled_patterns:
            self._compiled_patterns['name'] = [re.compile(self.NAME_PATTERN)]
        return self._compiled_patterns['name'][0]


# Create a singleton instance
extraction_config = ExtractionConfig()