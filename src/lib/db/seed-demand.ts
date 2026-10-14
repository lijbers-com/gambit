import type { Booking, Campaign, DbData, EngineId, MediaPlan } from './types';
import { mondaysBetween, positionWeek, weeklyCapacity } from './inventory';
import { PROTOTYPE_TODAY } from '../clock';

/**
 * The rest of the market — the advertisers' bookings beyond the hand-written
 * demo stories, so AH's network is as busy as a retail media network is.
 *
 * Generated, but generated deterministically (a fixed seed per position) and
 * by the same rules as everything else: every booking sits on a real
 * position, is sized against that position's capacity at its own price, and
 * belongs to a campaign under a media plan of a real advertiser and brand.
 * Its status and spend follow from the prototype's today: flights that ended
 * are completed and fully spent, flights under way are live and on pace,
 * flights ahead are in review — most already approved.
 *
 * Fill lands around 60–80% of the network, busier in summer and Q4, quieter
 * in January and February. The hand-written seed stays on top of it.
 */

const YEAR_FROM = '2026-01-05';
const YEAR_TO = '2026-12-27';
const DAY = 86_400_000;
const toDay = (iso: string) => Date.parse(iso + 'T00:00:00Z');
const iso = (ms: number) => new Date(ms).toISOString().slice(0, 10);
const addDays = (d: string, n: number) => iso(toDay(d) + n * DAY);

/** A small seeded generator (mulberry32) — the same world on every load. */
function rng(seed: string) {
  let h = 1779033703;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 3432918353);
  let a = h >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** How much of a position the market takes in a week of the year. */
function seasonOf(monday: string): number {
  const m = Number(monday.slice(5, 7));
  if (m <= 2) return 0.5;          // January–February: quiet
  if (m >= 6 && m <= 8) return 0.8; // summer
  if (m >= 10) return 0.85;         // Q4
  return 0.68;
}

const ENGINE_NAME: Record<EngineId, string> = {
  display: 'Display',
  'sponsored-products': 'Sponsored products',
  'digital-instore': 'Digital in-store',
  'offline-instore': 'Offline in-store',
  offsite: 'Offsite',
};

const GOALS = ['awareness', 'consideration', 'purchase', 'loyalty'];
const quarterOf = (d: string) => Math.floor((Number(d.slice(5, 7)) - 1) / 3) + 1;

export function withMarketDemand(db: DbData): DbData {
  const now = `${PROTOTYPE_TODAY}T00:00:00.000Z`;
  const brands = db.advertisers.flatMap((a) => a.brands.map((b) => ({ advertiserId: a.id, brandId: b.id, brand: b.name })));
  const plans = new Map<string, MediaPlan>();
  const campaigns = new Map<string, Campaign>();
  const bookings: Booking[] = [];
  let planN = 100;
  let campaignN = 200;
  let bookingN = 300;

  // What a flight books: one position — or, on in-store screens, a whole
  // screen group (placement), since AH sells the players of a group as one
  // package (a take-over is its three screens).
  const units = db.positions.flatMap((position) => {
    const engine = db.mediaProducts.find((m) => m.id === position.mediaProductId)?.engine;
    if (engine !== 'digital-instore') return [{ position, positions: [position] }];
    const group = db.positions.filter((p) => p.placementId === position.placementId);
    return group[0].id === position.id ? [{ position, positions: group }] : [];
  });

  for (const { position, positions: unitPositions } of units) {
    const product = db.mediaProducts.find((m) => m.id === position.mediaProductId);
    if (!product || product.status === 'archived' || product.status === 'draft') continue;
    const engine = product.engine;
    const price = position.listPrice ?? product.listPrice;
    if (!price) continue;
    const r = rng(position.id);
    const capacity = unitPositions.reduce((n, p) => n + weeklyCapacity(db, p), 0);
    let cursor = addDays(YEAR_FROM, Math.floor(r() * 3) * 7);

    while (cursor < YEAR_TO) {
      const weeks = 8 + Math.floor(r() * 6);          // 8–13 week flights
      const start = cursor;
      const end = addDays(start, weeks * 7 - 1);
      if (end > YEAR_TO) break;
      // What the hand-written bookings already take of these weeks stays
      // theirs; the market fills up to the season's level around it.
      const flightWeeks = mondaysBetween(start, end);
      const taken = flightWeeks.reduce((n, m) => n + unitPositions.reduce((f, p) => f + positionWeek(db, p, m).fill, 0) / unitPositions.length, 0) / Math.max(1, flightWeeks.length);
      const share = Math.min(0.95, seasonOf(start) * (0.9 + r() * 0.25)) - taken;
      if (share < 0.1) { cursor = addDays(end, 1); continue; }

      // The volume the flight takes, in the proposition's unit, and the
      // budget that buys it at the position's price.
      let budget: number;
      if (engine === 'offline-instore') {
        budget = Math.round(position.stores! * share) * price;                    // per store, whole run
      } else if (product.pricingBasis === 'cpc') {
        const clicks = engine === 'sponsored-products' ? capacity * weeks * share : capacity * weeks * share * 0.01;
        budget = clicks * price;
      } else {
        budget = ((capacity * weeks * share) / 1000) * price;                   // CPM
      }
      budget = Math.max(500, Math.round(budget / 50) * 50);

      const pick = brands[Math.floor(r() * brands.length)];
      const q = quarterOf(start);
      const planKey = `${pick.brandId}-Q${q}`;
      if (!plans.has(planKey)) {
        planN += 1;
        plans.set(planKey, {
          id: `MP-${planN}`, name: `${pick.brand} Q${q} 2026`, poNumber: `PO-2026-${planN}`,
          advertiserId: pick.advertiserId, brandIds: [pick.brandId], status: 'running',
          goal: GOALS[planN % GOALS.length], kpis: [], budget: 0,
          startDate: start, endDate: end, createdBy: planN % 2 ? 'u-campaign-manager' : 'u-campaign-builder',
          createdAt: now, updatedAt: now,
        });
      }
      const plan = plans.get(planKey)!;
      const campaignKey = `${planKey}-${engine}`;
      if (!campaigns.has(campaignKey)) {
        campaignN += 1;
        campaigns.set(campaignKey, {
          id: `C-${campaignN}`, mediaPlanId: plan.id, name: `${pick.brand} Q${q} — ${ENGINE_NAME[engine]}`,
          engine, status: 'running', budget: 0, spend: 0, startDate: start, endDate: end,
          // Display is sold both ways; the rest buys the way its proposition sells.
          ...(engine === 'display' ? { buyingType: campaignN % 2 ? 'guaranteed' as const : 'auction' as const } : {}),
          createdAt: now, updatedAt: now,
        });
      }
      const campaign = campaigns.get(campaignKey)!;

      // Status and spend as of today.
      const today = PROTOTYPE_TODAY;
      const days = (toDay(end) - toDay(start)) / DAY + 1;
      let status: Booking['status'];
      let spend: number;
      let approvedAt: string | undefined;
      if (end < today) {
        status = 'completed';
        spend = Math.round(budget * (0.96 + r() * 0.04));
      } else if (start <= today) {
        status = 'running';
        const elapsed = ((toDay(today) - toDay(start)) / DAY + 1) / days;
        spend = Math.min(budget, Math.round(budget * elapsed * (0.97 + r() * 0.06)));
      } else {
        status = 'in-option';
        spend = 0;
        if (r() < 0.85) approvedAt = iso(toDay(today) - Math.floor(r() * 10) * DAY) + 'T09:00:00.000Z';
      }
      bookingN += 1;
      bookings.push({
        id: `B-${bookingN}`, campaignId: campaign.id, name: `${unitPositions.length > 1 ? db.placements.find((x) => x.id === position.placementId)?.name ?? position.name : position.name} — ${pick.brand}`,
        status, budget, spend, startDate: start, endDate: end, positionIds: unitPositions.map((p) => p.id),
        creativeStatus: 'approved', ...(approvedAt ? { approvedAt } : {}),
        createdAt: now, updatedAt: now,
      });
      if (start < campaign.startDate) campaign.startDate = start;
      if (end > campaign.endDate) campaign.endDate = end;
      if (start < plan.startDate) plan.startDate = start;
      if (end > plan.endDate) plan.endDate = end;

      cursor = addDays(end, 1 + Math.floor(r() * 3) * 7);   // 0–2 weeks between flights
    }
  }

  // A campaign's and a plan's status follow their bookings.
  const statusOf = (list: Booking[]): Booking['status'] =>
    list.every((b) => b.status === 'completed') ? 'completed'
      : list.some((b) => b.status === 'running') ? 'running'
        : list.every((b) => b.status === 'in-option') ? 'in-option' : 'running';
  // Ahead of its flight, a campaign or plan whose bookings are all approved
  // is approved itself — waiting to go live, not waiting for anyone.
  const approvedOf = (list: Booking[]) =>
    list.length && list.every((b) => b.status === 'in-option') && list.every((b) => b.approvedAt)
      ? list.map((b) => b.approvedAt!).sort().at(-1)
      : undefined;
  for (const c of campaigns.values()) {
    const own = bookings.filter((b) => b.campaignId === c.id);
    c.status = statusOf(own);
    const at = approvedOf(own);
    if (at) c.approvedAt = at;
  }
  for (const p of plans.values()) {
    const own = [...campaigns.values()].filter((c) => c.mediaPlanId === p.id);
    const list = bookings.filter((b) => own.some((c) => c.id === b.campaignId));
    p.status = statusOf(list);
    const at = approvedOf(list);
    if (at) p.approvedAt = at;
  }

  return {
    ...db,
    // Behind the hand-written stories: lists read newest-first, so the
    // demo's own plans and campaigns stay on top.
    mediaPlans: [...plans.values(), ...db.mediaPlans],
    campaigns: [...campaigns.values(), ...db.campaigns],
    bookings: [...bookings, ...db.bookings],
  };
}
