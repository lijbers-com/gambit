'use client';

import * as React from 'react';
import { Check, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Input, FieldHint } from './input';
import { Label } from './label';
import { DateRangePicker } from './date-picker';
import type { DateRange } from 'react-day-picker';
import { ToggleCard } from './toggle-card';
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
 *  - Date overrides set a different daily cap for a stretch of the flight — a
 *    retail moment, a weekend, a launch. Multiple per booking, and they may
 *    not overlap.
 *
 * This is the same control for every proposition that bids: sponsored products
 * always, and display, digital in-store and offsite whenever the campaign is an
 * auction campaign. Guaranteed campaigns buy a fixed delivery, so there is no
 * pacing decision to make.
 */

export type PacingShape = 'account' | 'even' | 'frontloaded' | 'asap';

export interface PacingOverride {
  id: string;
  from: Date;
  to: Date;
  /** The daily cap for those days, replacing the paced target. */
  dailyBudget: string;
}

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
  <div className={cn('space-y-2', className)}>
    {shapes.map((shape) => {
      const selected = value === shape;
      return (
        <button
          key={shape}
          type="button"
          disabled={disabled}
          aria-pressed={selected}
          onClick={() => onChange(shape)}
          className={cn(
            // The same row a goal is chosen with: the visual on the left, the
            // name and what it does beside it, the tick on the right. One
            // selection language for every "which one of these" in the app.
            'flex w-full items-center gap-3 rounded-md border p-3 text-left transition-colors',
            // The chosen row lifts off whatever the card is filled with; the
            // rest take that fill and recede. Inside the cream pacing card
            // that means white is the choice, not the alternatives.
            selected ? 'border-surface-selected-border bg-background' : 'border-border bg-transparent',
            disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:bg-surface-hover',
          )}
        >
          <span className="w-20 shrink-0">
            <PacingStrip shape={shape} selected={selected} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium">{SHAPES[shape].title}</span>
            <span className="block text-xs text-muted-foreground">{SHAPES[shape].description}</span>
          </span>
          {selected && (
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              {/* Half the dot's width, so the tick sits in it rather than
                  filling it to the edges. */}
              <Check className="h-2.5 w-2.5" strokeWidth={2.5} />
            </span>
          )}
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

  // The range being picked, before it becomes a line.
  const [draft, setDraft] = React.useState<DateRange | undefined>(undefined);

  const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

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
          {/* Only the two hints that say something the field does not: what the
              paced number IS, and why the switch below cannot be used. Typing
              your own cap needs no explanation. */}
          {on && (
            <FieldHint>
              {shown != null && days > 0
                ? `Paced${shape === 'frontloaded' ? ' — 1.2× the even target while ahead' : ''}: €${shown.toLocaleString()} a day over ${days} day${days === 1 ? '' : 's'}. Recalculated daily from what is left.`
                : 'Set a budget and a run time and the daily target is calculated here.'}
            </FieldHint>
          )}
          {!canAuto && (
            <FieldHint>
              Auto pacing needs an end date — with an open-ended run time the cap is yours to set.
            </FieldHint>
          )}
        </div>
      </div>

      {/* One card: the switch, and everything the switch turns on. The pacing
          shape and the date overrides only exist because auto pacing is on, so
          they live inside it rather than beside it. */}
      <ToggleCard
        title="Auto pacing"
        description="Spreads the remaining budget over the days remaining, and corrects itself daily."
        checked={on}
        disabled={!canAuto}
        onCheckedChange={onAutoChange}
      >
        <div className="space-y-2">
          <Label className="block">Pacing</Label>
          <PacingShapeSelect value={shape} onChange={onShapeChange} shapes={shapes} />
        </div>

        <div className="space-y-2">
          <Label className="block">Date overrides</Label>
          {/* Pick the dates first — the range is what an override IS, so it
              is the question asked, and adding turns the selection into a
              line. An empty row waiting to be filled in is a form pretending
              to be a list. Add is explicit because a range picker cannot tell
              a single-day override from a range you have only half-picked. */}
          <div className="flex items-center gap-2">
            <div className="min-w-0 flex-1">
              <DateRangePicker
                dateRange={draft}
                onDateRangeChange={setDraft}
                placeholder="Select dates to override"
                showWeekNumbers
                events={retailMoments}
                className="w-full min-w-0 bg-transparent"
              />
            </div>
            <Button
              variant="outline"
              className="shrink-0 bg-transparent"
              disabled={!draft?.from}
              onClick={() => {
                if (!draft?.from) return;
                const from = draft.from;
                const to = draft.to ?? draft.from;
                onOverridesChange([
                  ...overrides,
                  { id: `ovr-${from.getTime()}-${to.getTime()}`, from, to, dailyBudget: '' },
                ]);
                setDraft(undefined);
              }}
            >
              Add
            </Button>
          </div>
          {overrides.map((o) => (
            <div key={o.id} className="space-y-1.5">
              <div className="flex items-center gap-2 rounded-md border border-border bg-transparent px-3 py-2">
                <span className="min-w-0 flex-1 truncate text-sm">
                  {fmt(o.from)} – {fmt(o.to)}
                </span>
                <div className="w-32 shrink-0">
                  <Input
                    type="number"
                    min="0"
                    value={o.dailyBudget}
                    onChange={(e) => setOverride(o.id, { dailyBudget: e.target.value })}
                    placeholder="Daily cap"
                    aria-label={`Daily cap for ${fmt(o.from)} to ${fmt(o.to)}`}
                    className="h-8"
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
          <FieldHint>
            Set a different daily cap for a stretch of the flight — a retail moment, a weekend, a launch. The rest of the budget still paces itself around it.
          </FieldHint>
        </div>
      </ToggleCard>
    </div>
  );
};
