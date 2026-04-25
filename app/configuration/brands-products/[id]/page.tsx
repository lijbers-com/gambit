'use client';
import { BrandDetail } from '@/components/layout/page-templates/brand-detail.stories';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import React from 'react';

export default function BrandDetailPage() {
  const router = useRouter();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[role="menu"]') || target.closest('[data-radix-popper-content-wrapper]')) return;
      const row = target.closest('tr[data-row-id]') as HTMLElement | null;
      if (row) {
        const id = row.getAttribute('data-row-id');
        if (id?.startsWith('SKU-')) {
          e.preventDefault();
          e.stopPropagation();
          router.push(`/configuration/brands-products/products/${id}`);
        }
      }
    };
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [router]);

  const Component = BrandDetail.render as () => React.JSX.Element;
  if (!Component) return <div>Brand Detail</div>;
  return <Component />;
}
