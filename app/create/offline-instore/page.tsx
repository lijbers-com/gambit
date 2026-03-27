'use client';

import { CreateOfflineInstore } from '@/components/layout/page-templates/create-proposition-campaign.stories';

export default function CreateOfflineInstorePage() {
  const Component = CreateOfflineInstore.render as () => React.JSX.Element;

  if (!Component) {
    return <div>Offline In-Store Campaign</div>;
  }

  return <Component />;
}
