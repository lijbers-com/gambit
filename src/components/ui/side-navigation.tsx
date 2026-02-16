'use client';

import { cn } from '@/lib/utils';
import { NavigationItem } from './navigation-item';
import { NavigationItemWithSubmenu } from './navigation-item-with-submenu';
import { NavigationCreateItem } from './navigation-create-item';
import { useMenu } from '@/hooks/use-menu';
import { Logo } from './logo';
import { usePathname as usePathnameContext } from '@/lib/router-context';
import { Link } from '@/lib/router-context';
import { useEffect, useContext, useState } from 'react';
import { ThemeContext } from '@/contexts/theme-context';

// Try to import Next.js pathname
let usePathnameNext: (() => string) | null = null;

try {
  const nextNav = require('next/navigation');
  usePathnameNext = nextNav.usePathname;
} catch (e) {
  // Next.js not available (we're in Storybook)
}

export interface Route {
  id: number;
  name: string;
  url?: string;
  type?: 'parent' | 'title' | 'single' | 'hidden' | 'create';
  icon?: {
    lucide?: string;
    url?: string;
  };
  subitems?: Route[];
  pattern?: string; // For breadcrumb matching with dynamic routes
  disabled?: boolean;
}

export interface SideNavigationProps {
  routes: Route[];
  logo?: {
    src?: string;
    alt?: string;
    width?: number;
    height?: number;
    svg?: React.ReactNode;
  };
  className?: string;
  style?: React.CSSProperties;
  theme?: string;
}

export const SideNavigation = ({
  routes,
  logo,
  className,
  style,
  theme: themeProp,
}: SideNavigationProps) => {
  // Use Next.js pathname if available (in Next.js app), otherwise use our custom pathname (in Storybook)
  const pathname = usePathnameNext ? usePathnameNext() : usePathnameContext();

  // Use state for theme to make it reactive
  const [theme, setTheme] = useState<string>('gambit');

  const { collapsed, showText, setOpenSubmenu, openSubmenu } = useMenu();

  // Detect and update theme reactively
  useEffect(() => {
    if (themeProp) {
      setTheme(themeProp);
      return;
    }

    // Try to get theme from context first
    try {
      const themeContext = useContext(ThemeContext);
      if (themeContext?.theme) {
        setTheme(themeContext.theme);
        return;
      }
    } catch (error) {
      // ThemeContext not available
    }

    // Detect theme from DOM (for Storybook)
    const detectTheme = () => {
      if (typeof document !== 'undefined') {
        const dataTheme = document.documentElement.getAttribute('data-theme') || document.body.getAttribute('data-theme');
        if (dataTheme) {
          // Map Storybook theme names to our theme names
          const themeMap: Record<string, string> = {
            'albertHeijn': 'albert-heijn',
            'retailMedia': 'gambit',
            'adusa': 'adusa',
            'delhaize': 'delhaize',
            'alfaBeta': 'alfa-beta'
          };
          setTheme(themeMap[dataTheme] || dataTheme);
        }
      }
    };

    detectTheme();

    // Watch for theme changes in Storybook
    const observer = new MutationObserver(detectTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, [themeProp]);

  // Ensure openSubmenu is initialized as an array
  useEffect(() => {
    if (!Array.isArray(openSubmenu)) {
      setOpenSubmenu([]);
    }
  }, [openSubmenu, setOpenSubmenu]);

  // Initialize open submenu based on current path
  useEffect(() => {
    if (!pathname) return;

    // Find which menu should be open based on current path
    const activeMenuId = routes.find(route => 
      route.subitems?.some(subitem => subitem.url === pathname)
    )?.id.toString();

    if (activeMenuId) {
      // Always set the active menu to open when we're on a submenu page
      setOpenSubmenu([activeMenuId]);
    }
    // Note: We don't clear submenus when there's no active menu
    // This allows manual menu opening/closing to persist when not on submenu pages
  }, [pathname, setOpenSubmenu, routes]);

  // Close all submenus when the navigation is collapsed
  useEffect(() => {
    if (collapsed) {
      setOpenSubmenu([]);
    }
  }, [collapsed, setOpenSubmenu]);

  // filter all parents that dont have subitems and theme-specific items
  const filteredRoutes = routes.filter(
    (item) => {
      // Filter out parents without subitems
      if (item.type === 'parent' && (!item.subitems || item.subitems.length === 0)) {
        return false;
      }
      
      // Filter out Albert Heijn theme-specific exclusions
      if (theme === 'albert-heijn' || theme === 'albertHeijn') {
        // Hide Yield menu item
        if (item.name === 'Yield') {
          return false;
        }
        // Hide Configuration section and all its items
        if (item.name === 'Configuration' ||
            item.name === 'Display config' ||
            item.name === 'Sponsored products config' ||
            item.name === 'Digital in-store config' ||
            item.name === 'Offline in-store config' ||
            item.name === 'Organisations & users' ||
            item.name === 'Brands & retail products') {
          return false;
        }
      }
      
      return true;
    }
  );

  return (
    <div
      className={cn(
        'side-navigation', // add this class for targeting
        // Make the sidebar fixed to the left, full height, and above content
        `fixed left-0 top-0 h-screen z-30 flex-shrink-0 text-sm flex flex-col transition-all duration-500 ease-in-out overflow-hidden scrollbar-hide`,
        collapsed ? 'w-[72px]' : 'w-[285px]',
        'pt-4 px-4', // Consistent 16px (px-4) padding
        className
      )}
      data-collapsed={collapsed}
      style={style}
    >
      {/* Fixed logo area */}
      <div className="flex mb-4">
        <Link
          href="/"
          className="side-navigation-logo flex-shrink-0"
          style={{
            pointerEvents: 'auto',
            background: 'none !important',
            boxShadow: 'none !important',
            outline: 'none !important'
          }}
        >
          {theme === 'gambit' || theme === 'retailMedia' ? (
            <div
              className="flex items-center justify-center rounded-lg w-10 h-10 p-2"
              style={{ backgroundColor: '#1E5032' }}
            >
              <Logo theme="auto" className="h-6 w-6" />
            </div>
          ) : (
            <div className="w-10 h-10">
              <Logo theme="auto" />
            </div>
          )}
        </Link>
      </div>

      {/* Scrollable navigation area */}
      <div className="flex-1 flex flex-col gap-1 min-h-0 overflow-y-auto custom-scrollbar -mr-4 pr-4">
        {filteredRoutes.map((item, index, arr) => {
          const nextItem = arr[index + 1];
          const isTitleType = item.type === 'title';
          const isNextMainType = nextItem?.type === undefined || nextItem?.type === 'single' || nextItem?.type === 'create';
          const isNextParentWithSubitems =
            nextItem?.type === 'parent' &&
            (nextItem.subitems?.length ?? 0) > 0;

          const shouldShowTitle =
            isTitleType &&
            showText &&
            (isNextMainType || isNextParentWithSubitems);

          // Title-only items: render the title text or nothing
          if (isTitleType) {
            if (!shouldShowTitle) return null;
            return (
              <p key={item.id} className={cn(
                "transition-opacity duration-300 text-xs text-muted-foreground mb-1",
                index === 0 ? "mt-0" : "mt-6"
              )}>{item.name}</p>
            );
          }

          return (
            <div key={item.id}>
              {item.type === 'parent' &&
                (item.subitems?.length ?? 0) > 0 && (
                  <NavigationItemWithSubmenu item={item} />
                )}

              {item.type === 'create' && <NavigationCreateItem item={item} />}

              {(!item.type || item.type === 'single') && item.url && <NavigationItem item={item} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}; 