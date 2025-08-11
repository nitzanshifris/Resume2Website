"""
SSE Message Types for Enhanced Logging
Standardized message types and schemas for SSE communication
"""

from enum import Enum
from typing import Dict, Any, Optional, Union, List
from dataclasses import dataclass, asdict
from datetime import datetime
import json


class SSEMessageType(Enum):
    """Standard SSE message types for RESUME2WEBSITE"""
    
    # Basic logging messages
    LOG_INFO = "log_info"
    LOG_WARNING = "log_warning" 
    LOG_ERROR = "log_error"
    LOG_DEBUG = "log_debug"
    
    # Workflow messages
    WORKFLOW_STARTED = "workflow_started"
    WORKFLOW_PHASE_START = "workflow_phase_start"
    WORKFLOW_PHASE_END = "workflow_phase_end"
    WORKFLOW_COMPLETED = "workflow_completed"
    WORKFLOW_FAILED = "workflow_failed"
    
    # Step and progress messages
    STEP_START = "step_start"
    STEP_COMPLETE = "step_complete"
    PROGRESS_UPDATE = "progress_update"
    
    # Performance and metrics
    METRIC_RECORDED = "metric_recorded"
    PERFORMANCE_UPDATE = "performance_update"
    TIMER_START = "timer_start"
    TIMER_END = "timer_end"
    
    # Alerts and notifications
    ALERT_CREATED = "alert_created"
    ALERT_RESOLVED = "alert_resolved"
    NOTIFICATION = "notification"
    
    # CV Processing specific
    CV_UPLOAD_START = "cv_upload_start"
    CV_VALIDATION = "cv_validation"
    CV_EXTRACTION_START = "cv_extraction_start"
    CV_EXTRACTION_PROGRESS = "cv_extraction_progress"
    CV_EXTRACTION_COMPLETE = "cv_extraction_complete"
    
    # Portfolio Generation specific  
    TEMPLATE_SELECTION = "template_selection"
    COMPONENT_GENERATION_START = "component_generation_start"
    COMPONENT_GENERATION_COMPLETE = "component_generation_complete"
    PORTFOLIO_PREVIEW_READY = "portfolio_preview_ready"
    PORTFOLIO_DEPLOYMENT_START = "portfolio_deployment_start"
    PORTFOLIO_DEPLOYMENT_COMPLETE = "portfolio_deployment_complete"
    
    # System messages
    CONNECTION_ESTABLISHED = "connection_established"
    CONNECTION_LOST = "connection_lost"
    HEARTBEAT = "heartbeat"
    SYSTEM_STATUS = "system_status"
    
    # Error handling
    RETRY_ATTEMPT = "retry_attempt"
    FALLBACK_TRIGGERED = "fallback_triggered"
    CRITICAL_ERROR = "critical_error"


class LogLevel(Enum):
    """Log severity levels"""
    DEBUG = "debug"
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"


class WorkflowStatus(Enum):
    """Workflow execution status"""
    PENDING = "pending"
    RUNNING = "running"
    PAUSED = "paused"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


@dataclass
class SSELogMessage:
    """Standard log message structure for SSE"""
    message_type: SSEMessageType
    level: LogLevel
    message: str
    timestamp: datetime
    correlation_id: str
    component: str
    details: Optional[Dict[str, Any]] = None
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "type": self.message_type.value,
            "level": self.level.value,
            "message": self.message,
            "timestamp": self.timestamp.isoformat(),
            "correlation_id": self.correlation_id,
            "component": self.component,
            "details": self.details or {}
        }
    
    def to_json(self) -> str:
        return json.dumps(self.to_dict())


@dataclass 
class SSEWorkflowMessage:
    """Workflow-specific SSE message"""
    message_type: SSEMessageType
    workflow_id: str
    status: WorkflowStatus
    phase: Optional[str] = None
    progress_percentage: Optional[float] = None
    current_step: Optional[int] = None
    total_steps: Optional[int] = None
    estimated_remaining: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "type": self.message_type.value,
            "workflow_id": self.workflow_id,
            "status": self.status.value,
            "phase": self.phase,
            "progress_percentage": self.progress_percentage,
            "current_step": self.current_step,
            "total_steps": self.total_steps,
            "estimated_remaining": self.estimated_remaining,
            "metadata": self.metadata or {},
            "timestamp": datetime.now().isoformat()
        }


@dataclass
class SSEMetricMessage:
    """Performance metric SSE message"""
    message_type: SSEMessageType
    metric_name: str
    metric_value: Union[int, float, str]
    metric_unit: str
    correlation_id: str
    tags: Optional[Dict[str, str]] = None
    threshold_exceeded: Optional[bool] = None
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "type": self.message_type.value,
            "metric_name": self.metric_name,
            "metric_value": self.metric_value,
            "metric_unit": self.metric_unit,
            "correlation_id": self.correlation_id,
            "tags": self.tags or {},
            "threshold_exceeded": self.threshold_exceeded,
            "timestamp": datetime.now().isoformat()
        }


@dataclass
class SSEAlertMessage:
    """Alert SSE message"""
    message_type: SSEMessageType
    alert_id: str
    severity: str
    title: str
    description: str
    correlation_id: str
    component: str
    action_required: Optional[bool] = None
    resolution_steps: Optional[List[str]] = None
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "type": self.message_type.value,
            "alert_id": self.alert_id,
            "severity": self.severity,
            "title": self.title,
            "description": self.description,
            "correlation_id": self.correlation_id,
            "component": self.component,
            "action_required": self.action_required,
            "resolution_steps": self.resolution_steps or [],
            "timestamp": datetime.now().isoformat()
        }


@dataclass
class SSEProgressMessage:
    """Progress update SSE message"""
    message_type: SSEMessageType
    task_name: str
    current: int
    total: int
    percentage: float
    status: str
    eta: Optional[str] = None
    throughput: Optional[str] = None
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "type": self.message_type.value,
            "task_name": self.task_name,
            "current": self.current,
            "total": self.total,
            "percentage": self.percentage,
            "status": self.status,
            "eta": self.eta,
            "throughput": self.throughput,
            "timestamp": datetime.now().isoformat()
        }


class SSEMessageFactory:
    """Factory for creating standardized SSE messages"""
    
    @staticmethod
    def create_log_message(
        level: LogLevel,
        message: str,
        correlation_id: str,
        component: str,
        details: Optional[Dict[str, Any]] = None
    ) -> SSELogMessage:
        """Create a standard log message"""
        
        # Map log level to message type
        type_mapping = {
            LogLevel.DEBUG: SSEMessageType.LOG_DEBUG,
            LogLevel.INFO: SSEMessageType.LOG_INFO,
            LogLevel.WARNING: SSEMessageType.LOG_WARNING,
            LogLevel.ERROR: SSEMessageType.LOG_ERROR,
            LogLevel.CRITICAL: SSEMessageType.CRITICAL_ERROR
        }
        
        return SSELogMessage(
            message_type=type_mapping[level],
            level=level,
            message=message,
            timestamp=datetime.now(),
            correlation_id=correlation_id,
            component=component,
            details=details
        )
    
    @staticmethod
    def create_workflow_message(
        workflow_id: str,
        status: WorkflowStatus,
        phase: Optional[str] = None,
        progress: Optional[float] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> SSEWorkflowMessage:
        """Create a workflow status message"""
        
        # Map status to message type
        type_mapping = {
            WorkflowStatus.PENDING: SSEMessageType.WORKFLOW_STARTED,
            WorkflowStatus.RUNNING: SSEMessageType.WORKFLOW_STARTED,
            WorkflowStatus.COMPLETED: SSEMessageType.WORKFLOW_COMPLETED,
            WorkflowStatus.FAILED: SSEMessageType.WORKFLOW_FAILED
        }
        
        return SSEWorkflowMessage(
            message_type=type_mapping.get(status, SSEMessageType.WORKFLOW_STARTED),
            workflow_id=workflow_id,
            status=status,
            phase=phase,
            progress_percentage=progress,
            metadata=metadata
        )
    
    @staticmethod
    def create_metric_message(
        metric_name: str,
        value: Union[int, float, str],
        unit: str,
        correlation_id: str,
        tags: Optional[Dict[str, str]] = None
    ) -> SSEMetricMessage:
        """Create a performance metric message"""
        
        return SSEMetricMessage(
            message_type=SSEMessageType.METRIC_RECORDED,
            metric_name=metric_name,
            metric_value=value,
            metric_unit=unit,
            correlation_id=correlation_id,
            tags=tags
        )
    
    @staticmethod
    def create_alert_message(
        alert_id: str,
        severity: str,
        title: str,
        description: str,
        correlation_id: str,
        component: str
    ) -> SSEAlertMessage:
        """Create an alert message"""
        
        return SSEAlertMessage(
            message_type=SSEMessageType.ALERT_CREATED,
            alert_id=alert_id,
            severity=severity,
            title=title,
            description=description,
            correlation_id=correlation_id,
            component=component
        )
    
    @staticmethod
    def create_progress_message(
        task_name: str,
        current: int,
        total: int,
        status: str = "running"
    ) -> SSEProgressMessage:
        """Create a progress update message"""
        
        percentage = (current / total * 100) if total > 0 else 0
        
        return SSEProgressMessage(
            message_type=SSEMessageType.PROGRESS_UPDATE,
            task_name=task_name,
            current=current,
            total=total,
            percentage=percentage,
            status=status
        )
    
    @staticmethod
    def create_cv_processing_message(
        stage: str,
        progress: float,
        details: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Create CV processing specific message"""
        
        stage_mapping = {
            "upload": SSEMessageType.CV_UPLOAD_START,
            "validation": SSEMessageType.CV_VALIDATION,
            "extraction_start": SSEMessageType.CV_EXTRACTION_START,
            "extraction_progress": SSEMessageType.CV_EXTRACTION_PROGRESS,
            "extraction_complete": SSEMessageType.CV_EXTRACTION_COMPLETE
        }
        
        return {
            "type": stage_mapping.get(stage, SSEMessageType.LOG_INFO).value,
            "stage": stage,
            "progress": progress,
            "details": details or {},
            "timestamp": datetime.now().isoformat()
        }
    
    @staticmethod
    def create_portfolio_message(
        stage: str,
        component: Optional[str] = None,
        progress: Optional[float] = None,
        details: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Create portfolio generation specific message"""
        
        stage_mapping = {
            "template_selection": SSEMessageType.TEMPLATE_SELECTION,
            "component_start": SSEMessageType.COMPONENT_GENERATION_START,
            "component_complete": SSEMessageType.COMPONENT_GENERATION_COMPLETE,
            "preview_ready": SSEMessageType.PORTFOLIO_PREVIEW_READY,
            "deployment_start": SSEMessageType.PORTFOLIO_DEPLOYMENT_START,
            "deployment_complete": SSEMessageType.PORTFOLIO_DEPLOYMENT_COMPLETE
        }
        
        return {
            "type": stage_mapping.get(stage, SSEMessageType.LOG_INFO).value,
            "stage": stage,
            "component": component,
            "progress": progress,
            "details": details or {},
            "timestamp": datetime.now().isoformat()
        }


# Message validation schemas
MESSAGE_SCHEMAS = {
    SSEMessageType.LOG_INFO: {
        "required_fields": ["message", "correlation_id", "component"],
        "optional_fields": ["details"]
    },
    SSEMessageType.WORKFLOW_STARTED: {
        "required_fields": ["workflow_id", "status"],
        "optional_fields": ["phase", "progress_percentage", "metadata"]
    },
    SSEMessageType.METRIC_RECORDED: {
        "required_fields": ["metric_name", "metric_value", "metric_unit", "correlation_id"],
        "optional_fields": ["tags", "threshold_exceeded"]
    },
    SSEMessageType.ALERT_CREATED: {
        "required_fields": ["alert_id", "severity", "title", "description", "correlation_id", "component"],
        "optional_fields": ["action_required", "resolution_steps"]
    },
    SSEMessageType.PROGRESS_UPDATE: {
        "required_fields": ["task_name", "current", "total", "percentage"],
        "optional_fields": ["eta", "throughput"]
    }
}


def validate_sse_message(message_type: SSEMessageType, data: Dict[str, Any]) -> bool:
    """Validate SSE message against schema"""
    
    schema = MESSAGE_SCHEMAS.get(message_type)
    if not schema:
        return True  # No validation for unknown types
    
    # Check required fields
    for field in schema["required_fields"]:
        if field not in data:
            return False
    
    return True


def format_sse_message(message_type: SSEMessageType, data: Dict[str, Any]) -> str:
    """Format message for SSE transmission"""
    
    # Add message type if not present
    if "type" not in data:
        data["type"] = message_type.value
    
    # Add timestamp if not present
    if "timestamp" not in data:
        data["timestamp"] = datetime.now().isoformat()
    
    # Validate message
    if not validate_sse_message(message_type, data):
        raise ValueError(f"Invalid message format for type: {message_type.value}")
    
    return json.dumps(data)


# Convenience functions for common message types
def log_info_sse(message: str, correlation_id: str, component: str, details: Optional[Dict] = None) -> str:
    """Create and format INFO log SSE message"""
    msg = SSEMessageFactory.create_log_message(
        LogLevel.INFO, message, correlation_id, component, details
    )
    return msg.to_json()


def log_error_sse(message: str, correlation_id: str, component: str, details: Optional[Dict] = None) -> str:
    """Create and format ERROR log SSE message"""
    msg = SSEMessageFactory.create_log_message(
        LogLevel.ERROR, message, correlation_id, component, details
    )
    return msg.to_json()


def workflow_progress_sse(workflow_id: str, phase: str, progress: float, metadata: Optional[Dict] = None) -> str:
    """Create and format workflow progress SSE message"""
    msg = SSEMessageFactory.create_workflow_message(
        workflow_id, WorkflowStatus.RUNNING, phase, progress, metadata
    )
    return json.dumps(msg.to_dict())


def metric_update_sse(metric_name: str, value: Union[int, float], unit: str, correlation_id: str) -> str:
    """Create and format metric update SSE message"""
    msg = SSEMessageFactory.create_metric_message(
        metric_name, value, unit, correlation_id
    )
    return json.dumps(msg.to_dict())