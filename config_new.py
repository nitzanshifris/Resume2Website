"""
Configuration for RESUME2WEBSITE using Pydantic Settings
This file provides backwards compatibility with the old config.py
"""
from src.core.settings import settings

# Environment
ENVIRONMENT = settings.environment
DEBUG = settings.debug

# Server
PORT = settings.api_port
HOST = settings.api_host

# CORS
ALLOWED_ORIGINS = [
    "http://localhost:3000",  # React default
    "http://localhost:3001",  # React alternative
    "http://localhost:3019",  # Reef's custom port
    "http://localhost:5173",  # Vite default
    "http://127.0.0.1:3000",  # Local IP variant
    "http://127.0.0.1:3001",  # Local IP variant
]

# File Upload
MAX_UPLOAD_SIZE = settings.max_file_size_mb * 1024 * 1024  # Convert MB to bytes
UPLOAD_TIMEOUT = 1.0 if settings.debug else 10.0

ALLOWED_EXTENSIONS = {
    # Documents
    '.pdf', '.docx', '.doc', '.txt', '.md', '.rtf', '.odt',
    # Web
    '.html', '.htm',
    # Images (for OCR)
    '.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif', '.tiff', '.tif', '.bmp'
}

# Database
DATABASE_PATH = settings.database_url.replace("sqlite:///./", "")
SESSION_EXPIRY_DAYS = settings.session_expire_hours // 24  # Convert hours to days

# Paths
import os
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = settings.upload_directory
OUTPUT_DIR = "data/outputs"  # Keep as is for now
SANDBOXES_DIR = "sandboxes"  # Keep as is for now

# Portfolio Generation
PORTFOLIO_START_PORT = settings.portfolio_base_port
PORTFOLIO_END_PORT = settings.portfolio_base_port + 1000  # Default range
PORTFOLIO_MAX_INSTANCES = settings.portfolio_max_instances
PORTFOLIO_CLEANUP_HOURS = settings.portfolio_cleanup_hours

# API Keys and Secrets (now properly managed)
SECRET_KEY = settings.secret_key
CLAUDE_API_KEY = settings.claude_api_key
VERCEL_API_TOKEN = settings.vercel_api_token
STRIPE_SECRET_KEY = settings.stripe_secret_key
STRIPE_WEBHOOK_SECRET = settings.stripe_webhook_secret
GOOGLE_CLIENT_ID = settings.google_client_id
GOOGLE_CLIENT_SECRET = settings.google_client_secret
LINKEDIN_CLIENT_ID = settings.linkedin_client_id
LINKEDIN_CLIENT_SECRET = settings.linkedin_client_secret

# Export the settings object for direct use
app_settings = settings