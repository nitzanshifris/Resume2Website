"""
Authentication dependencies for FastAPI
"""
from fastapi import Depends, HTTPException, Header
from typing import Optional
import os
import logging

# Import database function
from api.db import get_user_id_from_session

logger = logging.getLogger(__name__)

# Check environment
IS_DEVELOPMENT = os.getenv("ENV", "development") == "development"


async def get_current_user(
    session_id: Optional[str] = Header(None, alias="X-Session-ID")
) -> str:
    """
    Get current user ID from session.
    In development: returns test user
    In production: validates session
    
    Returns:
        user_id string
        
    Raises:
        HTTPException 401 if unauthorized
    """
    if IS_DEVELOPMENT:
        logger.debug("Development mode - using dev user")
        return "dev-user-123"
    
    # Production - require valid session
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
    
    return user_id


# Future: Add more auth helpers here
# async def get_current_user_optional(...) -> Optional[str]:
# async def require_admin(...) -> str:
# async def get_api_key(...) -> str: