"""
Live Readable Logging System
Provides structured, human-readable logs with visual indicators
"""
import logging
import sys
from datetime import datetime
from typing import Any, Dict, Optional, List
from enum import Enum
import json
from pathlib import Path


class LogLevel(Enum):
    """Log levels with visual indicators."""
    STEP = "🚀"
    PROGRESS = "⏳"
    SUCCESS = "✅"
    WARNING = "⚠️"
    ERROR = "❌"
    INFO = "ℹ️"
    DEBUG = "🔍"


class LiveLogger:
    """Structured logging with live readable output."""
    
    def __init__(self, name: str, log_to_file: bool = True):
        self.name = name
        self.logger = logging.getLogger(name)
        self.logger.setLevel(logging.DEBUG)
        
        # Remove existing handlers
        self.logger.handlers = []
        
        # Console handler with readable format
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(logging.INFO)
        
        # Custom formatter
        console_formatter = logging.Formatter(
            '%(asctime)s | %(name)-20s | %(message)s',
            datefmt='%H:%M:%S'
        )
        console_handler.setFormatter(console_formatter)
        self.logger.addHandler(console_handler)
        
        # File handler for detailed logs
        if log_to_file:
            log_dir = Path("logs")
            log_dir.mkdir(exist_ok=True)
            
            file_handler = logging.FileHandler(
                log_dir / f"{name}_{datetime.now().strftime('%Y%m%d')}.log"
            )
            file_handler.setLevel(logging.DEBUG)
            
            file_formatter = logging.Formatter(
                '%(asctime)s | %(name)s | %(levelname)s | %(message)s',
                datefmt='%Y-%m-%d %H:%M:%S'
            )
            file_handler.setFormatter(file_formatter)
            self.logger.addHandler(file_handler)
        
        # Track timing for steps
        self._step_start_times: Dict[str, datetime] = {}
    
    def _format_message(self, level: LogLevel, message: str, details: Optional[Dict[str, Any]] = None) -> str:
        """Format message with visual indicators and details."""
        formatted = f"{level.value} {message}"
        
        if details:
            for key, value in details.items():
                # Format value based on type
                if isinstance(value, (list, dict)):
                    value_str = json.dumps(value, indent=2)
                    # Indent each line
                    value_str = '\n'.join(f"      {line}" for line in value_str.split('\n'))
                    formatted += f"\n   └─ {key}:\n{value_str}"
                else:
                    formatted += f"\n   └─ {key}: {value}"
        
        return formatted
    
    def step(self, step_name: str, details: Optional[Dict[str, Any]] = None):
        """Log a major step in the process."""
        # Track timing
        self._step_start_times[step_name] = datetime.now()
        
        message = self._format_message(LogLevel.STEP, f"STEP: {step_name}", details)
        self.logger.info(message)
    
    def step_complete(self, step_name: str, details: Optional[Dict[str, Any]] = None):
        """Mark a step as complete with timing."""
        if step_name in self._step_start_times:
            duration = (datetime.now() - self._step_start_times[step_name]).total_seconds()
            if details is None:
                details = {}
            details['duration'] = f"{duration:.2f}s"
            del self._step_start_times[step_name]
        
        message = self._format_message(LogLevel.SUCCESS, f"COMPLETED: {step_name}", details)
        self.logger.info(message)
    
    def progress(self, task: str, current: int, total: int, extra: Optional[str] = None):
        """Log progress for long-running tasks."""
        percentage = (current / total) * 100 if total > 0 else 0
        bar_length = 20
        filled = int(percentage / 100 * bar_length)
        bar = '█' * filled + '░' * (bar_length - filled)
        
        progress_str = f"{task}: [{bar}] {percentage:.1f}% ({current}/{total})"
        if extra:
            progress_str += f" - {extra}"
        
        message = self._format_message(LogLevel.PROGRESS, progress_str)
        self.logger.info(message)
    
    def success(self, message: str, details: Optional[Dict[str, Any]] = None):
        """Log successful completion."""
        formatted = self._format_message(LogLevel.SUCCESS, f"SUCCESS: {message}", details)
        self.logger.info(formatted)
    
    def info(self, message: str, details: Optional[Dict[str, Any]] = None):
        """Log informational message."""
        formatted = self._format_message(LogLevel.INFO, message, details)
        self.logger.info(formatted)
    
    def warning(self, message: str, details: Optional[Dict[str, Any]] = None):
        """Log warnings."""
        formatted = self._format_message(LogLevel.WARNING, f"WARNING: {message}", details)
        self.logger.warning(formatted)
    
    def error(self, message: str, error: Optional[Exception] = None, details: Optional[Dict[str, Any]] = None):
        """Log errors with details."""
        if details is None:
            details = {}
        
        if error:
            details['error_type'] = type(error).__name__
            details['error_message'] = str(error)
        
        formatted = self._format_message(LogLevel.ERROR, f"ERROR: {message}", details)
        self.logger.error(formatted)
    
    def debug(self, message: str, details: Optional[Dict[str, Any]] = None):
        """Log debug information."""
        formatted = self._format_message(LogLevel.DEBUG, f"DEBUG: {message}", details)
        self.logger.debug(formatted)
    
    def section(self, title: str):
        """Log a section separator."""
        separator = "=" * 60
        self.logger.info(f"\n{separator}")
        self.logger.info(f"    {title}")
        self.logger.info(f"{separator}\n")
    
    def tree(self, title: str, items: List[str], indent: int = 0):
        """Log items in a tree structure."""
        indent_str = "  " * indent
        self.logger.info(f"{indent_str}{title}")
        
        for i, item in enumerate(items):
            is_last = i == len(items) - 1
            prefix = "└─" if is_last else "├─"
            self.logger.info(f"{indent_str}{prefix} {item}")
    
    def table(self, headers: List[str], rows: List[List[str]]):
        """Log data in a table format."""
        # Calculate column widths
        col_widths = [len(h) for h in headers]
        for row in rows:
            for i, cell in enumerate(row):
                col_widths[i] = max(col_widths[i], len(str(cell)))
        
        # Create header
        header_line = " | ".join(h.ljust(w) for h, w in zip(headers, col_widths))
        separator = "-+-".join("-" * w for w in col_widths)
        
        self.logger.info(header_line)
        self.logger.info(separator)
        
        # Create rows
        for row in rows:
            row_line = " | ".join(str(cell).ljust(w) for cell, w in zip(row, col_widths))
            self.logger.info(row_line)


# Convenience function to get logger
def get_logger(name: str) -> LiveLogger:
    """Get a LiveLogger instance for the given name."""
    return LiveLogger(name)


# Example usage
if __name__ == "__main__":
    # Demo the logger
    logger = LiveLogger("demo")
    
    logger.section("Starting Demo Process")
    
    logger.step("Initializing system", {
        "version": "1.0.0",
        "environment": "development"
    })
    
    # Simulate progress
    import time
    for i in range(11):
        logger.progress("Processing files", i, 10, f"file_{i}.txt")
        time.sleep(0.1)
    
    logger.step_complete("Initializing system")
    
    logger.tree("Project Structure", [
        "src/",
        "tests/",
        "docs/"
    ])
    
    logger.table(
        ["Component", "Status", "Time"],
        [
            ["Database", "Connected", "0.5s"],
            ["API", "Ready", "1.2s"],
            ["Cache", "Initialized", "0.3s"]
        ]
    )
    
    logger.success("Demo completed successfully!")