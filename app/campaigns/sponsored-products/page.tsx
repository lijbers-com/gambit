'use client';

import { SponsoredProducts } from '@/components/layout/page-templates/campaign-overview.stories';

export default function SponsoredProductsCampaignsPage() {
  const Component = SponsoredProducts.render as () => React.JSX.Element;
  if (!Component) return <div>Sponsored Products Campaigns</div>;
  return <Component />;
}
