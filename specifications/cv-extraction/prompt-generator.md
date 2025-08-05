# CV Extraction Prompt Generator Specification v1.0

## Intent
Convert our CV Extraction Specification into optimized, executable Claude 4 Opus prompts that achieve 95%+ accuracy while preserving user intent and handling edge cases gracefully.

## Prompt Generation Strategy

### Core Principles from Specification
1. **Deterministic Extraction** - Temperature 0.0, consistent outputs
2. **Preserve User Intent** - Don't interpret or change user's language
3. **Graceful Degradation** - Handle missing data, return structured output always
4. **Comprehensive Coverage** - Extract all 18 sections when present

### Prompt Architecture

#### System Message (Specification-Driven)
```
You are a CV extraction specialist that transforms unstructured resume text into precisely structured JSON data. Your core values:

PRESERVE USER INTENT: Use the candidate's exact language and terminology. If they wrote "Lead Developer", don't change it to "Senior Software Engineer".

DETERMINISTIC EXTRACTION: Always produce identical structured output for identical input. No interpretation or creative enhancement.

GRACEFUL DEGRADATION: If information is missing or unclear, use null values or empty arrays. Never fabricate data.

COMPREHENSIVE COVERAGE: Extract ALL relevant information across 18 defined sections, even if unconventional.
```

#### Main Extraction Prompt (Generated from Specification)
```
Extract structured data from this CV text following these exact requirements:

REQUIRED OUTPUT STRUCTURE (18 Sections):
{json schema here - generated from specification}

EXTRACTION RULES:
1. PRESERVE ORIGINAL LANGUAGE: Use candidate's exact words, don't paraphrase
2. HANDLE DATES FLEXIBLY: Accept "Jan 2020", "January 2020", "01/2020", "Present", "Current"
3. MAINTAIN STRUCTURE: Even if sections are empty, include them as empty objects/arrays

EDGE CASE HANDLING:
- Multiple roles at same company: Create separate experience entries
- Overlapping positions: Allow overlaps, don't force chronological order
- Unclear information: Use candidate's exact phrasing
- Missing data: Use null for strings, empty arrays for lists

CV TEXT TO EXTRACT:
{cv_text}

Return only valid JSON with no additional text or explanations.
```

## Implementation Plan

### Phase 1: Prompt Template Engine
Create a system that generates prompts from specifications:

```python
class CVExtractionPromptGenerator:
    def __init__(self, specification_path: str):
        self.spec = self.load_specification(specification_path)
        
    def generate_system_prompt(self) -> str:
        """Generate system message from specification values"""
        
    def generate_extraction_prompt(self, cv_text: str) -> str:
        """Generate main extraction prompt with CV text"""
        
    def generate_validation_prompt(self, extracted_data: dict) -> str:
        """Generate validation prompt to check quality"""
```

### Phase 2: Dynamic JSON Schema Generation
Convert specification data model to Claude-friendly schema:

```python
def generate_json_schema_from_spec():
    """
    Convert 18-section specification into exact JSON schema
    that Claude 4 Opus should follow
    """
    return {
        "hero": {
            "fullName": "string (required)",
            "professionalTitle": "string (required)", 
            "summaryTagline": "string or null",
            "profilePhotoUrl": "string or null"
        },
        # ... all 18 sections
    }
```

### Phase 3: Quality Validation Prompts
Generate validation prompts based on specification success criteria:

```python
def generate_quality_check_prompt(original_cv: str, extracted_data: dict) -> str:
    """
    Generate prompt to validate extraction quality against specification:
    - Are critical fields (hero, contact) 98%+ accurate?
    - Is user's original language preserved?
    - Are dates handled correctly?
    - Is structure complete?
    """
```

## Executable Prompt Generator Tool

Let me create the actual tool that implements this: