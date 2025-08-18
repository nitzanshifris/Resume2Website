"""
Metrics API endpoints for monitoring extraction performance
"""
from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta

from src.core.cv_extraction.metrics import metrics_collector
from src.core.cv_extraction.circuit_breaker import llm_circuit_breaker
from src.api.routes.auth import get_current_user_optional, require_admin

import logging

logger = logging.getLogger(__name__)

# Create router
router = APIRouter(prefix="/api/v1/metrics", tags=["metrics"])


@router.get("/health")
async def health_check():
    """Simple health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "cv-extraction-metrics"
    }


@router.get("/current")
async def get_current_metrics(
    user_id: Optional[str] = Depends(get_current_user_optional)
):
    """
    Get current aggregate metrics.
    Public endpoint - no auth required for basic metrics.
    """
    stats = metrics_collector.get_aggregate_stats()
    
    return {
        "status": "success",
        "timestamp": datetime.now().isoformat(),
        "metrics": {
            "overview": {
                "total_extractions": stats["total_extractions"],
                "success_rate": f"{stats['success_rate']}%",
                "active_extractions": stats["active_extractions"],
                "extractions_per_minute": round(stats["extractions_per_minute"], 2)
            },
            "performance": {
                "average_processing_time": f"{stats['average_processing_time']}s",
                "percentiles": {
                    "p50": f"{stats['processing_time_percentiles']['p50']}s",
                    "p95": f"{stats['processing_time_percentiles']['p95']}s",
                    "p99": f"{stats['processing_time_percentiles']['p99']}s"
                }
            }
        }
    }


@router.get("/detailed")
async def get_detailed_metrics(
    limit: int = 10,
    admin: bool = Depends(require_admin)
):
    """
    Get detailed metrics including recent extractions.
    Admin only - contains sensitive performance data.
    """
    stats = metrics_collector.get_aggregate_stats()
    recent = metrics_collector.get_recent_metrics(limit)
    
    # Calculate additional insights
    if recent:
        avg_sections = sum(m["counts"]["sections_extracted"] for m in recent) / len(recent)
        avg_confidence = sum(m["quality"]["extraction_confidence"] for m in recent) / len(recent)
        total_errors = sum(len(m["errors"]) for m in recent)
    else:
        avg_sections = 0
        avg_confidence = 0
        total_errors = 0
    
    return {
        "status": "success",
        "timestamp": datetime.now().isoformat(),
        "aggregate_stats": stats,
        "recent_extractions": recent,
        "insights": {
            "average_sections_per_extraction": round(avg_sections, 1),
            "average_confidence": f"{avg_confidence:.1%}",
            "total_errors_recent": total_errors,
            "peak_hours": _calculate_peak_hours(recent)
        }
    }


@router.get("/extraction/{extraction_id}")
async def get_extraction_metrics(
    extraction_id: str,
    admin: bool = Depends(require_admin)
):
    """
    Get metrics for a specific extraction.
    Admin only - contains detailed timing data.
    """
    metrics = metrics_collector.get_metrics(extraction_id)
    
    if not metrics:
        # Check in history
        for m in metrics_collector.metrics_history:
            if m.extraction_id == extraction_id:
                return {
                    "status": "success",
                    "metrics": m.to_dict()
                }
        
        raise HTTPException(status_code=404, detail="Extraction metrics not found")
    
    return {
        "status": "success",
        "metrics": metrics.to_dict()
    }


@router.get("/performance/summary")
async def get_performance_summary():
    """
    Get a performance summary suitable for dashboards.
    Public endpoint with aggregated data only.
    """
    stats = metrics_collector.get_aggregate_stats()
    
    # Determine health status
    if stats["active_extractions"] > 20:
        health = "overloaded"
    elif stats["success_rate"] < 90:
        health = "degraded"
    elif stats["average_processing_time"] > 30:
        health = "slow"
    else:
        health = "optimal"
    
    return {
        "health": health,
        "metrics": {
            "throughput": {
                "current_rpm": round(stats["extractions_per_minute"], 2),
                "active": stats["active_extractions"],
                "total_today": _get_today_count()
            },
            "quality": {
                "success_rate": stats["success_rate"],
                "failed_today": _get_today_failures()
            },
            "performance": {
                "avg_time": stats["average_processing_time"],
                "p95_time": stats["processing_time_percentiles"]["p95"]
            }
        },
        "timestamp": datetime.now().isoformat()
    }


@router.get("/circuit-breaker/status")
async def get_circuit_breaker_status():
    """
    Get the current status of the LLM circuit breaker.
    Public endpoint for monitoring service health.
    """
    status = llm_circuit_breaker.get_status()
    
    # Add health interpretation
    if status["state"] == "open":
        health = "critical"
        message = "LLM service is experiencing failures. Requests are being blocked."
    elif status["state"] == "half_open":
        health = "degraded"
        message = "LLM service is testing recovery. Limited requests allowed."
    else:
        health = "healthy"
        message = "LLM service is operating normally."
    
    return {
        "health": health,
        "message": message,
        "circuit_breaker": status,
        "timestamp": datetime.now().isoformat()
    }


@router.post("/circuit-breaker/reset")
async def reset_circuit_breaker(
    admin: bool = Depends(require_admin)
):
    """
    Manually reset the circuit breaker.
    Admin only - use when you know the service has recovered.
    """
    await llm_circuit_breaker.reset()
    
    logger.warning("Circuit breaker manually reset by admin")
    
    return {
        "status": "success",
        "message": "Circuit breaker has been reset",
        "new_state": "closed",
        "timestamp": datetime.now().isoformat()
    }


@router.post("/reset")
async def reset_metrics(
    admin: bool = Depends(require_admin)
):
    """
    Reset all metrics data.
    Admin only - use with caution!
    """
    # Reset the metrics collector
    metrics_collector.metrics_history.clear()
    metrics_collector.current_metrics.clear()
    metrics_collector.total_extractions = 0
    metrics_collector.successful_extractions = 0
    metrics_collector.failed_extractions = 0
    metrics_collector.total_processing_time = 0.0
    metrics_collector.average_processing_time = 0.0
    
    logger.warning("Metrics have been reset by admin")
    
    return {
        "status": "success",
        "message": "All metrics have been reset",
        "timestamp": datetime.now().isoformat()
    }


# Helper functions
def _calculate_peak_hours(recent_metrics: List[Dict]) -> List[int]:
    """Calculate peak usage hours from recent metrics"""
    if not recent_metrics:
        return []
    
    hour_counts = {}
    for m in recent_metrics:
        timestamp = datetime.fromisoformat(m["timestamp"])
        hour = timestamp.hour
        hour_counts[hour] = hour_counts.get(hour, 0) + 1
    
    # Return top 3 hours
    sorted_hours = sorted(hour_counts.items(), key=lambda x: x[1], reverse=True)
    return [hour for hour, _ in sorted_hours[:3]]


def _get_today_count() -> int:
    """Get count of extractions today"""
    today_start = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    count = sum(1 for m in metrics_collector.metrics_history if m.timestamp >= today_start)
    return count + len(metrics_collector.current_metrics)


def _get_today_failures() -> int:
    """Get count of failures today"""
    today_start = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    failures = sum(
        1 for m in metrics_collector.metrics_history 
        if m.timestamp >= today_start and m.sections_failed > 0
    )
    return failures