'use client';

import { SponsoredProducts } from '@/components/layout/page-templates/engine-configuration.stories';

export default function SponsoredProductsConfigPage() {
  const Component = SponsoredProducts.render as () => React.JSX.Element;

  if (!Component) {
    return <div>Sponsored Products Configuration</div>;
  }

  return <Component />;
}
