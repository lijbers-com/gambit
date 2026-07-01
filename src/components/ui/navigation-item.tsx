import { Image } from '@/lib/router-context';
import { Link, usePathname as usePathnameContext } from '@/lib/router-context';
import { cn } from '@/lib/utils';
import { Route } from './side-navigation';
import { renderIcon } from './render-icon';
import { useMenu } from '@/hooks/use-menu';
import { navSectionPath } from '@/lib/nav-active';

// Prefer Next's real usePathname in the app so the side-nav active state
// reflects the current route; fall back to the custom context hook in
// Storybook (where next/navigation isn't bundled).
let usePathnameNext: (() => string) | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const nextNav = require('next/navigation');
  usePathnameNext = nextNav.usePathname;
} catch {
  /* Storybook fallback */
}

export const NavigationItem = ({ item }: { item: Route }) => {
  const { collapsed, showText } = useMenu();
  const rawPathname = usePathnameNext ? usePathnameNext() : usePathnameContext();
  const pathname = navSectionPath(rawPathname);

  const checkActiveUrl = (route?: string) => {
    if (!route) return false;
    // Exact match only for top-level single items. We deliberately do
    // NOT first-segment-match because some top-level items share a
    // segment with a parent's submenu (e.g. "Media plans" at /campaigns
    // and Campaigns subitems at /campaigns/display) — first-segment
    // matching would light both up, which is what the user wants to
    // avoid. The subitems handle deeper-path matching themselves.
    return pathname === route;
  };

  // Render as disabled div if item is disabled
  if (item.disabled) {
    return (
      <div
        className={cn(
          'flex items-center pr-2 rounded-md transition-colors',
          'opacity-50 cursor-not-allowed'
        )}
        data-testid={'nav-' + item.id}
      >
        <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
          {item.icon?.lucide && renderIcon(item.icon.lucide)}
          {item.icon?.url && (
            <Image src={item.icon.url} alt={item.name} width={24} height={24} />
          )}
        </span>
        <span className={cn(!showText && 'hidden', 'text-sm ml-2 whitespace-nowrap')}>{item.name}</span>
      </div>
    );
  }

  return (
    <Link
      className={cn(
        'flex items-center pr-2 rounded-md transition-colors',
        checkActiveUrl(item.url) && 'active',
      )}
      href={item.url || '/'}
      data-testid={'nav-' + item.id}
    >
      <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
        {item.icon?.lucide && renderIcon(item.icon.lucide)}
        {item.icon?.url && (
          <Image src={item.icon.url} alt={item.name} width={24} height={24} />
        )}
      </span>
      <span className={cn(!showText && 'hidden', 'text-sm ml-2 whitespace-nowrap')}>{item.name}</span>
    </Link>
  );
}; 