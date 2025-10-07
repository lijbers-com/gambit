'use client';

import { OfflineInstore } from '@/components/layout/page-templates/engine-configuration.stories';

export default function OfflineInstoreConfigPage() {
  const Component = OfflineInstore.render || (() => <div>Offline In-store Configuration</div>);
  return <Component />;
}
