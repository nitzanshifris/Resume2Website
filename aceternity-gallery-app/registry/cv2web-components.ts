// CV2WEB Component Registry
// Maps CV2WEB component needs to Aceternity components

export const CV2WEB_COMPONENTS = {
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
export function getComponentsByFrequency(frequency: 'always' | 'common' | 'occasional'): CV2WebComponentKey[] {
  return Object.keys(CV2WEB_COMPONENTS).filter(
    key => CV2WEB_COMPONENTS[key as CV2WebComponentKey].usageFrequency === frequency
  ) as CV2WebComponentKey[];
}

// Core components that should be included in every CV2WEB bundle
export const ALWAYS_INCLUDED = getComponentsByFrequency('always');
export const COMMONLY_INCLUDED = getComponentsByFrequency('common');
export const OCCASIONALLY_INCLUDED = getComponentsByFrequency('occasional');