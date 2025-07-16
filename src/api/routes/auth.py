"""
Authentication dependencies for FastAPI
"""
from fastapi import Depends, HTTPException, Header
from typing import Optional
import os
import logging

# Import database function
from src.api.db import get_user_id_from_session

logger = logging.getLogger(__name__)

# Check environment
IS_DEVELOPMENT = os.getenv("ENV", "development") == "development"


async def get_current_user(
    session_id: Optional[str] = Header(None, alias="X-Session-ID")
) -> str:
    """
    Get current user ID from session.
    Always validates session for authenticated endpoints.
    
    Returns:
        user_id string
        
    Raises:
        HTTPException 401 if unauthorized
    """
    # Always require valid session for authenticated endpoints
    if not session_id:
        raise HTTPException(
            status_code=401, 
            detail="Session ID required"
        )
    
    # Validate session (this is still synchronous)
    user_id = get_user_id_from_session(session_id)
    if not user_id:
        raise HTTPException(
            status_code=401, 
            detail="Invalid session. Please login"
        )
    
    logger.debug(f"Authenticated user: {user_id}")
    return user_id


# SSE-specific authentication
async def get_current_user_for_sse(
    session_id: Optional[str] = Header(None, alias="X-Session-ID"),
    connection_token: Optional[str] = Header(None, alias="X-Connection-Token")
) -> dict:
    """
    Enhanced authentication for SSE connections
    
    Returns:
        dict with user_id, connection_info, and permissions
        
    Raises:
        HTTPException 401/403 if unauthorized
    """
    # Get base user authentication
    user_id = await get_current_user(session_id)
    
    # Create connection info
    connection_info = {
        "user_id": user_id,
        "session_id": session_id,
        "connection_token": connection_token,
        "permissions": {
            "can_stream_cv_extraction": True,
            "can_stream_portfolio_generation": True,
            "can_monitor_sandbox": True,
            "max_concurrent_connections": 5
        }
    }
    
    # In development, allow all permissions
    if IS_DEVELOPMENT:
        logger.debug(f"SSE auth for dev user: {user_id}")
        return connection_info
    
    # Production: Add additional SSE-specific checks
    # Check if user has SSE permissions (could be based on subscription tier)
    # For now, all authenticated users can use SSE
    
    logger.info(f"SSE authentication successful for user: {user_id}")
    return connection_info


async def get_current_user_optional(
    session_id: Optional[str] = Header(None, alias="X-Session-ID")
) -> Optional[str]:
    """
    Optional authentication - returns None if no auth provided
    Useful for public SSE streams or optional features
    """
    if not session_id:
        return None
    
    try:
        return await get_current_user(session_id)
    except HTTPException:
        return None


async def require_admin(
    session_id: Optional[str] = Header(None, alias="X-Session-ID")
) -> str:
    """
    Admin-only authentication
    TODO: Implement admin role checking
    """
    user_id = await get_current_user(session_id)
    
    # TODO: Check if user has admin role in database
    # For now, only allow in development
    if not IS_DEVELOPMENT:
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )
    
    return user_id


def validate_sse_permissions(auth_info: dict, required_permission: str) -> bool:
    """
    Validate SSE-specific permissions
    
    Args:
        auth_info: Result from get_current_user_for_sse
        required_permission: Permission key to check
        
    Returns:
        bool: True if permission granted
    """
    permissions = auth_info.get("permissions", {})
    return permissions.get(required_permission, False)