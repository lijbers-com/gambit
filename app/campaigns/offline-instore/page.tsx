'use client';

import { OfflineInstore } from '@/components/layout/page-templates/campaign-overview.stories';

export default function OfflineInstoreCampaignsPage() {
  const Component = OfflineInstore.render as () => React.JSX.Element;
  if (!Component) return <div>Offline In-Store Campaigns</div>;
  return <Component />;
}
