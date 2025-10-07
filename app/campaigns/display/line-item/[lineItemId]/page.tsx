'use client';

import { Display as LineItemDisplay } from '@/components/layout/page-templates/line-item-detail.stories';

export default function DisplayLineItemDetailPage() {
  const Component = LineItemDisplay.render || (() => <div>Display Line Item Detail</div>);
  return <Component />;
}