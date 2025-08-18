

# RESUME2WEBSITE V4 - Strategic & UX Tasks



### 2.1 Before & After Component Enhancement [TASKMASTER #12] 



### 2.3 Dashboard Page Unification with Inline Editing [TASKMASTER #13]
**Files**: `packages/new-renderer/app/dashboard/*`
- [ ] Backup CV Editor page to separate GitHub branch before removal
- [ ] Remove CV Editor page entirely - editing will happen directly on the website
- [ ] Merge My Resume and My Website into single unified page
- [ ] Implement inline editing directly on the portfolio website preview
- [ ] Add floating edit toolbar that appears on hover/click of editable elements
- **New Architecture - Direct Website Editing**:
  - Phase 1: Create backup branch with current CV editor functionality
  - Phase 2: Implement contentEditable or similar for all text elements on portfolio
  - Phase 3: Add rich text editing toolbar (bold, italic, links, etc.)
  - Phase 4: Ensure all CV editor functionality is available through inline editing
  - Implement autosave with debouncing (save after 2 seconds of inactivity)
  - Add visual indicators for editable areas (subtle outline on hover)
  - Keyboard shortcuts remain: Cmd+S to save, Cmd+Z to undo
- **Benefits of Direct Editing**:
  - True WYSIWYG experience
  - No context switching between editor and preview
  - Immediate visual feedback
  - More intuitive for non-technical users

### 2.4 Dashboard Tutorial Animation
**Files**: `packages/new-renderer/app/dashboard/layout.tsx`
- [ ] Add onboarding animation explaining inline editing functionality
- [ ] Use existing animation components from Aceternity UI
- [ ] Consider using tour library for step-by-step guidance
- **Interactive Onboarding Flow for Inline Editing**:
  - Use a popular library like Shepherd.js or Driver.js for tour functionality
  - Create contextual tips that appear based on user actions (not just on first visit)
  - Highlight key areas in sequence: 
    - "Click any text to edit it directly"
    - "Select text to see formatting options"
    - "Drag and drop images to update them"
    - "Changes save automatically"
  - Show inline editing features: hover effects, click-to-edit, formatting toolbar
  - Add "Skip tutorial" option for returning users
  - Include progress indicator: "Step 2 of 5"
  - End with a celebratory animation and "You're ready to create!" message

### 2.5 insure - Dynamic Component System Based on Links - works 
**Files**: `src/templates/*/lib/cv-data-adapter.tsx`
- [ ] Build system: "If user has link → switch component to X/Y/Z"
- [ ] Test all scenarios with Aceternity and Magic UI components
- [ ] Leverage existing template adapter system
- **Smart Component Mapping System**:
  - Create comprehensive mapping rules:
    - Has GitHub → Show code showcase component with live repo stats
    - Has LinkedIn → Add professional network component
    - Has Dribbble/Behance → Switch to visual portfolio grid
    - Has YouTube → Embed video showcase section
    - Has Medium/Dev.to → Add blog post carousel
  - Implement fallback components for missing links
  - A/B test different component combinations for conversion optimization
  - Allow manual override: users can choose alternative components if they prefer

## 3. Commercial & Pricing Tasks

### 3.1 Upgrade Button in Progress Bar [HIGH PRIORITY]
**Files**: `packages/new-renderer/app/dashboard/my-website/page.tsx`
- [ ] 3.1.1: Implement upgrade button integration directly into progress bar component
- [ ] 3.1.2: Display button when portfolio is between 40-80% complete (optimal conversion window)
- [ ] 3.1.3: Show payment component (already exists) when clicked
- [ ] 3.1.4: Add text like "Unlock 23 Premium Features" or "Complete Your Professional Portfolio"
- [ ] 3.1.5: Show what's locked: blur out premium sections with lock icons
- [ ] 3.1.6: Consider dynamic pricing: "Complete now for 20% off!"
- **Strategic Placement & Psychology**: This is brilliant monetization timing:
  - Users see their portfolio is "incomplete" creating urgency
  - The progress bar creates a psychological need for completion
  - Integration with existing payment modal
  - This is the moment we request payment from users
- **Psychology-driven design**:
  - Create urgency with "incomplete" portfolio status
  - Show what's locked: blur out premium sections with lock icons
  - Consider dynamic pricing: "Complete now for 20% off!"
- **A/B testing considerations**:
  - Test button colors (orange/yellow CTAs typically outperform)
  - Test different completion thresholds for showing button
  - Test various urgency messages
- **Test strategy**:
  - Button placement at different progress levels
  - Click-through rates
  - Conversion tracking
  - A/B test variations
  - Mobile responsiveness
  - Payment modal integration

### 3.2 Remove "Take Control" Button [TASKMASTER #15]
**Files**: `packages/new-renderer/app/dashboard/my-website/page.tsx`
- [ ] Delete "Take Control" button from My Website page
- [ ] Button triggers payment modal - will be replaced by progress bar upgrade button
- **Friction Reduction**: Good decision to simplify the UI:
  - Single clear CTA reduces decision paralysis
  - Progress bar integration feels more natural than a standalone button
  - Consider keeping the button but moving it inside locked features as "Unlock This Section"

### 3.3 Stripe Integration [TASKMASTER #16]
**Files**: `src/api/routes/payments.py` (to be created)
- [ ] Connect Stripe payment processing to backend
- [ ] Implement payment endpoints as specified in CLAUDE.md
- [ ] Handle subscription management
- **Implementation Best Practices**:
  - Use Stripe Checkout for PCI compliance (no credit card handling on your servers)
  - Implement webhook handlers for:
    - payment_intent.succeeded → Activate user subscription
    - customer.subscription.deleted → Downgrade user
    - invoice.payment_failed → Send reminder email
  - Add idempotency keys to prevent double charges
  - Store Stripe customer ID in user table for easy management
  - Implement grace period (3 days) for failed payments before downgrading
  - Add test mode toggle for development/staging environments

### 3.4 Resume2Web Branding for Go Live Plan [TASKMASTER #17]
**Files**: `src/templates/v0_template_1/components/footer.tsx`
- [ ] Add Resume2Web button/branding to portfolio in Go Live tier ($14.90)
- [ ] Ensure branding is removed in higher tiers
- **Branding Strategy**:
  - Make branding subtle but clickable: "Powered by Resume2Web" with your logo
  - Link should go to your homepage with UTM tracking for attribution
  - Consider adding "Remove branding" as an upsell opportunity in the dashboard
  - This creates a viral loop where viewers become users
  - Track clicks on branding links to measure viral coefficient

### 3.5 Premium Annual Discount [TASKMASTER #18]
**Files**: `packages/new-renderer/components/pricing-modal.tsx`
- [ ] Turn Heads plan ($89.90) should offer 10% annual discount
- [ ] Update pricing display logic
- **Pricing Psychology Enhancements**:
  - Show monthly vs annual toggle with savings highlighted: "Save $107.88/year!"
  - Add "Most Popular" badge to Get Hired plan (middle option)
  - Consider limited-time offers: "Annual plans 20% off this week only"
  - Display pricing as "$7.49/month" (billed annually) instead of $89.90
  - Add enterprise/team pricing for B2B opportunities
  - Implement abandoned cart emails for users who view pricing but don't convert

## 4. Technical & Infrastructure Tasks

### 4.1 Component Adaptation Specification [TASKMASTER #19]
**Files**: `src/templates/*/lib/cv-data-adapter.tsx`, Task documentation
- [ ] Define exact UI component adaptations based on user links
- [ ] Document component switching logic for each link type
- [ ] Create mapping table: link type → component selection
- **Comprehensive Component Mapping Documentation**:
  - Create a decision tree for component selection:
    ```
    Portfolio Type Detection:
    - Developer: GitHub + Stack Overflow → Code showcase layout
    - Designer: Dribbble + Behance → Visual grid layout
    - Writer: Medium + Personal blog → Article layout
    - Business: LinkedIn only → Professional layout
    ```
  - Build intelligent defaults when links are missing
  - Create JSON schema for component configuration
  - Version control component mappings for easy rollbacks

### 4.2 Email Validation [TASKMASTER #20]
**Files**: `src/api/routes/auth.py`, `src/core/schemas/user.py`
- [ ] Add email validation to user input fields
- [ ] Implement regex validation and domain verification
- [ ] Use existing validation patterns in auth system
- **Advanced Email Validation**:
  - Frontend: Real-time validation as user types with debouncing
  - Backend: Multi-level validation:
    - Regex for format
    - DNS lookup for domain existence
    - Disposable email service blocking (block tempmail domains)
    - Corporate email detection for B2B leads
  - Consider using service like ZeroBounce API for deep validation
  - Add "Did you mean?" suggestions for common typos (gmial.com → gmail.com)

### 4.3 Database CV Data Persistence [TASKMASTER #21]
**Files**: `src/api/routes/cv.py`, `src/core/schemas/cv_data.py`
- [ ] Verify SQLite database saves extracted CV data correctly
- [ ] Already implemented - need to verify and test thoroughly
- [ ] Check data persistence across sessions
- **Data Integrity & Backup Strategy**:
  - Implement database migrations with Alembic for schema changes
  - Add automated daily backups to S3/CloudStorage
  - Create data integrity checks:
    - Verify no orphaned CV records
    - Check file references exist
    - Validate JSON data structure integrity
  - Consider moving to PostgreSQL for production (better concurrent writes)
  - Implement soft deletes for data recovery

### 4.4 Vercel Deployment Integration [TASKMASTER #6, #22]
**Files**: `vercel.json`, deployment configuration
- [ ] Connect to Vercel for portfolio hosting
- [ ] Configure automatic deployment for generated portfolios
- [ ] Set up domain management
- **Scalable Deployment Architecture**:
  - Use Vercel's API for programmatic deployments
  - Implement deployment queue to avoid rate limits
  - Set up custom domains: username.resume2web.com
  - Configure edge functions for global performance
  - Add deployment health checks and rollback capability
  - Implement preview deployments for user testing
  - Set up monitoring with Vercel Analytics

### 4.5 AWS & Kubernetes Preparation
**Files**: Create `deployment/aws/`, `deployment/k8s/`
- [ ] Create deployment directories: deployment/aws/, deployment/k8s/
- [ ] AWS infrastructure setup:
  - ECS for container orchestration (simpler than K8s for start)
  - RDS for PostgreSQL database
  - S3 for file storage
  - CloudFront for CDN
  - SQS for job queuing
- [ ] Infrastructure as code:
  - Create Terraform scripts for all AWS resources
  - Version control infrastructure changes
  - Environment-specific configurations
- [ ] Containerization:
  - Dockerize both frontend and backend
  - Multi-stage builds for optimization
  - Security scanning for images
- [ ] Scalability features:
  - Auto-scaling based on portfolio generation load
  - AWS Lambda for lightweight background tasks
  - Design for multi-region deployment later
- [ ] Code cleanup:
  - Identify unused features and save to separate branch
  - Remove development-only code
  - Optimize for production
- **Test strategy**:
  - Docker builds
  - Terraform deployment
  - Auto-scaling triggers
  - Load testing
  - Failover scenarios
  - Cost optimization
- **Priority**: Medium (Production readiness task)

### 4.6 Portfolio Generation Optimization
**Files**: `src/api/routes/portfolio_generator.py`, `src/core/generators/`
- [ ] Investigate and implement optimizations to speed up portfolio generation from 60 seconds to target of 15 seconds
- [ ] Profile current generation process to identify bottlenecks
- [ ] Implement optimization strategies while maintaining code quality
- **Bottleneck Analysis**:
  - Profile current generation process
  - Identify slowest operations (likely npm install and build steps)
  - Measure each step's duration
- **Optimization Strategies**:
  - Pre-built Docker images with common dependencies
  - Dependency caching layer (save node_modules between builds)
  - Parallel component generation
  - Template pre-compilation
  - CDN for static assets
  - Consider using Turborepo for monorepo optimization
- **Performance Improvements**:
  - Implement build caching
  - Use incremental builds where possible
  - Optimize asset loading
  - Lazy load non-critical components
- **Monitoring**:
  - Add performance tracking for each generation step
  - Create dashboard for generation times
  - Set up alerts for slow generations
- **Test Strategy**:
  - Generation time benchmarks
  - Quality assurance
  - Cache effectiveness
  - Parallel processing
  - Error handling
  - Resource usage
- **Priority**: Medium (Performance optimization task)

### 4.7 Timeout Audit [TASKMASTER #23]
**Files**: Search for timeout configurations across codebase
- [ ] Audit all timeout settings in code
- [ ] Remove unnecessary timeouts
- [ ] Optimize necessary timeout values
- **Timeout Optimization Strategy**:
  - Map all timeouts:
    - API request timeouts
    - Portfolio generation timeouts
    - WebSocket connection timeouts
    - Database query timeouts
  - Set appropriate values:
    - API calls: 30s (currently might be too high)
    - Generation: 120s (with progress updates every 5s)
    - Database: 5s for queries, 30s for migrations
  - Implement circuit breakers for external services
  - Add timeout telemetry to identify issues

## 5. Content, Marketing & Design Tasks

### 5.1 Navbar Page Names Update [TASKMASTER #24]
**Files**: `packages/new-renderer/components/navbar.tsx`
- [ ] Update page names in navigation bar
- [ ] Ensure consistency with new site structure
- **Navigation Optimization**:
  - Current → Suggested naming:
    - "Features" → "See Examples" (more action-oriented)
    - "Pricing" → "Get Started" (less sales-y)
    - "Dashboard" → "My Portfolio" (more personal)
  - Add dynamic navbar changes based on user state
  - Consider sticky navbar with progress indicator during scrolling

**Files**: `packages/new-renderer/public/`, `packages/new-renderer/components/navbar.tsx`
- [ ] Design final logo
- [ ] Replace placeholder logos across the site
- **Brand Identity Considerations**:
  - Logo should work in both light/dark modes
  - Create variations: full logo, icon only, wordmark
  - Ensure logo is SVG for scalability
  - Consider animated logo for loading states
  - Design favicon and social media variations

### 5.3 UGC Video Content
**Files**: `packages/new-renderer/components/sections/testimonials-section.tsx`
- [ ] Add more User Generated Content (UGC) videos to testimonials section with focus on success stories from different industries
- [ ] Integrate with existing testimonials section
- **Video Content Strategy**:
  - Target testimonials from different industries:
    - Tech: Software engineers landing FAANG jobs
    - Creative: Designers getting agency positions
    - Business: Consultants winning enterprise clients
    - Healthcare: Medical professionals advancing careers
    - Education: Teachers transitioning to EdTech
  - Ideal length: 30-60 seconds
  - Script template: Problem → Solution → Result
  - Offer incentives: Free premium month for video testimonial
  - Display metrics: "Got hired at Google" or "+300% interview rate"
  - Consider TikTok-style vertical videos for mobile
- **Technical Implementation**:
  - Video hosting options:
    - YouTube/Vimeo embeds (easier, handles bandwidth)
    - Self-hosted with CDN (more control, higher cost)
    - Consider Cloudinary for optimization
  - Lazy loading for performance:
    - Intersection Observer API
    - Load thumbnail first, video on demand
    - Progressive enhancement
  - Fallback images for slow connections
  - Captions/subtitles for accessibility:
    - WebVTT format support
    - Auto-generated captions option
    - Multi-language support
  - Mobile-optimized player:
    - Touch gestures for control
    - Picture-in-picture support
    - Bandwidth-aware quality selection
- **Content Collection Process**:
  - Create submission form:
    - Video upload with size limits (100MB)
    - Basic info: name, company, role
    - Success metrics achieved
    - Consent checkboxes
  - Guidelines for users:
    - Good lighting and audio quality
    - Professional but authentic tone
    - Focus on specific outcomes
    - Include before/after context
  - Release forms/permissions:
    - Rights to use video
    - Editing permissions
    - Attribution preferences
  - Quality standards:
    - Minimum 720p resolution
    - Clear audio without echo
    - Appropriate length (30-60s)
    - No offensive content
- **Test Strategy**:
  - Video loading performance:
    - Time to first frame
    - Buffering frequency
    - CDN effectiveness
  - Mobile playback:
    - iOS/Android compatibility
    - Gesture controls
    - Fullscreen behavior
  - Accessibility features:
    - Caption sync accuracy
    - Keyboard navigation
    - Screen reader compatibility
  - Different video formats:
    - MP4, WebM support
    - Codec compatibility
    - Fallback handling
  - Bandwidth optimization:
    - Adaptive bitrate streaming
    - Quality selection persistence
    - Data usage monitoring
  - User engagement metrics:
    - Play rate
    - Completion rate
    - Conversion impact
- **Priority**: Medium (Social proof enhancement)


### 5.5 Signup Text Improvement [TASKMASTER #27]

### 5.6 Before & After Examples [HIGH PRIORITY]


### 5.7 Additional Portfolio Templates [TASKMASTER #28]


### 5.8 Best Use Cases Definition [TASKMASTER #29]


## 6. Administrative & Operational Tasks

### 6.1 External Developer Task Package
**Files**: Create `docs/external-developer-brief.md`
- [ ] Prepare task package for external portfolio designer
- [ ] Provide JSON structure and all required functionality
- [ ] Document template creation process with inline editing support
- **Comprehensive Developer Brief**:
  - Include full technical specification:
    - JSON schema for CV data structure
    - Component library documentation (Aceternity/Magic UI)
    - Design system guidelines (colors, fonts, spacing)
    - Inline editing requirements:
      - All text elements must be contentEditable
      - Image elements need drag-drop replacement
      - Hover states to indicate editable areas
      - Support for rich text formatting toolbar
    - Responsive breakpoints requirements
    - Performance targets (Lighthouse scores)
  - Provide starter template with inline editing examples
  - Create video walkthrough of template creation
  - Set up sandbox environment for testing
  - Include QA checklist for deliverables

### 6.2 Remove Overview Page
**Files**: `packages/new-renderer/app/dashboard/overview/`
- [ ] Delete Overview page from Dashboard
- [ ] Update navigation to remove references
- [ ] Redirect to My Website page
- **Detailed Implementation Tasks**:
  - Delete entire `packages/new-renderer/app/dashboard/overview/` directory
  - Update navigation in `packages/new-renderer/app/dashboard/layout.tsx`
  - Remove any router references to overview in navigation components
  - Update any imports that reference overview components
  - Redirect any existing links to My Website page (`/dashboard/my-website`)
  - Check for orphaned components used only by overview
  - Remove overview-specific API endpoints if any exist
  - Update documentation to reflect removal
  - Clean up any overview-related state management
- **Test Strategy**:
  - Ensure no 404 errors when accessing old overview routes
  - Verify redirects work properly to My Website page
  - Check that navigation flows correctly without overview option
  - Ensure clean git diff with no leftover references
  - Test for no console errors after removal
- **Priority**: Low (Cleanup task)

### 6.3 Best Practice Settings [TASKMASTER #30]
**Files**: `packages/new-renderer/app/dashboard/settings/`
- [ ] Build best practice settings button and page
- [ ] Delete account details page after implementing settings
- [ ] Migrate necessary account functionality
- **Settings Page Features**:
  - Portfolio best practices checklist
  - SEO optimization tips
  - Content guidelines for each section
  - Industry-specific recommendations
  - Quick actions: "Optimize for ATS", "Enhance for Recruiters"
  - Export/Import settings functionality
  - Privacy controls and data management

## 7. User Access & Authentication Tasks

### 7.1 Login Prompt on Portfolio Scroll [TASKMASTER #31]
**Files**: `packages/new-renderer/components/portfolio-preview.tsx`
- [ ] Trigger login prompt when unsigned users try to scroll in Mac component
- [ ] Implement scroll detection and modal trigger
- **Smart Engagement Trigger**:
  - Detect scroll attempt after 3 seconds of viewing
  - Show teaser: "See the full interactive version"
  - Implement smooth scroll lock with overlay
  - Add "Continue as Guest" option with limitations
  - Track conversion metrics from scroll-triggered signups

### 7.2 Dashboard Subscription Gate [TASKMASTER #32]
**Files**: `packages/new-renderer/app/dashboard/layout.tsx`, `src/api/dependencies.py`
- [ ] Restrict dashboard access to subscribed users only
- [ ] Implement subscription check middleware
- **Subscription Management Flow**:
  - Free tier: View-only access to generated portfolio
  - Paid tiers: Full dashboard access
  - Grace period: 3 days after subscription expires
  - Clear messaging: "Upgrade to edit your portfolio"
  - Implement granular feature gating
  - Add subscription status to user context

### 7.3 Additional Signup Methods [TASKMASTER #33]
**Files**: `packages/new-renderer/components/signup-modal.tsx`, `src/api/routes/auth.py`
- [ ] Add LinkedIn OAuth integration
- [ ] Add Facebook OAuth integration
- [ ] Follow existing Google OAuth pattern
- **OAuth Implementation Strategy**:
  - LinkedIn priority (professional network alignment)
  - Auto-import profile data from LinkedIn
  - Facebook for broader reach
  - Consider GitHub OAuth for developers
  - Implement account linking for existing users
  - Add "Import from LinkedIn" feature post-signup

### 7.4 Signup Modal Default State [TASKMASTER #34]
**Files**: `packages/new-renderer/components/signup-modal.tsx`
- [ ] Set default state to "Sign Up" instead of "Log In"
- [ ] Update initial state configuration
- **UX Optimization**:
  - "Sign Up" emphasizes new user acquisition
  - Add subtle "Already have an account?" link
  - Implement smart detection: show login if returning user
  - A/B test impact on conversion rates

### 7.5 Homepage Mac UI Replacement After Dashboard Access [TASKMASTER #35]
**Files**: `packages/new-renderer/app/page.tsx`, `packages/new-renderer/components/navbar.tsx`
- [ ] After first dashboard visit, replace Mac UI with large "Edit My Portfolio" button on homepage
- [ ] Remove Dashboard button from Navbar after implementation
- [ ] Button takes user directly to My Website page where they can edit inline
- **Progressive UI Changes**:
  - Use localStorage to track dashboard visits
  - Smooth transition animation from Mac UI to button
  - Button design: Large, centered, with live portfolio preview thumbnail
  - Show editing hints: "Click to edit your portfolio directly"
  - Add quick stats: "Your portfolio has 23 views this week"
  - Consider showing recent activity or notifications

## 8. Analytics & Performance Monitoring (New Section)

### 8.1 Comprehensive Analytics Implementation
**Files**: Create `src/services/analytics.py`, integrate with frontend
- [ ] Implement event tracking for all key user actions
- [ ] Set up conversion funnel analysis
- [ ] Add performance monitoring
- **Key Metrics to Track**:
  - Conversion funnel: Upload → Sign Up → Subscribe → Retain
  - Feature usage: Which components/templates are most used
  - Time to value: How long until users complete portfolio
  - Engagement: Edit frequency, preview views, shares
  - Technical: Generation time, error rates, API latency
  - A/B test results for all UI changes

### 8.2 Business Intelligence Dashboard [TASKMASTER #36]
**Files**: Create internal dashboard for metrics
- [ ] Real-time user activity monitoring
- [ ] Revenue metrics and projections
- [ ] User cohort analysis
- **Dashboard Components**:
  - Daily active users and growth trends
  - Revenue per user (ARPU) by tier
  - Churn prediction and prevention alerts
  - Template popularity rankings
  - Geographic distribution of users
  - Support ticket trends and resolution time

## 9. Critical Code Quality & Infrastructure Tasks (Based on Code Review 2025-07-20)

### 9.1 Fix Broken Test Suite
**Files**: `tests/`, `pytest.ini`
- [ ] Fix 38 `ModuleNotFoundError` failures preventing PyTest from collecting tests
- [ ] Add `pytest.ini` with `norecursedirs = legacy` to exclude old test directories
- [ ] Rewrite or delete tests that depend on removed namespaces (`services.local.*`, `backend.schemas.*`)
- [ ] Add missing dependencies (`aiohttp`, `pypdf`) to `requirements.txt` if tests are kept
- **Impact**: Currently no CI/CD safety net - tests must pass before production deployment
- **Elaboration**: A broken test suite is a critical blocker for reliable deployments. Without working tests, we're flying blind. This should be the highest priority technical debt item.

### 9.2 Remove Duplicate Method Definitions
**Files**: `src/core/local/text_extractor.py`
- [ ] Remove duplicate `_extract_with_ocr` method (defined at lines ~200 and ~335)
- [ ] Keep the more complete second version
- **Impact**: First version is silently overwritten; maintainers may patch the wrong copy
- **Elaboration**: This is a simple fix but important for code maintainability. Duplicate methods create confusion and potential bugs.

### 9.3 Eliminate sys.path Hacks
**Files**: `src/api/routes/cv.py`, `src/api/routes/cv_enhanced.py`, `src/core/local/data_extractor.py`
- [ ] Remove all `sys.path.append(...)` statements
- [ ] Fix imports to use proper `src.` prefix
- [ ] Move `load_dotenv()` to top of files before any imports
- **Impact**: Masks real import errors; breaks tooling & production packaging
- **Elaboration**: These hacks are technical debt that will bite us during deployment. Proper Python packaging is essential for maintainability.

### 9.4 Fix SQLite Concurrency Issues
**Files**: `src/api/db.py`
- [ ] Implement proper SQLite configuration for concurrent access:
  ```python
  conn = sqlite3.connect(DB_PATH, timeout=30, isolation_level=None)
  conn.execute("PRAGMA journal_mode=WAL")
  conn.execute("PRAGMA busy_timeout=30000")
  ```
- [ ] Add retry logic for "database is locked" errors
- [ ] Consider migration to PostgreSQL for production
- **Impact**: Under ASGI with concurrent writes, users will see "database is locked" errors
- **Elaboration**: SQLite's default locking is insufficient for web applications. WAL mode and proper timeouts are essential for reliability.

### 9.5 Secure Admin Role Check
**Files**: `src/api/routes/auth.py`
- [ ] Fix `require_admin()` function that always returns 200 in production
- [ ] Implement proper role checking or raise 403 for non-development environments
- [ ] Remove TODO and implement actual admin verification
- **Impact**: CRITICAL - Privilege escalation vulnerability allowing any user admin access
- **Elaboration**: This is a severe security vulnerability. Until a proper role system exists, we must fail closed (deny access) not open.

### 9.6 Fix Portfolio Generation Infrastructure
**Files**: `src/api/routes/portfolio_generator.py`, `src/services/nextjs_server_manager.py`
- [ ] Replace `next dev` with `next build && next start` for production portfolios
- [ ] Fix missing `node_modules` by running `pnpm install` after template copy
- [ ] Fix health check endpoint (Next.js returns 404 on root until pages exist)
- [ ] Implement proper stream reading to prevent buffer deadlocks
- **Impact**: High memory/CPU usage, portfolio generation crashes on first run
- **Elaboration**: Using development server in production is wasteful. Missing dependencies cause immediate failures. These are showstoppers for portfolio generation.

### 9.7 Fix SSE Memory Leaks
**Files**: `src/api/routes/workflows.py`, `src/api/routes/sse.py`
- [ ] Add `rate_limiter.remove_connection()` in finally blocks
- [ ] Replace placeholder SSE events with actual progress updates
- [ ] Ensure SSE streams close properly when done
- **Impact**: Memory leaks will eventually crash the server
- **Elaboration**: Long-lived SSE connections without cleanup will exhaust server resources. This is critical for production stability.

### 9.8 Implement File Cleanup System
**Files**: Create `src/services/cleanup_service.py`
- [ ] Create automated cleanup for expired uploads (24-48 hours)
- [ ] Implement database cleanup for stale sessions and cache entries
- [ ] Use APScheduler or Celery Beat for scheduled tasks
- [ ] Add monitoring for disk usage
- **Impact**: Without cleanup, disk will fill and crash the application
- **Elaboration**: File uploads without cleanup are a ticking time bomb. We need automated housekeeping before production.

### 9.9 Fix Frontend Production Configuration
**Files**: `packages/new-renderer/lib/api.ts`, `packages/new-renderer/components/pricing-modal.tsx`
- [ ] Require `NEXT_PUBLIC_API_URL` environment variable at build time
- [ ] Disable non-functional payment buttons until backend is ready
- [ ] Add proper error handling for missing environment variables
- **Impact**: Production builds will point to localhost; payment flow shows but doesn't work
- **Elaboration**: Hardcoded localhost URLs and non-functional payment UI create terrible user experience in production.

### 9.10 Update Documentation Accuracy
**Files**: `CLAUDE.md`, `docs/architecture/PROJECT_STRUCTURE.md`
- [ ] Fix incorrect paths and outdated information in CLAUDE.md
- [ ] Merge duplicate project structure documentation
- [ ] Remove or update references to non-existent files (e.g., `./quickstart.sh`)
- [ ] Update component counts and remove deleted features
- [ ] Consider removing 18MB of third-party docs in `docs/anthropic_docs/`
- **Impact**: Incorrect documentation wastes developer time and causes confusion
- **Elaboration**: Documentation drift is inevitable but must be managed. Accurate docs are essential for team productivity.

### 9.11 Establish CI/CD Pipeline
**Files**: Create `.github/workflows/ci.yml`
- [ ] Set up GitHub Actions for automated testing
- [ ] Run linting (ruff for Python, ESLint for TypeScript)
- [ ] Run type checking (`pnpm run typecheck`)
- [ ] Run tests once test suite is fixed
- [ ] Block merges if CI fails
- **Impact**: Without CI/CD, broken code reaches production
- **Elaboration**: Automated quality gates are non-negotiable for production systems. This prevents regression and maintains code quality.

### 9.12 Quick Win Security Audit
**Files**: Various
- [ ] Replace `PyPDF2` with `pypdf` (security patches)
- [ ] Pin `passlib` bcrypt rounds to a constant value
- [ ] Add rate limiting to all public endpoints
- [ ] Implement CSRF protection
- [ ] Add security headers (CSP, HSTS, etc.)
- **Impact**: Various security vulnerabilities
- **Elaboration**: These are low-effort, high-impact security improvements that should be done before any production deployment.

## 10. Analytics & Data-Driven Decision Making

### 10.1 Comprehensive Analytics Implementation [MEDIUM PRIORITY]
**Files**: `src/services/analytics.py` (to be created), frontend components
- [ ] Create analytics service with event tracking for all key user actions
- [ ] Track conversion funnel: Upload → Sign Up → Subscribe → Retain
- [ ] Monitor feature usage: Which components/templates are most used
- [ ] Measure time to value: How long until users complete portfolio
- [ ] Track engagement: Edit frequency, preview views, shares
- [ ] Monitor technical metrics: Generation time, error rates, API latency
- [ ] Implement A/B test tracking for all UI changes
- **Analytics Infrastructure**:
  - Event tracking with structured data
  - User journey mapping
  - Session recording (privacy-compliant)
  - Heatmap tracking for UI optimization
  - Custom dashboards for key metrics
- **Integration Points**:
  - Frontend event tracking
  - Backend API metrics
  - Portfolio generation analytics
  - Payment flow tracking
  - Error monitoring
- **Test Strategy**:
  - Event firing accuracy
  - Data integrity
  - Performance impact
  - Privacy compliance
  - Dashboard accuracy
  - Real-time updates
- **Impact**: Without analytics, we're flying blind - can't optimize conversion, identify drop-off points, or make data-driven decisions
- **Elaboration**: This is crucial for understanding user behavior, optimizing the product, and maximizing revenue. Should integrate with existing SSE infrastructure for real-time tracking.

---

## TaskMaster Task Summary

### Total Tasks: 31 TaskMaster tasks + Additional strategic tasks
### Task Distribution by Priority:
- **High Priority**: 12 tasks
- **Medium Priority**: 19 tasks

### Key Task Dependencies:
- Task #7 (Homepage Headlines) blocks multiple other tasks
- Critical path: #7 → #8 → #9 → #10 → #11
- Payment flow depends on #16 (Stripe Integration)
- Many UI/UX tasks depend on #11 (Dashboard Welcome)

### TaskMaster Integration:
All tasks with [TASKMASTER #XX] references are tracked in the TaskMaster AI system with:
- Detailed implementation plans
- Test strategies
- Dependency management
- Progress tracking

### Additional Notes:
- Inline editing approach has been integrated throughout all relevant tasks
- Critical code quality tasks from code review (Section 9) should be prioritized before production
- All TaskMaster tasks are currently in "pending" status

---

*Last updated: 2025-01-21*
*Aligned with RESUME2WEBSITE V4 project structure and codebase*
*Enhanced with performance, analytics, strategic considerations, and critical code quality fixes*
*Integrated with TaskMaster AI task management system*