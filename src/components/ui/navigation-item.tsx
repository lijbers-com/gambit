import { Image } from '@/lib/router-context';
import { Link, usePathname } from '@/lib/router-context';
import { cn } from '@/lib/utils';
import { Route } from './side-navigation';
import { renderIcon } from './render-icon';
import { useMenu } from '@/hooks/use-menu';

export const NavigationItem = ({ item }: { item: Route }) => {
  const { collapsed, showText } = useMenu();
  const pathname = usePathname();

  const checkActiveUrl = (route?: string) => {
    if (!route) return false;
    // Use pathname from router context instead of window.location
    // This ensures consistent behavior during SSR and client-side rendering
    return pathname.split('/')[1] === route.split('/')[1];
  };

  // Render as disabled div if item is disabled
  if (item.disabled) {
    return (
      <div
        className={cn(
          'flex items-center mb-1 pr-2 rounded-md transition-colors',
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
        <span className={cn(!showText && 'hidden', 'text-sm ml-2')}>{item.name}</span>
      </div>
    );
  }

  return (
    <Link
      className={cn(
        'flex items-center mb-4 pr-2 rounded-md transition-colors',
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
      <span className={cn(!showText && 'hidden', 'text-sm ml-2')}>{item.name}</span>
    </Link>
  );
}; 