'use client';

import { DigitalInStore as BookingDigital } from '@/components/layout/page-templates/line-item-detail.stories';

export default function DigitalInstoreBookingDetailPage() {
  const Component = BookingDigital.render as () => React.JSX.Element;

  if (!Component) {
    return <div>Digital In-store Booking Detail</div>;
  }

  return <Component />;
}
