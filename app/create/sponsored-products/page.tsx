'use client';

import { CreateSponsoredProducts } from '@/components/layout/page-templates/create-proposition-campaign.stories';

export default function CreateSponsoredProductsPage() {
  const Component = CreateSponsoredProducts.render as () => React.JSX.Element;

  if (!Component) {
    return <div>Sponsored Products Campaign</div>;
  }

  return <Component />;
}
