import { ComponentConfig } from '../types';

export const typewriterEffectConfig: ComponentConfig = {
  name: 'typewriter-effect',
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
  docs: '/components-gallery/typewriter-effect',
};