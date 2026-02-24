'use client';

import { Offsite } from '@/components/layout/page-templates/campaign-overview.stories';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function OffsiteCampaignsPage() {
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
          router.push(`/campaigns/offsite/${campaignId}`);
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [router]);

  const Component = Offsite.render as () => React.JSX.Element;

  if (!Component) {
    return <div>Offsite Campaigns</div>;
  }

  return <Component />;
}
