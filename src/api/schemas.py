"""
Pydantic schemas for request/response validation.

This module defines all request and response models for the CV2WEB API.
"""
from pydantic import BaseModel, EmailStr, Field


# ========== REQUEST MODELS ==========

class UserCreate(BaseModel):
    """Schema for user registration"""
    email: EmailStr
    password: str = Field(min_length=8, max_length=100, description="At least 8 characters")
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "password": "secure_password123"
            }
        }


class UserLogin(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "password": "secure_password123"
            }
        }


# ========== RESPONSE MODELS ==========

class SessionResponse(BaseModel):
    """Response after successful registration/login"""
    message: str
    session_id: str
    user_id: str


class UploadResponse(BaseModel):
    """Response after successful file upload"""
    message: str
    job_id: str


class ErrorResponse(BaseModel):
    """Standard error response"""
    detail: str


class CleanupResponse(BaseModel):
    """Response after cleanup operation"""
    status: str
    deleted_sessions: int
    cutoff_date: str


# ========== PORTFOLIO MODELS ==========

class PortfolioGenerationRequest(BaseModel):
    """Request for portfolio generation"""
    cv_id: str = Field(..., description="ID of the CV to use")
    template: str = Field(default="modern", description="Portfolio template to use")
    include_magic_ui: bool = Field(default=True, description="Use Magic UI components")
    
    class Config:
        json_schema_extra = {
            "example": {
                "cv_id": "123e4567-e89b-12d3-a456-426614174000",
                "template": "modern",
                "include_magic_ui": True
            }
        }


class PortfolioGenerationResponse(BaseModel):
    """Response after portfolio generation"""
    status: str
    portfolio_id: str
    download_url: str
    preview_url: str
    message: str