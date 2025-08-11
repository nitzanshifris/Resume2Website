"""
User authentication endpoints for CV2WEB
Handles registration, login, logout, and session management
"""
from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict, Any
import logging
from datetime import datetime
import os
import requests
import json
from dotenv import load_dotenv
from passlib.context import CryptContext

# Load environment variables
load_dotenv()

# Import database functions
from src.api.db import (
    create_user,
    get_user_by_email,
    create_session,
    delete_session,
    get_user_id_from_session,
    get_db_connection
)

logger = logging.getLogger(__name__)

# Create router
router = APIRouter(tags=["Authentication"])


# Request/Response models
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    name: str = Field(..., min_length=1)
    phone: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    user_id: str
    email: str
    name: Optional[str]
    phone: Optional[str]
    created_at: str


class AuthResponse(BaseModel):
    user: UserResponse
    session_id: str
    message: str


# Create password context with bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """Hash password using bcrypt for secure storage"""
    return pwd_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    """Verify password against bcrypt hash"""
    try:
        # Try bcrypt verification first
        return pwd_context.verify(password, password_hash)
    except:
        # Fallback for old SHA256 hashes (for backward compatibility)
        import hashlib
        sha256_hash = hashlib.sha256(password.encode()).hexdigest()
        if sha256_hash == password_hash:
            # Password is correct but using old hash, should be updated
            logger.warning("User has old SHA256 password hash, should be migrated to bcrypt")
            return True
        return False


@router.post("/register", response_model=AuthResponse)
async def register(request: RegisterRequest):
    """Register a new user"""
    try:
        # Check if email already exists
        existing_user = get_user_by_email(request.email)
        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )
        
        # Hash password
        password_hash = hash_password(request.password)
        
        # Create user
        user_id = create_user(
            email=request.email,
            password_hash=password_hash,
            name=request.name,
            phone=request.phone
        )
        
        # Create session
        session_id = create_session(user_id)
        
        # Get user data for response
        user_data = get_user_by_email(request.email)
        
        logger.info(f"New user registered: {request.email}")
        
        return AuthResponse(
            user=UserResponse(
                user_id=user_data['user_id'],
                email=user_data['email'],
                name=user_data.get('name'),
                phone=user_data.get('phone'),
                created_at=user_data['created_at']
            ),
            session_id=session_id,
            message="Registration successful"
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        raise HTTPException(status_code=500, detail="Registration failed")


@router.post("/login", response_model=AuthResponse)
async def login(request: LoginRequest):
    """Login existing user"""
    try:
        # Get user by email
        user = get_user_by_email(request.email)
        if not user:
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )
        
        # Verify password
        if not verify_password(request.password, user['password_hash']):
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )
        
        # Create session
        session_id = create_session(user['user_id'])
        
        logger.info(f"User logged in: {request.email}")
        
        return AuthResponse(
            user=UserResponse(
                user_id=user['user_id'],
                email=user['email'],
                name=user.get('name'),
                phone=user.get('phone'),
                created_at=user['created_at']
            ),
            session_id=session_id,
            message="Login successful"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(status_code=500, detail="Login failed")


@router.post("/logout")
async def logout(session_id: Optional[str] = Header(None, alias="X-Session-ID")):
    """Logout user by deleting session"""
    try:
        if session_id:
            delete_session(session_id)
            logger.info(f"User logged out, session deleted: {session_id}")
        return {"message": "Logout successful"}
    except Exception as e:
        logger.error(f"Logout error: {str(e)}")
        # Don't fail logout, just log the error
        return {"message": "Logout completed"}


@router.get("/auth/me", response_model=UserResponse)
async def get_current_user(session_id: Optional[str] = Header(None, alias="X-Session-ID")):
    """Get current user from session"""
    try:
        if not session_id:
            raise HTTPException(
                status_code=401,
                detail="No session provided"
            )
            
        # Get user ID from session
        user_id = get_user_id_from_session(session_id)
        if not user_id:
            raise HTTPException(
                status_code=401,
                detail="Invalid or expired session"
            )
        
        # Get user data
        conn = get_db_connection()
        cursor = conn.execute(
            "SELECT user_id, email, name, phone, created_at FROM users WHERE user_id = ?",
            (user_id,)
        )
        user = cursor.fetchone()
        conn.close()
        
        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )
        
        return UserResponse(
            user_id=user['user_id'],
            email=user['email'],
            name=user['name'],
            phone=user['phone'],
            created_at=user['created_at']
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get user error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get user")


@router.get("/auth/google/status")
async def google_auth_status():
    """Check if Google OAuth is available"""
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    client_secret = os.getenv("GOOGLE_CLIENT_SECRET")
    
    if not client_id:
        return {
            "available": False,
            "message": "Google OAuth not configured. Please set GOOGLE_CLIENT_ID.",
            "client_secret_configured": False
        }
    
    if not client_secret:
        return {
            "available": False,
            "message": "Google OAuth client ID configured but client secret missing.",
            "client_secret_configured": False
        }
    
    return {
        "available": True,
        "message": "Google OAuth is configured and ready.",
        "client_secret_configured": True
    }


# Google OAuth callback request model
class GoogleCallbackRequest(BaseModel):
    code: str
    redirect_uri: str


@router.post("/auth/google/callback", response_model=AuthResponse)
async def google_auth_callback(request: GoogleCallbackRequest):
    """
    Handle Google OAuth callback
    Exchange authorization code for tokens and create/login user
    """
    try:
        client_id = os.getenv("GOOGLE_CLIENT_ID")
        client_secret = os.getenv("GOOGLE_CLIENT_SECRET")
        
        if not client_id or not client_secret:
            raise HTTPException(
                status_code=500,
                detail="Google OAuth is not configured. Please contact support."
            )
        
        # Exchange authorization code for tokens
        token_url = "https://oauth2.googleapis.com/token"
        token_data = {
            "code": request.code,
            "client_id": client_id,
            "client_secret": client_secret,
            "redirect_uri": request.redirect_uri,
            "grant_type": "authorization_code"
        }
        
        token_response = requests.post(token_url, data=token_data)
        
        if not token_response.ok:
            logger.error(f"Token exchange failed: {token_response.text}")
            raise HTTPException(
                status_code=400,
                detail="Failed to exchange authorization code"
            )
        
        tokens = token_response.json()
        access_token = tokens.get("access_token")
        
        if not access_token:
            raise HTTPException(
                status_code=400,
                detail="No access token received from Google"
            )
        
        # Get user info from Google
        user_info_url = "https://www.googleapis.com/oauth2/v2/userinfo"
        headers = {"Authorization": f"Bearer {access_token}"}
        user_info_response = requests.get(user_info_url, headers=headers)
        
        if not user_info_response.ok:
            logger.error(f"Failed to get user info: {user_info_response.text}")
            raise HTTPException(
                status_code=400,
                detail="Failed to get user information from Google"
            )
        
        google_user = user_info_response.json()
        email = google_user.get("email")
        name = google_user.get("name")
        google_id = google_user.get("id")
        
        if not email:
            raise HTTPException(
                status_code=400,
                detail="Email not provided by Google"
            )
        
        # Check if user exists
        existing_user = get_user_by_email(email)
        
        if existing_user:
            # User exists, create session
            user_id = existing_user["user_id"]
            logger.info(f"Existing user logged in via Google: {email}")
        else:
            # Create new user with Google OAuth
            # Generate a random password (user won't use it for Google login)
            random_password = hashlib.sha256(f"{google_id}{datetime.utcnow().isoformat()}".encode()).hexdigest()
            
            user_id = create_user(
                email=email,
                password_hash=random_password,  # Random password for Google users
                name=name,
                phone=None
            )
            logger.info(f"New user registered via Google: {email}")
        
        # Create session
        session_id = create_session(user_id)
        
        # Get user data for response
        user_data = get_user_by_email(email)
        
        return AuthResponse(
            user=UserResponse(
                user_id=user_data['user_id'],
                email=user_data['email'],
                name=user_data.get('name'),
                phone=user_data.get('phone'),
                created_at=user_data['created_at']
            ),
            session_id=session_id,
            message="Google authentication successful"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Google OAuth error: {str(e)}")
        raise HTTPException(status_code=500, detail="Google authentication failed")


@router.get("/auth/facebook/status")
async def facebook_auth_status():
    """Check if Facebook OAuth is available"""
    app_id = os.getenv("FACEBOOK_APP_ID")
    app_secret = os.getenv("FACEBOOK_APP_SECRET")
    
    if not app_id:
        return {
            "available": False,
            "message": "Facebook OAuth not configured. Please set FACEBOOK_APP_ID.",
            "app_secret_configured": False
        }
    
    if not app_secret:
        return {
            "available": False,
            "message": "Facebook OAuth app ID configured but app secret missing.",
            "app_secret_configured": False
        }
    
    return {
        "available": True,
        "message": "Facebook OAuth is configured and ready.",
        "app_secret_configured": True
    }


# Facebook OAuth callback request model
class FacebookCallbackRequest(BaseModel):
    code: str
    redirect_uri: str


@router.post("/auth/facebook/callback", response_model=AuthResponse)
async def facebook_auth_callback(request: FacebookCallbackRequest):
    """
    Handle Facebook OAuth callback
    Exchange authorization code for tokens and create/login user
    """
    try:
        app_id = os.getenv("FACEBOOK_APP_ID")
        app_secret = os.getenv("FACEBOOK_APP_SECRET")
        
        if not app_id or not app_secret:
            raise HTTPException(
                status_code=500,
                detail="Facebook OAuth is not configured. Please contact support."
            )
        
        # Exchange authorization code for access token
        token_url = "https://graph.facebook.com/v18.0/oauth/access_token"
        token_params = {
            "client_id": app_id,
            "client_secret": app_secret,
            "code": request.code,
            "redirect_uri": request.redirect_uri
        }
        
        token_response = requests.get(token_url, params=token_params)
        
        if not token_response.ok:
            logger.error(f"Facebook token exchange failed: {token_response.text}")
            raise HTTPException(
                status_code=400,
                detail="Failed to exchange authorization code"
            )
        
        tokens = token_response.json()
        access_token = tokens.get("access_token")
        
        if not access_token:
            raise HTTPException(
                status_code=400,
                detail="No access token received from Facebook"
            )
        
        # Get user info from Facebook
        user_info_url = "https://graph.facebook.com/v18.0/me"
        user_params = {
            "fields": "id,name,email",
            "access_token": access_token
        }
        user_info_response = requests.get(user_info_url, params=user_params)
        
        if not user_info_response.ok:
            logger.error(f"Failed to get Facebook user info: {user_info_response.text}")
            raise HTTPException(
                status_code=400,
                detail="Failed to get user information from Facebook"
            )
        
        facebook_user = user_info_response.json()
        email = facebook_user.get("email")
        name = facebook_user.get("name")
        facebook_id = facebook_user.get("id")
        
        if not email:
            # Facebook doesn't always provide email, create one from ID
            email = f"fb_{facebook_id}@cv2web.local"
            logger.info(f"Facebook user without email, using: {email}")
        
        # Check if user exists
        existing_user = get_user_by_email(email)
        
        if existing_user:
            # User exists, create session
            user_id = existing_user["user_id"]
            logger.info(f"Existing user logged in via Facebook: {email}")
        else:
            # Create new user with Facebook OAuth
            # Generate a random password (user won't use it for Facebook login)
            random_password = hashlib.sha256(f"{facebook_id}{datetime.utcnow().isoformat()}".encode()).hexdigest()
            
            user_id = create_user(
                email=email,
                password_hash=random_password,  # Random password for Facebook users
                name=name,
                phone=None
            )
            logger.info(f"New user registered via Facebook: {email}")
        
        # Create session
        session_id = create_session(user_id)
        
        # Get user data for response
        user_data = get_user_by_email(email)
        
        return AuthResponse(
            user=UserResponse(
                user_id=user_data['user_id'],
                email=user_data['email'],
                name=user_data.get('name'),
                phone=user_data.get('phone'),
                created_at=user_data['created_at']
            ),
            session_id=session_id,
            message="Facebook authentication successful"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Facebook OAuth error: {str(e)}")
        raise HTTPException(status_code=500, detail="Facebook authentication failed")


@router.get("/auth/linkedin/status")
async def linkedin_auth_status():
    """Check if LinkedIn OAuth is available"""
    client_id = os.getenv("LINKEDIN_CLIENT_ID")
    client_secret = os.getenv("LINKEDIN_CLIENT_SECRET")
    
    if not client_id:
        return {
            "available": False,
            "message": "LinkedIn OAuth not configured. Please set LINKEDIN_CLIENT_ID.",
            "client_secret_configured": False
        }
    
    if not client_secret:
        return {
            "available": False,
            "message": "LinkedIn OAuth client ID configured but client secret missing.",
            "client_secret_configured": False
        }
    
    return {
        "available": True,
        "message": "LinkedIn OAuth is configured and ready.",
        "client_secret_configured": True
    }


# LinkedIn OAuth callback request model
class LinkedInCallbackRequest(BaseModel):
    code: str
    redirect_uri: str


@router.post("/auth/linkedin/callback", response_model=AuthResponse)
async def linkedin_auth_callback(request: LinkedInCallbackRequest):
    """
    Handle LinkedIn OAuth callback
    Exchange authorization code for tokens and create/login user
    """
    try:
        client_id = os.getenv("LINKEDIN_CLIENT_ID")
        client_secret = os.getenv("LINKEDIN_CLIENT_SECRET")
        
        if not client_id or not client_secret:
            raise HTTPException(
                status_code=500,
                detail="LinkedIn OAuth is not configured. Please contact support."
            )
        
        # Exchange authorization code for access token
        token_url = "https://www.linkedin.com/oauth/v2/accessToken"
        token_data = {
            "grant_type": "authorization_code",
            "code": request.code,
            "client_id": client_id,
            "client_secret": client_secret,
            "redirect_uri": request.redirect_uri
        }
        
        headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        }
        
        token_response = requests.post(token_url, data=token_data, headers=headers)
        
        if not token_response.ok:
            logger.error(f"LinkedIn token exchange failed: {token_response.text}")
            raise HTTPException(
                status_code=400,
                detail="Failed to exchange authorization code"
            )
        
        tokens = token_response.json()
        access_token = tokens.get("access_token")
        
        if not access_token:
            raise HTTPException(
                status_code=400,
                detail="No access token received from LinkedIn"
            )
        
        # Get user info from LinkedIn
        # Using LinkedIn API v2 with OpenID Connect
        user_info_url = "https://api.linkedin.com/v2/userinfo"
        headers = {
            "Authorization": f"Bearer {access_token}"
        }
        user_info_response = requests.get(user_info_url, headers=headers)
        
        if not user_info_response.ok:
            logger.error(f"Failed to get LinkedIn user info: {user_info_response.text}")
            raise HTTPException(
                status_code=400,
                detail="Failed to get user information from LinkedIn"
            )
        
        linkedin_user = user_info_response.json()
        email = linkedin_user.get("email")
        name = linkedin_user.get("name")
        linkedin_id = linkedin_user.get("sub")  # sub is the unique identifier in OpenID
        
        if not email:
            # LinkedIn should always provide email with OpenID Connect
            # But just in case, create a fallback
            email = f"linkedin_{linkedin_id}@cv2web.local"
            logger.info(f"LinkedIn user without email, using: {email}")
        
        # Check if user exists
        existing_user = get_user_by_email(email)
        
        if existing_user:
            # User exists, create session
            user_id = existing_user["user_id"]
            logger.info(f"Existing user logged in via LinkedIn: {email}")
        else:
            # Create new user with LinkedIn OAuth
            # Generate a random password (user won't use it for LinkedIn login)
            random_password = hashlib.sha256(f"{linkedin_id}{datetime.utcnow().isoformat()}".encode()).hexdigest()
            
            user_id = create_user(
                email=email,
                password_hash=random_password,  # Random password for LinkedIn users
                name=name,
                phone=None
            )
            logger.info(f"New user registered via LinkedIn: {email}")
        
        # Create session
        session_id = create_session(user_id)
        
        # Get user data for response
        user_data = get_user_by_email(email)
        
        return AuthResponse(
            user=UserResponse(
                user_id=user_data['user_id'],
                email=user_data['email'],
                name=user_data.get('name'),
                phone=user_data.get('phone'),
                created_at=user_data['created_at']
            ),
            session_id=session_id,
            message="LinkedIn authentication successful"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"LinkedIn OAuth error: {str(e)}")
        raise HTTPException(status_code=500, detail="LinkedIn authentication failed")