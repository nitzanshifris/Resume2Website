#!/usr/bin/env python3
"""
Comprehensive SSE Testing Suite for CV2WEB
Tests all SSE endpoints and functionality
"""

import asyncio
import aiohttp
import json
import time
import sys
from typing import List, Dict, Any
from dataclasses import dataclass
from datetime import datetime


@dataclass
class SSETestResult:
    """Result of an SSE test"""
    endpoint: str
    success: bool
    duration: float
    message_count: int
    errors: List[str]
    messages: List[Dict[str, Any]]


class SSETestRunner:
    """Comprehensive SSE test runner"""
    
    def __init__(self, base_url: str = "http://localhost:2000/api/v1/sse"):
        self.base_url = base_url
        self.results: List[SSETestResult] = []
        
    async def test_heartbeat(self, duration: int = 10) -> SSETestResult:
        """Test heartbeat endpoint"""
        print(f"🧪 Testing heartbeat endpoint ({duration}s)...")
        
        endpoint = f"{self.base_url}/heartbeat"
        messages = []
        errors = []
        start_time = time.time()
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    endpoint,
                    headers={"Accept": "text/event-stream"},
                    timeout=aiohttp.ClientTimeout(total=duration + 5)
                ) as response:
                    
                    if response.status != 200:
                        errors.append(f"HTTP {response.status}: {await response.text()}")
                        return SSETestResult(endpoint, False, 0, 0, errors, [])
                    
                    async for line in response.content:
                        line = line.decode('utf-8').strip()
                        if not line:
                            continue
                            
                        if line.startswith('data: '):
                            try:
                                data = json.loads(line[6:])  # Remove 'data: ' prefix
                                messages.append(data)
                                print(f"  📨 {data}")
                            except json.JSONDecodeError as e:
                                errors.append(f"JSON decode error: {e}")
                        
                        # Stop after duration
                        if time.time() - start_time > duration:
                            break
                            
        except asyncio.TimeoutError:
            print(f"  ⏰ Test completed after {duration}s timeout")
        except Exception as e:
            errors.append(f"Connection error: {e}")
            
        duration_actual = time.time() - start_time
        success = len(errors) == 0 and len(messages) > 0
        
        print(f"  ✅ Heartbeat test: {len(messages)} messages, {duration_actual:.1f}s")
        return SSETestResult(endpoint, success, duration_actual, len(messages), errors, messages)
    
    async def test_error_handling(self) -> SSETestResult:
        """Test error handling endpoint"""
        print("🧪 Testing error handling...")
        
        endpoint = f"{self.base_url}/test-error-handling"
        messages = []
        errors = []
        start_time = time.time()
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    endpoint,
                    headers={"Accept": "text/event-stream"},
                    timeout=aiohttp.ClientTimeout(total=10)
                ) as response:
                    
                    if response.status != 200:
                        errors.append(f"HTTP {response.status}: {await response.text()}")
                        return SSETestResult(endpoint, False, 0, 0, errors, [])
                    
                    event_type = None
                    async for line in response.content:
                        line = line.decode('utf-8').strip()
                        if not line:
                            continue
                            
                        if line.startswith('event: '):
                            event_type = line[7:]
                        elif line.startswith('data: '):
                            try:
                                data = json.loads(line[6:])
                                message = {"type": event_type, "data": data}
                                messages.append(message)
                                print(f"  📨 {event_type}: {data.get('message', data)}")
                            except json.JSONDecodeError as e:
                                errors.append(f"JSON decode error: {e}")
                                
        except Exception as e:
            errors.append(f"Connection error: {e}")
            
        duration_actual = time.time() - start_time
        
        # Check for expected error types
        expected_types = ['step', 'warning', 'error', 'sentinel']
        received_types = [msg['type'] for msg in messages if msg.get('type')]
        missing_types = [t for t in expected_types if t not in received_types]
        
        if missing_types:
            errors.append(f"Missing expected event types: {missing_types}")
        
        success = len(errors) == 0 and len(messages) >= 4
        print(f"  ✅ Error handling test: {len(messages)} messages, {duration_actual:.1f}s")
        return SSETestResult(endpoint, success, duration_actual, len(messages), errors, messages)
    
    async def test_timeout_handling(self, timeout_duration: int = 3) -> SSETestResult:
        """Test timeout handling"""
        print(f"🧪 Testing timeout handling ({timeout_duration}s)...")
        
        endpoint = f"{self.base_url}/test-timeout/{timeout_duration}"
        messages = []
        errors = []
        start_time = time.time()
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    endpoint,
                    headers={"Accept": "text/event-stream"},
                    timeout=aiohttp.ClientTimeout(total=timeout_duration + 5)
                ) as response:
                    
                    if response.status != 200:
                        errors.append(f"HTTP {response.status}: {await response.text()}")
                        return SSETestResult(endpoint, False, 0, 0, errors, [])
                    
                    event_type = None
                    async for line in response.content:
                        line = line.decode('utf-8').strip()
                        if not line:
                            continue
                            
                        if line.startswith('event: '):
                            event_type = line[7:]
                        elif line.startswith('data: '):
                            try:
                                data = json.loads(line[6:])
                                message = {"type": event_type, "data": data}
                                messages.append(message)
                                print(f"  📨 {event_type}: {data.get('sentinelType', data.get('message', data))}")
                            except json.JSONDecodeError as e:
                                errors.append(f"JSON decode error: {e}")
                                
        except Exception as e:
            errors.append(f"Connection error: {e}")
            
        duration_actual = time.time() - start_time
        
        # Check for timeout sentinel
        timeout_found = any(
            msg.get('type') == 'sentinel' and 
            msg.get('data', {}).get('sentinelType') == 'TIMEOUT'
            for msg in messages
        )
        
        if not timeout_found:
            errors.append("Timeout sentinel not found")
        
        success = len(errors) == 0 and timeout_found
        print(f"  ✅ Timeout test: {len(messages)} messages, {duration_actual:.1f}s")
        return SSETestResult(endpoint, success, duration_actual, len(messages), errors, messages)
    
    async def test_rate_limiting(self) -> SSETestResult:
        """Test rate limiting info endpoint"""
        print("🧪 Testing rate limiting info...")
        
        endpoint = f"{self.base_url}/rate-limit-status"
        errors = []
        start_time = time.time()
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(endpoint) as response:
                    if response.status != 200:
                        errors.append(f"HTTP {response.status}: {await response.text()}")
                        return SSETestResult(endpoint, False, 0, 0, errors, [])
                    
                    data = await response.json()
                    print(f"  📊 Rate limit info: {data['user_limits']['active_connections']} connections")
                    print(f"  📊 Global stats: {data['global_stats']['global_connections']}/{data['global_stats']['max_global_connections']} connections")
                    
                    # Validate response structure
                    required_keys = ['user_limits', 'global_stats', 'timestamp']
                    missing_keys = [key for key in required_keys if key not in data]
                    if missing_keys:
                        errors.append(f"Missing keys in response: {missing_keys}")
                    
        except Exception as e:
            errors.append(f"Request error: {e}")
            
        duration_actual = time.time() - start_time
        success = len(errors) == 0
        
        print(f"  ✅ Rate limiting test: {duration_actual:.1f}s")
        return SSETestResult(endpoint, success, duration_actual, 1, errors, [data] if 'data' in locals() else [])
    
    async def test_health_check(self) -> SSETestResult:
        """Test server health"""
        print("🧪 Testing server health...")
        
        endpoint = f"{self.base_url.replace('/api/v1/sse', '')}/health"
        errors = []
        start_time = time.time()
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(endpoint) as response:
                    if response.status != 200:
                        errors.append(f"HTTP {response.status}: {await response.text()}")
                        return SSETestResult(endpoint, False, 0, 0, errors, [])
                    
                    data = await response.json()
                    if data.get('status') != 'healthy':
                        errors.append(f"Server not healthy: {data}")
                    
                    print(f"  💚 Server health: {data}")
                    
        except Exception as e:
            errors.append(f"Health check error: {e}")
            
        duration_actual = time.time() - start_time
        success = len(errors) == 0
        
        print(f"  ✅ Health check: {duration_actual:.1f}s")
        return SSETestResult(endpoint, success, duration_actual, 1, errors, [data] if 'data' in locals() else [])
    
    async def run_all_tests(self) -> List[SSETestResult]:
        """Run all SSE tests"""
        print("🚀 Starting comprehensive SSE tests...")
        print(f"Target: {self.base_url}")
        print("=" * 60)
        
        # Test 1: Health check
        result = await self.test_health_check()
        self.results.append(result)
        
        if not result.success:
            print("❌ Server health check failed - aborting tests")
            return self.results
        
        # Test 2: Rate limiting info
        result = await self.test_rate_limiting()
        self.results.append(result)
        
        # Test 3: Heartbeat
        result = await self.test_heartbeat(duration=5)
        self.results.append(result)
        
        # Test 4: Error handling
        result = await self.test_error_handling()
        self.results.append(result)
        
        # Test 5: Timeout handling
        result = await self.test_timeout_handling(timeout_duration=3)
        self.results.append(result)
        
        return self.results
    
    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.results)
        passed_tests = sum(1 for r in self.results if r.success)
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests*100):.1f}%")
        
        if failed_tests > 0:
            print("\n🔍 FAILED TESTS:")
            for result in self.results:
                if not result.success:
                    print(f"  ❌ {result.endpoint}")
                    for error in result.errors:
                        print(f"     • {error}")
        
        print("\n📈 PERFORMANCE:")
        for result in self.results:
            status = "✅" if result.success else "❌"
            print(f"  {status} {result.endpoint}: {result.duration:.2f}s, {result.message_count} messages")
        
        total_duration = sum(r.duration for r in self.results)
        total_messages = sum(r.message_count for r in self.results)
        print(f"\nTotal Duration: {total_duration:.2f}s")
        print(f"Total Messages: {total_messages}")


async def main():
    """Main test runner"""
    if len(sys.argv) > 1:
        base_url = sys.argv[1]
    else:
        base_url = "http://localhost:2000/api/v1/sse"
    
    runner = SSETestRunner(base_url)
    
    try:
        await runner.run_all_tests()
        runner.print_summary()
        
        # Exit with error code if any tests failed
        failed_count = sum(1 for r in runner.results if not r.success)
        sys.exit(failed_count)
        
    except KeyboardInterrupt:
        print("\n🛑 Tests interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"🚨 Test runner error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())