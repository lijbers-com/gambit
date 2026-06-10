import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Route } from './side-navigation';
import { renderIcon } from './render-icon';
import { useMenu } from '@/hooks/use-menu';
import { usePathname as usePathnameContext } from '@/lib/router-context';
import { Link } from '@/lib/router-context';

// Prefer Next's real usePathname when available (production app) so the
// active state matches the current URL. Fall back to the custom context
// hook in Storybook.
let usePathnameNext: (() => string) | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const nextNav = require('next/navigation');
  usePathnameNext = nextNav.usePathname;
} catch {
  /* Storybook fallback */
}

export const NavigationItemWithSubmenu = ({
  item,
}: {
  item: Route;
}) => {
  const { collapsed, showText, setCollapsed, openSubmenu, setOpenSubmenu } = useMenu();
  const pathname = usePathnameNext ? usePathnameNext() : usePathnameContext();
  const itemId = item.id.toString();
  
  // Ensure openSubmenu is always an array
  const safeOpenSubmenu = Array.isArray(openSubmenu) ? openSubmenu : [];
  
  const toggleSubmenu = (menu: string) => {
    if (collapsed) {
      setCollapsed(false);
    }

    // If submenu already open close it
    if (safeOpenSubmenu.includes(menu)) {
      setOpenSubmenu([]);
      return;
    }
    // Only allow one submenu to be open at a time
    setOpenSubmenu([menu]);
  };

  return (
    <>
      <span
        className="parent flex items-center pr-2 rounded-md transition-colors cursor-pointer"
        onClick={() => toggleSubmenu(itemId)}
        data-testid={'nav-' + itemId}
      >
        <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
          {item.icon?.lucide && renderIcon(item.icon.lucide)}
          {item.icon?.url && (
            <img src={item.icon.url} alt={item.name} width={24} height={24} />
          )}
        </span>
        <span className={cn(!showText && 'hidden', 'text-sm ml-2 flex-1 whitespace-nowrap')}>
          {item.name}
        </span>
        <span className={cn(!showText && 'hidden', 'ml-auto')}>
          {safeOpenSubmenu.includes(itemId) ? (
            <ChevronDown size={16} />
          ) : (
            <ChevronRight size={16} />
          )}
        </span>
      </span>
      <div
        className={
          safeOpenSubmenu.includes(itemId)
            ? // Border-l + ml-5 + pl-7 moved to the parent so the rail
              // stays continuous when we add space-y-1 (4px) between
              // each subitem. space-y-1 only adds margin *between*
              // siblings, so the rail doesn't grow at the ends.
              'block pt-1 pb-2 ml-5 pl-7 border-l border-brand-text/20 space-y-1'
            : 'hidden'
        }
      >
        {item.subitems?.map((subitem) => (
          <div
            key={subitem.id}
            className="flex items-center pr-2 leading-6 transition-colors"
          >
            <Link
              className={cn(
                !showText && 'hidden',
                'text-sm leading-6 py-1.5 px-2 rounded-md transition-colors inline-block whitespace-nowrap',
                // Subitem is active when the URL matches exactly OR when
                // the current path is a child of the subitem (e.g. on
                // /campaigns/display/C-001, the "Display" subitem at
                // /campaigns/display still lights up).
                subitem.url &&
                  (pathname === subitem.url ||
                    pathname.startsWith(subitem.url + '/')) &&
                  'active',
              )}
              href={subitem.url || '#'}
              data-testid={`nav-${item.id}-${subitem.id}`}
            >
              {subitem.name}
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}; 