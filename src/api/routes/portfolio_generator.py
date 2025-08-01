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
from datetime import datetime
from typing import Dict, Optional

# Import authentication dependency
from src.api.routes.auth import get_current_user
from src.api.db import get_user_cv_uploads

logger = logging.getLogger(__name__)

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
            base_dir = PORTFOLIOS_DIR.resolve()
            if not str(project_path).startswith(str(base_dir)):
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
    "v0_template_1.3": "v0_template_1.3",
    "v0_template_1.4": "v0_template_1.4"
}
DEFAULT_TEMPLATE = "v0_template_1.4"

# Ensure portfolios directory exists
PORTFOLIOS_DIR.mkdir(parents=True, exist_ok=True)

@router.post("/generate/{job_id}")
async def generate_portfolio(
    job_id: str,
    request: GeneratePortfolioRequest = GeneratePortfolioRequest(),
    current_user_id: str = Depends(get_current_user)
):
    """
    Generate a portfolio website from CV data
    
    Args:
        job_id: The CV job ID to generate portfolio from
        current_user_id: Automatically injected by FastAPI
        
    Returns:
        Portfolio generation result with URL and status
    """
    try:
        logger.info(f"🚀 Starting portfolio generation for job_id: {job_id}, user: {current_user_id}")
        
        # === 1. VERIFY CV OWNERSHIP ===
        uploads = get_user_cv_uploads(current_user_id)
        cv_upload = None
        
        for upload in uploads:
            if upload['job_id'] == job_id:
                cv_upload = upload
                break
        
        if not cv_upload:
            raise HTTPException(status_code=404, detail="CV not found or access denied")
        
        if cv_upload.get('status') != 'completed':
            raise HTTPException(status_code=400, detail="CV processing not completed yet")
        
        if not cv_upload.get('cv_data'):
            raise HTTPException(status_code=400, detail="No CV data available for portfolio generation")
        
        logger.info(f"✅ CV verification passed for job_id: {job_id}")
        
        # === 2. CREATE PORTFOLIO INSTANCE ===
        portfolio_id = str(uuid.uuid4())
        
        # Validate user_id and portfolio_id to prevent path injection
        if not re.match(r'^[a-zA-Z0-9_\-]+$', current_user_id):
            raise HTTPException(status_code=400, detail="Invalid user ID format")
        if not re.match(r'^[a-f0-9\-]+$', portfolio_id):
            raise HTTPException(status_code=400, detail="Invalid portfolio ID format")
        
        portfolio_dir = PORTFOLIOS_DIR / f"{current_user_id}_{portfolio_id}"
        
        # Ensure the portfolio directory is within the expected base directory
        try:
            portfolio_dir = portfolio_dir.resolve()
            base_dir = PORTFOLIOS_DIR.resolve()
            if not str(portfolio_dir).startswith(str(base_dir)):
                raise HTTPException(status_code=403, detail="Invalid portfolio path")
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid portfolio path")
        
        # Copy template to portfolio directory (excluding node_modules and lock files)
        logger.info(f"📁 Creating clean portfolio directory: {portfolio_dir}")
        
        def ignore_patterns(dir, files):
            """Ignore node_modules, lock files, and other build artifacts"""
            ignore = set()
            for file in files:
                if file in ['node_modules', '.next', 'dist', 'build', '.git']:
                    ignore.add(file)
                elif file.endswith(('.log', '.pid')):
                    ignore.add(file)
                elif file in ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml']:
                    ignore.add(file)
            return ignore
        
        # Determine which template to use
        template_name = request.template if request.template in AVAILABLE_TEMPLATES else DEFAULT_TEMPLATE
        template_source = TEMPLATES_DIR / template_name
        
        if not template_source.exists():
            raise HTTPException(status_code=400, detail=f"Template '{template_name}' not found")
        
        shutil.copytree(template_source, portfolio_dir, ignore=ignore_patterns)
        logger.info(f"✅ Clean template copied (excluded node_modules and lock files)")
        
        # === 3. INJECT CV DATA INTO TEMPLATE ===
        # Create a custom data file with the user's CV data
        cv_data = json.loads(cv_upload['cv_data'])
        
        # Create a data injection script
        data_injection_content = f'''/**
 * Auto-generated CV data for portfolio
 * Generated at: {datetime.now().isoformat()}
 * User: {current_user_id}
 * Job ID: {job_id}
 */

import {{ adaptCV2WebToTemplate }} from './cv-data-adapter'

// CV Data from extraction
const extractedCVData = {json.dumps(cv_data, indent=2)}

// Convert CV data to template format
export const portfolioData = adaptCV2WebToTemplate(extractedCVData)

// Force use of real data instead of sample data
export const useRealData = true
'''
        
        # Write the injected data
        data_file = portfolio_dir / "lib" / "injected-data.tsx"
        data_file.write_text(data_injection_content)
        
        # === 4. MODIFY TEMPLATE TO USE INJECTED DATA ===
        # Update the main page to use injected data instead of API calls
        page_file = portfolio_dir / "app" / "page.tsx"
        page_content = page_file.read_text()
        
        # Replace the data loading logic
        modified_content = page_content.replace(
            'import { initialData, contentIconMap, type PortfolioData } from "@/lib/data"',
            '''import { initialData, contentIconMap, type PortfolioData } from "@/lib/data"
import { portfolioData, useRealData } from "@/lib/injected-data"'''
        ).replace(
            'const [data, setData] = useState<PortfolioData>(initialData)',
            'const [data, setData] = useState<PortfolioData>(useRealData ? portfolioData : initialData)'
        ).replace(
            '''useEffect(() => {
    const loadCVData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Try to get session ID from various sources
        const sessionId = getSessionId()
        
        if (sessionId) {
          console.log('🔄 Loading CV data from API...')
          const cvData = await fetchLatestCVData(sessionId)
          setData(cvData)
          console.log('✅ CV data loaded successfully')
          toast.success('Portfolio loaded from your CV data!')
        } else {
          console.log('⚠️ No session ID found, using demo data')
          toast.info('Showing demo portfolio - connect your CV for personalized content')
        }
      } catch (err) {
        console.error('❌ Failed to load CV data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load CV data')
        toast.error('Failed to load CV data, showing demo content')
        // Keep using initialData as fallback
      } finally {
        setIsLoading(false)
      }
    }

    loadCVData()
  }, [])''',
            '''useEffect(() => {
    // For generated portfolios, data is already injected
    if (useRealData) {
      setIsLoading(false)
      return
    }
    
    // Original loading logic for demo mode
    const loadCVData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        console.log('⚠️ Using demo data')
        toast.info('Showing demo portfolio')
      } catch (err) {
        console.error('❌ Failed to load data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load data')
        toast.error('Failed to load data')
      } finally {
        setIsLoading(false)
      }
    }

    loadCVData()
  }, [])'''
        )
        
        page_file.write_text(modified_content)
        
        logger.info(f"✅ Data injection completed for portfolio: {portfolio_id}")
        
        # === 5. INSTALL DEPENDENCIES (FRESH) ===
        logger.info(f"📦 Installing fresh dependencies for portfolio: {portfolio_id}")
        try:
            # Use npm for the most reliable installation
            install_cmd = ['npm', 'install', '--legacy-peer-deps']
            logger.info(f"📦 Using npm for clean installation")
            
            result = subprocess.run(
                install_cmd,
                cwd=portfolio_dir,
                capture_output=True,
                text=True,
                timeout=300  # 5 minutes timeout for fresh install
            )
            
            if result.returncode != 0:
                logger.error(f"❌ npm install failed: {result.stderr}")
                logger.error(f"❌ npm install stdout: {result.stdout}")
                
                # Try to salvage with a simpler install
                logger.warning(f"⚠️ Attempting simplified installation...")
                simple_cmd = ['npm', 'install', '--no-optional', '--no-audit']
                simple_result = subprocess.run(
                    simple_cmd,
                    cwd=portfolio_dir,
                    capture_output=True,
                    text=True,
                    timeout=180
                )
                
                if simple_result.returncode != 0:
                    raise HTTPException(status_code=500, detail="Failed to install portfolio dependencies")
            
            # Verify critical dependencies
            next_bin = portfolio_dir / "node_modules" / ".bin" / "next"
            if not next_bin.exists():
                logger.error(f"❌ Next.js binary not found after installation")
                raise HTTPException(status_code=500, detail="Next.js installation incomplete")
            
            logger.info(f"✅ Dependencies installed successfully for portfolio: {portfolio_id}")
            
        except subprocess.TimeoutExpired:
            logger.error(f"❌ npm install timed out for portfolio: {portfolio_id}")
            raise HTTPException(status_code=500, detail="Portfolio dependency installation timed out")
        
        # === 6. SKIP BUILD - USE DEV MODE DIRECTLY ===
        logger.info(f"⚡ Skipping build - will start in development mode for portfolio: {portfolio_id}")
        # Development mode is more reliable and faster for portfolio generation
        
        # === 7. START PORTFOLIO SERVER (ENHANCED) ===
        logger.info(f"🌐 Starting enhanced portfolio server for portfolio: {portfolio_id}")
        
        try:
            # Use the enhanced server manager
            server_config = server_manager.create_server_instance(
                portfolio_id=portfolio_id,
                project_path=str(portfolio_dir)
            )
            
            port = server_config['port']
            logger.info(f"✅ Portfolio server successfully started on port {port}")
            
        except Exception as e:
            logger.error(f"❌ Failed to start portfolio server with enhanced manager: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to start portfolio server: {str(e)}")
        
        # === 8. SAVE PORTFOLIO METADATA ===
        portfolio_metadata = {
            "portfolio_id": portfolio_id,
            "user_id": current_user_id,
            "job_id": job_id,
            "created_at": datetime.now().isoformat(),
            "port": port,
            "url": f"http://localhost:{port}",
            "directory": str(portfolio_dir),
            "status": "active",
            "template": template_name,
            "cv_filename": cv_upload.get('filename', 'Unknown')
        }
        
        metadata_file = portfolio_dir / "portfolio_metadata.json"
        metadata_file.write_text(json.dumps(portfolio_metadata, indent=2))
        
        logger.info(f"🎉 Portfolio generation completed successfully!")
        logger.info(f"   Portfolio ID: {portfolio_id}")
        logger.info(f"   URL: http://localhost:{port}")
        logger.info(f"   Directory: {portfolio_dir}")
        
        return {
            "status": "success",
            "message": "Portfolio generated successfully!",
            "portfolio_id": portfolio_id,
            "url": f"http://localhost:{port}",
            "port": port,
            "created_at": portfolio_metadata["created_at"],
            "template": "v0_template_1.3",
            "cv_filename": cv_upload.get('filename', 'Unknown')
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Portfolio generation failed: {e}")
        raise HTTPException(status_code=500, detail=f"Portfolio generation failed: {str(e)}")


@router.get("/list")
async def list_user_portfolios(current_user_id: str = Depends(get_current_user)):
    """
    List all portfolios for the current user
    """
    try:
        portfolios = []
        user_portfolio_pattern = f"{current_user_id}_*"
        
        for portfolio_dir in PORTFOLIOS_DIR.glob(user_portfolio_pattern):
            if portfolio_dir.is_dir():
                metadata_file = portfolio_dir / "portfolio_metadata.json"
                if metadata_file.exists():
                    try:
                        metadata = json.loads(metadata_file.read_text())
                        portfolios.append(metadata)
                    except Exception as e:
                        logger.warning(f"Failed to read metadata for {portfolio_dir}: {e}")
        
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


@router.post("/{portfolio_id}/restart")
async def restart_portfolio_server(
    portfolio_id: str,
    current_user_id: str = Depends(get_current_user)
):
    """
    Restart a portfolio server if it's not responding
    """
    try:
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

import {{ adaptCV2WebToTemplate }} from './cv-data-adapter'

// CV Data from extraction
const extractedCVData = {json.dumps(updated_data, indent=2)}

// Convert CV data to template format
export const portfolioData = adaptCV2WebToTemplate(extractedCVData)

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
    Delete a portfolio
    """
    try:
        portfolio_dir = PORTFOLIOS_DIR / f"{current_user_id}_{portfolio_id}"
        
        if not portfolio_dir.exists():
            raise HTTPException(status_code=404, detail="Portfolio not found")
        
        # Stop the server if running
        server_manager.stop_server(portfolio_id)
        
        # Remove directory
        shutil.rmtree(portfolio_dir)
        
        logger.info(f"✅ Portfolio deleted: {portfolio_id}")
        
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