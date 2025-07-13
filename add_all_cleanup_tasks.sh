#!/bin/bash
# Add all 57 cleanup tasks to TaskMaster AI

echo "Adding CV2WEB V4 Cleanup Tasks to TaskMaster AI"
echo "=============================================="

# Phase 1: Analysis and Verification (HIGH-CRITICAL)
task-master add-task --prompt="Read and analyze CLEANUP_RECOMMENDATIONS.md thoroughly. Thoroughly read CLEANUP_RECOMMENDATIONS.md and understand all recommendations" --priority=high

task-master add-task --prompt="Check all references to files in /legacy/ directory. Use grep to find all imports and references to /legacy/ files from active code" --priority=high

task-master add-task --prompt="Verify Python functionality migration from /legacy/services/ to /src/. Compare all Python files in /legacy/services/portfolio/ with /src/core/portfolio_gen/" --priority=high

task-master add-task --prompt="Create comprehensive file inventory for deletion. List all .DS_Store files, .next directories, and other files marked for deletion" --priority=high

task-master add-task --prompt="Check for active references to root-level Python files. Verify nothing imports from /config.py or /main.py at root level" --priority=high

task-master add-task --prompt="Test current functionality before cleanup. Run all tests and ensure both frontend/backend work before starting cleanup" --priority=high

# Phase 2: File Removal - System Files (HIGH)
task-master add-task --prompt="Find and list all .DS_Store files. Run: find . -name '.DS_Store' -type f to list all .DS_Store files" --priority=high

task-master add-task --prompt="Remove all .DS_Store files. Execute: find . -name '.DS_Store' -type f -delete" --priority=high

task-master add-task --prompt="Add .DS_Store to .gitignore. Ensure .DS_Store is in .gitignore to prevent future commits" --priority=high

# Phase 2: File Removal - Build Artifacts (HIGH)
task-master add-task --prompt="List all .next directories. Find all 9 .next directories as listed in CLEANUP_RECOMMENDATIONS.md" --priority=high

task-master add-task --prompt="Remove all .next directories. Delete all .next build directories: find . -name '.next' -type d -exec rm -rf {} +" --priority=high

task-master add-task --prompt="Add .next/ to .gitignore. Ensure .next/ is properly configured in .gitignore" --priority=high

# Phase 2: File Removal - Legacy Python Files (HIGH)
task-master add-task --prompt="Check references to root config.py. Verify no code imports from /config.py, should use src/api/config.py" --priority=high

task-master add-task --prompt="Check references to root main.py. Verify root main.py is not the active entry point" --priority=high

task-master add-task --prompt="Delete root config.py and main.py. Remove legacy Python files from root after verification" --priority=high

# Phase 2: File Removal - Legacy Directory (CRITICAL)
task-master add-task --prompt="Create detailed inventory of /legacy/ directory. Document all files in /legacy/ and their migration status" --priority=high

task-master add-task --prompt="Verify all legacy Python code exists in /src/. Compare functionality between /legacy/services/ and /src/core/" --priority=high

task-master add-task --prompt="Check for unique files in /legacy/ not migrated. Identify any files in /legacy/ that don't have equivalents in /src/" --priority=high

task-master add-task --prompt="Delete entire /legacy/ directory. Remove /legacy/ directory after all verifications complete" --priority=high

# Phase 2: File Removal - Package Lock Files (MEDIUM)
task-master add-task --prompt="Find all package-lock.json files. List all package-lock.json files in the project" --priority=medium

task-master add-task --prompt="Remove all package-lock.json files. Delete package-lock.json files since using pnpm" --priority=medium

task-master add-task --prompt="Verify pnpm-lock.yaml files are present. Ensure pnpm-lock.yaml exists where needed" --priority=medium

# Phase 2: File Removal - Test Outputs (MEDIUM)
task-master add-task --prompt="Check /tests/results/ directory contents. Review test output files that shouldn't be in git" --priority=medium

task-master add-task --prompt="Clean /tests/results/ directory. Remove test output .txt files from version control" --priority=medium

task-master add-task --prompt="Add tests/results/*.txt to .gitignore. Prevent test outputs from being committed" --priority=medium

# Phase 2: File Removal - Misc Files (LOW)
task-master add-task --prompt="Remove empty 'write' file from root. Delete the empty 'write' file in project root" --priority=low

task-master add-task --prompt="Remove updated_json.txt from root. Delete temporary file updated_json.txt" --priority=low

# Phase 3: File Reorganization - Scripts (MEDIUM)
task-master add-task --prompt="Move test_full_pipeline.py to /tests/. Move from components/gallery-app/aceternity-gallery-app/scripts/ to /tests/" --priority=medium

task-master add-task --prompt="Move test_model_router.py to /tests/. Move from components/gallery-app/aceternity-gallery-app/scripts/ to /tests/" --priority=medium

task-master add-task --prompt="Create /src/utils/scripts/ directory. Create directory for utility scripts" --priority=medium

task-master add-task --prompt="Move JS utility scripts to /src/utils/scripts/. Move build-cv2web-bundle.js, create-button-pages.js, extract-component.js" --priority=medium

task-master add-task --prompt="Move shell scripts to /scripts/ at root. Move operational shell scripts from gallery-app to root /scripts/" --priority=medium

# Phase 3: File Reorganization - Documentation (LOW)
task-master add-task --prompt="Create /docs/components/ directory. Create directory for component documentation" --priority=low

task-master add-task --prompt="Move component docs to /docs/components/. Move docs from components/gallery-app/aceternity-gallery-app/docs/" --priority=low

# Phase 3: File Reorganization - Test Consolidation (MEDIUM)
task-master add-task --prompt="Analyze tests in /legacy/tests/. Review all test files in legacy directory" --priority=medium

task-master add-task --prompt="Create test subdirectories structure. Create /tests/unit/, /tests/integration/, /tests/e2e/" --priority=medium

task-master add-task --prompt="Move and consolidate test files. Move tests from /legacy/tests/ to appropriate subdirectories" --priority=medium

task-master add-task --prompt="Remove duplicate test files. Identify and remove any duplicate test implementations" --priority=medium

# Phase 4: Standardization - Naming (LOW)
task-master add-task --prompt="Rename 'untitled folder' directories. Rename all untitled folders in /data/cv_examples/png_examples/" --priority=low

task-master add-task --prompt="Standardize Next.js config extensions. Decide on .js vs .mjs for Next.js configs and standardize" --priority=low

task-master add-task --prompt="Standardize Tailwind config extensions. Decide on .ts vs .js for Tailwind configs and standardize" --priority=low

# Phase 4: Standardization - Cleanup Improvements (MEDIUM)
task-master add-task --prompt="Update .gitignore with comprehensive entries. Add all recommended .gitignore entries from CLEANUP_RECOMMENDATIONS.md" --priority=medium

task-master add-task --prompt="Create cleanup.sh script. Create automated cleanup script at /scripts/cleanup.sh" --priority=medium

task-master add-task --prompt="Remove node_modules from templates. Clean node_modules from /src/templates/v1/" --priority=medium

# Phase 4: Data Directory Cleanup (MEDIUM)
task-master add-task --prompt="Analyze /data/uploads/ directory. Review 150+ uploaded files and determine cleanup strategy" --priority=medium

task-master add-task --prompt="Implement upload cleanup policy. Create policy for managing uploaded files" --priority=medium

task-master add-task --prompt="Consider database location change. Evaluate moving cv2web.db to standard location" --priority=low

# Phase 5: Validation and Testing (CRITICAL)
task-master add-task --prompt="Run pnpm run typecheck. Ensure no TypeScript errors after cleanup" --priority=high

task-master add-task --prompt="Run all Python tests. Execute pytest and comprehensive_test.py" --priority=high

task-master add-task --prompt="Test backend API functionality. Start backend and test all endpoints" --priority=high

task-master add-task --prompt="Test frontend build and dev server. Run pnpm run build and pnpm run dev" --priority=high

task-master add-task --prompt="Verify CV upload and processing. Test complete CV to portfolio generation flow" --priority=high

task-master add-task --prompt="Check git repository size reduction. Measure disk space saved and file count reduction" --priority=medium

task-master add-task --prompt="Document all changes made. Create comprehensive changelog of cleanup actions" --priority=high

task-master add-task --prompt="Commit cleanup changes. Create clean commit with all cleanup changes" --priority=high

echo ""
echo "All 57 cleanup tasks have been added to TaskMaster AI!"
echo ""
echo "Next steps:"
echo "1. Run 'task-master list' to see all tasks"
echo "2. Run 'task-master analyze-complexity --research' to analyze task complexity"
echo "3. Run 'task-master expand --all --research' to expand tasks into subtasks"