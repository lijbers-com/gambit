'use client';

import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from './breadcrumb';
import { ChevronRight } from 'lucide-react';
import {
  ReadonlyURLSearchParams,
  usePathname,
  useSearchParams,
} from 'next/navigation';

export type BreadcrumbProps = {
  namespace: string;
  passQueryParameters?: boolean | string[];
  homeTitle?: string;
  className?: string;
};

export const SmartBreadcrumbs = ({
  namespace,
  passQueryParameters = false,
  homeTitle = 'Home',
  className,
}: BreadcrumbProps) => {
  const pathName = usePathname();
  const searchParams = useSearchParams();
  
  // Handle cases where hooks return null (like in Storybook)
  const pathNames = pathName ? pathName.split('/').filter(Boolean) : [];
  const onHomepage = pathNames.length === 0;

  const crumbs = pathNames.map((path, index) => {
    const label = decodeURI(path);
    const labelWithoutQueryParams = label.substring(0, label.indexOf('?'));
    return {
      label: decodeURIComponent(labelWithoutQueryParams || label),
      previousCrumb: pathNames[index - 1],
      pathName: `/${pathNames.slice(0, index + 1).join('/')}`,
    };
  });

  return (
    <Breadcrumb className={`w-full relative ${className || ''}`}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <Link
            href={constructUrl('/', passQueryParameters, searchParams)}
            data-testid="root-link"
            className="home"
          >
            <div className="flex items-center justify-center rounded-md">
              {homeTitle}
            </div>
          </Link>
          {!onHomepage && <ChevronRight width="16" height="16" />}
        </BreadcrumbItem>
        {crumbs.map((crumb, index) => {
          const url = constructUrl(
            crumb.pathName,
            passQueryParameters,
            searchParams,
          );
          const isLast = index === crumbs.length - 1;

          return (
            <BreadcrumbItem key={index}>
              <Link
                href={url}
                data-testid={`${getLastPartOfThePath(crumb.pathName)}-link`}
              >
                <span className="text-sm text-muted-foreground capitalize">
                  {crumb.label}
                </span>
              </Link>

              {!isLast && <ChevronRight width="16" height="16" />}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
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