# CV2WEB V4 Cleanup Recommendations

## Overview
This document provides specific recommendations for cleaning up and reorganizing the CV2WEB V4 project structure after the migration to the new `/src/` structure.

## Files/Folders to DELETE

### 1. Temporary and System Files
- **All .DS_Store files** (20+ found throughout the project)
  ```bash
  find . -name ".DS_Store" -type f -delete
  ```
- **Empty `write` file** in project root
- **`updated_json.txt`** in project root (appears to be a temporary file)

### 2. Build Artifacts
- **All `.next` directories** (9 found) - these are Next.js build outputs that shouldn't be in git:
  - `/output/portfolio_tests/test_1/portfolio/.next`
  - `/legacy/old_portfolios/portfolio_output/.next`
  - `/legacy/old_portfolios/test-automated-portfolio/.next`
  - `/legacy/old_portfolios/portfolio_Software_Engineer/.next`
  - `/legacy/old_portfolios/generated-portfolio/.next`
  - `/legacy/portfolio_examples/portfolio_Chicago-Resume-Template-Creative/.next`
  - `/legacy/portfolio_examples/portfolio_Software_Engineer/.next`
  - `/components/gallery-app/aceternity-gallery-app/.next`
  - `/packages/new-renderer/.next`

### 3. Legacy Python Files (now in /src/)
- `/config.py` (root level - should use src/api/config.py if needed)
- `/main.py` (root level - legacy entry point)

### 4. Entire Legacy Folder Structure
The `/legacy/` folder contains old implementations that have been migrated:
- `/legacy/extract_cv_for_magic.py`
- `/legacy/services/portfolio/` - all Python files here are duplicated in /src/
- `/legacy/scripts/` - test scripts that should be in /tests/
- `/legacy/tests/` - old tests that should be consolidated with /tests/
- `/legacy/props/` - component props that should be in component library
- `/legacy/old_portfolios/` - example portfolios with node_modules and build artifacts
- `/legacy/portfolio_examples/` - more example portfolios with duplicate configs

### 5. Duplicate Package Lock Files
Multiple `package-lock.json` files exist alongside `pnpm-lock.yaml`:
- Use pnpm consistently and remove all `package-lock.json` files
- Keep only `pnpm-lock.yaml` files

### 6. Test Output Files
- `/tests/results/` - test output text files that shouldn't be in git
- Add `*.txt` in tests/results to .gitignore

## Files/Folders to MOVE

### 1. Python Scripts from Root
- `/components/gallery-app/aceternity-gallery-app/scripts/test_full_pipeline.py` → `/tests/test_full_pipeline.py`
- `/components/gallery-app/aceternity-gallery-app/scripts/test_model_router.py` → `/tests/test_model_router.py`

### 2. Utility Scripts
- `/components/gallery-app/aceternity-gallery-app/scripts/*.js` → `/src/utils/scripts/`
  - `build-cv2web-bundle.js`
  - `create-button-pages.js`
  - `extract-component.js`

### 3. Shell Scripts
- `/components/gallery-app/aceternity-gallery-app/scripts/runners/*.sh` → `/scripts/` (project root)
  - These are operational scripts that should be at the root level

### 4. Documentation
- `/components/gallery-app/aceternity-gallery-app/docs/` → `/docs/components/`
  - Move component-specific documentation to main docs folder

## Files/Folders to RENAME

### 1. Inconsistent Folder Names
- `/data/cv_examples/png_examples/untitled folder*/` → Use descriptive names:
  - `untitled folder` → `cv_screenshots_batch1`
  - `untitled folder 2` → `cv_screenshots_batch2`
  - etc.

### 2. Configuration Files
- Standardize on either `.js` or `.mjs` for Next.js configs (currently mixed)
- Standardize on either `.ts` or `.js` for Tailwind configs (currently mixed)

## Structural Improvements

### 1. Create .gitignore entries
Add the following to `.gitignore`:
```
# Build artifacts
.next/
dist/
build/
*.log

# OS files
.DS_Store
Thumbs.db

# Test outputs
tests/results/*.txt

# Temporary files
*.tmp
*.cache
write

# Package manager
package-lock.json
```

### 2. Consolidate Test Files
- Move all tests from `/legacy/tests/` to `/tests/`
- Remove duplicate test files
- Organize tests into subdirectories:
  - `/tests/unit/`
  - `/tests/integration/`
  - `/tests/e2e/`

### 3. Clean Up Data Directory
- `/data/uploads/` contains 150+ uploaded files
- Consider moving to cloud storage or implementing a cleanup policy
- Add upload directory to .gitignore if these are temporary

### 4. Standardize Template Structure
- `/src/templates/v1/` has `node_modules/` which shouldn't be committed
- Templates should only contain source files, not dependencies

### 5. Database Location
- `/data/cv2web.db` should potentially be in a more standard location
- Consider `/src/api/data/` or use environment variable for DB path

## Recommended Cleanup Script

Create a cleanup script `/scripts/cleanup.sh`:
```bash
#!/bin/bash

# Remove .DS_Store files
find . -name ".DS_Store" -type f -delete

# Remove .next directories
find . -name ".next" -type d -exec rm -rf {} +

# Remove node_modules from templates
find ./src/templates -name "node_modules" -type d -exec rm -rf {} +

# Remove empty files
find . -type f -empty -delete

# Remove package-lock.json files (using pnpm)
find . -name "package-lock.json" -type f -delete

echo "Cleanup complete!"
```

## Priority Actions

1. **HIGH**: Remove all `.next` directories and add to .gitignore
2. **HIGH**: Delete the entire `/legacy/` folder after verifying all needed code is in `/src/`
3. **HIGH**: Remove all `.DS_Store` files and add to .gitignore
4. **MEDIUM**: Consolidate test files into organized `/tests/` structure
5. **MEDIUM**: Move scripts to appropriate locations
6. **LOW**: Rename untitled folders to descriptive names
7. **LOW**: Standardize configuration file extensions

## Verification Steps

Before deleting:
1. Ensure all Python functionality from `/legacy/services/` exists in `/src/`
2. Verify test coverage hasn't decreased after consolidating tests
3. Check that no active code references the files to be deleted
4. Create a backup branch before major deletions

## Estimated Impact

- **Disk space saved**: ~500MB+ (mostly from node_modules and .next directories)
- **File count reduction**: ~1000+ files (including node_modules contents)
- **Improved clarity**: Clear separation between source, tests, and build artifacts
- **Better git performance**: Fewer files to track, cleaner history