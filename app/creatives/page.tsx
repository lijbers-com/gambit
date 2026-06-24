'use client';

import { CreativeOverview } from '@/components/layout/page-templates/creative-overview.stories';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Map the creative type label shown in the table to its detail-route slug.
const TYPE_SLUG: Record<string, string> = {
  'Display': 'display',
  'Digital In-Store': 'digital-instore',
  'Offline In-Store': 'offline-instore',
  'Sponsored Products': 'sponsored-products',
};

export default function CreativesPage() {
  const router = useRouter();

  // Single, unified creative overview (all propositions). Row clicks deep-link
  // into the matching creative detail page based on the row's type.
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Don't deep-link when interacting with row actions, links, or an open modal.
      if (target.closest('button, a, [role="dialog"], [role="menu"]')) return;
      const row = target.closest('tr');
      if (!row) return;

      const cells = Array.from(row.querySelectorAll('td'));
      const idCell = cells.find((td) => /CR-\d+/.test(td.textContent || ''));
      const id = idCell?.textContent?.match(/CR-\d+/)?.[0];
      if (!id) return;

      // Find the type by matching any cell's text to a known type label, so
      // this keeps working regardless of column order.
      const typeLabel = cells.map((td) => td.textContent?.trim() || '').find((t) => TYPE_SLUG[t]) || '';
      const slug = TYPE_SLUG[typeLabel] || 'display';

      e.preventDefault();
      e.stopPropagation();
      router.push(`/creatives/${slug}/${id}`);
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [router]);

  const Component = CreativeOverview.render as () => React.JSX.Element;

  if (!Component) {
    return <div>Creatives</div>;
  }

  return <Component />;
}
