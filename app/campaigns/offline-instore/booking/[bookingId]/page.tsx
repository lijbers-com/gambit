'use client';

import { OfflineInStore as BookingOffline } from '@/components/layout/page-templates/line-item-detail.stories';

export default function OfflineInstoreBookingDetailPage() {
  const Component = BookingOffline.render as () => React.JSX.Element;

  if (!Component) {
    return <div>Offline In-store Booking Detail</div>;
  }

  return <Component />;
}
