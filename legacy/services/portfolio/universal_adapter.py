"""
Universal Component Adapter for CV2WEB
Converts any CV content to any Aceternity component format
"""

import logging
from typing import Dict, List, Any, Optional, Union
from dataclasses import dataclass
from enum import Enum

from .adapter_compatibility import ensure_compatibility
from .props_schema import props_validator

logger = logging.getLogger(__name__)

class LayoutType(Enum):
    ROW = "row"
    GRID = "grid"
    CAROUSEL = "carousel"

@dataclass
class UniversalContent:
    """Normalized content structure"""
    primary: str          # Main text (title, name, label)
    secondary: str = ""   # Supporting text (subtitle, description)
    tertiary: str = ""    # Additional info (date, location)
    action_url: str = ""  # Optional URL
    action_text: str = "View More"
    metadata: Dict = None

class UniversalConstants:
    """Constants for universal adapter"""
    MIN_BENTO_ITEMS = 3
    MAX_GRID_COLUMNS = 3
    CAROUSEL_THRESHOLD = 9
    DEFAULT_TEXT_SCALE = 1.2
    
    # Icon mapping to React components
    ICON_MAPPING = {
        'email': 'IconMail',
        'phone': 'IconPhone',
        'github': 'IconBrandGithub',
        'linkedin': 'IconBrandLinkedin',
        'website': 'IconWorld',
        'twitter': 'IconBrandTwitter',
        'location': 'IconMapPin',
        'portfolio': 'IconBriefcase',
        'resume': 'IconFileText'
    }

class UniversalComponentAdapter:
    """
    Universal adapter - any CV content to any Aceternity component
    Replaces the if/elif nightmare in portfolio_generator.py
    """
    
    # Field mappings for intelligent extraction
    FIELD_MAPPINGS = {
        'hero': {
            'primary': ['fullName', 'name'],
            'secondary': ['professionalTitle', 'title', 'role'],
            'tertiary': ['summaryTagline', 'tagline', 'summary']
        },
        'summary': {
            'primary': ['summaryText', 'text', 'content'],
            'secondary': ['keyStrengths', 'highlights'],
            'tertiary': ['yearsOfExperience', 'experience']
        },
        'experience': {
            'primary': ['jobTitle', 'position', 'role', 'title'],
            'secondary': ['companyName', 'organization', 'employer', 'company'],
            'tertiary': ['dateRange', 'duration', 'period', 'dates']
        },
        'education': {
            'primary': ['degree', 'qualification', 'title', 'program'],
            'secondary': ['institution', 'school', 'university', 'college'],
            'tertiary': ['graduationDate', 'year', 'dateRange', 'dates']
        },
        'skills': {
            'primary': ['categoryName', 'skillName', 'name', 'title'],
            'secondary': ['skills', 'items', 'technologies', 'tools'],
            'tertiary': ['level', 'proficiency', 'years']
        },
        'projects': {
            'primary': ['title', 'projectName', 'name'],
            'secondary': ['description', 'summary', 'overview'],
            'tertiary': ['technologies', 'stack', 'tools', 'tech']
        },
        'achievements': {
            'primary': ['value', 'title', 'award', 'recognition', 'name'],
            'secondary': ['label', 'description', 'details', 'context'],
            'tertiary': ['contextOrDetail', 'date', 'year', 'when']
        },
        'certifications': {
            'primary': ['title', 'certification', 'name'],
            'secondary': ['issuer', 'organization', 'provider'],
            'tertiary': ['date', 'validUntil', 'issued', 'year']
        },
        'languages': {
            'primary': ['language', 'name'],
            'secondary': ['proficiency', 'level'],
            'tertiary': ['certification', 'test']
        },
        'volunteer': {
            'primary': ['role', 'position', 'title'],
            'secondary': ['organization', 'charity', 'cause'],
            'tertiary': ['duration', 'dates', 'period']
        },
        'hobbies': {
            'primary': ['hobby', 'interest', 'activity', 'name'],
            'secondary': ['description', 'details'],
            'tertiary': ['frequency', 'since']
        },
        'contact': {
            'primary': ['platform', 'type', 'method'],
            'secondary': ['url', 'link', 'href'],
            'tertiary': ['description', 'label']
        }
    }
    
    def adapt(self, 
              component_type: str, 
              cv_data: Union[List, Dict, str], 
              section: str, 
              options: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Main adaptation method - converts any CV data to component props
        
        This is the MAGIC METHOD that replaces 1000+ lines of if/elif code!
        """
        options = options or {}
        
        # Log adaptation for debugging
        data_length = len(cv_data) if isinstance(cv_data, (list, dict)) else 1
        logger.info(f"Adapting {component_type} for {section} with {data_length} items")
        logger.debug(f"Input data type: {type(cv_data)}, data: {cv_data}")
        
        # Handle different input types
        if isinstance(cv_data, str):
            return self._adapt_text_content(component_type, cv_data, options)
        
        # Normalize data to universal format (handles dict/list conversion internally)
        universal_data = self._normalize_data(cv_data, section)
        
        # Get smart layout based on item count
        layout = options.get('layout') or self._get_smart_layout(len(universal_data))
        
        # Component-specific adaptation
        adapter_method = getattr(self, f'_adapt_{component_type.lower().replace("-", "_")}', None)
        
        if adapter_method:
            result = adapter_method(universal_data, layout, section, options)
            result = ensure_compatibility(result)
            
            # Validate props
            is_valid, errors = props_validator.validate(component_type, result)
            if not is_valid:
                logger.warning(f"Props validation failed for {component_type}: {errors}")
                # Still return the result, but log the issues
            
            return result
        
        # Generic adapter fallback
        result = self._generic_adapter(component_type, universal_data, layout, options)
        result = ensure_compatibility(result)
        
        # Validate props
        is_valid, errors = props_validator.validate(component_type, result)
        if not is_valid:
            logger.warning(f"Props validation failed for {component_type}: {errors}")
        
        return result
    
    def _normalize_data(self, data: Union[List[Dict], Dict], section: str) -> List[UniversalContent]:
        """Convert any CV data to universal format"""
        normalized = []
        logger.debug(f"Normalizing data for {section}: Initial type={type(data)}")
        
        # Handle schema-specific data structures
        if isinstance(data, dict):
            extracted = False
            # Handle SkillsSection format
            if section == "skills" and "skillCategories" in data:
                data = data["skillCategories"]
                extracted = True
            # Handle ProjectsSection format
            elif section == "projects" and "projectItems" in data:
                data = data["projectItems"]
                extracted = True
            # Handle ExperienceSection format  
            elif section == "experience" and "experienceItems" in data:
                data = data["experienceItems"]
                extracted = True
            # Handle EducationSection format
            elif section == "education" and "educationItems" in data:
                data = data["educationItems"]
                extracted = True
            # Handle LanguageSection format
            elif section == "languages" and "languageItems" in data:
                data = data["languageItems"]
                extracted = True
            # Handle AchievementsSection format
            elif section == "achievements" and "achievements" in data:
                data = data["achievements"]
                extracted = True
            # Handle CertificationsSection format
            elif section == "certifications" and "certificationItems" in data:
                data = data["certificationItems"]
                extracted = True
            # Handle VolunteerSection format
            elif section == "volunteer" and "volunteerItems" in data:
                data = data["volunteerItems"]
                extracted = True
            # Handle ContactSection format
            elif section == "contact":
                contact_items = []
                # Extract email
                if "email" in data and data["email"]:
                    contact_items.append({
                        "platform": "Email",
                        "url": f"mailto:{data['email']}"
                    })
                # Extract phone
                if "phone" in data and data["phone"]:
                    contact_items.append({
                        "platform": "Phone", 
                        "url": f"tel:{data['phone']}"
                    })
                # Extract professional links
                if "professionalLinks" in data and data["professionalLinks"]:
                    contact_items.extend(data["professionalLinks"])
                data = contact_items
                extracted = True
            # Handle HeroSection format (special case - single item)
            elif section == "hero":
                data = [data]
                extracted = True
            # Handle SummarySection format (special case - single item)
            elif section == "summary":
                data = [data]
                extracted = True
            # If it's a single item dict and we didn't extract, convert to list
            elif not extracted:
                data = [data]
        
        # Ensure data is a list
        if not isinstance(data, list):
            data = [data]
            
        logger.debug(f"After extraction for {section}: type={type(data)}, length={len(data)}")
        if data and len(data) > 0:
            logger.debug(f"First item type: {type(data[0])}, keys: {data[0].keys() if isinstance(data[0], dict) else 'Not a dict'}")
        
        for item in data:
            # Log item structure for debugging
            logger.debug(f"Processing item for {section}: {item}")
            
            content = UniversalContent(
                primary=self._extract_field(item, section, 'primary'),
                secondary=self._extract_field(item, section, 'secondary'),
                tertiary=self._extract_field(item, section, 'tertiary'),
                metadata=item
            )
            
            # Extract URL if present
            url_fields = ['url', 'link', 'projectUrl', 'website', 'href']
            for field in url_fields:
                if field in item and item[field]:
                    content.action_url = item[field]
                    content.action_text = item.get('buttonText', 'View More')
                    break
            
            normalized.append(content)
        
        return normalized
    
    def _extract_field(self, item: Dict, section: str, field_type: str) -> str:
        """Intelligently extract field based on section and type"""
        field_mappings = self.FIELD_MAPPINGS.get(section, {})
        possible_fields = field_mappings.get(field_type, [])
        
        # Handle case where item is not a dict
        if not isinstance(item, dict):
            logger.warning(f"Item is not a dict in {section}: {type(item)}")
            return str(item) if item else ""
        
        # Log what we're looking for
        if not item:
            logger.warning(f"Empty item in {section}")
            return ""
            
        # Try each possible field
        for field in possible_fields:
            if field in item and item[field]:
                value = item[field]
                
                # Handle date range objects
                if field == 'dateRange' and isinstance(value, dict):
                    start = value.get('startDate', '')
                    end = value.get('endDate', 'Present')
                    return f"{start} - {end}"
                
                # Handle lists (like skills array)
                if isinstance(value, list):
                    return ', '.join(str(v) for v in value)
                
                return str(value)
        
        # Fallback to any field with the right pattern
        if field_type == 'primary':
            for key in ['title', 'name', 'label', 'heading']:
                if key in item:
                    return str(item[key])
        
        return ""
    
    def _get_smart_layout(self, item_count: int) -> LayoutType:
        """Your brilliant 3/4+ logic implemented!"""
        if item_count <= 3:
            return LayoutType.ROW
        elif item_count <= UniversalConstants.CAROUSEL_THRESHOLD:
            return LayoutType.GRID
        else:
            return LayoutType.CAROUSEL
    
    def _adapt_text_content(self, component_type: str, text: str, options: Dict[str, Any]) -> Dict[str, Any]:
        """Handle simple text content components"""
        if component_type == 'text-generate-effect':
            return {
                'words': text,
                'className': options.get('className', 'text-4xl font-bold'),
                'duration': options.get('duration', 0.5)
            }
        elif component_type == 'typewriter-effect':
            words = text.split() if len(text.split()) < 10 else [text]
            return {
                'words': words,
                'className': options.get('className', 'text-4xl font-bold'),
                'loop': options.get('loop', False)
            }
        else:
            return {'text': text, **options}
    
    def _adapt_text_simple(self, data: List[UniversalContent], layout: LayoutType,
                          section: str, options: Dict[str, Any]) -> Dict[str, Any]:
        """Adapt data for Text Simple component"""
        # For summary section, just return the text
        if section == 'summary' and data:
            text = data[0].primary or data[0].secondary or ''
            return {
                'text': text,
                'className': options.get('className', 'text-lg text-gray-300'),
                **options
            }
        return {'text': '', **options}
    
    def _adapt_text_generate_effect(self, data: List[UniversalContent], layout: LayoutType,
                                   section: str, options: Dict[str, Any]) -> Dict[str, Any]:
        """Adapt data for Text Generate Effect component"""
        # For summary section, extract the text
        if data and len(data) > 0:
            text = data[0].primary or data[0].secondary or data[0].tertiary or ''
            # If still no text, check the metadata
            if not text and isinstance(data[0].metadata, dict):
                text = data[0].metadata.get('summaryText', '') or data[0].metadata.get('text', '')
            
            return {
                'words': text,
                'className': options.get('className', 'text-4xl font-bold'),
                'duration': options.get('duration', 0.5)
            }
        return {'words': 'Professional Portfolio', **options}
    
    # Component-specific adapters
    
    def _adapt_background_gradient(self, data: List[UniversalContent], layout: LayoutType,
                                  section: str, options: Dict[str, Any]) -> Dict[str, Any]:
        """Adapt data for Background Gradient component"""
        if data and len(data) > 0:
            hero = data[0]
            # Extract hero data from metadata if available
            title = hero.primary or ''
            subtitle = hero.secondary or ''
            description = hero.tertiary or ''
            
            # If no data in primary/secondary/tertiary, check metadata
            if not title and isinstance(hero.metadata, dict):
                title = hero.metadata.get('fullName', '') or hero.metadata.get('name', '')
                subtitle = hero.metadata.get('professionalTitle', '') or hero.metadata.get('title', '')
                description = hero.metadata.get('summaryTagline', '') or hero.metadata.get('summary', '')
            
            return {
                'title': title,
                'subtitle': subtitle,
                'description': description,
                'className': options.get('className', 'absolute inset-0'),
                **options
            }
        return {'title': 'Portfolio', 'subtitle': '', 'description': ''}
    
    def _adapt_hero_parallax(self, data: List[UniversalContent], layout: LayoutType,
                            section: str, options: Dict[str, Any]) -> Dict[str, Any]:
        """Adapt data for Hero Parallax component"""
        # Hero parallax needs products array, but for MVP we should avoid it
        # Return simple hero data instead
        if data and data[0]:
            hero_content = data[0]
            return {
                'title': hero_content.primary,
                'subtitle': hero_content.secondary,
                'description': hero_content.tertiary,
                'products': []  # Empty for MVP to avoid image requirements
            }
        return {'title': '', 'subtitle': '', 'products': []}
    
    def _adapt_timeline(self, data: List[UniversalContent], layout: LayoutType, 
                       section: str, options: Dict[str, Any]) -> Dict[str, Any]:
        """Adapt data for Timeline component"""
        entries = []
        for item in data:
            entry = {
                'title': item.primary,
                'subtitle': item.secondary,
                'date': item.tertiary,
                'content': item.metadata.get('description', ''),
            }
            
            # Add bullets if available
            if 'bullets' in item.metadata:
                entry['bullets'] = item.metadata['bullets']
            elif 'responsibilities' in item.metadata:
                entry['bullets'] = item.metadata['responsibilities']
            elif 'responsibilitiesAndAchievements' in item.metadata:
                entry['bullets'] = item.metadata['responsibilitiesAndAchievements']
            
            entries.append(entry)
        
        return {
            'entries': entries,
            'show_icons': True,
            'alternate_sides': True,
            **options
        }
    
    def _adapt_timeline_minimal(self, data: List[UniversalContent], layout: LayoutType,
                               section: str, options: Dict[str, Any]) -> Dict[str, Any]:
        """Adapt data for Timeline Minimal component"""
        return self._adapt_timeline(data, layout, section, options)
    
    def _adapt_bento_grid(self, data: List[UniversalContent], layout: LayoutType,
                         section: str, options: Dict[str, Any]) -> Dict[str, Any]:
        """Adapt data for BentoGrid component"""
        # Handle minimum items requirement
        if len(data) < UniversalConstants.MIN_BENTO_ITEMS:
            # Switch to WobbleCard for fewer items
            return self._adapt_wobble_card(data, layout, section, options)
        
        items = []
        for i, item in enumerate(data):
            # For skills section, extract from metadata
            if section == "skills" and isinstance(item.metadata, dict):
                title = item.metadata.get('categoryName', item.primary)
                skills_list = item.metadata.get('skills', [])
                description = ', '.join(skills_list) if skills_list else item.secondary
            else:
                title = item.primary
                description = item.secondary
            
            grid_item = {
                'title': title,
                'description': description,
                'headerGradient': self._generate_gradient_class(title or str(i), i),  # Just the gradient class string
                'className': self._get_bento_item_class(i, len(data)),
                'icon': self._get_icon_for_section(section, title)
            }
            items.append(grid_item)
        
        return {
            'items': items,
            'className': self._get_grid_class(len(data)),
            **options
        }
    
    def _adapt_card_hover_effect(self, data: List[UniversalContent], layout: LayoutType,
                                section: str, options: Dict[str, Any]) -> Dict[str, Any]:
        """Adapt data for CardHoverEffect component"""
        # Switch to carousel if too many items
        if layout == LayoutType.CAROUSEL:
            return self._wrap_in_carousel('card-hover-effect', data, section, options)
        
        cards = []
        for i, item in enumerate(data):
            # For experience section, also include card-stack compatible format
            if section == "experience":
                card = {
                    # Card hover effect format
                    'title': item.primary,
                    'description': item.secondary,
                    'tags': item.tertiary.split(' • ') if item.tertiary else [],
                    'gradient': self._generate_gradient_class(item.primary, i),
                    'link': item.action_url if item.action_url else None,
                    # Card stack format (in case component is swapped)
                    'id': id(item),
                    'name': item.primary,
                    'designation': item.secondary,
                    'content': item.tertiary or f"{item.secondary} - {item.primary}"
                }
            else:
                card = {
                    'title': item.primary,
                    'description': item.secondary,
                    'tags': item.tertiary.split(' • ') if item.tertiary else [],
                    'gradient': self._generate_gradient_class(item.primary, i),
                    'link': item.action_url if item.action_url else None
                }
            cards.append(card)
        
        return {
            'cards': cards,
            'className': f"grid grid-cols-1 md:grid-cols-{min(len(data), 3)} gap-4",
            **options
        }
    
    def _adapt_card_stack(self, data: List[UniversalContent], layout: LayoutType,
                         section: str, options: Dict[str, Any]) -> Dict[str, Any]:
        """Adapt data for Card Stack component"""
        cards = []
        
        for i, item in enumerate(data):
            # For education section, extract from metadata
            if section == "education" and isinstance(item.metadata, dict):
                degree = item.metadata.get('degree', '')
                field = item.metadata.get('fieldOfStudy', '')
                institution = item.metadata.get('institution', '')
                date_range = item.metadata.get('dateRange', {})
                
                title = f"{degree} {field}".strip()
                start_date = date_range.get('startDate', '') if isinstance(date_range, dict) else ''
                end_date = date_range.get('endDate', '') if isinstance(date_range, dict) else ''
                content = f"{institution} | {start_date} - {end_date}".strip(' |')
                
                card = {
                    'id': id(item),
                    'name': title or 'Education',
                    'designation': institution,
                    'content': content
                }
            else:
                # Generic handling for other sections
                card = {
                    'id': id(item),
                    'name': item.primary or 'Item',
                    'designation': '',
                    'content': item.secondary or item.tertiary or item.primary
                }
            
            cards.append(card)
        
        return {
            'cards': cards,
            'offset': options.get('offset', 0),
            'scaleFactor': options.get('scaleFactor', 0.06),
            **options
        }
    
    def _adapt_animated_tooltip(self, data: List[UniversalContent], layout: LayoutType,
                               section: str, options: Dict[str, Any]) -> Dict[str, Any]:
        """Adapt data for Animated Tooltip component"""
        people = []
        
        # For languages section
        if section == "languages" and data:
            for i, item in enumerate(data):
                if isinstance(item.metadata, dict):
                    language = item.metadata.get('language', item.primary)
                    proficiency = item.metadata.get('proficiency', item.secondary)
                else:
                    language = item.primary
                    proficiency = item.secondary
                
                person = {
                    'id': i + 1,
                    'name': language or f'Language {i+1}',
                    'designation': proficiency or 'Proficient',
                    'image': f"https://ui-avatars.com/api/?name={language or 'L'}&background=random"
                }
                people.append(person)
        else:
            # Generic handling
            for i, item in enumerate(data):
                person = {
                    'id': i + 1,
                    'name': item.primary or f'Item {i+1}',
                    'designation': item.secondary or item.tertiary or '',
                    'image': f"https://ui-avatars.com/api/?name={item.primary or str(i)}&background=random"
                }
                people.append(person)
        
        return {
            'people': people,
            **options
        }
    
    def _adapt_animated_testimonials(self, data: List[UniversalContent], layout: LayoutType,
                                   section: str, options: Dict[str, Any]) -> Dict[str, Any]:
        """Adapt data for AnimatedTestimonials component"""
        testimonials = []
        
        # Special handling for achievements section
        if section == "achievements":
            for i, item in enumerate(data):
                # For achievements, we need to extract from metadata
                if isinstance(item.metadata, dict):
                    value = item.metadata.get('value', item.primary)
                    label = item.metadata.get('label', item.secondary)
                    context = item.metadata.get('contextOrDetail', '')
                else:
                    value = item.primary
                    label = item.secondary
                    context = item.tertiary
                
                testimonial = {
                    'quote': label or value,  # The achievement description
                    'name': value if label else '',  # The achievement value/metric
                    'designation': 'Achievement',
                    'avatar': self._generate_initials(f'A{i+1}')  # A1, A2, etc.
                }
                testimonials.append(testimonial)
        else:
            # Generic testimonial handling
            for item in data:
                testimonial = {
                    'quote': item.secondary or item.primary,
                    'name': item.primary if item.secondary else item.tertiary,
                    'designation': item.tertiary if item.secondary else section.title(),
                    'avatar': self._generate_initials(item.primary)
                }
                testimonials.append(testimonial)
        
        return {
            'testimonials': testimonials,
            'autoplay': True,
            'autoplaySpeed': 5000,
            'showArrows': len(testimonials) > 3,
            **options
        }
    
    def _adapt_floating_dock(self, data: List[UniversalContent], layout: LayoutType,
                           section: str, options: Dict[str, Any]) -> Dict[str, Any]:
        """Adapt data for FloatingDock component"""
        items = []
        
        for item in data:
            # For contact items, primary is platform/type
            title = item.primary or 'Contact'
            
            # Get the URL from secondary or action_url
            url = item.action_url or item.secondary or '#'
            
            # If URL is stored in metadata, check there too
            if isinstance(item.metadata, dict) and 'url' in item.metadata:
                url = item.metadata['url']
            
            dock_item = {
                'title': title,
                'icon': self._get_contact_icon(title.lower() if title else ''),
                'href': url
            }
            items.append(dock_item)
        
        return {
            'items': items,
            'className': options.get('className', 'fixed bottom-4 right-4'),
            **options
        }
    
    def _adapt_wobble_card(self, data: List[UniversalContent], layout: LayoutType,
                          section: str, options: Dict[str, Any]) -> Dict[str, Any]:
        """Adapt data for WobbleCard component (fallback for small BentoGrid)"""
        cards = []
        for i, item in enumerate(data):
            card = {
                'title': item.primary,
                'description': item.secondary,
                'containerClassName': f"col-span-1 min-h-[6rem] {self._generate_gradient_class(item.primary, i)}",
                'className': "h-full",
            }
            cards.append(card)
        
        return {
            'cards': cards,
            'className': f"grid grid-cols-1 md:grid-cols-{len(data)} gap-4 max-w-7xl mx-auto w-full",
            **options
        }
    
    # Helper methods with your improvements
    
    def _generate_gradient_class(self, seed: str, index: int) -> str:
        """Generate consistent gradient based on content"""
        gradients = [
            "from-blue-500 to-purple-600",
            "from-green-500 to-teal-600", 
            "from-orange-500 to-red-600",
            "from-pink-500 to-rose-600",
            "from-indigo-500 to-blue-600",
            "from-yellow-500 to-orange-600"
        ]
        
        hash_val = sum(ord(c) for c in seed)
        return f"bg-gradient-to-br {gradients[(hash_val + index) % len(gradients)]}"
    
    def _generate_gradient_div(self, seed: str, index: int) -> str:
        """Generate gradient class for BentoGrid headers"""
        # Return the full gradient class string including container styles
        gradient = self._generate_gradient_class(seed, index)
        return f"flex flex-1 w-full h-full min-h-[6rem] rounded-xl {gradient}"
    
    def _generate_initials(self, name: str) -> str:
        """Generate initials from name"""
        parts = name.split()
        if len(parts) >= 2:
            return f"{parts[0][0]}{parts[-1][0]}".upper()
        return name[:2].upper()
    
    def _get_grid_class(self, item_count: int) -> str:
        """Get optimal grid class based on item count"""
        if item_count == 1:
            return "grid-cols-1"
        elif item_count == 2:
            return "grid-cols-1 md:grid-cols-2"
        elif item_count == 3:
            return "grid-cols-1 md:grid-cols-3"
        elif item_count == 4:
            return "grid-cols-1 md:grid-cols-2 lg:grid-cols-2"
        else:
            return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
    
    def _get_bento_item_class(self, index: int, total: int) -> str:
        """Get BentoGrid item class for varied sizes"""
        if total >= 5:
            if index == 0:
                return "md:col-span-2"
            elif index == total - 1 and total % 2 == 0:
                return "md:col-span-2"
        return ""
    
    def _get_icon_for_section(self, section: str, title: str) -> str:
        """Get appropriate icon based on section and content"""
        icon_map = {
            'skills': '💻',
            'languages': '🌐', 
            'education': '🎓',
            'experience': '💼',
            'projects': '🚀',
            'achievements': '🏆',
            'certifications': '📜',
            'volunteer': '❤️',
            'hobbies': '🎨'
        }
        return icon_map.get(section, '📌')
    
    def _get_contact_icon(self, contact_type: str) -> str:
        """Get React icon component for contact methods"""
        for key, component in UniversalConstants.ICON_MAPPING.items():
            if key in contact_type.lower():
                return component
        return 'IconUser'  # Default fallback
    
    def _wrap_in_carousel(self, component_type: str, data: List[UniversalContent],
                         section: str, options: Dict[str, Any]) -> Dict[str, Any]:
        """Wrap components in a carousel when too many items"""
        adapted = self.adapt(component_type, data, section, {**options, 'layout': 'row'})
        
        return {
            'type': 'carousel',
            'component': component_type,
            'items': adapted.get('cards') or adapted.get('items') or adapted.get('entries'),
            'slidesToShow': 3,
            'responsive': [
                {'breakpoint': 1024, 'settings': {'slidesToShow': 2}},
                {'breakpoint': 640, 'settings': {'slidesToShow': 1}}
            ],
            **options
        }
    
    def _generic_adapter(self, component_type: str, data: List[UniversalContent],
                        layout: LayoutType, options: Dict[str, Any]) -> Dict[str, Any]:
        """Generic fallback adapter for any component"""
        items = []
        for item in data:
            generic_item = {
                'id': id(item),
                'content': {
                    'title': item.primary,
                    'description': item.secondary,
                    'metadata': item.tertiary
                }
            }
            
            if item.action_url:
                generic_item['action'] = {
                    'url': item.action_url,
                    'text': item.action_text
                }
            
            items.append(generic_item)
        
        return {
            'items': items,
            'layout': layout.value,
            'component': component_type,
            **options
        }

# Singleton instance for easy import
universal_adapter = UniversalComponentAdapter()