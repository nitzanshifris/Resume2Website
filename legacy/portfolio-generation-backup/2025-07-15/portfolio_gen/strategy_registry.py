"""
Portfolio Strategy Registry.

Manages available portfolio generation strategies and provides
a unified interface for strategy selection.
"""
import logging
from typing import Dict, Optional, Type

from .strategies import PortfolioStrategy
from .strategies.magic_ui import MagicUIStrategy
from .strategies.aceternity import AceternityStrategy

logger = logging.getLogger(__name__)


class StrategyRegistry:
    """Registry for portfolio generation strategies."""
    
    def __init__(self):
        """Initialize the registry with available strategies."""
        self._strategies: Dict[str, Type[PortfolioStrategy]] = {
            "magic-ui": MagicUIStrategy,
            "aceternity": AceternityStrategy
        }
        self._instances: Dict[str, PortfolioStrategy] = {}
    
    def get_strategy(self, name: str) -> Optional[PortfolioStrategy]:
        """
        Get a strategy instance by name.
        
        Args:
            name: Strategy name
            
        Returns:
            Strategy instance or None if not found
        """
        if name not in self._strategies:
            logger.warning(f"Unknown strategy: {name}")
            return None
            
        # Create instance if not exists
        if name not in self._instances:
            self._instances[name] = self._strategies[name]()
            
        return self._instances[name]
    
    def list_strategies(self) -> Dict[str, Dict[str, any]]:
        """
        List all available strategies with metadata.
        
        Returns:
            Dictionary of strategy information
        """
        info = {}
        for name, strategy_class in self._strategies.items():
            instance = self.get_strategy(name)
            info[name] = {
                "name": name,
                "class": strategy_class.__name__,
                "required_components": instance.get_required_components() if instance else []
            }
        return info
    
    def register_strategy(self, name: str, strategy_class: Type[PortfolioStrategy]):
        """
        Register a new strategy.
        
        Args:
            name: Strategy name
            strategy_class: Strategy class
        """
        if name in self._strategies:
            logger.warning(f"Overwriting existing strategy: {name}")
            
        self._strategies[name] = strategy_class
        
        # Clear cached instance
        if name in self._instances:
            del self._instances[name]


# Global registry instance
strategy_registry = StrategyRegistry()