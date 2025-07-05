"""
Smart Component Selector for CV2WEB
Enhances component selection with content-aware decisions without hard limits
"""
import logging
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass
from enum import Enum

from backend.schemas.unified import CVData
from .component_selector import ComponentSelector, ComponentSelection, UserArchetype
from .component_adapter import component_adapter
from .component_registry import component_registry

logger = logging.getLogger(__name__)

@dataclass
class ContentRichness:
    """Represents content richness analysis for a section"""
    score: float  # 0.0 to 1.0
    item_count: int
    detail_level: float  # Based on description lengths, etc.
    recommendation: str  # "premium", "standard", "compact", "merge_candidate"

class LayoutDensity(Enum):
    """Layout density levels based on content volume"""
    SPARSE = "sparse"      # < 5 sections, use expansive components
    BALANCED = "balanced"  # 5-6 sections, mixed approach
    DENSE = "dense"        # 7+ sections, use compact components
    RICH = "rich"          # 12+ sections, use tabs/accordions

class SmartComponentSelector(ComponentSelector):
    """
    Enhanced component selector with content-aware intelligence
    Evaluates content richness and makes smart layout decisions
    """
    
    # Richness scoring configuration
    RICHNESS_CONFIG = {
        "experience": {
            "item_weight": 0.2,      # 5 items = max score
            "detail_weight": 0.05,   # 10 details = 0.5 bonus
            "max_items_for_full": 5,
            "max_details_for_bonus": 10
        },
        "education": {
            "item_weight": 0.3,      # 3 items = max score
            "detail_bonus": 0.1,     # Per item with GPA/achievements
            "max_items_for_full": 3
        },
        "skills": {
            "skill_weight": 0.05,    # 20 skills = max score
            "category_bonus": 0.1,   # Per category
            "max_skills_for_full": 20
        },
        "projects": {
            "item_weight": 0.25,     # 4 projects = max score
            "rich_project_bonus": 0.15,
            "max_items_for_full": 4
        }
    }
    
    # Component variants for different content densities
    COMPONENT_VARIANTS = {
        "timeline": {
            "premium": "timeline-with-images",
            "standard": "timeline",
            "compact": "timeline"
        },
        "bento-grid": {
            "premium": "bento-grid",
            "standard": "bento-grid",
            "compact": "bento-grid"  # bento-grid-small doesn't exist
        },
        "card-hover-effect": {
            "premium": "card-hover-effect-3d",
            "standard": "card-hover-effect",
            "compact": "card-stack"
        },
        "text-generate-effect": {
            "premium": "text-reveal-animation",
            "standard": "text-generate-effect",
            "compact": "text-generate-effect"
        }
    }
    
    # Merge recommendations based on content
    MERGE_SUGGESTIONS = {
        ("languages", "skills"): {
            "threshold": 3,  # If less than 3 languages
            "target_section": "skills",
            "merge_as": "skill_category"
        },
        ("certifications", "education"): {
            "threshold": 2,  # If less than 2 certifications
            "target_section": "education",
            "merge_as": "education_item"
        },
        ("volunteer", "experience"): {
            "threshold": 2,  # If less than 2 volunteer roles
            "target_section": "experience",
            "merge_as": "experience_item"
        },
        ("courses", "education"): {
            "threshold": 3,  # If less than 3 courses
            "target_section": "education",
            "merge_as": "education_item"
        }
    }
    
    def select_components(self, cv_data: CVData) -> List[ComponentSelection]:
        """
        Select components with smart content-aware enhancements
        """
        # Validate input
        if not cv_data:
            logger.warning("Empty CV data provided to smart selector")
            return []
        
        try:
            # First, get base selections using parent method
            base_selections = super().select_components(cv_data)
        except Exception as e:
            logger.error(f"Error in base selection: {e}")
            return []
        
        # Analyze content richness for each section
        richness_analysis = self._analyze_content_richness(cv_data, base_selections)
        
        # Determine overall layout density
        layout_density = self._determine_layout_density(base_selections, richness_analysis)
        
        # Apply smart enhancements based on content
        enhanced_selections = self._enhance_selections(
            base_selections, 
            richness_analysis, 
            layout_density
        )
        
        # Generate merge suggestions (but don't force them)
        merge_suggestions = self._generate_merge_suggestions(richness_analysis, cv_data)
        
        # Optimize component choices based on total content
        optimized_selections = self._optimize_component_choices(
            enhanced_selections,
            layout_density,
            merge_suggestions
        )
        
        # Add layout metadata
        self._add_layout_metadata(optimized_selections, layout_density)
        
        logger.info(f"Smart selection complete: {len(optimized_selections)} components selected")
        logger.info(f"Layout density: {layout_density.value}")
        
        return optimized_selections
    
    def _analyze_content_richness(
        self, 
        cv_data: CVData, 
        selections: List[ComponentSelection]
    ) -> Dict[str, ContentRichness]:
        """
        Analyze the content richness of each CV section
        """
        richness_map = {}
        
        for selection in selections:
            section = selection.section
            section_data = getattr(cv_data, section, None)
            
            if not section_data:
                richness_map[section] = ContentRichness(0.0, 0, 0.0, "merge_candidate")
                continue
            
            # Calculate richness based on section type
            if section == "experience":
                richness = self._analyze_experience_richness(section_data)
            elif section == "education":
                richness = self._analyze_education_richness(section_data)
            elif section == "skills":
                richness = self._analyze_skills_richness(section_data)
            elif section == "projects":
                richness = self._analyze_projects_richness(section_data)
            elif section == "achievements":
                richness = self._analyze_achievements_richness(section_data)
            elif section == "languages":
                richness = self._analyze_languages_richness(section_data)
            elif section == "certifications":
                richness = self._analyze_certifications_richness(section_data)
            elif section == "volunteer":
                richness = self._analyze_volunteer_richness(section_data)
            else:
                # Default analysis
                richness = self._analyze_generic_richness(section, section_data)
            
            richness_map[section] = richness
            logger.debug(f"{section} richness: score={richness.score:.2f}, items={richness.item_count}")
        
        return richness_map
    
    def _analyze_experience_richness(self, data) -> ContentRichness:
        """Analyze experience section richness"""
        try:
            if not data or not hasattr(data, 'experienceItems'):
                return ContentRichness(0.0, 0, 0.0, "merge_candidate")
            
            items = data.experienceItems or []
            item_count = len(items)
        except Exception as e:
            logger.warning(f"Error analyzing experience richness: {e}")
            return ContentRichness(0.0, 0, 0.0, "standard")
        
        # Calculate detail level based on responsibilities
        total_details = sum(
            len(getattr(item, 'responsibilitiesAndAchievements', None) or [])
            for item in items
        )
        
        # Score calculation using config
        config = self.RICHNESS_CONFIG.get("experience", {})
        score = min(1.0, item_count * config.get("item_weight", 0.2))
        detail_score = min(0.5, total_details * config.get("detail_weight", 0.05))
        final_score = min(1.0, score + detail_score)
        
        # Recommendation
        if final_score >= 0.8:
            recommendation = "premium"
        elif final_score >= 0.5:
            recommendation = "standard"
        elif item_count <= 2:
            recommendation = "compact"
        else:
            recommendation = "standard"
        
        return ContentRichness(final_score, item_count, detail_score, recommendation)
    
    def _analyze_education_richness(self, data) -> ContentRichness:
        """Analyze education section richness"""
        if not hasattr(data, 'educationItems'):
            return ContentRichness(0.0, 0, 0.0, "merge_candidate")
        
        items = data.educationItems or []
        item_count = len(items)
        
        # Check for details like GPA, achievements
        detail_count = sum(
            1 for item in items
            if (hasattr(item, 'gpa') and item.gpa) or 
               (hasattr(item, 'achievements') and item.achievements)
        )
        
        score = min(1.0, item_count * 0.3)  # 3+ items = max score
        detail_score = min(0.3, detail_count * 0.1)
        final_score = min(1.0, score + detail_score)
        
        recommendation = "premium" if final_score >= 0.7 else "standard"
        
        return ContentRichness(final_score, item_count, detail_score, recommendation)
    
    def _analyze_skills_richness(self, data) -> ContentRichness:
        """Analyze skills section richness"""
        total_skills = 0
        categories = 0
        
        if hasattr(data, 'skillCategories') and data.skillCategories:
            categories = len(data.skillCategories)
            total_skills = sum(
                len(cat.skills) if hasattr(cat, 'skills') and cat.skills else 0
                for cat in data.skillCategories
            )
        elif hasattr(data, 'skills') and data.skills:
            total_skills = len(data.skills)
        
        score = min(1.0, total_skills * 0.05)  # 20+ skills = max score
        category_score = min(0.3, categories * 0.1)  # Bonus for categorization
        final_score = min(1.0, score + category_score)
        
        if final_score >= 0.8 and categories > 3:
            recommendation = "premium"  # Use advanced grid layout
        elif final_score >= 0.5:
            recommendation = "standard"
        else:
            recommendation = "compact"
        
        return ContentRichness(final_score, total_skills, category_score, recommendation)
    
    def _analyze_projects_richness(self, data) -> ContentRichness:
        """Analyze projects section richness"""
        if not hasattr(data, 'projectItems'):
            return ContentRichness(0.0, 0, 0.0, "merge_candidate")
        
        items = data.projectItems or []
        item_count = len(items)
        
        # Check for rich project data (technologies, links, descriptions)
        rich_projects = sum(
            1 for item in items
            if ((hasattr(item, 'technologies') and item.technologies) or
                (hasattr(item, 'projectUrl') and item.projectUrl) or
                (hasattr(item, 'description') and item.description and len(item.description) > 100))
        )
        
        score = min(1.0, item_count * 0.25)  # 4+ projects = max score
        detail_score = min(0.5, rich_projects * 0.15)
        final_score = min(1.0, score + detail_score)
        
        if final_score >= 0.8:
            recommendation = "premium"  # Use 3D cards or showcase
        elif item_count <= 2:
            recommendation = "merge_candidate"
        else:
            recommendation = "standard"
        
        return ContentRichness(final_score, item_count, detail_score, recommendation)
    
    def _analyze_achievements_richness(self, data) -> ContentRichness:
        """Analyze achievements section richness"""
        if not hasattr(data, 'achievements'):
            return ContentRichness(0.0, 0, 0.0, "merge_candidate")
        
        items = data.achievements or []
        item_count = len(items)
        
        # Check for quantified achievements
        quantified = sum(
            1 for item in items
            if hasattr(item, 'metric') and item.metric
        )
        
        score = min(1.0, item_count * 0.2)  # 5+ achievements = max score
        detail_score = min(0.3, quantified * 0.1)
        final_score = min(1.0, score + detail_score)
        
        if item_count <= 3:
            recommendation = "merge_candidate"  # Consider merging with summary
        elif final_score >= 0.7:
            recommendation = "premium"
        else:
            recommendation = "standard"
        
        return ContentRichness(final_score, item_count, detail_score, recommendation)
    
    def _analyze_languages_richness(self, data) -> ContentRichness:
        """Analyze languages section richness"""
        if not hasattr(data, 'languageItems'):
            return ContentRichness(0.0, 0, 0.0, "merge_candidate")
        
        items = data.languageItems or []
        item_count = len(items)
        
        score = min(1.0, item_count * 0.33)  # 3+ languages = max score
        
        if item_count <= 2:
            recommendation = "merge_candidate"  # Consider merging with skills
        else:
            recommendation = "standard"
        
        return ContentRichness(score, item_count, 0.0, recommendation)
    
    def _analyze_certifications_richness(self, data) -> ContentRichness:
        """Analyze certifications section richness"""
        if not hasattr(data, 'certificationItems'):
            return ContentRichness(0.0, 0, 0.0, "merge_candidate")
        
        items = data.certificationItems or []
        item_count = len(items)
        
        # Check for active/recent certifications
        active_certs = sum(
            1 for item in items
            if hasattr(item, 'expiryDate') and item.expiryDate
        )
        
        score = min(1.0, item_count * 0.2)  # 5+ certs = max score
        detail_score = min(0.2, active_certs * 0.1)
        final_score = min(1.0, score + detail_score)
        
        if item_count <= 2:
            recommendation = "merge_candidate"
        else:
            recommendation = "standard"
        
        return ContentRichness(final_score, item_count, detail_score, recommendation)
    
    def _analyze_volunteer_richness(self, data) -> ContentRichness:
        """Analyze volunteer section richness"""
        if not hasattr(data, 'volunteerItems'):
            return ContentRichness(0.0, 0, 0.0, "merge_candidate")
        
        items = data.volunteerItems or []
        item_count = len(items)
        
        score = min(1.0, item_count * 0.33)  # 3+ items = max score
        
        if item_count <= 1:
            recommendation = "merge_candidate"
        else:
            recommendation = "standard"
        
        return ContentRichness(score, item_count, 0.0, recommendation)
    
    def _analyze_generic_richness(self, section: str, data: Any) -> ContentRichness:
        """Generic richness analysis for other sections"""
        # Try to find list fields
        item_count = 0
        for attr in dir(data):
            if not attr.startswith('_'):
                value = getattr(data, attr, None)
                if isinstance(value, list):
                    item_count = max(item_count, len(value))
        
        score = min(1.0, item_count * 0.25) if item_count > 0 else 0.3
        recommendation = "standard" if score > 0.5 else "compact"
        
        return ContentRichness(score, item_count, 0.0, recommendation)
    
    def _determine_layout_density(
        self, 
        selections: List[ComponentSelection],
        richness: Dict[str, ContentRichness]
    ) -> LayoutDensity:
        """Determine overall layout density based on content volume"""
        total_sections = len(selections)
        high_richness_count = sum(1 for r in richness.values() if r.score >= 0.7)
        
        if total_sections >= 12:
            return LayoutDensity.RICH
        elif total_sections >= 7:
            return LayoutDensity.DENSE
        elif total_sections < 5:
            return LayoutDensity.SPARSE
        else:
            # 5-6 sections - consider richness for balanced vs dense
            if high_richness_count >= 3:
                return LayoutDensity.DENSE
            else:
                return LayoutDensity.BALANCED
    
    def _enhance_selections(
        self,
        selections: List[ComponentSelection],
        richness: Dict[str, ContentRichness],
        layout_density: LayoutDensity
    ) -> List[ComponentSelection]:
        """Enhance component selections based on content analysis"""
        enhanced = []
        
        for selection in selections:
            section_richness = richness.get(selection.section)
            if not section_richness:
                enhanced.append(selection)
                continue
            
            # Create enhanced selection
            enhanced_selection = ComponentSelection(
                section=selection.section,
                component_type=selection.component_type,
                import_path=selection.import_path,
                props=selection.props.copy() if selection.props else {},
                priority=selection.priority
            )
            
            # Add richness metadata to props
            enhanced_selection.props["_richness"] = {
                "score": section_richness.score,
                "recommendation": section_richness.recommendation,
                "item_count": section_richness.item_count
            }
            
            # Adjust component variant based on richness and layout density
            variant = self._get_component_variant(
                selection.component_type,
                section_richness.recommendation,
                layout_density
            )
            
            if variant and variant != selection.component_type:
                # Resolve variant through registry
                resolved_variant, variant_config = component_registry.resolve_component(variant)
                if resolved_variant:
                    enhanced_selection.component_type = resolved_variant
                    # Update import path from registry
                    enhanced_selection.import_path = component_registry.get_import_path(resolved_variant)
                    logger.info(f"Enhanced {selection.section}: {selection.component_type} → {resolved_variant}")
                else:
                    logger.warning(f"Variant {variant} not found in registry, keeping original")
            
            enhanced.append(enhanced_selection)
        
        return enhanced
    
    def _get_component_variant(
        self, 
        base_component: str, 
        recommendation: str,
        layout_density: LayoutDensity
    ) -> Optional[str]:
        """Get appropriate component variant based on content and layout"""
        if base_component not in self.COMPONENT_VARIANTS:
            return None
        
        variants = self.COMPONENT_VARIANTS[base_component]
        
        # Adjust recommendation based on layout density
        if layout_density == LayoutDensity.DENSE:
            # Prefer compact variants in dense layouts
            if recommendation == "premium":
                recommendation = "standard"
            elif recommendation == "standard":
                recommendation = "compact"
        elif layout_density == LayoutDensity.SPARSE:
            # Prefer premium variants in sparse layouts
            if recommendation == "standard":
                recommendation = "premium"
        
        return variants.get(recommendation, variants.get("standard"))
    
    def _generate_merge_suggestions(
        self,
        richness: Dict[str, ContentRichness],
        cv_data: CVData
    ) -> List[Dict[str, Any]]:
        """Generate merge suggestions based on content analysis"""
        suggestions = []
        
        for (source, target), config in self.MERGE_SUGGESTIONS.items():
            source_richness = richness.get(source)
            if not source_richness:
                continue
            
            # Check if source meets merge criteria
            if source_richness.item_count < config["threshold"]:
                # Verify target section exists
                target_data = getattr(cv_data, target, None)
                if target_data:
                    suggestions.append({
                        "source": source,
                        "target": target,
                        "reason": f"Only {source_richness.item_count} items in {source}",
                        "merge_type": config["merge_as"],
                        "optional": True  # Always optional, never forced
                    })
        
        return suggestions
    
    def _optimize_component_choices(
        self,
        selections: List[ComponentSelection],
        layout_density: LayoutDensity,
        merge_suggestions: List[Dict[str, Any]]
    ) -> List[ComponentSelection]:
        """Optimize component choices based on overall layout"""
        optimized = []
        
        # Group sections by type for potential consolidation
        section_groups = {
            "content": ["experience", "projects", "volunteer"],
            "credentials": ["education", "certifications", "courses"],
            "skills": ["skills", "languages"],
            "meta": ["achievements", "publications", "speaking"]
        }
        
        # In rich/dense layouts, consider using tabs or accordions
        if layout_density in [LayoutDensity.DENSE, LayoutDensity.RICH]:
            # Check if we should group related sections
            for group_name, group_sections in section_groups.items():
                group_selections = [s for s in selections if s.section in group_sections]
                
                if len(group_selections) >= 3:
                    # Consider using a tabbed interface
                    logger.info(f"Suggesting tabbed interface for {group_name} sections")
                    # Add metadata for portfolio generator
                    for selection in group_selections:
                        selection.props["_layout_suggestion"] = {
                            "group": group_name,
                            "type": "tabs" if layout_density == LayoutDensity.RICH else "accordion"
                        }
        
        # Add merge suggestions as metadata (not enforced)
        merge_map = {s["source"]: s for s in merge_suggestions}
        for selection in selections:
            if selection.section in merge_map:
                selection.props["_merge_suggestion"] = merge_map[selection.section]
            optimized.append(selection)
        
        return optimized
    
    def _add_layout_metadata(
        self,
        selections: List[ComponentSelection],
        layout_density: LayoutDensity
    ):
        """Add layout metadata to help portfolio generator"""
        # Add global layout metadata to first selection
        if selections:
            selections[0].props["_global_layout"] = {
                "density": layout_density.value,
                "total_sections": len(selections),
                "suggestions": {
                    "use_tabs": layout_density == LayoutDensity.RICH,
                    "use_accordions": layout_density == LayoutDensity.DENSE,
                    "use_animations": layout_density in [LayoutDensity.SPARSE, LayoutDensity.BALANCED],
                    "spacing": "compact" if layout_density == LayoutDensity.DENSE else "normal"
                }
            }
    
    def get_layout_recommendations(self, selections: List[ComponentSelection]) -> Dict[str, Any]:
        """Get layout recommendations based on smart analysis"""
        recommendations = {
            "merge_suggestions": [],
            "layout_type": "standard",
            "component_variants": {},
            "spacing_recommendations": {}
        }
        
        # Extract recommendations from selection metadata
        for selection in selections:
            if "_merge_suggestion" in selection.props:
                recommendations["merge_suggestions"].append(selection.props["_merge_suggestion"])
            
            if "_richness" in selection.props:
                richness = selection.props["_richness"]
                recommendations["component_variants"][selection.section] = richness["recommendation"]
        
        # Get global layout from first selection
        if selections and "_global_layout" in selections[0].props:
            global_layout = selections[0].props["_global_layout"]
            recommendations["layout_type"] = global_layout["density"]
            recommendations["spacing_recommendations"] = global_layout["suggestions"]
        
        return recommendations

# Create enhanced selector instance
smart_component_selector = SmartComponentSelector()