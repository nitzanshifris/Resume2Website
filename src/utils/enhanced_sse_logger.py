"""
Enhanced SSE Live Logger with Advanced Features
Extends SSELiveLogger with correlation tracking, performance metrics,
log aggregation, and complex workflow support
"""

import asyncio
import json
import time
import threading
from typing import Any, Dict, Optional, List, Callable, Union
from datetime import datetime, timedelta
from dataclasses import dataclass, field, asdict
from enum import Enum
from collections import defaultdict, deque
import logging
import uuid

from src.utils.sse_live_logger import SSELiveLogger, LogLevel
from src.services.sse_service import sse_service
from src.services.metrics_collector import metrics_collector, Timer, MetricType as CollectorMetricType
from src.services.correlation_manager import correlation_manager, CorrelationScope
from src.services.sse_message_types import (
    SSEMessageFactory, 
    SSEMessageType,
    LogLevel as SSELogLevel,
    WorkflowStatus,
    workflow_progress_sse,
    log_info_sse,
    log_error_sse,
    metric_update_sse
)


class WorkflowPhase(Enum):
    """Workflow phases for complex operations"""
    INITIALIZATION = "initialization"
    VALIDATION = "validation"
    PROCESSING = "processing"
    GENERATION = "generation"
    FINALIZATION = "finalization"
    CLEANUP = "cleanup"


class MetricType(Enum):
    """Types of performance metrics"""
    DURATION = "duration"
    COUNTER = "counter"
    GAUGE = "gauge"
    HISTOGRAM = "histogram"
    RATE = "rate"


@dataclass
class PerformanceMetric:
    """Performance metric data structure"""
    name: str
    type: MetricType
    value: Union[float, int]
    unit: str
    timestamp: datetime = field(default_factory=datetime.now)
    tags: Dict[str, str] = field(default_factory=dict)
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "name": self.name,
            "type": self.type.value,
            "value": self.value,
            "unit": self.unit,
            "timestamp": self.timestamp.isoformat(),
            "tags": self.tags
        }


@dataclass
class LogEntry:
    """Structured log entry for aggregation"""
    level: str
    message: str
    timestamp: datetime
    correlation_id: str
    logger_name: str
    phase: Optional[WorkflowPhase] = None
    step_number: Optional[int] = None
    total_steps: Optional[int] = None
    metrics: List[PerformanceMetric] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "level": self.level,
            "message": self.message,
            "timestamp": self.timestamp.isoformat(),
            "correlation_id": self.correlation_id,
            "logger_name": self.logger_name,
            "phase": self.phase.value if self.phase else None,
            "step_number": self.step_number,
            "total_steps": self.total_steps,
            "metrics": [m.to_dict() for m in self.metrics],
            "metadata": self.metadata
        }


class LogAggregator:
    """Log aggregation system for analytics and monitoring"""
    
    def __init__(self, max_entries: int = 10000, retention_hours: int = 24):
        self.max_entries = max_entries
        self.retention_hours = retention_hours
        self.entries: deque = deque(maxlen=max_entries)
        self.correlation_index: Dict[str, List[LogEntry]] = defaultdict(list)
        self.phase_stats: Dict[WorkflowPhase, Dict[str, Any]] = defaultdict(lambda: {
            "count": 0,
            "avg_duration": 0,
            "total_duration": 0,
            "error_count": 0
        })
        self.metrics_buffer: Dict[str, List[PerformanceMetric]] = defaultdict(list)
        self._lock = threading.Lock()
    
    def add_entry(self, entry: LogEntry):
        """Add log entry to aggregation system"""
        with self._lock:
            self.entries.append(entry)
            self.correlation_index[entry.correlation_id].append(entry)
            
            # Update phase statistics
            if entry.phase:
                stats = self.phase_stats[entry.phase]
                stats["count"] += 1
                if entry.level == "ERROR":
                    stats["error_count"] += 1
            
            # Buffer metrics
            for metric in entry.metrics:
                self.metrics_buffer[metric.name].append(metric)
                
            # Cleanup old entries
            self._cleanup_old_entries()
    
    def _cleanup_old_entries(self):
        """Remove entries older than retention period"""
        cutoff = datetime.now() - timedelta(hours=self.retention_hours)
        
        # Clean main entries
        while self.entries and self.entries[0].timestamp < cutoff:
            old_entry = self.entries.popleft()
            
            # Clean correlation index
            if old_entry.correlation_id in self.correlation_index:
                self.correlation_index[old_entry.correlation_id].remove(old_entry)
                if not self.correlation_index[old_entry.correlation_id]:
                    del self.correlation_index[old_entry.correlation_id]
    
    def get_correlation_logs(self, correlation_id: str) -> List[LogEntry]:
        """Get all logs for a correlation ID"""
        return self.correlation_index.get(correlation_id, [])
    
    def get_phase_statistics(self) -> Dict[str, Dict[str, Any]]:
        """Get workflow phase statistics"""
        return dict(self.phase_stats)
    
    def get_metrics_summary(self, metric_name: str, last_minutes: int = 10) -> Dict[str, Any]:
        """Get aggregated metrics for the last N minutes"""
        cutoff = datetime.now() - timedelta(minutes=last_minutes)
        recent_metrics = [
            m for m in self.metrics_buffer.get(metric_name, [])
            if m.timestamp > cutoff
        ]
        
        if not recent_metrics:
            return {"count": 0}
        
        values = [m.value for m in recent_metrics]
        return {
            "count": len(values),
            "min": min(values),
            "max": max(values),
            "avg": sum(values) / len(values),
            "total": sum(values) if recent_metrics[0].type == MetricType.COUNTER else None
        }


# Global log aggregator
log_aggregator = LogAggregator()


class EnhancedSSELogger(SSELiveLogger):
    """
    Enhanced SSE Logger with advanced tracking, metrics, and workflow support
    """
    
    def __init__(
        self,
        name: str,
        connection_id: Optional[str] = None,
        log_to_file: bool = True,
        correlation_id: Optional[str] = None,
        workflow_id: Optional[str] = None,
        enable_aggregation: bool = True,
        enable_performance_tracking: bool = True,
        custom_tags: Optional[Dict[str, str]] = None
    ):
        super().__init__(name, connection_id, log_to_file, correlation_id)
        
        self.workflow_id = workflow_id or f"workflow-{uuid.uuid4().hex[:8]}"
        self.enable_aggregation = enable_aggregation
        self.enable_performance_tracking = enable_performance_tracking
        self.custom_tags = custom_tags or {}
        
        # Create correlation context for this workflow
        if self.enable_performance_tracking:
            self.correlation_context = correlation_manager.create_context(
                scope=CorrelationScope.WORKFLOW,
                workflow_id=self.workflow_id,
                correlation_id=self.correlation_id,
                metadata={
                    "logger_name": name,
                    "custom_tags": self.custom_tags
                }
            )
            correlation_manager.start_correlation_timing(self.correlation_id)
        
        # Workflow tracking
        self.current_phase: Optional[WorkflowPhase] = None
        self.phase_start_times: Dict[WorkflowPhase, datetime] = {}
        self.phase_metrics: Dict[WorkflowPhase, List[PerformanceMetric]] = defaultdict(list)
        
        # Performance tracking
        self.operation_timers: Dict[str, datetime] = {}
        self.counters: Dict[str, int] = defaultdict(int)
        self.gauges: Dict[str, float] = {}
        self.rates: Dict[str, List[datetime]] = defaultdict(list)
        
        # Event hooks
        self.event_hooks: Dict[str, List[Callable]] = defaultdict(list)
        
        # Structured logging
        self.structured_logs: List[LogEntry] = []
        
        self.info(f"Enhanced SSE Logger initialized", {
            "workflow_id": self.workflow_id,
            "correlation_id": self.correlation_id,
            "aggregation_enabled": self.enable_aggregation,
            "performance_tracking": self.enable_performance_tracking
        })
    
    def start_phase(self, phase: WorkflowPhase, expected_steps: Optional[int] = None):
        """Start a new workflow phase"""
        if self.current_phase:
            self.end_phase()
        
        self.current_phase = phase
        self.phase_start_times[phase] = datetime.now()
        
        if expected_steps:
            self.set_total_steps(expected_steps)
        
        self.info(f"Started workflow phase: {phase.value}", {
            "phase": phase.value,
            "expected_steps": expected_steps,
            "workflow_id": self.workflow_id
        })
        
        # Update correlation context
        if self.enable_performance_tracking:
            correlation_manager.update_context(
                self.correlation_id,
                operation=f"start_phase_{phase.value}",
                metadata={"expected_steps": expected_steps}
            )
        
        # Trigger phase start hooks
        self._trigger_hooks(f"phase_start_{phase.value}", {"phase": phase})
    
    def end_phase(self, metrics: Optional[Dict[str, Any]] = None):
        """End current workflow phase"""
        if not self.current_phase:
            return
        
        phase_duration = (datetime.now() - self.phase_start_times[self.current_phase]).total_seconds()
        
        # Record phase duration metric
        if self.enable_performance_tracking:
            duration_metric = PerformanceMetric(
                name=f"phase_duration_{self.current_phase.value}",
                type=MetricType.DURATION,
                value=phase_duration,
                unit="seconds",
                tags={**self.custom_tags, "phase": self.current_phase.value}
            )
            self.phase_metrics[self.current_phase].append(duration_metric)
            self.record_metric(duration_metric)
        
        self.success(f"Completed workflow phase: {self.current_phase.value}", {
            "phase": self.current_phase.value,
            "duration": f"{phase_duration:.2f}s",
            "metrics": metrics or {},
            "workflow_id": self.workflow_id
        })
        
        # Trigger phase end hooks
        self._trigger_hooks(f"phase_end_{self.current_phase.value}", {
            "phase": self.current_phase,
            "duration": phase_duration,
            "metrics": metrics
        })
        
        self.current_phase = None
    
    def record_metric(self, metric: PerformanceMetric):
        """Record a performance metric"""
        if not self.enable_performance_tracking:
            return
        
        # Add to current phase if active
        if self.current_phase:
            self.phase_metrics[self.current_phase].append(metric)
        
        # Also record in global metrics collector
        metrics_collector.record_value(
            metric.name,
            metric.value,
            tags={**metric.tags, "workflow_id": self.workflow_id},
            timestamp=metric.timestamp
        )
        
        # Emit standardized SSE metric message
        metric_message = SSEMessageFactory.create_metric_message(
            metric.name,
            metric.value,
            metric.unit,
            self.correlation_id,
            {**metric.tags, "workflow_id": self.workflow_id}
        )
        self._emit_sse_message("metric", metric_message.to_dict())
        
        self.debug(f"Recorded metric: {metric.name} = {metric.value} {metric.unit}")
    
    def start_timer(self, operation_name: str):
        """Start timing an operation"""
        self.operation_timers[operation_name] = datetime.now()
        self.debug(f"Started timer: {operation_name}")
    
    def end_timer(self, operation_name: str, emit_metric: bool = True) -> float:
        """End timing an operation and optionally emit metric"""
        if operation_name not in self.operation_timers:
            self.warning(f"Timer '{operation_name}' was not started")
            return 0.0
        
        duration = (datetime.now() - self.operation_timers[operation_name]).total_seconds()
        del self.operation_timers[operation_name]
        
        if emit_metric and self.enable_performance_tracking:
            metric = PerformanceMetric(
                name=f"operation_duration_{operation_name}",
                type=MetricType.DURATION,
                value=duration,
                unit="seconds",
                tags={**self.custom_tags, "operation": operation_name}
            )
            self.record_metric(metric)
        
        self.debug(f"Completed timer: {operation_name} ({duration:.3f}s)")
        return duration
    
    def increment_counter(self, counter_name: str, value: int = 1):
        """Increment a counter metric"""
        self.counters[counter_name] += value
        
        if self.enable_performance_tracking:
            # Use global metrics collector for counters
            metrics_collector.increment_counter(
                f"workflow_{counter_name}",
                value,
                tags={**self.custom_tags, "workflow_id": self.workflow_id}
            )
            
            metric = PerformanceMetric(
                name=f"counter_{counter_name}",
                type=MetricType.COUNTER,
                value=self.counters[counter_name],
                unit="count",
                tags={**self.custom_tags, "counter": counter_name}
            )
            self.record_metric(metric)
    
    def set_gauge(self, gauge_name: str, value: float):
        """Set a gauge metric value"""
        self.gauges[gauge_name] = value
        
        if self.enable_performance_tracking:
            # Use global metrics collector for gauges
            metrics_collector.set_gauge(
                f"workflow_{gauge_name}",
                value,
                tags={**self.custom_tags, "workflow_id": self.workflow_id}
            )
            
            metric = PerformanceMetric(
                name=f"gauge_{gauge_name}",
                type=MetricType.GAUGE,
                value=value,
                unit="value",
                tags={**self.custom_tags, "gauge": gauge_name}
            )
            self.record_metric(metric)
    
    def record_rate(self, rate_name: str):
        """Record an event for rate calculation"""
        now = datetime.now()
        self.rates[rate_name].append(now)
        
        # Keep only last minute for rate calculation
        cutoff = now - timedelta(minutes=1)
        self.rates[rate_name] = [t for t in self.rates[rate_name] if t > cutoff]
        
        rate_per_minute = len(self.rates[rate_name])
        
        if self.enable_performance_tracking:
            metric = PerformanceMetric(
                name=f"rate_{rate_name}",
                type=MetricType.RATE,
                value=rate_per_minute,
                unit="per_minute",
                tags={**self.custom_tags, "rate": rate_name}
            )
            self.record_metric(metric)
    
    def add_hook(self, event_name: str, callback: Callable):
        """Add an event hook"""
        self.event_hooks[event_name].append(callback)
    
    def _trigger_hooks(self, event_name: str, data: Dict[str, Any]):
        """Trigger event hooks"""
        for callback in self.event_hooks.get(event_name, []):
            try:
                callback(data)
            except Exception as e:
                self.warning(f"Hook callback failed for {event_name}: {e}")
    
    def _create_log_entry(self, level: str, message: str, details: Optional[Dict] = None) -> LogEntry:
        """Create structured log entry"""
        return LogEntry(
            level=level,
            message=message,
            timestamp=datetime.now(),
            correlation_id=self.correlation_id,
            logger_name=self.name,
            phase=self.current_phase,
            step_number=self._current_step,
            total_steps=self._total_steps,
            metadata={
                "workflow_id": self.workflow_id,
                "details": details or {},
                "custom_tags": self.custom_tags
            }
        )
    
    def _log_and_aggregate(self, level: str, message: str, details: Optional[Dict] = None):
        """Log message and add to aggregation if enabled"""
        if self.enable_aggregation:
            entry = self._create_log_entry(level, message, details)
            self.structured_logs.append(entry)
            log_aggregator.add_entry(entry)
    
    # Override parent methods to add aggregation
    def step(self, step_name: str, details: Optional[Dict[str, Any]] = None):
        """Enhanced step with aggregation"""
        super().step(step_name, details)
        self._log_and_aggregate("STEP", f"Step: {step_name}", details)
        self.increment_counter("steps_total")
        
        # Trigger step hooks
        self._trigger_hooks("step", {
            "step_name": step_name,
            "step_number": self._current_step,
            "details": details
        })
    
    def step_complete(self, step_name: str, details: Optional[Dict[str, Any]] = None):
        """Enhanced step completion with aggregation"""
        super().step_complete(step_name, details)
        self._log_and_aggregate("STEP_COMPLETE", f"Completed: {step_name}", details)
        self.increment_counter("steps_completed")
        
        # Trigger step completion hooks
        self._trigger_hooks("step_complete", {
            "step_name": step_name,
            "step_number": self._current_step,
            "details": details
        })
    
    def error(self, message: str, error: Optional[Exception] = None, details: Optional[Dict[str, Any]] = None):
        """Enhanced error logging with aggregation"""
        super().error(message, error, details)
        
        error_details = details or {}
        if error:
            error_details.update({
                "error_type": type(error).__name__,
                "error_message": str(error)
            })
        
        self._log_and_aggregate("ERROR", message, error_details)
        self.increment_counter("errors_total")
        
        # Trigger error hooks
        self._trigger_hooks("error", {
            "message": message,
            "error": error,
            "details": error_details
        })
    
    def warning(self, message: str, details: Optional[Dict[str, Any]] = None):
        """Enhanced warning logging with aggregation"""
        super().warning(message, details)
        self._log_and_aggregate("WARNING", message, details)
        self.increment_counter("warnings_total")
        
        # Trigger warning hooks
        self._trigger_hooks("warning", {
            "message": message,
            "details": details
        })
    
    def get_workflow_summary(self) -> Dict[str, Any]:
        """Get comprehensive workflow summary"""
        total_time = (datetime.now() - self._overall_start_time).total_seconds()
        
        phase_summaries = {}
        for phase, start_time in self.phase_start_times.items():
            duration = (datetime.now() - start_time).total_seconds()
            phase_summaries[phase.value] = {
                "duration": duration,
                "metrics": [m.to_dict() for m in self.phase_metrics[phase]]
            }
        
        # Get correlation context information
        correlation_info = {}
        if self.enable_performance_tracking:
            context = correlation_manager.get_context(self.correlation_id)
            if context:
                correlation_info = {
                    "components": list(context.components),
                    "services": list(context.services),
                    "operations": context.operations,
                    "correlation_duration": context.get_duration()
                }
        
        return {
            "workflow_id": self.workflow_id,
            "correlation_id": self.correlation_id,
            "total_duration": total_time,
            "current_phase": self.current_phase.value if self.current_phase else None,
            "phases": phase_summaries,
            "counters": dict(self.counters),
            "gauges": dict(self.gauges),
            "performance_metrics": self.get_performance_summary(),
            "log_count": len(self.structured_logs),
            "custom_tags": self.custom_tags,
            "correlation_info": correlation_info
        }
    
    def export_logs(self, format: str = "json") -> str:
        """Export structured logs in specified format"""
        if format == "json":
            return json.dumps([entry.to_dict() for entry in self.structured_logs], indent=2)
        else:
            raise ValueError(f"Unsupported export format: {format}")
    
    def finalize_workflow(self):
        """Finalize workflow and cleanup resources"""
        # End correlation timing
        if self.enable_performance_tracking:
            correlation_manager.end_correlation_timing(self.correlation_id)
        
        # End current phase if active
        if self.current_phase:
            self.end_phase()
        
        # Record final metrics
        total_duration = self.get_total_time()
        if self.enable_performance_tracking:
            metrics_collector.record_timer(
                "workflow_total_duration",
                total_duration,
                tags={**self.custom_tags, "workflow_id": self.workflow_id}
            )
        
        self.info("Workflow finalized", {
            "total_duration": f"{total_duration:.2f}s",
            "final_summary": self.get_workflow_summary()
        })


# Factory functions for easy creation
def create_workflow_logger(
    workflow_name: str,
    correlation_id: Optional[str] = None,
    connection_id: Optional[str] = None,
    custom_tags: Optional[Dict[str, str]] = None
) -> EnhancedSSELogger:
    """Create enhanced logger for workflow tracking"""
    return EnhancedSSELogger(
        name=f"workflow_{workflow_name}",
        correlation_id=correlation_id,
        connection_id=connection_id,
        custom_tags=custom_tags or {},
        enable_aggregation=True,
        enable_performance_tracking=True
    )


def create_job_logger(
    job_id: str,
    process_name: str,
    connection_id: Optional[str] = None,
    custom_tags: Optional[Dict[str, str]] = None
) -> EnhancedSSELogger:
    """Create enhanced logger for job tracking"""
    return EnhancedSSELogger(
        name=f"{process_name}_{job_id}",
        correlation_id=f"{job_id}_{process_name}",
        connection_id=connection_id,
        workflow_id=job_id,
        custom_tags={**(custom_tags or {}), "job_id": job_id, "process": process_name},
        enable_aggregation=True,
        enable_performance_tracking=True
    )