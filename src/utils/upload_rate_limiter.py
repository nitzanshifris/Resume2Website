"""
Simple rate limiter for anonymous file uploads
Uses IP-based tracking with sliding window
"""

import time
from typing import Dict, Tuple
from dataclasses import dataclass, field
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


@dataclass
class UploadRateLimitConfig:
    """Configuration for upload rate limiting"""
    max_uploads_per_hour: int = 10  # Max uploads per IP per hour
    max_uploads_per_day: int = 20   # Max uploads per IP per day
    max_file_size_mb: int = 10      # Max file size in MB
    cleanup_interval: int = 3600     # Cleanup old records every hour


@dataclass 
class IPUploadState:
    """Track upload state for an IP address"""
    ip_address: str
    uploads_hour: list = field(default_factory=list)  # Timestamps within hour
    uploads_day: list = field(default_factory=list)   # Timestamps within day
    last_activity: float = field(default_factory=time.time)
    
    def cleanup_old(self):
        """Remove old timestamps outside windows"""
        now = time.time()
        hour_cutoff = now - 3600  # 1 hour ago
        day_cutoff = now - 86400  # 24 hours ago
        
        self.uploads_hour = [t for t in self.uploads_hour if t > hour_cutoff]
        self.uploads_day = [t for t in self.uploads_day if t > day_cutoff]
    
    def can_upload(self, config: UploadRateLimitConfig) -> Tuple[bool, str]:
        """Check if IP can upload"""
        self.cleanup_old()
        
        # Check hourly limit
        if len(self.uploads_hour) >= config.max_uploads_per_hour:
            return False, f"Upload limit exceeded: {config.max_uploads_per_hour} files per hour"
        
        # Check daily limit  
        if len(self.uploads_day) >= config.max_uploads_per_day:
            return False, f"Upload limit exceeded: {config.max_uploads_per_day} files per day"
            
        return True, "Upload allowed"
    
    def record_upload(self):
        """Record a successful upload"""
        now = time.time()
        self.uploads_hour.append(now)
        self.uploads_day.append(now)
        self.last_activity = now


class UploadRateLimiter:
    """Rate limiter for anonymous uploads"""
    
    def __init__(self, config: UploadRateLimitConfig = None):
        self.config = config or UploadRateLimitConfig()
        self.ip_states: Dict[str, IPUploadState] = {}
        self.last_cleanup = time.time()
    
    def _cleanup_if_needed(self):
        """Cleanup old IP states periodically"""
        now = time.time()
        if now - self.last_cleanup > self.config.cleanup_interval:
            cutoff = now - 86400  # Remove IPs inactive for 24 hours
            old_ips = [
                ip for ip, state in self.ip_states.items()
                if state.last_activity < cutoff
            ]
            for ip in old_ips:
                del self.ip_states[ip]
            
            if old_ips:
                logger.info(f"Cleaned up {len(old_ips)} old IP states")
            
            self.last_cleanup = now
    
    def check_upload_allowed(self, ip_address: str) -> Tuple[bool, str]:
        """Check if IP can upload a file"""
        self._cleanup_if_needed()
        
        # Get or create IP state
        if ip_address not in self.ip_states:
            self.ip_states[ip_address] = IPUploadState(ip_address)
        
        state = self.ip_states[ip_address]
        return state.can_upload(self.config)
    
    def record_upload(self, ip_address: str):
        """Record successful upload for IP"""
        if ip_address in self.ip_states:
            self.ip_states[ip_address].record_upload()
            logger.info(f"Upload recorded for IP {ip_address}")
    
    def get_ip_status(self, ip_address: str) -> Dict:
        """Get current rate limit status for IP"""
        if ip_address not in self.ip_states:
            return {
                "ip": ip_address,
                "uploads_this_hour": 0,
                "uploads_today": 0,
                "max_per_hour": self.config.max_uploads_per_hour,
                "max_per_day": self.config.max_uploads_per_day
            }
        
        state = self.ip_states[ip_address]
        state.cleanup_old()
        
        return {
            "ip": ip_address,
            "uploads_this_hour": len(state.uploads_hour),
            "uploads_today": len(state.uploads_day),
            "max_per_hour": self.config.max_uploads_per_hour,
            "max_per_day": self.config.max_uploads_per_day,
            "can_upload": state.can_upload(self.config)[0]
        }


# Global instance
upload_rate_limiter = UploadRateLimiter()