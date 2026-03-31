'use client';

import { Display as BookingDisplay } from '@/components/layout/page-templates/line-item-detail.stories';

export default function DisplayBookingDetailPage() {
  const Component = BookingDisplay.render as () => React.JSX.Element;

  if (!Component) {
    return <div>Display Booking Detail</div>;
  }

  return <Component />;
}
