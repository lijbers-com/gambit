'use client';

import { OffsiteDisplay } from '@/components/layout/page-templates/line-item-detail.stories';

export default function OffsiteBookingDetailPage() {
  const Component = OffsiteDisplay.render as () => React.JSX.Element;

  if (!Component) {
    return <div>Offsite Booking Detail</div>;
  }

  return <Component />;
}
