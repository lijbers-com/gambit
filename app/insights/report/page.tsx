'use client';

import { ProductReportView } from '@/components/layout/page-templates/performance-dashboard.stories';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function InsightsReportPage() {
  const searchParams = useSearchParams();
  const [targetTab, setTargetTab] = useState<string | null>(null);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      // Validate the tab parameter against available tabs
      const validTabs = ['product-report', 'audience-report', 'iroas-report', 'ecom-funnel-report', 'goal-report'];
      if (validTabs.includes(tabParam)) {
        setTargetTab(tabParam);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (targetTab) {
      // Wait for the component to mount and then programmatically click the correct tab
      const timer = setTimeout(() => {
        // Find the tab button with the correct label and click it
        const tabLabels: Record<string, string> = {
          'product-report': 'Product Report',
          'audience-report': 'Audience Report',
          'iroas-report': 'IROAS Report',
          'ecom-funnel-report': 'Ecom Funnel Report',
          'goal-report': 'Goal Report'
        };

        const targetLabel = tabLabels[targetTab];
        if (targetLabel) {
          // Find and click the tab button
          const tabButtons = document.querySelectorAll('button, [role="tab"]');
          for (const button of tabButtons) {
            if (button.textContent?.includes(targetLabel)) {
              (button as HTMLElement).click();
              break;
            }
          }
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [targetTab]);

  const Component = ProductReportView.render as () => React.JSX.Element;

  if (!Component) {
    return <div>Insights Report View</div>;
  }

  return <Component />;
}
