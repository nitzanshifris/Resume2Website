"""
Portfolio generation services for CV2WEB
"""
from .component_selector import (
    ComponentSelector,
    ComponentSelection,
    UserArchetype,
    component_selector
)
from .smart_component_selector import (
    SmartComponentSelector,
    ContentRichness,
    LayoutDensity,
    smart_component_selector
)
from .portfolio_generator import (
    PortfolioGenerator,
    portfolio_generator
)
from .component_adapter import (
    ComponentAdapter,
    component_adapter
)
from .component_mappings import (
    COMPONENT_SECTION_MAPPINGS,
    COMPONENT_PROP_MAPPINGS,
    COMPONENT_SPECIAL_HANDLING,
    get_component_data_mapping
)

__all__ = [
    'ComponentSelector',
    'ComponentSelection', 
    'UserArchetype',
    'component_selector',
    'SmartComponentSelector',
    'ContentRichness',
    'LayoutDensity',
    'smart_component_selector',
    'PortfolioGenerator',
    'portfolio_generator',
    'ComponentAdapter',
    'component_adapter',
    'COMPONENT_SECTION_MAPPINGS',
    'COMPONENT_PROP_MAPPINGS',
    'COMPONENT_SPECIAL_HANDLING',
    'get_component_data_mapping'
]