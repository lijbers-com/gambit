'use client';

import { Overview } from '@/components/layout/page-templates/billing-overview.stories';

export default function BillingPage() {
  const Component = Overview.render as () => React.JSX.Element;
  return <Component />;
}
