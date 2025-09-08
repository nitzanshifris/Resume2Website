# RESUME2WEBSITE Kubernetes Migration - Bullet Points Summary

## Pre-Handover Checklist

### Code Cleanup
• Remove all hardcoded secrets (Stripe keys, API keys, passwords)
• Create .env.example template with all required environment variables
• Search for sensitive data: `grep -r "sk_" .` and `grep -r "secret" .`

### Documentation Required
• System requirements document (Python 3.11+, Node.js 18+, PostgreSQL 14+)
• Critical business logic documentation
• Performance requirements (CV extraction: 40-60s, Portfolio: 2-3 min)
• Known issues and limitations document

### Code Preparation
• Create database abstraction layer (DatabaseInterface class)
• Create storage abstraction layer (StorageInterface class)
• Add integration test suite for critical paths
• Document all dependencies (requirements.txt, package.json)

## DevOps Responsibilities

### Infrastructure Setup
• Create VPC with public/private subnets
• Set up EKS/ECS cluster
• Configure RDS Aurora PostgreSQL
• Set up ElastiCache Redis cluster
• Create S3 buckets for file storage
• Configure CloudFront CDN
• Set up ALB/NLB load balancers
• Configure Route53 DNS records
• Generate ACM SSL certificates
• Create IAM roles and policies

### Containerization
• Create optimized Dockerfiles with multi-stage builds
• Implement security scanning (Trivy/Snyk)
• Configure non-root users
• Add health checks
• Optimize layer caching

### Database Migration
• Convert SQLite schema to PostgreSQL
• Create data migration scripts
• Set up connection pooling
• Configure read replicas if needed
• Implement backup strategies

### Kubernetes/ECS Configuration
• Create deployment manifests
• Define service configurations
• Set up Ingress/ALB
• Configure HPA (Horizontal Pod Autoscaler)
• Create ConfigMaps and Secrets
• Implement NetworkPolicies
• Set up Helm charts or Kustomize

### CI/CD Pipeline
• Set up GitHub Actions/GitLab CI
• Implement automated testing
• Configure Docker image building
• Add security scanning
• Create staging deployments
• Add approval gates
• Set up production deployments
• Create rollback procedures

## Critical Challenges

### Portfolio Generation System
• **Current Problem**: Spawns Next.js instances on ports 4000-5000
• **Issue**: Dynamic port allocation doesn't work in Kubernetes
• **Solution Options**:
  - Static generation with S3 hosting
  - Kubernetes Jobs for portfolio building
  - Lambda functions for generation

### Stateful Components
• **SQLite Database**: Must migrate to RDS/Aurora
• **Local File Storage**: Must move to S3
• **Session Management**: Must use Redis/ElastiCache
• **Sandbox Directories**: Need S3 or EFS for temporary storage

## Migration Phases

### Phase 1: Preparation (Weeks 1-2)
• Set up AWS account and IAM roles
• Create RDS Aurora instance
• Configure S3 buckets
• Set up ElastiCache
• Update code with environment variables

### Phase 2: Containerization (Weeks 3-4)
• Create Dockerfiles for backend/frontend
• Build and test containers locally
• Push to ECR repository
• Test with docker-compose

### Phase 3: Infrastructure (Weeks 5-6)
• Create EKS/ECS cluster
• Deploy core services
• Configure networking
• Set up monitoring

### Phase 4: Deployment (Weeks 7-8)
• Deploy to staging
• Run integration tests
• Perform load testing
• Fix identified issues

### Phase 5: Migration (Weeks 9-10)
• Migrate data from SQLite to RDS
• Migrate files to S3
• DNS cutover
• Monitor for 48 hours

### Phase 6: Optimization (Weeks 11-12)
• Tune auto-scaling
• Optimize costs
• Implement caching
• Complete documentation

## Cost Estimates

### AWS Services Monthly Costs
• EKS Cluster: $144
• EC2 Nodes (3x t3.medium Spot): $90
• RDS Aurora Serverless v2: $150
• S3 Storage (100GB): $25
• ElastiCache (t3.micro): $25
• CloudFront (100GB transfer): $10
• ALB Load Balancer: $25
• NAT Gateway: $45
• **Total**: ~$514/month

### Cost Optimization Strategies
• Use Spot Instances (70% savings)
• Aurora Serverless v2 (scales to zero)
• S3 Intelligent-Tiering for old files
• Reserved Instances for predictable workloads
• Consider Lambda for portfolio generation

## Critical Files for DevOps Review

### Backend
• `config.py` - All configuration
• `main.py` - FastAPI entry point
• `src/api/routes/portfolio_generator.py` - Portfolio generation (BIGGEST CHALLENGE)
• `src/api/routes/cv.py` - File upload handling
• `src/api/db.py` - Database operations
• `src/core/cv_extraction/data_extractor.py` - Claude API integration

### Frontend
• `user_web_example/package.json` - Dependencies
• `user_web_example/app/page.tsx` - Main app entry
• `user_web_example/.env.local` - Frontend environment

## Critical Warnings

• **DON'T** change CV data structure (18 sections hardcoded)
• **DON'T** change Claude model (must be Claude 4 Opus, temperature 0.0)
• **DON'T** break portfolio preview flow
• **CAREFUL** with package managers (main: pnpm, sandboxes: npm)
• **PRESERVE** uploaded CVs (users expect persistence)
• **TEST** payment webhooks thoroughly (Stripe critical)

## Success Criteria

### Phase 1: Basic Functionality
• Application runs in Kubernetes/ECS
• Database migrated to RDS
• Files stored in S3
• Sessions in Redis
• Health checks passing

### Phase 2: Full Functionality
• CV upload and extraction working
• Portfolio generation working
• Payment processing working
• OAuth login working
• All API endpoints responding

### Phase 3: Production Ready
• Auto-scaling configured
• Monitoring dashboards live
• Alerts configured
• Backup strategy in place
• Disaster recovery tested
• Documentation complete

## Communication Protocol

### Initial Meeting Topics
• Architecture overview and data flow
• Critical business requirements
• Current pain points (especially portfolio sandboxes)
• Performance requirements
• Security requirements
• Questions for DevOps team

### Access Requirements
• GitHub repository (read/write)
• AWS account credentials
• Vercel account (if keeping)
• Stripe webhook endpoints
• OAuth app credentials
• Domain registrar access

## Key Decisions Needed

### Infrastructure Choices
• **EKS vs ECS**: ECS recommended (simpler, cheaper)
• **Database**: Aurora Serverless v2 recommended
• **File Storage**: S3 with CloudFront CDN
• **Sessions**: ElastiCache Redis
• **Portfolio Generation**: Needs complete redesign

### Technical Decisions
• Replace Vercel deployment with native K8s/S3
• Use static builds instead of dynamic ports
• Implement circuit breakers for all external APIs
• Add distributed tracing for debugging

## Timeline & Resources

• **Total Duration**: 8-12 weeks
• **Team Required**: 2-3 developers + 1 DevOps lead
• **Monthly AWS Cost**: $500-$1,500
• **Risk Level**: Medium-High (due to portfolio sandbox complexity)

## Final Recommendations

• Start with ECS Fargate instead of EKS (simpler management)
• Portfolio generation works better with ECS Tasks than K8s Jobs
• Consider Lambda for portfolio generation if possible
• Implement gradual migration (database first, then files, then compute)
• Keep Vercel for final deployment, use S3 for previews
• Set up comprehensive monitoring before migration