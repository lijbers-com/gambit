import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Route } from './side-navigation';
import { renderIcon } from './render-icon';
import { useMenu } from '@/hooks/use-menu';

export const NavigationItem = ({ item }: { item: Route }) => {
  const { collapsed } = useMenu();
  const checkActiveUrl = (route?: string) =>
    route
      ? window.location.pathname.split('/')[1] === route.split('/')[1]
      : false;

  return (
    <a
      className={cn(
        'flex items-center mb-6 pr-2 rounded-md hover:bg-slate-100',
        checkActiveUrl(item.url) && 'bg-slate-100',
      )}
      href={item.url}
      data-testid={'nav-' + item.id}
    >
      <span className="flex-shrink-0">
        {item.icon?.lucide && renderIcon(item.icon.lucide)}
        {item.icon?.url && (
          <div className="flex justify-center items-center w-10 h-10 text-red-500">
            <Image src={item.icon.url} alt={item.name} width={24} height={24} />
          </div>
        )}
      </span>
      <span className={cn(collapsed && 'hidden', 'text-sm')}>{item.name}</span>
    </a>
  );
}; 