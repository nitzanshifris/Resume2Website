# CV2WEB Project Structure

## Root Directory Organization

```
CV2WEB-V4/
├── README.md                    # Main project documentation
├── requirements.txt             # Python dependencies
├── config.py                    # Centralized configuration
├── main.py                      # FastAPI application entry point
│
├── api/                         # API Layer
│   ├── routes/                  # API endpoints
│   │   ├── auth.py             # Authentication endpoints
│   │   ├── cv.py               # CV upload & processing
│   │   └── portfolio.py        # Portfolio generation
│   ├── db.py                   # Database operations
│   └── schemas.py              # Request/response schemas
│
├── backend/                     # Data Models
│   └── schemas/
│       └── unified.py          # 17 CV section schemas
│
├── services/                    # Core Business Logic
│   ├── llm/                    # AI Services
│   │   └── data_extractor.py  # Gemini/Claude integration
│   ├── local/                  # Local Processing
│   │   ├── text_extractor.py  # PDF/DOCX/Image extraction
│   │   ├── smart_deduplicator.py # Fuzzy matching dedup
│   │   └── keychain_manager.py # Credential management
│   └── portfolio/              # Portfolio Generation
│       ├── component_selector.py # AI component selection
│       ├── portfolio_generator.py # Next.js generation
│       ├── component_adapter.py # Data transformation
│       └── component_mappings.py # Component configurations
│
├── aceternity-components-library/ # UI Component Library
│   ├── components/             # 100+ Aceternity components
│   ├── templates/              # Example templates
│   └── package.json            # Component dependencies
│
├── data/                        # Data Storage
│   ├── cv_examples/            # Test CV files
│   ├── uploads/                # User uploaded files
│   ├── test_outputs/           # Test extraction results
│   └── cv2web.db              # SQLite database
│
├── tests/                       # Test Suite
│   ├── comprehensive_test.py   # Full integration tests
│   ├── test_*.py              # Unit & integration tests
│   └── outputs/               # Test artifacts
│
├── docs/                        # Documentation
│   ├── README.md              # Documentation hub
│   ├── api.md                 # API reference
│   ├── CURRENT_PIPELINE.md    # System architecture
│   ├── PROJECT_STATUS.md      # Implementation status
│   └── FUTURE_FEATURES.md     # Roadmap
│
├── scripts/                     # Utility Scripts
│   └── setup_keychain.py      # One-time credential setup
│
├── generated-portfolio/         # Example Generated Portfolio
│   └── [Next.js project files]
│
└── test-automated-portfolio/    # Test Generated Portfolio
    └── [Next.js project files]
```

## Key Directories Explained

### `/api`
Contains all API-related code including routes, database operations, and request/response schemas. This is the entry point for all HTTP requests.

### `/backend`
Houses the data models and schemas. The `unified.py` file contains all 17 CV section schemas used throughout the system.

### `/services`
Core business logic divided into:
- **llm**: AI services for CV data extraction
- **local**: Local file processing and OCR
- **portfolio**: Portfolio generation engine

### `/aceternity-components-library`
Complete library of 100+ Aceternity UI components that are used to build portfolios. Includes animations, layouts, and interactive elements.

### `/data`
All data storage including:
- Example CVs for testing
- User uploaded files (with UUID names)
- Extracted CV data (JSON)
- SQLite database for sessions

### `/tests`
Comprehensive test suite covering:
- Unit tests for individual components
- Integration tests for full pipeline
- Edge case testing
- Performance testing

### `/docs`
All project documentation including:
- API reference
- Architecture diagrams
- Status updates
- Future roadmap

## File Naming Conventions

- **Python files**: `snake_case.py`
- **TypeScript/React**: `kebab-case.tsx` or `PascalCase.tsx`
- **JSON**: `kebab-case.json`
- **Markdown**: `UPPER_SNAKE_CASE.md` for docs, `lowercase.md` for content

## Environment Setup

1. **Python Environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # or `venv\Scripts\activate` on Windows
   pip install -r requirements.txt
   ```

2. **API Credentials**
   ```bash
   python scripts/setup_keychain.py
   ```

3. **Aceternity Components**
   - Ensure `/aceternity-components-library` is properly linked
   - Components should be in `components/ui/` subdirectory

## Data Flow

1. **Upload**: User uploads CV → Saved to `/data/uploads/`
2. **Extract**: Text extracted from file → Processed by AI
3. **Transform**: CV data mapped to component props
4. **Generate**: Next.js portfolio created → Saved to output directory
5. **Deploy**: Ready for Vercel/Netlify deployment

## Security Considerations

- All uploaded files get UUID names
- Credentials stored in macOS Keychain
- Session-based authentication
- Input validation on all endpoints
- Path traversal protection

## Performance Optimizations

- Parallel AI extraction (10-15s vs 60s sequential)
- Smart deduplication reduces redundant text
- Component caching for faster generation
- Optimized file operations

## Development Workflow

1. **Start API Server**
   ```bash
   python main.py
   ```

2. **Test Full Pipeline**
   ```bash
   python test_automated_generation.py
   ```

3. **Run Generated Portfolio**
   ```bash
   cd test-automated-portfolio
   npm install && npm run dev
   ```

## Deployment Considerations

- API runs on port 2000 by default
- CORS configured for localhost:3000, 3001, 5173
- SQLite for development, consider PostgreSQL for production
- File storage: Local for dev, consider S3/GCS for production