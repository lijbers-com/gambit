'use client';

import { Display as CreativeDisplay } from '@/components/layout/page-templates/creative-detail.stories';

export default function OffsiteCreativeDetailPage() {
  const Component = CreativeDisplay.render as () => React.JSX.Element;

  if (!Component) {
    return <div>Offsite Creative Detail</div>;
  }

  return <Component />;
}
