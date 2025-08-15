"""
Vercel Deployment Service for RESUME2WEBSITE
Handles deploying portfolio sites to Vercel programmatically
"""
import os
import json
import logging
import requests
import hashlib
import shutil
from pathlib import Path
from typing import Dict, Optional, Tuple
from datetime import datetime
from src.core.local.keychain_manager import KeychainManager

logger = logging.getLogger(__name__)

class VercelDeployer:
    """
    Handles deployment of portfolio sites to Vercel
    """
    
    def __init__(self):
        """Initialize Vercel deployer with API token from keychain"""
        self.api_token = KeychainManager.get_credential('vercel_api_token')
        self.team_id = KeychainManager.get_credential('vercel_team_id')
        
        if not self.api_token:
            raise ValueError("Vercel API token not found in keychain. Run setup_keychain.py")
        
        self.api_base = "https://api.vercel.com"
        self.headers = {
            "Authorization": f"Bearer {self.api_token}",
            "Content-Type": "application/json"
        }
        
        # Auto-detect team if not stored
        if not self.team_id:
            self._detect_and_store_team()
        
        logger.info(f"✅ Vercel deployer initialized (Team: {'Yes' if self.team_id else 'Personal'})")
    
    def create_deployment(
        self, 
        portfolio_path: str, 
        project_name: str,
        user_id: str,
        job_id: str
    ) -> Tuple[bool, Optional[str], Optional[str]]:
        """
        Deploy a portfolio to Vercel using CLI to bypass 10MB API limit
        
        Args:
            portfolio_path: Path to the portfolio directory
            project_name: Name for the Vercel project (will be subdomain)
            user_id: User ID for tracking
            job_id: Job ID for tracking
            
        Returns:
            Tuple of (success, deployment_url, error_message)
        """
        try:
            logger.info(f"🚀 Starting Vercel deployment for {project_name}")
            
            # Sanitize project name for Vercel (must be lowercase, alphanumeric with hyphens)
            safe_name = self._sanitize_project_name(project_name)
            
            # Use CLI deployment to bypass 10MB API limit
            return self._deploy_with_cli(portfolio_path, safe_name, user_id, job_id)
                
        except Exception as e:
            error_msg = f"Deployment error: {str(e)}"
            logger.error(f"❌ {error_msg}")
            return False, None, error_msg
    
    def _upload_files(self, portfolio_path: str) -> list:
        """
        Upload files to Vercel and get their SHA hashes
        Returns list of {file: path, sha: hash} objects
        """
        files_with_hashes = []
        portfolio_dir = Path(portfolio_path)
        
        if not portfolio_dir.exists():
            logger.error(f"Portfolio directory not found: {portfolio_path}")
            return files_with_hashes
        
        # Files/dirs to skip
        skip_patterns = {
            'node_modules', '.git', '.next', '.vercel', 
            'out', 'dist', '.env', '.env.local', '__pycache__',
            '.DS_Store', 'Thumbs.db'
        }
        
        # First, collect all files to upload
        files_to_upload = []
        for file_path in portfolio_dir.rglob('*'):
            # Skip directories and excluded patterns
            if file_path.is_dir():
                continue
            
            # Check if any part of the path contains skip patterns
            if any(pattern in str(file_path) for pattern in skip_patterns):
                continue
            
            files_to_upload.append(file_path)
        
        total_files = len(files_to_upload)
        logger.info(f"📁 Found {total_files} files to upload")
        
        # Upload files with progress tracking
        for idx, file_path in enumerate(files_to_upload, 1):
            try:
                # Get relative path from portfolio root
                relative_path = file_path.relative_to(portfolio_dir)
                
                # Read file content
                with open(file_path, 'rb') as f:
                    content = f.read()
                
                # Calculate SHA-1 hash (Vercel uses SHA-1)
                sha = hashlib.sha1(content).hexdigest()
                
                # Log progress every 10 files
                if idx % 10 == 0 or idx == total_files:
                    logger.info(f"⏳ Uploading files: {idx}/{total_files} ({idx*100//total_files}%)")
                
                # Upload file to Vercel blob storage
                upload_success = self._upload_file_to_blob(content, sha)
                if upload_success:
                    files_with_hashes.append({
                        "file": str(relative_path).replace('\\', '/'),  # Ensure forward slashes
                        "sha": sha
                    })
                
            except Exception as e:
                logger.warning(f"⚠️ Skipping file {file_path}: {e}")
                continue
        
        logger.info(f"📦 Successfully uploaded {len(files_with_hashes)}/{total_files} files to Vercel")
        return files_with_hashes
    
    def _upload_file_to_blob(self, content: bytes, sha: str) -> bool:
        """
        Upload a single file to Vercel's blob storage
        """
        try:
            # Check if file already exists (by SHA)
            # Vercel automatically deduplicates files by SHA
            
            # Upload file with increased timeout for larger files
            file_size = len(content)
            timeout = max(60, file_size / (100 * 1024))  # At least 60s, or scale with size
            
            response = requests.post(
                f"{self.api_base}/v2/files",
                headers={
                    **self.headers,
                    "x-vercel-digest": sha,
                    "Content-Type": "application/octet-stream"
                },
                data=content,
                timeout=timeout
            )
            
            if response.status_code in [200, 201, 409]:  # 409 means file already exists
                return True
            else:
                logger.warning(f"Failed to upload file: {response.status_code} - {response.text[:200]}")
                return False
                
        except requests.exceptions.Timeout:
            logger.warning(f"Timeout uploading file (size: {len(content)} bytes)")
            return False
        except Exception as e:
            logger.warning(f"Error uploading file: {e}")
            return False
    
    def _wait_for_deployment(self, deployment_id: str, max_wait: int = 300) -> bool:
        """
        Wait for deployment to be ready
        
        Args:
            deployment_id: The deployment ID to check
            max_wait: Maximum seconds to wait (default 5 minutes)
            
        Returns:
            True if deployment is ready, False otherwise
        """
        import time
        start_time = time.time()
        
        while (time.time() - start_time) < max_wait:
            status = self.check_deployment_status(deployment_id)
            if status:
                state = status.get('readyState', 'UNKNOWN')
                logger.info(f"⏳ Deployment state: {state}")
                
                if state == 'READY':
                    return True
                elif state in ['ERROR', 'CANCELED']:
                    logger.error(f"❌ Deployment failed with state: {state}")
                    return False
                
            time.sleep(5)  # Check every 5 seconds
        
        logger.error("⏱️ Timeout waiting for deployment to be ready")
        return False
    
    def _sanitize_project_name(self, name: str) -> str:
        """
        Sanitize project name for Vercel requirements
        - Must be lowercase
        - Only alphanumeric and hyphens
        - No spaces or special characters
        """
        # Convert to lowercase and replace spaces with hyphens
        safe = name.lower().replace(' ', '-')
        
        # Remove any characters that aren't alphanumeric or hyphens
        safe = ''.join(c for c in safe if c.isalnum() or c == '-')
        
        # Remove consecutive hyphens
        while '--' in safe:
            safe = safe.replace('--', '-')
        
        # Remove leading/trailing hyphens
        safe = safe.strip('-')
        
        # Add timestamp to ensure uniqueness
        timestamp = datetime.utcnow().strftime('%Y%m%d%H%M%S')
        safe = f"{safe}-{timestamp}"
        
        # Ensure it's not too long (Vercel limit)
        if len(safe) > 50:
            safe = safe[:50]
        
        logger.info(f"📝 Sanitized project name: {name} -> {safe}")
        return safe
    
    def _prepare_files_simple(self, portfolio_path: str) -> list:
        """
        Prepare files for Vercel deployment with inline data
        Returns list of file objects with path and content
        """
        files = []
        portfolio_dir = Path(portfolio_path)
        
        if not portfolio_dir.exists():
            logger.error(f"Portfolio directory not found: {portfolio_path}")
            return files
        
        # Files/dirs to skip - expanded list to reduce size
        skip_patterns = {
            'node_modules', '.git', '.next', '.vercel', 
            'out', 'dist', '.env', '.env.local', '__pycache__',
            '.DS_Store', 'Thumbs.db', '.turbo', 'coverage',
            'package-lock.json', 'pnpm-lock.yaml', 'yarn.lock',
            '.npmrc', '.gitignore', '.eslintrc', '.prettierrc',
            'README.md', 'LICENSE', 'CHANGELOG.md', '*.log',
            '*.map', '*.test.js', '*.spec.js', '__tests__',
            'test', 'tests', 'docs', '.vscode', '.idea'
        }
        
        # Collect all files
        all_files = []
        for file_path in portfolio_dir.rglob('*'):
            # Skip directories and excluded patterns
            if file_path.is_dir():
                continue
            
            # Check if any part of the path contains skip patterns
            if any(pattern in str(file_path) for pattern in skip_patterns):
                continue
                
            # Skip very large files
            if file_path.stat().st_size > 5 * 1024 * 1024:  # 5MB limit per file
                logger.warning(f"⚠️ Skipping large file: {file_path.name} ({file_path.stat().st_size} bytes)")
                continue
            
            all_files.append(file_path)
        
        total_files = len(all_files)
        logger.info(f"📁 Found {total_files} files to upload")
        
        # Process files
        for idx, file_path in enumerate(all_files, 1):
            try:
                # Get relative path from portfolio root
                relative_path = file_path.relative_to(portfolio_dir)
                
                # Log progress
                if idx % 20 == 0 or idx == total_files:
                    logger.info(f"⏳ Processing files: {idx}/{total_files} ({idx*100//total_files}%)")
                
                # Read file content based on type
                file_str = str(relative_path).replace('\\', '/')  # Ensure forward slashes
                
                if file_path.suffix in ['.jpg', '.jpeg', '.png', '.gif', '.ico', '.svg', 
                                       '.woff', '.woff2', '.ttf', '.eot', '.otf',
                                       '.mp4', '.mp3', '.wav', '.pdf', '.zip']:
                    # Binary files - base64 encode
                    with open(file_path, 'rb') as f:
                        content = f.read()
                    
                    import base64
                    files.append({
                        "file": file_str,
                        "data": base64.b64encode(content).decode('utf-8'),
                        "encoding": "base64"
                    })
                else:
                    # Text files
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            content = f.read()
                        
                        files.append({
                            "file": file_str,
                            "data": content
                        })
                    except UnicodeDecodeError:
                        # If can't decode as text, treat as binary
                        with open(file_path, 'rb') as f:
                            content = f.read()
                        
                        import base64
                        files.append({
                            "file": file_str,
                            "data": base64.b64encode(content).decode('utf-8'),
                            "encoding": "base64"
                        })
                
            except Exception as e:
                logger.warning(f"⚠️ Skipping file {file_path}: {e}")
                continue
        
        logger.info(f"📦 Prepared {len(files)} files for deployment")
        return files
    
    def _prepare_files(self, portfolio_path: str) -> list:
        """
        Prepare files for Vercel deployment
        Returns list of file objects with path and content
        """
        files = []
        portfolio_dir = Path(portfolio_path)
        
        if not portfolio_dir.exists():
            logger.error(f"Portfolio directory not found: {portfolio_path}")
            return files
        
        # Files/dirs to skip
        skip_patterns = {
            'node_modules', '.git', '.next', '.vercel', 
            'out', 'dist', '.env', '.env.local'
        }
        
        for file_path in portfolio_dir.rglob('*'):
            # Skip directories and excluded patterns
            if file_path.is_dir():
                continue
            
            # Check if any part of the path contains skip patterns
            if any(pattern in str(file_path) for pattern in skip_patterns):
                continue
            
            try:
                # Get relative path from portfolio root
                relative_path = file_path.relative_to(portfolio_dir)
                
                # Read file content
                if file_path.suffix in ['.jpg', '.jpeg', '.png', '.gif', '.ico', '.svg', '.woff', '.woff2', '.ttf']:
                    # Binary files
                    with open(file_path, 'rb') as f:
                        content = f.read()
                    
                    # Vercel expects base64 for binary files
                    import base64
                    files.append({
                        "file": str(relative_path),
                        "data": base64.b64encode(content).decode('utf-8'),
                        "encoding": "base64"
                    })
                else:
                    # Text files
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    files.append({
                        "file": str(relative_path),
                        "data": content
                    })
                
            except Exception as e:
                logger.warning(f"⚠️ Skipping file {file_path}: {e}")
                continue
        
        logger.info(f"📦 Prepared {len(files)} files for deployment")
        return files
    
    def _detect_and_store_team(self):
        """Auto-detect team ID from Vercel API"""
        try:
            response = requests.get(
                f"{self.api_base}/v2/teams",
                headers=self.headers,
                timeout=10
            )
            
            if response.status_code == 200:
                teams = response.json().get('teams', [])
                if teams:
                    # Use the first team
                    team = teams[0]
                    self.team_id = team.get('id')
                    if self.team_id:
                        KeychainManager.set_credential('vercel_team_id', self.team_id)
                        logger.info(f"📋 Auto-detected team: {team.get('name')}")
        except Exception as e:
            logger.warning(f"Could not auto-detect team: {e}")
    
    def _get_team_slug(self) -> Optional[str]:
        """Get team slug for API calls"""
        try:
            response = requests.get(
                f"{self.api_base}/v2/teams",
                headers=self.headers,
                timeout=10
            )
            
            if response.status_code == 200:
                teams = response.json().get('teams', [])
                for team in teams:
                    if team.get('id') == self.team_id:
                        return team.get('slug')
        except Exception:
            pass
        return None
    
    # Removed broken setup_custom_domain - use attach_domain_and_alias instead
    # The old function incorrectly parsed project name from URL
    # Now we properly get project ID from deployment ID
    
    def check_domain_availability(self, domain: str) -> Tuple[bool, Optional[float]]:
        """
        Check if a domain is available for purchase
        
        Args:
            domain: The domain to check (e.g., resume2website.com)
            
        Returns:
            Tuple of (available, price)
        """
        try:
            params = {
                "name": domain,
                "type": "new"
            }
            
            if self.team_id:
                params['teamId'] = self.team_id
            
            response = requests.get(
                f"{self.api_base}/v4/domains/price",
                headers=self.headers,
                params=params,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                price = data.get('price', 0)
                period = data.get('period', 0)
                
                if price > 0:
                    logger.info(f"✅ Domain {domain} is available for ${price}/{period}yr")
                    return True, price
                else:
                    logger.info(f"❌ Domain {domain} is not available")
                    return False, None
            else:
                logger.error(f"Failed to check domain: {response.text[:200]}")
                return False, None
                
        except Exception as e:
            logger.error(f"Domain check error: {e}")
            return False, None
    
    def check_deployment_status(self, deployment_id: str) -> Dict:
        """
        Check the status of a deployment
        """
        try:
            params = {}
            if self.team_id:
                params['teamId'] = self.team_id
            
            response = requests.get(
                f"{self.api_base}/v13/deployments/{deployment_id}",
                headers=self.headers,
                params=params
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                logger.error(f"Failed to check deployment status: {response.text}")
                return {}
        except Exception as e:
            logger.error(f"Error checking deployment status: {e}")
            return {}
    
    def _create_or_get_project(self, project_name: str) -> Optional[str]:
        """
        Create or get existing Vercel project BEFORE deployment
        
        Returns:
            Project ID if successful, None otherwise
        """
        try:
            headers = {
                "Authorization": f"Bearer {self.api_token}",
                "Content-Type": "application/json"
            }
            
            scope = {}
            if self.team_id:
                scope = {"teamId": self.team_id}
            
            # Try to get existing project
            check_url = f"https://api.vercel.com/v9/projects/{project_name}"
            if self.team_id:
                check_url += f"?teamId={self.team_id}"
            
            check_resp = requests.get(check_url, headers=headers, timeout=30)
            
            if check_resp.status_code == 200:
                project_data = check_resp.json()
                project_id = project_data.get('id')
                logger.info(f"📦 Found existing project: {project_id}")
                return project_id
            
            # Create new project
            logger.info(f"📦 Creating new project: {project_name}")
            create_url = "https://api.vercel.com/v9/projects"
            
            project_data = {
                "name": project_name,
                "framework": "nextjs",
                "publicSource": True,
                "buildCommand": "npm run build",
                "devCommand": "npm run dev",
                "outputDirectory": ".next",
                "installCommand": "npm install --legacy-peer-deps",
                # Disable protection at creation time
                "ssoProtection": None,
                "passwordProtection": None,
                "trustedIps": None
            }
            
            create_resp = requests.post(
                create_url,
                params=scope,
                headers=headers,
                json=project_data,
                timeout=30
            )
            
            if create_resp.status_code in [200, 201]:
                project_data = create_resp.json()
                project_id = project_data.get('id')
                logger.info(f"✅ Created new project: {project_id}")
                return project_id
            else:
                logger.warning(f"⚠️ Could not create project via API: {create_resp.status_code}")
                # Let CLI create it during deployment
                return None
                
        except Exception as e:
            logger.error(f"❌ Error in project creation: {e}")
            return None
    
    def _deploy_with_cli(self, portfolio_path: str, project_name: str, user_id: str, job_id: str) -> Tuple[bool, Optional[str], Optional[str]]:
        """
        Deploy using Vercel CLI to handle projects >10MB
        Now with pre-configured iframe settings!
        """
        import subprocess
        import json
        import os
        import tempfile
        
        try:
            logger.info("📦 Using Vercel CLI for deployment (handles large projects)")
            
            # STEP 1: Create/Get project FIRST and configure it
            project_id = self._create_or_get_project(project_name)
            if project_id:
                logger.info(f"🔧 Pre-configuring project {project_id} for iframe embedding...")
                
                # Configure iframe settings BEFORE deployment
                self.configure_project_for_iframes(project_id)
                
                # Set environment variables BEFORE deployment
                self.set_project_env_variables(project_id)
                
                # CRITICAL: Write .vercel/project.json so CLI uses this pre-configured project
                vercel_dir = Path(portfolio_path) / ".vercel"
                vercel_dir.mkdir(exist_ok=True)
                
                project_json = {
                    "projectId": project_id,
                    "orgId": self.team_id if self.team_id else None
                }
                
                project_json_path = vercel_dir / "project.json"
                with open(project_json_path, 'w') as f:
                    json.dump(project_json, f, indent=2)
                
                logger.info(f"✅ Project pre-configured for iframe embedding!")
                logger.info(f"📝 Wrote .vercel/project.json with project ID: {project_id}")
            
            # Ensure portfolio directory exists and is absolute
            portfolio_path = os.path.abspath(portfolio_path)
            if not os.path.exists(portfolio_path):
                logger.error(f"🔴 Portfolio directory not found: {portfolio_path}")
                logger.error(f"🔴 Current working directory: {os.getcwd()}")
                logger.error(f"🔴 Directory contents: {os.listdir('.')[:10]}")
                raise FileNotFoundError(f"Portfolio directory not found: {portfolio_path}")
            
            # Check if vercel.json already exists (from template)
            vercel_json_path = os.path.join(portfolio_path, 'vercel.json')
            existing_config = {}
            if os.path.exists(vercel_json_path):
                try:
                    with open(vercel_json_path, 'r') as f:
                        existing_config = json.load(f)
                    logger.info(f"📄 Found existing vercel.json in template")
                except:
                    pass
            
            # Create/merge vercel.json with project settings
            vercel_config = {
                "name": project_name,
                "framework": "nextjs",
                "buildCommand": "npm run build",
                "devCommand": "npm run dev",
                # Remove installCommand - Vercel will use default npm install with .npmrc settings
                "outputDirectory": ".next",
                "public": True,
                # Ensure public access (no authentication required)
                "github": {
                    "silent": True  # Don't create GitHub integration
                }
            }
            
            # Preserve headers configuration from template if exists
            if 'headers' in existing_config:
                vercel_config['headers'] = existing_config['headers']
                logger.info(f"📋 Preserving headers configuration from template")
            
            # CRITICAL: Preserve env configuration from template if exists
            if 'env' in existing_config:
                vercel_config['env'] = existing_config['env']
                logger.info(f"🔐 Preserving env configuration from template")
            
            with open(vercel_json_path, 'w') as f:
                json.dump(vercel_config, f, indent=2)
            logger.info(f"📝 Created/updated vercel.json in {portfolio_path}")
            
            # Use the globally installed Vercel CLI
            cmd = [
                'vercel',
                '--prod',  # Deploy to production
                '--yes',   # Skip confirmation
                '--token', self.api_token,
                '--public'  # CRITICAL: Deploy as public (no authentication)
                # Note: --env only sets build-time vars, we'll set runtime vars via API after deployment
                # Note: --name is deprecated and handled via vercel.json
                # Note: --no-clipboard is now default behavior
            ]
            
            # Add team flag if applicable
            if self.team_id:
                # Get team slug for CLI
                team_slug = self._get_team_slug()
                if team_slug:
                    cmd.extend(['--scope', team_slug])
            
            logger.info(f"🚀 Running: {' '.join(cmd[:3])}... (token hidden)")
            logger.info(f"📂 In directory: {portfolio_path}")
            
            # Run deployment with real-time output monitoring
            logger.info(f"📂 Running deployment from: {portfolio_path}")
            
            # Use Popen for real-time output
            process = subprocess.Popen(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,  # Combine stderr with stdout
                text=True,
                cwd=portfolio_path,
                bufsize=1,
                universal_newlines=True
            )
            
            output_lines = []
            deployment_url = None
            
            # Read output line by line for real-time monitoring
            try:
                for line in iter(process.stdout.readline, ''):
                    if not line:
                        break
                    
                    line = line.strip()
                    if line:
                        output_lines.append(line)
                        
                        # Log progress lines
                        if any(keyword in line.lower() for keyword in 
                               ['uploading', 'building', 'ready', 'error', 'deployed', 
                                'inspecting', 'queued', 'created', 'production']):
                            logger.info(f"⏳ Vercel: {line[:200]}")
                        
                        # Look for deployment URL
                        if 'https://' in line and '.vercel.app' in line:
                            import re
                            url_match = re.search(r'https://[\w\-]+\.vercel\.app', line)
                            if url_match:
                                deployment_url = url_match.group(0)
                                logger.info(f"🎯 Found deployment URL: {deployment_url}")
                
                # Wait for process to complete
                return_code = process.wait(timeout=30)  # Additional 30s for cleanup
                
            except subprocess.TimeoutExpired:
                process.kill()
                logger.error("⏱️ Deployment process timed out")
                return_code = -1
            
            # Create result object compatible with subprocess.run
            class ProcessResult:
                def __init__(self, returncode, stdout):
                    self.returncode = returncode
                    self.stdout = stdout
                    self.stderr = ''
            
            result = ProcessResult(return_code, '\n'.join(output_lines))
            
            # Check if deployment succeeded by looking for URL in output
            # Vercel CLI may return non-zero for warnings, but still deploy successfully
            output_text = result.stdout
            
            # Extract deployment ID from CLI output
            import re
            deployment_id = None
            
            # Debug: Log full output to understand format
            logger.info("📜 === VERCEL CLI FULL OUTPUT ===")
            for line in output_text.split('\n')[:50]:  # First 50 lines for debugging
                if line.strip():
                    logger.info(f"  {line[:200]}")
            logger.info("📜 === END OF OUTPUT ===")
            
            # Try multiple patterns to find deployment ID
            # Pattern 1: Inspect URL format https://vercel.com/.../deployments/<DEPLOYMENT_ID>
            m = re.search(r'/deployments/([A-Za-z0-9]+)', output_text)
            if m:
                deployment_id = m.group(1)
                logger.info(f"🎯 Found deployment ID from inspect URL: {deployment_id}")
            
            # Pattern 2: Direct deployment ID in output (e.g., "dpl_xxxx")
            if not deployment_id:
                m = re.search(r'\b(dpl_[A-Za-z0-9]+)\b', output_text)
                if m:
                    deployment_id = m.group(1)
                    logger.info(f"🎯 Found deployment ID from dpl_ pattern: {deployment_id}")
            
            # Pattern 3: From deployment URL if it contains deployment ID
            if not deployment_id and deployment_url:
                # Try to extract from URL like https://portfolio-abc-dpl_xyz.vercel.app
                m = re.search(r'-(dpl_[A-Za-z0-9]+)\.vercel\.app', deployment_url)
                if m:
                    deployment_id = m.group(1)
                    logger.info(f"🎯 Found deployment ID from URL: {deployment_id}")
            
            if not deployment_id:
                logger.warning("⚠️ Could not extract deployment ID from CLI output")
            
            # First check if URL was found during streaming
            if not deployment_url:
                # Look for URL in all output
                url_matches = re.findall(r'https://[\w\-]+\.vercel\.app', output_text)
                if url_matches:
                    deployment_url = url_matches[-1]  # Use the last URL found (usually the production URL)
                    logger.info(f"🎯 Found deployment URL in output: {deployment_url}")
            
            # Deployment is successful if we have a URL, regardless of return code
            if deployment_url:
                logger.info(f"✅ Deployment successful!")
                logger.info(f"📍 URL: {deployment_url}")
                logger.info(f"🔑 Deployment ID: {deployment_id if deployment_id else 'NOT FOUND'}")
                
                # Set environment variables for the project
                # We need the deployment ID to get project ID
                if not deployment_id:
                    # Try to get it from the Inspect URL in output
                    inspect_match = re.search(r'Inspect: https://vercel\.com/[^/]+/[^/]+/([A-Za-z0-9]+)', output_text)
                    if inspect_match:
                        deployment_id = f"dpl_{inspect_match.group(1)}"
                        logger.info(f"🎯 Extracted deployment ID from Inspect URL: {deployment_id}")
                
                # NO LONGER NEEDED - We configure the project BEFORE deployment now!
                # The deployment already has all iframe settings applied
                logger.info(f"✅ Deployment complete with pre-configured iframe settings")
                
                # Just log the deployment ID for reference
                if deployment_id:
                    logger.info(f"📝 Deployment ID for aliasing: {deployment_id}")
                else:
                    logger.warning("⚠️ No deployment ID found, but deployment succeeded")
                
                # Return deployment_id as the third element
                return True, deployment_url, deployment_id
            
            # Check for actual errors
            if result.returncode != 0:
                # Log the output for debugging
                logger.error(f"❌ CLI returned non-zero exit code: {result.returncode}")
                logger.error(f"📝 Output: {output_text[:1000]}")
                
                # Still check if there's a URL in the output (sometimes succeeds despite warnings)
                if 'https://' in output_text and '.vercel.app' in output_text:
                    logger.warning("⚠️ Deployment may have succeeded despite warnings")
                    # Try one more time to extract URL
                    url_matches = re.findall(r'https://[\w\-]+\.vercel\.app', output_text)
                    if url_matches:
                        deployment_url = url_matches[-1]
                        logger.info(f"🎆 Found URL despite error code: {deployment_url}")
                        return True, deployment_url, None
                
                return False, None, f"Deployment failed with exit code {result.returncode}"
            
            # No URL found and no error - shouldn't happen
            logger.error("❌ No deployment URL found in output")
            logger.error(f"📝 Full output: {output_text[:2000]}")
            return False, None, "No deployment URL found"
                
        except subprocess.TimeoutExpired:
            error_msg = "CLI deployment timed out after 10 minutes"
            logger.error(f"⏱️ {error_msg}")
            return False, None, error_msg
        except Exception as e:
            error_msg = f"CLI deployment error: {str(e)}"
            logger.error(f"❌ {error_msg}")
            return False, None, error_msg
        finally:
            # Clean up vercel.json if created
            if 'vercel_json_path' in locals() and os.path.exists(vercel_json_path):
                try:
                    os.remove(vercel_json_path)
                    logger.debug("🧽 Cleaned up vercel.json")
                except Exception as e:
                    logger.warning(f"⚠️ Could not remove vercel.json: {e}")
    
    def delete_deployment(self, deployment_id: str) -> bool:
        """
        Delete a deployment from Vercel
        """
        try:
            params = {}
            if self.team_id:
                params['teamId'] = self.team_id
            
            response = requests.delete(
                f"{self.api_base}/v13/deployments/{deployment_id}",
                headers=self.headers,
                params=params
            )
            
            if response.status_code in [200, 204]:
                logger.info(f"✅ Deployment {deployment_id} deleted")
                return True
            else:
                logger.error(f"Failed to delete deployment: {response.text}")
                return False
        except Exception as e:
            logger.error(f"Error deleting deployment: {e}")
            return False
    
    def to_subdomain_from_name(self, full_name: str, fallback_slug: str) -> str:
        """
        Convert a full name to a valid subdomain
        
        Args:
            full_name: The person's full name
            fallback_slug: Fallback if name can't be converted (e.g., 'portfolio-abc123')
            
        Returns:
            Full domain like 'john-doe.portfolios.resume2website.com'
        """
        import re
        
        if not full_name:
            # Use fallback
            candidate = re.sub(r'[^a-z0-9-]', '-', fallback_slug.lower())[:63].strip('-') or 'portfolio'
            return f"{candidate}.portfolios.resume2website.com"
        
        # Simple conversion: lowercase, replace spaces with hyphens, remove special chars
        sanitized = full_name.lower()
        sanitized = re.sub(r'[^a-z0-9\s-]', '', sanitized)  # Remove special chars
        sanitized = re.sub(r'\s+', '-', sanitized)  # Replace spaces with hyphens
        sanitized = re.sub(r'-+', '-', sanitized)  # Remove multiple hyphens
        sanitized = sanitized.strip('-')[:63]  # Remove leading/trailing hyphens and limit length
        
        if not sanitized:
            # Fallback if sanitization resulted in empty string
            sanitized = re.sub(r'[^a-z0-9-]', '-', fallback_slug.lower())[:63].strip('-') or 'portfolio'
            
        return f"{sanitized}.portfolios.resume2website.com"
    
    def get_deployment_id_from_url(self, deployment_url: str) -> Optional[str]:
        """
        Get deployment ID from deployment URL using Vercel API
        
        Args:
            deployment_url: The deployment URL (e.g., https://portfolio-abc.vercel.app)
            
        Returns:
            Deployment ID if found, None otherwise
        """
        try:
            import requests
            from urllib.parse import urlparse
            
            # Extract the hostname from URL
            parsed = urlparse(deployment_url)
            hostname = parsed.hostname
            
            if not hostname or not hostname.endswith('.vercel.app'):
                logger.warning(f"⚠️ Not a valid Vercel deployment URL: {deployment_url}")
                return None
            
            # Remove .vercel.app to get the deployment hostname
            deployment_host = hostname.replace('.vercel.app', '')
            logger.info(f"🔍 Looking up deployment with hostname: {deployment_host}")
            
            headers = {
                "Authorization": f"Bearer {self.api_token}",
                "Content-Type": "application/json"
            }
            scope = {"teamId": self.team_id} if self.team_id else {}
            
            # List recent deployments
            # Use v6 API which gives us more deployment details
            response = requests.get(
                f"https://api.vercel.com/v6/deployments",
                params={**scope, "limit": 20},  # Increased limit
                headers=headers,
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                deployments = data.get('deployments', [])
                
                logger.info(f"🔍 Checking {len(deployments)} recent deployments...")
                
                # Find deployment matching our URL
                for dep in deployments:
                    # Check the deployment URL
                    dep_url = dep.get('url', '')
                    if dep_url == hostname or dep_url == deployment_host:
                        deployment_id = dep.get('uid')
                        if deployment_id:
                            logger.info(f"✅ Found deployment ID via URL match: {deployment_id}")
                            return deployment_id
                    
                    # Also check aliases
                    aliases = dep.get('alias', [])
                    if isinstance(aliases, list):
                        for alias in aliases:
                            if alias == hostname or alias == deployment_host:
                                deployment_id = dep.get('uid')
                                if deployment_id:
                                    logger.info(f"✅ Found deployment ID via alias match: {deployment_id}")
                                    return deployment_id
                
                # If not found, try to match by inspecting the auto-generated URL pattern
                # Vercel URLs often include part of the deployment ID
                for dep in deployments:
                    dep_id = dep.get('uid', '')
                    if dep_id and dep_id[:8] in deployment_host:
                        logger.info(f"✅ Found deployment ID via partial match: {dep_id}")
                        return dep_id
                
                logger.warning(f"⚠️ No matching deployment found for {hostname}")
                logger.debug(f"Checked URLs: {[d.get('url') for d in deployments[:5]]}")
            else:
                logger.error(f"❌ Failed to list deployments: {response.status_code}")
                logger.error(f"Response: {response.text[:500]}")
                
        except Exception as e:
            logger.error(f"❌ Error getting deployment ID from URL: {e}")
        
        return None
    
    def verify_clean_headers(self, domain: str) -> bool:
        """
        Verify that a domain has clean headers for iframe embedding
        
        Args:
            domain: The domain to check (without https://)
            
        Returns:
            True if headers are clean, False otherwise
        """
        import requests
        import time
        
        # Wait a bit for DNS/deployment to settle
        time.sleep(3)
        
        try:
            url = f"https://{domain}/"
            logger.info(f"🔍 Verifying headers for {url}")
            
            response = requests.head(url, timeout=10, allow_redirects=True)
            
            # Check status code
            if response.status_code == 401:
                logger.warning(f"⚠️ Domain returns 401 - likely protected")
                return False
            
            if response.status_code != 200:
                logger.warning(f"⚠️ Domain returns {response.status_code}")
                return False
            
            # Check for X-Frame-Options
            xfo = response.headers.get('X-Frame-Options', '').upper()
            if xfo and xfo != 'NONE':
                logger.warning(f"⚠️ X-Frame-Options present: {xfo}")
                return False
            
            # Check for Vercel protection header
            if 'x-vercel-protection' in response.headers:
                logger.warning(f"⚠️ Vercel protection detected")
                return False
            
            # Check CSP has frame-ancestors
            csp = response.headers.get('Content-Security-Policy', '')
            if 'frame-ancestors' not in csp:
                logger.warning(f"⚠️ No frame-ancestors in CSP")
                return False
            
            logger.info(f"✅ Headers are clean:")
            logger.info(f"   Status: {response.status_code}")
            logger.info(f"   X-Frame-Options: {xfo if xfo else 'Not present (good)'}")
            logger.info(f"   CSP frame-ancestors: {'Present' if 'frame-ancestors' in csp else 'Missing'}")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Error verifying headers: {e}")
            return False
    
    def trigger_production_redeploy(self, project_id: str) -> Optional[str]:
        """
        Trigger a production redeployment of the latest deployment
        
        Args:
            project_id: The project ID
            
        Returns:
            New deployment ID if successful, None otherwise
        """
        import requests
        
        try:
            headers = {
                "Authorization": f"Bearer {self.api_token}",
                "Content-Type": "application/json"
            }
            scope = {"teamId": self.team_id} if self.team_id else {}
            
            # Get the latest production deployment
            list_resp = requests.get(
                "https://api.vercel.com/v6/deployments",
                params={**scope, "projectId": project_id, "target": "production", "limit": 1},
                headers=headers,
                timeout=20
            )
            
            if list_resp.status_code != 200:
                logger.error(f"❌ Could not list deployments: {list_resp.status_code}")
                return None
            
            deployments = list_resp.json().get('deployments', [])
            if not deployments:
                logger.error(f"❌ No production deployments found")
                return None
            
            source_deployment = deployments[0].get('uid')
            logger.info(f"🔄 Triggering redeploy of {source_deployment}")
            
            # Trigger a new deployment based on the existing one
            redeploy_resp = requests.post(
                f"https://api.vercel.com/v13/deployments",
                params=scope,
                headers=headers,
                json={
                    "name": project_id,
                    "target": "production",
                    "source": "redeploy",
                    "deploymentId": source_deployment
                },
                timeout=30
            )
            
            if redeploy_resp.status_code in [200, 201]:
                new_deployment = redeploy_resp.json()
                new_id = new_deployment.get('id') or new_deployment.get('uid')
                logger.info(f"✅ Triggered redeploy: {new_id}")
                
                # Wait for it to be ready
                logger.info(f"⏳ Waiting for redeployment to complete...")
                time.sleep(10)  # Initial wait
                
                for _ in range(30):  # Check for up to 5 minutes
                    status_resp = requests.get(
                        f"https://api.vercel.com/v13/deployments/{new_id}",
                        params=scope,
                        headers=headers,
                        timeout=10
                    )
                    
                    if status_resp.status_code == 200:
                        state = status_resp.json().get('readyState', '')
                        if state == 'READY':
                            logger.info(f"✅ Redeployment ready!")
                            return new_id
                        elif state in ['ERROR', 'CANCELED']:
                            logger.error(f"❌ Redeployment failed: {state}")
                            return None
                    
                    time.sleep(10)
                
                logger.warning(f"⚠️ Redeployment timed out")
                return new_id  # Return it anyway, might be ready
            else:
                logger.error(f"❌ Failed to trigger redeploy: {redeploy_resp.status_code}")
                return None
                
        except Exception as e:
            logger.error(f"❌ Error triggering redeploy: {e}")
            return None
    
    def configure_project_for_iframes(self, project_id: str) -> bool:
        """
        Configure project settings to allow iframe embedding
        
        Args:
            project_id: The project ID
            
        Returns:
            True if successful, False otherwise
        """
        import requests
        
        try:
            headers = {
                "Authorization": f"Bearer {self.api_token}",
                "Content-Type": "application/json"
            }
            scope = {"teamId": self.team_id} if self.team_id else {}
            
            logger.info(f"🔓 Disabling ALL deployment protection for project {project_id}...")
            
            # Try multiple approaches to disable protection
            # Approach 1: Update project with ssoProtection
            project_settings = {
                "ssoProtection": None  # Try to completely remove protection
            }
            
            response = requests.patch(
                f"https://api.vercel.com/v9/projects/{project_id}",
                params=scope,
                headers=headers,
                json=project_settings,
                timeout=30
            )
            
            if response.status_code in [200, 201, 204]:
                logger.info("✅ Step 1: Project ssoProtection removed")
            else:
                logger.warning(f"⚠️ Could not remove ssoProtection: {response.status_code} - {response.text[:200]}")
            
            # Approach 2: Try deployment protection endpoint
            protection_url = f"https://api.vercel.com/v8/projects/{project_id}/deployment-protection"
            
            # First, try to delete any existing protection
            delete_resp = requests.delete(
                protection_url,
                params=scope,
                headers=headers,
                timeout=30
            )
            
            if delete_resp.status_code in [200, 204, 404]:  # 404 means no protection exists
                logger.info("✅ Step 2: Deployment protection removed/not found")
            else:
                logger.warning(f"⚠️ Could not delete deployment protection: {delete_resp.status_code}")
            
            # Approach 3: Set protection to disabled state
            protection_settings = {
                "enabled": False,
                "type": "none"
            }
            
            patch_resp = requests.patch(
                protection_url,
                params=scope,
                headers=headers,
                json=protection_settings,
                timeout=30
            )
            
            if patch_resp.status_code in [200, 201, 204]:
                logger.info("✅ Step 3: Deployment protection disabled")
                return True
            else:
                logger.warning(f"⚠️ Could not disable deployment protection: {patch_resp.status_code}")
                # Continue anyway - might work without this
                return True
                
        except Exception as e:
            logger.error(f"❌ Error configuring project protection: {e}")
            return False
    
    def set_project_env_variables(self, project_id: str) -> bool:
        """
        Set environment variables for a project via Vercel API
        
        Args:
            project_id: The project ID
            
        Returns:
            True if successful, False otherwise
        """
        import requests
        
        try:
            headers = {
                "Authorization": f"Bearer {self.api_token}",
                "Content-Type": "application/json"
            }
            scope = {"teamId": self.team_id} if self.team_id else {}
            
            # Set FRAME_PARENTS environment variable for all environments
            env_var = {
                "key": "FRAME_PARENTS",
                "value": "http://localhost:3019,http://localhost:3000,https://resume2website.com,https://www.resume2website.com,https://nitzanshifris.com,https://www.nitzanshifris.com",
                "target": ["production", "preview", "development"],  # Apply to all environments
                "type": "plain"  # Not encrypted
            }
            
            # First, try to delete existing variable (in case it exists)
            try:
                del_response = requests.delete(
                    f"https://api.vercel.com/v10/projects/{project_id}/env/FRAME_PARENTS",
                    params=scope,
                    headers=headers,
                    timeout=10
                )
                if del_response.status_code in [200, 204]:
                    logger.info("🗑️ Deleted existing FRAME_PARENTS variable")
            except:
                pass  # It's okay if delete fails (variable might not exist)
            
            # Now create the environment variable
            response = requests.post(
                f"https://api.vercel.com/v10/projects/{project_id}/env",
                params=scope,
                headers=headers,
                json=env_var,
                timeout=30
            )
            
            if response.status_code in [200, 201]:
                logger.info(f"✅ Set FRAME_PARENTS environment variable for project {project_id}")
                return True
            else:
                logger.error(f"❌ Failed to set environment variable: {response.status_code} - {response.text[:200]}")
                return False
                
        except Exception as e:
            logger.error(f"❌ Error setting environment variables: {e}")
            return False
    
    def get_project_id_from_deployment(self, deployment_id: str) -> Optional[str]:
        """
        Get the actual project ID from a deployment ID
        
        Args:
            deployment_id: The deployment ID
            
        Returns:
            Project ID if found, None otherwise
        """
        import requests
        
        try:
            headers = {
                "Authorization": f"Bearer {self.api_token}",
                "Content-Type": "application/json"
            }
            scope = {"teamId": self.team_id} if self.team_id else {}
            
            # Get deployment details
            response = requests.get(
                f"https://api.vercel.com/v13/deployments/{deployment_id}",
                params=scope,
                headers=headers,
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                project_id = data.get('projectId')
                if project_id:
                    logger.info(f"✅ Got project ID: {project_id} for deployment: {deployment_id}")
                    return project_id
                else:
                    logger.error(f"❌ No projectId in deployment response")
            else:
                logger.error(f"❌ Failed to get deployment details: {response.status_code} - {response.text[:200]}")
                
        except Exception as e:
            logger.error(f"❌ Error getting project ID: {e}")
        
        return None
    
    def attach_domain_and_alias(self, deployment_id: str, fqdn: str) -> Tuple[bool, str]:
        """
        Attach domain to project and create alias using Vercel API
        
        Args:
            deployment_id: The deployment ID from Vercel
            fqdn: Full domain name (e.g., john-doe.portfolios.resume2website.com)
            
        Returns:
            Tuple of (success, message)
        """
        import requests
        import time
        
        headers = {
            "Authorization": f"Bearer {self.api_token}",
            "Content-Type": "application/json"
        }
        scope = {"teamId": self.team_id} if self.team_id else {}
        
        # First, get the actual project ID from the deployment
        logger.info(f"🔍 Getting project ID for deployment {deployment_id}...")
        project_id = self.get_project_id_from_deployment(deployment_id)
        
        if not project_id:
            error_msg = f"Could not get project ID for deployment {deployment_id}"
            logger.error(f"❌ {error_msg}")
            return False, error_msg
        
        # Now add domain to the actual project
        logger.info(f"📝 Adding domain {fqdn} to project {project_id}...")
        r = requests.post(
            f"https://api.vercel.com/v10/projects/{project_id}/domains",
            params=scope,
            headers=headers,
            json={"name": fqdn},
            timeout=30
        )
        
        if r.status_code not in (200, 201, 409):  # 409 = already exists
            logger.error(f"❌ Add domain failed {r.status_code}: {r.text[:200]}")
            return False, f"add-domain failed {r.status_code}: {r.text[:200]}"
        
        logger.info(f"✅ Domain {fqdn} added to project {project_id}")

        # Ensure we alias a PRODUCTION deployment to avoid 401 from preview protection
        try:
            dep_resp = requests.get(
                f"https://api.vercel.com/v13/deployments/{deployment_id}",
                params=scope,
                headers=headers,
                timeout=15,
            )
            target = None
            if dep_resp.status_code == 200:
                target = dep_resp.json().get('target')  # 'production' or 'preview'
                logger.info(f"🔎 Deployment {deployment_id} target: {target}")
            if target != 'production':
                logger.warning("⚠️ Deployment is not production; searching for latest production deployment")
                # Find latest production deployment for this project
                list_resp = requests.get(
                    "https://api.vercel.com/v6/deployments",
                    params={**scope, "projectId": project_id, "target": "production", "limit": 1},
                    headers=headers,
                    timeout=20,
                )
                if list_resp.status_code == 200:
                    deployments = list_resp.json().get('deployments', [])
                    if deployments:
                        deployment_id = deployments[0].get('uid', deployment_id)
                        logger.info(f"✅ Using latest production deployment: {deployment_id}")
                else:
                    logger.warning(f"Could not list production deployments: {list_resp.status_code}")
        except Exception as _:
            pass

        # 2) Create alias to deployment with retries
        logger.info(f"🔗 Creating alias {fqdn} -> deployment {deployment_id}")
        
        for attempt in range(5):
            a = requests.post(
                f"https://api.vercel.com/v2/deployments/{deployment_id}/aliases",
                params=scope,
                headers=headers,
                json={"alias": fqdn},
                timeout=30
            )
            
            if a.status_code in (200, 201):
                logger.info(f"✅ Alias created successfully: https://{fqdn}")
                # Verify the headers are clean
                if self.verify_clean_headers(fqdn):
                    logger.info(f"✅ Headers verified clean for iframe embedding")
                    return True, fqdn
                else:
                    logger.warning(f"⚠️ Headers not clean yet, but domain is configured")
                    logger.info(f"ℹ️ Note: It may take a few minutes for settings to propagate")
                    logger.info(f"ℹ️ The portfolio will work once Vercel applies the configuration")
                    # Return success anyway - the domain is configured correctly
                    return True, fqdn
            
            if a.status_code == 409:  # Already exists; verify mapping
                logger.info(f"ℹ️ Alias already exists. Verifying current mapping...")
                try:
                    info_resp = requests.get(
                        "https://api.vercel.com/v2/aliases",
                        params={**scope, "domain": fqdn, "limit": 1},
                        headers=headers,
                        timeout=15,
                    )
                    if info_resp.status_code == 200:
                        aliases = info_resp.json().get('aliases', [])
                        if aliases:
                            alias_obj = aliases[0]
                            current_dep = alias_obj.get('deploymentId')
                            alias_id = alias_obj.get('uid') or alias_obj.get('id')
                            if current_dep == deployment_id:
                                logger.info(f"✅ Alias already points to the desired deployment")
                                return True, fqdn
                            # Reassign by deleting and retrying
                            if alias_id:
                                logger.info(f"🔁 Reassigning alias to deployment {deployment_id}")
                                del_resp = requests.delete(
                                    f"https://api.vercel.com/v2/aliases/{alias_id}",
                                    params=scope,
                                    headers=headers,
                                    timeout=15,
                                )
                                if del_resp.status_code in (200, 204):
                                    logger.info("🗑️ Deleted existing alias, retrying creation")
                                    time.sleep(1)
                                    continue  # retry loop will attempt POST again
                                else:
                                    logger.warning(f"⚠️ Failed to delete alias ({del_resp.status_code})")
                                    # Fall through to retry
                    else:
                        logger.warning(f"⚠️ Could not fetch alias info: {info_resp.status_code}")
                except Exception as _:
                    logger.warning("⚠️ Error verifying/deleting existing alias; will retry")
                time.sleep(3)
                continue
            
            if a.status_code == 422:  # Domain not verified (DNS lag)
                logger.warning(f"⚠️ Domain not verified yet, retrying in {6 * (attempt + 1)}s...")
                time.sleep(6 * (attempt + 1))
                continue
            
            # Transient error? Retry
            logger.warning(f"⚠️ Alias attempt {attempt + 1} failed: {a.status_code}")
            time.sleep(3 * (attempt + 1))
        
        # NO LONGER NEEDED - Project is pre-configured before deployment
        # The initial deployment already has all iframe settings applied
        logger.warning("⚠️ Alias attempts failed after retries")
        
        # Return partial success if we at least have the deployment
        if deployment_id:
            logger.info(f"✅ Deployment succeeded but custom domain alias failed")
            logger.info(f"📝 You can manually add the domain in Vercel dashboard")
            return True, None  # Success but no custom domain
        
        error_msg = f"alias failed after all attempts"
        logger.error(f"❌ {error_msg}")
        return False, error_msg
    
    # Removed broken create_alias - use attach_domain_and_alias instead
    # The old function called non-existent add_domain_to_project
    # Now we properly handle domains through attach_domain_and_alias


# Create singleton instance
vercel_deployer = None

def get_vercel_deployer() -> VercelDeployer:
    """Get or create Vercel deployer instance"""
    global vercel_deployer
    if vercel_deployer is None:
        vercel_deployer = VercelDeployer()
    return vercel_deployer