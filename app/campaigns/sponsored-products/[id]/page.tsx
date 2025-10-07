'use client';

import { SponsoredProductsRunning } from '@/components/layout/page-templates/campaign-details.stories';

export default function SponsoredProductsCampaignDetailsPage() {
  const Component = SponsoredProductsRunning.render || (() => <div>Sponsored Products Campaign Details</div>);
  return <Component />;
}