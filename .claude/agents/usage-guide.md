# Claude Code Agents Usage Guide

## Agent Data Organization System

### 📁 Directory Structure
```
.claude/agents/
├── templates/
│   └── agent-template.md            # Template for creating new agents
├── data/
│   └── code-review-tasks/
│       ├── README.md                # Usage instructions
│       ├── index.md                 # Index of all reviews
│       ├── YYYY-MM-DD_HH-MM-SS_*.md # Individual task outputs
│       └── ...
└── usage-guide.md                   # This file

.claude/agents/
└── code-reviewer.md                 # ACTIVE comprehensive agent
```

## How to Use the Code-Reviewer Agent

### Method 1: Using the Task Tool (Recommended)
```bash
# In Claude Code, run:
Task(description="Review authentication security", subagent_type="code-reviewer", prompt="Review this authentication code...")
```

### Method 2: Direct Agent Command
```bash
# In Claude Code, run:
/agents code-reviewer "Review this SSE implementation for security issues..."
```

### Method 3: Through Me (Current Session)
Just ask me to use the code-reviewer agent, and I'll invoke it for you.

## Where to Find Agent Results

### 📊 Quick Overview
- **Index**: `.claude/agents/data/code-review-tasks/index.md` - All reviews at a glance
- **Active Tasks**: `.claude/agents/data/code-review-tasks/2025-01-08_aggregated-review-tasks.md`

### 📋 Detailed Analysis
Each complete agent analysis is saved as:
`.claude/agents/data/code-review-tasks/YYYY-MM-DD_HH-MM-SS_task-description.md`

**Contains:**
- Complete security audit
- All findings with priorities
- Specific code fixes with examples
- Architecture recommendations
- File paths and line numbers

## Current Agent Capabilities

### 🔍 Code-Reviewer Agent
**Active Agent**: `.claude/agents/code-reviewer.md`

**Specializes in:**
- Resume2Website V4 compliance (29 undocumented endpoints)
- SSE security patterns and rate limiting
- Workflow orchestration and correlation
- Metrics system integration
- TypeScript/React best practices
- FastAPI/Python security patterns
- Admin endpoint access control
- Circuit breaker implementations

**Complete Knowledge Base:**
- 15-section CV structure compliance
- Official_template_v1 patterns (only active template)
- Authentication flow security (user_auth.py canonical)
- Real-time systems (SSE, workflows, metrics)
- Performance limits (20 portfolios, 512MB, 24h cleanup)
- All 4 major undocumented systems with 29 endpoints
- Advanced security patterns and admin controls

### ⚡ Execution-Services Agent
**Active Agent**: `.claude/agents/execution-services.md`

**Specializes in:**
- Complete API endpoint registry (70+ endpoints)
- Service execution and monitoring
- Database operations management
- Background tasks and workflows
- Portfolio lifecycle management
- System health and metrics monitoring
- Emergency operations and recovery
- Command execution and debugging

**Complete Knowledge Base:**
- All Resume2Website V4 API routes and endpoints
- Service layer architecture and capabilities
- Database operations (users, sessions, CVs, portfolios)
- Background tasks (cleanup, metrics, logs)
- Execution commands (development, testing, deployment)
- Performance limits and system settings
- Port allocations and environment variables
- Critical operations and recovery procedures

## Recent Agent Performance

### ✅ Completed Reviews: 2

1. **SSE Security Review** (16 issues)
   - 5 Critical: Admin bypass, missing rate limiting, auth bypass, missing headers, resource leaks
   - 5 High: Circuit breaker, workflow correlation, metrics integration, admin auth, logging
   - 4 Medium: Error handling, disconnect detection, router compliance, imports
   - 2 Low: Documentation, type hints

2. **Portfolio Header Review** (8 issues) 
   - 4 Critical: TypeScript patterns, missing types, export patterns, imports
   - 3 High: useEffect anti-pattern, Next.js SSR violations, accessibility
   - 2 Medium: Styling patterns, theme integration

**Total Issues Found**: 24 across all priorities

## Future Agents (Planned)

From the original 13-agent development plan:
- ✅ Execution-Services Agent (COMPLETED - execution, monitoring, debugging)
- Security Agent (OAuth, Stripe, admin controls)
- Data Extraction Agent (CV processing optimization)
- Template Development Agent (new portfolio templates)
- Database Agent (SQLite, schema management)
- Deployment Agent (Vercel, CI/CD)
- Payment Agent (Stripe integration)
- Metrics Agent (performance monitoring)
- Workflow Agent (complex orchestration)
- Testing Agent (pytest, frontend testing)
- Documentation Agent (CLAUDE.md management)
- Schema Agent (data structure validation)
- Building Agent (new feature scaffolding)

## Tips for Best Results

### 🎯 Be Specific
Instead of: "Review this code"
Use: "Review this SSE endpoint for Resume2Website V4 security compliance, focusing on rate limiting, admin controls, and workflow integration"

### 🔍 Include Context
- File paths
- Purpose of the code
- Specific concerns
- Integration points

### 📝 Check Multiple Locations
- Immediate: Latest review file in `.claude/agents/data/code-review-tasks/`
- Complete: Full analysis with historical context
- Historical: `index.md` for trends and statistics

---

*Updated: 2025-01-08 | Agent System v1.0*