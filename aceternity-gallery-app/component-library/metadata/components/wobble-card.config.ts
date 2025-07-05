import { ComponentConfig } from '../types';

export const wobbleCardConfig: ComponentConfig = {
  name: 'wobble-card',
  type: 'component',
  registryDependencies: [],
  dependencies: ['motion', 'clsx', 'tailwind-merge'],
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
  docs: '/components-gallery/wobble-card',
};