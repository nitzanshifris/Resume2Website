# Resource Management Specification v1.0

## Intent
Ensure CV2WEB operates efficiently and sustainably while providing excellent user experience through intelligent resource allocation, automatic cleanup, and fair usage policies.

## Core Values

### 1. **Fair Access for All Users**
- Every user gets equal opportunity to create quality portfolios
- Resource limits that don't penalize normal usage
- Graceful handling when approaching capacity limits
- Transparent communication about system status

### 2. **Sustainable Operations**
- Efficient resource utilization to keep service running
- Automatic cleanup prevents resource accumulation
- Smart caching reduces redundant processing
- Cost-effective AI usage through optimization

### 3. **Excellent User Experience**
- Resources managed invisibly to users
- Fast response times maintained under load
- Reliable service availability
- Predictable performance across user sessions

## Resource Management Framework

### Portfolio Sandbox Management

#### Capacity Limits
- **Maximum Active Portfolios**: 20 concurrent instances
- **Memory per Portfolio**: 512MB limit via NODE_OPTIONS
- **Port Range**: 4000-5000 (dedicated portfolio ports)
- **CPU Throttling**: Fair sharing across active portfolios

#### Lifecycle Management
```
Portfolio Lifecycle:
Creation → Active (0-24h) → Warning (24h+) → Cleanup (Auto) → Archived

States:
- CREATING: Resource allocation in progress
- ACTIVE: Portfolio server running and accessible  
- IDLE: No recent activity but within time limit
- WARNING: Approaching cleanup threshold
- CLEANUP: Automated removal in progress
- ARCHIVED: Resources freed, data preserved
```

#### Automatic Cleanup Strategy
- **Cleanup Interval**: Every 5 minutes background scan
- **Age Threshold**: 24 hours since last activity
- **Grace Period**: 30 minutes warning before cleanup
- **User Notification**: Email alert before cleanup (if registered)
- **Data Preservation**: CV data and settings saved, only sandbox removed

### AI Processing Resource Management

#### Claude 4 Opus Usage Optimization
- **Caching Strategy**: SHA-256 file hash based caching
- **Cache Duration**: 30 days or until system update
- **Deduplication**: Identical files reuse cached extractions
- **Rate Limiting**: Smart queuing to respect API limits
- **Cost Optimization**: Batch processing when possible

#### Processing Queue Management
```
Processing Queue Priority:
1. Premium users (future)
2. Returning users with existing data
3. New users (first-time upload)
4. Retry attempts
5. Background improvements

Queue Limits:
- Max concurrent extractions: 5
- Max queue depth: 50 users
- Timeout per extraction: 60 seconds
- Retry limit: 3 attempts
```

### Storage Management

#### File Storage Strategy
- **Original Files**: Preserved in `data/uploads/` with job_id
- **Generated Content**: Temporary in sandboxes, important data in database
- **Cache Files**: AI extraction results cached by file hash
- **Cleanup Policy**: Remove orphaned files older than 30 days

#### Database Resource Management
- **SQLite Optimization**: Regular VACUUM and index maintenance
- **Session Cleanup**: Remove expired sessions (7 days inactive)
- **CV Data Retention**: Preserve user CV data indefinitely (with user consent)
- **Analytics Pruning**: Archive detailed logs older than 90 days

## Fair Usage Policies

### Anonymous Users
- **Portfolio Limit**: 1 active portfolio at a time
- **Processing Limit**: 3 CV extractions per day per IP
- **Retention**: 24 hours active time, then cleanup
- **Features**: Full access to core functionality

### Registered Users (Future Enhancement)
- **Portfolio Limit**: 3 active portfolios simultaneously
- **Processing Limit**: 10 CV extractions per day
- **Retention**: 7 days active time
- **Features**: Extended access, analytics, multiple portfolios

### Premium Users (Future)
- **Portfolio Limit**: 10 active portfolios
- **Processing Limit**: 50 CV extractions per day
- **Retention**: 30 days active time
- **Features**: Priority processing, advanced customization, analytics

## System Health Monitoring

### Key Performance Indicators
- **Portfolio Creation Success Rate**: >95%
- **Average Processing Time**: <30 seconds for CV extraction
- **System Availability**: >99.5% uptime
- **Resource Utilization**: <80% average capacity

### Monitoring Metrics
```python
class ResourceMetrics:
    # Portfolio Management
    active_portfolios: int = 0
    total_created: int = 0
    total_cleaned: int = 0
    average_lifetime_hours: float = 0
    
    # Processing Performance  
    extraction_success_rate: float = 0
    average_processing_time: float = 0
    queue_depth: int = 0
    cache_hit_rate: float = 0
    
    # System Health
    memory_usage_percent: float = 0
    cpu_usage_percent: float = 0
    disk_usage_percent: float = 0
    api_quota_remaining: int = 0
```

### Alert Thresholds
- **Capacity Warning**: >15 active portfolios (75% capacity)
- **Performance Alert**: Processing time >45 seconds
- **Resource Alert**: Memory usage >90%
- **API Limit Warning**: <20% quota remaining

## Capacity Management Strategies

### Approaching Capacity (18+ Active Portfolios)
1. **User Communication**: "High demand - your portfolio will be ready shortly"
2. **Queue Management**: Show position and estimated wait time
3. **Resource Optimization**: Accelerate cleanup of old portfolios
4. **Alternative Options**: Suggest off-peak times or registration benefits

### At Capacity (20 Active Portfolios)
1. **Queue System**: Accept new requests with wait time estimates
2. **Priority Processing**: Registered users get priority
3. **Communication**: Clear messaging about temporary delay
4. **Overflow Handling**: Temporary increase to 25 portfolios if needed

### Over Capacity (Emergency Scaling)
1. **Temporary Expansion**: Scale to 30 portfolios with performance monitoring
2. **Aggressive Cleanup**: Reduce idle time to 12 hours temporarily
3. **Load Balancing**: Distribute across available resources
4. **Service Protection**: Rate limiting to prevent system overload

## Quality Gates & Standards

### Portfolio Quality Assurance
- **Template Validation**: All portfolios must render correctly
- **Performance Testing**: Load time <3 seconds verified
- **Mobile Compatibility**: Responsive design validation
- **Accessibility Check**: Basic WCAG compliance verification

### Data Quality Standards
- **CV Extraction Accuracy**: Minimum 90% accuracy on test cases
- **Template Data Integration**: All CV sections properly mapped
- **Link Validation**: All URLs functional and secure
- **Image Optimization**: All images properly sized and optimized

### Security & Privacy Standards
- **Data Encryption**: All sensitive data encrypted at rest
- **Access Control**: Proper session management and authentication
- **Privacy Compliance**: GDPR-ready data handling
- **Secure Communication**: HTTPS everywhere, secure API endpoints

## Cost Optimization Strategies

### AI Processing Optimization
- **Smart Caching**: Reduce redundant Claude API calls by 80%+
- **Batch Processing**: Group similar requests when possible
- **Model Selection**: Use most cost-effective model for each task
- **Usage Analytics**: Track and optimize API spending

### Infrastructure Efficiency
- **Resource Pooling**: Share resources across multiple portfolios
- **Lazy Loading**: Start services only when needed
- **Auto-scaling**: Dynamic resource allocation based on demand
- **Waste Elimination**: Regular cleanup of unused resources

### User Experience Value
- **Time Savings**: Users save 15+ minutes vs manual portfolio creation
- **Success Rate**: Higher interview rates justify premium features
- **Efficiency**: Automated processes reduce manual intervention
- **Scalability**: System handles growth without linear cost increase

## Emergency Procedures

### System Overload Response
1. **Immediate**: Enable queue system and communicate delays
2. **Short-term**: Temporary capacity increase and aggressive cleanup
3. **Medium-term**: Resource optimization and process improvement
4. **Long-term**: Infrastructure scaling and architecture improvements

### Data Recovery Procedures
- **Portfolio Loss**: Regenerate from cached CV data
- **Database Issues**: Restore from daily backups
- **File Corruption**: Use redundant storage systems
- **System Failures**: Graceful degradation with core functionality

## Integration Points
- **CV Extraction Specification**: Efficient processing resource usage
- **Template Specifications**: Resource requirements for portfolio generation
- **User Experience Specification**: Performance expectations and user communication
- **API Contracts**: Resource allocation for different endpoint usage

---

*This specification ensures CV2WEB operates efficiently and sustainably while providing excellent user experience through intelligent resource management and fair usage policies.*