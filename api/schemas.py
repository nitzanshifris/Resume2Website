"""
Pydantic schemas for request/response validation
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


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