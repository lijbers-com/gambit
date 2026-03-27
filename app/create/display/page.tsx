'use client';

import { CreateDisplay } from '@/components/layout/page-templates/create-proposition-campaign.stories';

export default function CreateDisplayPage() {
  const Component = CreateDisplay.render as () => React.JSX.Element;

  if (!Component) {
    return <div>Display Campaign</div>;
  }

  return <Component />;
}
