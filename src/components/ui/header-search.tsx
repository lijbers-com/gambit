'use client';

import * as React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Route } from './side-navigation';
import { useRouter as useRouterContext } from '@/lib/router-context';
import { renderIcon } from './render-icon';

// Try to import Next.js router, fallback to custom router if not available
let useRouterNext: (() => { push: (url: string) => void }) | null = null;

try {
  const nextNav = require('next/navigation');
  useRouterNext = nextNav.useRouter;
} catch (e) {
  // Next.js not available (we're in Storybook)
}

export interface SearchResult {
  id: string;
  name: string;
  url: string;
  type: 'page' | 'campaign' | 'booking' | 'creative' | 'insight' | 'notification';
  icon?: { lucide?: string; url?: string };
  category: string;
  description?: string;
  status?: string;
}

export interface HeaderSearchProps {
  routes?: Route[];
  className?: string;
  onNavigate?: (url: string) => void;
  placeholder?: string;
}

// Mock data for campaigns, bookings, and creatives
const mockCampaigns: SearchResult[] = [
  { id: 'camp-1', name: 'Summer Sale 2024', url: '/campaigns/display/C-001', type: 'campaign', category: 'Campaigns', status: 'Running', description: 'Display campaign' },
  { id: 'camp-2', name: 'Holiday Promotion', url: '/campaigns/sponsored-products/C-002', type: 'campaign', category: 'Campaigns', status: 'Ready', description: 'Sponsored products' },
  { id: 'camp-3', name: 'Brand Awareness Q1', url: '/campaigns/digital-instore/C-003', type: 'campaign', category: 'Campaigns', status: 'Running', description: 'Digital in-store' },
  { id: 'camp-4', name: 'New Product Launch', url: '/campaigns/offline-instore/C-004', type: 'campaign', category: 'Campaigns', status: 'In option', description: 'Offline in-store' },
  { id: 'camp-5', name: 'Winter Collection', url: '/campaigns/display/C-005', type: 'campaign', category: 'Campaigns', status: 'Paused', description: 'Display campaign' },
];

const mockBookings: SearchResult[] = [
  { id: 'book-1', name: 'Homepage Banner - Week 12', url: '/calendar/display', type: 'booking', category: 'Bookings', status: 'Confirmed', description: 'Mar 18 - Mar 24' },
  { id: 'book-2', name: 'Checkout Placement', url: '/calendar/sponsored-products', type: 'booking', category: 'Bookings', status: 'Pending', description: 'Mar 25 - Apr 7' },
  { id: 'book-3', name: 'In-store Screen Network', url: '/calendar/digital-instore', type: 'booking', category: 'Bookings', status: 'Confirmed', description: 'Apr 1 - Apr 30' },
  { id: 'book-4', name: 'End Cap Display', url: '/calendar/offline-instore', type: 'booking', category: 'Bookings', status: 'Draft', description: 'Apr 15 - May 15' },
];

const mockCreatives: SearchResult[] = [
  { id: 'crea-1', name: 'Summer Banner 728x90', url: '/creatives', type: 'creative', category: 'Creatives', status: 'Approved', description: 'Display banner' },
  { id: 'crea-2', name: 'Product Hero Image', url: '/creatives', type: 'creative', category: 'Creatives', status: 'Pending', description: 'Sponsored product' },
  { id: 'crea-3', name: 'Store Video 15s', url: '/creatives', type: 'creative', category: 'Creatives', status: 'Approved', description: 'Digital signage' },
  { id: 'crea-4', name: 'Wobbler Design A', url: '/creatives', type: 'creative', category: 'Creatives', status: 'Draft', description: 'Offline in-store' },
  { id: 'crea-5', name: 'Holiday Promo Banner', url: '/creatives', type: 'creative', category: 'Creatives', status: 'Rejected', description: 'Display banner' },
];

const mockInsights: SearchResult[] = [
  { id: 'ins-1', name: 'Campaign Performance Overview', url: '/insights/performance', type: 'insight', category: 'Insights', description: 'Line Chart' },
  { id: 'ins-2', name: 'Revenue by Channel', url: '/insights/revenue', type: 'insight', category: 'Insights', description: 'Bar Chart' },
  { id: 'ins-3', name: 'Impressions Trend', url: '/insights/impressions', type: 'insight', category: 'Insights', description: 'Area Chart' },
  { id: 'ins-4', name: 'CTR by Campaign Type', url: '/insights/ctr', type: 'insight', category: 'Insights', description: 'Bar Chart' },
  { id: 'ins-5', name: 'Budget Allocation', url: '/insights/budget', type: 'insight', category: 'Insights', description: 'Pie Chart' },
];

const mockNotifications: SearchResult[] = [
  { id: 'notif-1', name: 'Summer Sale campaign approved', url: '/notifications', type: 'notification', category: 'Notifications', description: 'Campaign' },
  { id: 'notif-2', name: 'Budget threshold reached', url: '/notifications', type: 'notification', category: 'Notifications', status: 'Unread', description: 'Alert' },
  { id: 'notif-3', name: 'Creative pending review', url: '/notifications', type: 'notification', category: 'Notifications', status: 'Unread', description: 'Creative' },
  { id: 'notif-4', name: 'Booking confirmed', url: '/notifications', type: 'notification', category: 'Notifications', description: 'Booking' },
  { id: 'notif-5', name: 'Performance milestone reached', url: '/notifications', type: 'notification', category: 'Notifications', description: 'Campaign' },
];

/**
 * Flatten nested routes into a searchable list
 */
function flattenRoutes(routes: Route[], parentName?: string): SearchResult[] {
  const results: SearchResult[] = [];

  for (const route of routes) {
    if (route.type === 'title' || route.type === 'hidden') continue;
    if (route.disabled) continue;

    if (route.url) {
      results.push({
        id: `route-${route.id}`,
        name: route.name,
        url: route.url,
        type: 'page',
        icon: route.icon,
        category: 'Pages',
        description: parentName,
      });
    }

    if (route.subitems) {
      results.push(...flattenRoutes(route.subitems, route.name));
    }
  }

  return results;
}

/**
 * Filter results based on search query - returns flat list
 */
function filterResults(
  query: string,
  pages: SearchResult[],
  campaigns: SearchResult[],
  bookings: SearchResult[],
  creatives: SearchResult[],
  insights: SearchResult[],
  notifications: SearchResult[]
): SearchResult[] {
  const lowerQuery = query.toLowerCase().trim();

  const filterFn = (item: SearchResult) =>
    item.name.toLowerCase().includes(lowerQuery) ||
    item.description?.toLowerCase().includes(lowerQuery) ||
    item.status?.toLowerCase().includes(lowerQuery);

  // Combine all results
  const allResults = [...campaigns, ...bookings, ...creatives, ...insights, ...notifications, ...pages];

  // Filter and limit
  const filtered = lowerQuery ? allResults.filter(filterFn) : allResults;
  return filtered.slice(0, 10);
}

/**
 * Get status badge color
 */
function getStatusColor(status?: string): string {
  switch (status?.toLowerCase()) {
    case 'running':
    case 'approved':
    case 'confirmed':
      return 'bg-green-100 text-green-700';
    case 'ready':
    case 'pending':
      return 'bg-yellow-100 text-yellow-700';
    case 'paused':
    case 'draft':
    case 'in option':
      return 'bg-slate-100 text-slate-600';
    case 'rejected':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-slate-100 text-slate-600';
  }
}

/**
 * Get icon for result type
 */
function getTypeIcon(type: string): string {
  switch (type) {
    case 'campaign':
      return 'Table';
    case 'booking':
      return 'CalendarDays';
    case 'creative':
      return 'ImagePlus';
    case 'insight':
      return 'BarChart3';
    case 'notification':
      return 'MessageCircle';
    case 'page':
      return 'LayoutDashboard';
    default:
      return 'FileText';
  }
}

export const HeaderSearch = React.forwardRef<HTMLDivElement, HeaderSearchProps>(
  ({ routes = [], className, onNavigate, placeholder = 'Search...' }, ref) => {
    const [open, setOpen] = React.useState(false);
    const [focused, setFocused] = React.useState(false);
    const [query, setQuery] = React.useState('');
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Use Next.js router if available, otherwise use custom router
    const router = useRouterNext ? useRouterNext() : useRouterContext();

    // Flatten routes for search
    const searchablePages = React.useMemo(() => flattenRoutes(routes), [routes]);

    // Filter results - flat list
    const results = React.useMemo(
      () => filterResults(query, searchablePages, mockCampaigns, mockBookings, mockCreatives, mockInsights, mockNotifications),
      [query, searchablePages]
    );

    // Reset selected index when results change
    React.useEffect(() => {
      setSelectedIndex(0);
    }, [results]);

    // Handle navigation
    const handleSelect = (result: SearchResult) => {
      if (onNavigate) {
        onNavigate(result.url);
      } else {
        router.push(result.url);
      }
      setOpen(false);
      setQuery('');
      inputRef.current?.blur();
    };


    // Navigate to search results page
    const handleSearchSubmit = () => {
      if (query.trim()) {
        const searchUrl = `/search?q=${encodeURIComponent(query.trim())}`;
        if (onNavigate) {
          onNavigate(searchUrl);
        } else {
          router.push(searchUrl);
        }
        setOpen(false);
        setQuery('');
        inputRef.current?.blur();
      }
    };

    // Keyboard navigation within dropdown
    const handleKeyDown = (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          if (open) {
            e.preventDefault();
            setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
          }
          break;
        case 'ArrowUp':
          if (open) {
            e.preventDefault();
            setSelectedIndex((prev) => Math.max(prev - 1, 0));
          }
          break;
        case 'Enter':
          e.preventDefault();
          // Always navigate to search results page when pressing Enter
          // Users must click on a specific result to navigate directly to it
          if (query.trim()) {
            handleSearchSubmit();
          }
          break;
        case 'Escape':
          setOpen(false);
          inputRef.current?.blur();
          break;
      }
    };

    // Handle focus/blur - only open dropdown when there's a query
    const handleFocus = () => {
      setFocused(true);
      if (query.trim()) {
        setOpen(true);
      }
    };

    const handleBlur = (e: React.FocusEvent) => {
      // Don't blur if clicking inside the popover
      if (containerRef.current?.contains(e.relatedTarget as Node)) {
        return;
      }
      // Delay to allow click events on results
      setTimeout(() => {
        setFocused(false);
        setOpen(false);
      }, 150);
    };

    // Handle input change - open dropdown when typing
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newQuery = e.target.value;
      setQuery(newQuery);
      if (newQuery.trim()) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    };

    return (
      <div ref={ref} className={cn('relative', className)}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div
              ref={containerRef}
              className={cn(
                'relative flex items-center transition-all duration-200 ease-out',
                focused ? 'w-72' : 'w-44'
              )}
            >
              <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className={cn(
                  'h-9 w-full rounded-md border border-input bg-background pl-8 pr-3 text-sm',
                  'placeholder:text-muted-foreground',
                  'focus:outline-none focus:ring-1 focus:ring-ring',
                  'transition-all duration-200'
                )}
              />
            </div>
          </PopoverTrigger>
          <PopoverContent
            className="w-96 p-0"
            align="start"
            sideOffset={4}
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <div className="max-h-80 overflow-y-auto py-1">
              {results.length === 0 ? (
                <div className="px-4 py-6 text-center text-muted-foreground text-sm">
                  No results found
                </div>
              ) : (
                <>
                  {results.map((result, index) => (
                    <button
                      key={result.id}
                      onClick={() => handleSelect(result)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={cn(
                        'flex items-center gap-3 w-full px-3 py-2 text-sm text-left transition-colors',
                        index === selectedIndex
                          ? 'bg-accent text-accent-foreground'
                          : 'hover:bg-accent/50'
                      )}
                    >
                      {/* Type icon */}
                      <span className="text-muted-foreground flex-shrink-0 [&_svg]:w-4 [&_svg]:h-4 [&_svg]:p-0">
                        {renderIcon(getTypeIcon(result.type))}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="truncate font-medium">{result.name}</div>
                        {result.description && (
                          <div className="truncate text-xs text-muted-foreground">
                            {result.description}
                          </div>
                        )}
                      </div>
                      {result.status && (
                        <span className={cn(
                          'ml-2 px-1.5 py-0.5 text-[10px] font-medium rounded flex-shrink-0',
                          getStatusColor(result.status)
                        )}>
                          {result.status}
                        </span>
                      )}
                    </button>
                  ))}
                  {query.trim() && (
                    <button
                      onClick={handleSearchSubmit}
                      className="flex items-center justify-center w-full px-3 py-2 text-sm text-primary font-medium border-t hover:bg-accent/50 transition-colors"
                    >
                      View all results for "{query}"
                    </button>
                  )}
                </>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);

HeaderSearch.displayName = 'HeaderSearch';
