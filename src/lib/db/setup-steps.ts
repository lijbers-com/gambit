import type { Booking, Campaign, DbData, MediaPlan, SetupStepKey, Workflow, WorkflowScope, WorkflowStep } from './types';

/**
 * The setup steps, read off the proposition's workflow.
 *
 * A retailer's board says which setup steps a campaign goes through before
 * it is submitted — approve the campaign, create and approve bookings, link
 * creatives — and Edge ticks them off from the data. The media plan's setup
 * cards and the campaign's own workflow bar both read this one list, so
 * the board is the single place setup is defined and both surfaces agree.
 */

export interface SetupStep {
  key: SetupStepKey;
  /** The workflow step this comes from, when the board defines it. */
  stepId?: string;
  title: string;
  description?: string;
  done: boolean;
}

/** What each setup step means when a board has not yet said so itself. */
export const SETUP_STEP_DEFAULTS: Record<SetupStepKey, { title: string; description: string }> = {
  'approve-campaign': { title: 'Approve campaign', description: 'Check what the media plan proposed — name, budget, run time and type.' },
  'create-bookings':  { title: 'Create bookings',  description: 'The guided setup walks through schedule, placement and delivery.' },
  'approve-bookings': { title: 'Approve bookings', description: 'Check the prefilled bookings and approve them.' },
  'link-creatives':   { title: 'Link creatives',   description: 'The creative step of the setup wizard, for bookings still missing one.' },
  'add-targeting':    { title: 'Add products and keywords', description: 'Part of the booking setup — target the right products and terms.' },
  'add-campaigns':    { title: 'Add campaigns',    description: 'One campaign per proposition the plan buys.' },
  'approve-campaigns': { title: 'Approve campaigns', description: 'Check what the plan proposed for each campaign.' },
};

/** The workflow a proposition follows: the published one, else its draft. */
export function workflowFor(db: DbData, scope: WorkflowScope): Workflow | undefined {
  return db.workflows.find((w) => w.engine === scope && w.status === 'published') ?? db.workflows.find((w) => w.engine === scope);
}

/** Whether the data already shows a setup step as done, for a campaign. */
export function setupStepDone(db: DbData, campaign: Campaign, key: SetupStepKey): boolean {
  const bookings = db.bookings.filter((b) => b.campaignId === campaign.id);
  switch (key) {
    case 'approve-campaign': return campaign.status !== 'draft';
    case 'create-bookings':  return bookings.length > 0;
    case 'approve-bookings': return bookings.length > 0 && bookings.every((b) => b.status !== 'draft');
    case 'link-creatives':   return bookings.length > 0 && bookings.every((b) => b.creativeStatus !== 'missing');
    case 'add-targeting':    return bookings.length > 0 && bookings.every((b) => b.positionIds.length > 0);
    case 'add-campaigns':    return true; // a campaign exists by definition
    case 'approve-campaigns': return campaign.status !== 'draft';
  }
}

/** The same question asked of a media plan: done when every campaign under it is. */
export function setupStepDoneForPlan(db: DbData, plan: MediaPlan, key: SetupStepKey): boolean {
  const campaigns = db.campaigns.filter((c) => c.mediaPlanId === plan.id);
  switch (key) {
    case 'add-campaigns':    return campaigns.length > 0;
    case 'approve-campaigns':
    case 'approve-campaign': return campaigns.length > 0 && campaigns.every((c) => c.status !== 'draft');
    default:                 return campaigns.length > 0 && campaigns.every((c) => setupStepDone(db, c, key));
  }
}

/** The same question asked of one booking. */
export function setupStepDoneForBooking(db: DbData, booking: Booking, key: SetupStepKey): boolean {
  const campaign = db.campaigns.find((c) => c.id === booking.campaignId);
  switch (key) {
    case 'approve-campaign': return campaign ? campaign.status !== 'draft' : true;
    case 'create-bookings':  return true;
    case 'approve-bookings': return booking.status !== 'draft';
    case 'link-creatives':   return booking.creativeStatus !== 'missing';
    case 'add-targeting':    return booking.positionIds.length > 0;
    case 'add-campaigns':
    case 'approve-campaigns': return true;
  }
}

/** The board's setup steps in walking order — or, on a board without any, the defaults. */
export function setupWorkflowSteps(workflow: Workflow | undefined, engine: Campaign['engine']): { key: SetupStepKey; step?: WorkflowStep }[] {
  const fromBoard = workflow ? walkSteps(workflow).filter((s): s is WorkflowStep & { setup: SetupStepKey } => !!s.setup) : [];
  if (fromBoard.length) return fromBoard.map((s) => ({ key: s.setup, step: s }));
  const keys: SetupStepKey[] = ['approve-campaign', 'create-bookings', 'approve-bookings', engine === 'sponsored-products' ? 'add-targeting' : 'link-creatives'];
  return keys.map((key) => ({ key }));
}

/**
 * A campaign's setup steps, with what is done. An assisted campaign arrives
 * with its bookings proposed, so creating them is not work the user has
 * left — approving them is; that step steps aside for it.
 */
export function setupStepsForCampaign(db: DbData, campaign: Campaign): SetupStep[] {
  const bookings = db.bookings.filter((b) => b.campaignId === campaign.id);
  return setupWorkflowSteps(workflowFor(db, campaign.engine), campaign.engine)
    .filter(({ key }) => !(key === 'create-bookings' && campaign.mode === 'assisted' && bookings.length > 0))
    .map(({ key, step }) => ({
      key,
      stepId: step?.id,
      title: step?.name ?? SETUP_STEP_DEFAULTS[key].title,
      description: step?.description ?? SETUP_STEP_DEFAULTS[key].description,
      done: setupStepDone(db, campaign, key),
    }));
}

/** The board's steps in walking order from its start. */
export function walkSteps(workflow: Pick<Workflow, 'steps' | 'transitions'>): WorkflowStep[] {
  const incoming = new Set(workflow.transitions.map((t) => t.to));
  const start = workflow.steps.find((s) => !incoming.has(s.id)) ?? workflow.steps[0];
  if (!start) return [];
  const order: WorkflowStep[] = [];
  const seen = new Set<string>();
  const queue = [start.id];
  while (queue.length) {
    const id = queue.shift()!;
    if (seen.has(id)) continue;
    seen.add(id);
    const s = workflow.steps.find((x) => x.id === id);
    if (!s) continue;
    order.push(s);
    for (const t of workflow.transitions.filter((t) => t.from === id)) queue.push(t.to);
  }
  return order;
}
