'use client';

import { Overview } from '@/components/layout/page-templates/media-products.stories';

export default function MediaProductsPage() {
  const Component = Overview.render as () => React.JSX.Element;
  return <Component />;
}
