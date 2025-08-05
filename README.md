# CV2WEB - AI-Powered CV to Portfolio Generator

Transform your CV into a stunning portfolio website powered by AI and Aceternity UI components.

## 🚀 Current State (Updated: 2025-07-03)

### ✅ What's Working
- **Complete End-to-End Pipeline**: Upload CV → Extract Data → Generate Portfolio
- **AI-Powered Extraction**: 18 different CV sections extracted using Claude 4 Opus only
- **Aceternity UI Integration**: 100+ real components with animations
- **Smart Component Selection**: AI selects best components based on your profile
- **Content-Aware Intelligence**: Analyzes content richness to optimize layouts
- **Automated Generation**: One command from CV to deployed site

### 🎯 Quick Start

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Set up credentials (one-time)
python scripts/setup_keychain.py

# 3. Generate portfolio from CV
python3 test_automated_generation.py

# Or use smart content analysis (NEW!)
python3 test_automated_generation_smart.py

# 4. Run generated portfolio
cd test-automated-portfolio
npm install
npm run dev

# Visit http://localhost:3000
```

## 🏗️ Architecture

```
CV2WEB-V4/
├── api/                          # FastAPI backend
│   ├── routes/
│   │   ├── cv.py                # CV upload & processing
│   │   └── portfolio.py         # Portfolio generation
│   └── db.py                    # Database operations
│
├── backend/
│   └── schemas/
│       └── unified.py           # 17 CV section schemas
│
├── services/
│   ├── llm/
│   │   └── data_extractor.py   # AI-powered CV parsing
│   ├── local/
│   │   ├── text_extractor.py   # PDF/DOCX/Image extraction
│   │   └── smart_deduplicator.py # Intelligent deduplication
│   └── portfolio/
│       ├── component_selector.py # Smart component selection
│       ├── portfolio_generator.py # Next.js code generation
│       └── component_adapter.py  # Data transformation
│
├── aceternity-components-library/ # 100+ UI components
└── generated-portfolio/          # Your generated site
```

## 🎨 Component Library

### Supported Aceternity Components
- **Hero Sections**: `background-gradient`, `hero-parallax`, `aurora-background`
- **Text Effects**: `text-generate-effect`, `typewriter-effect`, `flip-words`
- **Layouts**: `bento-grid`, `timeline`, `sticky-scroll-reveal`
- **Cards**: `card-hover-effect`, `3d-card`, `infinite-moving-cards`
- **Navigation**: `floating-dock`, `floating-navbar`
- **Showcases**: `animated-testimonials`, `parallax-scroll`

### Smart Selection Based on Profile
- **Business/Marketing** → Professional gradients, testimonials
- **Technical/Developer** → Code blocks, terminal effects, grids
- **Creative/Designer** → 3D cards, parallax, visual effects
- **Academic/Researcher** → Timelines, publication lists

### NEW: Content-Aware Intelligence
- **Richness Analysis** → Evaluates content depth per section
- **Dynamic Layouts** → Adapts to CV density (sparse/balanced/dense/rich)
- **Smart Suggestions** → Optional merge recommendations for sparse sections
- **No Hard Limits** → Uses all your content intelligently

## 📊 What We Extract

1. **Hero** - Name, title, professional summary
2. **Experience** - Work history with achievements
3. **Education** - Degrees, institutions, GPAs
4. **Skills** - Technical & soft skills categorized
5. **Projects** - Portfolio pieces with descriptions
6. **Certifications** - Professional credentials
7. **Achievements** - Awards, honors, recognitions
8. **Publications** - Research papers, articles
9. **Speaking** - Conferences, presentations
10. **Languages** - Spoken/programming languages
11. **Contact** - Email, phone, social links
12. And 5 more sections...

## 🧪 Testing

```bash
# Run comprehensive tests
python tests/comprehensive_test.py

# Test specific CV
python test_portfolio_generation.py

# Test edge cases
python tests/test_mvp_edge_cases.py
```

## 📈 Performance

- **Text Extraction**: <1 second for most PDFs
- **AI Processing**: 10-15 seconds with parallel extraction
- **Portfolio Generation**: <5 seconds
- **Total Time**: ~20 seconds from CV to running site

## 🐛 Known Issues

### High Priority
- [ ] JSON parsing errors in achievements (intermittent)
- [ ] Import path issues with some components
- [ ] FloatingDock icon handling

### In Progress
- [ ] Better error recovery
- [ ] Component preview mode
- [ ] Multiple theme support

## 🚀 Roadmap

### Phase 1 (Current)
- ✅ Basic CV extraction
- ✅ Aceternity component integration
- ✅ Automated generation
- 🔄 Error handling improvements

### Phase 2
- [ ] Real-time preview
- [ ] Custom component mappings
- [ ] Deploy to Vercel button
- [ ] Multiple themes

### Phase 3
- [ ] Visual CV builder
- [ ] Component marketplace
- [ ] Team portfolios
- [ ] Analytics integration

## 🤝 Contributing

Key areas needing help:
1. **Component Mappings** - Add support for more Aceternity components
2. **AI Prompts** - Improve extraction accuracy
3. **Error Handling** - Make the system more robust
4. **Documentation** - Help others use the tool

## 📄 License

MIT License - see [LICENSE](LICENSE) file

## 🙏 Credits

- [Aceternity UI](https://ui.aceternity.com/) - Amazing component library
- Anthropic Claude 4 Opus - Deterministic CV extraction
- Next.js & Vercel - Modern web framework