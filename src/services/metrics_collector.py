"""
Performance Metrics Collection System
Advanced metrics collection, aggregation, and monitoring for RESUME2WEBSITE
"""

import time
import threading
import asyncio
from typing import Dict, List, Optional, Callable, Any, Union
from datetime import datetime, timedelta
from dataclasses import dataclass, field
from collections import defaultdict, deque
from statistics import mean, median, stdev
from enum import Enum
import logging
import json

logger = logging.getLogger(__name__)


class MetricType(Enum):
    """Types of metrics that can be collected"""
    COUNTER = "counter"           # Monotonically increasing values
    GAUGE = "gauge"              # Point-in-time values
    HISTOGRAM = "histogram"       # Distribution of values
    TIMER = "timer"              # Duration measurements
    RATE = "rate"                # Events per time unit
    SET = "set"                  # Unique values


class TimeWindow(Enum):
    """Time windows for metric aggregation"""
    MINUTE = 60
    FIVE_MINUTES = 300
    HOUR = 3600
    DAY = 86400


@dataclass
class MetricValue:
    """Individual metric measurement"""
    value: Union[float, int, str]
    timestamp: datetime
    tags: Dict[str, str] = field(default_factory=dict)
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "value": self.value,
            "timestamp": self.timestamp.isoformat(),
            "tags": self.tags
        }


@dataclass
class MetricSummary:
    """Statistical summary of metric values"""
    count: int
    min_value: Optional[float] = None
    max_value: Optional[float] = None
    mean_value: Optional[float] = None
    median_value: Optional[float] = None
    std_dev: Optional[float] = None
    p50: Optional[float] = None
    p95: Optional[float] = None
    p99: Optional[float] = None
    total: Optional[float] = None
    rate_per_second: Optional[float] = None
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "count": self.count,
            "min": self.min_value,
            "max": self.max_value,
            "mean": self.mean_value,
            "median": self.median_value,
            "std_dev": self.std_dev,
            "p50": self.p50,
            "p95": self.p95,
            "p99": self.p99,
            "total": self.total,
            "rate_per_second": self.rate_per_second
        }


class MetricBuffer:
    """Ring buffer for storing metric values with automatic cleanup"""
    
    def __init__(self, max_size: int = 10000, max_age_seconds: int = 3600):
        self.max_size = max_size
        self.max_age_seconds = max_age_seconds
        self.values: deque = deque(maxlen=max_size)
        self._lock = threading.Lock()
    
    def add_value(self, value: MetricValue):
        """Add new metric value"""
        with self._lock:
            self.values.append(value)
            self._cleanup_old_values()
    
    def _cleanup_old_values(self):
        """Remove values older than max_age_seconds"""
        cutoff = datetime.now() - timedelta(seconds=self.max_age_seconds)
        while self.values and self.values[0].timestamp < cutoff:
            self.values.popleft()
    
    def get_values(self, since: Optional[datetime] = None) -> List[MetricValue]:
        """Get values since a specific time"""
        with self._lock:
            self._cleanup_old_values()
            if since is None:
                return list(self.values)
            return [v for v in self.values if v.timestamp >= since]
    
    def get_numeric_values(self, since: Optional[datetime] = None) -> List[float]:
        """Get numeric values only"""
        values = self.get_values(since)
        return [float(v.value) for v in values if isinstance(v.value, (int, float))]
    
    def calculate_summary(self, since: Optional[datetime] = None, duration_seconds: Optional[int] = None) -> MetricSummary:
        """Calculate statistical summary of values"""
        numeric_values = self.get_numeric_values(since)
        
        if not numeric_values:
            return MetricSummary(count=0)
        
        summary = MetricSummary(
            count=len(numeric_values),
            min_value=min(numeric_values),
            max_value=max(numeric_values),
            mean_value=mean(numeric_values),
            total=sum(numeric_values)
        )
        
        if len(numeric_values) > 1:
            summary.median_value = median(numeric_values)
            summary.std_dev = stdev(numeric_values)
            
            # Calculate percentiles
            sorted_values = sorted(numeric_values)
            n = len(sorted_values)
            summary.p50 = sorted_values[int(n * 0.5)]
            summary.p95 = sorted_values[int(n * 0.95)]
            summary.p99 = sorted_values[int(n * 0.99)]
        
        # Calculate rate if duration is provided
        if duration_seconds and duration_seconds > 0:
            summary.rate_per_second = len(numeric_values) / duration_seconds
        
        return summary


class MetricsCollector:
    """Main metrics collection and aggregation system"""
    
    def __init__(self, enable_background_processing: bool = True):
        self.metrics: Dict[str, MetricBuffer] = defaultdict(lambda: MetricBuffer())
        self.metric_types: Dict[str, MetricType] = {}
        self.metric_metadata: Dict[str, Dict[str, Any]] = {}
        self.alert_thresholds: Dict[str, Dict[str, float]] = {}
        self.alert_handlers: List[Callable[[str, Dict[str, Any]], None]] = []
        self._lock = threading.RLock()
        
        # Background processing
        self.enable_background_processing = enable_background_processing
        self._background_task: Optional[threading.Timer] = None
        self._stop_background = False
        
        if enable_background_processing:
            self._start_background_processing()
    
    def _start_background_processing(self):
        """Start background metric processing"""
        def background_loop():
            while not self._stop_background:
                try:
                    self._process_alerts()
                    self._cleanup_old_metrics()
                    time.sleep(30)  # Run every 30 seconds
                except Exception as e:
                    logger.error(f"Background metrics processing error: {e}")
        
        thread = threading.Thread(target=background_loop, daemon=True)
        thread.start()
        logger.info("Started background metrics processing")
    
    def register_metric(
        self,
        name: str,
        metric_type: MetricType,
        description: str = "",
        unit: str = "",
        tags: Optional[Dict[str, str]] = None
    ):
        """Register a new metric"""
        with self._lock:
            self.metric_types[name] = metric_type
            self.metric_metadata[name] = {
                "description": description,
                "unit": unit,
                "tags": tags or {},
                "created_at": datetime.now().isoformat()
            }
        
        logger.debug(f"Registered metric: {name} ({metric_type.value})")
    
    def record_value(
        self,
        metric_name: str,
        value: Union[float, int, str],
        tags: Optional[Dict[str, str]] = None,
        timestamp: Optional[datetime] = None
    ):
        """Record a metric value"""
        if timestamp is None:
            timestamp = datetime.now()
        
        metric_value = MetricValue(
            value=value,
            timestamp=timestamp,
            tags=tags or {}
        )
        
        with self._lock:
            self.metrics[metric_name].add_value(metric_value)
        
        # Check alerts
        if self.enable_background_processing:
            self._check_metric_alerts(metric_name, value)
    
    def increment_counter(self, metric_name: str, value: int = 1, tags: Optional[Dict[str, str]] = None):
        """Increment a counter metric"""
        self.record_value(metric_name, value, tags)
    
    def set_gauge(self, metric_name: str, value: Union[float, int], tags: Optional[Dict[str, str]] = None):
        """Set a gauge metric value"""
        self.record_value(metric_name, value, tags)
    
    def record_timer(self, metric_name: str, duration_seconds: float, tags: Optional[Dict[str, str]] = None):
        """Record a timer/duration metric"""
        self.record_value(metric_name, duration_seconds, tags)
    
    def record_histogram_value(self, metric_name: str, value: float, tags: Optional[Dict[str, str]] = None):
        """Record a histogram value"""
        self.record_value(metric_name, value, tags)
    
    def get_metric_summary(
        self,
        metric_name: str,
        time_window: TimeWindow = TimeWindow.HOUR
    ) -> Optional[MetricSummary]:
        """Get statistical summary for a metric"""
        with self._lock:
            if metric_name not in self.metrics:
                return None
            
            since = datetime.now() - timedelta(seconds=time_window.value)
            return self.metrics[metric_name].calculate_summary(since, time_window.value)
    
    def get_metric_values(
        self,
        metric_name: str,
        time_window: TimeWindow = TimeWindow.HOUR
    ) -> List[MetricValue]:
        """Get raw metric values"""
        with self._lock:
            if metric_name not in self.metrics:
                return []
            
            since = datetime.now() - timedelta(seconds=time_window.value)
            return self.metrics[metric_name].get_values(since)
    
    def get_all_metrics_summary(self, time_window: TimeWindow = TimeWindow.HOUR) -> Dict[str, MetricSummary]:
        """Get summaries for all metrics"""
        summaries = {}
        with self._lock:
            for metric_name in self.metrics.keys():
                summary = self.get_metric_summary(metric_name, time_window)
                if summary and summary.count > 0:
                    summaries[metric_name] = summary
        return summaries
    
    def set_alert_threshold(
        self,
        metric_name: str,
        threshold_type: str,  # "min", "max", "rate"
        threshold_value: float,
        time_window: TimeWindow = TimeWindow.MINUTE
    ):
        """Set alert threshold for a metric"""
        with self._lock:
            if metric_name not in self.alert_thresholds:
                self.alert_thresholds[metric_name] = {}
            
            self.alert_thresholds[metric_name][threshold_type] = {
                "value": threshold_value,
                "time_window": time_window
            }
        
        logger.info(f"Set alert threshold for {metric_name}: {threshold_type} = {threshold_value}")
    
    def add_alert_handler(self, handler: Callable[[str, Dict[str, Any]], None]):
        """Add alert handler function"""
        self.alert_handlers.append(handler)
    
    def _check_metric_alerts(self, metric_name: str, current_value: Union[float, int]):
        """Check if metric value triggers any alerts"""
        if metric_name not in self.alert_thresholds:
            return
        
        thresholds = self.alert_thresholds[metric_name]
        
        for threshold_type, config in thresholds.items():
            threshold_value = config["value"]
            time_window = config["time_window"]
            
            alert_triggered = False
            alert_data = {
                "metric_name": metric_name,
                "threshold_type": threshold_type,
                "threshold_value": threshold_value,
                "current_value": current_value,
                "timestamp": datetime.now().isoformat()
            }
            
            if threshold_type == "max" and isinstance(current_value, (int, float)):
                if current_value > threshold_value:
                    alert_triggered = True
                    alert_data["message"] = f"Metric {metric_name} exceeded maximum threshold: {current_value} > {threshold_value}"
            
            elif threshold_type == "min" and isinstance(current_value, (int, float)):
                if current_value < threshold_value:
                    alert_triggered = True
                    alert_data["message"] = f"Metric {metric_name} below minimum threshold: {current_value} < {threshold_value}"
            
            elif threshold_type == "rate":
                summary = self.get_metric_summary(metric_name, time_window)
                if summary and summary.rate_per_second and summary.rate_per_second > threshold_value:
                    alert_triggered = True
                    alert_data["current_rate"] = summary.rate_per_second
                    alert_data["message"] = f"Metric {metric_name} rate exceeded threshold: {summary.rate_per_second:.2f}/s > {threshold_value}/s"
            
            if alert_triggered:
                self._trigger_alert(metric_name, alert_data)
    
    def _trigger_alert(self, metric_name: str, alert_data: Dict[str, Any]):
        """Trigger alert handlers"""
        logger.warning(f"ALERT: {alert_data['message']}")
        
        for handler in self.alert_handlers:
            try:
                handler(metric_name, alert_data)
            except Exception as e:
                logger.error(f"Alert handler failed: {e}")
    
    def _process_alerts(self):
        """Background processing for alert checking"""
        # This could include more sophisticated alert logic
        # like checking trends, anomaly detection, etc.
        pass
    
    def _cleanup_old_metrics(self):
        """Clean up old metric buffers"""
        with self._lock:
            # Trigger cleanup on all metric buffers
            for buffer in self.metrics.values():
                buffer._cleanup_old_values()
    
    def export_metrics(self, format: str = "json", time_window: TimeWindow = TimeWindow.HOUR) -> str:
        """Export metrics in specified format"""
        summaries = self.get_all_metrics_summary(time_window)
        
        if format == "json":
            export_data = {
                "timestamp": datetime.now().isoformat(),
                "time_window_seconds": time_window.value,
                "metrics": {name: summary.to_dict() for name, summary in summaries.items()},
                "metadata": self.metric_metadata
            }
            return json.dumps(export_data, indent=2)
        
        elif format == "prometheus":
            # Simple Prometheus format export
            lines = []
            for name, summary in summaries.items():
                metric_type = self.metric_types.get(name, MetricType.GAUGE).value
                
                lines.append(f"# HELP {name} {self.metric_metadata.get(name, {}).get('description', '')}")
                lines.append(f"# TYPE {name} {metric_type}")
                
                if summary.count > 0:
                    if summary.total is not None:
                        lines.append(f"{name}_total {summary.total}")
                    if summary.count:
                        lines.append(f"{name}_count {summary.count}")
                    if summary.mean_value is not None:
                        lines.append(f"{name}_mean {summary.mean_value}")
            
            return "\n".join(lines)
        
        else:
            raise ValueError(f"Unsupported export format: {format}")
    
    def get_statistics(self) -> Dict[str, Any]:
        """Get collector statistics"""
        with self._lock:
            total_values = sum(len(buffer.values) for buffer in self.metrics.values())
            
            return {
                "total_metrics": len(self.metrics),
                "total_values": total_values,
                "registered_types": len(self.metric_types),
                "alert_thresholds": len(self.alert_thresholds),
                "alert_handlers": len(self.alert_handlers),
                "background_processing": self.enable_background_processing
            }
    
    def shutdown(self):
        """Shutdown the metrics collector"""
        self._stop_background = True
        logger.info("Metrics collector shutdown")


# Global metrics collector instance
metrics_collector = MetricsCollector()


# Context manager for timing operations
class Timer:
    """Context manager for timing operations"""
    
    def __init__(self, metric_name: str, tags: Optional[Dict[str, str]] = None):
        self.metric_name = metric_name
        self.tags = tags
        self.start_time: Optional[float] = None
    
    def __enter__(self):
        self.start_time = time.time()
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.start_time:
            duration = time.time() - self.start_time
            metrics_collector.record_timer(self.metric_name, duration, self.tags)


# Decorator for timing functions
def timed(metric_name: str, tags: Optional[Dict[str, str]] = None):
    """Decorator to time function execution"""
    def decorator(func):
        def wrapper(*args, **kwargs):
            with Timer(metric_name, tags):
                return func(*args, **kwargs)
        return wrapper
    return decorator


# Convenience functions
def record_cv_processing_time(duration: float, user_id: str, file_type: str):
    """Record CV processing time with relevant tags"""
    metrics_collector.record_timer(
        "cv_processing_duration",
        duration,
        {"user_id": user_id, "file_type": file_type}
    )


def record_portfolio_generation_time(duration: float, template_type: str, components_count: int):
    """Record portfolio generation time"""
    metrics_collector.record_timer(
        "portfolio_generation_duration",
        duration,
        {"template": template_type, "components": str(components_count)}
    )


def record_sse_connection(user_id: str, endpoint: str):
    """Record SSE connection event"""
    metrics_collector.increment_counter(
        "sse_connections_total",
        1,
        {"user_id": user_id, "endpoint": endpoint}
    )


def record_api_request(endpoint: str, method: str, status_code: int, duration: float):
    """Record API request metrics"""
    metrics_collector.increment_counter(
        "api_requests_total",
        1,
        {"endpoint": endpoint, "method": method, "status": str(status_code)}
    )
    
    metrics_collector.record_timer(
        "api_request_duration",
        duration,
        {"endpoint": endpoint, "method": method}
    )


# Initialize common metrics
def initialize_common_metrics():
    """Initialize commonly used metrics"""
    
    # CV Processing metrics
    metrics_collector.register_metric(
        "cv_processing_duration",
        MetricType.TIMER,
        "Time taken to process CV files",
        "seconds"
    )
    
    # Portfolio generation metrics
    metrics_collector.register_metric(
        "portfolio_generation_duration",
        MetricType.TIMER,
        "Time taken to generate portfolio",
        "seconds"
    )
    
    # SSE metrics
    metrics_collector.register_metric(
        "sse_connections_total",
        MetricType.COUNTER,
        "Total SSE connections",
        "connections"
    )
    
    metrics_collector.register_metric(
        "sse_messages_sent",
        MetricType.COUNTER,
        "Total SSE messages sent",
        "messages"
    )
    
    # API metrics
    metrics_collector.register_metric(
        "api_requests_total",
        MetricType.COUNTER,
        "Total API requests",
        "requests"
    )
    
    metrics_collector.register_metric(
        "api_request_duration",
        MetricType.TIMER,
        "API request duration",
        "seconds"
    )
    
    # System metrics
    metrics_collector.register_metric(
        "active_users",
        MetricType.GAUGE,
        "Number of active users",
        "users"
    )
    
    metrics_collector.register_metric(
        "memory_usage",
        MetricType.GAUGE,
        "Memory usage",
        "bytes"
    )
    
    # Set some basic alert thresholds
    metrics_collector.set_alert_threshold("api_request_duration", "max", 5.0)  # 5 second max
    metrics_collector.set_alert_threshold("cv_processing_duration", "max", 30.0)  # 30 second max
    metrics_collector.set_alert_threshold("sse_connections_total", "rate", 10.0)  # 10 connections/second max


# Initialize metrics on import
initialize_common_metrics()