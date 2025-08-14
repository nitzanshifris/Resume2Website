# API Routes Analysis - RESUME2WEBSITE

## 📊 Analysis Summary

### 🟢 ACTIVELY USED Routes (by user_web_example)

1. **portfolio_generator.py** ✅ **PRIMARY GENERATION SCRIPT**
   - **Prefix**: `/api/v1/portfolio`
   - **Used endpoints**:
     - `POST /api/v1/portfolio/generate/{job_id}` - Main portfolio generation
     - `GET /api/v1/portfolio/list` - List user portfolios
     - `POST /api/v1/portfolio/{portfolio_id}/restart` - Restart portfolio server
     - `GET /api/v1/portfolio/{portfolio_id}/cv-data` - Get CV data for portfolio
     - `PUT /api/v1/portfolio/{portfolio_id}/cv-data` - Update CV data
   - **Status**: This is the main generation script used by user_web_example

2. **cv.py** ✅
   - **Prefix**: `/api/v1`
   - **Used for**: CV upload and processing (`/api/v1/upload`, `/api/v1/upload-multiple`)
   - **Status**: Active and needed

3. **sse.py** ✅
   - **Prefix**: `/api/v1`
   - **Used for**: Server-sent events for real-time updates
   - **Status**: Active infrastructure

4. **workflows.py** ✅
   - **Prefix**: `/api/v1`
   - **Status**: Likely used for CV processing workflows

5. **cv_enhanced.py** ✅
   - **No prefix** (mounted directly)
   - **Status**: Enhanced CV operations with real-time tracking

### 🟡 PARTIALLY USED/UNCLEAR Status

1. **portfolio_generator_v2.py** ⚠️
   - **Prefix**: `/api/v2/portfolio`
   - **Endpoints**: Template selection and enhanced generation
   - **Status**: Mounted on v2 prefix but not used by current user_web_example
   - **Recommendation**: Keep for now - might be for future enhancement

2. **demo_preview.py** ⚠️
   - **Prefix**: `/api/v1`
   - **Purpose**: Demo preview for non-authenticated users
   - **Status**: Mounted but usage unclear
   - **Recommendation**: Keep - useful for demo purposes

### 🔴 NOT REGISTERED/UNUSED

1. **portfolio_expert.py** ❌
   - **Not registered in main.py**
   - **Purpose**: AI-powered portfolio expert guidance
   - **Endpoints**: `/api/portfolio-expert/*`
   - **Status**: Code exists but not mounted
   - **Recommendation**: Archive or implement if needed

2. **auth.py** ❓
   - **Not directly mounted** but imported by other routes
   - **Purpose**: Authentication dependency (`get_current_user`)
   - **Status**: Used as dependency, not as route
   - **Recommendation**: Keep - essential for auth

3. **cv_processing.py** ❌
   - **Not imported in main.py**
   - **Status**: Appears to be unused
   - **Recommendation**: Archive

4. **portfolio.py** ⚠️
   - **Prefix**: `/api/v1`
   - **Status**: Mounted but endpoints unclear
   - **Recommendation**: Check if has unique endpoints or can be merged

## 📋 Recommendations

### Keep Active:
- ✅ `portfolio_generator.py` - Main generation script
- ✅ `cv.py` - CV upload/processing
- ✅ `sse.py` - SSE infrastructure
- ✅ `workflows.py` - Processing workflows
- ✅ `cv_enhanced.py` - Enhanced CV ops
- ✅ `auth.py` - Authentication dependency

### Consider for Archive:
- 📦 `portfolio_expert.py` - Not mounted, but has complete implementation
- 📦 `cv_processing.py` - Not imported/used
- 📦 `portfolio.py` - Check if redundant with portfolio_generator.py

### Keep for Future:
- 🔮 `portfolio_generator_v2.py` - V2 API ready for future use
- 🔮 `demo_preview.py` - Useful for demos

## 🎯 Key Finding

**The main portfolio generation script used by user_web_example is `portfolio_generator.py`** with endpoints under `/api/v1/portfolio/*`. This handles:
- Portfolio generation from CV data
- Portfolio management (list, restart, status)
- CV data updates for portfolios
- Server lifecycle management

The v2 generator exists but is not currently used by the frontend.