#!/bin/bash
set -e

echo "Building Next.js app..."
npm run build

echo "Building Storybook..."
npm run build-storybook

echo "Moving Storybook to public directory..."
rm -rf public/storybook
mv storybook-static public/storybook

echo "Creating dummy routes-manifest.json to satisfy Vercel..."
echo '{"version": 3, "pages404": false, "basePath": "", "redirects": [], "rewrites": [], "headers": [], "dynamicRoutes": [], "staticRoutes": []}' > public/storybook/routes-manifest.json

echo "Build complete!"