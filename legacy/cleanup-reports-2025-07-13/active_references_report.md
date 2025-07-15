# Active References to Root-Level Python Files

## Summary
⚠️ **IMPORTANT**: Both `config.py` and `main.py` at root level are actively used and cannot be deleted without migration.

## Active References Found

### 1. References to root `config.py` (9 files)
- `/src/api/routes/portfolio.py:25` - `import config`
- `/src/api/routes/cv_to_portfolio.py:27` - `import config`
- `/src/core/cv_extraction/data_extractor.py:51` - `import config`
- `/src/api/routes/cv.py:18` - `import config`
- `/src/api/routes/cv_processing.py:24` - `import config`
- `/tests/test_comprehensive_edge_cases.py:20` - `import config`
- `/tests/test_error_recovery.py:199` - `import config`
- `/main.py:9` - `import config`

### 2. References to root `main.py` (2 test files)
- `/tests/test_portfolio_api.py:12` - `from main import app`
- `/tests/test_api.py:11,34` - `from main import app`

## Recommendation
1. **DO NOT DELETE** these files yet
2. First create `/src/api/config.py` with the same content
3. Update all imports to use `from src.api import config`
4. Only then can we safely delete the root-level files

## Next Steps
- Create migration task to move config.py to src/api/
- Update all import statements
- Update main.py location or keep it as entry point