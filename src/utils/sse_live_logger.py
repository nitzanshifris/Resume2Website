"""
SSE-Integrated Live Logger
Extends LiveLogger to automatically emit SSE messages
"""

from typing import Any, Dict, Optional, List
from datetime import datetime
import uuid
import logging

from src.utils.live_logger import LiveLogger, LogLevel
from src.services.sse_service import sse_service, SSEMessage


class SSELiveLogger(LiveLogger):
    """
    LiveLogger with automatic SSE message emission
    All log events are automatically streamed via SSE
    """
    
    def __init__(
        self, 
        name: str, 
        connection_id: Optional[str] = None,
        log_to_file: bool = True,
        correlation_id: Optional[str] = None
    ):
        super().__init__(name, log_to_file)
        self.connection_id = connection_id
        self.correlation_id = correlation_id or str(uuid.uuid4())
        self._total_steps = 0
        self._current_step = 0
        self._overall_start_time = datetime.now()
        
        # Track performance metrics
        self._performance_metrics = {
            "steps_completed": 0,
            "warnings_count": 0,
            "errors_count": 0,
            "start_time": self._overall_start_time.isoformat()
        }
        
        self.info(f"SSE Logger initialized with correlation ID: {self.correlation_id}")
    
    def _emit_sse_message(self, message_type: str, data: Dict[str, Any]):
        """Emit SSE message with correlation tracking"""
        # Add correlation ID to all messages
        data["correlation_id"] = self.correlation_id
        data["logger_name"] = self.name
        data["timestamp"] = datetime.now().isoformat()
        
        # Create SSE message
        sse_message = sse_service.create_message(message_type, data)
        
        # Send to specific connection or broadcast
        if self.connection_id:
            sse_service.connection_manager.send_to_connection(self.connection_id, sse_message)
        else:
            sse_service.connection_manager.broadcast_message(sse_message)
    
    def set_total_steps(self, total: int):
        """Set the total number of expected steps for progress calculation"""
        self._total_steps = total
        self._emit_sse_message("step", {
            "type": "total_steps_set",
            "total_steps": total,
            "message": f"Process will have {total} steps"
        })
    
    def step(self, step_name: str, details: Optional[Dict[str, Any]] = None):
        """Log a major step and emit SSE step message"""
        super().step(step_name, details)
        
        self._current_step += 1
        
        # Emit SSE step message
        step_data = {
            "stepName": step_name,
            "stepNumber": self._current_step,
            "totalSteps": self._total_steps or self._current_step,
            "details": details or {}
        }
        
        self._emit_sse_message("step", step_data)
    
    def step_complete(self, step_name: str, details: Optional[Dict[str, Any]] = None):
        """Mark step as complete and emit progress update"""
        super().step_complete(step_name, details)
        
        self._performance_metrics["steps_completed"] += 1
        
        # Calculate progress percentage
        if self._total_steps > 0:
            progress = int((self._current_step / self._total_steps) * 100)
        else:
            progress = 100  # If no total set, assume complete
        
        # Get duration if available
        duration = None
        if step_name in self._step_start_times and details and 'duration' in details:
            duration = details['duration']
        
        # Emit SSE progress message
        progress_data = {
            "step": step_name,
            "progress": progress,
            "message": f"Completed: {step_name}",
            "duration": duration,
            "stepNumber": self._current_step,
            "totalSteps": self._total_steps or self._current_step
        }
        
        self._emit_sse_message("progress", progress_data)
    
    def progress(self, task: str, current: int, total: int, extra: Optional[str] = None):
        """Log progress and emit SSE progress message"""
        super().progress(task, current, total, extra)
        
        percentage = (current / total) * 100 if total > 0 else 0
        message = f"{task}: {current}/{total}"
        if extra:
            message += f" - {extra}"
        
        # Emit SSE progress message
        progress_data = {
            "step": task,
            "progress": int(percentage),
            "message": message,
            "current": current,
            "total": total,
            "extra": extra
        }
        
        self._emit_sse_message("progress", progress_data)
    
    def success(self, message: str, details: Optional[Dict[str, Any]] = None):
        """Log success and emit SSE complete message if this is the final step"""
        super().success(message, details)
        
        # Check if this is the final step
        if self._total_steps > 0 and self._current_step >= self._total_steps:
            # This is the final step, emit complete message
            self._emit_complete_message(message, details)
        else:
            # Regular success message
            self._emit_sse_message("step", {
                "type": "success",
                "message": message,
                "details": details or {}
            })
    
    def _emit_complete_message(self, message: str, details: Optional[Dict[str, Any]] = None):
        """Emit final completion message with performance metrics"""
        total_time = (datetime.now() - self._overall_start_time).total_seconds()
        
        result = {
            "message": message,
            "details": details or {},
            "performance_metrics": {
                **self._performance_metrics,
                "total_time": f"{total_time:.2f}s",
                "end_time": datetime.now().isoformat(),
                "steps_per_second": self._performance_metrics["steps_completed"] / total_time if total_time > 0 else 0
            },
            "correlation_id": self.correlation_id
        }
        
        self._emit_sse_message("complete", {"result": result})
    
    def warning(self, message: str, details: Optional[Dict[str, Any]] = None):
        """Log warning and emit SSE warning message"""
        super().warning(message, details)
        
        self._performance_metrics["warnings_count"] += 1
        
        # Emit SSE warning message
        warning_data = {
            "message": message,
            "details": details or {},
            "warning_count": self._performance_metrics["warnings_count"]
        }
        
        self._emit_sse_message("warning", warning_data)
    
    def error(self, message: str, error: Optional[Exception] = None, details: Optional[Dict[str, Any]] = None):
        """Log error and emit SSE error message"""
        super().error(message, error, details)
        
        self._performance_metrics["errors_count"] += 1
        
        # Prepare error data
        error_data = {
            "message": message,
            "errorCode": "PROCESSING_ERROR",
            "error_count": self._performance_metrics["errors_count"]
        }
        
        if error:
            error_data["errorType"] = type(error).__name__
            error_data["errorMessage"] = str(error)
            # Only include stack trace in development
            import os
            if os.getenv("ENV", "development") == "development":
                import traceback
                error_data["stackTrace"] = traceback.format_exc()
        
        if details:
            error_data["details"] = details
        
        self._emit_sse_message("error", error_data)
    
    def info(self, message: str, details: Optional[Dict[str, Any]] = None):
        """Log info and optionally emit SSE message for important info"""
        super().info(message, details)
        
        # Only emit SSE for important info messages (containing keywords)
        important_keywords = ["initialized", "starting", "connecting", "loaded", "ready"]
        if any(keyword in message.lower() for keyword in important_keywords):
            self._emit_sse_message("step", {
                "type": "info",
                "message": message,
                "details": details or {}
            })
    
    def get_performance_summary(self) -> Dict[str, Any]:
        """Get performance metrics summary"""
        total_time = (datetime.now() - self._overall_start_time).total_seconds()
        
        return {
            **self._performance_metrics,
            "total_time": f"{total_time:.2f}s",
            "current_step": self._current_step,
            "total_steps": self._total_steps,
            "completion_percentage": (self._current_step / self._total_steps * 100) if self._total_steps > 0 else 100,
            "correlation_id": self.correlation_id
        }
    
    def get_total_time(self) -> float:
        """Get total elapsed time in seconds"""
        return (datetime.now() - self._overall_start_time).total_seconds()
    
    def force_complete(self, final_message: str = "Process completed", result_data: Optional[Dict] = None):
        """Force emit completion message (useful for manual completion)"""
        self._emit_complete_message(final_message, result_data)


class SSELoggerFactory:
    """Factory for creating SSE loggers with consistent configuration"""
    
    @staticmethod
    def create_for_job(job_id: str, process_name: str, connection_id: Optional[str] = None) -> SSELiveLogger:
        """Create SSE logger for a specific job"""
        logger_name = f"{process_name}_{job_id}"
        correlation_id = f"{job_id}_{process_name}_{datetime.now().strftime('%H%M%S')}"
        
        return SSELiveLogger(
            name=logger_name,
            connection_id=connection_id,
            correlation_id=correlation_id,
            log_to_file=True
        )
    
    @staticmethod
    def create_for_connection(connection_id: str, process_name: str) -> SSELiveLogger:
        """Create SSE logger for a specific connection"""
        logger_name = f"{process_name}_{connection_id}"
        
        return SSELiveLogger(
            name=logger_name,
            connection_id=connection_id,
            log_to_file=True
        )


# Convenience functions
def get_sse_logger(
    name: str, 
    connection_id: Optional[str] = None,
    correlation_id: Optional[str] = None
) -> SSELiveLogger:
    """Get an SSE-enabled logger instance"""
    return SSELiveLogger(name, connection_id, correlation_id=correlation_id)

def create_job_logger(job_id: str, process_name: str, connection_id: Optional[str] = None) -> SSELiveLogger:
    """Create logger for a specific job with SSE integration"""
    return SSELoggerFactory.create_for_job(job_id, process_name, connection_id)