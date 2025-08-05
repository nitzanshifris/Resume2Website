# CV2WEB Documentation Hub

Transform CVs into stunning portfolio websites using AI-powered extraction and modern UI components.

## 📚 Documentation Structure

### Getting Started
- **[Main README](../README.md)** - Project overview and setup
- **[CLAUDE.md](../CLAUDE.md)** - Comprehensive development guide
- **[API Documentation](api/api.md)** - API endpoints reference
- **[Current Pipeline](api/CURRENT_PIPELINE.md)** - System architecture

### Implementation Guides
- **[CV Editor Implementation](CV_EDITOR_IMPLEMENTATION.md)** - CV editing system
- **[TaskMaster Guide](taskmaster/TASKMASTER_GUIDE.md)** - Task management system
- **[Component Selection Guide](guides/COMPONENT_SELECTION_GUIDE.md)** - UI component usage

### Architecture
- **[Project Structure](architecture/PROJECT_STRUCTURE.md)** - Current codebase organization
- **[Portfolio Template Integration](architecture/portfolio_template_integration.md)** - Template system
- **[CV Component Analysis](architecture/cv_component_analysis.md)** - Data structure analysis

## 🚀 Current State (January 2025)

### ✅ What's Working
- **Complete Pipeline**: CV Upload → AI Extraction → CV Editor → Portfolio Generation → Deploy
- **AI Extraction**: Claude 4 Opus ONLY (temperature 0.0 for determinism)
- **18 CV Sections**: Comprehensive data extraction with advanced classification
- **Portfolio Generation**: Isolated sandbox environments with real-time preview
- **Authentication**: Email/password and Google OAuth
- **File Management**: Original file preservation and secure download
- **Template System**: Multiple portfolio templates with data adapters

### 🎯 Quick Commands

```bash
# Frontend development
pnpm run dev            # Start Next.js (http://localhost:3000)
pnpm run typecheck      # TypeScript checking
pnpm run build          # Production build

# Backend development  
source venv/bin/activate                     # Python environment
uvicorn main:app --reload --port 2000       # Start FastAPI
python3 main.py                              # Alternative start
```

## 📊 System Overview

```
User Upload → File Validation → Claude 4 Opus Extraction → CV Editor → 
Portfolio Expert (AI Guidance) → Template Selection → Sandbox Generation → Preview → Deploy
```

### Key Technologies
- **Backend**: FastAPI, Python 3.11+, SQLite
- **AI**: Claude 4 Opus ONLY (deterministic extraction)
- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS v4
- **UI Libraries**: Aceternity UI, Magic UI (~80 animated components)
- **Package Manager**: pnpm (main project), npm (sandboxes only)
- **Infrastructure**: Vercel deployment, isolated sandboxes

## 🔧 Development Setup

1. **Clone and setup**:
   ```bash
   git clone <repo-url> && cd CV2WEB-V4
   ./quickstart.sh  # If available, or follow manual steps below
   ```

2. **Install dependencies**:
   ```bash
   # Python backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   
   # Frontend
   pnpm install
   ```

3. **Configure credentials**:
   ```bash
   python3 src/utils/setup_keychain.py
   ```

4. **Start development servers**:
   ```bash
   # Terminal 1: Backend
   python3 main.py
   
   # Terminal 2: Frontend
   pnpm run dev
   ```

## 📁 Project Structure

```
CV2WEB-V4/
├── src/                    # Backend (FastAPI)
│   ├── api/               # API routes
│   ├── core/              # Business logic
│   ├── services/          # Services (Claude expert, etc.)
│   └── templates/         # Portfolio templates
├── user_web_example/      # Frontend (Next.js)
│   ├── app/              # App router
│   └── components/       # React components
├── components/            # Shared UI libraries
│   ├── aceternity/       # Aceternity components
│   └── magicui/         # Magic UI components
├── data/                 # Storage
│   ├── uploads/         # User files
│   ├── generated_portfolios/
│   └── cv_examples/     # Test CVs
├── sandboxes/           # Isolated environments
└── docs/                # Documentation
```

## 🐛 Known Issues & Solutions

| Issue | Solution |
|-------|----------|
| CSS not loading | Ensure postcss.config.mjs includes both tailwindcss AND autoprefixer |
| PDF not displaying | CSP headers configured, blob: URLs supported |
| TypeScript errors | Run `pnpm run typecheck` before committing |
| Portfolio generation fails | Check Node.js available, ports 4000+ free |

## 🤝 Contributing

### Git Workflow
1. **NEVER** work on main branch
2. Create feature branch: `git checkout -b feature/description`
3. Run `pnpm run typecheck` before committing
4. Get approval before pushing

### Priority Areas
1. Payment system implementation
2. Portfolio Expert UI integration
3. Enhanced template selection
4. Performance optimization

## 📞 Support

- **Issues**: Use GitHub Issues for bugs
- **Docs**: Check CLAUDE.md for detailed guidance
- **Examples**: See data/cv_examples/ for test files
- **Help**: /help command in Claude Code