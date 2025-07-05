// CV2WEB Component Registry - Comprehensive Version
// Maps CV2WEB component needs to Aceternity components
// Updated to include all 78 components from catalog

export const CV2WEB_COMPONENTS = {
  // ============================================
  // HERO SECTION COMPONENTS - Always Used
  // ============================================
  'hero-highlight': {
    path: 'components/ui/hero-highlight',
    dependencies: ['framer-motion', 'clsx'],
    externalDeps: ['framer-motion'],
    category: 'hero',
    usageFrequency: 'always',
    mvpSuitable: true,
    description: 'Hero section with text highlighting effects',
    visualImpact: 8,
    cvSections: ['hero']
  },
  
  // Note: hero-parallax excluded for MVP (requires images)
  // 'hero-parallax': excluded - requires product images

  // ============================================
  // BACKGROUND EFFECTS - No Data Required
  // ============================================
  'aurora-background': {
    path: 'components/ui/aurora-background',
    dependencies: ['clsx'],
    externalDeps: [],
    category: 'background',
    usageFrequency: 'common',
    mvpSuitable: true,
    description: 'Animated aurora gradient background effect',
    visualImpact: 9,
    cvSections: ['hero', 'any_section']
  },
  
  'background-beams': {
    path: 'components/ui/background-beams',
    dependencies: ['clsx'],
    externalDeps: [],
    category: 'background',
    usageFrequency: 'common',
    mvpSuitable: true,
    description: 'Animated light beam background effect',
    visualImpact: 8,
    cvSections: ['hero', 'any_section']
  },
  
  'background-beams-with-collision': {
    path: 'components/ui/background-beams-with-collision',
    dependencies: ['framer-motion', 'clsx'],
    externalDeps: ['framer-motion'],
    category: 'background',
    usageFrequency: 'occasional',
    mvpSuitable: true,
    description: 'Interactive background beams with collision detection',
    visualImpact: 9,
    cvSections: ['hero', 'any_section']
  },
  
  'background-boxes': {
    path: 'components/ui/background-boxes',
    dependencies: ['framer-motion', 'clsx'],
    externalDeps: ['framer-motion'],
    category: 'background',
    usageFrequency: 'occasional',
    mvpSuitable: true,
    description: 'Animated background boxes pattern',
    visualImpact: 7,
    cvSections: ['any_section']
  },
  
  'background-gradient': {
    path: 'components/ui/background-gradient',
    dependencies: ['framer-motion', 'clsx'],
    externalDeps: ['framer-motion'],
    category: 'background',
    usageFrequency: 'common',
    mvpSuitable: true,
    description: 'Dynamic gradient background for cards',
    visualImpact: 7,
    cvSections: ['any_section']
  },
  
  'background-gradient-animation': {
    path: 'components/ui/background-gradient-animation',
    dependencies: ['clsx'],
    externalDeps: [],
    category: 'background',
    usageFrequency: 'occasional',
    mvpSuitable: true,
    description: 'Animated gradient transitions',
    visualImpact: 8,
    cvSections: ['hero', 'any_section']
  },
  
  'background-lines': {
    path: 'components/ui/background-lines',
    dependencies: ['clsx'],
    externalDeps: [],
    category: 'background',
    usageFrequency: 'occasional',
    mvpSuitable: true,
    description: 'Animated diagonal lines pattern',
    visualImpact: 6,
    cvSections: ['any_section']
  },
  
  'grid-and-dot-backgrounds': {
    path: 'components/ui/grid-and-dot-backgrounds',
    dependencies: ['clsx'],
    externalDeps: [],
    category: 'background',
    usageFrequency: 'occasional',
    mvpSuitable: true,
    description: 'Grid and dot pattern backgrounds',
    visualImpact: 5,
    cvSections: ['any_section']
  },
  
  'meteors': {
    path: 'components/ui/meteors',
    dependencies: ['clsx'],
    externalDeps: [],
    category: 'background',
    usageFrequency: 'occasional',
    mvpSuitable: true,
    description: 'Falling meteors animation effect',
    visualImpact: 8,
    cvSections: ['achievements', 'any_section']
  },
  
  'shooting-stars': {
    path: 'components/ui/shooting-stars',
    dependencies: ['clsx'],
    externalDeps: [],
    category: 'background',
    usageFrequency: 'occasional',
    mvpSuitable: true,
    description: 'Animated shooting stars effect',
    visualImpact: 7,
    cvSections: ['achievements', 'any_section']
  },
  
  'sparkles': {
    path: 'components/ui/sparkles',
    dependencies: ['clsx'],
    externalDeps: [],
    category: 'background',
    usageFrequency: 'occasional',
    mvpSuitable: true,
    description: 'Sparkling animation effect',
    visualImpact: 6,
    cvSections: ['achievements', 'any_section']
  },
  
  'spotlight': {
    path: 'components/ui/spotlight',
    dependencies: ['clsx'],
    externalDeps: [],
    category: 'background',
    usageFrequency: 'occasional',
    mvpSuitable: true,
    description: 'Spotlight effect on mouse movement',
    visualImpact: 8,
    cvSections: ['hero', 'any_section']
  },
  
  'vortex': {
    path: 'components/ui/vortex',
    dependencies: ['framer-motion', 'clsx'],
    externalDeps: ['framer-motion'],
    category: 'background',
    usageFrequency: 'occasional',
    mvpSuitable: true,
    description: 'Swirling vortex particle effect',
    visualImpact: 9,
    cvSections: ['hero']
  },
  
  'wavy-background': {
    path: 'components/ui/wavy-background',
    dependencies: ['simplex-noise', 'clsx'],
    externalDeps: ['simplex-noise'],
    category: 'background',
    usageFrequency: 'occasional',
    mvpSuitable: true,
    description: 'Organic wave animation background',
    visualImpact: 8,
    cvSections: ['hero', 'any_section']
  },

  // ============================================
  // CONTENT SECTIONS - Always Used
  // ============================================
  'timeline': {
    path: 'components/ui/timeline',
    dependencies: ['framer-motion', 'clsx'],
    externalDeps: ['framer-motion'],
    category: 'content',
    usageFrequency: 'always',
    mvpSuitable: true,
    description: 'Timeline component for experience and education',
    visualImpact: 7,
    cvSections: ['experience', 'education', 'volunteer']
  },
  
  'bento-grid': {
    path: 'components/ui/bento-grid',
    dependencies: ['clsx'],
    externalDeps: [],
    category: 'layout',
    usageFrequency: 'always',
    mvpSuitable: true,
    description: 'Grid layout for skills and services',
    visualImpact: 8,
    cvSections: ['skills', 'hobbies', 'certifications'],
    minimumItems: 3
  },
  
  'sticky-scroll-reveal': {
    path: 'components/ui/sticky-scroll-reveal',
    dependencies: ['framer-motion', 'clsx'],
    externalDeps: ['framer-motion'],
    category: 'content',
    usageFrequency: 'common',
    mvpSuitable: true,
    description: 'Sticky scroll with content reveal',
    visualImpact: 9,
    cvSections: ['experience', 'projects'],
    minimumItems: 2
  },
  
  'tracing-beam': {
    path: 'components/ui/tracing-beam',
    dependencies: ['framer-motion', 'clsx'],
    externalDeps: ['framer-motion'],
    category: 'content',
    usageFrequency: 'common',
    mvpSuitable: true,
    description: 'Animated beam following content scroll',
    visualImpact: 8,
    cvSections: ['experience', 'education']
  },

  // ============================================
  // CARD COMPONENTS - Common Usage
  // ============================================
  'card-hover-effect': {
    path: 'components/ui/card-hover-effect',
    dependencies: ['framer-motion', 'clsx'],
    externalDeps: ['framer-motion'],
    category: 'content',
    usageFrequency: 'always',
    mvpSuitable: true,
    description: 'Interactive cards for project portfolios',
    visualImpact: 8,
    cvSections: ['projects', 'publications', 'volunteer'],
    minimumItems: 2
  },
  
  '3d-card': {
    path: 'components/ui/3d-card',
    dependencies: ['framer-motion', 'clsx'],
    externalDeps: ['framer-motion'],
    category: 'content',
    usageFrequency: 'common',
    mvpSuitable: true,
    description: '3D perspective card animations',
    visualImpact: 8,
    cvSections: ['projects', 'achievements', 'certifications']
  },
  
  '3d-pin': {
    path: 'components/ui/3d-pin',
    dependencies: ['framer-motion', 'clsx'],
    externalDeps: ['framer-motion'],
    category: 'content',
    usageFrequency: 'occasional',
    mvpSuitable: true,
    description: '3D pin effect on hover',
    visualImpact: 9,
    cvSections: ['projects', 'publications', 'patents']
  },
  
  'card-spotlight': {
    path: 'components/ui/card-spotlight',
    dependencies: ['framer-motion', 'clsx'],
    externalDeps: ['framer-motion'],
    category: 'content',
    usageFrequency: 'common',
    mvpSuitable: true,
    description: 'Spotlight effect on card hover',
    visualImpact: 8,
    cvSections: ['certifications', 'patents']
  },
  
  'card-stack': {
    path: 'components/ui/card-stack',
    dependencies: ['framer-motion', 'clsx'],
    externalDeps: ['framer-motion'],
    category: 'content',
    usageFrequency: 'common',
    mvpSuitable: true,
    description: 'Swipeable stacked cards',
    visualImpact: 8,
    cvSections: ['projects', 'testimonials'],
    minimumItems: 3
  },
  
  'evervault-card': {
    path: 'components/ui/evervault-card',
    dependencies: ['framer-motion', 'clsx'],
    externalDeps: ['framer-motion'],
    category: 'content',
    usageFrequency: 'occasional',
    mvpSuitable: true,
    description: 'Premium animated gradient cards',
    visualImpact: 9,
    cvSections: ['skills', 'certifications']
  },
  
  'expandable-cards': {
    path: 'components/ui/expandable-cards',
    dependencies: ['framer-motion', 'clsx'],
    externalDeps: ['framer-motion'],
    category: 'content',
    usageFrequency: 'common',
    mvpSuitable: true,
    description: 'Expandable card grid',
    visualImpact: 7,
    cvSections: ['projects', 'publications'],
    minimumItems: 2
  },
  
  'glare-card': {
    path: 'components/ui/glare-card',
    dependencies: ['clsx'],
    externalDeps: [],
    category: 'content',
    usageFrequency: 'occasional',
    mvpSuitable: true,
    description: 'Cards with glare effect on hover',
    visualImpact: 7,
    cvSections: ['summary', 'achievements']
  },
  
  'moving-border': {
    path: 'components/ui/moving-border',
    dependencies: ['framer-motion', 'clsx'],
    externalDeps: ['framer-motion'],
    category: 'content',
    usageFrequency: 'occasional',
    mvpSuitable: true,
    description: 'Button/card with animated border',
    visualImpact: 7,
    cvSections: ['contact', 'cta']
  },
  
  'text-reveal-card': {
    path: 'components/ui/text-reveal-card',
    dependencies: ['framer-motion', 'clsx'],
    externalDeps: ['framer-motion'],
    category: 'content',
    usageFrequency: 'occasional',
    mvpSuitable: true,
    description: 'Interactive text reveal on hover',
    visualImpact: 8,
    cvSections: ['achievements', 'summary']
  },
  
  'wobble-card': {
    path: 'components/ui/wobble-card',
    dependencies: ['framer-motion', 'clsx'],
    externalDeps: ['framer-motion'],
    category: 'content',
    usageFrequency: 'common',
    mvpSuitable: true,
    description: 'Cards with wobble animation',
    visualImpact: 7,
    cvSections: ['skills', 'hobbies']
  },

  // ============================================
  // TEXT EFFECTS - Common Usage
  // ============================================
  'text-generate-effect': {
    path: 'components/ui/text-generate-effect',
    dependencies: ['framer-motion', 'clsx'],
    externalDeps: ['framer-motion'],
    category: 'text',
    usageFrequency: 'always',
    mvpSuitable: true,
    description: 'Animated text generation for summaries',
    visualImpact: 8,
    cvSections: ['hero', 'summary']
  },
  
  'typewriter-effect': {
    path: 'components/ui/typewriter-effect',
    dependencies: ['framer-motion', 'clsx'],
    externalDeps: ['framer-motion'],
    category: 'text',
    usageFrequency: 'common',
    mvpSuitable: true,
    description: 'Classic typewriter text animation',
    visualImpact: 7,
    cvSections: ['hero', 'summary']
  },
  
  'flip-words': {
    path: 'components/ui/flip-words',
    dependencies: ['framer-motion', 'clsx'],
    externalDeps: ['framer-motion'],
    category: 'text',
    usageFrequency: 'common',
    mvpSuitable: true,
    description: 'Rotating words animation',
    visualImpact: 7,
    cvSections: ['hero', 'languages', 'hobbies'],
    minimumItems: 2
  },
  
  'google-gemini-effect': {
    path: 'components/ui/google-gemini-effect',
    dependencies: ['framer-motion', 'clsx'],
    externalDeps: ['framer-motion'],
    category: 'text',
    usageFrequency: 'occasional',
    mvpSuitable: true,
    description: 'Modern text reveal effect',
    visualImpact: 8,
    cvSections: ['summary', 'hero']
  },
  
  'text-hover-effect': {
    path: 'components/ui/text-hover-effect',
    dependencies: ['framer-motion', 'clsx'],
    externalDeps: ['framer-motion'],
    category: 'text',
    usageFrequency: 'occasional',
    mvpSuitable: true,
    description: 'Text transformation on hover',
    visualImpact: 6,
    cvSections: ['navigation', 'headers']
  },
  
  'colourful-text': {
    path: 'components/ui/colourful-text',
    dependencies: ['clsx'],
    externalDeps: [],
    category: 'text',
    usageFrequency: 'occasional',
    mvpSuitable: true,
    description: 'Gradient text animations',
    visualImpact: 6,
    cvSections: ['hero', 'hobbies']
  },
  
  'cover': {
    path: 'components/ui/cover',
    dependencies: ['framer-motion', 'clsx'],
    externalDeps: ['framer-motion'],
    category: 'text',
    usageFrequency: 'occasional',
    mvpSuitable: true,
    description: 'Text cover reveal effect',
    visualImpact: 7,
    cvSections: ['hero', 'headers']
  },

  // ============================================
  // NAVIGATION & UI ELEMENTS
  // ============================================
  'floating-dock': {
    path: 'components/ui/floating-dock',
    dependencies: ['framer-motion', 'clsx', '@tabler/icons-react'],
    externalDeps: ['framer-motion', '@tabler/icons-react'],
    category: 'navigation',
    usageFrequency: 'always',
    mvpSuitable: true,
    description: 'Floating dock for contact information',
    visualImpact: 7,
    cvSections: ['contact'],
    minimumItems: 3
  },
  
  'floating-navbar': {
    path: 'components/ui/floating-navbar',
    dependencies: ['framer-motion', 'clsx'],
    externalDeps: ['framer-motion'],
    category: 'navigation',
    usageFrequency: 'common',
    mvpSuitable: true,
    description: 'Sticky floating navigation bar',
    visualImpact: 6,
    cvSections: ['navigation']
  },
  
  'hover-border-gradient': {
    path: 'components/ui/hover-border-gradient',
    dependencies: ['clsx'],
    externalDeps: [],
    category: 'ui',
    usageFrequency: 'common',
    mvpSuitable: true,
    description: 'Buttons with animated gradient borders',
    visualImpact: 7,
    cvSections: ['contact', 'cta']
  },
  
  'spotlight-new': {
    path: 'components/ui/spotlight-new',
    dependencies: ['framer-motion', 'clsx'],
    externalDeps: ['framer-motion'],
    category: 'ui',
    usageFrequency: 'occasional',
    mvpSuitable: true,
    description: 'Enhanced spotlight effect component',
    visualImpact: 8,
    cvSections: ['hero', 'featured']
  },
  
  'tailwindcss-buttons': {
    path: 'components/ui/tailwindcss-buttons',
    dependencies: ['clsx'],
    externalDeps: [],
    category: 'ui',
    usageFrequency: 'common',
    mvpSuitable: true,
    description: 'Collection of animated buttons',
    visualImpact: 6,
    cvSections: ['contact', 'cta']
  },

  // ============================================
  // SPECIAL COMPONENTS
  // ============================================
  'animated-testimonials': {
    path: 'components/ui/animated-testimonials',
    dependencies: ['framer-motion', 'clsx'],
    externalDeps: ['framer-motion'],
    category: 'content',
    usageFrequency: 'common',
    mvpSuitable: true,
    description: 'Animated testimonials for achievements',
    visualImpact: 8,
    cvSections: ['achievements', 'recommendations'],
    minimumItems: 3
  },
  
  'animated-tooltip': {
    path: 'components/ui/animated-tooltip',
    dependencies: ['framer-motion', 'clsx'],
    externalDeps: ['framer-motion'],
    category: 'ui',
    usageFrequency: 'common',
    mvpSuitable: true,
    description: 'Animated tooltips for skills and languages',
    visualImpact: 6,
    cvSections: ['languages', 'skills', 'contact'],
    minimumItems: 2
  },
  
  'animated-modal': {
    path: 'components/ui/animated-modal',
    dependencies: ['framer-motion', 'clsx'],
    externalDeps: ['framer-motion'],
    category: 'modal',
    usageFrequency: 'occasional',
    mvpSuitable: true,
    description: 'Modal dialogs for detailed content',
    visualImpact: 8,
    cvSections: ['projects', 'experience']
  },
  
  'canvas-reveal-effect': {
    path: 'components/ui/canvas-reveal-effect',
    dependencies: ['clsx'],
    externalDeps: [],
    category: 'effect',
    usageFrequency: 'occasional',
    mvpSuitable: true,
    description: 'Canvas-based reveal animations',
    visualImpact: 9,
    cvSections: ['hero', 'featured']
  },
  
  'glowing-stars': {
    path: 'components/ui/glowing-stars',
    dependencies: ['clsx'],
    externalDeps: [],
    category: 'effect',
    usageFrequency: 'occasional',
    mvpSuitable: true,
    description: 'Glowing star animations',
    visualImpact: 8,
    cvSections: ['achievements', 'hero']
  },
  
  'infinite-moving-cards': {
    path: 'components/ui/infinite-moving-cards',
    dependencies: ['framer-motion', 'clsx'],
    externalDeps: ['framer-motion'],
    category: 'carousel',
    usageFrequency: 'common',
    mvpSuitable: true,
    description: 'Auto-scrolling card carousel',
    visualImpact: 8,
    cvSections: ['certifications', 'courses', 'testimonials'],
    minimumItems: 3
  },
  
  'lamp': {
    path: 'components/ui/lamp',
    dependencies: ['framer-motion', 'clsx'],
    externalDeps: ['framer-motion'],
    category: 'effect',
    usageFrequency: 'occasional',
    mvpSuitable: true,
    description: 'Lamp lighting effect',
    visualImpact: 8,
    cvSections: ['hero', 'featured']
  },
  
  'link-preview': {
    path: 'components/ui/link-preview',
    dependencies: ['framer-motion', 'clsx'],
    externalDeps: ['framer-motion'],
    category: 'ui',
    usageFrequency: 'occasional',
    mvpSuitable: true,
    description: 'Link hover preview component',
    visualImpact: 6,
    cvSections: ['projects', 'publications']
  },
  
  'multi-step-loader': {
    path: 'components/ui/multi-step-loader',
    dependencies: ['framer-motion', 'clsx', 'lucide-react'],
    externalDeps: ['framer-motion', 'lucide-react'],
    category: 'loader',
    usageFrequency: 'rare',
    mvpSuitable: true,
    description: 'Multi-step loading animation',
    visualImpact: 7,
    cvSections: ['loading_states']
  },
  
  'svg-mask-effect': {
    path: 'components/ui/svg-mask-effect',
    dependencies: ['framer-motion', 'clsx'],
    externalDeps: ['framer-motion'],
    category: 'effect',
    usageFrequency: 'occasional',
    mvpSuitable: true,
    description: 'SVG mask reveal effects',
    visualImpact: 8,
    cvSections: ['hero', 'featured']
  },

  // ============================================
  // EXCLUDED COMPONENTS (Require Images)
  // ============================================
  // These are documented but not included in MVP
  // - 3d-marquee: Requires images for carousel
  // - apple-cards-carousel: Requires product images
  // - compare: Requires before/after images
  // - container-scroll-animation: Requires hero image
  // - direction-aware-hover: Requires gallery images
  // - focus-cards: Requires image gallery
  // - globe: Requires coordinate data
  // - hero-parallax: Requires product images
  // - images-slider: Requires background images
  // - lens: Requires images to magnify
  // - macbook-scroll: Requires screen content
  // - parallax-scroll: Requires image gallery
  // - world-map: Requires location data
  // - file-upload: Not suitable for CV
  // - signup-form: Not suitable for CV
  // - placeholders-and-vanish-input: Not suitable for CV

} as const;

export type CV2WebComponentKey = keyof typeof CV2WEB_COMPONENTS;

// Get all dependencies for a set of components
export function getComponentDependencies(componentKeys: CV2WebComponentKey[]): string[] {
  const allDeps = new Set<string>();
  
  componentKeys.forEach(key => {
    const component = CV2WEB_COMPONENTS[key];
    component.dependencies.forEach(dep => allDeps.add(dep));
    component.externalDeps.forEach(dep => allDeps.add(dep));
  });

  return Array.from(allDeps);
}

// Get components by usage frequency
export function getComponentsByFrequency(frequency: 'always' | 'common' | 'occasional' | 'rare'): CV2WebComponentKey[] {
  return Object.keys(CV2WEB_COMPONENTS).filter(
    key => CV2WEB_COMPONENTS[key as CV2WebComponentKey].usageFrequency === frequency
  ) as CV2WebComponentKey[];
}

// Get MVP-suitable components
export function getMVPComponents(): CV2WebComponentKey[] {
  return Object.keys(CV2WEB_COMPONENTS).filter(
    key => CV2WEB_COMPONENTS[key as CV2WebComponentKey].mvpSuitable === true
  ) as CV2WebComponentKey[];
}

// Get components by CV section
export function getComponentsByCVSection(section: string): CV2WebComponentKey[] {
  return Object.keys(CV2WEB_COMPONENTS).filter(
    key => CV2WEB_COMPONENTS[key as CV2WebComponentKey].cvSections.includes(section)
  ) as CV2WebComponentKey[];
}

// Get components by visual impact
export function getComponentsByVisualImpact(minImpact: number): CV2WebComponentKey[] {
  return Object.keys(CV2WEB_COMPONENTS).filter(
    key => CV2WEB_COMPONENTS[key as CV2WebComponentKey].visualImpact >= minImpact
  ) as CV2WebComponentKey[];
}

// Core components that should be included in every CV2WEB bundle
export const ALWAYS_INCLUDED = getComponentsByFrequency('always');
export const COMMONLY_INCLUDED = getComponentsByFrequency('common');
export const OCCASIONALLY_INCLUDED = getComponentsByFrequency('occasional');
export const MVP_COMPONENTS = getMVPComponents();

// Component counts
export const COMPONENT_STATS = {
  total: Object.keys(CV2WEB_COMPONENTS).length,
  mvpSuitable: getMVPComponents().length,
  alwaysUsed: ALWAYS_INCLUDED.length,
  commonlyUsed: COMMONLY_INCLUDED.length,
  occasionallyUsed: OCCASIONALLY_INCLUDED.length
};

// Section-specific recommendations
export const SECTION_RECOMMENDATIONS = {
  hero: ['hero-highlight', 'aurora-background', 'text-generate-effect', 'typewriter-effect'],
  contact: ['floating-dock', 'hover-border-gradient', 'animated-tooltip'],
  summary: ['text-generate-effect', 'google-gemini-effect', 'text-reveal-card'],
  experience: ['timeline', 'sticky-scroll-reveal', 'tracing-beam'],
  education: ['timeline', 'card-hover-effect'],
  skills: ['bento-grid', 'animated-tooltip', 'wobble-card', 'evervault-card'],
  projects: ['card-hover-effect', '3d-card', '3d-pin', 'expandable-cards'],
  achievements: ['animated-testimonials', 'glowing-stars', 'text-reveal-card'],
  certifications: ['infinite-moving-cards', 'card-spotlight', 'bento-grid'],
  languages: ['animated-tooltip', 'flip-words'],
  hobbies: ['bento-grid', 'wobble-card', 'flip-words']
};