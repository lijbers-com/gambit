'use client';

import * as React from 'react';
import { AlertTriangle, Check, ChevronDown, Circle, MessageSquare, Settings2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AreaChartComponent } from './area-chart';
import { BarChartComponent } from './bar-chart';
import { Button } from './button';
import { MetricCard } from './card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu';
import type { ChartConfig, ChartDataPoint } from './chart-types';

/**
 * THE case templates — one per message type, built strictly from the design
 * system's own parts (MetricCard, the house charts), so a case reads the same
 * wherever it appears: the message drawer, the Campaign Agent's pinned
 * context, and whatever surface comes next.
 *
 *   Insight        — the finding, made very clear: preferably ONE chart,
 *                    headline figures as MetricCards, short key points.
 *   Recommendation — two clear halves: the evidence, then THE CHANGE (the
 *                    proposed move, largest shifts first), with the ROAS
 *                    basis visible and switchable, and the answers — Ask the
 *                    agent, Decline, Accept — part of the template.
 *
 * Accepting a move never fires blind: the confirm dialog shows the full
 * movement, per booking, before anything happens.
 */

export interface CaseStat {
  label: string;
  value: string;
  sub?: string;
  tone?: string;
}

/** One row of a proposed budget move: "Aisle Screens €13,442 → €9,649 (−€3,792)". */
export interface CaseMove {
  label: string;
  from: string;
  to: string;
  delta: string;
}

/** The ROAS numbers' provenance — window and attribution method. */
export interface CaseBasis {
  window: 7 | 14 | 28;
  method: 'Hero' | 'Halo' | 'Direct';
}

/** The evidence behind a recommendation or insight. */
export interface CaseCardData {
  stats?: CaseStat[];
  chart?: {
    data: ChartDataPoint[];
    config: ChartConfig;
    kind?: 'area' | 'bar';
    xKey?: string;
    horizontal?: boolean;
    rightAxisKey?: string;
    title?: string;
  };
  /** The structured move a recommendation proposes. */
  move?: CaseMove[];
  /** Free-form key points. 'What stays fixed' / 'How sure we are' entries are
   *  lifted into the template's footnote lines automatically. */
  insights?: { title: string; text: string }[];
}

export interface CaseCardProps extends CaseCardData {
  /** Which template renders: insight leads with the chart, recommendation
   *  with the evidence-then-change buildup. Default 'insight'. */
  kind?: 'insight' | 'recommendation';
  /** A plain title — never a badge or label. */
  title?: string;
  description?: string;
  /** ROAS basis shown (and switchable) on recommendations. */
  basis?: CaseBasis;
  /** The template's own answers. Any handler present renders the action row. */
  onAskAgent?: () => void;
  onAccept?: () => void;
  acceptLabel?: string;
  onDecline?: () => void;
  /** A closing line inside the card (e.g. the agent's fence note). */
  footer?: React.ReactNode;
  className?: string;
}

/** How many move rows show in the card; the rest wait for the confirm dialog. */
const MOVE_ROWS_SHOWN = 3;

const FOOTNOTE_TITLES = ['What stays fixed', 'How sure we are'];
/** Removed on ADUSA feedback: the comparative evidence carries the why. */
const DROPPED_TITLES = ['Why this helps'];

const StatCards: React.FC<{ stats: CaseStat[] }> = ({ stats }) => (
  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
    {stats.map((s) => (
      <MetricCard
        key={s.label}
        label={s.label}
        value={s.value}
        subMetric={s.sub}
        badgeValue={s.tone === 'success' ? '↑' : s.tone === 'destructive' ? '↓' : undefined}
        badgeVariant={s.tone === 'success' ? 'success' : s.tone === 'destructive' ? 'destructive' : undefined}
      />
    ))}
  </div>
);

const CaseChart: React.FC<{ chart: NonNullable<CaseCardData['chart']>; tall?: boolean }> = ({ chart, tall }) => (
  <div className="rounded-lg border bg-background p-3">
    {chart.title && <div className="mb-1 text-sm font-medium text-muted-foreground">{chart.title}</div>}
    {chart.kind === 'bar' ? (
      <BarChartComponent
        data={chart.data}
        config={chart.config}
        className={cn('w-full', tall ? 'h-[220px]' : 'h-[190px]')}
        showLegend
        horizontal={chart.horizontal}
        xAxisDataKey={chart.xKey ?? 'month'}
      />
    ) : (
      <AreaChartComponent
        data={chart.data}
        config={chart.config}
        className={cn('w-full', tall ? 'h-[200px]' : 'h-[170px]')}
        showLegend
        showRightYAxis={!!chart.rightAxisKey}
        rightAxisDataKey={chart.rightAxisKey}
      />
    )}
  </div>
);

const MoveRows: React.FC<{ move: CaseMove[]; limit?: number }> = ({ move, limit }) => {
  const shown = limit ? move.slice(0, limit) : move;
  const hidden = move.length - shown.length;
  return (
    <div className="divide-y rounded-lg border bg-background">
      {shown.map((row) => (
        <div key={row.label} className="flex items-baseline gap-2 px-3 py-2 text-sm">
          <span className="min-w-0 flex-1 truncate font-medium">{row.label}</span>
          <span className="tabular-nums text-muted-foreground">{row.from}</span>
          <span className="text-muted-foreground">→</span>
          <span className="tabular-nums font-medium">{row.to}</span>
          <span
            className={cn(
              'w-20 text-right tabular-nums text-xs',
              row.delta.startsWith('-') || row.delta.startsWith('−') ? 'text-muted-foreground' : 'text-success-600',
            )}
          >
            {row.delta}
          </span>
        </div>
      ))}
      {hidden > 0 && (
        <div className="px-3 py-1.5 text-xs text-muted-foreground">and {hidden} more — the full move shows before you confirm.</div>
      )}
    </div>
  );
};

export const CaseCard: React.FC<CaseCardProps> = ({
  kind = 'insight',
  title,
  description,
  stats,
  chart,
  move,
  insights,
  basis,
  onAskAgent,
  onAccept,
  acceptLabel,
  onDecline,
  footer,
  className,
}) => {
  const [confirming, setConfirming] = React.useState(false);

  const footnotes = insights?.filter((i) => FOOTNOTE_TITLES.includes(i.title)) ?? [];
  const points = insights?.filter((i) => !FOOTNOTE_TITLES.includes(i.title) && !DROPPED_TITLES.includes(i.title) && !(move?.length && i.title === 'The move')) ?? [];
  const hasActions = !!(onAskAgent || onAccept || onDecline);
  const recommendation = kind === 'recommendation';

  const accept = () => {
    if (move?.length) setConfirming(true);
    else onAccept?.();
  };

  return (
    <div className={cn('space-y-4 rounded-lg border bg-muted/20 p-4', className)}>
      {(title || description) && (
        <div className="space-y-1">
          {title && <div className="text-sm font-semibold text-foreground">{title}</div>}
          {description && <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>}
        </div>
      )}

      {/* The insight leads with its chart; the recommendation with its figures. */}
      {recommendation ? (
        <>
          {stats && stats.length > 0 && <StatCards stats={stats} />}
          {chart && <CaseChart chart={chart} />}
        </>
      ) : (
        <>
          {chart && <CaseChart chart={chart} tall />}
          {stats && stats.length > 0 && <StatCards stats={stats} />}
        </>
      )}

      {recommendation && move && move.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-sm font-semibold">The change</div>
          <MoveRows move={move} limit={MOVE_ROWS_SHOWN} />
        </div>
      )}

      {points.length > 0 && (
        <ul className="space-y-2">
          {points.map((it) => (
            <li key={it.title} className="text-sm leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">{it.title}: </span>
              {it.text}
            </li>
          ))}
        </ul>
      )}

      {footnotes.length > 0 && (
        <div className="space-y-0.5 border-t pt-2">
          {footnotes.map((f) => (
            <p key={f.title} className="text-xs leading-relaxed text-muted-foreground">
              <span className="font-medium">{f.title}:</span> {f.text}
            </p>
          ))}
        </div>
      )}

      {footer}

      {hasActions && (
        <div className="flex items-center gap-2 pt-1">
          {onAskAgent && (
            <Button variant="outline" size="sm" className="gap-1.5" onClick={onAskAgent}>
              <MessageSquare className="h-4 w-4" />
              Ask the agent
            </Button>
          )}
          {onDecline && (
            <Button variant="outline" size="sm" className="gap-1.5" onClick={onDecline}>
              <X className="h-4 w-4" />
              Decline
            </Button>
          )}
          {onAccept && (
            <Button size="sm" className="gap-1.5" onClick={accept}>
              <Check className="h-4 w-4" />
              {acceptLabel ?? 'Accept'}
            </Button>
          )}
        </div>
      )}

      {/* Accepting shows the full movement first — nothing moves blind. */}
      {onAccept && move && move.length > 0 && (
        <Dialog open={confirming} onOpenChange={setConfirming}>
          <DialogContent className="sm:max-w-[440px]">
            <DialogHeader>
              <DialogTitle>Confirm the move</DialogTitle>
              <DialogDescription>
                Budget moves between these bookings. Your total budget stays the same.
              </DialogDescription>
            </DialogHeader>
            <MoveRows move={move} />
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirming(false)}>Cancel</Button>
              <Button
                onClick={() => {
                  setConfirming(false);
                  onAccept();
                }}
              >
                Confirm move
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

/** One step of a workflow stage, as the action's card lists it. */
export interface CaseStep {
  id: string;
  name: string;
  description?: string;
  owner: 'advertiser' | 'retailer' | 'edge' | 'external';
  done: boolean;
  mandatory: boolean;
  /** The step the notification is about. */
  current: boolean;
  due?: string;
  /** A second line of its own, shown instead of the owner when set. */
  sub?: string;
}

const OWNER_LABEL = { advertiser: 'Advertiser', retailer: 'Retailer', edge: 'Edge', external: 'Partner' } as const;

/**
 * The case template for an ACTION: not figures and a chart but the steps
 * of the stage the to-do belongs to — what is done, what is still to do,
 * and which step this notification is about — so the reader sees the work
 * around the one item, the way the workflow bar shows it on the page.
 */
export const StepsCard: React.FC<{
  steps: CaseStep[];
  title?: string;
  className?: string;
}> = ({ steps, title = 'What is still to do', className }) => {
  const done = steps.filter((s) => s.done).length;
  return (
    <div className={cn('space-y-3 rounded-lg border bg-muted/20 p-4', className)}>
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm font-semibold text-foreground">{title}</div>
        <span className="text-xs tabular-nums text-muted-foreground">{done} of {steps.length} done</span>
      </div>
      <ul className="divide-y rounded-md border bg-background">
        {steps.map((step) => (
          <li
            key={step.id}
            className={cn('flex items-center gap-3 px-3 py-2 text-sm', step.done && 'text-muted-foreground', step.current && !step.done && 'bg-surface-selected')}
          >
            <span className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-full border', step.done ? 'border-success-200 bg-success-50 text-success-700' : step.current ? 'border-foreground bg-foreground text-background' : 'bg-background text-muted-foreground')}>
              {step.done ? <Check className="h-3.5 w-3.5" /> : <Circle className="h-2 w-2 fill-current" />}
            </span>
            <span className="min-w-0 flex-1">
              <span className={cn('block truncate', step.done && 'line-through', step.current && !step.done && 'font-medium')}>{step.name}</span>
              <span className="block truncate text-xs text-muted-foreground">
                {step.sub ?? OWNER_LABEL[step.owner]}
                {step.due ? ` · due ${step.due}` : ''}
              </span>
            </span>
            {step.mandatory && !step.done && <span className="shrink-0 rounded-sm bg-neutral-100 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-neutral-600">Mandatory</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

/** One of the things health is judged on, and how it stands. */
export interface CaseCheck {
  label: string;
  ok: boolean;
  detail?: string;
  /** A failed check that only counts once the plan is live. */
  liveOnly?: boolean;
}

/**
 * The case template for a HEALTH message: the why. What health is judged
 * on, which checks hold and which do not, and the rule that turns them into
 * a colour — the same evidence the health chip opens on the page, so the
 * notification never says "at risk" without showing what it saw.
 */
export const ChecksCard: React.FC<{
  checks: CaseCheck[];
  title?: string;
  className?: string;
}> = ({ checks, title = 'What health is judged on', className }) => {
  const failing = checks.filter((c) => !c.ok).length;
  return (
    <div className={cn('space-y-3 rounded-lg border bg-muted/20 p-4', className)}>
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm font-semibold text-foreground">{title}</div>
        <span className="text-xs tabular-nums text-muted-foreground">{checks.length - failing} of {checks.length} hold</span>
      </div>
      <ul className="divide-y rounded-md border bg-background">
        {checks.map((c) => (
          <li key={c.label} className="flex items-center gap-3 px-3 py-2 text-sm">
            <span className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-full border', c.ok ? 'border-success-200 bg-success-50 text-success-700' : c.liveOnly ? 'border-border bg-background text-muted-foreground' : 'border-warning-200 bg-warning-50 text-warning-700')}>
              {c.ok ? <Check className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate">{c.label}</span>
              {c.detail && <span className="block truncate text-xs text-muted-foreground">{c.detail}</span>}
            </span>
            {!c.ok && c.liveOnly && <span className="shrink-0 text-[10px] uppercase tracking-wide text-muted-foreground">Once live</span>}
          </li>
        ))}
      </ul>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Healthy while nothing blocks; needs attention with open to-dos; at risk when a live plan has a blocker.
      </p>
    </div>
  );
};
