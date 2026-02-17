'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function NavigationWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleNavigation = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');


      // Don't handle clicks on dropdown triggers in side navigation
      if (target.closest('button[aria-haspopup="menu"]')) {
        return;
      }

      if (!link) return;

      const href = link.getAttribute('href');
      if (!href || href === '#' || href.startsWith('http')) return;

      // Map the navigation routes based on your structure
      const routeMap: Record<string, string> = {
        // Campaigns
        '/campaigns': '/campaigns',
        '/campaigns/sponsored-products': '/campaigns/sponsored-products',
        '/campaigns/display': '/campaigns/display',
        '/campaigns/digital-instore': '/campaigns/digital-instore',
        '/campaigns/offline-instore': '/campaigns/offline-instore',

        // Creatives
        '/creatives': '/creatives',
        '/creatives/sponsored-products': '/creatives',
        '/creatives/display': '/creatives',
        '/creatives/digital-instore': '/creatives',
        '/creatives/offline-instore': '/creatives',

        // Calendar/Bookings
        '/calendar/sponsored-products': '/calendar/sponsored-products',
        '/calendar/display': '/calendar/display',
        '/calendar/digital-instore': '/calendar/digital-instore',
        '/calendar/offline-instore': '/calendar/offline-instore',

        // Insights
        '/insights': '/insights',
        '/insights/sponsored-products': '/insights',
        '/insights/display': '/insights',
        '/insights/digital-instore': '/insights',
        '/insights/offline-instore': '/insights',

        // Yield
        '/yield': '/yield',
        '/yield/sponsored-products': '/yield',
        '/yield/display': '/yield',
        '/yield/digital-instore': '/yield',
        '/yield/offline-instore': '/yield',

        // AdGenie chats
        '/chats/new': '/chat',

        // Configuration
        '/configuration/display': '/configuration/display',
        '/configuration/sponsored-products': '/configuration/sponsored-products',
        '/configuration/digital-instore': '/configuration/digital-instore',
        '/configuration/offline-instore': '/configuration/offline-instore',

        // Profile and notifications
        '/profile': '/profile',
        '/notifications': '/notifications',

        // Create
        '/create/media-experience': '/create/media-experience',
        '/create/sponsored-products': '/create/sponsored-products',
        '/create/display': '/create/display',
        '/create/offline-instore': '/create/offline-instore',
        '/create/digital-instore': '/create/digital-instore',
        '/create/extended-reach': '/create/extended-reach',

        // Root
        '/': '/login'
      };

      const mappedRoute = routeMap[href] || href;

      e.preventDefault();
      e.stopPropagation();

      // Don't navigate if we're already on the page
      if (pathname !== mappedRoute) {
        router.push(mappedRoute);
      }
    };

    // Add event listener to catch all navigation clicks
    document.addEventListener('click', handleNavigation, true);

    return () => {
      document.removeEventListener('click', handleNavigation, true);
    };
  }, [router, pathname]);

  // Also handle the collapse/expand button functionality
  useEffect(() => {
    const handleCollapseToggle = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Check if it's the collapse/expand button
      if (target.closest('button[aria-label*="collapse"]') ||
          target.closest('button[aria-label*="expand"]')) {
        // The MenuContext should handle this, but we can add additional logic if needed
      }
    };

    document.addEventListener('click', handleCollapseToggle);

    return () => {
      document.removeEventListener('click', handleCollapseToggle);
    };
  }, []);

  return <>{children}</>;
}