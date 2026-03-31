'use client';

import { OffsiteDisplay } from '@/components/layout/page-templates/line-item-detail.stories';

export default function OffsiteLineItemDetailPage() {
  const Component = OffsiteDisplay.render as () => React.JSX.Element;

  if (!Component) {
    return <div>Offsite Line Item Detail</div>;
  }

  return <Component />;
}
