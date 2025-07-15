# Product Requirements Document: CV2WEB Lovable Integration

## Executive Summary

This PRD outlines the comprehensive integration of advanced patterns and technologies from the lovable-clone project into CV2WEB. The goal is to transform CV2WEB from a template-based portfolio generator into a sophisticated, AI-powered platform with real-time feedback, isolated execution environments, and enhanced user experience.

## Project Overview

### Current State
- **CV Extraction**: Google Gemini 2.5 Flash
- **Portfolio Generation**: Template-based with fixed components
- **Execution**: Direct file system manipulation
- **Feedback**: No real-time progress updates
- **Preview**: Local only, no public URLs

### Future State
- **CV Extraction**: Google Gemini 2.5 Flash (unchanged)
- **Portfolio Generation**: Hybrid AI-powered (Gemini + Claude)
- **Execution**: Isolated Docker containers via Daytona
- **Feedback**: Real-time SSE streaming
- **Preview**: Public URLs with sandboxed environments

## Business Requirements

### Goals
1. **Enhance Security**: Isolate code generation from main system
2. **Improve UX**: Provide real-time progress feedback
3. **Increase Creativity**: Use AI for custom component generation
4. **Enable Scale**: Support concurrent users with isolated environments
5. **Professional Quality**: Enterprise-grade error handling and monitoring

### Success Metrics
- **Performance**: < 30s portfolio generation time
- **Reliability**: 99.9% uptime for sandbox creation
- **User Satisfaction**: > 90% satisfaction with real-time feedback
- **Security**: Zero code execution vulnerabilities
- **Scale**: Support 100+ concurrent portfolio generations

## Technical Requirements

### Phase 1: Enhanced Logging & Real-time Feedback (Week 1)

#### 1.1 Server-Sent Events (SSE) Infrastructure
**Requirement**: Implement SSE endpoints for all long-running operations

**Endpoints**:
- `/api/cv/extract-streaming` - Stream CV extraction progress
- `/api/portfolio/generate-streaming` - Stream portfolio generation
- `/api/sandbox/status-streaming/{job_id}` - Stream sandbox status

**Message Types**:
```python
class SSEMessage(BaseModel):
    type: Literal["progress", "step", "complete", "error", "warning"]
    timestamp: datetime
    data: Dict[str, Any]
    
class ProgressData(BaseModel):
    step: str
    progress: int  # 0-100
    message: str
    duration: Optional[float]
```

#### 1.2 Enhanced Logging System
**Requirement**: Extend LiveLogger with SSE integration

**Features**:
- Auto-emit SSE messages for all log events
- Correlation IDs for tracking across services
- Performance metrics collection
- Log aggregation for debugging

**Implementation**:
```python
class SSELiveLogger(LiveLogger):
    def __init__(self, name: str, sse_queue: Optional[Queue] = None):
        super().__init__(name)
        self.sse_queue = sse_queue
        
    def step(self, step_name: str, details: Optional[Dict] = None):
        super().step(step_name, details)
        if self.sse_queue:
            self.sse_queue.put(SSEMessage(
                type="step",
                timestamp=datetime.now(),
                data={"step": step_name, "details": details}
            ))
```

#### 1.3 Frontend Progress Components
**Requirement**: Create React components for real-time progress display

**Components**:
- `<ProgressStream />` - SSE consumer component
- `<StepIndicator />` - Visual step progress
- `<LogViewer />` - Real-time log display
- `<ErrorBoundary />` - Graceful error handling

### Phase 2: Claude SDK Integration (Week 2)

#### 2.1 Claude Code SDK Setup
**Requirement**: Integrate @anthropic-ai/claude-code SDK

**Configuration**:
```python
CLAUDE_CODE_CONFIG = {
    "model": "claude-3-5-sonnet-20241022",
    "max_retries": 3,
    "retry_delay": 1.0,
    "cache_ttl": 3600,
    "allowed_tools": ["Write", "Edit", "MultiEdit", "Read"],
    "max_turns": 10
}
```

#### 2.2 Hybrid AI Generation System
**Requirement**: Combine Gemini extraction with Claude generation

**Architecture**:
```
CV File → Gemini (Extract) → Structured Data → Claude (Generate) → Portfolio
```

**Features**:
- Gemini for structured CV data extraction
- Claude for creative component generation
- Template fallback for reliability
- Component caching for performance

#### 2.3 AI Component Library
**Requirement**: Create AI-generated component system

**Components to Generate**:
- Hero sections with unique animations
- Skills visualizations based on data
- Timeline components for experience
- Project galleries with filters
- Contact forms with validation

### Phase 3: Daytona Sandboxing (Week 3-4)

#### 3.1 Daytona SDK Integration
**Requirement**: Implement isolated execution environments

**Dependencies**:
```python
# requirements.txt
daytona-sdk>=1.0.0
```

**Configuration**:
```python
DAYTONA_CONFIG = {
    "api_key": os.getenv("DAYTONA_API_KEY"),
    "default_image": "node:20",
    "resources": {
        "cpu": 2,
        "memory": 4,  # GB
        "disk": 10    # GB
    },
    "auto_stop_interval": 3600,  # 1 hour
    "max_sandboxes_per_user": 3
}
```

#### 3.2 Sandbox Lifecycle Management
**Requirement**: Complete sandbox lifecycle handling

**Lifecycle States**:
1. **Creating** - Provisioning resources
2. **Building** - Installing dependencies
3. **Running** - Portfolio accessible
4. **Stopping** - Graceful shutdown
5. **Archived** - Moved to cold storage
6. **Deleted** - Resources released

**APIs**:
```python
class SandboxService:
    async def create_sandbox(self, job_id: str, cv_data: CVData) -> Sandbox
    async def get_sandbox_status(self, sandbox_id: str) -> SandboxStatus
    async def get_preview_url(self, sandbox_id: str) -> str
    async def stop_sandbox(self, sandbox_id: str) -> None
    async def delete_sandbox(self, sandbox_id: str) -> None
    async def cleanup_old_sandboxes(self, age_hours: int = 24) -> int
```

#### 3.3 Preview URL System
**Requirement**: Public preview URLs for generated portfolios

**Features**:
- Unique URLs per sandbox
- SSL/TLS encryption
- Access control (optional)
- QR code generation
- Expiration handling

### Phase 4: Production Features (Week 5)

#### 4.1 Two-Mode Architecture
**Requirement**: Support both development and production modes

**Modes**:
1. **Development Mode**:
   - Direct file system access
   - No sandboxing overhead
   - Instant preview
   - Debug logging

2. **Production Mode**:
   - Full sandboxing
   - Public preview URLs
   - Rate limiting
   - Performance monitoring

#### 4.2 Caching & Optimization
**Requirement**: Implement multi-layer caching

**Cache Layers**:
1. **CV Extraction Cache** - Cache Gemini responses
2. **Component Cache** - Cache Claude-generated components
3. **Sandbox Cache** - Pre-warm sandboxes
4. **CDN Cache** - Static asset caching

#### 4.3 Monitoring & Observability
**Requirement**: Comprehensive monitoring system

**Metrics**:
- Sandbox creation time
- Portfolio generation duration
- AI API response times
- Error rates by type
- User engagement metrics

**Tools**:
- Prometheus for metrics
- Grafana for visualization
- Sentry for error tracking
- CloudWatch for infrastructure

#### 4.4 Error Recovery System
**Requirement**: Robust error handling and recovery

**Features**:
- Automatic retry with exponential backoff
- Fallback to templates on AI failure
- Partial progress recovery
- User-friendly error messages
- Admin alerts for critical failures

## API Specifications

### New Endpoints

#### 1. Streaming CV Extraction
```
POST /api/cv/extract-streaming
Content-Type: multipart/form-data

Response: text/event-stream
data: {"type": "progress", "step": "parsing", "progress": 25}
data: {"type": "complete", "cv_data": {...}}
```

#### 2. Sandboxed Portfolio Generation
```
POST /api/portfolio/generate-sandboxed
Content-Type: application/json
{
  "cv_data": {...},
  "options": {
    "mode": "sandbox",
    "ai_components": true,
    "template": "modern"
  }
}

Response:
{
  "job_id": "uuid",
  "sandbox_id": "daytona-id",
  "status": "creating",
  "preview_url": null
}
```

#### 3. Sandbox Status
```
GET /api/sandbox/status/{job_id}

Response:
{
  "status": "running",
  "preview_url": "https://preview.cv2web.com/abc123",
  "progress": 100,
  "created_at": "2025-01-14T10:00:00Z",
  "expires_at": "2025-01-14T11:00:00Z"
}
```

## Database Schema Updates

### New Tables

#### sandboxes
```sql
CREATE TABLE sandboxes (
    id UUID PRIMARY KEY,
    job_id UUID NOT NULL,
    user_id UUID NOT NULL,
    daytona_sandbox_id VARCHAR(255),
    status VARCHAR(50) NOT NULL,
    preview_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    metadata JSONB
);

CREATE INDEX idx_sandboxes_user_id ON sandboxes(user_id);
CREATE INDEX idx_sandboxes_status ON sandboxes(status);
CREATE INDEX idx_sandboxes_expires_at ON sandboxes(expires_at);
```

#### ai_generations
```sql
CREATE TABLE ai_generations (
    id UUID PRIMARY KEY,
    job_id UUID NOT NULL,
    component_type VARCHAR(100) NOT NULL,
    prompt TEXT NOT NULL,
    response TEXT,
    model VARCHAR(50),
    tokens_used INTEGER,
    cache_key VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ai_generations_cache_key ON ai_generations(cache_key);
```

## Security Considerations

### Sandbox Isolation
- No network access to internal services
- Read-only access to template files
- Resource limits enforced
- Automatic cleanup on timeout

### API Security
- Rate limiting per user
- API key rotation
- Request signing
- Input validation

### Data Protection
- CV data encrypted at rest
- Sandboxes isolated per user
- Automatic data expiration
- GDPR compliance

## Performance Requirements

### Response Times
- CV extraction: < 5 seconds
- Portfolio generation: < 30 seconds
- Sandbox creation: < 10 seconds
- Preview URL generation: < 2 seconds

### Scalability
- Support 100+ concurrent users
- Horizontal scaling for API servers
- Sandbox pool management
- CDN for static assets

## Testing Requirements

### Unit Tests
- SSE message formatting
- Claude SDK integration
- Sandbox lifecycle management
- Error recovery logic

### Integration Tests
- End-to-end portfolio generation
- Sandbox creation and deletion
- AI service failover
- Cache invalidation

### Performance Tests
- Load testing with 100 concurrent users
- Stress testing sandbox creation
- API response time benchmarks
- Memory leak detection

### Security Tests
- Sandbox escape attempts
- API authentication bypass
- Input validation fuzzing
- Resource exhaustion attacks

## Rollout Plan

### Week 1: Foundation
- Implement SSE infrastructure
- Deploy enhanced logging
- Create progress UI components
- Test with existing endpoints

### Week 2: AI Enhancement
- Integrate Claude SDK
- Build hybrid generation system
- Create component library
- A/B test AI vs templates

### Week 3-4: Sandboxing
- Deploy Daytona integration
- Implement lifecycle management
- Create preview URL system
- Test isolation security

### Week 5: Production
- Enable two-mode architecture
- Deploy caching layers
- Set up monitoring
- Launch to users

## Success Criteria

### Technical
- Zero security vulnerabilities
- < 1% error rate
- 99.9% uptime
- < 30s generation time

### Business
- 50% reduction in support tickets
- 90% user satisfaction score
- 2x increase in portfolio completions
- 25% reduction in infrastructure costs

## Risk Mitigation

### Technical Risks
1. **Daytona Service Outage**
   - Mitigation: Fallback to local generation
   - Detection: Health checks every 30s

2. **AI API Rate Limits**
   - Mitigation: Request queuing and caching
   - Detection: Rate limit monitoring

3. **Sandbox Resource Exhaustion**
   - Mitigation: Resource quotas and monitoring
   - Detection: Resource usage alerts

### Business Risks
1. **User Adoption**
   - Mitigation: Gradual rollout with A/B testing
   - Detection: Usage analytics

2. **Cost Overrun**
   - Mitigation: Usage-based pricing model
   - Detection: Cost monitoring dashboards

## Appendix

### Technology Stack
- **Backend**: FastAPI, Python 3.11+
- **Frontend**: Next.js 15, TypeScript
- **AI Services**: Gemini 2.5, Claude 3.5
- **Sandboxing**: Daytona SDK
- **Database**: PostgreSQL
- **Cache**: Redis
- **Monitoring**: Prometheus, Grafana
- **CDN**: Cloudflare

### References
- [Daytona SDK Documentation](https://docs.daytona.io)
- [Claude Code SDK](https://github.com/anthropics/claude-code)
- [SSE Specification](https://html.spec.whatwg.org/multipage/server-sent-events.html)
- [Lovable Clone Analysis](./lovable-clone-analysis.md)

---

*PRD Version: 1.0*  
*Created: 2025-01-14*  
*Author: CV2WEB Development Team*