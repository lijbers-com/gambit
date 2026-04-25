'use client';
import { ContractDetail } from '@/components/layout/page-templates/contract-detail.stories';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import React from 'react';

export default function ContractDetailPage() {
  const router = useRouter();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[role="menu"]') || target.closest('[data-radix-popper-content-wrapper]')) return;
      const row = target.closest('tr[data-row-id]') as HTMLElement | null;
      if (row) {
        const id = row.getAttribute('data-row-id');
        if (id?.startsWith('BRD-')) {
          e.preventDefault();
          e.stopPropagation();
          router.push(`/configuration/brands-products/${id}`);
        }
      }
    };
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [router]);

  const Component = ContractDetail.render as () => React.JSX.Element;
  if (!Component) return <div>Contract Detail</div>;
  return <Component />;
}
