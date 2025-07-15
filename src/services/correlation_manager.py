"""
Correlation ID Management System
Provides centralized correlation tracking across services and components
"""

import uuid
import threading
import time
from typing import Dict, List, Optional, Set, Any, Callable
from datetime import datetime, timedelta
from dataclasses import dataclass, field
from contextlib import contextmanager
from enum import Enum
import logging

logger = logging.getLogger(__name__)


class CorrelationScope(Enum):
    """Scopes for correlation IDs"""
    REQUEST = "request"      # Single HTTP request
    JOB = "job"             # Entire job (CV extraction + portfolio generation)
    WORKFLOW = "workflow"    # Complex multi-step workflow
    SESSION = "session"      # User session
    BATCH = "batch"         # Batch processing


@dataclass
class CorrelationContext:
    """Context information for a correlation ID"""
    correlation_id: str
    scope: CorrelationScope
    parent_id: Optional[str] = None
    user_id: Optional[str] = None
    session_id: Optional[str] = None
    job_id: Optional[str] = None
    workflow_id: Optional[str] = None
    created_at: datetime = field(default_factory=datetime.now)
    last_accessed: datetime = field(default_factory=datetime.now)
    
    # Tracking information
    components: Set[str] = field(default_factory=set)
    services: Set[str] = field(default_factory=set)
    operations: List[str] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)
    
    # Performance tracking
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    
    def add_component(self, component_name: str):
        """Add component to tracking"""
        self.components.add(component_name)
        self.last_accessed = datetime.now()
    
    def add_service(self, service_name: str):
        """Add service to tracking"""
        self.services.add(service_name)
        self.last_accessed = datetime.now()
    
    def add_operation(self, operation: str):
        """Add operation to tracking"""
        self.operations.append(operation)
        self.last_accessed = datetime.now()
    
    def start_timing(self):
        """Start timing this correlation"""
        self.start_time = datetime.now()
    
    def end_timing(self):
        """End timing this correlation"""
        self.end_time = datetime.now()
    
    def get_duration(self) -> Optional[float]:
        """Get duration in seconds"""
        if self.start_time and self.end_time:
            return (self.end_time - self.start_time).total_seconds()
        elif self.start_time:
            return (datetime.now() - self.start_time).total_seconds()
        return None
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for serialization"""
        return {
            "correlation_id": self.correlation_id,
            "scope": self.scope.value,
            "parent_id": self.parent_id,
            "user_id": self.user_id,
            "session_id": self.session_id,
            "job_id": self.job_id,
            "workflow_id": self.workflow_id,
            "created_at": self.created_at.isoformat(),
            "last_accessed": self.last_accessed.isoformat(),
            "components": list(self.components),
            "services": list(self.services),
            "operations": self.operations,
            "metadata": self.metadata,
            "start_time": self.start_time.isoformat() if self.start_time else None,
            "end_time": self.end_time.isoformat() if self.end_time else None,
            "duration": self.get_duration()
        }


class CorrelationManager:
    """Centralized correlation ID management"""
    
    def __init__(self, cleanup_interval: int = 300, max_age_hours: int = 24):
        self.cleanup_interval = cleanup_interval
        self.max_age_hours = max_age_hours
        self.contexts: Dict[str, CorrelationContext] = {}
        self.parent_child_map: Dict[str, Set[str]] = {}
        self.user_correlations: Dict[str, Set[str]] = {}
        self.session_correlations: Dict[str, Set[str]] = {}
        self._lock = threading.RLock()
        self._cleanup_timer: Optional[threading.Timer] = None
        self.event_handlers: List[Callable[[str, CorrelationContext], None]] = []
        
        # Start cleanup timer
        self._start_cleanup_timer()
    
    def _start_cleanup_timer(self):
        """Start periodic cleanup timer"""
        if self._cleanup_timer:
            self._cleanup_timer.cancel()
        
        self._cleanup_timer = threading.Timer(self.cleanup_interval, self._cleanup_expired)
        self._cleanup_timer.daemon = True
        self._cleanup_timer.start()
    
    def _cleanup_expired(self):
        """Clean up expired correlation contexts"""
        cutoff = datetime.now() - timedelta(hours=self.max_age_hours)
        expired_ids = []
        
        with self._lock:
            for correlation_id, context in self.contexts.items():
                if context.last_accessed < cutoff:
                    expired_ids.append(correlation_id)
            
            for correlation_id in expired_ids:
                self._remove_context(correlation_id)
        
        if expired_ids:
            logger.info(f"Cleaned up {len(expired_ids)} expired correlation contexts")
        
        # Schedule next cleanup
        self._start_cleanup_timer()
    
    def _remove_context(self, correlation_id: str):
        """Remove correlation context and all references"""
        context = self.contexts.pop(correlation_id, None)
        if not context:
            return
        
        # Remove from parent-child mapping
        if context.parent_id and context.parent_id in self.parent_child_map:
            self.parent_child_map[context.parent_id].discard(correlation_id)
            if not self.parent_child_map[context.parent_id]:
                del self.parent_child_map[context.parent_id]
        
        # Remove children
        if correlation_id in self.parent_child_map:
            children = self.parent_child_map.pop(correlation_id)
            for child_id in children:
                self._remove_context(child_id)
        
        # Remove from user mapping
        if context.user_id and context.user_id in self.user_correlations:
            self.user_correlations[context.user_id].discard(correlation_id)
            if not self.user_correlations[context.user_id]:
                del self.user_correlations[context.user_id]
        
        # Remove from session mapping
        if context.session_id and context.session_id in self.session_correlations:
            self.session_correlations[context.session_id].discard(correlation_id)
            if not self.session_correlations[context.session_id]:
                del self.session_correlations[context.session_id]
    
    def generate_correlation_id(
        self,
        scope: CorrelationScope,
        prefix: Optional[str] = None,
        parent_id: Optional[str] = None
    ) -> str:
        """Generate a new correlation ID"""
        if prefix:
            correlation_id = f"{prefix}-{scope.value}-{uuid.uuid4().hex[:8]}"
        else:
            correlation_id = f"{scope.value}-{uuid.uuid4().hex[:12]}"
        
        return correlation_id
    
    def create_context(
        self,
        scope: CorrelationScope,
        user_id: Optional[str] = None,
        session_id: Optional[str] = None,
        job_id: Optional[str] = None,
        workflow_id: Optional[str] = None,
        parent_id: Optional[str] = None,
        correlation_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> CorrelationContext:
        """Create a new correlation context"""
        
        if not correlation_id:
            correlation_id = self.generate_correlation_id(scope, parent_id=parent_id)
        
        context = CorrelationContext(
            correlation_id=correlation_id,
            scope=scope,
            parent_id=parent_id,
            user_id=user_id,
            session_id=session_id,
            job_id=job_id,
            workflow_id=workflow_id,
            metadata=metadata or {}
        )
        
        with self._lock:
            self.contexts[correlation_id] = context
            
            # Update parent-child mapping
            if parent_id:
                if parent_id not in self.parent_child_map:
                    self.parent_child_map[parent_id] = set()
                self.parent_child_map[parent_id].add(correlation_id)
            
            # Update user mapping
            if user_id:
                if user_id not in self.user_correlations:
                    self.user_correlations[user_id] = set()
                self.user_correlations[user_id].add(correlation_id)
            
            # Update session mapping
            if session_id:
                if session_id not in self.session_correlations:
                    self.session_correlations[session_id] = set()
                self.session_correlations[session_id].add(correlation_id)
        
        # Trigger event handlers
        for handler in self.event_handlers:
            try:
                handler("created", context)
            except Exception as e:
                logger.warning(f"Event handler failed: {e}")
        
        logger.debug(f"Created correlation context: {correlation_id} (scope: {scope.value})")
        return context
    
    def get_context(self, correlation_id: str) -> Optional[CorrelationContext]:
        """Get correlation context by ID"""
        with self._lock:
            context = self.contexts.get(correlation_id)
            if context:
                context.last_accessed = datetime.now()
            return context
    
    def update_context(
        self,
        correlation_id: str,
        component: Optional[str] = None,
        service: Optional[str] = None,
        operation: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> bool:
        """Update correlation context with tracking information"""
        with self._lock:
            context = self.contexts.get(correlation_id)
            if not context:
                return False
            
            if component:
                context.add_component(component)
            if service:
                context.add_service(service)
            if operation:
                context.add_operation(operation)
            if metadata:
                context.metadata.update(metadata)
            
            return True
    
    def start_correlation_timing(self, correlation_id: str) -> bool:
        """Start timing for a correlation"""
        with self._lock:
            context = self.contexts.get(correlation_id)
            if context:
                context.start_timing()
                return True
            return False
    
    def end_correlation_timing(self, correlation_id: str) -> bool:
        """End timing for a correlation"""
        with self._lock:
            context = self.contexts.get(correlation_id)
            if context:
                context.end_timing()
                
                # Trigger completion handlers
                for handler in self.event_handlers:
                    try:
                        handler("completed", context)
                    except Exception as e:
                        logger.warning(f"Event handler failed: {e}")
                
                return True
            return False
    
    def get_child_correlations(self, parent_id: str) -> List[CorrelationContext]:
        """Get all child correlations for a parent"""
        with self._lock:
            child_ids = self.parent_child_map.get(parent_id, set())
            return [self.contexts[child_id] for child_id in child_ids if child_id in self.contexts]
    
    def get_user_correlations(self, user_id: str) -> List[CorrelationContext]:
        """Get all correlations for a user"""
        with self._lock:
            correlation_ids = self.user_correlations.get(user_id, set())
            return [self.contexts[corr_id] for corr_id in correlation_ids if corr_id in self.contexts]
    
    def get_session_correlations(self, session_id: str) -> List[CorrelationContext]:
        """Get all correlations for a session"""
        with self._lock:
            correlation_ids = self.session_correlations.get(session_id, set())
            return [self.contexts[corr_id] for corr_id in correlation_ids if corr_id in self.contexts]
    
    def get_correlation_tree(self, correlation_id: str) -> Dict[str, Any]:
        """Get complete correlation tree starting from given ID"""
        context = self.get_context(correlation_id)
        if not context:
            return {}
        
        tree = context.to_dict()
        tree["children"] = []
        
        for child_context in self.get_child_correlations(correlation_id):
            child_tree = self.get_correlation_tree(child_context.correlation_id)
            tree["children"].append(child_tree)
        
        return tree
    
    def get_statistics(self) -> Dict[str, Any]:
        """Get correlation manager statistics"""
        with self._lock:
            scope_counts = {}
            for context in self.contexts.values():
                scope = context.scope.value
                scope_counts[scope] = scope_counts.get(scope, 0) + 1
            
            return {
                "total_contexts": len(self.contexts),
                "scope_breakdown": scope_counts,
                "active_users": len(self.user_correlations),
                "active_sessions": len(self.session_correlations),
                "parent_child_relationships": len(self.parent_child_map),
                "average_components_per_context": sum(len(ctx.components) for ctx in self.contexts.values()) / len(self.contexts) if self.contexts else 0,
                "average_services_per_context": sum(len(ctx.services) for ctx in self.contexts.values()) / len(self.contexts) if self.contexts else 0
            }
    
    def add_event_handler(self, handler: Callable[[str, CorrelationContext], None]):
        """Add event handler for correlation events"""
        self.event_handlers.append(handler)
    
    def remove_event_handler(self, handler: Callable[[str, CorrelationContext], None]):
        """Remove event handler"""
        if handler in self.event_handlers:
            self.event_handlers.remove(handler)
    
    @contextmanager
    def correlation_context(
        self,
        scope: CorrelationScope,
        user_id: Optional[str] = None,
        session_id: Optional[str] = None,
        job_id: Optional[str] = None,
        workflow_id: Optional[str] = None,
        parent_id: Optional[str] = None,
        auto_timing: bool = True
    ):
        """Context manager for correlation tracking"""
        context = self.create_context(
            scope=scope,
            user_id=user_id,
            session_id=session_id,
            job_id=job_id,
            workflow_id=workflow_id,
            parent_id=parent_id
        )
        
        if auto_timing:
            self.start_correlation_timing(context.correlation_id)
        
        try:
            yield context
        finally:
            if auto_timing:
                self.end_correlation_timing(context.correlation_id)


# Global correlation manager instance
correlation_manager = CorrelationManager()


# Thread-local storage for current correlation
_thread_local = threading.local()


def set_current_correlation(correlation_id: str):
    """Set current correlation ID for this thread"""
    _thread_local.correlation_id = correlation_id


def get_current_correlation() -> Optional[str]:
    """Get current correlation ID for this thread"""
    return getattr(_thread_local, 'correlation_id', None)


def clear_current_correlation():
    """Clear current correlation ID for this thread"""
    if hasattr(_thread_local, 'correlation_id'):
        delattr(_thread_local, 'correlation_id')


@contextmanager
def correlation_scope(correlation_id: str):
    """Context manager to set correlation ID for current thread"""
    old_correlation = get_current_correlation()
    set_current_correlation(correlation_id)
    try:
        yield correlation_id
    finally:
        if old_correlation:
            set_current_correlation(old_correlation)
        else:
            clear_current_correlation()


# Convenience functions
def create_job_correlation(
    job_id: str,
    user_id: Optional[str] = None,
    session_id: Optional[str] = None,
    metadata: Optional[Dict[str, Any]] = None
) -> CorrelationContext:
    """Create correlation context for a job"""
    return correlation_manager.create_context(
        scope=CorrelationScope.JOB,
        job_id=job_id,
        user_id=user_id,
        session_id=session_id,
        correlation_id=f"job-{job_id}",
        metadata=metadata
    )


def create_request_correlation(
    user_id: Optional[str] = None,
    session_id: Optional[str] = None,
    parent_job_id: Optional[str] = None,
    metadata: Optional[Dict[str, Any]] = None
) -> CorrelationContext:
    """Create correlation context for a request"""
    parent_id = f"job-{parent_job_id}" if parent_job_id else None
    
    return correlation_manager.create_context(
        scope=CorrelationScope.REQUEST,
        user_id=user_id,
        session_id=session_id,
        parent_id=parent_id,
        metadata=metadata
    )


def create_workflow_correlation(
    workflow_id: str,
    user_id: Optional[str] = None,
    session_id: Optional[str] = None,
    metadata: Optional[Dict[str, Any]] = None
) -> CorrelationContext:
    """Create correlation context for a workflow"""
    return correlation_manager.create_context(
        scope=CorrelationScope.WORKFLOW,
        workflow_id=workflow_id,
        user_id=user_id,
        session_id=session_id,
        correlation_id=f"workflow-{workflow_id}",
        metadata=metadata
    )