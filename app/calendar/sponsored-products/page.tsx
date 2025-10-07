'use client';

import { SponsoredProductCalendar } from '@/components/layout/page-templates/bookings-calendar.stories';

export default function SponsoredProductsCalendarPage() {
  const Component = SponsoredProductCalendar.render || (() => <div>Sponsored Products Calendar</div>);
  return <Component />;
}
