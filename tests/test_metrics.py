"""
Test the performance metrics system
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import asyncio
import time
from unittest.mock import MagicMock, patch

from src.core.cv_extraction.metrics import (
    ExtractionMetrics, 
    metrics_collector,
    Timer,
    SectionTimer,
    estimate_tokens
)


def test_extraction_metrics():
    """Test basic metrics collection"""
    metrics = ExtractionMetrics()
    
    # Set some values
    metrics.total_time = 5.5
    metrics.sections_extracted = 15
    metrics.sections_requested = 17
    metrics.input_text_length = 5000
    metrics.extraction_confidence = 0.92
    
    # Convert to dict
    data = metrics.to_dict()
    
    assert data["timing"]["total_seconds"] == 5.5
    assert data["counts"]["sections_extracted"] == 15
    assert data["quality"]["extraction_confidence"] == 0.92
    
    print("✅ ExtractionMetrics works correctly")


def test_metrics_collector():
    """Test the metrics collector singleton"""
    # Start an extraction
    extraction_id = "test-123"
    metrics = metrics_collector.start_extraction(extraction_id, "test-key")
    
    assert metrics.extraction_id == extraction_id
    assert metrics_collector.active_extractions > 0
    
    # Update metrics
    metrics.total_time = 3.5
    metrics.sections_extracted = 10
    
    # End extraction
    metrics_collector.end_extraction(extraction_id, success=True)
    
    # Check aggregate stats
    stats = metrics_collector.get_aggregate_stats()
    assert stats["successful_extractions"] > 0
    
    print("✅ MetricsCollector singleton works")


def test_timer_context_manager():
    """Test the Timer context manager"""
    metrics = ExtractionMetrics()
    
    # Use timer
    with Timer(metrics, 'post_processing_time'):
        time.sleep(0.1)  # Simulate work
    
    # Check time was recorded
    assert metrics.post_processing_time >= 0.1
    assert metrics.post_processing_time < 0.2  # Should be close to 0.1
    
    print("✅ Timer context manager works")


def test_section_timer():
    """Test the SectionTimer for individual sections"""
    metrics = ExtractionMetrics()
    
    # Time multiple sections
    with SectionTimer(metrics, 'hero'):
        time.sleep(0.05)
    
    with SectionTimer(metrics, 'experience'):
        time.sleep(0.1)
    
    # Check times were recorded
    assert 'hero' in metrics.llm_times_by_section
    assert 'experience' in metrics.llm_times_by_section
    assert metrics.llm_times_by_section['hero'] >= 0.05
    assert metrics.llm_times_by_section['experience'] >= 0.1
    assert metrics.llm_total_time >= 0.15
    
    print("✅ SectionTimer works correctly")


def test_token_estimation():
    """Test token estimation function"""
    text = "This is a sample text for testing token estimation."
    tokens = estimate_tokens(text)
    
    # Should be roughly 1/4 of character count
    expected = len(text) // 4
    assert tokens == expected
    
    print("✅ Token estimation works")


async def test_concurrent_metrics():
    """Test metrics with concurrent extractions"""
    async def simulate_extraction(extraction_id: str, delay: float):
        metrics = metrics_collector.start_extraction(extraction_id, "test-key")
        await asyncio.sleep(delay)
        metrics.total_time = delay
        metrics.sections_extracted = 10
        metrics_collector.end_extraction(extraction_id, success=True)
        return extraction_id
    
    # Run multiple concurrent extractions
    tasks = [
        simulate_extraction("ext-1", 0.1),
        simulate_extraction("ext-2", 0.2),
        simulate_extraction("ext-3", 0.15)
    ]
    
    results = await asyncio.gather(*tasks)
    
    assert len(results) == 3
    
    # Check that all were tracked
    stats = metrics_collector.get_aggregate_stats()
    assert stats["total_extractions"] >= 3
    
    print("✅ Concurrent metrics tracking works")


def test_metrics_summary_logging():
    """Test metrics summary logging"""
    metrics = ExtractionMetrics()
    metrics.total_time = 5.2
    metrics.sections_requested = 17
    metrics.sections_extracted = 16
    metrics.input_text_length = 8500
    metrics.extraction_confidence = 0.89
    
    # This should log without errors
    with patch('logging.Logger.info') as mock_log:
        metrics.log_summary()
        
        # Check that logging was called
        assert mock_log.called
        call_args = [str(arg) for call in mock_log.call_args_list for arg in call[0]]
        
        # Check key metrics appear in logs
        assert any("5.2" in arg or "5.20" in arg for arg in call_args)
        assert any("94.1%" in arg for arg in call_args)  # Success rate
        assert any("8,500" in arg or "8500" in arg for arg in call_args)
    
    print("✅ Metrics summary logging works")


def run_all_tests():
    """Run all metrics tests"""
    print("\n" + "="*60)
    print("Testing Performance Metrics System")
    print("="*60 + "\n")
    
    test_extraction_metrics()
    test_metrics_collector()
    test_timer_context_manager()
    test_section_timer()
    test_token_estimation()
    test_metrics_summary_logging()
    
    # Run async test
    asyncio.run(test_concurrent_metrics())
    
    print("\n" + "="*60)
    print("✅ ALL METRICS TESTS PASSED!")
    print("Performance monitoring is production-ready!")
    print("="*60 + "\n")


if __name__ == "__main__":
    run_all_tests()