# CLAUDE.md
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is the **WooCash Offerwall Service** - a critical revenue-generating microservice that integrates with offerwall providers (primarily Adjoe) to enable users to earn rewards through "Play & Earn" activities. Built with NestJS, TypeScript, PostgreSQL (TypeORM), and deployed on Railway for automatic scaling and zero-downtime deployments.

### Railway Deployment Benefits
- **Zero-config deployment** - Push to GitHub, Railway handles the rest
- **Automatic SSL/HTTPS** - No certificate management needed
- **Private networking** - Secure inter-service communication
- **Managed databases** - PostgreSQL & Redis with automatic backups
- **Preview environments** - Test PRs before merging
- **Instant rollbacks** - One-click rollback to previous versions

### Service Responsibilities
- Handle offerwall provider callbacks (S2S) with HMAC verification
- Process and validate reward transactions in ≤ 5 seconds
- Convert USD amounts from providers to internal points (1 USD = 1000 points)
- Emit events for downstream services (Balance, Referral, Audit)
- Track offer lifecycle (started → completed)
- Support multiple providers with unified interface

## Essential Commands
### Development
```bash
# Start development server with hot reload
pnpm start:dev

# Start PostgreSQL in Docker (required for local development)
pnpm docker:start

# Initialize database schema
pnpm init-schema

# Run database migrations
pnpm migrate

# Generate HMAC test signatures (for testing callbacks)
pnpm test:hmac
```

### Git Workflow
**IMPORTANT**: Create a new branch for each development session and open a PR when finished:

```bash
# 1. Create and switch to new branch for this session
git checkout -b feature/task-[task-number]-[brief-description]
# Example: git checkout -b feature/task-13-rename-package-json

# 2. During development - commit frequently
git add .
git commit -m "feat: implement [specific change]"

# 3. Push branch to remote
git push origin feature/task-[task-number]-[brief-description]

# 4. When task is complete, open PR using GitHub CLI
gh pr create --title "feat: [Task description]" --body "Implements task from tasks/tasks.md

- [x] Task completed
- [x] Tests passing
- [x] Code reviewed

Closes #[issue-number] (if applicable)"

# 5. Alternative: Quick PR creation
gh pr create --title "feat: [brief description]" --body "Ready for review"
```

**Development Session Workflow**:
1. **Start**: `git checkout -b feature/task-[number]-[description]`
2. **Work**: Make changes, commit frequently with meaningful messages
3. **Document**: Create detailed documentation file (see Documentation Requirements below)
4. **Push**: `git push origin [branch-name]`
5. **Finish**: `gh pr create` to open pull request
6. **Review**: Wait for review or merge if self-reviewing
7. **Cleanup**: `git checkout main && git branch -d [branch-name]`

### Documentation Requirements
**CRITICAL**: After completing each task, create a detailed documentation file in `/tasks/`:

```bash
# Create documentation file for the task
touch tasks/task-[number]-[brief-description].md

# Example: tasks/task-23-create-offerwall-module.md
```

**Documentation Template**:
```markdown
# Task [Number]: [Task Description]

## Overview
Brief description of what was implemented in this PR.

## Changes Made
### Files Created
- `path/to/file.ts` - Purpose and functionality
- `path/to/another.ts` - What it does and why

### Files Modified
- `existing/file.ts` - What changes were made and why
- `config/file.ts` - Configuration updates

### Database Changes
- **Tables Added**: 
  - `table_name` - Purpose, columns, indexes
- **Migrations**:
  - `migration-name.ts` - What it creates/modifies

## API Endpoints
### New Routes
- `POST /api/route` - What it does, parameters, response format
- `GET /api/other` - Purpose, authentication requirements

### Route Details
For each route, explain:
- **Purpose**: What business logic it serves
- **Authentication**: What auth is required (if any)
- **Parameters**: Request body/query parameters
- **Response**: What it returns
- **Error Handling**: What errors can occur

## Database Schema
### Tables
For each table:
- **Purpose**: What business data it stores
- **Columns**: Each column's purpose and constraints
- **Indexes**: Why each index exists
- **Relationships**: How it connects to other tables

## Business Logic
### Services
- **Service Name**: What business operations it handles
- **Methods**: Key methods and their purposes
- **Dependencies**: What other services it depends on

### Data Flow
Explain the complete data flow:
1. Request comes in
2. Validation happens
3. Data is processed
4. Database operations
5. Response sent

## Security Considerations
- Authentication/authorization implemented
- Input validation
- Rate limiting
- Any security implications

## Testing
- Unit tests added/modified
- Integration tests
- Test coverage for new code

## Inter-Service Communication
- Which services this communicates with
- API calls made to other services
- Events emitted/listened to

## Configuration
- Environment variables added
- Configuration files modified
- Feature flags introduced

## Monitoring & Observability
- Metrics added
- Logging implemented
- Health checks updated

## Deployment Notes
- Migration steps required
- Environment setup
- Dependencies added/updated

## Future Considerations
- Technical debt introduced
- Areas for improvement
- Potential scaling concerns
```

**Best Practices**:
- One branch per task from tasks/tasks.md
- Use conventional commit messages (feat:, fix:, docs:, refactor:, etc.)
- Push frequently to maintain backup
- Include task completion checklist in PR description
- Link to relevant task or issue numbers

### Coding Standards
**CRITICAL**: Follow these coding conventions consistently:

- **Variable Names**: ALWAYS use camelCase for all variable names
  ```typescript
  // ✅ Correct
  const userId = 'user-123';
  const transactionId = 'txn-456';
  const callbackData = { amount: 100 };
  const providerService = new ProviderService();
  
  // ❌ Incorrect
  const user_id = 'user-123';          // snake_case
  const TransactionId = 'txn-456';     // PascalCase
  const callback_data = { amount: 100 }; // snake_case
  const ProviderService = new ProviderService(); // PascalCase for variables
  ```

- **Function Names**: Use camelCase for functions and methods
  ```typescript
  // ✅ Correct
  async function validateCallback() { }
  async processReward() { }
  getUserStatus() { }
  
  // ❌ Incorrect  
  async function validate_callback() { }
  async ProcessReward() { }
  ```

- **Class Names**: Use PascalCase for classes, interfaces, and types
  ```typescript
  // ✅ Correct
  export class OfferwallService { }
  export interface ProviderInterface { }
  export type CallbackData = { };
  
  // ❌ Incorrect
  export class offerwallService { }
  export interface providerInterface { }
  ```

- **Constants**: Use SCREAMING_SNAKE_CASE for constants
  ```typescript
  // ✅ Correct
  const MAX_RETRY_ATTEMPTS = 3;
  const CALLBACK_TIMEOUT_MS = 5000;
  
  // ❌ Incorrect
  const maxRetryAttempts = 3;
  const callbackTimeoutMs = 5000;
  ```

- **File Names**: Use kebab-case for file names
  ```typescript
  // ✅ Correct
  offerwall.service.ts
  provider.interface.ts
  reward-transaction.entity.ts
  
  // ❌ Incorrect
  OfferwallService.ts
  providerInterface.ts
  rewardTransaction.entity.ts
  ```

### Testing
```bash
# Run unit tests
pnpm test

# Run specific test file
pnpm test path/to/file.spec.ts

# Run tests with coverage
pnpm test:cov

# Run e2e tests (includes mock provider callbacks)
pnpm test:e2e

# Test provider webhook locally
pnpm test:webhook --provider=adjoe
```

### Code Quality
```bash
# Check formatting and types
pnpm lint

# Auto-fix formatting issues
pnpm lint:fix

# Format code
pnpm format

# Security audit
pnpm audit
```

### Build & Production
```bash
# Build the project
pnpm build

# Start in production (runs migrations automatically)
pnpm start

# Deploy to Railway
railway up

# View Railway logs
railway logs

# Run migrations on Railway
railway run pnpm migrate
```

## Architecture Overview

### Module Structure
```
src/
├── offerwall/
│   ├── providers/
│   │   ├── adjoe/
│   │   │   ├── adjoe.provider.ts       # Adjoe-specific implementation
│   │   │   ├── adjoe.validator.ts      # HMAC verification
│   │   │   └── adjoe.types.ts         # Adjoe callback types
│   │   ├── provider.interface.ts       # Common provider interface
│   │   └── provider.factory.ts         # Provider instantiation
│   ├── dto/
│   │   ├── callback.dto.ts             # S2S callback validation
│   │   ├── offer-start.dto.ts          # Offer initiation
│   │   └── reward.dto.ts               # Reward processing
│   ├── entities/
│   │   ├── offer.entity.ts             # Offer tracking
│   │   └── reward-transaction.entity.ts # Reward history
│   ├── events/
│   │   ├── offer.events.ts             # Domain events
│   │   └── handlers/                   # Event handlers
│   ├── offerwall.controller.ts         # REST endpoints
│   ├── offerwall.service.ts            # Core business logic
│   └── offerwall.module.ts             # Module definition
├── common/
│   ├── filters/                        # Exception handling
│   ├── logger/                         # Structured logging
│   ├── interceptors/
│   │   └── hmac.interceptor.ts        # HMAC validation
│   └── app-config/                     # Configuration
└── health/                             # Health checks
```

### Key Architectural Components

1. **Provider Abstraction Layer**
   - Unified interface for multiple offerwall providers
   - Factory pattern for provider instantiation
   - Provider-specific validation and HMAC verification
   - Easy addition of new providers (MyChips, OfferToro)

2. **Security Layer**
   - HMAC signature verification for all callbacks (SHA1 for Adjoe, SHA256 for others)
   - IP whitelisting for provider endpoints
   - Rate limiting per user/IP
   - Idempotency keys to prevent duplicate rewards

3. **Event-Driven Architecture**
   ```typescript
   // Events emitted by offerwall service
   - OfferStartedEvent      // User begins an offer
   - OfferCompletedEvent    // Offer requirements met
   - RewardCreditedEvent    // Reward successfully processed
   - RewardFailedEvent      // Processing failure
   ```

4. **Real-Time Processing Pipeline**
   ```
   Provider Callback → HMAC Verify → Validate → Process → Emit Events
                                                  ↓
                                          Balance Service
                                          Referral Service (20% tiers)
                                          Audit Service
   ```

5. **Caching Strategy**
   - Redis for active offer sessions
   - User reward limits caching
   - Provider configuration caching

### Database Schema

```sql
-- Offers table (tracking user interactions)
offers (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  provider VARCHAR(50) NOT NULL,
  offer_id VARCHAR(100) NOT NULL,
  status ENUM('started', 'completed', 'failed'),
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  metadata JSONB
)

-- Reward transactions (immutable ledger)
reward_transactions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  offer_id UUID REFERENCES offers(id),
  provider VARCHAR(50) NOT NULL,
  amount_pts INTEGER NOT NULL,
  amount_usdc DECIMAL(10,6),
  signature VARCHAR(255) NOT NULL,
  callback_payload JSONB,
  processed_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(provider, signature) -- Prevent duplicates
)
```

### API Endpoints

```typescript
// Public endpoints (for providers)
POST   /offerwall/callback/:provider     // S2S callbacks
GET    /offerwall/callback/:provider     // Provider health check

// Internal endpoints (authenticated)
POST   /offerwall/offers/start          // Track offer start
GET    /offerwall/offers/active         // User's active offers
GET    /offerwall/providers             // Available providers
GET    /offerwall/history               // User reward history
```

### Integration Points

1. **With Balance Service**
   ```typescript
   // After successful reward validation
   await this.balanceService.credit({
     userId,
     amountPts: reward.pts,
     amountUsdc: reward.usdc,
     source: 'OFFERWALL',
     reference: transactionId
   });
   ```

2. **With Referral Service**
   ```typescript
   // Emit event for referral processing
   this.eventEmitter.emit('reward.credited', {
     userId,
     amount: reward.pts,
     provider,
     // Referral service handles 20% distribution
   });
   ```

3. **With Audit Service**
   ```typescript
   // All transactions logged for compliance
   this.auditLogger.log({
     event: 'REWARD_PROCESSED',
     userId,
     provider,
     amount,
     signature,
     timestamp: new Date()
   });
   ```

### Security Considerations

1. **HMAC Verification**
   ```typescript
   // Adjoe uses SHA1 for S2S callbacks
   const adjoeSignature = crypto
     .createHash('sha1')
     .update(trans_uuid + user_uuid + currency + coin_amount + device_id + sdk_app_id + s2s_token)
     .digest('hex');
   
   // Other providers may use SHA256
   const otherSignature = crypto
     .createHmac('sha256', providerSecret)
     .update(JSON.stringify(payload))
     .digest('hex');
   ```

2. **Rate Limiting**
   - Max 100 rewards/user/day
   - Max 10 concurrent offers/user
   - Provider callback rate limits

3. **Validation Rules**
   - Minimum payout thresholds
   - User eligibility checks
   - Offer completion time validation

4. **Adjoe Retry Logic**
   - If we return 4xx status (not 5xx), Adjoe will retry:
     - 1st retry: after 10 minutes
     - 2nd retry: after another 10 minutes
     - Subsequent retries: every 2 hours (up to ~12 hours total)
   - Always return 200 OK to prevent retries
   - Once a reward is distributed, it cannot be allocated again
   - Adjoe sends coin_amount in configured currency (can be USD or points)

### Performance Requirements

- **Callback Processing**: < 200ms p95
- **Reward Credit**: < 5s end-to-end
- **Concurrent Users**: Support 10k active
- **Throughput**: 1000 callbacks/second peak

Railway's infrastructure provides:
- **Auto-scaling**: Handles traffic spikes automatically
- **Global CDN**: Low latency webhook endpoints
- **Resource limits**: Configure CPU/memory per service
- **Load balancing**: Automatic distribution across replicas

### Testing Strategy

1. **Unit Tests**
   - HMAC signature generation/verification
   - Provider-specific validation logic
   - Business rule enforcement

2. **Integration Tests**
   - Mock provider callbacks
   - End-to-end reward flow
   - Event emission verification

3. **Load Tests**
   ```bash
   # Simulate provider callback bursts
   pnpm test:load --scenario=callback-burst
   
   # Test concurrent offer processing
   pnpm test:load --scenario=concurrent-offers
   
   # Test against Railway staging
   railway run -e staging pnpm test:load
   ```

4. **Provider Sandbox Testing**
   - Adjoe test keys and endpoints
   - Simulated callback scenarios
   - Error condition handling
   
5. **Railway Environment Testing**
   ```bash
   # Test in preview environment
   railway run -e preview pnpm test:e2e
   
   # Test in staging
   railway run -e staging pnpm test:integration
   
   # Production smoke tests
   railway run -e production pnpm test:smoke
   ```

### Environment Variables

```bash
# Provider Configuration (set in Railway dashboard)
ADJOE_APP_KEY=                    # Adjoe application key
ADJOE_S2S_TOKEN=                  # S2S token for signature verification (from Account Manager)
ADJOE_WEBHOOK_IPS=                # Comma-separated IP whitelist

# Service URLs (Railway private networking)
BALANCE_SERVICE_URL=${{balance-service.RAILWAY_PRIVATE_DOMAIN}}:3001
REFERRAL_SERVICE_URL=${{referral-service.RAILWAY_PRIVATE_DOMAIN}}:3002
AUDIT_SERVICE_URL=${{audit-service.RAILWAY_PRIVATE_DOMAIN}}:3003

# Redis (Railway addon)
REDIS_URL=${{Redis.REDIS_URL}}

# Database (Railway addon)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Feature Flags
ENABLE_MYCHIPS=false             # MyChips provider toggle
ENABLE_OFFER_LIMITS=true         # Daily limit enforcement
MAX_DAILY_REWARDS=100            # Per-user daily cap

# Performance
CALLBACK_TIMEOUT_MS=5000         # Max processing time
WORKER_POOL_SIZE=10              # Concurrent processors
```

### Common Development Tasks

1. **Adding a New Provider**
   ```typescript
   // 1. Create provider implementation
   // src/offerwall/providers/newprovider/
   
   // 2. Implement ProviderInterface
   // 3. Add to provider factory
   // 4. Configure environment variables
   // 5. Add provider-specific tests
   ```

2. **Testing Provider Callbacks**
   ```bash
   # Generate test signature
   curl -X POST http://localhost:3000/offerwall/callback/adjoe \
     -H "X-Adjoe-Signature: <hmac>" \
     -d '{"user_id":"123","offer_id":"456","payout_usd":0.73}'
   ```

3. **Debugging Failed Rewards**
   - Check logs for HMAC mismatches
   - Verify provider IP in whitelist
   - Check user eligibility/limits
   - Verify balance service connectivity

4. **Railway Deployment**
   ```bash
   # Deploy specific service
   railway up -s offerwall-service
   
   # Check deployment status
   railway status
   
   # Rollback if needed
   railway rollback
   ```

### Monitoring & Alerts

Railway provides built-in monitoring:
- **Metrics Dashboard** - CPU, memory, network usage
- **Log Streaming** - Real-time logs with search
- **Deployment History** - Track all deployments
- **Health Checks** - Automatic restarts on failure

Key metrics to track:
- Callback success rate by provider
- Average processing time
- Failed HMAC verifications
- Reward credit failures
- Provider availability

Custom alerts via Railway webhooks:
```typescript
// Send alerts to Discord/Slack
if (failureRate > 0.05) {
  await notifyWebhook({
    service: 'offerwall',
    alert: 'High failure rate detected',
    rate: failureRate
  });
}
```

### Performance Optimization Tips

1. **Database**
   - Index on (user_id, status) for active offers
   - Partition reward_transactions by month
   - Use read replicas for history queries
   - **Railway migrations**: Auto-run on deploy with `npm run start:prod`

2. **Caching**
   - Cache provider configs (TTL: 1 hour)
   - Cache user limits (TTL: 5 minutes)
   - Use Redis pipeline for bulk ops

3. **Processing**
   - Use worker threads for HMAC verification
   - Batch event emissions
   - Implement circuit breakers for downstream services