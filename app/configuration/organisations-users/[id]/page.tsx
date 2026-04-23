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
      const row = target.closest('tr');
      if (row && row.querySelector('td')) {
        const cells = row.querySelectorAll('td');
        const cellTexts = Array.from(cells).map(td => td.textContent?.trim());
        const userId = cellTexts.find(t => t?.startsWith('USR-'));
        if (userId) {
          e.preventDefault();
          e.stopPropagation();
          router.push(`/configuration/organisations-users/users/${userId}`);
        }
        const contractId = cellTexts.find(t => t?.startsWith('CON-'));
        if (contractId) {
          e.preventDefault();
          e.stopPropagation();
          router.push(`/configuration/organisations-users/contracts/${contractId}`);
        }
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [router]);

  const Component = OrganisationDetail.render as () => React.JSX.Element;
  if (!Component) return <div>Organisation Detail</div>;
  return <Component />;
}
