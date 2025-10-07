'use client';

import { SponsoredProducts } from '@/components/layout/page-templates/engine-configuration.stories';

export default function SponsoredProductsConfigPage() {
  const Component = SponsoredProducts.render || (() => <div>Sponsored Products Configuration</div>);
  return <Component />;
}
