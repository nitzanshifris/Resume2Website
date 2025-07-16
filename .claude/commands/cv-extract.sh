#!/bin/bash
# CV2WEB CV Extraction Command
# Optimizes CV extraction using Claude 4 Opus for deterministic results

claude -p prompts/cv-extraction.md -- \
"CV EXTRACTION TASK:

Analyze and improve the CV extraction pipeline for CV2WEB. Focus on:

1. EXTRACTION ACCURACY: Review Claude 4 Opus extraction with temperature 0.0
2. SECTION CLASSIFICATION: Validate advanced section classifier performance  
3. DEDUPLICATION: Ensure comprehensive deduplication for skills/certifications/languages
4. FILE HANDLING: Check file preservation and caching mechanisms
5. DATA VALIDATION: Verify extracted data meets CV2WEB schema requirements

Specific areas to examine:
- src/core/cv_extraction/data_extractor.py
- src/core/cv_extraction/advanced_section_classifier.py  
- File hash caching implementation
- Cross-section contamination prevention
- Professional links mapping accuracy

Provide actionable recommendations for extraction improvements."