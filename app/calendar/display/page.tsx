'use client';

import { DisplayCalendar } from '@/components/layout/page-templates/bookings-calendar.stories';

export default function DisplayCalendarPage() {
  const Component = DisplayCalendar.render || (() => <div>Display Calendar</div>);
  return <Component />;
}
