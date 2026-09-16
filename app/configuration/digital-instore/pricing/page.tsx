'use client';

import { DigitalInstorePricing } from '@/components/layout/page-templates/engine-configuration.stories';

export default function DigitalInstoreConfigPricingPage() {
  const Component = DigitalInstorePricing.render as () => React.JSX.Element;
  return <Component />;
}
