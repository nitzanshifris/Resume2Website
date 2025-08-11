"""
Simple configuration for RESUME2WEBSITE MVP
"""
import os

# Environment
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
DEBUG = ENVIRONMENT == "development"

# Server
PORT = int(os.getenv("BACKEND_PORT", "2000"))
HOST = os.getenv("BACKEND_HOST", "127.0.0.1")

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
DATABASE_PATH = os.getenv("DATABASE_PATH", "data/resume2website.db")
SESSION_EXPIRY_DAYS = int(os.getenv("SESSION_EXPIRY_DAYS", "7"))

# Paths - Configurable for K8s volume mounts
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.getenv("UPLOAD_PATH", "data/uploads")
OUTPUT_DIR = os.getenv("OUTPUT_PATH", "data/outputs")
SANDBOXES_DIR = os.getenv("PORTFOLIO_PATH", "sandboxes")

# Portfolio Generation
PORTFOLIO_START_PORT = int(os.getenv("PORTFOLIO_START_PORT", "4000"))
PORTFOLIO_END_PORT = int(os.getenv("PORTFOLIO_END_PORT", "5000"))
PORTFOLIO_MAX_INSTANCES = int(os.getenv("MAX_PORTFOLIOS", "20"))
PORTFOLIO_CLEANUP_HOURS = int(os.getenv("CLEANUP_HOURS", "24"))

# AI Models - Using Claude 4 Opus for maximum determinism
PRIMARY_MODEL = "claude-opus-4-20250514"  # Claude 4 Opus for deterministic extraction
FALLBACK_MODEL = "claude-opus-4-20250514"  # Also Claude 4 Opus as fallback
GEMINI_MODEL = "gemini-2.5-flash"  # Keeping for legacy compatibility but not used

# Deterministic extraction settings
EXTRACTION_TEMPERATURE = 0.0  # Maximum determinism
EXTRACTION_TOP_P = 0.1  # Restrict token selection
EXTRACTION_MAX_TOKENS = 4000