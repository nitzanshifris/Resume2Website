/**
 * Components Registry
 * Central registry for all base UI components
 */

export interface ComponentRegistryItem {
  name: string;
  path: string;
  category: 'base' | 'ui';
  description: string;
  tags: string[];
  dependencies: string[];
  status: 'stable' | 'beta' | 'experimental';
}

export const componentsRegistry: ComponentRegistryItem[] = [
  {
    name: '3d-card',
    path: '/components/base/3d-card',
    category: 'base',
    description: '3D card component with hover effects',
    tags: ['3d', 'card', 'interactive', 'animation'],
    dependencies: ['motion', 'clsx'],
    status: 'stable'
  },
  {
    name: 'animated-tooltip',
    path: '/components/base/animated-tooltip',
    category: 'base',
    description: 'Animated tooltip with motion effects',
    tags: ['tooltip', 'animation', 'ui'],
    dependencies: ['motion', 'clsx'],
    status: 'stable'
  },
  {
    name: 'timeline',
    path: '/components/base/timeline',
    category: 'base',
    description: 'Timeline component for displaying chronological data',
    tags: ['timeline', 'chronological', 'data-display'],
    dependencies: ['motion', 'clsx'],
    status: 'stable'
  }
];

export function getComponentByName(name: string): ComponentRegistryItem | undefined {
  return componentsRegistry.find(comp => comp.name === name);
}

export function getComponentsByCategory(category: 'base' | 'ui'): ComponentRegistryItem[] {
  return componentsRegistry.filter(comp => comp.category === category);
}

export function getComponentsByTag(tag: string): ComponentRegistryItem[] {
  return componentsRegistry.filter(comp => comp.tags.includes(tag));
}