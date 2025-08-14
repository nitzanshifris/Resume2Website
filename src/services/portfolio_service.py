"""
Portfolio Service for RESUME2WEBSITE
Handles portfolio generation, deployment, and domain management
"""
import os
import logging
from typing import Dict, Optional, Tuple, Any
from datetime import datetime, timedelta
from pathlib import Path

from src.services.vercel_deployer import get_vercel_deployer
from src.api.db import (
    update_user_portfolio, 
    get_user_portfolio, 
    clear_user_portfolio,
    get_user_by_id
)

logger = logging.getLogger(__name__)


class PortfolioService:
    """
    Unified service for portfolio operations:
    - Generation in sandboxes (local development)
    - Deployment to Vercel (production)
    - Custom domain management (paid feature)
    - Portfolio persistence (30-day retention)
    """
    
    def __init__(self):
        """Initialize portfolio service"""
        self.vercel_deployer = None
        self.sandboxes_dir = Path("sandboxes/portfolios")
        self.sandboxes_dir.mkdir(parents=True, exist_ok=True)
        
    def get_or_create_portfolio(
        self, 
        user_id: str, 
        job_id: str,
        force_new: bool = False
    ) -> Dict[str, Any]:
        """
        Get existing portfolio or create new one
        
        Args:
            user_id: User ID
            job_id: CV job ID
            force_new: Force creation of new portfolio
            
        Returns:
            Portfolio information including URL
        """
        try:
            # Check for existing portfolio (unless forcing new)
            if not force_new:
                existing = get_user_portfolio(user_id)
                if existing:
                    logger.info(f"📌 Found existing portfolio for user {user_id}")
                    return {
                        'success': True,
                        'portfolio_id': existing['portfolio_id'],
                        'portfolio_url': existing['portfolio_url'],
                        'created_at': existing['created_at'],
                        'expires_at': existing['expires_at'],
                        'is_cached': True
                    }
            
            # Clear old portfolio if forcing new
            if force_new:
                clear_user_portfolio(user_id)
                logger.info(f"🧹 Cleared old portfolio for user {user_id}")
            
            # Generate new portfolio
            logger.info(f"🚀 Creating new portfolio for user {user_id}")
            return self._create_new_portfolio(user_id, job_id)
            
        except Exception as e:
            logger.error(f"❌ Portfolio operation failed: {e}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def _create_new_portfolio(self, user_id: str, job_id: str) -> Dict[str, Any]:
        """
        Create a new portfolio and deploy to Vercel
        
        Args:
            user_id: User ID
            job_id: CV job ID
            
        Returns:
            Portfolio creation result
        """
        try:
            # Step 1: Generate portfolio in sandbox
            sandbox_path = self._generate_portfolio_sandbox(user_id, job_id)
            if not sandbox_path:
                return {
                    'success': False,
                    'error': 'Failed to generate portfolio'
                }
            
            # Step 2: Deploy to Vercel
            deployment_result = self._deploy_to_vercel(
                sandbox_path=sandbox_path,
                user_id=user_id,
                job_id=job_id
            )
            
            if not deployment_result['success']:
                return deployment_result
            
            # Step 3: Store portfolio information
            portfolio_url = deployment_result['portfolio_url']
            portfolio_id = deployment_result['portfolio_id']
            
            update_user_portfolio(
                user_id=user_id,
                portfolio_id=portfolio_id,
                portfolio_url=portfolio_url
            )
            
            logger.info(f"✅ Portfolio created and deployed: {portfolio_url}")
            
            return {
                'success': True,
                'portfolio_id': portfolio_id,
                'portfolio_url': portfolio_url,
                'created_at': datetime.utcnow().isoformat(),
                'expires_at': (datetime.utcnow() + timedelta(days=30)).isoformat(),
                'is_cached': False
            }
            
        except Exception as e:
            logger.error(f"❌ Portfolio creation failed: {e}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def _generate_portfolio_sandbox(self, user_id: str, job_id: str) -> Optional[str]:
        """
        Generate portfolio in sandbox environment
        
        Args:
            user_id: User ID
            job_id: CV job ID
            
        Returns:
            Path to generated portfolio or None
        """
        try:
            # Import the portfolio generator
            from src.api.routes.portfolio_generator import generate_portfolio_internal
            
            # Generate portfolio
            result = generate_portfolio_internal(
                job_id=job_id,
                user_id=user_id,
                template="v0_template_v2.1"  # Use latest template
            )
            
            if result and result.get('success'):
                portfolio_path = result.get('portfolio_path')
                if portfolio_path and os.path.exists(portfolio_path):
                    logger.info(f"📦 Portfolio generated at: {portfolio_path}")
                    return portfolio_path
            
            logger.error("Portfolio generation failed")
            return None
            
        except Exception as e:
            logger.error(f"❌ Sandbox generation error: {e}")
            return None
    
    def _deploy_to_vercel(
        self, 
        sandbox_path: str, 
        user_id: str, 
        job_id: str
    ) -> Dict[str, Any]:
        """
        Deploy portfolio to Vercel
        
        Args:
            sandbox_path: Path to portfolio sandbox
            user_id: User ID
            job_id: CV job ID
            
        Returns:
            Deployment result
        """
        try:
            # Initialize Vercel deployer
            if not self.vercel_deployer:
                self.vercel_deployer = get_vercel_deployer()
            
            # Get user info for project naming
            user = get_user_by_id(user_id)
            user_name = user.get('name', 'portfolio') if user else 'portfolio'
            
            # Create safe project name
            safe_name = self._create_safe_name(user_name)
            
            # Deploy to Vercel
            logger.info(f"☁️ Deploying to Vercel as: {safe_name}")
            
            success, deployment_url, error = self.vercel_deployer.create_deployment(
                portfolio_path=sandbox_path,
                project_name=safe_name,
                user_id=user_id,
                job_id=job_id
            )
            
            if success:
                # Extract deployment ID from URL
                deployment_id = deployment_url.split('-')[-1].split('.')[0]
                
                return {
                    'success': True,
                    'portfolio_url': deployment_url,
                    'portfolio_id': deployment_id
                }
            else:
                return {
                    'success': False,
                    'error': error or 'Deployment failed'
                }
                
        except Exception as e:
            logger.error(f"❌ Vercel deployment error: {e}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def _create_safe_name(self, name: str) -> str:
        """
        Create a safe name for Vercel project
        
        Args:
            name: Original name
            
        Returns:
            Safe name for Vercel
        """
        # Convert to lowercase and replace spaces
        safe = name.lower().replace(' ', '-')
        
        # Remove special characters
        safe = ''.join(c for c in safe if c.isalnum() or c == '-')
        
        # Remove consecutive hyphens
        while '--' in safe:
            safe = safe.replace('--', '-')
        
        # Trim and limit length
        safe = safe.strip('-')[:20]
        
        # Add prefix
        return f"portfolio-{safe}"
    
    def setup_custom_domain(
        self, 
        user_id: str, 
        custom_domain: str
    ) -> Dict[str, Any]:
        """
        Set up custom domain for user's portfolio (paid feature)
        
        Args:
            user_id: User ID
            custom_domain: Custom domain to use
            
        Returns:
            Domain setup result
        """
        try:
            # Get user's current portfolio
            portfolio = get_user_portfolio(user_id)
            if not portfolio:
                return {
                    'success': False,
                    'error': 'No active portfolio found'
                }
            
            # Initialize Vercel deployer
            if not self.vercel_deployer:
                self.vercel_deployer = get_vercel_deployer()
            
            # Set up custom domain
            success, final_url, error = self.vercel_deployer.setup_custom_domain(
                deployment_url=portfolio['portfolio_url'],
                custom_domain=custom_domain
            )
            
            if success:
                # Update portfolio URL with custom domain
                update_user_portfolio(
                    user_id=user_id,
                    portfolio_id=portfolio['portfolio_id'],
                    portfolio_url=final_url
                )
                
                logger.info(f"✅ Custom domain configured: {final_url}")
                
                return {
                    'success': True,
                    'custom_domain': custom_domain,
                    'portfolio_url': final_url
                }
            else:
                return {
                    'success': False,
                    'error': error or 'Domain setup failed'
                }
                
        except Exception as e:
            logger.error(f"❌ Custom domain setup failed: {e}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def check_domain_availability(self, domain: str) -> Dict[str, Any]:
        """
        Check if a domain is available for purchase
        
        Args:
            domain: Domain to check
            
        Returns:
            Availability result
        """
        try:
            # Initialize Vercel deployer
            if not self.vercel_deployer:
                self.vercel_deployer = get_vercel_deployer()
            
            # Check domain availability
            available, price = self.vercel_deployer.check_domain_availability(domain)
            
            return {
                'success': True,
                'available': available,
                'price': price,
                'domain': domain
            }
            
        except Exception as e:
            logger.error(f"❌ Domain check failed: {e}")
            return {
                'success': False,
                'error': str(e)
            }


# Singleton instance
_portfolio_service = None

def get_portfolio_service() -> PortfolioService:
    """Get or create portfolio service instance"""
    global _portfolio_service
    if _portfolio_service is None:
        _portfolio_service = PortfolioService()
    return _portfolio_service