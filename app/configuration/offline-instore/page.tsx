'use client';

import { OfflineInstore } from '@/components/layout/page-templates/engine-configuration.stories';

export default function OfflineInstoreConfigPage() {
  const Component = OfflineInstore.render as () => React.JSX.Element;

  if (!Component) {
    return <div>Offline In-store Configuration</div>;
  }

  return <Component />;
}
