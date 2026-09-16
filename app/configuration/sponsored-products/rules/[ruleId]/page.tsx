'use client';

import { SponsoredProductsRule } from '@/components/layout/page-templates/engine-configuration.stories';

export default function SponsoredProductsConfigRulePage() {
  const Component = SponsoredProductsRule.render as () => React.JSX.Element;
  return <Component />;
}
