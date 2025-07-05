import path from 'path';
import { fileURLToPath } from 'url';
import type { StorybookConfig } from "@storybook/nextjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: [
    "../packages/**/src/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    "../aceternity-components-library/components/**/*.stories.@(ts|tsx|mdx)"
  ],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions"
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {}
  },
  webpackFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@cv2web/design-tokens": path.resolve(__dirname, "../packages/design-tokens"),
      "@cv2web/design-tokens/theme.css": path.resolve(__dirname, "../packages/design-tokens/theme.css"),
      "@aceternity/components-library": path.resolve(__dirname, "../aceternity-components-library/components/ui"),
      "@/component-library": path.resolve(__dirname, "../aceternity-components-library"),
      "@/lib": path.resolve(__dirname, "../aceternity-components-library/lib"),
      "@": path.resolve(__dirname, "../aceternity-components-library"),
      "@/components": path.resolve(__dirname, "../aceternity-components-library/components"),
      "@/hooks": path.resolve(__dirname, "../aceternity-components-library/hooks"),
      "@/data": path.resolve(__dirname, "../aceternity-components-library/data"),
      "@/fonts": path.resolve(__dirname, "../aceternity-components-library/fonts"),
      "react-tweet/api": "react-tweet"
    };
    return config;
  }
};

export default config; 