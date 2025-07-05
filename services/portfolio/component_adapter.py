"""
Universal Component Adapter for Aceternity Components
Handles dynamic mapping of CV data to ANY Aceternity component
"""
import json
import logging
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple
import re

from .component_mappings import (
    COMPONENT_SECTION_MAPPINGS,
    COMPONENT_PROP_MAPPINGS,
    COMPONENT_SPECIAL_HANDLING,
    get_component_data_mapping
)

logger = logging.getLogger(__name__)

class ComponentAdapter:
    """
    Universal adapter that maps CV data to Aceternity component props
    Works with any component from the gallery
    """
    
    def __init__(self):
        self.component_registry = self._load_component_registry()
        self.demo_content_patterns = self._load_demo_patterns()
        
    def _load_component_registry(self) -> Dict[str, Any]:
        """Load component registry from Aceternity library"""
        try:
            registry_path = Path(__file__).parent.parent.parent / "aceternity-components-library" / "components" / "registry.json"
            if registry_path.exists():
                with open(registry_path, 'r') as f:
                    return json.load(f)
            
            # Fallback to reading TypeScript registry
            ts_registry_path = Path(__file__).parent.parent.parent / "aceternity-components-library" / "lib" / "component-adapter" / "component-registry.ts"
            if ts_registry_path.exists():
                return self._parse_ts_registry(ts_registry_path)
                
        except Exception as e:
            logger.warning(f"Could not load component registry: {e}")
            
        return {}
    
    def _parse_ts_registry(self, registry_path: Path) -> Dict[str, Any]:
        """Parse TypeScript component registry"""
        registry = {}
        try:
            with open(registry_path, 'r') as f:
                content = f.read()
                
            # Extract component definitions using regex
            component_pattern = r'"([^"]+)":\s*\{([^}]+)\}'
            matches = re.findall(component_pattern, content, re.DOTALL)
            
            for component_name, component_def in matches:
                registry[component_name] = {
                    "name": component_name,
                    "requiredProps": self._extract_array(component_def, "requiredProps"),
                    "optionalProps": self._extract_array(component_def, "optionalProps"),
                    "supportedDataTypes": self._extract_array(component_def, "supportedDataTypes"),
                }
                
        except Exception as e:
            logger.error(f"Failed to parse TypeScript registry: {e}")
            
        return registry
    
    def _extract_array(self, content: str, field_name: str) -> List[str]:
        """Extract array values from TypeScript content"""
        pattern = rf'{field_name}:\s*\[([^\]]+)\]'
        match = re.search(pattern, content)
        if match:
            # Extract quoted strings
            values = re.findall(r'"([^"]+)"', match.group(1))
            return values
        return []
    
    def _load_demo_patterns(self) -> Dict[str, str]:
        """Load patterns for demo content that should be replaced"""
        return {
            # Hero patterns
            r"The Ultimate\s*development studio": "{title}",
            r"We build beautiful products.*?amazing products\.?": "{description}",
            r"Moonbeam|Cursor|Rogue|Editorially": "{company}",
            r"https://aceternity\.com/images/.*?\.png": "{imageUrl}",
            
            # Generic patterns
            r"Lorem ipsum.*?dolor sit amet": "{description}",
            r"John Doe|Jane Smith|Demo User": "{name}",
            r"demo@example\.com|test@test\.com": "{email}",
            r"\+1-234-567-8900|\(555\) 123-4567": "{phone}",
            
            # Company/Project patterns
            r"Acme Corp|Example Inc|Demo Company": "{company}",
            r"https://example\.com|https://demo\.com": "{url}",
            
            # Skill patterns
            r"React|Vue|Angular|Next\.js": "{skill}",
            r"Skill 1|Skill 2|Skill 3": "{skill}",
            
            # Date patterns
            r"2020 - Present|Jan 2020 - Dec 2023": "{dateRange}",
            r"January 2020|December 2023": "{date}",
        }
    
    def get_component_props(self, component_type: str, cv_data: Any, section: str) -> Dict[str, Any]:
        """
        Generate props for any component based on CV data using Universal Adapter
        
        Args:
            component_type: The Aceternity component type
            cv_data: The CV data object
            section: The CV section (hero, experience, skills, etc.)
            
        Returns:
            Props object ready for the component
        """
        try:
            # Import Universal Adapter
            from .universal_adapter import universal_adapter
            
            # Extract section data from cv_data
            section_data = self._extract_section_data(cv_data, section)
            
            if not section_data:
                logger.warning(f"No data found for section {section}")
                return {}
            
            # Use Universal Adapter to generate props
            props = universal_adapter.adapt(component_type, section_data, section)
            
            logger.info(f"Universal Adapter generated {len(props)} props for {component_type}")
            logger.debug(f"Generated props: {props}")
            return props
            
        except Exception as e:
            logger.error(f"Universal Adapter failed for {component_type}: {e}")
            
            # Fallback to legacy mapping system
            logger.info(f"Falling back to legacy mapping for {component_type}")
            component_info = self.component_registry.get(component_type, {})
            required_props = component_info.get("requiredProps", [])
            optional_props = component_info.get("optionalProps", [])
            
            return self._map_cv_to_props(component_type, cv_data, section, required_props, optional_props)
    
    def _extract_section_data(self, cv_data: Any, section: str) -> Any:
        """Extract specific section data from CV data object"""
        try:
            # Handle CVData object (from unified schema)
            if hasattr(cv_data, section):
                section_data = getattr(cv_data, section)
                # If it's a model object, convert to dict
                if hasattr(section_data, 'model_dump'):
                    return section_data.model_dump()
                return section_data
            
            # Handle dict-like objects
            if isinstance(cv_data, dict):
                return cv_data.get(section)
            
            # If cv_data is already the section data, return it
            return cv_data
            
        except Exception as e:
            logger.warning(f"Could not extract section {section} from cv_data: {e}")
            return None
    
    def _map_cv_to_props(self, component_type: str, cv_data: Any, section: str, 
                        required_props: List[str], optional_props: List[str]) -> Dict[str, Any]:
        """Map CV data to component props based on component requirements"""
        props = {}
        
        # Handle different component types
        if "hero" in component_type or "hero" in section:
            props = self._map_hero_props(cv_data, required_props)
        elif "timeline" in component_type:
            props = self._map_timeline_props(cv_data, section)
        elif "card" in component_type:
            props = self._map_card_props(cv_data, section)
        elif "testimonial" in component_type:
            props = self._map_testimonial_props(cv_data, section)
        elif "grid" in component_type or "bento" in component_type:
            props = self._map_grid_props(cv_data, section)
        elif "dock" in component_type or "navbar" in component_type:
            props = self._map_navigation_props(cv_data, section)
        else:
            # Generic mapping
            props = self._map_generic_props(cv_data, section, required_props)
        
        return props
    
    def _map_hero_props(self, cv_data: Any, required_props: List[str]) -> Dict[str, Any]:
        """Map CV data to hero component props"""
        props = {}
        
        if hasattr(cv_data, 'hero') and cv_data.hero:
            hero = cv_data.hero
            props["title"] = getattr(hero, "fullName", "Portfolio")
            props["subtitle"] = getattr(hero, "professionalTitle", "")
            props["description"] = getattr(hero, "summaryTagline", "")
            
        # Handle specific hero component props
        if "products" in required_props:
            # For hero-parallax
            props["products"] = self._generate_project_products(cv_data)
        
        if "children" in required_props:
            # For components that need children
            props["children"] = self._generate_hero_children(cv_data)
            
        return props
    
    def _map_timeline_props(self, cv_data: Any, section: str) -> Dict[str, Any]:
        """Map CV data to timeline component props"""
        data = []
        
        if section == "experience" and hasattr(cv_data, 'experience') and cv_data.experience:
            if hasattr(cv_data.experience, 'experienceItems'):
                for item in cv_data.experience.experienceItems:
                    data.append({
                        "title": getattr(item, "companyName", ""),
                        "content": self._generate_timeline_content(item, "experience")
                    })
                    
        elif section == "education" and hasattr(cv_data, 'education') and cv_data.education:
            if hasattr(cv_data.education, 'educationItems'):
                for item in cv_data.education.educationItems:
                    data.append({
                        "title": getattr(item, "institution", ""),
                        "content": self._generate_timeline_content(item, "education")
                    })
                    
        return {"data": data}
    
    def _map_card_props(self, cv_data: Any, section: str) -> Dict[str, Any]:
        """Map CV data to card component props"""
        items = []
        
        if section == "projects" and hasattr(cv_data, 'projects') and cv_data.projects:
            if hasattr(cv_data.projects, 'projectItems'):
                for project in cv_data.projects.projectItems:
                    items.append({
                        "title": getattr(project, "name", "Project"),
                        "description": getattr(project, "description", ""),
                        "link": getattr(project, "liveUrl", getattr(project, "githubUrl", "#")),
                        "tags": getattr(project, "technologies", [])
                    })
                    
        return {"items": items}
    
    def _map_testimonial_props(self, cv_data: Any, section: str) -> Dict[str, Any]:
        """Map CV data to testimonial component props"""
        testimonials = []
        
        if section == "achievements" and hasattr(cv_data, 'achievements') and cv_data.achievements:
            if hasattr(cv_data.achievements, 'achievements'):
                for achievement in cv_data.achievements.achievements:
                    testimonials.append({
                        "quote": getattr(achievement, "value", ""),
                        "name": getattr(achievement, "label", ""),
                        "designation": getattr(achievement, "contextOrDetail", ""),
                        "src": f"https://ui-avatars.com/api/?name={getattr(achievement, 'label', 'Achievement')}&background=random"
                    })
                    
        return {"testimonials": testimonials}
    
    def _map_grid_props(self, cv_data: Any, section: str) -> Dict[str, Any]:
        """Map CV data to grid/bento component props"""
        items = []
        
        if section == "skills" and hasattr(cv_data, 'skills') and cv_data.skills:
            if hasattr(cv_data.skills, 'skillCategories'):
                for category in cv_data.skills.skillCategories:
                    items.append({
                        "title": getattr(category, "categoryName", "Skills"),
                        "description": ", ".join(getattr(category, "skills", []))
                    })
            elif hasattr(cv_data.skills, 'categories'):
                for category in cv_data.skills.categories:
                    items.append({
                        "title": getattr(category, "name", "Skills"),
                        "description": ", ".join(getattr(category, "items", []))
                    })
                    
        return {"items": items}
    
    def _map_navigation_props(self, cv_data: Any, section: str) -> Dict[str, Any]:
        """Map CV data to navigation component props"""
        items = []
        
        if section == "contact" and hasattr(cv_data, 'contact') and cv_data.contact:
            contact = cv_data.contact
            
            if getattr(contact, "email", None):
                items.append({
                    "icon": "email",
                    "link": f"mailto:{contact.email}",
                    "title": "Email"
                })
                
            if getattr(contact, "phone", None):
                items.append({
                    "icon": "phone", 
                    "link": f"tel:{contact.phone}",
                    "title": "Phone"
                })
                
            if hasattr(contact, "professionalLinks") and contact.professionalLinks:
                for link in contact.professionalLinks:
                    items.append({
                        "icon": getattr(link, "platform", "link").lower(),
                        "link": str(getattr(link, "url", "#")),
                        "title": getattr(link, "platform", "Link")
                    })
                    
        return {"items": items}
    
    def _map_generic_props(self, cv_data: Any, section: str, required_props: List[str]) -> Dict[str, Any]:
        """Generic prop mapping for unknown component types"""
        props = {}
        
        # Try to map common prop names
        section_data = getattr(cv_data, section, None)
        if section_data:
            for prop in required_props:
                if hasattr(section_data, prop):
                    props[prop] = getattr(section_data, prop)
                elif prop in ["title", "heading", "name"]:
                    props[prop] = self._find_title_in_data(section_data)
                elif prop in ["description", "content", "text"]:
                    props[prop] = self._find_description_in_data(section_data)
                elif prop in ["items", "data", "list"]:
                    props[prop] = self._find_list_in_data(section_data)
                    
        return props
    
    def _generate_timeline_content(self, item: Any, item_type: str) -> str:
        """Generate HTML content for timeline items"""
        content = ""
        
        if item_type == "experience":
            title = getattr(item, "jobTitle", "Position")
            content = f"<h3>{title}</h3>"
            
            date_range = getattr(item, "dateRange", None)
            if date_range:
                start = getattr(date_range, "startDate", "")
                end = getattr(date_range, "endDate", "Present")
                content += f"<p className='text-sm text-gray-500'>{start} - {end}</p>"
                
            description = getattr(item, "summary", "")
            if description:
                content += f"<p>{description}</p>"
                
            responsibilities = getattr(item, "responsibilitiesAndAchievements", [])
            if responsibilities:
                content += "<ul>"
                for resp in responsibilities:
                    content += f"<li>{resp}</li>"
                content += "</ul>"
                
        elif item_type == "education":
            degree = getattr(item, "degree", "")
            field = getattr(item, "fieldOfStudy", "")
            content = f"<h3>{degree} {field}</h3>"
            
            date_range = getattr(item, "dateRange", None)
            if date_range:
                start = getattr(date_range, "startDate", "")
                end = getattr(date_range, "endDate", "")
                content += f"<p className='text-sm text-gray-500'>{start} - {end}</p>"
                
            gpa = getattr(item, "gpa", "")
            if gpa:
                content += f"<p>{gpa}</p>"
                
        return content
    
    def _generate_project_products(self, cv_data: Any) -> List[Dict[str, str]]:
        """Generate products array for hero-parallax from projects"""
        products = []
        
        if hasattr(cv_data, 'projects') and cv_data.projects:
            if hasattr(cv_data.projects, 'projectItems'):
                for project in cv_data.projects.projectItems[:15]:  # Limit to 15
                    products.append({
                        "title": getattr(project, "name", "Project"),
                        "link": getattr(project, "liveUrl", getattr(project, "githubUrl", "#")),
                        "thumbnail": getattr(project, "imageUrl", f"https://ui-avatars.com/api/?name={getattr(project, 'name', 'Project')}&background=random&size=600")
                    })
                    
        # Fill with placeholder if not enough projects
        while len(products) < 15:
            products.append({
                "title": f"Project {len(products) + 1}",
                "link": "#",
                "thumbnail": f"https://ui-avatars.com/api/?name=Project{len(products) + 1}&background=random&size=600"
            })
            
        return products
    
    def _generate_hero_children(self, cv_data: Any) -> str:
        """Generate children content for hero components"""
        if hasattr(cv_data, 'hero') and cv_data.hero:
            hero = cv_data.hero
            name = getattr(hero, "fullName", "Portfolio")
            title = getattr(hero, "professionalTitle", "")
            summary = getattr(hero, "summaryTagline", "")
            
            return f"""
                <div className="flex flex-col items-center justify-center h-full">
                    <h1 className="text-4xl md:text-7xl font-bold text-center mb-4">{name}</h1>
                    <p className="text-xl md:text-2xl text-gray-300 mb-8">{title}</p>
                    <p className="text-base md:text-lg text-gray-400 max-w-2xl text-center px-4">{summary}</p>
                </div>
            """
            
        return "<div>Portfolio</div>"
    
    def _find_title_in_data(self, data: Any) -> str:
        """Find title-like property in data"""
        for attr in ["title", "name", "heading", "label"]:
            if hasattr(data, attr):
                return getattr(data, attr)
        return "Title"
    
    def _find_description_in_data(self, data: Any) -> str:
        """Find description-like property in data"""
        for attr in ["description", "content", "text", "summary", "details"]:
            if hasattr(data, attr):
                return getattr(data, attr)
        return ""
    
    def _find_list_in_data(self, data: Any) -> List[Any]:
        """Find list-like property in data"""
        for attr in ["items", "data", "list", "entries", "elements"]:
            if hasattr(data, attr):
                return getattr(data, attr)
        return []
    
    def clean_component_content(self, component_path: Path, props: Dict[str, Any]):
        """
        Clean demo content from a component file and inject actual data
        
        Args:
            component_path: Path to the component file
            props: Props to inject into the component
        """
        try:
            with open(component_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            
            # Replace demo patterns with actual data
            for pattern, replacement_template in self.demo_content_patterns.items():
                # Find all matches
                matches = re.finditer(pattern, content, re.IGNORECASE)
                
                for match in matches:
                    # Determine what prop to use based on the replacement template
                    if "{title}" in replacement_template and "title" in props:
                        replacement = props["title"]
                    elif "{description}" in replacement_template and "description" in props:
                        replacement = props["description"]
                    elif "{name}" in replacement_template and "name" in props:
                        replacement = props["name"]
                    elif "{email}" in replacement_template and "email" in props:
                        replacement = props["email"]
                    else:
                        # Skip if we don't have the data
                        continue
                        
                    content = content.replace(match.group(0), str(replacement))
            
            # Write back if changed
            if content != original_content:
                with open(component_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                logger.info(f"Cleaned demo content in {component_path.name}")
                
        except Exception as e:
            logger.error(f"Failed to clean component content: {e}")
    
    def validate_component_exists(self, component_type: str, aceternity_lib_path: Path) -> bool:
        """Check if a component exists in the Aceternity library"""
        component_path = aceternity_lib_path / "components" / "ui" / component_type
        return component_path.exists()
    
    def get_component_import_path(self, component_type: str) -> str:
        """Get the correct import path for a component"""
        # Handle special cases
        if component_type == "background-gradient":
            return "@/components/ui/background-gradient"
        
        # Standard import path
        return f"@/components/ui/{component_type}"
    
    def get_component_dependencies(self, component_type: str) -> Dict[str, str]:
        """Get npm dependencies required by a component"""
        # Common dependencies for most Aceternity components
        deps = {
            "framer-motion": "^10.16.16",
            "clsx": "^2.0.0",
            "tailwind-merge": "^2.2.0",
            "@tabler/icons-react": "^2.47.0",
            "lucide-react": "^0.294.0"
        }
        
        # Component-specific dependencies
        if "3d" in component_type or "three" in component_type:
            deps["three"] = "^0.158.0"
            deps["@react-three/fiber"] = "^8.15.11"
            deps["@react-three/drei"] = "^9.88.0"
            
        if "globe" in component_type:
            deps["three-globe"] = "^2.30.0"
            
        if "chart" in component_type or "graph" in component_type:
            deps["recharts"] = "^2.9.0"
            
        return deps

# Singleton instance
component_adapter = ComponentAdapter()