# RESUME2WEBSITE V4 - AI-Powered CV to Portfolio Platform

Transform your CV into a stunning portfolio website using Claude 4 Opus AI and modern web technologies.

## 🚀 Current State (Updated: 2025-01-08)

### ✅ Production Features
- **Complete Pipeline**: Upload CV → AI Extraction → Portfolio Preview → Optional Deployment
- **AI-Powered**: Claude 4 Opus (temperature 0.0) for deterministic 15-section extraction
- **Two-Stage Process**: Preview locally first, then optionally deploy to Vercel
- **Authentication**: Email/password + Google OAuth + LinkedIn OAuth
- **Payment Integration**: Stripe Embedded Checkout for premium features
- **Anonymous Flow**: Try before signup with smart validation
- **Portfolio Persistence**: Automatic restoration on login/refresh
- **Real-time Updates**: SSE for live progress tracking
- **Advanced Monitoring**: Metrics, workflows, and circuit breaker patterns

### 🎯 Quick Start

```bash
# Prerequisites
node >= 18.0.0
python >= 3.11
pnpm >= 8.0.0

# Setup
git clone <repo> && cd Resume2Website-V4
pnpm install                           # Frontend dependencies
python3 -m venv venv                   # Create Python environment
source venv/bin/activate               # Activate environment
pip install -r requirements.txt       # Backend dependencies
python3 src/utils/setup_keychain.py   # Setup API keys securely

# Run Development
# Terminal 1 - Backend
source venv/bin/activate
python3 -m uvicorn main:app --host 127.0.0.1 --port 2000

# Terminal 2 - Frontend  
pnpm run dev

# Visit http://localhost:3019
```

## 🏗️ Architecture

```
Resume2Website-V4/
├── src/                          # Backend (FastAPI)
│   ├── api/                     # API routes
│   │   ├── routes/             # Endpoints
│   │   │   ├── cv.py          # CV operations
│   │   │   ├── portfolio_generator.py # Portfolio creation
│   │   │   ├── user_auth.py  # OAuth authentication
│   │   │   ├── payments.py   # Stripe integration
│   │   │   ├── metrics.py    # Real-time metrics
│   │   │   ├── workflows.py  # Orchestration
│   │   │   └── sse.py       # Server-sent events
│   │   └── db.py             # SQLite operations
│   ├── core/                  # Business logic
│   │   ├── cv_extraction/    # AI extraction
│   │   └── schemas/          # Data models
│   ├── services/              # Business services
│   └── templates/             # Portfolio templates
│       └── official_template_v1/ # Active template
├── user_web_example/            # Frontend (Next.js)
│   ├── app/                   # App router
│   ├── components/            # React components
│   └── lib/                   # Utilities
├── data/                        # Storage
│   ├── uploads/              # User files
│   └── resume2website.db     # SQLite database
├── sandboxes/                   # Portfolio environments
├── scripts/                     # Utility scripts
│   ├── utilities/            # Database tools
│   └── testing/              # Test scripts
└── .claude/                     # Claude Code agents
    └── agents/               # Custom agents
```

## 🎨 Key Features

### CV Processing
- **15 Sections**: Hero, Contact, Summary, Experience, Education, Skills, Projects, Achievements, Certifications, Languages, Volunteer, Publications, Speaking, Courses, Hobbies
- **Smart Validation**: Resume Gate with image-specific rules
- **File Support**: PDF, DOCX, TXT, MD, Images (JPG, PNG)
- **Caching**: Hash-based deduplication, confidence scoring (>0.75)

### Portfolio Generation
- **Two-Stage Process**:
  1. **Preview**: Instant local preview (ports 4000-5000)
  2. **Deploy**: Optional Vercel deployment after payment
- **Template**: official_template_v1 with Tailwind CSS v4
- **Customization**: Drag-drop sections, theme selection
- **Resource Limits**: Max 20 portfolios, 512MB each, 24h cleanup

### Advanced Systems
- **SSE**: 9 endpoints for real-time updates
- **Workflows**: 9 endpoints for orchestration
- **Metrics**: 8 endpoints for monitoring
- **Circuit Breaker**: Exponential backoff (30s, 60s, 120s...)
- **Rate Limiting**: User and endpoint specific

## 📊 API Endpoints

### Core Operations
```
POST /api/v1/upload                      # Upload CV (authenticated)
POST /api/v1/upload-anonymous            # Upload CV (validation only)
POST /api/v1/extract/{job_id}           # Extract CV data
GET  /api/v1/cv/{job_id}                # Get CV data
PUT  /api/v1/cv/{job_id}                # Update CV data
POST /api/v1/portfolio/generate/{job_id} # Generate preview
POST /api/v1/portfolio/deploy/{job_id}   # Deploy to Vercel
```

### Authentication
```
POST /api/v1/auth/register              # Register user
POST /api/v1/auth/login                 # Login
POST /api/v1/auth/google/callback       # Google OAuth
POST /api/v1/auth/linkedin/callback     # LinkedIn OAuth
```

### Payments
```
POST /api/v1/payments/create-checkout-session # Create Stripe session
GET  /api/v1/payments/session-status/{id}     # Check payment status
```

## 🧪 Testing

```bash
# Backend tests
pytest                                          # All tests
python3 tests/unit/run_unit_tests.py          # Unit tests
python3 tests/unit/test_cv_helpers_isolated.py # Isolated tests

# Frontend validation
pnpm run typecheck                            # TypeScript check
pnpm run build                               # Production build

# CV extraction testing
python3 scripts/testing/extract_cv_to_json.py <pdf_file>

# Database utilities
python3 scripts/utilities/clear_cv_cache.py        # Clear cache
python3 scripts/utilities/force_reextraction.py    # Force re-extraction
```

## 📈 Performance

- **Text Extraction**: <1 second for PDFs
- **AI Processing**: 60-90 seconds with Claude 4 Opus
- **Portfolio Generation**: 30-60 seconds
- **Preview Available**: Instantly on port 4000
- **Deployment**: 2-3 minutes to Vercel

## 🛠️ Development

### Commands
```bash
pnpm run dev        # Frontend dev server
pnpm run typecheck  # TypeScript validation
pnpm run build      # Production build

# Backend with auto-reload
python3 main.py

# Clean build artifacts
.claude/commands/cleanup.sh
```

### Environment Variables
Create `.env` file:
```
# Required
CV_CLAUDE_API_KEY=your_key_here

# Optional
DATABASE_PATH=data/resume2website.db
SESSION_EXPIRY_DAYS=7
PORTFOLIO_START_PORT=4000
PORTFOLIO_END_PORT=5000
```

## 🚀 Deployment

### Production Access
- **Main Site**: https://resume2website.com
- **Protected**: Requires secret key in URL
- **Cookie Auth**: Valid for 7 days after first access

### Portfolio Deployment
- **Automatic**: Deploys to Vercel after payment
- **Custom Domain**: `https://john-doe.portfolios.resume2website.com`
- **Iframe Support**: Automatic configuration

## 🤝 Contributing

### Priority Areas
1. **Security**: OAuth improvements, rate limiting
2. **Templates**: New portfolio designs
3. **AI Accuracy**: Extraction prompt refinement
4. **Testing**: Expand test coverage
5. **Documentation**: API documentation

### Development Guidelines
- **TypeScript**: Arrow functions, absolute imports
- **Python**: Type hints, PEP 8, absolute imports
- **Git**: Feature branches only, never commit to main
- **Testing**: Run typecheck before commits

## 📄 License

MIT License - see [LICENSE](LICENSE) file

## 🙏 Credits

- [Anthropic Claude 4 Opus](https://anthropic.com) - AI extraction engine
- [Aceternity UI](https://ui.aceternity.com/) - Component library
- [Magic UI](https://magicui.design/) - Animation components
- [Next.js](https://nextjs.org/) - React framework
- [FastAPI](https://fastapi.tiangolo.com/) - Python backend
- [Vercel](https://vercel.com/) - Deployment platform

---

For detailed documentation, see `/CLAUDE.md` and `/docs/`