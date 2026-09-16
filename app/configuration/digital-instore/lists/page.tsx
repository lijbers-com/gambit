'use client';

import { DigitalInstoreLists } from '@/components/layout/page-templates/engine-configuration.stories';

export default function DigitalInstoreConfigListsPage() {
  const Component = DigitalInstoreLists.render as () => React.JSX.Element;
  return <Component />;
}
