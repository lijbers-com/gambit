'use client';

import { OfflineInstoreRunning } from '@/components/layout/page-templates/campaign-details.stories';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function OfflineInstoreCampaignDetailsPage() {
  const router = useRouter();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const row = target.closest('tr');

      if (row && row.querySelector('td')) {
        const cells = row.querySelectorAll('td');
        const cellTexts = Array.from(cells).map(td => td.textContent?.trim());

        const lineItemId = cellTexts.find(t => t?.startsWith('LI-'));
        if (lineItemId) {
          e.preventDefault();
          e.stopPropagation();
          router.push(`/campaigns/offline-instore/line-item/${lineItemId}`);
          return;
        }

        const creativeId = cellTexts.find(t => t?.startsWith('CR-'));
        if (creativeId) {
          e.preventDefault();
          e.stopPropagation();
          router.push(`/campaigns/offline-instore/creative/${creativeId}`);
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [router]);

  const Component = OfflineInstoreRunning.render as () => React.JSX.Element;

  if (!Component) {
    return <div>Offline In-store Campaign Details</div>;
  }

  return <Component />;
}
