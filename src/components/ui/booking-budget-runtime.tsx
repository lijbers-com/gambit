'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { FormSection } from './form-section';
import { Input } from './input';
import { DatePicker } from './date-picker';

/**
 * Budget & run time — one block, the same on every booking form.
 *
 * The two answer one question, "how much, and when", the way the media plan
 * already presents them together; as separate sections each form drew them
 * differently and some dropped budget entirely. Run time is a date AND a
 * time per end: bookings start and stop mid-day (a store opening, a campaign
 * going live at noon), which date-only fields could not say.
 *
 * Proposition-specific scheduling extras (digital in-store's active days)
 * render as children below the shared fields, so a form can add to the block
 * without forking it — the same pattern as the create-placement block.
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
  children?: React.ReactNode;
  className?: string;
}

const DateAndTime: React.FC<{
  label: string;
  date?: Date;
  onDateChange: (date?: Date) => void;
  time: string;
  onTimeChange: (value: string) => void;
}> = ({ label, date, onDateChange, time, onTimeChange }) => (
  <div className="min-w-0">
    <label className="block text-sm font-medium mb-2">{label}</label>
    <div className="flex gap-3 min-w-0">
      <DatePicker date={date} onDateChange={onDateChange} placeholder="Select date" className="w-full min-w-0" />
      <Input
        type="time"
        value={time}
        onChange={(e) => onTimeChange(e.target.value)}
        className="w-28 shrink-0"
      />
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
        {campaignBudget && (
          <p className="mt-2 text-sm text-muted-foreground">Campaign budget: {campaignBudget}</p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
        <DateAndTime
          label="Start date & time*"
          date={startDate}
          onDateChange={onStartDateChange}
          time={startTime}
          onTimeChange={onStartTimeChange}
        />
        <DateAndTime
          label="End date & time*"
          date={endDate}
          onDateChange={onEndDateChange}
          time={endTime}
          onTimeChange={onEndTimeChange}
        />
      </div>
      {campaignRuntime && (
        <div className="text-sm text-muted-foreground">Campaign runtime: {campaignRuntime}</div>
      )}
      {children}
    </div>
  </FormSection>
);
