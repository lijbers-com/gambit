'use client';

import { DigitalInStore } from '@/components/layout/page-templates/campaign-overview.stories';

export default function DigitalInstoreCampaignsPage() {
  const Component = DigitalInStore.render as () => React.JSX.Element;
  if (!Component) return <div>Digital In-Store Campaigns</div>;
  return <Component />;
}
