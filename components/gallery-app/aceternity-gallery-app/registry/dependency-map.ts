// Dependency mapping for component extraction
// Tracks what files and packages each component needs

export const DEPENDENCY_MAP = {
  // Core utilities - always needed
  'lib/utils': {
    files: ['lib/utils.ts'],
    packageDeps: ['clsx', 'tailwind-merge'],
    exports: ['cn']
  },

  // Essential packages
  'framer-motion': {
    packageDeps: ['framer-motion'],
    peerDeps: ['react', 'react-dom']
  },
  'motion/react': {
    packageDeps: ['motion'],
    peerDeps: ['react', 'react-dom']
  },

  // Component-specific dependencies
  'hero-parallax': {
    files: [
      'components/core/hero-parallax/index.tsx',
      'components/core/hero-parallax/hero-parallax.tsx',
      'components/core/hero-parallax/hero-parallax-demo.tsx'
    ],
    dependencies: ['lib/utils', 'motion/react'],
    packageDeps: ['motion'],
    styleFiles: []
  },

  'timeline': {
    files: [
      'components/core/timeline/index.tsx',
      'components/core/timeline/timeline.tsx',
      'components/core/timeline/timeline-demo.tsx'
    ],
    dependencies: ['lib/utils', 'framer-motion'],
    packageDeps: ['framer-motion'],
    styleFiles: []
  },

  'bento-grid': {
    files: [
      'components/core/bento-grid/index.tsx',
      'components/core/bento-grid/bento-grid.tsx',
      'components/core/bento-grid/bento-grid-demo.tsx'
    ],
    dependencies: ['lib/utils'],
    packageDeps: [],
    styleFiles: []
  },

  'card-hover-effect': {
    files: [
      'components/core/card-hover-effect/index.tsx',
      'components/core/card-hover-effect/card-hover-effect.tsx',
      'components/core/card-hover-effect/card-hover-effect-demo.tsx'
    ],
    dependencies: ['lib/utils', 'framer-motion'],
    packageDeps: ['framer-motion'],
    styleFiles: []
  },

  'hero-highlight': {
    files: [
      'components/core/hero-highlight/index.tsx',
      'components/core/hero-highlight/hero-highlight.tsx',
      'components/core/hero-highlight/hero-highlight-demo.tsx'
    ],
    dependencies: ['lib/utils', 'framer-motion'],
    packageDeps: ['framer-motion'],
    styleFiles: []
  },

  'text-generate-effect': {
    files: [
      'components/core/text-effects/text-generate-effect.tsx',
      'components/core/text-effects/text-generate-effect-demo.tsx'
    ],
    dependencies: ['lib/utils', 'framer-motion'],
    packageDeps: ['framer-motion'],
    styleFiles: []
  },

  'floating-dock': {
    files: [
      'components/core/floating-dock/index.tsx'
    ],
    dependencies: ['lib/utils', 'framer-motion'],
    packageDeps: ['framer-motion', '@tabler/icons-react'],
    styleFiles: []
  },

  'animated-testimonials': {
    files: [
      'components/core/animated-testimonials/index.tsx',
      'components/core/animated-testimonials/animated-testimonials-demo.tsx'
    ],
    dependencies: ['lib/utils', 'framer-motion'],
    packageDeps: ['framer-motion'],
    styleFiles: []
  },

  '3d-card': {
    files: [
      'components/core/3d-card/index.tsx',
      'components/core/3d-card/3d-card.tsx',
      'components/core/3d-card/3d-card-demo.tsx',
      'components/core/3d-card/3d-card-demo-2.tsx'
    ],
    dependencies: ['lib/utils', 'framer-motion'],
    packageDeps: ['framer-motion'],
    styleFiles: ['components/core/3d-card/styles.css']
  },

  'animated-tooltip': {
    files: [
      'components/core/animated-tooltip/index.tsx',
      'components/core/animated-tooltip/demo.tsx'
    ],
    dependencies: ['lib/utils', 'framer-motion'],
    packageDeps: ['framer-motion'],
    styleFiles: []
  }
};

// Calculate all files needed for a component
export function getComponentFiles(componentKey: string): string[] {
  const component = DEPENDENCY_MAP[componentKey];
  if (!component) return [];

  const files = [...component.files];
  
  // Add dependency files
  component.dependencies?.forEach(dep => {
    const depFiles = DEPENDENCY_MAP[dep]?.files || [];
    files.push(...depFiles);
  });

  // Add style files
  if (component.styleFiles) {
    files.push(...component.styleFiles);
  }

  return [...new Set(files)]; // Remove duplicates
}

// Calculate all package dependencies for a component
export function getComponentPackages(componentKey: string): {
  dependencies: string[];
  peerDependencies: string[];
} {
  const component = DEPENDENCY_MAP[componentKey];
  if (!component) return { dependencies: [], peerDependencies: [] };

  const deps = new Set<string>();
  const peerDeps = new Set<string>();

  // Add direct dependencies
  component.packageDeps?.forEach(dep => deps.add(dep));
  component.peerDeps?.forEach(dep => peerDeps.add(dep));

  // Add dependency package deps
  component.dependencies?.forEach(dep => {
    const depComponent = DEPENDENCY_MAP[dep];
    depComponent?.packageDeps?.forEach(d => deps.add(d));
    depComponent?.peerDeps?.forEach(d => peerDeps.add(d));
  });

  return {
    dependencies: Array.from(deps),
    peerDependencies: Array.from(peerDeps)
  };
}