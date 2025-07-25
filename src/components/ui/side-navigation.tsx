'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage } from './avatar';
import { NavigationItem } from './navigation-item';
import { NavigationItemWithSubmenu } from './navigation-item-with-submenu';
import { useMenu } from '@/hooks/use-menu';
import { Logo } from './logo';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

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
    if (!pathname || collapsed) return;

    // Find which menu should be open based on current path
    const activeMenuId = routes.find(route => 
      route.subitems?.some(subitem => subitem.url === pathname)
    )?.id.toString();

    if (activeMenuId) {
      // Only update if the menu isn't already open
      setOpenSubmenu(current => {
        if (current.includes(activeMenuId)) {
          return current; // No change needed
        }
        return [activeMenuId];
      });
    } else {
      // Clear open submenus if we're not in a submenu section
      setOpenSubmenu(current => current.length > 0 ? [] : current);
    }
  }, [pathname, collapsed, setOpenSubmenu]); // Routes don't need to be a dependency as they don't change

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
        collapsed ? 'w-[88px] pt-3 px-6 pb-6' : 'min-w-[270px] pt-3 px-6 pb-6',
        className
      )}
      style={style}
    >
      {/* Scrollable navigation area */}
      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        <div className={cn("flex mb-8", collapsed && "justify-center")}>
          <a 
            href="/" 
            className="side-navigation-logo" 
            style={{ 
              pointerEvents: 'auto',
              background: 'none !important',
              boxShadow: 'none !important',
              outline: 'none !important'
            }}
          >
            <Logo theme="auto" />
          </a>
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
          <a
            className={cn(
              "flex items-center mb-6 mt-12 pr-2 rounded-md hover:bg-slate-100",
              collapsed && "justify-center pr-0"
            )}
            href="/profile"
          >
            <span className={cn("flex-shrink-0", collapsed ? "" : "mr-2")}>
              <Avatar>
                <AvatarImage
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURI(
                    user.name || 'profile',
                  )}&size=32`}
                />
              </Avatar>
            </span>
            <span className={cn('text-sm transition-opacity duration-300', collapsed && 'hidden')}>Profile</span>
          </a>
        )}
      </div>
    </div>
  );
}; 