# CV Extraction Specification v1.0

## Intent
Transform unstructured CV documents into structured, standardized data that enables beautiful portfolio generation while preserving the user's professional story and achievements.

## Target Users
- **Job seekers** uploading CVs in various formats (PDF, DOCX, images)
- **Career changers** with non-traditional backgrounds
- **International users** with different CV conventions
- **Students/New graduates** with limited experience
- **Senior professionals** with extensive, complex histories

## Core Values & Principles

### 1. **Preserve User Intent Over Perfect Formatting**
- If user wrote "Lead Developer" as title, don't change to "Senior Software Engineer"
- Maintain user's language style and terminology
- Respect cultural differences in CV presentation

### 2. **Deterministic Extraction (Temperature 0.0)**
- Same CV should always produce identical structured output
- No randomness in section classification
- Consistent field mapping across extractions

### 3. **Graceful Degradation**
- Incomplete information is better than missing sections
- Use reasonable defaults when data is ambiguous
- Never fail completely - always return usable structure

### 4. **Comprehensive Coverage**
- Extract ALL relevant information, not just obvious sections
- Handle edge cases: career gaps, multiple degrees, unconventional paths
- Support all 18 defined CV sections

## Success Criteria (Measurable)

### Accuracy Targets
- **Hero Section**: 98%+ accuracy (name, title, contact)
- **Experience Section**: 95%+ accuracy (job titles, companies, dates)
- **Education Section**: 95%+ accuracy (degrees, institutions, dates)
- **Skills Section**: 90%+ accuracy (technical skills extraction)
- **Contact Information**: 99%+ accuracy (email, phone, location)

### Performance Targets
- **Processing Time**: <30 seconds for typical CV
- **Cache Hit Rate**: >80% for duplicate/similar CVs
- **Success Rate**: 99.5%+ successful extractions (no complete failures)

### User Satisfaction
- **Data Accuracy**: 90%+ users say "this looks correct"
- **Completeness**: 85%+ users say "nothing important was missed"
- **Time Saved**: Users report 15+ minutes saved vs manual entry

## The 18-Section Data Model

Our extraction produces standardized output across these sections:

### Critical Sections (Must Extract)
1. **Hero** - fullName, professionalTitle, summaryTagline, profilePhotoUrl
2. **Contact** - email, phone, location, professionalLinks, availability
3. **Summary** - summaryText, yearsOfExperience, keySpecializations

### Primary Sections (High Priority)
4. **Experience** - jobTitle, companyName, dateRange, responsibilities, technologies
5. **Education** - degree, institution, dateRange, gpa, honors
6. **Skills** - skillCategories (grouped) + ungroupedSkills

### Secondary Sections (Extract When Present)
7. **Projects** - title, description, role, technologies, urls
8. **Achievements** - value, label, context, timeframe
9. **Certifications** - title, organization, dates, credentials
10. **Languages** - language, proficiency, certification

### Optional Sections (Best Effort)
11. **Volunteer** - role, organization, dates, description
12. **Publications** - title, type, venue, date, url
13. **Speaking** - events, topics, venues, presentations
14. **Courses** - title, institution, completion, certificates
15. **Memberships** - organization, role, type, dates
16. **Hobbies** - interests and personal activities
17. **Patents** - title, number, status, dates
18. **Testimonials** - name, role, company, text, date

## Edge Cases & Error Handling

### Date Handling
- **Flexible formats**: "Jan 2020", "January 2020", "01/2020", "2020"
- **Ongoing positions**: "Present", "Current", "Ongoing"
- **Approximate dates**: "Early 2020", "Mid-2019", "Late 2018"
- **Missing end dates**: Assume current if recent, otherwise mark as incomplete

### Ambiguous Information
- **Multiple roles at same company**: Create separate experience entries
- **Overlapping positions**: Allow overlaps, don't force chronological order
- **Unclear job titles**: Use exact user language, don't interpret
- **Mixed languages**: Extract in original language, don't translate

### Data Quality Issues
- **Typos in company names**: Preserve original spelling
- **Inconsistent formatting**: Normalize without changing meaning
- **Missing sections**: Create empty arrays/objects, don't omit
- **Corrupted files**: Return partial extraction with clear error notes

## Caching & Deduplication Strategy

### File Hash Caching
- Generate SHA-256 hash of uploaded file content
- Cache extraction results for identical files
- Cache expires after 30 days or system update

### Similarity Detection
- Detect minor variations (updated dates, new position)
- Offer incremental updates instead of full re-extraction
- User can choose to use cached or re-extract

## Testing Strategy

### Automated Tests
- **Regression suite**: 100+ diverse CV examples with expected outputs
- **Edge case validation**: Challenging formats, missing data, multilingual
- **Performance benchmarks**: Processing time and accuracy metrics
- **Cache validation**: Ensure identical files produce identical outputs

### Success Validation
- **A/B testing**: Compare extraction accuracy over time
- **User feedback**: Collect corrections and improvements
- **Manual auditing**: Regular review of extraction quality

## Dependencies
- **Claude 4 Opus API**: Primary extraction engine
- **Text extraction service**: PDF/DOCX to text conversion
- **Database caching**: SQLite for extraction results
- **File storage**: Preserved original files for re-processing

## Version History
- **v1.0**: Initial specification with 18-section model and success criteria

---

*This specification drives all CV extraction logic. Changes here should be reflected in prompts, tests, and success measurements.*