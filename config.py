"""
Simple configuration for CV2WEB MVP
"""
import os

# Environment
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
DEBUG = ENVIRONMENT == "development"

# Server
PORT = 2000
HOST = "127.0.0.1"

# CORS
ALLOWED_ORIGINS = [
    "http://localhost:3000",  # React default
    "http://localhost:3001",  # React alternative
    "http://localhost:5173",  # Vite default
]

# File Upload
MAX_UPLOAD_SIZE = 10 * 1024 * 1024  # 10MB
UPLOAD_TIMEOUT = 1.0 if DEBUG else 10.0  # 1 second in dev, 10 in production

ALLOWED_EXTENSIONS = {
    # Documents
    '.pdf', '.docx', '.doc', '.txt', '.md', '.rtf', '.odt',
    # Web
    '.html', '.htm',
    # Images (for OCR)
    '.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif', '.tiff', '.tif', '.bmp'
}

# Database
DATABASE_PATH = "data/cv2web.db"
SESSION_EXPIRY_DAYS = 7

# Paths
UPLOAD_DIR = "data/uploads"
OUTPUT_DIR = "data/outputs"

# AI Models
GEMINI_MODEL = "gemini-2.5-flash"
CLAUDE_MODEL = "claude-3-5-sonnet-20241022"