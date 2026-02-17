'use client';

import { OfflineInstoreInOption } from '@/components/layout/page-templates/campaign-details.stories';

export default function CreateOfflineInstorePage() {
  const Component = OfflineInstoreInOption.render as () => React.JSX.Element;

  if (!Component) {
    return <div>Offline In-Store Campaign</div>;
  }

  return <Component />;
}
