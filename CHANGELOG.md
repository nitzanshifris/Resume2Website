# Changelog

All notable changes to CV2WEB will be documented in this file.

## [1.0.0] - 2025-07-03

### 🎉 MVP Complete!

We've successfully built a working end-to-end pipeline that transforms CVs into beautiful portfolios using Aceternity UI components.

### Added
- **Complete Portfolio Generation Pipeline**
  - CV upload → Text extraction → AI analysis → Component selection → Portfolio generation
  - ~20 seconds from upload to running Next.js site
  
- **17 CV Sections Extraction**
  - Hero, Experience, Education, Skills, Projects, Certifications
  - Achievements, Publications, Speaking, Patents, Memberships
  - Volunteer, Languages, Courses, Hobbies, Contact
  
- **100+ Aceternity Component Integration**
  - Real UI components with animations
  - Automatic component copying and import fixing
  - Smart component selection based on user archetype
  
- **Improved Portfolio Generator**
  - Replaced basic generator with comprehensive component support
  - Added proper prop mapping for all component types
  - Fixed import paths (../../lib → @/lib)
  
- **Smart Deduplication**
  - Fuzzy matching to remove duplicate text
  - Configurable similarity threshold

### Changed
- Renamed `improved_portfolio_generator.py` to `portfolio_generator.py`
- Updated all documentation to reflect current state
- Enhanced `.gitignore` for better project organization

### Fixed
- Generic content issue - portfolios now display actual CV data
- Component file copying - now copies entire directories
- Import path issues in Aceternity components
- Framer-motion imports (motion/react → framer-motion)
- FloatingDock icon handling

### Known Issues
- JSON parsing errors in achievements section (intermittent)
- Need better error recovery for failed extractions
- Extraction quality validation needed

## [0.9.0] - 2025-06-15

### Added
- Authentication system with session management
- File upload with validation
- Text extraction for multiple formats
- OCR support with Google Vision and AWS Textract
- AI-powered CV data extraction
- Basic portfolio generation

### Changed
- Migrated from form data to JSON for auth endpoints
- Centralized configuration in `config.py`

### Security
- Password hashing with bcrypt
- Session expiry management
- Path traversal protection