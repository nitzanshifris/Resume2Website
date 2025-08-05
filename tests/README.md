# CV2WEB Tests

This directory contains test files for the CV2WEB application.

## Test Categories

### Core Tests
- `comprehensive_test.py` - Main integration test covering full pipeline
- `test_data_extraction.py` - Tests CV data extraction with Claude 4 Opus
- `test_error_handling.py` - Error handling and recovery tests
- `test_portfolio_integration.py` - Portfolio generation integration tests

### Integration Tests (`integration/`)
- `test_api.py` - API endpoint testing
- `test_mvp_edge_cases.py` - Edge case testing for MVP

### End-to-End Tests (`e2e/`)
- `test_complete_pipeline.py` - Complete user workflow testing
- `test_cv_extraction_pipeline.py` - CV extraction pipeline testing
- `test_full_pipeline.py` - Full pipeline validation
- `test_real_pipeline.py` - Real-world scenario testing

### Specialized Tests
- `test_deduplication.py` - Data deduplication testing
- `test_deduplication_real_cvs.py` - Real CV deduplication testing
- `test_extraction.py` - Text extraction testing
- `test_extraction_performance.py` - Performance benchmarks
- `test_multipage_pdf.py` - Multi-page PDF handling
- `test_real_cv_processing.py` - Real CV processing validation
- `test_sse.py` - Server-Sent Events testing
- `test_sse_comprehensive.py` - Comprehensive SSE testing
- `test_stress_concurrent.py` - Concurrent load testing
- `test_unicode_normalization.py` - Unicode handling tests
- `test_workflow_integration.py` - Workflow integration testing

## Running Tests

### Quick Test Suite
```bash
python3 tests/run_tests.py
```

### Individual Tests
```bash
python3 tests/comprehensive_test.py
python3 tests/test_data_extraction.py
```

### All Tests
```bash
# From project root
python3 -m pytest tests/
```

## Cleaned Up (2025-08-05)

Removed obsolete tests:
- Tests for deleted templates (resume2web_branded, v0_template_1.2-1.4, etc.)
- Universal adapter tests (replaced by cv-data-adapter system)
- Component selector tests (obsolete architecture)
- Lisbon-specific analysis files (one-off analysis)
- Legacy schema integration tests

Total files reduced: 46 → 26 (freed ~236KB)

## Current Architecture

Tests focus on:
- Claude 4 Opus ONLY for CV extraction (temperature 0.0)
- Two active templates: v0_template_v1.5 and v0_template_v2.1
- FastAPI backend with SQLite database
- Next.js frontend with isolated sandbox generation
- Authentication with session management