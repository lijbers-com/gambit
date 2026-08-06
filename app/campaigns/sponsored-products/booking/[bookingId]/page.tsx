'use client';

import { SponsoredProducts as BookingSponsoredProducts } from '@/components/layout/page-templates/line-item-detail.stories';

export default function SponsoredProductsBookingDetailPage() {
  const Component = BookingSponsoredProducts.render as () => React.JSX.Element;

  if (!Component) {
    return <div>Sponsored Products Booking Detail</div>;
  }

  return <Component />;
}
