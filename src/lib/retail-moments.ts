import type { CalendarEvent } from '@/components/ui/calendar';

/**
 * The retail calendar — the moments a media plan is usually planned around.
 * Shown as coloured dots in the media plan's date pickers so a run time can be
 * laid against the moments that matter, without leaving the picker. Colours
 * come from the chart palette, the same ramp the bookings calendar draws with.
 */
export const retailMoments: CalendarEvent[] = [
  { date: '2026-08-17', label: 'Back to School', color: 'hsl(var(--chart-1))' },
  { date: '2026-10-07', label: 'Wijnweken', color: 'hsl(var(--chart-2))' },
  { date: '2026-10-31', label: 'Halloween', color: 'hsl(var(--chart-3))' },
  { date: '2026-11-27', label: 'Black Friday', color: 'hsl(var(--chart-4))' },
  { date: '2026-12-05', label: 'Sinterklaas', color: 'hsl(var(--chart-5))' },
  { date: '2026-12-25', label: 'Kerst', color: 'hsl(var(--chart-1))' },
];
