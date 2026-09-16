'use client';

import * as React from 'react';
import { Bell, Check, CheckCircle2, ChevronDown, Flag, GitBranch, ShieldCheck, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDb, setupStepDone, setupStepDoneForBooking, walkSteps, workflowFor, type Booking, type Campaign, type EngineId, type WorkflowStep, type WorkflowStepKind } from '@/lib/db';
import { LIFECYCLE_LABEL, PLAN_STATUS_TO_LIFECYCLE, type LifecycleStatus } from '@/lib/status-vocabulary';
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

/** Names retailers give the shared stages (OMI: Sales, Preparation, …). */
const STAGE_SYNONYMS: Record<LifecycleStatus, string[]> = {
  draft: ['draft', 'sales', 'new'],
  'in-review': ['in review', 'review', 'sales'],
  approved: ['approved', 'preparation', 'prep'],
  scheduled: ['scheduled', 'production', 'ready'],
  live: ['live', 'run', 'running', 'active'],
  completed: ['completed', 'done', 'complete'],
  'changes-requested': ['changes requested'],
  paused: ['paused'],
  cancelled: ['cancelled'],
};

const daysBefore = (iso: string, days: number) => {
  const d = new Date(iso);
  d.setDate(d.getDate() - days);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
};

export interface WorkflowProgressProps {
  engine: EngineId;
  bookingId?: string;
  campaignId?: string;
  variant?: 'full' | 'bar';
  /** Bar only: leave out the "Next: …" line — the chips already open the steps. */
  hideNext?: boolean;
  className?: string;
}

export const WorkflowProgress: React.FC<WorkflowProgressProps> = ({ engine, bookingId, campaignId, variant = 'full', hideNext, className }) => {
  const db = useDb();
  const workflow = workflowFor(db, engine);
  const foundBooking = bookingId ? db.bookings.find((b) => b.id === bookingId) : undefined;
  const foundCampaign = campaignId ? db.campaigns.find((c) => c.id === campaignId) : undefined;

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
  // A campaign reads as the sum of its bookings: creatives approved when all
  // are, placed when any is.
  const campaignAsBooking = (c: Campaign): Booking => {
    const bs = db.bookings.filter((b) => b.campaignId === c.id);
    return {
      id: c.id, campaignId: c.id, name: c.name, status: c.status, budget: c.budget, spend: c.spend,
      startDate: c.startDate, endDate: c.endDate,
      positionIds: bs.flatMap((b) => b.positionIds),
      creativeStatus: bs.length && bs.every((b) => b.creativeStatus === 'approved') ? 'approved' : bs.some((b) => b.creativeStatus !== 'missing') ? 'submitted' : 'missing',
      createdAt: c.createdAt, updatedAt: c.updatedAt,
    };
  };
  const entity: Booking | undefined = foundBooking ?? (foundCampaign ? campaignAsBooking(foundCampaign) : bookingId ? fallback(bookingId) : campaignId ? fallback(campaignId) : undefined);
  if (!workflow || !entity) return null;

  const order = walkSteps(workflow);
  const stages = order.filter((s) => s.kind === 'stage');
  const lifecycle = PLAN_STATUS_TO_LIFECYCLE[entity.status];
  // The current stage: by the retailer's own name for it, else by position.
  const wanted = STAGE_SYNONYMS[lifecycle];
  let currentIndex = stages.findIndex((s) => wanted.some((w) => s.name.toLowerCase().includes(w)));
  if (currentIndex < 0) {
    const pos: Record<LifecycleStatus, number> = { draft: 0, 'in-review': 1, approved: 2, scheduled: 3, live: 4, completed: 5, 'changes-requested': 1, paused: 4, cancelled: 5 };
    currentIndex = Math.min(pos[lifecycle], Math.max(0, stages.length - 1));
  }

  // Which stage each step belongs to: the last stage before it in walking order.
  const stageOf = new Map<string, number>();
  let si = -1;
  for (const s of order) {
    if (s.kind === 'stage') si = stages.findIndex((x) => x.id === s.id);
    stageOf.set(s.id, Math.max(0, si));
  }

  /** What the data already says about a step. */
  const stepDone = (step: WorkflowStep): boolean => {
    if ((stageOf.get(step.id) ?? 0) < currentIndex) return true; // a past stage's work is behind us
    if (step.setup) {
      return foundCampaign ? setupStepDone(db, foundCampaign, step.setup) : setupStepDoneForBooking(db, entity, step.setup);
    }
    const n = step.name.toLowerCase();
    if (/creative/.test(n)) return entity.creativeStatus === 'approved';
    if (/store|screen|placement|position/.test(n)) return entity.positionIds.length > 0;
    if (/product/.test(n)) return true; // assigned with the campaign
    return false;
  };

  /** The steps that belong to a stage, with what the data says about each. */
  const stepsOf = (stageIndex: number) =>
    order.filter((st) => st.kind !== 'stage' && stageOf.get(st.id) === stageIndex).map((st) => ({ step: st, done: stepDone(st) }));

  const work = order.filter((s) => s.kind !== 'stage' && stageOf.get(s.id) === currentIndex);
  const next = order.filter((s) => s.kind !== 'stage' && stageOf.get(s.id) === currentIndex + 1);
  const items = (work.length ? work : next).map((s) => ({ step: s, done: stepDone(s) }));
  const open = items.filter((i) => !i.done);
  const heading = work.length ? `To get past ${stages[currentIndex]?.name ?? 'this stage'}` : `Before ${stages[currentIndex + 1]?.name ?? 'the next stage'}`;

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
              <PopoverContent align="start" className="w-96 p-0">
                <div className="flex items-center justify-between border-b px-3 py-2">
                  <span className="text-sm font-medium">{i === currentIndex ? `To get past ${st.name}` : i < currentIndex ? `${st.name} — done` : `Before ${st.name} is left`}</span>
                  {list.length > 0 && <span className="text-xs text-muted-foreground">{openCount} open · {list.length - openCount} done</span>}
                </div>
                {list.length > 0 ? renderList(list) : (
                  <p className="px-3 py-3 text-sm text-muted-foreground">{st.description ?? 'Nothing to do in this stage — it is left on its own.'}</p>
                )}
                <p className="border-t px-3 py-2 text-xs text-muted-foreground">{source}</p>
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
      <div className={cn('flex flex-wrap items-center gap-x-6 gap-y-2', className)}>
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
