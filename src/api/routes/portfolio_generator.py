"""
Portfolio Generation API - Converts CV data to live portfolio websites
"""
from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
from typing import Dict, Any, Optional
import logging
import json
import uuid
from pathlib import Path
import shutil
import subprocess
import os
import platform
import signal
import socket
import time
import threading
import requests
import re
from datetime import datetime, timedelta
from typing import Dict, Optional
import asyncio

# Import configuration from project root
try:
    import config
except ImportError:
    # If running as a module, try relative import
    from .... import config

# Import authentication dependency
from src.api.routes.auth import get_current_user, get_current_user_optional
from src.api.db import get_user_cv_uploads, update_user_portfolio
from src.services.vercel_deployer import VercelDeployer

logger = logging.getLogger(__name__)

# Global dictionary to track portfolio processes
PORTFOLIO_PROCESSES = {}

# Configuration for portfolio management
PORTFOLIO_MAX_AGE_HOURS = 24  # Portfolios older than this will be cleaned up
PORTFOLIO_CLEANUP_INTERVAL = 300  # Check every 5 minutes
MAX_ACTIVE_PORTFOLIOS = 20  # Maximum number of active portfolios

# Portfolio metrics tracking
class PortfolioMetrics:
    def __init__(self):
        self.total_created = 0
        self.total_failed = 0
        self.active_count = 0
        self.cleanup_count = 0
        self.startup_times = []
        self.last_cleanup = datetime.now()
    
    def record_creation(self, portfolio_id: str, startup_time: float = None):
        self.total_created += 1
        self.active_count += 1
        if startup_time:
            self.startup_times.append(startup_time)
            # Keep only last 100 startup times
            if len(self.startup_times) > 100:
                self.startup_times = self.startup_times[-100:]
    
    def record_failure(self):
        self.total_failed += 1
    
    def record_cleanup(self, portfolio_id: str):
        self.cleanup_count += 1
        self.active_count = max(0, self.active_count - 1)
    
    def get_stats(self):
        avg_startup = sum(self.startup_times) / len(self.startup_times) if self.startup_times else 0
        return {
            "active_portfolios": self.active_count,
            "total_created": self.total_created,
            "total_failed": self.total_failed,
            "total_cleaned": self.cleanup_count,
            "average_startup_ms": round(avg_startup * 1000, 2),
            "last_cleanup": self.last_cleanup.isoformat(),
            "uptime_hours": (datetime.now() - self.last_cleanup).total_seconds() / 3600
        }

# Initialize metrics
portfolio_metrics = PortfolioMetrics()

# Cleanup task
async def portfolio_cleanup_task():
    """Background task to clean up old portfolios"""
    while True:
        try:
            logger.info("🧹 Running portfolio cleanup task")
            now = datetime.now()
            cleaned_count = 0
            
            for portfolio_id, info in list(PORTFOLIO_PROCESSES.items()):
                age = now - info['created_at']
                
                if age > timedelta(hours=PORTFOLIO_MAX_AGE_HOURS):
                    logger.info(f"🧹 Cleaning up old portfolio: {portfolio_id} (age: {age})")
                    
                    # Stop the server
                    try:
                        process = info.get('process')
                        if process and process.poll() is None:
                            process.terminate()
                            # Give it time to terminate gracefully
                            time.sleep(2)
                            if process.poll() is None:
                                process.kill()
                    except Exception as e:
                        logger.error(f"Error stopping portfolio {portfolio_id}: {e}")
                    
                    # Clean up the directory
                    try:
                        sandbox_path = Path(info.get('sandbox_path', ''))
                        if sandbox_path.exists():
                            shutil.rmtree(sandbox_path, ignore_errors=True)
                    except Exception as e:
                        logger.error(f"Error cleaning directory for {portfolio_id}: {e}")
                    
                    # Remove from tracking
                    del PORTFOLIO_PROCESSES[portfolio_id]
                    portfolio_metrics.record_cleanup(portfolio_id)
                    cleaned_count += 1
            
            portfolio_metrics.last_cleanup = datetime.now()
            if cleaned_count > 0:
                logger.info(f"✅ Cleaned up {cleaned_count} old portfolios")
                
        except Exception as e:
            logger.error(f"❌ Cleanup task error: {e}")
        
        # Wait before next cleanup
        await asyncio.sleep(PORTFOLIO_CLEANUP_INTERVAL)

# Start cleanup task on first request (will be initialized once)
cleanup_task_started = False

def ensure_cleanup_task():
    global cleanup_task_started
    if not cleanup_task_started:
        cleanup_task_started = True
        asyncio.create_task(portfolio_cleanup_task())
        logger.info("🚀 Started portfolio cleanup task")

def find_available_port(start_port: int = 4000, max_port: int = 5000) -> int:
    """
    Find an available port in the specified range.
    
    Args:
        start_port: Starting port number (default: 4000)
        max_port: Maximum port number (default: 5000)
        
    Returns:
        Available port number
        
    Raises:
        RuntimeError: If no available port is found
    """
    for port in range(start_port, max_port):
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        try:
            sock.bind(('', port))
            sock.close()
            return port
        except OSError:
            continue
    raise RuntimeError(f"No available port found between {start_port} and {max_port}")

def wait_for_server(port: int, timeout: int = 30) -> bool:
    """
    Wait for a server to start on the specified port.
    
    Args:
        port: Port number to check
        timeout: Maximum time to wait in seconds (default: 30)
        
    Returns:
        True if server is ready, False if timeout
    """
    start_time = time.time()
    
    while time.time() - start_time < timeout:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        try:
            result = sock.connect_ex(('localhost', port))
            sock.close()
            if result == 0:
                return True  # Returns immediately when server is ready!
        except:
            pass
        time.sleep(0.5)  # Check every 0.5 seconds for faster response
    
    return False

def cleanup_zombie_processes():
    """
    Professional cleanup: Kill zombie processes that might be using our port range
    """
    try:
        import subprocess
        # Kill any node processes that might be using ports 4000-5000
        result = subprocess.run(
            ["lsof", "-t", "-i:4000-5000"],
            capture_output=True,
            text=True
        )
        
        if result.returncode == 0 and result.stdout.strip():
            pids = result.stdout.strip().split('\n')
            for pid in pids:
                if pid.strip():
                    try:
                        subprocess.run(["kill", "-9", pid.strip()], check=False)
                        logger.info(f"🧹 Cleaned up zombie process PID: {pid.strip()}")
                    except Exception:
                        pass  # Ignore cleanup errors
    except Exception as e:
        logger.warning(f"⚠️ Cleanup failed (non-critical): {e}")

class GeneratePortfolioRequest(BaseModel):
    template: Optional[str] = None

class NextJSServerManager:
    """Enhanced Next.js server manager with proper isolation and health checking"""
    
    def __init__(self, base_port: int = 4000):
        self.base_port = base_port
        self.servers: Dict[str, Dict] = {}
        self.logger = logging.getLogger(__name__)
        
    def create_server_instance(self, 
                             portfolio_id: str, 
                             project_path: str, 
                             port: Optional[int] = None) -> Dict:
        """Create and start a new Next.js server instance"""
        
        if port is None:
            port = self.base_port + len(self.servers)
            
        # Ensure port is available
        while self._is_port_in_use(port):
            port += 1
            
        server_config = {
            'portfolio_id': portfolio_id,
            'project_path': project_path,
            'port': port,
            'process': None,
            'status': 'starting',
            'health_url': f'http://localhost:{port}',
            'startup_time': time.time()
        }
        
        # Start the server
        if self._start_server(server_config):
            self.servers[portfolio_id] = server_config
            return server_config
        else:
            raise Exception(f"Failed to start server for portfolio {portfolio_id}")
    
    def _start_server(self, config: Dict) -> bool:
        """Start Next.js server with proper isolation"""
        
        try:
            # Set up isolated environment
            env = self._create_isolated_environment(
                config['portfolio_id'], 
                config['port'], 
                config['project_path']
            )
            
            # Choose appropriate package manager
            cmd = self._get_dev_command(config['project_path'])
            
            self.logger.info(f"🚀 Starting server with command: {' '.join(cmd)} on port {config['port']}")
            
            # Start process with proper configuration
            config['process'] = subprocess.Popen(
                cmd,
                cwd=config['project_path'],
                env=env,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                stdin=subprocess.DEVNULL,
                # Cross-platform process group handling
                preexec_fn=None if platform.system() == 'Windows' else os.setsid,
                creationflags=subprocess.CREATE_NEW_PROCESS_GROUP if platform.system() == 'Windows' else 0
            )
            
            # Save PID for tracking
            pid_file = Path(config['project_path']) / "portfolio.pid"
            pid_file.write_text(str(config['process'].pid))
            
            self.logger.info(f"✅ Process started with PID: {config['process'].pid}")
            
            # Monitor process output in background
            self._monitor_server_output(config)
            
            # Wait for server to be ready
            return self._wait_for_server_ready(config)
            
        except Exception as e:
            self.logger.error(f"❌ Error starting server: {e}")
            config['status'] = 'failed'
            return False
    
    def _create_isolated_environment(self, portfolio_id: str, port: int, project_path: str) -> Dict[str, str]:
        """Create isolated environment variables for Next.js instance"""
        
        base_env = os.environ.copy()
        
        # Remove conflicting environment variables
        conflicting_vars = [
            'NEXT_PUBLIC_VERCEL_URL',
            'NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA',
            'VERCEL_URL'
        ]
        
        for var in conflicting_vars:
            base_env.pop(var, None)
        
        # Set isolated environment
        isolated_env = {
            **base_env,
            'PORT': str(port),
            'NODE_ENV': 'development',
            'NEXT_TELEMETRY_DISABLED': '1',
            'FORCE_COLOR': '0',
            'NODE_OPTIONS': '--max-old-space-size=2048',
            
            # Unique identifiers
            'PORTFOLIO_ID': portfolio_id,
            'INSTANCE_ID': f"portfolio-{portfolio_id}-{port}",
        }
        
        return isolated_env
    
    def _get_dev_command(self, project_path: str) -> list:
        """Get appropriate development command - use direct Next.js for reliability"""
        project_path = Path(project_path)
        
        # Validate that project_path is within expected directory
        try:
            project_path = project_path.resolve()
            # Check both possible locations for portfolios
            sandboxes_dir = (Path(config.SANDBOXES_DIR) / "portfolios").resolve()
            legacy_dir = PORTFOLIOS_DIR.resolve()
            
            if not (str(project_path).startswith(str(sandboxes_dir)) or 
                    str(project_path).startswith(str(legacy_dir))):
                raise ValueError("Invalid project path")
        except Exception:
            raise ValueError("Invalid project path")
        
        # Try to use next directly from node_modules for more reliability
        next_bin = project_path / "node_modules" / ".bin" / "next"
        if next_bin.exists():
            # Return as list to ensure shell=False works properly
            return [str(next_bin.resolve()), 'dev']
        
        # Fallback to package manager commands (all safe, no user input)
        if (project_path / 'pnpm-lock.yaml').exists() and shutil.which('pnpm'):
            return ['pnpm', 'run', 'dev']
        elif (project_path / 'yarn.lock').exists() and shutil.which('yarn'):
            return ['yarn', 'dev']
        else:
            return ['npm', 'run', 'dev']
    
    def _monitor_server_output(self, config: Dict):
        """Monitor server output for debugging"""
        process = config['process']
        
        def log_output(stream, prefix):
            try:
                for line in iter(stream.readline, b''):
                    if line:
                        line_text = line.decode().strip()
                        if line_text:  # Only log non-empty lines
                            self.logger.info(f"[{config['portfolio_id']}:{prefix}] {line_text}")
            except Exception as e:
                self.logger.warning(f"Error monitoring {prefix} output: {e}")
        
        # Start output monitoring threads
        threading.Thread(target=log_output, args=(process.stdout, 'OUT'), daemon=True).start()
        threading.Thread(target=log_output, args=(process.stderr, 'ERR'), daemon=True).start()
    
    def _wait_for_server_ready(self, config: Dict, timeout: int = 60) -> bool:
        """Wait for server to be ready with health checking"""
        start_time = time.time()
        
        self.logger.info(f"⏳ Waiting for server to be ready on {config['health_url']}...")
        
        while time.time() - start_time < timeout:
            # Check if process is still alive
            if config['process'] and config['process'].poll() is not None:
                config['status'] = 'failed'
                self.logger.error(f"❌ Server process died for {config['portfolio_id']}")
                return False
            
            # Perform health check
            if self._health_check(config):
                config['status'] = 'running'
                elapsed = time.time() - start_time
                self.logger.info(f"✅ Server ready for {config['portfolio_id']} on port {config['port']} (took {elapsed:.1f}s)")
                return True
                
            time.sleep(2)
        
        config['status'] = 'timeout'
        self.logger.error(f"⏰ Server startup timeout for {config['portfolio_id']} after {timeout}s")
        return False
    
    def _health_check(self, config: Dict) -> bool:
        """Perform health check on the server"""
        try:
            response = requests.get(
                config['health_url'],
                timeout=5,
                headers={'User-Agent': 'PortfolioManager/1.0'}
            )
            return response.status_code == 200
        except requests.RequestException:
            return False
    
    def _is_port_in_use(self, port: int) -> bool:
        """Check if port is already in use"""
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind(('localhost', port))
                return False
            except OSError:
                return True
    
    def stop_server(self, portfolio_id: str) -> bool:
        """Stop a specific server instance"""
        if portfolio_id not in self.servers:
            return False
            
        config = self.servers[portfolio_id]
        process = config.get('process')
        
        if process and process.poll() is None:
            try:
                # Cross-platform process termination
                if platform.system() == 'Windows':
                    process.terminate()
                else:
                    # Kill entire process group
                    os.killpg(os.getpgid(process.pid), signal.SIGTERM)
                
                # Wait for graceful shutdown
                try:
                    process.wait(timeout=10)
                except subprocess.TimeoutExpired:
                    # Force kill if necessary
                    if platform.system() == 'Windows':
                        process.kill()
                    else:
                        os.killpg(os.getpgid(process.pid), signal.SIGKILL)
                
                config['status'] = 'stopped'
                self.logger.info(f"🛑 Stopped server for {portfolio_id}")
                return True
                
            except Exception as e:
                self.logger.error(f"❌ Error stopping server {portfolio_id}: {e}")
                return False
        
        return True
    
    def get_server_status(self, portfolio_id: str) -> Optional[Dict]:
        """Get status information for a server"""
        if portfolio_id in self.servers:
            config = self.servers[portfolio_id].copy()
            # Remove process object for serialization
            config.pop('process', None)
            return config
        return None

# Global server manager instance
server_manager = NextJSServerManager(base_port=4000)

# Create router
router = APIRouter(prefix="/portfolio", tags=["portfolio"])

# Base directories
BASE_DIR = Path(__file__).parent.parent.parent.parent
TEMPLATES_DIR = BASE_DIR / "src" / "templates"
PORTFOLIOS_DIR = BASE_DIR / "data" / "generated_portfolios"

# Available templates
AVAILABLE_TEMPLATES = {
    "v0_template_v1.5": "src/templates/v0_template_v1.5",
    "v0_template_v2.1": "src/templates/v0_template_v2.1"
}
DEFAULT_TEMPLATE = "v0_template_v1.5"

# Ensure portfolios directory exists
PORTFOLIOS_DIR.mkdir(parents=True, exist_ok=True)

@router.post("/generate/{job_id}")
async def generate_portfolio(
    job_id: str,
    request: GeneratePortfolioRequest = GeneratePortfolioRequest(),
    current_user_id: Optional[str] = Depends(get_current_user_optional)
):
    """
    Generate a portfolio website from CV data
    
    Args:
        job_id: The CV job ID to generate portfolio from
        current_user_id: Optional user ID if authenticated
        
    Returns:
        Portfolio generation result with URL and status
    """
    try:
        # Ensure cleanup task is running
        ensure_cleanup_task()
        
        # Check if we've reached the maximum number of active portfolios
        active_count = len([p for p in PORTFOLIO_PROCESSES.values() if p.get('status') != 'stopped'])
        if active_count >= MAX_ACTIVE_PORTFOLIOS:
            logger.warning(f"⚠️ Maximum active portfolios reached ({MAX_ACTIVE_PORTFOLIOS})")
            raise HTTPException(
                status_code=503,
                detail=f"Server at capacity. Maximum {MAX_ACTIVE_PORTFOLIOS} active portfolios. Please try again later."
            )
        
        # Track start time for metrics
        start_time = time.time()
        
        # Professional cleanup: Kill any zombie processes using ports in our range
        cleanup_zombie_processes()
        
        # Generate anonymous user ID if not authenticated
        if not current_user_id:
            current_user_id = f"anonymous_{uuid.uuid4().hex[:12]}"
            logger.info(f"🚀 Starting portfolio generation for job_id: {job_id}")
        else:
            logger.info(f"🚀 Starting portfolio generation for job_id: {job_id}, user: {current_user_id}")
        
        # === 1. GET CV DATA ===
        # For anonymous users, we need to find the CV data
        # Check if the CV extraction was completed
        import glob
        import json
        from pathlib import Path
        BASE_DIR = Path(__file__).parent.parent.parent.parent
        
        # Try to find the file with this job_id
        file_pattern = str(BASE_DIR / "data" / "uploads" / "**" / f"{job_id}*")
        matching_files = glob.glob(file_pattern, recursive=True)
        
        if not matching_files:
            raise HTTPException(status_code=404, detail=f"CV upload not found for job_id: {job_id}")
        
        # For anonymous users, we need to extract the CV data if not already done
        cv_data = None
        
        # First, check if we already have extracted data (would be in a JSON file)
        json_file = BASE_DIR / "data" / "uploads" / f"{job_id}_extracted.json"
        if json_file.exists():
            with open(json_file, 'r') as f:
                cv_data = json.load(f)
        
        # If we don't have CV data yet, check the database
        if not cv_data:
            # For anonymous users, try to get CV data from the database
            # This should already be extracted during upload
            logger.info(f"📊 Checking database for CV data for job_id: {job_id}")
            
            # Try to get CV data from the upload status
            from src.api.db import get_db_connection
            conn = get_db_connection()
            try:
                cursor = conn.cursor()
                cursor.execute(
                    "SELECT cv_data, status FROM cv_uploads WHERE job_id = ?",
                    (job_id,)
                )
                result = cursor.fetchone()
                
                if result and result['status'] == 'completed' and result['cv_data']:
                    cv_data = json.loads(result['cv_data'])
                    logger.info(f"✅ Found CV data in database for job {job_id}")
                    
                    # Save to JSON file for future use
                    with open(json_file, 'w') as f:
                        json.dump(cv_data, f, indent=2)
                else:
                    # Only extract if really needed (shouldn't happen with new flow)
                    logger.warning(f"⚠️ CV data not found in DB, extracting now for job_id: {job_id}")
                    
                    from src.api.routes.cv import extract_cv_data_endpoint
                    extract_result = await extract_cv_data_endpoint(job_id, current_user_id)
                    
                    if extract_result['status'] == 'completed':
                        cv_data = extract_result['cv_data']
                        with open(json_file, 'w') as f:
                            json.dump(cv_data, f, indent=2)
                        logger.info(f"✅ CV data extracted and saved")
                    else:
                        raise HTTPException(status_code=500, detail="Failed to extract CV data")
            finally:
                conn.close()
        
        # === 2. SELECT TEMPLATE ===
        template_id = request.template or "v0_template_v1.5"  # Default template
        
        if template_id not in AVAILABLE_TEMPLATES:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid template: {template_id}. Available templates: {list(AVAILABLE_TEMPLATES.keys())}"
            )
        
        template_path = AVAILABLE_TEMPLATES[template_id]
        full_template_path = str(Path(config.PROJECT_ROOT) / template_path.lstrip('/'))
        
        # === 3. GENERATE PORTFOLIO ID ===
        portfolio_id = f"{current_user_id}_{job_id}_{uuid.uuid4().hex[:8]}"
        
        # === 4. CREATE SANDBOX DIRECTORY ===
        # Make sure to use absolute path
        sandbox_path = (Path(config.SANDBOXES_DIR) / "portfolios" / portfolio_id).resolve()
        sandbox_path.mkdir(parents=True, exist_ok=True)
        
        logger.info(f"📁 Created sandbox directory: {sandbox_path}")
        
        # Create .watchmanconfig to exclude from file watching
        watchman_config = {
            "ignore_dirs": ["node_modules", ".next", ".git", "dist", "build"]
        }
        watchman_file = sandbox_path / ".watchmanconfig"
        with open(watchman_file, 'w') as f:
            json.dump(watchman_config, f, indent=2)
        
        # === 5. COPY TEMPLATE TO SANDBOX ===
        try:
            # Copy entire template directory
            shutil.copytree(full_template_path, sandbox_path, dirs_exist_ok=True)
            logger.info(f"📋 Copied template from {full_template_path} to {sandbox_path}")
        except Exception as e:
            logger.error(f"❌ Failed to copy template: {e}")
            shutil.rmtree(sandbox_path, ignore_errors=True)
            raise HTTPException(status_code=500, detail=f"Failed to copy template: {str(e)}")
        
        # === 5.1 CREATE VERCEL.JSON WITH IFRAME SETTINGS ===
        try:
            logger.info("📝 Creating vercel.json with iframe configuration...")
            vercel_config = {
                "framework": "nextjs",
                "buildCommand": "npm run build",
                "devCommand": "npm run dev",
                "installCommand": "npm install --legacy-peer-deps",
                "outputDirectory": ".next",
                "env": {
                    "FRAME_PARENTS": "https://resume2website.com,http://localhost:3000,http://localhost:3019"
                }
                # No headers here - middleware handles frame-ancestors properly
            }
            
            vercel_json_path = sandbox_path / "vercel.json"
            vercel_json_path.write_text(json.dumps(vercel_config, indent=2))
            logger.info(f"✅ Created vercel.json with env configuration (headers handled by middleware)")
        except Exception as e:
            logger.error(f"⚠️ Failed to create vercel.json: {e}")
            # Non-critical, continue anyway
        
        # === 6. INJECT CV DATA INTO TEMPLATE ===
        try:
            logger.info("💉 Injecting CV data into template...")
            
            # Debug: Check if we have CV data
            if not cv_data:
                logger.error("❌ No CV data available to inject!")
                raise HTTPException(status_code=500, detail="No CV data available. Please ensure CV extraction was completed.")
            
            logger.info(f"📊 CV data available: {list(cv_data.keys()) if cv_data else 'None'}")
            logger.info(f"📊 Hero name: {cv_data.get('hero', {}).get('fullName', 'NOT FOUND')}")
            
            # Create the injected-data.tsx file with actual CV data
            injected_data_file = sandbox_path / "lib" / "injected-data.tsx"
            injected_data_file.parent.mkdir(exist_ok=True)
            
            # Create injected data content with the CV data
            injected_content = f'''/**
 * Auto-generated CV data for portfolio
 * Generated at: {datetime.now().isoformat()}
 * User: {current_user_id}
 * Job ID: {job_id}
 */

import {{ adaptResume2WebsiteToTemplate }} from './cv-data-adapter'

// CV Data from extraction (RESUME2WEBSITE format)
const extractedCVData = {json.dumps(cv_data, indent=2)}

// Convert CV data to template format using the cv-data-adapter
export const portfolioData = adaptResume2WebsiteToTemplate(extractedCVData)

// Force use of real data instead of sample data
export const useRealData = true

// Export extracted data for compatibility
export {{ extractedCVData }}
'''
            
            # Write the injected data file
            with open(injected_data_file, 'w') as f:
                f.write(injected_content)
            
            logger.info(f"✅ CV data injected into {injected_data_file}")
            logger.info(f"📋 Template will use real CV data via adaptResume2WebsiteToTemplate()")
            
        except Exception as e:
            logger.error(f"❌ Failed to inject CV data: {e}")
            shutil.rmtree(sandbox_path, ignore_errors=True)
            raise HTTPException(status_code=500, detail=f"Failed to inject CV data: {str(e)}")
        
        # === 7. INSTALL DEPENDENCIES WITH CLEAN INSTALL ===
        try:
            logger.info("📦 Installing dependencies with clean install and @dnd-kit peer dependency fix...")
            
            # Step 0: Clear any existing node_modules and lock files to prevent corruption
            node_modules_path = sandbox_path / "node_modules"
            pnpm_lock_path = sandbox_path / "pnpm-lock.yaml"
            npm_lock_path = sandbox_path / "package-lock.json"
            yarn_lock_path = sandbox_path / "yarn.lock"
            
            if node_modules_path.exists():
                logger.info("🧹 Cleaning existing node_modules...")
                shutil.rmtree(node_modules_path, ignore_errors=True)
            
            # Remove ALL lockfiles to prevent conflicts
            for lockfile in [pnpm_lock_path, npm_lock_path, yarn_lock_path]:
                if lockfile.exists():
                    logger.info(f"🧹 Removing {lockfile.name}...")
                    lockfile.unlink(missing_ok=True)
            
            # Step 1: Use npm for better compatibility (pnpm has issues with isolated sandboxes)
            install_cmd = ["npm", "install", "--legacy-peer-deps"]
            logger.info(f"📦 Running: {' '.join(install_cmd)}")
            result = subprocess.run(
                install_cmd,
                cwd=str(sandbox_path),
                capture_output=True,
                text=True,
                timeout=180  # Give more time for initial install
            )
            
            if result.returncode != 0:
                logger.error(f"❌ npm install failed: {result.stderr}")
                logger.error(f"❌ npm install stdout: {result.stdout}")
                
                # Try simpler install without legacy-peer-deps
                logger.warning("⚠️ Trying simpler npm install...")
                
                install_cmd = ["npm", "install"]
                result = subprocess.run(
                    install_cmd,
                    cwd=str(sandbox_path),
                    capture_output=True,
                    text=True,
                    timeout=180
                )
                
                if result.returncode != 0:
                    # Last resort: install core packages individually
                    logger.warning("⚠️ Installing core packages individually...")
                    core_packages = ["next@latest", "react", "react-dom"]
                    for package in core_packages:
                        pkg_cmd = ["npm", "install", package, "--save"]
                        pkg_result = subprocess.run(pkg_cmd, cwd=str(sandbox_path), capture_output=True, text=True, timeout=60)
                        if pkg_result.returncode != 0:
                            logger.error(f"❌ Failed to install {package}: {pkg_result.stderr}")
                    
                    raise Exception(f"npm install failed: {result.stderr}")
                
                logger.info("✅ npm install succeeded (simple mode)")
            else:
                logger.info("✅ npm install succeeded")
            
            # Step 2: Verify Next.js is properly installed
            logger.info("📦 Verifying Next.js installation...")
            next_bin_path = sandbox_path / "node_modules" / ".bin" / "next"
            if not next_bin_path.exists():
                logger.error("❌ Next.js binary not found in node_modules/.bin/")
                
                # Check if Next.js was installed at all
                next_module_path = sandbox_path / "node_modules" / "next"
                if next_module_path.exists():
                    logger.info("✅ Next.js module found, checking binary installation...")
                    # Try to find the next binary in the module
                    next_cli_path = next_module_path / "dist" / "bin" / "next"
                    if next_cli_path.exists():
                        logger.info("✅ Found Next.js CLI in dist/bin/next")
                        # Create a symlink or try direct execution
                        next_bin_path = next_cli_path
                    else:
                        logger.error("❌ Next.js CLI not found in expected locations")
                        logger.info(f"📋 Listing contents of {next_module_path}:")
                        try:
                            contents = list(next_module_path.iterdir())[:10]  # Show first 10 items
                            for item in contents:
                                logger.info(f"  - {item.name}")
                        except Exception as e:
                            logger.error(f"Could not list contents: {e}")
                else:
                    logger.error("❌ Next.js module not found at all")
                    
                # Try to manually install Next.js
                logger.warning("⚠️ Attempting to manually install Next.js...")
                try:
                    manual_install_cmd = ["npm", "install", "next@latest", "--save"]
                    manual_result = subprocess.run(
                        manual_install_cmd,
                        cwd=str(sandbox_path),
                        capture_output=True,
                        text=True,
                        timeout=60
                    )
                    
                    if manual_result.returncode == 0:
                        logger.info("✅ Manual Next.js installation succeeded")
                        # Check again
                        next_bin_path = sandbox_path / "node_modules" / ".bin" / "next"
                        if not next_bin_path.exists():
                            logger.error("❌ Next.js binary still not found after manual install")
                            raise Exception("Next.js installation failed - binary not found after manual install")
                    else:
                        logger.error(f"❌ Manual Next.js installation failed: {manual_result.stderr}")
                        raise Exception("Next.js installation failed - manual install failed")
                except subprocess.TimeoutExpired:
                    logger.error("❌ Manual Next.js installation timed out")
                    raise Exception("Next.js installation failed - manual install timeout")
                except Exception as manual_error:
                    logger.error(f"❌ Manual Next.js installation error: {manual_error}")
                    logger.warning("⚠️ Will continue with server startup despite Next.js binary issues...")
                    # Don't raise here - try to continue with server startup
            
            # Try to verify Next.js can be executed (if binary exists)
            if next_bin_path and next_bin_path.exists():
                try:
                    # Use the binary directly instead of through node (fixes double path issue)
                    next_version_cmd = [str(next_bin_path), "--version"]
                    version_result = subprocess.run(
                        next_version_cmd,
                        cwd=str(sandbox_path),
                        capture_output=True,
                        text=True,
                        timeout=5  # Shorter timeout
                    )
                    if version_result.returncode == 0:
                        logger.debug(f"Next.js version: {version_result.stdout.strip()}")
                    else:
                        logger.debug(f"Next.js version check failed: {version_result.stderr}")
                except FileNotFoundError:
                    logger.debug("Next.js binary check skipped - not critical")
                except Exception as version_error:
                    logger.debug(f"Could not verify Next.js version: {version_error}")
                    # Not critical - continue with server startup
            else:
                logger.debug("Skipping Next.js version check - binary not found")
            
            # Step 3: Verify @dnd-kit dependencies are properly installed
            logger.info("📦 Verifying @dnd-kit dependencies...")
            
            # Check if @dnd-kit/accessibility exists in node_modules
            accessibility_path = sandbox_path / "node_modules" / "@dnd-kit" / "accessibility"
            
            if not accessibility_path.exists():
                logger.warning("⚠️ @dnd-kit/accessibility not found, installing explicitly...")
                
                # Use npm directly (no workspace issues)
                dnd_deps_cmd = ["npm", "install", "@dnd-kit/accessibility@^3.1.0", "@dnd-kit/utilities@^3.2.2", "--save"]
                dnd_result = subprocess.run(
                    dnd_deps_cmd,
                    cwd=str(sandbox_path),
                    capture_output=True,
                    text=True,
                    timeout=60
                )
                
                if dnd_result.returncode != 0:
                    logger.error(f"❌ Failed to install @dnd-kit peer deps: {dnd_result.stderr}")
                    # Force continue - Next.js might still build
                    logger.warning("⚠️ Continuing despite @dnd-kit dependency issues...")
                
                # Verify installation worked
                if accessibility_path.exists():
                    logger.info("✅ @dnd-kit/accessibility successfully installed")
                else:
                    logger.warning("⚠️ @dnd-kit/accessibility still missing, may cause build issues")
            else:
                logger.info("✅ @dnd-kit/accessibility already present")
            
            logger.info("✅ Dependencies installation completed")
            
        except subprocess.TimeoutExpired:
            logger.error("❌ Dependency installation timed out")
            shutil.rmtree(sandbox_path, ignore_errors=True)
            raise HTTPException(status_code=500, detail="Dependency installation timed out")
        except Exception as e:
            logger.error(f"❌ Failed to install dependencies: {e}")
            shutil.rmtree(sandbox_path, ignore_errors=True)
            raise HTTPException(status_code=500, detail=f"Failed to install dependencies: {str(e)}")
        
        # === 8. FIX DEPENDENCIES FOR VERCEL AND DEPLOY ===
        try:
            logger.info("🚀 Preparing for Vercel deployment...")
            
            # Fix package.json dependencies for Vercel build
            package_json_path = sandbox_path / "package.json"
            with open(package_json_path, 'r') as f:
                package_data = json.load(f)
            
            # Get original dependencies
            deps = package_data.get("dependencies", {})
            dev_deps = package_data.get("devDependencies", {})
            
            # Move build dependencies to dependencies for Vercel
            build_deps = ["tailwindcss", "autoprefixer", "postcss", "typescript", 
                          "@types/node", "@types/react", "@types/react-dom"]
            
            for dep in build_deps:
                if dep in dev_deps and dep not in deps:
                    deps[dep] = dev_deps[dep]
                    logger.info(f"   ✅ Moved {dep} to dependencies")
            
            # Fix date-fns version for compatibility
            if "date-fns" in deps:
                deps["date-fns"] = "^3.6.0"
                logger.info("   ✅ Fixed date-fns to ^3.6.0")
            
            package_data["dependencies"] = deps
            
            # Save fixed package.json
            with open(package_json_path, 'w') as f:
                json.dump(package_data, f, indent=2)
            logger.info("   ✅ Updated package.json for Vercel")
            
            # Create .npmrc for legacy peer deps
            npmrc_path = sandbox_path / ".npmrc"
            with open(npmrc_path, 'w') as f:
                f.write("legacy-peer-deps=true\n")
                f.write("strict-peer-deps=false\n")
            logger.info("   ✅ Created .npmrc with legacy-peer-deps")
            
            # Save updated package.json (without modifying install script - that causes infinite loop!)
            with open(package_json_path, 'w') as f:
                json.dump(package_data, f, indent=2)
            logger.info("   ✅ Updated package.json")
            
            # === PHASE 1: LOCAL PREVIEW MODE ===
            # Vercel deployment code moved to separate endpoint for "Go Live" action
            # This allows users to preview portfolios locally before payment/deployment
            
            # Start local portfolio server instead of deploying to Vercel
            logger.info(f"🌐 Starting local portfolio server for preview...")
            
            try:
                # Use the enhanced server manager to start local server
                server_config = server_manager.create_server_instance(
                    portfolio_id=portfolio_id,
                    project_path=str(sandbox_path)
                )
                
                port = server_config['port']
                local_url = f"http://localhost:{port}"
                logger.info(f"✅ Portfolio server successfully started on port {port}")
                
            except Exception as e:
                logger.error(f"❌ Failed to start portfolio server: {e}")
                shutil.rmtree(sandbox_path, ignore_errors=True)
                portfolio_metrics.record_failure()
                raise HTTPException(status_code=500, detail=f"Failed to start portfolio server: {str(e)}")
            
            # Store portfolio info for tracking (preview mode)
            PORTFOLIO_PROCESSES[portfolio_id] = {
                "portfolio_id": portfolio_id,
                "job_id": job_id,
                "local_url": local_url,
                "port": port,
                "sandbox_path": str(sandbox_path),
                "created_at": datetime.now(),
                "user_id": current_user_id,
                "template": template_id,
                "status": "preview",  # Mark as preview, not deployed
                "is_local": True,
                "deployment_status": "preview",  # Not yet deployed to Vercel
                "cv_data_name": cv_data.get('hero', {}).get('fullName', '')  # Store for later deployment
            }
            
            # Update user's portfolio in database if authenticated
            if current_user_id and not current_user_id.startswith("anonymous_"):
                # For now, store local URL in database
                update_user_portfolio(current_user_id, portfolio_id, local_url)
            
            # Record metrics
            startup_time = time.time() - start_time
            portfolio_metrics.record_creation(portfolio_id, startup_time)
            
            logger.info(f"🎉 Portfolio preview ready in {startup_time:.1f}s")
            logger.info(f"👁️ Preview at: {local_url}")
            
            return {
                "status": "success",
                "portfolio_id": portfolio_id,
                "url": local_url,  # Return local URL for preview
                "local_url": local_url,
                "port": port,
                "template": template_id,
                "is_local": True,
                "deployment_status": "preview",
                "startup_time": startup_time,
                "message": "Portfolio preview ready. You can view your portfolio locally before deploying."
            }
            
            # === VERCEL DEPLOYMENT CODE (PRESERVED FOR LATER USE) ===
            # This code will be moved to a separate endpoint: POST /portfolio/{portfolio_id}/deploy
            # It will be triggered when user clicks "Go Live" after payment
            """
            # Deploy to Vercel
            logger.info("🌐 Deploying to Vercel...")
            deployer = VercelDeployer()
            
            success, deployment_url, deployment_id = deployer.create_deployment(
                portfolio_path=str(sandbox_path),
                project_name=f"portfolio-{job_id[:8]}",
                user_id=current_user_id,
                job_id=job_id
            )
            
            if not success or not deployment_url:
                # When failed, deployment_id contains error message
                raise Exception(f"Vercel deployment failed: {deployment_id}")
            
            # deployment_id is now the actual deployment ID when successful
            vercel_url = deployment_url
            
            logger.info(f"🔍 Deployment URL: {vercel_url}, ID: {deployment_id}")
            
            # Map to custom domain for iframe support
            custom_domain_url = vercel_url  # Default fallback
            
            # Debug the deployment_id value
            logger.info(f"🔑 Deployment ID type: {type(deployment_id)}, value: {repr(deployment_id)}")
            
            # If no deployment_id from CLI, try to get it from API
            if not deployment_id and vercel_url:
                logger.info("🔍 No deployment ID from CLI, attempting to get from API...")
                logger.info(f"🔍 Calling get_deployment_id_from_url with: {vercel_url}")
                try:
                    deployment_id = deployer.get_deployment_id_from_url(vercel_url)
                    if deployment_id:
                        logger.info(f"✅ Retrieved deployment ID from API: {deployment_id}")
                    else:
                        logger.warning("⚠️ API fallback returned None - could not find deployment")
                except Exception as e:
                    logger.error(f"❌ API fallback failed with error: {e}")
                    deployment_id = None
            
            if deployment_id:
                # Extract fallback slug from vercel URL
                import re
                fallback_slug = 'portfolio'
                match = re.search(r'https://([^.]+)\.vercel\.app', vercel_url)
                if match:
                    fallback_slug = match.group(1)
                
                # Get the full name from CV data to use as subdomain
                full_name = cv_data.get('hero', {}).get('fullName', '')
                
                # Generate custom domain using the person's name
                custom_fqdn = deployer.to_subdomain_from_name(full_name, fallback_slug)
                logger.info(f"🔍 Generated custom domain: {custom_fqdn} from name: {full_name or '(empty)'}")
                
                # Attach domain and create alias using the API
                ok, msg = deployer.attach_domain_and_alias(deployment_id, custom_fqdn)
                logger.info(f"📍 Alias result: {ok} — {msg}")
                
                if ok:
                    custom_domain_url = f"https://{custom_fqdn}"
                    logger.info(f"✅ Custom domain active: {custom_domain_url}")
                else:
                    logger.warning(f"⚠️ Could not create alias: {msg}")
                    logger.warning(f"⚠️ Falling back to Vercel URL, iframe may not work")
            else:
                logger.error("❌ Could not get deployment_id from CLI or API")
                logger.error("❌ Cannot create custom domain alias without deployment ID")
                logger.warning("⚠️ Falling back to Vercel URL, iframe may not work")
            
            logger.info(f"✅ Portfolio deployed to Vercel: {vercel_url}")
            
            # Store deployment info for tracking
            PORTFOLIO_PROCESSES[portfolio_id] = {
                "portfolio_id": portfolio_id,
                "job_id": job_id,
                "vercel_url": vercel_url,
                "custom_domain_url": custom_domain_url,
                "deployment_id": deployment_id,
                "sandbox_path": str(sandbox_path),
                "created_at": datetime.now(),
                "user_id": current_user_id,
                "template": template_id,
                "status": "deployed",
                "is_local": False
            }
            
            # Update user's portfolio in database if authenticated
            if current_user_id and not current_user_id.startswith("anonymous_"):
                update_user_portfolio(current_user_id, portfolio_id, vercel_url)
            
            # Record metrics
            startup_time = time.time() - start_time
            portfolio_metrics.record_creation(portfolio_id, startup_time)
            
            logger.info(f"🎉 Portfolio generation completed in {startup_time:.1f}s")
            logger.info(f"🌐 Live at: {vercel_url}")
            
            return {
                "status": "success",
                "portfolio_id": portfolio_id,
                "url": custom_domain_url,  # Return custom domain for iframe support
                "vercel_url": vercel_url,
                "custom_domain_url": custom_domain_url,
                "deployment_id": deployment_id,
                "template": template_id,
                "is_local": False,
                "deployment_time": startup_time,
                "message": "Portfolio deployed successfully. Custom domain will be active once DNS propagates."
            }
            """
            
        except Exception as e:
            logger.error(f"❌ Portfolio generation failed: {e}")
            # Clean up sandbox on failure
            shutil.rmtree(sandbox_path, ignore_errors=True)
            portfolio_metrics.record_failure()
            raise HTTPException(status_code=500, detail=f"Failed to generate portfolio: {str(e)}")
    
    except HTTPException:
        portfolio_metrics.record_failure()
        raise
    except Exception as e:
        portfolio_metrics.record_failure()
        logger.error(f"❌ Portfolio generation failed: {e}")
        raise HTTPException(status_code=500, detail=f"Portfolio generation failed: {str(e)}")
@router.get("/list")
async def list_user_portfolios(current_user_id: str = Depends(get_current_user)):
    """
    List all portfolios for the current user (both local and Vercel deployed)
    """
    try:
        portfolios = []
        
        # Get portfolios from in-memory store (includes Vercel deployments)
        for portfolio_id, info in PORTFOLIO_PROCESSES.items():
            if info.get('user_id') == current_user_id:
                # Convert to frontend-friendly format
                portfolio_data = {
                    "portfolio_id": portfolio_id,
                    "job_id": info.get('job_id'),
                    "url": info.get('custom_domain_url') or info.get('vercel_url') or info.get('url') or f"http://localhost:{info.get('port')}",
                    "vercel_url": info.get('vercel_url'),
                    "custom_domain_url": info.get('custom_domain_url'),
                    "port": info.get('port'),
                    "created_at": info.get('created_at').isoformat() if isinstance(info.get('created_at'), datetime) else info.get('created_at'),
                    "template": info.get('template'),
                    "status": info.get('status'),
                    "is_local": info.get('is_local', True),
                    "deployment_id": info.get('deployment_id'),
                    "cv_filename": info.get('cv_filename', 'Unknown')
                }
                portfolios.append(portfolio_data)
        
        # Also check database for persisted portfolios
        from src.api.db import get_user_portfolio
        db_portfolio = get_user_portfolio(current_user_id)
        if db_portfolio and not any(p['portfolio_id'] == db_portfolio.get('portfolio_id') for p in portfolios):
            portfolios.append({
                "portfolio_id": db_portfolio.get('portfolio_id'),
                "url": db_portfolio.get('portfolio_url'),
                "created_at": db_portfolio.get('created_at'),
                "status": "deployed",
                "is_local": False
            })
        
        # Sort by creation date (newest first)
        portfolios.sort(key=lambda x: x.get('created_at', ''), reverse=True)
        
        return {
            "status": "success",
            "portfolios": portfolios,
            "count": len(portfolios)
        }
        
    except Exception as e:
        logger.error(f"Failed to list portfolios: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve portfolios")


@router.post("/{portfolio_id}/deploy")
async def deploy_portfolio_to_vercel(
    portfolio_id: str,
    current_user_id: str = Depends(get_current_user)
):
    """
    Deploy an existing preview portfolio to Vercel (for 'Go Live' action after payment)
    
    This endpoint takes a portfolio that's running locally in preview mode
    and deploys it to Vercel with custom domain setup.
    
    Args:
        portfolio_id: The portfolio ID to deploy
        current_user_id: Authenticated user ID
        
    Returns:
        Deployment result with Vercel URL and custom domain
    """
    try:
        # Check if portfolio exists and belongs to user
        portfolio_info = PORTFOLIO_PROCESSES.get(portfolio_id)
        if not portfolio_info:
            raise HTTPException(status_code=404, detail="Portfolio not found")
        
        # Verify ownership
        if portfolio_info.get('user_id') != current_user_id:
            raise HTTPException(status_code=403, detail="Not authorized to deploy this portfolio")
        
        # Check if already deployed
        if portfolio_info.get('deployment_status') == 'deployed':
            return {
                "status": "already_deployed",
                "vercel_url": portfolio_info.get('vercel_url'),
                "custom_domain_url": portfolio_info.get('custom_domain_url'),
                "message": "Portfolio is already deployed to Vercel"
            }
        
        # Get sandbox path
        sandbox_path = Path(portfolio_info.get('sandbox_path'))
        if not sandbox_path.exists():
            raise HTTPException(status_code=404, detail="Portfolio files not found. Please regenerate the portfolio.")
        
        job_id = portfolio_info.get('job_id')
        cv_data_name = portfolio_info.get('cv_data_name', '')
        
        logger.info(f"🚀 Starting Vercel deployment for portfolio: {portfolio_id}")
        logger.info(f"📁 Deploying from: {sandbox_path}")
        
        # === DEPLOY TO VERCEL (using preserved code) ===
        deployer = VercelDeployer()
        
        success, deployment_url, deployment_id = deployer.create_deployment(
            portfolio_path=str(sandbox_path),
            project_name=f"portfolio-{job_id[:8]}",
            user_id=current_user_id,
            job_id=job_id
        )
        
        if not success or not deployment_url:
            # When failed, deployment_id contains error message
            raise HTTPException(status_code=500, detail=f"Vercel deployment failed: {deployment_id}")
        
        # deployment_id is now the actual deployment ID when successful
        vercel_url = deployment_url
        
        logger.info(f"🔍 Deployment URL: {vercel_url}, ID: {deployment_id}")
        
        # Map to custom domain for iframe support
        custom_domain_url = vercel_url  # Default fallback
        
        # If no deployment_id from CLI, try to get it from API
        if not deployment_id and vercel_url:
            logger.info("🔍 No deployment ID from CLI, attempting to get from API...")
            try:
                deployment_id = deployer.get_deployment_id_from_url(vercel_url)
                if deployment_id:
                    logger.info(f"✅ Retrieved deployment ID from API: {deployment_id}")
            except Exception as e:
                logger.error(f"❌ API fallback failed: {e}")
                deployment_id = None
        
        if deployment_id:
            # Extract fallback slug from vercel URL
            import re
            fallback_slug = 'portfolio'
            match = re.search(r'https://([^.]+)\.vercel\.app', vercel_url)
            if match:
                fallback_slug = match.group(1)
            
            # Generate custom domain using the person's name
            custom_fqdn = deployer.to_subdomain_from_name(cv_data_name, fallback_slug)
            logger.info(f"🔍 Generated custom domain: {custom_fqdn} from name: {cv_data_name or '(empty)'}")
            
            # Attach domain and create alias using the API
            ok, msg = deployer.attach_domain_and_alias(deployment_id, custom_fqdn)
            logger.info(f"📍 Alias result: {ok} — {msg}")
            
            if ok:
                custom_domain_url = f"https://{custom_fqdn}"
                logger.info(f"✅ Custom domain active: {custom_domain_url}")
            else:
                logger.warning(f"⚠️ Could not create alias: {msg}")
                logger.warning(f"⚠️ Using Vercel URL instead")
        
        # Update portfolio info with deployment details
        portfolio_info.update({
            "vercel_url": vercel_url,
            "custom_domain_url": custom_domain_url,
            "deployment_id": deployment_id,
            "deployment_status": "deployed",
            "status": "deployed",
            "is_local": False,
            "deployed_at": datetime.now()
        })
        
        # Update user's portfolio in database
        update_user_portfolio(current_user_id, portfolio_id, custom_domain_url or vercel_url)
        
        logger.info(f"✅ Portfolio successfully deployed to Vercel")
        logger.info(f"🌐 Live at: {custom_domain_url or vercel_url}")
        
        return {
            "status": "success",
            "portfolio_id": portfolio_id,
            "url": custom_domain_url or vercel_url,
            "vercel_url": vercel_url,
            "custom_domain_url": custom_domain_url,
            "deployment_id": deployment_id,
            "message": "Portfolio successfully deployed to Vercel. Custom domain will be active once DNS propagates."
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to deploy portfolio: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to deploy portfolio: {str(e)}")


@router.post("/{portfolio_id}/restart")
async def restart_portfolio_server(
    portfolio_id: str,
    current_user_id: str = Depends(get_current_user)
):
    """
    Restart a portfolio server (only for local portfolios, not Vercel)
    """
    try:
        # Check if this is a Vercel deployment
        if portfolio_id in PORTFOLIO_PROCESSES:
            portfolio_info = PORTFOLIO_PROCESSES[portfolio_id]
            if not portfolio_info.get('is_local', True):
                # This is a Vercel deployment, no restart needed
                return {
                    "status": "success",
                    "message": "Vercel portfolios don't need restarting",
                    "url": portfolio_info.get('vercel_url'),
                    "is_local": False
                }
        
        # For backward compatibility with local portfolios
        portfolio_dir = PORTFOLIOS_DIR / f"{current_user_id}_{portfolio_id}"
        
        if not portfolio_dir.exists():
            raise HTTPException(status_code=404, detail="Portfolio not found")
        
        # Get metadata to know the port
        metadata_file = portfolio_dir / "portfolio_metadata.json"
        if not metadata_file.exists():
            raise HTTPException(status_code=404, detail="Portfolio metadata not found")
        
        metadata = json.loads(metadata_file.read_text())
        port = metadata.get("port")
        
        if not port:
            raise HTTPException(status_code=400, detail="Portfolio port not found")
        
        # Stop existing server if running
        server_manager.stop_server(portfolio_id)
        
        # Start new server with enhanced manager
        server_config = server_manager.create_server_instance(
            portfolio_id=portfolio_id,
            project_path=str(portfolio_dir),
            port=None  # Let it pick a new port
        )
        
        # Update metadata with new port
        new_port = server_config['port']
        metadata['port'] = new_port
        metadata['url'] = f"http://localhost:{new_port}"
        metadata['last_restarted'] = datetime.now().isoformat()
        metadata_file.write_text(json.dumps(metadata, indent=2))
        
        logger.info(f"✅ Portfolio server restarted successfully on port {new_port}")
        
        return {
            "status": "success",
            "message": "Portfolio server restarted successfully",
            "portfolio_id": portfolio_id,
            "port": server_config['port'],
            "url": f"http://localhost:{server_config['port']}",
            "status_info": server_config['status']
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to restart portfolio server: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to restart portfolio server: {str(e)}")


@router.get("/{portfolio_id}/status")
async def get_portfolio_server_status(
    portfolio_id: str,
    current_user_id: str = Depends(get_current_user)
):
    """
    Get the status of a portfolio server
    """
    try:
        portfolio_dir = PORTFOLIOS_DIR / f"{current_user_id}_{portfolio_id}"
        
        if not portfolio_dir.exists():
            raise HTTPException(status_code=404, detail="Portfolio not found")
        
        # Get server status from manager
        server_status = server_manager.get_server_status(portfolio_id)
        
        if server_status:
            # Perform live health check
            health_check_result = None
            try:
                response = requests.get(server_status['health_url'], timeout=5)
                health_check_result = {
                    'status': 'healthy' if response.status_code == 200 else 'unhealthy',
                    'status_code': response.status_code,
                    'response_time': response.elapsed.total_seconds()
                }
            except requests.RequestException as e:
                health_check_result = {
                    'status': 'unreachable',
                    'error': str(e)
                }
            
            return {
                "status": "success",
                "portfolio_id": portfolio_id,
                "server_status": server_status,
                "health_check": health_check_result
            }
        else:
            return {
                "status": "not_running",
                "portfolio_id": portfolio_id,
                "message": "Server is not currently running"
            }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get portfolio server status: {e}")
        raise HTTPException(status_code=500, detail="Failed to get server status")


@router.put("/{portfolio_id}/cv-data")
async def update_portfolio_cv_data(
    portfolio_id: str,
    request: Request,
    current_user_id: str = Depends(get_current_user)
):
    """
    Update the CV data in a portfolio
    """
    try:
        # Parse the JSON body
        updated_data = await request.json()
        
        portfolio_dir = PORTFOLIOS_DIR / f"{current_user_id}_{portfolio_id}"
        
        if not portfolio_dir.exists():
            raise HTTPException(status_code=404, detail="Portfolio not found")
        
        # Update the injected data file
        injected_data_file = portfolio_dir / "lib" / "injected-data.tsx"
        
        # Read current content to preserve the structure
        if injected_data_file.exists():
            current_content = injected_data_file.read_text()
            
            # Update with new data
            new_content = f'''/**
 * Auto-generated CV data for portfolio
 * Generated at: {datetime.now().isoformat()}
 * User: {current_user_id}
 * Last updated: {datetime.now().isoformat()}
 */

import {{ adaptResume2WebsiteToTemplate }} from './cv-data-adapter'

// CV Data from extraction
const extractedCVData = {json.dumps(updated_data, indent=2)}

// Convert CV data to template format
export const portfolioData = adaptResume2WebsiteToTemplate(extractedCVData)

// Force use of real data instead of sample data
export const useRealData = true
'''
            
            injected_data_file.write_text(new_content)
            
            # Also update the metadata
            metadata_file = portfolio_dir / "portfolio_metadata.json"
            if metadata_file.exists():
                metadata = json.loads(metadata_file.read_text())
                metadata['last_updated'] = datetime.now().isoformat()
                metadata_file.write_text(json.dumps(metadata, indent=2))
            
            # If the job_id exists in metadata, also update the database
            if metadata_file.exists():
                metadata = json.loads(metadata_file.read_text())
                job_id = metadata.get('job_id')
                
                if job_id:
                    from src.api.db import get_session
                    from src.api.models import CVUpload
                    
                    with get_session() as session:
                        cv_upload = session.query(CVUpload).filter_by(
                            user_id=current_user_id,
                            job_id=job_id
                        ).first()
                        
                        if cv_upload:
                            cv_upload.cv_data = json.dumps(updated_data)
                            cv_upload.updated_at = datetime.now()
                            session.commit()
            
            logger.info(f"✅ Portfolio CV data updated successfully for {portfolio_id}")
            
            return {
                "status": "success",
                "message": "Portfolio data updated successfully",
                "portfolio_id": portfolio_id,
                "updated_at": datetime.now().isoformat()
            }
            
        else:
            raise HTTPException(status_code=404, detail="Portfolio data file not found")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update portfolio CV data: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to update CV data: {str(e)}")


@router.get("/{portfolio_id}/cv-data")
async def get_portfolio_cv_data(
    portfolio_id: str,
    current_user_id: str = Depends(get_current_user)
):
    """
    Get the CV data associated with a portfolio
    """
    try:
        portfolio_dir = PORTFOLIOS_DIR / f"{current_user_id}_{portfolio_id}"
        
        if not portfolio_dir.exists():
            raise HTTPException(status_code=404, detail="Portfolio not found")
        
        # Read the injected data file
        injected_data_file = portfolio_dir / "lib" / "injected-data.tsx"
        if not injected_data_file.exists():
            # Fallback to metadata
            metadata_file = portfolio_dir / "portfolio_metadata.json"
            if metadata_file.exists():
                metadata = json.loads(metadata_file.read_text())
                job_id = metadata.get('job_id')
                
                # Fetch CV data from database
                from src.api.db import get_session
                from src.api.models import CVUpload
                
                with get_session() as session:
                    cv_upload = session.query(CVUpload).filter_by(
                        user_id=current_user_id,
                        job_id=job_id
                    ).first()
                    
                    if cv_upload and cv_upload.cv_data:
                        cv_data = json.loads(cv_upload.cv_data)
                        return {
                            "status": "success",
                            "cv_data": cv_data,
                            "portfolio_id": portfolio_id,
                            "job_id": job_id
                        }
            
            raise HTTPException(status_code=404, detail="CV data not found for portfolio")
        
        # Parse the injected data file to extract CV data
        content = injected_data_file.read_text()
        
        # Extract JSON between "const extractedCVData = " and the next line
        import re
        match = re.search(r'const extractedCVData = ({[\s\S]*?})\n\n', content)
        if match:
            cv_data_str = match.group(1)
            cv_data = json.loads(cv_data_str)
            
            return {
                "status": "success",
                "cv_data": cv_data,
                "portfolio_id": portfolio_id
            }
        else:
            raise HTTPException(status_code=500, detail="Could not parse CV data from portfolio")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get portfolio CV data: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get CV data: {str(e)}")


@router.delete("/{portfolio_id}")
async def delete_portfolio(
    portfolio_id: str,
    current_user_id: str = Depends(get_current_user)
):
    """
    Delete a portfolio (local and/or Vercel deployment)
    """
    try:
        # Check if this is a Vercel deployment
        if portfolio_id in PORTFOLIO_PROCESSES:
            portfolio_info = PORTFOLIO_PROCESSES[portfolio_id]
            
            # Verify ownership
            if portfolio_info.get('user_id') != current_user_id:
                raise HTTPException(status_code=403, detail="Not authorized to delete this portfolio")
            
            # Delete from Vercel if it's a Vercel deployment
            if portfolio_info.get('deployment_id'):
                logger.info(f"🗑️ Deleting Vercel deployment: {portfolio_info['deployment_id']}")
                deployer = VercelDeployer()
                try:
                    deployer.delete_deployment(portfolio_info['deployment_id'])
                    logger.info(f"✅ Vercel deployment deleted: {portfolio_info['deployment_id']}")
                except Exception as e:
                    logger.error(f"Failed to delete Vercel deployment: {e}")
                    # Continue with local cleanup even if Vercel deletion fails
            
            # Remove from in-memory store
            del PORTFOLIO_PROCESSES[portfolio_id]
        
        # Check for local portfolio directory
        portfolio_dir = PORTFOLIOS_DIR / f"{current_user_id}_{portfolio_id}"
        
        if portfolio_dir.exists():
            # Stop the server if running
            server_manager.stop_server(portfolio_id)
            
            # Remove directory
            shutil.rmtree(portfolio_dir)
            logger.info(f"✅ Local portfolio directory deleted: {portfolio_id}")
        
        # Also remove from database if exists
        from src.api.db import remove_user_portfolio
        remove_user_portfolio(current_user_id)
        
        logger.info(f"✅ Portfolio fully deleted: {portfolio_id}")
        
        return {
            "status": "success",
            "message": "Portfolio deleted successfully",
            "portfolio_id": portfolio_id
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete portfolio: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete portfolio")

@router.get("/portfolios/metrics")
async def get_portfolio_metrics():
    """
    Get portfolio generation metrics and statistics
    
    Returns:
        Metrics including active portfolios, total created, failures, and performance stats
    """
    return {
        "status": "success",
        "metrics": portfolio_metrics.get_stats(),
        "config": {
            "max_active_portfolios": MAX_ACTIVE_PORTFOLIOS,
            "portfolio_max_age_hours": PORTFOLIO_MAX_AGE_HOURS,
            "cleanup_interval_seconds": PORTFOLIO_CLEANUP_INTERVAL
        }
    }

@router.post("/{portfolio_id}/setup-custom-domain")
async def setup_portfolio_custom_domain(
    portfolio_id: str,
    custom_domain: str,
    current_user_id: str = Depends(get_current_user)
):
    """
    TEST ENDPOINT: Set up a custom domain for an existing portfolio deployment
    
    Args:
        portfolio_id: The portfolio ID (from the deployment URL)
        custom_domain: The custom domain to use (e.g., "www.nitzanshifris.com")
        
    Returns:
        Success status and the custom domain URL
    """
    try:
        # Find the portfolio in our tracking
        portfolio_info = None
        for pid, info in PORTFOLIO_PROCESSES.items():
            if pid == portfolio_id:
                portfolio_info = info
                break
        
        if not portfolio_info or not portfolio_info.get('vercel_url'):
            raise HTTPException(status_code=404, detail="Portfolio not found or not deployed")
        
        # Verify ownership
        if portfolio_info.get('user_id') != current_user_id:
            raise HTTPException(status_code=403, detail="Not authorized to modify this portfolio")
        
        # Initialize Vercel deployer
        deployer = VercelDeployer()

        # Obtain deployment id for aliasing
        deployment_id = portfolio_info.get('deployment_id')
        if not deployment_id:
            # Fallback: try to retrieve from API using the Vercel URL
            deployment_id = deployer.get_deployment_id_from_url(portfolio_info['vercel_url'])
            if not deployment_id:
                raise HTTPException(status_code=500, detail="Could not resolve deployment ID for this portfolio")

        # Attach domain to project and create alias
        success, msg = deployer.attach_domain_and_alias(deployment_id, custom_domain)
        custom_url = f"https://{custom_domain}" if success else None
        error_msg = None if success else msg
        
        if success:
            # Update portfolio info with custom domain
            portfolio_info['custom_domain'] = custom_domain
            portfolio_info['custom_url'] = custom_url
            
            logger.info(f"✅ Custom domain configured: {custom_domain} -> {portfolio_info['vercel_url']}")
            
            return {
                "status": "success",
                "message": f"Custom domain configured successfully",
                "deployment_url": portfolio_info['vercel_url'],
                "custom_domain": custom_domain,
                "custom_url": custom_url,
                "note": "DNS propagation may take a few minutes"
            }
        else:
            raise HTTPException(status_code=500, detail=f"Failed to set up custom domain: {error_msg}")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error setting up custom domain: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))