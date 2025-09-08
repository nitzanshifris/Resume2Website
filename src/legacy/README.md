# Legacy Code

This folder contains code that was developed but is no longer in use with the current architecture.

## What's Here

### From api/routes/future_use (moved Jan 2025):
- **future_use/** - Folder containing:
  - **portfolio_generator_v2.py** - Enhanced portfolio generation with template selection
    - References non-existent templates (v0_template_1)
    - Uses different generation approach than current system
    - Was mounted on `/api/v2` but never integrated with frontend
  - **portfolio_expert.py** - AI-powered portfolio guidance chat
    - Complete implementation using Claude SDK
    - Could potentially be useful in future
    - Never mounted in main.py

## Why These Are Legacy

The current portfolio generation system (`portfolio_generator.py`) uses:
- Direct template copying from `official_template_v1`
- Isolated sandbox environments
- Real-time SSE updates
- Vercel CLI deployment

These legacy files use different approaches that aren't compatible with the current architecture.

## Note
Keep these for reference, but they should NOT be imported or used without significant refactoring to match current patterns.