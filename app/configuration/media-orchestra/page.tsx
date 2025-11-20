'use client';

import { Overview } from '@/components/layout/page-templates/media-orchestra.stories';

export default function MediaOrchestraPage() {
  const Component = Overview.render as () => React.JSX.Element;

  if (!Component) {
    return <div>Media Orchestra</div>;
  }

  return <Component />;
}
