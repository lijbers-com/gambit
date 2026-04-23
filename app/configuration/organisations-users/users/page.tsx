'use client';

import { UsersOverview } from '@/components/layout/page-templates/users-overview.stories';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import React from 'react';

export default function UsersPage() {
  const router = useRouter();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[role="menu"]') || target.closest('[data-radix-popper-content-wrapper]')) return;
      const row = target.closest('tr');
      if (row && row.querySelector('td')) {
        const cells = row.querySelectorAll('td');
        const userId = Array.from(cells).map(td => td.textContent?.trim()).find(t => t?.startsWith('USR-'));
        if (userId) {
          e.preventDefault();
          e.stopPropagation();
          router.push(`/configuration/organisations-users/users/${userId}`);
        }
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [router]);

  const Component = UsersOverview.render as () => React.JSX.Element;
  if (!Component) return <div>Users</div>;
  return <Component />;
}
