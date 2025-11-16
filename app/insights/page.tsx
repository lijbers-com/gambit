'use client';

import { FunnelView } from '@/components/layout/page-templates/performance-dashboard.stories';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Mapping from button context to report tab
const getReportTabFromButton = (target: HTMLElement): string => {
  // Look up the DOM tree to find the card containing this button
  let element = target as HTMLElement | null;
  let cardTitle = '';

  // Search for the card title in parent elements
  while (element && element !== document.body) {
    // Look for h3 or h4 elements that might contain the report title
    const titleElement = element.querySelector('h3, h4');
    if (titleElement) {
      cardTitle = titleElement.textContent?.toLowerCase() || '';
      break;
    }

    // Also check if the current element itself has a title
    if (element.tagName === 'H3' || element.tagName === 'H4') {
      cardTitle = element.textContent?.toLowerCase() || '';
      break;
    }

    element = element.parentElement;
  }

  // Map card titles to report tabs
  if (cardTitle.includes('awareness')) return 'ecom-funnel-report';
  if (cardTitle.includes('consideration')) return 'ecom-funnel-report';
  if (cardTitle.includes('purchase')) return 'product-report';
  if (cardTitle.includes('iroas')) return 'iroas-report';
  if (cardTitle.includes('product')) return 'product-report';
  if (cardTitle.includes('funnel')) return 'ecom-funnel-report';
  if (cardTitle.includes('audience')) return 'audience-report';
  if (cardTitle.includes('goal')) return 'goal-report';
  if (cardTitle.includes('plays')) return 'product-report'; // Default to product report
  if (cardTitle.includes('roas') && !cardTitle.includes('iroas')) return 'product-report'; // Regular ROAS -> product report

  // Fallback: try to find any text content hints
  const parentCard = target.closest('[class*="card"]') || target.closest('div');
  const cardContent = parentCard?.textContent?.toLowerCase() || '';

  if (cardContent.includes('awareness')) return 'ecom-funnel-report';
  if (cardContent.includes('consideration')) return 'ecom-funnel-report';
  if (cardContent.includes('purchase')) return 'product-report';
  if (cardContent.includes('iroas')) return 'iroas-report';
  if (cardContent.includes('product')) return 'product-report';
  if (cardContent.includes('funnel')) return 'ecom-funnel-report';
  if (cardContent.includes('audience')) return 'audience-report';
  if (cardContent.includes('goal')) return 'goal-report';

  // Default fallback
  return 'product-report';
};

export default function InsightsPage() {
  const router = useRouter();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Check if the target is a button or is inside a button
      const button = target.closest('button');

      // Only proceed if we clicked on a button that contains "Full Report" text
      if (button && (button.textContent?.includes('Full Report') || button.textContent?.includes('View Full Report'))) {
        e.preventDefault();
        e.stopPropagation();

        const reportTab = getReportTabFromButton(button);
        router.push(`/insights/report?tab=${reportTab}`);
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [router]);

  const Component = FunnelView.render as () => React.JSX.Element;

  if (!Component) {
    return <div>Insights Dashboard</div>;
  }

  return <Component />;
}
