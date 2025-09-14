import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)"
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-docs",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  staticDirs: [
    "../public"
  ],
  docs: {
    autodocs: true,
  },
  async viteFinal(config) {
    // Merge custom configuration into the default config
    return mergeConfig(config, {
      // Add dependencies to pre-optimization
      optimizeDeps: {
        include: ['@radix-ui/react-dialog', '@radix-ui/react-slot'],
      },
    });
  },
};

export default config;