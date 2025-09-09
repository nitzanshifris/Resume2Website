### RESUME2WEBSITE AWS/Kubernetes Migration — Bullet Summary

- **Executive summary**
  - **Key migrations**: SQLite → RDS/Aurora; local files → S3; sessions → Redis/ElastiCache; sandboxed portfolio generation → containers/jobs.
  - **Challenges**: Stateful components, dynamic port previews, pod restarts, hardcoded configs.
  - **Suggestion**: Prefer ECS Fargate over EKS for simplicity/cost for portfolio jobs.

- **Current architecture deep dive**
  - **Database (SQLite)**: Single file `resume2website.db`; tables include users/sessions/cv_extractions/portfolios/files; unsuitable for distributed pods.
  - **File storage**: Local `data/uploads`, `data/generated_portfolios`, `sandboxes`; not viable in ephemeral pods.
  - **Sessions**: Stored in SQLite; not shareable across pods; needs Redis.
  - **Hardcoded configs (in `config.py`)**: Ports, DB path, local dirs; must move to environment variables.
  - **Ports**: 2000 backend, 3000 frontend, 4000–5000 dynamic portfolio previews (problematic in Kubernetes).

- **Container readiness**
  - **Containers**: Backend (FastAPI Python 3.11), Frontend (Next.js with pnpm), Portfolio builder (Node + Vercel CLI/job-style runner).
  - **Package managers**: Main uses pnpm; sandboxes use npm → separate images.
  - **OS deps**: Python build tools, Node 18, git, curl.

- **Kubernetes/EKS specifics**
  - **Backend Deployment**: Multi-replica, env from Secrets, liveness/readiness probes.
  - **Routing**: VirtualService/Ingress to split `/api` vs frontend.
  - **Autoscaling**: HPA on CPU/memory; set ranges (2–10 suggested).
  - **Storage**: PVC for read-only portfolio templates if needed.

- **AWS integrations**
  - **Aurora Serverless v2**: Async SQLAlchemy engine; schema migration on init.
  - **S3 storage service**: Uploads (AES256), object retrieval; return CloudFront URLs.
  - **API changes**: Update CV upload flow in `src/api/routes/cv.py` to use S3 and store URL in DB.
  - **Sessions in Redis (ElastiCache)**: Create/get with 7-day TTL; SSL connection.
  - **CloudFront**: S3 origin, HTTPS redirect, cache policy, spa-style 404→200 handling.
  - **EKS vs ECS**: ECS cheaper/simpler; ECS Fargate better for per-job portfolio builds.

- **Code changes required**
  - **Env vars**: Replace hardcoded `config.py` with `.env`-driven settings (ports, DB URL, S3, Redis, API keys, service URLs).
  - **DB abstraction**: `DatabaseInterface` with SQLite (local) + Aurora/Postgres (prod) implementations; factory by `ENVIRONMENT`.
  - **Portfolio generation redesign**: Replace dynamic ports with Jobs building and uploading to S3; cleanup TTL.
  - **Storage abstraction**: `StorageInterface` with Local and S3 implementations.

- **CI/CD and delivery**
  - **GitHub Actions**: Build/push backend & frontend images to ECR; update kubeconfig; deploy via Helm; inject secrets.
  - **Helm values**: Replicas/resources; ingress via ALB; disable in-cluster Postgres/Redis when using AWS services.

- **Security & compliance**
  - **Secrets**: Sealed Secrets/Secrets Manager; never commit keys.
  - **NetworkPolicies**: Restrict ingress/egress; only necessary ports/services.
  - **RBAC**: Minimal roles for Job creation (portfolio generator) and app needs.

- **Observability**
  - **CloudWatch logs**: Watchtower handler per pod/stream.
  - **Prometheus metrics**: Counters/Histogram/Gauges for CV extraction and active portfolios.
  - **Tracing**: AWS X-Ray middleware and function annotations.

- **Cost & scaling**
  - **Rough monthly**: ~$500–$1,500 depending on traffic; EKS control-plane adds base cost.
  - **Optimizations**: Spot nodes, Aurora Serverless scaling, S3 Intelligent-Tiering, reserved capacity, consider Lambda/ECS for portfolios.
  - **Cluster autoscaler**: Configure aggressive scale-down for cost.

- **Migration strategy (phased)**
  - **Phase 1 (Prep)**: IAM, RDS, S3, Redis, env vars.
  - **Phase 2 (Containerize)**: Dockerfiles, local tests, push to ECR, docker-compose.
  - **Phase 3 (Infra)**: Create EKS/ECS, VPC/networking, observability.
  - **Phase 4 (Deploy)**: Staging deploy, integration tests, load tests, fixes.
  - **Phase 5 (Cutover)**: DB/file migration, DNS switch, 48h monitor.
  - **Phase 6 (Optimize)**: Tuning autoscaling, costs, caching, runbooks.

- **Risk assessment (selected)**
  - **Portfolio sandbox complexity**: High/high → prefer static builds + S3/CloudFront or ECS/Lambda jobs.
  - **Data migration failure**: Medium/high → rehearsals, backups.
  - **Cost overrun**: Medium/medium → alerts, Spot, scale-to-zero where possible.
  - **Vercel integration**: High/medium → consider native infra or use S3 for previews.

- **Priority action items**
  - **Immediate**: Env vars, DB abstraction, storage abstraction, Redis sessions.
  - **Short-term**: Dockerize backend/frontend, AWS setup, CI/CD pipeline.
  - **Medium-term**: Migrate to RDS, implement S3, create cluster, staging deploy.
  - **Long-term**: Portfolio jobs redesign, monitoring, performance, security.

- **Portfolio system redesign**
  - **Problem**: Local Next.js dev servers on dynamic ports (4000–5000) won’t work in K8s.
  - **Options**: Static generation → S3 → CloudFront; Kubernetes Jobs; or Lambda (≤15 min builds) → S3.

- **Third-party integrations**
  - **Stripe**: Embedded Checkout; ensure webhook `/api/v1/payments/webhook` and events handled.
  - **OAuth**: Update Google/LinkedIn redirect URIs for new domains.

- **DevOps collaboration**
  - **Handover agenda**: Architecture overview, business requirements (Claude 4 Opus, 18 sections), pain points, performance, security, tool choices.
  - **Access**: GitHub, AWS, Vercel (if used), Stripe, OAuth apps, DNS registrar.
  - **Success criteria**: Basic functionality (run in cluster, RDS/S3/Redis, health), full app flows (CV upload/extraction, portfolio generation, payments, OAuth), production readiness (autoscaling, dashboards, alerts, backups, DR, docs).

- **Quick reference**
  - **Backend files**: `config.py`, `main.py`, `src/api/routes/portfolio_generator.py`, `src/api/routes/cv.py`, `src/api/db.py`, `src/core/cv_extraction/data_extractor.py`.
  - **Frontend**: `user_web_example/package.json`, `user_web_example/app/page.tsx`, `user_web_example/.env.local`.
  - **Configs**: `requirements.txt`, `.env.example`.
  - **Local commands**: Python venv + run API on 2000; `pnpm` for frontend on 3000; `pytest`; `pnpm run typecheck`.

- **Critical warnings**
  - **Do not** change CV data structure (18 sections) or Claude model (4 Opus, temp 0.0).
  - **Do not** break portfolio preview flow.
  - **Mind** package managers: pnpm (main) vs npm (sandboxes).
  - **Preserve** uploaded CVs; test Stripe webhooks thoroughly.

- **Final checklist before handover**
  - Secrets removed; `.env.example` created; env vars documented.
  - DB/storage abstraction layers in place; integration tests for critical paths.
  - Known issues documented; dependencies listed (Python/Node/system).
  - Handover scheduled; access granted; success criteria defined; emergency contacts listed.
