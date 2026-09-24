'use client';

import * as React from 'react';
import { Bell, Check, CheckCircle2, ChevronDown, Flag, GitBranch, ShieldCheck, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TabActionGroup } from './tab-actions';
import { useDb, readWorkflow, workflowOrDefault, targetFor, type Booking, type WorkflowScope, type WorkflowStep, type WorkflowStepKind, type WorkflowTarget } from '@/lib/db';
import { LIFECYCLE_LABEL } from '@/lib/status-vocabulary';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

/**
 * Where a campaign or booking stands in its proposition's workflow, and what
 * is next: the stage bar walked along the board's stages, the current stage
 * lit, and the steps between here and the next stage as to-dos — owner,
 * deadline (flight start minus X-n), mandatory or not — with what the data
 * already shows as done ticked off. The board is the retailer's; this is the
 * entity reading it.
 *
 * Two shapes: `full` lists the to-dos under the stage bar; `bar` keeps to
 * one line for the control panel — the stages, the next open step, and the
 * list behind a button.
 */

const KIND_ICON: Record<WorkflowStepKind, React.ComponentType<{ className?: string }>> = {
  stage: Flag, approval: ShieldCheck, check: CheckCircle2, fulfilment: Truck, notification: Bell, gate: GitBranch,
};
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
  /** Bar only: list the current stage's steps beneath the row, open — for a
   *  page that is about getting them done, so the to-dos sit in view. */
  expanded?: boolean;
  /** Something to show at the end of a step row — a count, a button. */
  renderStepExtra?: (step: WorkflowStep, done: boolean) => React.ReactNode;
  /** Bar only: what sits at the right end of the stage row — the run
   *  controls — so it stays on that row when the list opens beneath. */
  trailing?: React.ReactNode;
  className?: string;
}

export const WorkflowProgress: React.FC<WorkflowProgressProps> = ({ engine, bookingId, campaignId, mediaPlanId, variant = 'full', hideNext, expanded, renderStepExtra, trailing, className }) => {
  const db = useDb();
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
  const { stages, currentIndex, lifecycle, stepsOf, heading } = reading;
  const entity = target.entity;
  const items = reading.current;
  const open = items.filter((i) => !i.done);

  const renderList = (list: { step: WorkflowStep; done: boolean }[]) => (
    <ul className="divide-y">
      {list.map(({ step, done }) => {
        const Icon = KIND_ICON[step.kind];
        return (
          <li key={step.id} className={cn('flex items-center gap-3 px-3 py-2 text-sm', done && 'text-muted-foreground')}>
            <span className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-full border', done ? 'border-success-200 bg-success-50 text-success-700' : 'bg-background')}>
              {done ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
            </span>
            <span className="min-w-0 flex-1">
              <span className={cn('block truncate', done && 'line-through')}>{step.name}</span>
              <span className="block truncate text-xs text-muted-foreground">
                {OWNER_LABEL[step.owner]}
                {step.dueDaysBeforeStart ? ` · due ${daysBefore(entity.startDate, step.dueDaysBeforeStart)} (X-${step.dueDaysBeforeStart})` : ''}
                {step.slaDays ? ` · ${step.slaDays}-day SLA` : ''}
              </span>
            </span>
            {step.mandatory && !done && <span className="shrink-0 rounded-sm bg-neutral-100 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-neutral-600">Mandatory</span>}
            {renderStepExtra?.(step, done)}
          </li>
        );
      })}
    </ul>
  );
  const todoList = renderList(items);

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
    const openHere = clickable && state === 'current' ? stepsOf(i).filter((x) => !x.done).length : 0;
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

  /** The bar's stage row: each chip opens what that stage asks for. */
  const stageBarWithSteps = (
    <ol className="flex flex-wrap items-center gap-y-2">
      {stages.map((st, i) => {
        const list = stepsOf(i);
        const openCount = list.filter((x) => !x.done).length;
        return (
          <li key={st.id} className="flex items-center">
            <Popover>
              <PopoverTrigger asChild>
                <button type="button" className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {chip(st, i, true)}
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-[32rem] p-0">
                <div className="flex items-center justify-between border-b px-3 py-2">
                  <span className="text-sm font-medium">{i === currentIndex ? `To get past ${st.name}` : i < currentIndex ? `${st.name} — done` : `Before ${st.name} is left`}</span>
                  {list.length > 0 && <span className="text-xs text-muted-foreground">{openCount} open · {list.length - openCount} done</span>}
                </div>
                {list.length > 0 ? renderList(list) : (
                  <p className="px-3 py-3 text-sm text-muted-foreground">{st.description ?? 'Nothing to do in this stage — it is left on its own.'}</p>
                )}
              </PopoverContent>
            </Popover>
            {i < stages.length - 1 && <span className="mx-1 h-px w-4 bg-border" />}
          </li>
        );
      })}
    </ol>
  );



  if (variant === 'bar') {
    const nextOpen = open[0];
    return (
      <div className={cn('flex flex-col gap-3', className)}>
        {/* The stage row: chips left, the next step or the controls right. */}
        {/* One line, always: the controls give up their labels before the
            row gives up its shape — the chips wrap inside their own list. */}
        <div className="flex flex-nowrap items-center gap-x-6 gap-y-2">
          {stageBarWithSteps}
          {items.length > 0 && !hideNext && (
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
        {/* Expanded: the stage's steps in view, not behind the chip. */}
        {expanded && items.length > 0 && (
          <div className="rounded-md border bg-background">
            <div className="flex items-center justify-between border-b px-3 py-2">
              <span className="text-sm font-medium">{heading}</span>
              <span className="text-xs text-muted-foreground">{open.length} open · {items.length - open.length} done</span>
            </div>
            {todoList}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {stageBar}
      {items.length > 0 && (
        <div className="rounded-md border">
          <div className="flex items-center justify-between border-b px-3 py-2">
            <span className="text-sm font-medium">{heading}</span>
            <span className="text-xs text-muted-foreground">{open.length} open · {items.length - open.length} done</span>
          </div>
          {todoList}
        </div>
      )}
      <p className="text-xs text-muted-foreground">{source}</p>
    </div>
  );
};
