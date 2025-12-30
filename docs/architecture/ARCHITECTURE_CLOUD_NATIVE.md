# Cloud-Native Architecture Plan for Resume2Website V4

## Overview
Preparing Resume2Website for Kubernetes/AWS deployment while maintaining local development capability.

## Key Architectural Changes for Kubernetes/AWS

### 1. **Stateless Services** 🔑
**Current Problem:** Heavy reliance on localStorage and in-memory state
**Cloud Solution:** 
```yaml
# Kubernetes ready architecture
Frontend:
  - Stateless Next.js pods (can scale horizontally)
  - Session affinity not required
  - State in Redis/DynamoDB

Backend:
  - Stateless FastAPI pods
  - JWT tokens (no server sessions)
  - Distributed cache (Redis/ElastiCache)
```

### 2. **Authentication Refactor** 🔐
**Current:** Session-based with SQLite
**Cloud-Native:**
```python
# JWT-based authentication
- Stateless tokens
- Works across multiple pods
- Can use AWS Cognito later
- Local: JWT with local secret
- Production: JWT with AWS KMS
```

### 3. **Storage Strategy** 💾
```yaml
Current State Storage:
  localStorage → Redis (AWS ElastiCache)
  SQLite → PostgreSQL (AWS RDS)
  File uploads → S3 (AWS S3 / MinIO locally)
  
Benefits:
  - Pods can die/restart without data loss
  - Horizontal scaling possible
  - Works locally with Docker containers
```

### 4. **Service Mesh Architecture** 🕸️
```yaml
services:
  api-gateway:
    - Kong/Nginx (local)
    - AWS API Gateway (production)
    
  frontend:
    - Multiple Next.js instances
    - Behind load balancer
    
  backend:
    - Multiple FastAPI instances
    - Service discovery via DNS
    
  workers:
    - CV extraction workers (scalable)
    - Portfolio generation workers
    - Queue: SQS/RabbitMQ
```

### 5. **Container Structure** 🐳
```dockerfile
# Microservices approach
resume2website/
├── services/
│   ├── frontend/
│   │   ├── Dockerfile
│   │   └── k8s-deployment.yaml
│   ├── api/
│   │   ├── Dockerfile
│   │   └── k8s-deployment.yaml
│   ├── cv-extractor/
│   │   ├── Dockerfile
│   │   └── k8s-job.yaml
│   └── portfolio-generator/
│       ├── Dockerfile
│       └── k8s-job.yaml
```

### 6. **Configuration Management** ⚙️
```yaml
# 12-Factor App Compliance
Environment Variables:
  - DATABASE_URL (local: sqlite, prod: postgres)
  - REDIS_URL (local: localhost, prod: elasticache)
  - S3_BUCKET (local: minio, prod: s3)
  - JWT_SECRET (local: dev-secret, prod: KMS)
  
ConfigMaps:
  - Feature flags
  - API endpoints
  - Rate limits
  
Secrets:
  - API keys (Claude, Stripe)
  - Database credentials
  - JWT secrets
```

### 7. **Queue-Based Processing** 📬
```python
# Async job processing
Current: Direct API calls
Cloud: Message Queue Pattern

Flow:
1. API receives upload → Sends to SQS
2. Worker pods process CV extraction
3. Results stored in S3/RDS
4. Frontend polls or uses WebSocket

Benefits:
- Resilient to failures
- Auto-scaling based on queue depth
- Works locally with RabbitMQ
```

### 8. **Health Checks & Monitoring** 🏥
```python
# Kubernetes probes
@app.get("/health/live")
async def liveness():
    return {"status": "alive"}

@app.get("/health/ready")
async def readiness():
    # Check DB connection
    # Check Redis connection
    # Check S3 access
    return {"status": "ready"}

# Metrics endpoint
@app.get("/metrics")
async def metrics():
    # Prometheus format
    return prometheus_metrics()
```

### 9. **Distributed Tracing** 📊
```python
# OpenTelemetry integration
from opentelemetry import trace

tracer = trace.get_tracer(__name__)

@app.post("/api/v1/upload")
async def upload(file: UploadFile):
    with tracer.start_as_current_span("cv-upload"):
        # Trace through entire request
        span = trace.get_current_span()
        span.set_attribute("file.size", file.size)
        # Process...
```

### 10. **Circuit Breaker Pattern** 🔌
```python
# For external services (Claude API)
from circuit_breaker import CircuitBreaker

claude_breaker = CircuitBreaker(
    failure_threshold=5,
    recovery_timeout=60,
    expected_exception=APIException
)

@claude_breaker
async def call_claude_api(prompt):
    # Prevents cascade failures
    return await claude.complete(prompt)
```

## Migration Path

### Phase 1: Local Refactoring (Week 1-2)
```bash
# Still runs locally as before
pnpm run dev          # Frontend
python main.py        # Backend

# But internally using:
- Redis (via Docker)
- PostgreSQL (via Docker)  
- MinIO for S3 (via Docker)
```

### Phase 2: Docker Compose (Week 3)
```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    build: ./services/frontend
    environment:
      - API_URL=http://api:2000
  
  api:
    build: ./services/api
    environment:
      - DATABASE_URL=postgresql://...
      - REDIS_URL=redis://redis:6379
  
  redis:
    image: redis:alpine
  
  postgres:
    image: postgres:14
  
  minio:
    image: minio/minio
```

### Phase 3: Local Kubernetes (Week 4)
```bash
# Test with minikube
minikube start
kubectl apply -f k8s/

# Or with kind
kind create cluster
kubectl apply -f k8s/
```

### Phase 4: AWS Deployment (Week 5+)
```bash
# EKS deployment
eksctl create cluster --name resume2website
kubectl apply -f k8s/production/
```

## Code Changes Required

### 1. Replace localStorage
```typescript
// Before (browser-only)
localStorage.setItem('user', JSON.stringify(user))

// After (works in Kubernetes)
import { cache } from '@/lib/cache'
await cache.set('user', user, { ttl: 3600 })
```

### 2. Stateless Authentication
```typescript
// Before (session-based)
req.session.user = user

// After (JWT-based)
const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET)
res.header('Authorization', `Bearer ${token}`)
```

### 3. File Storage
```python
# Before (local filesystem)
file.save(f"data/uploads/{filename}")

# After (S3-compatible)
s3_client.upload_fileobj(file, bucket, key)
```

### 4. Background Jobs
```python
# Before (direct processing)
result = extract_cv(file)

# After (queue-based)
queue.send_message({
    'jobId': job_id,
    'action': 'extract_cv',
    'file_url': s3_url
})
```

## Environment Variables

```env
# .env.local (development)
DATABASE_URL=sqlite:///./app.db
REDIS_URL=redis://localhost:6379
S3_ENDPOINT=http://localhost:9000
S3_BUCKET=resume2website-dev
JWT_SECRET=dev-secret-key

# .env.production (Kubernetes/AWS)
DATABASE_URL=postgresql://rds.amazonaws.com/resume2website
REDIS_URL=redis://elasticache.amazonaws.com
S3_BUCKET=resume2website-prod
JWT_SECRET=${AWS_KMS_SECRET}
```

## Benefits of This Architecture

1. **Scalability**: Can handle 1 or 10,000 users
2. **Resilience**: Pods can die without data loss
3. **Cost-Effective**: Scale down when not in use
4. **Developer Friendly**: Same code runs locally and in cloud
5. **AWS Native**: Ready for managed services (RDS, ElastiCache, S3)
6. **Observable**: Full tracing, metrics, and logging
7. **Secure**: Secrets management, network policies
8. **CI/CD Ready**: GitOps with ArgoCD/Flux

## Local Development Setup

```bash
# Start infrastructure
docker-compose up -d redis postgres minio

# Run services
pnpm run dev
python main.py

# Everything works exactly as before!
```

## Next Steps

1. ✅ Refactor authentication to JWT
2. ✅ Replace localStorage with cache abstraction
3. ✅ Add health check endpoints
4. ✅ Dockerize all services
5. ✅ Create Kubernetes manifests
6. ✅ Test in minikube
7. ✅ Deploy to AWS EKS