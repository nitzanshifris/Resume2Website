# WooCash Offerwall Service - Implementation Tasks

> **Architecture Note**: This is a stateless microservice that handles offerwall integrations only. All user authentication and user-related operations are delegated to the User Service via API calls.

## ✅ COMPLETED: Core Offerwall Module (Task 23)

**Status**: ✅ Complete - All core functionality implemented and tested

### What Was Implemented:
- [x] **Complete Provider Abstraction Layer** - Factory pattern for extensible provider system
- [x] **Webhook Processing Framework** - <200ms response time with correlation tracking
- [x] **Comprehensive Error Handling** - Always returns 200 OK, never exposes internal errors
- [x] **Structured Logging System** - Correlation IDs, header sanitization, event tracking
- [x] **OpenAPI Documentation** - Complete REST API documentation with examples
- [x] **Unit Test Suite** - 10 passing tests with full coverage of core functionality
- [x] **Code Quality Standards** - Prettier formatting, camelCase naming, TypeScript strict typing

### Key Features Delivered:
- **3 REST Endpoints**: Webhook callback, provider list, health check
- **Provider Factory Pattern**: Easy addition of new providers (Adjoe, MyChips, etc.)
- **Correlation Tracking**: Every webhook gets unique ID for tracing
- **Security Framework**: Header sanitization, HMAC validation ready
- **Performance Optimized**: Built for <200ms webhook response requirement

### Ready for Next Phase:
- Database entities and queue processing
- Service-to-service communication
- MyChips security & validation (Task 31)

---

## ✅ COMPLETED: MyChips Provider Core (Task 30)

**Status**: ✅ Complete - MyChips provider implementation with IP-based validation

### What Was Implemented:
- [x] **Complete MyChips Provider** - IP-only validation, standard/rejected/IAP callback support
- [x] **MyChips Validator** - IP whitelisting, parameter validation, rejected callback handling
- [x] **MyChips Types** - TypeScript interfaces with rejected reason severity mapping
- [x] **Provider Interface Extensions** - Optional validation methods for different providers
- [x] **Module Registration** - Successfully registered in OfferwallModule
- [x] **Documentation** - Complete implementation guide and architecture decisions

### Key Features Delivered:
- **IP-Only Authentication**: Uses official MyChips IP whitelist (no HMAC required)
- **Multi-Callback Support**: Standard, rejected, and IAP callbacks
- **Fraud Detection Framework**: Rejected callback severity classification
- **Railway Compatible**: X-Forwarded-For header handling for deployment
- **Flexible Configuration**: Optional environment variables with sensible defaults

### Ready for Next Phase:
- MyChips security & validation implementation (Task 31)
- Database schema updates for MyChips fields (Task 32)
- Comprehensive testing suite (Task 33)

---

## ✅ COMPLETED: Adjoe Provider Implementation

**Status**: ✅ Complete - Full Adjoe integration with HMAC validation, IP whitelisting, and comprehensive testing

### What Was Implemented:
- [x] **Complete Adjoe Provider** - HMAC-SHA1 validation, IP whitelisting, webhook processing
- [x] **Security Implementation** - HMAC signature validation, timing-safe comparison, IP whitelist
- [x] **Comprehensive Testing** - 26 unit tests, 100% coverage on new code
- [x] **Configuration Management** - Environment variables, feature flags, validation
- [x] **Documentation** - Complete implementation guide, testing procedures, deployment notes
- [x] **Helper Scripts** - HMAC generation tool for testing webhooks

### Key Features Delivered:
- **HMAC-SHA1 Validation**: Signature verification per Adjoe S2S specification
- **IP Whitelisting**: CIDR notation support for webhook security
- **Error Handling**: Never exposes internal errors, always returns 200 OK
- **Webhook Processing**: Fast validation and callback parsing
- **Testing Tools**: Complete unit test suite and webhook testing utilities

### Ready for Next Phase:
- Database entities for reward transactions
- Queue processing for async reward crediting
- MyChips provider integration

---

## 🔌 MyChips Provider Integration

### Task 30: Implement MyChips Provider Core

**Status**: ✅ Complete

#### Overview
Implement MyChips offerwall provider following the existing provider interface pattern. MyChips uses IP-based validation (no HMAC) and supports standard callbacks, rejected callbacks, and IAP callbacks.

#### Core Implementation
- [x] Create `src/offerwall/providers/mychips/mychips.provider.ts`:
  ```typescript
  @Injectable()
  export class MyChipsProvider implements ProviderInterface {
    constructor(
      private readonly validator: MyChipsValidator,
      private readonly configService: AppConfigService
    ) {}

    async validateCallback(req: Request): Promise<boolean> {
      // 1. Validate required parameters (user_id, payout)
      // 2. Validate IP address against MyChips whitelist
      // 3. Handle rejected callbacks (payout=0, rejected_reason_id)
      // 4. Return validation result
    }

    parseCallback(body: MyChipsCallbackParams): OfferwallCallbackData {
      // Parse MyChips callback to standard format
      // Handle rejected callbacks (set amounts to 0)
      // Extract metadata (click_id, event_name, etc.)
    }

    requiresHmacValidation(): boolean { return false; }
    requiresIpValidation(): boolean { return true; }
  }
  ```

- [x] Create `src/offerwall/providers/mychips/mychips.types.ts`:
  ```typescript
  export interface MyChipsCallbackParams {
    user_id: string;              // Required: User identifier
    payout: string;               // Required: Payout amount in USD
    click_id?: string;            // Optional: Click tracking ID
    event_name?: string;          // Optional: Event name
    conversion_country?: string;  // Optional: User's country (ISO 2-letter)
    conversion_time?: string;     // Optional: Unix timestamp
    
    // IAP-specific parameters
    event_value?: string;         // Optional: Purchase amount
    event_value_currency?: string; // Optional: Currency code
    event_value_usd?: string;     // Optional: USD equivalent
    
    // Rejected postback parameters
    rejected_reason_id?: string;  // Optional: Rejection reason ID
  }

  export interface MyChipsConfig {
    enabled: boolean;
    webhookIps: string[];
    appId?: string;
    publisherId?: string;
  }
  ```

- [x] Create `src/offerwall/providers/mychips/mychips.validator.ts`:
  ```typescript
  @Injectable()
  export class MyChipsValidator {
    // MyChips official IP whitelist
    private readonly MYCHIPS_IPS = [
      '168.63.37.145', '20.54.96.37', '13.70.194.104',
      '34.146.139.91', '34.54.234.115', '34.54.248.253',
      '34.64.93.62', '34.47.93.43', '34.84.180.208',
      '48.209.163.104', '4.207.193.125', '48.209.162.122'
    ];

    validateIpAddress(req: Request): boolean {
      // Extract client IP from headers (Railway-compatible)
      // Check against MyChips IP whitelist
    }

    validateRequiredParams(params: MyChipsCallbackParams): boolean {
      // Validate user_id and payout are present
    }

    validateRejectedCallback(params: MyChipsCallbackParams): boolean {
      // For rejected callbacks, payout should be 0
    }
  }
  ```

#### Environment Configuration
- [x] Add to `.env.example`:
  ```bash
  # MyChips Configuration
  MYCHIPS_ENABLED=true
  MYCHIPS_APP_ID=your-app-id
  MYCHIPS_PUBLISHER_ID=your-publisher-id
  MYCHIPS_WEBHOOK_IPS=168.63.37.145,20.54.96.37,13.70.194.104
  ```

#### Provider Registration
- [x] Update `src/offerwall/providers/provider.factory.ts`:
  ```typescript
  constructor(
    private readonly adjoeProvider: AdjoeProvider,
    private readonly myChipsProvider: MyChipsProvider, // Add MyChips
  ) {
    this.providers.set('adjoe', this.adjoeProvider);
    this.providers.set('mychips', this.myChipsProvider); // Register MyChips
  }
  ```

- [x] Update `src/offerwall/offerwall.module.ts`:
  ```typescript
  providers: [
    OfferwallService,
    ProviderFactory,
    AdjoeProvider,
    AdjoeValidator,
    MyChipsProvider,    // Add MyChips provider
    MyChipsValidator,   // Add MyChips validator
  ],
  ```

#### Provider Interface Updates
- [x] Update `src/offerwall/providers/provider.interface.ts`:
  ```typescript
  export interface ProviderInterface {
    validateCallback(req: Request): Promise<boolean>;
    parseCallback(body: any): OfferwallCallbackData;
    getStatus(): ProviderStatus;
    getName(): string;
    
    // New optional methods for different validation types
    requiresHmacValidation?(): boolean;
    requiresIpValidation?(): boolean;
  }
  ```

---

### Task 31: MyChips Security & Validation

**Status**: 🎯 Ready to implement (depends on Task 30)

#### Security Implementation
- [ ] Implement robust IP validation:
  ```typescript
  // Handle X-Forwarded-For for Railway deployment
  private extractClientIp(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'] as string;
    if (forwarded) {
      return forwarded.split(',')[0].trim(); // Railway/AWS style
    }
    return req.socket.remoteAddress || '';
  }
  ```

- [ ] Add fraud detection for rejected callbacks:
  ```typescript
  // In MyChips provider
  if (body.rejected_reason_id) {
    const severity = this.getRejectionSeverity(parseInt(body.rejected_reason_id));
    
    // Emit fraud detection event
    this.eventEmitter.emit('fraud.detected', {
      userId: body.user_id,
      provider: 'mychips',
      severity,
      reasonId: body.rejected_reason_id,
      metadata: body
    });
  }
  ```

#### Validation Rules
- [ ] Implement MyChips-specific validation:
  ```typescript
  // Minimum payout validation
  const payoutAmount = parseFloat(body.payout);
  if (payoutAmount < 0) {
    this.logger.warn('Negative payout amount', { payout: body.payout });
    return false;
  }

  // Country validation (if required)
  if (body.conversion_country && !this.isValidCountryCode(body.conversion_country)) {
    this.logger.warn('Invalid country code', { country: body.conversion_country });
    return false;
  }
  ```

#### Rejected Callback Handling
- [ ] Create rejected reason severity mapping:
  ```typescript
  private readonly REJECTED_REASONS = {
    0: 'low',     // Low severity
    1: 'high',    // High severity - immediate ban
    2: 'medium',  // Medium severity
    3: 'medium',  // Medium severity
    4: 'low',     // Low severity
    // ... continue for all 14 reasons
  };

  private getRejectionSeverity(reasonId: number): 'low' | 'medium' | 'high' {
    return this.REJECTED_REASONS[reasonId] || 'low';
  }
  ```

#### IAP Callback Support
- [ ] Add IAP-specific validation:
  ```typescript
  // Handle IAP callbacks
  if (body.event_value && body.event_value_currency) {
    return {
      ...callbackData,
      type: 'iap',
      amountUsd: parseFloat(body.event_value_usd) || 0,
      originalAmount: parseFloat(body.event_value) || 0,
      originalCurrency: body.event_value_currency,
      metadata: {
        ...callbackData.metadata,
        isIap: true,
        originalEventValue: body.event_value
      }
    };
  }
  ```

---

### Task 32: MyChips Database Schema Updates

**Status**: 🎯 Ready to implement (depends on Task 31)

#### Database Schema Extensions
- [ ] Create migration for MyChips-specific fields:
  ```sql
  -- Add MyChips-specific columns to reward_transactions
  ALTER TABLE reward_transactions 
  ADD COLUMN click_id VARCHAR(255),
  ADD COLUMN event_name VARCHAR(100),
  ADD COLUMN conversion_country CHAR(2),
  ADD COLUMN conversion_time TIMESTAMP,
  ADD COLUMN rejected_reason_id INTEGER,
  ADD COLUMN event_type VARCHAR(50) DEFAULT 'standard',
  ADD COLUMN event_value_currency VARCHAR(3),
  ADD COLUMN original_amount DECIMAL(10,6);

  -- Index for rejected callbacks
  CREATE INDEX idx_reward_transactions_rejected 
  ON reward_transactions(rejected_reason_id) 
  WHERE rejected_reason_id IS NOT NULL;

  -- Index for IAP callbacks
  CREATE INDEX idx_reward_transactions_iap 
  ON reward_transactions(event_type, conversion_country) 
  WHERE event_type = 'iap';
  ```

#### Fraud Detection Schema
- [ ] Create fraud events table:
  ```sql
  CREATE TABLE fraud_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    provider VARCHAR(50) NOT NULL,
    reason_id INTEGER NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    
    -- Indexes
    CONSTRAINT idx_fraud_events_user_provider 
      CREATE INDEX ON fraud_events(user_id, provider),
    CONSTRAINT idx_fraud_events_severity 
      CREATE INDEX ON fraud_events(severity, created_at),
    CONSTRAINT idx_fraud_events_reason 
      CREATE INDEX ON fraud_events(reason_id, created_at)
  );
  ```

#### Data Migration
- [ ] Generate migration file:
  ```bash
  pnpm typeorm migration:generate -n AddMyChipsSupport
  ```

- [ ] Update `RewardTransaction` entity:
  ```typescript
  @Entity('reward_transactions')
  export class RewardTransaction {
    // ... existing columns ...
    
    @Column({ nullable: true })
    clickId?: string;
    
    @Column({ nullable: true })
    eventName?: string;
    
    @Column({ length: 2, nullable: true })
    conversionCountry?: string;
    
    @Column({ nullable: true })
    conversionTime?: Date;
    
    @Column({ nullable: true })
    rejectedReasonId?: number;
    
    @Column({ default: 'standard' })
    eventType: 'standard' | 'iap' | 'rejected';
    
    @Column({ length: 3, nullable: true })
    eventValueCurrency?: string;
    
    @Column('decimal', { precision: 10, scale: 6, nullable: true })
    originalAmount?: number;
  }
  ```

#### Create Fraud Event Entity
- [ ] Create `src/offerwall/entities/fraud-event.entity.ts`:
  ```typescript
  @Entity('fraud_events')
  export class FraudEvent {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column()
    userId: string;
    
    @Column()
    provider: string;
    
    @Column()
    reasonId: number;
    
    @Column()
    severity: 'low' | 'medium' | 'high';
    
    @Column('jsonb')
    metadata: any;
    
    @CreateDateColumn()
    createdAt: Date;
    
    @Index(['userId', 'provider'])
    @Index(['severity', 'createdAt'])
    @Index(['reasonId', 'createdAt'])
  }
  ```

---

### Task 33: MyChips Testing & Integration

**Status**: 🎯 Ready to implement (depends on Task 32)

#### Unit Tests
- [ ] Create `src/offerwall/providers/mychips/mychips.validator.spec.ts`:
  ```typescript
  describe('MyChipsValidator', () => {
    let validator: MyChipsValidator;

    beforeEach(() => {
      validator = new MyChipsValidator();
    });

    describe('validateIpAddress', () => {
      it('should validate MyChips IPs', () => {
        const validIps = ['168.63.37.145', '20.54.96.37', '13.70.194.104'];
        validIps.forEach(ip => {
          const req = createMockRequest(ip);
          expect(validator.validateIpAddress(req)).toBe(true);
        });
      });

      it('should reject invalid IPs', () => {
        const invalidIps = ['192.168.1.1', '10.0.0.1', '1.1.1.1'];
        invalidIps.forEach(ip => {
          const req = createMockRequest(ip);
          expect(validator.validateIpAddress(req)).toBe(false);
        });
      });

      it('should handle X-Forwarded-For header', () => {
        const req = {
          headers: { 'x-forwarded-for': '168.63.37.145, 192.168.1.1' },
          socket: { remoteAddress: '192.168.1.1' }
        };
        expect(validator.validateIpAddress(req)).toBe(true);
      });
    });

    describe('validateRequiredParams', () => {
      it('should validate required parameters', () => {
        const validParams = { user_id: 'user123', payout: '0.50' };
        expect(validator.validateRequiredParams(validParams)).toBe(true);
      });

      it('should reject missing user_id', () => {
        const invalidParams = { payout: '0.50' };
        expect(validator.validateRequiredParams(invalidParams)).toBe(false);
      });

      it('should reject missing payout', () => {
        const invalidParams = { user_id: 'user123' };
        expect(validator.validateRequiredParams(invalidParams)).toBe(false);
      });
    });

    describe('validateRejectedCallback', () => {
      it('should validate rejected callbacks', () => {
        const rejectedParams = { 
          user_id: 'user123', 
          payout: '0', 
          rejected_reason_id: '1' 
        };
        expect(validator.validateRejectedCallback(rejectedParams)).toBe(true);
      });

      it('should reject non-zero payout for rejected callbacks', () => {
        const invalidParams = { 
          user_id: 'user123', 
          payout: '0.50', 
          rejected_reason_id: '1' 
        };
        expect(validator.validateRejectedCallback(invalidParams)).toBe(false);
      });
    });
  });
  ```

- [ ] Create `src/offerwall/providers/mychips/mychips.provider.spec.ts`:
  ```typescript
  describe('MyChipsProvider', () => {
    let provider: MyChipsProvider;
    let validator: MyChipsValidator;
    let configService: AppConfigService;

    beforeEach(() => {
      const mockValidator = {
        validateIpAddress: jest.fn(),
        validateRequiredParams: jest.fn(),
        validateRejectedCallback: jest.fn()
      };
      
      const mockConfig = {
        get: jest.fn().mockImplementation((key, defaultValue) => {
          if (key === 'MYCHIPS_ENABLED') return true;
          return defaultValue;
        })
      };

      provider = new MyChipsProvider(mockValidator, mockConfig);
      validator = mockValidator;
      configService = mockConfig;
    });

    describe('validateCallback', () => {
      it('should validate standard callbacks', async () => {
        const req = createMockRequest('168.63.37.145');
        req.body = { user_id: 'user123', payout: '0.50' };
        
        validator.validateRequiredParams.mockReturnValue(true);
        validator.validateIpAddress.mockReturnValue(true);
        
        const result = await provider.validateCallback(req);
        expect(result).toBe(true);
      });

      it('should validate rejected callbacks', async () => {
        const req = createMockRequest('168.63.37.145');
        req.body = { 
          user_id: 'user123', 
          payout: '0', 
          rejected_reason_id: '1' 
        };
        
        validator.validateRequiredParams.mockReturnValue(true);
        validator.validateIpAddress.mockReturnValue(true);
        validator.validateRejectedCallback.mockReturnValue(true);
        
        const result = await provider.validateCallback(req);
        expect(result).toBe(true);
      });

      it('should reject invalid IP addresses', async () => {
        const req = createMockRequest('192.168.1.1');
        req.body = { user_id: 'user123', payout: '0.50' };
        
        validator.validateRequiredParams.mockReturnValue(true);
        validator.validateIpAddress.mockReturnValue(false);
        
        const result = await provider.validateCallback(req);
        expect(result).toBe(false);
      });
    });

    describe('parseCallback', () => {
      it('should parse standard callbacks', () => {
        const body = {
          user_id: 'user123',
          payout: '0.50',
          click_id: 'abc123',
          event_name: 'install',
          conversion_country: 'US'
        };
        
        const result = provider.parseCallback(body);
        
        expect(result.userId).toBe('user123');
        expect(result.amountUsd).toBe(0.50);
        expect(result.amountPts).toBe(500); // 0.50 * 1000
        expect(result.provider).toBe('mychips');
        expect(result.metadata.clickId).toBe('abc123');
      });

      it('should parse rejected callbacks', () => {
        const body = {
          user_id: 'user123',
          payout: '0',
          rejected_reason_id: '1',
          click_id: 'abc123'
        };
        
        const result = provider.parseCallback(body);
        
        expect(result.userId).toBe('user123');
        expect(result.amountUsd).toBe(0);
        expect(result.amountPts).toBe(0);
        expect(result.metadata.rejectedReasonId).toBe('1');
      });

      it('should parse IAP callbacks', () => {
        const body = {
          user_id: 'user123',
          payout: '2.99',
          event_value: '2.99',
          event_value_currency: 'USD',
          event_value_usd: '2.99'
        };
        
        const result = provider.parseCallback(body);
        
        expect(result.amountUsd).toBe(2.99);
        expect(result.amountPts).toBe(2990);
        expect(result.metadata.eventValue).toBe('2.99');
        expect(result.metadata.eventValueCurrency).toBe('USD');
      });
    });
  });
  ```

#### Integration Tests
- [ ] Create webhook integration tests:
  ```typescript
  describe('MyChips Webhook Integration', () => {
    it('should process standard MyChips callback', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/offerwall/callback/mychips')
        .set('X-Forwarded-For', '168.63.37.145')
        .send({
          user_id: 'user123',
          payout: '0.50',
          click_id: 'abc123',
          event_name: 'install'
        })
        .expect(200);
        
      expect(response.body).toEqual({ status: 'ok' });
    });

    it('should process rejected MyChips callback', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/offerwall/callback/mychips')
        .set('X-Forwarded-For', '168.63.37.145')
        .send({
          user_id: 'user123',
          payout: '0',
          rejected_reason_id: '1',
          click_id: 'abc123'
        })
        .expect(200);
        
      expect(response.body).toEqual({ status: 'ok' });
    });

    it('should process IAP MyChips callback', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/offerwall/callback/mychips')
        .set('X-Forwarded-For', '168.63.37.145')
        .send({
          user_id: 'user123',
          payout: '2.99',
          event_value: '2.99',
          event_value_currency: 'USD',
          event_value_usd: '2.99'
        })
        .expect(200);
        
      expect(response.body).toEqual({ status: 'ok' });
    });
  });
  ```

#### Test Coverage Requirements
- [ ] Achieve 100% test coverage on MyChips provider
- [ ] Test all callback types (standard, rejected, IAP)
- [ ] Test IP validation with various header configurations
- [ ] Test fraud detection event emission
- [ ] Test error handling and logging

---

### Task 34: MyChips Documentation & Deployment

**Status**: 🎯 Ready to implement (depends on Task 33)

#### Documentation Creation
- [ ] Create `tasks/task-34-mychips-provider-implementation.md`:
  ```markdown
  # Task: Implement MyChips Provider

  ## Overview
  Implemented the MyChips offerwall provider with IP validation, support for rejected callbacks, and IAP (In-App Purchase) events according to the MyChips S2S specification.

  ## Changes Made
  ### Files Created
  - src/offerwall/providers/mychips/mychips.types.ts
  - src/offerwall/providers/mychips/mychips.validator.ts
  - src/offerwall/providers/mychips/mychips.provider.ts
  - src/offerwall/providers/mychips/mychips.validator.spec.ts
  - src/offerwall/providers/mychips/mychips.provider.spec.ts

  ### Files Modified
  - src/offerwall/offerwall.module.ts
  - src/offerwall/providers/provider.interface.ts
  - src/offerwall/providers/provider.factory.ts
  - src/offerwall/entities/reward-transaction.entity.ts
  ```

#### API Documentation Updates
- [ ] Update OpenAPI documentation:
  ```yaml
  /api/offerwall/callback/mychips:
    post:
      summary: MyChips webhook callback
      description: |
        Receives offer completion callbacks from MyChips.
        Authentication via IP whitelisting only (no HMAC).
        Supports standard callbacks, rejected callbacks, and IAP callbacks.
      parameters:
        - name: user_id
          description: User ID in our system
          required: true
        - name: payout
          description: Payout amount in USD
          required: true
        - name: click_id
          description: Click tracking ID
          required: false
        - name: rejected_reason_id
          description: Rejection reason ID (for rejected callbacks)
          required: false
        - name: event_value
          description: Purchase amount (for IAP callbacks)
          required: false
  ```

#### MyChips Integration Guide
- [ ] Create comprehensive integration guide:
  ```markdown
  ## MyChips Integration Guide

  ### Dashboard Configuration
  1. Login to MyChips dashboard
  2. Navigate to Settings → Postback URL
  3. Set webhook URL: https://your-domain.com/api/offerwall/callback/mychips
  4. Configure parameters:
     - user_id={user_id}
     - payout={payout}
     - click_id={click_id}
     - event_name={event_name}
     - conversion_country={conversion_country}
     - conversion_time={unix_timestamp}

  ### Rejected Callback Configuration
  Set rejected callback URL with:
  - payout=0 (always zero for rejected)
  - rejected_reason_id={rejected_reason_id}

  ### IAP Callback Configuration
  Include IAP-specific parameters:
  - event_value={event_value}
  - event_value_currency={event_value_currency}
  - event_value_usd={event_value_usd}
  ```

#### Deployment Configuration
- [ ] Update Railway environment variables:
  ```bash
  # Add to Railway dashboard
  MYCHIPS_ENABLED=true
  MYCHIPS_APP_ID=your-app-id
  MYCHIPS_PUBLISHER_ID=your-publisher-id
  MYCHIPS_WEBHOOK_IPS=168.63.37.145,20.54.96.37,13.70.194.104,34.146.139.91,34.54.234.115,34.54.248.253,34.64.93.62,34.47.93.43,34.84.180.208,48.209.163.104,4.207.193.125,48.209.162.122
  ```

#### Testing Guide
- [ ] Create MyChips testing procedures:
  ```bash
  # Test standard callback
  curl -X POST https://your-domain.com/api/offerwall/callback/mychips \
    -H "X-Forwarded-For: 168.63.37.145" \
    -H "Content-Type: application/json" \
    -d '{
      "user_id": "test123",
      "payout": "0.50",
      "click_id": "abc123",
      "event_name": "install",
      "conversion_country": "US"
    }'

  # Test rejected callback
  curl -X POST https://your-domain.com/api/offerwall/callback/mychips \
    -H "X-Forwarded-For: 168.63.37.145" \
    -H "Content-Type: application/json" \
    -d '{
      "user_id": "test123",
      "payout": "0",
      "rejected_reason_id": "1",
      "click_id": "abc123"
    }'

  # Test IAP callback
  curl -X POST https://your-domain.com/api/offerwall/callback/mychips \
    -H "X-Forwarded-For: 168.63.37.145" \
    -H "Content-Type: application/json" \
    -d '{
      "user_id": "test123",
      "payout": "2.99",
      "event_value": "2.99",
      "event_value_currency": "USD",
      "event_value_usd": "2.99"
    }'
  ```

#### Monitoring & Alerting
- [ ] Add MyChips-specific monitoring:
  ```typescript
  // Metrics for MyChips callbacks
  private myChipsCallbackCounter = new Counter({
    name: 'mychips_callbacks_total',
    help: 'Total MyChips callbacks received',
    labelNames: ['type', 'status'] // type: standard|rejected|iap
  });

  private rejectedCallbackCounter = new Counter({
    name: 'mychips_rejected_callbacks_total',
    help: 'Total rejected callbacks from MyChips',
    labelNames: ['severity'] // severity: low|medium|high
  });
  ```

#### Fraud Detection Documentation
- [ ] Document rejected callback handling:
  ```markdown
  ## Fraud Detection

  ### Rejected Callback Severity Levels
  - **High (IDs: 1, 10, 12, 14)**: Immediate user ban recommended
  - **Medium (IDs: 2, 3, 5, 8, 11, 13)**: Monitor for multiple occurrences
  - **Low (IDs: 0, 4, 6, 7, 9)**: Use for risk scoring

  ### Automatic Actions
  - High severity: Emit fraud.detected event with severity='high'
  - Medium severity: Track occurrences, ban after 3 within 7 days
  - Low severity: Log for analytics and risk assessment
  ```

---

## 🎯 Project Initialization

### Clean Template
- [x] Remove `src/users` module completely (controller, service, entities, DTOs)
- [x] Remove user-related tests from `src/users/**/*.spec.ts`
- [x] Update `src/app.module.ts` to remove UserModule import
- [x] Clean up any user-related migrations in `src/migrations`
- [x] Update README.md to reflect offerwall service instead of offerwall-service
- [x] Remove any authentication-related code from the template

### Update Project Metadata
- [x] Rename project in `package.json` from "offerwall-service" to "offerwall-service"
- [x] Update all Docker references from "offerwall-service" to "offerwall-service"
- [x] Update SERVICE_NAME in `.env.example` to "offerwall-service"
- [x] Update GitHub Actions workflows to use correct service name

## 🏗️ Core Module Structure

### Create Offerwall Module
- [x] Create `src/offerwall/offerwall.module.ts` with proper imports
- [x] Create `src/offerwall/offerwall.controller.ts` with these endpoints:
  - `POST /offerwall/callback/:provider` - Public webhook endpoint (no auth)
  - `GET /offerwall/providers` - Get available providers and their status
  - `GET /offerwall/health/:provider` - Check provider connectivity
- [x] Create `src/offerwall/offerwall.service.ts` with core business logic
- [x] Register OfferwallModule in `src/app.module.ts`
- [x] **Note**: No user authentication needed - webhooks contain user_id from provider

### Create Provider Abstraction Layer
- [x] Create `src/offerwall/providers/provider.interface.ts`:
  ```typescript
  interface OfferwallProvider {
    validateCallback(params: any, headers: any): Promise<boolean>;
    parseCallback(params: any): OfferwallCallbackData;
    getName(): string;
    getStatus(): Promise<ProviderStatus>;
  }
  ```
- [x] Create `src/offerwall/providers/provider.factory.ts` for provider instantiation
- [x] Create `src/offerwall/providers/provider.types.ts` for shared types

## 🔌 Adjoe Integration

### Implement Adjoe Provider
- [x] Create `src/offerwall/providers/adjoe/adjoe.provider.ts` implementing OfferwallProvider
- [x] Create `src/offerwall/providers/adjoe/adjoe.validator.ts` with HMAC-SHA1 verification:
  ```typescript
  // Signature format: trans_uuid + user_uuid + currency + coin_amount + device_id + sdk_app_id + s2s_token
  ```
- [x] Create `src/offerwall/providers/adjoe/adjoe.types.ts` with callback parameter types
- [x] Add Adjoe configuration to `.env.example`:
  ```
  ADJOE_APP_KEY=
  ADJOE_S2S_TOKEN=
  ADJOE_WEBHOOK_IPS=185.201.1.0/24,185.201.2.0/24
  ```
- [x] Create unit tests for HMAC validation in `adjoe.validator.spec.ts`

## 📊 Database Schema

### Create Entities
- [ ] Create `src/offerwall/entities/reward-transaction.entity.ts`:
  ```typescript
  @Entity('reward_transactions')
  @Unique(['provider', 'transactionId']) // Prevent duplicates
  export class RewardTransaction {
    @PrimaryGeneratedColumn('uuid') id: string;
    @Column() userId: string; // User ID from provider callback
    @Column() provider: string;
    @Column() transactionId: string; // Provider's unique transaction ID
    @Column() offerId: string;
    @Column() offerName: string;
    @Column('integer') amountPts: number; // Woo Points
    @Column('decimal', { precision: 10, scale: 6 }) amountUsdc: number;
    @Column({ enum: ['pending', 'completed', 'failed'] }) status: string;
    @Column('text', { nullable: true }) errorMessage: string;
    @Column('jsonb') callbackPayload: any; // Full provider callback for audit
    @CreateDateColumn() processedAt: Date;
    @Index(['userId', 'processedAt'])
    @Index(['provider', 'transactionId'])
  }
  ```
- [ ] Generate migration: `pnpm typeorm migration:generate -n CreateRewardTransactions`
- [ ] Test migration locally: `pnpm migrate`
- [ ] **Note**: This service only stores transaction records, not user data

### Create DTOs
- [ ] Create `src/offerwall/dto/reward-transaction.dto.ts`:
  ```typescript
  export class RewardTransactionDto {
    @IsString() userId: string;
    @IsString() provider: string;
    @IsString() transactionId: string;
    @IsString() offerId: string;
    @IsString() offerName: string;
    @IsNumber() amountPts: number;
    @IsNumber() amountUsdc: number;
    @IsObject() metadata?: any;
  }
  ```
- [ ] Create `src/offerwall/dto/credit-balance.dto.ts` for User Service calls
- [ ] Create `src/offerwall/dto/provider-callback.dto.ts` as base for providers
- [ ] Create `src/common/dto/service-response.dto.ts` for inter-service responses

## 🔄 Webhook Data Flow

### Implement Webhook Handler
- [ ] Create webhook processing flow:
  ```typescript
  async handleProviderCallback(provider: string, params: any, headers: any) {
    // 1. Validate provider exists
    const providerImpl = this.providerFactory.getProvider(provider);
    
    // 2. Validate signature (no user auth needed)
    const isValid = await providerImpl.validateCallback(params, headers);
    if (!isValid) throw new UnauthorizedException('Invalid signature');
    
    // 3. Parse callback data (includes user_id from provider)
    const callbackData = providerImpl.parseCallback(params);
    
    // 4. Check for duplicate transaction
    const existing = await this.rewardTransactionRepository.findOne({
      where: { provider, transactionId: callbackData.transactionId }
    });
    if (existing) return { status: 'ok' }; // Idempotent
    
    // 5. Queue for async processing
    await this.offerwallQueue.add('process-reward', {
      provider,
      callbackData
    });
    
    // 6. Return immediately (webhook must be fast)
    return { status: 'ok' };
  }
  ```

### Error Handling
- [x] Never expose internal errors to webhook responses
- [x] Always return 200 OK to prevent provider retries
- [x] Log all errors with full context
- [x] Use structured logging for webhook tracking:
  ```typescript
  this.logger.log('Webhook received', {
    event: 'webhook_received',
    provider,
    userId: callbackData.userId,
    transactionId: callbackData.transactionId,
    amount: callbackData.amountPts
  });
  ```

## 📨 Queue Processing

### Setup BullMQ
- [ ] Install dependencies: `pnpm add @nestjs/bullmq bullmq`
- [ ] Create `src/offerwall/queues/offerwall.queue.ts`
- [ ] Configure queue in offerwall.module.ts:
  ```typescript
  BullModule.forRoot({
    connection: { url: process.env.REDIS_URL }
  }),
  BullModule.registerQueue({
    name: 'offerwall',
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 }
    }
  })
  ```
- [ ] Implement queue processor in offerwall.service.ts with @Process decorator
- [ ] Add Redis configuration to `.env.example`

## 🔐 Security Implementation

### Webhook Security
- [ ] Create `src/common/guards/webhook-auth.guard.ts`:
  ```typescript
  // Validate provider signatures (HMAC)
  // Check IP whitelist
  // No user authentication needed - trust provider's user_id
  ```
- [ ] Apply guard to callback endpoints only
- [ ] Log all webhook attempts for security audit

### Inter-Service Security
- [ ] Create `src/common/guards/service-auth.guard.ts`:
  ```typescript
  @Injectable()
  export class ServiceAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers['x-service-auth'];
      return authHeader === process.env.SERVICE_AUTH_SECRET;
    }
  }
  ```
- [ ] Apply to any internal admin endpoints
- [ ] Configure service-to-service authentication

### Rate Limiting
- [ ] Install `@nestjs/throttler`
- [ ] Configure rate limiting at provider level:
  - 1000 callbacks/minute per provider
  - Store in Redis: `provider:${provider}:callbacks`
- [ ] No user-specific rate limiting (handled by User Service)
- [ ] Alert on unusual callback patterns

## 🎭 Event System & Inter-Service Communication

### Create Events
- [ ] Create `src/offerwall/events/reward.events.ts`:
  ```typescript
  export class RewardReceivedEvent {
    constructor(
      public readonly userId: string,
      public readonly provider: string,
      public readonly transactionId: string,
      public readonly amountPts: number,
      public readonly amountUsdc: number,
      public readonly metadata: any
    ) {}
  }

  export class RewardProcessedEvent {
    constructor(
      public readonly transactionId: string,
      public readonly userId: string,
      public readonly status: 'completed' | 'failed',
      public readonly error?: string
    ) {}
  }
  ```
- [ ] Configure EventEmitter2 in app.module.ts
- [ ] Emit events at appropriate points in service

### Queue Processing Flow
- [ ] Update queue processor to:
  ```typescript
  @Process('process-reward')
  async processReward(job: Job) {
    const { provider, callbackData } = job.data;
    
    try {
      // 1. Validate user exists and is active
      const userStatus = await this.userServiceAdapter.getUserStatus(callbackData.userId);
      if (!userStatus.isActive) {
        throw new Error('User is not active');
      }

      // 2. Store transaction record
      const transaction = await this.saveRewardTransaction(callbackData);

      // 3. Credit user balance via User Service
      await this.userServiceAdapter.creditUserBalance(callbackData.userId, {
        amountPts: transaction.amountPts,
        amountUsdc: transaction.amountUsdc,
        provider,
        transactionId: transaction.transactionId
      });

      // 4. Emit event for other services (Referral, Analytics, etc.)
      this.eventEmitter.emit('reward.processed', new RewardProcessedEvent(
        transaction.transactionId,
        callbackData.userId,
        'completed'
      ));

      // 5. Update transaction status
      await this.updateTransactionStatus(transaction.id, 'completed');
      
    } catch (error) {
      // Handle failure
      this.logger.error('Failed to process reward', error);
      await this.updateTransactionStatus(transaction.id, 'failed', error.message);
      throw error; // Let BullMQ handle retry
    }
  }
  ```

## 🔌 Service-to-Service Communication

### Create Service Adapters
- [ ] Create `src/adapters/user-service.adapter.ts`:
  ```typescript
  @Injectable()
  export class UserServiceAdapter {
    constructor(
      private readonly httpService: HttpService,
      private readonly logger: Logger
    ) {}

    async creditUserBalance(userId: string, reward: RewardDto): Promise<void> {
      // POST to user service to update balance
      const url = `${this.userServiceUrl}/users/${userId}/balance/credit`;
      await this.httpService.post(url, {
        amountPts: reward.amountPts,
        amountUsdc: reward.amountUsdc,
        source: 'OFFERWALL',
        provider: reward.provider,
        transactionId: reward.transactionId
      }).toPromise();
    }

    async getUserStatus(userId: string): Promise<UserStatus> {
      // Check if user exists and is active
      const url = `${this.userServiceUrl}/users/${userId}/status`;
      const response = await this.httpService.get(url).toPromise();
      return response.data;
    }
  }
  ```
- [ ] Create `src/adapters/balance-service.adapter.ts` for balance operations
- [ ] Create `src/adapters/referral-service.adapter.ts` for referral rewards
- [ ] Create `src/adapters/audit-service.adapter.ts` for audit logging
- [ ] Configure service URLs in environment variables:
  ```
  USER_SERVICE_URL=${{user-service.RAILWAY_PRIVATE_DOMAIN}}:3000
  BALANCE_SERVICE_URL=${{balance-service.RAILWAY_PRIVATE_DOMAIN}}:3001
  REFERRAL_SERVICE_URL=${{referral-service.RAILWAY_PRIVATE_DOMAIN}}:3002
  ```

### Service Authentication
- [ ] Create `src/common/interceptors/service-auth.interceptor.ts`:
  ```typescript
  // Add service-to-service authentication headers
  // Use shared secret or JWT for internal service calls
  ```
- [ ] Add SERVICE_AUTH_SECRET to environment variables
- [ ] Configure HttpService with auth interceptor
- [ ] Add retry logic with exponential backoff for service calls

### Service Discovery
- [ ] Create `src/common/config/services.config.ts` for service URLs
- [ ] Add health checks for dependent services
- [ ] Implement circuit breaker pattern for service calls
- [ ] Add fallback behavior when services are unavailable

## 🧪 Testing Infrastructure

### Unit Tests
- [x] Create `src/offerwall/offerwall.spec.ts` (comprehensive test suite)
- [x] Test controller, service, and provider factory initialization
- [x] Test provider registration and retrieval
- [x] Mock all external dependencies:
  ```typescript
  // Mock WooCashLogger
  const mockLogger = {
    setClassName: jest.fn(),
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  };
  ```
- [x] Test webhook callback handling with graceful error handling
- [x] Achieve 100% test coverage on core module (10 passing tests)

### Integration Tests
- [ ] Create `test/offerwall.e2e-spec.ts` for webhook flow
- [ ] Test with mock User Service responses:
  ```typescript
  beforeEach(() => {
    // Mock inter-service HTTP calls
    nock('http://user-service:3000')
      .get('/users/test-user-123/status')
      .reply(200, { isActive: true });
      
    nock('http://user-service:3000')
      .post('/users/test-user-123/balance/credit')
      .reply(200, { success: true });
  });
  ```
- [ ] Test idempotency (duplicate callbacks)
- [ ] Test service unavailability scenarios
- [ ] Test queue retry logic

### Service Communication Tests
- [ ] Create `test/adapters/user-service.adapter.spec.ts`
- [ ] Test retry logic on service failures
- [ ] Test circuit breaker behavior
- [ ] Test timeout handling
- [ ] Mock various HTTP error responses

## 📊 Monitoring & Observability

### Service Metrics
- [ ] Create `src/common/metrics/metrics.service.ts`:
  ```typescript
  @Injectable()
  export class MetricsService {
    private webhookCounter = new Counter({
      name: 'offerwall_webhooks_total',
      help: 'Total webhooks received',
      labelNames: ['provider', 'status']
    });

    private processingDuration = new Histogram({
      name: 'offerwall_processing_duration_seconds',
      help: 'Webhook processing duration',
      labelNames: ['provider']
    });

    private interServiceCallDuration = new Histogram({
      name: 'inter_service_call_duration_seconds',
      help: 'Duration of calls to other services',
      labelNames: ['service', 'endpoint', 'status']
    });
  }
  ```
- [ ] Expose metrics endpoint at `/metrics`
- [ ] Add distributed tracing headers
- [ ] Track queue depth and processing times

### Health Checks
- [ ] Update health check to include:
  ```typescript
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.redis.pingCheck('redis'),
      () => this.microservice.pingCheck('user-service', {
        url: `${this.userServiceUrl}/health`
      }),
      () => this.queue.isHealthy('offerwall-queue')
    ]);
  }
  ```

### Logging Strategy
- [x] Add correlation IDs to all logs:
  ```typescript
  // For webhooks: use generated correlation ID
  // Header sanitization implemented
  const correlationId = this.generateCorrelationId();
  ```
- [x] Log service communication attempts and results
- [x] Implemented structured logging for webhook tracking:
  - Webhook received events
  - Invalid signature warnings
  - Processing success/failure
  - Error details with context

## 🚀 Railway Deployment

### Update Deployment Configuration
- [ ] Create `railway.json` with proper build and deploy settings:
  ```json
  {
    "$schema": "https://railway.app/railway.schema.json",
    "build": {
      "builder": "NIXPACKS",
      "buildCommand": "npm install && npm run build"
    },
    "deploy": {
      "numReplicas": 2,
      "startCommand": "npm run start:prod",
      "healthcheckPath": "/health",
      "healthcheckTimeout": 30,
      "restartPolicyType": "ON_FAILURE",
      "restartPolicyMaxRetries": 3
    },
    "environments": {
      "production": {
        "numReplicas": 3
      },
      "staging": {
        "numReplicas": 1
      }
    }
  }
  ```
- [ ] Update Dockerfile for microservice deployment
- [ ] Configure private networking for service communication
- [ ] Set up shared environment variables across services

### Service Dependencies
- [ ] Document service startup order:
  1. Database & Redis
  2. User Service (required)
  3. Offerwall Service
  4. Referral Service (optional)
- [ ] Configure health check dependencies
- [ ] Add retry logic for service discovery
- [ ] Document Railway service linking process

### Environment Configuration
- [ ] Document all required Railway environment variables in `.env.example`
- [ ] Create `.env.railway.example` with Railway-specific variable syntax:
  ```
  # Database (Railway managed)
  DATABASE_URL=${{Postgres.DATABASE_URL}}
  
  # Redis (Railway managed)  
  REDIS_URL=${{Redis.REDIS_URL}}
  
  # Inter-service communication (Private networking)
  USER_SERVICE_URL=http://${{user-service.RAILWAY_PRIVATE_DOMAIN}}:3000
  BALANCE_SERVICE_URL=http://${{balance-service.RAILWAY_PRIVATE_DOMAIN}}:3001
  REFERRAL_SERVICE_URL=http://${{referral-service.RAILWAY_PRIVATE_DOMAIN}}:3002
  
  # Service authentication
  SERVICE_AUTH_SECRET=${{shared.SERVICE_AUTH_SECRET}}
  
  # Provider configuration
  ADJOE_APP_KEY=
  ADJOE_S2S_TOKEN=
  ```
- [ ] Create environment variable validation in app startup
- [ ] Document which services are required vs optional

## 📝 Documentation Updates

### Update CLAUDE.md
- [ ] Document service boundaries clearly:
  ```markdown
  ## Service Responsibilities
  - ✅ Receive and validate provider webhooks
  - ✅ Store transaction records for audit
  - ✅ Queue reward processing
  - ✅ Communicate with User Service for balance updates
  - ❌ User authentication
  - ❌ User data storage
  - ❌ Direct balance management
  ```
- [ ] Add inter-service communication patterns
- [ ] Document webhook flow without user context
- [ ] Add troubleshooting for service communication issues

### Create API Documentation
- [ ] Document webhook endpoints:
  ```yaml
  /offerwall/callback/adjoe:
    post:
      summary: Adjoe webhook callback
      description: |
        Receives offer completion callbacks from Adjoe.
        No authentication required - validates via HMAC signature.
        User ID is provided by Adjoe in the callback.
      parameters:
        - name: user_id
          description: User ID in our system (provided by Adjoe)
        - name: transaction_id
          description: Unique transaction ID from Adjoe
        - name: reward
          description: Reward amount in USD
        - name: hash
          description: HMAC signature for validation
  ```
- [ ] Document internal service endpoints
- [ ] Add service communication examples

### Create Service Integration Guide
- [ ] Document how to integrate with User Service
- [ ] Show example service-to-service calls
- [ ] Document expected User Service endpoints:
  ```typescript
  // Expected User Service endpoints:
  GET  /users/:userId/status
  POST /users/:userId/balance/credit
  ```
- [ ] Add error handling patterns for service failures

### Architecture Diagrams
- [ ] Create service communication diagram:
  ```
  Provider → Offerwall Service → Queue → User Service
                              ↓       ↘
                          Database    Referral Service
  ```
- [ ] Document data flow without storing user data
- [ ] Show event propagation pattern

## 🔧 Development Tools

### Create Helper Scripts
- [x] Create `scripts/generate-hmac.ts` for testing webhooks
- [ ] Create `scripts/test-webhook.ts` for local webhook testing
- [x] Add corresponding npm scripts:
  ```json
  "test:hmac": "pnpm ts-node scripts/generate-hmac.ts",
  "test:webhook": "ts-node scripts/test-webhook.ts"
  ```