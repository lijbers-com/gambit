'use client';

import { OfflineInstoreLists } from '@/components/layout/page-templates/engine-configuration.stories';

export default function OfflineInstoreConfigListsPage() {
  const Component = OfflineInstoreLists.render as () => React.JSX.Element;
  return <Component />;
}
