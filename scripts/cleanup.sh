#!/bin/bash

# CV2WEB V4 Cleanup Script
# This script removes common build artifacts and temporary files

echo "Starting CV2WEB cleanup..."

# Remove .DS_Store files
echo "Removing .DS_Store files..."
find . -name ".DS_Store" -type f -delete

# Remove .next directories
echo "Removing .next build directories..."
find . -name ".next" -type d -exec rm -rf {} + 2>/dev/null

# Remove node_modules from templates (keeping main ones)
echo "Removing node_modules from templates..."
find ./src/templates -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null
find ./legacy -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null

# Remove empty files
echo "Removing empty files..."
find . -type f -empty -delete

# Remove package-lock.json files (using pnpm)
echo "Removing package-lock.json files..."
find . -name "package-lock.json" -type f -delete

# Remove Python cache
echo "Removing Python cache..."
find . -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null
find . -name "*.pyc" -delete
find . -name "*.pyo" -delete

# Remove test outputs
echo "Removing test output files..."
find ./tests/results -name "*.txt" -type f -delete 2>/dev/null
find ./tests/outputs -name "*" -type f -delete 2>/dev/null

echo "Cleanup complete!"
echo ""
echo "Summary of cleaned items:"
echo "- .DS_Store files"
echo "- .next directories"
echo "- node_modules in templates"
echo "- Empty files"
echo "- package-lock.json files"
echo "- Python cache files"
echo "- Test output files"
echo ""
echo "Note: Run 'git status' to see all changes"