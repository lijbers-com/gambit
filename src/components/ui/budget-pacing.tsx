'use client';

import * as React from 'react';
import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Input, FieldHint } from './input';
import { Label } from './label';
import { Switch } from './switch';
import { DateRangePicker } from './date-picker';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu';
import { retailMoments } from '@/lib/retail-moments';

/**
 * Auto pacing — how a budget is spread over the days a booking runs.
 *
 * Without it, a daily cap is a number the advertiser has to keep re-deriving:
 * spend faster than planned and the flight ends early, slower and the budget is
 * left on the table. Auto pacing takes the remaining budget, divides it by the
 * days remaining, and adjusts that target every day as actual delivery comes
 * in — so under- and overspend correct themselves instead of being noticed
 * afterwards.
 *
 * Rules it implements:
 *  - On by default. It is the behaviour advertisers expect from every other
 *    platform, and the manual alternative is the one that needs a decision.
 *  - The daily budget field is DISABLED while it is on — the number is derived,
 *    and an editable field showing a derived number invites a fight over which
 *    one is true. The value still shows, so it is never a mystery.
 *  - It needs an end date. "Spread the rest over the days remaining" has no
 *    meaning without a last day, so with an open-ended flight the toggle is
 *    off and cannot be turned on.
 *  - Date overrides raise or lower the cap for a stretch of the flight — a
 *    retail moment, a weekend, a launch — with a multiplier on the paced
 *    target. Multiple per booking, and they may not overlap.
 *
 * This is the same control for every proposition that bids: sponsored products
 * always, and display, digital in-store and offsite whenever the campaign is an
 * auction campaign. Guaranteed campaigns buy a fixed delivery, so there is no
 * pacing decision to make.
 */

export type PacingShape = 'account' | 'even' | 'frontloaded' | 'asap';

export interface PacingOverride {
  id: string;
  from?: Date;
  to?: Date;
  /** Multiplier on the paced daily target for those days. */
  multiplier: number;
}

export const MULTIPLIERS = [0.5, 0.75, 1.5, 2, 3];

/** The multiplier picker on an override row. */
const MultiplierSelect: React.FC<{ value: number; onChange: (v: number) => void }> = ({ value, onChange }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" className="w-full justify-between font-normal">
        {value}×
        <ChevronDown className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
      {MULTIPLIERS.map((m) => (
        <DropdownMenuItem key={m} onClick={() => onChange(m)}>{m}×</DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

const SHAPES: Record<PacingShape, { title: string; description: string }> = {
  account: {
    title: 'Account setting',
    description: 'Follows the default configured for your account.',
  },
  even: {
    title: 'Even',
    description: 'The same target every day, so the budget lasts exactly as long as the flight.',
  },
  frontloaded: {
    title: 'Frontloaded',
    description: 'Spends faster in the first days, then eases off — buys reach early.',
  },
  asap: {
    title: 'ASAP',
    description: 'Spends as fast as inventory allows. The flight may end before its last day.',
  },
};

/**
 * The little spend-over-time strip on each card. It is the whole point of
 * showing pacing as cards rather than as a dropdown: "frontloaded" is a shape,
 * and a shape is faster to read than a sentence.
 */
const PacingStrip: React.FC<{ shape: PacingShape; selected?: boolean }> = ({ shape, selected }) => {
  const dot = cn('rounded-full transition-colors', selected ? 'bg-foreground/70' : 'bg-muted-foreground/40');
  const line = cn('h-px flex-1', selected ? 'bg-foreground/25' : 'bg-border');

  if (shape === 'account') {
    return (
      <div className="flex h-3 items-center">
        <div className={cn('h-px w-full border-t border-dashed', selected ? 'border-foreground/30' : 'border-border')} />
      </div>
    );
  }
  if (shape === 'even') {
    return (
      <div className="flex h-3 items-center justify-between">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className={cn(dot, 'h-2 w-2')} />
        ))}
      </div>
    );
  }
  if (shape === 'frontloaded') {
    // Dots bunched at the start and shrinking, then the flat tail of the flight.
    return (
      <div className="flex h-3 items-center gap-1">
        {[8, 8, 7, 7, 6, 6, 5].map((size, i) => (
          <span key={i} className={dot} style={{ height: size, width: size }} />
        ))}
        <span className={line} />
      </div>
    );
  }
  return (
    <div className="flex h-3 items-center gap-1">
      {[10, 9, 7].map((size, i) => (
        <span key={i} className={dot} style={{ height: size, width: size }} />
      ))}
      <span className={line} />
    </div>
  );
};

/**
 * The pacing shape chooser. Selection styling is the app's one selected-surface
 * pair, so choosing a pacing reads as the same kind of choice as choosing a
 * goal or a campaign type.
 */
export const PacingShapeSelect: React.FC<{
  value: PacingShape;
  onChange: (v: PacingShape) => void;
  /** Which shapes this proposition offers. */
  shapes?: PacingShape[];
  disabled?: boolean;
  className?: string;
}> = ({ value, onChange, shapes = ['even', 'frontloaded'], disabled, className }) => (
  <div className={cn('grid gap-2 sm:grid-cols-2', className)}>
    {shapes.map((shape) => {
      const selected = value === shape;
      return (
        <button
          key={shape}
          type="button"
          disabled={disabled}
          onClick={() => onChange(shape)}
          className={cn(
            'flex w-full flex-col gap-2 rounded-md border p-3 text-left transition-colors',
            selected ? 'border-surface-selected-border bg-surface-selected' : 'border-border bg-background',
            disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:bg-surface-hover',
          )}
        >
          <span className="flex items-center gap-2">
            <span className="min-w-0 flex-1 truncate text-sm font-medium">{SHAPES[shape].title}</span>
            {/* The radio dot sits top-right, where a chosen card announces
                itself without the title having to move. */}
            <span
              className={cn(
                'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border',
                selected ? 'border-foreground bg-background' : 'border-border bg-background',
              )}
            >
              {selected && <span className="h-2 w-2 rounded-full bg-foreground" />}
            </span>
          </span>
          <PacingStrip shape={shape} selected={selected} />
          <span className="text-xs leading-relaxed text-muted-foreground">{SHAPES[shape].description}</span>
        </button>
      );
    })}
  </div>
);

/** Whole days a flight covers, both ends included. */
export function flightDays(start?: Date, end?: Date): number {
  if (!start || !end) return 0;
  const ms = new Date(end).setHours(0, 0, 0, 0) - new Date(start).setHours(0, 0, 0, 0);
  return ms < 0 ? 0 : Math.round(ms / 86_400_000) + 1;
}

/** The paced daily target: what is left, over the days left. */
export function pacedDailyTarget(totalBudget?: number, start?: Date, end?: Date): number | undefined {
  const days = flightDays(start, end);
  if (!totalBudget || days <= 0) return undefined;
  return Math.round((totalBudget / days) * 100) / 100;
}

const overlaps = (a: PacingOverride, b: PacingOverride) => {
  if (!a.from || !a.to || !b.from || !b.to) return false;
  return a.from <= b.to && b.from <= a.to;
};

export interface BudgetPacingProps {
  /** The booking's total budget and the flight it is spread over. */
  totalBudget?: number;
  startDate?: Date;
  endDate?: Date;
  /** Auto pacing on/off. On by default; unavailable without an end date. */
  auto: boolean;
  onAutoChange: (v: boolean) => void;
  shape: PacingShape;
  onShapeChange: (v: PacingShape) => void;
  shapes?: PacingShape[];
  /** The caller's total-budget field, rendered beside the daily budget. The
   *  two are one fact — what you are spending, and what that comes to a day —
   *  so they share a line rather than sitting in different sections. */
  budgetField?: React.ReactNode;
  /** The typed daily cap, used when auto pacing is off. */
  dailyBudget: string;
  onDailyBudgetChange: (v: string) => void;
  overrides: PacingOverride[];
  onOverridesChange: (v: PacingOverride[]) => void;
  className?: string;
}

export const BudgetPacing: React.FC<BudgetPacingProps> = ({
  totalBudget,
  startDate,
  endDate,
  auto,
  onAutoChange,
  shape,
  onShapeChange,
  shapes,
  budgetField,
  dailyBudget,
  onDailyBudgetChange,
  overrides,
  onOverridesChange,
  className,
}) => {
  const canAuto = !!endDate;
  const on = auto && canAuto;
  const days = flightDays(startDate, endDate);
  const target = pacedDailyTarget(totalBudget, startDate, endDate);
  // Frontloaded runs 1.2× the even target while it is ahead — the industry's
  // standard head start, and the number the advertiser actually sees early on.
  const shown = target != null && shape === 'frontloaded' ? Math.round(target * 1.2 * 100) / 100 : target;

  const addOverride = () => {
    onOverridesChange([...overrides, { id: `ovr-${Date.now()}`, multiplier: 1.5 }]);
  };
  const setOverride = (id: string, patch: Partial<PacingOverride>) => {
    onOverridesChange(overrides.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  };
  const removeOverride = (id: string) => onOverridesChange(overrides.filter((o) => o.id !== id));

  // Overlapping overrides are not allowed: two caps for one day is not a rule,
  // it is a question. Flagged on the row rather than refused on save, so the
  // one to fix is the one you are looking at.
  const clashing = new Set<string>();
  for (const a of overrides) {
    for (const b of overrides) {
      if (a.id !== b.id && overlaps(a, b)) clashing.add(a.id);
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Total and daily budget on one line: they are one fact read two ways —
          what you are spending, and what that comes to a day. */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {budgetField}
        <div className="space-y-1.5">
          <Label htmlFor="pacing-daily-budget">
            Daily budget {!on && <span className="text-foreground">*</span>}
          </Label>
          <Input
            id="pacing-daily-budget"
            type="number"
            min="0"
            placeholder="0.00"
            value={on ? (shown != null ? String(shown) : '') : dailyBudget}
            onChange={(e) => onDailyBudgetChange(e.target.value)}
            disabled={on}
          />
          {on ? (
            <FieldHint>
              {shown != null && days > 0
                ? `Paced${shape === 'frontloaded' ? ' — 1.2× the even target while ahead' : ''}: €${shown.toLocaleString()} a day over ${days} day${days === 1 ? '' : 's'}. Recalculated daily from what is left.`
                : 'Set a budget and a run time and the daily target is calculated here.'}
            </FieldHint>
          ) : (
            <FieldHint>
              {canAuto
                ? 'You set the cap. Delivery stops for the day once it is reached.'
                : 'Auto pacing needs an end date — with an open-ended run time the cap is yours to set.'}
            </FieldHint>
          )}
        </div>
      </div>

      {/* One card: the switch, and everything the switch turns on. The pacing
          shape and the date overrides only exist because auto pacing is on, so
          they live inside it rather than beside it. */}
      <div
        className={cn(
          'rounded-md border p-3',
          on ? 'border-surface-selected-border bg-surface-selected' : 'border-border bg-background',
        )}
      >
        <div className="flex items-center gap-3">
          <Switch
            checked={on}
            disabled={!canAuto}
            onCheckedChange={onAutoChange}
            aria-label="Auto pacing"
          />
          <span className="min-w-0">
            <span className="block text-sm font-medium">Auto pacing</span>
            <span className="block text-xs text-muted-foreground">
              Spreads the remaining budget over the days remaining, and corrects itself daily.
            </span>
          </span>
        </div>

        {on && (
          <div className="mt-3 space-y-4 border-t border-surface-selected-border pt-3">
            <div className="space-y-2">
              <Label className="block">Pacing</Label>
              <PacingShapeSelect value={shape} onChange={onShapeChange} shapes={shapes} />
            </div>

            <div className="space-y-2">
              {overrides.map((o) => (
                <div key={o.id} className="space-y-1.5">
                  <div className="flex items-end gap-2">
                    <div className="min-w-0 flex-1">
                      <DateRangePicker
                        dateRange={o.from ? { from: o.from, to: o.to } : undefined}
                        onDateRangeChange={(range) => setOverride(o.id, { from: range?.from, to: range?.to })}
                        placeholder="Dates to override"
                        showWeekNumbers
                        events={retailMoments}
                        className="w-full min-w-0"
                      />
                    </div>
                    <div className="w-24 shrink-0">
                      <MultiplierSelect
                        value={o.multiplier}
                        onChange={(v) => setOverride(o.id, { multiplier: v })}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconOnly
                      aria-label="Remove override"
                      className="shrink-0 text-muted-foreground"
                      onClick={() => removeOverride(o.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {clashing.has(o.id) && (
                    <p className="text-xs text-destructive">
                      These dates overlap another override. One day can only have one cap.
                    </p>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" className="gap-1.5" onClick={addOverride}>
                <Plus className="h-4 w-4" />
                Add date override
              </Button>
              <FieldHint>
                Raise or lower the paced target for a stretch of the flight — a retail moment, a weekend, a launch.
              </FieldHint>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
