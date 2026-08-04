'use client';

import { Link } from '@/lib/router-context';
import { Suspense, Fragment, useEffect, useRef, useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from './breadcrumb';
import {
  usePathname,
  useSearchParams,
} from '@/lib/router-context';
import { useBreadcrumbOptional } from '@/contexts/breadcrumb-context';
import { extendedRoutes } from '@/components/layout/default-routes';
import { Route } from './side-navigation';

type ReadonlyURLSearchParams = {
  get: (key: string) => string | null;
  forEach: (callback: (value: string, key: string) => void) => void;
};

export type BreadcrumbProps = {
  namespace: string;
  passQueryParameters?: boolean | string[];
  homeTitle?: string;
  className?: string;
  routes?: Route[];
  showNavToggle?: boolean;
};

const SmartBreadcrumbsInner = ({
  namespace,
  passQueryParameters = false,
  homeTitle = 'Home',
  className,
  routes = [],
  showNavToggle = false,
}: BreadcrumbProps) => {
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const breadcrumbContext = useBreadcrumbOptional();

  // Handle cases where hooks return null (like in Storybook)
  const pathNames = pathName ? pathName.split('/').filter(Boolean) : [];
  const onHomepage = pathNames.length === 0;

  // Use extended routes for better breadcrumb matching
  const allRoutes = routes.length > 0 ? routes : extendedRoutes;

  // Function to get proper name from routes configuration
  const getRouteLabel = (path: string, fullPath: string): string => {
    // Handle dynamic routes with breadcrumb context
    if (breadcrumbContext) {
      // Campaign detail pages
      if (fullPath.match(/^\/campaigns\/[^/]+\/[^/]+$/)) {
        const campaignId = path;
        return breadcrumbContext.getCampaignName(campaignId);
      }

      // Booking detail pages
      if (fullPath.match(/^\/campaigns\/[^/]+\/booking\/[^/]+$/)) {
        const bookingId = path;
        return breadcrumbContext.getBookingName(bookingId);
      }

      // Creative detail pages
      if (fullPath.match(/^\/campaigns\/[^/]+\/creative\/[^/]+$/)) {
        const creativeId = path;
        return breadcrumbContext.getCreativeName(creativeId);
      }
    }

    // Check direct routes first
    for (const route of allRoutes) {
      if (route.url === fullPath) {
        return route.name;
      }
      // Check subitems
      if (route.subitems) {
        for (const subitem of route.subitems) {
          if (subitem.url === fullPath) {
            return subitem.name;
          }
        }
      }
      // Check pattern matching for dynamic routes
      if (route.pattern && fullPath.match(route.pattern.replace('*', '.*'))) {
        return route.name;
      }
    }

    // If no exact match found, check parent routes for section names
    const pathSegments = fullPath.split('/').filter(Boolean);
    if (pathSegments.length >= 1) {
      const parentPath = `/${pathSegments[0]}`;
      for (const route of allRoutes) {
        if (route.subitems && route.subitems.some(sub => sub.url?.startsWith(parentPath))) {
          if (pathSegments.length === 1) {
            return route.name;
          }
        }
      }
    }

    // Fallback to formatted path segment
    return formatLabel(path);
  };

  // Function to format labels
  const formatLabel = (label: string): string => {
    return label
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const crumbs = pathNames.map((path, index) => {
    const decodedPath = decodeURI(path);
    const pathWithoutQueryParams = decodedPath.substring(0, decodedPath.indexOf('?')) || decodedPath;
    const fullPath = `/${pathNames.slice(0, index + 1).join('/')}`;
    
    return {
      label: getRouteLabel(pathWithoutQueryParams, fullPath),
      previousCrumb: pathNames[index - 1],
      pathName: fullPath,
    };
  });

  // Unified item array so the render is a single map. The first item is
  // always "Home"; the rest are the path crumbs (final one is the current
  // page, no link).
  type Item =
    | { kind: 'crumb'; label: string; href: string; isPage: boolean; testId?: string }
    | { kind: 'ellipsis' };
  const items: Item[] = [
    {
      kind: 'crumb',
      label: homeTitle,
      href: constructUrl('/', passQueryParameters, searchParams),
      isPage: onHomepage,
      testId: 'root-link',
    },
    ...crumbs.map((crumb, index) => ({
      kind: 'crumb' as const,
      label: crumb.label,
      href: constructUrl(crumb.pathName, passQueryParameters, searchParams),
      isPage: index === crumbs.length - 1,
      testId: `${getLastPartOfThePath(crumb.pathName)}-link`,
    })),
  ];

  // Responsive collapse: when the breadcrumb row overflows the available
  // width, hide the middle items and surface a "…" so the trail still
  // fits on one line. We keep Home + the last two crumbs visible so the
  // user always sees where they came from and where they are.
  const olRef = useRef<HTMLOListElement>(null);
  const [collapsed, setCollapsed] = useState(false);
  // Stored full-width threshold so we can re-expand without oscillating
  // (we only un-collapse once the container is comfortably wider than
  // the last-known fully-rendered scrollWidth).
  const fullScrollWidthRef = useRef<number | null>(null);
  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return;
    const el = olRef.current;
    if (!el) return;
    const check = () => {
      if (collapsed) {
        const threshold = fullScrollWidthRef.current;
        if (threshold !== null && el.clientWidth >= threshold + 24) {
          fullScrollWidthRef.current = null;
          setCollapsed(false);
        }
      } else if (el.scrollWidth > el.clientWidth + 1) {
        fullScrollWidthRef.current = el.scrollWidth;
        setCollapsed(true);
      }
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [collapsed, items.length, pathName]);

  // Apply the collapse: keep first + the last two; everything in between
  // is replaced by a single ellipsis item. Need at least 4 items for
  // collapsing to make sense (Home + 2 visible = 3, plus the ones being
  // hidden under "…").
  const visibleItems: Item[] =
    collapsed && items.length > 3
      ? [items[0], { kind: 'ellipsis' }, items[items.length - 2], items[items.length - 1]]
      : items;

  return (
    <Breadcrumb namespace={namespace} showNavToggle={showNavToggle} className={`w-full relative ${className || ''}`}>
      <BreadcrumbList
        ref={olRef}
        className="flex flex-nowrap items-center gap-1 overflow-hidden min-w-0"
      >
        {visibleItems.map((item, idx) => {
          const isLast = idx === visibleItems.length - 1;
          if (item.kind === 'ellipsis') {
            return (
              <Fragment key={`ellipsis-${idx}`}>
                <BreadcrumbItem>
                  <BreadcrumbEllipsis />
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </Fragment>
            );
          }
          return (
            <Fragment key={`crumb-${idx}`}>
              <BreadcrumbItem className="shrink-0">
                {item.isPage ? (
                  <BreadcrumbPage className="whitespace-nowrap">
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link
                      href={item.href}
                      data-testid={item.testId}
                      className="whitespace-nowrap"
                    >
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator className="shrink-0" />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export const SmartBreadcrumbs = (props: BreadcrumbProps) => {
  return (
    <Suspense fallback={<div className="h-12 w-full bg-neutral-100 animate-pulse rounded" />}>
      <SmartBreadcrumbsInner {...props} />
    </Suspense>
  );
};

// Accepts both boolean and string[] as passQueryParameters, since sometimes you want to pass all and sometimes only some
function constructUrl(
  rootUrl: string,
  passQueryParameters: boolean | string[],
  searchParams: ReadonlyURLSearchParams,
) {
  if (passQueryParameters) {
    const params = new URLSearchParams();

    if (Array.isArray(passQueryParameters)) {
      // Filter searchParams based on the array of allowed keys
      searchParams.forEach((value, key) => {
        if (passQueryParameters.includes(key)) {
          params.set(key, value);
        }
      });
    } else {
      // If passQueryParameters is true, include all searchParams
      searchParams.forEach((value, key) => {
        params.set(key, value);
      });
    }

    const queryString = params.toString();
    return queryString ? `${rootUrl}?${queryString}` : rootUrl;
  }

  return rootUrl;
}

// Helper function to get the last part of the path
function getLastPartOfThePath(path: string) {
  return path.substring(path.lastIndexOf('/') + 1);
} 