'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Override the onLogout handler
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Check if it's a logout button/link
      if (target.textContent?.toLowerCase().includes('logout') ||
          target.closest('[aria-label*="logout"]')) {
        e.preventDefault();
        e.stopPropagation();
        router.push('/login');
        return;
      }

      // Handle page header action buttons
      const button = target.closest('button');
      if (button) {
        const text = button.textContent?.toLowerCase() || '';

        if (text.includes('edit') || text.includes('export') ||
            text.includes('import') || text.includes('settings')) {
          e.preventDefault();
          e.stopPropagation();
          console.log(`Action clicked: ${text}`);
          // These are placeholder actions in the stories
          return;
        }
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [router]);

  return <>{children}</>;
}