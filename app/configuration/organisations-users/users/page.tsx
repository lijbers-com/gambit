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
      const row = target.closest('tr[data-row-id]') as HTMLElement | null;
      if (row) {
        const id = row.getAttribute('data-row-id');
        if (id?.startsWith('USR-')) {
          e.preventDefault();
          e.stopPropagation();
          router.push(`/configuration/organisations-users/users/${id}`);
        }
      }
    };
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [router]);

  const Component = UsersOverview.render as () => React.JSX.Element;
  if (!Component) return <div>Users</div>;
  return <Component />;
}
