'use client';

import { Display } from '@/components/layout/page-templates/campaign-overview.stories';

export default function DisplayCampaignsPage() {
  const Component = Display.render as () => React.JSX.Element;
  if (!Component) return <div>Display Campaigns</div>;
  return <Component />;
}
