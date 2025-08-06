# CV Processing Specification

*Standards for extracting and processing CV data while preserving user intent*

## Extraction Principles

### CV01: Preserve Original Language  
**Requirement**: Extract user's exact words, phrases, and terminology without modification

**Rationale**: User's language reflects their personality, industry knowledge, and cultural background. These are competitive differentiators that must be preserved.

**Implementation**:
- Never paraphrase or "improve" user's language
- Preserve industry-specific terminology exactly as written
- Maintain user's choice of verb tenses and descriptive language  
- Keep cultural and linguistic variations (British vs American spelling, etc.)

### CV02: Complete Information Extraction
**Requirement**: Extract ALL information present in the CV, regardless of format or location

**Success Criteria**:
- Hero section: 98%+ accuracy (name, title, contact information)
- Experience section: 95%+ accuracy (roles, companies, dates, descriptions)
- Education section: 95%+ accuracy (degrees, institutions, dates, honors)
- Skills section: 90%+ accuracy (technical and soft skills)
- Additional sections: 85%+ accuracy (projects, certifications, languages, etc.)

### CV03: Zero Fabrication Policy
**Requirement**: Never generate, infer, or create information not explicitly present in source CV

**Critical Rules**:
- If information is ambiguous, preserve ambiguity rather than making assumptions
- Use null/empty values for missing information  
- Never fill gaps with "reasonable" assumptions
- Flag unclear information for user review rather than making decisions

### CV04: Structured Data Integrity
**Requirement**: Convert unstructured CV content into 18 standardized sections while maintaining information fidelity

**Section Standards**:
1. **Hero Section**: Full name, professional title, contact details, professional summary
2. **Contact Information**: Email, phone, location, LinkedIn, portfolio links, availability
3. **Professional Summary**: Years of experience, key specializations, career objectives
4. **Work Experience**: Job titles, companies, employment dates, responsibilities, achievements, technologies
5. **Education**: Degrees, institutions, graduation dates, GPA (if provided), honors
6. **Skills**: Technical skills (categorized), soft skills, proficiency levels
7. **Projects**: Project names, descriptions, role, technologies used, outcomes, URLs
8. **Achievements**: Awards, recognition, metrics, context, timeframes
9. **Certifications**: Certification names, issuing organizations, dates, credential numbers
10. **Languages**: Languages spoken, proficiency levels, certifications
11. **Volunteer Experience**: Organizations, roles, dates, descriptions, impact
12. **Publications**: Titles, publication types, venues, dates, URLs
13. **Speaking Engagements**: Event names, topics, venues, dates, audience size
14. **Courses**: Course titles, institutions, completion dates, certificates
15. **Professional Memberships**: Organizations, membership types, roles, dates
16. **Hobbies & Interests**: Personal interests relevant to professional context
17. **Patents**: Patent titles, numbers, status, filing dates
18. **Testimonials**: Quotes, attribution, context, dates

## Processing Standards

### CV05: Date Handling Precision
**Requirement**: Process dates consistently while preserving user's original format preferences

**Rules**:
- Preserve user's date format (MM/YYYY vs Month Year vs full dates)
- Handle ranges accurately (2019-2021, Jan 2019-Present, etc.)
- Respect cultural date conventions
- Flag inconsistent or impossible dates for user review
- Support ongoing roles (Present, Current, Ongoing)

### CV06: Contact Information Security
**Requirement**: Handle contact information with appropriate privacy protections

**Standards**:
- Validate email formats without modifying them
- Preserve phone number formatting as entered
- Support international phone number formats
- Handle LinkedIn URLs and other social profiles accurately
- Never expose contact information to unauthorized access

### CV07: Multi-Format Support
**Requirement**: Successfully process CVs regardless of source format

**Supported Formats**:
- PDF documents (text-based and image-based)
- Microsoft Word documents (.doc, .docx)
- Plain text files (.txt)
- Image files (JPG, PNG) with OCR processing
- Web-based CV formats (LinkedIn exports, etc.)

**Quality Standards**:
- 90%+ successful extraction across all supported formats
- Format-specific optimization for best results
- Graceful degradation when format poses challenges
- Clear error messaging for unsupported formats

### CV08: Error Handling and Recovery
**Requirement**: Provide meaningful error handling that helps users succeed

**Error Categories**:
- **File Issues**: Corrupted files, unsupported formats, size limitations
- **Content Issues**: Completely unstructured text, missing key information
- **Technical Issues**: Processing timeouts, system errors, API failures

**Response Standards**:
- Specific error messages explaining what went wrong
- Actionable guidance for resolving issues
- Partial results when some sections succeed
- Options for manual input when automated extraction fails

## Quality Assurance

### CV09: Extraction Validation
**Requirement**: Validate extracted data against source material for accuracy

**Validation Process**:
- Automated semantic similarity checks between source and extracted text
- Manual review of edge cases and error reports
- User feedback integration for continuous improvement
- Regular accuracy audits across diverse CV samples

### CV10: Performance Standards
**Requirement**: Process CVs within acceptable time limits while maintaining quality

**Timing Targets**:
- File upload and text extraction: <30 seconds
- Claude 4 Opus data extraction: <90 seconds
- Post-processing and validation: <30 seconds
- Total processing time: <3 minutes (90th percentile)

### CV11: Consistency Standards  
**Requirement**: Produce consistent results for identical input

**Consistency Rules**:
- Same CV processed multiple times should yield identical structured data
- Use deterministic extraction settings (temperature 0.0)
- Implement caching to avoid reprocessing unchanged content
- Version control extraction logic to maintain consistency across updates

## Edge Case Handling

### CV12: Non-Standard CV Formats
**Scenarios**: Creative CVs, academic CVs, international formats, career change CVs

**Approach**: 
- Preserve unique elements that differentiate the candidate
- Map non-standard sections to closest standardized equivalent
- Note creative elements in additional information sections
- Maintain academic formatting conventions when relevant

### CV13: Multilingual Content
**Scenarios**: CVs with multiple languages, translated content, non-Latin scripts

**Requirements**:
- Preserve all languages exactly as written
- Support Unicode characters and non-Latin scripts
- Handle mixed-language content appropriately
- Never translate content without explicit user permission

### CV14: Incomplete or Minimal CVs
**Scenarios**: Entry-level candidates, career gaps, minimal information

**Approach**:
- Extract all available information without judgment
- Use null values for missing sections rather than omitting them
- Preserve user's presentation choices (brevity may be intentional)
- Provide structure that accommodates future additions

---

*These standards ensure that CV processing serves user intent while maintaining the highest quality and accuracy standards.*