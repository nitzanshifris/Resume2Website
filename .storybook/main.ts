import path from 'path';
import { fileURLToPath } from 'url';
import type { StorybookConfig } from "@storybook/nextjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: [
    "../packages/**/src/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    "../aceternity-components-library/components/**/*.stories.@(ts|tsx|mdx)",
    "../templates/**/*.stories.@(js|jsx|ts|tsx|mdx)"
  ],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions"
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {}
  },
  // Enable automatic generation of argTypes & docs from TypeScript interfaces
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop: any) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true)
    }
  },
  docs: {
    autodocs: true
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
      "@/components/magicui": path.resolve(__dirname, "../aceternity-components-library/components/ui/magicui"),
      "@/components": path.resolve(__dirname, "../aceternity-components-library/components"),
      "@/hooks": path.resolve(__dirname, "../aceternity-components-library/hooks"),
      "@/data": path.resolve(__dirname, "../aceternity-components-library/data"),
      "@/fonts": path.resolve(__dirname, "../aceternity-components-library/fonts"),
      "react-tweet/api": "react-tweet",
      "@": path.resolve(__dirname, "../aceternity-components-library")
    };
    // Debug: Log resolved aliases when Storybook starts
    console.log("Storybook webpack alias:", config.resolve.alias);
    return config;
  }
};

export default config; 