#!/bin/bash

echo "🚀 RESUME2WEBSITE Quick Start Setup"
echo "=========================="

# Check Python version
echo "📌 Checking Python version..."
python_version=$(python3 --version 2>&1)
if [[ $? -eq 0 ]]; then
    echo "✅ Found: $python_version"
else
    echo "❌ Python 3 not found. Please install Python 3.11 or higher."
    exit 1
fi

# Create virtual environment
echo ""
echo "📦 Creating virtual environment..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "✅ Virtual environment created"
else
    echo "✅ Virtual environment already exists"
fi

# Activate virtual environment
echo ""
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo ""
echo "📥 Installing Python dependencies..."
pip install -r requirements.txt

# Set up credentials
echo ""
echo "🔑 Setting up API credentials..."
echo "Please have your API keys ready:"
echo "- Google Cloud Vision API"
echo "- AWS Textract"
echo "- Google Gemini API"
echo "- Anthropic Claude API"
echo ""
python scripts/setup_keychain.py

# Create necessary directories
echo ""
echo "📁 Creating necessary directories..."
mkdir -p data/uploads
mkdir -p data/test_outputs
mkdir -p tests/outputs
mkdir -p tests/results

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Start the API server:"
echo "   python main.py"
echo ""
echo "2. Test the full pipeline:"
echo "   python test_automated_generation.py"
echo ""
echo "3. Run the generated portfolio:"
echo "   cd test-automated-portfolio"
echo "   npm install && npm run dev"
echo ""
echo "📚 Documentation: docs/README.md"
echo "🐛 Report issues: GitHub Issues"