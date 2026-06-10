'use client';

import { SponsoredProducts } from '@/components/layout/page-templates/bookings-overview.stories';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SponsoredProductsBookingsPage() {
  const router = useRouter();

  // Intercept row clicks on the bookings table and route to the existing
  // /campaigns/sponsored-products/booking/[bookingId] detail page. We look
  // for an `LI-` prefix in the first cells to identify the booking row.
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
          router.push(`/campaigns/sponsored-products/booking/${bookingId}`);
        }
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [router]);

  const Component = SponsoredProducts.render as () => React.JSX.Element;
  if (!Component) return <div>Sponsored Products Bookings</div>;
  return <Component />;
}
