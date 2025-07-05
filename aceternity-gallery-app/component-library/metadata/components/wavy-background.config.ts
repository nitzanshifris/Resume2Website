import { ComponentConfig } from '../types';

export const wavyBackgroundConfig: ComponentConfig = {
  name: 'wavy-background',
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
  docs: '/components-gallery/wavy-background',
};