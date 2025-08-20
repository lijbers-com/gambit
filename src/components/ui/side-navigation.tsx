'use client';

import { cn } from '@/lib/utils';
import { Avatar, AvatarImage } from './avatar';
import { NavigationItem } from './navigation-item';
import { NavigationItemWithSubmenu } from './navigation-item-with-submenu';
import { useMenu } from '@/hooks/use-menu';
import { Logo } from './logo';
import { usePathname } from '@/lib/router-context';
import { Link } from '@/lib/router-context';
import { useEffect, useContext } from 'react';
import { ThemeContext } from '@/contexts/theme-context';

export interface Route {
  id: number;
  name: string;
  url?: string;
  type?: 'parent' | 'title' | 'single';
  icon?: {
    lucide?: string;
    url?: string;
  };
  subitems?: Route[];
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
  user?: {
    name?: string;
    avatar?: string;
  };
  onLogout?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const SideNavigation = ({
  routes,
  logo,
  user,
  onLogout,
  className,
  style,
}: SideNavigationProps) => {
  // Use theme from context if available, otherwise default to 'gambit'
  let theme = 'gambit';
  try {
    const themeContext = useContext(ThemeContext);
    theme = themeContext?.theme || 'gambit';
  } catch (error) {
    // ThemeContext not available, use default theme
    theme = 'gambit';
  }
  const { collapsed, setOpenSubmenu, openSubmenu } = useMenu();
  const pathname = usePathname();

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

  // filter all parents that dont have subitems
  const filteredRoutes = routes.filter(
    (item) =>
      item.type !== 'parent' ||
      (item.subitems && item.subitems.length > 0),
  );

  return (
    <div
      className={cn(
        'side-navigation', // add this class for targeting
        // Make the sidebar fixed to the left, full height, and above content
        `fixed left-0 top-0 h-screen z-30 flex-shrink-0 text-sm flex flex-col transition-all duration-500 ease-in-out overflow-hidden scrollbar-hide`,
        collapsed ? 'w-[72px]' : 'w-[270px]',
        'pt-4 px-4 pb-6', // Consistent 16px (px-4) padding for both states
        className
      )}
      data-collapsed={collapsed}
      style={style}
    >
      {/* Scrollable navigation area */}
      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        <div className="flex mb-8">
          <Link 
            href="/" 
            className="side-navigation-logo flex-shrink-0 w-10 h-10" // Fixed dimensions for consistent positioning
            style={{ 
              pointerEvents: 'auto',
              background: 'none !important',
              boxShadow: 'none !important',
              outline: 'none !important'
            }}
          >
            <Logo theme="auto" />
          </Link>
        </div>

        {filteredRoutes.map((item, index, arr) => {
          const nextItem = arr[index + 1];
          const isTitleType = item.type === 'title';
          const isNextMainType = nextItem?.type === undefined;
          const isNextParentWithSubitems =
            nextItem?.type === 'parent' &&
            (nextItem.subitems?.length ?? 0) > 0;

          const shouldShowTitle =
            isTitleType &&
            !collapsed &&
            (isNextMainType || isNextParentWithSubitems);

          return (
            <div key={item.id}>
              {shouldShowTitle && (
                <p className="text-slate-500 mb-6 mt-12 transition-opacity duration-300">{item.name}</p>
              )}

              {item.type === 'parent' &&
                (item.subitems?.length ?? 0) > 0 && (
                  <NavigationItemWithSubmenu item={item} />
                )}

              {!item.type && item.url && <NavigationItem item={item} />}
            </div>
          );
        })}
      </div>

      {/* Sticky avatar at the bottom */}
      <div className="mt-auto">
        {user && (
          <Link
            className="flex items-center mb-6 mt-12 pr-2 rounded-md hover:bg-slate-100"
            href="/profile"
          >
            <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
              <Avatar>
                <AvatarImage
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURI(
                    user.name || 'profile',
                  )}&size=32`}
                />
              </Avatar>
            </span>
            <span className={cn('text-sm ml-2 transition-opacity duration-300', collapsed && 'hidden')}>Profile</span>
          </Link>
        )}
      </div>
    </div>
  );
}; 