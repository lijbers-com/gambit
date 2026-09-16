'use client';

import { OfflineInstorePricing } from '@/components/layout/page-templates/engine-configuration.stories';

export default function OfflineInstoreConfigPricingPage() {
  const Component = OfflineInstorePricing.render as () => React.JSX.Element;
  return <Component />;
}
