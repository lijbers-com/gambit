'use client';

import { DigitalInStore } from '@/components/layout/page-templates/campaign-overview.stories';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DigitalInStoreCampaignsPage() {
  const router = useRouter();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const row = target.closest('tr');

      if (row && row.querySelector('td')) {
        const cells = row.querySelectorAll('td');
        const campaignId = Array.from(cells).map(td => td.textContent?.trim()).find(t => t?.startsWith('C-'));
        if (campaignId) {
          e.preventDefault();
          e.stopPropagation();
          router.push(`/campaigns/digital-instore/${campaignId}`);
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [router]);

  const Component = DigitalInStore.render as () => React.JSX.Element;

  if (!Component) {
    return <div>Digital In-store Campaigns</div>;
  }

  return <Component />;
}
