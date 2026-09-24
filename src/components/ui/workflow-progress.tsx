'use client';

import * as React from 'react';
import { Bell, Check, CheckCircle2, ChevronDown, Clock, Flag, GitBranch, Mail, ShieldCheck, Truck, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TabActionGroup } from './tab-actions';
import { useDb, useSession, readWorkflow, workflowOrDefault, targetFor, type Booking, type WorkflowAction, type WorkflowScope, type WorkflowStep, type WorkflowStepKind, type WorkflowStepState, type WorkflowTarget } from '@/lib/db';
import { LIFECYCLE_LABEL } from '@/lib/status-vocabulary';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

/**
 * Where a campaign or booking stands in its proposition's workflow, and what
 * is next — as a list anyone can read:
 *
 *   ✓ done          the data shows it done, or the stage is behind us
 *   ● open          in the current stage — YOUR MOVE with a button when the
 *                   signed-in side owns it, "Waiting for the retailer" when
 *                   the other side does, "Automatic" when Edge runs it
 *   ○ upcoming      in a later stage — never ticked, however the data looks
 *                   today, because the stage has not been reached
 *
 * The bar shows the stages; the current one is lit and its steps sit
 * beneath; past stages fold to one line each; later stages list what is
 * coming, including what Edge does on its own (send the report, notify).
 * The board is the retailer's; this is the entity reading it.
 */

const KIND_ICON: Record<WorkflowStepKind, React.ComponentType<{ className?: string }>> = {
  stage: Flag, approval: ShieldCheck, check: CheckCircle2, fulfilment: Truck, notification: Bell, gate: GitBranch,
};
const ACTION_ICON: Record<WorkflowAction['type'], React.ComponentType<{ className?: string }>> = {
  email: Mail, notification: Bell, todo: CheckCircle2, 'set-status': Flag, kafka: Zap, log: Zap,
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

  /** One step, read as a to-do: what it is, whose move, and what to do. */
  const renderRow = ({ step, status }: WorkflowStepState, stageIndex: number) => {
    const Icon = KIND_ICON[step.kind];
    const turn = turnOf(step);
    const extra = status === 'open' ? renderStepExtra?.(step, false) : null;
    const due = step.dueDaysBeforeStart ? ` · due ${daysBefore(entity.startDate, step.dueDaysBeforeStart)} (X-${step.dueDaysBeforeStart})` : '';
    const sla = step.slaDays ? ` · ${step.slaDays}-day SLA` : '';
    const stageName = stages[stageIndex]?.name ?? 'this stage';
    const second =
      status === 'done' ? `Done · ${OWNER_LABEL[step.owner]}`
      : status === 'upcoming' ? `${OWNER_LABEL[step.owner]} · comes up in ${stageName}${due}`
      : turn === 'auto' ? `Edge runs this automatically${due}${sla}`
      : turn === 'mine' ? `${OWNER_LABEL[step.owner]} — your move${due}${sla}`
      : `${OWNER_LABEL[step.owner]}${due}${sla}`;
    return (
      <li key={step.id} className={cn('flex items-center gap-3 px-3 py-2 text-sm', status !== 'open' && 'text-muted-foreground', status === 'open' && turn === 'mine' && 'bg-surface-selected')}>
        <span className={cn(
          'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border',
          status === 'done' && 'border-success-200 bg-success-50 text-success-700',
          status === 'open' && 'border-foreground bg-background text-foreground',
          status === 'upcoming' && 'border-dashed bg-background text-muted-foreground',
        )}>
          {status === 'done' ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
        </span>
        <span className="min-w-0 flex-1">
          <span className={cn('block truncate', status === 'done' && 'line-through', status === 'open' && 'font-medium text-foreground')}>{step.name}</span>
          <span className="block truncate text-xs text-muted-foreground">{second}</span>
        </span>
        {status === 'open' && step.mandatory && <span className="shrink-0 rounded-sm bg-neutral-100 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-neutral-600">Mandatory</span>}
        {status === 'open' && turn === 'theirs' && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border bg-background px-2 py-0.5 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            Waiting for the {OWNER_LABEL[step.owner].toLowerCase()}
          </span>
        )}
        {status === 'open' && turn === 'auto' && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-warning-200 bg-warning-50 px-2 py-0.5 text-xs text-warning-700">
            <Zap className="h-3 w-3" />
            Not met yet
          </span>
        )}
        {status === 'open' && turn === 'mine' && (extra ?? (
          <span className="inline-flex shrink-0 items-center rounded-full border border-warning-200 bg-warning-50 px-2 py-0.5 text-xs font-medium text-warning-700">Your move</span>
        ))}
        {status === 'upcoming' && <span className="shrink-0 text-xs text-muted-foreground">Later</span>}
      </li>
    );
  };

  /** What Edge does on its own when a stage is reached — sent, notified,
   *  published — shown so the reader knows what happens without them. */
  const renderStageActions = (stage: WorkflowStep, done: boolean) =>
    stage.actions.filter((a) => a.type !== 'log').map((a) => {
      const AIcon = ACTION_ICON[a.type];
      return (
        <li key={a.id} className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground">
          <span className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-full border', done ? 'border-success-200 bg-success-50 text-success-700' : 'border-dashed bg-background')}>
            {done ? <Check className="h-3.5 w-3.5" /> : <AIcon className="h-3.5 w-3.5" />}
          </span>
          <span className="min-w-0 flex-1">
            <span className={cn('block truncate', done && 'line-through')}>{a.label}</span>
            <span className="block truncate text-xs">Edge · automatic{a.to ? ` · to the ${OWNER_LABEL[a.to].toLowerCase()}` : ''}</span>
          </span>
          <span className="shrink-0 text-xs">{done ? `Fired on reaching ${stage.name}` : `On reaching ${stage.name}`}</span>
        </li>
      );
    });

  /** A stage's list: its steps, then what Edge does when it is reached. */
  const renderStage = (i: number) => {
    const stage = stages[i];
    const list = stepsOf(i);
    // A stage's own actions fire on reaching it — so they have fired for
    // the current stage as well as past ones.
    const rows = [...list.map((x) => renderRow(x, i)), ...renderStageActions(stage, i <= currentIndex)];
    return rows.length > 0 ? <ul className="divide-y">{rows}</ul> : (
      <p className="px-3 py-3 text-sm text-muted-foreground">{stage.description ?? 'Nothing to do in this stage — it is left on its own.'}</p>
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

  /** The full list: past stages folded, the current one open, later ones as what is coming. */
  const fullList = (
    <div className="rounded-md border bg-background">
      {stages.slice(0, currentIndex).map((st, i) => (
        <div key={st.id} className="flex items-center gap-3 border-b px-3 py-2 text-sm text-muted-foreground">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-success-200 bg-success-50 text-success-700"><Check className="h-3.5 w-3.5" /></span>
          <span className="min-w-0 flex-1 truncate line-through">{st.name}</span>
          <span className="shrink-0 text-xs">{countsFor(i)}</span>
        </div>
      ))}
      <div className="flex items-center justify-between border-b px-3 py-2">
        <span className="text-sm font-medium">{headingFor(currentIndex)}</span>
        <span className="text-xs text-muted-foreground">{countsFor(currentIndex)}</span>
      </div>
      {renderStage(currentIndex)}
      {stages.slice(currentIndex + 1).map((st, k) => {
        const i = currentIndex + 1 + k;
        return (
          <div key={st.id}>
            <div className="flex items-center justify-between border-y bg-muted/30 px-3 py-2">
              <span className="text-sm font-medium text-muted-foreground">{headingFor(i)}</span>
              <span className="text-xs text-muted-foreground">{countsFor(i)}</span>
            </div>
            {renderStage(i)}
          </div>
        );
      })}
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
        <li key={st.id} className="flex items-center">
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
