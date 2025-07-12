"""
Props Schema Validation for Aceternity Components
Provides runtime validation of component props
"""
import logging
from typing import Dict, Any, List, Optional, Union
from dataclasses import dataclass, field
from enum import Enum

logger = logging.getLogger(__name__)

class PropType(Enum):
    """Supported prop types"""
    STRING = "string"
    NUMBER = "number"
    BOOLEAN = "boolean"
    ARRAY = "array"
    OBJECT = "object"
    FUNCTION = "function"
    NODE = "node"  # React node
    ELEMENT = "element"  # React element
    ANY = "any"

@dataclass
class PropSchema:
    """Schema definition for a single prop"""
    name: str
    type: Union[PropType, List[PropType]]  # Can be multiple types
    required: bool = False
    default: Any = None
    description: str = ""
    array_type: Optional[PropType] = None  # For array props
    object_shape: Optional[Dict[str, 'PropSchema']] = None  # For object props
    validator: Optional[callable] = None  # Custom validator function

@dataclass
class ComponentPropsSchema:
    """Complete props schema for a component"""
    component_name: str
    props: List[PropSchema]
    description: str = ""

# Define schemas for common Aceternity components
COMPONENT_SCHEMAS = {
    "timeline": ComponentPropsSchema(
        component_name="Timeline",
        description="Timeline component for showing chronological data",
        props=[
            PropSchema(
                name="data",
                type=PropType.ARRAY,
                required=True,
                description="Array of timeline entries",
                array_type=PropType.OBJECT,
                object_shape={
                    "title": PropSchema("title", PropType.STRING, required=True),
                    "subtitle": PropSchema("subtitle", PropType.STRING),
                    "date": PropSchema("date", PropType.STRING),
                    "content": PropSchema("content", PropType.STRING),
                    "bullets": PropSchema("bullets", PropType.ARRAY, array_type=PropType.STRING)
                }
            ),
            PropSchema(
                name="show_icons",
                type=PropType.BOOLEAN,
                default=True,
                description="Whether to show icons"
            ),
            PropSchema(
                name="alternate_sides",
                type=PropType.BOOLEAN,
                default=True,
                description="Whether to alternate timeline items"
            )
        ]
    ),
    
    "bento-grid": ComponentPropsSchema(
        component_name="BentoGrid",
        description="Grid layout component",
        props=[
            PropSchema(
                name="items",
                type=PropType.ARRAY,
                required=True,
                description="Array of grid items",
                array_type=PropType.OBJECT,
                object_shape={
                    "title": PropSchema("title", PropType.STRING, required=True),
                    "description": PropSchema("description", PropType.STRING),
                    "header": PropSchema("header", PropType.NODE),
                    "className": PropSchema("className", PropType.STRING),
                    "icon": PropSchema("icon", PropType.NODE)
                }
            ),
            PropSchema(
                name="className",
                type=PropType.STRING,
                default="",
                description="Additional CSS classes"
            )
        ]
    ),
    
    "card-hover-effect": ComponentPropsSchema(
        component_name="HoverEffect",
        description="Cards with hover effects",
        props=[
            PropSchema(
                name="items",
                type=PropType.ARRAY,
                required=True,
                description="Array of card items",
                array_type=PropType.OBJECT,
                object_shape={
                    "title": PropSchema("title", PropType.STRING, required=True),
                    "description": PropSchema("description", PropType.STRING),
                    "link": PropSchema("link", PropType.STRING)
                }
            ),
            PropSchema(
                name="className",
                type=PropType.STRING,
                default="",
                description="Additional CSS classes"
            )
        ]
    ),
    
    "card-stack": ComponentPropsSchema(
        component_name="CardStack",
        description="Stacked cards component",
        props=[
            PropSchema(
                name="items",
                type=PropType.ARRAY,
                required=True,
                description="Array of card items",
                array_type=PropType.OBJECT,
                object_shape={
                    "id": PropSchema("id", PropType.NUMBER, required=True),
                    "name": PropSchema("name", PropType.STRING, required=True),
                    "designation": PropSchema("designation", PropType.STRING),
                    "content": PropSchema("content", PropType.NODE, required=True)
                }
            ),
            PropSchema(
                name="offset",
                type=PropType.NUMBER,
                default=10,
                description="Offset between cards"
            ),
            PropSchema(
                name="scaleFactor",
                type=PropType.NUMBER,
                default=0.06,
                description="Scale factor for cards"
            )
        ]
    ),
    
    "animated-tooltip": ComponentPropsSchema(
        component_name="AnimatedTooltip",
        description="Tooltip with animation",
        props=[
            PropSchema(
                name="items",
                type=PropType.ARRAY,
                required=True,
                description="Array of tooltip items",
                array_type=PropType.OBJECT,
                object_shape={
                    "id": PropSchema("id", PropType.NUMBER, required=True),
                    "name": PropSchema("name", PropType.STRING, required=True),
                    "designation": PropSchema("designation", PropType.STRING, required=True),
                    "image": PropSchema("image", PropType.STRING, required=True)
                }
            ),
            PropSchema(
                name="className",
                type=PropType.STRING,
                default="",
                description="Additional CSS classes"
            )
        ]
    ),
    
    "text-generate-effect": ComponentPropsSchema(
        component_name="TextGenerateEffect",
        description="Text generation animation",
        props=[
            PropSchema(
                name="words",
                type=PropType.STRING,
                required=True,
                description="Text to animate"
            ),
            PropSchema(
                name="className",
                type=PropType.STRING,
                default="",
                description="Additional CSS classes"
            ),
            PropSchema(
                name="duration",
                type=PropType.NUMBER,
                default=0.5,
                description="Animation duration"
            )
        ]
    ),
    
    "floating-dock": ComponentPropsSchema(
        component_name="FloatingDock",
        description="Floating navigation dock",
        props=[
            PropSchema(
                name="items",
                type=PropType.ARRAY,
                required=True,
                description="Array of dock items",
                array_type=PropType.OBJECT,
                object_shape={
                    "title": PropSchema("title", PropType.STRING, required=True),
                    "icon": PropSchema("icon", PropType.NODE, required=True),
                    "href": PropSchema("href", PropType.STRING, required=True)
                }
            ),
            PropSchema(
                name="desktopClassName",
                type=PropType.STRING,
                default="",
                description="Desktop CSS classes"
            ),
            PropSchema(
                name="mobileClassName",
                type=PropType.STRING,
                default="",
                description="Mobile CSS classes"
            )
        ]
    )
}

class PropsValidator:
    """Validates component props against schemas"""
    
    def __init__(self):
        self.schemas = COMPONENT_SCHEMAS
        
    def validate(self, component_type: str, props: Dict[str, Any]) -> tuple[bool, List[str]]:
        """
        Validate props for a component
        
        Returns:
            (is_valid, errors)
        """
        errors = []
        
        # Get schema
        schema = self.schemas.get(component_type)
        if not schema:
            logger.warning(f"No schema defined for component: {component_type}")
            return True, []  # Pass validation if no schema
        
        # Check required props
        for prop_schema in schema.props:
            if prop_schema.required and prop_schema.name not in props:
                errors.append(f"Missing required prop: {prop_schema.name}")
                continue
            
            # Validate prop if present
            if prop_schema.name in props:
                prop_value = props[prop_schema.name]
                prop_errors = self._validate_prop(prop_schema, prop_value)
                errors.extend(prop_errors)
        
        # Check for unknown props
        known_props = {p.name for p in schema.props}
        for prop_name in props:
            if prop_name not in known_props and not prop_name.startswith('_'):
                logger.warning(f"Unknown prop for {component_type}: {prop_name}")
        
        return len(errors) == 0, errors
    
    def _validate_prop(self, schema: PropSchema, value: Any) -> List[str]:
        """Validate a single prop value"""
        errors = []
        
        # Handle multiple allowed types
        allowed_types = schema.type if isinstance(schema.type, list) else [schema.type]
        
        # Check type
        type_valid = False
        for allowed_type in allowed_types:
            if self._check_type(value, allowed_type):
                type_valid = True
                break
        
        if not type_valid:
            errors.append(f"Prop {schema.name} has invalid type. Expected {allowed_types}, got {type(value)}")
            return errors
        
        # Validate array items
        if schema.type == PropType.ARRAY and schema.array_type and isinstance(value, list):
            for i, item in enumerate(value):
                if not self._check_type(item, schema.array_type):
                    errors.append(f"Array item {i} in {schema.name} has invalid type")
                
                # Validate object shape in array
                if schema.array_type == PropType.OBJECT and schema.object_shape:
                    item_errors = self._validate_object_shape(
                        f"{schema.name}[{i}]",
                        item,
                        schema.object_shape
                    )
                    errors.extend(item_errors)
        
        # Validate object shape
        if schema.type == PropType.OBJECT and schema.object_shape and isinstance(value, dict):
            shape_errors = self._validate_object_shape(schema.name, value, schema.object_shape)
            errors.extend(shape_errors)
        
        # Run custom validator
        if schema.validator:
            try:
                if not schema.validator(value):
                    errors.append(f"Custom validation failed for {schema.name}")
            except Exception as e:
                errors.append(f"Validator error for {schema.name}: {e}")
        
        return errors
    
    def _check_type(self, value: Any, expected_type: PropType) -> bool:
        """Check if value matches expected type"""
        if expected_type == PropType.ANY:
            return True
        elif expected_type == PropType.STRING:
            return isinstance(value, str)
        elif expected_type == PropType.NUMBER:
            return isinstance(value, (int, float))
        elif expected_type == PropType.BOOLEAN:
            return isinstance(value, bool)
        elif expected_type == PropType.ARRAY:
            return isinstance(value, list)
        elif expected_type == PropType.OBJECT:
            return isinstance(value, dict)
        elif expected_type in [PropType.NODE, PropType.ELEMENT, PropType.FUNCTION]:
            # These are React-specific, hard to validate in Python
            return True
        
        return False
    
    def _validate_object_shape(self, path: str, obj: Dict, shape: Dict[str, PropSchema]) -> List[str]:
        """Validate object against shape definition"""
        errors = []
        
        for prop_name, prop_schema in shape.items():
            full_path = f"{path}.{prop_name}"
            
            if prop_schema.required and prop_name not in obj:
                errors.append(f"Missing required property: {full_path}")
            elif prop_name in obj:
                prop_errors = self._validate_prop(prop_schema, obj[prop_name])
                # Adjust error messages to include path
                for error in prop_errors:
                    errors.append(error.replace(prop_schema.name, full_path))
        
        return errors
    
    def get_schema(self, component_type: str) -> Optional[ComponentPropsSchema]:
        """Get schema for a component"""
        return self.schemas.get(component_type)
    
    def add_schema(self, component_type: str, schema: ComponentPropsSchema):
        """Add or update a component schema"""
        self.schemas[component_type] = schema

# Create singleton validator
props_validator = PropsValidator()