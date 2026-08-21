'use client';

import * as React from 'react';
import { Clock } from 'lucide-react';
import { FormSection } from './form-section';
import { Input, FieldHint } from './input';
import { DateRangePicker, futureDateRangePresets } from './date-picker';
import { retailMoments } from '@/lib/retail-moments';

/**
 * Budget & run time — one block, the same on every booking form.
 *
 * The two answer one question, "how much, and when", the way the media plan
 * already presents them together; as separate sections each form drew them
 * differently and some dropped budget entirely. The run time is ONE range
 * field — a run is a span, not two independent dates — with the same retail
 * events in its calendar the media plan's picker shows. Bookings start and
 * stop mid-day, so a compact start/end time pair sits under the range.
 *
 * Active days is part of the block too, behind `activeDays` — only the
 * propositions that can schedule by weekday (display, digital in-store,
 * offsite) pass it; the others simply don't get the row.
 */
export interface BookingBudgetRuntimeProps {
  budget: string;
  onBudgetChange: (value: string) => void;
  startDate?: Date;
  endDate?: Date;
  onStartDateChange: (date?: Date) => void;
  onEndDateChange: (date?: Date) => void;
  startTime: string;
  endTime: string;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
  /** The campaign's own numbers, shown as context under the fields. */
  campaignBudget?: string;
  campaignRuntime?: string;
  /** Weekday scheduling, for the propositions that support it. */
  activeDays?: string[];
  onActiveDaysChange?: (days: string[]) => void;
  /** The detail pages render this as a standalone bordered section; inside a
   *  wizard's step card the border is the card's, so pass false. */
  bordered?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const DAYS = [
  { id: 'mo', label: 'Mo' },
  { id: 'tu', label: 'Tu' },
  { id: 'we', label: 'We' },
  { id: 'th', label: 'Th' },
  { id: 'fr', label: 'Fr' },
  { id: 'sa', label: 'Sa' },
  { id: 'su', label: 'Su' },
];
const WEEKDAYS = ['mo', 'tu', 'we', 'th', 'fr'];
const WEEKEND = ['sa', 'su'];

const ActiveDays: React.FC<{ value: string[]; onChange: (days: string[]) => void }> = ({
  value,
  onChange,
}) => (
  <div className="min-w-0">
    <label className="block text-sm font-medium mb-2">Active days</label>
    <div className="space-y-3">
      <div className="flex gap-2 flex-wrap">
        {DAYS.map((day) => (
          <button
            key={day.id}
            type="button"
            onClick={() =>
              onChange(
                value.includes(day.id) ? value.filter((d) => d !== day.id) : [...value, day.id],
              )
            }
            className={`w-10 h-10 rounded-full text-sm font-medium transition-colors border ${
              value.includes(day.id)
                ? 'bg-background border-primary text-foreground'
                : 'bg-background border-input text-muted-foreground hover:border-muted-foreground/50'
            }`}
          >
            {day.label}
          </button>
        ))}
      </div>
      {/* Shortcut row sits under the days at hint size, like every sub-line. */}
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <button type="button" className="text-primary hover:underline" onClick={() => onChange(WEEKEND)}>Weekend</button>
        <span>·</span>
        <button type="button" className="text-primary hover:underline" onClick={() => onChange(WEEKDAYS)}>Weekdays</button>
        <span>·</span>
        <button type="button" className="text-primary hover:underline" onClick={() => onChange([...WEEKDAYS, ...WEEKEND])}>All</button>
      </div>
    </div>
  </div>
);

export const BookingBudgetRuntime: React.FC<BookingBudgetRuntimeProps> = ({
  budget,
  onBudgetChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  campaignBudget,
  campaignRuntime,
  activeDays,
  onActiveDaysChange,
  bordered = true,
  children,
  className,
}) => (
  <FormSection bordered={bordered} title="Budget & run time" className={className}>
    <div className="space-y-4 min-w-0">
      <div>
        <label className="block text-sm font-medium mb-2">Booking budget*</label>
        <Input
          type="number"
          value={budget}
          onChange={(e) => onBudgetChange(e.target.value)}
          placeholder="Enter budget"
          className="w-full"
          min="0"
        />
        {campaignBudget && <FieldHint>Campaign budget: {campaignBudget}</FieldHint>}
      </div>
      <div className="min-w-0 space-y-3">
        <div className="min-w-0">
          <label className="block text-sm font-medium mb-2">Run time*</label>
          <DateRangePicker
            dateRange={startDate ? { from: startDate, to: endDate } : undefined}
            onDateRangeChange={(range) => {
              onStartDateChange(range?.from);
              onEndDateChange(range?.to);
            }}
            placeholder="Select start and end date"
            showPresets
            showWeekNumbers
            events={retailMoments}
            presets={futureDateRangePresets}
            className="w-full min-w-0"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
          <div className="min-w-0">
            <label className="block text-sm text-muted-foreground mb-1">Start time</label>
            <div className="relative">
              <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={startTime} onChange={(e) => onStartTimeChange(e.target.value)} className="pl-9" placeholder="00:00" />
            </div>
          </div>
          <div className="min-w-0">
            <label className="block text-sm text-muted-foreground mb-1">End time</label>
            <div className="relative">
              <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={endTime} onChange={(e) => onEndTimeChange(e.target.value)} className="pl-9" placeholder="23:59" />
            </div>
          </div>
        </div>
        {campaignRuntime && <FieldHint>Campaign runtime: {campaignRuntime}</FieldHint>}
      </div>
      {activeDays && onActiveDaysChange && (
        <ActiveDays value={activeDays} onChange={onActiveDaysChange} />
      )}
      {children}
    </div>
  </FormSection>
);
