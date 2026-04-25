'use client';
import { TokenDetail } from '@/components/layout/page-templates/token-detail.stories';
import React from 'react';

export default function TokenDetailPage() {
  const Component = TokenDetail.render as () => React.JSX.Element;
  if (!Component) return <div>Token Detail</div>;
  return <Component />;
}
