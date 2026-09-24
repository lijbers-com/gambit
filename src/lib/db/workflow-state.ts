import type { Booking, Campaign, DbData, MediaPlan, Workflow, WorkflowScope, WorkflowStep } from './types';
import { SETUP_STEP_DEFAULTS, setupStepDone, setupStepDoneForBooking, setupStepDoneForPlan, setupWorkflowSteps, walkSteps, workflowFor } from './setup-steps';
import { PLAN_STATUS_TO_LIFECYCLE, type LifecycleStatus } from '@/lib/status-vocabulary';

/**
 * Reading a workflow for one entity — the one place that says where a media
 * plan, campaign or booking stands on its board and what the data already
 * shows as done. The workflow bar on the pages and the to-do engine behind
 * the notifications both read through here, so the bar's open steps and the
 * inbox's to-dos are the same list.
 */

/** Names retailers give the shared stages (OMI: Sales, Preparation, …). */
export const STAGE_SYNONYMS: Record<LifecycleStatus, string[]> = {
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

/** What the reading was asked about — the entity as a booking-shaped
 *  record (the sum of its parts), plus the stored records behind it. */
export interface WorkflowTarget {
  level: 'media-plan' | 'campaign' | 'booking';
  entity: Booking;
  plan?: MediaPlan;
  campaign?: Campaign;
  booking?: Booking;
  /** The campaigns' budgets added up — the plan's "within ceiling" check. */
  allocated?: number;
}

/** A campaign reads as the sum of its bookings: creatives approved when all
 *  are, placed when any is. */
export function campaignAsBooking(db: DbData, c: Campaign): Booking {
  const bs = db.bookings.filter((b) => b.campaignId === c.id);
  return {
    id: c.id, campaignId: c.id, name: c.name, status: c.status, budget: c.budget, spend: c.spend,
    startDate: c.startDate, endDate: c.endDate,
    positionIds: bs.flatMap((b) => b.positionIds),
    creativeStatus: bs.length && bs.every((b) => b.creativeStatus === 'approved') ? 'approved' : bs.some((b) => b.creativeStatus !== 'missing') ? 'submitted' : 'missing',
    createdAt: c.createdAt, updatedAt: c.updatedAt,
  };
}

/** A plan reads as the sum of its campaigns' bookings. */
export function planAsBooking(db: DbData, pl: MediaPlan): Booking {
  const cs = db.campaigns.filter((c) => c.mediaPlanId === pl.id);
  const bs = db.bookings.filter((b) => cs.some((c) => c.id === b.campaignId));
  return {
    id: pl.id, campaignId: '', name: pl.name, status: pl.status, budget: pl.budget, spend: cs.reduce((sum, c) => sum + c.spend, 0),
    startDate: pl.startDate, endDate: pl.endDate,
    positionIds: bs.flatMap((b) => b.positionIds),
    creativeStatus: bs.length && bs.every((b) => b.creativeStatus === 'approved') ? 'approved' : bs.some((b) => b.creativeStatus !== 'missing') ? 'submitted' : 'missing',
    createdAt: pl.createdAt, updatedAt: pl.updatedAt,
  };
}

/** The target for a stored plan, campaign or booking. */
export function targetFor(db: DbData, ref: { mediaPlanId?: string; campaignId?: string; bookingId?: string }): WorkflowTarget | undefined {
  if (ref.bookingId) {
    const booking = db.bookings.find((b) => b.id === ref.bookingId);
    if (!booking) return undefined;
    const campaign = db.campaigns.find((c) => c.id === booking.campaignId);
    return { level: 'booking', entity: booking, booking, campaign, plan: campaign && db.mediaPlans.find((p) => p.id === campaign.mediaPlanId) };
  }
  if (ref.campaignId) {
    const campaign = db.campaigns.find((c) => c.id === ref.campaignId);
    if (!campaign) return undefined;
    return { level: 'campaign', entity: campaignAsBooking(db, campaign), campaign, plan: db.mediaPlans.find((p) => p.id === campaign.mediaPlanId) };
  }
  if (ref.mediaPlanId) {
    const plan = db.mediaPlans.find((p) => p.id === ref.mediaPlanId);
    if (!plan) return undefined;
    const allocated = db.campaigns.filter((c) => c.mediaPlanId === plan.id).reduce((s, c) => s + c.budget, 0);
    return { level: 'media-plan', entity: planAsBooking(db, plan), plan, allocated };
  }
  return undefined;
}

/**
 * A proposition without a board of its own still follows a workflow: the
 * shared lifecycle with the setup steps Edge derives, each with the to-do
 * a retailer would have put on it. Publishing a board replaces this.
 */
export function defaultWorkflow(scope: WorkflowScope): Workflow {
  const engine = scope === 'media-plan' ? 'display' : scope;
  const setup = setupWorkflowSteps(undefined, engine).map(({ key }, i) => ({
    id: `d-${key}`, kind: key.startsWith('approve') ? 'approval' as const : 'fulfilment' as const, setup: key,
    name: SETUP_STEP_DEFAULTS[key].title, description: SETUP_STEP_DEFAULTS[key].description,
    owner: 'advertiser' as const, mandatory: true, x: 40, y: 180 + i * 140,
    actions: [{ id: `d-${key}-todo`, type: 'todo' as const, label: `To-do: ${SETUP_STEP_DEFAULTS[key].title.toLowerCase()}`, to: 'advertiser' as const }],
  }));
  const stages: WorkflowStep[] = [
    { id: 'd-draft', kind: 'stage', name: 'Draft', description: 'Outlined; the setup steps are what is left.', owner: 'advertiser', mandatory: true, x: 40, y: 40, actions: [] },
    { id: 'd-review', kind: 'stage', name: 'In review', description: 'Submitted; the retailer reviews it.', owner: 'retailer', mandatory: true, slaDays: 3, x: 360, y: 40, actions: [{ id: 'd-review-todo', type: 'todo', label: 'To-do for the reviewer: approve or request changes', to: 'retailer' }] },
    { id: 'd-live', kind: 'stage', name: 'Live', description: 'Delivering from the flight date.', owner: 'edge', mandatory: true, x: 680, y: 40, actions: [] },
    { id: 'd-done', kind: 'stage', name: 'Completed', description: 'After the end date.', owner: 'edge', mandatory: true, x: 1000, y: 40, actions: [] },
  ];
  const chain = [stages[0], ...setup, stages[1], stages[2], stages[3]];
  return {
    id: `WF-DEFAULT-${scope}`, engine: scope, name: 'Shared lifecycle', status: 'published',
    description: 'The shared lifecycle with the setup steps — used until a board is published for this proposition.',
    steps: [...stages, ...setup],
    transitions: chain.slice(1).map((s, i) => ({ id: `d-t${i}`, from: chain[i].id, to: s.id })),
    updatedAt: '', publishedAt: '',
  };
}

/** The board a proposition follows, or the shared default when it has none. */
export function workflowOrDefault(db: DbData, scope: WorkflowScope): Workflow {
  return workflowFor(db, scope) ?? defaultWorkflow(scope);
}

/** Where a step stands: done, open in the current stage, or upcoming in a
 *  later one. A later stage's step is never done — its check may pass on
 *  today's data, but the stage has not been reached. */
export type WorkflowStepStatus = 'done' | 'open' | 'upcoming';

export interface WorkflowStepState {
  step: WorkflowStep;
  done: boolean;
  status: WorkflowStepStatus;
}

export interface WorkflowReading {
  workflow: Workflow;
  target: WorkflowTarget;
  /** Every step in walking order. */
  order: WorkflowStep[];
  stages: WorkflowStep[];
  currentIndex: number;
  lifecycle: LifecycleStatus;
  /** Which stage (index) each step belongs to. */
  stageOf: Map<string, number>;
  stepDone: (step: WorkflowStep) => boolean;
  /** The steps that belong to a stage, with what the data says about each. */
  stepsOf: (stageIndex: number) => WorkflowStepState[];
  /** What is asked for now: the current stage's steps — or, when it has
   *  none, the next stage's — with what is done. */
  current: WorkflowStepState[];
  /** Whether `current` is this stage's own work (true) or the next stage's. */
  currentIsOwn: boolean;
  /** "To get past In review" / "Before Live". */
  heading: string;
}

/** Whole percent of a flight that has elapsed. */
function elapsedPercent(startDate: string, endDate: string): number {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  if (!(end > start)) return 100;
  return Math.max(0, Math.min(100, Math.round(((Date.now() - start) / (end - start)) * 100)));
}

/** Where an entity stands on a board, and what is done. */
export function readWorkflow(db: DbData, workflow: Workflow, target: WorkflowTarget): WorkflowReading {
  const { entity, plan, campaign } = target;
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
    const at = stageOf.get(step.id) ?? 0;
    if (at < currentIndex) return true; // a past stage's work is behind us
    if (at > currentIndex) return false; // a later stage's work has not started
    if (step.setup) {
      return target.level === 'media-plan' && plan ? setupStepDoneForPlan(db, plan, step.setup)
        : target.level === 'campaign' && campaign ? setupStepDone(db, campaign, step.setup)
        : setupStepDoneForBooking(db, entity, step.setup);
    }
    const n = step.name.toLowerCase();
    if (/creative/.test(n)) return entity.creativeStatus === 'approved';
    if (/store|screen|placement|position/.test(n)) return entity.positionIds.length > 0;
    if (/product/.test(n)) return true; // assigned with the campaign
    // The automatic checks: done while the fact they watch holds.
    if (/budget/.test(n)) return target.allocated === undefined || target.allocated <= entity.budget;
    if (/pacing/.test(n)) {
      if (entity.status !== 'running' || entity.budget <= 0) return true;
      const behind = elapsedPercent(entity.startDate, entity.endDate) - Math.round((entity.spend / entity.budget) * 100);
      return behind < 20;
    }
    return false;
  };

  const stepsOf = (stageIndex: number): WorkflowStepState[] =>
    order.filter((st) => st.kind !== 'stage' && stageOf.get(st.id) === stageIndex).map((st) => {
      const done = stepDone(st);
      return { step: st, done, status: done ? 'done' : stageIndex > currentIndex ? 'upcoming' : 'open' };
    });

  const own = stepsOf(currentIndex);
  const next = stepsOf(currentIndex + 1);
  const currentIsOwn = own.length > 0;
  const current = currentIsOwn ? own : next;
  const heading = currentIsOwn ? `To get past ${stages[currentIndex]?.name ?? 'this stage'}` : `Before ${stages[currentIndex + 1]?.name ?? 'the next stage'}`;

  return { workflow, target, order, stages, currentIndex, lifecycle, stageOf, stepDone, stepsOf, current, currentIsOwn, heading };
}
