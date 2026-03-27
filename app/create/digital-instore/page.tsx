'use client';

import { CreateDigitalInstore } from '@/components/layout/page-templates/create-proposition-campaign.stories';

export default function CreateDigitalInstorePage() {
  const Component = CreateDigitalInstore.render as () => React.JSX.Element;

  if (!Component) {
    return <div>Digital In-Store Campaign</div>;
  }

  return <Component />;
}
