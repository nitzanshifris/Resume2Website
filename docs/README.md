# CV2WEB Documentation Hub

Transform CVs into stunning portfolio websites using AI and Aceternity UI components.

## 📚 Documentation Structure

### Getting Started
- **[Main README](../README.md)** - Quick start guide and overview
- **[API Documentation](api.md)** - Complete API reference
- **[Current Pipeline](CURRENT_PIPELINE.md)** - System architecture and flow

### Project Status
- **[Project Status](PROJECT_STATUS.md)** - Current implementation status
- **[Future Features](FUTURE_FEATURES.md)** - Roadmap and upcoming features
- **[System Overview](CV2WEB_SYSTEM_OVERVIEW_FOR_ACETERNITY_WORK.md)** - Technical deep dive

### Development Guides
- **[Aceternity Components Task](ACETERNITY_COMPONENTS_REORGANIZATION_TASK.md)** - Component integration guide

## 🚀 Current State (2025-07-03)

### ✅ What's Working
- **Complete Pipeline**: CV → Text → AI Analysis → Components → Portfolio
- **17 CV Sections**: Comprehensive data extraction
- **100+ Aceternity Components**: Real UI components with animations
- **Smart Selection**: AI chooses best components for your profile
- **20 Second Generation**: From upload to running site

### 🎯 Quick Commands

```bash
# Test the full pipeline
python test_automated_generation.py

# Run generated portfolio
cd test-automated-portfolio
npm install && npm run dev

# Start API server
python main.py

# Run specific tests
python tests/comprehensive_test.py
```

## 📊 System Overview

```
CV Upload → Text Extraction → AI Analysis (17 sections) → 
Component Selection → Portfolio Generation → Next.js Site
```

### Key Technologies
- **Backend**: FastAPI, Python 3.11+
- **AI**: Gemini 2.0 Flash, Claude Sonnet
- **Frontend**: Next.js 14, React 18, TypeScript
- **UI**: Aceternity Components, Tailwind CSS, Framer Motion

## 🔧 Development Setup

1. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up API credentials**:
   ```bash
   python scripts/setup_keychain.py
   ```

3. **Configure Aceternity components path**:
   - Components should be in: `/aceternity-components-library/components/`

4. **Run the system**:
   ```bash
   # Start API
   python main.py
   
   # In another terminal, test generation
   python test_automated_generation.py
   ```

## 📁 Project Structure

```
CV2WEB-V4/
├── api/                    # FastAPI routes
├── backend/                # Data schemas (17 CV sections)
├── services/               # Core services
│   ├── llm/               # AI extraction
│   ├── local/             # Text processing
│   └── portfolio/         # Generation engine
├── aceternity-components-library/  # UI components
├── tests/                  # Test suite
└── docs/                   # This documentation
```

## 🐛 Known Issues

1. **JSON Parsing**: Occasional errors in achievements section
2. **Import Paths**: Some components need manual fixes
3. **Error Recovery**: Needs improvement for failed extractions

## 🤝 Contributing

Priority areas:
1. Fix JSON parsing reliability
2. Add more component mappings
3. Improve error handling
4. Enhance extraction prompts

## 📞 Support

- GitHub Issues: Report bugs and feature requests
- Documentation: Check docs/ folder for guides
- Examples: See data/cv_examples/ for test files