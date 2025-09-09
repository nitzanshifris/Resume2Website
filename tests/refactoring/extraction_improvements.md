# Solutions for Missed Items in CV Extraction

## 1. Missing Demographic Fields (Place of Birth, Nationality, Driving License)

### Problem
These fields appear in a "Details" section but aren't being extracted into the contact section.

### Solution
**Add demographic fields to ContactSectionFooter schema and enhance extraction:**

```python
# In src/core/schemas/unified_nullable.py - Update ContactSectionFooter
class ContactSectionFooter(BaseModel):
    # Existing fields...
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[LocationDetails] = None
    
    # ADD NEW FIELDS:
    placeOfBirth: Optional[str] = None
    nationality: Optional[str] = None
    drivingLicense: Optional[str] = None
    dateOfBirth: Optional[str] = None  # Also useful
```

**Update the Contact prompt template:**

```python
# In src/core/cv_extraction/prompt_templates.py - ContactTemplate
class ContactTemplate(BasePromptTemplate):
    def format(self, section_schema: Any, raw_text: str) -> str:
        return f'''Extract contact information including:
- Email, phone, location/address
- Professional links (LinkedIn, GitHub, portfolio, etc.)
- Availability status
- DEMOGRAPHIC DETAILS: Place of birth, Nationality, Driving license, Date of birth
- Look for sections labeled "Details", "Personal Information", or similar

Look for patterns like:
- "Place of birth: [location]"
- "Nationality: [country/citizenship]"
- "Driving license: [type/class]"
- "DOB:", "Born:", "Date of birth:"

Schema: {json.dumps(section_schema.model_json_schema(), indent=2)}

Text to extract from:
{raw_text}

Return valid JSON for the contact section.'''
```

---

## 2. Missing Externships Section

### Problem
"Externships" is an uncommon section name not in our 17 standard sections.

### Solution A: **Add as a new section type**

```python
# In src/core/schemas/unified_nullable.py - Add new schema
class ExternshipsSection(BaseModel):
    sectionTitle: Optional[str] = "Externships"
    externshipItems: Optional[List[ExternshipItem]] = None

class ExternshipItem(BaseModel):
    role: Optional[str] = None
    organization: Optional[str] = None
    location: Optional[LocationDetails] = None
    dateRange: Optional[DateRange] = None
    description: Optional[str] = None
    type: Optional[str] = None  # "Job shadowing", "Observation", etc.
```

### Solution B: **Map to existing experience section (Recommended)**

```python
# In src/core/cv_extraction/enhancement_processor.py
class EnhancementProcessor:
    @staticmethod
    def merge_externships_to_experience(enhanced: Dict[str, Any]) -> Dict[str, Any]:
        """Look for externship-like content and merge with experience."""
        
        # Search for externship patterns in text
        externship_patterns = [
            r'[Ee]xternship[s]?.*?at\s+([^,\n]+)',
            r'[Jj]ob\s+[Ss]hadowing.*?at\s+([^,\n]+)',
            r'[Oo]bservation.*?at\s+([^,\n]+)'
        ]
        
        # If found, add to experience items with type "Externship"
        # This keeps all work-related items in one place
        
        return enhanced
```

---

## 3. Missing Extra-curricular Activities

### Problem
Extra-curricular activities aren't recognized as a distinct section.

### Solution: **Enhance the volunteer section to include activities**

```python
# In src/core/schemas/unified_nullable.py - Update VolunteerExperienceSection
class VolunteerExperienceSection(BaseModel):
    sectionTitle: Optional[str] = "Volunteer & Activities"
    volunteerItems: Optional[List[VolunteerItem]] = None
    extracurricularItems: Optional[List[ExtracurricularItem]] = None  # ADD

class ExtracurricularItem(BaseModel):
    activity: Optional[str] = None
    organization: Optional[str] = None
    role: Optional[str] = None  # "Captain", "Member", etc.
    dateRange: Optional[DateRange] = None
    achievements: Optional[List[str]] = None
    description: Optional[str] = None
```

**Update the Volunteer prompt template:**

```python
# In src/core/cv_extraction/prompt_templates.py
class VolunteerTemplate(BasePromptTemplate):
    def format(self, section_schema: Any, raw_text: str) -> str:
        return f'''Extract volunteer work AND extra-curricular activities including:
- Volunteer positions and community service
- Sports teams, clubs, student organizations
- Leadership roles in activities
- Look for: "Extra-curricular", "Activities", "Athletics", "Clubs"

For sports/activities, capture:
- Team/club name
- Position/role (Captain, Member, etc.)
- Achievements (Championships, awards)
- Duration

Schema: {json.dumps(section_schema.model_json_schema(), indent=2)}
Text: {raw_text}'''
```

---

## 4. Location Attribution Confusion

### Problem
Columbus State University location mixed between Boston and Atlanta.

### Solution: **Add location validation logic**

```python
# In src/core/cv_extraction/post_processor.py
class PostProcessor:
    @staticmethod
    def validate_and_reconcile_locations(cv_dict: Dict[str, Any]) -> Dict[str, Any]:
        """Cross-reference and validate location consistency."""
        
        # Build institution -> location mapping from education
        institution_locations = {}
        if cv_dict.get('education'):
            for edu in cv_dict['education'].get('educationItems', []):
                if edu.get('institution') and edu.get('location'):
                    institution_locations[edu['institution']] = edu['location']
        
        # Validate experience locations against known institutions
        if cv_dict.get('experience'):
            for exp in cv_dict['experience'].get('experienceItems', []):
                company = exp.get('companyName', '')
                # If company is an educational institution, use education location
                if company in institution_locations:
                    exp['location'] = institution_locations[company]
        
        return cv_dict
```

---

## 5. Partially Captured Athletics Achievement

### Problem
Only captured "State Champions 2016", missing "Captain" role and "Runners Up 2014".

### Solution: **Enhance achievement extraction patterns**

```python
# In src/core/cv_extraction/extraction_config.py
class ExtractionConfig:
    # Add patterns for multi-part achievements
    ACHIEVEMENT_PATTERNS = [
        # Existing patterns...
        
        # Add complex achievement patterns
        r'[Cc]aptain\s+of\s+([^(]+)\s*\(([^)]+)\)',  # Captain of X (achievements)
        r'([^,]+)\s+[Cc]hampions?\s+in\s+(\d{4})',    # Team Champions in YYYY
        r'[Rr]unners?\s+[Uu]p\s+in\s+(\d{4})',        # Runners Up in YYYY
    ]
```

**Enhanced achievement extraction:**

```python
# In src/core/cv_extraction/section_extractor.py
def extract_complex_achievements(text: str) -> List[Dict]:
    """Extract multi-part achievements like sports records."""
    achievements = []
    
    # Look for patterns like "Captain of Team (Achievement 1, Achievement 2)"
    captain_pattern = r'[Cc]aptain\s+of\s+([^(]+)\s*\(([^)]+)\)'
    matches = re.findall(captain_pattern, text)
    
    for team, achievements_text in matches:
        # Parse the achievements within parentheses
        parts = achievements_text.split(',')
        for part in parts:
            if 'champions' in part.lower():
                achievements.append({
                    'value': 'State Champions',
                    'label': f'Captain of {team.strip()}',
                    'timeframe': re.search(r'\d{4}', part).group() if re.search(r'\d{4}', part) else None
                })
            elif 'runners up' in part.lower():
                achievements.append({
                    'value': 'Runners Up',
                    'label': f'{team.strip()}',
                    'timeframe': re.search(r'\d{4}', part).group() if re.search(r'\d{4}', part) else None
                })
    
    return achievements
```

---

## Implementation Priority

### Quick Wins (30 minutes):
1. ✅ Add demographic fields to ContactSectionFooter schema
2. ✅ Update Contact prompt template
3. ✅ Add achievement extraction patterns

### Medium Effort (1-2 hours):
4. ✅ Add location validation logic
5. ✅ Enhance volunteer section for activities
6. ✅ Add externship detection patterns

### Testing Required:
- Test with CVs containing these fields
- Verify backward compatibility
- Update unit tests for new fields

---

## Complete Solution Package

```python
# Create a new enhancement module: demographic_extractor.py
"""
Enhanced extraction for demographic and uncommon CV sections
"""

class DemographicExtractor:
    """Extract additional demographic and personal details."""
    
    DEMOGRAPHIC_PATTERNS = {
        'placeOfBirth': [
            r'[Pp]lace of [Bb]irth[:\s]+([^\n]+)',
            r'[Bb]orn in[:\s]+([^\n]+)',
            r'[Bb]irthplace[:\s]+([^\n]+)'
        ],
        'nationality': [
            r'[Nn]ationality[:\s]+([^\n]+)',
            r'[Cc]itizenship[:\s]+([^\n]+)',
            r'[Nn]ational[:\s]+([^\n]+)'
        ],
        'drivingLicense': [
            r'[Dd]riving [Ll]icen[cs]e[:\s]+([^\n]+)',
            r'[Dd]river\'s [Ll]icen[cs]e[:\s]+([^\n]+)',
            r'[Ll]icen[cs]e[:\s]+([^\n]+)'
        ]
    }
    
    @staticmethod
    def extract_demographics(raw_text: str) -> Dict[str, Optional[str]]:
        """Extract demographic fields from CV text."""
        demographics = {}
        
        for field, patterns in DemographicExtractor.DEMOGRAPHIC_PATTERNS.items():
            for pattern in patterns:
                match = re.search(pattern, raw_text)
                if match:
                    demographics[field] = match.group(1).strip()
                    break
        
        return demographics
    
    @staticmethod
    def enhance_contact_with_demographics(contact_data: Dict, raw_text: str) -> Dict:
        """Add demographic fields to contact section."""
        demographics = DemographicExtractor.extract_demographics(raw_text)
        
        if demographics:
            contact_data.update(demographics)
        
        return contact_data
```

Then integrate into the enhancement pipeline:

```python
# In enhancement_processor.py
from .demographic_extractor import DemographicExtractor

class EnhancementProcessor:
    @staticmethod
    def enhance_all(data: Dict[str, Any], raw_text: str) -> Dict[str, Any]:
        # Existing enhancements...
        
        # Add demographic enhancement
        if data.get('contact'):
            data['contact'] = DemographicExtractor.enhance_contact_with_demographics(
                data['contact'], raw_text
            )
        
        return data
```

This solution provides a comprehensive fix for all missed items while maintaining the clean architecture of the refactored system!