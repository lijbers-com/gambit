'use client';

import * as React from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Input, FieldHint } from './input';
import { Label } from './label';
import { DateRangePicker } from './date-picker';
import type { DateRange } from 'react-day-picker';
import { retailMoments } from '@/lib/retail-moments';
import { SettingsCard } from './settings-card';

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
  /** What the stretch IS — "Black Friday", "Launch week". */
  name?: string;
}

const SHAPES: Record<PacingShape, { title: string; description: string }> = {
  account: {
    title: 'Account setting',
    description: 'Follows the default configured for your account.',
  },
  even: {
    title: 'Auto even pacing',
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

  // The hand-set cap renders in two places — the open chooser and the folded
  // card (a required field never hides behind the fold) — so it is one node.
  const dailyBudgetField = (
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
  );

  return (
    <div className={cn('space-y-4', className)}>
      {/* Full width: the daily budget moved inside the pacing card, so the
          two-column line the total once shared no longer exists. */}
      {budgetField}

      <div className="space-y-2">
        {/* The always-on rule: every shape on show, like the goals — no
            fold hiding the alternatives. The chosen default sits light
            (header + tick); its settings unfold the moment the user engages.
            Remove makes no sense where a spending rule must always exist. */}
        <SettingsCard
          label="Budget pacing"
          options={(canPace ? allShapes : (['custom'] as PacingShape[])).map((sh) => ({
            value: sh,
            label: SHAPES[sh].title,
            description: SHAPES[sh].description,
          }))}
          value={shape}
          onChange={(v) => onShapeChange(v as PacingShape)}
          // The hand-set cap is a required field — it may never hide, so it
          // is pinned to the chosen card whether settings are unfolded or not.
          pinnedExtra={(opt) => (opt.value === 'custom' ? dailyBudgetField : undefined)}
          renderOpenExtra={(opt) => {
            const sh = opt.value as PacingShape;
            if (sh === 'custom') return undefined; // the cap is pinned; custom has no further settings
            return (
              <div className="space-y-2">
                {(sh === 'even' || sh === 'frontloaded') && (
                  <p className="text-xs text-muted-foreground">
                    {shown != null && days > 0
                      ? sh === 'even'
                        ? `≈ ${euro(shown)} a day over ${days} day${days === 1 ? '' : 's'} — recalculated daily from what is left.`
                        : `≈ ${euro(shown)} a day while ahead (1.2× the even target), easing off later.`
                      : 'Set a budget and a run time and the daily target is calculated here.'}
                  </p>
                )}
                {/* Overrides belong to the paced rule they modify — a
                    property of the chosen pacing, inside its card. Only the
                    header carries a rule; a second line inside the body
                    made the card read as stacked blocks. */}
                <div className="space-y-2 pt-1">
                    <Label className="block">Date overrides</Label>
                    {overrides.map((o) => (
                      <div key={o.id} className="space-y-1.5">
                        <OverrideRow
                          override={o}
                          estimate={estimate}
                          disabledDays={disabledDays}
                          onSave={(patch) => setOverride(o.id, patch)}
                          onRemove={() => removeOverride(o.id)}
                        />
                        {clashing.has(o.id) && (
                          <p className="text-xs text-destructive">
                            These dates overlap another override. One day can only have one target.
                          </p>
                        )}
                      </div>
                    ))}
                    {/* The next override is already a ROW: the dates and the
                        percentage sit where they will live, and Add commits
                        the line — no separate picker to discover first. */}
                    <OverrideDraftRow
                      disabledDays={disabledDays}
                      estimate={estimate}
                      onAdd={(draft) => {
                        onOverridesChange([
                          ...overrides,
                          { id: `ovr-${draft.from.getTime()}-${draft.to.getTime()}`, ...draft },
                        ]);
                      }}
                    />
                    <FieldHint>
                      Raise or lower the paced target for a stretch of the flight — a retail moment, a weekend, a launch. The amount is an estimate; the target is recalculated daily.
                    </FieldHint>
                  </div>
              </div>
            );
          }}
        />
      </div>

    </div>
  );
};

/**
 * One override line — the SAME line whether it exists or not:
 *
 *   [name] [dates] [%] [≈ estimate] [actions]
 *
 * Committed rows edit into a local draft — play with the %, watch the
 * estimate move, then SAVE commits it; the bin removes. The draft row is
 * the identical line with a dashed border and Add. Every column is a fixed
 * width except the dates, so the rows always align.
 */
const OVERRIDE_ACTIONS_WIDTH = 'w-[72px]'; // two 32px icon buttons + the 8px gap

const OverrideRowShell: React.FC<{ dashed?: boolean; children: React.ReactNode }> = ({ dashed, children }) => (
  <div className={cn('flex items-center gap-2 rounded-md border px-3 py-2', dashed ? 'border-dashed border-border' : 'border-border bg-background')}>
    {children}
  </div>
);

const OverrideRow: React.FC<{
  override: PacingOverride;
  estimate: (percent: string) => string | null;
  disabledDays: import('react-day-picker').Matcher[];
  onSave: (patch: Partial<PacingOverride>) => void;
  onRemove: () => void;
}> = ({ override, estimate, disabledDays, onSave, onRemove }) => {
  const [name, setName] = React.useState(override.name ?? '');
  const [range, setRange] = React.useState<DateRange | undefined>({ from: override.from, to: override.to });
  const [percent, setPercent] = React.useState(override.percent);
  const dirty =
    name !== (override.name ?? '')
    || percent !== override.percent
    || range?.from?.getTime() !== override.from.getTime()
    || range?.to?.getTime() !== override.to.getTime();
  return (
    <OverrideRowShell>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        aria-label="Override name"
        className="h-8 w-36 shrink-0"
      />
      <div className="min-w-0 flex-1">
        <DateRangePicker
          dateRange={range}
          onDateRangeChange={setRange}
          className="h-8 w-full min-w-0 bg-transparent"
          showWeekNumbers
          events={retailMoments}
          disabledDays={disabledDays}
        />
      </div>
      {/* The estimate follows the TYPED percentage immediately — the maths
          never waits for Save; only the stored rule does. */}
      <div className="relative w-24 shrink-0">
        <Input
          type="number"
          min="0"
          value={percent}
          onChange={(e) => setPercent(e.target.value)}
          aria-label="Percentage of the daily target"
          className="h-8 pr-7 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
      </div>
      <span className="w-24 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
        {estimate(percent) ?? '—'}
      </span>
      <span className={cn('flex shrink-0 items-center justify-end gap-2', OVERRIDE_ACTIONS_WIDTH)}>
        {/* Dark the moment there is something to save; quiet otherwise. */}
        <Button
          variant={dirty ? 'default' : 'outline'}
          size="sm"
          iconOnly
          aria-label="Save override"
          className={cn('h-8 w-8 shrink-0 p-0', !dirty && 'bg-transparent')}
          disabled={!dirty || !range?.from || !range?.to}
          onClick={() => {
            if (!range?.from || !range?.to) return;
            onSave({ name: name || undefined, from: range.from, to: range.to, percent });
          }}
        >
          <Save className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          iconOnly
          aria-label="Remove override"
          className="h-8 w-8 shrink-0 bg-transparent p-0 text-muted-foreground hover:text-foreground"
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </span>
    </OverrideRowShell>
  );
};

/** The identical line, dashed because it is not a rule yet — Add makes it
 *  one and the line resets for the next. */
const OverrideDraftRow: React.FC<{
  disabledDays: import('react-day-picker').Matcher[];
  estimate: (percent: string) => string | null;
  onAdd: (draft: { name?: string; from: Date; to: Date; percent: string }) => void;
}> = ({ disabledDays, estimate, onAdd }) => {
  const [name, setName] = React.useState('');
  const [draft, setDraft] = React.useState<DateRange | undefined>(undefined);
  const [percent, setPercent] = React.useState('150');
  const complete = !!draft?.from && !!draft?.to;
  return (
    <OverrideRowShell dashed>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        aria-label="New override name"
        className="h-8 w-36 shrink-0"
      />
      <div className="min-w-0 flex-1">
        <DateRangePicker
          dateRange={draft}
          onDateRangeChange={setDraft}
          className="h-8 w-full min-w-0 bg-transparent"
          placeholder="Select dates"
          showWeekNumbers
          events={retailMoments}
          disabledDays={disabledDays}
        />
      </div>
      <div className="relative w-24 shrink-0">
        <Input
          type="number"
          min="0"
          value={percent}
          onChange={(e) => setPercent(e.target.value)}
          aria-label="Percentage of the daily target for the new override"
          className="h-8 pr-7 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
      </div>
      <span className="w-24 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
        {estimate(percent) ?? '—'}
      </span>
      <span className={cn('flex shrink-0 items-center justify-end gap-2', OVERRIDE_ACTIONS_WIDTH)}>
        <Button
          size="sm"
          iconOnly
          aria-label="Add override"
          className="h-8 w-8 shrink-0 p-0"
          disabled={!complete}
          onClick={() => {
            if (!draft?.from || !draft?.to) return;
            onAdd({ name: name || undefined, from: draft.from, to: draft.to, percent });
            setName('');
            setDraft(undefined);
            setPercent('150');
          }}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </span>
    </OverrideRowShell>
  );
};
