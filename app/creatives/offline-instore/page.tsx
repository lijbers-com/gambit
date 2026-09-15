'use client';

import { OfflineInStore } from '@/components/layout/page-templates/creative-overview-proposition.stories';

export default function CreativesPage() {
  const Component = OfflineInStore.render as () => React.JSX.Element;
  return <Component />;
}
