"""
CV2WEB API - Main Application (MVP)
"""
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import config

# Load environment variables
load_dotenv()

# Import our routes
from src.api.routes import cv, sse, workflows, cv_enhanced, portfolio_generator
from src.api.routes.future_use import portfolio_generator_v2, demo_preview
# from src.api.routes.archived import portfolio  # Archived - replaced by portfolio_generator

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="CV2WEB MVP",
    version="0.1.0",
    description="Convert CVs to Portfolio Websites"
)

# Add CORS middleware - essential for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(cv.router, prefix="/api/v1")
# app.include_router(portfolio.router, prefix="/api/v1")  # Archived - deprecated, replaced by portfolio_generator
app.include_router(portfolio_generator.router, prefix="/api/v1")  # Main portfolio generation
app.include_router(portfolio_generator_v2.router, prefix="/api/v2")  # V2 API - ready for future use
app.include_router(sse.router, prefix="/api/v1")
app.include_router(workflows.router, prefix="/api/v1")
app.include_router(cv_enhanced.router)  # Enhanced CV with real-time tracking
app.include_router(demo_preview.router, prefix="/api/v1")  # Demo preview - future use


# Root endpoint
@app.get("/")
def read_root():
    """Root endpoint - health check"""
    return {
        "message": "CV2WEB API is running",
        "version": "0.1.0",
        "docs": "/docs"
    }

# Health check endpoint
@app.get("/health")
def health_check():
    """Simple health check"""
    return {"status": "healthy"}

# Run the app
if __name__ == "__main__":
    import uvicorn
    
    # Get host and port from config
    host = config.HOST
    port = config.PORT
    
    logger.info(f"Starting CV2WEB API on {host}:{port}")
    
    # Configure reload with exclusions to prevent watchfiles overload
    def get_reload_excludes():
        """Read reload exclusions from .watchmanconfig for consistency"""
        try:
            import json
            with open('.watchmanconfig', 'r') as f:
                config = json.load(f)
                return config.get('ignore_dirs', [])
        except Exception as e:
            logger.warning(f"Could not read .watchmanconfig: {e}. Using defaults.")
            # Fallback to essential excludes
            return [
                "sandboxes/*",
                "data/*",
                "**/node_modules/*",
                "**/.next/*",
                "venv/*"
            ]
    
    reload_excludes = get_reload_excludes()
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=True,  # Auto-reload on code changes
        reload_excludes=reload_excludes  # Exclude heavy directories
    )