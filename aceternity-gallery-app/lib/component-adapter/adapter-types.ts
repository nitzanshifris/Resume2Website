// Type definitions for the general adapter system

import { ComponentType } from "./general-adapter";

// Component size variants
export type ComponentSize = "small" | "medium" | "large" | "full";

// Theme styles
export type ThemeStyle = "professional" | "creative" | "minimal" | "bold" | "modern";

// Color schemes
export type ColorScheme = "light" | "dark" | "auto";

// Adapter presets for quick configuration
export interface AdapterPreset {
  name: string;
  description: string;
  size: ComponentSize;
  theme: {
    style: ThemeStyle;
    colorScheme: ColorScheme;
    accentColor?: string;
  };
  componentOverrides?: Partial<Record<ComponentType, any>>;
}

// Common presets
export const ADAPTER_PRESETS: Record<string, AdapterPreset> = {
  professionalLight: {
    name: "Professional Light",
    description: "Clean, professional look with light theme",
    size: "medium",
    theme: {
      style: "professional",
      colorScheme: "light",
      accentColor: "#3b82f6",
    },
  },
  creativeDark: {
    name: "Creative Dark",
    description: "Bold, creative design with dark theme",
    size: "large",
    theme: {
      style: "creative",
      colorScheme: "dark",
      accentColor: "#a855f7",
    },
  },
  minimalClean: {
    name: "Minimal Clean",
    description: "Minimal design with subtle animations",
    size: "medium",
    theme: {
      style: "minimal",
      colorScheme: "auto",
      accentColor: "#6b7280",
    },
  },
  boldImpact: {
    name: "Bold Impact",
    description: "High impact design with strong visuals",
    size: "large",
    theme: {
      style: "bold",
      colorScheme: "dark",
      accentColor: "#dc2626",
    },
  },
  modernTech: {
    name: "Modern Tech",
    description: "Modern tech-focused design",
    size: "medium",
    theme: {
      style: "modern",
      colorScheme: "dark",
      accentColor: "#10b981",
    },
  },
  heroSection: {
    name: "Hero Section",
    description: "Full-size components for hero sections",
    size: "full",
    theme: {
      style: "professional",
      colorScheme: "auto",
    },
  },
};

// Component categories for organization
export type ComponentCategory = 
  | "background"
  | "card"
  | "carousel"
  | "interactive"
  | "navigation"
  | "content"
  | "utility";

// Component metadata
export interface ComponentMetadata {
  type: ComponentType;
  category: ComponentCategory;
  name: string;
  description: string;
  bestFor: string[];
  requiredData: string[];
  supportsSizes: ComponentSize[];
  supportsThemes: ThemeStyle[];
}

// Complete component registry
export const COMPONENT_REGISTRY: Record<ComponentType, ComponentMetadata> = {
  "3d-card": {
    type: "3d-card",
    category: "card",
    name: "3D Card",
    description: "Card with 3D hover effects",
    bestFor: ["personal info", "featured content"],
    requiredData: ["personalInfo"],
    supportsSizes: ["small", "medium", "large"],
    supportsThemes: ["professional", "creative", "modern"],
  },
  "3d-marquee": {
    type: "3d-marquee",
    category: "content",
    name: "3D Marquee",
    description: "3D scrolling marquee",
    bestFor: ["skills", "technologies"],
    requiredData: ["skills"],
    supportsSizes: ["medium", "large", "full"],
    supportsThemes: ["creative", "modern", "bold"],
  },
  "3d-pin": {
    type: "3d-pin",
    category: "interactive",
    name: "3D Pin",
    description: "Animated pin with 3D effects",
    bestFor: ["cta", "highlights"],
    requiredData: ["personalInfo"],
    supportsSizes: ["small", "medium"],
    supportsThemes: ["professional", "creative", "modern"],
  },
  "animated-modal": {
    type: "animated-modal",
    category: "utility",
    name: "Animated Modal",
    description: "Modal with smooth animations",
    bestFor: ["details", "forms"],
    requiredData: ["personalInfo"],
    supportsSizes: ["medium", "large"],
    supportsThemes: ["professional", "minimal", "modern"],
  },
  "animated-testimonials": {
    type: "animated-testimonials",
    category: "content",
    name: "Animated Testimonials",
    description: "Testimonial carousel with animations",
    bestFor: ["achievements", "testimonials"],
    requiredData: ["achievements"],
    supportsSizes: ["medium", "large", "full"],
    supportsThemes: ["professional", "creative", "minimal"],
  },
  "animated-tooltip": {
    type: "animated-tooltip",
    category: "interactive",
    name: "Animated Tooltip",
    description: "Tooltips with animations",
    bestFor: ["team", "skills preview"],
    requiredData: ["skills"],
    supportsSizes: ["small", "medium"],
    supportsThemes: ["professional", "minimal", "modern"],
  },
  "apple-cards-carousel": {
    type: "apple-cards-carousel",
    category: "carousel",
    name: "Apple Cards Carousel",
    description: "Apple-style card carousel",
    bestFor: ["projects", "portfolio"],
    requiredData: ["projects"],
    supportsSizes: ["medium", "large", "full"],
    supportsThemes: ["professional", "minimal", "modern"],
  },
  "aurora-background": {
    type: "aurora-background",
    category: "background",
    name: "Aurora Background",
    description: "Animated aurora effect",
    bestFor: ["hero sections", "backgrounds"],
    requiredData: [],
    supportsSizes: ["full"],
    supportsThemes: ["professional", "creative", "minimal", "bold", "modern"],
  },
  "background-beams": {
    type: "background-beams",
    category: "background",
    name: "Background Beams",
    description: "Animated light beams",
    bestFor: ["backgrounds", "sections"],
    requiredData: [],
    supportsSizes: ["full"],
    supportsThemes: ["professional", "creative", "modern"],
  },
  "background-beams-with-collision": {
    type: "background-beams-with-collision",
    category: "background",
    name: "Colliding Beams",
    description: "Beams with collision effects",
    bestFor: ["hero sections", "interactive backgrounds"],
    requiredData: [],
    supportsSizes: ["full"],
    supportsThemes: ["creative", "bold", "modern"],
  },
  "background-boxes": {
    type: "background-boxes",
    category: "background",
    name: "Background Boxes",
    description: "Grid of animated boxes",
    bestFor: ["backgrounds", "sections"],
    requiredData: [],
    supportsSizes: ["full"],
    supportsThemes: ["professional", "minimal", "modern"],
  },
  "background-gradient": {
    type: "background-gradient",
    category: "background",
    name: "Background Gradient",
    description: "Animated gradient background",
    bestFor: ["hero sections", "cards"],
    requiredData: [],
    supportsSizes: ["small", "medium", "large", "full"],
    supportsThemes: ["professional", "creative", "minimal", "bold", "modern"],
  },
  "background-lines": {
    type: "background-lines",
    category: "background",
    name: "Background Lines",
    description: "Animated wave lines",
    bestFor: ["backgrounds", "sections"],
    requiredData: [],
    supportsSizes: ["full"],
    supportsThemes: ["professional", "minimal", "modern"],
  },
  "bento-grid": {
    type: "bento-grid",
    category: "content",
    name: "Bento Grid",
    description: "Masonry-style grid layout",
    bestFor: ["overview", "features"],
    requiredData: ["experience", "projects", "skills", "education"],
    supportsSizes: ["medium", "large", "full"],
    supportsThemes: ["professional", "minimal", "modern"],
  },
  "canvas-reveal-effect": {
    type: "canvas-reveal-effect",
    category: "interactive",
    name: "Canvas Reveal",
    description: "WebGL canvas reveal effect",
    bestFor: ["interactive sections", "reveals"],
    requiredData: [],
    supportsSizes: ["medium", "large", "full"],
    supportsThemes: ["creative", "bold", "modern"],
  },
  "card-hover-effect": {
    type: "card-hover-effect",
    category: "card",
    name: "Card Hover Effect",
    description: "Cards with hover animations",
    bestFor: ["projects", "services"],
    requiredData: ["projects"],
    supportsSizes: ["small", "medium", "large"],
    supportsThemes: ["professional", "minimal", "modern"],
  },
  "card-spotlight": {
    type: "card-spotlight",
    category: "card",
    name: "Card Spotlight",
    description: "Cards with spotlight effect",
    bestFor: ["features", "highlights"],
    requiredData: ["personalInfo"],
    supportsSizes: ["small", "medium", "large"],
    supportsThemes: ["creative", "bold", "modern"],
  },
  "card-stack": {
    type: "card-stack",
    category: "card",
    name: "Card Stack",
    description: "Stacked cards animation",
    bestFor: ["testimonials", "achievements"],
    requiredData: ["achievements"],
    supportsSizes: ["medium", "large"],
    supportsThemes: ["professional", "creative", "minimal"],
  },
  "cards": {
    type: "cards",
    category: "card",
    name: "Cards Collection",
    description: "Various card styles",
    bestFor: ["multiple uses", "flexible content"],
    requiredData: ["personalInfo"],
    supportsSizes: ["small", "medium", "large"],
    supportsThemes: ["professional", "creative", "minimal", "bold", "modern"],
  },
  "carousel": {
    type: "carousel",
    category: "carousel",
    name: "Carousel",
    description: "Image carousel with controls",
    bestFor: ["portfolio", "projects"],
    requiredData: ["projects"],
    supportsSizes: ["small", "medium", "large", "full"],
    supportsThemes: ["professional", "creative", "minimal", "modern"],
  },
  "floating-navbar": {
    type: "floating-navbar",
    category: "navigation",
    name: "Floating Navbar",
    description: "Auto-hiding navigation",
    bestFor: ["main navigation"],
    requiredData: ["personalInfo"],
    supportsSizes: ["full"],
    supportsThemes: ["professional", "minimal", "modern"],
  },
  "hover-effect-v2": {
    type: "hover-effect-v2",
    category: "interactive",
    name: "Hover Effect V2",
    description: "Enhanced hover effects",
    bestFor: ["skills", "services"],
    requiredData: ["skills"],
    supportsSizes: ["small", "medium", "large"],
    supportsThemes: ["professional", "minimal", "modern"],
  },
  "meteors": {
    type: "meteors",
    category: "background",
    name: "Meteors",
    description: "Falling meteor animation",
    bestFor: ["backgrounds", "accents"],
    requiredData: [],
    supportsSizes: ["small", "medium", "large", "full"],
    supportsThemes: ["creative", "bold", "modern"],
  },
  "timeline": {
    type: "timeline",
    category: "content",
    name: "Timeline",
    description: "Vertical timeline display",
    bestFor: ["experience", "education", "journey"],
    requiredData: ["experience"],
    supportsSizes: ["medium", "large", "full"],
    supportsThemes: ["professional", "minimal", "modern"],
  },
};