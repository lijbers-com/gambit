'use client';

import { OfflineInStore as LineItemOffline } from '@/components/layout/page-templates/line-item-detail.stories';

export default function OfflineInstoreLineItemDetailPage() {
  const Component = LineItemOffline.render || (() => <div>Offline In-store Line Item Detail</div>);
  return <Component />;
}
