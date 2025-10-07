'use client';

import { YieldDashboard } from '@/components/layout/page-templates/yield-dashboard.stories';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function YieldPage() {
  const router = useRouter();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (target.textContent?.includes('Full report') || target.textContent?.includes('full report')) {
        e.preventDefault();
        e.stopPropagation();
        window.open('/yield/report', '_blank');
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [router]);

  const Component = YieldDashboard.render as () => React.JSX.Element;

  if (!Component) {
    return <div>Yield Dashboard</div>;
  }

  return <Component />;
}
