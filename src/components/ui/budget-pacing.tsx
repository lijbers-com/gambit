'use client';

import * as React from 'react';
import { Check, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Input, FieldHint } from './input';
import { Label } from './label';
import { DateRangePicker } from './date-picker';
import type { DateRange } from 'react-day-picker';
import { retailMoments } from '@/lib/retail-moments';
import { SearchSelectList } from './search-select-list';

/**
 * Pacing — how a budget is spread over the days a booking runs.
 *
 * Pacing is ALWAYS on: every booking spends its budget by some rule, so there
 * is nothing to toggle — only which rule. The choice is a selection, in the
 * goal-select language, and **Even is the default**: remaining budget over the
 * days remaining, re-derived daily, so under- and overspend correct themselves
 * instead of being noticed at the end of the flight.
 *
 * A hand-set daily cap is not the opposite of pacing — it is one more way of
 * pacing. So **Daily budget (custom) is an option in the same selection**,
 * with its input inside the open row, rather than a separate field fighting a
 * toggle for authority.
 *
 * Date overrides are a **percentage** of the paced daily target for a stretch
 * of the flight — the euro amount shown beside it is an estimate, because the
 * target itself is re-derived daily. The range is picked and confirmed INSIDE
 * the calendar (its Add button), and the calendar fences what can be chosen:
 * days outside the booking's run time are disabled, and once the flight has
 * started, so are days in the past.
 */

export type PacingShape = 'account' | 'even' | 'frontloaded' | 'asap' | 'custom';

export interface PacingOverride {
  id: string;
  from: Date;
  to: Date;
  /** Percentage of the paced daily target for those days (100 = unchanged). */
  percent: string;
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
  custom: {
    title: 'Daily budget',
    description: 'You set the cap. Delivery stops for the day once it is reached.',
  },
};

/**
 * The little spend-over-time strip on each row. It is the whole point of
 * showing pacing as a selection rather than a dropdown: "frontloaded" is a
 * shape, and a shape is faster to read than a sentence.
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
  if (shape === 'custom') {
    // A hand-set cap: the same level every day, drawn as a flat bar rather
    // than the even rhythm — a rule you wrote, not one that adapts.
    return (
      <div className="flex h-3 items-center">
        <div className={cn('h-1 w-full rounded-full', selected ? 'bg-foreground/40' : 'bg-muted-foreground/25')} />
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
 * The pacing selection. Selection styling is the app's one selected-surface
 * pair, so choosing a pacing reads as the same kind of choice as choosing a
 * goal or a campaign type — and like a goal, the chosen row can open to carry
 * its own settings (`openContent`) or its consequence (`detail`).
 */
export const PacingShapeSelect: React.FC<{
  value: PacingShape;
  onChange: (v: PacingShape) => void;
  /** Which shapes this proposition offers. */
  shapes?: PacingShape[];
  /** Shapes that cannot be chosen right now (e.g. paced shapes without an end date). */
  disabledShapes?: PacingShape[];
  /** One line rendered inside a shape's row while it is selected — the derived
   *  daily estimate for the paced shapes. */
  detail?: Partial<Record<PacingShape, React.ReactNode>>;
  /** Settings rendered inside a shape's open row — the custom daily budget. */
  openContent?: Partial<Record<PacingShape, React.ReactNode>>;
  /** Keep every option on screen (documentation stages). Forms stay folded. */
  alwaysOpen?: boolean;
  disabled?: boolean;
  className?: string;
}> = ({ value, onChange, shapes = ['even', 'frontloaded'], disabledShapes = [], detail, openContent, alwaysOpen, disabled, className }) => {
  /**
   * FOLDED BY DEFAULT: a form states the pacing it has; it does not exhibit
   * the catalogue. Five open cards made this the loudest block on the page
   * for a question most users never change — so only the chosen shape shows,
   * and Change unfolds the alternatives just long enough to pick one.
   */
  const [choosing, setChoosing] = React.useState(false);
  const open = alwaysOpen || choosing;

  const row = (shape: PacingShape) => {
    const selected = value === shape;
    const shapeDisabled = disabled || disabledShapes.includes(shape);
    return (
      <div
        key={shape}
        className={cn(
          'rounded-md border transition-colors',
          selected ? 'border-surface-selected-border bg-surface-selected' : 'border-border bg-background',
        )}
      >
        <div className="flex items-start gap-3 p-3">
          <button
            type="button"
            disabled={shapeDisabled}
            aria-pressed={selected}
            onClick={() => {
              onChange(shape);
              setChoosing(false);
            }}
            className={cn(
              'min-w-0 flex-1 text-left',
              shapeDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
            )}
          >
            <span className="block truncate text-sm font-medium">{SHAPES[shape].title}</span>
            {/* The sketch sits under the name it belongs to and above the
                sentence that explains it — read the shape, then read why. */}
            <span className="block w-28 py-3">
              <PacingStrip shape={shape} selected={selected} />
            </span>
            <span className="block text-xs text-muted-foreground">{SHAPES[shape].description}</span>
            {selected && detail?.[shape] && (
              <span className="mt-1 block text-xs text-muted-foreground">{detail[shape]}</span>
            )}
          </button>
          {selected && !open && !disabled && (
            // Folded, the tick would restate the obvious — the one visible
            // card IS the choice. Its place goes to the way out.
            <Button variant="ghost" size="sm" className="shrink-0 text-muted-foreground" onClick={() => setChoosing(true)}>
              Change
            </Button>
          )}
          {selected && open && (
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              {/* Half the dot's width, so the tick sits in it rather than
                  filling it to the edges. */}
              <Check className="h-2.5 w-2.5" strokeWidth={2.5} />
            </span>
          )}
        </div>
        {selected && openContent?.[shape] && (
          <div className="border-t border-surface-selected-border p-3">{openContent[shape]}</div>
        )}
      </div>
    );
  };

  return (
    <div className={cn('space-y-2', className)}>
      {(open ? shapes : shapes.filter((shape) => shape === value)).map(row)}
    </div>
  );
};

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
  shape: PacingShape;
  onShapeChange: (v: PacingShape) => void;
  /** Which shapes this surface offers; 'custom' is appended automatically. */
  shapes?: PacingShape[];
  /** The caller's total-budget field, rendered above the pacing selection. */
  budgetField?: React.ReactNode;
  /** The hand-set daily cap, used by the custom shape. */
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
  shape,
  onShapeChange,
  shapes = ['even', 'frontloaded'],
  budgetField,
  dailyBudget,
  onDailyBudgetChange,
  overrides,
  onOverridesChange,
  className,
}) => {
  const days = flightDays(startDate, endDate);
  const target = pacedDailyTarget(totalBudget, startDate, endDate);
  // Frontloaded runs 1.2× the even target while it is ahead — the industry's
  // standard head start, and the number the advertiser actually sees early on.
  const shown = target != null && shape === 'frontloaded' ? Math.round(target * 1.2 * 100) / 100 : target;

  // "Spread the rest over the days remaining" has no meaning without a last
  // day — with an open-ended run time the paced shapes are disabled and the
  // hand-set cap is the one honest option.
  const canPace = !!endDate;
  const allShapes: PacingShape[] = [...shapes.filter((s) => s !== 'custom'), 'custom'];
  React.useEffect(() => {
    if (!canPace && shape !== 'custom') onShapeChange('custom');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canPace]);

  const setOverride = (id: string, patch: Partial<PacingOverride>) => {
    onOverridesChange(overrides.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  };
  const removeOverride = (id: string) => onOverridesChange(overrides.filter((o) => o.id !== id));

  // Overlapping overrides are not allowed: two caps for one day is not a rule,
  // it is a question. Flagged on the line rather than refused on save, so the
  // one to fix is the one you are looking at.
  const clashing = new Set<string>();
  for (const a of overrides) {
    for (const b of overrides) {
      if (a.id !== b.id && overlaps(a, b)) clashing.add(a.id);
    }
  }

  const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const euro = (n: number) => `€${n.toLocaleString('en-GB', { maximumFractionDigits: 2 })}`;

  // The calendar fences what an override can cover: only days inside the
  // flight, and — once the flight has started — never the past.
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const started = !!startDate && startDate < today;
  const fenceFrom = started ? today : startDate;
  const disabledDays: import('react-day-picker').Matcher[] = [
    ...(fenceFrom ? [{ before: fenceFrom }] : []),
    ...(endDate ? [{ after: endDate }] : []),
  ];

  const estimate = (percent: string): string | null => {
    const p = Number(percent);
    if (!target || !Number.isFinite(p) || p <= 0) return null;
    return `≈ ${euro(Math.round(target * (p / 100) * 100) / 100)} a day`;
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Full width: the daily budget moved inside the pacing card, so the
          two-column line the total once shared no longer exists. */}
      {budgetField}

      <div className="space-y-2">
        <Label className="block">Pacing</Label>
        {/* The same selection component targeting and channels use: search
            field, chosen rule as a selected card beneath, its settings inside.
            One "choose from a catalogue" language for the whole form — pacing
            is not a special kind of choosing. Removing the card falls back to
            the default rather than leaving a booking with no spending rule. */}
        <SearchSelectList
          label={null}
          multiple={false}
          placeholder="Search pacing…"
          options={(canPace ? allShapes : (['custom'] as PacingShape[])).map((sh) => ({
            value: sh,
            label: SHAPES[sh].title,
            description: SHAPES[sh].description,
          }))}
          value={[shape]}
          onChange={(vals) => {
            const next = vals[vals.length - 1] as PacingShape | undefined;
            onShapeChange(next ?? (canPace ? 'even' : 'custom'));
          }}
          renderSelectedExtra={(opt) => {
            const sh = opt.value as PacingShape;
            return (
              <div className="space-y-2">
                <span className="block w-28 pt-1">
                  <PacingStrip shape={sh} selected />
                </span>
                {(sh === 'even' || sh === 'frontloaded') && (
                  <p className="text-xs text-muted-foreground">
                    {shown != null && days > 0
                      ? sh === 'even'
                        ? `≈ ${euro(shown)} a day over ${days} day${days === 1 ? '' : 's'} — recalculated daily from what is left.`
                        : `≈ ${euro(shown)} a day while ahead (1.2× the even target), easing off later.`
                      : 'Set a budget and a run time and the daily target is calculated here.'}
                  </p>
                )}
                {sh !== 'custom' && (
                  /* Overrides belong to the paced rule they modify — a
                     property of the chosen pacing, so they live inside its
                     card, the way the custom cap's input lives inside its. */
                  <div className="space-y-2 border-t border-surface-selected-border pt-3">
                    <Label className="block">Date overrides</Label>
                    <OverridePicker
                      disabledDays={disabledDays}
                      onAdd={(range) => {
                        onOverridesChange([
                          ...overrides,
                          { id: `ovr-${range.from!.getTime()}-${range.to!.getTime()}`, from: range.from!, to: range.to!, percent: '150' },
                        ]);
                      }}
                    />
                    {overrides.map((o) => (
                      <div key={o.id} className="space-y-1.5">
                        <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2">
                          <span className="min-w-0 flex-1 truncate text-sm">
                            {fmt(o.from)} – {fmt(o.to)}
                          </span>
                          {/* A percentage of the paced target, because the
                              target moves — the euro figure is an estimate. */}
                          <div className="relative w-24 shrink-0">
                            <Input
                              type="number"
                              min="0"
                              value={o.percent}
                              onChange={(e) => setOverride(o.id, { percent: e.target.value })}
                              aria-label={`Percentage of the daily target for ${fmt(o.from)} to ${fmt(o.to)}`}
                              className="h-8 pr-7"
                            />
                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
                          </div>
                          <span className="w-24 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                            {estimate(o.percent) ?? '—'}
                          </span>
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
                            These dates overlap another override. One day can only have one target.
                          </p>
                        )}
                      </div>
                    ))}
                    <FieldHint>
                      Raise or lower the paced target for a stretch of the flight — a retail moment, a weekend, a launch. The amount is an estimate; the target is recalculated daily.
                    </FieldHint>
                  </div>
                )}
                {sh === 'custom' && (
                  <div className="max-w-xs space-y-1.5">
                    <Label htmlFor="pacing-daily-budget">Daily budget <span className="text-foreground">*</span></Label>
                    <Input
                      id="pacing-daily-budget"
                      type="number"
                      min="0"
                      placeholder="0.00"
                      value={dailyBudget}
                      onChange={(e) => onDailyBudgetChange(e.target.value)}
                    />
                    {!canPace && (
                      <FieldHint>Paced options need an end date — with an open-ended run time the cap is yours to set.</FieldHint>
                    )}
                  </div>
                )}
              </div>
            );
          }}
        />
      </div>

    </div>
  );
};

/** The override calendar: selection lives here until Add confirms it. */
const OverridePicker: React.FC<{
  disabledDays: import('react-day-picker').Matcher[];
  onAdd: (range: { from?: Date; to?: Date }) => void;
}> = ({ disabledDays, onAdd }) => {
  const [draft, setDraft] = React.useState<DateRange | undefined>(undefined);
  return (
    <DateRangePicker
      dateRange={draft}
      onDateRangeChange={setDraft}
      placeholder="Select dates to override"
      showWeekNumbers
      events={retailMoments}
      disabledDays={disabledDays}
      confirmLabel="Add override"
      onConfirm={(range) => {
        onAdd(range);
        setDraft(undefined);
      }}
      className="w-full min-w-0"
    />
  );
};
