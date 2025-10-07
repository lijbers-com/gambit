'use client';

import { GeneralInsights } from '@/components/layout/page-templates/performance-dashboard.stories';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function InsightsPage() {
  const router = useRouter();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (target.textContent?.includes('Full report') || target.textContent?.includes('full report')) {
        e.preventDefault();
        e.stopPropagation();
        window.open('/insights/report', '_blank');
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [router]);

  const Component = GeneralInsights.render as () => React.JSX.Element;

  if (!Component) {
    return <div>Insights Dashboard</div>;
  }

  return <Component />;
}
