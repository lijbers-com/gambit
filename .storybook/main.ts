import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from 'vite';
import { resolve } from 'path';

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
      // Storybook already copies staticDirs (../public) into the output.
      // Vite's own publicDir copy of the same folder runs in parallel with
      // it during `storybook build`, and the two racing mkdir calls fail
      // with EEXIST on slow machines (the Vercel build). One copier only.
      publicDir: false,
      // Add dependencies to pre-optimization
      optimizeDeps: {
        include: ['@radix-ui/react-dialog', '@radix-ui/react-slot'],
      },
      resolve: {
        alias: {
          'next/navigation': resolve(__dirname, '../src/lib/router-context.tsx'),
          'next/router': resolve(__dirname, '../src/lib/router-context.tsx'),
          'next/link': resolve(__dirname, '../src/lib/router-context.tsx'),
          'next/image': resolve(__dirname, '../src/lib/router-context.tsx'),
        },
      },
    });
  },
};

export default config;