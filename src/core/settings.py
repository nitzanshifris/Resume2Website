"""
Application Settings using Pydantic Settings
Works locally with .env file and will work with AWS environment variables later
"""
import os
from typing import Optional
from pydantic import Field, AliasChoices
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings that can be configured via:
    - Environment variables
    - .env file (local development)
    - AWS Parameter Store / Secrets Manager (future)
    """
    
    # API Configuration
    api_host: str = "127.0.0.1"
    api_port: int = 2000
    api_reload: bool = True  # Set to False in production
    
    # Claude API Configuration (accepts CV_CLAUDE_API_KEY or ANTHROPIC_API_KEY)
    claude_api_key: Optional[str] = Field(
        None,
        validation_alias=AliasChoices('CV_CLAUDE_API_KEY', 'ANTHROPIC_API_KEY')
    )
    claude_model: str = "claude-4-opus"
    claude_temperature: float = 0.0
    claude_max_tokens: int = 4000
    
    # File Upload Configuration
    max_file_size_mb: int = 10
    allowed_file_types: list[str] = ["application/pdf", "application/msword", "text/plain"]
    upload_directory: str = "data/uploads"
    
    # Database Configuration
    database_url: str = "sqlite:///./data/app.db"
    
    # Session Configuration
    secret_key: str = "change-this-in-production-to-random-secret"
    session_expire_hours: int = 24
    
    # Portfolio Generation
    portfolio_base_port: int = 4000
    portfolio_max_instances: int = 20
    portfolio_cleanup_hours: int = 24
    
    # Vercel Configuration (optional)
    vercel_api_token: Optional[str] = None
    
    # Stripe Configuration (optional)
    stripe_secret_key: Optional[str] = None
    stripe_webhook_secret: Optional[str] = None
    
    # Google OAuth (optional)
    google_client_id: Optional[str] = None
    google_client_secret: Optional[str] = None
    
    # LinkedIn OAuth (optional)
    linkedin_client_id: Optional[str] = None
    linkedin_client_secret: Optional[str] = None
    
    # Environment
    environment: str = "development"  # development, staging, production
    debug: bool = True
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",  # Ignore extra fields from .env
        # Don't use prefix for validation_alias fields
        # env_prefix="CV_",
        # Load .env.local if it exists (overrides .env)
        env_file_override=".env.local"
    )
    
    @property
    def is_production(self) -> bool:
        """Check if running in production environment"""
        return self.environment == "production"
    
    @property
    def is_development(self) -> bool:
        """Check if running in development environment"""
        return self.environment == "development"


# Create a singleton instance
settings = Settings()