import { CVData } from "@/types/cv";

// Define all possible component types
export type ComponentType = 
  | "3d-card"
  | "3d-marquee"
  | "3d-pin"
  | "animated-modal"
  | "animated-testimonials"
  | "animated-tooltip"
  | "apple-cards-carousel"
  | "aurora-background"
  | "background-beams"
  | "background-beams-with-collision"
  | "background-boxes"
  | "background-gradient"
  | "background-lines"
  | "bento-grid"
  | "canvas-reveal-effect"
  | "card-hover-effect"
  | "card-spotlight"
  | "card-stack"
  | "cards"
  | "carousel"
  | "floating-navbar"
  | "floating-dock"
  | "hover-effect-v2"
  | "meteors"
  | "timeline"
  | "code-block"
  | "colourful-text"
  | "compare"
  | "cover"
  | "container-scroll-animation"
  | "container-text-flip"
  | "direction-aware-hover"
  | "draggable-card"
  | "evervault-card"
  | "expandable-cards"
  | "feature-sections"
  | "file-upload"
  | "flip-words"
  | "glare-card"
  | "glowing-effect"
  | "glowing-stars"
  | "google-gemini-effect"
  | "background-gradient-animation"
  | "grid-and-dot-backgrounds"
  | "hero-highlight"
  | "hero-parallax"
  | "hero-sections"
  | "hover-border-gradient"
  | "images-slider"
  | "infinite-moving-cards"
  | "lamp"
  | "layout-grid"
  | "lens"
  | "link-preview"
  | "macbook-scroll"
  | "moving-border"
  | "multi-step-loader"
  | "navbar-menu"
  | "parallax-scroll"
  | "placeholders-and-vanish-input"
  | "pointer-highlight"
  | "resizable-navbar"
  | "shooting-stars"
  | "stars-background"
  | "sidebar"
  | "signup-form"
  | "sparkles"
  | "spotlight"
  | "spotlight-new"
  | "sticky-banner"
  | "sticky-scroll-reveal"
  | "svg-mask-effect"
  | "tabs";

// General adapter configuration
export interface GeneralAdapterConfig {
  cvData: CVData;
  componentType: ComponentType;
  variant?: string;
  size?: "small" | "medium" | "large" | "full";
  theme?: {
    style?: "professional" | "creative" | "minimal" | "bold" | "modern";
    colorScheme?: "light" | "dark" | "auto";
    accentColor?: string;
  };
  customPrompt?: string;
}

// Base interface for all adapted props
export interface BaseAdaptedProps {
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}

export class GeneralComponentAdapter {
  private config: GeneralAdapterConfig;
  
  constructor(config: GeneralAdapterConfig) {
    this.config = config;
  }

  // Main adapter method
  adapt(): BaseAdaptedProps {
    const baseProps = this.getBaseProps();
    const componentProps = this.getComponentSpecificProps();
    
    return {
      ...baseProps,
      ...componentProps,
    };
  }

  // Get base props that apply to most components
  private getBaseProps(): BaseAdaptedProps {
    const { size, theme } = this.config;
    
    return {
      className: this.buildClassName(),
      style: this.buildStyle(),
      "data-theme": theme?.style || "professional",
      "data-size": size || "medium",
    };
  }

  // Build className based on configuration
  private buildClassName(): string {
    const classes: string[] = [];
    const { size, theme } = this.config;

    // Size classes
    const sizeClasses = {
      small: "scale-75",
      medium: "",
      large: "scale-110",
      full: "w-full h-full",
    };
    if (size) classes.push(sizeClasses[size]);

    // Theme style classes
    const themeClasses = {
      professional: "border-gray-200 shadow-sm",
      creative: "border-gradient-to-r from-purple-500 to-pink-500",
      minimal: "border-transparent",
      bold: "border-2 border-black dark:border-white",
      modern: "border-zinc-800 shadow-2xl",
    };
    if (theme?.style) classes.push(themeClasses[theme.style]);

    // Color scheme
    if (theme?.colorScheme === "dark") {
      classes.push("dark");
    }

    return classes.join(" ");
  }

  // Build inline styles
  private buildStyle(): React.CSSProperties {
    const { theme } = this.config;
    const styles: React.CSSProperties = {};

    if (theme?.accentColor) {
      styles["--accent-color"] = theme.accentColor;
    }

    return styles;
  }

  // Get component-specific props based on type
  private getComponentSpecificProps(): BaseAdaptedProps {
    const { componentType, cvData } = this.config;

    switch (componentType) {
      case "3d-card":
        return this.adapt3DCard();
      case "3d-marquee":
        return this.adapt3DMarquee();
      case "3d-pin":
        return this.adapt3DPin();
      case "animated-modal":
        return this.adaptAnimatedModal();
      case "animated-testimonials":
        return this.adaptAnimatedTestimonials();
      case "animated-tooltip":
        return this.adaptAnimatedTooltip();
      case "apple-cards-carousel":
        return this.adaptAppleCardsCarousel();
      case "aurora-background":
        return this.adaptAuroraBackground();
      case "background-beams":
        return this.adaptBackgroundBeams();
      case "background-beams-with-collision":
        return this.adaptBackgroundBeamsWithCollision();
      case "background-boxes":
        return this.adaptBackgroundBoxes();
      case "background-gradient":
        return this.adaptBackgroundGradient();
      case "background-lines":
        return this.adaptBackgroundLines();
      case "bento-grid":
        return this.adaptBentoGrid();
      case "canvas-reveal-effect":
        return this.adaptCanvasRevealEffect();
      case "card-hover-effect":
        return this.adaptCardHoverEffect();
      case "card-spotlight":
        return this.adaptCardSpotlight();
      case "card-stack":
        return this.adaptCardStack();
      case "cards":
        return this.adaptCards();
      case "carousel":
        return this.adaptCarousel();
      case "floating-navbar":
        return this.adaptFloatingNavbar();
      case "hover-effect-v2":
        return this.adaptHoverEffectV2();
      case "meteors":
        return this.adaptMeteors();
      case "timeline":
        return this.adaptTimeline();
      case "colourful-text":
        return this.adaptColourfulText();
      case "compare":
        return this.adaptCompare();
      case "cover":
        return this.adaptCover();
      case "container-scroll-animation":
        return this.adaptContainerScrollAnimation();
      case "container-text-flip":
        return this.adaptContainerTextFlip();
      case "direction-aware-hover":
        return this.adaptDirectionAwareHover();
      case "draggable-card":
        return this.adaptDraggableCard();
      case "evervault-card":
        return this.adaptEvervaultCard();
      case "expandable-cards":
        return this.adaptExpandableCards();
      case "feature-sections":
        return this.adaptFeatureSections();
      case "glare-card":
        return this.adaptGlareCard();
      case "glowing-effect":
        return this.adaptGlowingEffect();
      case "google-gemini-effect":
        return this.adaptGoogleGeminiEffect();
      case "background-gradient-animation":
        return this.adaptBackgroundGradientAnimation();
      case "grid-and-dot-backgrounds":
        return this.adaptGridAndDotBackgrounds();
      case "hero-highlight":
        return this.adaptHeroHighlight();
      case "hero-parallax":
        return this.adaptHeroParallax();
      case "hero-sections":
        return this.adaptHeroSections();
      case "hover-border-gradient":
        return this.adaptHoverBorderGradient();
      case "images-slider":
        return this.adaptImagesSlider();
      case "infinite-moving-cards":
        return this.adaptInfiniteMovingCards();
      case "lamp":
        return this.adaptLamp();
      case "layout-grid":
        return this.adaptLayoutGrid();
      case "lens":
        return this.adaptLens();
      case "link-preview":
        return this.adaptLinkPreview();
      case "macbook-scroll":
        return this.adaptMacbookScroll();
      case "moving-border":
        return this.adaptMovingBorder();
      case "multi-step-loader":
        return this.adaptMultiStepLoader();
      case "navbar-menu":
        return this.adaptNavbarMenu();
      case "parallax-scroll":
        return this.adaptParallaxScroll();
      case "placeholders-and-vanish-input":
        return this.adaptPlaceholdersAndVanishInput();
      case "pointer-highlight":
        return this.adaptPointerHighlight();
      case "resizable-navbar":
        return this.adaptResizableNavbar();
      case "shooting-stars":
        return this.adaptShootingStars();
      case "stars-background":
        return this.adaptStarsBackground();
      case "sidebar":
        return this.adaptSidebar();
      case "signup-form":
        return this.adaptSignupForm();
      case "sparkles":
        return this.adaptSparkles();
      case "spotlight":
        return this.adaptSpotlight();
      case "spotlight-new":
        return this.adaptSpotlightNew();
      case "sticky-banner":
        return this.adaptStickyBanner();
      case "sticky-scroll-reveal":
        return this.adaptStickyScrollReveal();
      case "svg-mask-effect":
        return this.adaptSVGMaskEffect();
      case "tabs":
        return this.adaptTabs();
      default:
        return {};
    }
  }

  // Individual component adapters
  private adapt3DCard(): BaseAdaptedProps {
    const { cvData } = this.config;
    return {
      title: cvData.personalInfo.name,
      description: cvData.personalInfo.summary,
      image: cvData.personalInfo.avatar || "/placeholder.jpg",
      link: cvData.personalInfo.website || "#",
    };
  }

  private adapt3DMarquee(): BaseAdaptedProps {
    const { cvData } = this.config;
    const items = cvData.skills?.map(skill => ({
      text: skill.name,
      level: skill.level,
    })) || [];
    
    return {
      items,
      speed: this.config.size === "large" ? "slow" : "normal",
      pauseOnHover: true,
    };
  }

  private adapt3DPin(): BaseAdaptedProps {
    const { cvData } = this.config;
    return {
      title: cvData.personalInfo.title,
      href: cvData.personalInfo.website || "#",
      description: cvData.personalInfo.summary?.substring(0, 100) + "...",
    };
  }

  private adaptAnimatedModal(): BaseAdaptedProps {
    return {
      triggerText: "View Details",
      modalTitle: this.config.cvData.personalInfo.name,
      modalDescription: this.config.cvData.personalInfo.summary,
    };
  }

  private adaptAnimatedTestimonials(): BaseAdaptedProps {
    const { cvData } = this.config;
    const testimonials = cvData.achievements?.map((achievement, i) => ({
      quote: achievement.description,
      name: achievement.title,
      designation: achievement.date,
      src: `https://i.pravatar.cc/150?img=${i + 1}`,
    })) || [];

    return {
      testimonials,
      autoplay: true,
    };
  }

  private adaptAnimatedTooltip(): BaseAdaptedProps {
    const { cvData } = this.config;
    const items = cvData.skills?.slice(0, 5).map((skill, i) => ({
      id: i,
      name: skill.name,
      designation: skill.level,
      image: `https://i.pravatar.cc/150?img=${i + 10}`,
    })) || [];

    return {
      items,
    };
  }

  private adaptAppleCardsCarousel(): BaseAdaptedProps {
    const { cvData } = this.config;
    const cards = cvData.projects?.map((project, i) => ({
      category: project.technologies?.[0] || "Project",
      title: project.name,
      src: project.image || `https://source.unsplash.com/random/800x600?tech&${i}`,
      content: project.description,
    })) || [];

    return {
      cards,
      offset: this.config.size === "large" ? 15 : 10,
    };
  }

  private adaptAuroraBackground(): BaseAdaptedProps {
    const themeColors = {
      professional: ["#60a5fa", "#3b82f6"],
      creative: ["#c084fc", "#a855f7"],
      minimal: ["#9ca3af", "#6b7280"],
      bold: ["#f59e0b", "#dc2626"],
      modern: ["#10b981", "#14b8a6"],
    };

    return {
      colors: themeColors[this.config.theme?.style || "professional"],
      showRadialGradient: true,
    };
  }

  private adaptBackgroundBeams(): BaseAdaptedProps {
    return {
      className: this.config.size === "full" ? "absolute inset-0" : "",
    };
  }

  private adaptBackgroundBeamsWithCollision(): BaseAdaptedProps {
    return {
      className: this.config.size === "full" ? "absolute inset-0" : "",
      beamCount: this.config.size === "large" ? 10 : 5,
    };
  }

  private adaptBackgroundBoxes(): BaseAdaptedProps {
    return {
      className: this.config.size === "full" ? "absolute inset-0" : "",
      boxSize: this.config.size === "small" ? 20 : 40,
    };
  }

  private adaptBackgroundGradient(): BaseAdaptedProps {
    return {
      animate: true,
      gradientBackgroundStart: this.config.theme?.accentColor || "rgb(108, 0, 162)",
      gradientBackgroundEnd: "rgb(0, 17, 82)",
    };
  }

  private adaptBackgroundLines(): BaseAdaptedProps {
    return {
      className: this.config.size === "full" ? "absolute inset-0" : "",
      svgOptions: {
        duration: this.config.size === "large" ? 15 : 10,
      },
    };
  }

  private adaptBentoGrid(): BaseAdaptedProps {
    const { cvData } = this.config;
    const items = [
      {
        title: "Experience",
        description: `${cvData.experience?.length || 0} positions`,
        icon: "💼",
      },
      {
        title: "Projects",
        description: `${cvData.projects?.length || 0} projects`,
        icon: "🚀",
      },
      {
        title: "Skills",
        description: `${cvData.skills?.length || 0} skills`,
        icon: "🛠️",
      },
      {
        title: "Education",
        description: `${cvData.education?.length || 0} degrees`,
        icon: "🎓",
      },
    ];

    return {
      items,
      className: this.config.size === "large" ? "md:grid-cols-3" : "md:grid-cols-2",
    };
  }

  private adaptCanvasRevealEffect(): BaseAdaptedProps {
    const colorSchemes = {
      professional: [[0, 100, 200]],
      creative: [[255, 0, 255]],
      minimal: [[100, 100, 100]],
      bold: [[255, 100, 0]],
      modern: [[0, 255, 150]],
    };

    return {
      colors: colorSchemes[this.config.theme?.style || "professional"],
      animationSpeed: 0.4,
      opacities: [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
    };
  }

  private adaptCardHoverEffect(): BaseAdaptedProps {
    const { cvData } = this.config;
    const items = cvData.projects?.map(project => ({
      title: project.name,
      description: project.description,
      link: project.url || "#",
    })) || [];

    return {
      items,
      className: this.config.size === "large" ? "lg:grid-cols-4" : "lg:grid-cols-3",
    };
  }

  private adaptCardSpotlight(): BaseAdaptedProps {
    return {
      className: this.getSizeClasses(),
      radius: this.config.size === "large" ? 500 : 350,
      color: this.config.theme?.accentColor || "#262626",
    };
  }

  private adaptCardStack(): BaseAdaptedProps {
    const { cvData } = this.config;
    const items = cvData.achievements?.map((achievement, i) => ({
      id: i,
      name: achievement.title,
      designation: achievement.date,
      content: achievement.description,
    })) || [];

    return {
      items,
      offset: this.config.size === "large" ? 15 : 10,
      scaleFactor: 0.06,
    };
  }

  private adaptCards(): BaseAdaptedProps {
    const { cvData, variant } = this.config;
    
    if (variant === "feature") {
      return {
        title: cvData.personalInfo.name,
        description: cvData.personalInfo.summary,
      };
    } else if (variant === "overlay") {
      return {
        title: "My Journey",
        description: cvData.personalInfo.summary,
      };
    } else {
      return {
        title: cvData.personalInfo.name,
        description: cvData.personalInfo.title,
        authorImage: cvData.personalInfo.avatar,
      };
    }
  }

  private adaptCarousel(): BaseAdaptedProps {
    const { cvData, size } = this.config;
    const slides = cvData.projects?.map(project => ({
      title: project.name,
      button: "View Project",
      src: project.image || `https://source.unsplash.com/random/800x600?${encodeURIComponent(project.name)}`,
    })) || [];

    // Adjust size based on configuration
    const sizeClasses = {
      small: "w-[50vmin] h-[50vmin]",
      medium: "w-[70vmin] h-[70vmin]",
      large: "w-[90vmin] h-[90vmin]",
      full: "w-full h-[80vh]",
    };

    return {
      slides,
      className: sizeClasses[size || "medium"],
    };
  }

  private adaptFloatingNavbar(): BaseAdaptedProps {
    const { cvData } = this.config;
    const navItems = [
      { name: "Home", link: "/" },
      { name: "About", link: "/about" },
    ];

    if (cvData.projects?.length) {
      navItems.push({ name: "Projects", link: "/projects" });
    }
    if (cvData.experience?.length) {
      navItems.push({ name: "Experience", link: "/experience" });
    }
    navItems.push({ name: "Contact", link: "/contact" });

    return {
      navItems,
      className: "top-4",
    };
  }

  private adaptHoverEffectV2(): BaseAdaptedProps {
    const { cvData } = this.config;
    const items = cvData.skills?.map(skill => ({
      title: skill.name,
      description: `Proficiency: ${skill.level}`,
      link: "#",
    })) || [];

    return {
      items,
      className: this.config.size === "large" ? "lg:grid-cols-4" : "lg:grid-cols-3",
    };
  }

  private adaptMeteors(): BaseAdaptedProps {
    const meteorCounts = {
      small: 10,
      medium: 20,
      large: 30,
      full: 40,
    };

    return {
      number: meteorCounts[this.config.size || "medium"],
    };
  }

  private adaptTimeline(): BaseAdaptedProps {
    const { cvData } = this.config;
    const data = cvData.experience?.map(exp => ({
      title: exp.position,
      content: `${exp.company} - ${exp.startDate} to ${exp.endDate}. ${exp.description}`,
    })) || [];

    return {
      data,
    };
  }

  private adaptColourfulText(): BaseAdaptedProps {
    const { cvData, variant } = this.config;
    
    // Choose text based on variant or default to name
    let text = cvData.personalInfo.name;
    
    if (variant === "title") {
      text = cvData.personalInfo.title || cvData.personalInfo.name;
    } else if (variant === "skill" && cvData.skills?.length) {
      // Get the highest level skill
      const topSkill = cvData.skills.reduce((prev, current) => 
        (current.level > prev.level) ? current : prev
      );
      text = topSkill.name;
    } else if (variant === "achievement" && cvData.achievements?.length) {
      text = cvData.achievements[0].title;
    }

    return {
      text,
      className: this.config.size === "large" ? "text-6xl" : "text-4xl",
    };
  }

  private adaptCompare(): BaseAdaptedProps {
    const { cvData, variant } = this.config;
    
    // Default images - can be overridden by variant
    let firstImage = cvData.personalInfo.avatar || "https://images.unsplash.com/photo-1617854818583-09e7f077a156?w=600&h=400&fit=crop";
    let secondImage = "https://images.unsplash.com/photo-1617854818583-09e7f077a156?w=600&h=400&fit=crop&duotone=000000,ffffff";
    
    if (variant === "portfolio" && cvData.projects?.length >= 2) {
      // Compare two project images
      firstImage = cvData.projects[0].image || firstImage;
      secondImage = cvData.projects[1].image || secondImage;
    } else if (variant === "beforeAfter") {
      // Use avatar vs a stylized version
      firstImage = cvData.personalInfo.avatar || firstImage;
      secondImage = cvData.personalInfo.avatar || secondImage; // In real usage, this would be a processed version
    }

    const sizeClasses = {
      small: "h-[250px] w-[200px]",
      medium: "h-[400px] w-[600px]",
      large: "h-[500px] w-[800px]",
      full: "h-full w-full",
    };

    return {
      firstImage,
      secondImage,
      className: sizeClasses[this.config.size || "medium"],
      slideMode: this.config.variant === "drag" ? "drag" : "hover",
      autoplay: this.config.variant === "autoplay",
      autoplayDuration: 5000,
      showHandlebar: true,
    };
  }

  private adaptCover(): BaseAdaptedProps {
    const { cvData, variant } = this.config;
    
    let text = "amazing";
    if (variant === "name") {
      text = cvData.personalInfo.name.split(" ")[0].toLowerCase();
    } else if (variant === "title") {
      text = cvData.personalInfo.title?.split(" ")[0]?.toLowerCase() || "professional";
    } else if (variant === "skill" && cvData.skills?.length) {
      text = cvData.skills[0].name.toLowerCase();
    }
    
    return {
      children: text,
      className: this.config.size === "large" ? "text-6xl" : "text-4xl",
    };
  }

  private adaptContainerScrollAnimation(): BaseAdaptedProps {
    const { cvData } = this.config;
    
    // Use project image or fallback
    const imageUrl = cvData.projects?.[0]?.image || 
      "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=1400&h=720&fit=crop";
    
    return {
      titleComponent: {
        title: `Unleash the power of`,
        highlight: cvData.personalInfo.title || "Innovation",
      },
      imageUrl,
    };
  }

  private adaptContainerTextFlip(): BaseAdaptedProps {
    const { cvData } = this.config;
    
    // Create words from skills or default
    const words = cvData.skills?.slice(0, 4).map(skill => skill.name.toLowerCase()) || 
      ["innovative", "creative", "professional", "dedicated"];
    
    return {
      words,
      interval: this.config.size === "large" ? 4000 : 3000,
      animationDuration: 700,
    };
  }

  private adaptDirectionAwareHover(): BaseAdaptedProps {
    const { cvData } = this.config;
    
    const project = cvData.projects?.[0];
    
    return {
      imageUrl: project?.image || cvData.personalInfo.avatar || 
        "https://images.unsplash.com/photo-1663765970236-f2acfde22237?w=500&h=500&fit=crop",
      title: project?.name || cvData.personalInfo.name,
      subtitle: project?.technologies?.[0] || cvData.personalInfo.title || "Developer",
    };
  }

  private adaptDraggableCard(): BaseAdaptedProps {
    const { cvData } = this.config;
    
    return {
      imageUrl: cvData.personalInfo.avatar || 
        "https://images.unsplash.com/photo-1732310216648-603c0255c000?q=80&w=3540&auto=format&fit=crop",
      title: cvData.personalInfo.name,
      showTitle: true,
      containerClassName: "relative flex min-h-screen w-full items-center justify-center overflow-clip",
    };
  }

  private adaptEvervaultCard(): BaseAdaptedProps {
    const { cvData, variant } = this.config;
    
    let text = "hover";
    if (variant === "name") {
      text = cvData.personalInfo.name.split(" ")[0];
    } else if (variant === "title") {
      text = cvData.personalInfo.title?.split(" ")[0] || "professional";
    }
    
    return {
      text: text.toLowerCase(),
      className: "",
    };
  }

  private adaptExpandableCards(): BaseAdaptedProps {
    const { cvData, variant } = this.config;
    
    // Create cards from CV data
    const cards = cvData.projects?.slice(0, 6).map((project, index) => ({
      description: project.technologies?.[0] || "Project",
      title: project.name,
      src: project.image || `https://images.unsplash.com/photo-${1600 + index}0000000?w=400&h=300&fit=crop`,
      ctaText: "View",
      ctaLink: project.url || "#",
      content: () => project.description + (project.technologies ? ` Technologies: ${project.technologies.join(', ')}` : ''),
    })) || [];
    
    // Fallback cards if no projects
    if (cards.length === 0) {
      cards.push(
        {
          description: "Professional",
          title: cvData.personalInfo.name,
          src: cvData.personalInfo.avatar || "https://images.unsplash.com/photo-1600000000000?w=400&h=300&fit=crop",
          ctaText: "Learn More",
          ctaLink: "#",
          content: () => cvData.personalInfo.summary || "Professional summary",
        },
        {
          description: "Skills",
          title: "My Expertise", 
          src: "https://images.unsplash.com/photo-1600000000001?w=400&h=300&fit=crop",
          ctaText: "View Skills",
          ctaLink: "#",
          content: () => `Key skills: ${cvData.skills?.slice(0, 5).map(skill => skill.name).join(', ') || 'Various technologies'}`,
        }
      );
    }
    
    return {
      cards,
      className: this.config.size === "large" ? "max-w-6xl" : "max-w-4xl",
    };
  }

  private adaptFeatureSections(): BaseAdaptedProps {
    const { cvData, variant } = this.config;
    
    // Create features from CV data
    const features = [];
    
    if (variant === "bento") {
      // For bento layout, create complex features with skeletons
      features.push(
        {
          title: "Professional Experience",
          description: `${cvData.experience?.length || 0} years of experience across various companies and roles`,
          className: "col-span-1 lg:col-span-4 border-b lg:border-r dark:border-neutral-800",
        },
        {
          title: "Technical Skills",
          description: `Proficient in ${cvData.skills?.length || 0}+ technologies and tools`,
          className: "border-b col-span-1 lg:col-span-2 dark:border-neutral-800",
        },
        {
          title: "Project Portfolio",
          description: `Successfully delivered ${cvData.projects?.length || 0} projects using modern technologies`,
          className: "col-span-1 lg:col-span-3 lg:border-r dark:border-neutral-800",
        },
        {
          title: "Education & Certifications",
          description: `${cvData.education?.length || 0} degrees and continuous learning journey`,
          className: "col-span-1 lg:col-span-3 border-b lg:border-none",
        }
      );
    } else {
      // For simple and hover variants, create features from different CV sections
      if (cvData.skills?.length) {
        cvData.skills.slice(0, 8).forEach(skill => {
          features.push({
            title: skill.name,
            description: `${skill.level} proficiency in ${skill.name} with hands-on experience`,
            icon: "🛠️",
          });
        });
      }
      
      // Add experience features
      if (cvData.experience?.length) {
        cvData.experience.slice(0, 4).forEach(exp => {
          features.push({
            title: exp.position,
            description: `${exp.company} - ${exp.startDate} to ${exp.endDate}`,
            icon: "💼",
          });
        });
      }
      
      // Add project features
      if (cvData.projects?.length) {
        cvData.projects.slice(0, 4).forEach(project => {
          features.push({
            title: project.name,
            description: project.description || "Innovative project showcasing technical expertise",
            icon: "🚀",
          });
        });
      }
      
      // Fallback features if no CV data
      if (features.length === 0) {
        features.push(
          {
            title: "Professional Excellence",
            description: "Dedicated to delivering high-quality solutions and exceeding expectations",
            icon: "⭐",
          },
          {
            title: "Technical Innovation",
            description: "Passionate about leveraging cutting-edge technologies to solve complex problems",
            icon: "🔧",
          },
          {
            title: "Collaborative Leadership",
            description: "Strong team player with experience leading cross-functional initiatives",
            icon: "👥",
          },
          {
            title: "Continuous Learning",
            description: "Committed to staying current with industry trends and best practices",
            icon: "📚",
          }
        );
      }
    }
    
    return {
      features,
      title: variant === "bento" ? 
        `Meet ${cvData.personalInfo.name}` : 
        "Professional Expertise",
      subtitle: variant === "bento" ? 
        cvData.personalInfo.summary : 
        "Comprehensive skills and experience portfolio",
      className: this.config.size === "large" ? "max-w-8xl" : "max-w-7xl",
    };
  }

  private adaptGlareCard(): BaseAdaptedProps {
    const { cvData, variant } = this.config;
    
    // Return props without JSX content
    let title = cvData.personalInfo.name;
    let subtitle = cvData.personalInfo.title;
    
    if (variant === "project" && cvData.projects?.length) {
      const project = cvData.projects[0];
      title = project.name;
      subtitle = project.technologies?.[0] || "Technology";
    } else if (variant === "skill" && cvData.skills?.length) {
      const skill = cvData.skills[0];
      title = skill.name;
      subtitle = `Level: ${skill.level}`;
    } else if (variant === "achievement" && cvData.achievements?.length) {
      const achievement = cvData.achievements[0];
      title = achievement.title;
      subtitle = achievement.date;
    }
    
    return {
      title,
      subtitle,
      className: "flex flex-col items-center justify-center",
    };
  }

  private adaptGlowingEffect(): BaseAdaptedProps {
    const { variant, size } = this.config;
    
    // Adjust properties based on variant and size
    const sizeMultiplier = {
      small: 0.7,
      medium: 1,
      large: 1.3,
      full: 1.5,
    }[size || "medium"];
    
    const baseProps = {
      blur: 0,
      inactiveZone: 0.7,
      proximity: Math.round(64 * sizeMultiplier),
      spread: Math.round(40 * sizeMultiplier),
      glow: true,
      disabled: false,
      movementDuration: 2,
      borderWidth: Math.round(1 * sizeMultiplier),
    };
    
    if (variant === "enhanced") {
      return {
        ...baseProps,
        borderWidth: Math.round(3 * sizeMultiplier),
        spread: Math.round(80 * sizeMultiplier),
        inactiveZone: 0.01,
      };
    } else if (variant === "subtle") {
      return {
        ...baseProps,
        spread: Math.round(20 * sizeMultiplier),
        borderWidth: 1,
        inactiveZone: 0.9,
      };
    } else if (variant === "white") {
      return {
        ...baseProps,
        variant: "white" as const,
      };
    }
    
    return baseProps;
  }

  private adaptGoogleGeminiEffect(): BaseAdaptedProps {
    const { cvData } = this.config;
    
    let title = "Build with Aceternity UI";
    let description = "Scroll this component and see the bottom SVG come to life wow this works!";
    
    if (cvData.personalInfo) {
      title = cvData.personalInfo.name || title;
      description = cvData.personalInfo.summary || description;
    }
    
    return {
      title,
      description,
    };
  }

  private adaptBackgroundGradientAnimation(): BaseAdaptedProps {
    const { cvData } = this.config;
    
    // Default gradient colors
    let gradientBackgroundStart = "rgb(108, 0, 162)";
    let gradientBackgroundEnd = "rgb(0, 17, 82)";
    let firstColor = "18, 113, 255";
    let secondColor = "221, 74, 255";
    let thirdColor = "100, 220, 255";
    
    // Adapt colors based on theme or data context
    const { theme } = this.config;
    if (theme?.accentColor) {
      // Extract RGB values from theme colors if available
      firstColor = theme.accentColor;
    }
    
    // Content props for the overlay
    let contentTitle = "Welcome";
    let contentSubtitle = "";
    let contentType = "hero";
    
    if (cvData.personalInfo) {
      contentTitle = cvData.personalInfo.name || "Welcome";
      contentSubtitle = cvData.personalInfo.title || "";
      contentType = "hero";
    }
    
    return {
      gradientBackgroundStart,
      gradientBackgroundEnd,
      firstColor,
      secondColor,
      thirdColor,
      interactive: true,
      contentTitle,
      contentSubtitle,
      contentType,
    };
  }

  private adaptGridAndDotBackgrounds(): BaseAdaptedProps {
    const { cvData, variant } = this.config;
    
    // Choose pattern variant based on data type or explicit variant
    let patternVariant = "grid";
    if (variant === "dot") {
      patternVariant = "dot";
    } else if (variant === "small" || variant === "gridSmall") {
      patternVariant = "gridSmall";
    }
    
    // Content for overlay
    let title = cvData.personalInfo.name;
    let subtitle = cvData.personalInfo.title;
    
    return {
      variant: patternVariant,
      size: "default",
      title,
      subtitle,
      className: "h-96 w-full bg-black relative flex items-center justify-center",
    };
  }

  private adaptHeroHighlight(): BaseAdaptedProps {
    const { cvData } = this.config;
    
    // Generate content based on CV data
    const name = cvData.personalInfo.name;
    const title = cvData.personalInfo.title;
    const summary = cvData.personalInfo.summary;
    
    // Create highlight text segments based on CV data
    let highlightedText = title || "amazing professional";
    let mainText = `Hi, I'm ${name}. I'm a ${highlightedText}.`;
    
    if (summary) {
      mainText = summary;
    }
    
    return {
      containerClassName: this.config.size === "full" ? "h-screen" : "h-[40rem]",
      className: "text-center",
      content: {
        mainText,
        highlightedText,
      },
    };
  }

  private adaptHeroParallax(): BaseAdaptedProps {
    const { cvData } = this.config;
    
    // Generate products/projects from CV data
    const products = [];
    
    // Add projects as products
    if (cvData.projects && cvData.projects.length > 0) {
      products.push(...cvData.projects.map((project, index) => ({
        title: project.name,
        link: project.link || project.github || "#",
        thumbnail: project.image || `https://source.unsplash.com/random/600x400?tech&${index}`,
      })));
    }
    
    // Add work experience as products
    if (cvData.experience && cvData.experience.length > 0) {
      products.push(...cvData.experience.slice(0, 5).map((exp, index) => ({
        title: exp.company,
        link: exp.link || "#",
        thumbnail: exp.logo || `https://source.unsplash.com/random/600x400?company&${index}`,
      })));
    }
    
    // Add achievements as products
    if (cvData.achievements && cvData.achievements.length > 0) {
      products.push(...cvData.achievements.slice(0, 5).map((achievement, index) => ({
        title: achievement.title,
        link: achievement.link || "#",
        thumbnail: achievement.image || `https://source.unsplash.com/random/600x400?achievement&${index}`,
      })));
    }
    
    // Ensure we have at least 9 products for a good display
    while (products.length < 9) {
      products.push({
        title: `Portfolio Item ${products.length + 1}`,
        link: "#",
        thumbnail: `https://source.unsplash.com/random/600x400?portfolio&${products.length}`,
      });
    }
    
    return {
      products: products.slice(0, 15), // Max 15 products
      containerClassName: this.config.size === "full" ? undefined : "h-[600px] w-full relative overflow-hidden rounded-lg overflow-y-auto",
    };
  }

  private adaptHeroSections(): BaseAdaptedProps {
    const { cvData } = this.config;
    
    // The HeroSectionOne component has hardcoded content,
    // so we can only customize the container styling
    return {
      containerClassName: this.config.size === "full" 
        ? "relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center" 
        : "h-[600px] w-full relative overflow-hidden rounded-lg overflow-y-auto",
    };
  }

  private adaptHoverBorderGradient(): BaseAdaptedProps {
    const { cvData } = this.config;
    
    // Extract button/CTA text from CV data
    let buttonText = "Get Started";
    
    // Try to get a more relevant CTA based on CV data
    if (cvData.personalInfo?.name) {
      buttonText = `Contact ${cvData.personalInfo.name.split(' ')[0]}`;
    } else if (cvData.projects && cvData.projects.length > 0) {
      buttonText = "View Projects";
    } else if (cvData.personalInfo?.email) {
      buttonText = "Get In Touch";
    }
    
    // Determine element type based on context
    const elementType = this.config.variant === "link" ? "a" : "button";
    
    return {
      children: buttonText,
      containerClassName: "rounded-full",
      className: "dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2",
      as: elementType,
      duration: 1,
      clockwise: true,
    };
  }

  private adaptImagesSlider(): BaseAdaptedProps {
    const { cvData } = this.config;
    const images: string[] = [];
    
    // Extract images from projects
    if (cvData.projects && cvData.projects.length > 0) {
      cvData.projects.forEach((project) => {
        if (project.image) {
          images.push(project.image);
        }
      });
    }
    
    // Add placeholder images if not enough
    const placeholderImages = [
      "https://images.unsplash.com/photo-1485433592409-9018e83a1f0d?q=80&w=1814&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1483982258113-b72862e6cff6?q=80&w=3456&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1482189349482-3defd547e0e9?q=80&w=2848&auto=format&fit=crop",
    ];
    
    // Ensure we have at least 3 images
    while (images.length < 3) {
      images.push(placeholderImages[images.length % placeholderImages.length]);
    }
    
    // Generate content based on CV data
    let title = "Welcome to My Portfolio";
    let subtitle = "Discover my work";
    
    if (cvData.personalInfo?.name) {
      title = `${cvData.personalInfo.name}'s Portfolio`;
    }
    
    if (cvData.personalInfo?.title) {
      subtitle = cvData.personalInfo.title;
    }
    
    return {
      images: images.slice(0, 5), // Max 5 images
      autoplay: true,
      direction: "up",
      overlay: true,
      className: this.config.size === "full" ? "h-screen" : "h-96",
      content: {
        title,
        subtitle,
        ctaText: "View Projects",
      },
    };
  }

  private adaptInfiniteMovingCards(): BaseAdaptedProps {
    const { cvData } = this.config;
    const items: Array<{ quote: string; name: string; title: string }> = [];
    
    // Extract testimonials from achievements
    if (cvData.achievements && cvData.achievements.length > 0) {
      cvData.achievements.forEach((achievement) => {
        items.push({
          quote: achievement.description,
          name: achievement.title,
          title: achievement.date || "Achievement",
        });
      });
    }
    
    // Add work experience as testimonials
    if (cvData.experience && cvData.experience.length > 0) {
      cvData.experience.slice(0, 3).forEach((exp) => {
        items.push({
          quote: exp.description || `Experience at ${exp.company}`,
          name: exp.company,
          title: exp.position,
        });
      });
    }
    
    // Add default testimonials if not enough data
    const defaultTestimonials = [
      {
        quote: "Exceptional work quality and professional approach. Highly recommended for any project.",
        name: "Professional Reference",
        title: "Industry Expert",
      },
      {
        quote: "Demonstrates strong technical skills and excellent problem-solving abilities.",
        name: "Colleague",
        title: "Team Lead",
      },
      {
        quote: "Reliable, innovative, and always delivers on time. A pleasure to work with.",
        name: "Client",
        title: "Project Manager",
      },
    ];
    
    // Ensure we have at least 3 items
    while (items.length < 3) {
      items.push(defaultTestimonials[items.length % defaultTestimonials.length]);
    }
    
    return {
      items: items.slice(0, 6), // Max 6 items for smooth scrolling
      direction: "right",
      speed: "normal",
      pauseOnHover: true,
      className: this.config.size === "full" ? "" : "max-w-4xl",
    };
  }

  private adaptLamp(): BaseAdaptedProps {
    const { cvData, variant } = this.config;
    
    let title = "Build amazing";
    let subtitle = "experiences";
    
    if (variant === "hero" && cvData.personalInfo) {
      title = cvData.personalInfo.name || "Your Name";
      subtitle = cvData.personalInfo.title || "Your Title";
    } else if (variant === "projects" && cvData.projects?.length) {
      title = "Featured";
      subtitle = "Projects";
    } else if (variant === "skills" && cvData.skills?.length) {
      title = "Technical";
      subtitle = "Expertise";
    } else if (variant === "achievements" && cvData.achievements?.length) {
      title = "Notable";
      subtitle = "Achievements";
    }
    
    return {
      title,
      subtitle,
      className: "",
      containerClassName: this.config.size === "full" ? 
        "min-h-screen w-full relative overflow-hidden bg-slate-950 rounded-md" : 
        "h-96 w-full relative overflow-hidden bg-slate-950 rounded-lg",
    };
  }

  private adaptLayoutGrid(): BaseAdaptedProps {
    const { cvData, variant } = this.config;
    
    // Create cards from various CV data sources
    const cards: Array<{
      id: number;
      content: React.ReactElement | React.ReactNode | string;
      className: string;
      thumbnail: string;
    }> = [];
    
    if (variant === "projects" && cvData.projects?.length) {
      cvData.projects.slice(0, 4).forEach((project, index) => {
        cards.push({
          id: index + 1,
          content: `
            <div>
              <p className="font-bold md:text-4xl text-xl text-white">${project.title}</p>
              <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
                ${project.description}
              </p>
            </div>
          `,
          className: index % 2 === 0 ? "md:col-span-2" : "col-span-1",
          thumbnail: project.image || "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&h=400&fit=crop"
        });
      });
    } else if (variant === "portfolio" && cvData.projects?.length) {
      cvData.projects.slice(0, 4).forEach((project, index) => {
        cards.push({
          id: index + 1,
          content: `
            <div>
              <p className="font-bold text-lg md:text-2xl text-white">${project.title}</p>
              <p className="font-normal text-sm my-2 max-w-lg text-neutral-200">
                ${project.technologies?.join(", ") || "Technology showcase"}
              </p>
            </div>
          `,
          className: index % 2 === 0 ? "md:col-span-2" : "col-span-1",
          thumbnail: project.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop"
        });
      });
    } else if (variant === "products" && cvData.projects?.length) {
      cvData.projects.slice(0, 4).forEach((project, index) => {
        cards.push({
          id: index + 1,
          content: `
            <div>
              <p className="font-bold text-lg md:text-2xl text-white">${project.title}</p>
              <p className="font-normal text-sm my-2 max-w-lg text-neutral-200">
                ${project.description?.substring(0, 100) || "Project showcase"}
              </p>
            </div>
          `,
          className: index % 2 === 0 ? "md:col-span-2" : "col-span-1",
          thumbnail: project.image || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop"
        });
      });
    } else {
      // Default fallback cards
      const defaultCards = [
        {
          id: 1,
          content: `
            <div>
              <p className="font-bold md:text-4xl text-xl text-white">Featured Work</p>
              <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
                Showcasing innovative projects and creative solutions.
              </p>
            </div>
          `,
          className: "md:col-span-2",
          thumbnail: "https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=600&h=400&fit=crop"
        }
      ];
      cards.push(...defaultCards);
    }
    
    return {
      cards,
      className: "",
      containerClassName: this.config.size === "full" ? 
        "h-screen py-20 w-full" : 
        "h-96 w-full relative overflow-hidden rounded-lg",
    };
  }

  private adaptLens(): BaseAdaptedProps {
    const { cvData, variant, size } = this.config;
    
    let children = null;
    let zoomFactor = 1.5;
    let lensSize = 170;
    
    if (variant === "projects" && cvData.projects?.length) {
      const project = cvData.projects[0];
      children = (
        <img
          src={project.image || "https://images.unsplash.com/photo-1713869820987-519844949a8a?q=80&w=3500&auto=format&fit=crop"}
          alt={project.title}
          width={500}
          height={500}
          className="rounded-2xl"
        />
      );
      zoomFactor = 2.0;
    } else if (variant === "portfolio" && cvData.projects?.length) {
      const project = cvData.projects[0];
      children = (
        <div className="w-full relative rounded-3xl overflow-hidden max-w-md mx-auto bg-gradient-to-r from-[#1D2235] to-[#121318] p-8">
          <img
            src={project.image || "https://images.unsplash.com/photo-1713869820987-519844949a8a?q=80&w=3500&auto=format&fit=crop"}
            alt={project.title}
            width={500}
            height={500}
            className="rounded-2xl"
          />
          <div className="py-4 relative z-20">
            <h2 className="text-white text-2xl text-left font-bold">
              {project.title}
            </h2>
            <p className="text-neutral-200 text-left mt-4">
              {project.description?.substring(0, 100) || "Project showcase with lens effect"}
            </p>
          </div>
        </div>
      );
    } else {
      // Default lens content
      children = (
        <img
          src="https://images.unsplash.com/photo-1713869820987-519844949a8a?q=80&w=3500&auto=format&fit=crop"
          alt="Lens preview"
          width={500}
          height={500}
          className="rounded-2xl"
        />
      );
    }
    
    return {
      children,
      zoomFactor,
      lensSize,
      isStatic: variant === "static",
      className: "",
      containerClassName: size === "full" ? 
        "h-screen w-full relative overflow-hidden" : 
        "h-96 w-full relative overflow-hidden rounded-lg",
    };
  }

  private adaptLinkPreview(): BaseAdaptedProps {
    const { cvData, variant } = this.config;
    
    // For link preview, we typically just return configuration props
    // The actual implementation would be in the demo components
    let url = "https://nextjs.org";
    let className = "font-bold";
    
    if (variant === "portfolio" && cvData.personalInfo?.portfolio) {
      url = cvData.personalInfo.portfolio;
      className = "font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-500 to-pink-500";
    } else if (variant === "social" && cvData.personalInfo?.socialLinks) {
      const github = cvData.personalInfo.socialLinks.find(link => link.platform === "GitHub");
      if (github) {
        url = github.url;
        className = "font-bold text-blue-500";
      }
    }
    
    return {
      url,
      className,
      width: 200,
      height: 125,
      quality: 50,
      isStatic: false,
      containerClassName: "h-96 w-full relative overflow-hidden rounded-lg bg-background flex items-center justify-center",
    };
  }

  // Helper method to get size-specific classes
  private getSizeClasses(): string {
    const sizeMap = {
      small: "h-64 w-64",
      medium: "h-96 w-96",
      large: "h-[32rem] w-[32rem]",
      full: "h-full w-full",
    };
    return sizeMap[this.config.size || "medium"];
  }

  private adaptMacbookScroll(): BaseAdaptedProps {
    const { cvData, variant } = this.config;
    
    // Default image and title
    let src = "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2071&auto=format&fit=crop";
    let title = `${cvData.personalInfo.name}'s Portfolio`;
    
    // For portfolio showcase, show project images
    if (variant === "portfolio" && cvData.projects && cvData.projects.length > 0) {
      // Use the first project's image if available
      const firstProject = cvData.projects[0];
      if (firstProject.image) {
        src = firstProject.image;
      }
      title = `Featured: ${firstProject.title}`;
    }
    
    // For product demo variant
    else if (variant === "product" && cvData.projects && cvData.projects.length > 0) {
      // Find a project with a demo link
      const demoProject = cvData.projects.find(p => p.link) || cvData.projects[0];
      if (demoProject.image) {
        src = demoProject.image;
      }
      title = `Demo: ${demoProject.title}`;
    }
    
    // For hero variant, use personal branding
    else if (variant === "hero") {
      title = (
        <span>
          {cvData.personalInfo.name} <br /> {cvData.personalInfo.title}
        </span>
      );
    }
    
    return {
      src,
      title,
      showGradient: false,
      // Could add a badge component if needed
      badge: undefined,
    };
  }

  private adaptMovingBorder(): BaseAdaptedProps {
    const { cvData, variant } = this.config;
    
    // Default button text
    let children = "Get in Touch";
    let borderRadius = "1.75rem";
    let duration = 3000;
    let className = "bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800";
    
    // For CTA variant
    if (variant === "cta") {
      children = "View My Work";
      className = "bg-gradient-to-r from-blue-600 to-purple-600 text-white";
      duration = 2000;
    }
    
    // For action variant
    else if (variant === "action") {
      children = "Download CV";
      className = "bg-green-600 text-white";
      borderRadius = "1rem";
    }
    
    // For contact variant
    else if (variant === "contact") {
      children = `Contact ${cvData.personalInfo.name}`;
      className = "bg-blue-600 text-white";
    }
    
    return {
      children,
      borderRadius,
      duration,
      className,
    };
  }

  private adaptMultiStepLoader(): BaseAdaptedProps {
    const { cvData, variant } = this.config;
    
    // Default loading states for a general workflow
    let loadingStates = [
      { text: "Initializing..." },
      { text: "Loading data..." },
      { text: "Processing information..." },
      { text: "Finalizing..." },
      { text: "Complete!" }
    ];
    
    // For career progression variant
    if (variant === "career") {
      loadingStates = [
        { text: "Starting career journey" },
        { text: "Building foundational skills" },
        { text: "Gaining practical experience" },
        { text: "Taking on leadership roles" },
        { text: "Achieving professional goals" }
      ];
    }
    
    // For project development variant
    else if (variant === "project") {
      loadingStates = [
        { text: "Planning project scope" },
        { text: "Setting up development environment" },
        { text: "Implementing core features" },
        { text: "Testing and debugging" },
        { text: "Deploying to production" }
      ];
    }
    
    // For skill development variant
    else if (variant === "skills") {
      const skills = cvData.skills?.slice(0, 5) || [];
      if (skills.length > 0) {
        loadingStates = skills.map(skill => ({
          text: `Mastering ${skill.name}`
        }));
      }
    }
    
    return {
      loadingStates,
      loading: true,
      duration: 2000,
      loop: true,
    };
  }

  private adaptNavbarMenu(): BaseAdaptedProps {
    const { cvData, variant } = this.config;
    
    // Default navigation items
    let menuItems = [
      {
        item: "About",
        links: ["Profile", "Experience", "Skills", "Education"]
      },
      {
        item: "Work",
        links: ["Projects", "Experience", "Portfolio", "Achievements"]
      },
      {
        item: "Contact",
        links: ["Email", "LinkedIn", "GitHub", "Resume"]
      }
    ];
    
    // For portfolio variant
    if (variant === "portfolio") {
      menuItems = [
        {
          item: "Portfolio",
          links: ["Web Development", "Design", "Mobile Apps", "Other Projects"]
        },
        {
          item: "Services",
          links: ["Frontend Development", "Backend Development", "UI/UX Design", "Consulting"]
        },
        {
          item: "About",
          links: ["Bio", "Skills", "Experience", "Education"]
        }
      ];
    }
    
    // For business variant
    else if (variant === "business") {
      const skills = cvData.skills?.slice(0, 4) || [];
      if (skills.length > 0) {
        menuItems[1] = {
          item: "Services",
          links: skills.map(skill => skill.name)
        };
      }
      
      menuItems[0] = {
        item: "Company",
        links: ["About Us", "Team", "Mission", "Values"]
      };
    }
    
    return {
      menuItems,
      className: "max-w-2xl mx-auto",
    };
  }

  private adaptParallaxScroll(): BaseAdaptedProps {
    const { cvData, variant } = this.config;
    
    // Default placeholder images
    let images = [
      "https://images.unsplash.com/photo-1554080353-a576cf803bda?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
      "https://images.unsplash.com/photo-1505144808419-1957a94ca61e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3070&q=80",
      "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80",
      "https://images.unsplash.com/photo-1682686581854-5e71f58e7e3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80",
      "https://images.unsplash.com/photo-1510784722466-f2aa9c52fff6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80",
      "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80",
      "https://images.unsplash.com/photo-1439853949127-fa647821eba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2640&q=80",
      "https://images.unsplash.com/photo-1554080353-a576cf803bda?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
      "https://images.unsplash.com/photo-1505144808419-1957a94ca61e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3070&q=80"
    ];
    
    // For portfolio variant - use project images if available
    if (variant === "portfolio") {
      const projects = cvData.projects?.slice(0, 9) || [];
      if (projects.length > 0) {
        images = projects.map(project => 
          project.image || "https://images.unsplash.com/photo-1554080353-a576cf803bda?ixlib=rb-4.0.3"
        );
      }
    }
    
    // For gallery variant - use different placeholder images
    else if (variant === "gallery") {
      images = [
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1518309312274-390f880cbc14?ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3"
      ];
    }
    
    return {
      images,
      className: "h-[40rem] w-full",
    };
  }

  private adaptPlaceholdersAndVanishInput(): BaseAdaptedProps {
    const { cvData, variant } = this.config;
    
    // Default search placeholders
    let placeholders = [
      "Search for anything...",
      "What can I help you find?",
      "Try searching for something",
      "Enter your query here",
      "What are you looking for?"
    ];
    
    // For contact variant
    if (variant === "contact") {
      placeholders = [
        "How can we help you?",
        "Tell us about your project",
        "What services do you need?",
        "Describe your requirements",
        "Let's start a conversation"
      ];
    }
    
    // For portfolio variant
    else if (variant === "portfolio") {
      placeholders = [
        "Search my projects...",
        "Find a specific skill",
        "What would you like to know?",
        "Explore my work",
        "Ask about my experience"
      ];
    }
    
    // For professional variant
    else if (variant === "professional") {
      const skills = cvData.skills?.slice(0, 5) || [];
      if (skills.length > 0) {
        placeholders = skills.map(skill => `Ask about ${skill.name}`);
      } else {
        placeholders = [
          "What's your experience with React?",
          "Tell me about your projects",
          "What technologies do you use?",
          "How long have you been coding?",
          "What's your favorite framework?"
        ];
      }
    }
    
    return {
      placeholders,
      onChange: () => {},
      onSubmit: () => {},
    };
  }

  private adaptPointerHighlight(): BaseAdaptedProps {
    const { cvData, variant } = this.config;
    
    // Default highlight text
    let children = "collaborate";
    let rectangleClassName = "";
    let pointerClassName = "";
    let containerClassName = "";
    
    // For name variant
    if (variant === "name") {
      children = cvData.personalInfo.name.split(" ")[0];
      rectangleClassName = "bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700";
      pointerClassName = "text-blue-500";
    }
    
    // For title variant
    else if (variant === "title") {
      children = cvData.personalInfo.title || "professional";
      rectangleClassName = "bg-purple-100 dark:bg-purple-900 border-purple-300 dark:border-purple-700";
      pointerClassName = "text-purple-500";
    }
    
    // For skill variant
    else if (variant === "skill" && cvData.skills?.length) {
      children = cvData.skills[0].name;
      rectangleClassName = "bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700";
      pointerClassName = "text-green-500";
    }
    
    // For achievement variant
    else if (variant === "achievement" && cvData.achievements?.length) {
      children = cvData.achievements[0].title;
      rectangleClassName = "bg-yellow-100 dark:bg-yellow-900 border-yellow-300 dark:border-yellow-700";
      pointerClassName = "text-yellow-500";
    }
    
    // For company variant
    else if (variant === "company" && cvData.experience?.length) {
      children = cvData.experience[0].company;
      rectangleClassName = "bg-neutral-200 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600";
      pointerClassName = "text-neutral-500";
    }
    
    return {
      children,
      rectangleClassName,
      pointerClassName,
      containerClassName: containerClassName || "inline-block",
    };
  }

  private adaptResizableNavbar(): BaseAdaptedProps {
    const { cvData, variant } = this.config;
    
    // Default navigation items
    let navItems = [
      { name: "About", link: "#about" },
      { name: "Experience", link: "#experience" },
      { name: "Projects", link: "#projects" },
      { name: "Contact", link: "#contact" }
    ];
    
    // For portfolio variant - create nav items from CV sections
    if (variant === "portfolio") {
      navItems = [];
      
      // Always add about/home
      navItems.push({ name: "Home", link: "#home" });
      
      // Add experience if exists
      if (cvData.experience?.length) {
        navItems.push({ name: "Experience", link: "#experience" });
      }
      
      // Add projects if exists
      if (cvData.projects?.length) {
        navItems.push({ name: "Projects", link: "#projects" });
      }
      
      // Add skills if exists
      if (cvData.skills?.length) {
        navItems.push({ name: "Skills", link: "#skills" });
      }
      
      // Add education if exists
      if (cvData.education?.length) {
        navItems.push({ name: "Education", link: "#education" });
      }
      
      // Always add contact at the end
      navItems.push({ name: "Contact", link: "#contact" });
    }
    
    // For minimal variant
    else if (variant === "minimal") {
      navItems = [
        { name: "Work", link: "#work" },
        { name: "About", link: "#about" },
        { name: "Contact", link: "#contact" }
      ];
    }
    
    // For business variant
    else if (variant === "business") {
      navItems = [
        { name: "Services", link: "#services" },
        { name: "Portfolio", link: "#portfolio" },
        { name: "About", link: "#about" },
        { name: "Contact", link: "#contact" }
      ];
    }
    
    // Button variants based on theme
    let primaryButtonText = "Get in Touch";
    let secondaryButtonText = "Resume";
    
    if (cvData.personalInfo?.email) {
      primaryButtonText = "Contact Me";
    }
    
    return {
      navItems,
      primaryButtonText,
      secondaryButtonText,
      logoText: cvData.personalInfo?.name?.split(" ")[0] || "Portfolio",
      className: this.config.size === "full" ? "fixed top-0" : "sticky top-0",
    };
  }

  private adaptShootingStars(): BaseAdaptedProps {
    const { cvData, variant } = this.config;
    
    // Different speed/color variations based on variant or theme
    let starColor = "#9CA3AF";
    let trailColor = "#2F59AA";
    let minSpeed = 10;
    let maxSpeed = 30;
    
    if (variant === "fast") {
      minSpeed = 20;
      maxSpeed = 50;
    } else if (variant === "colorful") {
      starColor = "#FF00FF";
      trailColor = "#00FFFF";
    } else if (variant === "subtle") {
      starColor = "#6B7280";
      trailColor = "#1F2937";
      minSpeed = 5;
      maxSpeed = 15;
    }
    
    // Adjust based on theme
    if (this.config.theme?.style === "creative") {
      starColor = "#EC4899";
      trailColor = "#8B5CF6";
    } else if (this.config.theme?.style === "modern") {
      starColor = "#3B82F6";
      trailColor = "#10B981";
    }
    
    return {
      minSpeed,
      maxSpeed,
      minDelay: 1200,
      maxDelay: 4200,
      starColor,
      trailColor,
      className: "absolute inset-0 z-0",
    };
  }

  private adaptStarsBackground(): BaseAdaptedProps {
    const { cvData, variant } = this.config;
    
    // Different density and twinkle settings based on variant
    let starDensity = 0.00015;
    let allStarsTwinkle = true;
    let twinkleProbability = 0.7;
    let minTwinkleSpeed = 0.5;
    let maxTwinkleSpeed = 1;
    
    if (variant === "dense") {
      starDensity = 0.0005;
    } else if (variant === "sparse") {
      starDensity = 0.00005;
    } else if (variant === "static") {
      allStarsTwinkle = false;
      twinkleProbability = 0;
    } else if (variant === "slow-twinkle") {
      minTwinkleSpeed = 2;
      maxTwinkleSpeed = 4;
    }
    
    // Adjust based on theme
    if (this.config.theme?.style === "minimal") {
      starDensity = 0.00008;
      twinkleProbability = 0.3;
    } else if (this.config.theme?.style === "bold") {
      starDensity = 0.0003;
      twinkleProbability = 0.9;
    }
    
    return {
      starDensity,
      allStarsTwinkle,
      twinkleProbability,
      minTwinkleSpeed,
      maxTwinkleSpeed,
      className: "absolute inset-0 z-0",
    };
  }

  private adaptSidebar(): BaseAdaptedProps {
    const { cvData, variant } = this.config;
    
    // Build navigation links based on CV data
    const links = [];
    
    // Always add dashboard/home
    links.push({
      label: "Home",
      href: "#home",
      icon: "home"
    });
    
    // Add sections based on what data is available
    if (cvData.experience?.length > 0) {
      links.push({
        label: "Experience",
        href: "#experience",
        icon: "work"
      });
    }
    
    if (cvData.projects?.length > 0) {
      links.push({
        label: "Projects",
        href: "#projects",
        icon: "folder"
      });
    }
    
    if (cvData.skills?.length > 0) {
      links.push({
        label: "Skills",
        href: "#skills",
        icon: "star"
      });
    }
    
    if (cvData.education?.length > 0) {
      links.push({
        label: "Education",
        href: "#education",
        icon: "school"
      });
    }
    
    // Always add contact
    links.push({
      label: "Contact",
      href: "#contact",
      icon: "mail"
    });
    
    // Handle variants
    let animate = true;
    if (variant === "static") {
      animate = false;
    }
    
    return {
      animate,
      links,
      userName: cvData.personalInfo?.name || "User",
      userAvatar: cvData.personalInfo?.avatar || "/placeholder-avatar.png",
      logoText: cvData.personalInfo?.name?.split(" ")[0] || "Portfolio",
    };
  }

  private adaptSignupForm(): BaseAdaptedProps {
    const { cvData, variant } = this.config;
    
    // For CV data, we might use this for contact forms or application forms
    const formProps: any = {};
    
    if (variant === "contact") {
      // Pre-fill with CV owner's info for a contact form
      formProps.defaultValues = {
        recipientName: cvData.personalInfo?.name || "Professional",
        recipientEmail: cvData.personalInfo?.email || "",
      };
    } else if (variant === "application") {
      // Pre-fill with applicant's info
      formProps.defaultValues = {
        firstname: cvData.personalInfo?.name?.split(" ")[0] || "",
        lastname: cvData.personalInfo?.name?.split(" ")[1] || "",
        email: cvData.personalInfo?.email || "",
      };
    }
    
    // Custom form title based on variant
    if (variant === "contact") {
      formProps.title = `Contact ${cvData.personalInfo?.name || "Me"}`;
      formProps.subtitle = "Send a message and I'll get back to you soon";
    } else if (variant === "newsletter") {
      formProps.title = "Subscribe to Newsletter";
      formProps.subtitle = "Get updates on my latest projects and posts";
    }
    
    return {
      ...formProps,
      className: "shadow-xl",
    };
  }

  private adaptSparkles(): BaseAdaptedProps {
    const { cvData, variant } = this.config;
    
    // Different sparkle settings based on variant
    let particleColor = "#FFFFFF";
    let particleDensity = 120;
    let minSize = 0.6;
    let maxSize = 1.4;
    let speed = 4;
    let background = "transparent";
    
    if (variant === "hero") {
      // Hero section with prominent sparkles
      particleDensity = 200;
      minSize = 0.4;
      maxSize = 1;
      speed = 2;
    } else if (variant === "subtle") {
      // Subtle background sparkles
      particleDensity = 50;
      minSize = 0.3;
      maxSize = 0.8;
      speed = 1;
      particleColor = "#999999";
    } else if (variant === "colorful") {
      // Colorful sparkles based on theme
      particleColor = this.config.theme?.accentColor || "#00D9FF";
      particleDensity = 150;
      speed = 3;
    } else if (variant === "dense") {
      // Dense sparkle field
      particleDensity = 500;
      minSize = 0.2;
      maxSize = 1;
      speed = 6;
    } else if (variant === "achievement") {
      // For highlighting achievements
      particleColor = "#FFD700"; // Gold
      particleDensity = 100;
      minSize = 0.8;
      maxSize = 1.5;
      speed = 2;
    }
    
    // Adjust based on theme
    if (this.config.theme?.style === "creative") {
      particleColor = "#E879F9"; // Purple
      speed = 3;
    } else if (this.config.theme?.style === "minimal") {
      particleDensity = 30;
      particleColor = "#000000";
      background = "transparent";
    } else if (this.config.theme?.style === "modern") {
      particleColor = "#00D9FF"; // Cyan
      background = "transparent";
    }
    
    return {
      background,
      minSize,
      maxSize,
      speed,
      particleColor,
      particleDensity,
      className: "absolute inset-0",
    };
  }

  private adaptSpotlight(): BaseAdaptedProps {
    const { cvData, variant, theme } = this.config;
    
    // Position variations based on variant
    let className = "-top-40 left-0 md:left-60 md:-top-20";
    let fill = "white";
    
    if (variant === "right") {
      className = "-top-40 right-0 md:right-60 md:-top-20";
    } else if (variant === "center") {
      className = "-top-60 left-1/2 -translate-x-1/2";
    } else if (variant === "bottom-left") {
      className = "-bottom-40 left-0 md:left-60 md:-bottom-20";
    } else if (variant === "bottom-right") {
      className = "-bottom-40 right-0 md:right-60 md:-bottom-20";
    }
    
    // Color variations based on theme
    if (theme?.style === "professional") {
      fill = "blue";
    } else if (theme?.style === "creative") {
      fill = "purple";
    } else if (theme?.style === "minimal") {
      fill = "gray";
    } else if (theme?.style === "bold") {
      fill = "red";
    } else if (theme?.style === "modern") {
      fill = "cyan";
    }
    
    // Use accent color if provided
    if (theme?.accentColor) {
      fill = theme.accentColor;
    }
    
    return {
      className,
      fill,
    };
  }

  private adaptSpotlightNew(): BaseAdaptedProps {
    const { cvData, variant, theme } = this.config;
    
    // Base hue for color variations
    let hue = 210; // Default blue
    let opacity1 = 0.08;
    let opacity2 = 0.06;
    let opacity3 = 0.04;
    
    // Color variations based on theme
    if (theme?.style === "professional") {
      hue = 210; // Blue
    } else if (theme?.style === "creative") {
      hue = 280; // Purple
    } else if (theme?.style === "minimal") {
      hue = 0; // Gray (will use different approach)
      opacity1 = 0.04;
      opacity2 = 0.03;
      opacity3 = 0.02;
    } else if (theme?.style === "bold") {
      hue = 0; // Red
      opacity1 = 0.12;
      opacity2 = 0.08;
      opacity3 = 0.06;
    } else if (theme?.style === "modern") {
      hue = 180; // Cyan
    }
    
    // Generate gradients based on hue
    const gradientFirst = hue === 0 && theme?.style === "minimal" 
      ? `radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(0, 0%, 85%, ${opacity1}) 0, hsla(0, 0%, 55%, ${opacity1 * 0.25}) 50%, hsla(0, 0%, 45%, 0) 80%)`
      : `radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(${hue}, 100%, 85%, ${opacity1}) 0, hsla(${hue}, 100%, 55%, ${opacity1 * 0.25}) 50%, hsla(${hue}, 100%, 45%, 0) 80%)`;
    
    const gradientSecond = hue === 0 && theme?.style === "minimal"
      ? `radial-gradient(50% 50% at 50% 50%, hsla(0, 0%, 85%, ${opacity2}) 0, hsla(0, 0%, 55%, ${opacity2 * 0.33}) 80%, transparent 100%)`
      : `radial-gradient(50% 50% at 50% 50%, hsla(${hue}, 100%, 85%, ${opacity2}) 0, hsla(${hue}, 100%, 55%, ${opacity2 * 0.33}) 80%, transparent 100%)`;
    
    const gradientThird = hue === 0 && theme?.style === "minimal"
      ? `radial-gradient(50% 50% at 50% 50%, hsla(0, 0%, 85%, ${opacity3}) 0, hsla(0, 0%, 45%, ${opacity3 * 0.5}) 80%, transparent 100%)`
      : `radial-gradient(50% 50% at 50% 50%, hsla(${hue}, 100%, 85%, ${opacity3}) 0, hsla(${hue}, 100%, 45%, ${opacity3 * 0.5}) 80%, transparent 100%)`;
    
    // Animation variations based on variant
    let duration = 7;
    let xOffset = 100;
    let translateY = -350;
    let width = 560;
    let smallWidth = 240;
    
    if (variant === "fast") {
      duration = 3;
      xOffset = 200;
    } else if (variant === "slow") {
      duration = 12;
      xOffset = 50;
    } else if (variant === "large") {
      width = 800;
      smallWidth = 350;
      translateY = -250;
    } else if (variant === "subtle") {
      duration = 10;
      xOffset = 60;
      opacity1 *= 0.5;
      opacity2 *= 0.5;
      opacity3 *= 0.5;
    }
    
    return {
      gradientFirst,
      gradientSecond,
      gradientThird,
      translateY,
      width,
      height: 1380,
      smallWidth,
      duration,
      xOffset,
    };
  }

  private adaptStickyBanner(): BaseAdaptedProps {
    const { cvData, variant, theme } = this.config;
    
    // Base styling
    let className = "bg-gradient-to-b from-blue-500 to-blue-600";
    let hideOnScroll = false;
    let children = "";
    
    // Generate content based on CV data
    if (cvData.personalInfo?.lookingFor) {
      children = `💼 Currently seeking: ${cvData.personalInfo.lookingFor}`;
    } else if (cvData.personalInfo?.title) {
      children = `👋 ${cvData.personalInfo.name} - ${cvData.personalInfo.title}`;
    } else if (cvData.skills?.length) {
      const topSkill = cvData.skills[0];
      children = `🚀 Specialized in ${topSkill.name || topSkill}`;
    } else {
      children = `Welcome to ${cvData.personalInfo?.name || "My"} Portfolio`;
    }
    
    // Theme-based styling
    if (theme?.style === "professional") {
      className = "bg-gradient-to-b from-blue-500 to-blue-600";
    } else if (theme?.style === "creative") {
      className = "bg-gradient-to-b from-purple-500 to-purple-600";
    } else if (theme?.style === "minimal") {
      className = "bg-gray-800 dark:bg-gray-900";
    } else if (theme?.style === "bold") {
      className = "bg-gradient-to-b from-red-500 to-red-600";
    } else if (theme?.style === "modern") {
      className = "bg-gradient-to-b from-cyan-500 to-cyan-600";
    }
    
    // Variant-based behavior
    if (variant === "announcement") {
      // For announcements, use accent color if available
      if (theme?.accentColor) {
        className = `bg-gradient-to-b from-${theme.accentColor}-500 to-${theme.accentColor}-600`;
      }
      hideOnScroll = false;
    } else if (variant === "notification") {
      className = "bg-gradient-to-b from-gray-800 to-gray-900";
      hideOnScroll = true;
    } else if (variant === "warning") {
      className = "bg-gradient-to-b from-yellow-500 to-yellow-600";
      children = `⚠️ ${children}`;
      hideOnScroll = false;
    } else if (variant === "success") {
      className = "bg-gradient-to-b from-green-500 to-green-600";
      children = `✅ ${children}`;
      hideOnScroll = true;
    }
    
    // Add link if contact info available
    if (cvData.personalInfo?.email) {
      children = (
        <p className="mx-0 max-w-[90%] text-white drop-shadow-md">
          {children}{" "}
          <a href={`mailto:${cvData.personalInfo.email}`} className="transition duration-200 hover:underline">
            Contact me
          </a>
        </p>
      );
    } else {
      children = (
        <p className="mx-0 max-w-[90%] text-white drop-shadow-md">
          {children}
        </p>
      );
    }
    
    return {
      className,
      hideOnScroll,
      children,
    };
  }

  private adaptStickyScrollReveal(): BaseAdaptedProps {
    const { cvData, variant, theme } = this.config;
    
    let content = [];
    let contentClassName = "";
    
    // Generate content based on variant and CV data
    if (variant === "skills" && cvData.skills?.length) {
      // Show top skills with descriptions
      content = cvData.skills.slice(0, 4).map((skill, index) => {
        const skillName = typeof skill === "string" ? skill : skill.name;
        const skillLevel = typeof skill === "object" ? skill.level : null;
        const gradients = [
          "bg-gradient-to-br from-cyan-500 to-emerald-500",
          "bg-gradient-to-br from-purple-500 to-pink-500",
          "bg-gradient-to-br from-orange-500 to-red-500",
          "bg-gradient-to-br from-blue-500 to-indigo-500"
        ];
        
        return {
          title: skillName,
          description: `Proficient in ${skillName}${skillLevel ? ` with ${skillLevel} expertise` : ""}. This skill has been instrumental in delivering high-quality solutions and driving project success.`,
          content: (
            <div className={`flex h-full w-full items-center justify-center ${gradients[index % gradients.length]} text-white`}>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{skillName}</div>
                {skillLevel && <div className="text-sm opacity-80">{skillLevel}</div>}
              </div>
            </div>
          )
        };
      });
    } else if (variant === "experience" && cvData.experience?.length) {
      // Show work experience
      content = cvData.experience.slice(0, 4).map((job, index) => {
        const colors = ["cyan", "purple", "orange", "blue"];
        const color = colors[index % colors.length];
        
        return {
          title: job.position || job.title,
          description: job.description || `${job.position} at ${job.company}. ${job.responsibilities?.[0] || ""}`,
          content: (
            <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-${color}-500 to-${color}-600 text-white`}>
              <div className="text-center px-4">
                <div className="text-2xl font-bold mb-1">{job.company}</div>
                <div className="text-sm opacity-80">{job.startDate} - {job.endDate || "Present"}</div>
              </div>
            </div>
          )
        };
      });
    } else if (variant === "projects" && cvData.projects?.length) {
      // Show projects
      content = cvData.projects.slice(0, 4).map((project, index) => {
        const icons = ["🚀", "💡", "🎯", "⚡"];
        
        return {
          title: project.name,
          description: project.description || "An innovative project showcasing technical expertise and creative problem-solving.",
          content: (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
              <div className="text-center">
                <div className="text-6xl mb-2">{icons[index % icons.length]}</div>
                <div className="text-sm px-4">{project.technologies?.join(", ") || "Modern Stack"}</div>
              </div>
            </div>
          )
        };
      });
    } else {
      // Default content showcasing general info
      content = [
        {
          title: "About Me",
          description: cvData.personalInfo?.summary || "Passionate professional dedicated to delivering exceptional results and continuous learning.",
          content: (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-500 to-emerald-500 text-white">
              <div className="text-6xl">👋</div>
            </div>
          )
        },
        {
          title: "My Expertise",
          description: `Skilled in ${cvData.skills?.slice(0, 3).map(s => typeof s === "string" ? s : s.name).join(", ") || "various technologies"}`,
          content: (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              <div className="text-6xl">💻</div>
            </div>
          )
        },
        {
          title: "Let's Connect",
          description: `Reach out at ${cvData.personalInfo?.email || "via contact form"} to discuss opportunities and collaborations.`,
          content: (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-500 to-red-500 text-white">
              <div className="text-6xl">📧</div>
            </div>
          )
        }
      ];
    }
    
    // Theme-based styling for content container
    if (theme?.style === "minimal") {
      contentClassName = "rounded-lg border border-gray-800";
    } else if (theme?.style === "modern") {
      contentClassName = "rounded-xl shadow-2xl";
    } else if (theme?.style === "creative") {
      contentClassName = "rounded-2xl backdrop-blur-md bg-white/10";
    }
    
    return {
      content,
      contentClassName,
    };
  }

  private adaptSVGMaskEffect(): BaseAdaptedProps {
    const { cvData, variant, theme, size } = this.config;
    
    let children;
    let revealText;
    let maskSize = 10;
    let revealSize = 600;
    let className = "h-[40rem] rounded-md border";
    
    // Adjust sizes based on config
    if (size === "small") {
      maskSize = 5;
      revealSize = 400;
      className = "h-[30rem] rounded-md border";
    } else if (size === "large") {
      maskSize = 30;
      revealSize = 800;
      className = "h-[50rem] rounded-lg border";
    } else if (size === "full") {
      maskSize = 50;
      revealSize = 1000;
      className = "h-screen rounded-xl border";
    }
    
    // Generate content based on variant
    if (variant === "hero") {
      children = (
        <div className="text-white">
          <h2 className="text-3xl font-bold mb-2">✨ Discover My Journey</h2>
          <p className="text-lg opacity-80">Move your cursor to explore</p>
        </div>
      );
      
      revealText = (
        <div className="text-center space-y-6">
          <h1 className="text-6xl font-bold text-slate-800">
            {cvData.personalInfo?.name || "Welcome"}
          </h1>
          <p className="text-2xl text-gray-600 max-w-2xl mx-auto">
            {cvData.personalInfo?.title || cvData.personalInfo?.summary || "Passionate Professional"}
          </p>
          {cvData.personalInfo?.email && (
            <button className="px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg">
              Get In Touch
            </button>
          )}
        </div>
      );
    } else if (variant === "skills") {
      const topSkills = cvData.skills?.slice(0, 5).map(s => typeof s === "string" ? s : s.name) || [];
      
      children = (
        <div className="text-white text-center">
          <h2 className="text-4xl font-bold mb-4">💡 Core Expertise</h2>
          <p className="text-xl opacity-80">Hover to reveal my skills</p>
        </div>
      );
      
      revealText = (
        <div className="text-center space-y-8">
          <h2 className="text-5xl font-bold text-slate-800 mb-8">Technical Skills</h2>
          <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
            {topSkills.map((skill, index) => (
              <div
                key={index}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-lg font-medium transform hover:scale-110 transition-transform"
              >
                {skill}
              </div>
            ))}
          </div>
        </div>
      );
    } else if (variant === "contact") {
      children = (
        <div className="text-white text-center">
          <h2 className="text-3xl font-bold mb-2">📬 Let's Connect</h2>
          <p className="text-lg opacity-80">Hover to see contact details</p>
        </div>
      );
      
      revealText = (
        <div className="text-center space-y-6">
          <h2 className="text-5xl font-bold text-slate-800 mb-4">Get In Touch</h2>
          {cvData.personalInfo?.email && (
            <p className="text-2xl text-gray-700 mb-4">{cvData.personalInfo.email}</p>
          )}
          {cvData.personalInfo?.phone && (
            <p className="text-xl text-gray-600 mb-4">{cvData.personalInfo.phone}</p>
          )}
          {cvData.personalInfo?.location && (
            <p className="text-lg text-gray-500">{cvData.personalInfo.location}</p>
          )}
          <div className="flex justify-center gap-4 mt-8">
            {cvData.personalInfo?.linkedin && (
              <a href={cvData.personalInfo.linkedin} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                LinkedIn
              </a>
            )}
            {cvData.personalInfo?.github && (
              <a href={cvData.personalInfo.github} className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors">
                GitHub
              </a>
            )}
          </div>
        </div>
      );
    } else {
      // Default variant
      children = (
        <div className="text-white">
          <h2 className="text-4xl font-bold mb-2">🎯 Explore</h2>
          <p className="text-xl">Move your cursor around</p>
        </div>
      );
      
      revealText = (
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-slate-800">
            {cvData.personalInfo?.name || "Professional Profile"}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {cvData.personalInfo?.summary || "Dedicated to excellence and innovation"}
          </p>
        </div>
      );
    }
    
    // Apply theme styling
    if (theme?.style === "minimal") {
      className = className.replace("border", "border border-gray-300");
    } else if (theme?.style === "modern") {
      className = className.replace("rounded-md", "rounded-2xl").replace("border", "border-2 border-gray-800");
    } else if (theme?.style === "creative") {
      className = className.replace("border", "border-4 border-gradient-to-r from-blue-500 to-purple-500");
    }
    
    return {
      children,
      revealText,
      size: maskSize,
      revealSize,
      className,
    };
  }

  private adaptTabs(): BaseAdaptedProps {
    const { cvData, variant, theme } = this.config;
    
    let tabs = [];
    let containerClassName = "";
    let activeTabClassName = "";
    let tabClassName = "";
    let contentClassName = "";
    
    // Generate tabs based on variant and CV data
    if (variant === "skills" && cvData.skills?.length) {
      // Skills tabs
      tabs = cvData.skills.slice(0, 5).map((skill, index) => {
        const skillName = typeof skill === "string" ? skill : skill.name;
        const skillLevel = typeof skill === "object" ? skill.level : null;
        const colors = [
          "from-purple-700 to-violet-900",
          "from-blue-700 to-cyan-900",
          "from-green-700 to-emerald-900",
          "from-orange-700 to-red-900",
          "from-pink-700 to-rose-900"
        ];
        
        return {
          title: skillName,
          value: `skill-${index}`,
          content: (
            <div className={`w-full h-full rounded-2xl p-10 bg-gradient-to-br ${colors[index % colors.length]}`}>
              <p className="text-3xl font-bold text-white mb-4">{skillName}</p>
              {skillLevel && <p className="text-xl text-white/80 mb-6">Level: {skillLevel}</p>}
              <p className="text-white/70">
                Proficient in {skillName} with extensive experience in real-world applications 
                and projects. This skill has been instrumental in delivering high-quality solutions.
              </p>
            </div>
          )
        };
      });
    } else if (variant === "experience" && cvData.experience?.length) {
      // Experience tabs
      tabs = cvData.experience.slice(0, 4).map((job, index) => {
        return {
          title: job.company,
          value: `exp-${index}`,
          content: (
            <div className="w-full h-full rounded-2xl p-10 bg-gradient-to-br from-indigo-700 to-purple-900">
              <p className="text-3xl font-bold text-white mb-2">{job.position || job.title}</p>
              <p className="text-lg text-white/80 mb-4">{job.company}</p>
              <p className="text-sm text-white/60 mb-6">{job.startDate} - {job.endDate || "Present"}</p>
              <p className="text-white/80">
                {job.description || job.responsibilities?.[0] || "Key contributor in various projects and initiatives."}
              </p>
            </div>
          )
        };
      });
    } else if (variant === "projects" && cvData.projects?.length) {
      // Projects tabs
      tabs = cvData.projects.slice(0, 4).map((project, index) => {
        return {
          title: project.name,
          value: `project-${index}`,
          content: (
            <div className="w-full h-full rounded-2xl p-10 bg-gradient-to-br from-teal-700 to-blue-900">
              <p className="text-3xl font-bold text-white mb-4">{project.name}</p>
              <p className="text-white/80 mb-6">{project.description}</p>
              {project.technologies && (
                <div className="flex flex-wrap gap-2">
                  {project.technologies.slice(0, 5).map((tech, i) => (
                    <span key={i} className="px-3 py-1 bg-white/20 rounded-full text-sm text-white">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )
        };
      });
    } else {
      // Default tabs
      tabs = [
        {
          title: "About",
          value: "about",
          content: (
            <div className="w-full h-full rounded-2xl p-10 bg-gradient-to-br from-purple-700 to-violet-900">
              <p className="text-3xl font-bold text-white mb-4">About Me</p>
              <p className="text-white/80">
                {cvData.personalInfo?.summary || "Passionate professional dedicated to excellence and continuous learning."}
              </p>
            </div>
          )
        },
        {
          title: "Skills",
          value: "skills",
          content: (
            <div className="w-full h-full rounded-2xl p-10 bg-gradient-to-br from-blue-700 to-cyan-900">
              <p className="text-3xl font-bold text-white mb-4">Core Skills</p>
              <div className="flex flex-wrap gap-3">
                {(cvData.skills?.slice(0, 6) || ["JavaScript", "React", "Node.js"]).map((skill, i) => (
                  <span key={i} className="px-4 py-2 bg-white/20 rounded-full text-white">
                    {typeof skill === "string" ? skill : skill.name}
                  </span>
                ))}
              </div>
            </div>
          )
        },
        {
          title: "Contact",
          value: "contact",
          content: (
            <div className="w-full h-full rounded-2xl p-10 bg-gradient-to-br from-green-700 to-emerald-900">
              <p className="text-3xl font-bold text-white mb-4">Get In Touch</p>
              {cvData.personalInfo?.email && (
                <p className="text-white/80 mb-2">Email: {cvData.personalInfo.email}</p>
              )}
              {cvData.personalInfo?.phone && (
                <p className="text-white/80 mb-2">Phone: {cvData.personalInfo.phone}</p>
              )}
              {cvData.personalInfo?.location && (
                <p className="text-white/80">Location: {cvData.personalInfo.location}</p>
              )}
            </div>
          )
        }
      ];
    }
    
    // Apply theme styling
    if (theme?.style === "minimal") {
      activeTabClassName = "bg-gray-100 dark:bg-gray-800";
      tabClassName = "text-sm";
    } else if (theme?.style === "modern") {
      activeTabClassName = "bg-gradient-to-r from-blue-500 to-purple-500";
      tabClassName = "font-medium";
    } else if (theme?.style === "creative") {
      activeTabClassName = "bg-gradient-to-r from-pink-500 to-orange-500";
      containerClassName = "gap-4";
    }
    
    return {
      tabs,
      containerClassName,
      activeTabClassName,
      tabClassName,
      contentClassName,
    };
  }
}