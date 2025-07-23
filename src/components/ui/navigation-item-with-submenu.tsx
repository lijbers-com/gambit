import { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Route } from './side-navigation';
import { renderIcon } from './render-icon';
import { useMenu } from '@/hooks/use-menu';
import { usePathname } from 'next/navigation';

export const NavigationItemWithSubmenu = ({
  item,
}: {
  item: Route;
}) => {
  const { collapsed, setCollapsed, openSubmenu, setOpenSubmenu } = useMenu();
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
        className="parent flex items-center mb-6 pr-2 rounded-md hover:bg-slate-100 cursor-pointer"
        onClick={() => toggleSubmenu(itemId)}
        data-testid={'nav-' + itemId}
      >
        <span className="flex-shrink-0">
          {item.icon?.lucide && renderIcon(item.icon.lucide)}
          {item.icon?.url && (
            <div className="flex justify-center items-center w-10 h-10">
              <img src={item.icon.url} alt={item.name} width={24} height={24} />
            </div>
          )}
        </span>
        <span className={cn(collapsed && 'hidden', 'text-sm')}>
          {item.name}
        </span>
        {safeOpenSubmenu.includes(itemId) ? (
          <ChevronDown className="ml-auto" size={16} />
        ) : (
          <ChevronRight className="ml-auto" size={16} />
        )}
      </span>
      <div
        className={
          safeOpenSubmenu.includes(itemId) ? 'block mb-6 mt-[-16px]' : 'hidden'
        }
      >
        {item.subitems?.map((subitem) => (
          <div 
            key={subitem.id}
            className="flex items-center py-1 pr-2 border-l-2 border-slate-50 leading-6 ml-5 pl-4 hover:border-slate-100"
          >
            <a
              className={cn(
                collapsed && 'hidden',
                'text-sm leading-6 p-2 rounded-md hover:bg-slate-100 inline-block',
                subitem.url && pathname === subitem.url && 'bg-slate-100 font-medium text-slate-900',
              )}
              href={subitem.url}
              data-testid={`nav-${item.id}-${subitem.id}`}
            >
              {subitem.name}
            </a>
          </div>
        ))}
      </div>
    </>
  );
}; 