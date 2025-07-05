"""
Consistent text sizing system for CV2WEB portfolios
Based on Tailwind responsive utilities
"""

class TextSizing:
    """
    Centralized text sizing classes to ensure consistency
    across all portfolio components
    """
    
    # Hero / H1
    HERO_TITLE = "text-4xl md:text-7xl"  # 32px → 60-64px
    
    # Section Headers / H2
    SECTION_TITLE = "text-3xl md:text-5xl"  # 28px → 48-52px
    
    # Subsection Headers / H3
    SUBSECTION_TITLE = "text-2xl"  # 24px
    
    # Lead / Intro text
    LEAD_TEXT = "text-xl md:text-2xl text-gray-300"  # 20px → 24px
    
    # Body text
    BODY_TEXT = "text-base md:text-lg"  # 16px → 18px
    
    # Small / Caption text
    SMALL_TEXT = "text-sm text-gray-400"  # 14px
    
    # Component-specific sizing
    CARD_TITLE = "text-xl font-bold"  # 20px
    CARD_DESCRIPTION = "text-base text-gray-300"  # 16px
    
    # Button text
    BUTTON_TEXT = "text-base font-medium"  # 16px
    
    # Timeline text
    TIMELINE_TITLE = "text-xl font-semibold"  # 20px
    TIMELINE_DATE = "text-sm text-gray-400"  # 14px
    TIMELINE_CONTENT = "text-base text-gray-300"  # 16px
    
    # BentoGrid text
    BENTO_TITLE = "text-lg font-semibold"  # 18px
    BENTO_DESCRIPTION = "text-sm text-gray-300"  # 14px
    
    # Tooltip text  
    TOOLTIP_NAME = "text-base font-medium"  # 16px
    TOOLTIP_DESIGNATION = "text-sm text-gray-400"  # 14px

# Export singleton
text_sizing = TextSizing()