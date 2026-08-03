'use client';

import * as React from 'react';
import { Bell, User, Building2, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { HeaderSearch } from './header-search';
import { Route } from './side-navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { useRouter as useRouterContext } from '@/lib/router-context';
import { useSession, logout, useDb, useInboxState, deriveMessages } from '@/lib/db';

// Try to import Next.js router, fallback to our custom router if not available
let useRouterNext: (() => any) | null = null;

try {
  const nextNav = require('next/navigation');
  useRouterNext = nextNav.useRouter;
} catch (e) {
  // Next.js not available (we're in Storybook)
}

export interface HeaderActionsProps {
  className?: string;
  routes?: Route[];
  onNotificationsClick?: () => void;
  onProfileClick?: () => void;
  onOrganisationClick?: () => void;
  /** Overrides the real unread count — used by Storybook to force the badge on. */
  hasUnreadNotifications?: boolean;
}

export const HeaderActions = React.forwardRef<
  HTMLDivElement,
  HeaderActionsProps
>(({
  className,
  routes = [],
  onNotificationsClick,
  onProfileClick,
  onOrganisationClick,
  hasUnreadNotifications,
}, ref) => {
  // Use Next.js router if available (in Next.js app), otherwise use our custom router (in Storybook)
  const router = useRouterNext ? useRouterNext() : useRouterContext();
  // The logged-in prototype user (null when signed out / in Storybook).
  const sessionUser = useSession();

  // The bell counts what is actually waiting in this user's inbox, so it can
  // never claim there is news when the inbox is empty.
  const db = useDb();
  const inboxState = useInboxState();
  const unreadCount = React.useMemo(() => {
    const messages = deriveMessages(
      db,
      sessionUser ? { user: { personaKey: sessionUser.personaKey, side: sessionUser.side } } : {},
    );
    return messages.filter((m) => (inboxState[m.id] ?? 'unread') === 'unread').length;
  }, [db, sessionUser, inboxState]);
  const showBadge = hasUnreadNotifications ?? unreadCount > 0;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleNotificationsClick = () => {
    if (onNotificationsClick) {
      onNotificationsClick();
    } else {
      router.push('/notifications');
    }
  };

  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick();
    } else {
      router.push('/profile');
    }
  };

  const handleOrganisationClick = () => {
    if (onOrganisationClick) {
      onOrganisationClick();
    }
    // Placeholder for organisation functionality
  };

  return (
    <div
      ref={ref}
      className={cn('flex items-center gap-2 header-actions', className)}
    >
      <HeaderSearch routes={routes} />

      <Button
        variant="ghost"
        size="icon"
        onClick={handleNotificationsClick}
        className="h-9 w-9 relative border border-input"
        aria-label={unreadCount > 0 ? `Inbox — ${unreadCount} unread` : 'Inbox'}
      >
        <Bell className="h-5 w-5" />
        {showBadge && (
          unreadCount > 0 ? (
            <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold tabular-nums text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          ) : (
            <span className="absolute top-2 right-[9px] h-2 w-2 rounded-full bg-red-500" />
          )
        )}
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleOrganisationClick}
        className="h-9 w-9 border border-input"
        aria-label="My Organisation"
      >
        <Building2 className="h-5 w-5" />
      </Button>

      {sessionUser ? (
        // Session-aware profile menu: shows who is logged in and offers log out.
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 border border-input"
              aria-label="Profile"
            >
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>
              <div className="text-sm font-medium">{sessionUser.name}</div>
              <div className="text-xs font-normal text-muted-foreground">{sessionUser.role}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleProfileClick}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleProfileClick}
          className="h-9 w-9 border border-input"
          aria-label="Profile"
        >
          <User className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
});

HeaderActions.displayName = 'HeaderActions';
