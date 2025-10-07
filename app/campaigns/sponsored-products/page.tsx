'use client';

import { SponsoredProducts } from '@/components/layout/page-templates/campaign-overview.stories';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SponsoredProductsCampaignsPage() {
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
          router.push(`/campaigns/sponsored-products/${campaignId}`);
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [router]);

  const Component = SponsoredProducts.render as () => React.JSX.Element;

  if (!Component) {
    return <div>Sponsored Products Campaigns</div>;
  }

  return <Component />;
}
