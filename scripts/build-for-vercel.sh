#!/bin/bash
set -e

echo "Building Next.js app..."
npm run build

echo "Building Storybook directly to public..."
rm -rf public/storybook
npx storybook build -o public/storybook

echo "Creating dummy routes-manifest.json in storybook-static to prevent Vercel error..."
mkdir -p storybook-static
echo '{"version": 3, "pages404": false, "basePath": "", "redirects": [], "rewrites": [], "headers": [], "dynamicRoutes": [], "staticRoutes": []}' > storybook-static/routes-manifest.json

echo "Build complete!"