# Future Use Routes

This folder contains API routes that are fully implemented but not currently active in production.

## Files for Future Use:

### 1. `portfolio_expert.py`
- **Status**: Complete implementation but NOT mounted in main.py
- **Purpose**: AI-powered portfolio expert guidance using Claude
- **Endpoints**: 
  - `/api/portfolio-expert/start-session`
  - `/api/portfolio-expert/chat/{session_id}`
  - `/api/portfolio-expert/generate-portfolio/{session_id}`
- **To activate**: Add to main.py imports and mount the router
- **Date moved**: 2025-01-22

### 2. `portfolio_generator_v2.py`
- **Status**: Mounted on `/api/v2` but not used by frontend
- **Purpose**: Enhanced portfolio generation with template selection
- **Endpoints**:
  - `/api/v2/portfolio/templates`
  - `/api/v2/portfolio/generate/{job_id}`
- **Note**: Ready for when frontend migrates to v2 API
- **Date moved**: 2025-01-22


## Activation Instructions

To activate any of these routes:

1. Import in main.py:
```python
from src.api.routes.future_use import portfolio_expert
```

2. Mount the router:
```python
app.include_router(portfolio_expert.router)
```