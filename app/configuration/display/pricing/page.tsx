'use client';

import { DisplayPricing } from '@/components/layout/page-templates/engine-configuration.stories';

export default function DisplayConfigPricingPage() {
  const Component = DisplayPricing.render as () => React.JSX.Element;
  return <Component />;
}
