"use client";

import { ReactNode, useState, useEffect } from "react";
import { SideNavigation, Route } from "@/components/ui/side-navigation";
import { SmartBreadcrumbs } from "@/components/ui/smart-breadcrumbs";
import { PageHeader } from "@/components/ui/page-header";
import { DateRangePicker } from "@/components/ui/date-picker";
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
  breadcrumbProps?: React.ComponentProps<typeof SmartBreadcrumbs>;
  pageHeaderProps?: React.ComponentProps<typeof PageHeader>;
}

export function AppLayout({
  children,
  routes,
  logo,
  user,
  onLogout,
  breadcrumbProps,
  pageHeaderProps,
}: AppLayoutProps) {
  const { collapsed } = useMenu();
  
  // Diagnostic effect for theme debugging
  useEffect(() => {
    // Log classes and variable on current document
    console.log('BODY classes:', document.body.className);
    console.log('HTML classes:', document.documentElement.className);
    console.log('--brand-app-bg-hex on body:', getComputedStyle(document.body).getPropertyValue('--brand-app-bg-hex'));
    // If inside Storybook, also check the parent iframe
    if (window.parent !== window) {
      try {
        const iframe = window.parent.document.querySelector('iframe#storybook-preview-iframe') as HTMLIFrameElement | null;
        const iframeBody = iframe?.contentDocument?.body;
        const iframeHtml = iframe?.contentDocument?.documentElement;
        if (iframeBody && iframeHtml) {
          console.log('IFRAME BODY classes:', iframeBody.className);
          console.log('IFRAME HTML classes:', iframeHtml.className);
          console.log('--brand-app-bg-hex on IFRAME body:', getComputedStyle(iframeBody).getPropertyValue('--brand-app-bg-hex'));
        }
      } catch (e) {
        // cross-origin, ignore
      }
    }
  }, []);

  // Initialize with a default date range (last 30 days)
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date(), // today
  });
  const [conversionWindow, setConversionWindow] = useState<number>(14);

  return (
    <div className={`grid h-screen w-full transition-all duration-300 ${collapsed ? 'grid-cols-[72px_1fr]' : 'grid-cols-[285px_1fr]'}`} style={{ background: 'var(--brand-app-bg-hex)' }}> 
      {/* Side Navigation */}
      <div className="h-screen">
      <SideNavigation
        routes={routes}
        logo={logo}
        user={user}
        onLogout={onLogout}
        className="h-full"
        style={{ background: 'var(--brand-app-bg-hex)' }}
      />
      </div>
      {/* Main Area */}
      <div className="flex flex-col min-w-0 h-screen overflow-x-hidden">
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {/* Breadcrumb */}
          <div style={{ background: 'var(--brand-app-bg-hex)' }}>
            <div className="flex items-center">
              <SmartBreadcrumbs
                namespace="gambit"
                routes={routes}
                showNavToggle={true}
                className="w-full py-3 relative bg-white"
                {...breadcrumbProps}
              />
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
                  placeholder="Select date range with conversion window"
                  showPresets={true}
                  showConversionWindow={true}
                  conversionWindow={conversionWindow}
                  onConversionWindowChange={setConversionWindow}
                  className="w-[280px]"
                />
              )
            }
            {...pageHeaderProps}
          />
          {/* Page Content Area */}
          <div className="w-full p-6 pb-24 min-h-screen bg-slate-50 overflow-x-hidden">
              <div className="max-w-full">
                {children}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
} 