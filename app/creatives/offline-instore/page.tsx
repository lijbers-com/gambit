'use client';

import { OfflineInStore } from '@/components/layout/page-templates/creative-overview-proposition.stories';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function OfflineInstoreCreativesPage() {
  const router = useRouter();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const row = target.closest('tr');

      if (row && row.querySelector('td')) {
        const creativeId = row.querySelector('td')?.textContent;

        if (creativeId) {
          e.preventDefault();
          e.stopPropagation();
          router.push(`/creatives/offline-instore/${creativeId}`);
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [router]);

  const Component = OfflineInStore.render as () => React.JSX.Element;

  if (!Component) {
    return <div>Offline In-Store Creatives</div>;
  }

  return <Component />;
}
