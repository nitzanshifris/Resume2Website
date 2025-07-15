"""
Server-Sent Events (SSE) Service for CV2WEB
Handles real-time streaming of CV processing updates
"""

import json
import asyncio
import uuid
from datetime import datetime
from typing import Dict, Any, Optional, AsyncGenerator, List, Literal
from dataclasses import dataclass, asdict
from queue import Queue
import logging
from contextlib import asynccontextmanager

logger = logging.getLogger(__name__)

# Message Types
MessageType = Literal["progress", "step", "complete", "error", "warning", "heartbeat", "sentinel"]
SentinelType = Literal["CLOSED", "TIMEOUT", "ERROR", "COMPLETE"]

@dataclass
class SSEMessage:
    """Standardized SSE message structure"""
    id: str
    type: MessageType
    timestamp: str
    data: Dict[str, Any]
    
    def to_sse_format(self) -> str:
        """Convert to SSE format: id, event, data"""
        sse_lines = [
            f"id: {self.id}",
            f"event: {self.type}",
            f"data: {json.dumps(self.data)}",
            ""  # Empty line to end the message
        ]
        return "\n".join(sse_lines) + "\n"


class ConnectionManager:
    """Manages active SSE connections"""
    
    def __init__(self):
        self.connections: Dict[str, Queue] = {}
        self.heartbeat_interval = 30  # seconds
        
    def add_connection(self, connection_id: str) -> Queue:
        """Add new SSE connection"""
        message_queue = Queue()
        self.connections[connection_id] = message_queue
        logger.info(f"SSE connection added: {connection_id}")
        return message_queue
    
    def remove_connection(self, connection_id: str):
        """Remove SSE connection"""
        if connection_id in self.connections:
            del self.connections[connection_id]
            logger.info(f"SSE connection removed: {connection_id}")
    
    def broadcast_message(self, message: SSEMessage):
        """Broadcast message to all connections"""
        for queue in self.connections.values():
            try:
                queue.put_nowait(message)
            except Exception as e:
                logger.warning(f"Failed to queue message: {e}")
    
    def send_to_connection(self, connection_id: str, message: SSEMessage):
        """Send message to specific connection"""
        if connection_id in self.connections:
            try:
                self.connections[connection_id].put_nowait(message)
            except Exception as e:
                logger.warning(f"Failed to send message to {connection_id}: {e}")
    
    def get_connection_count(self) -> int:
        """Get number of active connections"""
        return len(self.connections)


class SSEService:
    """Main SSE service for CV2WEB"""
    
    def __init__(self):
        self.connection_manager = ConnectionManager()
        self.heartbeat_task: Optional[asyncio.Task] = None
        
    async def start_heartbeat(self):
        """Start heartbeat task to keep connections alive"""
        if self.heartbeat_task and not self.heartbeat_task.done():
            return
        
        async def heartbeat_loop():
            while True:
                await asyncio.sleep(self.connection_manager.heartbeat_interval)
                if self.connection_manager.get_connection_count() > 0:
                    heartbeat_message = self.create_heartbeat_message()
                    self.connection_manager.broadcast_message(heartbeat_message)
                    logger.debug(f"Heartbeat sent to {self.connection_manager.get_connection_count()} connections")
        
        self.heartbeat_task = asyncio.create_task(heartbeat_loop())
        logger.info("SSE heartbeat task started")
    
    async def stop_heartbeat(self):
        """Stop heartbeat task"""
        if self.heartbeat_task and not self.heartbeat_task.done():
            self.heartbeat_task.cancel()
            try:
                await self.heartbeat_task
            except asyncio.CancelledError:
                pass
            logger.info("SSE heartbeat task stopped")
    
    def create_message(
        self,
        message_type: MessageType,
        data: Dict[str, Any],
        message_id: Optional[str] = None
    ) -> SSEMessage:
        """Create standardized SSE message"""
        return SSEMessage(
            id=message_id or str(uuid.uuid4()),
            type=message_type,
            timestamp=datetime.now().isoformat(),
            data=data
        )
    
    def create_progress_message(
        self,
        step: str,
        progress: int,
        message: str,
        duration: Optional[float] = None
    ) -> SSEMessage:
        """Create progress message"""
        return self.create_message("progress", {
            "step": step,
            "progress": min(100, max(0, progress)),  # Clamp between 0-100
            "message": message,
            "duration": duration
        })
    
    def create_step_message(
        self,
        step_name: str,
        step_number: int,
        total_steps: int,
        details: Optional[Dict] = None
    ) -> SSEMessage:
        """Create step notification message"""
        return self.create_message("step", {
            "stepName": step_name,
            "stepNumber": step_number,
            "totalSteps": total_steps,
            "details": details or {}
        })
    
    def create_complete_message(self, result: Dict[str, Any]) -> SSEMessage:
        """Create completion message"""
        return self.create_message("complete", {
            "result": result,
            "message": "Operation completed successfully"
        })
    
    def create_error_message(
        self,
        error_message: str,
        error_code: Optional[str] = None,
        stack_trace: Optional[str] = None,
        is_critical: bool = False,
        recovery_suggestion: Optional[str] = None
    ) -> SSEMessage:
        """Create error message with enhanced error handling"""
        data = {
            "message": error_message,
            "errorCode": error_code or "UNKNOWN_ERROR",
            "isCritical": is_critical,
            "timestamp": datetime.now().isoformat()
        }
        
        if stack_trace:
            data["stackTrace"] = stack_trace
            
        if recovery_suggestion:
            data["recoverySuggestion"] = recovery_suggestion
            
        # Add error context headers for non-critical issues
        if not is_critical:
            data["headers"] = {
                "X-SSE-Error": error_code or "UNKNOWN_ERROR",
                "X-Error-Severity": "non-critical"
            }
        
        return self.create_message("error", data)
    
    def create_warning_message(self, message: str, details: Optional[Dict] = None) -> SSEMessage:
        """Create warning message"""
        return self.create_message("warning", {
            "message": message,
            "details": details or {}
        })
    
    def create_heartbeat_message(self) -> SSEMessage:
        """Create heartbeat message"""
        return self.create_message("heartbeat", {
            "timestamp": datetime.now().isoformat(),
            "connections": self.connection_manager.get_connection_count()
        })
    
    def create_sentinel_message(
        self, 
        sentinel_type: SentinelType,
        reason: str,
        details: Optional[Dict] = None
    ) -> SSEMessage:
        """Create sentinel event to signal connection closure or critical state changes"""
        data = {
            "sentinelType": sentinel_type,
            "reason": reason,
            "timestamp": datetime.now().isoformat(),
            "details": details or {}
        }
        
        return self.create_message("sentinel", data)
    
    def create_connection_closed_message(self, reason: str = "normal_closure") -> SSEMessage:
        """Create message to signal connection closure"""
        return self.create_sentinel_message("CLOSED", reason, {
            "message": "SSE connection is being closed",
            "action": "reconnect_if_needed"
        })
    
    def create_timeout_message(self, timeout_duration: int) -> SSEMessage:
        """Create timeout sentinel message"""
        return self.create_sentinel_message("TIMEOUT", f"Operation timed out after {timeout_duration}s", {
            "timeout_duration": timeout_duration,
            "action": "retry_operation"
        })
    
    def create_critical_error_sentinel(self, error_message: str, error_code: str) -> SSEMessage:
        """Create critical error sentinel that signals connection should be closed"""
        return self.create_sentinel_message("ERROR", error_message, {
            "error_code": error_code,
            "action": "close_connection",
            "severity": "critical"
        })
    
    async def stream_generator(
        self,
        connection_id: str,
        initial_messages: Optional[List[SSEMessage]] = None,
        max_duration: Optional[int] = None,
        enable_timeout_protection: bool = True
    ) -> AsyncGenerator[str, None]:
        """Generate SSE stream for a connection with enhanced error handling"""
        
        start_time = datetime.now()
        message_queue = self.connection_manager.add_connection(connection_id)
        connection_active = True
        
        try:
            # Send initial messages if provided
            if initial_messages:
                for msg in initial_messages:
                    yield msg.to_sse_format()
            
            # Start heartbeat if not already running
            await self.start_heartbeat()
            
            # Stream messages from queue
            while connection_active:
                try:
                    # Check for timeout if max_duration is set
                    if max_duration and enable_timeout_protection:
                        elapsed = (datetime.now() - start_time).total_seconds()
                        if elapsed > max_duration:
                            timeout_msg = self.create_timeout_message(max_duration)
                            yield timeout_msg.to_sse_format()
                            break
                    
                    # Check for new messages with timeout
                    message = None
                    try:
                        # Use a small timeout to avoid blocking
                        message = message_queue.get(timeout=1.0)
                    except:
                        # No message available, continue loop
                        await asyncio.sleep(0.1)
                        continue
                    
                    if message:
                        # Check for sentinel messages that require connection closure
                        if (hasattr(message, 'type') and message.type == "sentinel" and 
                            hasattr(message, 'data') and message.data.get('sentinelType') in ['CLOSED', 'ERROR']):
                            yield message.to_sse_format()
                            connection_active = False
                            break
                        
                        yield message.to_sse_format()
                        
                        # Check if this is a complete message (end of operation)
                        if hasattr(message, 'type') and message.type == "complete":
                            # Send completion sentinel after a brief delay
                            await asyncio.sleep(0.5)
                            completion_sentinel = self.create_sentinel_message(
                                "COMPLETE", 
                                "Operation completed successfully",
                                {"message": "Stream will close after this message"}
                            )
                            yield completion_sentinel.to_sse_format()
                            break
                        
                except asyncio.CancelledError:
                    logger.info(f"SSE stream cancelled for connection: {connection_id}")
                    # Send cancellation sentinel
                    cancel_msg = self.create_connection_closed_message("cancelled_by_client")
                    yield cancel_msg.to_sse_format()
                    break
                    
                except Exception as e:
                    logger.error(f"Error in SSE stream for {connection_id}: {e}")
                    
                    # Send detailed error message
                    error_msg = self.create_error_message(
                        "Stream error occurred",
                        "STREAM_ERROR",
                        str(e),
                        is_critical=True,
                        recovery_suggestion="Please refresh the page and try again"
                    )
                    yield error_msg.to_sse_format()
                    
                    # Send critical error sentinel
                    critical_sentinel = self.create_critical_error_sentinel(
                        "Critical stream error - connection will be closed",
                        "STREAM_CRITICAL_ERROR"
                    )
                    yield critical_sentinel.to_sse_format()
                    break
                    
        finally:
            # Always send connection closure sentinel unless already sent
            if connection_active:
                closure_msg = self.create_connection_closed_message("normal_closure")
                yield closure_msg.to_sse_format()
            
            # Clean up connection
            self.connection_manager.remove_connection(connection_id)
            logger.info(f"SSE stream ended for connection: {connection_id}")
    
    @asynccontextmanager
    async def managed_connection(self, connection_id: str):
        """Context manager for SSE connections"""
        message_queue = self.connection_manager.add_connection(connection_id)
        try:
            yield message_queue
        finally:
            self.connection_manager.remove_connection(connection_id)


# Global SSE service instance
sse_service = SSEService()

# Utility functions for easy access
def send_progress(step: str, progress: int, message: str, connection_id: Optional[str] = None):
    """Send progress update via SSE"""
    msg = sse_service.create_progress_message(step, progress, message)
    if connection_id:
        sse_service.connection_manager.send_to_connection(connection_id, msg)
    else:
        sse_service.connection_manager.broadcast_message(msg)

def send_step(step_name: str, step_number: int, total_steps: int, connection_id: Optional[str] = None):
    """Send step notification via SSE"""
    msg = sse_service.create_step_message(step_name, step_number, total_steps)
    if connection_id:
        sse_service.connection_manager.send_to_connection(connection_id, msg)
    else:
        sse_service.connection_manager.broadcast_message(msg)

def send_complete(result: Dict[str, Any], connection_id: Optional[str] = None):
    """Send completion message via SSE"""
    msg = sse_service.create_complete_message(result)
    if connection_id:
        sse_service.connection_manager.send_to_connection(connection_id, msg)
    else:
        sse_service.connection_manager.broadcast_message(msg)

def send_error(error_message: str, connection_id: Optional[str] = None):
    """Send error message via SSE"""
    msg = sse_service.create_error_message(error_message)
    if connection_id:
        sse_service.connection_manager.send_to_connection(connection_id, msg)
    else:
        sse_service.connection_manager.broadcast_message(msg)