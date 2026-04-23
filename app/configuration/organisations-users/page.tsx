'use client';

import { OrganisationOverview } from '@/components/layout/page-templates/organisation-overview.stories';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import React from 'react';

export default function OrganisationsPage() {
  const router = useRouter();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Skip dropdown menu clicks
      if (target.closest('[role="menu"]') || target.closest('[data-radix-popper-content-wrapper]')) return;
      const row = target.closest('tr');
      if (row && row.querySelector('td')) {
        const cells = row.querySelectorAll('td');
        const orgId = Array.from(cells).map(td => td.textContent?.trim()).find(t => t?.startsWith('ORG-'));
        if (orgId) {
          e.preventDefault();
          e.stopPropagation();
          router.push(`/configuration/organisations-users/${orgId}`);
        }
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [router]);

  const Component = OrganisationOverview.render as () => React.JSX.Element;
  if (!Component) return <div>Organisations</div>;
  return <Component />;
}
