{
  "metadata": {
    "total_components": 85,
    "mvp_suitable": 56,
    "excluded": 29,
    "last_updated": "2025-01-04",
    "version": "2.1"
  },
  "components": {
    "3DCard": {
      "file": "3d-card",
      "category": "3d_effect",
      "visual_impact": 8,
      "best_for": ["product_cards", "feature_showcase", "interactive_galleries"],
      "cv_sections": ["projects", "achievements", "certifications", "publications", "awards", "volunteer", "skills"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "image_replacement": "gradient_background",
        "visual_strategy": "Use gradients or CSS patterns instead of images",
        "minimum_items": 1
      },
      "data_requirements": {
        "required": ["children"],
        "optional": ["containerClassName", "className"],
        "cv_mapping": {
          "title": "project.title or achievement.value",
          "description": "project.description or achievement.label",
          "visual": "generated_gradient_based_on_title"
        }
      },
      "adapter_profile": "3d_interactive_card",
      "complexity": "high",
      "animation_type": "3d_perspective",
      "description": "Interactive 3D card effects with perspective transformations",
      "usage_notes": "Excellent for showcasing projects without images. Use color gradients based on project tech stack or achievement category."
    },
    "3DMarquee": {
      "file": "3d-marquee",
      "category": "carousel",
      "visual_impact": 9,
      "best_for": ["image_carousel", "logo_showcase", "portfolio_slider"],
      "cv_sections": ["skills", "certifications", "languages", "awards"],
      "mvp_suitable": false,
      "mvp_exclusion_reason": "Requires images for carousel effect",
      "data_requirements": {
        "required": ["images"],
        "optional": ["className"]
      },
      "adapter_profile": "3d_marquee_carousel",
      "complexity": "high",
      "animation_type": "3d_carousel",
      "description": "3D carousel/marquee for images with perspective effects"
    },
    "PinContainer": {
      "file": "3d-pin",
      "category": "3d_effect",
      "visual_impact": 9,
      "best_for": ["project_cards", "portfolio_items", "featured_content"],
      "cv_sections": ["projects", "publications", "achievements", "certifications", "awards", "volunteer"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "content_strategy": "Use text content with icon representations",
        "visual_strategy": "Create abstract shapes or use tech stack icons",
        "minimum_items": 1
      },
      "data_requirements": {
        "required": ["children"],
        "optional": ["title", "href", "className", "containerClassName"],
        "cv_mapping": {
          "title": "project.title or publication.title",
          "href": "project.projectUrl or publication.publicationUrl",
          "content": "Rich text description with tech badges"
        }
      },
      "adapter_profile": "3d_pin_showcase",
      "complexity": "high",
      "animation_type": "3d_transform",
      "description": "Creates a 3D perspective pin effect on hover with animated ripple effects",
      "usage_notes": "Great for highlighting key projects or publications. Replace preview images with tech stack icons or gradient cards."
    },
    "AnimatedModal": {
      "file": "animated-modal",
      "category": "modal",
      "visual_impact": 8,
      "best_for": ["dialogs", "overlays", "forms", "confirmations"],
      "cv_sections": ["projects", "experience", "education", "publications", "volunteer", "certifications"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "use_case": "Show detailed project or experience information",
        "minimum_items": 1
      },
      "data_requirements": {
        "required": ["children"],
        "optional": ["className"],
        "cv_mapping": {
          "trigger": "View Details button",
          "content": "Expanded project description or job responsibilities"
        }
      },
      "adapter_profile": "animated_modal_overlay",
      "complexity": "medium",
      "animation_type": "spring_modal",
      "description": "Animated modal dialogs with spring animations and backdrop blur",
      "usage_notes": "Use for 'Read More' functionality on projects or experience items."
    },
    "AnimatedTabs": {
      "file": "animated-tabs",
      "category": "navigation",
      "visual_impact": 7,
      "best_for": ["content_organization", "section_navigation", "category_switching"],
      "cv_sections": ["skills", "projects", "experience", "education", "certifications", "languages", "hobbies"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "use_case": "Organize content by categories",
        "minimum_items": 2
      },
      "data_requirements": {
        "required": ["tabs", "children"],
        "optional": ["className", "activeTabClassName"],
        "cv_mapping": {
          "tabs": "skill_categories or project_types",
          "content": "filtered_content_by_category"
        }
      },
      "adapter_profile": "animated_tabs_navigation",
      "complexity": "medium",
      "animation_type": "smooth_transition",
      "description": "Animated tab component for content organization",
      "usage_notes": "Use to organize skills by category or projects by type."
    },
    "AnimatedTestimonials": {
      "file": "animated-testimonials",
      "category": "testimonials",
      "visual_impact": 8,
      "best_for": ["testimonials", "reviews", "quotes"],
      "cv_sections": ["achievements", "awards", "references", "publications"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "image_replacement": "initials_avatar",
        "content_mapping": "achievement_as_testimonial",
        "minimum_items": 3,
        "optimal_items": "5-8"
      },
      "data_requirements": {
        "required": [],
        "optional": ["testimonials", "autoplay"],
        "cv_mapping": {
          "quote": "achievement.label",
          "name": "achievement.value",
          "designation": "achievement.contextOrDetail or 'Key Achievement'",
          "src": "generateInitialsAvatar(achievement.value)"
        }
      },
      "adapter_profile": "testimonial_carousel",
      "complexity": "high",
      "animation_type": "3d_stack_animation",
      "description": "Interactive testimonial carousel with 3D card stack effect and word-by-word reveal",
      "usage_notes": "Transform achievements into testimonial-style cards. Use initials or icons instead of photos."
    },
    "AnimatedTooltip": {
      "file": "animated-tooltip",
      "category": "tooltip",
      "visual_impact": 6,
      "best_for": ["user_avatars", "team_display", "hover_info"],
      "cv_sections": ["languages", "skills", "contact", "certifications", "achievements"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "image_replacement": "language_flags_or_skill_icons",
        "minimum_items": 2,
        "optimal_items": "4-8"
      },
      "data_requirements": {
        "required": ["items"],
        "optional": ["className"],
        "cv_mapping": {
          "languages": {
            "id": "index",
            "name": "language.language",
            "designation": "language.proficiency",
            "image": "getFlagIcon(language.language)"
          },
          "skills": {
            "id": "index",
            "name": "skill",
            "designation": "proficiency_level",
            "image": "getTechIcon(skill)"
          }
        }
      },
      "adapter_profile": "avatar_tooltip_group",
      "complexity": "low",
      "animation_type": "tooltip_hover",
      "description": "Animated tooltips for avatar groups showing user information",
      "usage_notes": "Perfect for languages with flag icons or skills with tech logos."
    },
    "AppleCardsCarousel": {
      "file": "apple-cards-carousel",
      "category": "carousel",
      "visual_impact": 9,
      "best_for": ["portfolio_showcase", "product_gallery", "case_studies"],
      "cv_sections": ["projects", "publications", "certifications"],
      "mvp_suitable": false,
      "mvp_exclusion_reason": "Requires images for Apple-style expanding cards",
      "data_requirements": {
        "required": ["items"],
        "optional": ["initialScroll"]
      },
      "adapter_profile": "apple_style_carousel",
      "complexity": "high",
      "animation_type": "expanding_cards",
      "description": "Apple-style expanding card carousel with modal view"
    },
    "AuroraBackground": {
      "file": "aurora-background",
      "category": "background",
      "visual_impact": 9,
      "best_for": ["hero_background", "section_background", "full_page_background"],
      "cv_sections": ["hero", "summary", "achievements", "skills", "any_section"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "No adaptation needed - pure CSS effect",
        "minimum_items": 0
      },
      "data_requirements": {
        "required": ["children"],
        "optional": ["showRadialGradient"],
        "cv_mapping": {
          "no_data_needed": "Pure visual effect"
        }
      },
      "adapter_profile": "animated_gradient_background",
      "complexity": "medium",
      "animation_type": "gradient_animation",
      "description": "Animated aurora borealis gradient background effect",
      "usage_notes": "Perfect hero background that requires no data."
    },
    "BackgroundBeams": {
      "file": "background-beams",
      "category": "background",
      "visual_impact": 8,
      "best_for": ["hero_sections", "landing_pages", "feature_highlights"],
      "cv_sections": ["hero", "achievements", "awards", "any_section"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "No adaptation needed - pure visual effect",
        "minimum_items": 0
      },
      "data_requirements": {
        "required": ["children"],
        "optional": ["className"],
        "cv_mapping": {
          "no_data_needed": "Pure visual effect"
        }
      },
      "adapter_profile": "animated_beams_background",
      "complexity": "medium",
      "animation_type": "beam_animation",
      "description": "Animated light beams radiating from center",
      "usage_notes": "Adds dynamic movement to hero sections."
    },
    "BackgroundBeamsWithCollision": {
      "file": "background-beams-with-collision",
      "category": "background",
      "visual_impact": 9,
      "best_for": ["interactive_sections", "hero_backgrounds", "feature_sections"],
      "cv_sections": ["hero", "skills", "achievements", "any_section"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "No adaptation needed - pure visual effect",
        "minimum_items": 0
      },
      "data_requirements": {
        "required": ["children"],
        "optional": ["className"],
        "cv_mapping": {
          "no_data_needed": "Pure visual effect"
        }
      },
      "adapter_profile": "interactive_beams_background",
      "complexity": "high",
      "animation_type": "collision_animation",
      "description": "Light beams that collide and bounce off edges",
      "usage_notes": "High visual impact for premium CV presentations."
    },
    "BackgroundBoxes": {
      "file": "background-boxes",
      "category": "background",
      "visual_impact": 7,
      "best_for": ["subtle_backgrounds", "content_sections", "form_backgrounds"],
      "cv_sections": ["education", "experience", "skills", "languages", "any_section"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "No adaptation needed - pure visual effect",
        "minimum_items": 0
      },
      "data_requirements": {
        "required": ["children"],
        "optional": ["className"],
        "cv_mapping": {
          "no_data_needed": "Pure visual effect"
        }
      },
      "adapter_profile": "animated_boxes_pattern",
      "complexity": "low",
      "animation_type": "floating_boxes",
      "description": "Subtle animated box pattern background",
      "usage_notes": "Good for sections that need subtle visual interest."
    },
    "BackgroundGradient": {
      "file": "background-gradient",
      "category": "background",
      "visual_impact": 7,
      "best_for": ["card_backgrounds", "section_highlights", "content_containers"],
      "cv_sections": ["projects", "certifications", "education", "volunteer", "any_section"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "No adaptation needed - pure CSS effect",
        "minimum_items": 0
      },
      "data_requirements": {
        "required": ["children"],
        "optional": ["className", "animate"],
        "cv_mapping": {
          "no_data_needed": "Pure visual effect"
        }
      },
      "adapter_profile": "gradient_container",
      "complexity": "low",
      "animation_type": "gradient_shift",
      "description": "Animated or static gradient backgrounds for containers",
      "usage_notes": "Wrap cards or sections to add visual depth."
    },
    "BackgroundGradientAnimation": {
      "file": "background-gradient-animation",
      "category": "background",
      "visual_impact": 8,
      "best_for": ["hero_sections", "cta_sections", "feature_highlights"],
      "cv_sections": ["hero", "summary", "achievements", "any_section"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "No adaptation needed - pure CSS animation",
        "minimum_items": 0
      },
      "data_requirements": {
        "required": ["children"],
        "optional": ["gradientBackgroundStart", "gradientBackgroundEnd"],
        "cv_mapping": {
          "no_data_needed": "Pure visual effect"
        }
      },
      "adapter_profile": "animated_gradient_shift",
      "complexity": "medium",
      "animation_type": "gradient_morph",
      "description": "Smoothly animated gradient transitions",
      "usage_notes": "Creates a premium feel for hero sections."
    },
    "BackgroundLines": {
      "file": "background-lines",
      "category": "background",
      "visual_impact": 6,
      "best_for": ["minimal_backgrounds", "tech_themes", "modern_layouts"],
      "cv_sections": ["skills", "experience", "projects", "any_section"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "No adaptation needed - pure visual effect",
        "minimum_items": 0
      },
      "data_requirements": {
        "required": ["children"],
        "optional": ["className", "svgOptions"],
        "cv_mapping": {
          "no_data_needed": "Pure visual effect"
        }
      },
      "adapter_profile": "animated_line_pattern",
      "complexity": "low",
      "animation_type": "flowing_lines",
      "description": "Animated diagonal or grid lines background",
      "usage_notes": "Subtle tech-themed background pattern."
    },
    "BentoGrid": {
      "file": "bento-grid",
      "category": "layout",
      "visual_impact": 8,
      "best_for": ["skills_showcase", "services_grid", "feature_layout"],
      "cv_sections": ["skills", "hobbies", "certifications", "languages", "achievements", "education"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "image_replacement": "icon_or_gradient",
        "minimum_items": 3,
        "optimal_items": "4-9"
      },
      "data_requirements": {
        "required": ["children"],
        "optional": ["className"],
        "cv_mapping": {
          "grid_items": "skills.map(category => BentoGridItem)",
          "title": "category.name",
          "description": "category.skills.join(', ')",
          "icon": "getCategoryIcon(category.name)"
        }
      },
      "adapter_profile": "masonry_grid_layout",
      "complexity": "medium",
      "animation_type": "staggered_reveal",
      "description": "Apple-inspired bento box grid layout with varied cell sizes",
      "usage_notes": "Requires at least 3 items. Automatically adjusts cell sizes for visual variety."
    },
    "CanvasRevealEffect": {
      "file": "canvas-reveal-effect",
      "category": "effect",
      "visual_impact": 9,
      "best_for": ["hero_reveals", "section_transitions", "dramatic_effects"],
      "cv_sections": ["hero", "summary", "achievements", "awards"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "Text-based reveal effect",
        "minimum_items": 0
      },
      "data_requirements": {
        "required": ["children"],
        "optional": ["colors", "dotSize"],
        "cv_mapping": {
          "reveal_content": "hero_text_or_name"
        }
      },
      "adapter_profile": "canvas_particle_reveal",
      "complexity": "high",
      "animation_type": "particle_reveal",
      "description": "Canvas-based particle reveal animation on hover",
      "usage_notes": "High-impact reveal for hero text or featured content."
    },
    "CardHoverEffect": {
      "file": "card-hover-effect",
      "category": "card",
      "visual_impact": 8,
      "best_for": ["project_cards", "service_cards", "portfolio_items"],
      "cv_sections": ["projects", "experience", "education", "volunteer", "certifications", "publications"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "image_replacement": "gradient_or_pattern",
        "minimum_items": 2,
        "optimal_items": "3-6"
      },
      "data_requirements": {
        "required": ["items"],
        "optional": ["className"],
        "cv_mapping": {
          "title": "project.title",
          "description": "project.description",
          "link": "project.projectUrl",
          "background": "generateGradient(project.title)"
        }
      },
      "adapter_profile": "hover_transform_cards",
      "complexity": "medium",
      "animation_type": "3d_hover_tilt",
      "description": "Cards with 3D tilt effect on hover",
      "usage_notes": "Replace images with gradients based on content type or tech stack."
    },
    "CardSpotlight": {
      "file": "card-spotlight",
      "category": "card",
      "visual_impact": 8,
      "best_for": ["featured_content", "certifications", "awards"],
      "cv_sections": ["certifications", "achievements", "awards", "education", "skills"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "Highlight important items",
        "minimum_items": 1
      },
      "data_requirements": {
        "required": ["children"],
        "optional": ["className", "radius"],
        "cv_mapping": {
          "content": "certification_or_achievement_details"
        }
      },
      "adapter_profile": "spotlight_hover_card",
      "complexity": "medium",
      "animation_type": "spotlight_follow",
      "description": "Cards with spotlight effect following mouse movement",
      "usage_notes": "Great for highlighting certifications or key achievements."
    },
    "CardStack": {
      "file": "card-stack",
      "category": "card",
      "visual_impact": 8,
      "best_for": ["testimonials", "reviews", "rotating_content"],
      "cv_sections": ["achievements", "projects", "references", "awards", "publications"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "Stack of swipeable cards",
        "minimum_items": 3,
        "optimal_items": "5-10"
      },
      "data_requirements": {
        "required": ["items"],
        "optional": ["offset", "scaleFactor"],
        "cv_mapping": {
          "name": "item.title",
          "designation": "item.subtitle",
          "content": "item.description"
        }
      },
      "adapter_profile": "swipeable_card_stack",
      "complexity": "high",
      "animation_type": "stack_animation",
      "description": "Swipeable stack of cards with smooth animations",
      "usage_notes": "Interactive way to browse through multiple items."
    },
    "Cards": {
      "file": "cards",
      "category": "card",
      "visual_impact": 6,
      "best_for": ["general_content", "information_display", "basic_layouts"],
      "cv_sections": ["experience", "education", "projects", "volunteer", "skills", "any_section"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "Basic card layouts",
        "minimum_items": 1
      },
      "data_requirements": {
        "required": ["children"],
        "optional": ["className", "variant"],
        "cv_mapping": {
          "content": "any_cv_content"
        }
      },
      "adapter_profile": "basic_card_collection",
      "complexity": "low",
      "animation_type": "minimal",
      "description": "Collection of basic card components",
      "usage_notes": "Use when simpler card layouts are needed."
    },
    "Carousel": {
      "file": "carousel",
      "category": "carousel",
      "visual_impact": 7,
      "best_for": ["content_slider", "testimonials", "feature_showcase"],
      "cv_sections": ["projects", "certifications", "achievements", "awards", "publications", "references"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "Text-based carousel",
        "minimum_items": 3
      },
      "data_requirements": {
        "required": ["items"],
        "optional": ["autoplay", "pauseOnHover"],
        "cv_mapping": {
          "slides": "cv_items_array"
        }
      },
      "adapter_profile": "basic_carousel",
      "complexity": "medium",
      "animation_type": "slide_transition",
      "description": "Basic carousel component for sliding content",
      "usage_notes": "Can be used for any content that needs rotation."
    },
    "CodeBlock": {
      "file": "code-block",
      "category": "display",
      "visual_impact": 5,
      "best_for": ["code_showcase", "technical_examples", "syntax_highlighting"],
      "cv_sections": ["projects", "skills", "education"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "Show code snippets or technical examples",
        "minimum_items": 1
      },
      "data_requirements": {
        "required": ["code", "language"],
        "optional": ["showLineNumbers", "theme"],
        "cv_mapping": {
          "code": "project.codeExample or skill.example",
          "language": "programming_language"
        }
      },
      "adapter_profile": "code_display",
      "complexity": "low",
      "animation_type": "none",
      "description": "Syntax-highlighted code display component",
      "usage_notes": "Use to showcase technical skills with code examples."
    },
    "ColourfulText": {
      "file": "colourful-text",
      "category": "text",
      "visual_impact": 6,
      "best_for": ["headings", "emphasis", "playful_text"],
      "cv_sections": ["hero", "hobbies", "summary", "skills"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "No adaptation needed - text effect",
        "minimum_items": 0
      },
      "data_requirements": {
        "required": ["text"],
        "optional": ["colors", "animationSpeed"],
        "cv_mapping": {
          "text": "any_heading_or_title"
        }
      },
      "adapter_profile": "gradient_text_animation",
      "complexity": "low",
      "animation_type": "color_shift",
      "description": "Text with animated color gradients",
      "usage_notes": "Adds playful element to headings or hobby sections."
    },
    "Compare": {
      "file": "compare",
      "category": "interactive",
      "visual_impact": 8,
      "best_for": ["before_after", "comparisons", "portfolio_evolution"],
      "cv_sections": ["projects", "skills"],
      "mvp_suitable": false,
      "mvp_exclusion_reason": "Requires before/after images",
      "data_requirements": {
        "required": ["firstImage", "secondImage"],
        "optional": ["className", "slideMode"]
      },
      "adapter_profile": "comparison_slider",
      "complexity": "high",
      "animation_type": "slide_reveal",
      "description": "Before/after comparison slider"
    },
    "ContainerScrollAnimation": {
      "file": "container-scroll-animation",
      "category": "scroll",
      "visual_impact": 9,
      "best_for": ["hero_sections", "product_showcases", "landing_pages"],
      "cv_sections": ["hero", "projects"],
      "mvp_suitable": false,
      "mvp_exclusion_reason": "Requires hero image for scroll effect",
      "data_requirements": {
        "required": ["children", "titleComponent"],
        "optional": ["className"]
      },
      "adapter_profile": "scroll_transform_container",
      "complexity": "high",
      "animation_type": "parallax_scroll",
      "description": "Container with scroll-triggered animations"
    },
    "ContainerTextFlip": {
      "file": "container-text-flip",
      "category": "text",
      "visual_impact": 7,
      "best_for": ["headings", "titles", "emphasis"],
      "cv_sections": ["hero", "summary", "achievements", "education"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "Text flip animation",
        "minimum_items": 0
      },
      "data_requirements": {
        "required": ["text"],
        "optional": ["className", "duration"],
        "cv_mapping": {
          "text": "section_title_or_heading"
        }
      },
      "adapter_profile": "text_flip_animation",
      "complexity": "medium",
      "animation_type": "3d_flip",
      "description": "Text that flips with 3D effect",
      "usage_notes": "Eye-catching effect for section headers."
    },
    "Cover": {
      "file": "cover",
      "category": "text",
      "visual_impact": 7,
      "best_for": ["hero_text", "titles", "emphasis"],
      "cv_sections": ["hero", "summary", "achievements"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "Text reveal effect",
        "minimum_items": 0
      },
      "data_requirements": {
        "required": ["children"],
        "optional": ["className"],
        "cv_mapping": {
          "text": "hero_title_or_name"
        }
      },
      "adapter_profile": "text_cover_reveal",
      "complexity": "medium",
      "animation_type": "cover_slide",
      "description": "Text with animated cover reveal effect",
      "usage_notes": "Smooth reveal animation for important text."
    },
    "DirectionAwareHover": {
      "file": "direction-aware-hover",
      "category": "hover",
      "visual_impact": 8,
      "best_for": ["image_galleries", "portfolio_grids", "team_photos"],
      "cv_sections": ["projects", "volunteer"],
      "mvp_suitable": false,
      "mvp_exclusion_reason": "Designed for image hover effects",
      "data_requirements": {
        "required": ["imageUrl", "children"],
        "optional": ["childrenClassName", "imageClassName"]
      },
      "adapter_profile": "directional_hover_reveal",
      "complexity": "high",
      "animation_type": "directional_slide",
      "description": "Hover effect that responds to entry direction"
    },
    "DraggableCard": {
      "file": "draggable-card",
      "category": "interactive",
      "visual_impact": 7,
      "best_for": ["interactive_layouts", "customizable_grids", "playful_interfaces"],
      "cv_sections": ["skills", "hobbies", "languages", "certifications"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "Draggable skill or hobby cards",
        "minimum_items": 3
      },
      "data_requirements": {
        "required": ["id", "content"],
        "optional": ["defaultPosition", "onDragEnd"],
        "cv_mapping": {
          "cards": "skills_or_hobbies_array"
        }
      },
      "adapter_profile": "draggable_interface",
      "complexity": "high",
      "animation_type": "drag_physics",
      "description": "Cards that can be dragged and rearranged",
      "usage_notes": "Interactive way to display skills or interests."
    },
    "EvervaultCard": {
      "file": "evervault-card",
      "category": "card",
      "visual_impact": 9,
      "best_for": ["premium_cards", "tech_showcase", "skill_highlights"],
      "cv_sections": ["skills", "certifications", "achievements", "awards", "education"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "Premium animated cards",
        "minimum_items": 1
      },
      "data_requirements": {
        "required": ["text"],
        "optional": ["className", "gradientColor"],
        "cv_mapping": {
          "text": "skill_name_or_certification"
        }
      },
      "adapter_profile": "premium_gradient_card",
      "complexity": "high",
      "animation_type": "gradient_mesh",
      "description": "Cards with animated gradient mesh effect",
      "usage_notes": "High visual impact for key skills or certifications."
    },
    "ExpandableCards": {
      "file": "expandable-cards",
      "category": "card",
      "visual_impact": 7,
      "best_for": ["detailed_content", "project_showcases", "experience_details"],
      "cv_sections": ["projects", "experience", "publications", "education", "volunteer"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "Cards that expand to show details",
        "minimum_items": 2
      },
      "data_requirements": {
        "required": ["cards"],
        "optional": ["className"],
        "cv_mapping": {
          "title": "item.title",
          "description": "item.summary",
          "content": "item.fullDescription"
        }
      },
      "adapter_profile": "expandable_content_cards",
      "complexity": "medium",
      "animation_type": "expand_collapse",
      "description": "Cards that expand on click to reveal more content",
      "usage_notes": "Perfect for projects or experiences with detailed descriptions."
    },
    "FeatureSections": {
      "file": "feature-sections",
      "category": "layout",
      "visual_impact": 7,
      "best_for": ["feature_lists", "service_offerings", "skill_showcases"],
      "cv_sections": ["skills", "achievements", "certifications", "languages", "education"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "Organized feature displays",
        "minimum_items": 3
      },
      "data_requirements": {
        "required": ["features"],
        "optional": ["layout", "className"],
        "cv_mapping": {
          "features": "skills_or_achievements_array"
        }
      },
      "adapter_profile": "feature_layout_sections",
      "complexity": "medium",
      "animation_type": "staggered_fade",
      "description": "Pre-built feature section layouts",
      "usage_notes": "Quick way to create professional feature displays."
    },
    "FileUpload": {
      "file": "file-upload",
      "category": "form",
      "visual_impact": 6,
      "best_for": ["file_uploads", "document_submission", "forms"],
      "cv_sections": [],
      "mvp_suitable": false,
      "mvp_exclusion_reason": "Not suitable for CV display",
      "data_requirements": {
        "required": ["onChange"],
        "optional": ["multiple", "accept"]
      },
      "adapter_profile": "file_upload_component",
      "complexity": "medium",
      "animation_type": "drag_drop",
      "description": "Drag and drop file upload component"
    },
    "FlipWords": {
      "file": "flip-words",
      "category": "text",
      "visual_impact": 7,
      "best_for": ["rotating_text", "dynamic_headlines", "role_descriptions"],
      "cv_sections": ["hero", "languages", "hobbies", "skills", "certifications"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "Rotating word display",
        "minimum_items": 2
      },
      "data_requirements": {
        "required": ["words"],
        "optional": ["duration", "className"],
        "cv_mapping": {
          "words": "roles_array_or_languages"
        }
      },
      "adapter_profile": "word_rotation_display",
      "complexity": "low",
      "animation_type": "flip_transition",
      "description": "Words that flip/rotate automatically",
      "usage_notes": "Great for showing multiple roles or languages."
    },
    "FloatingDock": {
      "file": "floating-dock",
      "category": "navigation",
      "visual_impact": 7,
      "best_for": ["contact_links", "social_media", "quick_actions"],
      "cv_sections": ["contact", "references"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "Floating contact dock",
        "minimum_items": 3
      },
      "data_requirements": {
        "required": ["items"],
        "optional": ["desktopClassName", "mobileClassName"],
        "cv_mapping": {
          "items": "contact_methods_with_icons"
        }
      },
      "adapter_profile": "floating_contact_dock",
      "complexity": "medium",
      "animation_type": "bounce_hover",
      "description": "macOS-style floating dock for links",
      "usage_notes": "Perfect for contact information and social links."
    },
    "FloatingNavbar": {
      "file": "floating-navbar",
      "category": "navigation",
      "visual_impact": 6,
      "best_for": ["site_navigation", "section_links", "sticky_menu"],
      "cv_sections": ["navigation"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "Section navigation",
        "minimum_items": 3
      },
      "data_requirements": {
        "required": ["navItems"],
        "optional": ["className"],
        "cv_mapping": {
          "navItems": "cv_sections_array"
        }
      },
      "adapter_profile": "sticky_navigation_bar",
      "complexity": "medium",
      "animation_type": "slide_fade",
      "description": "Sticky navigation bar that appears on scroll",
      "usage_notes": "Use for multi-section CV navigation."
    },
    "FocusCards": {
      "file": "focus-cards",
      "category": "card",
      "visual_impact": 8,
      "best_for": ["image_galleries", "portfolio_showcase", "team_display"],
      "cv_sections": ["projects", "certifications"],
      "mvp_suitable": false,
      "mvp_exclusion_reason": "Requires images for focus effect",
      "data_requirements": {
        "required": ["cards"],
        "optional": ["className"]
      },
      "adapter_profile": "focus_gallery_cards",
      "complexity": "high",
      "animation_type": "focus_blur",
      "description": "Cards that focus on hover while others blur"
    },
    "FollowingPointer": {
      "file": "following-pointer",
      "category": "interactive",
      "visual_impact": 6,
      "best_for": ["interactive_elements", "playful_ui", "cursor_effects"],
      "cv_sections": ["hero", "hobbies", "any_section"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "Interactive cursor follower",
        "minimum_items": 0
      },
      "data_requirements": {
        "required": ["children"],
        "optional": ["className", "title"],
        "cv_mapping": {
          "title": "hover_text_or_tooltip"
        }
      },
      "adapter_profile": "cursor_follow_effect",
      "complexity": "medium",
      "animation_type": "follow_cursor",
      "description": "Element that follows cursor movement",
      "usage_notes": "Adds interactivity to any section."
    },
    "GlareCard": {
      "file": "glare-card",
      "category": "card",
      "visual_impact": 7,
      "best_for": ["premium_cards", "certifications", "achievements"],
      "cv_sections": ["summary", "achievements", "certifications", "awards", "education"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "Cards with glare effect",
        "minimum_items": 1
      },
      "data_requirements": {
        "required": ["children"],
        "optional": ["className", "glareProps"],
        "cv_mapping": {
          "content": "achievement_or_certification"
        }
      },
      "adapter_profile": "glare_effect_card",
      "complexity": "medium",
      "animation_type": "glare_sweep",
      "description": "Cards with animated glare/shine effect",
      "usage_notes": "Adds premium feel to important items."
    },
    "Globe": {
      "file": "globe",
      "category": "visualization",
      "visual_impact": 9,
      "best_for": ["location_display", "global_presence", "international_experience"],
      "cv_sections": ["experience", "education", "languages"],
      "mvp_suitable": false,
      "mvp_exclusion_reason": "Requires coordinate data and complex setup",
      "data_requirements": {
        "required": ["markers"],
        "optional": ["globeConfig", "className"]
      },
      "adapter_profile": "3d_globe_visualization",
      "complexity": "very_high",
      "animation_type": "3d_rotation",
      "description": "Interactive 3D globe with location markers"
    },
    "GlowingEffect": {
      "file": "glowing-effect",
      "category": "effect",
      "visual_impact": 7,
      "best_for": ["emphasis", "highlights", "cta_buttons"],
      "cv_sections": ["contact", "achievements", "awards", "certifications"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "Glowing emphasis effect",
        "minimum_items": 0
      },
      "data_requirements": {
        "required": ["children"],
        "optional": ["color", "className"],
        "cv_mapping": {
          "content": "important_text_or_button"
        }
      },
      "adapter_profile": "glow_emphasis",
      "complexity": "low",
      "animation_type": "pulse_glow",
      "description": "Glowing effect for emphasis",
      "usage_notes": "Use sparingly for key CTAs or achievements."
    },
    "GlowingStars": {
      "file": "glowing-stars",
      "category": "effect",
      "visual_impact": 8,
      "best_for": ["achievements", "ratings", "highlights"],
      "cv_sections": ["achievements", "skills", "hero", "awards", "certifications"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "Animated star effects",
        "minimum_items": 0
      },
      "data_requirements": {
        "required": ["children"],
        "optional": ["starCount", "className"],
        "cv_mapping": {
          "rating": "skill_level_or_achievement_rank"
        }
      },
      "adapter_profile": "star_animation_effect",
      "complexity": "medium",
      "animation_type": "twinkle_glow",
      "description": "Animated glowing stars effect",
      "usage_notes": "Great for highlighting achievements or skill levels."
    },
    "GoogleGeminiEffect": {
      "file": "google-gemini-effect",
      "category": "text",
      "visual_impact": 8,
      "best_for": ["modern_text", "ai_themes", "tech_content"],
      "cv_sections": ["summary", "hero", "skills"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "Modern text reveal",
        "minimum_items": 0
      },
      "data_requirements": {
        "required": ["text"],
        "optional": ["className", "duration"],
        "cv_mapping": {
          "text": "summary_or_tagline"
        }
      },
      "adapter_profile": "gemini_text_effect",
      "complexity": "medium",
      "animation_type": "gradient_reveal",
      "description": "Google Gemini-style text animation",
      "usage_notes": "Modern effect for tech-focused CVs."
    },
    "GridAndDotBackgrounds": {
      "file": "grid-and-dot-backgrounds",
      "category": "background",
      "visual_impact": 5,
      "best_for": ["subtle_backgrounds", "tech_themes", "minimal_design"],
      "cv_sections": ["skills", "projects", "education", "any_section"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "Pure CSS background",
        "minimum_items": 0
      },
      "data_requirements": {
        "required": ["children"],
        "optional": ["showGrid", "showDots"],
        "cv_mapping": {
          "no_data_needed": "Pure visual effect"
        }
      },
      "adapter_profile": "grid_dot_pattern",
      "complexity": "low",
      "animation_type": "static_pattern",
      "description": "Grid and dot pattern backgrounds",
      "usage_notes": "Subtle tech-themed background option."
    },
    "HeroHighlight": {
      "file": "hero-highlight",
      "category": "hero",
      "visual_impact": 8,
      "best_for": ["hero_sections", "name_display", "title_emphasis"],
      "cv_sections": ["hero", "summary"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "Text highlighting effect",
        "minimum_items": 0
      },
      "data_requirements": {
        "required": ["children"],
        "optional": ["className", "containerClassName"],
        "cv_mapping": {
          "highlight_text": "name_or_title"
        }
      },
      "adapter_profile": "hero_text_highlight",
      "complexity": "medium",
      "animation_type": "highlight_sweep",
      "description": "Hero text with animated highlight effect",
      "usage_notes": "Perfect for highlighting name or professional title."
    },
    "HeroParallax": {
      "file": "hero-parallax",
      "category": "hero",
      "visual_impact": 9,
      "best_for": ["portfolio_hero", "product_showcase", "visual_impact"],
      "cv_sections": ["hero", "projects"],
      "mvp_suitable": false,
      "mvp_exclusion_reason": "Requires multiple product images",
      "data_requirements": {
        "required": ["products"],
        "optional": ["className"]
      },
      "adapter_profile": "parallax_hero_gallery",
      "complexity": "high",
      "animation_type": "parallax_scroll",
      "description": "Hero section with parallax scrolling images"
    },
    "HeroSections": {
      "file": "hero-sections",
      "category": "hero",
      "visual_impact": 8,
      "best_for": ["complete_hero", "landing_sections", "intro_layouts"],
      "cv_sections": ["hero"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "Pre-built hero layouts",
        "minimum_items": 0
      },
      "data_requirements": {
        "required": ["variant", "data"],
        "optional": ["className"],
        "cv_mapping": {
          "name": "cv.fullName",
          "title": "cv.professionalTitle",
          "summary": "cv.summary"
        }
      },
      "adapter_profile": "hero_section_variants",
      "complexity": "medium",
      "animation_type": "varied",
      "description": "Collection of pre-built hero section layouts",
      "usage_notes": "Choose from multiple hero layout options."
    },
    "HoverBorderGradient": {
      "file": "hover-border-gradient",
      "category": "button",
      "visual_impact": 7,
      "best_for": ["cta_buttons", "contact_links", "action_buttons"],
      "cv_sections": ["contact", "projects", "publications"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "Animated gradient borders",
        "minimum_items": 0
      },
      "data_requirements": {
        "required": ["children"],
        "optional": ["className", "containerClassName"],
        "cv_mapping": {
          "button_text": "contact_method_or_cta"
        }
      },
      "adapter_profile": "gradient_border_button",
      "complexity": "low",
      "animation_type": "border_animation",
      "description": "Buttons with animated gradient borders on hover",
      "usage_notes": "Eye-catching effect for contact buttons."
    },
    "ImagesSlider": {
      "file": "images-slider",
      "category": "slider",
      "visual_impact": 9,
      "best_for": ["hero_backgrounds", "portfolio_showcase", "visual_stories"],
      "cv_sections": ["hero", "projects"],
      "mvp_suitable": false,
      "mvp_exclusion_reason": "Requires background images",
      "data_requirements": {
        "required": ["images", "children"],
        "optional": ["overlay", "autoplay"]
      },
      "adapter_profile": "fullscreen_image_slider",
      "complexity": "high",
      "animation_type": "slide_transition",
      "description": "Fullscreen background image slider"
    },
    "InfiniteMovingCards": {
      "file": "infinite-moving-cards",
      "category": "carousel",
      "visual_impact": 8,
      "best_for": ["testimonials", "certifications", "continuous_display"],
      "cv_sections": ["certifications", "achievements", "awards", "skills", "languages", "publications"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "Auto-scrolling content",
        "minimum_items": 3
      },
      "data_requirements": {
        "required": ["items"],
        "optional": ["direction", "speed", "pauseOnHover"],
        "cv_mapping": {
          "items": "certifications_or_testimonials"
        }
      },
      "adapter_profile": "infinite_scroll_carousel",
      "complexity": "medium",
      "animation_type": "continuous_scroll",
      "description": "Continuously moving carousel of cards",
      "usage_notes": "Great for displaying multiple certifications or quotes."
    },
    "Lamp": {
      "file": "lamp",
      "category": "effect",
      "visual_impact": 8,
      "best_for": ["hero_sections", "featured_content", "dramatic_reveals"],
      "cv_sections": ["hero", "summary", "achievements"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "Lamp lighting effect",
        "minimum_items": 0
      },
      "data_requirements": {
        "required": ["children"],
        "optional": ["className"],
        "cv_mapping": {
          "content": "hero_content"
        }
      },
      "adapter_profile": "lamp_light_effect",
      "complexity": "medium",
      "animation_type": "light_reveal",
      "description": "Lamp/spotlight lighting effect",
      "usage_notes": "Dramatic effect for hero sections."
    },
    "LayoutGrid": {
      "file": "layout-grid",
      "category": "layout",
      "visual_impact": 6,
      "best_for": ["content_organization", "portfolio_grids", "structured_layouts"],
      "cv_sections": ["projects", "skills", "certifications", "education", "publications"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "Responsive grid layout",
        "minimum_items": 2
      },
      "data_requirements": {
        "required": ["cards"],
        "optional": ["className"],
        "cv_mapping": {
          "cards": "projects_or_skills_array"
        }
      },
      "adapter_profile": "responsive_grid_layout",
      "complexity": "low",
      "animation_type": "fade_in",
      "description": "Responsive grid layout system",
      "usage_notes": "Flexible grid for any content type."
    },
    "Lens": {
      "file": "lens",
      "category": "effect",
      "visual_impact": 8,
      "best_for": ["image_zoom", "detail_view", "magnification"],
      "cv_sections": ["certifications", "awards"],
      "mvp_suitable": false,
      "mvp_exclusion_reason": "Requires images to magnify",
      "data_requirements": {
        "required": ["children"],
        "optional": ["zoomFactor", "lensSize"]
      },
      "adapter_profile": "magnifying_lens_effect",
      "complexity": "high",
      "animation_type": "zoom_follow",
      "description": "Magnifying lens effect on hover"
    },
    "LinkPreview": {
      "file": "link-preview",
      "category": "ui",
      "visual_impact": 6,
      "best_for": ["external_links", "references", "portfolio_links"],
      "cv_sections": ["projects", "publications", "references", "contact"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "Rich link previews",
        "minimum_items": 0
      },
      "data_requirements": {
        "required": ["url"],
        "optional": ["className", "width", "height"],
        "cv_mapping": {
          "url": "project.url or publication.link"
        }
      },
      "adapter_profile": "link_hover_preview",
      "complexity": "medium",
      "animation_type": "fade_slide",
      "description": "Shows link preview on hover",
      "usage_notes": "Enhances external links with previews."
    },
    "MacbookScroll": {
      "file": "macbook-scroll",
      "category": "showcase",
      "visual_impact": 9,
      "best_for": ["project_showcase", "app_demo", "portfolio_presentation"],
      "cv_sections": ["projects"],
      "mvp_suitable": false,
      "mvp_exclusion_reason": "Requires screen content/images",
      "data_requirements": {
        "required": ["src"],
        "optional": ["showGradient", "title"]
      },
      "adapter_profile": "macbook_screen_scroll",
      "complexity": "very_high",
      "animation_type": "3d_scroll",
      "description": "3D MacBook with scrolling screen content"
    },
    "Meteors": {
      "file": "meteors",
      "category": "background",
      "visual_impact": 8,
      "best_for": ["dynamic_backgrounds", "achievements", "space_themes"],
      "cv_sections": ["achievements", "awards", "hero", "any_section"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "Animated background effect",
        "minimum_items": 0
      },
      "data_requirements": {
        "required": ["number"],
        "optional": ["className"],
        "cv_mapping": {
          "no_data_needed": "Pure visual effect"
        }
      },
      "adapter_profile": "meteor_shower_effect",
      "complexity": "medium",
      "animation_type": "falling_animation",
      "description": "Falling meteors animation effect",
      "usage_notes": "Dynamic background for achievement sections."
    },
    "MovingBorder": {
      "file": "moving-border",
      "category": "button",
      "visual_impact": 7,
      "best_for": ["premium_buttons", "cta", "special_links"],
      "cv_sections": ["contact", "projects", "publications"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "Animated border buttons",
        "minimum_items": 0
      },
      "data_requirements": {
        "required": ["children"],
        "optional": ["duration", "className"],
        "cv_mapping": {
          "button_content": "cta_text"
        }
      },
      "adapter_profile": "animated_border_button",
      "complexity": "medium",
      "animation_type": "border_rotation",
      "description": "Button with rotating gradient border",
      "usage_notes": "Premium effect for important CTAs."
    },
    "MultiStepLoader": {
      "file": "multi-step-loader",
      "category": "loader",
      "visual_impact": 7,
      "best_for": ["loading_states", "process_indication", "wait_screens"],
      "cv_sections": ["loading_states"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "Loading animation",
        "minimum_items": 0
      },
      "data_requirements": {
        "required": ["loadingStates"],
        "optional": ["loading", "duration"],
        "cv_mapping": {
          "states": "cv_section_names"
        }
      },
      "adapter_profile": "multi_step_loading",
      "complexity": "medium",
      "animation_type": "step_progress",
      "description": "Multi-step loading animation with progress",
      "usage_notes": "Can be used while loading CV sections."
    },
    "NavbarMenu": {
      "file": "navbar-menu",
      "category": "navigation",
      "visual_impact": 6,
      "best_for": ["site_navigation", "menu_systems", "responsive_nav"],
      "cv_sections": ["navigation"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "Navigation menu",
        "minimum_items": 3
      },
      "data_requirements": {
        "required": ["items"],
        "optional": ["className", "active"],
        "cv_mapping": {
          "items": "cv_section_links"
        }
      },
      "adapter_profile": "navigation_menu",
      "complexity": "medium",
      "animation_type": "menu_transitions",
      "description": "Responsive navigation menu component",
      "usage_notes": "Full navigation system for multi-page CVs."
    },
    "ParallaxScroll": {
      "file": "parallax-scroll",
      "category": "scroll",
      "visual_impact": 9,
      "best_for": ["image_galleries", "portfolio_showcase", "visual_stories"],
      "cv_sections": ["projects", "achievements"],
      "mvp_suitable": false,
      "mvp_exclusion_reason": "Requires image gallery",
      "data_requirements": {
        "required": ["images"],
        "optional": ["className"]
      },
      "adapter_profile": "parallax_image_gallery",
      "complexity": "high",
      "animation_type": "parallax_scroll",
      "description": "Parallax scrolling image gallery"
    },
    "PlaceholdersAndVanishInput": {
      "file": "placeholders-and-vanish-input",
      "category": "form",
      "visual_impact": 7,
      "best_for": ["search_bars", "input_fields", "forms"],
      "cv_sections": [],
      "mvp_suitable": false,
      "mvp_exclusion_reason": "Not suitable for CV display",
      "data_requirements": {
        "required": ["placeholders", "onChange"],
        "optional": ["onSubmit"]
      },
      "adapter_profile": "animated_input_field",
      "complexity": "medium",
      "animation_type": "text_vanish",
      "description": "Input with animated placeholder text"
    },
    "PointerHighlight": {
      "file": "pointer-highlight",
      "category": "effect",
      "visual_impact": 6,
      "best_for": ["interactive_areas", "hover_effects", "emphasis"],
      "cv_sections": ["skills", "projects", "any_section"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "Pointer highlight effect",
        "minimum_items": 0
      },
      "data_requirements": {
        "required": ["children"],
        "optional": ["className"],
        "cv_mapping": {
          "highlighted_content": "any_interactive_element"
        }
      },
      "adapter_profile": "pointer_glow_effect",
      "complexity": "low",
      "animation_type": "glow_follow",
      "description": "Highlight effect following pointer",
      "usage_notes": "Subtle interactivity for any element."
    },
    "ResizableNavbar": {
      "file": "resizable-navbar",
      "category": "navigation",
      "visual_impact": 6,
      "best_for": ["adaptive_navigation", "scroll_effects", "dynamic_headers"],
      "cv_sections": ["navigation"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "Resizing navigation bar",
        "minimum_items": 3
      },
      "data_requirements": {
        "required": ["items"],
        "optional": ["className", "scrollThreshold"],
        "cv_mapping": {
          "items": "navigation_links"
        }
      },
      "adapter_profile": "adaptive_navbar",
      "complexity": "medium",
      "animation_type": "resize_transition",
      "description": "Navigation bar that resizes on scroll",
      "usage_notes": "Professional navigation with scroll effects."
    },
    "ShootingStars": {
      "file": "shooting-stars",
      "category": "background",
      "visual_impact": 7,
      "best_for": ["night_themes", "achievements", "creative_backgrounds"],
      "cv_sections": ["achievements", "awards", "hero", "any_section"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "Background animation",
        "minimum_items": 0
      },
      "data_requirements": {
        "required": [],
        "optional": ["starCount", "className"],
        "cv_mapping": {
          "no_data_needed": "Pure visual effect"
        }
      },
      "adapter_profile": "shooting_star_animation",
      "complexity": "medium",
      "animation_type": "streak_animation",
      "description": "Animated shooting stars background effect",
      "usage_notes": "Adds movement to achievement sections."
    },
    "Sidebar": {
      "file": "sidebar",
      "category": "navigation",
      "visual_impact": 6,
      "best_for": ["side_navigation", "menu_systems", "dashboard_layouts"],
      "cv_sections": ["navigation"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "Side navigation panel",
        "minimum_items": 4
      },
      "data_requirements": {
        "required": ["items"],
        "optional": ["open", "setOpen"],
        "cv_mapping": {
          "items": "cv_sections_with_icons"
        }
      },
      "adapter_profile": "side_navigation_panel",
      "complexity": "medium",
      "animation_type": "slide_reveal",
      "description": "Collapsible sidebar navigation",
      "usage_notes": "Alternative navigation layout for CVs."
    },
    "SignupForm": {
      "file": "signup-form",
      "category": "form",
      "visual_impact": 6,
      "best_for": ["user_registration", "contact_forms", "data_collection"],
      "cv_sections": [],
      "mvp_suitable": false,
      "mvp_exclusion_reason": "Not suitable for CV display",
      "data_requirements": {
        "required": ["handleSubmit"],
        "optional": ["className"]
      },
      "adapter_profile": "registration_form",
      "complexity": "medium",
      "animation_type": "form_transitions",
      "description": "Animated signup form component"
    },
    "Sparkles": {
      "file": "sparkles",
      "category": "effect",
      "visual_impact": 6,
      "best_for": ["subtle_effects", "highlights", "decorative_elements"],
      "cv_sections": ["achievements", "awards", "certifications", "any_section"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "Sparkle effect overlay",
        "minimum_items": 0
      },
      "data_requirements": {
        "required": ["children"],
        "optional": ["particleCount", "className"],
        "cv_mapping": {
          "no_data_needed": "Pure visual effect"
        }
      },
      "adapter_profile": "sparkle_overlay_effect",
      "complexity": "low",
      "animation_type": "particle_sparkle",
      "description": "Subtle sparkling particle effect",
      "usage_notes": "Light decorative effect for achievements."
    },
    "Spotlight": {
      "file": "spotlight",
      "category": "effect",
      "visual_impact": 8,
      "best_for": ["hero_sections", "emphasis", "dramatic_effects"],
      "cv_sections": ["hero", "summary", "achievements"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "Spotlight background effect",
        "minimum_items": 0
      },
      "data_requirements": {
        "required": ["children"],
        "optional": ["className", "fill"],
        "cv_mapping": {
          "no_data_needed": "Pure visual effect"
        }
      },
      "adapter_profile": "spotlight_background",
      "complexity": "medium",
      "animation_type": "light_movement",
      "description": "Moving spotlight background effect",
      "usage_notes": "Dramatic effect for hero sections."
    },
    "SpotlightNew": {
      "file": "spotlight-new",
      "category": "effect",
      "visual_impact": 8,
      "best_for": ["enhanced_spotlight", "premium_effects", "hero_emphasis"],
      "cv_sections": ["hero", "summary", "awards"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "Enhanced spotlight effect",
        "minimum_items": 0
      },
      "data_requirements": {
        "required": ["children"],
        "optional": ["className", "showGrid"],
        "cv_mapping": {
          "no_data_needed": "Pure visual effect"
        }
      },
      "adapter_profile": "enhanced_spotlight",
      "complexity": "medium",
      "animation_type": "advanced_light",
      "description": "Enhanced spotlight with grid effect",
      "usage_notes": "Premium spotlight effect for hero content."
    },
    "StarsBackground": {
      "file": "stars-background",
      "category": "background",
      "visual_impact": 6,
      "best_for": ["night_themes", "subtle_backgrounds", "space_themes"],
      "cv_sections": ["education", "certifications", "any_section"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "Static stars background",
        "minimum_items": 0
      },
      "data_requirements": {
        "required": ["children"],
        "optional": ["starCount", "twinkleProbability"],
        "cv_mapping": {
          "no_data_needed": "Pure visual effect"
        }
      },
      "adapter_profile": "starfield_background",
      "complexity": "low",
      "animation_type": "twinkle",
      "description": "Twinkling stars background",
      "usage_notes": "Subtle animated background option."
    },
    "StickyBanner": {
      "file": "sticky-banner",
      "category": "ui",
      "visual_impact": 6,
      "best_for": ["announcements", "cta_banners", "notifications"],
      "cv_sections": ["contact", "achievements"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "Sticky announcement banner",
        "minimum_items": 0
      },
      "data_requirements": {
        "required": ["text"],
        "optional": ["dismissible", "className"],
        "cv_mapping": {
          "text": "cta_or_announcement_text"
        }
      },
      "adapter_profile": "sticky_notification_banner",
      "complexity": "low",
      "animation_type": "slide_stick",
      "description": "Sticky banner for announcements",
      "usage_notes": "Use for important CTAs or notices."
    },
    "StickyScrollReveal": {
      "file": "sticky-scroll-reveal",
      "category": "scroll",
      "visual_impact": 9,
      "best_for": ["feature_showcases", "step_by_step", "product_tours"],
      "cv_sections": ["experience", "projects", "skills", "education", "achievements"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "image_replacement": "gradient_panels",
        "minimum_items": 2
      },
      "data_requirements": {
        "required": ["content"],
        "optional": ["contentClassName"],
        "cv_mapping": {
          "content": "experiences_or_projects_array"
        }
      },
      "adapter_profile": "sticky_content_reveal",
      "complexity": "high",
      "animation_type": "scroll_reveal",
      "description": "Content that reveals on scroll with sticky positioning",
      "usage_notes": "Powerful for showcasing experience progression."
    },
    "SvgMaskEffect": {
      "file": "svg-mask-effect",
      "category": "effect",
      "visual_impact": 8,
      "best_for": ["text_effects", "reveals", "creative_masks"],
      "cv_sections": ["hero", "summary", "achievements"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "SVG mask text effects",
        "minimum_items": 0
      },
      "data_requirements": {
        "required": ["children", "maskText"],
        "optional": ["className", "duration"],
        "cv_mapping": {
          "maskText": "name_or_title"
        }
      },
      "adapter_profile": "svg_text_mask",
      "complexity": "high",
      "animation_type": "mask_reveal",
      "description": "Text reveal using SVG masks",
      "usage_notes": "Creative text effect for names or titles."
    },
    "TailwindcssButtons": {
      "file": "tailwindcss-buttons",
      "category": "button",
      "visual_impact": 6,
      "best_for": ["button_collection", "various_ctas", "ui_elements"],
      "cv_sections": ["contact", "projects", "publications"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "Button variations",
        "minimum_items": 0
      },
      "data_requirements": {
        "required": ["variant", "children"],
        "optional": ["className", "onClick"],
        "cv_mapping": {
          "button_text": "cta_or_contact_text"
        }
      },
      "adapter_profile": "button_collection",
      "complexity": "low",
      "animation_type": "various",
      "description": "Collection of animated Tailwind buttons",
      "usage_notes": "Multiple button styles to choose from."
    },
    "TextGenerateEffect": {
      "file": "text-generate-effect",
      "category": "text",
      "visual_impact": 8,
      "best_for": ["text_reveals", "summaries", "introductions"],
      "cv_sections": ["summary", "hero", "achievements"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "Animated text generation",
        "minimum_items": 0
      },
      "data_requirements": {
        "required": ["words"],
        "optional": ["className", "duration"],
        "cv_mapping": {
          "words": "summary_text"
        }
      },
      "adapter_profile": "text_generation_animation",
      "complexity": "medium",
      "animation_type": "word_fade_in",
      "description": "Text that generates word by word with blur effect",
      "usage_notes": "Perfect for animating summary sections."
    },
    "TextHoverEffect": {
      "file": "text-hover-effect",
      "category": "text",
      "visual_impact": 6,
      "best_for": ["navigation_links", "menu_items", "interactive_text"],
      "cv_sections": ["navigation", "contact", "skills"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "Text hover animations",
        "minimum_items": 0
      },
      "data_requirements": {
        "required": ["text"],
        "optional": ["className", "automatic"],
        "cv_mapping": {
          "text": "navigation_or_header_text"
        }
      },
      "adapter_profile": "text_hover_animation",
      "complexity": "low",
      "animation_type": "text_transform",
      "description": "Text with hover transformation effects",
      "usage_notes": "Adds interactivity to navigation or headers."
    },
    "TextRevealCard": {
      "file": "text-reveal-card",
      "category": "card",
      "visual_impact": 8,
      "best_for": ["interactive_cards", "reveal_effects", "engaging_content"],
      "cv_sections": ["achievements", "summary", "awards", "certifications"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "Interactive text reveal",
        "minimum_items": 1
      },
      "data_requirements": {
        "required": ["text", "revealText"],
        "optional": ["children", "className"],
        "cv_mapping": {
          "text": "achievement_title",
          "revealText": "achievement_detail"
        }
      },
      "adapter_profile": "interactive_reveal_card",
      "complexity": "medium",
      "animation_type": "text_reveal",
      "description": "Card that reveals different text on interaction",
      "usage_notes": "Engaging way to show achievement details."
    },
    "Timeline": {
      "file": "timeline",
      "category": "content",
      "visual_impact": 7,
      "best_for": ["experience_history", "education_timeline", "career_progression"],
      "cv_sections": ["experience", "education", "volunteer", "certifications", "achievements"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "Chronological display",
        "minimum_items": 1
      },
      "data_requirements": {
        "required": ["data"],
        "optional": ["className"],
        "cv_mapping": {
          "title": "position_or_degree",
          "content": "description",
          "date": "dateRange"
        }
      },
      "adapter_profile": "vertical_timeline",
      "complexity": "medium",
      "animation_type": "scroll_reveal",
      "description": "Vertical timeline with animated reveals",
      "usage_notes": "Standard way to show chronological information."
    },
    "TracingBeam": {
      "file": "tracing-beam",
      "category": "effect",
      "visual_impact": 8,
      "best_for": ["content_flow", "reading_guides", "visual_connections"],
      "cv_sections": ["experience", "education", "projects", "volunteer"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "Content flow indicator",
        "minimum_items": 1
      },
      "data_requirements": {
        "required": ["children"],
        "optional": ["className"],
        "cv_mapping": {
          "content": "experience_or_education_items"
        }
      },
      "adapter_profile": "content_flow_beam",
      "complexity": "medium",
      "animation_type": "beam_trace",
      "description": "Animated beam that traces through content",
      "usage_notes": "Visual guide through experience sections."
    },
    "TypewriterEffect": {
      "file": "typewriter-effect",
      "category": "text",
      "visual_impact": 7,
      "best_for": ["hero_text", "titles", "dynamic_text"],
      "cv_sections": ["hero", "summary", "skills"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "Typing animation",
        "minimum_items": 0
      },
      "data_requirements": {
        "required": ["words"],
        "optional": ["className", "cursorClassName"],
        "cv_mapping": {
          "words": "professional_title_words"
        }
      },
      "adapter_profile": "typewriter_animation",
      "complexity": "low",
      "animation_type": "typing",
      "description": "Classic typewriter text animation",
      "usage_notes": "Engaging way to display professional title."
    },
    "Vortex": {
      "file": "vortex",
      "category": "background",
      "visual_impact": 9,
      "best_for": ["hero_backgrounds", "dramatic_effects", "immersive_sections"],
      "cv_sections": ["hero", "achievements", "awards"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "Particle vortex background",
        "minimum_items": 0
      },
      "data_requirements": {
        "required": ["children"],
        "optional": ["backgroundColor", "particleCount"],
        "cv_mapping": {
          "no_data_needed": "Pure visual effect"
        }
      },
      "adapter_profile": "vortex_particle_effect",
      "complexity": "high",
      "animation_type": "swirl_particles",
      "description": "Swirling particle vortex background",
      "usage_notes": "High-impact background for hero sections."
    },
    "WavyBackground": {
      "file": "wavy-background",
      "category": "background",
      "visual_impact": 8,
      "best_for": ["organic_backgrounds", "fluid_effects", "modern_design"],
      "cv_sections": ["hero", "summary", "skills", "any_section"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "Animated wave background",
        "minimum_items": 0
      },
      "data_requirements": {
        "required": ["children"],
        "optional": ["className", "colors"],
        "cv_mapping": {
          "no_data_needed": "Pure visual effect"
        }
      },
      "adapter_profile": "organic_wave_animation",
      "complexity": "medium",
      "animation_type": "wave_motion",
      "description": "Organic animated wave background",
      "usage_notes": "Smooth, modern background animation."
    },
    "WobbleCard": {
      "file": "wobble-card",
      "category": "card",
      "visual_impact": 7,
      "best_for": ["playful_cards", "skill_display", "interactive_content"],
      "cv_sections": ["skills", "hobbies", "languages", "certifications", "achievements"],
      "mvp_suitable": true,
      "mvp_adaptations": {
        "usage": "Interactive wobble cards",
        "minimum_items": 1
      },
      "data_requirements": {
        "required": ["children"],
        "optional": ["containerClassName", "className"],
        "cv_mapping": {
          "content": "skill_or_hobby_details"
        }
      },
      "adapter_profile": "wobble_interaction_card",
      "complexity": "medium",
      "animation_type": "wobble_tilt",
      "description": "Cards with wobble effect on hover",
      "usage_notes": "Adds playful interaction to skills or hobbies."
    },
    "WorldMap": {
      "file": "world-map",
      "category": "visualization",
      "visual_impact": 8,
      "best_for": ["location_display", "travel_experience", "global_reach"],
      "cv_sections": ["experience", "education", "languages"],
      "mvp_suitable": false,
      "mvp_exclusion_reason": "Requires location data and complex setup",
      "data_requirements": {
        "required": ["dots"],
        "optional": ["className", "dotColor"]
      },
      "adapter_profile": "world_map_visualization",
      "complexity": "high",
      "animation_type": "map_animation",
      "description": "Interactive world map with location markers"
    }
  }
}