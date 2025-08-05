"""
Simplified Component Selector for CV2WEB MVP
Maps CV sections to Aceternity components for portfolio generation
"""
import logging
from typing import Dict, List, Any, Optional, Set
from dataclasses import dataclass
from enum import Enum
from pathlib import Path

from backend.schemas.unified import CVData
from .component_adapter import component_adapter
from .component_registry import component_registry

logger = logging.getLogger(__name__)

class UserArchetype(Enum):
    """Simplified user archetypes for MVP"""
    TECHNICAL = "technical"  # Developers, engineers
    CREATIVE = "creative"    # Designers, artists
    BUSINESS = "business"    # Managers, executives
    GENERAL = "general"      # Default/mixed

@dataclass
class ComponentSelection:
    """Represents a selected component with its configuration"""
    section: str
    component_type: str
    import_path: str
    props: Dict[str, Any]
    priority: int  # Display order

class ComponentSelector:
    """
    Simplified component selector for MVP
    Maps CV sections to the best Aceternity components
    """
    
    def __init__(self, enable_smart_analysis: bool = False):
        # Define component mappings for each CV section
        self.section_mappings = self._initialize_mappings()
        self.enable_smart_analysis = enable_smart_analysis
        self._smart_analyzer = None
        
    def _initialize_mappings(self) -> Dict[str, Dict[str, Any]]:
        """Initialize CV section to Aceternity component mappings"""
        return {
            "hero": {
                "technical": {
                    "component": "background-gradient",
                    "import_path": "@/components/ui/background-gradient",
                    "fallback": "hero-highlight"
                },
                "creative": {
                    "component": "hero-highlight", 
                    "import_path": "@/components/ui/hero-highlight",
                    "fallback": "background-gradient"
                },
                "business": {
                    "component": "background-gradient",
                    "import_path": "@/components/ui/background-gradient",
                    "fallback": "hero-highlight"
                },
                "general": {
                    "component": "hero-highlight",
                    "import_path": "@/components/ui/hero-highlight",
                    "fallback": "background-gradient"
                }
            },
            "summary": {
                "all": {
                    "component": "text-generate-effect",
                    "import_path": "@/components/ui/text-generate-effect",
                    "fallback": "card-spotlight"
                }
            },
            "experience": {
                "all": {
                    "component": "timeline",
                    "import_path": "@/components/ui/timeline",
                    "fallback": "sticky-scroll-reveal"
                }
            },
            "skills": {
                "technical": {
                    "component": "bento-grid",
                    "import_path": "@/components/ui/bento-grid",
                    "fallback": "card-hover-effect"
                },
                "creative": {
                    "component": "animated-tooltip",
                    "import_path": "@/components/ui/animated-tooltip",
                    "fallback": "bento-grid"
                },
                "default": {
                    "component": "bento-grid",
                    "import_path": "@/components/ui/bento-grid",
                    "fallback": "card-hover-effect"
                }
            },
            "projects": {
                "technical": {
                    "component": "card-hover-effect",
                    "import_path": "@/components/ui/card-hover-effect",
                    "fallback": "3d-card"
                },
                "creative": {
                    "component": "layout-grid",
                    "import_path": "@/components/ui/layout-grid",
                    "fallback": "card-hover-effect"
                },
                "default": {
                    "component": "card-hover-effect",
                    "import_path": "@/components/ui/card-hover-effect",
                    "fallback": "bento-grid"
                }
            },
            "education": {
                "all": {
                    "component": "timeline",
                    "import_path": "@/components/ui/timeline",
                    "fallback": "card-stack"
                }
            },
            "achievements": {
                "all": {
                    "component": "animated-testimonials",
                    "import_path": "@/components/ui/animated-testimonials",
                    "fallback": "card-stack"
                }
            },
            "certifications": {
                "all": {
                    "component": "card-stack",
                    "import_path": "@/components/ui/card-stack",
                    "fallback": "bento-grid"
                }
            },
            "languages": {
                "all": {
                    "component": "animated-tooltip",
                    "import_path": "@/components/ui/animated-tooltip",
                    "fallback": "card-hover-effect"
                }
            },
            "courses": {
                "all": {
                    "component": "card-hover-effect",
                    "import_path": "@/components/ui/card-hover-effect",
                    "fallback": "bento-grid"
                }
            },
            "volunteer": {
                "all": {
                    "component": "timeline",
                    "import_path": "@/components/ui/timeline",
                    "fallback": "card-stack"
                }
            },
            "hobbies": {
                "all": {
                    "component": "flip-words",
                    "import_path": "@/components/ui/flip-words",
                    "fallback": "animated-tooltip"
                }
            },
            "contact": {
                "all": {
                    "component": "floating-dock",
                    "import_path": "@/components/ui/floating-dock",
                    "fallback": "floating-navbar"
                }
            },
            "publications": {
                "all": {
                    "component": "card-stack",
                    "import_path": "@/components/ui/card-stack",
                    "fallback": "timeline"
                }
            },
            "speaking": {
                "all": {
                    "component": "timeline",
                    "import_path": "@/components/ui/timeline",
                    "fallback": "card-hover-effect"
                }
            },
            "patents": {
                "all": {
                    "component": "card-hover-effect",
                    "import_path": "@/components/ui/card-hover-effect",
                    "fallback": "card-stack"
                }
            },
            "memberships": {
                "all": {
                    "component": "animated-tooltip",
                    "import_path": "@/components/ui/animated-tooltip",
                    "fallback": "card-stack"
                }
            }
        }
    
    def detect_archetype(self, cv_data: CVData) -> UserArchetype:
        """
        Simple archetype detection based on CV content
        """
        # Count technical indicators
        technical_score = 0
        creative_score = 0
        business_score = 0
        
        # Check skills
        if cv_data.skills and cv_data.skills.skillCategories:
            for category in cv_data.skills.skillCategories:
                category_name = category.categoryName.lower() if category.categoryName else ""
                skills = category.skills or []
                
                if any(term in category_name for term in ["programming", "technical", "engineering", "development"]):
                    technical_score += 2
                elif any(term in category_name for term in ["design", "creative", "artistic", "ui/ux"]):
                    creative_score += 2
                elif any(term in category_name for term in ["management", "leadership", "business", "strategy"]):
                    business_score += 2
                
                # Check individual skills
                for skill in skills:
                    skill_name = str(skill).lower()
                    
                    if any(lang in skill_name for lang in ["python", "javascript", "java", "react", "docker", "kubernetes"]):
                        technical_score += 1
                    elif any(tool in skill_name for tool in ["figma", "photoshop", "illustrator", "sketch"]):
                        creative_score += 1
                    elif any(term in skill_name for term in ["excel", "powerpoint", "project management", "agile"]):
                        business_score += 1
        
        # Check job titles
        if cv_data.hero and cv_data.hero.professionalTitle:
            title = cv_data.hero.professionalTitle.lower()
            
            if any(term in title for term in ["engineer", "developer", "programmer", "architect"]):
                technical_score += 3
            elif any(term in title for term in ["designer", "artist", "creative"]):
                creative_score += 3
            elif any(term in title for term in ["manager", "director", "executive", "ceo", "vp"]):
                business_score += 3
        
        # Determine archetype
        if technical_score > creative_score and technical_score > business_score:
            return UserArchetype.TECHNICAL
        elif creative_score > technical_score and creative_score > business_score:
            return UserArchetype.CREATIVE
        elif business_score > technical_score and business_score > creative_score:
            return UserArchetype.BUSINESS
        else:
            return UserArchetype.GENERAL
    
    def select_components(self, cv_data: CVData, archetype: Optional[UserArchetype] = None) -> List[ComponentSelection]:
        """
        Select optimal components for each CV section
        
        If enable_smart_analysis is True, will consult smart analyzer for better selections
        """
        # Check if we should use smart analysis
        if self.enable_smart_analysis:
            # Lazy load smart analyzer
            if not self._smart_analyzer:
                from .smart_component_selector import SmartComponentSelector
                self._smart_analyzer = SmartComponentSelector()
            
            # Check if smart analysis recommends enhancement
            if self._should_use_smart_analysis(cv_data):
                logger.info("Using smart component analysis for enhanced selection")
                return self._smart_analyzer.select_components(cv_data)
        
        # Auto-detect archetype if not provided
        if not archetype:
            archetype = self.detect_archetype(cv_data)
            logger.info(f"Detected user archetype: {archetype.value}")
        
        selections = []
        priority = 0
        used_components = set()  # Track used components to avoid duplicates
        
        # Process each section in order
        section_order = [
            ("hero", cv_data.hero),
            ("summary", cv_data.summary),
            ("experience", cv_data.experience),
            ("education", cv_data.education),
            ("skills", cv_data.skills),
            ("projects", cv_data.projects),
            ("achievements", cv_data.achievements),
            ("certifications", cv_data.certifications),
            ("languages", cv_data.languages),
            ("courses", cv_data.courses),
            ("volunteer", cv_data.volunteer),
            ("publications", cv_data.publications),
            ("speaking", cv_data.speaking),
            ("patents", cv_data.patents),
            ("memberships", cv_data.memberships),
            ("hobbies", cv_data.hobbies),
            ("contact", cv_data.contact)
        ]
        
        for section_name, section_data in section_order:
            if not section_data:
                continue
                
            # Skip empty sections
            if self._is_section_empty(section_name, section_data):
                continue
            
            # Get item count for this section
            item_count = self._get_section_item_count(section_name, section_data)
            
            # Get component mapping with item count consideration
            mapping = self._get_component_for_section(section_name, archetype, item_count, used_components)
            
            if mapping:
                component_key = mapping["component"]
                
                # Resolve component using registry (handles aliases)
                resolved_key, component_config = component_registry.resolve_component(component_key)
                
                if not resolved_key:
                    # Try fallback from mapping
                    if "fallback" in mapping and mapping["fallback"]:
                        resolved_key, component_config = component_registry.resolve_component(mapping["fallback"])
                    
                    if not resolved_key:
                        logger.warning(f"No valid component found for {section_name}")
                        continue
                
                # Get import path from registry
                import_path = component_registry.get_import_path(resolved_key)
                
                if import_path:
                    # Use component adapter for universal prop generation
                    props = component_adapter.get_component_props(
                        resolved_key, 
                        cv_data, 
                        section_name
                    )
                    
                    # Fall back to legacy prop generation if adapter returns empty
                    if not props:
                        props = self._generate_props(section_name, section_data, resolved_key)
                    
                    selection = ComponentSelection(
                        section=section_name,
                        component_type=resolved_key,
                        import_path=import_path,
                        props=props,
                        priority=priority
                    )
                    selections.append(selection)
                    priority += 1
                    used_components.add(resolved_key)  # Track used component
                    
                    logger.info(f"Selected {resolved_key} for {section_name}")
        
        return selections
    
    def _should_use_smart_analysis(self, cv_data: CVData) -> bool:
        """
        Determine if smart analysis would benefit this CV
        Uses simple heuristics for fast decision
        """
        # Count populated sections
        section_count = 0
        content_complexity = 0
        
        # Check all possible sections
        for field_name, field_value in cv_data.model_dump().items():
            if field_value and field_name != 'metadata':
                section_count += 1
                
                # Check for complex content
                if hasattr(field_value, 'model_dump'):
                    data = field_value.model_dump()
                    # Look for lists with multiple items
                    for key, val in data.items():
                        if isinstance(val, list) and len(val) > 3:
                            content_complexity += 1
        
        # Use smart analysis for:
        # 1. Rich CVs (7+ sections)
        # 2. Complex content (multiple sections with 3+ items)
        # 3. Mixed archetypes (detected as GENERAL)
        archetype = self.detect_archetype(cv_data)
        
        should_use_smart = (
            section_count >= 7 or 
            content_complexity >= 3 or
            archetype == UserArchetype.GENERAL
        )
        
        if should_use_smart:
            logger.info(f"Smart analysis recommended: {section_count} sections, complexity: {content_complexity}")
        
        return should_use_smart
    
    def _is_section_empty(self, section_name: str, section_data: Any) -> bool:
        """Check if a section has meaningful content"""
        if not section_data:
            return True
            
        # Map section names to their list field names
        list_fields = {
            "experience": "experienceItems",
            "education": "educationItems", 
            "projects": "projectItems",
            "skills": "skillCategories",
            "achievements": "achievements",
            "certifications": "certificationItems",
            "languages": "languageItems",
            "courses": "courseItems",
            "volunteer": "volunteerItems",
            "hobbies": "hobbies",
            "publications": "publications",
            "speaking": "speakingEngagements",
            "patents": "patents",
            "memberships": "memberships"
        }
        
        if section_name in list_fields:
            field_name = list_fields[section_name]
            if hasattr(section_data, field_name):
                items = getattr(section_data, field_name)
                if not items or len(items) == 0:
                    return True
                    
                # Check if all items are empty/placeholder
                if section_name == "speaking":
                    # Check if all speaking entries are empty
                    return all(not getattr(item, 'eventName', '') and not getattr(item, 'title', '') 
                              for item in items)
                elif section_name == "hobbies":
                    # Check if hobbies are empty strings
                    return all(not hobby or hobby.strip() == '' for hobby in items)
                elif section_name == "achievements":
                    # Check if all achievements are empty
                    return all(not getattr(item, 'value', '') and not getattr(item, 'label', '') 
                              for item in items)
                
        # For summary section
        if section_name == "summary" and hasattr(section_data, "summaryText"):
            return not section_data.summaryText or len(section_data.summaryText.strip()) == 0
                
        return False
    
    def _get_section_item_count(self, section: str, section_data: Any) -> int:
        """Get the number of items in a section"""
        # Map section names to their list field names
        list_fields = {
            "experience": "experienceItems",
            "education": "educationItems", 
            "projects": "projectItems",
            "skills": "skillCategories",
            "achievements": "achievements",
            "certifications": "certificationItems",
            "languages": "languageItems",
            "courses": "courseItems",
            "volunteer": "volunteerItems",
            "hobbies": "hobbies",
            "publications": "publications",
            "speaking": "speakingEngagements",
            "patents": "patents",
            "memberships": "memberships"
        }
        
        if section in list_fields:
            field_name = list_fields[section]
            if hasattr(section_data, field_name):
                items = getattr(section_data, field_name)
                return len(items) if items else 0
                
        return 1  # Default to 1 for non-list sections
    
    def _get_component_for_section(self, section: str, archetype: UserArchetype, 
                                  item_count: int = 1, used_components: Set[str] = None) -> Optional[Dict[str, str]]:
        """Get component mapping for a section and archetype, considering item count and used components"""
        if section not in self.section_mappings:
            return None
            
        section_map = self.section_mappings[section]
        
        # Special handling for sections with low item counts
        if item_count < 3 and section in ["experience", "education", "volunteer"]:
            # Don't use timeline for less than 3 items - use cards instead
            alternative_mappings = {
                "experience": {
                    "component": "card-hover-effect",
                    "import_path": "@/components/ui/card-hover-effect",
                    "fallback": "bento-grid"
                },
                "education": {
                    "component": "card-stack",
                    "import_path": "@/components/ui/card-stack",
                    "fallback": "card-hover-effect"
                },
                "volunteer": {
                    "component": "card-hover-effect",
                    "import_path": "@/components/ui/card-hover-effect",
                    "fallback": "card-stack"
                }
            }
            if section in alternative_mappings:
                mapping = alternative_mappings[section].copy()
                # Check if component is already used
                if used_components and mapping["component"] in used_components:
                    # Use fallback if primary is already used
                    if mapping["fallback"] and mapping["fallback"] not in used_components:
                        mapping["component"] = mapping["fallback"]
                        mapping["import_path"] = f"@/components/ui/{mapping['fallback']}"
                return mapping
        
        # Get base mapping
        base_mapping = None
        
        # Check for archetype-specific mapping
        if archetype.value in section_map:
            base_mapping = section_map[archetype.value].copy()
        # Check for universal mapping
        elif "all" in section_map:
            base_mapping = section_map["all"].copy()
        # Use default if available
        elif "default" in section_map:
            base_mapping = section_map["default"].copy()
            
        if base_mapping and used_components:
            # Check if component is already used
            if base_mapping["component"] in used_components:
                # Try fallback if available
                if "fallback" in base_mapping and base_mapping["fallback"]:
                    if base_mapping["fallback"] not in used_components:
                        base_mapping["component"] = base_mapping["fallback"]
                        base_mapping["import_path"] = f"@/components/ui/{base_mapping['fallback']}"
                    else:
                        # Both primary and fallback are used, skip this section
                        logger.warning(f"Both primary and fallback components already used for {section}")
                        return None
            
        return base_mapping
    
    def _generate_props(self, section: str, data: Any, component_type: str) -> Dict[str, Any]:
        """Generate component props based on section data"""
        props = {}
        
        # Hero section props
        if section == "hero" and data:
            props = {
                "title": getattr(data, "fullName", "Professional"),
                "subtitle": getattr(data, "professionalTitle", ""),
                "description": getattr(data, "summaryTagline", "")
            }
            
        # Summary section props
        elif section == "summary" and component_type == "text-generate-effect" and data:
            props = {
                "words": getattr(data, "summaryText", ""),
                "duration": 3
            }
            
        # Timeline props (for experience/education/volunteer)
        elif component_type == "timeline":
            entries = []
            
            if section == "experience" and hasattr(data, "experienceItems"):
                for entry in data.experienceItems:
                    date_range = entry.dateRange if entry.dateRange else None
                    entries.append({
                        "title": getattr(entry, "companyName", "Company"),
                        "subtitle": getattr(entry, "jobTitle", "Position"),
                        "date": f"{date_range.startDate if date_range else 'Date'} - {date_range.endDate if date_range and date_range.endDate else 'Present'}",
                        "description": getattr(entry, "summary", ""),
                        "bullets": getattr(entry, "responsibilitiesAndAchievements", [])
                    })
                    
            elif section == "education" and hasattr(data, "educationItems"):
                for entry in data.educationItems:
                    date_range = entry.dateRange if entry.dateRange else None
                    entries.append({
                        "title": getattr(entry, "institution", "Institution"),
                        "subtitle": f"{getattr(entry, 'degree', '')} {getattr(entry, 'fieldOfStudy', '')}".strip(),
                        "date": f"{date_range.startDate if date_range else ''} - {date_range.endDate if date_range else ''}".strip(' -'),
                        "description": getattr(entry, "gpa", ""),
                        "bullets": getattr(entry, "relevantCoursework", [])
                    })
                    
            elif section == "volunteer" and hasattr(data, "volunteerItems"):
                for entry in data.volunteerItems:
                    date_range = entry.dateRange if entry.dateRange else None
                    entries.append({
                        "title": getattr(entry, "organization", "Organization"),
                        "subtitle": getattr(entry, "role", "Role"),
                        "date": f"{date_range.startDate if date_range else ''} - {date_range.endDate if date_range else ''}".strip(' -'),
                        "description": getattr(entry, "description", ""),
                        "bullets": getattr(entry, "responsibilities", [])
                    })
                    
            # Convert to Timeline's expected format
            timeline_data = []
            for entry in entries:
                content = f"<h3>{entry.get('subtitle', '')}</h3>"
                if entry.get('date'):
                    content += f"<p className='text-sm text-gray-500'>{entry['date']}</p>"
                if entry.get('description'):
                    content += f"<p>{entry['description']}</p>"
                if entry.get('bullets'):
                    content += "<ul>"
                    for bullet in entry['bullets']:
                        content += f"<li>{bullet}</li>"
                    content += "</ul>"
                
                timeline_data.append({
                    "title": entry.get('title', ''),
                    "content": content
                })
            
            props = {"data": timeline_data}
            
        # Bento grid props (for skills)
        elif component_type == "bento-grid" and section == "skills":
            items = []
            
            if hasattr(data, "skillCategories"):
                for category in data.skillCategories:
                    items.append({
                        "title": category.categoryName,
                        "description": ", ".join(category.skills)
                    })
                    
            props = {"items": items}
            
        # Card props (for projects, certifications, courses, and also experience/education when < 3 items)
        elif component_type == "card-hover-effect":
            items = []
            
            if section == "projects" and hasattr(data, "projectItems"):
                for entry in data.projectItems:
                    items.append({
                        "title": getattr(entry, "title", "Project"),
                        "description": getattr(entry, "description", ""),
                        "link": getattr(entry, "projectUrl", "#"),
                        "tags": getattr(entry, "technologiesUsed", [])
                    })
                    
            elif section == "courses" and hasattr(data, "courseItems"):
                for entry in data.courseItems:
                    items.append({
                        "title": getattr(entry, "title", "Course"),
                        "description": f"{getattr(entry, 'issuingOrganization', '')} - {getattr(entry, 'description', '')}".strip(' -'),
                        "link": getattr(entry, "certificateUrl", "#")
                    })
                    
            elif section == "experience" and hasattr(data, "experienceItems"):
                for entry in data.experienceItems:
                    date_range = entry.dateRange if entry.dateRange else None
                    items.append({
                        "title": getattr(entry, "jobTitle", "Position"),
                        "description": f"{getattr(entry, 'companyName', '')} | {getattr(entry, 'summary', '')}",
                        "link": "#",
                        "tags": [f"{date_range.startDate if date_range else ''} - {date_range.endDate if date_range and date_range.endDate else 'Present'}"]
                    })
                    
            elif section == "volunteer" and hasattr(data, "volunteerItems"):
                for entry in data.volunteerItems:
                    date_range = entry.dateRange if entry.dateRange else None
                    items.append({
                        "title": getattr(entry, "role", "Role"),
                        "description": f"{getattr(entry, 'organization', '')} | {getattr(entry, 'description', '')}",
                        "link": "#",
                        "tags": [f"{date_range.startDate if date_range else ''} - {date_range.endDate if date_range else ''}"]
                    })
                    
            props = {"items": items}
            
        # Card stack props (for achievements, certifications, and education when < 3 items)
        elif component_type == "card-stack":
            items = []
            
            if section == "achievements" and hasattr(data, "achievements"):
                for entry in data.achievements:
                    items.append({
                        "title": entry.value,
                        "content": entry.label
                    })
                    
            elif section == "certifications" and hasattr(data, "certificationItems"):
                for entry in data.certificationItems:
                    items.append({
                        "title": getattr(entry, "title", "Certification"),
                        "content": f"{getattr(entry, 'issuingOrganization', '')} - {getattr(entry, 'issueDate', '')}".strip(' -')
                    })
                    
            elif section == "education" and hasattr(data, "educationItems"):
                for entry in data.educationItems:
                    date_range = entry.dateRange if entry.dateRange else None
                    items.append({
                        "title": f"{getattr(entry, 'degree', '')} {getattr(entry, 'fieldOfStudy', '')}".strip(),
                        "content": f"{getattr(entry, 'institution', '')} | {date_range.startDate if date_range else ''} - {date_range.endDate if date_range else ''}".strip(' |')
                    })
                    
            props = {"items": items}
            
        # Animated testimonials props (for achievements)
        elif component_type == "animated-testimonials" and section == "achievements":
            testimonials = []
            
            if hasattr(data, "achievements"):
                for i, entry in enumerate(data.achievements):
                    testimonials.append({
                        "quote": entry.label,
                        "name": entry.value,
                        "designation": getattr(entry, "contextOrDetail", "Achievement"),
                        "src": f"https://ui-avatars.com/api/?name=Achievement{i+1}&background=random"
                    })
                    
            props = {"testimonials": testimonials} if testimonials else {}
            
        # Animated tooltip props (for languages)
        elif component_type == "animated-tooltip" and section == "languages":
            items = []
            
            if hasattr(data, "languageItems"):
                for entry in data.languageItems:
                    items.append({
                        "title": entry.language,
                        "description": entry.proficiency
                    })
                    
            props = {"items": items}
            
        # Flip words props (for hobbies)
        elif component_type == "flip-words" and section == "hobbies":
            props = {
                "words": getattr(data, "hobbies", []),
                "prefix": "Interests: "
            }
            
        # Contact props
        elif section == "contact" and data:
            items = []
            
            if hasattr(data, "email") and data.email:
                items.append({"icon": "email", "link": f"mailto:{data.email}", "title": "Email"})
            if hasattr(data, "phone") and data.phone:
                items.append({"icon": "phone", "link": f"tel:{data.phone}", "title": "Phone"})
                
            # Check professional links
            if hasattr(data, "professionalLinks") and data.professionalLinks:
                for link in data.professionalLinks:
                    platform = link.platform.lower()
                    icon_map = {
                        "linkedin": "linkedin",
                        "github": "github",
                        "twitter": "twitter",
                        "portfolio": "globe"
                    }
                    items.append({
                        "icon": icon_map.get(platform, "link"),
                        "link": str(link.url),
                        "title": link.platform
                    })
                    
            props = {"items": items}
            
        return props
    
    def generate_layout_config(self, selections: List[ComponentSelection]) -> Dict[str, Any]:
        """Generate layout configuration for the portfolio"""
        return {
            "theme": "default",
            "sections": [
                {
                    "id": selection.section,
                    "component": selection.component_type,
                    "import": selection.import_path,
                    "props": selection.props,
                    "order": selection.priority
                }
                for selection in sorted(selections, key=lambda x: x.priority)
            ],
            "global_settings": {
                "dark_mode": True,
                "animations": True,
                "responsive": True
            }
        }

# Singleton instance with smart analysis enabled by default
component_selector = ComponentSelector(enable_smart_analysis=True)