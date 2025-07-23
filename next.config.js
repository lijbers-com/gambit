/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Minimal config for Storybook compatibility
    return config;
  },
};

module.exports = nextConfig;