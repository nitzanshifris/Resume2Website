# Future-Use Code

This directory contains code that has been prepared for future features but is **NOT currently in use**.

## What's Here

### 1. **storage.py** - Storage Abstraction Layer
- **Purpose**: Abstract file storage to easily switch from local files to S3/GCS
- **When to use**: When deploying to Kubernetes or cloud
- **Usage**:
  ```python
  from src.future-use.storage import Storage
  
  # Instead of: Path("data/uploads/file.pdf")
  path = Storage.get_upload_path("file.pdf")
  await Storage.save_file(content, path)
  ```

### 2. **sandbox_cleanup.py** - Portfolio Cleanup Utility
- **Purpose**: Clean up old portfolio sandboxes to prevent disk space issues
- **When to use**: When sandboxes accumulate (check with `du -sh sandboxes/`)
- **Usage**:
  ```bash
  python3 src/future-use/sandbox_cleanup.py
  ```
- **Note**: Can be run manually or set up as a cron job

## Important Notes

⚠️ **These files are NOT imported or used anywhere in the current codebase**

When you're ready to use them:
1. Move the file back to its original location
2. Import and integrate it into your code
3. Test thoroughly

## Related Documentation

- See `/docs/K8S_PREPARATION.md` for Kubernetes deployment preparation
- See `.env.example` for all available environment variables