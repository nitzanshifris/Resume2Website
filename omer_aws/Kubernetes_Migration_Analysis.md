
⏺ RESUME2WEBSITE AWS Kubernetes Migration Analysis

  Executive Summary

  RESUME2WEBSITE requires significant architectural changes to migrate from a local development environment to AWS Kubernetes. The main challenges include:
  - Converting SQLite to a distributed database (RDS/Aurora)
  - Moving file storage from local filesystem to S3
  - Containerizing the sandbox portfolio generation system
  - Managing stateful sessions across pods
  - Handling dynamic port allocation for portfolio previews

  Estimated Timeline: 8-12 weeks for full migration
  Estimated Monthly AWS Cost: $500-$1,500 depending on traffic
  Risk Level: Medium-High due to sandbox complexity

  ---
  1. Current Architecture Deep Dive

  Stateful Components Analysis

  SQLite Database (src/api/db.py)

  - Current: Single SQLite file at resume2website.db
  - Tables: users, sessions, cv_extractions, portfolios, files
  - Issue: SQLite not suitable for distributed systems
  - Files affected:
    - src/api/db.py (lines 15-45: database initialization)
    - config.py (line 28: DATABASE_URL)

  File Storage (data/ directory)

  - Current Paths:
    - data/uploads/: User CV files
    - data/generated_portfolios/: Portfolio outputs
    - sandboxes/: Temporary portfolio builds
  - Issue: Local filesystem won't work in Kubernetes pods
  - Files affected:
    - src/api/routes/cv.py (lines 180-195: file saving)
    - src/api/routes/portfolio_generator.py (lines 450-480: sandbox creation)

  Session Management

  - Current: In-memory sessions stored in SQLite
  - Session ID: Generated UUID stored in X-Session-ID header
  - Issue: Sessions won't persist across pod restarts
  - Files affected:
    - src/api/auth.py (lines 45-78: session creation)
    - src/api/db.py (lines 200-250: session operations)

  Hardcoded Configurations

  # config.py - Hardcoded values that need environment variables
  BACKEND_PORT = 2000  # Line 15
  FRONTEND_PORT = 3000  # Line 16
  PORTFOLIO_PORT_RANGE = (4000, 5000)  # Line 17
  MAX_ACTIVE_PORTFOLIOS = 20  # Line 45
  PORTFOLIO_CLEANUP_HOURS = 24  # Line 46
  DATABASE_URL = "resume2website.db"  # Line 28
  UPLOAD_DIR = "data/uploads"  # Line 30
  SANDBOX_DIR = "sandboxes"  # Line 31

  Port Usage Map

  - 2000: FastAPI backend
  - 3000: Next.js frontend
  - 4000-5000: Dynamic portfolio preview servers
  - Challenge: Kubernetes services need fixed ports

  ---
  2. Container Readiness Assessment

  Components to Containerize

  Backend Container (FastAPI)

  # Dockerfile.backend
  FROM python:3.11-slim
  WORKDIR /app
  COPY requirements.txt .
  RUN pip install -r requirements.txt
  COPY src/ ./src/
  COPY main.py config.py ./
  CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "2000"]

  Frontend Container (Next.js)

  # Dockerfile.frontend
  FROM node:18-alpine AS builder
  WORKDIR /app
  COPY package.json pnpm-lock.yaml ./
  RUN npm install -g pnpm && pnpm install
  COPY user_web_example/ ./
  RUN pnpm build

  FROM node:18-alpine
  WORKDIR /app
  COPY --from=builder /app/.next ./.next
  COPY --from=builder /app/node_modules ./node_modules
  CMD ["npm", "start"]

  Portfolio Builder Container (Special)

  # Dockerfile.portfolio-builder
  FROM node:18-alpine
  RUN npm install -g vercel
  WORKDIR /app
  # This will run as a job, not a deployment

  Package Management Issues

  - Main project: Uses pnpm (need to handle in Docker)
  - Sandboxes: Use npm (different from main)
  - Solution: Separate containers for each

  OS Dependencies

  # Required system packages
  - python3-dev  # For Python C extensions
  - nodejs      # For Next.js
  - git         # For Vercel CLI
  - curl        # For health checks

  ---
  3. Kubernetes-Specific Requirements

  Pod Architecture Design

  # k8s/backend-deployment.yaml
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: resume2website-backend
  spec:
    replicas: 3
    selector:
      matchLabels:
        app: backend
    template:
      metadata:
        labels:
          app: backend
      spec:
        containers:
        - name: fastapi
          image: resume2website/backend:latest
          ports:
          - containerPort: 2000
          env:
          - name: DATABASE_URL
            valueFrom:
              secretKeyRef:
                name: db-secret
                key: url
          - name: S3_BUCKET
            value: resume2website-uploads
          - name: REDIS_URL
            valueFrom:
              secretKeyRef:
                name: redis-secret
                key: url
          livenessProbe:
            httpGet:
              path: /health
              port: 2000
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /health
              port: 2000
            initialDelaySeconds: 5
            periodSeconds: 5

  Service Mesh Configuration

  # k8s/istio-virtualservice.yaml
  apiVersion: networking.istio.io/v1beta1
  kind: VirtualService
  metadata:
    name: resume2website
  spec:
    hosts:
    - resume2website.com
    http:
    - match:
      - uri:
          prefix: /api
      route:
      - destination:
          host: backend-service
          port:
            number: 2000
    - route:
      - destination:
          host: frontend-service
          port:
            number: 3000

  HPA Configuration

  # k8s/hpa.yaml
  apiVersion: autoscaling/v2
  kind: HorizontalPodAutoscaler
  metadata:
    name: backend-hpa
  spec:
    scaleTargetRef:
      apiVersion: apps/v1
      kind: Deployment
      name: resume2website-backend
    minReplicas: 2
    maxReplicas: 10
    metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80

  Persistent Volume Claims

  # k8s/pvc.yaml
  apiVersion: v1
  kind: PersistentVolumeClaim
  metadata:
    name: portfolio-templates-pvc
  spec:
    accessModes:
      - ReadOnlyMany
    resources:
      requests:
        storage: 10Gi
    storageClassName: gp3

  ---
  4. AWS Services Integration

  Database Migration (SQLite → RDS Aurora)

  Aurora Serverless v2 Configuration

  # src/api/db_aws.py - New database layer
  import boto3
  from sqlalchemy import create_engine
  from sqlalchemy.ext.asyncio import create_async_engine
  import os

  class AWSDatabase:
      def __init__(self):
          self.connection_string = os.environ['AURORA_CONNECTION_STRING']
          # Format: postgresql://user:pass@cluster.region.rds.amazonaws.com/dbname
          self.engine = create_async_engine(
              self.connection_string,
              pool_size=20,
              max_overflow=40,
              pool_pre_ping=True,
              pool_recycle=3600
          )

      async def init_tables(self):
          # Migrate from SQLite schema
          async with self.engine.begin() as conn:
              await conn.run_sync(Base.metadata.create_all)

  S3 Integration for File Storage

  # src/services/s3_storage.py - New S3 storage service
  import boto3
  from typing import Optional
  import uuid

  class S3Storage:
      def __init__(self):
          self.s3 = boto3.client('s3')
          self.bucket = os.environ['S3_BUCKET_NAME']
          self.cloudfront_url = os.environ['CLOUDFRONT_URL']

      async def upload_cv(self, file_content: bytes, filename: str) -> str:
          """Upload CV to S3 and return URL"""
          key = f"uploads/{uuid.uuid4()}/{filename}"

          self.s3.put_object(
              Bucket=self.bucket,
              Key=key,
              Body=file_content,
              ContentType='application/pdf',
              ServerSideEncryption='AES256'
          )

          return f"{self.cloudfront_url}/{key}"

      async def get_file(self, key: str) -> bytes:
          """Retrieve file from S3"""
          response = self.s3.get_object(Bucket=self.bucket, Key=key)
          return response['Body'].read()

  Update cv.py for S3

  # src/api/routes/cv.py - Line 180-195 replacement
  async def upload_cv(file: UploadFile, user_id: str):
      # OLD: Save to local filesystem
      # file_path = f"data/uploads/{job_id}/{file.filename}"

      # NEW: Upload to S3
      s3_storage = S3Storage()
      file_content = await file.read()
      s3_url = await s3_storage.upload_cv(file_content, file.filename)

      # Store S3 URL in database
      await db.save_cv_metadata(user_id, s3_url, file.filename)

  ElastiCache for Session Management

  # src/services/redis_session.py
  import redis
  import json
  from typing import Optional

  class RedisSessionManager:
      def __init__(self):
          self.redis_client = redis.Redis(
              host=os.environ['ELASTICACHE_ENDPOINT'],
              port=6379,
              decode_responses=True,
              ssl=True
          )

      async def create_session(self, user_id: str) -> str:
          session_id = str(uuid.uuid4())
          session_data = {
              'user_id': user_id,
              'created_at': datetime.utcnow().isoformat()
          }

          # Set with 7-day expiration
          self.redis_client.setex(
              f"session:{session_id}",
              604800,  # 7 days in seconds
              json.dumps(session_data)
          )
          return session_id

      async def get_session(self, session_id: str) -> Optional[dict]:
          data = self.redis_client.get(f"session:{session_id}")
          return json.loads(data) if data else None

  CloudFront CDN Configuration

  {
    "Origins": [{
      "DomainName": "resume2website-static.s3.amazonaws.com",
      "S3OriginConfig": {
        "OriginAccessIdentity": "origin-access-identity/cloudfront/ABCD"
      }
    }],
    "DefaultCacheBehavior": {
      "TargetOriginId": "S3-resume2website-static",
      "ViewerProtocolPolicy": "redirect-to-https",
      "CachePolicyId": "658327ea-f89e-4f7b-9f59-3d5e2f5432f1",
      "Compress": true
    },
    "PriceClass": "PriceClass_100",
    "CustomErrorResponses": [{
      "ErrorCode": 404,
      "ResponseCode": 200,
      "ResponsePagePath": "/index.html"
    }]
  }

  EKS vs ECS Comparison

  | Feature             | EKS                         | ECS                  | Recommendation      |
  |---------------------|-----------------------------|----------------------|---------------------|
  | Cost                | Higher ($144/month cluster) | Lower (pay per task) | ECS for cost        |
  | Complexity          | High                        | Medium               | ECS for simplicity  |
  | Flexibility         | Full K8s features           | AWS-specific         | EKS for portability |
  | Portfolio Sandboxes | Complex with Jobs           | Fargate tasks        | ECS better fit      |
  | Auto-scaling        | HPA + Cluster Autoscaler    | Built-in             | ECS easier          |

  Recommendation: Use ECS Fargate for simpler management and lower costs

  IAM Roles (IRSA)

  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "Federated": "arn:aws:iam::ACCOUNT:oidc-provider/EKS-OIDC"
        },
        "Action": "sts:AssumeRoleWithWebIdentity",
        "Condition": {
          "StringEquals": {
            "EKS-OIDC:sub": "system:serviceaccount:default:resume2website-sa"
          }
        }
      }
    ]
  }

  ---
  5. Code Modifications Required

  Environment Variables Migration

  # config.py - Complete replacement
  import os
  from dotenv import load_dotenv

  load_dotenv()

  # OLD hardcoded values → NEW environment variables
  BACKEND_PORT = int(os.getenv('BACKEND_PORT', '2000'))
  DATABASE_URL = os.getenv('DATABASE_URL')  # RDS connection string
  S3_BUCKET = os.getenv('S3_BUCKET_NAME')
  REDIS_URL = os.getenv('REDIS_URL')
  CLAUDE_API_KEY = os.getenv('CLAUDE_API_KEY')
  STRIPE_SECRET_KEY = os.getenv('STRIPE_SECRET_KEY')
  VERCEL_TOKEN = os.getenv('VERCEL_TOKEN')

  # Portfolio configuration
  PORTFOLIO_SERVICE_URL = os.getenv('PORTFOLIO_SERVICE_URL')  # K8s service
  MAX_PORTFOLIOS = int(os.getenv('MAX_PORTFOLIOS', '20'))

  Database Abstraction Layer

  # src/api/db_abstract.py - New abstraction layer
  from abc import ABC, abstractmethod

  class DatabaseInterface(ABC):
      @abstractmethod
      async def get_user(self, user_id: str):
          pass

      @abstractmethod
      async def save_cv_data(self, job_id: str, data: dict):
          pass

  class AuroraDatabase(DatabaseInterface):
      # Implementation for Aurora
      pass

  class SQLiteDatabase(DatabaseInterface):
      # Keep for local development
      pass

  # Factory pattern
  def get_database() -> DatabaseInterface:
      if os.getenv('ENVIRONMENT') == 'production':
          return AuroraDatabase()
      return SQLiteDatabase()

  Portfolio Generation Redesign

  # src/services/portfolio_k8s.py - Kubernetes Job for portfolio generation
  from kubernetes import client, config

  class KubernetesPortfolioGenerator:
      def __init__(self):
          config.load_incluster_config()  # When running in cluster
          self.batch_v1 = client.BatchV1Api()

      async def generate_portfolio(self, job_id: str, cv_data: dict):
          job = client.V1Job(
              metadata=client.V1ObjectMeta(name=f"portfolio-{job_id}"),
              spec=client.V1JobSpec(
                  template=client.V1PodTemplateSpec(
                      spec=client.V1PodSpec(
                          containers=[
                              client.V1Container(
                                  name="portfolio-builder",
                                  image="resume2website/portfolio-builder:latest",
                                  env=[
                                      client.V1EnvVar(name="JOB_ID", value=job_id),
                                      client.V1EnvVar(name="CV_DATA", value=json.dumps(cv_data)),
                                      client.V1EnvVar(name="S3_BUCKET", value=os.getenv('S3_BUCKET'))
                                  ]
                              )
                          ],
                          restart_policy="Never"
                      )
                  ),
                  backoff_limit=3,
                  ttl_seconds_after_finished=3600  # Clean up after 1 hour
              )
          )

          self.batch_v1.create_namespaced_job(namespace="default", body=job)

  File Storage Abstraction

  # src/services/storage_abstract.py
  class StorageInterface(ABC):
      @abstractmethod
      async def save_file(self, content: bytes, path: str) -> str:
          pass

      @abstractmethod
      async def get_file(self, path: str) -> bytes:
          pass

  class S3Storage(StorageInterface):
      # S3 implementation
      pass

  class LocalStorage(StorageInterface):
      # Local filesystem implementation
      pass

  ---
  6. DevOps Pipeline

  GitHub Actions CI/CD Pipeline

  # .github/workflows/deploy-to-eks.yml
  name: Deploy to EKS

  on:
    push:
      branches: [main]

  env:
    AWS_REGION: us-east-1
    ECR_REPOSITORY: resume2website
    EKS_CLUSTER: resume2website-cluster

  jobs:
    build-and-deploy:
      runs-on: ubuntu-latest
      steps:
      - uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1

      - name: Build Backend Image
        run: |
          docker build -t $ECR_REPOSITORY/backend:$GITHUB_SHA -f Dockerfile.backend .
          docker push $ECR_REPOSITORY/backend:$GITHUB_SHA

      - name: Build Frontend Image
        run: |
          docker build -t $ECR_REPOSITORY/frontend:$GITHUB_SHA -f Dockerfile.frontend .
          docker push $ECR_REPOSITORY/frontend:$GITHUB_SHA

      - name: Update kubeconfig
        run: aws eks update-kubeconfig --name $EKS_CLUSTER --region $AWS_REGION

      - name: Deploy with Helm
        run: |
          helm upgrade --install resume2website ./helm-chart \
            --set backend.image.tag=$GITHUB_SHA \
            --set frontend.image.tag=$GITHUB_SHA \
            --set-string secrets.databaseUrl=${{ secrets.DATABASE_URL }} \
            --wait

  Helm Chart Structure

  # helm-chart/values.yaml
  backend:
    replicaCount: 3
    image:
      repository: YOUR_ECR_REPO/backend
      tag: latest
    resources:
      requests:
        cpu: 500m
        memory: 512Mi
      limits:
        cpu: 1000m
        memory: 1Gi

  frontend:
    replicaCount: 2
    image:
      repository: YOUR_ECR_REPO/frontend
      tag: latest
    resources:
      requests:
        cpu: 250m
        memory: 256Mi

  postgresql:
    enabled: false  # Using RDS instead

  redis:
    enabled: false  # Using ElastiCache

  ingress:
    enabled: true
    className: alb
    annotations:
      kubernetes.io/ingress.class: alb
      alb.ingress.kubernetes.io/scheme: internet-facing
      alb.ingress.kubernetes.io/certificate-arn: YOUR_CERT_ARN
    hosts:
      - host: resume2website.com
        paths:
          - path: /api
            pathType: Prefix
            service: backend
          - path: /
            pathType: Prefix
            service: frontend

  ---
  7. Security & Compliance

  Secrets Management

  # k8s/sealed-secrets.yaml
  apiVersion: bitnami.com/v1alpha1
  kind: SealedSecret
  metadata:
    name: app-secrets
  spec:
    encryptedData:
      CLAUDE_API_KEY: AgA3k2H4J5K6L7M8N9O0P1Q2R3S4T5U6V7W8X9Y0Z1
      STRIPE_SECRET: AgB3k2H4J5K6L7M8N9O0P1Q2R3S4T5U6V7W8X9Y0Z2
      DATABASE_URL: AgC3k2H4J5K6L7M8N9O0P1Q2R3S4T5U6V7W8X9Y0Z3

  Network Policies

  # k8s/network-policy.yaml
  apiVersion: networking.k8s.io/v1
  kind: NetworkPolicy
  metadata:
    name: backend-network-policy
  spec:
    podSelector:
      matchLabels:
        app: backend
    policyTypes:
    - Ingress
    - Egress
    ingress:
    - from:
      - podSelector:
          matchLabels:
            app: frontend
      - podSelector:
          matchLabels:
            app: ingress-nginx
      ports:
      - protocol: TCP
        port: 2000
    egress:
    - to:
      - podSelector:
          matchLabels:
            app: database
      ports:
      - protocol: TCP
        port: 5432

  RBAC Configuration

  # k8s/rbac.yaml
  apiVersion: rbac.authorization.k8s.io/v1
  kind: Role
  metadata:
    name: portfolio-generator
  rules:
  - apiGroups: ["batch"]
    resources: ["jobs"]
    verbs: ["create", "get", "list", "delete"]

  ---
  apiVersion: rbac.authorization.k8s.io/v1
  kind: RoleBinding
  metadata:
    name: portfolio-generator-binding
  subjects:
  - kind: ServiceAccount
    name: resume2website-sa
  roleRef:
    kind: Role
    name: portfolio-generator
    apiGroup: rbac.authorization.k8s.io

  ---
  8. Monitoring & Observability

  CloudWatch Integration

  # src/utils/aws_logging.py
  import logging
  import watchtower
  import boto3

  def setup_cloudwatch_logging():
      cloudwatch = boto3.client('logs', region_name='us-east-1')

      handler = watchtower.CloudWatchLogHandler(
          log_group='/aws/eks/resume2website',
          stream_name=f"{os.environ.get('POD_NAME', 'local')}",
          use_queues=True,
          create_log_group=False
      )

      logger = logging.getLogger()
      logger.addHandler(handler)
      logger.setLevel(logging.INFO)

      return logger

  Prometheus Metrics

  # src/utils/metrics_prometheus.py
  from prometheus_client import Counter, Histogram, Gauge
  import time

  # Define metrics
  cv_extraction_counter = Counter('cv_extractions_total', 'Total CV extractions')
  cv_extraction_duration = Histogram('cv_extraction_duration_seconds', 'CV extraction duration')
  active_portfolios = Gauge('active_portfolios', 'Number of active portfolios')

  # Use in code
  @cv_extraction_duration.time()
  async def extract_cv(file_content: bytes):
      cv_extraction_counter.inc()
      # ... extraction logic

  X-Ray Tracing

  # src/utils/xray_tracing.py
  from aws_xray_sdk.core import xray_recorder
  from aws_xray_sdk.ext.fastapi.middleware import XRayMiddleware

  # In main.py
  app.add_middleware(XRayMiddleware, recorder=xray_recorder)

  # Trace specific functions
  @xray_recorder.capture('cv_extraction')
  async def extract_cv_with_claude(text: str):
      # ... extraction logic

  ---
  9. Cost Optimization

  AWS Cost Breakdown

  | Service     | Configuration             | Monthly Cost |
  |-------------|---------------------------|--------------|
  | EKS Cluster | 1 cluster                 | $144         |
  | EC2 Nodes   | 3x t3.medium (Spot)       | $90          |
  | RDS Aurora  | Serverless v2 (0.5-1 ACU) | $150         |
  | S3          | 100GB storage + transfers | $25          |
  | ElastiCache | t3.micro                  | $25          |
  | CloudFront  | 100GB transfer            | $10          |
  | ALB         | 1 load balancer           | $25          |
  | NAT Gateway | 1 gateway                 | $45          |
  | Total       |                           | ~$514/month  |

  Cost Optimization Strategies

  1. Use Spot Instances for worker nodes (70% savings)
  2. Aurora Serverless v2 scales to zero when unused
  3. S3 Intelligent-Tiering for old CVs
  4. Reserved Instances for predictable workloads (40% savings)
  5. Lambda for portfolio generation instead of always-on containers

  Auto-scaling Configuration

  # k8s/cluster-autoscaler.yaml
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: cluster-autoscaler
  spec:
    template:
      spec:
        containers:
        - image: k8s.gcr.io/autoscaling/cluster-autoscaler:v1.27.0
          name: cluster-autoscaler
          command:
          - ./cluster-autoscaler
          - --v=4
          - --stderrthreshold=info
          - --cloud-provider=aws
          - --skip-nodes-with-local-storage=false
          - --expander=least-waste
          - --node-group-auto-discovery=asg:tag=k8s.io/cluster-autoscaler/resume2website
          - --scale-down-delay-after-add=5m
          - --scale-down-unneeded-time=5m

  ---
  10. Migration Strategy

  Phase 1: Preparation (Week 1-2)

  1. Set up AWS account and configure IAM roles
  2. Create RDS Aurora instance and migrate SQLite data
  3. Set up S3 buckets for file storage
  4. Configure ElastiCache for sessions
  5. Update code with environment variables

  Phase 2: Containerization (Week 3-4)

  1. Create Dockerfiles for backend and frontend
  2. Build and test containers locally
  3. Push to ECR repository
  4. Test container orchestration locally with docker-compose

  Phase 3: Infrastructure (Week 5-6)

  1. Create EKS cluster using terraform
  2. Deploy core services (RDS, ElastiCache, S3)
  3. Configure networking (VPC, subnets, security groups)
  4. Set up monitoring (CloudWatch, Prometheus)

  Phase 4: Deployment (Week 7-8)

  1. Deploy application to staging environment
  2. Run integration tests
  3. Load testing with expected traffic
  4. Fix issues found during testing

  Phase 5: Migration (Week 9-10)

  1. Data migration from SQLite to RDS
  2. File migration from local to S3
  3. DNS cutover to new infrastructure
  4. Monitor closely for 48 hours

  Phase 6: Optimization (Week 11-12)

  1. Tune auto-scaling based on metrics
  2. Optimize costs with Reserved Instances
  3. Implement caching strategies
  4. Documentation and runbooks

  Risk Assessment Matrix

  | Risk                         | Probability | Impact | Mitigation                                    |
  |------------------------------|-------------|--------|-----------------------------------------------|
  | Portfolio sandbox complexity | High        | High   | Use Lambda or ECS tasks instead of K8s pods   |
  | Data migration failure       | Medium      | High   | Test migration multiple times, keep backups   |
  | Cost overrun                 | Medium      | Medium | Set up billing alerts, use spot instances     |
  | Vercel integration issues    | High        | Medium | Consider replacing with native K8s deployment |
  | Session management           | Low         | Medium | Use sticky sessions initially                 |
  | Claude API latency           | Low         | Low    | Implement retries and circuit breakers        |

  Priority-Ordered Action Items

  Immediate (Do First)

  1. Environment variables: Replace all hardcoded values in config.py
  2. Database abstraction: Create interface for database operations
  3. File storage abstraction: Create interface for S3/local storage
  4. Session management: Implement Redis session store

  Short-term (Week 1-2)

  5. Dockerize backend: Create Dockerfile and test locally
  6. Dockerize frontend: Create Dockerfile with multi-stage build
  7. Setup AWS account: Configure IAM, VPC, and base infrastructure
  8. Create CI/CD pipeline: GitHub Actions for automated deployment

  Medium-term (Week 3-4)

  9. Migrate to RDS: Set up Aurora and migrate data
  10. Implement S3 storage: Replace local file operations
  11. Setup EKS cluster: Create cluster with terraform
  12. Deploy to staging: Test full application in K8s

  Long-term (Week 5+)

  13. Portfolio generation redesign: Replace sandboxes with K8s Jobs
  14. Monitoring setup: CloudWatch, X-Ray, Prometheus
  15. Performance optimization: Caching, CDN, auto-scaling
  16. Security hardening: Secrets management, network policies

  Special Considerations

  Portfolio Sandbox System in Kubernetes

  The current sandbox system that spawns Next.js instances on ports 4000-5000 needs complete redesign:

  Current Problem: Can't dynamically allocate ports in Kubernetes

  Solution: Use Kubernetes Jobs + S3 static hosting
  # New portfolio generation flow
  1. User requests portfolio → Create K8s Job
  2. Job builds portfolio → Uploads to S3
  3. S3 static website → Served via CloudFront
  4. No need for dynamic ports or long-running containers

  Vercel Deployment Integration

  Current: Uses Vercel CLI for deployment
  Problem: Won't work well in containerized environment
  Solution: Keep Vercel for final deployment, but preview in S3

  Stripe Payment Integration

  No changes needed - Stripe works fine in distributed systems
  Just ensure webhook endpoints are properly configured for the new domain

  OAuth Authentication Flow

  Update redirect URLs in Google/LinkedIn OAuth settings to include:
  - https://resume2website.com/api/v1/auth/google/callback
  - https://api.resume2website.com/v1/auth/google/callback

  ---
  Conclusion

  Migrating RESUME2WEBSITE to AWS Kubernetes is complex but achievable. The main challenges are:
  1. Portfolio sandbox system needs complete redesign
  2. Stateful components (database, files, sessions) need cloud services
  3. Dynamic port allocation must be replaced with static services

  Recommended approach: Start with ECS Fargate instead of EKS for simpler management and lower costs. The portfolio generation system works better with ECS Tasks than Kubernetes Jobs.

 



