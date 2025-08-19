# Backend Changes for Smart Card Display Mode Support

## Overview
The frontend template uses Smart Cards across MULTIPLE sections (not just projects). These cards can display content in 9 different modes based on the type of URL/content available. The backend needs to be updated to properly extract, categorize, and structure this data for ALL sections using smart cards.

## Sections Using Smart Cards
1. **Experience** (in accordion layout)
2. **Projects** 
3. **Achievements**
4. **Certifications**
5. **Volunteer**
6. **Courses**
7. **Publications**
8. **Speaking**
9. **Memberships**
10. **Hobbies** (special case - uses 'simple' text variant by default)

## Current Frontend Behavior
- `determineViewMode()` function automatically selects display mode based on URLs
- Priority order: video > github > images > tweet > general link > text
- When URL exists, it should be displayed prominently with text as supplementary info
- Text variant: 'detailed' for all sections EXCEPT hobbies which uses 'simple'
- **Special case**: Education and Experience sections use 'timeline' display mode by default
  - Frontend is developing 2 timeline variants: 'timeline-cards' and 'timeline-vertical'
  - These sections will eventually all use smart cards but currently show timeline view

## Backend Changes Required

### 1. Schema Updates (HIGH PRIORITY)
Add URL support fields to ALL relevant item classes in `unified_nullable.py`:

```python
# Common URL fields to add to multiple classes:
videoUrl: Optional[str] = None       # YouTube/Vimeo links
githubUrl: Optional[str] = None      # GitHub repository URLs  
imageUrl: Optional[str] = None       # Image URLs
linkUrl: Optional[str] = None        # General website/link URLs (for 'uri' mode)
hasLink: Optional[bool] = None       # Boolean if any URL exists
linkType: Optional[str] = None       # Type: 'website', 'video', 'github', 'image'
viewMode: Optional[str] = None       # Suggested display mode (matches frontend)
textVariant: Optional[str] = None    # Text display variant: 'detailed' or 'simple'

# Apply to these classes:
class ProjectItem(BaseModel):
    # Add all URL fields above (already has projectUrl)
    
class CertificationItem(BaseModel):
    # Add URL fields (already has verificationUrl - use as primary URL)
    
class AchievementItem(BaseModel):
    # Add all URL fields
    
class VolunteerExperienceItem(BaseModel):
    # Add all URL fields
    
class CourseItem(BaseModel):
    # Add all URL fields (certificateUrl can be primary)
    
class PublicationItem(BaseModel):
    # Add URL fields (already has url field)
    
class SpeakingEngagementItem(BaseModel):
    # Add all URL fields (presentationUrl, videoUrl important)
    
class MembershipItem(BaseModel):
    # Add all URL fields
```

**Note**: Remove `demoUrl` - not needed per frontend requirements

### 2. URL Extraction & Categorization (HIGH PRIORITY)
Create new enhancement processor functions:

```python
@staticmethod
def categorize_project_urls(enhanced: Dict[str, Any]) -> Dict[str, Any]:
    """
    Analyze project URLs and categorize them by type.
    Set hasLink, linkType, and suggested viewMode.
    """
    # For each project item:
    # 1. Check all URL fields (projectUrl, imageUrl, etc.)
    # 2. Categorize URLs by pattern matching
    # 3. Set hasLink = True if any URL exists
    # 4. Set linkType based on URL analysis
    # 5. Suggest viewMode for frontend
```

### 3. Prompt Template Updates (HIGH PRIORITY)
Update ALL relevant prompt templates in `prompt_templates.py` to extract URLs:

```
UNIVERSAL URL EXTRACTION RULES (Apply to ALL sections):
- Extract ALL URLs mentioned in descriptions
- Categorize URLs by type:
  - Main URL: Primary website/link for the item
  - videoUrl: YouTube, Vimeo, or direct video file links
  - githubUrl: GitHub repository links (must be github.com/user/repo format)
  - imageUrl: Screenshots or relevant images
  
- IMPORTANT: If a URL is mentioned, extract it even if there's accompanying text
- The URL should be the primary content, with text as supplementary description

SECTION-SPECIFIC NOTES:
- Certifications: verificationUrl is the primary URL
- Publications: existing url field is primary
- Speaking: look for presentation slides, video recordings
- Courses: certificate URLs, course platform links
- Volunteer: organization websites, project links
```

### 4. URL Validation Functions (MEDIUM PRIORITY)
Add to enhancement processor:

```python
URL_PATTERNS = {
    'github': r'^https?://github\.com/[\w-]+/[\w-]+$',
    'youtube': r'(youtube\.com/watch|youtu\.be/)',
    'vimeo': r'vimeo\.com/',
    'image': r'\.(jpg|jpeg|png|gif|webp|svg)$',
    'tweet': r'(twitter\.com|x\.com)/\w+/status/\d+',
}

def classify_url(url: str) -> str:
    """Classify URL type for display mode selection"""
    for url_type, pattern in URL_PATTERNS.items():
        if re.search(pattern, url, re.I):
            return url_type
    return 'website'
```

### 5. Smart URL Extraction (HIGH PRIORITY)
Enhance the extraction to find URLs in text:

```python
def extract_urls_from_description(description: str) -> Dict[str, str]:
    """
    Extract URLs from project descriptions and classify them.
    Example: "Built a portfolio site (https://example.com) using React"
    Should extract: {'projectUrl': 'https://example.com'}
    """
```

### 6. Display Mode Logic
The backend should provide hints but let frontend make final decision:

```python
def suggest_display_mode(item: Dict, section_name: str) -> str:
    """
    Suggest display mode based on section and available URLs.
    Special cases:
    - Education/Experience: Always 'timeline' 
    - Others: Based on URL type or 'text'
    """
    # Special case for Education and Experience
    if section_name in ['education', 'experience']:
        return 'timeline'
    
    # For all other sections, determine by URL
    if item.get('videoUrl'):
        return 'video'
    elif item.get('githubUrl'):
        return 'github'
    elif item.get('imageUrl'):
        return 'images'
    elif item.get('projectUrl') or item.get('url') or item.get('verificationUrl'):
        # Get the primary URL
        primary_url = item.get('projectUrl') or item.get('url') or item.get('verificationUrl')
        url_type = classify_url(primary_url)
        if url_type == 'tweet':
            return 'tweet'
        else:
            return 'uri'
    return 'text'
```

### 7. Handling Text + URL Scenarios
When both text and URL exist:
- `hasLink`: True
- `viewMode`: Based on URL type
- Frontend behavior: 
  - Show URL content as primary display
  - Show title only (no description) when URL is displayed
  - Show full description ONLY when card is expanded
  - If no text exists, show full-screen URL content

### 8. Text Variant Logic
Add to enhancement processor:
```python
def set_text_variant(section_name: str) -> str:
    """
    Set appropriate text variant for each section.
    Hobbies uses 'simple', all others use 'detailed'.
    """
    return 'simple' if section_name == 'hobbies' else 'detailed'
```

## Implementation Priority

1. **FIRST**: Update schema with new fields for ALL sections
2. **SECOND**: Add URL extraction and categorization to enhancement processor
3. **THIRD**: Update ALL extraction prompts to capture URLs
4. **FOURTH**: Implement text variant logic (simple for hobbies only)
5. **FIFTH**: Test with real CVs containing various URL types

## Testing Scenarios

1. **Project with website URL only**: Should display in 'uri' mode
2. **Project with GitHub link**: Should display in 'github' mode
3. **Project with YouTube link**: Should display in 'video' mode
4. **Project with text + URL**: Should show URL as primary, text on expand
5. **Project with multiple URLs**: Should prioritize based on type hierarchy
6. **Project with no URLs**: Should display in 'text' mode

## Frontend Adapter Updates (for frontend developer)
The cv-data-adapter.tsx already has `determineViewMode()` function that will work with the new fields. Just ensure all new URL fields are passed through in the adaptation.