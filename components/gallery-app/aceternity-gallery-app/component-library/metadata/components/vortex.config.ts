import { ComponentConfig } from '../types';

export const vortexConfig: ComponentConfig = {
  name: 'vortex',
  type: 'component',
  registryDependencies: [],
  dependencies: ['motion', 'clsx', 'tailwind-merge', 'simplex-noise'],
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
  docs: '/components-gallery/vortex',
};