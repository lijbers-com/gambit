'use client';

import { OfflineInstore } from '@/components/layout/page-templates/campaign-overview.stories';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function OfflineInstoreCampaignsPage() {
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
          router.push(`/campaigns/offline-instore/${campaignId}`);
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [router]);

  const Component = OfflineInstore.render || (() => <div>Offline In-store Campaigns</div>);
  return <Component />;
}
