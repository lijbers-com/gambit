'use client';

import { Link } from '@/lib/router-context';
import { Suspense, Fragment } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
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

      // Line-item detail pages
      if (fullPath.match(/^\/campaigns\/[^/]+\/line-item\/[^/]+$/)) {
        const lineItemId = path;
        return breadcrumbContext.getLineItemName(lineItemId);
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

  return (
    <Breadcrumb namespace={namespace} showNavToggle={showNavToggle} className={`w-full relative ${className || ''}`}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link
              href={constructUrl('/', passQueryParameters, searchParams)}
              data-testid="root-link"
            >
              {homeTitle}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {!onHomepage && <BreadcrumbSeparator />}
{crumbs.map((crumb, index) => {
          const url = constructUrl(
            crumb.pathName,
            passQueryParameters,
            searchParams,
          );
          const isLast = index === crumbs.length - 1;

          return (
            <Fragment key={`crumb-${index}`}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>
                    {crumb.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link
                      href={url}
                      data-testid={`${getLastPartOfThePath(crumb.pathName)}-link`}
                    >
                      {crumb.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator key={`separator-${index}`} />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export const SmartBreadcrumbs = (props: BreadcrumbProps) => {
  return (
    <Suspense fallback={<div className="h-12 w-full bg-gray-100 animate-pulse rounded" />}>
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