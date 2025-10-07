'use client';

import { OfflineInstoreRunning } from '@/components/layout/page-templates/campaign-details.stories';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function OfflineInstoreCampaignDetailsPage() {
  const router = useRouter();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const tabContent = target.closest('[role="tabpanel"]');

      if (tabContent && tabContent.getAttribute('aria-labelledby')?.includes('line-items')) {
        const row = target.closest('tr');
        if (row && row.querySelector('td')) {
          const lineItemId = row.querySelector('td:nth-child(2)')?.textContent;
          if (lineItemId) {
            e.preventDefault();
            e.stopPropagation();
            router.push(`/campaigns/offline-instore/line-item/${lineItemId}`);
          }
        }
      }

      if (tabContent && tabContent.getAttribute('aria-labelledby')?.includes('creatives')) {
        const row = target.closest('tr');
        if (row && row.querySelector('td')) {
          const creativeId = row.querySelector('td:nth-child(2)')?.textContent;
          if (creativeId) {
            e.preventDefault();
            e.stopPropagation();
            router.push(`/campaigns/offline-instore/creative/${creativeId}`);
          }
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [router]);

  const Component = OfflineInstoreRunning.render || (() => <div>Offline In-store Campaign Details</div>);
  return <Component />;
}
