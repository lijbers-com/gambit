#!/bin/bash

# Script to update page template stories to be theme-aware
# This adds the necessary imports and modifies story render functions

FILES=(
  "src/components/layout/page-templates/performance-dashboard.stories.tsx"
  "src/components/layout/page-templates/campaign-details.stories.tsx"
  "src/components/layout/page-templates/creative-detail.stories.tsx"
  "src/components/layout/page-templates/creative-overview.stories.tsx"
  "src/components/layout/page-templates/engine-configuration.stories.tsx"
  "src/components/layout/page-templates/line-item-detail.stories.tsx"
  "src/components/layout/page-templates/media-cart.stories.tsx"
  "src/components/layout/page-templates/yield-dashboard.stories.tsx"
  "src/components/layout/page-templates/notification-center.stories.tsx"
  "src/components/layout/page-templates/bookings-calendar.stories.tsx"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing $file..."

    # 1. Add imports after defaultRoutes import if not already present
    if ! grep -q "getRoutesForTheme" "$file"; then
      sed -i '' "/import { defaultRoutes } from '..\/default-routes';/a\\
import { getRoutesForTheme } from '@/lib/theme-navigation';\\
import { useGlobals } from '@storybook/preview-api';
" "$file"
    fi

    echo "  - Added imports"
  else
    echo "Skipping $file - not found"
  fi
done

echo "Done! Now you need to manually update each story's render function to:"
echo "1. Add: const [globals] = useGlobals();"
echo "2. Add: const currentTheme = globals.theme || 'retailMedia';"
echo "3. Add: const routes = getRoutesForTheme(currentTheme);"
echo "4. Replace: routes={defaultRoutes} with routes={routes}"
