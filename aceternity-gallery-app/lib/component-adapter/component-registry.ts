import { ComponentType } from "./general-adapter";

// Registry of all Aceternity components and their mapping capabilities
export interface ComponentMapping {
  componentType: ComponentType;
  supportedDataTypes: string[];
  supportedUIStyles: string[];
  defaultProps?: Record<string, any>;
  requiredProps: string[];
  optionalProps?: string[];
}

export const COMPONENT_REGISTRY: Record<ComponentType, ComponentMapping> = {
  "3d-card": {
    componentType: "3d-card",
    supportedDataTypes: ["Card3DData", "ProjectData", "AchievementData"],
    supportedUIStyles: ["cards-grid", "achievements-cards", "projects-showcase"],
    requiredProps: ["title", "description"],
    optionalProps: ["image", "link", "gradient"],
    defaultProps: {
      containerClassName: "relative group",
      cardClassName: "relative",
    },
  },
  "3d-marquee": {
    componentType: "3d-marquee",
    supportedDataTypes: ["SkillItem[]", "string[]"],
    supportedUIStyles: ["skills-cloud"],
    requiredProps: ["items"],
    defaultProps: {
      speed: "normal",
      pauseOnHover: true,
    },
  },
  "3d-pin": {
    componentType: "3d-pin",
    supportedDataTypes: ["ProjectData", "AchievementData"],
    supportedUIStyles: ["projects-showcase"],
    requiredProps: ["title", "href"],
    optionalProps: ["description", "containerClassName"],
  },
  "animated-modal": {
    componentType: "animated-modal",
    supportedDataTypes: ["ExpandableCardData", "ProjectData"],
    supportedUIStyles: ["cards-expandable", "projects-expandable"],
    requiredProps: ["triggerText"],
    optionalProps: ["modalTitle", "modalDescription", "modalContent"],
  },
  "animated-testimonials": {
    componentType: "animated-testimonials",
    supportedDataTypes: ["AchievementData[]"],
    supportedUIStyles: ["achievements-cards"],
    requiredProps: ["testimonials"],
    defaultProps: {
      autoplay: true,
      duration: 5000,
    },
  },
  "animated-tooltip": {
    componentType: "animated-tooltip",
    supportedDataTypes: ["SkillItem[]", "ContactData"],
    supportedUIStyles: ["skills-grid", "contact-minimal"],
    requiredProps: ["items"],
  },
  "apple-cards-carousel": {
    componentType: "apple-cards-carousel",
    supportedDataTypes: ["ProjectData[]", "CarouselSlide[]"],
    supportedUIStyles: ["carousel-apple", "projects-showcase"],
    requiredProps: ["cards"],
    defaultProps: {
      offset: 10,
      scaleFactor: 0.06,
    },
  },
  "aurora-background": {
    componentType: "aurora-background",
    supportedDataTypes: ["HeroData"],
    supportedUIStyles: ["hero-aurora"],
    requiredProps: [],
    optionalProps: ["colors", "showRadialGradient"],
    defaultProps: {
      showRadialGradient: true,
    },
  },
  "background-beams": {
    componentType: "background-beams",
    supportedDataTypes: ["HeroData"],
    supportedUIStyles: ["hero-gradient"],
    requiredProps: [],
    optionalProps: ["className"],
  },
  "background-beams-with-collision": {
    componentType: "background-beams-with-collision",
    supportedDataTypes: ["HeroData"],
    supportedUIStyles: ["hero-gradient"],
    requiredProps: [],
    optionalProps: ["beamCount"],
    defaultProps: {
      beamCount: 5,
    },
  },
  "background-boxes": {
    componentType: "background-boxes",
    supportedDataTypes: ["HeroData"],
    supportedUIStyles: ["hero-minimal"],
    requiredProps: [],
    optionalProps: ["boxSize", "className"],
  },
  "background-gradient": {
    componentType: "background-gradient",
    supportedDataTypes: ["HeroData", "Card3DData"],
    supportedUIStyles: ["hero-gradient", "cards-grid"],
    requiredProps: [],
    optionalProps: ["gradientBackgroundStart", "gradientBackgroundEnd", "animate"],
    defaultProps: {
      animate: true,
    },
  },
  "background-lines": {
    componentType: "background-lines",
    supportedDataTypes: ["HeroData"],
    supportedUIStyles: ["hero-minimal"],
    requiredProps: [],
    optionalProps: ["svgOptions"],
  },
  "bento-grid": {
    componentType: "bento-grid",
    supportedDataTypes: ["BentoGridItem[]", "SkillItem[]"],
    supportedUIStyles: ["bento-standard", "bento-asymmetric", "skills-bento"],
    requiredProps: ["items"],
    optionalProps: ["className"],
  },
  "canvas-reveal-effect": {
    componentType: "canvas-reveal-effect",
    supportedDataTypes: ["Card3DData"],
    supportedUIStyles: ["cards-grid"],
    requiredProps: [],
    optionalProps: ["colors", "animationSpeed", "dotSize"],
    defaultProps: {
      animationSpeed: 0.4,
      dotSize: 3,
    },
  },
  "card-hover-effect": {
    componentType: "card-hover-effect",
    supportedDataTypes: ["ProjectData[]", "SkillItem[]"],
    supportedUIStyles: ["projects-showcase", "skills-grid"],
    requiredProps: ["items"],
    optionalProps: ["className"],
  },
  "card-spotlight": {
    componentType: "card-spotlight",
    supportedDataTypes: ["Card3DData", "AchievementData"],
    supportedUIStyles: ["cards-grid", "achievements-cards"],
    requiredProps: ["children"],
    optionalProps: ["radius", "color", "className"],
    defaultProps: {
      radius: 350,
      color: "#262626",
    },
  },
  "card-stack": {
    componentType: "card-stack",
    supportedDataTypes: ["AchievementData[]", "ExpandableCardData[]"],
    supportedUIStyles: ["cards-stack", "achievements-cards"],
    requiredProps: ["items"],
    optionalProps: ["offset", "scaleFactor"],
    defaultProps: {
      offset: 10,
      scaleFactor: 0.06,
    },
  },
  "cards": {
    componentType: "cards",
    supportedDataTypes: ["Card3DData", "ProjectData", "SkillItem"],
    supportedUIStyles: ["cards-grid", "projects-showcase", "skills-grid"],
    requiredProps: ["variant"],
    optionalProps: ["title", "description", "className"],
  },
  "carousel": {
    componentType: "carousel",
    supportedDataTypes: ["CarouselSlide[]", "ProjectData[]"],
    supportedUIStyles: ["carousel-standard", "projects-showcase"],
    requiredProps: ["slides"],
    optionalProps: ["className"],
  },
  "floating-navbar": {
    componentType: "floating-navbar",
    supportedDataTypes: ["ContactData"],
    supportedUIStyles: ["contact-minimal"],
    requiredProps: ["navItems"],
    optionalProps: ["className"],
  },
  "floating-dock": {
    componentType: "floating-dock",
    supportedDataTypes: ["NavigationData", "ContactData"],
    supportedUIStyles: ["navigation-dock", "contact-dock"],
    requiredProps: ["items"],
    optionalProps: ["desktopClassName", "mobileClassName"],
  },
  "hover-effect-v2": {
    componentType: "hover-effect-v2",
    supportedDataTypes: ["SkillItem[]", "ProjectData[]"],
    supportedUIStyles: ["skills-grid", "projects-showcase"],
    requiredProps: ["items"],
    optionalProps: ["className"],
  },
  "meteors": {
    componentType: "meteors",
    supportedDataTypes: ["HeroData"],
    supportedUIStyles: ["hero-gradient"],
    requiredProps: [],
    optionalProps: ["number"],
    defaultProps: {
      number: 20,
    },
  },
  "timeline": {
    componentType: "timeline",
    supportedDataTypes: ["TimelineEntry[]"],
    supportedUIStyles: ["timeline-vertical", "timeline-horizontal"],
    requiredProps: ["data"],
    optionalProps: ["className"],
  },
  "code-block": {
    componentType: "code-block",
    supportedDataTypes: ["CodeSnippet", "CodeSnippet[]"],
    supportedUIStyles: ["code-single", "code-tabs"],
    requiredProps: ["language", "filename"],
    optionalProps: ["code", "tabs", "highlightLines"],
    defaultProps: {
      highlightLines: [],
    },
  },
  "file-upload": {
    componentType: "file-upload",
    supportedDataTypes: ["FileUploadData"],
    supportedUIStyles: ["upload-dropzone", "upload-button"],
    requiredProps: ["onChange"],
    optionalProps: ["multiple", "accept", "maxSize"],
    defaultProps: {
      multiple: false,
    },
  },
  "flip-words": {
    componentType: "flip-words",
    supportedDataTypes: ["string[]", "HeroData"],
    supportedUIStyles: ["hero-animated-text", "dynamic-title"],
    requiredProps: ["words"],
    optionalProps: ["className", "duration"],
    defaultProps: {
      duration: 3000,
    },
  },
  "glare-card": {
    componentType: "glare-card",
    supportedDataTypes: ["Card3DData", "ProjectData", "SkillItem", "AchievementData"],
    supportedUIStyles: ["cards-grid", "projects-showcase", "skills-grid", "achievements-cards"],
    requiredProps: ["children"],
    optionalProps: ["className"],
    defaultProps: {
      className: "flex flex-col items-center justify-center",
    },
  },
  "glowing-effect": {
    componentType: "glowing-effect",
    supportedDataTypes: ["Card3DData", "BentoGridItem[]", "ProjectData"],
    supportedUIStyles: ["cards-grid", "bento-standard", "projects-showcase"],
    requiredProps: [],
    optionalProps: ["blur", "inactiveZone", "proximity", "spread", "variant", "glow", "disabled", "movementDuration", "borderWidth"],
    defaultProps: {
      blur: 0,
      inactiveZone: 0.7,
      proximity: 0,
      spread: 20,
      variant: "default",
      glow: false,
      disabled: true,
      movementDuration: 2,
      borderWidth: 1,
    },
  },
  "google-gemini-effect": {
    componentType: "google-gemini-effect",
    supportedDataTypes: ["HeroData", "AboutData", "ProjectData"],
    supportedUIStyles: ["hero-section", "about-section", "showcase-section"],
    requiredProps: ["pathLengths"],
    optionalProps: ["title", "description", "className"],
    defaultProps: {
      title: "Build with Aceternity UI",
      description: "Scroll this component and see the bottom SVG come to life wow this works!",
    },
  },
  "background-gradient-animation": {
    componentType: "background-gradient-animation",
    supportedDataTypes: ["HeroData", "AboutData", "CallToActionData"],
    supportedUIStyles: ["hero-section", "about-section", "cta-section", "background-overlay"],
    requiredProps: [],
    optionalProps: ["gradientBackgroundStart", "gradientBackgroundEnd", "firstColor", "secondColor", "thirdColor", "fourthColor", "fifthColor", "pointerColor", "size", "blendingValue", "interactive", "children", "className", "containerClassName"],
    defaultProps: {
      gradientBackgroundStart: "rgb(108, 0, 162)",
      gradientBackgroundEnd: "rgb(0, 17, 82)",
      firstColor: "18, 113, 255",
      secondColor: "221, 74, 255", 
      thirdColor: "100, 220, 255",
      fourthColor: "200, 50, 50",
      fifthColor: "180, 180, 50",
      pointerColor: "140, 100, 255",
      size: "80%",
      blendingValue: "hard-light",
      interactive: true,
    },
  },
  "grid-and-dot-backgrounds": {
    componentType: "grid-and-dot-backgrounds",
    supportedDataTypes: ["HeroData", "AboutData", "BackgroundData"],
    supportedUIStyles: ["hero-section", "about-section", "grid-background", "dot-background"],
    requiredProps: [],
    optionalProps: ["variant", "size", "className", "children"],
    defaultProps: {
      variant: "grid",
      size: "default",
    },
  },
  "hero-highlight": {
    componentType: "hero-highlight",
    supportedDataTypes: ["HeroData", "SectionData", "BackgroundData"],
    supportedUIStyles: ["hero-animated", "hero-gradient", "hero-section"],
    requiredProps: [],
    optionalProps: ["className", "containerClassName"],
    defaultProps: {
      containerClassName: "h-[40rem]",
    },
  },
  "hero-parallax": {
    componentType: "hero-parallax",
    supportedDataTypes: ["ProjectData[]", "ProductData[]", "PortfolioData[]"],
    supportedUIStyles: ["hero-animated", "portfolio-showcase", "products-display"],
    requiredProps: [],
    optionalProps: ["products", "containerClassName"],
    defaultProps: {
      products: [],
    },
  },
  "hero-sections": {
    componentType: "hero-sections",
    supportedDataTypes: ["HeroData", "LandingPageData"],
    supportedUIStyles: ["hero-animated", "hero-gradient", "landing-page"],
    requiredProps: [],
    optionalProps: ["containerClassName"],
    defaultProps: {},
  },
  "hover-border-gradient": {
    componentType: "hover-border-gradient",
    supportedDataTypes: ["ButtonData", "CTAData", "LinkData"],
    supportedUIStyles: ["button-gradient", "cta-animated", "link-hover"],
    requiredProps: [],
    optionalProps: ["children", "containerClassName", "className", "as", "duration", "clockwise"],
    defaultProps: {
      as: "button",
      duration: 1,
      clockwise: true,
    },
  },
  "images-slider": {
    componentType: "images-slider",
    supportedDataTypes: ["HeroData", "GalleryData", "ProductData[]"],
    supportedUIStyles: ["hero-slideshow", "product-showcase", "image-gallery"],
    requiredProps: ["images", "children"],
    optionalProps: ["overlay", "overlayClassName", "className", "autoplay", "direction"],
    defaultProps: {
      autoplay: true,
      direction: "up",
      overlay: true,
    },
  },
  "infinite-moving-cards": {
    componentType: "infinite-moving-cards",
    supportedDataTypes: ["TestimonialData[]", "ReviewData[]", "QuoteData[]"],
    supportedUIStyles: ["testimonials-marquee", "reviews-scroll", "quotes-carousel"],
    requiredProps: ["items"],
    optionalProps: ["direction", "speed", "pauseOnHover", "className"],
    defaultProps: {
      direction: "left",
      speed: "fast",
      pauseOnHover: true,
    },
  },
  "lamp": {
    componentType: "lamp",
    supportedDataTypes: ["HeroData", "SectionData", "PersonalData"],
    supportedUIStyles: ["hero-lamp", "section-header", "feature-spotlight"],
    requiredProps: [],
    optionalProps: ["title", "subtitle", "className", "containerClassName"],
    defaultProps: {
      title: "Build amazing",
      subtitle: "experiences",
    },
  },
  "layout-grid": {
    componentType: "layout-grid",
    supportedDataTypes: ["ProjectData[]", "PortfolioData[]", "ProductData[]", "GalleryData"],
    supportedUIStyles: ["portfolio-grid", "project-showcase", "product-gallery", "interactive-grid"],
    requiredProps: [],
    optionalProps: ["cards", "className", "containerClassName"],
    defaultProps: {
      cards: [],
    },
  },
  "lens": {
    componentType: "lens",
    supportedDataTypes: ["ImageData", "GalleryData", "ProductData", "ProjectData"],
    supportedUIStyles: ["image-zoom", "product-detail", "gallery-magnify", "technical-diagram"],
    requiredProps: ["children"],
    optionalProps: ["zoomFactor", "lensSize", "isStatic", "position", "hovering", "setHovering"],
    defaultProps: {
      zoomFactor: 1.5,
      lensSize: 170,
      isStatic: false,
    },
  },
  "link-preview": {
    componentType: "link-preview",
    supportedDataTypes: ["LinkData", "SocialLinkData", "NavigationData", "ContactData"],
    supportedUIStyles: ["inline-link", "navigation-link", "social-link", "resource-link"],
    requiredProps: ["children", "url"],
    optionalProps: ["className", "width", "height", "quality", "layout", "isStatic", "imageSrc"],
    defaultProps: {
      width: 200,
      height: 125,
      quality: 50,
      layout: "fixed",
      isStatic: false,
    },
  },
  "macbook-scroll": {
    componentType: "macbook-scroll",
    supportedDataTypes: ["HeroData", "PortfolioData", "ProductData"],
    supportedUIStyles: ["hero-3d", "portfolio-showcase", "product-demo"],
    requiredProps: [],
    optionalProps: ["src", "showGradient", "title", "badge"],
    defaultProps: {
      showGradient: false,
    },
  },
  "moving-border": {
    componentType: "moving-border",
    supportedDataTypes: ["ButtonData", "ActionData", "CTAData"],
    supportedUIStyles: ["button-animated", "cta-highlighted", "action-button"],
    requiredProps: ["children"],
    optionalProps: ["borderRadius", "duration", "className", "containerClassName", "borderClassName"],
    defaultProps: {
      borderRadius: "1.75rem",
      duration: 3000,
    },
  },
  "multi-step-loader": {
    componentType: "multi-step-loader",
    supportedDataTypes: ["LoadingStates", "ProcessSteps", "WorkflowData"],
    supportedUIStyles: ["loading-overlay", "progress-steps", "workflow-tracker"],
    requiredProps: ["loadingStates"],
    optionalProps: ["loading", "duration", "loop"],
    defaultProps: {
      loading: true,
      duration: 2000,
      loop: true,
    },
  },
  "navbar-menu": {
    componentType: "navbar-menu",
    supportedDataTypes: ["NavigationData", "MenuData", "PersonalData"],
    supportedUIStyles: ["navigation-main", "header-menu", "portfolio-nav"],
    requiredProps: ["menuItems"],
    optionalProps: ["className", "containerClassName"],
    defaultProps: {
      className: "max-w-2xl mx-auto",
    },
  },
  "parallax-scroll": {
    componentType: "parallax-scroll",
    supportedDataTypes: ["ImageGalleryData", "ProjectData[]", "PortfolioData"],
    supportedUIStyles: ["image-gallery", "portfolio-showcase", "photo-grid"],
    requiredProps: ["images"],
    optionalProps: ["className"],
    defaultProps: {
      className: "h-[40rem] w-full",
    },
  },
  "placeholders-and-vanish-input": {
    componentType: "placeholders-and-vanish-input",
    supportedDataTypes: ["SearchData", "ContactFormData", "PersonalData"],
    supportedUIStyles: ["search-input", "contact-form", "portfolio-search"],
    requiredProps: ["placeholders", "onChange", "onSubmit"],
    optionalProps: [],
    defaultProps: {},
  },
  "pointer-highlight": {
    componentType: "pointer-highlight",
    supportedDataTypes: ["TextHighlightData", "PersonalData", "SkillItem", "AchievementData"],
    supportedUIStyles: ["text-highlight", "inline-accent", "feature-highlight"],
    requiredProps: ["children"],
    optionalProps: ["rectangleClassName", "pointerClassName", "containerClassName"],
    defaultProps: {},
  },
  "resizable-navbar": {
    componentType: "resizable-navbar",
    supportedDataTypes: ["NavigationData", "PersonalData", "ContactData"],
    supportedUIStyles: ["navigation-resizable", "header-animated", "navbar-portfolio"],
    requiredProps: [],
    optionalProps: ["navItems", "primaryButtonText", "secondaryButtonText", "logoText", "className"],
    defaultProps: {
      navItems: [
        { name: "About", link: "#about" },
        { name: "Projects", link: "#projects" },
        { name: "Contact", link: "#contact" }
      ],
      primaryButtonText: "Get Started",
      secondaryButtonText: "Login",
      logoText: "Portfolio"
    },
  },
  "shooting-stars": {
    componentType: "shooting-stars",
    supportedDataTypes: ["BackgroundData", "DecorativeData", "HeroData"],
    supportedUIStyles: ["background-animated", "hero-background", "space-effect"],
    requiredProps: [],
    optionalProps: ["minSpeed", "maxSpeed", "minDelay", "maxDelay", "starColor", "trailColor", "starWidth", "starHeight", "className"],
    defaultProps: {
      minSpeed: 10,
      maxSpeed: 30,
      minDelay: 1200,
      maxDelay: 4200,
      starColor: "#9CA3AF",
      trailColor: "#2F59AA",
      starWidth: 10,
      starHeight: 1
    },
  },
  "stars-background": {
    componentType: "stars-background",
    supportedDataTypes: ["BackgroundData", "DecorativeData", "HeroData"],
    supportedUIStyles: ["background-animated", "hero-background", "space-effect"],
    requiredProps: [],
    optionalProps: ["starDensity", "allStarsTwinkle", "twinkleProbability", "minTwinkleSpeed", "maxTwinkleSpeed", "className"],
    defaultProps: {
      starDensity: 0.00015,
      allStarsTwinkle: true,
      twinkleProbability: 0.7,
      minTwinkleSpeed: 0.5,
      maxTwinkleSpeed: 1
    },
  },
  "sidebar": {
    componentType: "sidebar",
    supportedDataTypes: ["NavigationData", "PersonalData", "MenuData"],
    supportedUIStyles: ["navigation-sidebar", "dashboard-sidebar", "portfolio-sidebar"],
    requiredProps: [],
    optionalProps: ["animate", "links", "userName", "userAvatar", "logoText"],
    defaultProps: {
      animate: true,
      links: [
        { label: "Dashboard", href: "#", icon: "dashboard" },
        { label: "Profile", href: "#", icon: "profile" },
        { label: "Settings", href: "#", icon: "settings" }
      ]
    },
  },
  "signup-form": {
    componentType: "signup-form",
    supportedDataTypes: ["FormData", "ContactData", "PersonalData"],
    supportedUIStyles: ["form-signup", "form-contact", "form-application"],
    requiredProps: [],
    optionalProps: ["className", "onSubmit", "defaultValues", "title", "subtitle"],
    defaultProps: {},
  },
  "sparkles": {
    componentType: "sparkles",
    supportedDataTypes: ["BackgroundData", "DecorativeData", "HeroData", "AchievementData"],
    supportedUIStyles: ["background-effect", "hero-sparkles", "achievement-highlight"],
    requiredProps: [],
    optionalProps: ["id", "className", "background", "minSize", "maxSize", "speed", "particleColor", "particleDensity"],
    defaultProps: {
      background: "transparent",
      minSize: 0.6,
      maxSize: 1.4,
      speed: 4,
      particleColor: "#FFFFFF",
      particleDensity: 120
    },
  },
  "spotlight": {
    componentType: "spotlight",
    supportedDataTypes: ["HeroData", "SectionData", "BackgroundData", "HighlightData"],
    supportedUIStyles: ["hero-spotlight", "section-highlight", "dramatic-lighting", "feature-spotlight"],
    requiredProps: [],
    optionalProps: ["className", "fill"],
    defaultProps: {
      className: "-top-40 left-0 md:left-60 md:-top-20",
      fill: "white"
    },
  },
  "spotlight-new": {
    componentType: "spotlight-new",
    supportedDataTypes: ["HeroData", "SectionData", "BackgroundData", "HighlightData"],
    supportedUIStyles: ["hero-spotlight", "section-highlight", "animated-lighting", "dual-spotlight"],
    requiredProps: [],
    optionalProps: ["gradientFirst", "gradientSecond", "gradientThird", "translateY", "width", "height", "smallWidth", "duration", "xOffset"],
    defaultProps: {
      gradientFirst: "radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(210, 100%, 85%, .08) 0, hsla(210, 100%, 55%, .02) 50%, hsla(210, 100%, 45%, 0) 80%)",
      gradientSecond: "radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .06) 0, hsla(210, 100%, 55%, .02) 80%, transparent 100%)",
      gradientThird: "radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .04) 0, hsla(210, 100%, 45%, .02) 80%, transparent 100%)",
      translateY: -350,
      width: 560,
      height: 1380,
      smallWidth: 240,
      duration: 7,
      xOffset: 100
    },
  },
  "sticky-banner": {
    componentType: "sticky-banner",
    supportedDataTypes: ["AnnouncementData", "NotificationData", "PersonalData"],
    supportedUIStyles: ["banner-announcement", "banner-notification", "banner-warning", "banner-success"],
    requiredProps: ["children"],
    optionalProps: ["className", "hideOnScroll"],
    defaultProps: {
      className: "bg-gradient-to-b from-blue-500 to-blue-600",
      hideOnScroll: false
    },
  },
  "sticky-scroll-reveal": {
    componentType: "sticky-scroll-reveal",
    supportedDataTypes: ["FeatureData[]", "ProcessData[]", "TimelineData[]", "ProjectData[]"],
    supportedUIStyles: ["feature-showcase", "process-steps", "timeline-reveal", "portfolio-showcase"],
    requiredProps: ["content"],
    optionalProps: ["contentClassName"],
    defaultProps: {
      contentClassName: ""
    },
  },
  "svg-mask-effect": {
    componentType: "svg-mask-effect",
    supportedDataTypes: ["HeroData", "FeatureData", "CallToActionData"],
    supportedUIStyles: ["hero-reveal", "feature-highlight", "cta-interactive"],
    requiredProps: [],
    optionalProps: ["children", "revealText", "size", "revealSize", "className"],
    defaultProps: {
      size: 10,
      revealSize: 600,
      className: "h-[40rem] rounded-md border"
    },
  },
  "tabs": {
    componentType: "tabs",
    supportedDataTypes: ["NavigationData", "FeatureData[]", "ProjectData[]", "ServiceData[]"],
    supportedUIStyles: ["navigation-tabs", "feature-tabs", "project-showcase", "service-tabs"],
    requiredProps: ["tabs"],
    optionalProps: ["containerClassName", "activeTabClassName", "tabClassName", "contentClassName"],
    defaultProps: {
      containerClassName: "",
      activeTabClassName: "",
      tabClassName: "",
      contentClassName: ""
    },
  },
};

// Helper function to find suitable components for a data type
export function findComponentsForDataType(dataType: string): ComponentMapping[] {
  return Object.values(COMPONENT_REGISTRY).filter(mapping =>
    mapping.supportedDataTypes.includes(dataType)
  );
}

// Helper function to find suitable components for a UI style
export function findComponentsForUIStyle(uiStyle: string): ComponentMapping[] {
  return Object.values(COMPONENT_REGISTRY).filter(mapping =>
    mapping.supportedUIStyles.includes(uiStyle)
  );
}

// Helper function to validate if a component can handle specific data
export function canComponentHandleData(
  componentType: ComponentType,
  dataType: string,
  uiStyle?: string
): boolean {
  const mapping = COMPONENT_REGISTRY[componentType];
  if (!mapping) return false;

  const supportsData = mapping.supportedDataTypes.includes(dataType);
  const supportsStyle = uiStyle ? mapping.supportedUIStyles.includes(uiStyle) : true;

  return supportsData && supportsStyle;
}