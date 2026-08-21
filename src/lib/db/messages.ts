import type { DbData, EngineId, UserSide, MediaPlan } from './types';
import { deriveTasks, derivePlanHealth, type DerivedTask, type TaskSeverity } from './tasks';

/**
 * The inbox model.
 *
 * Every message a user sees — a to-do, a recommendation, an insight, a health
 * alert — is derived from the data, never stored. The database holds the facts
 * (a booking has no creative, a plan is pacing 30% hot); this module turns those
 * facts into messages, and inbox-state.ts remembers which ones the user has read
 * or finished. That separation is why the inbox can never disagree with the
 * pages it links to: change the data and the message appears or disappears.
 *
 * A message therefore has no timestamp. "Received" is not a real event here —
 * a message exists exactly as long as the condition behind it is true.
 */

/** Deliberately small vocabulary — four kinds, so the inbox stays legible. */
export type MessageKind = 'action' | 'recommendation' | 'insight' | 'health';

export interface InboxMessage {
  /** Stable across renders and reloads — read/done state is keyed on it. */
  id: string;
  kind: MessageKind;
  severity: TaskSeverity;
  /** Bold first line, like a mail subject. */
  subject: string;
  /** The preview line under the subject. */
  preview: string;
  /** Which entity the message is about. */
  level: 'media-plan' | 'campaign' | 'booking';
  entityId: string;
  /** "Holiday Sale Plan · Display" — the trail shown on the right of the row. */
  context: string;
  mediaPlanId: string;
  engine?: EngineId;
  /** Where to go to act on it. */
  href: string;
  /** Who this is for. */
  side: UserSide | 'both';
  personaKeys?: string[];
  /** Figures and key points behind a recommendation or insight, shown in the
   *  message panel as its business case. Absent for plain to-dos. */
  evidence?: DerivedTask['evidence'];
}

/** Engine → route segment. They match today, but the map keeps it explicit. */
const routeSegment: Record<EngineId, string> = {
  'display': 'display',
  'sponsored-products': 'sponsored-products',
  'digital-instore': 'digital-instore',
  'offline-instore': 'offline-instore',
  'offsite': 'offsite',
};

/** Where a message takes you when you act on it. */
function hrefFor(db: DbData, task: DerivedTask): string {
  const seg = routeSegment[task.engine ?? 'display'];
  // The setup-help message acts by opening the guided setup wizard for its
  // campaign, not the campaign's detail page.
  if (task.opensWizard && task.level === 'campaign') {
    return `/create/${seg}?campaignId=${task.entityId}${task.wizardStep ? `&step=${task.wizardStep}` : ''}`;
  }
  if (task.level === 'media-plan') return `/campaigns/plan/${task.entityId}`;
  if (task.level === 'campaign') return `/campaigns/${seg}/${task.entityId}`;
  // Sponsored-products keyword bookings live inside their campaign, so open the
  // parent; every other engine has a booking page of its own.
  if (task.engine === 'sponsored-products') {
    const parent = db.bookings.find((b) => b.id === task.entityId)?.campaignId;
    return `/campaigns/${seg}/${parent ?? task.entityId}`;
  }
  return `/campaigns/${seg}/booking/${task.entityId}`;
}

/** "Holiday Sale Plan · Display" — plan name, then proposition when relevant. */
function contextFor(db: DbData, task: DerivedTask): string {
  const plan = db.mediaPlans.find((p) => p.id === task.mediaPlanId);
  const engineLabel = task.engine
    ? task.engine.replace('-instore', ' in-store').replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase())
    : null;
  return [plan?.name, engineLabel].filter(Boolean).join(' · ');
}

/** Derived to-dos, as inbox messages. */
function taskMessages(db: DbData): InboxMessage[] {
  return deriveTasks(db).map((task) => ({
    id: `task:${task.id}`,
    kind: task.kind === 'action' ? 'action' : task.kind,
    severity: task.severity,
    subject: task.title,
    preview: task.detail,
    level: task.level,
    entityId: task.entityId,
    context: contextFor(db, task),
    mediaPlanId: task.mediaPlanId,
    engine: task.engine,
    href: hrefFor(db, task),
    side: task.side,
    personaKeys: task.personaKeys,
    evidence: task.evidence,
  }));
}

/**
 * One health message per plan that isn't healthy. A green plan produces no
 * message — an inbox full of "everything is fine" is an inbox nobody reads.
 */
function healthMessages(db: DbData): InboxMessage[] {
  const messages: InboxMessage[] = [];
  for (const plan of db.mediaPlans) {
    const health = derivePlanHealth(db, plan);
    if (health.level === 'good') continue;
    messages.push({
      id: `health:${plan.id}`,
      kind: 'health',
      severity: health.level === 'risk' ? 'blocking' : 'attention',
      subject: health.level === 'risk' ? `${plan.name} is at risk` : `${plan.name} needs attention`,
      preview: health.message,
      level: 'media-plan',
      entityId: plan.id,
      context: plan.name,
      mediaPlanId: plan.id,
      href: `/campaigns/plan/${plan.id}`,
      side: 'both',
    });
  }
  return messages;
}

/** Health first, then the most blocking work — the order a user should act in. */
const severityOrder: Record<TaskSeverity, number> = { blocking: 0, attention: 1, info: 2 };
const kindOrder: Record<MessageKind, number> = { health: 0, action: 1, recommendation: 2, insight: 3 };

export interface MessageScope {
  /** Only messages for this plan and everything under it. */
  mediaPlanId?: string;
  /** Only messages for this campaign and its bookings. */
  campaignId?: string;
  /** Only messages for this booking. */
  bookingId?: string;
  /** Only messages for this proposition ('all' keeps every engine message). */
  engine?: EngineId | 'all';
  /** Only messages this user should act on. */
  user?: { personaKey: string; side: UserSide };
}

/** Every message in the database, narrowed by scope, in the order to act on. */
export function deriveMessages(db: DbData, scope: MessageScope = {}): InboxMessage[] {
  let messages = [...healthMessages(db), ...taskMessages(db)];

  if (scope.mediaPlanId) {
    messages = messages.filter((m) => m.mediaPlanId === scope.mediaPlanId);
  }
  if (scope.campaignId) {
    const bookingIds = db.bookings.filter((b) => b.campaignId === scope.campaignId).map((b) => b.id);
    messages = messages.filter(
      (m) =>
        (m.level === 'campaign' && m.entityId === scope.campaignId) ||
        (m.level === 'booking' && bookingIds.includes(m.entityId)),
    );
  }
  if (scope.bookingId) {
    messages = messages.filter((m) => m.level === 'booking' && m.entityId === scope.bookingId);
  }
  if (scope.engine) {
    // Engine scope is about a proposition, so plan-wide messages don't belong.
    messages = messages.filter((m) => m.engine !== undefined && (scope.engine === 'all' || m.engine === scope.engine));
  }
  if (scope.user) {
    const { personaKey, side } = scope.user;
    messages = messages.filter(
      (m) =>
        (m.side === 'both' || m.side === side) &&
        (!m.personaKeys || m.personaKeys.includes(personaKey)),
    );
  }

  return messages.sort(
    (a, b) => kindOrder[a.kind] - kindOrder[b.kind] || severityOrder[a.severity] - severityOrder[b.severity],
  );
}

/** Plans the inbox links to, for the "jump to" context line. */
export function planName(db: DbData, id: string): string | undefined {
  return db.mediaPlans.find((p: MediaPlan) => p.id === id)?.name;
}
