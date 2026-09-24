'use client';

import * as React from 'react';
import { Check, ChevronDown, Euro, HeartPulse } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { Button } from './button';
import { DateRangePicker } from './date-picker';
import { BudgetStackedMini } from './card';
import type { PatternKey } from '@/lib/proposition-patterns';
import { IndicatorList } from './case-card';
import { DEFAULT_HEALTH_CONFIG, CHECK_LABEL, type HealthCheckKey, type HealthIndicator } from '@/lib/db/health';
import { Input, FieldHint } from './input';
import { Label } from './label';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { retailMoments } from '@/lib/retail-moments';

/**
 * The cells a control bar is made of — the same budget, run time, health
 * and notifications a media plan, a campaign and a booking all carry, so
 * the three pages read alike and one fix reaches all of them.
 */

/** The budget as a button; the popover holds the ceiling and what already claims it. */
export const BudgetPopover: React.FC<{
  total: number;
  /** What is already claimed beneath the ceiling — the campaigns' budgets. */
  committed: number;
  /** The claims one by one, so the bar is the same split the plan card
   *  draws: each campaign's allocation in its proposition's tint and
   *  pattern. Without it the bar is one flat claim of `committed`. */
  allocations?: Array<{ name: string; budget: number; spent?: number; engine?: PatternKey }>;
  /** Whether spend is a fact here — only for a plan that is running or
   *  paused. Then the bar carries the spend line and the figures lead with
   *  what is spent. */
  showSpend?: boolean;
  hint?: string;
  onApply: (next: number) => void;
  className?: string;
}> = ({ total, committed, allocations, showSpend = false, hint, onApply, className }) => {
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState(String(total));
  React.useEffect(() => { if (open) setDraft(String(total)); }, [open, total]);
  const next = parseFloat(draft) || 0;
  const free = Math.max(next - committed, 0);
  const budgetData = (allocations ?? [{ name: 'Committed', budget: committed }]).map((a) => ({ ...a, spent: a.spent ?? 0 }));
  const spent = budgetData.reduce((sum, d) => sum + Math.min(d.spent, d.budget), 0);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn('h-9 justify-start gap-2 font-normal', className)}>
          <Euro className="h-4 w-4 text-muted-foreground" />
          <span className="truncate">€{total.toLocaleString()}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 space-y-4 p-4">
        <div className="space-y-2">
          <Label htmlFor="control-budget-total">Total budget</Label>
          <Input id="control-budget-total" type="number" min="0" value={draft} onChange={(e) => setDraft(e.target.value)} />
        </div>
        <div className="space-y-2">
          {/* The plan card's bar, with its figures beneath rather than on it:
              the popover is narrow and the number is being typed just above. */}
          <BudgetStackedMini budgetData={budgetData} total={Math.max(next, committed)} size="md" showSpend={showSpend} />
          <div className="text-[11px] tabular-nums text-muted-foreground">
            {showSpend && <>€{spent.toLocaleString()} spent · </>}€{committed.toLocaleString()} allocated · €{free.toLocaleString()} open
          </div>
          {next < committed && (
            <p className="text-xs text-warning-700">
              Below the €{committed.toLocaleString()} already claimed.
            </p>
          )}
        </div>
        {hint && <FieldHint>{hint}</FieldHint>}
        <div className="flex justify-end gap-inline border-t pt-3">
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
          <Button size="sm" onClick={() => { onApply(next); setOpen(false); }}>Apply</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

/** Run-time cell that edits in place, using the same picker as the forms. */
export const DatesCell = ({
  start,
  end,
  onSave,
  className = 'h-8 px-2 text-sm font-normal',
}: {
  start?: string;
  end?: string;
  onSave: (startDate: string, endDate: string) => void;
  className?: string;
}) => (
  <div onClick={(e) => e.stopPropagation()}>
    <DateRangePicker
      dateRange={start && end ? { from: new Date(start), to: new Date(end) } : undefined}
      onDateRangeChange={(range) => {
        if (range?.from && range?.to) {
          onSave(range.from.toISOString().slice(0, 10), range.to.toISOString().slice(0, 10));
        }
      }}
      showPresets={false}
      showWeekNumbers
      events={retailMoments}
      className={className}
      placeholder="Set run time"
    />
  </div>
);

export type HealthLevel = 'good' | 'attention' | 'risk';

/**
 * The health chip. Health reports concerns only: when something was found
 * the chip says how serious it is and opens the findings — each naming
 * where it was detected and what it measured. When nothing was found there
 * is no chip to paint green: a plain note says so, because "nothing found"
 * only means nothing found by the checks that exist today.
 */
export const HealthCell = ({ health, indicators, message }: { health?: HealthLevel; indicators?: HealthIndicator[]; message?: string }) => {
  // Nothing found: the chip says the health is good, and opens on what was
  // checked — so "good" is read as "good by the checks that exist today".
  if (!health || health === 'good' || !indicators?.length) {
    const checks = (Object.keys(DEFAULT_HEALTH_CONFIG.checks) as HealthCheckKey[]).filter((k) => DEFAULT_HEALTH_CONFIG.checks[k].enabled);
    return (
      <Popover>
        <PopoverTrigger asChild>
          <button type="button" className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <span className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-success-200 bg-success-50 px-2 py-0.5 text-xs font-medium text-success-700 hover:opacity-80">
              <HeartPulse className="h-3 w-3" />
              Health good
              <ChevronDown className="h-3 w-3 opacity-60" />
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[24rem] p-0">
          <div className="flex items-center justify-between border-b px-3 py-2">
            <span className="text-sm font-medium">What was checked</span>
            <span className="text-xs text-muted-foreground">nothing found</span>
          </div>
          <ul className="divide-y">
            {checks.map((k) => (
              <li key={k} className="flex items-center gap-3 px-3 py-2 text-sm">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-success-200 bg-success-50 text-success-700">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span className="min-w-0 flex-1 truncate">{CHECK_LABEL[k]}</span>
                <span className="shrink-0 text-xs text-muted-foreground">No concerns</span>
              </li>
            ))}
          </ul>
          <p className="border-t px-3 py-2 text-xs text-muted-foreground">
            {message ?? 'Nothing found by the checks that exist today.'} Checks are added over time.
          </p>
        </PopoverContent>
      </Popover>
    );
  }
  const cfg = {
    attention: { label: 'Health needs attention', className: 'border-warning-200 bg-warning-50 text-warning-700' },
    risk: { label: 'Health at risk', className: 'border-destructive-200 bg-destructive-50 text-destructive-700' },
  }[health];
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <span className={cn('inline-flex cursor-pointer items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium hover:opacity-80', cfg.className)}>
            <HeartPulse className="h-3 w-3" />
            {cfg.label}
            <ChevronDown className="h-3 w-3 opacity-60" />
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[28rem] p-0">
        <div className="flex items-center justify-between border-b px-3 py-2">
          <span className="text-sm font-medium">What was found</span>
          <span className="text-xs text-muted-foreground">{indicators.length} concern{indicators.length === 1 ? '' : 's'}</span>
        </div>
        <IndicatorList indicators={indicators} className="rounded-none border-0" />
      </PopoverContent>
    </Popover>
  );
};

/**
 * What an entity's inbox holds, in one cell: how many of what, silent when
 * there is nothing. Actions lead because they block delivery — a
 * recommendation can wait, a missing creative cannot.
 */
export const NotificationsCell = ({
  actions = 0,
  recommendations = 0,
  insights = 0,
  onOpen,
}: {
  actions?: number;
  recommendations?: number;
  insights?: number;
  /** Clicking any badge opens the notifications in the side panel. */
  onOpen?: () => void;
}) => {
  const parts = [
    { count: actions, label: 'action', plural: 'actions', variant: 'todo' as const },
    { count: recommendations, label: 'recommendation', plural: 'recommendations', variant: 'secondary' as const },
    { count: insights, label: 'insight', plural: 'insights', variant: 'secondary' as const },
  ].filter((p) => p.count > 0);

  if (parts.length === 0) return <span className="text-muted-foreground">—</span>;

  return (
    <span className="flex flex-wrap items-center gap-1">
      {parts.map((p) => (
        <button
          key={p.label}
          type="button"
          onClick={(e) => { e.stopPropagation(); onOpen?.(); }}
          title="Open notifications"
        >
          <Badge variant={p.variant} className="whitespace-nowrap tabular-nums transition-colors hover:opacity-80">
            {p.count} {p.count === 1 ? p.label : p.plural}
          </Badge>
        </button>
      ))}
    </span>
  );
};

/** The tick in an editable cell — kept here so the table and the bar share it. */
export const ConfirmTick = ({ onConfirm, label }: { onConfirm: () => void; label: string }) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    onMouseDown={(e) => { e.preventDefault(); onConfirm(); }}
    className="absolute right-1.5 flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
  >
    <Check className="h-3.5 w-3.5" />
  </button>
);
