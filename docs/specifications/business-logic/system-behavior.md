# Business Logic Specification

*Rules, constraints, and behaviors that govern RESUME2WEBSITE system operations*

## Processing Rules

### BL01: File Handling Standards
**Requirement**: Consistent, secure processing of uploaded files across all formats

**File Validation Rules**:
- Maximum file size: 10MB per upload
- Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG
- Virus scanning before processing begins
- File type validation by content, not just extension
- Automatic format detection and appropriate handling

**Processing Constraints**:
- Maximum processing time: 5 minutes per CV
- Timeout handling with partial result delivery when possible
- Automatic retry for transient failures (max 3 attempts)
- Graceful failure handling with user-friendly error messages

### BL02: Data Extraction Logic
**Requirement**: Deterministic, consistent extraction following defined standards

**Extraction Parameters**:
- Claude 4 Opus as primary and only AI model
- Temperature setting: 0.0 for maximum consistency
- Top-p setting: 0.1 for restricted token selection
- Maximum tokens: 4000 per extraction request

**Quality Gates**:
- Semantic similarity validation between source and extracted content
- Automatic confidence scoring for extraction quality
- Human review trigger for low-confidence extractions (<80%)
- Extraction result caching to avoid reprocessing identical content

### BL03: Portfolio Generation Rules
**Requirement**: Reliable portfolio creation with appropriate resource management

**Generation Constraints**:
- Maximum 20 concurrent portfolio generations
- Template selection from approved, tested templates only
- Automatic cleanup of portfolios older than 24 hours (anonymous users)
- Resource limits: 512MB memory per portfolio generation

**Template Management**:
- Active template: official_template_v1
- Consistent template for all users
- Template health monitoring and automatic failover
- Isolated environment for each portfolio generation

## Resource Management

### BL04: System Capacity Management
**Requirement**: Maintain system performance under load while preventing resource exhaustion

**Capacity Limits**:
- Maximum concurrent CV extractions: 10
- Maximum concurrent portfolio generations: 20
- Queue management with FIFO processing
- Graceful degradation when approaching limits

**Auto-Scaling Rules**:
- CPU utilization threshold: 80% for scale-up trigger
- Memory utilization threshold: 85% for scale-up trigger
- Minimum instance count: 2 for redundancy
- Maximum instance count: 10 for cost control

### BL05: Data Retention and Cleanup
**Requirement**: Appropriate data lifecycle management balancing user access and system performance

**Anonymous User Data**:
- CV files: Deleted after 48 hours
- Extracted data: Deleted after 7 days
- Generated portfolios: Deleted after 24 hours
- Processing logs: Retained for 30 days for debugging

**Registered User Data**:
- CV files: Retained until user deletion
- Extracted data: Retained until user deletion
- Generated portfolios: Retained for 90 days of inactivity
- User account data: Retained per privacy policy

### BL06: Performance Monitoring and Alerting
**Requirement**: Proactive monitoring with automated response to system health issues

**Key Metrics**:
- Processing success rate: Alert if <95% over 15-minute window
- Average processing time: Alert if >5 minutes (90th percentile)
- System resource utilization: Alert if >90% for 5+ minutes
- Error rate: Alert if >2% over 15-minute window

**Automated Responses**:
- Service restart for memory leaks or hung processes
- Load balancer health check failures trigger instance replacement
- Database connection pooling adjustment based on load
- Temporary rate limiting during high-load periods

## User Access and Security

### BL07: Anonymous User Capabilities
**Requirement**: Provide core value without registration while maintaining system security

**Available Features**:
- CV upload and processing (single file per session)
- Portfolio generation with random template selection
- Portfolio viewing and basic sharing
- Download of generated portfolio

**Limitations**:
- No portfolio editing capabilities
- No template selection control
- Limited portfolio lifetime (24 hours)
- No usage history or portfolio management

### BL08: Authentication and Session Management
**Requirement**: Secure user authentication with appropriate session handling

**Session Rules**:
- Session timeout: 24 hours of inactivity
- Secure HTTP-only cookies for session management
- CSRF protection for all state-changing operations
- Session regeneration upon authentication status changes

**Authentication Options**:
- Email/password with secure password requirements
- Google OAuth integration for convenience
- Account recovery via secure email verification
- Optional account deletion with complete data removal

### BL09: Rate Limiting and Abuse Prevention
**Requirement**: Prevent system abuse while allowing legitimate usage patterns

**Rate Limits**:
- Anonymous users: 3 CV uploads per hour per IP address
- Registered users: 10 CV uploads per hour per account
- API rate limiting: 100 requests per minute per client
- Progressive backoff for repeated failures

**Abuse Detection**:
- Automated detection of unusual usage patterns
- Temporary IP blocking for aggressive scraping attempts
- CAPTCHA integration for suspected bot traffic
- Manual review process for flagged accounts

## Error Handling and Recovery

### BL10: Graceful Degradation
**Requirement**: Maintain partial functionality when components fail

**Component Failure Responses**:
- CV extraction failure: Offer manual data entry option
- Template generation failure: Provide alternative template
- Database connectivity issues: Use cached data when available
- External service failures: Clear communication and retry options

**Service Recovery**:
- Automatic retry with exponential backoff for transient failures
- Circuit breaker pattern for external service calls
- Health check endpoints for load balancer management
- Graceful shutdown procedures for maintenance

### BL11: Data Consistency and Integrity
**Requirement**: Maintain data consistency across all system operations

**Consistency Rules**:
- Database transactions for multi-step operations
- Idempotent operations where possible to prevent duplicate processing
- Data validation at input, processing, and output stages
- Automatic data backup and recovery procedures

**Integrity Checks**:
- Regular validation of extracted data against source files
- Checksum verification for file uploads and storage
- Database constraint enforcement for data relationships
- Audit logging for all data modification operations

## Business Rules

### BL12: Free Tier Limitations
**Requirement**: Sustainable free tier that demonstrates value while encouraging conversion

**Free Tier Features**:
- Unlimited CV extractions (subject to rate limits)
- Basic portfolio generation with random template
- 24-hour portfolio access for anonymous users
- Standard processing priority

**Premium Feature Differentiation** (Future Implementation):
- Template selection control
- Extended portfolio retention
- Advanced customization options
- Priority processing queue
- Multiple portfolio variants

### BL13: Quality Assurance Gates
**Requirement**: Systematic quality checks to maintain service standards

**Automated Quality Checks**:
- Extraction accuracy validation against known test cases
- Template rendering verification before user delivery
- Performance benchmark compliance for all operations
- Security vulnerability scanning for generated portfolios

**Manual Review Triggers**:
- First-time user feedback requests
- Repeated processing failures for similar input types
- Unusual extraction patterns or results
- Performance degradation beyond acceptable thresholds

### BL14: Compliance and Legal Requirements
**Requirement**: Adherence to legal and regulatory requirements for data processing

**Privacy Compliance**:
- GDPR compliance for EU users (data portability, right to deletion)
- CCPA compliance for California users
- Clear privacy policy and terms of service
- User consent tracking and management

**Data Security**:
- Encryption at rest for all user data
- TLS encryption for all data transmission
- Regular security audits and penetration testing
- Incident response plan for security breaches

---

*These business logic rules ensure RESUME2WEBSITE operates reliably, securely, and sustainably while delivering consistent value to users.*