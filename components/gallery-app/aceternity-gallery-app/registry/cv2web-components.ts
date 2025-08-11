// RESUME2WEBSITE Component Registry
// Maps RESUME2WEBSITE component needs to Aceternity components

export const RESUME2WEBSITE_COMPONENTS = {
  // Hero sections - always used
  'hero-parallax': {
    path: 'components/core/hero-parallax',
    dependencies: ['framer-motion', 'clsx'],
    externalDeps: ['motion/react'],
    category: 'hero',
    usageFrequency: 'always',
    description: 'Animated parallax hero section with product showcase'
  },
  'hero-highlight': {
    path: 'components/core/hero-highlight',
    dependencies: ['framer-motion', 'clsx'],
    externalDeps: ['framer-motion'],
    category: 'hero',
    usageFrequency: 'always',
    description: 'Hero section with text highlighting effects'
  },

  // Content sections - always used
  'timeline': {
    path: 'components/core/timeline',
    dependencies: ['framer-motion', 'clsx'],
    externalDeps: ['framer-motion'],
    category: 'content',
    usageFrequency: 'always',
    description: 'Timeline component for experience and education'
  },
  'bento-grid': {
    path: 'components/core/bento-grid',
    dependencies: ['clsx'],
    externalDeps: [],
    category: 'layout',
    usageFrequency: 'always',
    description: 'Grid layout for skills and services'
  },

  // Project showcases - common
  'card-hover-effect': {
    path: 'components/core/card-hover-effect',
    dependencies: ['framer-motion', 'clsx'],
    externalDeps: ['framer-motion'],
    category: 'content',
    usageFrequency: 'common',
    description: 'Interactive cards for project portfolios'
  },
  '3d-card': {
    path: 'components/core/3d-card',
    dependencies: ['framer-motion', 'clsx'],
    externalDeps: ['framer-motion'],
    category: 'content',
    usageFrequency: 'common',
    description: 'Alternative 3D card for projects'
  },

  // Text effects - common
  'text-generate-effect': {
    path: 'components/core/text-effects',
    files: ['text-generate-effect.tsx', 'text-generate-effect-demo.tsx'],
    dependencies: ['framer-motion', 'clsx'],
    externalDeps: ['framer-motion'],
    category: 'text',
    usageFrequency: 'common',
    description: 'Animated text generation for summaries'
  },

  // Navigation - common
  'floating-dock': {
    path: 'components/core/floating-dock',
    dependencies: ['framer-motion', 'clsx'],
    externalDeps: ['framer-motion', '@tabler/icons-react'],
    category: 'navigation',
    usageFrequency: 'common',
    description: 'Floating dock for contact information'
  },

  // Testimonials - occasional
  'animated-testimonials': {
    path: 'components/core/animated-testimonials',
    dependencies: ['framer-motion', 'clsx'],
    externalDeps: ['framer-motion'],
    category: 'content',
    usageFrequency: 'occasional',
    description: 'Animated testimonials for achievements'
  },

  // Tooltips - occasional
  'animated-tooltip': {
    path: 'components/core/animated-tooltip',
    dependencies: ['framer-motion', 'clsx'],
    externalDeps: ['framer-motion'],
    category: 'ui',
    usageFrequency: 'occasional',
    description: 'Animated tooltips for skills and languages'
  }
} as const;

export type Resume2WebsiteComponentKey = keyof typeof RESUME2WEBSITE_COMPONENTS;

// Get all dependencies for a set of components
export function getComponentDependencies(componentKeys: Resume2WebsiteComponentKey[]): string[] {
  const allDeps = new Set<string>();
  
  componentKeys.forEach(key => {
    const component = RESUME2WEBSITE_COMPONENTS[key];
    component.dependencies.forEach(dep => allDeps.add(dep));
    component.externalDeps.forEach(dep => allDeps.add(dep));
  });

  return Array.from(allDeps);
}

// Get components by usage frequency
export function getComponentsByFrequency(frequency: 'always' | 'common' | 'occasional'): Resume2WebsiteComponentKey[] {
  return Object.keys(RESUME2WEBSITE_COMPONENTS).filter(
    key => RESUME2WEBSITE_COMPONENTS[key as Resume2WebsiteComponentKey].usageFrequency === frequency
  ) as Resume2WebsiteComponentKey[];
}

// Core components that should be included in every RESUME2WEBSITE bundle
export const ALWAYS_INCLUDED = getComponentsByFrequency('always');
export const COMMONLY_INCLUDED = getComponentsByFrequency('common');
export const OCCASIONALLY_INCLUDED = getComponentsByFrequency('occasional');