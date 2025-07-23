# PRD: Dashboard Subscription Gate

## Task ID: 32
## Priority: High
## Title: Dashboard Subscription Gate

## Description
Restrict dashboard access to subscribed users only with granular feature gating and clear upgrade messaging. This feature ensures that only paying customers can access the full editing capabilities of their portfolios while providing clear pathways for free users to upgrade.

## Problem Statement
Currently, all authenticated users have full access to the dashboard regardless of their subscription status. We need to implement a subscription gate that:
1. Restricts certain features to paying customers only
2. Provides clear messaging about upgrade benefits
3. Handles grace periods and edge cases gracefully
4. Maintains a good user experience for both free and paid users

## Requirements

### 1. Subscription Management Flow
- **Free Tier**: View-only access to generated portfolio
  - Can see their portfolio preview
  - Cannot edit sections or regenerate
  - Clear "Upgrade to Edit" CTAs
  
- **Paid Tiers**: Full dashboard access with inline editing
  - Go Live ($14.90): Basic editing capabilities
  - Get Hired ($19.90): Advanced features + multiple templates
  - Turn Heads ($89.90): Premium features + priority support
  
- **Grace Period**: 3 days after subscription expires
  - Warning messages about expiring subscription
  - Gradual feature degradation
  - Email reminders

### 2. Technical Implementation

#### Backend (src/api/dependencies.py)
```python
# Add subscription checking to get_current_user dependency
async def get_current_user_with_subscription(session_id: str):
    user = await get_current_user(session_id)
    user.subscription = await get_user_subscription(user.id)
    user.feature_flags = calculate_feature_flags(user.subscription)
    return user

# New subscription endpoints
POST /api/v1/subscriptions/check
GET /api/v1/subscriptions/status
POST /api/v1/subscriptions/upgrade
```

#### Frontend (packages/new-renderer/app/dashboard/layout.tsx)
```typescript
// Subscription context provider
export function DashboardLayout({ children }) {
  const { subscription, isLoading } = useSubscription();
  
  if (!subscription?.isActive && !subscription?.inGracePeriod) {
    return <UpgradePrompt />;
  }
  
  return (
    <SubscriptionContext.Provider value={subscription}>
      {children}
    </SubscriptionContext.Provider>
  );
}
```

### 3. UI Components

#### Upgrade Prompt Overlay
- Full-page overlay for non-subscribers
- Shows feature comparison table
- Clear pricing information
- "View Portfolio" escape hatch

#### Feature Comparison Table
| Feature | Free | Go Live | Get Hired | Turn Heads |
|---------|------|---------|-----------|------------|
| View Portfolio | ✓ | ✓ | ✓ | ✓ |
| Edit Content | ✗ | ✓ | ✓ | ✓ |
| Multiple Templates | ✗ | ✗ | ✓ | ✓ |
| Custom Domain | ✗ | ✓ | ✓ | ✓ |
| Remove Branding | ✗ | ✗ | ✓ | ✓ |
| Priority Support | ✗ | ✗ | ✗ | ✓ |

#### Locked Feature Indicators
- Grayed out buttons with lock icons
- Tooltip: "Upgrade to unlock this feature"
- Smooth hover animations

#### Subscription Status Badge
- Display in dashboard header
- Shows plan name and days remaining
- Color coding (green/yellow/red)

### 4. Feature Flags System

```typescript
interface FeatureFlags {
  canEdit: boolean;
  canRegenerate: boolean;
  canChooseTemplate: boolean;
  canRemoveBranding: boolean;
  canUseCustomDomain: boolean;
  maxPortfolios: number;
}

// Feature gate component
function FeatureGate({ feature, children, fallback }) {
  const { features } = useSubscription();
  
  if (!features[feature]) {
    return fallback || <LockedFeature feature={feature} />;
  }
  
  return children;
}
```

### 5. Implementation Files

1. **Backend Files**:
   - `src/api/dependencies.py` - Update authentication dependencies
   - `src/api/routes/subscriptions.py` - New subscription endpoints
   - `src/core/schemas/subscription.py` - Subscription data models
   - `src/services/subscription_service.py` - Business logic
   - `src/database/models.py` - Add subscription tables

2. **Frontend Files**:
   - `packages/new-renderer/app/dashboard/layout.tsx` - Main gate implementation
   - `packages/new-renderer/components/subscription/UpgradePrompt.tsx`
   - `packages/new-renderer/components/subscription/FeatureGate.tsx`
   - `packages/new-renderer/components/subscription/StatusBadge.tsx`
   - `packages/new-renderer/lib/hooks/useSubscription.ts`
   - `packages/new-renderer/lib/contexts/SubscriptionContext.tsx`

## Test Strategy

### Unit Tests
1. Subscription service logic
2. Feature flag calculations
3. Grace period calculations
4. Component rendering based on subscription status

### Integration Tests
1. Authentication flow with subscription check
2. API endpoint access control
3. Feature gating in UI
4. Upgrade flow completion

### E2E Tests
1. Free user attempting to access paid features
2. Subscription expiration flow
3. Grace period functionality
4. Upgrade and immediate access

### Edge Cases
1. Expired payment methods
2. Subscription renewal failures
3. Multiple device sessions
4. Timezone handling for expiration
5. Offline functionality

## Success Metrics
1. Conversion rate from free to paid
2. Feature engagement by tier
3. Support ticket reduction
4. User satisfaction scores
5. Revenue per user

## Timeline
- Week 1: Backend implementation and API endpoints
- Week 2: Frontend components and feature gating
- Week 3: Testing and edge case handling
- Week 4: Launch preparation and monitoring

## Dependencies
- Payment processing system (Stripe/PayPal integration)
- Email notification service for grace period warnings
- Analytics tracking for conversion metrics
- Customer support documentation

## Risks & Mitigation
1. **Risk**: Users losing access to work
   - **Mitigation**: Implement robust grace period and export functionality

2. **Risk**: Poor conversion due to aggressive gating
   - **Mitigation**: A/B test different messaging and feature limits

3. **Risk**: Technical issues with payment processing
   - **Mitigation**: Fallback to manual approval process

## Future Enhancements
1. Team/enterprise subscriptions
2. Usage-based pricing tiers
3. Promotional codes and discounts
4. Referral program integration
5. Annual billing options