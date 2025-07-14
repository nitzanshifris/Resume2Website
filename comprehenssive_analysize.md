  1. Overall Structure and Organization

  Current CLAUDE.md (CV2WEB):
  - Starts with "Quick Setup" immediately
  - Mixes critical warnings (IMPORTANT sections) throughout the document
  - Less hierarchical organization - jumps between topics
  - No clear separation of concerns (development vs deployment vs troubleshooting)

  Professional Example (WooCash):
  - Begins with clear project overview and purpose
  - Groups related content into well-defined sections
  - Uses progressive disclosure (overview → details)
  - Clear separation between different workflows (development, testing, deployment)

  Claude-code-main insights:
  - Emphasizes systematic project understanding
  - Prioritizes documentation hierarchy (README → PLANNING → TASK)
  - Focuses on knowledge validation before action

  2. Section Headings and Subheadings

  Current CLAUDE.md:
  - Uses mix of heading levels inconsistently
  - Multiple "IMPORTANT" sections scattered throughout
  - Some headings are too generic ("Common Tasks & Examples")

  Professional Example:
  - Consistent 2-3 level heading hierarchy
  - Descriptive, action-oriented headings ("Essential Commands", "Git Workflow", "Architecture Overview")
  - Clear visual hierarchy with ### for subsections

  3. Formatting of Code Snippets, Commands, and Examples

  Current CLAUDE.md:
  ./quickstart.sh                         # One-command setup (recommended)
  - Basic inline comments
  - Less context for commands
  - Mixing different types of commands in same block

  Professional Example:
  # 1. Create and switch to new branch for this session
  git checkout -b feature/task-[task-number]-[brief-description]
  # Example: git checkout -b feature/task-13-rename-package-json
  - Numbered steps within code blocks
  - Clear examples after generic commands
  - Separates command types into different blocks

  4. Use of Markdown Features

  Current CLAUDE.md:
  - Basic tables for gotchas
  - Limited use of visual separators
  - Inconsistent bullet point usage

  Professional Example:
  - Extensive use of visual elements (✅/❌ for correct/incorrect examples)
  - Well-structured SQL and TypeScript code blocks with syntax highlighting
  - Detailed documentation templates in markdown
  - Visual flow diagrams using ASCII art

  5. Clarity and Conciseness of Information

  Current CLAUDE.md:
  - Information density is high but scattered
  - Critical information mixed with less important details
  - Some redundancy in command explanations

  Professional Example:
  - Information is layered (overview → specifics)
  - Critical security and workflow information prominently placed
  - Each section has a clear purpose and scope
  - Uses "CRITICAL" sparingly for true must-knows

  1. Restructure with Clear Information Hierarchy
    - Move all critical setup requirements to a dedicated "Prerequisites & Setup" section
    - Create a proper project overview section that explains what CV2WEB does
    - Group all IMPORTANT warnings into relevant sections rather than scattering them
  2. Improve Section Organization
    - Create clear workflow-based sections: Development, Testing, Deployment, Troubleshooting
    - Move TaskMaster documentation to its own major section
    - Consolidate all command references into categorized subsections
  3. Enhance Code Examples
    - Add numbered steps within code blocks for multi-step processes
    - Include actual examples after generic command patterns
    - Use ✅/❌ notation for correct/incorrect code patterns
  4. Add Visual Documentation
    - Create ASCII flow diagrams for the CV extraction → portfolio generation pipeline
    - Add visual separators between major sections
    - Use consistent emoji/symbols for different types of information (⚠️ warnings, 💡 tips, 🚀 quick starts)
  5. Implement Progressive Disclosure
    - Start with a quick "Getting Started" that covers 80% use case
    - Move detailed explanations to dedicated sections
    - Use collapsible sections for advanced topics
  6. Standardize Command Documentation
    - Group commands by workflow (development, testing, deployment)
    - Always show the command, then explain what it does, then show expected output
    - Separate one-time setup commands from daily workflow commands
  7. Add Practical Workflows
    - Create step-by-step guides for common tasks (like the Git Workflow in the example)
    - Include troubleshooting decision trees
    - Add "Day in the Life" developer workflow examples

  Project Overview

  CV2WEB is an AI-powered CV to portfolio website converter that transforms resumes into stunning portfolio websites
   using FastAPI (Python) backend and Next.js (TypeScript) frontend in a pnpm monorepo.

  What CV2WEB Does

  - Extracts CV data using Google Gemini 2.5 Flash AI
  - Generates beautiful portfolio websites with 100+ animated components
  - Deploys to Vercel with one click
  - Supports multiple file formats (PDF, DOCX, images, etc.)

  Tech Stack at a Glance

  - Backend: FastAPI + Python 3.11+ with TypeORM
  - Frontend: Next.js 15 + TypeScript + Tailwind CSS v4
  - AI Services: Gemini, Claude, OpenAI, AWS Textract
  - UI Libraries: Aceternity UI, Magic UI (100+ components)
  - Infrastructure: Vercel, Railway, PostgreSQL

  🚀 Quick Start

  Prerequisites

  # Required tools
  node >= 18.0.0          # For frontend
  python >= 3.11          # For backend
  pnpm >= 8.0.0          # Package manager (NOT npm/yarn)
  git                    # Version control

  One-Command Setup

  # Clone and setup everything
  git clone <repo-url> && cd CV2WEB-V4
  ./quickstart.sh

  # This script will:
  # 1. Install all dependencies
  # 2. Setup Python virtual environment
  # 3. Configure environment variables
  # 4. Initialize database
  # 5. Start development servers

  📋 Development Workflow

  Daily Development Commands

  # Frontend development
  pnpm run dev            # Start Next.js dev server (http://localhost:3000)
  pnpm run typecheck      # ⚠️ MUST run before committing
  pnpm run build          # Build for production

  # Backend development
  source venv/bin/activate                     # Activate Python environment
  uvicorn main:app --reload --port 2000       # Start FastAPI (http://localhost:2000)
  python main.py                               # Alternative start method

  Git Workflow

  # 1. Start new feature
  git checkout -b feature/description

  # 2. Make changes and verify
  pnpm run typecheck      # No TypeScript errors
  pytest                  # Backend tests pass

  # 3. Commit with conventional format
  git add .
  git commit -m "feat: add new portfolio template"
  # Commit types: feat|fix|docs|style|refactor|test|chore

  # 4. Push and create PR
  git push origin feature/description
  gh pr create --title "feat: description" --body "Closes #123"

  🏗️ Architecture

  Project Structure

  CV2WEB-V4/
  ├── src/                    # Backend (FastAPI)
  │   ├── api/               # API routes and endpoints
  │   ├── core/              # Business logic
  │   │   ├── cv_extractors/ # AI-powered CV parsing
  │   │   ├── generators/    # Portfolio generation
  │   │   └── schemas/       # Data models
  │   └── templates/         # Portfolio templates
  ├── packages/
  │   └── new-renderer/      # Frontend (Next.js)
  ├── components/            # Shared UI components
  │   ├── aceternity/        # Premium animations
  │   └── magicui/          # Magic UI library
  ├── tests/                 # Test suites
  └── .taskmaster/          # AI task management

  Data Flow

  User Upload → File Validation → AI Extraction → Portfolio Generation → Preview → Deploy
       ↓              ↓                ↓                  ↓                ↓        ↓
     (FastAPI)    (Security)    (Gemini 2.5)      (Templates)        (Next.js) (Vercel)

  ⚙️ Configuration

  Environment Setup

  # Backend configuration (config.py)
  BACKEND_PORT = 2000             # ⚠️ Not 8000!
  MAX_UPLOAD_SIZE = 10 * 1024 * 1024  # 10MB
  ALLOWED_ORIGINS = ["http://localhost:3000", "http://localhost:3001"]

  # AI Models
  GEMINI_MODEL = "gemini-2.5-flash"
  CLAUDE_MODEL = "claude-3-5-sonnet-20241022"

  Credential Management

  # ⚠️ NEVER commit API keys! Use keychain manager:
  python src/utils/setup_keychain.py

  # This securely stores:
  # - Google Cloud credentials
  # - Anthropic API keys
  # - OpenAI API keys
  # - AWS credentials

  🤖 TaskMaster Integration

  TaskMaster AI helps break down complex features into manageable tasks.

  Automatic Workflow Triggers

  When you say any of these, TaskMaster activates automatically:
  - "add [feature]" / "implement [feature]" / "create [feature]"
  - "build [component/system]" / "develop [functionality]"
  - "I want to [do something]" / "help me [build/create/add]"

  TaskMaster Commands

  # View available tasks
  taskmaster list --status=pending

  # Get next task
  taskmaster next

  # Complete a task
  taskmaster set-status --id=<task-id> --status=done

  # Break down complex tasks
  taskmaster expand --id=<task-id>

  # Research best practices
  taskmaster research "Next.js 15 patterns"

  Custom Slash Commands

  Use these in Claude Code chat:
  - /task:new <feature> - Start new feature with PRD
  - /task:next - Get next task to work on
  - /task:status - View project progress
  - /task:implement <id> - Start implementing specific task

  🛠️ Common Development Tasks

  Adding a New Portfolio Template

  // 1. Create template component
  // src/templates/portfolio-templates/modern-minimal.tsx
  export const ModernMinimalTemplate: React.FC<PortfolioProps> = ({ data }) => {
    // Template implementation
  }

  // 2. Register in generator
  // src/core/generators/portfolio_generator.py
  TEMPLATES = {
      "modern-minimal": ModernMinimalTemplate,
      // ... other templates
  }

  // 3. Add preview
  // packages/new-renderer/app/templates/[id]/page.tsx

  Adding a New API Endpoint

  # 1. Create route file
  # src/api/routes/analytics.py
  from fastapi import APIRouter, Depends
  router = APIRouter(prefix="/analytics", tags=["analytics"])

  @router.get("/usage")
  async def get_usage_stats():
      return {"total_cvs": 1234}

  # 2. Register in main.py
  app.include_router(analytics.router)

  # 3. Test the endpoint
  # http://localhost:2000/docs

  🐛 Troubleshooting

  Common Issues & Solutions

  | Issue                      | Solution                                      |
  |----------------------------|-----------------------------------------------|
  | "Cannot find module"       | Run pnpm install in project root              |
  | TypeScript errors          | Run pnpm run typecheck to see all errors      |
  | "Port 2000 already in use" | Kill existing process: `lsof -ti:2000         |
  | Import errors              | Ensure using src/ prefix for absolute imports |
  | CV extraction fails        | Check Gemini API quota and credentials        |

  Debug Commands

  # Check service status
  curl http://localhost:2000/health    # Backend health
  curl http://localhost:3000/api/health # Frontend health

  # View logs
  docker logs cv2web-backend -f        # Backend logs
  pnpm run dev --verbose               # Frontend verbose logs

  # Database issues
  python src/utils/init_db.py          # Reinitialize database

  📚 Code Style Guide

  TypeScript/React

  // ✅ CORRECT
  import { useEffect } from 'react'
  export const ProfileCard: React.FC<Props> = ({ user }) => {
    const [isLoading, setIsLoading] = useState(false)
    // Component logic
  }

  // ❌ INCORRECT
  const profileCard = require('./ProfileCard')  // No CommonJS
  export default function ProfileCard({user}) {  // Must use arrow functions
    const [is_loading, set_is_loading] = useState() // Use camelCase
  }

  Python/FastAPI

  # ✅ CORRECT
  from typing import Optional
  from src.core.schemas import CVData

  async def extract_cv_data(file_path: str) -> Optional[CVData]:
      """Extract CV data with type hints."""
      # Implementation

  # ❌ INCORRECT
  def extract_cv_data(file_path):  # Missing type hints
      # Missing docstring
      from core.schemas import *   # No wildcard imports

  🚢 Deployment

  Local Testing

  # Build and test production build
  pnpm run build
  pnpm run start

  # Test with production environment
  NODE_ENV=production pnpm run start

  Deploy to Vercel

  # Automatic deployment on push to main
  git push origin main

  # Manual deployment
  vercel --prod

  # Preview deployment
  vercel

  📖 Additional Resources

  Important Files

  - CLAUDE.md - This file, for Claude Code context
  - config.py - Backend configuration
  - package.json - Frontend dependencies and scripts
  - .taskmaster/ - Task management and PRDs

  External Documentation

  - https://fastapi.tiangolo.com/
  - https://nextjs.org/docs
  - https://tailwindcss.com/docs
  - https://ui.aceternity.com/

  ⚠️ Critical Reminders

  1. ALWAYS run pnpm run typecheck before committing
  2. NEVER use npm or yarn - only pnpm
  3. NEVER commit API keys - use keychain manager
  4. ALWAYS check existing components before creating new ones
  5. Backend runs on port 2000, not 8000
  6. Maximum file upload size is 10MB
  7. Use Read/Grep tools to research before coding

  ---Last updated: 2025-07-14 | Version: 4.0


  2. Implement Versioning
    - Add a changelog section or link to CHANGELOG.md
    - Version the CLAUDE.md file itself
    - Track breaking changes in the guide
  3. Create Quick Reference Cards
    - One-page PDF with most common commands
    - Keyboard shortcuts cheatsheet
    - Emergency troubleshooting flowchart
  4. Add Interactive Elements
    - Links to video tutorials for complex tasks
    - Interactive command examples (using asciinema)
    - Embedded Loom videos for UI workflows
  5. Establish Update Protocol
    - Designate CLAUDE.md as source of truth
    - Require PR updates to include CLAUDE.md changes
    - Automate checks for outdated information
  6. Include Performance Guidelines
    - Target response times for API endpoints
    - Frontend performance budgets
    - Database query optimization tips
  7. Add Security Checklist
    - Pre-deployment security review items
    - OWASP compliance notes
    - Data privacy considerations
  8. Create Onboarding Path
    - Day 1: Environment setup and first PR
    - Week 1: Understanding architecture
    - Month 1: Advanced features and optimization

  1. Information Architecture - Reorganized content following progressive disclosure principle, starting with
  overview and moving to specifics. This matches how developers naturally explore new projects.
  2. Visual Hierarchy - Implemented consistent heading levels, visual separators, and emoji indicators to make
  scanning easier. Critical information is now prominently placed rather than scattered.
  3. Practical Workflows - Added step-by-step workflows for common tasks, similar to the professional example's Git
  workflow section. This provides immediate value to developers.
  4. Code Examples - Enhanced code blocks with numbered steps, correct/incorrect patterns, and real examples. This
  reduces ambiguity and prevents common mistakes.
  5. Quick Start Focus - Created a true quick start section that gets developers running in minutes, with detailed
  explanations moved to appropriate sections.
  6. TaskMaster Integration - Consolidated all TaskMaster information into a dedicated section with clear triggers
  and commands, making the AI-assisted workflow more discoverable.
  7. Troubleshooting Guide - Added comprehensive troubleshooting section with common issues and solutions in table
  format, making problem-solving faster.
  8. Consistent Styling - Standardized command documentation format, code examples, and section structures
  throughout the document for better readability.

  The revised structure follows best practices from both the professional example and claude-code-main insights,
  creating a more maintainable and developer-friendly guide.