'use client';

import { SponsoredProductsInOption } from '@/components/layout/page-templates/campaign-details.stories';

export default function CreateSponsoredProductsPage() {
  const Component = SponsoredProductsInOption.render as () => React.JSX.Element;

  if (!Component) {
    return <div>Sponsored Products Campaign</div>;
  }

  return <Component />;
}
