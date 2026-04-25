'use client';

import { OrganisationDetail } from '@/components/layout/page-templates/organisation-detail.stories';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import React from 'react';

export default function OrganisationDetailPage() {
  const router = useRouter();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[role="menu"]') || target.closest('[data-radix-popper-content-wrapper]')) return;
      const row = target.closest('tr[data-row-id]') as HTMLElement | null;
      if (row) {
        const id = row.getAttribute('data-row-id');
        if (!id) return;
        e.preventDefault();
        e.stopPropagation();
        if (id.startsWith('USR-')) {
          router.push(`/configuration/organisations-users/users/${id}`);
        } else if (id.startsWith('CON-')) {
          router.push(`/configuration/organisations-users/contracts/${id}`);
        } else if (id.startsWith('GRP-')) {
          router.push(`/configuration/organisations-users/groups/${id}`);
        } else if (id.startsWith('KEY-')) {
          router.push(`/configuration/organisations-users/tokens/${id}`);
        }
      }
    };
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [router]);

  const Component = OrganisationDetail.render as () => React.JSX.Element;
  if (!Component) return <div>Organisation Detail</div>;
  return <Component />;
}
