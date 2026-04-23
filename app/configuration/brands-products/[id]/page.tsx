'use client';
import { BrandDetail } from '@/components/layout/page-templates/brand-detail.stories';
import React from 'react';
export default function BrandDetailPage() {
  const Component = BrandDetail.render as () => React.JSX.Element;
  if (!Component) return <div>Brand Detail</div>;
  return <Component />;
}
