"""
Log Aggregation Service
Advanced log aggregation, analysis, and monitoring system for CV2WEB
"""

import asyncio
import time
import threading
from typing import Dict, List, Optional, Any, Callable, Union
from datetime import datetime, timedelta
from dataclasses import dataclass, field
from collections import defaultdict, deque
from enum import Enum
import json
import logging

from src.utils.enhanced_sse_logger import LogEntry, log_aggregator
from src.services.correlation_manager import correlation_manager
from src.services.metrics_collector import metrics_collector

logger = logging.getLogger(__name__)


class AggregationLevel(Enum):
    """Log aggregation levels"""
    RAW = "raw"                    # Individual log entries
    CORRELATION = "correlation"    # Aggregated by correlation ID
    WORKFLOW = "workflow"          # Aggregated by workflow
    TIMEFRAME = "timeframe"        # Aggregated by time windows
    COMPONENT = "component"        # Aggregated by component/service


class AlertSeverity(Enum):
    """Alert severity levels"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


@dataclass
class LogAlert:
    """Log-based alert"""
    id: str
    severity: AlertSeverity
    title: str
    message: str
    correlation_id: str
    component: str
    timestamp: datetime
    metadata: Dict[str, Any] = field(default_factory=dict)
    resolved: bool = False
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "severity": self.severity.value,
            "title": self.title,
            "message": self.message,
            "correlation_id": self.correlation_id,
            "component": self.component,
            "timestamp": self.timestamp.isoformat(),
            "metadata": self.metadata,
            "resolved": self.resolved
        }


@dataclass
class LogPattern:
    """Pattern matching for log analysis"""
    name: str
    pattern: str  # Regex or string match
    severity: AlertSeverity
    description: str
    action: Optional[Callable[[LogEntry], None]] = None
    
    def matches(self, entry: LogEntry) -> bool:
        """Check if log entry matches this pattern"""
        import re
        return bool(re.search(self.pattern, entry.message, re.IGNORECASE))


@dataclass
class AggregationReport:
    """Aggregated log analysis report"""
    timeframe: str
    total_entries: int
    error_rate: float
    warning_rate: float
    top_errors: List[Dict[str, Any]]
    performance_summary: Dict[str, Any]
    correlation_breakdown: Dict[str, int]
    component_breakdown: Dict[str, int]
    alerts_generated: int
    trends: Dict[str, Any]
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "timeframe": self.timeframe,
            "total_entries": self.total_entries,
            "error_rate": self.error_rate,
            "warning_rate": self.warning_rate,
            "top_errors": self.top_errors,
            "performance_summary": self.performance_summary,
            "correlation_breakdown": self.correlation_breakdown,
            "component_breakdown": self.component_breakdown,
            "alerts_generated": self.alerts_generated,
            "trends": self.trends
        }


class LogAggregationService:
    """Main log aggregation and analysis service"""
    
    def __init__(self, aggregation_interval: int = 60, alert_threshold: int = 10):
        self.aggregation_interval = aggregation_interval
        self.alert_threshold = alert_threshold
        
        # Alert management
        self.active_alerts: Dict[str, LogAlert] = {}
        self.alert_handlers: List[Callable[[LogAlert], None]] = []
        self.log_patterns: List[LogPattern] = []
        
        # Analysis buffers
        self.analysis_cache: Dict[str, AggregationReport] = {}
        self.trending_data: Dict[str, deque] = defaultdict(lambda: deque(maxlen=100))
        
        # Background processing
        self._stop_background = False
        self._background_task: Optional[threading.Timer] = None
        
        # Initialize default patterns
        self._initialize_default_patterns()
        
        # Start background processing
        self._start_background_processing()
    
    def _initialize_default_patterns(self):
        """Initialize default log patterns for common issues"""
        
        # Error patterns
        self.log_patterns.extend([
            LogPattern(
                name="critical_error",
                pattern=r"(critical|fatal|exception|traceback)",
                severity=AlertSeverity.CRITICAL,
                description="Critical errors requiring immediate attention"
            ),
            LogPattern(
                name="database_error",
                pattern=r"(database|sql|connection.*failed|timeout.*query)",
                severity=AlertSeverity.HIGH,
                description="Database connectivity or query issues"
            ),
            LogPattern(
                name="auth_failure",
                pattern=r"(authentication.*failed|unauthorized|forbidden|invalid.*token)",
                severity=AlertSeverity.HIGH,
                description="Authentication or authorization failures"
            ),
            LogPattern(
                name="rate_limit_exceeded",
                pattern=r"(rate.*limit|too.*many.*requests|quota.*exceeded)",
                severity=AlertSeverity.MEDIUM,
                description="Rate limiting or quota issues"
            ),
            LogPattern(
                name="performance_degradation",
                pattern=r"(slow|timeout|performance|latency.*high)",
                severity=AlertSeverity.MEDIUM,
                description="Performance degradation detected"
            ),
            LogPattern(
                name="memory_warning",
                pattern=r"(memory.*low|out.*of.*memory|heap.*full)",
                severity=AlertSeverity.HIGH,
                description="Memory-related warnings"
            )
        ])
    
    def _start_background_processing(self):
        """Start background log analysis"""
        def background_loop():
            while not self._stop_background:
                try:
                    self._process_aggregation()
                    self._check_alert_patterns()
                    self._update_trends()
                    time.sleep(self.aggregation_interval)
                except Exception as e:
                    logger.error(f"Background log processing error: {e}")
        
        thread = threading.Thread(target=background_loop, daemon=True)
        thread.start()
        logger.info("Started background log aggregation processing")
    
    def _process_aggregation(self):
        """Process log aggregation for analysis"""
        now = datetime.now()
        
        # Get recent log entries
        recent_entries = []
        for correlation_id, entries in log_aggregator.correlation_index.items():
            recent_entries.extend([
                entry for entry in entries 
                if (now - entry.timestamp).total_seconds() < self.aggregation_interval
            ])
        
        if not recent_entries:
            return
        
        # Generate aggregation report
        report = self._generate_aggregation_report(recent_entries, "last_minute")
        self.analysis_cache[f"minute_{now.strftime('%Y%m%d_%H%M')}"] = report
        
        # Cleanup old cache entries
        cutoff = now - timedelta(hours=24)
        old_keys = [
            key for key in self.analysis_cache.keys()
            if datetime.strptime(key.split('_')[1] + '_' + key.split('_')[2], '%Y%m%d_%H%M') < cutoff
        ]
        for key in old_keys:
            del self.analysis_cache[key]
    
    def _generate_aggregation_report(self, entries: List[LogEntry], timeframe: str) -> AggregationReport:
        """Generate aggregation report from log entries"""
        if not entries:
            return AggregationReport(
                timeframe=timeframe,
                total_entries=0,
                error_rate=0.0,
                warning_rate=0.0,
                top_errors=[],
                performance_summary={},
                correlation_breakdown={},
                component_breakdown={},
                alerts_generated=0,
                trends={}
            )
        
        total_entries = len(entries)
        error_entries = [e for e in entries if e.level == "ERROR"]
        warning_entries = [e for e in entries if e.level == "WARNING"]
        
        # Calculate rates
        error_rate = len(error_entries) / total_entries * 100
        warning_rate = len(warning_entries) / total_entries * 100
        
        # Top errors analysis
        error_messages = defaultdict(int)
        for entry in error_entries:
            error_messages[entry.message] += 1
        
        top_errors = [
            {"message": msg, "count": count}
            for msg, count in sorted(error_messages.items(), key=lambda x: x[1], reverse=True)[:10]
        ]
        
        # Correlation breakdown
        correlation_breakdown = defaultdict(int)
        for entry in entries:
            correlation_breakdown[entry.correlation_id] += 1
        
        # Component breakdown
        component_breakdown = defaultdict(int)
        for entry in entries:
            component_breakdown[entry.logger_name] += 1
        
        # Performance summary
        performance_metrics = []
        for entry in entries:
            performance_metrics.extend(entry.metrics)
        
        performance_summary = {
            "total_metrics": len(performance_metrics),
            "avg_duration": sum(
                m.value for m in performance_metrics if m.type.value == "duration"
            ) / max(1, len([m for m in performance_metrics if m.type.value == "duration"])),
            "total_counters": sum(
                m.value for m in performance_metrics if m.type.value == "counter"
            )
        }
        
        return AggregationReport(
            timeframe=timeframe,
            total_entries=total_entries,
            error_rate=error_rate,
            warning_rate=warning_rate,
            top_errors=top_errors,
            performance_summary=performance_summary,
            correlation_breakdown=dict(correlation_breakdown),
            component_breakdown=dict(component_breakdown),
            alerts_generated=len([a for a in self.active_alerts.values() if not a.resolved]),
            trends=self._calculate_trends()
        )
    
    def _check_alert_patterns(self):
        """Check recent logs against alert patterns"""
        now = datetime.now()
        
        # Get recent entries (last 5 minutes)
        recent_entries = []
        cutoff = now - timedelta(minutes=5)
        
        for entries in log_aggregator.correlation_index.values():
            recent_entries.extend([
                entry for entry in entries if entry.timestamp > cutoff
            ])
        
        # Check each entry against patterns
        for entry in recent_entries:
            for pattern in self.log_patterns:
                if pattern.matches(entry):
                    self._create_alert(pattern, entry)
    
    def _create_alert(self, pattern: LogPattern, entry: LogEntry):
        """Create alert based on pattern match"""
        import uuid
        
        alert_id = f"alert_{uuid.uuid4().hex[:8]}"
        
        alert = LogAlert(
            id=alert_id,
            severity=pattern.severity,
            title=f"{pattern.name.replace('_', ' ').title()} Detected",
            message=f"{pattern.description}: {entry.message}",
            correlation_id=entry.correlation_id,
            component=entry.logger_name,
            timestamp=entry.timestamp,
            metadata={
                "pattern_name": pattern.name,
                "log_level": entry.level,
                "phase": entry.phase.value if entry.phase else None
            }
        )
        
        self.active_alerts[alert_id] = alert
        
        # Trigger alert handlers
        for handler in self.alert_handlers:
            try:
                handler(alert)
            except Exception as e:
                logger.error(f"Alert handler failed: {e}")
        
        logger.warning(f"Alert generated: {alert.title} ({alert.severity.value})")
    
    def _update_trends(self):
        """Update trending data for analysis"""
        now = datetime.now()
        
        # Error rate trend
        recent_errors = sum(
            1 for entries in log_aggregator.correlation_index.values()
            for entry in entries
            if entry.level == "ERROR" and (now - entry.timestamp).total_seconds() < 300
        )
        
        self.trending_data["error_rate"].append({
            "timestamp": now.isoformat(),
            "value": recent_errors
        })
        
        # Performance trends from metrics collector
        api_duration_summary = metrics_collector.get_metric_summary("api_request_duration")
        if api_duration_summary:
            self.trending_data["api_performance"].append({
                "timestamp": now.isoformat(),
                "avg_duration": api_duration_summary.mean_value,
                "p95_duration": api_duration_summary.p95
            })
    
    def _calculate_trends(self) -> Dict[str, Any]:
        """Calculate trend analysis"""
        trends = {}
        
        for trend_name, data_points in self.trending_data.items():
            if len(data_points) < 2:
                continue
            
            # Simple trend calculation (increasing/decreasing)
            recent_values = [point["value"] if "value" in point else point.get("avg_duration", 0) 
                           for point in list(data_points)[-10:]]
            
            if len(recent_values) >= 2:
                trend_direction = "increasing" if recent_values[-1] > recent_values[0] else "decreasing"
                trend_magnitude = abs(recent_values[-1] - recent_values[0]) / max(recent_values[0], 1) * 100
                
                trends[trend_name] = {
                    "direction": trend_direction,
                    "magnitude": round(trend_magnitude, 2),
                    "current_value": recent_values[-1]
                }
        
        return trends
    
    def add_log_pattern(self, pattern: LogPattern):
        """Add custom log pattern for monitoring"""
        self.log_patterns.append(pattern)
        logger.info(f"Added log pattern: {pattern.name}")
    
    def add_alert_handler(self, handler: Callable[[LogAlert], None]):
        """Add alert handler function"""
        self.alert_handlers.append(handler)
    
    def get_recent_report(self, minutes: int = 60) -> Optional[AggregationReport]:
        """Get aggregation report for recent time period"""
        now = datetime.now()
        cutoff = now - timedelta(minutes=minutes)
        
        # Collect entries from the timeframe
        recent_entries = []
        for entries in log_aggregator.correlation_index.values():
            recent_entries.extend([
                entry for entry in entries if entry.timestamp > cutoff
            ])
        
        return self._generate_aggregation_report(recent_entries, f"last_{minutes}_minutes")
    
    def get_correlation_analysis(self, correlation_id: str) -> Dict[str, Any]:
        """Get detailed analysis for specific correlation ID"""
        entries = log_aggregator.get_correlation_logs(correlation_id)
        if not entries:
            return {"error": "No logs found for correlation ID"}
        
        # Basic statistics
        error_count = sum(1 for e in entries if e.level == "ERROR")
        warning_count = sum(1 for e in entries if e.level == "WARNING")
        
        # Timeline analysis
        timeline = [
            {
                "timestamp": entry.timestamp.isoformat(),
                "level": entry.level,
                "message": entry.message,
                "phase": entry.phase.value if entry.phase else None
            }
            for entry in sorted(entries, key=lambda x: x.timestamp)
        ]
        
        # Performance metrics
        all_metrics = []
        for entry in entries:
            all_metrics.extend(entry.metrics)
        
        performance_analysis = {
            "total_metrics": len(all_metrics),
            "duration_metrics": [m.to_dict() for m in all_metrics if m.type.value == "duration"],
            "counter_metrics": [m.to_dict() for m in all_metrics if m.type.value == "counter"]
        }
        
        return {
            "correlation_id": correlation_id,
            "total_entries": len(entries),
            "error_count": error_count,
            "warning_count": warning_count,
            "timeline": timeline,
            "performance_analysis": performance_analysis,
            "duration": (entries[-1].timestamp - entries[0].timestamp).total_seconds() if entries else 0
        }
    
    def get_active_alerts(self) -> List[LogAlert]:
        """Get all active (unresolved) alerts"""
        return [alert for alert in self.active_alerts.values() if not alert.resolved]
    
    def resolve_alert(self, alert_id: str) -> bool:
        """Mark alert as resolved"""
        if alert_id in self.active_alerts:
            self.active_alerts[alert_id].resolved = True
            logger.info(f"Alert resolved: {alert_id}")
            return True
        return False
    
    def export_analysis(self, format: str = "json", timeframe_minutes: int = 60) -> str:
        """Export aggregation analysis in specified format"""
        report = self.get_recent_report(timeframe_minutes)
        if not report:
            return json.dumps({"error": "No data available"})
        
        if format == "json":
            export_data = {
                "aggregation_report": report.to_dict(),
                "active_alerts": [alert.to_dict() for alert in self.get_active_alerts()],
                "trending_data": dict(self.trending_data),
                "export_timestamp": datetime.now().isoformat()
            }
            return json.dumps(export_data, indent=2)
        else:
            raise ValueError(f"Unsupported export format: {format}")
    
    def get_statistics(self) -> Dict[str, Any]:
        """Get aggregation service statistics"""
        return {
            "total_patterns": len(self.log_patterns),
            "active_alerts": len(self.get_active_alerts()),
            "total_alerts": len(self.active_alerts),
            "alert_handlers": len(self.alert_handlers),
            "cache_entries": len(self.analysis_cache),
            "trending_metrics": len(self.trending_data),
            "aggregation_interval": self.aggregation_interval
        }
    
    def shutdown(self):
        """Shutdown the aggregation service"""
        self._stop_background = True
        logger.info("Log aggregation service shutdown")


# Global log aggregation service instance
log_aggregation_service = LogAggregationService()


# Alert handler functions
def console_alert_handler(alert: LogAlert):
    """Simple console alert handler"""
    print(f"🚨 ALERT [{alert.severity.value.upper()}]: {alert.title}")
    print(f"   Component: {alert.component}")
    print(f"   Message: {alert.message}")
    print(f"   Correlation: {alert.correlation_id}")


def sse_alert_handler(alert: LogAlert):
    """Send alerts via SSE"""
    from src.services.sse_service import sse_service
    
    alert_message = sse_service.create_message("alert", {
        "alert": alert.to_dict(),
        "timestamp": datetime.now().isoformat()
    })
    
    sse_service.connection_manager.broadcast_message(alert_message)


# Register default alert handlers
log_aggregation_service.add_alert_handler(console_alert_handler)
log_aggregation_service.add_alert_handler(sse_alert_handler)


# Convenience functions
def get_workflow_logs(workflow_id: str) -> List[LogEntry]:
    """Get all logs for a specific workflow"""
    workflow_entries = []
    for entries in log_aggregator.correlation_index.values():
        workflow_entries.extend([
            entry for entry in entries
            if entry.metadata.get("workflow_id") == workflow_id
        ])
    return sorted(workflow_entries, key=lambda x: x.timestamp)


def analyze_error_patterns(hours: int = 24) -> Dict[str, Any]:
    """Analyze error patterns over specified time period"""
    now = datetime.now()
    cutoff = now - timedelta(hours=hours)
    
    error_entries = []
    for entries in log_aggregator.correlation_index.values():
        error_entries.extend([
            entry for entry in entries
            if entry.level == "ERROR" and entry.timestamp > cutoff
        ])
    
    # Pattern analysis
    error_patterns = defaultdict(list)
    for entry in error_entries:
        # Group by similar error messages (simplified)
        key_words = set(entry.message.lower().split())
        pattern_key = " ".join(sorted(key_words)[:3])  # Use first 3 words as pattern
        error_patterns[pattern_key].append(entry)
    
    # Return top patterns
    pattern_analysis = []
    for pattern, entries in sorted(error_patterns.items(), key=lambda x: len(x[1]), reverse=True)[:10]:
        pattern_analysis.append({
            "pattern": pattern,
            "count": len(entries),
            "first_seen": min(entries, key=lambda x: x.timestamp).timestamp.isoformat(),
            "last_seen": max(entries, key=lambda x: x.timestamp).timestamp.isoformat(),
            "affected_correlations": len(set(e.correlation_id for e in entries))
        })
    
    return {
        "timeframe_hours": hours,
        "total_errors": len(error_entries),
        "unique_patterns": len(error_patterns),
        "top_patterns": pattern_analysis
    }