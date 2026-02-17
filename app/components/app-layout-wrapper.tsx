'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Override the handlers for dropdown menu and other actions
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const text = target.textContent?.toLowerCase() || '';


      // Specific check for dropdown trigger buttons in side navigation
      const dropdownTrigger = target.closest('button[aria-haspopup="menu"]');
      if (dropdownTrigger) {
        e.stopPropagation();
        e.preventDefault();
        return;
      }

      // Don't handle any buttons with dropdown-related attributes
      if (target.closest('[data-state="closed"]') ||
          target.closest('[data-state="open"]') ||
          target.closest('button[aria-expanded]') ||
          target.closest('[id^="radix-"]')) {
        return;
      }

      // Don't handle profile button clicks in side navigation
      if (target.closest('.side-navigation') &&
          (text.includes('jane') || text.includes('profile')) &&
          !target.closest('[role="menuitem"]')) {
        return;
      }

      // Handle dropdown menu items from side navigation
      if (target.closest('[role="menuitem"]')) {
        // Create menu items — route to create pages
        const createRoutes: Record<string, string> = {
          'media experience': '/create/media-experience',
          'sponsored product campaign': '/create/sponsored-products',
          'display campaign': '/create/display',
          'offline in-store campaign': '/create/offline-instore',
          'digital in-store campaign': '/create/digital-instore',
          'extended reach campaign': '/create/extended-reach',
        };

        for (const [label, route] of Object.entries(createRoutes)) {
          if (text.includes(label)) {
            e.preventDefault();
            e.stopPropagation();
            router.push(route);
            return;
          }
        }

        // Profile/account menu items
        if (text.includes('logout')) {
          e.preventDefault();
          e.stopPropagation();
          router.push('/login');
          return;
        }

        if (text.includes('profile')) {
          e.preventDefault();
          e.stopPropagation();
          router.push('/profile');
          return;
        }

        if (text.includes('notifications')) {
          e.preventDefault();
          e.stopPropagation();
          router.push('/notifications');
          return;
        }

        if (text.includes('organisation') || text.includes('organization')) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }

        if (text.includes('information')) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }

        // For unrecognized menu items, don't block — let the default handler work
        return;
      }

      // Check if it's a logout button/link (legacy)
      if (target.textContent?.toLowerCase().includes('logout') ||
          target.closest('[aria-label*="logout"]')) {
        e.preventDefault();
        e.stopPropagation();
        router.push('/login');
        return;
      }

      // Handle page header action buttons - only intercept buttons that are in the page header
      // Look for buttons with specific data attributes or that are direct children of the page header
      const button = target.closest('button');
      if (button && button.closest('[class*="page-header"]')) {
        const buttonText = button.textContent?.toLowerCase() || '';

        if (buttonText.includes('edit') || buttonText.includes('export') ||
            buttonText.includes('import') || buttonText.includes('settings')) {
          e.preventDefault();
          e.stopPropagation();
          console.log(`Action clicked: ${buttonText}`);
          // These are placeholder actions in the page header
          return;
        }
      }
    };

    document.addEventListener('click', handleClick, { capture: true, passive: false });
    return () => document.removeEventListener('click', handleClick, { capture: true });
  }, [router]);

  return <>{children}</>;
}