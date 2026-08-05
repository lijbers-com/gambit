'use client';

import * as React from 'react';
import type { DateRange } from 'react-day-picker';
import { DateRangePicker } from './date-picker';
import { useSessionFilters, setSessionFilters } from '@/lib/session-filters';

/**
 * The date range in a page header, bound to the session rather than the page.
 *
 * Every overview that shows things with a run time uses this one control, so
 * the range the user picked on campaigns is still applied when they open
 * bookings. See lib/session-filters for why it is session state.
 */
export const SessionDateRange: React.FC<{ className?: string }> = ({ className }) => {
  const filters = useSessionFilters();

  const value: DateRange | undefined =
    filters.dateFrom && filters.dateTo
      ? { from: new Date(filters.dateFrom), to: new Date(filters.dateTo) }
      : undefined;

  return (
    <DateRangePicker
      className={className}
      dateRange={value}
      placeholder="All dates"
      onDateRangeChange={(range) =>
        setSessionFilters({
          // Only a complete range filters; a half-picked one would hide rows
          // while the user is still choosing.
          dateFrom: range?.from && range?.to ? range.from.toISOString().slice(0, 10) : undefined,
          dateTo: range?.from && range?.to ? range.to.toISOString().slice(0, 10) : undefined,
        })
      }
    />
  );
};
