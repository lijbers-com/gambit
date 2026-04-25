'use client';
import { BrandOverview } from '@/components/layout/page-templates/brand-overview.stories';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import React from 'react';

export default function BrandsPage() {
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
          router.push(`/configuration/brands-products/${id}`);
        } else if (id?.startsWith('SKU-')) {
          e.preventDefault();
          router.push(`/configuration/brands-products/products/${id}`);
        }
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [router]);

  const Component = BrandOverview.render as () => React.JSX.Element;
  if (!Component) return <div>Brands</div>;
  return <Component />;
}
