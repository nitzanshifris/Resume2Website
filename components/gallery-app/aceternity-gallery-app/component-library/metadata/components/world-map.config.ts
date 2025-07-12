import { ComponentConfig } from '../types';

export const worldMapConfig: ComponentConfig = {
  name: 'world-map',
  type: 'component',
  registryDependencies: [],
  dependencies: ['motion', 'clsx', 'tailwind-merge', 'dotted-map', 'next-themes'],
  devDependencies: [],
  tailwind: {
    config: {
      theme: {
        extend: {},
      },
    },
  },
  cssVars: {},
  meta: {},
  docs: '/components-gallery/world-map',
};