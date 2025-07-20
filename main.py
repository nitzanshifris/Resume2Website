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
from src.api.routes import cv, portfolio, sse, workflows, cv_enhanced, portfolio_generator
from src.api.routes import portfolio_generator_v2, demo_preview

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
app.include_router(portfolio.router, prefix="/api/v1")
app.include_router(portfolio_generator.router, prefix="/api/v1")  # Original portfolio generator
app.include_router(portfolio_generator_v2.router, prefix="/api/v2")  # Enhanced with template selection
# app.include_router(cv_to_portfolio.router, prefix="/api/v1")  # Deprecated - moved to legacy
app.include_router(sse.router, prefix="/api/v1")
app.include_router(workflows.router, prefix="/api/v1")
app.include_router(cv_enhanced.router)  # Enhanced CV with real-time tracking
app.include_router(demo_preview.router, prefix="/api/v1")  # Demo preview for non-authenticated users


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
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=True  # Auto-reload on code changes
    )