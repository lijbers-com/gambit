import { useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Route } from './side-navigation';
import { renderIcon } from './render-icon';
import { useMenu } from '@/hooks/use-menu';

export const NavigationItemWithSubmenu = ({
  item,
}: {
  item: Route;
}) => {
  const { collapsed, setCollapsed, openSubmenu, setOpenSubmenu } = useMenu();
  const itemId = item.id.toString();
  
  const toggleSubmenu = (menu: string) => {
    if (collapsed) {
      setCollapsed(false);
    }

    // If submenu already open close it
    if (openSubmenu.includes(menu)) {
      setOpenSubmenu(openSubmenu.filter((submenu) => submenu !== menu));
      return;
    }
    setOpenSubmenu([...openSubmenu, menu]);
  };
  
  const checkActiveUrl = (route?: string) =>
    route
      ? window.location.pathname.split('/')[1] === route.split('/')[1]
      : false;

  useEffect(() => {
    if (collapsed) {
      setOpenSubmenu(['']);
    }
  }, [collapsed, setOpenSubmenu]);

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
        {openSubmenu.includes(itemId) ? (
          <ChevronDown className="ml-auto" size={16} />
        ) : (
          <ChevronRight className="ml-auto" size={16} />
        )}
      </span>
      <div
        className={
          openSubmenu.includes(itemId) ? 'block mb-6 mt-[-16px]' : 'hidden'
        }
      >
        {item.subitems?.map((subitem) => (
          <a
            key={subitem.id}
            className={cn(
              'flex items-center py-1 pr-2 border-l-2 border-slate-50 leading-6 ml-5 pl-4 hover:border-slate-100',
              subitem.url && checkActiveUrl(subitem.url) && '',
            )}
            href={subitem.url}
            data-testid={`nav-${item.id}-${subitem.id}`}
          >
            <span
              className={cn(
                collapsed && 'hidden',
                'text-sm leading-6 p-2 rounded-md w-full hover:bg-slate-100',
              )}
            >
              {subitem.name}
            </span>
          </a>
        ))}
      </div>
    </>
  );
}; 