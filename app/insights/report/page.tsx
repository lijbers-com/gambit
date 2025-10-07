'use client';

import { ProductReportView } from '@/components/layout/page-templates/performance-dashboard.stories';

export default function InsightsReportPage() {
  const Component = ProductReportView.render || (() => <div>Insights Report View</div>);
  return <Component />;
}
