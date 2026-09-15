'use client';

import { CreativeOverview } from '@/components/layout/page-templates/creative-overview.stories';

export default function CreativesPage() {
  const Component = CreativeOverview.render as () => React.JSX.Element;
  return <Component />;
}
