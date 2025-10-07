'use client';

import { DigitalInstoreCalendar } from '@/components/layout/page-templates/bookings-calendar.stories';

export default function DigitalInstoreCalendarPage() {
  const Component = DigitalInstoreCalendar.render || (() => <div>Digital In-store Calendar</div>);
  return <Component />;
}
