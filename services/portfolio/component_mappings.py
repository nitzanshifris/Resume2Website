"""
Comprehensive Component Mappings for ALL Aceternity Components
Maps every component to appropriate CV sections and data types
"""
from typing import List, Dict, Any

# Complete mapping of all Aceternity components to CV sections
COMPONENT_SECTION_MAPPINGS = {
    # Hero Components
    "hero-parallax": ["hero"],
    "hero-highlight": ["hero"],
    "background-gradient": ["hero", "summary"],
    "aurora-background": ["hero"],
    "background-beams": ["hero"],
    "background-boxes": ["hero"],
    "background-lines": ["hero", "summary", "contact"],
    "glowing-stars": ["hero"],
    "shooting-stars": ["hero"],
    "meteors": ["hero"],
    "spotlight": ["hero"],
    
    # Content Display Components
    "text-generate-effect": ["summary", "about"],
    "typewriter-effect": ["hero", "summary"],
    "flip-words": ["hero", "summary"],
    "text-reveal-card": ["summary", "about"],
    "cover": ["hero", "summary"],
    "highlight": ["summary", "skills"],
    
    # Timeline & Progress Components
    "timeline": ["experience", "education", "certifications"],
    "stepper": ["experience", "education", "process"],
    "progress": ["skills", "languages"],
    
    # Card Components
    "3d-card": ["projects", "achievements", "certifications"],
    "card-hover-effect": ["projects", "services"],
    "card-spotlight": ["projects", "achievements"],
    "card-stack": ["testimonials", "achievements"],
    "expandable-cards": ["projects", "experience"],
    "evervault-card": ["projects", "skills"],
    "glare-card": ["projects", "achievements"],
    "moving-border": ["skills", "certifications"],
    "hover-border-gradient": ["projects", "skills"],
    
    # Grid & Layout Components
    "bento-grid": ["skills", "services", "achievements"],
    "layout-grid": ["projects", "portfolio"],
    "masonry-grid": ["projects", "achievements"],
    "focus-cards": ["projects", "services"],
    
    # Navigation Components
    "floating-dock": ["contact", "navigation"],
    "floating-navbar": ["navigation"],
    "navbar-menu": ["navigation"],
    "sidebar": ["navigation"],
    "breadcrumb": ["navigation"],
    
    # Animation & Effects Components
    "animated-modal": ["projects", "contact"],
    "animated-tabs": ["skills", "services"],
    "animated-tooltip": ["skills", "tools"],
    "animated-testimonials": ["testimonials", "achievements", "recommendations"],
    "infinite-moving-cards": ["skills", "testimonials", "clients"],
    "parallax-scroll": ["projects", "gallery"],
    
    # Interactive Components
    "3d-pin": ["projects", "locations"],
    "draggable-cards": ["skills", "projects"],
    "direction-aware-hover": ["projects", "team"],
    "following-pointer": ["interactive"],
    "globe": ["locations", "contact"],
    "macbook-scroll": ["projects", "portfolio"],
    
    # Form & Input Components
    "file-upload": ["contact"],
    "multi-step-form": ["contact"],
    "placeholders-and-vanish-input": ["contact"],
    "input": ["contact"],
    "textarea": ["contact"],
    "select": ["contact", "preferences"],
    
    # Data Display Components
    "table": ["experience", "education"],
    "data-table": ["skills", "projects"],
    "comparison": ["services", "pricing"],
    "stats": ["achievements", "metrics"],
    
    # Image & Media Components
    "images-slider": ["portfolio", "projects"],
    "carousel": ["testimonials", "projects"],
    "image-gallery": ["portfolio", "projects"],
    "lens": ["projects", "portfolio"],
    "compare": ["before-after", "portfolio"],
    
    # Special Effect Components
    "container-scroll-animation": ["hero", "about"],
    "sticky-scroll-reveal": ["features", "process"],
    "lamp": ["hero", "cta"],
    "sparkles": ["hero", "achievements"],
    "wavy-background": ["hero", "sections"],
    "dot-background": ["sections"],
    "grid-background": ["sections"],
}

# Component prop requirements and data mapping
COMPONENT_PROP_MAPPINGS = {
    "hero-parallax": {
        "required": ["products"],
        "optional": ["className"],
        "data_mapping": {
            "products": "projects.projectItems -> {title: name, link: liveUrl, thumbnail: imageUrl}"
        }
    },
    "hero-highlight": {
        "required": ["children"],
        "optional": ["className", "containerClassName"],
        "data_mapping": {
            "children": "hero -> custom JSX with fullName, professionalTitle, summaryTagline"
        }
    },
    "timeline": {
        "required": ["data"],
        "optional": ["className"],
        "data_mapping": {
            "data": "experience.experienceItems -> {title: companyName, content: formatted HTML}"
        }
    },
    "bento-grid": {
        "required": ["items"],
        "optional": ["className"],
        "data_mapping": {
            "items": "skills.skillCategories -> {title: categoryName, description: skills.join(', ')}"
        }
    },
    "animated-testimonials": {
        "required": ["testimonials"],
        "optional": ["autoplay"],
        "data_mapping": {
            "testimonials": "achievements.achievements -> {quote: value, name: label, designation: contextOrDetail}"
        }
    },
    "card-hover-effect": {
        "required": ["items"],
        "optional": ["className"],
        "data_mapping": {
            "items": "projects.projectItems -> {title: name, description: description, link: liveUrl}"
        }
    },
    "floating-dock": {
        "required": ["items"],
        "optional": ["className"],
        "data_mapping": {
            "items": "contact -> {icon: type, link: url, title: platform}"
        }
    },
    "text-generate-effect": {
        "required": ["words"],
        "optional": ["className", "duration"],
        "data_mapping": {
            "words": "summary.summaryText"
        }
    }
}

# Component style variants based on archetype
ARCHETYPE_COMPONENT_PREFERENCES = {
    "technical": {
        "preferred_hero": "hero-parallax",
        "preferred_skills": "bento-grid",
        "preferred_projects": "card-hover-effect",
        "style": "minimal, dark, code-like"
    },
    "creative": {
        "preferred_hero": "aurora-background",
        "preferred_skills": "animated-cards",
        "preferred_projects": "3d-card",
        "style": "colorful, animated, visual"
    },
    "business": {
        "preferred_hero": "background-gradient",
        "preferred_skills": "stats-grid",
        "preferred_projects": "expandable-cards",
        "style": "professional, clean, corporate"
    }
}

# Component packs (groups of components that work well together)
COMPONENT_PACKS = {
    "minimal": [
        "hero-highlight",
        "text-generate-effect",
        "timeline",
        "bento-grid",
        "card-hover-effect",
        "floating-dock"
    ],
    "animated": [
        "hero-parallax",
        "animated-tabs",
        "animated-testimonials",
        "infinite-moving-cards",
        "3d-card",
        "floating-navbar"
    ],
    "professional": [
        "background-gradient",
        "timeline",
        "stats",
        "expandable-cards",
        "comparison",
        "navbar-menu"
    ],
    "creative": [
        "aurora-background",
        "3d-card",
        "parallax-scroll",
        "lens",
        "images-slider",
        "animated-modal"
    ],
    "developer": [
        "hero-parallax",
        "code-block",
        "bento-grid",
        "github-card",
        "terminal",
        "floating-dock"
    ]
}

# Special handling instructions for complex components
COMPONENT_SPECIAL_HANDLING = {
    "hero-parallax": {
        "note": "Requires array of 15 products with title, link, thumbnail",
        "fallback_data": "Generate placeholder products if less than 15 projects"
    },
    "globe": {
        "note": "Requires location coordinates",
        "fallback_data": "Use default coordinates if no location data"
    },
    "macbook-scroll": {
        "note": "Best for showcasing web projects with screenshots",
        "fallback_data": "Use project descriptions if no screenshots"
    },
    "timeline": {
        "note": "Requires array of items with title and content",
        "content_format": "HTML string with proper structure"
    }
}

def get_components_for_section(section: str) -> List[str]:
    """Get all components that can be used for a given CV section"""
    components = []
    for component, sections in COMPONENT_SECTION_MAPPINGS.items():
        if section in sections:
            components.append(component)
    return components

def get_component_pack(pack_name: str) -> List[str]:
    """Get a pre-defined component pack"""
    return COMPONENT_PACKS.get(pack_name, COMPONENT_PACKS["minimal"])

def get_component_data_mapping(component: str) -> Dict[str, Any]:
    """Get data mapping instructions for a component"""
    return COMPONENT_PROP_MAPPINGS.get(component, {})

def get_archetype_preferences(archetype: str) -> Dict[str, Any]:
    """Get component preferences for a user archetype"""
    return ARCHETYPE_COMPONENT_PREFERENCES.get(archetype, ARCHETYPE_COMPONENT_PREFERENCES["technical"])