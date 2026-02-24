'use client';

import { OffsiteRunning } from '@/components/layout/page-templates/campaign-details.stories';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function OffsiteCampaignDetailsPage() {
  const router = useRouter();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Check if we're in the line items tab
      const tabContent = target.closest('[role="tabpanel"]');
      if (tabContent && tabContent.getAttribute('aria-labelledby')?.includes('line-items')) {
        const row = target.closest('tr');
        if (row && row.querySelector('td')) {
          const lineItemId = row.querySelector('td:nth-child(2)')?.textContent;
          if (lineItemId) {
            e.preventDefault();
            e.stopPropagation();
            router.push(`/campaigns/offsite/line-item/${lineItemId}`);
          }
        }
      }

      // Check if we're in the creatives tab
      if (tabContent && tabContent.getAttribute('aria-labelledby')?.includes('creatives')) {
        const row = target.closest('tr');
        if (row && row.querySelector('td')) {
          const creativeId = row.querySelector('td:nth-child(2)')?.textContent;
          if (creativeId) {
            e.preventDefault();
            e.stopPropagation();
            router.push(`/campaigns/offsite/creative/${creativeId}`);
          }
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [router]);

  const Component = OffsiteRunning.render as () => React.JSX.Element;

  if (!Component) {
    return <div>Offsite Campaign Details</div>;
  }

  return <Component />;
}
