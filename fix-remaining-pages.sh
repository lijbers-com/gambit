#!/bin/bash

# Fix all remaining campaign line-item and creative pages
files=(
  "app/campaigns/display/line-item/[lineItemId]/page.tsx"
  "app/campaigns/display/creative/[creativeId]/page.tsx"
  "app/campaigns/digital-instore/line-item/[lineItemId]/page.tsx"
  "app/campaigns/digital-instore/creative/[creativeId]/page.tsx"
  "app/campaigns/offline-instore/line-item/[lineItemId]/page.tsx"
  "app/campaigns/offline-instore/creative/[creativeId]/page.tsx"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Fixing $file..."

    # Replace the pattern: Component = X.render || (() => <div>Y</div>); return <Component />;
    # With: Component = X.render; if (!Component) { return <div>Y</div>; } return <Component {...({} as any)} />;

    sed -i '' 's/const Component = \([^|]*\) || (\([^)]*\));/const Component = \1;/g' "$file"

    # Replace return <Component />; with proper pattern
    sed -i '' 's/return <Component \/>;/if (!Component) {\n    return <div>Component Detail<\/div>;\n  }\n\n  return <Component {...({} as any)} \/>;/g' "$file"

    echo "Fixed $file"
  else
    echo "File not found: $file"
  fi
done

echo "All pages fixed!"