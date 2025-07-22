"""
Portfolio Expert API Routes

This module provides FastAPI routes for the Claude SDK portfolio domain expert
chat system. It enables users to get personalized portfolio guidance and
generation through an AI expert conversation.
"""

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import StreamingResponse
from typing import Dict, Any, Optional
import json
from datetime import datetime

from src.core.schemas.unified_nullable import CVData
from src.services.claude_portfolio_expert import ClaudePortfolioExpert
from src.utils.enhanced_sse_logger import EnhancedSSELogger, WorkflowPhase
from src.api.routes.auth import get_current_user

router = APIRouter(prefix="/api/portfolio-expert", tags=["portfolio-expert"])

# Initialize the portfolio expert service
portfolio_expert = ClaudePortfolioExpert()

@router.post("/start-session")
async def start_expert_session(
    request: Request,
    cv_data: CVData,
    user_preferences: Optional[Dict[str, Any]] = None,
    current_user: dict = Depends(get_current_user)
):
    """
    Start a new portfolio expert chat session.
    
    Args:
        cv_data: The extracted CV data from Gemini
        user_preferences: Optional user preferences for portfolio style
        current_user: Authenticated user information
        
    Returns:
        Session information and initial expert greeting
    """
    try:
        # Start expert session
        session_info = await portfolio_expert.start_expert_session(
            cv_data=cv_data,
            user_preferences=user_preferences
        )
        
        # Add user context
        session_info["user_id"] = current_user.get("user_id")
        session_info["user_email"] = current_user.get("email")
        
        return {
            "success": True,
            "session": session_info,
            "message": "Portfolio expert session started successfully"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to start expert session: {str(e)}"
        )

@router.post("/chat/{session_id}")
async def chat_with_expert(
    session_id: str,
    request: Request,
    current_user: dict = Depends(get_current_user)
):
    """
    Send a message to the portfolio expert and get a response.
    
    Args:
        session_id: The expert session ID
        request: Contains user message and session state
        current_user: Authenticated user information
        
    Returns:
        Expert response with updated session state
    """
    try:
        # Parse request body
        body = await request.json()
        user_message = body.get("message", "")
        session_state = body.get("session_state", {})
        
        if not user_message:
            raise HTTPException(
                status_code=400,
                detail="Message is required"
            )
        
        # Validate session ownership
        if session_state.get("user_id") != current_user.get("user_id"):
            raise HTTPException(
                status_code=403,
                detail="Access denied to this session"
            )
        
        # Chat with expert
        response = await portfolio_expert.chat_with_expert(
            session_id=session_id,
            user_message=user_message,
            session_state=session_state
        )
        
        return {
            "success": True,
            "response": response,
            "message": "Expert response generated successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to chat with expert: {str(e)}"
        )

@router.post("/generate-portfolio/{session_id}")
async def generate_portfolio_with_expert(
    session_id: str,
    request: Request,
    current_user: dict = Depends(get_current_user)
):
    """
    Generate a portfolio in sandbox environment using expert guidance.
    
    Args:
        session_id: The expert session ID
        request: Contains session state and generation preferences
        current_user: Authenticated user information
        
    Returns:
        Streaming response with portfolio generation progress
    """
    try:
        # Parse request body
        body = await request.json()
        session_state = body.get("session_state", {})
        generation_preferences = body.get("generation_preferences", {})
        
        # Validate session ownership
        if session_state.get("user_id") != current_user.get("user_id"):
            raise HTTPException(
                status_code=403,
                detail="Access denied to this session"
            )
        
        # Create SSE stream for portfolio generation
        async def generate_portfolio_stream():
            try:
                # Initialize SSE logger for this generation
                sse_logger = EnhancedSSELogger(
                    workflow_name="expert_portfolio_generation",
                    workflow_id=session_id
                )
                
                # Start generation phase
                sse_logger.start_phase(WorkflowPhase.GENERATION, expected_steps=5)
                
                # Send initial progress
                yield f"data: {json.dumps({'type': 'progress', 'message': 'Starting portfolio generation with expert guidance...', 'percentage': 0})}\n\n"
                
                # Generate portfolio in sandbox
                async for progress_update in portfolio_expert.generate_portfolio_in_sandbox(
                    session_id=session_id,
                    session_state=session_state,
                    generation_preferences=generation_preferences
                ):
                    # Forward progress updates as SSE events
                    yield f"data: {json.dumps(progress_update)}\n\n"
                
                # Send completion event
                yield f"data: {json.dumps({'type': 'complete', 'message': 'Portfolio generation completed successfully'})}\n\n"
                
            except Exception as e:
                # Send error event
                error_data = {
                    'type': 'error',
                    'message': f'Portfolio generation failed: {str(e)}',
                    'timestamp': datetime.now().isoformat()
                }
                yield f"data: {json.dumps(error_data)}\n\n"
            
            finally:
                # Send done signal
                yield "data: [DONE]\n\n"
        
        # Return streaming response
        return StreamingResponse(
            generate_portfolio_stream(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no"
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to start portfolio generation: {str(e)}"
        )

@router.get("/session/{session_id}/status")
async def get_session_status(
    session_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Get the current status of an expert session.
    
    Args:
        session_id: The expert session ID
        current_user: Authenticated user information
        
    Returns:
        Session status and metadata
    """
    try:
        # Get session status from expert service
        status = await portfolio_expert.get_session_status(session_id)
        
        # Validate session ownership
        if status.get("user_id") != current_user.get("user_id"):
            raise HTTPException(
                status_code=403,
                detail="Access denied to this session"
            )
        
        return {
            "success": True,
            "status": status,
            "message": "Session status retrieved successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get session status: {str(e)}"
        )

@router.delete("/session/{session_id}")
async def end_expert_session(
    session_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    End an expert session and clean up resources.
    
    Args:
        session_id: The expert session ID
        current_user: Authenticated user information
        
    Returns:
        Confirmation of session termination
    """
    try:
        # End the expert session
        result = await portfolio_expert.end_session(session_id)
        
        return {
            "success": True,
            "result": result,
            "message": "Expert session ended successfully"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to end session: {str(e)}"
        )

@router.get("/capabilities")
async def get_expert_capabilities():
    """
    Get information about the portfolio expert's capabilities.
    
    Returns:
        Expert capabilities and supported features
    """
    try:
        capabilities = {
            "specializations": portfolio_expert.expert_config["specializations"],
            "supported_industries": portfolio_expert.expert_config["supported_industries"],
            "portfolio_types": portfolio_expert.expert_config["portfolio_types"],
            "features": [
                "CV analysis and insights",
                "Personalized portfolio guidance",
                "Industry-specific recommendations",
                "Real-time chat interaction",
                "Sandboxed portfolio generation",
                "Template customization advice",
                "Performance optimization suggestions"
            ],
            "technology_stack": [
                "Next.js 15",
                "TypeScript",
                "Tailwind CSS v4",
                "Aceternity UI components",
                "Magic UI components",
                "Framer Motion animations"
            ]
        }
        
        return {
            "success": True,
            "capabilities": capabilities,
            "message": "Expert capabilities retrieved successfully"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get capabilities: {str(e)}"
        )