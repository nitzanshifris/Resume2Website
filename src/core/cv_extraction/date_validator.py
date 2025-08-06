"""
Date validation and logic checking for CV data
Detects overlapping employment, impossible education dates, etc.
"""
import logging
from typing import Dict, Any, List, Optional, Tuple
from datetime import datetime
import re

logger = logging.getLogger(__name__)


class DateValidator:
    """Validates and fixes date-related logical errors in CV data"""
    
    def __init__(self):
        self.current_year = datetime.now().year
        self.current_month = datetime.now().month
    
    def parse_date(self, date_str: str) -> Optional[Tuple[int, int]]:
        """Parse date string to (year, month) tuple"""
        if not date_str or date_str.lower() in ['present', 'current', 'now', 'ongoing']:
            return (self.current_year, self.current_month)
        
        # Try different date formats
        patterns = [
            r'(\d{4})-(\d{1,2})',  # 2021-05
            r'(\w+)\s+(\d{4})',     # May 2021
            r'(\d{1,2})/(\d{4})',   # 05/2021
            r'(\d{4})',             # 2021 only
        ]
        
        for pattern in patterns:
            match = re.search(pattern, date_str)
            if match:
                if pattern == r'(\w+)\s+(\d{4})':
                    # Month name format
                    month_str, year = match.groups()
                    month = self._parse_month(month_str)
                    if month:
                        return (int(year), month)
                elif pattern == r'(\d{4})':
                    # Year only
                    return (int(match.group(1)), 1)  # Default to January
                else:
                    # Numeric formats
                    groups = match.groups()
                    if len(groups) == 2:
                        if pattern == r'(\d{4})-(\d{1,2})':
                            return (int(groups[0]), int(groups[1]))
                        else:  # MM/YYYY format
                            return (int(groups[1]), int(groups[0]))
        
        return None
    
    def _parse_month(self, month_str: str) -> Optional[int]:
        """Parse month name to number"""
        months = {
            'january': 1, 'jan': 1,
            'february': 2, 'feb': 2,
            'march': 3, 'mar': 3,
            'april': 4, 'apr': 4,
            'may': 5,
            'june': 6, 'jun': 6,
            'july': 7, 'jul': 7,
            'august': 8, 'aug': 8,
            'september': 9, 'sep': 9, 'sept': 9,
            'october': 10, 'oct': 10,
            'november': 11, 'nov': 11,
            'december': 12, 'dec': 12
        }
        return months.get(month_str.lower())
    
    def check_date_overlap(self, item1: Dict[str, Any], item2: Dict[str, Any]) -> Optional[str]:
        """Check if two date ranges overlap"""
        # Extract dates from dateRange
        start1 = item1.get('dateRange', {}).get('startDate')
        end1 = item1.get('dateRange', {}).get('endDate')
        start2 = item2.get('dateRange', {}).get('startDate')
        end2 = item2.get('dateRange', {}).get('endDate')
        
        if not all([start1, start2]):
            return None
        
        # Parse dates
        start1_parsed = self.parse_date(start1)
        end1_parsed = self.parse_date(end1) if end1 else (self.current_year, self.current_month)
        start2_parsed = self.parse_date(start2)
        end2_parsed = self.parse_date(end2) if end2 else (self.current_year, self.current_month)
        
        if not all([start1_parsed, start2_parsed]):
            return None
        
        # Check for overlap
        if (start1_parsed <= end2_parsed and start2_parsed <= end1_parsed):
            overlap_start = max(start1_parsed, start2_parsed)
            overlap_end = min(end1_parsed, end2_parsed)
            
            # Calculate overlap duration in months
            overlap_months = (overlap_end[0] - overlap_start[0]) * 12 + (overlap_end[1] - overlap_start[1])
            
            if overlap_months > 1:  # More than 1 month overlap
                return f"Overlap of {overlap_months} months between {start1} and {end2}"
        
        return None
    
    def validate_experience_dates(self, cv_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Validate experience dates for overlaps"""
        issues = []
        
        if not cv_data.get('experience') or not cv_data['experience'].get('experienceItems'):
            return issues
        
        experiences = cv_data['experience']['experienceItems']
        
        for i, exp1 in enumerate(experiences):
            for j, exp2 in enumerate(experiences[i+1:], i+1):
                overlap = self.check_date_overlap(exp1, exp2)
                if overlap:
                    issue = {
                        'type': 'experience_overlap',
                        'severity': 'warning',
                        'items': [
                            f"{exp1.get('jobTitle', 'Unknown')} at {exp1.get('companyName', 'Unknown')}",
                            f"{exp2.get('jobTitle', 'Unknown')} at {exp2.get('companyName', 'Unknown')}"
                        ],
                        'message': f"Possible overlap: {overlap}",
                        'suggestion': 'Verify if these positions were held concurrently (e.g., part-time or consulting)'
                    }
                    issues.append(issue)
                    logger.warning(f"Date overlap detected: {issue['message']}")
        
        return issues
    
    def validate_education_dates(self, cv_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Validate education dates and detect misclassifications"""
        issues = []
        
        if not cv_data.get('education') or not cv_data['education'].get('educationItems'):
            return issues
        
        # Filter out None items first
        education_items = [item for item in cv_data['education']['educationItems'] if item is not None]
        
        for edu in education_items:
            if not edu:  # Skip None items
                continue
            
            # Ensure edu is a dictionary
            if not isinstance(edu, dict):
                logger.warning(f"Skipping non-dict education item: {type(edu)}")
                continue
                
            # Check for certifications in education
            degree = (edu.get('degree') or '').lower()
            institution = (edu.get('institution') or '').lower()
            
            # Common certification patterns
            cert_patterns = [
                'certified', 'certification', 'certificate',
                'adobe certified', 'microsoft certified', 'aws certified',
                'google certified', 'cisco certified', 'oracle certified',
                'scrum master', 'pmp', 'capm', 'itil', 'comptia'
            ]
            
            is_certification = any(pattern in degree for pattern in cert_patterns)
            is_certification = is_certification or any(pattern in institution for pattern in ['adobe', 'microsoft', 'google', 'cisco', 'oracle'])
            
            if is_certification:
                issue = {
                    'type': 'misclassified_certification',
                    'severity': 'error',
                    'item': f"{edu.get('degree', 'Unknown')} from {edu.get('institution', 'Unknown')}",
                    'message': 'Certification found in education section',
                    'suggestion': 'Move to certifications section',
                    'data': edu
                }
                issues.append(issue)
                logger.error(f"Misclassification: {issue['message']} - {issue['item']}")
            
            # Double-check edu is still valid (defensive programming)
            if not edu or not isinstance(edu, dict):
                logger.warning("Education item became None or non-dict during processing")
                continue
                
            # Check for illogical dates
            date_range = edu.get('dateRange', {}) if edu else {}
            start_date = date_range.get('startDate') if date_range else None
            end_date = date_range.get('endDate') if date_range else None
            
            if start_date and end_date:
                start_parsed = self.parse_date(start_date)
                end_parsed = self.parse_date(end_date)
                
                if start_parsed and end_parsed:
                    # Check if end is before start
                    if end_parsed < start_parsed:
                        issue = {
                            'type': 'invalid_date_range',
                            'severity': 'error',
                            'item': edu.get('degree', 'Unknown'),
                            'message': f'End date ({end_date}) is before start date ({start_date})',
                            'suggestion': 'Swap dates or verify correct dates'
                        }
                        issues.append(issue)
                    
                    # Check for single-day degrees (likely certifications)
                    if start_parsed == end_parsed and 'degree' in degree:
                        issue = {
                            'type': 'single_day_degree',
                            'severity': 'warning',
                            'item': edu.get('degree', 'Unknown'),
                            'message': 'Academic degree completed in a single day',
                            'suggestion': 'Verify if this is a certification rather than a degree'
                        }
                        issues.append(issue)
        
        return issues
    
    def detect_hallucinations(self, cv_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Detect likely hallucinations in the data"""
        issues = []
        
        # Check for React in fashion designer CV
        if cv_data.get('experience') and cv_data['experience'].get('experienceItems'):
            # Filter out None items first
            experience_items = [item for item in cv_data['experience']['experienceItems'] if item is not None]
            
            for exp in experience_items:
                if not isinstance(exp, dict):
                    continue
                    
                company = (exp.get('companyName') or '').lower()
                job_title = (exp.get('jobTitle') or '').lower()
                techs = exp.get('technologiesUsed', [])
                
                # Fashion-related keywords
                fashion_keywords = ['fashion', 'designer', 'apparel', 'clothing', 'textile', 'garment']
                is_fashion = any(kw in job_title for kw in fashion_keywords) or any(kw in company for kw in fashion_keywords)
                
                # Tech keywords that don't belong in fashion
                suspicious_tech = ['react', 'angular', 'vue', 'django', 'flask', 'node.js', 'kubernetes', 'docker']
                
                if is_fashion and techs:
                    for tech in techs:
                        if tech.lower() in suspicious_tech:
                            issue = {
                                'type': 'suspicious_technology',
                                'severity': 'warning',
                                'item': f"{tech} in {job_title} at {exp.get('companyName', 'Unknown')}",
                                'message': f"Unlikely technology '{tech}' for fashion role",
                                'suggestion': 'Remove unless verified'
                            }
                            issues.append(issue)
                            logger.warning(f"Suspicious technology: {issue['message']}")
        
        return issues
    
    def clean_coursework_list(self, cv_data: Dict[str, Any]) -> Dict[str, Any]:
        """Clean irrelevant items from coursework lists"""
        if cv_data.get('education') and cv_data['education'].get('educationItems'):
            for edu in cv_data['education']['educationItems']:
                if not edu or not isinstance(edu, dict):
                    continue
                if edu.get('relevantCoursework'):
                    original = edu['relevantCoursework']
                    # Filter out non-course items
                    cleaned = []
                    
                    for item in original:
                        # Skip items that are just descriptors
                        skip_patterns = [
                            r'^(advanced|intermediate|beginner|basic)\s*level$',
                            r'^level\s*\d+$',
                            r'^\d+\s*credits?$',
                            r'^(and|or|with)$'
                        ]
                        
                        should_skip = False
                        for pattern in skip_patterns:
                            if re.match(pattern, item.lower().strip()):
                                should_skip = True
                                break
                        
                        if not should_skip:
                            cleaned.append(item)
                    
                    if len(cleaned) < len(original):
                        edu['relevantCoursework'] = cleaned
                        logger.info(f"Cleaned coursework list: removed {len(original) - len(cleaned)} items")
        
        return cv_data
    
    def validate_and_fix_cv_data(self, cv_data: Dict[str, Any]) -> Tuple[Dict[str, Any], List[Dict[str, Any]]]:
        """
        Validate CV data and apply fixes where possible
        
        Returns:
            Tuple of (fixed_cv_data, issues_list)
        """
        all_issues = []
        
        # Run all validations
        all_issues.extend(self.validate_experience_dates(cv_data))
        all_issues.extend(self.validate_education_dates(cv_data))
        all_issues.extend(self.detect_hallucinations(cv_data))
        
        # Apply automatic fixes
        cv_data = self.clean_coursework_list(cv_data)
        
        # Move misclassified certifications
        cv_data = self._move_certifications(cv_data, all_issues)
        
        # Remove suspicious technologies
        cv_data = self._remove_suspicious_tech(cv_data, all_issues)
        
        return cv_data, all_issues
    
    def _move_certifications(self, cv_data: Dict[str, Any], issues: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Move misclassified certifications from education to certifications"""
        # Filter for certification issues and ensure data is not None
        cert_issues = [i for i in issues if i['type'] == 'misclassified_certification' and i.get('data') is not None]
        
        if not cert_issues:
            return cv_data
        
        # Ensure certifications section exists
        if not cv_data.get('certifications'):
            cv_data['certifications'] = {
                'sectionTitle': 'Certifications',
                'certificationItems': []
            }
        
        # Move items
        for issue in cert_issues:
            edu_item = issue['data']
            
            # Skip if edu_item is None
            if not edu_item:
                logger.warning(f"Skipping None education item in certification move")
                continue
            
            # Create certification item
            cert_item = {
                'title': edu_item.get('degree', ''),
                'issuingOrganization': edu_item.get('institution', ''),
                'issueDate': edu_item.get('dateRange', {}).get('startDate') if edu_item.get('dateRange') else None,
                'expirationDate': edu_item.get('dateRange', {}).get('endDate') if edu_item.get('dateRange') else None,
                'credentialId': None,
                'verificationUrl': None
            }
            
            # Add to certifications
            cv_data['certifications']['certificationItems'].append(cert_item)
            
            # Remove from education
            if cv_data.get('education') and cv_data['education'].get('educationItems'):
                cv_data['education']['educationItems'] = [
                    e for e in cv_data['education']['educationItems']
                    if e != edu_item
                ]
            
            logger.info(f"Moved certification: {cert_item['title']}")
        
        return cv_data
    
    def _remove_suspicious_tech(self, cv_data: Dict[str, Any], issues: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Remove suspicious technologies from experience"""
        tech_issues = [i for i in issues if i['type'] == 'suspicious_technology']
        
        if not tech_issues and cv_data.get('experience') and cv_data['experience'].get('experienceItems'):
            # Filter out None items first
            experience_items = [item for item in cv_data['experience']['experienceItems'] if item is not None]
            
            for exp in experience_items:
                if not isinstance(exp, dict):
                    continue
                    
                if exp.get('technologiesUsed'):
                    original_count = len(exp['technologiesUsed'])
                    # Remove suspicious techs
                    exp['technologiesUsed'] = [
                        tech for tech in exp['technologiesUsed']
                        if not any(
                            tech.lower() in issue['item'].lower() 
                            for issue in tech_issues
                        )
                    ]
                    removed = original_count - len(exp['technologiesUsed'])
                    if removed > 0:
                        logger.info(f"Removed {removed} suspicious technologies from {exp.get('companyName', 'Unknown')}")
        
        return cv_data


# Singleton instance
date_validator = DateValidator()