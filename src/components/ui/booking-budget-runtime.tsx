'use client';

import * as React from 'react';
import { FormSection } from './form-section';
import { Input, FieldHint } from './input';
import { DatePicker } from './date-picker';

/**
 * Budget & run time — one block, the same on every booking form.
 *
 * The two answer one question, "how much, and when", the way the media plan
 * already presents them together; as separate sections each form drew them
 * differently and some dropped budget entirely. Each end of the run is a
 * single date-and-time field (see DatePicker's time support): bookings start
 * and stop mid-day, and one field asks that as one question.
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
  children,
  className,
}) => (
  <FormSection bordered title="Budget & run time" className={className}>
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
      <div className="min-w-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
        <div className="min-w-0">
          <label className="block text-sm font-medium mb-2">Start date & time*</label>
          <DatePicker
            date={startDate}
            onDateChange={onStartDateChange}
            time={startTime}
            onTimeChange={onStartTimeChange}
            placeholder="Select date & time"
            className="w-full min-w-0"
          />
        </div>
        <div className="min-w-0">
          <label className="block text-sm font-medium mb-2">End date & time*</label>
          <DatePicker
            date={endDate}
            onDateChange={onEndDateChange}
            time={endTime}
            onTimeChange={onEndTimeChange}
            placeholder="Select date & time"
            className="w-full min-w-0"
          />
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
