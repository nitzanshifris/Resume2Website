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
    
    def setup_custom_domain(self, deployment_url: str, custom_domain: str) -> Tuple[bool, Optional[str], Optional[str]]:
        """
        Set up custom domain for a deployment (for paid users)
        
        Args:
            deployment_url: The Vercel deployment URL
            custom_domain: The custom domain to use (e.g., john-doe.resume2website.com)
            
        Returns:
            Tuple of (success, final_url, error_message)
        """
        try:
            logger.info(f"🌐 Setting up custom domain: {custom_domain}")
            
            # Extract project name from deployment URL
            project_name = deployment_url.split('.')[0].replace('https://', '')
            
            # Add domain to project
            payload = {
                "name": custom_domain,
                "gitBranch": None,
                "redirect": None
            }
            
            params = {}
            if self.team_id:
                params['teamId'] = self.team_id
            
            response = requests.post(
                f"{self.api_base}/v9/projects/{project_name}/domains",
                headers=self.headers,
                json=payload,
                params=params,
                timeout=30
            )
            
            if response.status_code in [200, 201]:
                logger.info(f"✅ Custom domain configured: {custom_domain}")
                return True, f"https://{custom_domain}", None
            elif response.status_code == 409:
                logger.info(f"ℹ️ Domain already exists: {custom_domain}")
                return True, f"https://{custom_domain}", None
            else:
                error_msg = f"Failed to set up domain: {response.status_code} - {response.text[:200]}"
                logger.error(error_msg)
                return False, None, error_msg
                
        except Exception as e:
            error_msg = f"Domain setup error: {str(e)}"
            logger.error(error_msg)
            return False, None, error_msg
    
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
    
    def _deploy_with_cli(self, portfolio_path: str, project_name: str, user_id: str, job_id: str) -> Tuple[bool, Optional[str], Optional[str]]:
        """
        Deploy using Vercel CLI to handle projects >10MB
        """
        import subprocess
        import json
        import os
        import tempfile
        
        try:
            logger.info("📦 Using Vercel CLI for deployment (handles large projects)")
            
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
                "public": True
            }
            
            # Preserve headers configuration from template if exists
            if 'headers' in existing_config:
                vercel_config['headers'] = existing_config['headers']
                logger.info(f"📋 Preserving headers configuration from template")
            
            with open(vercel_json_path, 'w') as f:
                json.dump(vercel_config, f, indent=2)
            logger.info(f"📝 Created/updated vercel.json in {portfolio_path}")
            
            # Use the globally installed Vercel CLI
            cmd = [
                'vercel',
                '--prod',  # Deploy to production
                '--yes',   # Skip confirmation
                '--token', self.api_token
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
            
            # Common "Inspect" line: https://vercel.com/.../deployments/<DEPLOYMENT_ID>
            m = re.search(r'/deployments/([A-Za-z0-9]+)', output_text)
            if m:
                deployment_id = m.group(1)
                logger.info(f"🎯 Found deployment ID: {deployment_id}")
            
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
                # Return deployment_id as the third element (was error message placeholder)
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
        
        # 1) Add domain to project (idempotent)
        logger.info(f"📝 Adding domain {fqdn} to project...")
        r = requests.post(
            "https://api.vercel.com/v9/projects/_/domains",
            params=scope,
            headers=headers,
            json={"name": fqdn},
            timeout=30
        )
        
        if r.status_code not in (200, 201, 409):  # 409 = already exists
            logger.error(f"❌ Add domain failed {r.status_code}: {r.text[:200]}")
            return False, f"add-domain failed {r.status_code}: {r.text[:200]}"
        
        logger.info(f"✅ Domain {fqdn} added to project")
        
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
                return True, fqdn
            
            if a.status_code == 409:  # Already aliased
                logger.info(f"ℹ️ Alias already exists: https://{fqdn}")
                return True, fqdn
            
            if a.status_code == 422:  # Domain not verified (DNS lag)
                logger.warning(f"⚠️ Domain not verified yet, retrying in {6 * (attempt + 1)}s...")
                time.sleep(6 * (attempt + 1))
                continue
            
            # Transient error? Retry
            logger.warning(f"⚠️ Alias attempt {attempt + 1} failed: {a.status_code}")
            time.sleep(3 * (attempt + 1))
        
        error_msg = f"alias failed after retries: {a.status_code}: {a.text[:200]}"
        logger.error(f"❌ {error_msg}")
        return False, error_msg
    
    def create_alias(self, deployment_url: str, alias_domain: str) -> Tuple[bool, Optional[str], Optional[str]]:
        """
        Create an alias (custom domain) for a deployment
        
        Args:
            deployment_url: The Vercel deployment URL (e.g., https://portfolio-abc.vercel.app)
            alias_domain: The custom domain to map (e.g., portfolio-abc.portfolios.resume2website.com)
            
        Returns:
            Tuple of (success, final_url, error_message)
        """
        try:
            logger.info(f"🔗 Creating alias: {alias_domain} -> {deployment_url}")
            
            # First, add the domain to the project
            domain_added = self.add_domain_to_project(alias_domain)
            if not domain_added:
                logger.warning(f"⚠️ Domain might not be added to project, continuing anyway...")
            
            # Extract deployment ID from URL if needed
            import re
            deployment_id = None
            
            # Try to extract from URL pattern
            if '.vercel.app' in deployment_url:
                # For URLs like https://portfolio-abc-123.vercel.app
                match = re.search(r'https://([^.]+)\.vercel\.app', deployment_url)
                if match:
                    # The deployment ID might be in the URL, but we need the actual deployment ID
                    # We'll use the URL directly
                    pass
            
            # Use CLI to create alias (more reliable than API for this)
            import subprocess
            cmd = [
                'vercel',
                'alias',
                'set',
                deployment_url,
                alias_domain,
                '--token', self.api_token
            ]
            
            # Add team scope if applicable
            if self.team_id:
                team_slug = self._get_team_slug()
                if team_slug:
                    cmd.extend(['--scope', team_slug])
            
            logger.info(f"🚀 Running alias command...")
            
            try:
                result = subprocess.run(
                    cmd,
                    capture_output=True,
                    text=True,
                    timeout=30,
                    cwd='/'  # Run from root to avoid any path issues
                )
                
                # Check if successful
                if result.returncode == 0 or 'Success' in result.stdout or alias_domain in result.stdout:
                    logger.info(f"✅ Alias created successfully: https://{alias_domain}")
                    return True, f"https://{alias_domain}", None
                else:
                    # Sometimes vercel alias returns non-zero but still works
                    if 'already exists' in result.stdout.lower() or 'already exists' in result.stderr.lower():
                        logger.info(f"ℹ️ Alias already exists: https://{alias_domain}")
                        return True, f"https://{alias_domain}", None
                    
                    error_msg = f"Failed to create alias: {result.stderr or result.stdout}"
                    logger.error(f"❌ {error_msg}")
                    return False, None, error_msg
                    
            except subprocess.TimeoutExpired:
                error_msg = "Alias creation timed out after 30 seconds"
                logger.error(f"⏱️ {error_msg}")
                return False, None, error_msg
                
        except Exception as e:
            error_msg = f"Alias creation error: {str(e)}"
            logger.error(f"❌ {error_msg}")
            return False, None, error_msg


# Create singleton instance
vercel_deployer = None

def get_vercel_deployer() -> VercelDeployer:
    """Get or create Vercel deployer instance"""
    global vercel_deployer
    if vercel_deployer is None:
        vercel_deployer = VercelDeployer()
    return vercel_deployer