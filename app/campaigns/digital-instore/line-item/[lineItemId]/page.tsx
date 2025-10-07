'use client';

import { DigitalInStore as LineItemDigital } from '@/components/layout/page-templates/line-item-detail.stories';

export default function DigitalInstoreLineItemDetailPage() {
  const Component = LineItemDigital.render || (() => <div>Digital In-store Line Item Detail</div>);
  return <Component />;
}
