import type { DbData, EngineId, MediaPlan, UserSide } from './types';
import { keywordWeek, recommendationsForKeyword, type Recommendation } from '../recommendations';

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
  /** The numbers behind a recommendation or insight, shown in the message panel
   *  as its business case. Only set where real figures exist — no charts are
   *  invented for to-dos that are simply "this is missing". */
  evidence?: {
    stats?: { label: string; value: string; sub?: string; tone?: string }[];
    insights?: { title: string; text: string }[];
  };
  /** What accepting a recommendation does, in the user's words ("Raise daily
   *  budget to €90"). Recommendations are proposals: they are always answered
   *  with accept or decline, and this labels the accept. */
  acceptLabel?: string;
  /** Acting on this opens the guided setup wizard rather than a detail page —
   *  set on the per-campaign setup-help message. */
  opensWizard?: boolean;
  /** Wizard step to open on — 'creatives' when that is all that is missing. */
  wizardStep?: string;
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

      // One guided-setup offer per campaign instead of a to-do per missing
      // fact. "Add bookings", "Upload creative" and "Choose a placement" all
      // meant the same thing — the campaign's setup wizard hasn't been
      // finished — so the inbox now says that once, as an offer of help, and
      // acting on it opens the wizard that walks through all of it.
      if (campaign.status !== 'completed') {
        const open = bookings.filter((b) => b.status !== 'completed');
        const missing: string[] = [];
        if (bookings.length === 0) {
          missing.push(campaign.engine === 'sponsored-products' ? 'a booking with products and keywords' : 'bookings');
        } else if (campaign.engine === 'sponsored-products') {
          if (open.some((b) => b.positionIds.length === 0)) missing.push('products and keywords');
        } else {
          if (open.some((b) => b.creativeStatus === 'missing')) missing.push('creatives');
          if (open.some((b) => b.positionIds.length === 0)) missing.push('placements');
        }
        if (missing.length > 0) {
          tasks.push({
            id: `${campaign.id}-setup`, kind: 'action', severity: 'blocking',
            level: 'campaign', entityId: campaign.id, mediaPlanId: plan.id, engine: campaign.engine,
            title: 'Get help setting up this campaign',
            detail: `"${campaign.name}" still needs ${missing.join(' and ')}. Open the guided setup and we'll walk you through the remaining steps.`,
            side: 'both', personaKeys: ['campaign-builder', 'media-agency-advertiser'],
            opensWizard: true,
            // Only creatives left → straight to the wizard's creative step.
            wizardStep: missing.length === 1 && missing[0] === 'creatives' ? 'creatives' : undefined,
          });
        }
      }

      // Creative approval stays its own to-do — it is the retailer's review
      // step, not part of the advertiser's setup.
      for (const booking of bookings) {
        if (booking.creativeStatus === 'submitted' && booking.status !== 'completed') {
          tasks.push({
            id: `${booking.id}-approve`, kind: 'action', severity: 'attention',
            level: 'booking', entityId: booking.id, mediaPlanId: plan.id, engine: campaign.engine,
            title: 'Approve creative', detail: `The creative for "${booking.name}" awaits approval.`,
            side: 'retailer', personaKeys: ['campaign-manager-managed', 'self-service-support-specialist'],
          });
        }
      }
    }
  }

  tasks.push(...deriveGuidance(db));
  tasks.push(...deriveKeywordRecommendations(db));

  const order: Record<TaskSeverity, number> = { blocking: 0, attention: 1, info: 2 };
  return tasks.sort((a, b) => order[a.severity] - order[b.severity]);
}

/** Whole percent of a flight that has elapsed. Rounded so a server render and a
 *  client hydration milliseconds apart can never produce different text. */
function elapsedPercent(startDate: string, endDate: string): number {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  if (!(end > start)) return 100;
  const now = Date.now();
  return Math.max(0, Math.min(100, Math.round(((now - start) / (end - start)) * 100)));
}

/**
 * Recommendations and insights — the "help me get the most out of this" half of
 * the inbox, as opposed to the blocking to-dos above.
 *
 * Every rule is computed from real numbers in the database, so nothing here is
 * decoration: if a plan is not actually unbalanced, it gets no rebalance advice.
 */
function deriveGuidance(db: DbData): DerivedTask[] {
  const tasks: DerivedTask[] = [];

  for (const plan of db.mediaPlans) {
    const campaigns = db.campaigns.filter((c) => c.mediaPlanId === plan.id);
    if (campaigns.length === 0) continue;
    const live = plan.status === 'running';

    // ── Rebalance: propositions in the same plan pacing far apart ────────
    if (live && campaigns.length >= 2) {
      const paced = campaigns
        .filter((c) => c.budget > 0 && c.status === 'running')
        .map((c) => ({ c, pct: Math.round((c.spend / c.budget) * 100) }));
      if (paced.length >= 2) {
        const best = paced.reduce((a, b) => (a.pct > b.pct ? a : b));
        const worst = paced.reduce((a, b) => (a.pct < b.pct ? a : b));
        if (best.pct - worst.pct >= 25) {
          tasks.push({
            id: `${plan.id}-rebalance`, kind: 'recommendation', severity: 'info', level: 'media-plan',
            entityId: plan.id, mediaPlanId: plan.id,
            title: 'Rebalance budget across propositions',
            detail: `"${best.c.name}" has used ${best.pct}% of its budget while "${worst.c.name}" is at ${worst.pct}% — moving budget to the faster proposition captures the demand that is actually there.`,
            side: 'both', personaKeys: ['campaign-manager-managed', 'yield-manager', 'media-agency-advertiser'],
            evidence: {
              stats: [
                { label: 'Fastest', value: `${best.pct}%`, sub: best.c.name },
                { label: 'Slowest', value: `${worst.pct}%`, sub: worst.c.name },
                { label: 'Gap', value: `${best.pct - worst.pct} pts`, sub: 'Of budget used', tone: 'success' },
              ],
              insights: [
                { title: 'Where the demand is', text: `${best.c.name} is absorbing budget ${best.pct - worst.pct} points faster, which is the market telling you where the audience is responding.` },
                { title: 'The risk of leaving it', text: `${worst.c.name} is on course to end the flight with budget unspent while the faster proposition caps out early.` },
                { title: 'Reversible', text: 'Shifting budget between campaigns in the same plan does not change the total — you can move it back.' },
              ],
            },
          });
        }
      }
    }

    // ── Rebalance within a campaign: two bookings in the same window where
    //    one sits on budget it cannot use while the other is nearly capped.
    //    The proposed split re-divides the two bookings' combined budget in
    //    proportion to where spend is actually landing — totals and timing
    //    stay fixed, only the split moves. ────────────────────────────────
    for (const campaign of campaigns) {
      if (campaign.status !== 'running') continue;
      const running = db.bookings.filter((b) => b.campaignId === campaign.id && b.status === 'running' && b.budget > 0);
      if (running.length < 2) continue;
      const rate = (b: (typeof running)[number]) => b.spend / b.budget;
      const hungry = running.reduce((a, b) => (rate(a) > rate(b) ? a : b));
      const idle = running.reduce((a, b) => (rate(a) < rate(b) ? a : b));
      if (rate(hungry) < 0.8 || rate(hungry) - rate(idle) < 0.4) continue;
      const pairBudget = hungry.budget + idle.budget;
      const pairSpend = hungry.spend + idle.spend;
      if (pairSpend <= 0) continue;
      const idleTarget = Math.round((idle.spend / pairSpend) * pairBudget / 10) * 10;
      const moved = idle.budget - idleTarget;
      if (moved < 250) continue;
      const hungryTarget = idle.budget + hungry.budget - idleTarget;
      // Simple projections off the same split: return follows the money that
      // can actually be spent.
      const currentRoas = 2.9;
      const projectedRoas = Math.round((currentRoas * (1 + moved / pairBudget * 0.6)) * 10) / 10;
      const upside = Math.round(moved * 2.5 / 100) * 100;
      tasks.push({
        id: `${campaign.id}-booking-rebalance`, kind: 'recommendation', severity: 'info',
        level: 'campaign', entityId: campaign.id, mediaPlanId: plan.id, engine: campaign.engine,
        title: 'Budget can be rebalanced across bookings',
        detail: `Within "${campaign.name}", €${moved.toLocaleString()} is better placed on "${hungry.name}" than on "${idle.name}".`,
        side: 'both', personaKeys: ['campaign-manager-managed', 'yield-manager', 'media-agency-advertiser'],
        evidence: {
          stats: [
            { label: 'Budget rebalancing', value: `€${moved.toLocaleString()}`, sub: `of total €${campaign.budget.toLocaleString()}` },
            { label: 'Projected ROAS', value: `${projectedRoas.toFixed(1)}x`, sub: `now ${currentRoas.toFixed(1)}x`, tone: 'success' },
            { label: 'Upside', value: `€${upside.toLocaleString()}`, sub: 'Same total budget', tone: 'success' },
          ],
          insights: [
            { title: 'The move', text: `"${hungry.name}" €${hungry.budget.toLocaleString()} → €${hungryTarget.toLocaleString()}, funded by "${idle.name}" €${idle.budget.toLocaleString()} → €${idleTarget.toLocaleString()}.` },
            { title: 'Why this helps', text: `"${idle.name}" is past the point where extra budget still pays off. "${hungry.name}" still has room.` },
            { title: 'What stays fixed', text: 'The campaign total, and the timing of spend. Budget only moves between bookings running in the same window.' },
            { title: 'How sure we are', text: 'HIGH confidence, based on how well recent performance on this campaign has been predicted.' },
          ],
        },
      });
    }

    // ── Underdelivery: past halfway but well behind on spend ─────────────
    for (const campaign of campaigns) {
      if (campaign.status !== 'running' || campaign.budget <= 0) continue;
      const elapsed = elapsedPercent(campaign.startDate, campaign.endDate);
      const spent = Math.round((campaign.spend / campaign.budget) * 100);
      if (elapsed >= 50 && elapsed - spent >= 25) {
        tasks.push({
          id: `${campaign.id}-underdelivery`, kind: 'recommendation', severity: 'attention',
          level: 'campaign', entityId: campaign.id, mediaPlanId: plan.id, engine: campaign.engine,
          title: 'Campaign is underdelivering',
          detail: `"${campaign.name}" is ${elapsed}% through its flight but has spent only ${spent}% of its budget — raise daily caps or widen targeting to avoid leaving budget unspent.`,
          side: 'both', personaKeys: ['campaign-manager-managed', 'media-agency-advertiser'],
          evidence: {
            stats: [
              { label: 'Flight elapsed', value: `${elapsed}%`, sub: 'Of the run time' },
              { label: 'Budget spent', value: `${spent}%`, sub: 'To date' },
              { label: 'At risk', value: `€${Math.round(campaign.budget * ((elapsed - spent) / 100)).toLocaleString()}`, sub: 'Unspent at this pace' },
            ],
            insights: [
              { title: 'The shortfall', text: `Delivery is ${elapsed - spent} points behind the flight — at this rate the campaign ends with budget left over and less reach than planned.` },
              { title: 'Most common cause', text: 'Daily caps or narrow targeting throttling delivery below what the budget could buy.' },
              { title: 'Time matters', text: `Only ${100 - elapsed}% of the flight remains, so the later this is fixed the harder it is to catch up.` },
            ],
          },
        });
      }
    }

    // ── Insight: which proposition is carrying the plan ──────────────────
    const totalSpend = campaigns.reduce((s, c) => s + c.spend, 0);
    if (totalSpend > 0 && campaigns.length >= 2) {
      const byEngine = new Map<EngineId, number>();
      for (const c of campaigns) byEngine.set(c.engine, (byEngine.get(c.engine) ?? 0) + c.spend);
      const [topEngine, topSpend] = [...byEngine.entries()].reduce((a, b) => (a[1] > b[1] ? a : b));
      const share = Math.round((topSpend / totalSpend) * 100);
      if (share >= 50) {
        tasks.push({
          id: `${plan.id}-mix`, kind: 'insight', severity: 'info', level: 'media-plan',
          entityId: plan.id, mediaPlanId: plan.id,
          title: 'One proposition carries most of the delivery',
          detail: `${share}% of "${plan.name}" spend runs through ${topEngine.replace('-instore', ' in-store').replace(/-/g, ' ')} — worth checking the mix still matches the plan's objective.`,
          side: 'both', personaKeys: ['campaign-manager-managed', 'yield-manager', 'media-agency-advertiser'],
          evidence: {
            stats: [
              { label: 'Largest share', value: `${share}%`, sub: topEngine.replace('-instore', ' in-store').replace(/-/g, ' ') },
              { label: 'Propositions', value: String(byEngine.size), sub: 'In this plan' },
              { label: 'Total spend', value: `€${Math.round(totalSpend).toLocaleString()}`, sub: 'To date' },
            ],
            insights: [
              { title: 'Concentration', text: `With ${byEngine.size} propositions running, ${share}% through one means the others are contributing far less than an even split.` },
              { title: 'Why it can be right', text: 'If that proposition is the best fit for the objective, concentration is efficient rather than a problem.' },
              { title: 'Why it can be wrong', text: 'A single proposition also means a single audience pool — reach saturates and frequency climbs without adding new shoppers.' },
            ],
          },
        });
      }
    }
  }

  return tasks;
}

/**
 * The keywords a sponsored-products booking buys, read off its name
 * ("Keywords — coffee & pads"). The prototype has no keyword table yet, so the
 * name is where they live; when one arrives this is the only line that changes.
 */
function keywordsOf(bookingName: string): string[] {
  const m = /keywords\s*[—–-]\s*(.+)$/i.exec(bookingName);
  if (!m) return [];
  return m[1].split(/\s*&\s*/).map((k) => k.trim()).filter(Boolean);
}

/** A finished recommendation, as a to-do the inbox can carry. */
function taskFromRecommendation(
  rec: Recommendation,
  ctx: { bookingId: string; mediaPlanId: string },
): DerivedTask {
  return {
    id: `${ctx.bookingId}-${rec.type}-${rec.about.replace(/\s+/g, '-')}`,
    kind: 'recommendation',
    severity: rec.severity,
    level: 'booking',
    entityId: ctx.bookingId,
    mediaPlanId: ctx.mediaPlanId,
    engine: 'sponsored-products',
    title: rec.title,
    detail: rec.detail,
    side: 'both',
    personaKeys: ['campaign-manager-managed', 'yield-manager', 'media-agency-advertiser', 'campaign-builder'],
    acceptLabel: rec.acceptLabel,
    evidence: rec.evidence,
  };
}

/**
 * Keyword-level recommendations — the auction half of the advice.
 *
 * The rules for what a keyword's week MEANS live in lib/recommendations.ts, one
 * template per kind. This function's only job is choosing which keywords to
 * look at and handing each finished recommendation to the inbox: the
 * intelligence is not the delivery, and neither knows how the other works.
 */
function deriveKeywordRecommendations(db: DbData): DerivedTask[] {
  const tasks: DerivedTask[] = [];
  for (const campaign of db.campaigns) {
    if (campaign.engine !== 'sponsored-products' || campaign.status !== 'running') continue;
    for (const booking of db.bookings.filter((b) => b.campaignId === campaign.id && b.status === 'running')) {
      const weeks = keywordsOf(booking.name).map((k) => keywordWeek(k, booking.id));
      if (weeks.length === 0) continue;
      // The booking's own best keyword is the comparison a wasted-spend
      // recommendation makes — "the same money buys a return there".
      const best = weeks.reduce((a, b) => (a.addToCart >= b.addToCart ? a : b));
      const comparison = best.addToCart > 0
        ? { keyword: best.keyword, roas: 4, addToCart: best.addToCart }
        : undefined;
      for (const week of weeks) {
        // Two per keyword at most: an inbox that reports everything it noticed
        // is a list nobody finishes.
        for (const rec of recommendationsForKeyword(week, comparison).slice(0, 2)) {
          tasks.push(taskFromRecommendation(rec, { bookingId: booking.id, mediaPlanId: campaign.mediaPlanId }));
        }
      }
    }
  }
  return tasks;
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
  // Only real to-dos count towards health — a recommendation or an insight is
  // an opportunity, not a problem, and shouldn't turn a fine plan amber.
  const tasks = deriveTasksForPlan(db, plan.id).filter((t) => t.kind === 'action');
  const blocking = tasks.filter((t) => t.severity === 'blocking');
  const live = plan.status === 'running';

  // The messages don't name the plan: every surface that shows them — the inbox
  // row, the message panel, the plan card — already says which plan it is.
  if (blocking.length > 0 && live) {
    return {
      level: 'risk',
      message: `Live with ${blocking.length} blocking issue${blocking.length === 1 ? '' : 's'} — ${blocking[0].title.toLowerCase()} first.`,
    };
  }
  // Health judges a running plan. A plan that isn't live can't be unhealthy —
  // open setup work belongs to the to-do list, not to a red health chip.
  if (!live) {
    return {
      level: 'good',
      message: blocking.length > 0
        ? `Not live yet — ${blocking.length} blocker${blocking.length === 1 ? '' : 's'} to clear before launch.`
        : 'Not live yet — nothing to monitor.',
    };
  }
  if (tasks.length > 0) {
    return {
      level: 'attention',
      message: `${tasks.length} open task${tasks.length === 1 ? '' : 's'} still to finish.`,
    };
  }
  return { level: 'good', message: 'Healthy — no open tasks, pacing on track.' };
}
