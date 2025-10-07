'use client';

import { YieldReportView } from '@/components/layout/page-templates/yield-dashboard.stories';

export default function YieldReportPage() {
  const Component = YieldReportView.render as () => React.JSX.Element;

  if (!Component) {
    return <div>Yield Report View</div>;
  }

  return <Component />;
}
