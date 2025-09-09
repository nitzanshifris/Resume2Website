 Pre-Handover Checklist & DevOps Responsibilities for RESUME2WEBSITE

  What YOU Need to Do Before Handover

  1. Code Cleanup & Documentation

  Remove All Secrets from Code

  # Search for hardcoded secrets
  grep -r "sk_" .  # Stripe keys
  grep -r "anthropic" . # Claude API keys
  grep -r "password" . # Hardcoded passwords
  grep -r "secret" . # Any secrets

  # Files to check specifically:
  - config.py
  - src/utils/setup_keychain.py
  - .env files (should be in .gitignore)

  Create Environment Template

  # Create .env.example file
  cat > .env.example << 'EOF'
  # Database
  DATABASE_URL=postgresql://user:pass@host/dbname
  DATABASE_TYPE=postgresql  # or sqlite for local

  # AWS
  AWS_REGION=us-east-1
  S3_BUCKET_NAME=resume2website-uploads
  S3_BUCKET_REGION=us-east-1

  # Redis/ElastiCache
  REDIS_URL=redis://localhost:6379
  SESSION_TTL=604800

  # API Keys (get from DevOps)
  CLAUDE_API_KEY=
  STRIPE_SECRET_KEY=
  STRIPE_PUBLISHABLE_KEY=
  GOOGLE_CLIENT_ID=
  GOOGLE_CLIENT_SECRET=
  LINKEDIN_CLIENT_ID=
  LINKEDIN_CLIENT_SECRET=

  # Vercel (if keeping)
  VERCEL_TOKEN=
  VERCEL_TEAM_ID=

  # Application
  BACKEND_PORT=2000
  FRONTEND_PORT=3000
  ENVIRONMENT=development  # development|staging|production
  LOG_LEVEL=INFO
  MAX_ACTIVE_PORTFOLIOS=20
  PORTFOLIO_CLEANUP_HOURS=24

  # URLs
  FRONTEND_URL=http://localhost:3000
  BACKEND_URL=http://localhost:2000
  EOF

  2. Create Technical Documentation

  System Requirements Document

  # RESUME2WEBSITE Technical Requirements

  ## Core Dependencies
  - Python 3.11+ (Backend)
  - Node.js 18+ (Frontend)
  - PostgreSQL 14+ (or Aurora)
  - Redis 6+ (Sessions)

  ## Critical Business Logic
  1. **CV Extraction Flow**
     - Uses Claude 4 Opus ONLY (temperature 0.0)
     - Must maintain 18 sections structure
     - Circuit breaker: 5 failures → 60s timeout
     - Extraction timeout: 120 seconds max

  2. **Portfolio Generation**
     - Currently spawns Next.js instances (ports 4000-5000)
     - Each portfolio runs as separate process
     - 512MB memory limit per portfolio
     - Auto-cleanup after 24 hours

  3. **Payment Integration**
     - Stripe Embedded Checkout
     - Webhook endpoint: /api/v1/payments/webhook
     - Must handle stripe.checkout.session.completed

  4. **Authentication**
     - Session-based (currently SQLite)
     - 7-day session expiry
     - OAuth providers: Google, LinkedIn

  ## Data Persistence
  - User uploaded CVs must be preserved
  - CV extraction cache important for cost
  - Portfolio data linked to user sessions

  ## Performance Requirements
  - CV extraction: 40-60 seconds acceptable
  - Portfolio generation: 2-3 minutes max
  - API response time: <500ms for CRUD
  - Concurrent users: Support 100+

  3. Prepare Codebase

  Add Database Abstraction Layer

  # src/api/db_interface.py - Create this file
  from abc import ABC, abstractmethod
  from typing import Optional, List, Dict

  class DatabaseInterface(ABC):
      """Interface for database operations - implement for different DBs"""

      @abstractmethod
      async def get_user_by_email(self, email: str) -> Optional[Dict]:
          """Get user by email"""
          pass

      @abstractmethod
      async def create_session(self, user_id: str) -> str:
          """Create user session"""
          pass

      @abstractmethod
      async def get_cv_data(self, job_id: str) -> Optional[Dict]:
          """Get CV extraction data"""
          pass

      @abstractmethod
      async def save_cv_data(self, job_id: str, data: Dict) -> bool:
          """Save CV extraction data"""
          pass

  # Current implementation
  class SQLiteDatabase(DatabaseInterface):
      """Current SQLite implementation"""
      # Move existing code here

  # DevOps will implement
  class PostgreSQLDatabase(DatabaseInterface):
      """PostgreSQL/Aurora implementation"""
      pass

  Add Storage Abstraction Layer

  # src/services/storage_interface.py - Create this file
  from abc import ABC, abstractmethod

  class StorageInterface(ABC):
      """Interface for file storage - implement for S3/local"""

      @abstractmethod
      async def upload_file(self, file_content: bytes, path: str) -> str:
          """Upload file and return URL/path"""
          pass

      @abstractmethod
      async def download_file(self, path: str) -> bytes:
          """Download file content"""
          pass

      @abstractmethod
      async def delete_file(self, path: str) -> bool:
          """Delete file"""
          pass

  # Current implementation
  class LocalStorage(StorageInterface):
      """Local filesystem storage"""
      def __init__(self):
          self.base_path = "data/uploads"

  # DevOps will implement
  class S3Storage(StorageInterface):
      """AWS S3 storage"""
      pass

  4. Create Integration Test Suite

  # tests/integration/test_critical_paths.py
  import pytest
  from httpx import AsyncClient

  class TestCriticalPaths:
      """Critical paths that MUST work in production"""

      @pytest.mark.asyncio
      async def test_user_registration(self):
          """Test user can register"""
          async with AsyncClient(base_url="http://localhost:2000") as client:
              response = await client.post("/api/v1/auth/register", json={
                  "email": "test@example.com",
                  "password": "TestPass123!",
                  "full_name": "Test User"
              })
              assert response.status_code == 200
              assert "session_id" in response.json()

      @pytest.mark.asyncio
      async def test_cv_upload_and_extraction(self):
          """Test CV upload → extraction → retrieval flow"""
          # This is CRITICAL - must work
          pass

      @pytest.mark.asyncio
      async def test_portfolio_generation(self):
          """Test portfolio generation flow"""
          # This is the core business logic
          pass

      @pytest.mark.asyncio
      async def test_payment_webhook(self):
          """Test Stripe webhook processing"""
          # Payment flow must not break
          pass

  5. Document Current Pain Points

  # Known Issues & Limitations

  ## Portfolio Generation
  - **PROBLEM**: Spawns Next.js dev servers on ports 4000-5000
  - **ISSUE**: Won't work in Kubernetes (can't dynamically allocate ports)
  - **SUGGESTION**: Need to redesign as static builds or use subdomain routing

  ## Database
  - **PROBLEM**: SQLite file-based database
  - **ISSUE**: Can't share between pods
  - **SUGGESTION**: Migrate to PostgreSQL/Aurora

  ## File Storage
  - **PROBLEM**: Files stored in local `data/` directory
  - **ISSUE**: Won't persist in containers
  - **SUGGESTION**: Move to S3

  ## Sessions
  - **PROBLEM**: Sessions in SQLite
  - **ISSUE**: Not shared between pods
  - **SUGGESTION**: Use Redis/ElastiCache

  ## Sandbox System
  - **PROBLEM**: Creates directories in `sandboxes/`
  - **ISSUE**: Temporary files won't work in containers
  - **SUGGESTION**: Use S3 or EFS for temporary storage

  6. Prepare Dependency Lists

  # Create detailed requirements
  pip freeze > requirements-detailed.txt

  # Create package list with versions
  cd user_web_example
  npm list --depth=0 > npm-dependencies.txt

  # Document binary dependencies
  cat > system-dependencies.txt << 'EOF'
  # System packages needed
  python3-dev  # For Python C extensions
  nodejs       # Version 18+
  npm          # For portfolio sandboxes
  git          # For Vercel CLI
  curl         # For health checks
  build-essential  # For compiling packages
  EOF

  ---
  What the DevOps Professional Will Do

  1. Infrastructure Setup

  AWS Resources Creation

  He will create:
  - VPC with public/private subnets
  - EKS/ECS cluster
  - RDS Aurora PostgreSQL
  - ElastiCache Redis cluster
  - S3 buckets for storage
  - CloudFront distribution
  - ALB/NLB load balancers
  - Route53 DNS records
  - ACM SSL certificates
  - IAM roles and policies
  - Secrets Manager entries
  - CloudWatch log groups

  2. Containerization

  Docker Images

  # He will create optimized Dockerfiles
  - Multi-stage builds for smaller images
  - Security scanning with Trivy/Snyk
  - Non-root user configurations
  - Health check implementations
  - Proper layer caching

  3. Database Migration

  -- He will handle:
  1. Schema conversion from SQLite to PostgreSQL
  2. Data migration scripts
  3. Connection pooling setup
  4. Read replicas if needed
  5. Backup strategies

  4. Kubernetes/ECS Configuration

  He will create:
  - Deployment manifests
  - Service definitions
  - Ingress/ALB configuration
  - HPA (Horizontal Pod Autoscaler)
  - ConfigMaps for configuration
  - Secrets for sensitive data
  - NetworkPolicies for security
  - PodDisruptionBudgets
  - Helm charts or Kustomize configs

  5. CI/CD Pipeline

  # He will set up:
  - GitHub Actions/GitLab CI/Jenkins
  - Automated testing
  - Docker image building
  - Security scanning
  - Deployment to staging
  - Approval gates
  - Production deployment
  - Rollback procedures

  6. Monitoring & Logging

  He will implement:
  - CloudWatch/Datadog integration
  - Prometheus metrics
  - Grafana dashboards
  - Alert rules
  - Log aggregation (ELK/CloudWatch)
  - Distributed tracing (X-Ray/Jaeger)
  - Uptime monitoring
  - Cost monitoring

  7. Security Hardening

  He will handle:
  - Secrets rotation
  - Network policies
  - WAF rules
  - Security groups
  - RBAC configuration
  - Pod security policies
  - Image vulnerability scanning
  - Compliance checks

  8. Portfolio System Redesign

  He needs to solve the biggest challenge:

  Current Problem

  # src/api/routes/portfolio_generator.py
  # Line 450-480: Creates local Next.js instances
  async def generate_portfolio(job_id: str):
      # This spawns a Next.js dev server on ports 4000-5000
      # DOESN'T WORK IN KUBERNETES!

  Solutions He Might Implement

  Option 1: Static Generation
  # Build portfolio as static files → Upload to S3 → Serve via CloudFront
  async def generate_portfolio_static(job_id: str):
      # Run Next.js build in container
      # Upload to S3
      # Return CloudFront URL

  Option 2: Kubernetes Jobs
  # Create K8s Job for each portfolio → Build → Store in S3
  async def generate_portfolio_k8s(job_id: str):
      # Create Kubernetes Job
      # Job builds portfolio
      # Uploads to S3
      # Deletes Job after completion

  Option 3: Lambda Functions
  # Use Lambda for portfolio generation (if under 15 min)
  async def generate_portfolio_lambda(job_id: str):
      # Invoke Lambda
      # Lambda builds and uploads to S3

  ---
  Communication Protocol with DevOps

  1. Initial Handover Meeting Agenda

  ## Topics to Discuss

  1. **Architecture Overview**
     - Show current data flow
     - Explain portfolio generation process
     - Highlight stateful components

  2. **Critical Business Requirements**
     - CV extraction must use Claude 4 Opus
     - 18 sections structure is fixed
     - Portfolio preview before deployment
     - Stripe payment integration

  3. **Current Pain Points**
     - Portfolio sandboxes (biggest issue)
     - Dynamic port allocation
     - Local file storage
     - SQLite limitations

  4. **Performance Requirements**
     - Expected user load
     - Acceptable latency
     - Scaling requirements

  5. **Security Requirements**
     - PII data handling
     - API key management
     - OAuth integration

  6. **Questions for DevOps**
     - EKS vs ECS preference?
     - Database migration strategy?
     - How to handle portfolio generation?
     - Monitoring tool preferences?

  2. Provide Access

  # Grant necessary access
  1. GitHub repository (read/write)
  2. AWS account (if exists)
  3. Vercel account (if keeping)
  4. Stripe webhook endpoints
  5. Google/LinkedIn OAuth apps
  6. Domain registrar (for DNS)

  3. Define Success Criteria

  ## Deployment Success Criteria

  ### Phase 1: Basic Functionality
  - [ ] Application runs in Kubernetes/ECS
  - [ ] Database migrated to RDS
  - [ ] Files stored in S3
  - [ ] Sessions in Redis
  - [ ] Basic health checks passing

  ### Phase 2: Full Functionality
  - [ ] CV upload and extraction working
  - [ ] Portfolio generation working
  - [ ] Payment processing working
  - [ ] OAuth login working
  - [ ] All API endpoints responding

  ### Phase 3: Production Ready
  - [ ] Auto-scaling configured
  - [ ] Monitoring dashboards live
  - [ ] Alerts configured
  - [ ] Backup strategy in place
  - [ ] Disaster recovery tested
  - [ ] Documentation complete

  ---
  Quick Reference for DevOps

  Critical Files to Review

  # Backend
  config.py                                    # All configuration
  main.py                                      # FastAPI entry point
  src/api/routes/portfolio_generator.py       # BIGGEST CHALLENGE - portfolio generation
  src/api/routes/cv.py                        # File upload handling
  src/api/db.py                               # Database operations
  src/core/cv_extraction/data_extractor.py    # Claude API integration

  # Frontend
  user_web_example/package.json               # Dependencies
  user_web_example/app/page.tsx              # Main app entry
  user_web_example/.env.local                # Frontend environment

  # Configuration
  requirements.txt                            # Python dependencies
  .env.example                               # Environment template

  Commands They Need to Know

  # Local development
  python3 -m venv venv && source venv/bin/activate
  pip install -r requirements.txt
  python3 main.py  # Starts backend on port 2000

  cd user_web_example
  pnpm install  # Note: uses pnpm, not npm
  pnpm run dev  # Starts frontend on port 3000

  # Testing
  pytest tests/
  pnpm run typecheck

  ⚠️ Critical Warnings for DevOps

  1. DON'T change the CV data structure (18 sections are hardcoded everywhere)
  2. DON'T change Claude model (must be Claude 4 Opus with temperature 0.0)
  3. DON'T break the portfolio preview flow (users expect to see before paying)
  4. CAREFUL with package managers (main project uses pnpm, sandboxes use npm)
  5. PRESERVE uploaded CVs (users expect them to persist)
  6. TEST payment webhooks thoroughly (Stripe integration is critical)

  ---
  Final Checklist Before Handover

  - Remove all secrets from code
  - Create .env.example file
  - Document all environment variables
  - Create database abstraction interface
  - Create storage abstraction interface
  - Write integration tests
  - Document known issues
  - Provide system dependencies list
  - Schedule handover meeting
  - Grant necessary access
  - Define success criteria
  - Create emergency contact list

  With this preparation, your DevOps professional will have everything needed to successfully migrate RESUME2WEBSITE to Kubernetes!