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
      if (target.closest('[role="menu"]') || target.closest('[data-radix-popper-content-wrapper]')) return;
      const row = target.closest('tr[data-row-id]') as HTMLElement | null;
      if (row) {
        const id = row.getAttribute('data-row-id');
        if (id?.startsWith('ORG-')) {
          e.preventDefault();
          router.push(`/configuration/organisations-users/${id}`);
        } else if (id?.startsWith('USR-')) {
          e.preventDefault();
          router.push(`/configuration/organisations-users/users/${id}`);
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
