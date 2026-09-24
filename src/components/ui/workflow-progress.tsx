'use client';

import * as React from 'react';
import { Check, ChevronDown, Clock, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TabActionGroup } from './tab-actions';
import { useDb, useSession, readWorkflow, workflowOrDefault, targetFor, type Booking, type WorkflowScope, type WorkflowStep, type WorkflowStepState, type WorkflowTarget } from '@/lib/db';
import { LIFECYCLE_LABEL } from '@/lib/status-vocabulary';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

/**
 * Where a campaign or booking stands in its proposition's workflow, and what
 * is next — as a plain to-do list for the current stage:
 *
 *   ○ open   an empty circle: still to be checked off
 *   ✓ done   a small tick: the data shows it done
 *
 * Each row says whose move it is; the one thing the signed-in side can do
 * next gets the only button. Nothing else on the right — no labels, no
 * badges: if a step is listed, it is needed. Past and later stages stay
 * behind their chips. The board is the retailer's; this is the entity
 * reading it.
 */

const OWNER_LABEL = { advertiser: 'Advertiser', retailer: 'Retailer', edge: 'Edge', external: 'Partner' } as const;

const daysBefore = (iso: string, days: number) => {
  const d = new Date(iso);
  d.setDate(d.getDate() - days);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
};

export interface WorkflowProgressProps {
  engine: WorkflowScope;
  bookingId?: string;
  campaignId?: string;
  mediaPlanId?: string;
  variant?: 'full' | 'bar';
  /** Bar only: leave out the "Next: …" line — the chips already open the steps. */
  hideNext?: boolean;
  /** Bar only: list the steps beneath the row, open — for a page that is
   *  about getting them done, so the to-dos sit in view. */
  expanded?: boolean;
  /** The action for an open step the signed-in side owns — a Start button
   *  that opens where the work is done. Only asked for open steps. */
  renderStepExtra?: (step: WorkflowStep, done: boolean) => React.ReactNode;
  /** Bar only: what sits at the right end of the stage row — the run
   *  controls — so it stays on that row when the list opens beneath. */
  trailing?: React.ReactNode;
  className?: string;
}

export const WorkflowProgress: React.FC<WorkflowProgressProps> = ({ engine, bookingId, campaignId, mediaPlanId, variant = 'full', hideNext, expanded, renderStepExtra, trailing, className }) => {
  const db = useDb();
  const user = useSession();
  const workflow = workflowOrDefault(db, engine);
  const stored = targetFor(db, { bookingId, campaignId, mediaPlanId });

  // A demo entity the store does not hold still reads the workflow: in
  // review, two weeks out, creatives as linked, no placement yet.
  const linked = bookingId ? db.creatives.filter((c) => c.bookingIds.includes(bookingId)) : [];
  const fallbackStart = new Date(); fallbackStart.setDate(fallbackStart.getDate() + 14);
  const fallback = (id: string): Booking => ({
    id, campaignId: '', name: id, status: 'in-option', budget: 0, spend: 0,
    startDate: fallbackStart.toISOString().slice(0, 10), endDate: fallbackStart.toISOString().slice(0, 10),
    positionIds: [], creativeStatus: linked.some((c) => c.status === 'approved') ? 'approved' : linked.length ? 'submitted' : 'missing',
    createdAt: '', updatedAt: '',
  });
  const target: WorkflowTarget | undefined = stored
    ?? (bookingId ? { level: 'booking', entity: fallback(bookingId) } : campaignId ? { level: 'campaign', entity: fallback(campaignId) } : undefined);
  if (!target) return null;

  // The same reading the to-do engine makes, so the bar's open steps and
  // the inbox's actions are one list.
  const reading = readWorkflow(db, workflow, target);
  const { stages, currentIndex, lifecycle, stepsOf } = reading;
  const entity = target.entity;
  const current = stepsOf(currentIndex);
  const open = current.filter((i) => i.status === 'open');
  const mySide = user?.side;

  /** Who acts on an open step, from the signed-in user's point of view. */
  const turnOf = (step: WorkflowStep): 'mine' | 'theirs' | 'auto' =>
    step.owner === 'edge' || step.owner === 'external' ? 'auto' : mySide && step.owner === mySide ? 'mine' : 'theirs';

  /** The one open step the signed-in side can act on next — it gets the button. */
  const nextMine = current.find((x) => x.status === 'open' && turnOf(x.step) === 'mine');

  /** One step, as a to-do: a circle to tick, what it is, whose move. */
  const renderRow = ({ step, status }: WorkflowStepState, withButton: boolean) => {
    const turn = turnOf(step);
    const extra = withButton && status === 'open' ? renderStepExtra?.(step, false) : null;
    const due = step.dueDaysBeforeStart ? ` · due ${daysBefore(entity.startDate, step.dueDaysBeforeStart)} (X-${step.dueDaysBeforeStart})` : '';
    const sla = step.slaDays ? ` · ${step.slaDays}-day SLA` : '';
    const second =
      status === 'done' ? `Done · ${OWNER_LABEL[step.owner]}`
      : status === 'upcoming' ? `${OWNER_LABEL[step.owner]}${due}`
      : turn === 'auto' ? `Edge checks this automatically${due}${sla}`
      : turn === 'mine' ? `${OWNER_LABEL[step.owner]} — your move${due}${sla}`
      : `${OWNER_LABEL[step.owner]}${due}${sla}`;
    return (
      <li key={step.id} className={cn('flex items-center gap-3 px-3 py-2 text-sm', status === 'done' && 'text-muted-foreground')}>
        <span className={cn(
          'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
          status === 'done' ? 'border-success-200 bg-success-50 text-success-700' : 'border-foreground/40 bg-background',
        )}>
          {status === 'done' && <Check className="h-3 w-3" />}
        </span>
        <span className="min-w-0 flex-1">
          <span className={cn('block truncate', status === 'done' && 'line-through', status === 'open' && 'font-medium text-foreground')}>{step.name}</span>
          <span className="block truncate text-xs text-muted-foreground">{second}</span>
        </span>
        {/* The right side answers "what now?": the button when it is your
            move, otherwise who is being waited for. */}
        {extra}
        {!extra && status === 'open' && turn === 'theirs' && (
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            Waiting for the {OWNER_LABEL[step.owner].toLowerCase()} to approve
          </span>
        )}
        {!extra && status === 'open' && turn === 'auto' && (
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground">
            <Zap className="h-3.5 w-3.5" />
            Automatic
          </span>
        )}
      </li>
    );
  };

  /** A stage's to-dos. Only the current stage offers a button. */
  const renderStage = (i: number) => {
    const stage = stages[i];
    const list = stepsOf(i);
    if (list.length > 0) {
      return <ul className="divide-y">{list.map((x) => renderRow(x, i === currentIndex && x.step.id === nextMine?.step.id))}</ul>;
    }
    // A stage with no steps: say so plainly, and what Edge does on reaching
    // it, so an empty list never reads as a missing one.
    const auto = stage.actions.filter((a) => a.type !== 'log').map((a) => a.label);
    return (
      <p className="px-3 py-3 text-sm text-muted-foreground">
        No to-dos in {stage.name} — it is reached on its own.
        {auto.length > 0 && <> Edge then: {auto.join('; ').toLowerCase()}.</>}
      </p>
    );
  };

  const headingFor = (i: number) =>
    i < currentIndex ? `${stages[i].name} — done` : i === currentIndex ? `To get past ${stages[i].name}` : `Coming up in ${stages[i].name}`;
  const countsFor = (i: number) => {
    const list = stepsOf(i);
    const o = list.filter((x) => x.status === 'open').length;
    const d = list.filter((x) => x.status === 'done').length;
    return i < currentIndex ? `${list.length} step${list.length === 1 ? '' : 's'} done` : i === currentIndex ? `${o} open · ${d} done` : `${list.length} step${list.length === 1 ? '' : 's'} to come`;
  };

  /** The list under the bar: the current stage's to-dos, and nothing else. */
  const fullList = (
    <div className="rounded-md border bg-background">
      <div className="flex items-center justify-between border-b px-3 py-2">
        <span className="text-sm font-medium">{headingFor(currentIndex)}</span>
        <span className="text-xs text-muted-foreground">{countsFor(currentIndex)}</span>
      </div>
      {renderStage(currentIndex)}
    </div>
  );

  const source = (
    <>
      Following {workflow.status === 'published' ? 'the published' : 'the draft'} workflow “{workflow.name}” — set on{' '}
      <a href={`/configuration/${engine}`} className="underline hover:text-foreground">the {engine.replace('-', ' ')} configuration page</a>.
      {' '}Status in shared words: <span className="font-medium text-foreground">{LIFECYCLE_LABEL[lifecycle]}</span>.
    </>
  );

  /** One stage chip; in the bar it is the trigger for that stage's steps. */
  const chip = (st: WorkflowStep, i: number, clickable: boolean) => {
    const state = i < currentIndex ? 'past' : i === currentIndex ? 'current' : 'next';
    const openHere = clickable && state === 'current' ? stepsOf(i).filter((x) => x.status === 'open').length : 0;
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
          state === 'current' && 'border-foreground bg-foreground text-background',
          state === 'past' && 'border-success-200 bg-success-50 text-success-700',
          state === 'next' && 'border-border bg-background text-muted-foreground',
          clickable && 'cursor-pointer hover:opacity-80',
        )}
        title={st.description}
      >
        {state === 'past' && <Check className="h-3 w-3" />}
        {st.name}
        {st.dueDaysBeforeStart ? <span className="opacity-70">X-{st.dueDaysBeforeStart}</span> : null}
        {openHere > 0 && <span className="rounded-full bg-background/20 px-1.5 text-[10px] tabular-nums">{openHere}</span>}
        {clickable && <ChevronDown className="h-3 w-3 opacity-60" />}
      </span>
    );
  };

  const stageBar = (
    <ol className="flex flex-wrap items-center gap-y-2">
      {stages.map((st, i) => (
        <li key={st.id} className="flex items-center">
          {chip(st, i, false)}
          {i < stages.length - 1 && <span className="mx-1 h-px w-4 bg-border" />}
        </li>
      ))}
    </ol>
  );

  /** The bar's stage row: each chip opens that stage's list. */
  const stageBarWithSteps = (
    <ol className="flex flex-wrap items-center gap-y-2">
      {stages.map((st, i) => (
        <li key={st.id} className="relative flex items-center">
          {/* The card beneath belongs to the current stage: a caret joins
              the two, so the list reads as that chip opened. */}
          {expanded && i === currentIndex && (
            <span aria-hidden className="absolute left-1/2 top-full z-10 mt-[7px] h-3 w-3 -translate-x-1/2 rotate-45 border-l border-t border-border bg-background" />
          )}
          <Popover>
            <PopoverTrigger asChild>
              <button type="button" className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {chip(st, i, true)}
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[32rem] p-0">
              <div className="flex items-center justify-between border-b px-3 py-2">
                <span className="text-sm font-medium">{headingFor(i)}</span>
                <span className="text-xs text-muted-foreground">{countsFor(i)}</span>
              </div>
              {renderStage(i)}
            </PopoverContent>
          </Popover>
          {i < stages.length - 1 && <span className="mx-1 h-px w-4 bg-border" />}
        </li>
      ))}
    </ol>
  );

  if (variant === 'bar') {
    const nextOpen = open[0];
    return (
      <div className={cn('flex flex-col gap-3', className)}>
        {/* The stage row: chips left, the next step or the controls right.
            One line, always: the controls give up their labels before the
            row gives up its shape — the chips wrap inside their own list. */}
        <div className="flex flex-nowrap items-center gap-x-6 gap-y-2">
          {stageBarWithSteps}
          {!hideNext && (
            <span className="ml-auto min-w-0 truncate text-sm">
              {nextOpen ? (
                <>
                  <span className="text-muted-foreground">Next: </span>
                  <span className="font-medium">{nextOpen.step.name}</span>
                  <span className="text-muted-foreground"> · {OWNER_LABEL[nextOpen.step.owner]}</span>
                </>
              ) : (
                <span className="text-muted-foreground">Nothing open in this stage</span>
              )}
            </span>
          )}
          {trailing && <TabActionGroup className="ml-auto">{trailing}</TabActionGroup>}
        </div>
        {/* Expanded: the whole list in view, not behind the chips. */}
        {expanded && fullList}
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {stageBar}
      {fullList}
      <p className="text-xs text-muted-foreground">{source}</p>
    </div>
  );
};
