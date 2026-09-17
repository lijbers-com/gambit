'use client';

import { Product } from '@/components/layout/page-templates/media-products.stories';

export default function MediaProductPage() {
  const Component = Product.render as () => React.JSX.Element;
  return <Component />;
}
