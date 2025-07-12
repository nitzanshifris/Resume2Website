# CV2WEB New Project Structure

## Overview
The project has been reorganized for better clarity and maintainability. Here's the new structure:

## Directory Structure

```
CV2WEB-V4/
├── src/                        # All source code
│   ├── api/                    # API routes and endpoints
│   ├── core/                   # Core business logic
│   │   ├── cv_extraction/      # CV parsing & extraction services
│   │   ├── portfolio_gen/      # Portfolio generation services
│   │   └── schemas/            # Data models (Pydantic schemas)
│   ├── templates/              # Portfolio templates
│   │   ├── default/            # Current main template
│   │   ├── v1/                 # First version (from Guy Sagee)
│   │   └── base/               # Base template structure
│   └── utils/                  # Utility scripts and helpers
│
├── components/                 # All UI Components
│   ├── libraries/              # External component libraries
│   │   ├── aceternity/         # Aceternity UI components
│   │   └── magic-ui/           # Magic UI components
│   ├── custom/                 # Custom components
│   │   ├── portfolio/          # Portfolio-specific components
│   │   ├── cv-display/         # CV rendering components
│   │   └── shared/             # Shared components
│   ├── gallery-app/            # Component gallery application
│   └── storybook/              # Storybook configuration
│
├── tests/                      # All test files
│   ├── unit/                   # Unit tests
│   ├── integration/            # Integration tests
│   └── fixtures/               # Test data and fixtures
│
├── data/                       # Sample data
│   └── cv_examples/            # Example CVs in various formats
│
├── docs/                       # Documentation
│   ├── api/                    # API documentation
│   ├── guides/                 # How-to guides
│   ├── architecture/           # System design docs
│   ├── archive/                # Old docs and summaries
│   └── screenshots/            # Screenshots for docs
│
├── output/                     # Generated portfolios (gitignored)
│   └── portfolio_tests/        # Test generation results
│
├── config/                     # Configuration files
│   └── vitest.config.ts        # Test configuration
│
├── packages/                   # Monorepo packages
│   ├── design-tokens/          # Design system tokens
│   ├── new-renderer/           # Renderer package
│   └── tailwind-preset/        # Tailwind configuration
│
├── legacy/                     # Archived/deprecated code
│   ├── old_portfolios/         # Previous portfolio generations
│   ├── mcp-integration/        # MCP integration attempts
│   └── ...                     # Other archived items
│
├── .cache/                     # All cache directories
│   ├── .ruff_cache/            # Python linter cache
│   └── .pytest_cache/          # Test cache
│
├── main.py                     # Application entry point
├── config.py                   # Main configuration
├── README.md                   # Project documentation
├── CHANGELOG.md                # Version history
├── CONTRIBUTING.md             # Contribution guidelines
└── package.json                # Node.js dependencies
```

## Key Changes Made

### 1. Source Code Organization (`src/`)
- **API routes** moved from `api/` to `src/api/`
- **Backend schemas** moved from `backend/schemas/` to `src/core/schemas/`
- **Services** split into:
  - `src/core/cv_extraction/` (from `services/llm/`)
  - `src/core/portfolio_gen/` (from `services/portfolio/`)
- **Scripts** moved to `src/utils/`
- **Templates** consolidated in `src/templates/`

### 2. Component Library Organization (`components/`)
- **Separated** Aceternity and Magic UI components
- **Created** custom component directories
- **Consolidated** gallery app and storybook

### 3. Documentation (`docs/`)
- **API docs** in `docs/api/`
- **Guides** in `docs/guides/`
- **Architecture** in `docs/architecture/`
- **Old summaries** archived in `docs/archive/`

### 4. Other Improvements
- **Cache directories** consolidated in `.cache/`
- **Config files** moved to `config/`
- **Generated outputs** go to `output/`
- **Legacy code** properly archived
- **Test files** organized by type

## Benefits

1. **Clear Separation of Concerns**
   - Source code in `src/`
   - UI components in `components/`
   - Tests in `tests/`
   - Documentation in `docs/`

2. **Better Component Management**
   - Clear distinction between Aceternity and Magic UI
   - Custom components separated from libraries

3. **Cleaner Root Directory**
   - Only essential files remain in root
   - Config files organized
   - Cache directories hidden

4. **Improved Developer Experience**
   - Easy to find files by purpose
   - Logical grouping of related code
   - Clear template organization

## Migration Notes

- Import paths will need updating in Python files
- Component imports may need adjustment
- Config file locations have changed
- Generated outputs now go to `output/` instead of root