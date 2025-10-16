'use client';

import { cn } from '@/lib/utils';
import { Avatar, AvatarImage } from './avatar';
import { NavigationItem } from './navigation-item';
import { NavigationItemWithSubmenu } from './navigation-item-with-submenu';
import { useMenu } from '@/hooks/use-menu';
import { Logo } from './logo';
import { usePathname } from '@/lib/router-context';
import { Link } from '@/lib/router-context';
import { useEffect, useContext, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeContext } from '@/contexts/theme-context';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu';
import { User, Bell, Building2, LogOut, Info } from 'lucide-react';

export interface Route {
  id: number;
  name: string;
  url?: string;
  type?: 'parent' | 'title' | 'single' | 'hidden';
  icon?: {
    lucide?: string;
    url?: string;
  };
  subitems?: Route[];
  pattern?: string; // For breadcrumb matching with dynamic routes
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
  theme?: string;
}

export const SideNavigation = ({
  routes,
  logo,
  user,
  onLogout,
  className,
  style,
  theme: themeProp,
}: SideNavigationProps) => {
  const router = useRouter();

  // Use theme from props first, then context, otherwise default to 'gambit'
  let theme = themeProp || 'gambit';
  if (!themeProp) {
    try {
      const themeContext = useContext(ThemeContext);
      theme = themeContext?.theme || 'gambit';
    } catch (error) {
      // ThemeContext not available, use default theme
      theme = 'gambit';
    }
  }
  const { collapsed, showText, setOpenSubmenu, openSubmenu } = useMenu();
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
            item.name === 'Offline in-store config') {
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
        'pt-4 px-4 pb-6', // Consistent 16px (px-4) padding for both states
        className
      )}
      data-collapsed={collapsed}
      style={style}
    >
      {/* Fixed logo area */}
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

      {/* Scrollable navigation area */}
      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto custom-scrollbar">
        {filteredRoutes.map((item, index, arr) => {
          const nextItem = arr[index + 1];
          const isTitleType = item.type === 'title';
          const isNextMainType = nextItem?.type === undefined || nextItem?.type === 'single';
          const isNextParentWithSubitems =
            nextItem?.type === 'parent' &&
            (nextItem.subitems?.length ?? 0) > 0;

          const shouldShowTitle =
            isTitleType &&
            showText &&
            (isNextMainType || isNextParentWithSubitems);

          return (
            <div key={item.id}>
              {shouldShowTitle && (
                <p className={cn(
                  "mb-4 mt-8 transition-opacity duration-300",
                  // Apply different styling for Configuration and AdGenie chats sections
                  item.name === "Configuration" || item.name === "AdGenie chats" 
                    ? "text-xs text-muted-foreground" 
                    : "text-muted-foreground"
                )}>{item.name}</p>
              )}

              {item.type === 'parent' &&
                (item.subitems?.length ?? 0) > 0 && (
                  <NavigationItemWithSubmenu item={item} />
                )}

              {(!item.type || item.type === 'single') && item.url && <NavigationItem item={item} />}
            </div>
          );
        })}
      </div>

      {/* Sticky avatar at the bottom */}
      <div className="mt-auto">
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center mb-4 mt-8 pr-2 rounded-md hover:bg-slate-100 w-full text-left relative z-50"
                style={{ pointerEvents: 'auto' }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURI(
                        user.name || 'profile',
                      )}&size=32`}
                    />
                  </Avatar>
                </span>
                <span className={cn('text-sm ml-2 transition-opacity duration-300', !showText && 'hidden')}>{user.name || 'Profile'}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-56 mb-2">
              <DropdownMenuItem onClick={() => {
                router.push('/profile');
              }}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                router.push('/notifications');
              }}>
                <Bell className="mr-2 h-4 w-4" />
                <span>Notifications</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                // Placeholder for organisation functionality
              }}>
                <Building2 className="mr-2 h-4 w-4" />
                <span>My Organisation</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                // Placeholder for information functionality
              }}>
                <Info className="mr-2 h-4 w-4" />
                <span>Information</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                router.push('/login');
              }}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}; 