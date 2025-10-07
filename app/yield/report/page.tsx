'use client';

import { YieldReportView } from '@/components/layout/page-templates/yield-dashboard.stories';

export default function YieldReportPage() {
  const Component = YieldReportView.render || (() => <div>Yield Report View</div>);
  return <Component />;
}
