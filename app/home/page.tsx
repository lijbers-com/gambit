'use client';

import { Home as HomeStory } from '@/components/layout/page-templates/home.stories';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const router = useRouter();

  // Task widgets and release notes carry a `data-href`; route on click.
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const navEl = target.closest('[data-href]') as HTMLElement | null;
      const href = navEl?.getAttribute('data-href');
      if (href) {
        e.preventDefault();
        e.stopPropagation();
        router.push(href);
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [router]);

  const Component = HomeStory.render as () => React.JSX.Element;

  if (!Component) {
    return <div>Home</div>;
  }

  return <Component />;
}
