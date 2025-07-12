# Scripts Directory

This directory contains all utility and runner scripts for the project.

## Structure

### `/runners/`
Scripts for running various parts of the application:
- `run_backend.sh` - Starts the backend server
- `run_gallery_app.py` - Runs the gallery application
- `run_model_router.sh` - Starts the model router
- `start_cv2web.sh` - Main startup script
- `start_gallery.sh` - Gallery startup script
- `start-dev.sh` - Development environment startup
- `stop_cv2web.sh` - Stops all services

### `/utilities/`
Utility scripts for maintenance and fixes:
- `fix-imports.sh` - Fixes import statements
- `fix-generated-project.sh` - Fixes generated project issues
- `monitor_system.py` - System monitoring utility

## Usage

To run any script from the project root:
```bash
./scripts/runners/start_cv2web.sh
```

For utilities:
```bash
./scripts/utilities/fix-imports.sh
```

## Notes
- All scripts should be run from the project root directory
- Make sure scripts have execute permissions: `chmod +x script-name.sh`
- Python scripts can be run with: `python scripts/script-name.py`