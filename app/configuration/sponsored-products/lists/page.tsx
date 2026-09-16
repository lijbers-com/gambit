'use client';

import { SponsoredProductsLists } from '@/components/layout/page-templates/engine-configuration.stories';

export default function SponsoredProductsConfigListsPage() {
  const Component = SponsoredProductsLists.render as () => React.JSX.Element;
  return <Component />;
}
