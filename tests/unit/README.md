# Unit Tests for CV Processing System

This directory contains unit tests for the CV processing system, specifically for the helper functions in `src/api/routes/cv.py`.

## Test Coverage

### 1. **test_cv_helpers.py** / **test_cv_helpers_isolated.py**
Tests for file handling helper functions:
- `validate_filename()` - Security validation against path traversal
- `get_file_extension()` - Safe file extension extraction
- `get_mime_type()` - MIME type mapping for HTTP responses

### 2. **test_cv_auth.py**
Tests for authentication helper functions:
- `hash_password()` - Bcrypt password hashing
- `verify_password()` - Password verification

## Running Tests

### Option 1: Run all unit tests
```bash
python3 tests/unit/run_unit_tests.py
```

### Option 2: Run isolated tests (no database required)
```bash
python3 tests/unit/test_cv_helpers_isolated.py
```

### Option 3: Run with pytest (if installed)
```bash
pytest tests/unit -v
```

## Test Requirements

- Python 3.9+
- pytest (optional, but recommended)
- Project dependencies from requirements.txt

## Known Issues

- Full unit tests require database initialization, which may fail in test environments
- Use `test_cv_helpers_isolated.py` for testing without database dependencies

## What's Still Needed

Based on the code review, we should add tests for:

1. **API Endpoint Tests**
   - `/upload` endpoint with various file types
   - `/register` and `/login` authentication
   - `/cv/{job_id}` CRUD operations
   - Error handling for each endpoint

2. **Integration Tests**
   - Full CV upload → extraction → portfolio generation flow
   - Multi-file upload handling
   - Cache hit/miss scenarios

3. **Performance Tests**
   - Large file handling
   - Concurrent upload stress testing
   - Memory usage validation

4. **Security Tests**
   - Rate limiting effectiveness
   - Session timeout handling
   - Access control verification

## Adding New Tests

When adding new tests:
1. Create test files with `test_` prefix
2. Use descriptive test function names
3. Include both positive and negative test cases
4. Test edge cases and error conditions
5. Add documentation for complex test scenarios