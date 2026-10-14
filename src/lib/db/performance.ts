import type { Booking, Campaign, DbData, EngineId, MediaPlan } from './types';
import { bookingListPrice, productForBooking } from './guaranteed';
import { bookingLoad, positionWeek, mondayOf, mondaysBetween } from './inventory';
import { PROTOTYPE_TODAY } from '../clock';

/**
 * Performance — what the bookings delivered, the one source for every
 * insight, metric card and report.
 *
 * Nothing here is seeded per page. A booking's actuals follow from what it
 * spent up to the prototype's today, at the price it pays on its positions,
 * through ONE table of delivery rates per proposition (below). Every
 * roll-up — a campaign, a media plan, a proposition, an advertiser, a
 * retail product, a placement, a week — is the sum of its bookings, so the
 * plan's ROAS, the campaign's and the insights dashboard's agree, and a
 * filter narrows the numbers instead of rescaling an illustration.
 *
 * The rates stand in for the ad server and the loyalty-card attribution
 * until those report; each booking varies a little around them (a fixed
 * per-booking factor) so bookings do not all read the same.
 */

// ── Delivery rates ──────────────────────────────────────────────────────

export interface DeliveryRates {
  /** Clicks per impression (where there is something to click). */
  ctr: number;
  /** Purchases per click — click-bought propositions (Sponsored Products, Demand Gen). */
  cvr: number;
  /** Purchases per thousand impressions — view-attributed, everything else. */
  conversionsPerMille: number;
  /** Basket value a purchase is attributed, €. */
  orderValue: number;
  /** Impressions per shopper reached. */
  frequency: number;
  /** Share of impressions in view. */
  viewability: number;
  /** Share of the attributed sales that would not have happened without the ad. */
  incrementalShare: number;
  /** Share of buyers new to the brand. */
  newToBrandShare: number;
  /** Units per purchase. */
  unitsPerOrder: number;
  /** Share of attributed purchases made online (ah.nl, app); the rest in store. */
  onlineShare: number;
  /** Digital in-store: shoppers in view of one play. */
  viewersPerPlay?: number;
  /** Offline in-store: AH prices print on reach at this base CPM. */
  reachCpm?: number;
}

export const DELIVERY_RATES: Record<EngineId, DeliveryRates> = {
  display:              { ctr: 0.008, cvr: 0.06, conversionsPerMille: 2.5, orderValue: 23, frequency: 4.2, viewability: 0.86, incrementalShare: 0.55, newToBrandShare: 0.28, unitsPerOrder: 1.8, onlineShare: 0.6 },
  'sponsored-products': { ctr: 0.023, cvr: 0.12, conversionsPerMille: 0,   orderValue: 23, frequency: 2.1, viewability: 1,    incrementalShare: 0.5,  newToBrandShare: 0.22, unitsPerOrder: 1.6, onlineShare: 0.7 },
  'digital-instore':    { ctr: 0,     cvr: 0,    conversionsPerMille: 1.4, orderValue: 22, frequency: 3.0, viewability: 1,    incrementalShare: 0.6,  newToBrandShare: 0.25, unitsPerOrder: 1.5, onlineShare: 0.2, viewersPerPlay: 8 },
  'offline-instore':    { ctr: 0,     cvr: 0,    conversionsPerMille: 2.0, orderValue: 30, frequency: 2.6, viewability: 1,    incrementalShare: 0.6,  newToBrandShare: 0.2,  unitsPerOrder: 1.7, onlineShare: 0.1, reachCpm: 17 },
  offsite:              { ctr: 0.004, cvr: 0.2,  conversionsPerMille: 1.1, orderValue: 25, frequency: 3.5, viewability: 0.72, incrementalShare: 0.7,  newToBrandShare: 0.4,  unitsPerOrder: 1.4, onlineShare: 0.5 },
};

/** What the retailer holds each proposition to — the "vs. target" on a card. */
export const BENCHMARKS: Record<EngineId, { roas: number; ctr: number; cpc: number; viewability: number; frequency: number; iroas: number }> = {
  display:              { roas: 2.8, ctr: 0.007, cpc: 2.5,  viewability: 0.8, frequency: 4, iroas: 1.5 },
  'sponsored-products': { roas: 3.5, ctr: 0.021, cpc: 0.65, viewability: 1,   frequency: 2, iroas: 1.8 },
  'digital-instore':    { roas: 2.6, ctr: 0,     cpc: 0,    viewability: 1,   frequency: 3, iroas: 1.6 },
  'offline-instore':    { roas: 3.0, ctr: 0,     cpc: 0,    viewability: 1,   frequency: 3, iroas: 1.8 },
  offsite:              { roas: 2.2, ctr: 0.0035, cpc: 2.5, viewability: 0.7, frequency: 4, iroas: 1.4 },
};

// ── Totals ──────────────────────────────────────────────────────────────

/** Volumes add up; every rate is derived from them (see ratesOf). */
export interface Totals {
  spend: number;
  budget: number;
  impressions: number;
  viewableImpressions: number;
  clicks: number;
  conversions: number;
  units: number;
  sales: number;
  incrementalSales: number;
  reach: number;
  newToBrandBuyers: number;
  plays: number;
  /** Store-weeks live — offline and digital in-store. */
  storeWeeks: number;
  bookings: number;
}

export const EMPTY: Totals = {
  spend: 0, budget: 0, impressions: 0, viewableImpressions: 0, clicks: 0, conversions: 0, units: 0,
  sales: 0, incrementalSales: 0, reach: 0, newToBrandBuyers: 0, plays: 0, storeWeeks: 0, bookings: 0,
};

export function add(a: Totals, b: Totals): Totals {
  const out = { ...a };
  (Object.keys(EMPTY) as (keyof Totals)[]).forEach((k) => { out[k] = a[k] + b[k]; });
  return out;
}

const scale = (t: Totals, f: number): Totals => {
  const out = { ...t };
  (Object.keys(EMPTY) as (keyof Totals)[]).forEach((k) => { if (k !== 'budget' && k !== 'bookings') out[k] = t[k] * f; });
  return out;
};

export interface Rates {
  roas: number;
  iroas: number;
  ctr: number;
  cpc: number;
  cpm: number;
  cvr: number;
  frequency: number;
  viewability: number;
  pacing: number;
}

export function ratesOf(t: Totals): Rates {
  const div = (a: number, b: number) => (b > 0 ? a / b : 0);
  return {
    roas: div(t.sales, t.spend),
    iroas: div(t.incrementalSales, t.spend),
    ctr: div(t.clicks, t.impressions),
    cpc: div(t.spend, t.clicks),
    cpm: div(t.spend, t.impressions) * 1000,
    cvr: div(t.conversions, t.clicks),
    frequency: div(t.impressions, t.reach),
    viewability: div(t.viewableImpressions, t.impressions),
    pacing: div(t.spend, t.budget),
  };
}

// ── One booking ─────────────────────────────────────────────────────────

const DAY = 86_400_000;
const toDay = (iso: string) => Date.parse(iso.slice(0, 10) + 'T00:00:00Z');
const isoOf = (ms: number) => new Date(ms).toISOString().slice(0, 10);

/** A fixed factor per booking and metric in [1 - spread, 1 + spread]. */
function variation(id: string, salt: string, spread = 0.15): number {
  let h = 2166136261;
  for (const ch of id + salt) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return 1 - spread + ((h >>> 0) % 1000) / 1000 * spread * 2;
}

const engineOfBooking = (db: DbData, b: Booking): EngineId | undefined =>
  db.campaigns.find((c) => c.id === b.campaignId)?.engine;

/** Days a booking has delivered up to today (inclusive), weekends heavier —
 *  groceries sell on Friday and Saturday. Shares sum to 1. */
export function deliveryDays(booking: Booking): { date: string; share: number }[] {
  const start = toDay(booking.startDate);
  const end = Math.min(toDay(booking.endDate), toDay(PROTOTYPE_TODAY));
  if (end < start) return [];
  const days: { date: string; weight: number }[] = [];
  for (let t = start; t <= end; t += DAY) {
    const dow = new Date(t).getUTCDay();
    days.push({ date: isoOf(t), weight: dow === 5 || dow === 6 ? 1.25 : dow === 0 ? 0.8 : 1 });
  }
  const sum = days.reduce((s, d) => s + d.weight, 0);
  return days.map((d) => ({ date: d.date, share: d.weight / sum }));
}

/** Everything a booking has delivered up to today. */
export function bookingTotals(db: DbData, booking: Booking): Totals {
  const engine = engineOfBooking(db, booking);
  const product = productForBooking(db, booking);
  if (!engine || !product || booking.status === 'draft') return { ...EMPTY, budget: booking.status === 'draft' ? 0 : booking.budget };
  const r = DELIVERY_RATES[engine];
  const v = (salt: string) => variation(booking.id, salt);
  const spend = booking.spend;
  const price = bookingListPrice(db, booking) ?? product.listPrice ?? 0;
  const basis = product.pricingBasis;

  let impressions = 0;
  let clicks = 0;
  let conversions = 0;
  let storeWeeks = 0;
  if (basis === 'cpc' && price > 0) {
    // Bought per click: the clicks follow from spend, impressions from the CTR.
    clicks = booking.goal?.metric === 'clicks' && booking.delivered !== undefined ? booking.delivered : spend / price;
    const ctr = (engine === 'offsite' ? 0.01 : r.ctr) * v('ctr');
    impressions = ctr > 0 ? clicks / ctr : 0;
    conversions = clicks * r.cvr * v('cvr');
  } else {
    if (engine === 'offline-instore') {
      // AH prices print on reach at a base CPM: the shoppers passing it.
      impressions = (spend / (r.reachCpm ?? 17)) * 1000;
    } else if (booking.goal?.metric === 'impressions' && booking.delivered !== undefined) {
      impressions = booking.delivered;
    } else if (basis === 'cpm' && price > 0) {
      impressions = (spend / price) * 1000;
    }
    clicks = impressions * r.ctr * v('ctr');
    conversions = (impressions / 1000) * r.conversionsPerMille * v('conv');
  }
  if (engine === 'offline-instore' || engine === 'digital-instore') {
    const weeks = Math.max(1, deliveryDays(booking).length / 7);
    const stores = booking.goal?.metric === 'stores' ? booking.goal.amount : Math.round(Math.min(1, spend / Math.max(1, booking.budget)) * (booking.budget / Math.max(1, price)));
    storeWeeks = engine === 'offline-instore' ? Math.max(0, stores) * weeks : 0;
  }
  const sales = conversions * r.orderValue * v('aov');
  const reach = impressions / (r.frequency * v('freq'));
  return {
    spend,
    budget: booking.budget,
    impressions,
    viewableImpressions: impressions * Math.min(1, r.viewability * v('view')),
    clicks,
    conversions,
    units: conversions * r.unitsPerOrder,
    sales,
    incrementalSales: sales * r.incrementalShare,
    reach,
    newToBrandBuyers: conversions * 0.85 * r.newToBrandShare,
    plays: r.viewersPerPlay ? impressions / r.viewersPerPlay : 0,
    storeWeeks,
    bookings: 1,
  };
}

/** A booking's delivery that fell inside [from, to] (ISO dates, inclusive). */
export function bookingTotalsIn(db: DbData, booking: Booking, from?: string, to?: string): Totals {
  const total = bookingTotals(db, booking);
  if (!from && !to) return total;
  const days = deliveryDays(booking);
  const share = days.filter((d) => (!from || d.date >= from) && (!to || d.date <= to)).reduce((s, d) => s + d.share, 0);
  const overlaps = (!from || booking.endDate >= from) && (!to || booking.startDate <= to);
  return { ...scale(total, share), budget: overlaps ? total.budget : 0, bookings: overlaps && share > 0 ? 1 : 0 };
}

// ── Scope ───────────────────────────────────────────────────────────────

/** Which bookings a number is about. Every field narrows; none means all. */
export interface PerformanceScope {
  engine?: EngineId;
  mediaPlanId?: string;
  mediaPlanIds?: string[];
  campaignIds?: string[];
  bookingIds?: string[];
  advertiserIds?: string[];
  brandIds?: string[];
  retailProductIds?: string[];
  mediaProductIds?: string[];
  placementIds?: string[];
  positionIds?: string[];
  /** ISO dates, inclusive. */
  from?: string;
  to?: string;
}

const planOf = (db: DbData, c: Campaign): MediaPlan | undefined => db.mediaPlans.find((p) => p.id === c.mediaPlanId);

export function bookingsIn(db: DbData, scope: PerformanceScope = {}): Booking[] {
  return db.bookings.filter((b) => {
    if (b.status === 'draft') return false;
    const c = db.campaigns.find((x) => x.id === b.campaignId);
    if (!c) return false;
    if (scope.engine && c.engine !== scope.engine) return false;
    if (scope.mediaPlanId && c.mediaPlanId !== scope.mediaPlanId) return false;
    if (scope.mediaPlanIds && !scope.mediaPlanIds.includes(c.mediaPlanId)) return false;
    if (scope.campaignIds && !scope.campaignIds.includes(c.id)) return false;
    if (scope.bookingIds && !scope.bookingIds.includes(b.id)) return false;
    const plan = planOf(db, c);
    if (scope.advertiserIds && !(plan && scope.advertiserIds.includes(plan.advertiserId))) return false;
    if (scope.brandIds && !(plan?.brandIds ?? []).some((id) => scope.brandIds!.includes(id))) return false;
    if (scope.retailProductIds && !(c.retailProductIds ?? []).some((id) => scope.retailProductIds!.includes(id))) return false;
    if (scope.positionIds && !b.positionIds.some((id) => scope.positionIds!.includes(id))) return false;
    if (scope.placementIds && !b.positionIds.some((id) => scope.placementIds!.includes(db.positions.find((p) => p.id === id)?.placementId ?? ''))) return false;
    if (scope.mediaProductIds && !scope.mediaProductIds.includes(productForBooking(db, b)?.id ?? '')) return false;
    if (scope.from && b.endDate < scope.from) return false;
    if (scope.to && b.startDate > scope.to) return false;
    return true;
  });
}

/** The scope's delivery: the sum of its bookings. */
export function totalsFor(db: DbData, scope: PerformanceScope = {}): Totals {
  return bookingsIn(db, scope).reduce((t, b) => add(t, bookingTotalsIn(db, b, scope.from, scope.to)), EMPTY);
}

/** The period of the same length just before the scope's — what a card compares with. */
export function previousPeriod(scope: PerformanceScope): PerformanceScope | undefined {
  if (!scope.from || !scope.to) return undefined;
  const len = toDay(scope.to) - toDay(scope.from) + DAY;
  return { ...scope, from: isoOf(toDay(scope.from) - len), to: isoOf(toDay(scope.from) - DAY) };
}

/** The last 30 days to today — the default window of a dashboard. */
export function lastDays(days = 30): { from: string; to: string } {
  return { from: isoOf(toDay(PROTOTYPE_TODAY) - (days - 1) * DAY), to: PROTOTYPE_TODAY };
}

/** The weeks a scope actually delivered in: its first start to its last end
 *  (or today, if sooner), at most 26 weeks back — what a chart of it spans
 *  when no dates are chosen. */
export function activeWindow(db: DbData, scope: PerformanceScope = {}): { from: string; to: string } {
  if (scope.from && scope.to) return { from: scope.from, to: scope.to };
  const bookings = bookingsIn(db, scope).filter((b) => b.startDate <= PROTOTYPE_TODAY);
  if (!bookings.length) return { from: isoOf(toDay(PROTOTYPE_TODAY) - 83 * DAY), to: PROTOTYPE_TODAY };
  const last = bookings.reduce((m, b) => (b.endDate > m ? b.endDate : m), bookings[0].endDate);
  const to = scope.to ?? (last < PROTOTYPE_TODAY ? last : PROTOTYPE_TODAY);
  const first = bookings.reduce((m, b) => (b.startDate < m ? b.startDate : m), bookings[0].startDate);
  const earliest = isoOf(toDay(to) - 181 * DAY);
  return { from: scope.from ?? (first > earliest ? first : earliest), to };
}

// ── Series ──────────────────────────────────────────────────────────────

export type Grain = 'day' | 'week' | 'month';

export interface SeriesPoint {
  /** First day of the bucket, ISO. */
  start: string;
  /** "12 Jul", "Wk 28", "Jul". */
  label: string;
  totals: Totals;
}

const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function bucketOf(date: string, grain: Grain): string {
  if (grain === 'day') return date;
  if (grain === 'week') return mondayOf(date);
  return date.slice(0, 7) + '-01';
}

function labelOf(start: string, grain: Grain): string {
  const d = new Date(start + 'T00:00:00Z');
  if (grain === 'month') return MONTH[d.getUTCMonth()];
  if (grain === 'week') {
    const t = new Date(d); const day = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - day);
    const wk = Math.ceil(((t.getTime() - Date.UTC(t.getUTCFullYear(), 0, 1)) / DAY + 1) / 7);
    return `Wk ${wk}`;
  }
  return `${d.getUTCDate()} ${MONTH[d.getUTCMonth()]}`;
}

/** The scope's delivery per day, week or month over [from, to] (default: the
 *  last 12 weeks to today). Buckets without delivery are kept, as zeros. */
export function seriesFor(db: DbData, scope: PerformanceScope = {}, grain: Grain = 'week'): SeriesPoint[] {
  const to = scope.to ?? PROTOTYPE_TODAY;
  const from = scope.from ?? isoOf(toDay(to) - 83 * DAY);
  const starts: string[] = [];
  if (grain === 'week') starts.push(...mondaysBetween(from, to));
  else {
    for (let t = toDay(from); t <= toDay(to); t += DAY) {
      const b = bucketOf(isoOf(t), grain);
      if (starts[starts.length - 1] !== b) starts.push(b);
    }
  }
  const buckets = new Map(starts.map((s) => [s, { ...EMPTY }]));
  for (const b of bookingsIn(db, { ...scope, from, to })) {
    const total = bookingTotals(db, b);
    for (const d of deliveryDays(b)) {
      if (d.date < from || d.date > to) continue;
      const key = bucketOf(d.date, grain);
      const cur = buckets.get(key);
      if (cur) buckets.set(key, add(cur, { ...scale(total, d.share), budget: 0, bookings: 0 }));
    }
  }
  return starts.map((s) => ({ start: s, label: labelOf(s, grain), totals: buckets.get(s)! }));
}

// ── Breakdowns ──────────────────────────────────────────────────────────

export type Dimension = 'engine' | 'mediaPlan' | 'campaign' | 'advertiser' | 'brand' | 'retailProduct' | 'mediaProduct' | 'placement' | 'position';

export interface BreakdownRow {
  id: string;
  name: string;
  totals: Totals;
}

/** The scope's delivery split by a dimension. A booking counts once per
 *  value it carries; one on several retail products or positions splits
 *  evenly between them, so the rows add back up to the scope's total. */
export function breakdown(db: DbData, scope: PerformanceScope, by: Dimension): BreakdownRow[] {
  const rows = new Map<string, BreakdownRow>();
  const put = (id: string, name: string, t: Totals) => {
    const cur = rows.get(id);
    rows.set(id, { id, name, totals: cur ? add(cur.totals, t) : t });
  };
  for (const b of bookingsIn(db, scope)) {
    const t = bookingTotalsIn(db, b, scope.from, scope.to);
    const c = db.campaigns.find((x) => x.id === b.campaignId)!;
    const plan = planOf(db, c);
    const split = (ids: string[], name: (id: string) => string) => {
      if (!ids.length) return;
      ids.forEach((id) => put(id, name(id), { ...scale(t, 1 / ids.length), budget: t.budget / ids.length }));
    };
    switch (by) {
      case 'engine': put(c.engine, c.engine, t); break;
      case 'mediaPlan': if (plan) put(plan.id, plan.name, t); break;
      case 'campaign': put(c.id, c.name, t); break;
      case 'advertiser': if (plan) put(plan.advertiserId, db.advertisers.find((a) => a.id === plan.advertiserId)?.name ?? plan.advertiserId, t); break;
      case 'brand': split(plan?.brandIds ?? [], (id) => db.advertisers.flatMap((a) => a.brands).find((br) => br.id === id)?.name ?? id); break;
      case 'retailProduct': split(c.retailProductIds ?? [], (id) => db.retailProducts.find((p) => p.id === id)?.name ?? id); break;
      case 'mediaProduct': { const m = productForBooking(db, b); if (m) put(m.id, m.name, t); break; }
      case 'placement': split([...new Set(b.positionIds.map((id) => db.positions.find((p) => p.id === id)?.placementId).filter((x): x is string => !!x))], (id) => db.placements.find((p) => p.id === id)?.name ?? id); break;
      case 'position': split(b.positionIds, (id) => db.positions.find((p) => p.id === id)?.name ?? id); break;
    }
  }
  return [...rows.values()].sort((a, b) => b.totals.spend - a.totals.spend);
}

// ── Inventory-side measures ─────────────────────────────────────────────

/** Share of voice: the scope's load on its positions over its run, as a
 *  share of everything booked there — straight from the inventory model. */
export function shareOfVoice(db: DbData, scope: PerformanceScope): number {
  const bookings = bookingsIn(db, scope);
  if (!bookings.length) return 0;
  const ids = new Set(bookings.map((b) => b.id));
  const positions = [...new Set(bookings.flatMap((b) => b.positionIds))].map((id) => db.positions.find((p) => p.id === id)).filter((p): p is NonNullable<typeof p> => !!p);
  const from = scope.from ?? bookings.reduce((m, b) => (b.startDate < m ? b.startDate : m), bookings[0].startDate);
  const to = scope.to ?? bookings.reduce((m, b) => (b.endDate > m ? b.endDate : m), bookings[0].endDate);
  let mine = 0;
  let all = 0;
  for (const pos of positions) {
    for (const monday of mondaysBetween(from, to)) {
      const w = positionWeek(db, pos, monday);
      all += w.used;
      mine += w.bookings.filter((b) => ids.has(b.id)).reduce((s, b) => s + bookingLoad(db, b, pos, monday), 0);
    }
  }
  return all > 0 ? mine / all : 0;
}

/** Digital in-store: the loop time still free on the scope's screens over
 *  its run — the "Available time" card. */
export function availableTime(db: DbData, scope: PerformanceScope): number {
  const bookings = bookingsIn(db, scope);
  if (!bookings.length) return 0;
  const positions = [...new Set(bookings.flatMap((b) => b.positionIds))].map((id) => db.positions.find((p) => p.id === id)).filter((p): p is NonNullable<typeof p> => !!p);
  const from = scope.from ?? bookings.reduce((m, b) => (b.startDate < m ? b.startDate : m), bookings[0].startDate);
  const to = scope.to ?? bookings.reduce((m, b) => (b.endDate > m ? b.endDate : m), bookings[0].endDate);
  let free = 0;
  let cap = 0;
  for (const pos of positions) for (const monday of mondaysBetween(from, to)) {
    const w = positionWeek(db, pos, monday);
    free += w.available;
    cap += w.capacity;
  }
  return cap > 0 ? free / cap : 0;
}

/** Stores a scope is live in today — offline and digital in-store. */
export function liveStores(db: DbData, scope: PerformanceScope): number {
  const live = bookingsIn(db, scope).filter((b) => b.startDate <= PROTOTYPE_TODAY && b.endDate >= PROTOTYPE_TODAY && b.status !== 'paused');
  const stores = live.reduce((s, b) => {
    if (b.goal?.metric === 'stores') return s + b.goal.amount;
    const max = Math.max(0, ...b.positionIds.map((id) => db.positions.find((p) => p.id === id)?.stores ?? 0));
    return s + max;
  }, 0);
  const network = Math.max(0, ...db.positions.map((p) => p.stores ?? 0));
  return Math.min(stores, network);
}
