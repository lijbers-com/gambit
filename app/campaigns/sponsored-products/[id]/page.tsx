'use client';

import { SponsoredProductsRunning } from '@/components/layout/page-templates/campaign-details.stories';

export default function SponsoredProductsCampaignDetailsPage() {
  const Component = SponsoredProductsRunning.render as () => React.JSX.Element;

  if (!Component) {
    return <div>Sponsored Products Campaign Details</div>;
  }

  return <Component />;
}