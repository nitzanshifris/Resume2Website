"""
Performance Metrics Collection for CV Extraction Pipeline
Tracks timing, success rates, and resource usage for production monitoring
"""
import time
import logging
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Any, TypedDict
from datetime import datetime, timedelta
import json
from collections import defaultdict
import asyncio

logger = logging.getLogger(__name__)


# TypedDict definitions for better type safety
class TimingMetrics(TypedDict):
    """Type definition for timing metrics"""
    total_seconds: float
    text_extraction: float
    llm_total: float
    llm_by_section: Dict[str, float]
    post_processing: float
    validation: float


class CountMetrics(TypedDict):
    """Type definition for count metrics"""
    sections_requested: int
    sections_extracted: int
    sections_failed: int
    retry_count: int
    validation_issues: int


class SizeMetrics(TypedDict):
    """Type definition for size metrics"""
    input_text_length: int
    total_tokens_used: int


class QualityMetrics(TypedDict):
    """Type definition for quality metrics"""
    extraction_confidence: float


class MetadataMetrics(TypedDict):
    """Type definition for metadata"""
    api_key_hash: str
    model_used: str


class ErrorInfo(TypedDict):
    """Type definition for error information"""
    type: str
    message: str


class ExtractionMetricsDict(TypedDict):
    """Complete type definition for extraction metrics dictionary"""
    extraction_id: str
    timestamp: str
    timing: TimingMetrics
    counts: CountMetrics
    size: SizeMetrics
    quality: QualityMetrics
    metadata: MetadataMetrics
    errors: List[ErrorInfo]


class AggregateStats(TypedDict):
    """Type definition for aggregate statistics"""
    total_extractions: int
    successful_extractions: int
    failed_extractions: int
    success_rate: float
    active_extractions: int
    average_processing_time: float
    processing_time_percentiles: Dict[str, float]
    extractions_per_minute: float


@dataclass
class ExtractionMetrics:
    """Metrics for a single CV extraction"""
    
    # Timing metrics (in seconds)
    total_time: float = 0.0
    text_extraction_time: float = 0.0
    llm_total_time: float = 0.0
    llm_times_by_section: Dict[str, float] = field(default_factory=dict)
    post_processing_time: float = 0.0
    validation_time: float = 0.0
    
    # Count metrics
    sections_requested: int = 0
    sections_extracted: int = 0
    sections_failed: int = 0
    retry_count: int = 0
    validation_issues: int = 0
    
    # Size metrics
    input_text_length: int = 0
    total_tokens_used: int = 0
    
    # Quality metrics
    extraction_confidence: float = 0.0
    
    # Metadata
    extraction_id: str = ""
    timestamp: datetime = field(default_factory=datetime.now)
    api_key_hash: str = ""
    model_used: str = "claude-3-opus"
    
    # Error tracking
    errors: List[Dict[str, Any]] = field(default_factory=list)
    
    def to_dict(self) -> ExtractionMetricsDict:
        """Convert metrics to dictionary for JSON serialization with type safety"""
        return {
            "extraction_id": self.extraction_id,
            "timestamp": self.timestamp.isoformat(),
            "timing": {
                "total_seconds": round(self.total_time, 3),
                "text_extraction": round(self.text_extraction_time, 3),
                "llm_total": round(self.llm_total_time, 3),
                "llm_by_section": {k: round(v, 3) for k, v in self.llm_times_by_section.items()},
                "post_processing": round(self.post_processing_time, 3),
                "validation": round(self.validation_time, 3)
            },
            "counts": {
                "sections_requested": self.sections_requested,
                "sections_extracted": self.sections_extracted,
                "sections_failed": self.sections_failed,
                "retry_count": self.retry_count,
                "validation_issues": self.validation_issues
            },
            "size": {
                "input_text_length": self.input_text_length,
                "total_tokens_used": self.total_tokens_used
            },
            "quality": {
                "extraction_confidence": round(self.extraction_confidence, 3)
            },
            "metadata": {
                "api_key_hash": self.api_key_hash,
                "model_used": self.model_used
            },
            "errors": self.errors
        }
    
    def log_summary(self):
        """Log a summary of the metrics"""
        success_rate = (self.sections_extracted / self.sections_requested * 100) if self.sections_requested > 0 else 0
        
        logger.info(f"📊 Extraction Metrics Summary:")
        logger.info(f"  ⏱️  Total time: {self.total_time:.2f}s")
        logger.info(f"  📝 Sections: {self.sections_extracted}/{self.sections_requested} ({success_rate:.1f}% success)")
        logger.info(f"  🤖 LLM time: {self.llm_total_time:.2f}s")
        logger.info(f"  📏 Input size: {self.input_text_length:,} chars")
        logger.info(f"  ✅ Confidence: {self.extraction_confidence:.1%}")
        
        if self.errors:
            logger.warning(f"  ⚠️  Errors: {len(self.errors)}")


class MetricsCollector:
    """Singleton metrics collector for aggregating metrics across all extractions"""
    
    _instance = None
    _lock = None  # Will be initialized as asyncio.Lock() when instance is created
    
    def __new__(cls):
        if cls._instance is None:
            # For synchronous singleton creation, we use a simple check
            # The asyncio.Lock will be created in __init__ for async operations
            if cls._instance is None:
                cls._instance = super().__new__(cls)
                cls._instance._initialized = False
        return cls._instance
    
    def __init__(self):
        if self._initialized:
            return
            
        self._initialized = True
        self.metrics_history: List[ExtractionMetrics] = []
        self.current_metrics: Dict[str, ExtractionMetrics] = {}
        
        # Create asyncio lock for async operations
        self._async_lock = asyncio.Lock()
        
        # Aggregate statistics
        self.total_extractions = 0
        self.successful_extractions = 0
        self.failed_extractions = 0
        self.total_processing_time = 0.0
        self.average_processing_time = 0.0
        
        # Real-time counters
        self.active_extractions = 0
        self.extractions_per_minute = 0
        
        # Start cleanup task
        self._start_cleanup_task()
    
    async def start_extraction(self, extraction_id: str, api_key_hash: str = "") -> ExtractionMetrics:
        """Start tracking a new extraction (async-safe)"""
        async with self._async_lock:
            metrics = ExtractionMetrics(
                extraction_id=extraction_id,
                api_key_hash=api_key_hash,
                timestamp=datetime.now()
            )
            self.current_metrics[extraction_id] = metrics
            self.active_extractions += 1
            self.total_extractions += 1
            return metrics
    
    def start_extraction_sync(self, extraction_id: str, api_key_hash: str = "") -> ExtractionMetrics:
        """Synchronous version for compatibility"""
        metrics = ExtractionMetrics(
            extraction_id=extraction_id,
            api_key_hash=api_key_hash,
            timestamp=datetime.now()
        )
        self.current_metrics[extraction_id] = metrics
        self.active_extractions += 1
        self.total_extractions += 1
        return metrics
    
    async def end_extraction(self, extraction_id: str, success: bool = True):
        """Mark extraction as complete and store metrics (async-safe)"""
        async with self._async_lock:
            if extraction_id not in self.current_metrics:
                return
            
            metrics = self.current_metrics[extraction_id]
            
            # Update counters
            if success:
                self.successful_extractions += 1
            else:
                self.failed_extractions += 1
            
            # Update aggregate stats
            self.total_processing_time += metrics.total_time
            self.average_processing_time = self.total_processing_time / self.total_extractions
            
            # Store in history
            self.metrics_history.append(metrics)
            
            # Clean up
            del self.current_metrics[extraction_id]
            self.active_extractions -= 1
            
            # Log summary
            metrics.log_summary()
    
    def end_extraction_sync(self, extraction_id: str, success: bool = True):
        """Synchronous version for compatibility"""
        if extraction_id not in self.current_metrics:
            return
        
        metrics = self.current_metrics[extraction_id]
        
        # Update counters
        if success:
            self.successful_extractions += 1
        else:
            self.failed_extractions += 1
        
        # Update aggregate stats
        self.total_processing_time += metrics.total_time
        self.average_processing_time = self.total_processing_time / self.total_extractions
        
        # Store in history
        self.metrics_history.append(metrics)
        
        # Clean up
        del self.current_metrics[extraction_id]
        self.active_extractions -= 1
        
        # Log summary
        metrics.log_summary()
    
    def get_metrics(self, extraction_id: str) -> Optional[ExtractionMetrics]:
        """Get metrics for a specific extraction"""
        return self.current_metrics.get(extraction_id)
    
    def get_aggregate_stats(self) -> AggregateStats:
        """Get aggregate statistics across all extractions with type safety"""
        success_rate = (self.successful_extractions / self.total_extractions * 100) if self.total_extractions > 0 else 0
        
        # Calculate percentiles for processing time
        if self.metrics_history:
            times = sorted([m.total_time for m in self.metrics_history])
            p50 = times[len(times) // 2] if times else 0
            p95 = times[int(len(times) * 0.95)] if times else 0
            p99 = times[int(len(times) * 0.99)] if times else 0
        else:
            p50 = p95 = p99 = 0
        
        return {
            "total_extractions": self.total_extractions,
            "successful_extractions": self.successful_extractions,
            "failed_extractions": self.failed_extractions,
            "success_rate": round(success_rate, 1),
            "active_extractions": self.active_extractions,
            "average_processing_time": round(self.average_processing_time, 2),
            "processing_time_percentiles": {
                "p50": round(p50, 2),
                "p95": round(p95, 2),
                "p99": round(p99, 2)
            },
            "extractions_per_minute": self._calculate_rate()
        }
    
    def get_recent_metrics(self, limit: int = 10) -> List[ExtractionMetricsDict]:
        """Get recent extraction metrics with type safety"""
        recent = self.metrics_history[-limit:] if self.metrics_history else []
        return [m.to_dict() for m in recent]
    
    def _calculate_rate(self) -> float:
        """Calculate extractions per minute rate"""
        if not self.metrics_history:
            return 0.0
        
        # Look at last 5 minutes
        cutoff = datetime.now() - timedelta(minutes=5)
        recent = [m for m in self.metrics_history if m.timestamp > cutoff]
        
        if not recent:
            return 0.0
        
        time_span = (datetime.now() - recent[0].timestamp).total_seconds() / 60.0
        return len(recent) / time_span if time_span > 0 else 0.0
    
    def _start_cleanup_task(self):
        """Start background task to clean old metrics"""
        async def cleanup():
            while True:
                await asyncio.sleep(3600)  # Every hour
                cutoff = datetime.now() - timedelta(hours=24)
                self.metrics_history = [m for m in self.metrics_history if m.timestamp > cutoff]
        
        # Start cleanup in background (non-blocking)
        try:
            loop = asyncio.get_event_loop()
            loop.create_task(cleanup())
        except RuntimeError:
            # No event loop running, skip cleanup
            pass


# Global metrics collector instance
metrics_collector = MetricsCollector()


class Timer:
    """Context manager for timing code blocks"""
    
    def __init__(self, metrics: ExtractionMetrics, field_name: str):
        self.metrics = metrics
        self.field_name = field_name
        self.start_time = None
    
    def __enter__(self):
        self.start_time = time.time()
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        elapsed = time.time() - self.start_time
        setattr(self.metrics, self.field_name, elapsed)


class SectionTimer:
    """Context manager for timing individual section extractions"""
    
    def __init__(self, metrics: ExtractionMetrics, section_name: str):
        self.metrics = metrics
        self.section_name = section_name
        self.start_time = None
    
    def __enter__(self):
        self.start_time = time.time()
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        elapsed = time.time() - self.start_time
        self.metrics.llm_times_by_section[self.section_name] = elapsed
        self.metrics.llm_total_time += elapsed


def estimate_tokens(text: str) -> int:
    """Rough estimate of token count (4 chars per token average)"""
    return len(text) // 4