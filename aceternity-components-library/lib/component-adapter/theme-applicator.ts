import { ThemeConfig } from "./types/backend-types";
import React from "react";

export class ThemeApplicator {
  // Apply theme to component props
  static applyTheme(props: any, theme: ThemeConfig, componentType?: string): any {
    const themeStyles = this.generateThemeStyles(theme);
    const themeClasses = this.generateThemeClasses(theme);
    const cssVariables = this.generateCSSVariables(theme);

    // Merge theme styles with existing props
    return {
      ...props,
      style: {
        ...props.style,
        ...themeStyles,
        ...cssVariables,
      },
      className: this.mergeClassNames(props.className, themeClasses),
      // Add theme-specific props
      ...this.getComponentThemeProps(componentType, theme),
    };
  }

  // Generate inline styles from theme
  private static generateThemeStyles(theme: ThemeConfig): React.CSSProperties {
    return {
      fontFamily: theme.fonts.body,
      // Add gradient as background if needed
      ...(theme.primaryGradient && {
        background: theme.primaryGradient,
      }),
    };
  }

  // Generate CSS classes from theme
  private static generateThemeClasses(theme: ThemeConfig): string {
    const classes: string[] = [];

    // Font classes
    if (theme.fonts.heading) {
      classes.push(`font-[${theme.fonts.heading.replace(/\s/g, '_')}]`);
    }

    // Animation speed classes
    const animationMap = {
      slow: "animate-slow",
      normal: "",
      fast: "animate-fast",
    };
    if (theme.animations.speed !== "normal") {
      classes.push(animationMap[theme.animations.speed]);
    }

    // Animation intensity
    const intensityMap = {
      subtle: "motion-reduce:animate-none animate-subtle",
      moderate: "",
      intense: "animate-intense",
    };
    if (theme.animations.intensity !== "moderate") {
      classes.push(intensityMap[theme.animations.intensity]);
    }

    // Container width
    const containerMap = {
      narrow: "max-w-4xl mx-auto",
      normal: "max-w-6xl mx-auto",
      wide: "max-w-7xl mx-auto",
      full: "w-full",
    };
    classes.push(containerMap[theme.spacing.containerWidth]);

    // Tight spacing
    if (theme.spacing.tight) {
      classes.push("space-y-4");
    } else {
      classes.push("space-y-8");
    }

    return classes.join(" ");
  }

  // Generate CSS variables from theme
  private static generateCSSVariables(theme: ThemeConfig): Record<string, string> {
    return {
      "--primary": theme.colors.primary,
      "--secondary": theme.colors.secondary,
      "--accent": theme.colors.accent,
      "--background": theme.colors.background,
      "--foreground": theme.colors.foreground,
      "--muted": theme.colors.muted,
      "--border": theme.colors.border,
      "--primary-gradient": theme.primaryGradient,
      "--secondary-gradient": theme.secondaryGradient || theme.primaryGradient,
      "--font-heading": theme.fonts.heading,
      "--font-body": theme.fonts.body,
      "--font-mono": theme.fonts.mono || "monospace",
    };
  }

  // Get component-specific theme props
  private static getComponentThemeProps(componentType?: string, theme?: ThemeConfig): Record<string, any> {
    if (!componentType || !theme) return {};

    const componentProps: Record<string, Record<string, any>> = {
      "aurora-background": {
        colors: this.extractGradientColors(theme.primaryGradient),
      },
      "background-gradient": {
        gradientBackgroundStart: theme.colors.primary,
        gradientBackgroundEnd: theme.colors.secondary,
      },
      "card-spotlight": {
        color: theme.colors.accent,
      },
      "canvas-reveal-effect": {
        colors: this.extractGradientColors(theme.primaryGradient).map(color => 
          this.hexToRgbArray(color)
        ),
      },
      "meteors": {
        className: `bg-gradient-to-r from-${theme.colors.primary} to-${theme.colors.secondary}`,
      },
    };

    return componentProps[componentType] || {};
  }

  // Helper to merge class names
  private static mergeClassNames(...classNames: (string | undefined)[]): string {
    return classNames.filter(Boolean).join(" ");
  }

  // Extract colors from gradient string
  private static extractGradientColors(gradient: string): string[] {
    const colorRegex = /#[0-9A-Fa-f]{6}/g;
    const matches = gradient.match(colorRegex);
    return matches || ["#3b82f6", "#8b5cf6"];
  }

  // Convert hex to RGB array
  private static hexToRgbArray(hex: string): number[] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16),
        ]
      : [0, 0, 0];
  }

  // Apply global theme to document
  static applyGlobalTheme(theme: ThemeConfig): void {
    const root = document.documentElement;
    const cssVars = this.generateCSSVariables(theme);

    Object.entries(cssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Add theme name as data attribute
    root.setAttribute("data-theme", theme.name);

    // Apply font imports if needed
    this.loadFonts(theme.fonts);
  }

  // Load custom fonts
  private static loadFonts(fonts: ThemeConfig["fonts"]): void {
    const fontFamilies = [fonts.heading, fonts.body, fonts.mono].filter(Boolean);
    
    fontFamilies.forEach(fontFamily => {
      if (fontFamily && !document.fonts.check(`12px "${fontFamily}"`)) {
        // Create link element for Google Fonts
        const link = document.createElement("link");
        link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s/g, "+")}:wght@400;500;600;700&display=swap`;
        link.rel = "stylesheet";
        document.head.appendChild(link);
      }
    });
  }

  // Generate animation CSS based on theme
  static generateAnimationCSS(theme: ThemeConfig): string {
    const speedMultiplier = {
      slow: 1.5,
      normal: 1,
      fast: 0.5,
    };

    const intensityMultiplier = {
      subtle: 0.5,
      moderate: 1,
      intense: 2,
    };

    const speed = speedMultiplier[theme.animations.speed];
    const intensity = intensityMultiplier[theme.animations.intensity];

    return `
      :root {
        --animation-speed: ${speed};
        --animation-intensity: ${intensity};
      }

      .animate-slow {
        animation-duration: calc(var(--animation-speed) * 1s);
      }

      .animate-fast {
        animation-duration: calc(var(--animation-speed) * 0.5s);
      }

      .animate-subtle {
        animation-timing-function: ease-out;
        opacity: ${0.5 + (0.5 * intensity)};
      }

      .animate-intense {
        animation-timing-function: ease-in-out;
        animation-iteration-count: infinite;
      }
    `;
  }
}