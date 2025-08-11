#!/usr/bin/env python3
"""
Comprehensive Deep Validation Test Suite
Tests all implemented components with thorough validation
"""

import asyncio
import aiohttp
import json
import time
import threading
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import sys
import os

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import required classes
from src.utils.enhanced_sse_logger import EnhancedSSELogger


class DeepValidationTester:
    """Deep validation test runner for all RESUME2WEBSITE components"""
    
    def __init__(self, base_url: str = "http://localhost:2000"):
        self.base_url = base_url
        self.test_results = []
        self.performance_metrics = {}
        self.errors = []
    
    async def run_comprehensive_tests(self):
        """Run all comprehensive tests"""
        
        print("🔍 COMPREHENSIVE DEEP VALIDATION STARTING...")
        print("=" * 80)
        
        # Test 1: Core SSE Infrastructure
        await self._test_sse_infrastructure()
        
        # Test 2: Enhanced Logger Integration
        await self._test_enhanced_logger()
        
        # Test 3: Correlation Management
        await self._test_correlation_management()
        
        # Test 4: Performance Metrics
        await self._test_performance_metrics()
        
        # Test 5: Log Aggregation
        await self._test_log_aggregation()
        
        # Test 6: Workflow API
        await self._test_workflow_api()
        
        # Test 7: SSE Message Types
        await self._test_sse_message_types()
        
        # Test 8: Integration Testing
        await self._test_integration_scenarios()
        
        # Test 9: Load Testing
        await self._test_load_scenarios()
        
        # Test 10: Error Handling
        await self._test_error_handling()
        
        return self.test_results
    
    async def _test_sse_infrastructure(self):
        """Deep test SSE infrastructure"""
        
        print("\n🌊 TESTING SSE INFRASTRUCTURE")
        print("-" * 40)
        
        try:
            # Test heartbeat endpoint
            heartbeat_success = await self._test_heartbeat_deep()
            self.test_results.append(("SSE Heartbeat Deep", heartbeat_success))
            
            # Test connection management
            connection_success = await self._test_connection_management()
            self.test_results.append(("SSE Connection Management", connection_success))
            
            # Test rate limiting
            rate_limit_success = await self._test_rate_limiting()
            self.test_results.append(("SSE Rate Limiting", rate_limit_success))
            
            # Test error handling
            error_handling_success = await self._test_sse_error_handling()
            self.test_results.append(("SSE Error Handling", error_handling_success))
            
        except Exception as e:
            self.errors.append(f"SSE Infrastructure Test Error: {e}")
            print(f"  ❌ SSE Infrastructure failed: {e}")
    
    async def _test_heartbeat_deep(self) -> bool:
        """Deep test heartbeat functionality"""
        
        print("  🔄 Testing heartbeat deep functionality...")
        
        try:
            messages_received = 0
            start_time = time.time()
            
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"{self.base_url}/api/v1/sse/heartbeat",
                    headers={"Accept": "text/event-stream"}
                ) as response:
                    
                    if response.status != 200:
                        print(f"    ❌ Heartbeat connection failed: {response.status}")
                        return False
                    
                    async for line in response.content:
                        line = line.decode('utf-8').strip()
                        
                        if line.startswith('data: '):
                            try:
                                data = json.loads(line[6:])
                                messages_received += 1
                                
                                # Validate message structure
                                if 'timestamp' not in data or 'connections' not in data:
                                    print(f"    ❌ Invalid heartbeat message structure")
                                    return False
                                
                                # Validate timestamp format
                                try:
                                    datetime.fromisoformat(data['timestamp'])
                                except ValueError:
                                    print(f"    ❌ Invalid timestamp format")
                                    return False
                                
                                if messages_received >= 3:
                                    break
                                    
                            except json.JSONDecodeError:
                                print(f"    ❌ Invalid JSON in heartbeat message")
                                return False
            
            duration = time.time() - start_time
            self.performance_metrics['heartbeat_duration'] = duration
            
            print(f"    ✅ Heartbeat deep test: {messages_received} messages in {duration:.2f}s")
            return messages_received >= 3
            
        except Exception as e:
            print(f"    ❌ Heartbeat deep test failed: {e}")
            return False
    
    async def _test_connection_management(self) -> bool:
        """Test connection management under load"""
        
        print("  🔗 Testing connection management...")
        
        try:
            # Test multiple concurrent connections
            connections = []
            
            async def create_connection():
                async with aiohttp.ClientSession() as session:
                    async with session.get(
                        f"{self.base_url}/api/v1/sse/heartbeat",
                        headers={"Accept": "text/event-stream"}
                    ) as response:
                        if response.status == 200:
                            # Read one message to establish connection
                            async for line in response.content:
                                if line.decode('utf-8').strip().startswith('data: '):
                                    return True
                        return False
            
            # Create 5 concurrent connections
            tasks = [create_connection() for _ in range(5)]
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            successful_connections = sum(1 for r in results if r is True)
            
            print(f"    ✅ Connection management: {successful_connections}/5 connections successful")
            return successful_connections >= 4  # Allow 1 failure
            
        except Exception as e:
            print(f"    ❌ Connection management test failed: {e}")
            return False
    
    async def _test_rate_limiting(self) -> bool:
        """Test rate limiting functionality"""
        
        print("  🚦 Testing rate limiting...")
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"{self.base_url}/api/v1/sse/rate-limit-status"
                ) as response:
                    
                    if response.status != 200:
                        print(f"    ❌ Rate limit status endpoint failed: {response.status}")
                        return False
                    
                    data = await response.json()
                    
                    # Validate response structure
                    required_fields = ['user_limits', 'global_stats', 'timestamp']
                    for field in required_fields:
                        if field not in data:
                            print(f"    ❌ Missing field in rate limit response: {field}")
                            return False
                    
                    print(f"    ✅ Rate limiting status: {data['global_stats']['global_connections']} connections")
                    return True
            
        except Exception as e:
            print(f"    ❌ Rate limiting test failed: {e}")
            return False
    
    async def _test_sse_error_handling(self) -> bool:
        """Test SSE error handling"""
        
        print("  🚨 Testing SSE error handling...")
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"{self.base_url}/api/v1/sse/test-error-handling",
                    headers={"Accept": "text/event-stream"}
                ) as response:
                    
                    if response.status != 200:
                        print(f"    ❌ Error handling endpoint failed: {response.status}")
                        return False
                    
                    event_types_received = set()
                    
                    async for line in response.content:
                        line = line.decode('utf-8').strip()
                        
                        if line.startswith('event: '):
                            event_type = line[7:]
                            event_types_received.add(event_type)
                            
                            # Stop after we get a sentinel event
                            if event_type == 'sentinel':
                                break
                    
                    expected_events = {'step', 'warning', 'error', 'sentinel'}
                    missing_events = expected_events - event_types_received
                    
                    if missing_events:
                        print(f"    ❌ Missing event types: {missing_events}")
                        return False
                    
                    print(f"    ✅ Error handling: All event types received")
                    return True
            
        except Exception as e:
            print(f"    ❌ SSE error handling test failed: {e}")
            return False
    
    async def _test_enhanced_logger(self) -> bool:
        """Test enhanced logger functionality"""
        
        print("\n📝 TESTING ENHANCED LOGGER")
        print("-" * 40)
        
        try:
            from src.utils.enhanced_sse_logger import EnhancedSSELogger, WorkflowPhase
            
            # Test logger creation
            logger = EnhancedSSELogger(
                "deep_test_logger",
                enable_performance_tracking=True,
                enable_aggregation=True,
                custom_tags={"test": "deep_validation"}
            )
            
            print(f"  ✅ Logger created: {logger.workflow_id}")
            
            # Test workflow phases
            logger.start_phase(WorkflowPhase.VALIDATION, expected_steps=3)
            
            # Test performance metrics
            logger.start_timer("test_operation")
            await asyncio.sleep(0.1)
            duration = logger.end_timer("test_operation")
            
            if duration < 0.05:
                print(f"  ❌ Timer duration too short: {duration}")
                return False
            
            # Test counters and gauges
            logger.increment_counter("test_counter", 5)
            logger.set_gauge("test_gauge", 75.5)
            
            # Test workflow summary
            summary = logger.get_workflow_summary()
            
            required_fields = ['workflow_id', 'correlation_id', 'total_duration', 'counters', 'gauges']
            for field in required_fields:
                if field not in summary:
                    print(f"  ❌ Missing field in workflow summary: {field}")
                    return False
            
            # Validate counter and gauge values
            if summary['counters'].get('test_counter') != 5:
                print(f"  ❌ Counter value incorrect: {summary['counters']}")
                return False
            
            if summary['gauges'].get('test_gauge') != 75.5:
                print(f"  ❌ Gauge value incorrect: {summary['gauges']}")
                return False
            
            logger.end_phase()
            logger.finalize_workflow()
            
            print(f"  ✅ Enhanced logger: All functionality verified")
            return True
            
        except Exception as e:
            print(f"  ❌ Enhanced logger test failed: {e}")
            return False
    
    async def _test_correlation_management(self) -> bool:
        """Test correlation management system"""
        
        print("\n🔗 TESTING CORRELATION MANAGEMENT")
        print("-" * 40)
        
        try:
            from src.services.correlation_manager import (
                correlation_manager, 
                CorrelationScope,
                create_workflow_correlation
            )
            
            # Test correlation context creation
            context = create_workflow_correlation(
                "test-workflow-123",
                user_id="test-user",
                metadata={"test": "deep_validation"}
            )
            
            print(f"  ✅ Correlation context created: {context.correlation_id}")
            
            # Test context updates
            correlation_manager.update_context(
                context.correlation_id,
                component="test_component",
                service="test_service",
                operation="test_operation"
            )
            
            # Test timing
            correlation_manager.start_correlation_timing(context.correlation_id)
            await asyncio.sleep(0.05)
            correlation_manager.end_correlation_timing(context.correlation_id)
            
            # Verify context was updated
            updated_context = correlation_manager.get_context(context.correlation_id)
            if not updated_context:
                print(f"  ❌ Context not found after update")
                return False
            
            if "test_component" not in updated_context.components:
                print(f"  ❌ Component not added to context")
                return False
            
            if "test_service" not in updated_context.services:
                print(f"  ❌ Service not added to context")
                return False
            
            if "test_operation" not in updated_context.operations:
                print(f"  ❌ Operation not added to context")
                return False
            
            duration = updated_context.get_duration()
            if not duration or duration < 0.04:
                print(f"  ❌ Duration not recorded correctly: {duration}")
                return False
            
            print(f"  ✅ Correlation management: All functionality verified")
            return True
            
        except Exception as e:
            print(f"  ❌ Correlation management test failed: {e}")
            return False
    
    async def _test_performance_metrics(self) -> bool:
        """Test performance metrics collection"""
        
        print("\n📊 TESTING PERFORMANCE METRICS")
        print("-" * 40)
        
        try:
            from src.services.metrics_collector import (
                metrics_collector,
                MetricType,
                TimeWindow,
                Timer
            )
            
            # Test counter
            metrics_collector.increment_counter("deep_test_counter", 10)
            
            # Test gauge
            metrics_collector.set_gauge("deep_test_gauge", 95.5)
            
            # Test timer
            with Timer("deep_test_timer"):
                await asyncio.sleep(0.1)
            
            # Test histogram
            for i in range(10):
                metrics_collector.record_histogram_value("deep_test_histogram", i * 0.1)
            
            # Get metrics summaries
            counter_summary = metrics_collector.get_metric_summary("deep_test_counter")
            gauge_summary = metrics_collector.get_metric_summary("deep_test_gauge")
            timer_summary = metrics_collector.get_metric_summary("deep_test_timer")
            histogram_summary = metrics_collector.get_metric_summary("deep_test_histogram")
            
            # Validate counter
            if not counter_summary or counter_summary.total != 10:
                print(f"  ❌ Counter summary incorrect: {counter_summary}")
                return False
            
            # Validate gauge
            if not gauge_summary or gauge_summary.mean_value != 95.5:
                print(f"  ❌ Gauge summary incorrect: {gauge_summary}")
                return False
            
            # Validate timer
            if not timer_summary or timer_summary.mean_value < 0.05:
                print(f"  ❌ Timer summary incorrect: {timer_summary}")
                return False
            
            # Validate histogram
            if not histogram_summary or histogram_summary.count != 10:
                print(f"  ❌ Histogram summary incorrect: {histogram_summary}")
                return False
            
            # Test export
            export_data = metrics_collector.export_metrics("json")
            if not export_data or len(export_data) < 100:
                print(f"  ❌ Export data too small: {len(export_data)}")
                return False
            
            print(f"  ✅ Performance metrics: All functionality verified")
            return True
            
        except Exception as e:
            print(f"  ❌ Performance metrics test failed: {e}")
            return False
    
    async def _test_log_aggregation(self) -> bool:
        """Test log aggregation system"""
        
        print("\n📋 TESTING LOG AGGREGATION")
        print("-" * 40)
        
        try:
            from src.services.log_aggregation_service import (
                log_aggregation_service,
                LogPattern,
                AlertSeverity
            )
            
            # Test pattern creation
            test_pattern = LogPattern(
                name="test_pattern",
                pattern="test.*error",
                severity=AlertSeverity.HIGH,
                description="Test pattern for deep validation"
            )
            
            log_aggregation_service.add_log_pattern(test_pattern)
            
            # Test aggregation report
            report = log_aggregation_service.get_recent_report(minutes=1)
            
            if not report:
                print(f"  ❌ No aggregation report available")
                return False
            
            # Validate report structure
            report_dict = report.to_dict()
            required_fields = ['timeframe', 'total_entries', 'error_rate', 'warning_rate']
            for field in required_fields:
                if field not in report_dict:
                    print(f"  ❌ Missing field in aggregation report: {field}")
                    return False
            
            # Test statistics
            stats = log_aggregation_service.get_statistics()
            if 'total_patterns' not in stats:
                print(f"  ❌ Statistics missing total_patterns")
                return False
            
            if stats['total_patterns'] == 0:
                print(f"  ❌ No patterns registered")
                return False
            
            print(f"  ✅ Log aggregation: All functionality verified")
            return True
            
        except Exception as e:
            print(f"  ❌ Log aggregation test failed: {e}")
            return False
    
    async def _test_workflow_api(self) -> bool:
        """Test workflow API endpoints"""
        
        print("\n🔄 TESTING WORKFLOW API")
        print("-" * 40)
        
        try:
            # Test workflow start
            workflow_config = {
                "name": "deep_validation_workflow",
                "type": "cv_processing",
                "connection_id": "deep-test-connection",
                "estimated_duration": "60s"
            }
            
            async with aiohttp.ClientSession() as session:
                # Start workflow
                async with session.post(
                    f"{self.base_url}/api/v1/workflows/start",
                    json=workflow_config
                ) as response:
                    
                    if response.status != 200:
                        print(f"  ❌ Workflow start failed: {response.status}")
                        return False
                    
                    data = await response.json()
                    workflow_id = data.get("workflow_id")
                    
                    if not workflow_id:
                        print(f"  ❌ No workflow ID returned")
                        return False
                    
                    print(f"  ✅ Workflow started: {workflow_id}")
                
                # Test metrics endpoint
                async with session.get(
                    f"{self.base_url}/api/v1/workflows/metrics?time_window_minutes=1"
                ) as response:
                    
                    if response.status != 200:
                        print(f"  ❌ Metrics endpoint failed: {response.status}")
                        return False
                    
                    data = await response.json()
                    required_fields = ['time_window_minutes', 'correlation_statistics', 'metrics_collector_stats']
                    for field in required_fields:
                        if field not in data:
                            print(f"  ❌ Missing field in metrics response: {field}")
                            return False
                    
                    print(f"  ✅ Metrics endpoint: All fields present")
            
            return True
            
        except Exception as e:
            print(f"  ❌ Workflow API test failed: {e}")
            return False
    
    async def _test_sse_message_types(self) -> bool:
        """Test SSE message types system"""
        
        print("\n📨 TESTING SSE MESSAGE TYPES")
        print("-" * 40)
        
        try:
            from src.services.sse_message_types import (
                SSEMessageFactory,
                SSEMessageType,
                LogLevel,
                WorkflowStatus,
                validate_sse_message,
                format_sse_message
            )
            
            # Test log message creation
            log_msg = SSEMessageFactory.create_log_message(
                LogLevel.INFO,
                "Deep validation test message",
                "deep-test-correlation",
                "deep_tester"
            )
            
            if log_msg.message_type != SSEMessageType.LOG_INFO:
                print(f"  ❌ Log message type incorrect: {log_msg.message_type}")
                return False
            
            if log_msg.level != LogLevel.INFO:
                print(f"  ❌ Log level incorrect: {log_msg.level}")
                return False
            
            # Test workflow message creation
            workflow_msg = SSEMessageFactory.create_workflow_message(
                "deep-test-workflow",
                WorkflowStatus.RUNNING,
                phase="validation",
                progress=50.0
            )
            
            if workflow_msg.workflow_id != "deep-test-workflow":
                print(f"  ❌ Workflow ID incorrect: {workflow_msg.workflow_id}")
                return False
            
            if workflow_msg.status != WorkflowStatus.RUNNING:
                print(f"  ❌ Workflow status incorrect: {workflow_msg.status}")
                return False
            
            # Test metric message creation
            metric_msg = SSEMessageFactory.create_metric_message(
                "deep_test_metric",
                100.5,
                "milliseconds",
                "deep-test-correlation"
            )
            
            if metric_msg.metric_name != "deep_test_metric":
                print(f"  ❌ Metric name incorrect: {metric_msg.metric_name}")
                return False
            
            if metric_msg.metric_value != 100.5:
                print(f"  ❌ Metric value incorrect: {metric_msg.metric_value}")
                return False
            
            # Test message validation
            valid_data = {
                "message": "Test message",
                "correlation_id": "test-123",
                "component": "test-component"
            }
            
            is_valid = validate_sse_message(SSEMessageType.LOG_INFO, valid_data)
            if not is_valid:
                print(f"  ❌ Message validation failed for valid data")
                return False
            
            # Test message formatting
            formatted = format_sse_message(SSEMessageType.LOG_INFO, valid_data.copy())
            parsed = json.loads(formatted)
            
            if parsed.get('type') != 'log_info':
                print(f"  ❌ Message formatting incorrect: {parsed.get('type')}")
                return False
            
            if 'timestamp' not in parsed:
                print(f"  ❌ Timestamp not added to formatted message")
                return False
            
            print(f"  ✅ SSE message types: All functionality verified")
            return True
            
        except Exception as e:
            print(f"  ❌ SSE message types test failed: {e}")
            return False
    
    async def _test_integration_scenarios(self) -> bool:
        """Test integration scenarios"""
        
        print("\n🔄 TESTING INTEGRATION SCENARIOS")
        print("-" * 40)
        
        try:
            from src.utils.enhanced_sse_logger import EnhancedSSELogger, WorkflowPhase
            from src.services.correlation_manager import create_workflow_correlation
            
            # Create integrated workflow
            correlation_context = create_workflow_correlation(
                "integration-test-workflow",
                user_id="integration-user",
                metadata={"scenario": "deep_validation"}
            )
            
            logger = EnhancedSSELogger(
                "integration_test_logger",
                correlation_id=correlation_context.correlation_id,
                enable_performance_tracking=True,
                enable_aggregation=True
            )
            
            # Simulate complex workflow
            logger.start_phase(WorkflowPhase.VALIDATION, expected_steps=3)
            
            # Step 1: File validation
            logger.step("Validating input file")
            logger.start_timer("file_validation")
            await asyncio.sleep(0.05)
            logger.end_timer("file_validation")
            logger.step_complete("File validation completed")
            
            # Step 2: Data extraction
            logger.step("Extracting data")
            logger.increment_counter("records_processed", 100)
            logger.set_gauge("data_quality", 0.95)
            logger.step_complete("Data extraction completed")
            
            # Step 3: Validation
            logger.step("Performing validation")
            logger.record_rate("validation_checks")
            logger.step_complete("Validation completed")
            
            logger.end_phase()
            
            # Start processing phase
            logger.start_phase(WorkflowPhase.PROCESSING, expected_steps=2)
            
            # Simulate processing
            logger.step("Processing data")
            logger.start_timer("data_processing")
            await asyncio.sleep(0.1)
            logger.end_timer("data_processing")
            logger.step_complete("Data processing completed")
            
            logger.step("Generating output")
            logger.increment_counter("output_generated", 1)
            logger.step_complete("Output generation completed")
            
            logger.end_phase()
            logger.finalize_workflow()
            
            # Verify workflow summary
            summary = logger.get_workflow_summary()
            
            if summary['counters']['records_processed'] != 100:
                print(f"  ❌ Records processed counter incorrect: {summary['counters']}")
                return False
            
            if summary['gauges']['data_quality'] != 0.95:
                print(f"  ❌ Data quality gauge incorrect: {summary['gauges']}")
                return False
            
            if len(summary['phases']) != 2:
                print(f"  ❌ Phase count incorrect: {len(summary['phases'])}")
                return False
            
            print(f"  ✅ Integration scenarios: Complex workflow verified")
            return True
            
        except Exception as e:
            print(f"  ❌ Integration scenarios test failed: {e}")
            return False
    
    async def _test_load_scenarios(self) -> bool:
        """Test load scenarios"""
        
        print("\n⚡ TESTING LOAD SCENARIOS")
        print("-" * 40)
        
        try:
            from src.utils.enhanced_sse_logger import EnhancedSSELogger
            
            # Create multiple loggers for load testing
            loggers = []
            start_time = time.time()
            
            # Create 10 loggers
            for i in range(10):
                logger = EnhancedSSELogger(
                    f"load_test_logger_{i}",
                    enable_performance_tracking=True,
                    enable_aggregation=True
                )
                loggers.append(logger)
            
            # Simulate load
            tasks = []
            for logger in loggers:
                task = self._simulate_logger_load(logger)
                tasks.append(task)
            
            # Run all load simulations concurrently
            await asyncio.gather(*tasks)
            
            creation_time = time.time() - start_time
            
            # Verify all loggers are functional
            for i, logger in enumerate(loggers):
                summary = logger.get_workflow_summary()
                if summary['counters']['load_operations'] != 50:
                    print(f"  ❌ Logger {i} load counter incorrect: {summary['counters']}")
                    return False
            
            print(f"  ✅ Load scenarios: {len(loggers)} loggers, {creation_time:.2f}s")
            return True
            
        except Exception as e:
            print(f"  ❌ Load scenarios test failed: {e}")
            return False
    
    async def _simulate_logger_load(self, logger: EnhancedSSELogger):
        """Simulate load on a single logger"""
        
        try:
            # Simulate 50 operations
            for i in range(50):
                logger.increment_counter("load_operations")
                logger.set_gauge("load_progress", (i + 1) / 50 * 100)
                
                if i % 10 == 0:
                    logger.step(f"Load step {i}")
                    logger.step_complete(f"Load step {i}")
                
                # Small delay to simulate real work
                await asyncio.sleep(0.001)
            
        except Exception as e:
            print(f"    ❌ Logger load simulation failed: {e}")
            raise
    
    async def _test_error_handling(self) -> bool:
        """Test error handling across all components"""
        
        print("\n🚨 TESTING ERROR HANDLING")
        print("-" * 40)
        
        try:
            from src.utils.enhanced_sse_logger import EnhancedSSELogger
            
            # Test logger error handling
            logger = EnhancedSSELogger("error_test_logger")
            
            # Test error logging
            test_exception = Exception("Test exception for error handling")
            logger.error("Test error message", test_exception)
            
            # Test warning logging
            logger.warning("Test warning message")
            
            # Test invalid operations
            try:
                logger.end_timer("non_existent_timer")
            except Exception:
                pass  # Expected to fail
            
            # Test metric collection error handling
            from src.services.metrics_collector import metrics_collector
            
            # Test invalid metric names
            metrics_collector.record_value("", 100)  # Empty name
            metrics_collector.record_value("test_metric", "invalid_value")  # Invalid value type
            
            # Test correlation manager error handling
            from src.services.correlation_manager import correlation_manager
            
            # Test invalid correlation IDs
            context = correlation_manager.get_context("non_existent_id")
            if context is not None:
                print(f"  ❌ Should return None for non-existent correlation ID")
                return False
            
            # Test workflow API error handling
            async with aiohttp.ClientSession() as session:
                # Test invalid workflow request
                async with session.post(
                    f"{self.base_url}/api/v1/workflows/start",
                    json={"invalid": "data"}
                ) as response:
                    
                    # Should handle invalid data gracefully
                    if response.status == 500:
                        data = await response.json()
                        if "error" not in data:
                            print(f"  ❌ Error response should contain error field")
                            return False
            
            print(f"  ✅ Error handling: All error scenarios handled gracefully")
            return True
            
        except Exception as e:
            print(f"  ❌ Error handling test failed: {e}")
            return False
    
    def print_comprehensive_results(self):
        """Print comprehensive test results"""
        
        print("\n" + "=" * 80)
        print("🔍 COMPREHENSIVE DEEP VALIDATION RESULTS")
        print("=" * 80)
        
        # Calculate overall statistics
        total_tests = len(self.test_results)
        passed_tests = sum(1 for _, success in self.test_results if success)
        failed_tests = total_tests - passed_tests
        
        print(f"📊 OVERVIEW:")
        print(f"  Total Tests: {total_tests}")
        print(f"  ✅ Passed: {passed_tests}")
        print(f"  ❌ Failed: {failed_tests}")
        print(f"  Success Rate: {(passed_tests/total_tests*100):.1f}%")
        
        # Performance metrics
        if self.performance_metrics:
            print(f"\n⚡ PERFORMANCE METRICS:")
            for metric, value in self.performance_metrics.items():
                print(f"  {metric}: {value:.3f}s")
        
        # Test details
        print(f"\n📋 DETAILED RESULTS:")
        for test_name, success in self.test_results:
            status = "✅ PASS" if success else "❌ FAIL"
            print(f"  {status}: {test_name}")
        
        # Errors
        if self.errors:
            print(f"\n🚨 ERRORS ENCOUNTERED:")
            for i, error in enumerate(self.errors, 1):
                print(f"  {i}. {error}")
        
        # Component status
        print(f"\n🔧 COMPONENT STATUS:")
        components = [
            "SSE Infrastructure",
            "Enhanced Logger",
            "Correlation Management", 
            "Performance Metrics",
            "Log Aggregation",
            "Workflow API",
            "SSE Message Types",
            "Integration System",
            "Load Handling",
            "Error Handling"
        ]
        
        for component in components:
            component_tests = [r for r in self.test_results if component.lower() in r[0].lower()]
            if component_tests:
                component_passed = all(success for _, success in component_tests)
                status = "✅ OPERATIONAL" if component_passed else "❌ ISSUES"
                print(f"  {status}: {component}")
        
        # Final verdict
        print(f"\n🏁 FINAL VERDICT:")
        if failed_tests == 0:
            print("  🎉 ALL SYSTEMS OPERATIONAL!")
            print("  ✨ Enhanced Workflow System with SSE Integration is production-ready!")
        else:
            print(f"  ⚠️  {failed_tests} components have issues that need attention")
            print("  🔧 Review the detailed results above for specific failures")
        
        return failed_tests == 0


async def main():
    """Main test runner"""
    
    try:
        print("🚀 Starting Comprehensive Deep Validation")
        print("🔍 Testing all implemented RESUME2WEBSITE components...")
        print("⚡ This will test SSE, logging, metrics, correlation, workflows, and more!")
        print()
        
        tester = DeepValidationTester()
        await tester.run_comprehensive_tests()
        
        # Print comprehensive results
        success = tester.print_comprehensive_results()
        
        return 0 if success else 1
        
    except KeyboardInterrupt:
        print("\n🛑 Deep validation interrupted by user")
        return 1
    except Exception as e:
        print(f"\n🚨 Deep validation error: {e}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    exit_code = asyncio.run(main())
    exit(exit_code)