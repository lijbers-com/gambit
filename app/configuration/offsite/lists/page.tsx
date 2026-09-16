'use client';

import { OffsiteLists } from '@/components/layout/page-templates/engine-configuration.stories';

export default function OffsiteConfigListsPage() {
  const Component = OffsiteLists.render as () => React.JSX.Element;
  return <Component />;
}
