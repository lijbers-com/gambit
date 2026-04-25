'use client';
import { GroupDetail } from '@/components/layout/page-templates/group-detail.stories';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import React from 'react';

export default function GroupDetailPage() {
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

  const Component = GroupDetail.render as () => React.JSX.Element;
  if (!Component) return <div>Group Detail</div>;
  return <Component />;
}
