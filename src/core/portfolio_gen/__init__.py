"""
Portfolio generation services for CV2WEB.

This module provides utilities for portfolio generation without component selection logic.
Component selection has been moved to Magic UI MCP scripts.
"""
from .component_adapter import ComponentAdapter, component_adapter
from .component_mappings import (
    COMPONENT_SECTION_MAPPINGS,
    COMPONENT_PROP_MAPPINGS,
    COMPONENT_SPECIAL_HANDLING,
    get_component_data_mapping
)
from .component_import_fixer import ComponentImportFixer
from .component_registry import ComponentRegistry
from .portfolio_validator import PortfolioValidator
from .props_schema import ComponentPropsSchema
from .strategy_registry import strategy_registry
from .strategies import PortfolioStrategy

__all__ = [
    'ComponentAdapter',
    'component_adapter',
    'COMPONENT_SECTION_MAPPINGS',
    'COMPONENT_PROP_MAPPINGS',
    'COMPONENT_SPECIAL_HANDLING',
    'get_component_data_mapping',
    'ComponentImportFixer',
    'ComponentRegistry',
    'PortfolioValidator',
    'ComponentPropsSchema',
    'strategy_registry',
    'PortfolioStrategy'
]