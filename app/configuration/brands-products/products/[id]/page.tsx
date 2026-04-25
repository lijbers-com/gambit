'use client';
import { ProductDetail } from '@/components/layout/page-templates/product-detail.stories';
import React from 'react';

export default function ProductDetailPage() {
  const Component = ProductDetail.render as () => React.JSX.Element;
  if (!Component) return <div>Product Detail</div>;
  return <Component />;
}
