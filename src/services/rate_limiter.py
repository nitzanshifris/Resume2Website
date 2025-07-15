"""
Rate Limiting Service for SSE Connections
Implements token bucket and sliding window algorithms
"""

import time
import asyncio
from typing import Dict, Optional, Tuple
from dataclasses import dataclass, field
from datetime import datetime, timedelta
import logging
from fastapi import HTTPException

logger = logging.getLogger(__name__)


@dataclass
class RateLimitConfig:
    """Rate limiting configuration"""
    max_connections_per_user: int = 5
    max_connections_global: int = 100
    requests_per_minute: int = 60
    requests_per_hour: int = 1000
    burst_capacity: int = 10
    cooldown_period: int = 300  # seconds
    
    # SSE-specific limits
    max_events_per_second: int = 10
    max_event_queue_size: int = 100
    connection_timeout: int = 3600  # 1 hour


@dataclass
class TokenBucket:
    """Token bucket for rate limiting"""
    capacity: int
    tokens: float
    refill_rate: float  # tokens per second
    last_refill: float = field(default_factory=time.time)
    
    def consume(self, tokens: int = 1) -> bool:
        """Try to consume tokens from bucket"""
        now = time.time()
        time_passed = now - self.last_refill
        
        # Refill tokens
        self.tokens = min(self.capacity, self.tokens + time_passed * self.refill_rate)
        self.last_refill = now
        
        if self.tokens >= tokens:
            self.tokens -= tokens
            return True
        return False
    
    def remaining_tokens(self) -> int:
        """Get remaining tokens without consuming"""
        now = time.time()
        time_passed = now - self.last_refill
        current_tokens = min(self.capacity, self.tokens + time_passed * self.refill_rate)
        return int(current_tokens)


@dataclass
class SlidingWindow:
    """Sliding window counter for time-based limits"""
    window_size: int  # seconds
    max_requests: int
    requests: list = field(default_factory=list)
    
    def add_request(self) -> bool:
        """Add request to window, return True if within limit"""
        now = time.time()
        
        # Remove old requests outside the window
        cutoff = now - self.window_size
        self.requests = [req_time for req_time in self.requests if req_time > cutoff]
        
        # Check if we're within the limit
        if len(self.requests) < self.max_requests:
            self.requests.append(now)
            return True
        return False
    
    def current_count(self) -> int:
        """Get current request count in window"""
        now = time.time()
        cutoff = now - self.window_size
        self.requests = [req_time for req_time in self.requests if req_time > cutoff]
        return len(self.requests)


@dataclass
class UserRateLimitState:
    """Rate limiting state for a user"""
    user_id: str
    connection_bucket: TokenBucket
    request_window_minute: SlidingWindow
    request_window_hour: SlidingWindow
    event_bucket: TokenBucket
    active_connections: int = 0
    last_activity: float = field(default_factory=time.time)
    is_blocked: bool = False
    block_until: float = 0
    violation_count: int = 0


class SSERateLimiter:
    """Rate limiter for SSE connections and events"""
    
    def __init__(self, config: Optional[RateLimitConfig] = None):
        self.config = config or RateLimitConfig()
        self.user_states: Dict[str, UserRateLimitState] = {}
        self.global_connections = 0
        self.cleanup_task: Optional[asyncio.Task] = None
        
    async def start_cleanup_task(self):
        """Start background task to clean up old user states"""
        if self.cleanup_task and not self.cleanup_task.done():
            return
            
        async def cleanup_loop():
            while True:
                await asyncio.sleep(300)  # Clean up every 5 minutes
                self._cleanup_old_states()
                
        self.cleanup_task = asyncio.create_task(cleanup_loop())
        logger.info("Rate limiter cleanup task started")
        
    def _cleanup_old_states(self):
        """Remove old inactive user states"""
        now = time.time()
        cutoff = now - 3600  # Remove states older than 1 hour
        
        old_users = [
            user_id for user_id, state in self.user_states.items()
            if state.last_activity < cutoff and state.active_connections == 0
        ]
        
        for user_id in old_users:
            del self.user_states[user_id]
            
        if old_users:
            logger.info(f"Cleaned up {len(old_users)} old rate limit states")
    
    def _get_user_state(self, user_id: str) -> UserRateLimitState:
        """Get or create user rate limit state"""
        if user_id not in self.user_states:
            self.user_states[user_id] = UserRateLimitState(
                user_id=user_id,
                connection_bucket=TokenBucket(
                    capacity=self.config.max_connections_per_user,
                    tokens=self.config.max_connections_per_user,
                    refill_rate=1/60  # 1 connection per minute refill
                ),
                request_window_minute=SlidingWindow(60, self.config.requests_per_minute),
                request_window_hour=SlidingWindow(3600, self.config.requests_per_hour),
                event_bucket=TokenBucket(
                    capacity=self.config.burst_capacity,
                    tokens=self.config.burst_capacity,
                    refill_rate=self.config.max_events_per_second
                )
            )
        
        state = self.user_states[user_id]
        state.last_activity = time.time()
        return state
    
    def check_connection_limit(self, user_id: str) -> Tuple[bool, str]:
        """Check if user can create new SSE connection"""
        # Check global connection limit
        if self.global_connections >= self.config.max_connections_global:
            return False, f"Global connection limit reached ({self.config.max_connections_global})"
        
        state = self._get_user_state(user_id)
        
        # Check if user is blocked
        if state.is_blocked and time.time() < state.block_until:
            remaining = int(state.block_until - time.time())
            return False, f"User blocked for {remaining} more seconds"
        
        # Reset block if expired
        if state.is_blocked and time.time() >= state.block_until:
            state.is_blocked = False
            state.violation_count = 0
        
        # Check user connection limit
        if state.active_connections >= self.config.max_connections_per_user:
            return False, f"User connection limit reached ({self.config.max_connections_per_user})"
        
        # Check connection rate limit using token bucket
        if not state.connection_bucket.consume(1):
            return False, "Connection rate limit exceeded - too many new connections"
        
        return True, "Connection allowed"
    
    def add_connection(self, user_id: str) -> bool:
        """Add new connection for user"""
        allowed, reason = self.check_connection_limit(user_id)
        if not allowed:
            logger.warning(f"Connection denied for user {user_id}: {reason}")
            return False
        
        state = self._get_user_state(user_id)
        state.active_connections += 1
        self.global_connections += 1
        
        logger.info(f"SSE connection added for user {user_id} (user: {state.active_connections}, global: {self.global_connections})")
        return True
    
    def remove_connection(self, user_id: str):
        """Remove connection for user"""
        if user_id in self.user_states:
            state = self.user_states[user_id]
            state.active_connections = max(0, state.active_connections - 1)
            
        self.global_connections = max(0, self.global_connections - 1)
        logger.info(f"SSE connection removed for user {user_id} (global: {self.global_connections})")
    
    def check_request_limit(self, user_id: str) -> Tuple[bool, str]:
        """Check if user can make new request"""
        state = self._get_user_state(user_id)
        
        # Check if user is blocked
        if state.is_blocked and time.time() < state.block_until:
            remaining = int(state.block_until - time.time())
            return False, f"User blocked for {remaining} more seconds"
        
        # Check minute window
        if not state.request_window_minute.add_request():
            self._record_violation(state, "requests_per_minute")
            current_count = state.request_window_minute.current_count()
            return False, f"Request rate limit exceeded: {current_count}/{self.config.requests_per_minute} per minute"
        
        # Check hour window
        if not state.request_window_hour.add_request():
            self._record_violation(state, "requests_per_hour")
            current_count = state.request_window_hour.current_count()
            return False, f"Request rate limit exceeded: {current_count}/{self.config.requests_per_hour} per hour"
        
        return True, "Request allowed"
    
    def check_event_limit(self, user_id: str, event_count: int = 1) -> Tuple[bool, str]:
        """Check if user can emit SSE events"""
        state = self._get_user_state(user_id)
        
        if not state.event_bucket.consume(event_count):
            remaining = state.event_bucket.remaining_tokens()
            return False, f"Event rate limit exceeded. {remaining} events remaining in bucket"
        
        return True, "Events allowed"
    
    def _record_violation(self, state: UserRateLimitState, violation_type: str):
        """Record rate limit violation and potentially block user"""
        state.violation_count += 1
        logger.warning(f"Rate limit violation for user {state.user_id}: {violation_type} (violation #{state.violation_count})")
        
        # Block user after multiple violations
        if state.violation_count >= 3:
            state.is_blocked = True
            state.block_until = time.time() + self.config.cooldown_period
            logger.warning(f"User {state.user_id} blocked for {self.config.cooldown_period} seconds")
    
    def get_user_limits_info(self, user_id: str) -> Dict:
        """Get current rate limit status for user"""
        state = self._get_user_state(user_id)
        
        return {
            "user_id": user_id,
            "active_connections": state.active_connections,
            "max_connections": self.config.max_connections_per_user,
            "connection_tokens_remaining": state.connection_bucket.remaining_tokens(),
            "requests_this_minute": state.request_window_minute.current_count(),
            "requests_this_hour": state.request_window_hour.current_count(),
            "event_tokens_remaining": state.event_bucket.remaining_tokens(),
            "is_blocked": state.is_blocked,
            "block_until": state.block_until if state.is_blocked else None,
            "violation_count": state.violation_count,
            "global_connections": self.global_connections,
            "global_max_connections": self.config.max_connections_global
        }
    
    def get_global_stats(self) -> Dict:
        """Get global rate limiting statistics"""
        active_users = len([s for s in self.user_states.values() if s.active_connections > 0])
        blocked_users = len([s for s in self.user_states.values() if s.is_blocked])
        
        return {
            "global_connections": self.global_connections,
            "max_global_connections": self.config.max_connections_global,
            "active_users": active_users,
            "total_tracked_users": len(self.user_states),
            "blocked_users": blocked_users,
            "connection_utilization": (self.global_connections / self.config.max_connections_global) * 100
        }


# Global rate limiter instance
rate_limiter = SSERateLimiter()


# Core rate limiting functions (to avoid circular imports)
def apply_rate_limits(user_id: str) -> Tuple[bool, str]:
    """Apply rate limits for a user"""
    # Check request rate limit
    allowed, reason = rate_limiter.check_request_limit(user_id)
    if not allowed:
        return False, reason
    
    # Check connection limit
    allowed, reason = rate_limiter.check_connection_limit(user_id)
    if not allowed:
        return False, reason
    
    return True, "Rate limits passed"


async def check_event_rate_limit(user_id: str, event_count: int = 1):
    """Check rate limit for SSE events"""
    allowed, reason = rate_limiter.check_event_limit(user_id, event_count)
    if not allowed:
        logger.warning(f"Event rate limit exceeded for user {user_id}: {reason}")
        return False
    return True