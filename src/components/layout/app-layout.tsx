"use client";

import { ReactNode, useState } from "react";
import { SideNavigation, Route } from "@/components/ui/side-navigation";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { PageHeader } from "@/components/ui/page-header";
import { DateRangePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { PanelLeftOpen, PanelLeftClose } from "lucide-react";
import { useMenu } from "@/hooks/use-menu";
import { DateRange } from "react-day-picker";

export interface AppLayoutProps {
  children: ReactNode;
  routes: Route[];
  logo?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  user?: {
    name?: string;
    avatar?: string;
  };
  onLogout?: () => void;
  breadcrumbProps?: React.ComponentProps<typeof Breadcrumb>;
  pageHeaderProps?: React.ComponentProps<typeof PageHeader>;
  className?: string;
}

export function AppLayout({
  children,
  routes,
  logo,
  user,
  onLogout,
  breadcrumbProps,
  pageHeaderProps,
  className,
}: AppLayoutProps) {
  const { toggleCollapsed, collapsed } = useMenu();
  
  // Initialize with a default date range (last 30 days)
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date(), // today
  });

  return (
    <div className={`grid h-screen w-full bg-white transition-all duration-300 ${collapsed ? 'grid-cols-[88px_1fr]' : 'grid-cols-[270px_1fr]'}`}> 
      {/* Side Navigation */}
      <div className="h-screen">
      <SideNavigation
        routes={routes}
        user={user}
        onLogout={onLogout}
          className="bg-white h-full"
      />
      </div>
      {/* Main Area */}
      <div className="flex flex-col min-w-0 h-screen overflow-x-auto">
        {/* Breadcrumb */}
        <div className="bg-white">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCollapsed}
              className="mr-2 ml-4 hover:bg-transparent"
              aria-label="Toggle navigation"
            >
              {collapsed ? (
                <PanelLeftOpen className="h-5 w-5" />
              ) : (
                <PanelLeftClose className="h-5 w-5" />
              )}
            </Button>
            <Breadcrumb className="w-full px-4 py-3 relative bg-white">
              <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="home">
                  Home
                </BreadcrumbLink>
                <span className="mx-4">›</span>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink href="/offline-media">
                  <span className="text-sm capitalize">Offline-Media</span>
                </BreadcrumbLink>
                <span className="mx-4">›</span>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink href="/offline-media/bookings">
                  <span className="text-sm capitalize">Bookings</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          </div>
        </div>
        {/* Page Header */}
        <PageHeader
          title={pageHeaderProps?.title || "PageHeader Title"}
          subtitle={pageHeaderProps?.subtitle}
          headerRight={
            pageHeaderProps?.headerRight || (
              <DateRangePicker
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                placeholder="Select date range"
                showPresets={true}
                className="w-[280px]"
              />
            )
          }
          {...pageHeaderProps}
        />
        {/* Page Content Area */}
        <div className="bg-slate-50 w-full p-6 pb-24">
            {children}
        </div>
      </div>
    </div>
  );
} 