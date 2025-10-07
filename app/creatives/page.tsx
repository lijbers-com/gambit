'use client';

import { CreativeOverview } from '@/components/layout/page-templates/creative-overview.stories';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CreativesOverviewPage() {
  const router = useRouter();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const row = target.closest('tr');

      if (row && row.querySelector('td')) {
        const creativeId = row.querySelector('td')?.textContent;
        const typeCell = row.querySelector('td:nth-child(3)')?.textContent?.toLowerCase();
        
        if (creativeId && typeCell) {
          let type = 'display';
          if (typeCell.includes('digital')) type = 'digital-instore';
          if (typeCell.includes('offline')) type = 'offline-instore';
          
          e.preventDefault();
          e.stopPropagation();
          router.push(`/creatives/${type}/${creativeId}`);
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [router]);

  const Component = CreativeOverview.render || (() => <div>Creative Overview</div>);
  return <Component />;
}
