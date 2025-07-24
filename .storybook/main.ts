import type { StorybookConfig } from "@storybook/nextjs";
import path from 'path';

const config: StorybookConfig = {
  stories: [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)"
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-docs",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {
      nextConfigPath: path.resolve(__dirname, '../next.config.ts'),
    },
  },
  staticDirs: [
    "../public"
  ],
  webpackFinal: async (config) => {
    // ULTRA NUCLEAR: Completely replace all entries to remove Storybook's HMR injection
    if (config.entry && typeof config.entry === 'object') {
      Object.keys(config.entry).forEach(key => {
        if (Array.isArray(config.entry[key])) {
          // Filter out ALL webpack-hot-middleware and HMR entries
          config.entry[key] = config.entry[key].filter(entry => 
            !entry.includes('webpack-hot-middleware') && 
            !entry.includes('__webpack_hmr') &&
            !entry.includes('hot-middleware') &&
            !entry.includes('webpack/hot/') &&
            !entry.includes('hotMiddleware')
          );
          // Add our polyfill first
          config.entry[key].unshift(path.resolve(__dirname, './refresh-polyfill.js'));
        }
      });
    }

    // Complete Node.js polyfills and fallbacks
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, '../src'),
        // Mock Next.js hooks for Storybook
        'next/navigation': path.resolve(__dirname, './mocks/next-navigation.js'),
        '@/hooks/use-menu': path.resolve(__dirname, './mocks/use-menu.js'),
      };
      
      config.resolve.fallback = {
        ...config.resolve.fallback,
        // Disable all Node.js modules entirely
        assert: false,
        buffer: false,
        console: false,
        constants: false,
        crypto: false,
        domain: false,
        events: false,
        fs: false,
        http: false,
        https: false,
        os: false,
        path: false,
        punycode: false,
        process: false,
        querystring: false,
        stream: false,
        string_decoder: false,
        sys: false,
        timers: false,
        tty: false,
        url: false,
        util: false,
        vm: false,
        zlib: false,
      };
    }

    // NUCLEAR OPTION: Completely disable ALL HMR and React Fast Refresh
    if (config.plugins) {
      config.plugins = config.plugins.filter(plugin => {
        const name = plugin.constructor.name;
        return !name.includes('ReactRefreshPlugin') && 
               !name.includes('ReactRefresh') &&
               !name.includes('ReactFresh') &&
               !name.includes('HotModuleReplacementPlugin') &&
               !name.includes('HotModuleReplacement');
      });
    }

    // ULTRA NUCLEAR: Override webpack dev server middleware entirely
    config.infrastructureLogging = { level: 'error' };
    
    // Completely disable webpack-dev-server's HMR
    if (config.devServer) {
      delete config.devServer.hot;
      delete config.devServer.liveReload;
      delete config.devServer.client;
    }
    
    // Override any middleware configuration
    config.stats = { logging: 'error', warnings: false };

    // Remove ALL React Fast Refresh loaders
    if (config.module && config.module.rules) {
      config.module.rules.forEach((rule: any) => {
        if (rule.use && Array.isArray(rule.use)) {
          rule.use = rule.use.filter((use: any) => {
            if (typeof use === 'string') {
              return !use.includes('react-refresh');
            }
            if (typeof use === 'object' && use.loader) {
              return !use.loader.includes('react-refresh');
            }
            return true;
          });
        }
      });
    }

    // Set production mode for stable JSX runtime
    config.mode = 'production';
    config.cache = false;
    
    // Add DefinePlugin to globally disable everything and fix JSX runtime
    const webpack = require('webpack');
    if (config.plugins) {
      config.plugins.push(new webpack.DefinePlugin({
        '__REACT_REFRESH__': JSON.stringify(false),
        'process.env.FAST_REFRESH': JSON.stringify(false),
        '__webpack_hot_middleware_reporter__': JSON.stringify(false),
        'module.hot': JSON.stringify(false),
        '__resourceQuery': JSON.stringify(''),
        'process.env.WEBPACK_HMR': JSON.stringify(false),
        'process.env.NODE_ENV': JSON.stringify('production')
      }));
      
      // Also add a plugin to completely override HMR behavior
      config.plugins.push(new webpack.NormalModuleReplacementPlugin(
        /webpack-hot-middleware\/client/,
        path.resolve(__dirname, './mocks/empty-module.js')
      ));
    }

    // Disable all dev server options that might trigger HMR
    config.devServer = {
      ...config.devServer,
      hot: false,
      liveReload: false,
      inline: false
    };

    // Enable source maps for debugging
    config.devtool = 'cheap-module-source-map';
    
    return config;
  },
};

export default config;