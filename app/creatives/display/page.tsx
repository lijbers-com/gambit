'use client';

import { Display } from '@/components/layout/page-templates/creative-overview-proposition.stories';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DisplayCreativesPage() {
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
          router.push(`/creatives/display/${creativeId}`);
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [router]);

  const Component = Display.render as () => React.JSX.Element;

  if (!Component) {
    return <div>Display Creatives</div>;
  }

  return <Component />;
}
