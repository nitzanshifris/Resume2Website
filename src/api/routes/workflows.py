"""
Workflow Management API
Enhanced API endpoints for complex workflow management with SSE integration
"""

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from fastapi.responses import StreamingResponse
from typing import Dict, Any, Optional, List
from datetime import datetime
import uuid
import asyncio
import json

from src.services.sse_service import sse_service
from src.utils.enhanced_sse_logger import (
    EnhancedSSELogger, 
    WorkflowPhase, 
    create_workflow_logger,
    create_job_logger
)
from src.services.correlation_manager import (
    correlation_manager, 
    CorrelationScope,
    create_workflow_correlation,
    create_job_correlation
)
from src.services.metrics_collector import metrics_collector, Timer
from src.services.log_aggregation_service import log_aggregation_service
from src.api.routes.auth import get_current_user_for_sse
from src.services.rate_limiter import rate_limiter

router = APIRouter(prefix="/workflows", tags=["workflows"])


@router.get("/test")
async def test_workflows():
    """Simple test endpoint"""
    return {"message": "Workflows API is working", "timestamp": datetime.now().isoformat()}


@router.post("/start")
async def start_workflow(
    workflow_config: Dict[str, Any],
    background_tasks: BackgroundTasks
):
    """Start a new complex workflow with SSE tracking"""
    
    try:
        # Generate workflow ID
        workflow_id = f"workflow-{uuid.uuid4().hex[:12]}"
        
        # Simple response for testing
        return {
            "workflow_id": workflow_id,
            "status": "started",
            "config_received": workflow_config,
            "message": "Workflow started successfully"
        }
        
    except Exception as e:
        return {
            "error": f"Workflow start failed: {str(e)}",
            "type": type(e).__name__
        }


@router.get("/status/{workflow_id}")
async def get_workflow_status(
    workflow_id: str,
    current_user: dict = Depends(get_current_user_for_sse)
):
    """Get current status of a workflow"""
    
    # Find correlation by workflow ID
    correlation_context = correlation_manager.get_context(f"workflow-{workflow_id}")
    if not correlation_context:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    # Get workflow logs
    workflow_logs = log_aggregation_service.get_correlation_analysis(
        correlation_context.correlation_id
    )
    
    # Get recent metrics
    recent_metrics = {}
    for metric_name in ["workflow_steps_total", "workflow_errors_total", "workflow_duration"]:
        summary = metrics_collector.get_metric_summary(metric_name)
        if summary:
            recent_metrics[metric_name] = summary.to_dict()
    
    return {
        "workflow_id": workflow_id,
        "correlation_id": correlation_context.correlation_id,
        "status": "running" if not correlation_context.end_time else "completed",
        "duration": correlation_context.get_duration(),
        "components": list(correlation_context.components),
        "services": list(correlation_context.services),
        "operations_count": len(correlation_context.operations),
        "log_analysis": workflow_logs,
        "performance_metrics": recent_metrics,
        "created_at": correlation_context.created_at.isoformat(),
        "last_accessed": correlation_context.last_accessed.isoformat()
    }


@router.get("/logs/{workflow_id}")
async def get_workflow_logs(
    workflow_id: str,
    format: str = "json",
    current_user: dict = Depends(get_current_user_for_sse)
):
    """Get detailed logs for a workflow"""
    
    correlation_context = correlation_manager.get_context(f"workflow-{workflow_id}")
    if not correlation_context:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    # Get correlation analysis
    analysis = log_aggregation_service.get_correlation_analysis(
        correlation_context.correlation_id
    )
    
    if format == "json":
        return analysis
    elif format == "export":
        # Export as downloadable JSON
        export_data = {
            "workflow_id": workflow_id,
            "export_timestamp": datetime.now().isoformat(),
            "workflow_analysis": analysis,
            "correlation_tree": correlation_manager.get_correlation_tree(
                correlation_context.correlation_id
            )
        }
        
        return StreamingResponse(
            iter([json.dumps(export_data, indent=2)]),
            media_type="application/json",
            headers={"Content-Disposition": f"attachment; filename=workflow_{workflow_id}_logs.json"}
        )
    else:
        raise HTTPException(status_code=400, detail="Unsupported format")


@router.get("/metrics")
async def get_workflow_metrics(
    time_window_minutes: int = 60,
    current_user: dict = Depends(get_current_user_for_sse)
):
    """Get aggregated workflow metrics"""
    
    from src.services.metrics_collector import TimeWindow
    
    # Map minutes to TimeWindow enum
    if time_window_minutes <= 5:
        window = TimeWindow.FIVE_MINUTES
    elif time_window_minutes <= 60:
        window = TimeWindow.HOUR
    else:
        window = TimeWindow.DAY
    
    # Get all metrics summaries
    all_metrics = metrics_collector.get_all_metrics_summary(window)
    
    # Filter workflow-related metrics
    workflow_metrics = {
        name: summary.to_dict() 
        for name, summary in all_metrics.items()
        if "workflow" in name.lower()
    }
    
    # Get aggregation report
    aggregation_report = log_aggregation_service.get_recent_report(time_window_minutes)
    
    # Get correlation manager stats
    correlation_stats = correlation_manager.get_statistics()
    
    return {
        "time_window_minutes": time_window_minutes,
        "workflow_metrics": workflow_metrics,
        "aggregation_report": aggregation_report.to_dict() if aggregation_report else None,
        "correlation_statistics": correlation_stats,
        "active_workflows": len([
            ctx for ctx in correlation_manager.contexts.values()
            if ctx.scope.value == "workflow" and not ctx.end_time
        ]),
        "metrics_collector_stats": metrics_collector.get_statistics()
    }


@router.get("/alerts")
async def get_workflow_alerts(
    severity: Optional[str] = None,
    resolved: Optional[bool] = None,
    current_user: dict = Depends(get_current_user_for_sse)
):
    """Get workflow-related alerts"""
    
    alerts = log_aggregation_service.get_active_alerts()
    
    # Filter by parameters
    if severity:
        alerts = [a for a in alerts if a.severity.value == severity]
    
    if resolved is not None:
        alerts = [a for a in alerts if a.resolved == resolved]
    
    return {
        "alerts": [alert.to_dict() for alert in alerts],
        "total_count": len(alerts),
        "severity_breakdown": {
            severity.value: len([a for a in alerts if a.severity == severity])
            for severity in log_aggregation_service.AlertSeverity
        }
    }


@router.post("/alerts/{alert_id}/resolve")
async def resolve_workflow_alert(
    alert_id: str,
    current_user: dict = Depends(get_current_user_for_sse)
):
    """Resolve a workflow alert"""
    
    success = log_aggregation_service.resolve_alert(alert_id)
    if not success:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    return {"message": "Alert resolved successfully", "alert_id": alert_id}


@router.get("/analysis/patterns")
async def analyze_error_patterns(
    hours: int = 24,
    current_user: dict = Depends(get_current_user_for_sse)
):
    """Analyze error patterns across workflows"""
    
    from src.services.log_aggregation_service import analyze_error_patterns
    
    analysis = analyze_error_patterns(hours)
    
    return {
        "analysis": analysis,
        "recommendations": generate_error_recommendations(analysis)
    }


@router.get("/stream/{workflow_id}")
async def stream_workflow_logs(
    workflow_id: str,
    current_user: dict = Depends(get_current_user_for_sse)
):
    """Stream live workflow logs via SSE"""
    
    # Verify workflow exists
    correlation_context = correlation_manager.get_context(f"workflow-{workflow_id}")
    if not correlation_context:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    async def log_stream():
        """Generate SSE stream for workflow logs"""
        connection_id = f"workflow-logs-{uuid.uuid4().hex[:8]}"
        
        try:
            # Send initial status
            yield f"data: {json.dumps({'type': 'connected', 'workflow_id': workflow_id})}\n\n"
            
            # Stream correlation logs (simplified for demo)
            last_check = datetime.now()
            
            while True:
                # Check for new logs every 2 seconds
                await asyncio.sleep(2)
                
                # Get recent logs
                logs = log_aggregation_service.get_correlation_logs(correlation_context.correlation_id)
                recent_logs = [
                    log for log in logs 
                    if log.timestamp > last_check
                ]
                
                for log_entry in recent_logs:
                    log_data = {
                        "type": "log",
                        "workflow_id": workflow_id,
                        "log": log_entry.to_dict()
                    }
                    yield f"data: {json.dumps(log_data)}\n\n"
                
                last_check = datetime.now()
                
                # Check if workflow is complete
                updated_context = correlation_manager.get_context(correlation_context.correlation_id)
                if updated_context and updated_context.end_time:
                    yield f"data: {json.dumps({'type': 'completed', 'workflow_id': workflow_id})}\n\n"
                    break
                    
        except Exception as e:
            error_data = {
                "type": "error",
                "message": str(e),
                "workflow_id": workflow_id
            }
            yield f"data: {json.dumps(error_data)}\n\n"
    
    return StreamingResponse(
        log_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*"
        }
    )


# Background workflow execution
async def execute_workflow(
    workflow_id: str,
    config: Dict[str, Any],
    logger: EnhancedSSELogger,
    correlation_id: str
):
    """Execute a complex workflow with full tracking"""
    
    try:
        logger.info(f"Starting workflow execution", {
            "workflow_id": workflow_id,
            "config": config
        })
        
        # Simulate different workflow phases
        workflow_type = config.get("type", "generic")
        
        if workflow_type == "cv_processing":
            await execute_cv_processing_workflow(logger, config)
        elif workflow_type == "portfolio_generation":
            await execute_portfolio_generation_workflow(logger, config)
        else:
            await execute_generic_workflow(logger, config)
        
        # Finalize workflow
        logger.finalize_workflow()
        logger.success("Workflow completed successfully", {
            "workflow_id": workflow_id,
            "total_duration": logger.get_total_time()
        })
        
    except Exception as e:
        logger.error("Workflow execution failed", e, {
            "workflow_id": workflow_id,
            "error_type": type(e).__name__
        })
        raise


async def execute_cv_processing_workflow(logger: EnhancedSSELogger, config: Dict[str, Any]):
    """Execute CV processing workflow"""
    
    # Phase 1: File validation
    logger.start_phase(WorkflowPhase.VALIDATION, expected_steps=3)
    
    logger.step("Validating file format")
    await asyncio.sleep(1)  # Simulate processing
    logger.step_complete("File format validated")
    
    logger.step("Checking file size")
    await asyncio.sleep(0.5)
    logger.step_complete("File size verified")
    
    logger.step("Security scan")
    await asyncio.sleep(1.5)
    logger.step_complete("Security scan passed")
    
    logger.end_phase({"files_processed": 1, "validation_time": "3.0s"})
    
    # Phase 2: AI extraction
    logger.start_phase(WorkflowPhase.PROCESSING, expected_steps=4)
    
    logger.step("Initializing Claude 4 Opus")
    await asyncio.sleep(1)
    logger.step_complete("AI model initialized")
    
    logger.step("Extracting text content")
    with Timer("text_extraction", {"workflow_phase": "processing"}):
        await asyncio.sleep(3)
    logger.step_complete("Text extraction completed")
    
    logger.step("Parsing structured data")
    logger.increment_counter("parsing_operations")
    await asyncio.sleep(2)
    logger.step_complete("Data parsing completed")
    
    logger.step("Validating extracted data")
    await asyncio.sleep(1)
    logger.set_gauge("data_quality_score", 0.92)
    logger.step_complete("Data validation completed")
    
    logger.end_phase({"extraction_confidence": 0.92, "fields_extracted": 15})


async def execute_portfolio_generation_workflow(logger: EnhancedSSELogger, config: Dict[str, Any]):
    """Execute portfolio generation workflow"""
    
    # Phase 1: Template selection
    logger.start_phase(WorkflowPhase.INITIALIZATION, expected_steps=2)
    
    logger.step("Analyzing CV data for template matching")
    await asyncio.sleep(1)
    logger.step_complete("Template analysis completed")
    
    logger.step("Selecting optimal template")
    await asyncio.sleep(0.5)
    logger.step_complete("Template selected: modern-minimal")
    
    logger.end_phase({"template": "modern-minimal", "match_score": 0.87})
    
    # Phase 2: Component generation
    logger.start_phase(WorkflowPhase.GENERATION, expected_steps=5)
    
    components = ["hero", "about", "experience", "skills", "projects"]
    for i, component in enumerate(components, 1):
        logger.step(f"Generating {component} component")
        await asyncio.sleep(1.5)
        logger.increment_counter("components_generated")
        logger.step_complete(f"{component} component generated")
    
    logger.end_phase({"components_generated": len(components)})
    
    # Phase 3: Finalization
    logger.start_phase(WorkflowPhase.FINALIZATION, expected_steps=3)
    
    logger.step("Optimizing assets")
    await asyncio.sleep(1)
    logger.step_complete("Assets optimized")
    
    logger.step("Generating preview")
    await asyncio.sleep(2)
    logger.step_complete("Preview generated")
    
    logger.step("Preparing deployment package")
    await asyncio.sleep(1)
    logger.step_complete("Deployment package ready")
    
    logger.end_phase({"package_size": "2.3MB", "preview_url": "https://preview.cv2web.dev/abc123"})


async def execute_generic_workflow(logger: EnhancedSSELogger, config: Dict[str, Any]):
    """Execute generic workflow"""
    
    steps = config.get("steps", ["step1", "step2", "step3"])
    
    logger.start_phase(WorkflowPhase.PROCESSING, expected_steps=len(steps))
    
    for i, step in enumerate(steps, 1):
        logger.step(f"Executing {step}")
        await asyncio.sleep(1)
        logger.increment_counter("generic_steps")
        logger.step_complete(f"{step} completed")
    
    logger.end_phase({"steps_completed": len(steps)})


def generate_error_recommendations(analysis: Dict[str, Any]) -> List[str]:
    """Generate recommendations based on error analysis"""
    
    recommendations = []
    
    total_errors = analysis.get("total_errors", 0)
    unique_patterns = analysis.get("unique_patterns", 0)
    
    if total_errors > 50:
        recommendations.append("High error rate detected. Consider implementing circuit breaker patterns.")
    
    if unique_patterns > 10:
        recommendations.append("Many unique error patterns found. Review error handling consistency.")
    
    top_patterns = analysis.get("top_patterns", [])
    for pattern in top_patterns[:3]:
        if pattern["count"] > 10:
            recommendations.append(f"Address recurring pattern: '{pattern['pattern']}' ({pattern['count']} occurrences)")
    
    if not recommendations:
        recommendations.append("Error patterns are within normal ranges. Continue monitoring.")
    
    return recommendations