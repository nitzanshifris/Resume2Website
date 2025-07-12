"""
Role Inference for Projects and Speaking Engagements
Infers roles based on project descriptions and context
"""
import re
from typing import Optional

def infer_project_role(title: str, description: str = None) -> Optional[str]:
    """
    Infer a role based on project title and description
    
    Args:
        title: Project title
        description: Project description (optional)
        
    Returns:
        Inferred role or None
    """
    if not title:
        return None
    
    title_lower = title.lower()
    desc_lower = (description or "").lower()
    combined = f"{title_lower} {desc_lower}"
    
    # Role patterns
    role_patterns = {
        # Design roles
        r'design(?:ed|ing)?\s+(?:a|the)?\s*system': 'System Designer',
        r'design(?:ed|ing)?\s+(?:a|the)?\s*routing': 'System Designer',
        r'fashion\s+design|clothing|clothesline': 'Fashion Designer',
        r'design(?:ed|ing)?\s+(?:a|the)?\s*(?:smart|intelligent)': 'Solution Designer',
        
        # Development/Creation roles
        r'develop(?:ed|ing)?\s+(?:a|the)?\s*collection': 'Collection Developer',
        r'creat(?:ed|ing)?\s+(?:a|the)?\s*business\s+plan': 'Business Strategist',
        r'creat(?:ed|ing)?\s+(?:a|the)?\s*collection': 'Collection Creator',
        
        # Management roles
        r'(?:ran|managed?|led)\s+(?:advertising|relationships?)': 'Project Manager',
        r'manag(?:ed|ing)?\s+(?:a|the)?\s*team': 'Team Manager',
        r'supervis(?:ed|ing)': 'Supervisor',
        
        # Writing/Documentation roles
        r'wrote?\s+(?:reports?|documents?)': 'Technical Writer',
        r'author(?:ed)?': 'Author',
        r'present(?:ed|ing)?\s+(?:initial)?\s*concepts?': 'Presenter',
        
        # Speaking/Training roles
        r'educat(?:ed|ing)?\s+(?:employees|staff)': 'Trainer',
        r'training\s+sessions?': 'Trainer',
        r'spoke?\s+(?:at|about)': 'Speaker',
        
        # General patterns
        r'reports?\s+and\s+presentations?': 'Author/Presenter',
        r'concept\s+(?:reports?|presentations?)': 'Concept Developer',
    }
    
    # Check each pattern
    for pattern, role in role_patterns.items():
        if re.search(pattern, combined):
            return role
    
    # Default roles based on keywords
    if 'design' in title_lower:
        return 'Designer'
    elif 'develop' in title_lower:
        return 'Developer'
    elif 'manage' in title_lower or 'ran' in title_lower:
        return 'Manager'
    elif 'wrote' in title_lower or 'report' in title_lower:
        return 'Author'
    elif 'present' in title_lower:
        return 'Presenter'
    
    return None


def infer_speaking_event_name(topic: str, venue: str = None, role: str = None) -> Optional[str]:
    """
    Infer a generic event name based on topic, venue, and role
    
    Args:
        topic: Speaking topic
        venue: Event venue (optional)
        role: Speaker's role (optional)
        
    Returns:
        Inferred event name or None
    """
    if not topic:
        return None
    
    topic_lower = topic.lower()
    
    # Internal training/education
    if any(word in topic_lower for word in ['training', 'education', 'understanding', 'project plans']):
        if venue and any(word in venue.lower() for word in ['internal', 'company']):
            return "Internal Training Sessions"
        return "Professional Training Workshop"
    
    # Concept presentations
    if any(word in topic_lower for word in ['concept', 'initial', 'proposal']):
        return "Project Concept Presentations"
    
    # Technical presentations
    if any(word in topic_lower for word in ['technical', 'system', 'design', 'implementation']):
        return "Technical Presentation"
    
    # Based on role
    if role:
        role_lower = role.lower()
        if 'educator' in role_lower or 'trainer' in role_lower:
            return "Educational Workshop"
        elif 'presenter' in role_lower:
            return "Professional Presentation"
    
    # Default based on venue
    if venue:
        if 'university' in venue.lower():
            return "Academic Presentation"
        elif 'conference' in venue.lower():
            return "Conference Talk"
        elif any(company in venue.lower() for company in ['inc', 'corp', 'company', 'llc']):
            return "Corporate Presentation"
    
    return "Professional Speaking Engagement"


def infer_field_of_study(degree: str, institution: str = None) -> Optional[str]:
    """
    Infer field of study from degree name when not explicitly stated
    
    Args:
        degree: Degree or certification name
        institution: Institution name (optional)
        
    Returns:
        Inferred field of study or None
    """
    if not degree:
        return None
    
    degree_lower = degree.lower()
    
    # Common certification to field mappings
    certification_fields = {
        'capm': 'Project Management',
        'certified associate in project management': 'Project Management',
        'pmp': 'Project Management',
        'project management professional': 'Project Management',
        'scrum master': 'Agile Project Management',
        'aws certified': 'Cloud Computing',
        'cisco certified': 'Network Engineering',
        'microsoft certified': 'Information Technology',
        'google certified': 'Digital Marketing',
        'adobe certified expert': 'Digital Design',
        'cpa': 'Accounting',
        'cfa': 'Finance',
        'six sigma': 'Quality Management',
    }
    
    # Check certifications
    for cert, field in certification_fields.items():
        if cert in degree_lower:
            return field
    
    # Check for explicit field mentions in degree
    field_patterns = {
        r'computer science': 'Computer Science',
        r'software engineering': 'Software Engineering',
        r'data science': 'Data Science',
        r'business administration': 'Business Administration',
        r'electrical engineering': 'Electrical Engineering',
        r'mechanical engineering': 'Mechanical Engineering',
        r'civil engineering': 'Civil Engineering',
        r'industrial engineering': 'Industrial Engineering',
        r'fashion design': 'Fashion Design',
        r'graphic design': 'Graphic Design',
        r'marketing': 'Marketing',
        r'finance': 'Finance',
        r'accounting': 'Accounting',
        r'psychology': 'Psychology',
        r'education': 'Education',
        r'nursing': 'Nursing',
        r'medicine': 'Medicine',
        r'law|juris doctor': 'Law',
    }
    
    for pattern, field in field_patterns.items():
        if re.search(pattern, degree_lower):
            return field
    
    # Institution-based inference
    if institution:
        inst_lower = institution.lower()
        if 'project management institute' in inst_lower:
            return 'Project Management'
        elif 'adobe' in inst_lower:
            return 'Digital Design'
        elif 'microsoft' in inst_lower:
            return 'Information Technology'
    
    return None