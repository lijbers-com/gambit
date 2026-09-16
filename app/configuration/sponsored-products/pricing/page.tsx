'use client';

import { SponsoredProductsPricing } from '@/components/layout/page-templates/engine-configuration.stories';

export default function SponsoredProductsConfigPricingPage() {
  const Component = SponsoredProductsPricing.render as () => React.JSX.Element;
  return <Component />;
}
