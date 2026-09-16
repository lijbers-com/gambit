'use client';

import { OffsitePricing } from '@/components/layout/page-templates/engine-configuration.stories';

export default function OffsiteConfigPricingPage() {
  const Component = OffsitePricing.render as () => React.JSX.Element;
  return <Component />;
}
