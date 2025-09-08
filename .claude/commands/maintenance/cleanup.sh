#!/bin/bash

# RESUME2WEBSITE Cleanup Command
# Removes common build artifacts and temporary files

echo "🧹 Starting RESUME2WEBSITE cleanup..."

# Remove .DS_Store files
echo "  Removing .DS_Store files..."
find . -name ".DS_Store" -type f -delete 2>/dev/null

# Remove .next directories
echo "  Removing .next build directories..."
find . -name ".next" -type d -exec rm -rf {} + 2>/dev/null

# Remove node_modules from templates and sandboxes (keeping main ones)
echo "  Removing node_modules from templates..."
find ./src/templates -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null
find ./sandboxes -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null

# Remove package-lock.json files (using pnpm)
echo "  Removing package-lock.json files..."
find . -name "package-lock.json" -type f -delete 2>/dev/null

# Remove Python cache
echo "  Removing Python cache..."
find . -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null
find . -name "*.pyc" -delete 2>/dev/null
find . -name "*.pyo" -delete 2>/dev/null
find . -name ".pytest_cache" -type d -exec rm -rf {} + 2>/dev/null

# Remove empty files
echo "  Removing empty files..."
find . -type f -empty -not -name ".gitkeep" -delete 2>/dev/null

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "💡 Tips:"
echo "  - Run 'git status' to see changes"
echo "  - Run 'du -sh sandboxes/' to check sandbox size"
echo "  - Use 'python3 src/future-use/sandbox_cleanup.py' for old sandboxes"