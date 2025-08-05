#!/usr/bin/env python3
"""
Sandbox Cleanup Utility
Automatically removes old portfolio sandboxes to prevent disk space issues.
"""

import os
import shutil
from pathlib import Path
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

def cleanup_old_sandboxes(hours: int = 24, dry_run: bool = False) -> tuple[int, int]:
    """
    Remove sandbox portfolios older than specified hours.
    
    Args:
        hours: Age threshold in hours (default: 24)
        dry_run: If True, only log what would be deleted
        
    Returns:
        Tuple of (portfolios_deleted, space_freed_mb)
    """
    sandbox_dir = Path("sandboxes/portfolios")
    if not sandbox_dir.exists():
        return 0, 0
    
    cutoff_time = datetime.now().timestamp() - (hours * 3600)
    portfolios_deleted = 0
    space_freed = 0
    
    for portfolio_dir in sandbox_dir.iterdir():
        if not portfolio_dir.is_dir():
            continue
            
        # Check directory age
        dir_mtime = portfolio_dir.stat().st_mtime
        if dir_mtime < cutoff_time:
            # Calculate size before deletion
            dir_size = sum(f.stat().st_size for f in portfolio_dir.rglob('*') if f.is_file())
            space_freed += dir_size
            
            if dry_run:
                logger.info(f"Would delete: {portfolio_dir.name} (age: {(datetime.now().timestamp() - dir_mtime) / 3600:.1f} hours, size: {dir_size / 1024 / 1024:.1f} MB)")
            else:
                logger.info(f"Deleting: {portfolio_dir.name}")
                shutil.rmtree(portfolio_dir)
                portfolios_deleted += 1
    
    return portfolios_deleted, space_freed // (1024 * 1024)

def cleanup_orphaned_processes():
    """
    Clean up any orphaned portfolio server processes.
    """
    sandbox_dir = Path("sandboxes/portfolios")
    if not sandbox_dir.exists():
        return
    
    for portfolio_dir in sandbox_dir.iterdir():
        pid_file = portfolio_dir / "portfolio.pid"
        if pid_file.exists():
            try:
                pid = int(pid_file.read_text().strip())
                # Check if process is still running
                os.kill(pid, 0)
            except (ProcessLookupError, ValueError):
                # Process is dead, remove PID file
                pid_file.unlink()
                logger.info(f"Removed orphaned PID file: {pid_file}")

if __name__ == "__main__":
    # Setup logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # Run cleanup
    print("🧹 Running sandbox cleanup...")
    deleted, freed = cleanup_old_sandboxes(hours=24, dry_run=False)
    print(f"✅ Deleted {deleted} old portfolios, freed {freed} MB")
    
    # Clean up orphaned processes
    cleanup_orphaned_processes()