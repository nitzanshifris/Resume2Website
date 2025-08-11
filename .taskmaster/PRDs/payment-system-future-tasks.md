# RESUME2WEBSITE Payment System Future Tasks - Product Requirements Document

## Executive Summary

This PRD outlines the future development tasks for enhancing the RESUME2WEBSITE payment system after the initial MVP launch. These features will expand the monetization capabilities, improve user experience, and provide additional value through hosting, branding, and refund mechanisms.

## Background & Context

The RESUME2WEBSITE platform currently offers two main products:
1. **Go Live Pack ($97)** - One-time website generation with custom domain and 6 months free hosting
2. **Get Hired Pack ($67)** - Up to 3 portfolio generations with refund if not hired

The future tasks focus on building the infrastructure to support these offerings fully, including branded templates, hosting integration, domain management, and automated refund systems.

## Project Goals

1. **Complete Product Offering**: Implement all promised features for both payment packs
2. **Hosting Infrastructure**: Integrate with Vercel for website deployment and hosting
3. **Domain Management**: Enable custom domain connection for purchased websites
4. **Refund Automation**: Build system for Get Hired pack refunds
5. **Recurring Revenue**: Implement monthly hosting billing after free period
6. **Template Variety**: Create multiple portfolio templates for user choice

## User Stories

### As a Go Live pack customer:
- I want a professionally branded Resume2Web template for my portfolio
- I want my website automatically deployed to Vercel
- I want to connect my custom domain easily
- I want to manage my hosting subscription after the free period

### As a Get Hired pack customer:
- I want to generate up to 3 different portfolio variations
- I want to request a refund if I don't get hired within the timeframe
- I want to choose from multiple portfolio templates

### As an administrator:
- I want to manage hosting subscriptions automatically
- I want to track refund requests and approvals
- I want to monitor hosting costs and billing

## Technical Requirements

### 1. Resume2Web Branded Template
- Custom template with Resume2Web branding
- Professional design optimized for job seekers
- Responsive and modern UI
- Easy customization options

### 2. Vercel Integration
- API integration with Vercel for deployment
- Automatic project creation per user
- Environment variable management
- Build and deployment monitoring

### 3. Domain Connection
- DNS configuration guidance
- Automatic SSL certificate provisioning
- Domain verification process
- Subdomain support

### 4. Refund System
- Automated refund request workflow
- Admin approval interface
- Stripe refund API integration
- Email notifications

### 5. Monthly Hosting Billing
- Subscription management after 6-month free period
- Automatic payment collection
- Grace period handling
- Service suspension for non-payment

### 6. Multiple Portfolio Templates
- At least 3 additional template options
- Template preview system
- Template switching capability
- Customization per template

## Success Metrics

- **Deployment Success Rate**: >95% successful Vercel deployments
- **Domain Connection Rate**: >80% of Go Live customers connect custom domains
- **Refund Request Rate**: <10% of Get Hired customers request refunds
- **Hosting Conversion**: >70% continue hosting after free period
- **Template Usage**: Even distribution across available templates

## Timeline & Phases

### Phase 1: Template & Generation (Week 1-2)
- Resume2Web branded template
- Multiple portfolio template options
- Template selection UI

### Phase 2: Vercel Integration (Week 3-4)
- Vercel API integration
- Deployment automation
- Build monitoring

### Phase 3: Domain Management (Week 5-6)
- Domain connection workflow
- DNS configuration tools
- SSL provisioning

### Phase 4: Billing & Refunds (Week 7-8)
- Monthly billing system
- Refund request workflow
- Admin interfaces

## Risk Assessment

### Technical Risks:
- Vercel API limitations or rate limits
- Domain propagation delays
- Payment processing failures
- Template compatibility issues

### Business Risks:
- High refund rates impacting revenue
- Hosting costs exceeding projections
- Customer support burden for domain issues
- Competition offering similar features

## Dependencies

- Stripe subscription API
- Vercel deployment API
- Domain registrar APIs (optional)
- Email service for notifications
- Admin dashboard for management

## Open Questions

1. Should we support multiple hosting providers besides Vercel?
2. What's the exact timeframe for Get Hired pack refunds?
3. Should we offer domain registration or just connection?
4. How many portfolio regenerations within the 3-attempt limit?
5. What happens to websites after hosting cancellation?

## Acceptance Criteria

### Resume2Web Template:
- [ ] Template includes Resume2Web branding
- [ ] Fully responsive on all devices
- [ ] Customizable color schemes
- [ ] SEO optimized

### Vercel Integration:
- [ ] Automatic deployment on purchase
- [ ] Custom domain configuration
- [ ] Environment variable injection
- [ ] Deployment status tracking

### Domain System:
- [ ] Step-by-step connection guide
- [ ] DNS record validation
- [ ] SSL certificate automation
- [ ] Multiple domain support

### Refund System:
- [ ] Refund request form
- [ ] Admin approval workflow
- [ ] Automated Stripe processing
- [ ] Email confirmations

### Billing System:
- [ ] Subscription creation after 6 months
- [ ] Payment failure handling
- [ ] Account suspension logic
- [ ] Reactivation process

## Technical Architecture

```
┌─────────────────────┐     ┌─────────────────────┐
│   Resume2Web UI     │────▶│   Payment System    │
└─────────────────────┘     └─────────────────────┘
           │                           │
           ▼                           ▼
┌─────────────────────┐     ┌─────────────────────┐
│  Template Engine    │     │   Stripe Billing    │
└─────────────────────┘     └─────────────────────┘
           │                           │
           ▼                           ▼
┌─────────────────────┐     ┌─────────────────────┐
│  Vercel Deployment  │     │   Refund System     │
└─────────────────────┘     └─────────────────────┘
           │                           │
           ▼                           ▼
┌─────────────────────┐     ┌─────────────────────┐
│  Domain Connection  │     │   Admin Dashboard   │
└─────────────────────┘     └─────────────────────┘
```

## Database Schema Updates

```sql
-- Hosting subscriptions
CREATE TABLE hosting_subscriptions (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    portfolio_id UUID REFERENCES portfolios(id),
    stripe_subscription_id VARCHAR(255),
    status VARCHAR(50), -- active, cancelled, suspended
    free_period_ends TIMESTAMP,
    next_billing_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Domain configurations
CREATE TABLE domain_configs (
    id UUID PRIMARY KEY,
    portfolio_id UUID REFERENCES portfolios(id),
    domain VARCHAR(255) UNIQUE,
    status VARCHAR(50), -- pending, active, failed
    ssl_status VARCHAR(50),
    vercel_domain_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Refund requests
CREATE TABLE refund_requests (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    payment_id UUID REFERENCES payments(id),
    reason TEXT,
    status VARCHAR(50), -- pending, approved, rejected, completed
    admin_notes TEXT,
    stripe_refund_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP
);

-- Portfolio templates
CREATE TABLE portfolio_templates (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    preview_url VARCHAR(500),
    is_premium BOOLEAN DEFAULT FALSE,
    is_branded BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### Vercel Integration
```
POST   /api/v1/deploy/vercel           - Deploy portfolio to Vercel
GET    /api/v1/deploy/{id}/status      - Check deployment status
POST   /api/v1/deploy/{id}/env         - Update environment variables
DELETE /api/v1/deploy/{id}             - Remove deployment
```

### Domain Management
```
POST   /api/v1/domains/connect         - Connect custom domain
GET    /api/v1/domains/{id}/verify     - Verify domain configuration
POST   /api/v1/domains/{id}/ssl        - Request SSL certificate
DELETE /api/v1/domains/{id}            - Disconnect domain
```

### Refund System
```
POST   /api/v1/refunds/request         - Submit refund request
GET    /api/v1/refunds                 - List refund requests
PATCH  /api/v1/refunds/{id}/approve    - Approve refund (admin)
PATCH  /api/v1/refunds/{id}/reject     - Reject refund (admin)
```

### Hosting Billing
```
POST   /api/v1/hosting/subscribe       - Create hosting subscription
PATCH  /api/v1/hosting/{id}/cancel     - Cancel subscription
POST   /api/v1/hosting/{id}/reactivate - Reactivate subscription
GET    /api/v1/hosting/invoice         - Get latest invoice
```

## Security Considerations

1. **API Key Management**: Secure storage of Vercel API keys
2. **Domain Verification**: Prevent domain hijacking
3. **Refund Fraud**: Implement fraud detection
4. **Payment Security**: PCI compliance maintenance
5. **Access Control**: Role-based permissions for admin features

## Monitoring & Analytics

- Deployment success rates
- Domain connection completion rates
- Refund request patterns
- Hosting subscription retention
- Template usage analytics
- Error tracking and alerting

---

*Created: 2025-01-17*
*Status: Planning*
*Owner: RESUME2WEBSITE Development Team*