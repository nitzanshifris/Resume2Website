"""
Circuit Breaker pattern implementation for LLM service resilience
Prevents cascade failures when the LLM service is experiencing issues
Now with exponential backoff and full jitter for smoother recovery
"""
import time
import logging
import random
from typing import Optional, Callable, Any, Dict
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import Enum
import asyncio
from functools import wraps

logger = logging.getLogger(__name__)


class CircuitState(Enum):
    """Circuit breaker states"""
    CLOSED = "closed"      # Normal operation, requests pass through
    OPEN = "open"          # Service is failing, requests are blocked
    HALF_OPEN = "half_open"  # Testing if service has recovered


@dataclass
class CircuitBreakerConfig:
    """Configuration for circuit breaker behavior with exponential backoff"""
    failure_threshold: int = 5           # Failures before opening circuit
    success_threshold: int = 2           # Successes in half-open before closing
    base_timeout_seconds: float = 30.0   # Base timeout for exponential backoff
    max_timeout_seconds: float = 300.0   # Maximum timeout (5 minutes)
    timeout_multiplier: float = 2.0      # Exponential multiplier
    jitter_range: float = 0.5            # Jitter range (0.5 = ±50% of calculated timeout)
    failure_window_seconds: float = 60.0 # Time window for counting failures
    half_open_max_attempts: int = 3      # Max attempts in half-open state
    
    # Legacy support - will be calculated dynamically
    timeout_seconds: float = field(init=False, default=60.0)


@dataclass
class CircuitBreakerStats:
    """Statistics for circuit breaker monitoring"""
    total_calls: int = 0
    successful_calls: int = 0
    failed_calls: int = 0
    rejected_calls: int = 0
    last_failure_time: Optional[datetime] = None
    last_success_time: Optional[datetime] = None
    consecutive_failures: int = 0
    consecutive_successes: int = 0
    state_changes: list = field(default_factory=list)
    
    def reset_consecutive_counters(self):
        """Reset consecutive counters"""
        self.consecutive_failures = 0
        self.consecutive_successes = 0


class CircuitBreaker:
    """
    Circuit breaker implementation for protecting services from cascade failures
    
    Usage:
        breaker = CircuitBreaker("llm_service")
        
        async def protected_call():
            async with breaker:
                return await llm_service.call_llm(...)
    """
    
    def __init__(self, name: str, config: Optional[CircuitBreakerConfig] = None):
        self.name = name
        self.config = config or CircuitBreakerConfig()
        self.state = CircuitState.CLOSED
        self.stats = CircuitBreakerStats()
        self._state_changed_at = datetime.now()
        self._recent_failures: list = []
        self._half_open_attempts = 0
        self._lock = asyncio.Lock()
        self._failure_count = 0  # Track failures for exponential backoff
        self._current_timeout = self.config.base_timeout_seconds
        
        logger.info(f"Circuit breaker '{name}' initialized with exponential backoff config: base={self.config.base_timeout_seconds}s, max={self.config.max_timeout_seconds}s")
    
    async def __aenter__(self):
        """Async context manager entry"""
        await self._before_call()
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit"""
        if exc_type is None:
            await self._on_success()
        else:
            await self._on_failure(exc_val)
        return False  # Don't suppress exceptions
    
    async def _before_call(self):
        """Check if call is allowed before executing"""
        async with self._lock:
            self.stats.total_calls += 1
            
            if self.state == CircuitState.OPEN:
                # Check if timeout has passed to move to half-open
                if self._should_attempt_reset():
                    await self._transition_to_half_open()
                else:
                    self.stats.rejected_calls += 1
                    raise CircuitBreakerOpenError(
                        f"Circuit breaker '{self.name}' is OPEN. Service is unavailable."
                    )
            
            elif self.state == CircuitState.HALF_OPEN:
                # Limit attempts in half-open state
                if self._half_open_attempts >= self.config.half_open_max_attempts:
                    self.stats.rejected_calls += 1
                    raise CircuitBreakerOpenError(
                        f"Circuit breaker '{self.name}' is testing recovery. Please retry later."
                    )
                self._half_open_attempts += 1
    
    async def _on_success(self):
        """Handle successful call"""
        async with self._lock:
            self.stats.successful_calls += 1
            self.stats.last_success_time = datetime.now()
            self.stats.consecutive_successes += 1
            self.stats.consecutive_failures = 0
            
            if self.state == CircuitState.HALF_OPEN:
                if self.stats.consecutive_successes >= self.config.success_threshold:
                    await self._transition_to_closed()
            
            logger.debug(f"Circuit breaker '{self.name}': Success recorded")
    
    async def _on_failure(self, error: Exception):
        """Handle failed call"""
        async with self._lock:
            self.stats.failed_calls += 1
            self.stats.last_failure_time = datetime.now()
            self.stats.consecutive_failures += 1
            self.stats.consecutive_successes = 0
            
            # Track recent failures for time-window based analysis
            self._recent_failures.append(datetime.now())
            self._cleanup_old_failures()
            
            logger.warning(f"Circuit breaker '{self.name}': Failure recorded - {error}")
            
            if self.state == CircuitState.CLOSED:
                if self._should_open_circuit():
                    await self._transition_to_open()
            
            elif self.state == CircuitState.HALF_OPEN:
                # Any failure in half-open state reopens the circuit
                await self._transition_to_open()
    
    def _should_open_circuit(self) -> bool:
        """Check if circuit should open based on failure threshold"""
        # Count failures within the time window
        recent_failure_count = len(self._recent_failures)
        return recent_failure_count >= self.config.failure_threshold
    
    def _calculate_timeout_with_jitter(self) -> float:
        """
        Calculate timeout with exponential backoff and full jitter
        
        Full jitter formula: timeout = random(0, min(cap, base * 2^attempt))
        This provides the best performance under high contention
        """
        # Calculate exponential backoff
        exponential_timeout = self.config.base_timeout_seconds * (self.config.timeout_multiplier ** self._failure_count)
        
        # Cap at maximum timeout
        capped_timeout = min(exponential_timeout, self.config.max_timeout_seconds)
        
        # Apply full jitter (random between 0 and capped timeout)
        # Full jitter is better than fixed or proportional jitter for avoiding thundering herd
        jittered_timeout = random.uniform(0, capped_timeout)
        
        # Ensure minimum timeout (at least 1 second)
        final_timeout = max(1.0, jittered_timeout)
        
        logger.debug(f"Circuit breaker '{self.name}': Calculated timeout={final_timeout:.2f}s (failures={self._failure_count}, exp={exponential_timeout:.2f}s, capped={capped_timeout:.2f}s)")
        
        return final_timeout
    
    def _should_attempt_reset(self) -> bool:
        """Check if enough time has passed to attempt recovery"""
        time_since_change = datetime.now() - self._state_changed_at
        return time_since_change.total_seconds() >= self._current_timeout
    
    def _cleanup_old_failures(self):
        """Remove failures outside the time window"""
        cutoff = datetime.now() - timedelta(seconds=self.config.failure_window_seconds)
        self._recent_failures = [f for f in self._recent_failures if f > cutoff]
    
    async def _transition_to_open(self):
        """Transition to OPEN state with exponential backoff calculation"""
        self.state = CircuitState.OPEN
        self._state_changed_at = datetime.now()
        self._half_open_attempts = 0
        self._failure_count += 1  # Increment failure count for exponential backoff
        
        # Calculate next timeout with exponential backoff and jitter
        self._current_timeout = self._calculate_timeout_with_jitter()
        
        self.stats.state_changes.append({
            "from": self.state.value,
            "to": CircuitState.OPEN.value,
            "at": self._state_changed_at.isoformat(),
            "reason": f"Failures exceeded threshold ({self.stats.consecutive_failures})",
            "timeout": f"{self._current_timeout:.2f}s",
            "failure_count": self._failure_count
        })
        
        logger.error(f"Circuit breaker '{self.name}' opened due to failures. Will retry in {self._current_timeout:.2f}s (failure #{self._failure_count})")
    
    async def _transition_to_half_open(self):
        """Transition to HALF_OPEN state"""
        previous_state = self.state
        self.state = CircuitState.HALF_OPEN
        self._state_changed_at = datetime.now()
        self._half_open_attempts = 0
        self.stats.reset_consecutive_counters()
        
        self.stats.state_changes.append({
            "from": previous_state.value,
            "to": CircuitState.HALF_OPEN.value,
            "at": self._state_changed_at.isoformat(),
            "reason": "Testing service recovery"
        })
        
        logger.info(f"Circuit breaker '{self.name}' half-open, testing recovery")
    
    async def _transition_to_closed(self):
        """Transition to CLOSED state and reset exponential backoff"""
        previous_state = self.state
        self.state = CircuitState.CLOSED
        self._state_changed_at = datetime.now()
        self._half_open_attempts = 0
        self._recent_failures.clear()
        self.stats.reset_consecutive_counters()
        
        # Reset exponential backoff counters
        self._failure_count = 0
        self._current_timeout = self.config.base_timeout_seconds
        
        self.stats.state_changes.append({
            "from": previous_state.value,
            "to": CircuitState.CLOSED.value,
            "at": self._state_changed_at.isoformat(),
            "reason": "Service recovered",
            "backoff_reset": True
        })
        
        logger.info(f"Circuit breaker '{self.name}' closed - service recovered, backoff reset to {self.config.base_timeout_seconds}s")
    
    def get_status(self) -> Dict[str, Any]:
        """Get current circuit breaker status"""
        return {
            "name": self.name,
            "state": self.state.value,
            "stats": {
                "total_calls": self.stats.total_calls,
                "successful_calls": self.stats.successful_calls,
                "failed_calls": self.stats.failed_calls,
                "rejected_calls": self.stats.rejected_calls,
                "success_rate": (
                    self.stats.successful_calls / self.stats.total_calls * 100
                    if self.stats.total_calls > 0 else 0
                ),
                "consecutive_failures": self.stats.consecutive_failures,
                "consecutive_successes": self.stats.consecutive_successes,
                "last_failure": self.stats.last_failure_time.isoformat() if self.stats.last_failure_time else None,
                "last_success": self.stats.last_success_time.isoformat() if self.stats.last_success_time else None,
            },
            "backoff": {
                "failure_count": self._failure_count,
                "current_timeout": f"{self._current_timeout:.2f}s",
                "next_retry": (self._state_changed_at + timedelta(seconds=self._current_timeout)).isoformat() if self.state == CircuitState.OPEN else None
            },
            "config": {
                "failure_threshold": self.config.failure_threshold,
                "base_timeout_seconds": self.config.base_timeout_seconds,
                "max_timeout_seconds": self.config.max_timeout_seconds,
                "timeout_multiplier": self.config.timeout_multiplier,
                "jitter_range": self.config.jitter_range,
                "failure_window_seconds": self.config.failure_window_seconds
            }
        }
    
    async def reset(self):
        """Manually reset the circuit breaker"""
        async with self._lock:
            self.state = CircuitState.CLOSED
            self._state_changed_at = datetime.now()
            self._recent_failures.clear()
            self._half_open_attempts = 0
            self.stats.reset_consecutive_counters()
            
            logger.info(f"Circuit breaker '{self.name}' manually reset")


class CircuitBreakerOpenError(Exception):
    """Exception raised when circuit breaker is open"""
    pass


def with_circuit_breaker(breaker: CircuitBreaker):
    """
    Decorator for protecting async functions with circuit breaker
    
    Usage:
        @with_circuit_breaker(my_breaker)
        async def protected_function():
            return await external_service.call()
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def wrapper(*args, **kwargs):
            async with breaker:
                return await func(*args, **kwargs)
        return wrapper
    return decorator


# Global circuit breakers for different services
llm_circuit_breaker = CircuitBreaker(
    "llm_service",
    CircuitBreakerConfig(
        failure_threshold=5,              # Open after 5 failures
        success_threshold=2,              # Close after 2 successes
        base_timeout_seconds=30.0,       # Start with 30s timeout
        max_timeout_seconds=300.0,       # Cap at 5 minutes
        timeout_multiplier=2.0,          # Double timeout each failure
        failure_window_seconds=60.0,     # Count failures in 1 minute window
        half_open_max_attempts=3         # Allow 3 test calls in half-open
    )
)