import preset from '@cv2web/tailwind-preset';
import type { Config } from 'tailwindcss';

const config: Config = {
  presets: [preset],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/**/src/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {}
  },
  plugins: []
};

export default config; 