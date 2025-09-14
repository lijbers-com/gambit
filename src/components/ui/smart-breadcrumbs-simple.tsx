'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb';

export type SimpleBreadcrumbProps = {
  namespace: string;
  showNavToggle?: boolean;
  className?: string;
};

export const SmartBreadcrumbsSimple = ({
  namespace,
  showNavToggle = false,
  className,
}: SimpleBreadcrumbProps) => {
  return (
    <Breadcrumb namespace={namespace} showNavToggle={showNavToggle} className={`w-full relative ${className || ''}`}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>
            Current Page
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};