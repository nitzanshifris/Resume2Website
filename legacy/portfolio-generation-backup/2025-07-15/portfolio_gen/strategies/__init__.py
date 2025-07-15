"""
Portfolio generation strategies.

This module implements the strategy pattern for different portfolio generation approaches.
"""
from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from pathlib import Path

from src.core.schemas.unified_nullable import CVData


class PortfolioStrategy(ABC):
    """Abstract base class for portfolio generation strategies."""
    
    @abstractmethod
    async def generate(
        self, 
        cv_data: CVData, 
        output_dir: Path,
        options: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Generate a portfolio using this strategy.
        
        Args:
            cv_data: Structured CV data
            output_dir: Directory to output the portfolio
            options: Strategy-specific options
            
        Returns:
            Dictionary with generation results including paths and metadata
        """
        pass
    
    @abstractmethod
    def get_required_components(self) -> List[str]:
        """
        Get list of required UI components for this strategy.
        
        Returns:
            List of component names
        """
        pass
    
    @abstractmethod
    def validate_cv_data(self, cv_data: CVData) -> tuple[bool, List[str]]:
        """
        Validate if CV data is suitable for this strategy.
        
        Args:
            cv_data: The CV data to validate
            
        Returns:
            Tuple of (is_valid, list_of_issues)
        """
        pass