# Learned Patterns - Resume2Website V4

## 🎯 Successful Patterns We Follow

### 1. Factory Pattern for Stateless Operations
**Pattern**: Create new instances for each operation
**Example**: `DataExtractorFactory` in data_extractor.py
**Why It Works**: Prevents state contamination between extractions
**Apply To**: Any operation processing user data

### 2. Circuit Breaker for External Services
**Pattern**: Exponential backoff after failures
**Implementation**: 5 failures → 30s, 60s, 120s... backoff
**Why It Works**: Prevents cascade failures, allows recovery
**Apply To**: All external API calls (Claude, Stripe, Vercel)

### 3. Two-Stage User Journey
**Pattern**: Free preview → Payment → Full deployment
**Example**: Portfolio generation process
**Why It Works**: Users can test before paying, reduces refunds
**Apply To**: Any premium feature rollout

### 4. Stricter Validation for Riskier Inputs
**Pattern**: Different validation rules based on input type
**Example**: Resume Gate stricter for images than PDFs
**Why It Works**: Prevents abuse while maintaining usability
**Apply To**: Any user-generated content

### 5. Hash-Based Deduplication
**Pattern**: Cache by file hash, not filename
**Example**: CV extraction caching
**Why It Works**: Same file uploaded multiple times uses cache
**Apply To**: Any expensive processing operation

### 6. Confidence Scoring for Quality
**Pattern**: Only cache/use results above threshold
**Example**: >0.75 confidence for CV extraction caching
**Why It Works**: Ensures quality while enabling optimization
**Apply To**: Any AI-generated content

### 7. Resource Limits with Auto-Cleanup
**Pattern**: Hard limits + scheduled cleanup
**Example**: 20 portfolios max, 24-hour cleanup
**Why It Works**: Prevents resource exhaustion
**Apply To**: Any resource-intensive feature

### 8. Correlation IDs for Distributed Operations
**Pattern**: Track related operations across systems
**Example**: Workflow correlation manager
**Why It Works**: Enables debugging complex flows
**Apply To**: Multi-step operations

### 9. Progressive Enhancement Flow
**Pattern**: Basic → Enhanced based on auth status
**Example**: Anonymous validate-only → Auth full extraction
**Why It Works**: Balances accessibility with resource protection
**Apply To**: Freemium features

### 10. Organized Output Management
**Pattern**: Timestamp-prefixed files in domain folders
**Example**: `.claude/agents/data/code-review-tasks/YYYY-MM-DD_HH-MM-SS_task.md`
**Why It Works**: Findable, sortable, no collisions
**Apply To**: Any generated reports or logs

## 🚀 Code Organization Patterns

### TypeScript/React Patterns
```typescript
// Always use arrow functions with explicit types
export const Component: React.FC<Props> = ({ prop1, prop2 }) => {
  // Implementation
}

// Absolute imports only
import { something } from 'src/components/something'

// Never use require()
// Never use function declarations for components
```

### Python/FastAPI Patterns
```python
# Always use type hints
async def process_cv(
    file: UploadFile,
    user_id: str
) -> Optional[Dict[str, Any]]:
    # Implementation

# Absolute imports from src
from src.api.routes import cv
from src.core.cv_extraction import data_extractor

# Always use dependency injection
current_user: User = Depends(get_current_user)
```

### File Structure Patterns
```
feature/
├── __init__.py         # Exports
├── models.py          # Data models
├── service.py         # Business logic
├── routes.py          # API endpoints
└── tests/            # Feature tests
```

## 🔄 Workflow Patterns

### Git Workflow Pattern
1. Create feature branch
2. Make changes
3. Run typecheck/tests
4. Get approval
5. Commit with descriptive message
6. Push only with permission
7. Never merge without approval

### Error Handling Pattern
```python
try:
    result = await risky_operation()
except SpecificError as e:
    logger.error(f"Known issue: {e}")
    return error_response(details=str(e))
except Exception as e:
    logger.exception("Unexpected error")
    return error_response(generic=True)
finally:
    cleanup_resources()
```

### Testing Pattern
1. Unit tests for utilities
2. Integration tests for endpoints
3. Isolated tests without database
4. Mock external services
5. Test both success and failure paths

## 🏗️ Architecture Patterns

### Service Layer Pattern
**Structure**: Route → Service → Repository → Database
**Benefits**: Separation of concerns, testability
**Example**: CV upload → CVService → CVRepository → SQLite

### Event-Driven Updates Pattern
**Structure**: Action → Event → Multiple Listeners
**Benefits**: Decoupled systems, real-time updates
**Example**: CV extracted → SSE notification, metrics update, cache update

### Sandbox Isolation Pattern
**Structure**: Main project → Isolated sandbox → Generated code
**Benefits**: Security, no pollution, safe preview
**Example**: Portfolio generation in sandboxes/

### Configuration Cascade Pattern
**Structure**: Env vars → Config file → Defaults
**Benefits**: Flexible deployment, secure secrets
**Example**: `os.getenv("KEY", config.KEY, "default")`

## 📊 Performance Patterns

### Lazy Loading Pattern
**When**: Large datasets or expensive operations
**How**: Load only when needed, cache after first load
**Example**: CV sections loaded on demand in editor

### Batch Processing Pattern
**When**: Multiple similar operations
**How**: Group operations, process together
**Example**: Multiple file uploads processed as batch

### Streaming Response Pattern
**When**: Long-running operations
**How**: Server-Sent Events for progress
**Example**: Portfolio generation progress updates

## 🔒 Security Patterns

### Defense in Depth
1. Input validation (Resume Gate)
2. Authentication check
3. Authorization verification
4. Rate limiting
5. Resource limits

### Least Privilege Pattern
**Principle**: Grant minimum necessary access
**Example**: Anonymous users can validate but not extract
**Implementation**: Role-based permissions

### Secure by Default Pattern
**Principle**: Restrictive defaults, explicit enablement
**Example**: All endpoints require auth unless explicitly public
**Implementation**: Global middleware with exceptions

## 🎨 UI/UX Patterns

### Progressive Disclosure Pattern
**When**: Complex features
**How**: Show basic first, advanced on demand
**Example**: CV editor shows main sections, expands others

### Optimistic UI Pattern
**When**: Fast operations likely to succeed
**How**: Update UI immediately, rollback on error
**Example**: Section reordering in portfolio

### Loading State Pattern
```typescript
const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
```

## 📝 Documentation Patterns

### Agent Output Pattern
```markdown
# [Task Description] - [Date]

## Summary
Brief overview of what was analyzed/done

## Findings
### 🔴 Critical
- Issues requiring immediate attention

### 🟠 High Priority
- Important but not urgent

### 🟡 Medium Priority
- Should be addressed soon

### 🟢 Low Priority
- Nice to have improvements

## Actions Taken
- What was changed
- What was created

## Next Steps
- Recommendations for follow-up
```

### README Pattern
1. What it is
2. Quick start
3. Architecture
4. API reference
5. Configuration
6. Troubleshooting
7. Contributing

---

*Last Updated: 2025-01-08*
*Purpose: Capture successful patterns for consistent development*
*Note: Add new patterns as they prove successful*