'use client';

import { SponsoredProductCalendar } from '@/components/layout/page-templates/bookings-calendar.stories';

export default function SponsoredProductsCalendarPage() {
  const Component = SponsoredProductCalendar.render as () => React.JSX.Element;

  if (!Component) {
    return <div>Sponsored Products Calendar</div>;
  }

  return <Component />;
}
