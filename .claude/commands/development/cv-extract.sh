#!/bin/bash
# RESUME2WEBSITE CV Extraction Command
# Optimizes CV extraction using Claude 4 Opus for deterministic results

claude -p prompts/cv-extraction.md -- \
"CV EXTRACTION TASK:

Analyze and improve the CV extraction pipeline for RESUME2WEBSITE. Focus on:

1. EXTRACTION ACCURACY: Review Claude 4 Opus extraction with temperature 0.0
2. SECTION CLASSIFICATION: Validate advanced section classifier performance  
3. DEDUPLICATION: Ensure comprehensive deduplication for skills/certifications/languages
4. FILE HANDLING: Check file preservation and caching mechanisms
5. DATA VALIDATION: Verify extracted data meets RESUME2WEBSITE schema requirements

Specific areas to examine:
- src/core/cv_extraction/data_extractor.py (factory pattern)
- src/core/cv_extraction/llm_service.py (Claude 4 Opus integration)
- src/core/cv_extraction/circuit_breaker.py (exponential backoff)
- src/utils/cv_resume_gate.py (stricter for images)
- File hash caching implementation (>0.75 confidence)
- 15-section CV structure compliance

Provide actionable recommendations for extraction improvements."