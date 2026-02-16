'use client';

import { cn } from '@/lib/utils';
import { Route } from './side-navigation';
import { renderIcon } from './render-icon';
import { useMenu } from '@/hooks/use-menu';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from './dropdown-menu';

export const NavigationCreateItem = ({ item }: { item: Route }) => {
  const { showText } = useMenu();

  const handleSelect = (url?: string) => {
    if (url) {
      window.location.href = url;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            'flex items-center mb-1 pr-2 rounded-md transition-colors w-full text-left',
            'hover:bg-accent hover:text-accent-foreground cursor-pointer',
          )}
          data-testid={'nav-' + item.id}
        >
          <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center overflow-visible">
            {item.icon?.lucide && renderIcon(item.icon.lucide)}
          </span>
          <span className={cn(!showText && 'hidden', 'text-sm ml-2')}>{item.name}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start" sideOffset={12}>
        {item.subitems?.map((subitem) => (
          <DropdownMenuItem
            key={subitem.id}
            onClick={() => handleSelect(subitem.url)}
            className="cursor-pointer"
          >
            {subitem.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
