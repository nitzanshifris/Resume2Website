#!/usr/bin/env python3
"""
Integration Tests for Enhanced Workflow System
Tests the complete workflow integration: API + SSE + Logging + Metrics + Correlation
"""

import asyncio
import aiohttp
import json
import time
from datetime import datetime
import sys
import os

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


class WorkflowIntegrationTester:
    """Integration test runner for the complete workflow system"""
    
    def __init__(self, base_url: str = "http://localhost:2000"):
        self.base_url = base_url
        self.workflow_id = None
        self.correlation_id = None
        self.test_results = []
    
    async def test_workflow_api_endpoints(self):
        """Test all workflow API endpoints"""
        
        print("🚀 Testing Workflow API Integration...")
        
        # Test 1: Basic workflow endpoint
        success = await self._test_basic_workflow_endpoint()
        self.test_results.append(("Basic Workflow Endpoint", success))
        
        # Test 2: Start workflow
        success = await self._test_start_workflow()
        self.test_results.append(("Start Workflow", success))
        
        # Test 3: Workflow metrics
        success = await self._test_workflow_metrics()
        self.test_results.append(("Workflow Metrics", success))
        
        # Test 4: Enhanced SSE message types
        success = await self._test_sse_message_types()
        self.test_results.append(("SSE Message Types", success))
        
        # Test 5: Performance metrics collection
        success = await self._test_performance_metrics()
        self.test_results.append(("Performance Metrics", success))
        
        return self.test_results
    
    async def _test_basic_workflow_endpoint(self):
        """Test basic workflow endpoint connectivity"""
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(f"{self.base_url}/api/v1/workflows/test") as response:
                    if response.status == 200:
                        data = await response.json()
                        print(f"  ✅ Basic endpoint: {data['message']}")
                        return True
                    else:
                        print(f"  ❌ Basic endpoint failed: HTTP {response.status}")
                        return False
        except Exception as e:
            print(f"  ❌ Basic endpoint error: {e}")
            return False
    
    async def _test_start_workflow(self):
        """Test workflow start functionality"""
        
        try:
            workflow_config = {
                "name": "integration_test_workflow",
                "type": "cv_processing", 
                "connection_id": "integration-test-connection",
                "estimated_duration": "30s",
                "test_mode": True
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.base_url}/api/v1/workflows/start",
                    json=workflow_config,
                    headers={"Content-Type": "application/json"}
                ) as response:
                    
                    if response.status == 200:
                        data = await response.json()
                        self.workflow_id = data.get("workflow_id")
                        
                        print(f"  ✅ Workflow started: {self.workflow_id}")
                        print(f"  📋 Config received: {data.get('config_received', {}).get('name')}")
                        return True
                    else:
                        error_text = await response.text()
                        print(f"  ❌ Workflow start failed: HTTP {response.status}")
                        print(f"      Error: {error_text}")
                        return False
                        
        except Exception as e:
            print(f"  ❌ Workflow start error: {e}")
            return False
    
    async def _test_workflow_metrics(self):
        """Test workflow metrics collection"""
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"{self.base_url}/api/v1/workflows/metrics?time_window_minutes=1"
                ) as response:
                    
                    if response.status == 200:
                        data = await response.json()
                        
                        print(f"  ✅ Metrics endpoint accessible")
                        print(f"  📊 Time window: {data.get('time_window_minutes')} minutes")
                        print(f"  🔢 Metrics collector stats: {len(data.get('metrics_collector_stats', {}))} fields")
                        
                        # Check for specific metrics structure
                        if 'correlation_statistics' in data:
                            print(f"  🔗 Correlation stats available")
                        
                        if 'aggregation_report' in data:
                            print(f"  📈 Aggregation report available")
                        
                        return True
                    else:
                        print(f"  ❌ Metrics failed: HTTP {response.status}")
                        return False
                        
        except Exception as e:
            print(f"  ❌ Metrics error: {e}")
            return False
    
    async def _test_sse_message_types(self):
        """Test SSE message types functionality"""
        
        try:
            # Import and test message creation
            from src.services.sse_message_types import (
                SSEMessageFactory, 
                SSEMessageType, 
                LogLevel,
                WorkflowStatus
            )
            
            print(f"  ✅ SSE message types imported successfully")
            
            # Test log message creation
            log_msg = SSEMessageFactory.create_log_message(
                LogLevel.INFO,
                "Integration test message",
                "integration-test-correlation",
                "integration-tester"
            )
            
            print(f"  📨 Log message type: {log_msg.message_type.value}")
            
            # Test workflow message creation
            workflow_msg = SSEMessageFactory.create_workflow_message(
                "integration-workflow-123",
                WorkflowStatus.RUNNING,
                phase="testing",
                progress=50.0
            )
            
            print(f"  📋 Workflow message type: {workflow_msg.message_type.value}")
            
            # Test metric message creation
            metric_msg = SSEMessageFactory.create_metric_message(
                "integration_test_metric",
                42.0,
                "seconds",
                "integration-test-correlation"
            )
            
            print(f"  📊 Metric message type: {metric_msg.message_type.value}")
            
            return True
            
        except Exception as e:
            print(f"  ❌ SSE message types error: {e}")
            return False
    
    async def _test_performance_metrics(self):
        """Test performance metrics integration"""
        
        try:
            from src.services.metrics_collector import metrics_collector
            from src.utils.enhanced_sse_logger import EnhancedSSELogger
            
            print(f"  ✅ Performance metrics modules imported")
            
            # Test enhanced logger with metrics
            logger = EnhancedSSELogger(
                "integration_test_logger",
                enable_performance_tracking=True,
                custom_tags={"test": "integration", "environment": "test"}
            )
            
            print(f"  📝 Enhanced logger created: {logger.workflow_id}")
            
            # Test metrics recording
            logger.increment_counter("integration_tests_run", 1)
            logger.set_gauge("integration_test_progress", 75.0)
            logger.start_timer("integration_test_duration")
            
            # Simulate some work
            await asyncio.sleep(0.1)
            
            duration = logger.end_timer("integration_test_duration")
            print(f"  ⏱️  Test duration recorded: {duration:.3f}s")
            
            # Test workflow summary
            summary = logger.get_workflow_summary()
            print(f"  📋 Workflow summary generated: {len(summary)} fields")
            
            # Check counters and gauges
            if logger.counters.get("integration_tests_run") == 1:
                print(f"  🔢 Counter tracking: SUCCESS")
            
            if logger.gauges.get("integration_test_progress") == 75.0:
                print(f"  📊 Gauge tracking: SUCCESS")
            
            return True
            
        except Exception as e:
            print(f"  ❌ Performance metrics error: {e}")
            return False
    
    async def test_sse_live_streaming(self):
        """Test live SSE streaming with the workflow system"""
        
        print("\n🌊 Testing SSE Live Streaming Integration...")
        
        try:
            # Test heartbeat stream
            messages_received = 0
            
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"{self.base_url}/api/v1/sse/heartbeat",
                    headers={"Accept": "text/event-stream"}
                ) as response:
                    
                    if response.status != 200:
                        print(f"  ❌ SSE connection failed: HTTP {response.status}")
                        return False
                    
                    print(f"  ✅ SSE connection established")
                    
                    # Read a few messages to verify streaming
                    async for line in response.content:
                        line = line.decode('utf-8').strip()
                        
                        if line.startswith('data: '):
                            try:
                                data = json.loads(line[6:])
                                messages_received += 1
                                print(f"  📨 Message {messages_received}: {data.get('timestamp', 'unknown')}")
                                
                                if messages_received >= 2:
                                    break
                                    
                            except json.JSONDecodeError:
                                continue
            
            if messages_received >= 2:
                print(f"  ✅ SSE streaming: SUCCESS ({messages_received} messages)")
                return True
            else:
                print(f"  ❌ SSE streaming: FAILED (only {messages_received} messages)")
                return False
                
        except Exception as e:
            print(f"  ❌ SSE streaming error: {e}")
            return False
    
    def print_results(self):
        """Print comprehensive test results"""
        
        print("\n" + "="*60)
        print("🧪 WORKFLOW INTEGRATION TEST RESULTS")
        print("="*60)
        
        passed = sum(1 for _, success in self.test_results if success)
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {total - passed}")
        print(f"Success Rate: {(passed/total*100):.1f}%")
        
        print("\n📋 Detailed Results:")
        for test_name, success in self.test_results:
            status = "✅ PASS" if success else "❌ FAIL"
            print(f"  {status}: {test_name}")
        
        if self.workflow_id:
            print(f"\n🔗 Test Workflow ID: {self.workflow_id}")
        
        return passed == total


async def run_integration_tests():
    """Run all integration tests"""
    
    print("🚀 Starting Enhanced Workflow System Integration Tests")
    print("="*60)
    
    tester = WorkflowIntegrationTester()
    
    # Test API endpoints
    await tester.test_workflow_api_endpoints()
    
    # Test SSE streaming
    sse_success = await tester.test_sse_live_streaming()
    tester.test_results.append(("SSE Live Streaming", sse_success))
    
    # Print results
    all_passed = tester.print_results()
    
    if all_passed:
        print("\n🎉 ALL INTEGRATION TESTS PASSED!")
        print("✨ Enhanced Workflow System is fully operational!")
    else:
        print("\n⚠️  Some integration tests failed.")
        print("🔧 Check the detailed results above for issues.")
    
    return all_passed


def test_message_validation():
    """Test SSE message validation"""
    
    print("\n🔍 Testing SSE Message Validation...")
    
    try:
        from src.services.sse_message_types import (
            validate_sse_message,
            SSEMessageType,
            format_sse_message
        )
        
        # Test valid message
        valid_data = {
            "message": "Test message",
            "correlation_id": "test-123",
            "component": "test-component"
        }
        
        is_valid = validate_sse_message(SSEMessageType.LOG_INFO, valid_data)
        print(f"  ✅ Valid message validation: {is_valid}")
        
        # Test message formatting
        formatted = format_sse_message(SSEMessageType.LOG_INFO, valid_data.copy())
        parsed = json.loads(formatted)
        
        print(f"  ✅ Message formatting: SUCCESS")
        print(f"  📨 Formatted type: {parsed.get('type')}")
        print(f"  📅 Has timestamp: {'timestamp' in parsed}")
        
        return True
        
    except Exception as e:
        print(f"  ❌ Message validation error: {e}")
        return False


async def main():
    """Main test runner"""
    
    try:
        # Run integration tests
        integration_success = await run_integration_tests()
        
        # Run message validation tests
        validation_success = test_message_validation()
        
        # Final summary
        print("\n" + "="*60)
        print("🏁 FINAL TEST SUMMARY")
        print("="*60)
        
        if integration_success and validation_success:
            print("🎊 ALL TESTS COMPLETED SUCCESSFULLY!")
            print("🚀 Enhanced Workflow System with SSE Integration is ready for production!")
            return 0
        else:
            print("❌ Some tests failed. Please review the output above.")
            return 1
            
    except KeyboardInterrupt:
        print("\n🛑 Tests interrupted by user")
        return 1
    except Exception as e:
        print(f"\n🚨 Test runner error: {e}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    exit_code = asyncio.run(main())
    exit(exit_code)