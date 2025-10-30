#!/bin/bash

# Script to replace useGlobals with useStorybookTheme in all story files

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
  "src/components/layout/page-templates/dashboard.stories.tsx"
  "src/components/layout/page-templates/campaign-overview.stories.tsx"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing $file..."

    # Replace the import statement
    sed -i '' "s/import { useGlobals } from '@storybook\/preview-api';/import { useStorybookTheme } from '@\/contexts\/storybook-theme-context';/g" "$file"

    # Replace useGlobals usage
    sed -i '' 's/const \[globals\] = useGlobals();/const { theme: storybookTheme } = useStorybookTheme();/g' "$file"
    sed -i '' 's/const currentTheme = globals\.theme || /const currentTheme = storybookTheme || /g' "$file"

    echo "  - Updated $file"
  else
    echo "Skipping $file - not found"
  fi
done

echo "Done! All files updated to use useStorybookTheme context hook."
