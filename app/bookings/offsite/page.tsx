'use client';

import { Offsite } from '@/components/layout/page-templates/bookings-overview.stories';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function OffsiteBookingsPage() {
  const router = useRouter();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const row = target.closest('tr');
      if (row && row.querySelector('td')) {
        const cells = row.querySelectorAll('td');
        const bookingId = Array.from(cells)
          .map((td) => td.textContent?.trim())
          .find((t) => t?.startsWith('LI-'));
        if (bookingId) {
          e.preventDefault();
          e.stopPropagation();
          router.push(`/campaigns/offsite/booking/${bookingId}`);
        }
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [router]);

  const Component = Offsite.render as () => React.JSX.Element;
  if (!Component) return <div>Offsite Bookings</div>;
  return <Component />;
}
