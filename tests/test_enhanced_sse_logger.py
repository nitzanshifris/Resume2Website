#!/usr/bin/env python3
"""
Unit Tests for Enhanced SSE Logger
Tests all functionality of the enhanced logging system
"""

import pytest
import asyncio
import json
import time
from datetime import datetime, timedelta
from unittest.mock import Mock, patch, MagicMock
from typing import List, Dict, Any

# Add project root to path
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.utils.enhanced_sse_logger import (
    EnhancedSSELogger,
    WorkflowPhase,
    create_workflow_logger,
    create_job_logger,
    LogAggregator,
    log_aggregator
)
from src.services.sse_message_types import (
    SSEMessageFactory,
    SSEMessageType,
    LogLevel as SSELogLevel
)
from src.services.correlation_manager import correlation_manager, CorrelationScope


class TestEnhancedSSELogger:
    """Test suite for EnhancedSSELogger"""
    
    @pytest.fixture
    def mock_sse_service(self):
        """Mock SSE service for testing"""
        with patch('src.utils.enhanced_sse_logger.sse_service') as mock:
            mock.create_message.return_value = Mock()
            mock.connection_manager = Mock()
            yield mock
    
    @pytest.fixture
    def mock_metrics_collector(self):
        """Mock metrics collector for testing"""
        with patch('src.utils.enhanced_sse_logger.metrics_collector') as mock:
            mock.record_value = Mock()
            mock.increment_counter = Mock()
            mock.set_gauge = Mock()
            mock.record_timer = Mock()
            yield mock
    
    @pytest.fixture
    def mock_correlation_manager(self):
        """Mock correlation manager for testing"""
        with patch('src.utils.enhanced_sse_logger.correlation_manager') as mock:
            mock.create_context.return_value = Mock(correlation_id="test-correlation-123")
            mock.start_correlation_timing = Mock()
            mock.update_context = Mock()
            mock.end_correlation_timing = Mock()
            yield mock
    
    def test_logger_initialization(self, mock_sse_service, mock_metrics_collector, mock_correlation_manager):
        """Test logger initialization with all features"""
        
        logger = EnhancedSSELogger(
            name="test_logger",
            connection_id="test-connection",
            correlation_id="test-correlation-123",
            workflow_id="test-workflow-456",
            custom_tags={"env": "test", "version": "1.0"}
        )
        
        # Verify initialization
        assert logger.name == "test_logger"
        assert logger.connection_id == "test-connection"
        assert logger.correlation_id == "test-correlation-123"
        assert logger.workflow_id == "test-workflow-456"
        assert logger.custom_tags["env"] == "test"
        assert logger.enable_aggregation is True
        assert logger.enable_performance_tracking is True
        
        # Verify correlation context was created
        mock_correlation_manager.create_context.assert_called_once()
        mock_correlation_manager.start_correlation_timing.assert_called_once()
    
    def test_workflow_phase_management(self, mock_sse_service, mock_metrics_collector, mock_correlation_manager):
        """Test workflow phase start and end"""
        
        logger = EnhancedSSELogger("test_logger")
        
        # Start phase
        logger.start_phase(WorkflowPhase.VALIDATION, expected_steps=3)
        
        assert logger.current_phase == WorkflowPhase.VALIDATION
        assert WorkflowPhase.VALIDATION in logger.phase_start_times
        
        # Verify SSE message was emitted
        mock_sse_service.create_message.assert_called()
        
        # End phase
        logger.end_phase({"validation_results": "passed"})
        
        assert logger.current_phase is None
        
        # Verify phase metrics were recorded
        assert len(logger.phase_metrics[WorkflowPhase.VALIDATION]) > 0
    
    def test_performance_metrics_recording(self, mock_sse_service, mock_metrics_collector, mock_correlation_manager):
        """Test performance metrics recording"""
        
        logger = EnhancedSSELogger("test_logger")
        
        # Test counter increment
        logger.increment_counter("test_operations", 5)
        
        assert logger.counters["test_operations"] == 5
        mock_metrics_collector.increment_counter.assert_called_with(
            "workflow_test_operations",
            5,
            tags={"workflow_id": logger.workflow_id}
        )
        
        # Test gauge setting
        logger.set_gauge("memory_usage", 75.5)
        
        assert logger.gauges["memory_usage"] == 75.5
        mock_metrics_collector.set_gauge.assert_called_with(
            "workflow_memory_usage",
            75.5,
            tags={"workflow_id": logger.workflow_id}
        )
        
        # Test rate recording
        logger.record_rate("api_calls")
        
        assert len(logger.rates["api_calls"]) == 1
    
    def test_timer_operations(self, mock_sse_service, mock_metrics_collector, mock_correlation_manager):
        """Test timer start and end operations"""
        
        logger = EnhancedSSELogger("test_logger")
        
        # Start timer
        logger.start_timer("database_query")
        
        assert "database_query" in logger.operation_timers
        
        # Simulate some processing time
        time.sleep(0.1)
        
        # End timer
        duration = logger.end_timer("database_query")
        
        assert duration > 0.05  # Should be at least 50ms
        assert "database_query" not in logger.operation_timers
        
        # Verify metric was recorded
        mock_metrics_collector.record_timer.assert_called()
    
    def test_event_hooks(self, mock_sse_service, mock_metrics_collector, mock_correlation_manager):
        """Test event hook system"""
        
        logger = EnhancedSSELogger("test_logger")
        
        # Create mock hook
        hook_called = False
        hook_data = None
        
        def test_hook(data):
            nonlocal hook_called, hook_data
            hook_called = True
            hook_data = data
        
        # Add hook
        logger.add_hook("step", test_hook)
        
        # Trigger step (which should call hooks)
        logger.step("test_step", {"detail": "test_detail"})
        
        # Verify hook was called
        assert hook_called
        assert hook_data["step_name"] == "test_step"
        assert hook_data["details"]["detail"] == "test_detail"
    
    def test_structured_logging(self, mock_sse_service, mock_metrics_collector, mock_correlation_manager):
        """Test structured log entry creation"""
        
        logger = EnhancedSSELogger("test_logger", enable_aggregation=True)
        
        # Set a phase for context
        logger.start_phase(WorkflowPhase.PROCESSING, expected_steps=2)
        
        # Log different types of messages
        logger.step("processing_step")
        logger.warning("test warning")
        logger.error("test error", Exception("test exception"))
        
        # Verify structured logs were created
        assert len(logger.structured_logs) >= 3
        
        # Check log entry structure
        log_entry = logger.structured_logs[0]
        assert log_entry.correlation_id == logger.correlation_id
        assert log_entry.logger_name == logger.name
        assert log_entry.phase == WorkflowPhase.PROCESSING
        assert log_entry.metadata["workflow_id"] == logger.workflow_id
    
    def test_workflow_summary(self, mock_sse_service, mock_metrics_collector, mock_correlation_manager):
        """Test comprehensive workflow summary generation"""
        
        # Mock correlation context
        mock_context = Mock()
        mock_context.components = {"component1", "component2"}
        mock_context.services = {"service1"}
        mock_context.operations = ["op1", "op2", "op3"]
        mock_context.get_duration.return_value = 15.5
        mock_correlation_manager.get_context.return_value = mock_context
        
        logger = EnhancedSSELogger("test_logger")
        
        # Simulate some workflow activity
        logger.start_phase(WorkflowPhase.VALIDATION)
        logger.increment_counter("validations", 3)
        logger.set_gauge("quality_score", 0.95)
        time.sleep(0.1)
        logger.end_phase()
        
        # Generate summary
        summary = logger.get_workflow_summary()
        
        # Verify summary structure
        assert summary["workflow_id"] == logger.workflow_id
        assert summary["correlation_id"] == logger.correlation_id
        assert "total_duration" in summary
        assert "phases" in summary
        assert "counters" in summary
        assert summary["counters"]["validations"] == 3
        assert summary["gauges"]["quality_score"] == 0.95
        assert "correlation_info" in summary
        assert summary["correlation_info"]["components"] == ["component1", "component2"]
    
    def test_log_export(self, mock_sse_service, mock_metrics_collector, mock_correlation_manager):
        """Test log export functionality"""
        
        logger = EnhancedSSELogger("test_logger", enable_aggregation=True)
        
        # Generate some logs
        logger.info("test info message")
        logger.warning("test warning message")
        logger.error("test error message")
        
        # Export logs
        exported = logger.export_logs("json")
        
        # Verify export format
        logs_data = json.loads(exported)
        assert isinstance(logs_data, list)
        assert len(logs_data) >= 3
        
        # Check log structure
        log_entry = logs_data[0]
        assert "level" in log_entry
        assert "message" in log_entry
        assert "timestamp" in log_entry
        assert "correlation_id" in log_entry
    
    def test_workflow_finalization(self, mock_sse_service, mock_metrics_collector, mock_correlation_manager):
        """Test workflow finalization and cleanup"""
        
        logger = EnhancedSSELogger("test_logger")
        
        # Start a phase
        logger.start_phase(WorkflowPhase.PROCESSING)
        
        # Finalize workflow
        logger.finalize_workflow()
        
        # Verify correlation timing was ended
        mock_correlation_manager.end_correlation_timing.assert_called_once()
        
        # Verify phase was ended
        assert logger.current_phase is None
        
        # Verify final metrics were recorded
        mock_metrics_collector.record_timer.assert_called_with(
            "workflow_total_duration",
            logger.get_total_time(),
            tags={"workflow_id": logger.workflow_id}
        )


class TestSSEMessageIntegration:
    """Test SSE message type integration"""
    
    @pytest.fixture
    def mock_sse_service(self):
        """Mock SSE service for testing"""
        with patch('src.utils.enhanced_sse_logger.sse_service') as mock:
            mock.create_message.return_value = Mock()
            mock.connection_manager = Mock()
            yield mock
    
    def test_message_factory_integration(self, mock_sse_service):
        """Test integration with SSE message factory"""
        
        logger = EnhancedSSELogger("test_logger")
        
        # Create a metric and verify message format
        with patch('src.utils.enhanced_sse_logger.SSEMessageFactory') as mock_factory:
            mock_message = Mock()
            mock_message.to_dict.return_value = {"type": "metric_recorded", "metric_name": "test"}
            mock_factory.create_metric_message.return_value = mock_message
            
            from src.utils.enhanced_sse_logger import PerformanceMetric, MetricType
            
            metric = PerformanceMetric(
                name="test_metric",
                type=MetricType.COUNTER,
                value=100,
                unit="count"
            )
            
            logger.record_metric(metric)
            
            # Verify message factory was called correctly
            mock_factory.create_metric_message.assert_called_once_with(
                "test_metric",
                100,
                "count",
                logger.correlation_id,
                {"workflow_id": logger.workflow_id}
            )


class TestFactoryFunctions:
    """Test factory functions for logger creation"""
    
    @patch('src.utils.enhanced_sse_logger.EnhancedSSELogger')
    def test_create_workflow_logger(self, mock_logger_class):
        """Test workflow logger factory"""
        
        mock_instance = Mock()
        mock_logger_class.return_value = mock_instance
        
        logger = create_workflow_logger(
            "test_workflow",
            correlation_id="test-corr-123",
            connection_id="test-conn-456",
            custom_tags={"env": "test"}
        )
        
        # Verify logger was created with correct parameters
        mock_logger_class.assert_called_once_with(
            name="workflow_test_workflow",
            correlation_id="test-corr-123",
            connection_id="test-conn-456",
            custom_tags={"env": "test"},
            enable_aggregation=True,
            enable_performance_tracking=True
        )
    
    @patch('src.utils.enhanced_sse_logger.EnhancedSSELogger')
    def test_create_job_logger(self, mock_logger_class):
        """Test job logger factory"""
        
        mock_instance = Mock()
        mock_logger_class.return_value = mock_instance
        
        logger = create_job_logger(
            "job-123",
            "cv_processing",
            connection_id="test-conn-789",
            custom_tags={"priority": "high"}
        )
        
        # Verify logger was created with correct parameters
        expected_tags = {
            "priority": "high",
            "job_id": "job-123",
            "process": "cv_processing"
        }
        
        mock_logger_class.assert_called_once_with(
            name="cv_processing_job-123",
            correlation_id="job-123_cv_processing",
            connection_id="test-conn-789",
            workflow_id="job-123",
            custom_tags=expected_tags,
            enable_aggregation=True,
            enable_performance_tracking=True
        )


class TestLogAggregator:
    """Test log aggregation functionality"""
    
    def test_log_entry_creation(self):
        """Test log entry creation and aggregation"""
        
        from src.utils.enhanced_sse_logger import LogEntry, PerformanceMetric, MetricType
        
        # Create test log entry
        entry = LogEntry(
            level="INFO",
            message="Test log message",
            timestamp=datetime.now(),
            correlation_id="test-correlation",
            logger_name="test_logger",
            phase=WorkflowPhase.PROCESSING,
            step_number=1,
            total_steps=5,
            metadata={"test": "value"}
        )
        
        # Test serialization
        entry_dict = entry.to_dict()
        
        assert entry_dict["level"] == "INFO"
        assert entry_dict["message"] == "Test log message"
        assert entry_dict["correlation_id"] == "test-correlation"
        assert entry_dict["phase"] == "processing"
        assert entry_dict["step_number"] == 1
        assert entry_dict["metadata"]["test"] == "value"
    
    def test_aggregator_add_entry(self):
        """Test adding entries to aggregator"""
        
        aggregator = LogAggregator(max_entries=100)
        
        from src.utils.enhanced_sse_logger import LogEntry
        
        # Add test entries
        for i in range(5):
            entry = LogEntry(
                level="INFO",
                message=f"Test message {i}",
                timestamp=datetime.now(),
                correlation_id=f"test-correlation-{i % 2}",  # Two different correlations
                logger_name="test_logger"
            )
            aggregator.add_entry(entry)
        
        # Verify entries were added
        assert len(aggregator.entries) == 5
        assert len(aggregator.correlation_index) == 2  # Two unique correlation IDs
        
        # Test correlation retrieval
        correlation_logs = aggregator.get_correlation_logs("test-correlation-0")
        assert len(correlation_logs) == 3  # 0, 2, 4


def run_performance_benchmark():
    """Run performance benchmark for enhanced logger"""
    
    print("\n🚀 Running Enhanced SSE Logger Performance Benchmark...")
    
    # Mock dependencies for clean benchmark
    with patch('src.utils.enhanced_sse_logger.sse_service'), \
         patch('src.utils.enhanced_sse_logger.metrics_collector'), \
         patch('src.utils.enhanced_sse_logger.correlation_manager'):
        
        logger = EnhancedSSELogger(
            "benchmark_logger",
            enable_aggregation=True,
            enable_performance_tracking=True
        )
        
        # Benchmark logging operations
        start_time = time.time()
        iterations = 1000
        
        for i in range(iterations):
            logger.step(f"benchmark_step_{i}")
            logger.increment_counter("benchmark_counter")
            logger.set_gauge("benchmark_gauge", i * 0.1)
            
            if i % 100 == 0:
                logger.start_phase(WorkflowPhase.PROCESSING)
                logger.end_phase()
        
        end_time = time.time()
        duration = end_time - start_time
        
        print(f"📊 Benchmark Results:")
        print(f"   ⏱️  Total time: {duration:.3f}s")
        print(f"   🔄 Operations: {iterations * 3}")
        print(f"   ⚡ Ops/sec: {(iterations * 3) / duration:.1f}")
        print(f"   📈 Memory: {len(logger.structured_logs)} log entries")
        print(f"   🎯 Avg per operation: {(duration / (iterations * 3)) * 1000:.3f}ms")


if __name__ == "__main__":
    # Run tests if pytest is available
    try:
        import pytest
        print("🧪 Running Enhanced SSE Logger Unit Tests...")
        
        # Run tests with verbose output
        pytest_args = [
            __file__,
            "-v",
            "--tb=short",
            "-x"  # Stop on first failure
        ]
        
        exit_code = pytest.main(pytest_args)
        
        if exit_code == 0:
            print("\n✅ All tests passed!")
            run_performance_benchmark()
        else:
            print(f"\n❌ Tests failed with exit code: {exit_code}")
            
    except ImportError:
        print("⚠️  pytest not available, running basic tests...")
        
        # Run basic tests without pytest
        test_basic_functionality()
        run_performance_benchmark()


def test_basic_functionality():
    """Basic functionality test without pytest"""
    
    print("🔧 Testing basic Enhanced SSE Logger functionality...")
    
    try:
        # Test logger creation
        logger = EnhancedSSELogger("basic_test_logger")
        print("✅ Logger creation: PASSED")
        
        # Test phase management
        logger.start_phase(WorkflowPhase.VALIDATION)
        logger.end_phase()
        print("✅ Phase management: PASSED")
        
        # Test metrics
        logger.increment_counter("test_counter")
        logger.set_gauge("test_gauge", 42.0)
        print("✅ Metrics recording: PASSED")
        
        # Test summary generation
        summary = logger.get_workflow_summary()
        assert "workflow_id" in summary
        print("✅ Summary generation: PASSED")
        
        print("\n🎉 All basic tests passed!")
        
    except Exception as e:
        print(f"❌ Basic test failed: {e}")
        import traceback
        traceback.print_exc()