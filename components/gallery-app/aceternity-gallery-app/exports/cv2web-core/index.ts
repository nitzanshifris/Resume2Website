// RESUME2WEBSITE Core Components Bundle
// Ready-to-use components for RESUME2WEBSITE portfolio generation

// Hero Components
export { HeroParallax } from './components/hero-parallax';
export { Header } from './components/hero-parallax/hero-parallax';
export { default as HeroHighlight } from './components/hero-highlight';

// Content Components  
export { Timeline } from './components/timeline';
export { BentoGrid, BentoGridItem } from './components/bento-grid';
export { CardHoverEffect } from './components/card-hover-effect';

// Text Effects
export { TextGenerateEffect } from './components/text-effects/text-generate-effect';

// Navigation
export { FloatingDock } from './components/floating-dock';

// Testimonials & Social Proof
export { AnimatedTestimonials } from './components/animated-testimonials';

// 3D Effects
export { Card3D } from './components/3d-card';

// UI Components
export { AnimatedTooltip } from './components/animated-tooltip';

// Utilities
export { cn } from './lib/utils';

// Types - Common interfaces for RESUME2WEBSITE
export interface Resume2WebsiteTimelineEntry {
  title: string;      // Company/School name
  subtitle: string;   // Position/Degree
  date: string;       // Date range
  description?: string;
  bullets?: string[];
}

export interface Resume2WebsiteHeroData {
  title: string;
  subtitle: string;
  description: string;
  products?: {
    title: string;
    link: string;
    thumbnail: string;
  }[];
}

export interface Resume2WebsiteSkillsData {
  title: string;
  description: string;
  items: {
    title: string;
    description: string;
    icon?: React.ReactNode;
    header?: React.ReactNode;
    className?: string;
  }[];
}

export interface Resume2WebsiteProjectData {
  title: string;
  description: string;
  link: string;
  image?: string;
}

// Component Props Types
export type { TimelineEntry } from './components/timeline/timeline';
export type { BentoGridProps } from './components/bento-grid/bento-grid';