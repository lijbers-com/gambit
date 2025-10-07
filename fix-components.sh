#!/bin/bash

# Fix all calendar pages
cat > app/calendar/sponsored-products/page.tsx << 'EOF'
'use client';

import { SponsoredProductCalendar } from '@/components/layout/page-templates/bookings-calendar.stories';

export default function SponsoredProductsCalendarPage() {
  const Component = SponsoredProductCalendar.render;

  if (!Component) {
    return <div>Sponsored Products Calendar</div>;
  }

  return <Component {...({} as any)} />;
}
EOF

cat > app/calendar/display/page.tsx << 'EOF'
'use client';

import { DisplayCalendar } from '@/components/layout/page-templates/bookings-calendar.stories';

export default function DisplayCalendarPage() {
  const Component = DisplayCalendar.render;

  if (!Component) {
    return <div>Display Calendar</div>;
  }

  return <Component {...({} as any)} />;
}
EOF

cat > app/calendar/offline-instore/page.tsx << 'EOF'
'use client';

import { OfflineInstoreCalendar } from '@/components/layout/page-templates/bookings-calendar.stories';

export default function OfflineInstoreCalendarPage() {
  const Component = OfflineInstoreCalendar.render;

  if (!Component) {
    return <div>Offline In-store Calendar</div>;
  }

  return <Component {...({} as any)} />;
}
EOF

# Fix configuration pages
cat > app/configuration/sponsored-products/page.tsx << 'EOF'
'use client';

import { SponsoredProducts } from '@/components/layout/page-templates/engine-configuration.stories';

export default function SponsoredProductsConfigPage() {
  const Component = SponsoredProducts.render;

  if (!Component) {
    return <div>Sponsored Products Configuration</div>;
  }

  return <Component {...({} as any)} />;
}
EOF

cat > app/configuration/display/page.tsx << 'EOF'
'use client';

import { Display } from '@/components/layout/page-templates/engine-configuration.stories';

export default function DisplayConfigPage() {
  const Component = Display.render;

  if (!Component) {
    return <div>Display Configuration</div>;
  }

  return <Component {...({} as any)} />;
}
EOF

cat > app/configuration/digital-instore/page.tsx << 'EOF'
'use client';

import { DigitalInstore } from '@/components/layout/page-templates/engine-configuration.stories';

export default function DigitalInstoreConfigPage() {
  const Component = DigitalInstore.render;

  if (!Component) {
    return <div>Digital In-store Configuration</div>;
  }

  return <Component {...({} as any)} />;
}
EOF

cat > app/configuration/offline-instore/page.tsx << 'EOF'
'use client';

import { OfflineInstore } from '@/components/layout/page-templates/engine-configuration.stories';

export default function OfflineInstoreConfigPage() {
  const Component = OfflineInstore.render;

  if (!Component) {
    return <div>Offline In-store Configuration</div>;
  }

  return <Component {...({} as any)} />;
}
EOF

echo "All files fixed!"