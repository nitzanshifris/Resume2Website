import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  stories: [
    "../packages/**/src/**/*.stories.@(js|jsx|ts|tsx|mdx)"
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
      "@cv2web/design-tokens": require('path').resolve(__dirname, "../packages/design-tokens"),
      "@cv2web/design-tokens/theme.css": require('path').resolve(__dirname, "../packages/design-tokens/theme.css"),
      "@aceternity/components-library": require('path').resolve(__dirname, "../aceternity-components-library/components/ui")
    };
    return config;
  }
};

export default config; 