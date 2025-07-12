import React from "react";
import { ComponentType } from "./general-adapter";
import { COMPONENT_REGISTRY } from "./component-registry";
import * as BackendTypes from "./types/backend-types";

// Map backend data to Aceternity component props
export class ComponentMapper {
  // Main mapping function
  static mapDataToComponent(
    componentType: ComponentType,
    data: any,
    uiStyle?: string
  ): { component: ComponentType; props: any } | null {
    const mapping = COMPONENT_REGISTRY[componentType];
    if (!mapping) return null;

    // Get the appropriate mapper based on component type
    const mapperFn = this.getMapperFunction(componentType);
    if (!mapperFn) return null;

    const props = mapperFn(data, uiStyle);
    
    // Add default props
    const finalProps = {
      ...mapping.defaultProps,
      ...props,
    };

    return {
      component: componentType,
      props: finalProps,
    };
  }

  // Get mapper function for each component type
  private static getMapperFunction(componentType: ComponentType): ((data: any, uiStyle?: string) => any) | null {
    const mappers: Record<ComponentType, (data: any, uiStyle?: string) => any> = {
      "timeline": this.mapTimeline,
      "bento-grid": this.mapBentoGrid,
      "3d-card": this.map3DCard,
      "card-hover-effect": this.mapCardHoverEffect,
      "card-spotlight": this.mapCardSpotlight,
      "card-stack": this.mapCardStack,
      "carousel": this.mapCarousel,
      "apple-cards-carousel": this.mapAppleCardsCarousel,
      "animated-testimonials": this.mapAnimatedTestimonials,
      "animated-tooltip": this.mapAnimatedTooltip,
      "hover-effect-v2": this.mapHoverEffectV2,
      "aurora-background": this.mapAuroraBackground,
      "background-beams": this.mapBackgroundBeams,
      "background-beams-with-collision": this.mapBackgroundBeamsWithCollision,
      "background-boxes": this.mapBackgroundBoxes,
      "background-gradient": this.mapBackgroundGradient,
      "background-lines": this.mapBackgroundLines,
      "meteors": this.mapMeteors,
      "3d-marquee": this.map3DMarquee,
      "3d-pin": this.map3DPin,
      "animated-modal": this.mapAnimatedModal,
      "canvas-reveal-effect": this.mapCanvasRevealEffect,
      "cards": this.mapCards,
      "floating-navbar": this.mapFloatingNavbar,
      "code-block": this.mapCodeBlock,
      "colourful-text": this.mapColourfulText,
      "compare": this.mapCompare,
      "cover": this.mapCover,
      "container-scroll-animation": this.mapContainerScrollAnimation,
      "container-text-flip": this.mapContainerTextFlip,
      "direction-aware-hover": this.mapDirectionAwareHover,
      "draggable-card": this.mapDraggableCard,
      "evervault-card": this.mapEvervaultCard,
    };

    return mappers[componentType] || null;
  }

  // Individual component mappers
  private static mapTimeline(data: BackendTypes.TimelineEntry[], uiStyle?: string): any {
    return {
      data: data.map(entry => ({
        title: entry.title,
        content: (
          <div>
            {entry.subtitle && (
              <p className="text-neutral-800 dark:text-neutral-200 text-sm font-semibold">
                {entry.subtitle}
              </p>
            )}
            {entry.dateRange && (
              <p className="text-neutral-800 dark:text-neutral-200 text-sm">
                {entry.dateRange}
              </p>
            )}
            {entry.description && (
              <p className="text-neutral-800 dark:text-neutral-200 text-sm mt-2">
                {entry.description}
              </p>
            )}
            {entry.items && entry.items.length > 0 && (
              <ul className="list-disc list-inside mt-2">
                {entry.items.map((item, idx) => (
                  <li key={idx} className="text-neutral-800 dark:text-neutral-200 text-sm">
                    {item.text}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ),
      })),
    };
  }

  private static mapBentoGrid(data: BackendTypes.BentoGridItem[], uiStyle?: string): any {
    const getHeader = (item: BackendTypes.BentoGridItem) => {
      if (!item.header) return null;
      
      switch (item.header.type) {
        case "gradient":
          return (
            <div className={`h-full w-full rounded-xl ${item.header.content}`} />
          );
        case "image":
          return (
            <img 
              src={item.header.content} 
              alt={item.title}
              className="h-full w-full object-cover rounded-xl"
            />
          );
        case "component":
          return item.header.content;
        default:
          return null;
      }
    };

    return {
      items: data.map(item => ({
        title: item.title,
        description: item.description,
        header: getHeader(item),
        icon: item.icon,
        className: item.className || (item.size === "large" ? "md:col-span-2" : ""),
      })),
    };
  }

  private static map3DCard(data: BackendTypes.Card3DData, uiStyle?: string): any {
    return {
      title: data.title,
      description: data.description,
      image: data.image,
      link: data.link,
      cardClassName: data.gradient ? `bg-gradient-to-br ${data.gradient}` : "",
    };
  }

  private static mapCardHoverEffect(data: BackendTypes.ProjectData[] | BackendTypes.SkillItem[], uiStyle?: string): any {
    if (Array.isArray(data) && data.length > 0) {
      // Check if it's ProjectData
      if ('technologies' in data[0]) {
        const projects = data as BackendTypes.ProjectData[];
        return {
          items: projects.map(project => ({
            title: project.name,
            description: project.description,
            link: project.url || "#",
          })),
        };
      }
      // Otherwise it's SkillItem
      const skills = data as BackendTypes.SkillItem[];
      return {
        items: skills.map(skill => ({
          title: skill.name,
          description: `Proficiency: ${skill.level}`,
          link: "#",
        })),
      };
    }
    return { items: [] };
  }

  private static mapCardSpotlight(data: BackendTypes.Card3DData | BackendTypes.AchievementData, uiStyle?: string): any {
    const isAchievement = 'date' in data;
    
    return {
      children: (
        <>
          <p className="text-xl font-bold relative z-20 mt-2 text-white">
            {data.title}
          </p>
          <div className="text-neutral-200 mt-4 relative z-20">
            {data.description}
            {isAchievement && (data as BackendTypes.AchievementData).date && (
              <p className="text-sm text-neutral-400 mt-2">
                {(data as BackendTypes.AchievementData).date}
              </p>
            )}
          </div>
        </>
      ),
    };
  }

  private static mapCardStack(data: BackendTypes.AchievementData[] | BackendTypes.ExpandableCardData[], uiStyle?: string): any {
    return {
      items: data.map((item, idx) => ({
        id: idx,
        name: item.title,
        designation: 'date' in item ? item.date : item.subtitle || "",
        content: <p>{item.description}</p>,
      })),
    };
  }

  private static mapCarousel(data: BackendTypes.CarouselSlide[] | BackendTypes.ProjectData[], uiStyle?: string): any {
    // Check if it's CarouselSlide or ProjectData
    if (Array.isArray(data) && data.length > 0 && 'image' in data[0]) {
      const slides = 'buttonText' in data[0] 
        ? data as BackendTypes.CarouselSlide[]
        : (data as BackendTypes.ProjectData[]).map(project => ({
            id: project.id,
            title: project.name,
            description: project.description,
            image: project.image || `https://source.unsplash.com/random/800x600?${encodeURIComponent(project.name)}`,
            buttonText: "View Project",
            link: project.url,
          }));

      return {
        slides: slides.map(slide => ({
          title: slide.title,
          button: slide.buttonText || "Learn More",
          src: slide.image,
        })),
      };
    }
    return { slides: [] };
  }

  private static mapAppleCardsCarousel(data: BackendTypes.ProjectData[] | BackendTypes.CarouselSlide[], uiStyle?: string): any {
    const cards = Array.isArray(data) ? data.map((item, idx) => {
      if ('technologies' in item) {
        const project = item as BackendTypes.ProjectData;
        return {
          category: project.technologies[0] || "Project",
          title: project.name,
          src: project.image || `https://source.unsplash.com/random/800x600?tech&${idx}`,
          content: project.description,
        };
      } else {
        const slide = item as BackendTypes.CarouselSlide;
        return {
          category: "Featured",
          title: slide.title,
          src: slide.image,
          content: slide.description || "",
        };
      }
    }) : [];

    return { cards };
  }

  private static mapAnimatedTestimonials(data: BackendTypes.AchievementData[], uiStyle?: string): any {
    return {
      testimonials: data.map((achievement, idx) => ({
        quote: achievement.description,
        name: achievement.title,
        designation: achievement.date,
        src: `https://i.pravatar.cc/150?img=${idx + 1}`,
      })),
    };
  }

  private static mapAnimatedTooltip(data: BackendTypes.SkillItem[] | BackendTypes.ContactData, uiStyle?: string): any {
    if (Array.isArray(data)) {
      // Skills
      return {
        items: data.slice(0, 5).map((skill, idx) => ({
          id: idx,
          name: skill.name,
          designation: skill.level,
          image: `https://i.pravatar.cc/150?img=${idx + 10}`,
        })),
      };
    } else {
      // Contact
      const contact = data as BackendTypes.ContactData;
      return {
        items: contact.socials.map((social, idx) => ({
          id: idx,
          name: social.platform,
          designation: "Connect",
          image: social.icon || `https://i.pravatar.cc/150?img=${idx + 20}`,
        })),
      };
    }
  }

  private static mapHoverEffectV2(data: BackendTypes.SkillItem[] | BackendTypes.ProjectData[], uiStyle?: string): any {
    return this.mapCardHoverEffect(data, uiStyle);
  }

  private static mapAuroraBackground(data: BackendTypes.HeroData, uiStyle?: string): any {
    const colorMap: Record<string, string[]> = {
      professional: ["#60a5fa", "#3b82f6"],
      creative: ["#c084fc", "#a855f7"],
      minimal: ["#9ca3af", "#6b7280"],
      bold: ["#f59e0b", "#dc2626"],
      modern: ["#10b981", "#14b8a6"],
    };

    return {
      colors: colorMap[uiStyle?.split('-')[1] || "professional"],
      showRadialGradient: true,
    };
  }

  private static mapBackgroundBeams(data: BackendTypes.HeroData, uiStyle?: string): any {
    return {
      className: "absolute inset-0",
    };
  }

  private static mapBackgroundBeamsWithCollision(data: BackendTypes.HeroData, uiStyle?: string): any {
    return {
      className: "absolute inset-0",
      beamCount: uiStyle?.includes("intense") ? 10 : 5,
    };
  }

  private static mapBackgroundBoxes(data: BackendTypes.HeroData, uiStyle?: string): any {
    return {
      className: "absolute inset-0",
      boxSize: 40,
    };
  }

  private static mapBackgroundGradient(data: BackendTypes.HeroData | BackendTypes.Card3DData, uiStyle?: string): any {
    const gradient = 'backgroundType' in data 
      ? "rgb(108, 0, 162)" 
      : (data as BackendTypes.Card3DData).gradient || "rgb(108, 0, 162)";

    return {
      animate: true,
      gradientBackgroundStart: gradient,
      gradientBackgroundEnd: "rgb(0, 17, 82)",
    };
  }

  private static mapBackgroundLines(data: BackendTypes.HeroData, uiStyle?: string): any {
    return {
      className: "absolute inset-0",
      svgOptions: {
        duration: 10,
      },
    };
  }

  private static mapMeteors(data: BackendTypes.HeroData, uiStyle?: string): any {
    return {
      number: uiStyle?.includes("intense") ? 30 : 20,
    };
  }

  private static map3DMarquee(data: BackendTypes.SkillItem[] | string[], uiStyle?: string): any {
    const items = Array.isArray(data) && data.length > 0
      ? typeof data[0] === 'string'
        ? data as string[]
        : (data as BackendTypes.SkillItem[]).map(skill => skill.name)
      : [];

    return {
      items: items.map(item => ({
        text: typeof item === 'string' ? item : item.name,
      })),
      speed: "normal",
      pauseOnHover: true,
    };
  }

  private static map3DPin(data: BackendTypes.ProjectData | BackendTypes.AchievementData, uiStyle?: string): any {
    const isProject = 'technologies' in data;
    
    return {
      title: isProject ? (data as BackendTypes.ProjectData).name : data.title,
      href: isProject ? (data as BackendTypes.ProjectData).url || "#" : "#",
      description: data.description,
    };
  }

  private static mapAnimatedModal(data: BackendTypes.ExpandableCardData | BackendTypes.ProjectData, uiStyle?: string): any {
    const isProject = 'technologies' in data;
    
    return {
      triggerText: isProject ? "View Project" : "View Details",
      modalTitle: isProject ? (data as BackendTypes.ProjectData).name : data.title,
      modalDescription: data.description,
      modalContent: isProject 
        ? (data as BackendTypes.ProjectData).technologies.join(", ")
        : (data as BackendTypes.ExpandableCardData).expandedContent,
    };
  }

  private static mapCanvasRevealEffect(data: BackendTypes.Card3DData, uiStyle?: string): any {
    return {
      colors: [[59, 130, 246], [139, 92, 246]],
      animationSpeed: 5,
      dotSize: 3,
    };
  }

  private static mapCards(data: BackendTypes.Card3DData | BackendTypes.ProjectData | BackendTypes.SkillItem, uiStyle?: string): any {
    // Determine variant based on data type
    let variant = "feature";
    if ('technologies' in data) variant = "overlay";
    if ('level' in data) variant = "content";

    const baseProps = {
      variant,
      title: 'name' in data ? data.name : data.title,
      description: 'level' in data ? `Proficiency: ${data.level}` : data.description,
    };

    return baseProps;
  }

  private static mapFloatingNavbar(data: BackendTypes.ContactData, uiStyle?: string): any {
    const navItems = [
      { name: "Home", link: "/" },
      { name: "About", link: "/about" },
      { name: "Contact", link: "/contact" },
    ];

    // Add social links
    data.socials.forEach(social => {
      navItems.push({
        name: social.platform,
        link: social.url,
      });
    });

    return {
      navItems,
      className: "top-4",
    };
  }

  private static mapCodeBlock(data: BackendTypes.CodeSnippet | BackendTypes.CodeSnippet[], uiStyle?: string): any {
    // Single code snippet
    if (!Array.isArray(data)) {
      return {
        language: data.language,
        filename: data.filename,
        code: data.code,
        highlightLines: data.highlightLines || [],
      };
    }

    // Multiple code snippets as tabs
    if (data.length === 1) {
      // If only one snippet, show as single code block
      return {
        language: data[0].language,
        filename: data[0].filename,
        code: data[0].code,
        highlightLines: data[0].highlightLines || [],
      };
    } else {
      // Multiple snippets as tabs
      return {
        language: data[0].language, // Default language
        filename: data[0].filename, // Default filename
        tabs: data.map(snippet => ({
          name: snippet.filename,
          code: snippet.code,
          language: snippet.language,
          highlightLines: snippet.highlightLines || [],
        })),
      };
    }
  }

  private static mapColourfulText(data: BackendTypes.HeroData | BackendTypes.PersonalInfo | string, uiStyle?: string): any {
    let text = "";
    
    if (typeof data === 'string') {
      text = data;
    } else if ('title' in data) {
      // HeroData
      text = data.title;
    } else if ('name' in data) {
      // PersonalInfo
      text = data.name;
    }

    // Extract specific words based on UI style
    if (uiStyle?.includes("highlight-name") && text.includes(" ")) {
      // Highlight last word (usually surname)
      const words = text.split(" ");
      text = words[words.length - 1];
    } else if (uiStyle?.includes("highlight-first") && text.includes(" ")) {
      // Highlight first word
      text = text.split(" ")[0];
    } else if (uiStyle?.includes("highlight-role") && 'role' in data) {
      // Highlight role/title if available
      text = (data as BackendTypes.PersonalInfo).title || text;
    }

    return {
      text,
      className: uiStyle?.includes("large") ? "text-6xl" : "text-4xl",
    };
  }

  private static mapCompare(data: BackendTypes.ProjectData[] | { before: string; after: string } | BackendTypes.ComparisonData, uiStyle?: string): any {
    let firstImage = "";
    let secondImage = "";
    
    if (Array.isArray(data) && data.length >= 2) {
      // Projects comparison
      firstImage = data[0].image || "https://images.unsplash.com/photo-1617854818583-09e7f077a156?w=600&h=400&fit=crop";
      secondImage = data[1].image || "https://images.unsplash.com/photo-1617854818583-09e7f077a156?w=600&h=400&fit=crop&duotone=000000,ffffff";
    } else if ('before' in data && 'after' in data) {
      // Simple before/after
      firstImage = data.before;
      secondImage = data.after;
    } else if ('beforeImage' in data && 'afterImage' in data) {
      // ComparisonData
      const compData = data as BackendTypes.ComparisonData;
      firstImage = compData.beforeImage;
      secondImage = compData.afterImage;
    }

    return {
      firstImage,
      secondImage,
      className: uiStyle?.includes("large") ? "h-[500px] w-[800px]" : "h-[400px] w-[600px]",
      slideMode: uiStyle?.includes("drag") ? "drag" : "hover",
      autoplay: uiStyle?.includes("autoplay"),
      autoplayDuration: 5000,
      showHandlebar: true,
      initialSliderPercentage: 50,
    };
  }

  private static mapCover(data: BackendTypes.PersonalInfo | BackendTypes.SkillItem | { text: string } | string, uiStyle?: string): any {
    let text = "";
    
    if (typeof data === 'string') {
      text = data;
    } else if ('text' in data) {
      text = data.text;
    } else if ('name' in data) {
      text = data.name;
    } else if ('title' in data) {
      text = data.title;
    } else {
      text = "warp speed";
    }

    // Extract specific words from text if UI style specifies
    if (uiStyle?.includes("single-word")) {
      text = text.split(" ")[0];
    } else if (uiStyle?.includes("last-word")) {
      const words = text.split(" ");
      text = words[words.length - 1];
    }

    return {
      children: text,
      className: uiStyle?.includes("large") ? "text-6xl font-bold" : "",
    };
  }

  private static mapContainerScrollAnimation(data: BackendTypes.HeroSection | BackendTypes.ProjectData | BackendTypes.PersonalInfo | { title: string; subtitle?: string; image?: string }, uiStyle?: string): any {
    let titleComponent = "";
    let highlightText = "";
    let imageUrl = "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=1400&h=720&fit=crop";
    
    if ('heroTitle' in data) {
      // HeroSection
      titleComponent = data.heroTitle;
      highlightText = data.subtitle || "Amazing Product";
      imageUrl = data.backgroundImage || imageUrl;
    } else if ('title' in data && 'description' in data) {
      // ProjectData
      titleComponent = data.title;
      highlightText = "View Project";
      imageUrl = data.image || imageUrl;
    } else if ('name' in data && 'title' in data) {
      // PersonalInfo
      titleComponent = `Hi, I'm ${data.name}`;
      highlightText = data.title;
    } else if ('title' in data) {
      // Generic title/subtitle
      titleComponent = data.title;
      highlightText = data.subtitle || "Scroll Down";
      imageUrl = data.image || imageUrl;
    }

    // Style variations
    if (uiStyle?.includes("product")) {
      highlightText = "Product Innovation";
    } else if (uiStyle?.includes("features")) {
      highlightText = "Key Features";
    }

    return {
      titleComponent: (
        <>
          <h1 className="text-4xl font-semibold text-black dark:text-white">
            {titleComponent} <br />
            <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
              {highlightText}
            </span>
          </h1>
        </>
      ),
      children: (
        <img
          src={imageUrl}
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      )
    };
  }

  private static mapContainerTextFlip(data: BackendTypes.SkillItem[] | string[] | { words: string[] } | BackendTypes.PersonalInfo, uiStyle?: string): any {
    let words: string[] = [];
    
    if (Array.isArray(data)) {
      if (data.length > 0 && typeof data[0] === 'string') {
        // String array
        words = data as string[];
      } else if (data.length > 0 && 'name' in data[0]) {
        // SkillItem array
        words = (data as BackendTypes.SkillItem[]).map(skill => skill.name);
      }
    } else if ('words' in data) {
      // Object with words property
      words = data.words;
    } else if ('skills' in data) {
      // PersonalInfo with skills
      words = data.skills || ["React", "TypeScript", "Next.js", "Node.js"];
    } else if ('title' in data && 'name' in data) {
      // PersonalInfo - use title variations
      words = [data.title, "Developer", "Engineer", "Creative"];
    } else {
      // Default words
      words = ["better", "modern", "beautiful", "awesome"];
    }

    // Style variations
    let interval = 3000;
    let animationDuration = 700;
    
    if (uiStyle?.includes("fast")) {
      interval = 1500;
      animationDuration = 400;
    } else if (uiStyle?.includes("slow")) {
      interval = 4000;
      animationDuration = 1000;
    }

    return {
      words,
      interval,
      animationDuration,
      className: uiStyle?.includes("small") ? "!text-2xl md:!text-3xl" : uiStyle?.includes("large") ? "!text-5xl md:!text-7xl" : undefined
    };
  }

  private static mapDirectionAwareHover(data: BackendTypes.ProjectData | BackendTypes.ExperienceItem | BackendTypes.Card3DData | { imageUrl: string; title: string; description?: string }, uiStyle?: string): any {
    let imageUrl = "https://images.unsplash.com/photo-1663765970236-f2acfde22237?w=500&h=500&fit=crop";
    let title = "";
    let subtitle = "";
    
    if ('image' in data) {
      // ProjectData
      imageUrl = data.image || imageUrl;
      title = data.title;
      subtitle = data.description || "";
    } else if ('role' in data && 'company' in data) {
      // ExperienceItem
      title = data.role;
      subtitle = `${data.company} | ${data.startDate} - ${data.endDate}`;
      imageUrl = "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=500&h=500&fit=crop";
    } else if ('icon' in data && 'title' in data) {
      // Card3DData
      title = data.title;
      subtitle = data.description || "";
      imageUrl = "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=500&h=500&fit=crop";
    } else if ('imageUrl' in data) {
      // Direct mapping
      imageUrl = data.imageUrl;
      title = data.title;
      subtitle = data.description || "";
    }

    // Style variations
    let className = "md:h-96 w-60 h-60 md:w-96";
    if (uiStyle?.includes("small")) {
      className = "md:h-64 w-48 h-48 md:w-64";
    } else if (uiStyle?.includes("large")) {
      className = "md:h-[500px] w-80 h-80 md:w-[500px]";
    }

    return {
      imageUrl,
      children: (
        <>
          <p className="font-bold text-xl">{title}</p>
          {subtitle && <p className="font-normal text-sm">{subtitle}</p>}
        </>
      ),
      className
    };
  }

  private static mapDraggableCard(data: BackendTypes.ProjectData | BackendTypes.SkillItem | BackendTypes.PersonalInfo | { image?: string; title?: string } | string, uiStyle?: string): any {
    // For the DraggableCard, we need to structure the props differently
    // The component uses DraggableCardContainer and DraggableCardBody
    
    const result: any = {
      DraggableCardContainer: {
        className: "relative flex min-h-screen w-full items-center justify-center overflow-clip"
      },
      DraggableCardBody: {}
    };

    // If it's a single string, use it as title
    if (typeof data === 'string') {
      result.DraggableCardBody = {
        children: (
          <>
            <img
              src="https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=300&fit=crop"
              alt="Draggable card"
              className="pointer-events-none relative z-10 h-80 w-80 object-cover"
            />
            <p className="mt-4 text-center text-2xl font-bold text-neutral-700 dark:text-neutral-300">
              {data}
            </p>
          </>
        )
      };
    } else if ('image' in data || 'title' in data) {
      // ProjectData or generic object
      const image = data.image || "https://images.unsplash.com/photo-1732310216648-603c0255c000?w=400&h=300&fit=crop";
      const title = data.title || "Draggable Card";
      
      result.DraggableCardBody = {
        children: (
          <>
            <img
              src={image}
              alt={title}
              className="pointer-events-none relative z-10 h-80 w-80 object-cover"
            />
            <p className="mt-4 text-center text-2xl font-bold text-neutral-700 dark:text-neutral-300">
              {title}
            </p>
          </>
        )
      };
    } else if ('name' in data && 'level' in data) {
      // SkillItem
      result.DraggableCardBody = {
        children: (
          <>
            <div className="pointer-events-none relative z-10 h-80 w-80 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
              <span className="text-white text-6xl font-bold">{data.level}%</span>
            </div>
            <p className="mt-4 text-center text-2xl font-bold text-neutral-700 dark:text-neutral-300">
              {data.name}
            </p>
          </>
        )
      };
    } else if ('name' in data && 'title' in data) {
      // PersonalInfo
      result.DraggableCardBody = {
        children: (
          <>
            <div className="pointer-events-none relative z-10 h-80 w-80 flex items-center justify-center bg-gradient-to-br from-green-500 to-teal-500 rounded-lg">
              <span className="text-white text-4xl font-bold text-center px-4">{data.name}</span>
            </div>
            <p className="mt-4 text-center text-2xl font-bold text-neutral-700 dark:text-neutral-300">
              {data.title}
            </p>
          </>
        )
      };
    }

    // Apply style variations
    if (uiStyle?.includes("grid")) {
      result.DraggableCardContainer.className = "relative my-10 flex min-h-screen w-full justify-center overflow-clip";
    } else if (uiStyle?.includes("polaroid")) {
      result.DraggableCardBody.className = "absolute top-10 left-[20%] rotate-[-5deg]";
    }

    return result;
  }

  private static mapEvervaultCard(data: BackendTypes.PersonalInfo | BackendTypes.SkillItem | BackendTypes.ProjectData | { text?: string; title?: string } | string, uiStyle?: string): any {
    let text = "hover";
    
    if (typeof data === 'string') {
      text = data.length <= 10 ? data : data.substring(0, 10);
    } else if ('text' in data && data.text) {
      text = data.text.length <= 10 ? data.text : data.text.substring(0, 10);
    } else if ('name' in data && 'level' in data) {
      // SkillItem
      text = data.name.length <= 10 ? data.name : data.name.substring(0, 10);
    } else if ('title' in data) {
      // ProjectData or generic title
      text = data.title.length <= 10 ? data.title : data.title.substring(0, 10);
    } else if ('name' in data) {
      // PersonalInfo
      text = data.name.length <= 10 ? data.name : data.name.substring(0, 10);
    }

    // Simplify text for better visual impact
    if (uiStyle?.includes("abbrev")) {
      if (text.includes(" ")) {
        // Create abbreviation from first letters
        text = text.split(" ").map(word => word.charAt(0)).join("").toUpperCase();
      } else if (text.length > 5) {
        text = text.substring(0, 3).toUpperCase();
      }
    }

    return {
      text,
      className: uiStyle?.includes("large") ? "w-full h-80" : uiStyle?.includes("small") ? "w-32 h-32" : ""
    };
  }
}