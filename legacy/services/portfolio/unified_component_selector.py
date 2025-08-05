"""
Unified Component Selector for CV2WEB
Intelligently combines basic and smart selection using LLM decision-making
"""
import logging
import asyncio
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass
from enum import Enum
from pathlib import Path

from backend.schemas.unified import CVData
from .component_adapter import component_adapter
from .component_selector import ComponentSelector, ComponentSelection, UserArchetype
from .smart_component_selector import SmartComponentSelector, ContentRichness, LayoutDensity
from services.llm.llm_router import llm_router

logger = logging.getLogger(__name__)

@dataclass
class SelectionStrategy:
    """Represents the LLM's recommendation for selection strategy"""
    use_smart_analysis: bool
    reasoning: str
    confidence: float
    recommendations: Dict[str, Any]

class UnifiedComponentSelector(ComponentSelector):
    """
    Unified component selector that intelligently decides when to use smart analysis
    Combines the simplicity of basic selection with the intelligence of smart selection
    """
    
    def __init__(self):
        super().__init__()
        self.smart_selector = SmartComponentSelector()
        self._strategy_cache = {}
        
    async def select_components_async(self, cv_data: CVData) -> List[ComponentSelection]:
        """
        Async version that uses LLM to decide selection strategy
        """
        # First, get the selection strategy from LLM
        strategy = await self._get_selection_strategy(cv_data)
        
        if strategy.use_smart_analysis:
            logger.info(f"Using smart selection (confidence: {strategy.confidence:.2f})")
            logger.info(f"Reasoning: {strategy.reasoning}")
            
            # Use smart selector with its content analysis
            selections = self.smart_selector.select_components(cv_data)
            
            # Apply any LLM recommendations
            if strategy.recommendations:
                selections = self._apply_llm_recommendations(selections, strategy.recommendations)
        else:
            logger.info(f"Using basic selection (confidence: {strategy.confidence:.2f})")
            logger.info(f"Reasoning: {strategy.reasoning}")
            
            # Use basic selection
            selections = super().select_components(cv_data)
        
        return selections
    
    def select_components(self, cv_data: CVData) -> List[ComponentSelection]:
        """
        Synchronous version with intelligent defaults
        Falls back to smart analysis for rich CVs
        """
        # Quick heuristic check without LLM
        section_count = self._count_populated_sections(cv_data)
        
        # Use smart analysis for rich CVs (7+ sections) or complex profiles
        if section_count >= 7 or self._is_complex_profile(cv_data):
            logger.info(f"Auto-selecting smart analysis: {section_count} sections detected")
            return self.smart_selector.select_components(cv_data)
        else:
            logger.info(f"Using basic selection: {section_count} sections detected")
            return super().select_components(cv_data)
    
    async def _get_selection_strategy(self, cv_data: CVData) -> SelectionStrategy:
        """
        Use LLM to determine the best selection strategy
        """
        # Create a cache key based on CV characteristics
        cache_key = self._create_cv_fingerprint(cv_data)
        
        # Check cache first
        if cache_key in self._strategy_cache:
            return self._strategy_cache[cache_key]
        
        # Prepare CV summary for LLM
        cv_summary = self._create_cv_summary(cv_data)
        
        prompt = f"""
        Analyze this CV profile and determine the best component selection strategy.
        
        CV Summary:
        {cv_summary}
        
        We have two selection strategies:
        1. Basic Selection: Fast, straightforward mapping of sections to components
        2. Smart Selection: Analyzes content richness, suggests optimal layouts, component variants
        
        Smart selection is better for:
        - Rich CVs with many sections (7+)
        - CVs with varying content density across sections
        - Complex professional profiles needing adaptive layouts
        - When some sections might benefit from merging
        
        Basic selection is better for:
        - Simple, straightforward CVs
        - Consistent content density
        - Standard professional profiles
        - When speed is important
        
        Respond with JSON:
        {{
            "use_smart_analysis": true/false,
            "reasoning": "Brief explanation",
            "confidence": 0.0-1.0,
            "recommendations": {{
                "emphasize_sections": ["section1", "section2"],
                "merge_suggestions": {{"source": "target"}},
                "layout_hints": "dense/balanced/sparse"
            }}
        }}
        """
        
        try:
            response = await llm_router.generate_json(
                prompt=prompt,
                model="gemini",
                temperature=0.3
            )
            
            strategy = SelectionStrategy(
                use_smart_analysis=response.get("use_smart_analysis", True),
                reasoning=response.get("reasoning", "Default to smart analysis"),
                confidence=response.get("confidence", 0.8),
                recommendations=response.get("recommendations", {})
            )
            
            # Cache the strategy
            self._strategy_cache[cache_key] = strategy
            
            return strategy
            
        except Exception as e:
            logger.warning(f"LLM strategy selection failed: {e}, defaulting to smart analysis")
            # Default to smart analysis on error
            return SelectionStrategy(
                use_smart_analysis=True,
                reasoning="LLM unavailable, defaulting to smart analysis for best results",
                confidence=0.5,
                recommendations={}
            )
    
    def _count_populated_sections(self, cv_data: CVData) -> int:
        """Count how many sections have actual content"""
        count = 0
        for field_name, field_value in cv_data.model_dump().items():
            if field_value and field_name != 'metadata':
                if isinstance(field_value, dict):
                    # Check if dict has meaningful content
                    has_content = any(v for v in field_value.values() if v)
                    if has_content:
                        count += 1
                else:
                    count += 1
        return count
    
    def _is_complex_profile(self, cv_data: CVData) -> bool:
        """Determine if this is a complex professional profile"""
        # Check for multiple roles, extensive experience, diverse skills
        complex_indicators = 0
        
        # Many experiences
        if hasattr(cv_data, 'experience') and cv_data.experience:
            if hasattr(cv_data.experience, 'experienceItems'):
                if len(cv_data.experience.experienceItems or []) > 5:
                    complex_indicators += 1
        
        # Diverse skills
        if hasattr(cv_data, 'skills') and cv_data.skills:
            if hasattr(cv_data.skills, 'skillCategories'):
                if len(cv_data.skills.skillCategories or []) > 3:
                    complex_indicators += 1
        
        # Multiple advanced sections
        advanced_sections = ['publications', 'patents', 'speaking', 'certifications']
        for section in advanced_sections:
            if hasattr(cv_data, section) and getattr(cv_data, section):
                complex_indicators += 1
        
        return complex_indicators >= 2
    
    def _create_cv_fingerprint(self, cv_data: CVData) -> str:
        """Create a simple fingerprint for caching"""
        sections = []
        for field_name, field_value in cv_data.model_dump().items():
            if field_value and field_name != 'metadata':
                sections.append(field_name)
        
        # Include section count and archetype
        archetype = self._detect_user_archetype(cv_data)
        return f"{len(sections)}_{archetype.value}_{'_'.join(sorted(sections[:5]))}"
    
    def _create_cv_summary(self, cv_data: CVData) -> str:
        """Create a summary of CV for LLM analysis"""
        summary_parts = []
        
        # Count sections
        section_count = self._count_populated_sections(cv_data)
        summary_parts.append(f"Total sections: {section_count}")
        
        # List populated sections
        populated = []
        for field_name, field_value in cv_data.model_dump().items():
            if field_value and field_name != 'metadata':
                populated.append(field_name)
        
        summary_parts.append(f"Sections: {', '.join(populated[:10])}")
        if len(populated) > 10:
            summary_parts.append(f"... and {len(populated) - 10} more sections")
        
        # Add content density indicators
        if hasattr(cv_data, 'experience') and cv_data.experience:
            if hasattr(cv_data.experience, 'experienceItems'):
                exp_count = len(cv_data.experience.experienceItems or [])
                summary_parts.append(f"Experience entries: {exp_count}")
        
        if hasattr(cv_data, 'skills') and cv_data.skills:
            if hasattr(cv_data.skills, 'skillCategories'):
                skill_count = sum(
                    len(cat.skills or []) 
                    for cat in (cv_data.skills.skillCategories or [])
                )
                summary_parts.append(f"Total skills: {skill_count}")
        
        # Detect archetype
        archetype = self._detect_user_archetype(cv_data)
        summary_parts.append(f"Detected archetype: {archetype.value}")
        
        return "\n".join(summary_parts)
    
    def _apply_llm_recommendations(
        self, 
        selections: List[ComponentSelection], 
        recommendations: Dict[str, Any]
    ) -> List[ComponentSelection]:
        """Apply LLM recommendations to the selections"""
        # Emphasize certain sections
        if "emphasize_sections" in recommendations:
            for section in recommendations["emphasize_sections"]:
                for selection in selections:
                    if selection.section == section:
                        # Boost priority for emphasized sections
                        selection.priority = max(1, selection.priority - 1)
                        # Add emphasis flag
                        selection.props["_emphasized"] = True
        
        # Add layout hints
        if "layout_hints" in recommendations and selections:
            selections[0].props["_llm_layout_hint"] = recommendations["layout_hints"]
        
        return selections
    
    async def get_selection_analysis(self, cv_data: CVData) -> Dict[str, Any]:
        """
        Get detailed analysis of selection strategy and recommendations
        """
        strategy = await self._get_selection_strategy(cv_data)
        
        # Get selections using the recommended strategy
        if strategy.use_smart_analysis:
            selections = self.smart_selector.select_components(cv_data)
            recommendations = self.smart_selector.get_layout_recommendations(selections)
        else:
            selections = super().select_components(cv_data)
            recommendations = {"layout_type": "standard", "merge_suggestions": []}
        
        return {
            "strategy": {
                "type": "smart" if strategy.use_smart_analysis else "basic",
                "reasoning": strategy.reasoning,
                "confidence": strategy.confidence
            },
            "selections": [
                {
                    "section": s.section,
                    "component": s.component_type,
                    "priority": s.priority
                }
                for s in selections
            ],
            "recommendations": recommendations,
            "llm_suggestions": strategy.recommendations
        }

# Create singleton instance
unified_component_selector = UnifiedComponentSelector()