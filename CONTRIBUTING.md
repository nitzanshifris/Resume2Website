# Contributing to CV2WEB

Thank you for your interest in contributing to CV2WEB! This guide will help you get started.

## 🚀 Quick Start

1. Fork the repository
2. Clone your fork
3. Run the setup script:
   ```bash
   ./quickstart.sh
   ```

## 🎯 Priority Areas

We especially need help with:

### 1. **Fix JSON Parsing Errors** (Critical)
- Location: `services/llm/data_extractor.py`
- Issue: Intermittent JSON parsing failures in achievements section
- Solution: Add validation before saving, implement retry logic

### 2. **Improve Component Mappings**
- Location: `services/portfolio/component_mappings.py`
- Add support for more Aceternity components
- Improve prop mapping accuracy

### 3. **Error Handling**
- Better error messages throughout the system
- Graceful degradation when AI fails
- User-friendly error reporting

### 4. **Documentation**
- Add more CV examples
- Document component prop mappings
- Create video tutorials

## 🔧 Development Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- Git

### Environment Setup
```bash
# 1. Create virtual environment
python -m venv venv
source venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Set up API credentials
python scripts/setup_keychain.py
```

### Running Tests
```bash
# Run all tests
python -m pytest

# Run specific test
python tests/test_portfolio_generation.py

# Test full pipeline
python test_automated_generation.py
```

## 📝 Code Style

### Python
- Follow PEP 8
- Use type hints where possible
- Add docstrings to all functions
- Maximum line length: 100 characters

### TypeScript/React
- Use functional components
- Follow React hooks best practices
- Use TypeScript strictly
- Prefer named exports

### Commit Messages
- Use conventional commits format
- Examples:
  - `feat: add support for timeline component`
  - `fix: resolve JSON parsing error in achievements`
  - `docs: update API documentation`
  - `test: add edge case tests for CV extraction`

## 🧪 Testing Guidelines

### Before Submitting
1. Run all tests: `python -m pytest`
2. Test the full pipeline: `python test_automated_generation.py`
3. Verify generated portfolio runs: `cd test-automated-portfolio && npm run dev`
4. Check for type errors: `mypy services/`

### Writing Tests
- Add tests for new features
- Test edge cases
- Include both positive and negative test cases
- Use meaningful test names

## 🚀 Submitting Changes

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Write clean, documented code
   - Add/update tests
   - Update documentation if needed

3. **Test Your Changes**
   ```bash
   python -m pytest
   python test_automated_generation.py
   ```

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create a Pull Request on GitHub

## 📊 Pull Request Guidelines

### PR Title
Use conventional commit format: `feat:`, `fix:`, `docs:`, etc.

### PR Description
Include:
- What changes you made
- Why you made them
- How to test them
- Screenshots (if UI changes)

### Checklist
- [ ] Tests pass
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] No console errors
- [ ] Works with example CVs

## 🐛 Reporting Issues

### Before Reporting
1. Check existing issues
2. Try with latest version
3. Verify it's reproducible

### Issue Template
```markdown
**Description**
Clear description of the issue

**Steps to Reproduce**
1. Upload CV
2. Wait for processing
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- OS: [e.g., macOS 14.0]
- Python: [e.g., 3.11.5]
- Node: [e.g., 18.17.0]

**Additional Context**
Any other relevant information
```

## 🤝 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive criticism
- Help others learn

## 📚 Resources

- [Project Documentation](docs/README.md)
- [API Reference](docs/api.md)
- [Architecture Overview](docs/CURRENT_PIPELINE.md)
- [Aceternity Components](https://ui.aceternity.com/)

## 💬 Getting Help

- GitHub Issues for bugs/features
- Discussions for questions
- Check existing issues first

Thank you for contributing to CV2WEB! 🎉