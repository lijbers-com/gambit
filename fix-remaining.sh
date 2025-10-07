#!/bin/bash

# Fix all campaign overview pages
for engine in "sponsored-products" "display" "digital-instore" "offline-instore"; do
  if [ "$engine" = "sponsored-products" ]; then
    import_name="SponsoredProducts"
    display_name="Sponsored Products"
  elif [ "$engine" = "display" ]; then
    import_name="Display"
    display_name="Display"
  elif [ "$engine" = "digital-instore" ]; then
    import_name="DigitalInStore"
    display_name="Digital In-store"
  elif [ "$engine" = "offline-instore" ]; then
    import_name="OfflineInstore"
    display_name="Offline In-store"
  fi

  cat > "app/campaigns/$engine/page.tsx" << EOF
'use client';

import { $import_name } from '@/components/layout/page-templates/campaign-overview.stories';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ${import_name}CampaignsPage() {
  const router = useRouter();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const row = target.closest('tr');

      if (row && row.querySelector('td')) {
        const campaignId = row.querySelector('td')?.textContent;
        if (campaignId && campaignId.startsWith('C-')) {
          e.preventDefault();
          e.stopPropagation();
          router.push(\`/campaigns/$engine/\${campaignId}\`);
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [router]);

  const Component = $import_name.render;
  
  if (!Component) {
    return <div>$display_name Campaigns</div>;
  }

  return <Component {...({} as any)} />;
}
EOF
done

# Fix other pages that have issues
cat > app/insights/page.tsx << 'EOF'
'use client';

import { GeneralInsights } from '@/components/layout/page-templates/performance-dashboard.stories';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function InsightsPage() {
  const router = useRouter();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (target.textContent?.includes('Full report') || target.textContent?.includes('full report')) {
        e.preventDefault();
        e.stopPropagation();
        window.open('/insights/report', '_blank');
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [router]);

  const Component = GeneralInsights.render;
  
  if (!Component) {
    return <div>Insights Dashboard</div>;
  }

  return <Component {...({} as any)} />;
}
EOF

cat > app/insights/report/page.tsx << 'EOF'
'use client';

import { ProductReportView } from '@/components/layout/page-templates/performance-dashboard.stories';

export default function InsightsReportPage() {
  const Component = ProductReportView.render;
  
  if (!Component) {
    return <div>Insights Report View</div>;
  }

  return <Component {...({} as any)} />;
}
EOF

cat > app/yield/page.tsx << 'EOF'
'use client';

import { YieldDashboard } from '@/components/layout/page-templates/yield-dashboard.stories';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function YieldPage() {
  const router = useRouter();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (target.textContent?.includes('Full report') || target.textContent?.includes('full report')) {
        e.preventDefault();
        e.stopPropagation();
        window.open('/yield/report', '_blank');
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [router]);

  const Component = YieldDashboard.render;
  
  if (!Component) {
    return <div>Yield Dashboard</div>;
  }

  return <Component {...({} as any)} />;
}
EOF

cat > app/yield/report/page.tsx << 'EOF'
'use client';

import { YieldReportView } from '@/components/layout/page-templates/yield-dashboard.stories';

export default function YieldReportPage() {
  const Component = YieldReportView.render;
  
  if (!Component) {
    return <div>Yield Report View</div>;
  }

  return <Component {...({} as any)} />;
}
EOF

cat > app/creatives/page.tsx << 'EOF'
'use client';

import { CreativeOverview } from '@/components/layout/page-templates/creative-overview.stories';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CreativesOverviewPage() {
  const router = useRouter();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const row = target.closest('tr');

      if (row && row.querySelector('td')) {
        const creativeId = row.querySelector('td')?.textContent;
        const typeCell = row.querySelector('td:nth-child(3)')?.textContent?.toLowerCase();
        
        if (creativeId && typeCell) {
          let type = 'display';
          if (typeCell.includes('digital')) type = 'digital-instore';
          if (typeCell.includes('offline')) type = 'offline-instore';
          
          e.preventDefault();
          e.stopPropagation();
          router.push(\`/creatives/\${type}/\${creativeId}\`);
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [router]);

  const Component = CreativeOverview.render;
  
  if (!Component) {
    return <div>Creative Overview</div>;
  }

  return <Component {...({} as any)} />;
}
EOF

echo "Remaining files fixed!"
