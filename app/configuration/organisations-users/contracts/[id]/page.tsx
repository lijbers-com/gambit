'use client';
import { ContractDetail } from '@/components/layout/page-templates/contract-detail.stories';
import React from 'react';
export default function ContractDetailPage() {
  const Component = ContractDetail.render as () => React.JSX.Element;
  if (!Component) return <div>Contract Detail</div>;
  return <Component />;
}
