'use client';

import { OfflineInstoreCalendar } from '@/components/layout/page-templates/bookings-calendar.stories';

export default function OfflineInstoreCalendarPage() {
  const Component = OfflineInstoreCalendar.render || (() => <div>Offline In-store Calendar</div>);
  return <Component />;
}
