'use client';

import { DigitalInstoreCalendar } from '@/components/layout/page-templates/bookings-calendar.stories';

export default function DigitalInstoreCalendarPage() {
  const Component = DigitalInstoreCalendar.render as () => React.JSX.Element;

  if (!Component) {
    return <div>Digital In-store Calendar</div>;
  }

  return <Component />;
}
