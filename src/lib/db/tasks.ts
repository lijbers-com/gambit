import type { DbData, EngineId, MediaPlan, UserSide } from './types';

/**
 * Derived to-dos — the alignment layer between statuses, tasks, health,
 * recommendations and insights.
 *
 * Nothing here is stored: every to-do is DERIVED from the data state (a
 * missing creative, an unplaced booking, an empty campaign, pacing…). That
 * keeps statuses clean (one lifecycle, see types.ts) while users still get
 * concrete, role-scoped work items. The same list drives:
 *
 *  - the "Your tasks" widgets on home (filtered by the logged-in user's role)
 *  - the media-plan health check (red = blocking issues on a live plan)
 *  - the notifications feed on the media-plan card (action / recommendation /
 *    insight kinds map 1:1 to the notification types)
 *
 * Rules are intentionally simple and enumerable so they can be refined
 * together — each rule states WHO acts (roles), WHAT kind it is, and WHY.
 */

export type TaskKind = 'action' | 'recommendation' | 'insight';
export type TaskSeverity = 'blocking' | 'attention' | 'info';

export interface DerivedTask {
  id: string;
  kind: TaskKind;
  severity: TaskSeverity;
  /** Where in the hierarchy the work sits. */
  level: 'media-plan' | 'campaign' | 'booking';
  entityId: string;
  mediaPlanId: string;
  engine?: EngineId;
  title: string;
  detail: string;
  /** Which side acts on it; personaKeys narrows to specific roles when set. */
  side: UserSide | 'both';
  personaKeys?: string[];
}

/** All derived to-dos for the whole database, most severe first. */
export function deriveTasks(db: DbData): DerivedTask[] {
  const tasks: DerivedTask[] = [];

  for (const plan of db.mediaPlans) {
    const campaigns = db.campaigns.filter((c) => c.mediaPlanId === plan.id);
    const live = plan.status === 'running';

    // ── Plan-level rules ─────────────────────────────────────────────
    if (plan.budget <= 0) {
      tasks.push({
        id: `${plan.id}-budget`, kind: 'action', severity: 'blocking', level: 'media-plan',
        entityId: plan.id, mediaPlanId: plan.id,
        title: 'Set a budget', detail: `"${plan.name}" has no budget — campaigns cannot be planned without one.`,
        side: 'both', personaKeys: ['campaign-builder', 'media-agency-advertiser'],
      });
    }
    if (campaigns.length === 0) {
      tasks.push({
        id: `${plan.id}-campaigns`, kind: 'action', severity: 'attention', level: 'media-plan',
        entityId: plan.id, mediaPlanId: plan.id,
        title: 'Add campaigns', detail: `"${plan.name}" has no campaigns yet — add at least one proposition.`,
        side: 'both', personaKeys: ['campaign-builder', 'media-agency-advertiser'],
      });
    }
    const spend = campaigns.reduce((s, c) => s + c.spend, 0);
    if (live && plan.budget > 0 && spend / plan.budget >= 0.9) {
      tasks.push({
        id: `${plan.id}-pacing`, kind: 'action', severity: 'blocking', level: 'media-plan',
        entityId: plan.id, mediaPlanId: plan.id,
        title: 'Review budget pacing', detail: `"${plan.name}" has spent ${Math.round((spend / plan.budget) * 100)}% of its budget — review pacing to avoid early depletion.`,
        side: 'retailer', personaKeys: ['campaign-manager-managed', 'yield-manager'],
      });
    }

    // ── Campaign-level rules ─────────────────────────────────────────
    for (const campaign of campaigns) {
      const bookings = db.bookings.filter((b) => b.campaignId === campaign.id);

      if (bookings.length === 0 && campaign.status !== 'completed') {
        tasks.push({
          id: `${campaign.id}-bookings`, kind: 'action', severity: live ? 'blocking' : 'attention',
          level: 'campaign', entityId: campaign.id, mediaPlanId: plan.id, engine: campaign.engine,
          title: 'Add bookings', detail: `"${campaign.name}" has no bookings — nothing can deliver on this proposition.`,
          side: 'both', personaKeys: ['campaign-builder', 'media-agency-advertiser'],
        });
      }

      // ── Booking-level rules ────────────────────────────────────────
      for (const booking of bookings) {
        if (booking.creativeStatus === 'missing' && booking.status !== 'completed') {
          tasks.push({
            id: `${booking.id}-creative`, kind: 'action', severity: 'blocking',
            level: 'booking', entityId: booking.id, mediaPlanId: plan.id, engine: campaign.engine,
            // Advertisers supply creatives; campaign builders chase them on
            // managed campaigns — both sides see this to-do.
            title: 'Upload creative', detail: `"${booking.name}" has no creative — it cannot go live without one.`,
            side: 'both', personaKeys: ['media-agency-advertiser', 'campaign-builder'],
          });
        }
        if (booking.creativeStatus === 'submitted' && booking.status !== 'completed') {
          tasks.push({
            id: `${booking.id}-approve`, kind: 'action', severity: 'attention',
            level: 'booking', entityId: booking.id, mediaPlanId: plan.id, engine: campaign.engine,
            title: 'Approve creative', detail: `The creative for "${booking.name}" awaits approval.`,
            side: 'retailer', personaKeys: ['campaign-manager-managed', 'self-service-support-specialist'],
          });
        }
        if (booking.positionIds.length === 0 && booking.status !== 'completed') {
          tasks.push({
            id: `${booking.id}-placement`, kind: 'action', severity: 'blocking',
            level: 'booking', entityId: booking.id, mediaPlanId: plan.id, engine: campaign.engine,
            title: 'Choose a placement', detail: `"${booking.name}" has no position selected — pick a media product and position.`,
            side: 'both', personaKeys: ['campaign-builder', 'media-agency-advertiser'],
          });
        }
      }
    }
  }

  const order: Record<TaskSeverity, number> = { blocking: 0, attention: 1, info: 2 };
  return tasks.sort((a, b) => order[a.severity] - order[b.severity]);
}

/** Derived to-dos for one media plan (the plan and everything under it). */
export function deriveTasksForPlan(db: DbData, planId: string): DerivedTask[] {
  return deriveTasks(db).filter((t) => t.mediaPlanId === planId);
}

/** Derived to-dos for one campaign — its own plus its bookings'. */
export function deriveTasksForCampaign(db: DbData, campaignId: string): DerivedTask[] {
  const bookingIds = db.bookings.filter((b) => b.campaignId === campaignId).map((b) => b.id);
  return deriveTasks(db).filter(
    (t) =>
      (t.level === 'campaign' && t.entityId === campaignId) ||
      (t.level === 'booking' && bookingIds.includes(t.entityId)),
  );
}

/**
 * Derived to-dos for one engine — everything outstanding on that proposition's
 * campaigns and bookings, which is what the engine campaign-overview page shows.
 * Pass 'all' for the cross-engine overview.
 */
export function deriveTasksForEngine(db: DbData, engine: EngineId | 'all'): DerivedTask[] {
  const tasks = deriveTasks(db).filter((t) => t.engine !== undefined);
  return engine === 'all' ? tasks : tasks.filter((t) => t.engine === engine);
}

/** Derived to-dos for one booking. */
export function deriveTasksForBooking(db: DbData, bookingId: string): DerivedTask[] {
  return deriveTasks(db).filter((t) => t.level === 'booking' && t.entityId === bookingId);
}

/** Derived to-dos for a user, scoped by their side/persona. */
export function deriveTasksForUser(db: DbData, personaKey: string, side: UserSide): DerivedTask[] {
  return deriveTasks(db).filter(
    (t) =>
      (t.side === 'both' || t.side === side) &&
      (!t.personaKeys || t.personaKeys.includes(personaKey)),
  );
}

export type PlanHealthLevel = 'good' | 'attention' | 'risk';

/**
 * The media-plan health check, derived from the same to-dos so health and
 * tasks can never disagree: red when a LIVE plan has blocking work (or pacing
 * risk), amber when open work exists, green when nothing stands in the way.
 */
export function derivePlanHealth(db: DbData, plan: MediaPlan): { level: PlanHealthLevel; message: string } {
  const tasks = deriveTasksForPlan(db, plan.id);
  const blocking = tasks.filter((t) => t.severity === 'blocking');
  const live = plan.status === 'running';

  if (blocking.length > 0 && live) {
    return {
      level: 'risk',
      message: `"${plan.name}" is live with ${blocking.length} blocking issue${blocking.length === 1 ? '' : 's'} — ${blocking[0].title.toLowerCase()} first.`,
    };
  }
  if (blocking.length > 0) {
    return {
      level: 'attention',
      message: `"${plan.name}" has ${blocking.length} blocker${blocking.length === 1 ? '' : 's'} before it can go live.`,
    };
  }
  if (tasks.length > 0) {
    return {
      level: 'attention',
      message: `"${plan.name}" has ${tasks.length} open task${tasks.length === 1 ? '' : 's'}.`,
    };
  }
  return { level: 'good', message: `"${plan.name}" is healthy — no open tasks, pacing on track.` };
}
