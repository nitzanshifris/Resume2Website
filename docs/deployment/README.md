# Deployment Documentation

This directory contains documentation and templates for deploying RESUME2WEBSITE to production.

## Contents

### `.env.example`
Template showing all available environment variables. Copy this to `.env` when deploying:
```bash
cp docs/deployment/.env.example .env
# Edit .env with your production values
```

### `K8S_PREPARATION.md`
Documentation on the changes made to prepare the codebase for Kubernetes deployment.

## Current Status

The application is **development-ready** with preparations for future production deployment.

### What's Ready
- ✅ All hardcoded values moved to environment variables
- ✅ Database path configurable via DATABASE_URL
- ✅ Storage paths configurable for volume mounts
- ✅ Port ranges configurable

### What's Prepared (Not Active)
- Storage abstraction for S3/GCS (in `src/future-use/storage.py`)
- Sandbox cleanup utility (in `src/future-use/sandbox_cleanup.py`)

## When Deploying to Production

1. Copy and configure environment variables
2. Move storage.py from future-use and integrate S3/GCS
3. Set up cleanup jobs for sandboxes
4. Configure Kubernetes manifests using the env vars