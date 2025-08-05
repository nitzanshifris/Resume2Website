# Archived Routes

This folder contains API routes that are no longer in use and have been archived.

## Archived Files:

### 1. `cv_processing.py`
- **Status**: Not imported or used anywhere
- **Reason for archiving**: Functionality likely moved to other modules
- **Date archived**: 2025-01-22

### 2. `portfolio.py`
- **Status**: Deprecated - returns 503 error
- **Endpoints**: 
  - `/portfolio/generate` - Always returns 503
  - `/portfolio/templates` - Returns static template list
- **Reason for archiving**: Replaced by `portfolio_generator.py`
- **Date archived**: 2025-01-22

## Note
These files are kept for historical reference but should not be used in production.