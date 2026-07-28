'use client';

import { Offsite } from '@/components/layout/page-templates/campaign-overview.stories';

export default function OffsiteCampaignsPage() {
  const Component = Offsite.render as () => React.JSX.Element;
  if (!Component) return <div>Offsite Campaigns</div>;
  return <Component />;
}
