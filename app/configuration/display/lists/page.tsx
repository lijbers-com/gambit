'use client';

import { DisplayLists } from '@/components/layout/page-templates/engine-configuration.stories';

export default function DisplayConfigListsPage() {
  const Component = DisplayLists.render as () => React.JSX.Element;
  return <Component />;
}
