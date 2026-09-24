import type { DbData, EngineId, UserSide, WorkflowAction, WorkflowOwner, WorkflowStep } from './types';
import type { DerivedTask } from './tasks';
import { readWorkflow, targetFor, workflowOrDefault, type WorkflowReading, type WorkflowTarget } from './workflow-state';

/**
 * The to-dos and reminders a workflow asks for — what fills the "action"
 * notifications.
 *
 * A retailer's board says, per step, what Edge does when the step is
 * reached: send an email, create a to-do, show an in-app notification. This
 * module walks each media plan, campaign and booking along its board and
 * turns every open step that carries a to-do or a notification into one
 * action message, with the whole stage's steps attached so the reader sees
 * what is still to do around it. Nothing is stored: a to-do exists exactly
 * as long as its step is open, and finishing the work closes it.
 *
 * Two kinds, from the two action types:
 *   to-do          — work the owner must do; blocking while the step is
 *                    mandatory, attention otherwise
 *   notification   — a reminder while the step is open; never blocks
 * A stage's own in-app notification ("Notify: live") announces reaching the
 * stage and is an event, not standing work — it is left out here.
 */

/** One step of the stage a to-do belongs to, for the notification's card. */
export interface WorkflowTodoStep {
  id: string;
  name: string;
  description?: string;
  owner: WorkflowOwner;
  done: boolean;
  mandatory: boolean;
  /** The step this notification is about. */
  current: boolean;
  /** "12 Oct (X-4)" when the step has a deadline against the flight start. */
  due?: string;
  /** A second line of its own — where the step sits ("Summer Launch Plan ·
   *  Display") — shown instead of the owner when set. */
  sub?: string;
}

const daysBefore = (iso: string, days: number) => {
  const d = new Date(iso);
  d.setDate(d.getDate() - days);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

const dueOf = (step: WorkflowStep, startDate: string) =>
  step.dueDaysBeforeStart ? `${daysBefore(startDate, step.dueDaysBeforeStart)} (X-${step.dueDaysBeforeStart})` : undefined;

/** Who acts, from the action's addressee — else the step's owner. */
function sideOf(action: WorkflowAction, step: WorkflowStep): { side: UserSide | 'both'; personaKeys?: string[] } {
  const to = action.to ?? step.owner;
  if (to === 'advertiser') return { side: 'advertiser', personaKeys: ['advertiser', 'campaign-builder', 'media-agency-advertiser'] };
  if (to === 'retailer') return { side: 'retailer', personaKeys: ['campaign-manager-managed', 'self-service-support-specialist', 'account-manager-sales', 'yield-manager'] };
  return { side: 'both' };
}

/** "To-do for AdOps: review the booking" → "Review the booking". */
function cleanLabel(label: string): string {
  const stripped = label.replace(/^\s*(to-?do|reminder|notify|notification)\b[^:]*:\s*/i, '').trim();
  return stripped ? stripped.charAt(0).toUpperCase() + stripped.slice(1) : label;
}

/** The stage's steps as the notification's card, the step in question marked. */
function stepsCard(reading: WorkflowReading, stepId: string): WorkflowTodoStep[] {
  return reading.current.map(({ step, done }) => ({
    id: step.id, name: step.name, description: step.description, owner: step.owner, done, mandatory: step.mandatory,
    current: step.id === stepId, due: dueOf(step, reading.target.entity.startDate),
  }));
}

function todosFor(db: DbData, target: WorkflowTarget, engine?: EngineId): DerivedTask[] {
  const scope = target.level === 'media-plan' ? 'media-plan' : (engine ?? target.campaign?.engine);
  if (!scope) return [];
  const reading = readWorkflow(db, workflowOrDefault(db, scope), target);
  const { entity } = target;
  const plan = target.plan;
  const mediaPlanId = plan?.id ?? entity.id;
  const tasks: DerivedTask[] = [];
  const stage = reading.stages[reading.currentIndex];
  // A booking follows its campaign's board, and the campaign already carries
  // the stage's own to-do and the setup steps. The booking only speaks for
  // work that is its own — a creative due, a spec check — and only when the
  // campaign has more than one booking, so the two levels never say the
  // same thing twice.
  const bookingLevel = target.level === 'booking';
  const siblings = bookingLevel && target.campaign ? db.bookings.filter((b) => b.campaignId === target.campaign!.id).length : 0;
  if (bookingLevel && siblings < 2) return tasks;
  const relevant = (step: WorkflowStep) => !bookingLevel || !step.setup;

  const open = reading.current.filter(({ step, done }) => !done && relevant(step));
  const card = () => stepsCard(reading, '');

  // ── The to-do: one per stage, listing what the board asks for ────────
  // The stage's own to-do (an "In review" that asks AdOps to review) and the
  // open steps that carry one make ONE notification: its subject is the
  // first thing to do, its card the whole stage.
  const stageTodo = !bookingLevel && reading.currentIsOwn && stage ? stage.actions.find((a) => a.type === 'todo') : undefined;
  const stepTodos = open.filter(({ step }) => step.actions.some((a) => a.type === 'todo'));
  if (stageTodo || stepTodos.length > 0) {
    const first = stepTodos[0];
    const lead: { step: WorkflowStep; action: WorkflowAction } = first
      ? { step: first.step, action: first.step.actions.find((a) => a.type === 'todo')! }
      : { step: stage!, action: stageTodo! };
    const { side, personaKeys } = sideOf(lead.action, lead.step);
    const due = dueOf(lead.step, entity.startDate);
    const names = stepTodos.map(({ step }) => step.name.toLowerCase());
    const detail = first
      ? `${names.length === 1 ? 'One step' : `${names.length} steps`} still to do to get past ${stage?.name ?? 'this stage'}: ${names.join(', ')}.${due ? ` Due ${due}.` : ''}`
      : [lead.step.description, lead.step.slaDays ? `${lead.step.slaDays}-day SLA.` : undefined].filter(Boolean).join(' ') || lead.action.label;
    const steps = stepsCard(reading, lead.step.id);
    tasks.push({
      id: `${entity.id}-wf-${stage?.id ?? 'stage'}-todo`,
      kind: 'action',
      severity: stepTodos.some(({ step }) => step.mandatory) ? 'blocking' : 'attention',
      level: target.level,
      entityId: entity.id,
      mediaPlanId,
      engine: target.level === 'media-plan' ? undefined : engine,
      title: first ? first.step.name : cleanLabel(stageTodo!.label),
      detail,
      side,
      personaKeys,
      steps: steps.length ? steps : card(),
      // A campaign's setup step is done in its wizard — straight to the
      // creative step when that is what is left.
      opensWizard: target.level === 'campaign' && !!lead.step.setup,
      wizardStep: target.level === 'campaign' && lead.step.setup === 'link-creatives' ? 'creatives' : undefined,
    });
  }

  // ── Reminders: the board's in-app notification on an open step ───────
  for (const { step } of open) {
    for (const action of step.actions.filter((a) => a.type === 'notification')) {
      const { side, personaKeys } = sideOf(action, step);
      const due = dueOf(step, entity.startDate);
      tasks.push({
        id: `${entity.id}-wf-${step.id}-${action.id}`,
        kind: 'action',
        severity: 'info',
        level: target.level,
        entityId: entity.id,
        mediaPlanId,
        engine: target.level === 'media-plan' ? undefined : engine,
        title: cleanLabel(action.label),
        detail: [step.description, due ? `Due ${due}.` : undefined].filter(Boolean).join(' ') || step.name,
        side,
        personaKeys,
        reminder: true,
        steps: stepsCard(reading, step.id),
      });
    }
  }
  return tasks;
}

/** Every workflow to-do and reminder in the database. */
export function deriveWorkflowTodos(db: DbData): DerivedTask[] {
  const tasks: DerivedTask[] = [];
  for (const plan of db.mediaPlans) {
    if (plan.status === 'completed') continue;
    const planTarget = targetFor(db, { mediaPlanId: plan.id });
    if (planTarget) tasks.push(...todosFor(db, planTarget));
    for (const campaign of db.campaigns.filter((c) => c.mediaPlanId === plan.id)) {
      if (campaign.status === 'completed') continue;
      const ct = targetFor(db, { campaignId: campaign.id });
      if (ct) tasks.push(...todosFor(db, ct, campaign.engine));
      for (const booking of db.bookings.filter((b) => b.campaignId === campaign.id)) {
        if (booking.status === 'completed') continue;
        const bt = targetFor(db, { bookingId: booking.id });
        if (bt) tasks.push(...todosFor(db, bt, campaign.engine));
      }
    }
  }
  return tasks;
}
