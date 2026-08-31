/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['lucide-react'],
  // The EpicContext design-system chapter frames component previews at the
  // conventional /__ec/preview path. Next excludes _-prefixed folders from
  // routing, so the page lives at /ec-preview and this rewrite provides the
  // canonical URL.
  async rewrites() {
    return [{ source: '/__ec/preview', destination: '/ec-preview' }];
  },
  // Support for importing stories directly
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
    };
    return config;
  },
};

module.exports = nextConfig;