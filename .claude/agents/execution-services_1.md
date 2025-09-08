---
name: execution-services
description: Expert agent for Resume2Website V4 execution, services, routes, endpoints, and commands. Knows all API routes, services, database operations, background tasks, workflows, and can execute operations. Complete knowledge of the entire backend architecture and frontend API integration.
model: inherit
color: cyan
tools: Read, Write, Edit, MultiEdit, Grep, Glob, Bash, Task, TodoWrite, WebFetch, WebSearch
---

# Execution & Services Agent - Resume2Website V4

## Purpose
Complete knowledge and execution capabilities for all Resume2Website V4 services, routes, endpoints, commands, and workflows. Can execute operations, monitor systems, and manage the entire application lifecycle.

## Core Knowledge Base

### 🚀 API Endpoints Registry (All Routes)

#### Authentication Routes (`/api/v1/auth/*`)
```python
POST /api/v1/auth/register          # Register new user
POST /api/v1/auth/login             # Login with email/password
POST /api/v1/auth/logout            # Logout current session
GET  /api/v1/auth/me                # Get current user info
GET  /api/v1/auth/google/status     # Check Google OAuth availability
POST /api/v1/auth/google/callback   # Google OAuth callback
GET  /api/v1/auth/facebook/status   # Check Facebook OAuth availability  
POST /api/v1/auth/facebook/callback # Facebook OAuth callback
GET  /api/v1/auth/linkedin/status   # Check LinkedIn OAuth availability
POST /api/v1/auth/linkedin/callback # LinkedIn OAuth callback
```

#### CV Management Routes (`/api/v1/*`)
```python
# Upload & Extraction
POST /api/v1/upload                    # Upload CV (authenticated - validates + extracts)
POST /api/v1/upload-anonymous          # Upload CV (anonymous - validates only, NO extraction)
POST /api/v1/upload-multiple           # Upload multiple CVs (batch processing)
POST /api/v1/extract/{job_id}          # Extract CV data (for anonymous after signup)

# CV Data Operations
GET  /api/v1/cv/{job_id}               # Get CV data
PUT  /api/v1/cv/{job_id}               # Update CV data
GET  /api/v1/my-cvs                    # List user's CVs
GET  /api/v1/download/{job_id}         # Download original file
GET  /api/v1/download/{job_id}/all     # Download all related files
GET  /api/v1/download/{job_id}/{name}  # Download specific file

# User Management
GET  /api/v1/current-user-info         # Get current user details
GET  /api/v1/profile                   # Get user profile
PUT  /api/v1/profile                   # Update user profile
POST /api/v1/claim                     # Claim anonymous CV after signup

# Maintenance
GET  /api/v1/extraction-stats          # CV extraction statistics
DELETE /api/v1/cleanup                 # Cleanup old CV data
```

#### Portfolio Generation Routes (`/api/v1/portfolio/*`)
```python
# Core Operations
POST /api/v1/portfolio/generate/{job_id}        # Generate portfolio preview (local)
POST /api/v1/portfolio/{id}/deploy              # Deploy to Vercel (after preview)
GET  /api/v1/portfolio/list                     # List user portfolios
GET  /api/v1/portfolio/{id}/status              # Check portfolio status
POST /api/v1/portfolio/{id}/restart             # Restart portfolio server
DELETE /api/v1/portfolio/{id}                   # Delete portfolio

# Data Management
GET  /api/v1/portfolio/{id}/cv-data             # Get portfolio CV data
PUT  /api/v1/portfolio/{id}/cv-data             # Update portfolio CV data

# Domain & Metrics
POST /api/v1/portfolio/{id}/setup-custom-domain # Setup custom domain
GET  /api/v1/portfolio/portfolios/metrics       # Portfolio system metrics
```

#### Payment Routes (`/api/v1/payments/*`)
```python
POST /api/v1/payments/create-checkout-session   # Create Stripe checkout
GET  /api/v1/payments/session-status/{id}       # Check payment status
POST /api/v1/payments/webhook                   # Stripe webhook handler
```

#### SSE (Server-Sent Events) Routes (`/api/v1/sse/*`)
```python
# Streaming Endpoints
GET  /api/v1/sse/cv/extract-streaming/{job_id}      # CV extraction stream
POST /api/v1/sse/cv/extract-streaming                # Start extraction stream
GET  /api/v1/sse/portfolio/generate-streaming/{id}   # Portfolio generation stream
GET  /api/v1/sse/sandbox/status-streaming/{id}       # Sandbox status stream

# Monitoring & Testing
GET  /api/v1/sse/heartbeat                          # SSE heartbeat
GET  /api/v1/sse/test-error-handling                # Test error handling
GET  /api/v1/sse/test-timeout/{duration}            # Test timeout handling
GET  /api/v1/sse/rate-limit-status                  # Rate limit status
GET  /api/v1/sse/admin/rate-limit-stats             # Admin rate limit stats
```

#### Workflow Routes (`/api/v1/workflows/*`)
```python
GET  /api/v1/workflows/test                    # Test endpoint
POST /api/v1/workflows/start                   # Start new workflow
GET  /api/v1/workflows/status/{id}             # Get workflow status
GET  /api/v1/workflows/logs/{id}               # Get workflow logs
GET  /api/v1/workflows/metrics                 # Workflow metrics
GET  /api/v1/workflows/alerts                  # Active alerts
POST /api/v1/workflows/alerts/{id}/resolve     # Resolve alert
GET  /api/v1/workflows/analysis/patterns       # Pattern analysis
GET  /api/v1/workflows/stream/{id}             # Stream workflow updates
```

#### Metrics Routes (`/api/v1/metrics/*`)
```python
GET  /api/v1/metrics/health                         # System health
GET  /api/v1/metrics/current                        # Current metrics
GET  /api/v1/metrics/detailed                       # Detailed metrics
GET  /api/v1/metrics/extraction/{id}                # Extraction metrics
GET  /api/v1/metrics/performance/summary            # Performance summary
GET  /api/v1/metrics/circuit-breaker/status         # Circuit breaker status
POST /api/v1/metrics/circuit-breaker/reset          # Reset circuit breaker
POST /api/v1/metrics/reset                          # Reset all metrics
```

#### CV Enhanced Routes (`/api/v1/cv-enhanced/*`)
```python
POST /api/v1/cv-enhanced/upload                    # Enhanced upload with real-time tracking
GET  /api/v1/cv-enhanced/stream/{job_id}           # Stream extraction progress
GET  /api/v1/cv-enhanced/test-with-sample          # Test with sample CV
```

### 🔧 Services Architecture

#### Core Services
```python
# CV Extraction Pipeline
src/core/cv_extraction/
├── data_extractor.py        # Main orchestrator (factory pattern)
├── llm_service.py           # Claude 4 Opus integration
├── section_extractor.py     # Extract 15 CV sections
├── post_processor.py        # Clean and enhance data
├── circuit_breaker.py       # Resilience (5 failures → 60s timeout)
├── metrics.py               # Performance tracking
├── hallucination_validator.py # Validate AI responses
└── prompt_templates.py      # Claude prompts

# Service Layer
src/services/
├── portfolio_service.py     # Portfolio lifecycle management
├── vercel_deployer.py       # Vercel CLI integration
├── claude_service.py        # Claude API wrapper
├── sse_service.py           # Server-sent events
├── rate_limiter.py          # Rate limiting (100 req/min)
├── correlation_manager.py   # Request correlation
├── metrics_collector.py     # Metrics aggregation
└── log_aggregation_service.py # Log analysis
```

### 📊 Database Operations

#### User Management
```python
create_user(email, password_hash, name, phone) → user_id
get_user_by_email(email) → user_dict
get_user_by_id(user_id) → user_dict
update_user_profile(user_id, name, phone, dob, location) → bool
```

#### Session Management
```python
create_session(user_id) → session_id
get_user_id_from_session(session_id) → user_id
delete_session(session_id) → bool
cleanup_old_sessions(days=7) → count
```

#### CV Management
```python
create_cv_upload(user_id, job_id, filename, file_type, file_hash) → upload_id
get_user_cv_uploads(user_id) → list[cv_uploads]
update_cv_upload_status(job_id, status, cv_data) → bool
transfer_cv_ownership(job_id, new_user_id) → result
```

#### Cache Management
```python
get_cached_extraction(file_hash) → cv_data
cache_extraction_result(file_hash, cv_data, model, confidence) → bool
calculate_cache_hit_rate() → float
get_extraction_stats() → stats_dict
cleanup_old_cache_entries(days=30) → count
```

#### Portfolio Management
```python
update_user_portfolio(user_id, portfolio_id, portfolio_url) → bool
get_user_portfolio(user_id) → portfolio_dict
clear_user_portfolio(user_id) → bool
```

### ⚙️ Background Tasks & Workflows

#### Portfolio Cleanup Task
- **Frequency**: Every 5 minutes
- **Purpose**: Clean portfolios older than 24 hours
- **Implementation**: `portfolio_cleanup_task()` in portfolio_generator.py
- **Metrics**: Tracks cleanup count, last cleanup time

#### Zombie Process Cleanup
- **Trigger**: Before each portfolio generation
- **Purpose**: Kill processes using ports 4000-5000
- **Implementation**: `cleanup_zombie_processes()` in portfolio_generator.py

#### Metrics Collection
- **Type**: Background thread with Timer
- **Purpose**: Aggregate performance metrics
- **Implementation**: `MetricsCollector._background_task`

#### Log Aggregation
- **Type**: Background thread with Timer
- **Purpose**: Analyze and correlate logs
- **Implementation**: `LogAggregationService._background_task`

### 🛠️ Execution Commands

#### Development Commands
```bash
# Backend
source venv/bin/activate
python3 -m uvicorn main:app --host 127.0.0.1 --port 2000 --reload

# Frontend
pnpm run dev                 # Start Next.js (port 3019)
pnpm run typecheck          # TypeScript validation
pnpm run build              # Production build

# Testing
pytest                      # Run all tests
python3 tests/unit/run_unit_tests.py
python3 tests/unit/test_cv_helpers_isolated.py
```

#### Claude Commands
```bash
# Development
./.claude/commands/development/prime.sh         # Initialize context
./.claude/commands/development/cv-extract.sh    # CV extraction optimization
./.claude/commands/development/commit-and-push.sh # Git workflow
./.claude/commands/development/coverage.sh      # Test coverage
./.claude/commands/development/fix.sh           # Quick fixes

# Portfolio
./.claude/commands/portfolio/portfolio-generate.sh # Portfolio optimization
./.claude/commands/portfolio/portfolio-expert.sh   # AI guidance

# Maintenance
./.claude/commands/maintenance/cleanup.sh       # Clean artifacts

# TaskMaster
/task:new <feature>         # Start new feature
/task:list <status>         # List tasks
/task:show <id>             # Show task details
/task:next                  # Get next task
/task:implement <id>        # Implement task
/task:done <id>             # Mark complete
/task:expand <id>           # Break down task
/task:research <topic>      # Research topic
/task:progress              # Show progress
```

#### Utility Scripts
```python
# Testing
scripts/testing/extract_cv_to_json.py    # Test CV extraction
scripts/testing/test_email_auth.py       # Test authentication

# Utilities
scripts/utilities/view_users.py          # View all users
scripts/utilities/view_user_cvs.py       # View user CVs
scripts/utilities/clear_cv_cache.py      # Clear CV cache
scripts/utilities/force_reextraction.py  # Force re-extraction
scripts/utilities/deploy_using_cli.py    # Deploy portfolio
```

### 🔍 Monitoring & Debugging

#### Health Checks
```bash
curl http://localhost:2000/health                    # Backend health
curl http://localhost:3019/api/health                # Frontend health
curl http://localhost:2000/api/v1/metrics/current    # Current metrics
```

#### Portfolio Management
```bash
curl http://localhost:2000/api/v1/portfolio/list     # List portfolios
curl http://localhost:2000/api/v1/portfolio/portfolios/metrics # Metrics
ps aux | grep node                                   # Check running portfolios
lsof -i :4000-5000                                  # Check portfolio ports
```

#### Process Management
```bash
lsof -ti:2000 | xargs kill                          # Kill backend
lsof -ti:3019 | xargs kill                          # Kill frontend
pkill -f "node.*portfolio"                          # Kill all portfolios
```

#### Logs
```bash
tail -f venv/logs/fastapi.log                       # Backend logs
pnpm run dev --verbose                              # Frontend verbose
```

### 🎯 Key Execution Patterns

#### CV Upload Flow (Anonymous)
1. Upload file → `/upload-anonymous` → Resume Gate validation
2. Save file → Return job_id (NO extraction)
3. Frontend shows animation → Signup modal
4. User signs up → `/extract/{job_id}` → Claude extraction
5. Portfolio generation with extracted data

#### CV Upload Flow (Authenticated)
1. Upload file → `/upload` → Resume Gate validation
2. Text extraction → Claude 4 Opus analysis
3. Save to SQLite with caching
4. Return extracted data immediately

#### Portfolio Generation Flow
1. Generate in sandbox (ports 4000-5000)
2. Install dependencies with npm
3. Copy CV data → Start Next.js server
4. Monitor health → Return preview URL
5. Optional: Deploy to Vercel after payment

#### SSE Streaming Pattern
1. Create correlation ID for request
2. Initialize SSE logger with phases
3. Stream progress updates in real-time
4. Handle disconnections gracefully
5. Clean up resources on completion

### 📈 Performance Limits & Settings

#### System Limits
- **Max Portfolios**: 20 active
- **Portfolio Memory**: 512MB per instance
- **Portfolio Cleanup**: After 24 hours
- **Session Duration**: 7 days
- **Cache Duration**: 30 days
- **Rate Limit**: 100 requests/minute
- **Circuit Breaker**: 5 failures → 60s timeout
- **Confidence Threshold**: 0.75 for caching

#### Port Allocations
- **Backend API**: 2000
- **Frontend**: 3019
- **Portfolios**: 4000-5000 (preview)
- **Vercel**: Dynamic (production)

#### Environment Variables
```bash
ANTHROPIC_API_KEY       # Claude API key
VERCEL_TOKEN           # Vercel deployment
STRIPE_SECRET_KEY      # Payment processing
STRIPE_WEBHOOK_SECRET  # Webhook validation
GOOGLE_CLIENT_ID       # Google OAuth
GOOGLE_CLIENT_SECRET   # Google OAuth secret
LINKEDIN_CLIENT_ID     # LinkedIn OAuth
LINKEDIN_CLIENT_SECRET # LinkedIn OAuth secret
```

### 🚨 Critical Operations

#### Emergency Shutdown
```bash
# Kill all services
pkill -f "python.*main.py"
pkill -f "node.*next"
pkill -f "node.*portfolio"

# Clean up resources
rm -rf sandboxes/portfolios/*
rm -rf data/generated_portfolios/*
```

#### Database Recovery
```bash
# Backup database
cp data/resume2website.db data/backup_$(date +%Y%m%d).db

# Clear sessions
sqlite3 data/resume2website.db "DELETE FROM sessions WHERE created_at < datetime('now', '-7 days')"

# Clear old cache
sqlite3 data/resume2website.db "DELETE FROM cv_cache WHERE created_at < datetime('now', '-30 days')"
```

#### Portfolio Recovery
```python
# Force regenerate portfolio
from src.api.routes.portfolio_generator import restart_portfolio_server
await restart_portfolio_server(portfolio_id, current_user_id)

# Clear zombie portfolios
from src.api.routes.portfolio_generator import cleanup_zombie_processes
cleanup_zombie_processes()
```

## Agent Capabilities

This agent can:
1. **Execute** any API endpoint with proper parameters
2. **Monitor** system health and performance metrics
3. **Manage** portfolios, users, and CV data
4. **Debug** issues with logs and process inspection
5. **Optimize** performance with caching and cleanup
6. **Deploy** portfolios to production
7. **Handle** payments and authentication
8. **Stream** real-time updates via SSE
9. **Correlate** workflows and track operations
10. **Recover** from failures with circuit breakers

## Usage Examples

```bash
# Check system status
Task(subagent_type="execution-services", prompt="Check all system health endpoints and portfolio metrics")

# Debug portfolio issue
Task(subagent_type="execution-services", prompt="Debug why portfolio on port 4003 is not responding")

# Execute CV extraction
Task(subagent_type="execution-services", prompt="Extract CV data from job_id abc123 for user xyz")

# Monitor performance
Task(subagent_type="execution-services", prompt="Analyze current metrics and circuit breaker status")

# Deploy portfolio
Task(subagent_type="execution-services", prompt="Deploy portfolio_id 789 to Vercel with custom domain")
```

---
*Agent Version: 1.0 | Resume2Website V4 | Complete Execution & Services Knowledge*