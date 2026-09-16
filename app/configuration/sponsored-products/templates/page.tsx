'use client';

import { SponsoredProductsTemplates } from '@/components/layout/page-templates/engine-configuration.stories';

export default function SponsoredProductsConfigTemplatesPage() {
  const Component = SponsoredProductsTemplates.render as () => React.JSX.Element;
  return <Component />;
}
