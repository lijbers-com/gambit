import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Route } from './side-navigation';
import { renderIcon } from './render-icon';
import { useMenu } from '@/hooks/use-menu';
import { usePathname } from '@/lib/router-context';
import { Link } from '@/lib/router-context';

export const NavigationItemWithSubmenu = ({
  item,
}: {
  item: Route;
}) => {
  const { collapsed, showText, setCollapsed, openSubmenu, setOpenSubmenu } = useMenu();
  const pathname = usePathname();
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
        <span className={cn(!showText && 'hidden', 'text-sm ml-2 flex-1')}>
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
          safeOpenSubmenu.includes(itemId) ? 'block pt-1 pb-2' : 'hidden'
        }
      >
        {item.subitems?.map((subitem) => (
          <div
            key={subitem.id}
            className="flex items-center pr-2 border-l border-brand-text/20 leading-6 ml-5 pl-7 transition-colors"
          >
            <Link
              className={cn(
                !showText && 'hidden',
                'text-sm leading-6 py-1.5 px-2 rounded-md transition-colors inline-block',
                subitem.url && pathname === subitem.url && 'active',
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