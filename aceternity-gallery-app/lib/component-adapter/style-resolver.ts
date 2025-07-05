import { UIStyle } from "./types/backend-types";
import { ComponentType } from "./general-adapter";

// Style configurations for each UI style variant
export interface StyleConfig {
  className?: string;
  containerClassName?: string;
  animationSpeed?: "slow" | "normal" | "fast";
  animationIntensity?: "subtle" | "moderate" | "intense";
  layout?: "horizontal" | "vertical" | "grid" | "stack";
  size?: "small" | "medium" | "large" | "full";
  variant?: string;
  additionalProps?: Record<string, any>;
}

export class StyleResolver {
  // Main style resolution function
  static resolveStyle(componentType: ComponentType, uiStyle: UIStyle): StyleConfig {
    const resolver = this.getStyleResolver(uiStyle);
    if (!resolver) return {};

    const baseStyle = resolver();
    const componentOverrides = this.getComponentOverrides(componentType, uiStyle);

    return {
      ...baseStyle,
      ...componentOverrides,
    };
  }

  // Get style resolver for each UI style
  private static getStyleResolver(uiStyle: UIStyle): (() => StyleConfig) | null {
    const resolvers: Record<UIStyle, () => StyleConfig> = {
      // Timeline styles
      "timeline-vertical": () => ({
        className: "timeline-vertical",
        layout: "vertical",
        animationSpeed: "normal",
      }),
      "timeline-horizontal": () => ({
        className: "timeline-horizontal flex flex-row overflow-x-auto",
        layout: "horizontal",
        animationSpeed: "normal",
      }),

      // Card styles
      "cards-grid": () => ({
        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
        layout: "grid",
        animationIntensity: "moderate",
      }),
      "cards-stack": () => ({
        className: "relative",
        layout: "stack",
        animationSpeed: "slow",
        additionalProps: {
          offset: 10,
          scaleFactor: 0.06,
        },
      }),
      "cards-expandable": () => ({
        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
        variant: "expandable",
        animationIntensity: "subtle",
      }),

      // Bento styles
      "bento-standard": () => ({
        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4",
        layout: "grid",
      }),
      "bento-asymmetric": () => ({
        className: "grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[18rem]",
        layout: "grid",
        additionalProps: {
          asymmetric: true,
        },
      }),

      // Carousel styles
      "carousel-standard": () => ({
        size: "medium",
        animationSpeed: "normal",
      }),
      "carousel-apple": () => ({
        className: "apple-style",
        size: "large",
        animationSpeed: "slow",
        additionalProps: {
          offset: 15,
          scaleFactor: 0.08,
        },
      }),

      // Hero styles
      "hero-gradient": () => ({
        containerClassName: "relative h-screen flex items-center justify-center",
        animationIntensity: "intense",
        size: "full",
      }),
      "hero-aurora": () => ({
        containerClassName: "relative h-screen flex items-center justify-center overflow-hidden",
        animationIntensity: "moderate",
        size: "full",
      }),
      "hero-minimal": () => ({
        containerClassName: "relative min-h-[80vh] flex items-center justify-center",
        animationIntensity: "subtle",
        size: "large",
      }),

      // Skills styles
      "skills-grid": () => ({
        className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
        layout: "grid",
        animationSpeed: "fast",
      }),
      "skills-cloud": () => ({
        className: "flex flex-wrap gap-2 justify-center",
        variant: "cloud",
        animationIntensity: "moderate",
      }),
      "skills-bento": () => ({
        className: "grid grid-cols-2 md:grid-cols-3 gap-4",
        variant: "bento",
      }),

      // Projects styles
      "projects-showcase": () => ({
        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
        variant: "showcase",
        animationIntensity: "moderate",
        size: "large",
      }),
      "projects-expandable": () => ({
        className: "space-y-4",
        variant: "expandable",
        animationSpeed: "normal",
      }),

      // Achievements styles
      "achievements-stats": () => ({
        className: "grid grid-cols-2 md:grid-cols-4 gap-6",
        variant: "stats",
        animationIntensity: "subtle",
      }),
      "achievements-cards": () => ({
        className: "relative",
        variant: "cards",
        animationSpeed: "slow",
      }),

      // Contact styles
      "contact-form": () => ({
        className: "max-w-2xl mx-auto",
        variant: "form",
        size: "medium",
      }),
      "contact-minimal": () => ({
        className: "flex flex-wrap gap-4 justify-center",
        variant: "minimal",
        size: "small",
      }),

      // Code styles
      "code-single": () => ({
        className: "max-w-4xl mx-auto",
        variant: "single",
      }),
      "code-tabs": () => ({
        className: "max-w-4xl mx-auto",
        variant: "tabs",
      }),
    };

    return resolvers[uiStyle] || null;
  }

  // Component-specific overrides for certain UI styles
  private static getComponentOverrides(componentType: ComponentType, uiStyle: UIStyle): Partial<StyleConfig> {
    const overrides: Record<string, Record<ComponentType, Partial<StyleConfig>>> = {
      "hero-gradient": {
        "background-gradient": {
          className: "absolute inset-0 w-full h-full",
        },
        "background-beams": {
          additionalProps: {
            beamCount: 8,
          },
        },
        "meteors": {
          additionalProps: {
            number: 30,
          },
        },
      },
      "cards-grid": {
        "3d-card": {
          containerClassName: "h-[400px]",
        },
        "card-hover-effect": {
          className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
        },
      },
      "skills-grid": {
        "hover-effect-v2": {
          className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
        },
      },
      "projects-showcase": {
        "carousel": {
          size: "large",
          className: "w-full",
        },
        "apple-cards-carousel": {
          additionalProps: {
            offset: 20,
          },
        },
      },
    };

    const styleOverrides = overrides[uiStyle];
    if (styleOverrides && styleOverrides[componentType]) {
      return styleOverrides[componentType];
    }

    return {};
  }

  // Helper to get animation duration based on speed
  static getAnimationDuration(speed?: "slow" | "normal" | "fast"): number {
    const durations = {
      slow: 1500,
      normal: 1000,
      fast: 500,
    };
    return durations[speed || "normal"];
  }

  // Helper to get animation intensity multiplier
  static getAnimationIntensity(intensity?: "subtle" | "moderate" | "intense"): number {
    const intensities = {
      subtle: 0.5,
      moderate: 1,
      intense: 1.5,
    };
    return intensities[intensity || "moderate"];
  }

  // Helper to merge class names
  static mergeClassNames(...classNames: (string | undefined)[]): string {
    return classNames.filter(Boolean).join(" ");
  }

  // Get responsive size classes
  static getSizeClasses(size?: "small" | "medium" | "large" | "full"): string {
    const sizeClasses = {
      small: "w-64 h-64",
      medium: "w-96 h-96",
      large: "w-[32rem] h-[32rem]",
      full: "w-full h-full",
    };
    return sizeClasses[size || "medium"];
  }

  // Get container size for different layouts
  static getContainerSize(size?: "small" | "medium" | "large" | "full", componentType?: ComponentType): string {
    // Special handling for carousel components
    if (componentType === "carousel") {
      const carouselSizes = {
        small: "w-[50vmin] h-[50vmin]",
        medium: "w-[70vmin] h-[70vmin]",
        large: "w-[90vmin] h-[90vmin]",
        full: "w-full h-[80vh]",
      };
      return carouselSizes[size || "medium"];
    }

    // Default sizes
    return this.getSizeClasses(size);
  }
}