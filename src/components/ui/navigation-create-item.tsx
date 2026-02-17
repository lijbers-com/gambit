'use client';

import { cn } from '@/lib/utils';
import { Route } from './side-navigation';
import { renderIcon } from './render-icon';
import { useMenu } from '@/hooks/use-menu';
import { useRouter as useRouterContext } from '@/lib/router-context';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from './dropdown-menu';
import {
  WalletCards,
  MonitorSpeaker,
  ListStart,
  MonitorPlay,
  Store,
  Globe,
} from 'lucide-react';

// Try to import Next.js router
let useRouterNext: (() => { push: (path: string) => void }) | null = null;
try {
  const nextNav = require('next/navigation');
  useRouterNext = nextNav.useRouter;
} catch (e) {
  // Next.js not available (we're in Storybook)
}

// Map subitem names to proposition icons
const createItemIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'Media experience': WalletCards,
  'Sponsored product campaign': ListStart,
  'Display campaign': MonitorSpeaker,
  'Offline in-store campaign': Store,
  'Digital in-store campaign': MonitorPlay,
  'Extended reach campaign': Globe,
};

export const NavigationCreateItem = ({ item }: { item: Route }) => {
  const { showText } = useMenu();
  const contextRouter = useRouterContext();
  const nextRouter = useRouterNext ? useRouterNext() : null;

  const handleSelect = (url?: string) => {
    if (url) {
      if (nextRouter) {
        nextRouter.push(url);
      } else {
        contextRouter.push(url);
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            'flex items-center pr-2 rounded-md transition-colors w-full text-left',
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
      <DropdownMenuContent side="right" align="start" sideOffset={-40} className="w-72">
        {item.subitems?.map((subitem) => {
          const IconComponent = createItemIcons[subitem.name];
          return (
            <DropdownMenuItem
              key={subitem.id}
              onClick={() => handleSelect(subitem.url)}
              className="cursor-pointer"
            >
              {IconComponent && (
                <IconComponent className="mr-2 h-4 w-4" />
              )}
              <span>{subitem.name}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
