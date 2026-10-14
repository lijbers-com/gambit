/**
 * Inventory: what every position can hold each week, and how much of it the
 * system's bookings take. One model, read by every booking calendar, the
 * availability check, the pricing engine's demand rule and the media
 * product pages — so a fill rate means the same thing wherever it is shown.
 *
 *   capacity  — per position per ISO week, in the proposition's goal unit:
 *               stores (offline in-store), clicks (sponsored products),
 *               impressions (everything else).
 *   load      — each booking on the position takes its volume (its goal, or
 *               its budget at the product's list price), spread over its
 *               weeks; in-store print takes its stores every week it runs.
 *   fill      — load over capacity, split by booking state.
 *
 * Nothing here is seeded per week: every booked unit traces to a booking.
 * The prototype does not move in time (no bookings arrive), so it reads
 * from one fixed "today".
 */

import type { Booking, DbData, EngineId, GoalMetric, MediaProduct, Position, PricingRule } from './types';
import { bookingListPrice, buyingTypeOf, goalMetricFor, productForBooking } from './guaranteed';
import { PROTOTYPE_TODAY } from '../clock';
import { engineOfPosition } from './hierarchy';

/** The prototype's today (lib/clock) — calendars open on it. */
export { PROTOTYPE_TODAY };
/** Weeks a calendar shows when it opens. */
export const CALENDAR_WEEKS = 12;

// ── Weeks ───────────────────────────────────────────────────────────────

const DAY = 86_400_000;
const toUtc = (iso: string) => new Date(iso.slice(0, 10) + 'T00:00:00Z');
const toIso = (d: Date) => d.toISOString().slice(0, 10);

/** The Monday of the ISO week a date falls in. */
export function mondayOf(iso: string): string {
  const d = toUtc(iso);
  const day = d.getUTCDay() || 7;
  return toIso(new Date(d.getTime() - (day - 1) * DAY));
}

/** ISO week number (1–53) of a date. */
export function weekNumberOf(iso: string): number {
  const d = toUtc(iso);
  const day = d.getUTCDay() || 7;
  const thursday = new Date(d.getTime() + (4 - day) * DAY);
  const yearStart = Date.UTC(thursday.getUTCFullYear(), 0, 1);
  return Math.ceil(((thursday.getTime() - yearStart) / DAY + 1) / 7);
}

/** The Mondays of every week from `from` to `to`, both included. */
export function mondaysBetween(from: string, to: string): string[] {
  const out: string[] = [];
  const end = toUtc(mondayOf(to)).getTime();
  for (let t = toUtc(mondayOf(from)).getTime(); t <= end; t += 7 * DAY) out.push(toIso(new Date(t)));
  return out;
}

/** The weeks a calendar opens on: from the week of today, CALENDAR_WEEKS long. */
export function defaultFrame(): { from: string; to: string } {
  const from = mondayOf(PROTOTYPE_TODAY);
  return { from, to: toIso(new Date(toUtc(from).getTime() + (CALENDAR_WEEKS * 7 - 1) * DAY)) };
}

/** Days of a booking's run that fall in the week starting `monday`. */
function daysInWeek(booking: Pick<Booking, 'startDate' | 'endDate'>, monday: string): number {
  const ws = toUtc(monday).getTime();
  const we = ws + 6 * DAY;
  const s = Math.max(ws, toUtc(booking.startDate).getTime());
  const e = Math.min(we, toUtc(booking.endDate).getTime());
  return e < s ? 0 : Math.round((e - s) / DAY) + 1;
}

function runDays(booking: Pick<Booking, 'startDate' | 'endDate'>): number {
  return Math.max(1, Math.round((toUtc(booking.endDate).getTime() - toUtc(booking.startDate).getTime()) / DAY) + 1);
}

// ── Capacity ────────────────────────────────────────────────────────────

/** What a position's capacity is counted in. */
export const unitFor = (engine: EngineId): GoalMetric => goalMetricFor(engine);

/**
 * How much one bookable slot carries in a day, per proposition — the bridge
 * from a position's `dailyCapacity` (slots) to its goal unit. Prototype
 * calibration: sized so the seeded bookings fill their positions the way a
 * real summer would, until the ad server reports forecasts.
 */
const UNITS_PER_SLOT_DAY: Partial<Record<EngineId, number>> = {
  display: 1_400,
  offsite: 900,
  'sponsored-products': 12,
};
/** Clicks per impression assumed where clicks are bought on an impressions
 *  proposition, until the partner reports it. */
const CLICK_THROUGH_RATE = 0.01;
/** Digital in-store: impressions one loop slot earns in one store in a week. */
const IMPRESSIONS_PER_STORE_SLOT_WEEK = 24;

export { engineOfPosition };

/** What a position can hold in one week, in its proposition's unit. */
export function weeklyCapacity(db: DbData, position: Position): number {
  const engine = engineOfPosition(db, position);
  if (engine === 'offline-instore') return position.stores ?? 0;
  if (engine === 'digital-instore') return (position.stores ?? 0) * position.dailyCapacity * IMPRESSIONS_PER_STORE_SLOT_WEEK;
  return position.dailyCapacity * 7 * (UNITS_PER_SLOT_DAY[engine ?? 'display'] ?? 1_000);
}

// ── Load ────────────────────────────────────────────────────────────────

/** Which part of the fill a booking is: sold, confirmed, held — or nothing
 *  yet (a draft holds no inventory). */
export type LoadState = 'booked' | 'confirmed' | 'reserved';
export function loadStateOf(booking: Booking): LoadState | null {
  if (booking.status === 'draft') return null;
  if (booking.status === 'in-option') return booking.approvedAt || booking.price?.state === 'quoted' ? 'confirmed' : 'reserved';
  return 'booked';
}

/** A booking's whole volume in its proposition's unit: its goal when it has
 *  one, else its budget at the product's list price. */
export function bookingVolume(db: DbData, booking: Booking): number {
  if (booking.goal) return booking.goal.amount;
  const product = productForBooking(db, booking);
  const price = bookingListPrice(db, booking);
  if (!product || !price) return 0;
  switch (product.pricingBasis) {
    case 'cpm': return (booking.budget / price) * 1000;
    case 'cpc':
      // Clicks bought on a proposition counted in impressions (offsite
      // Demand Gen): the impressions it takes to earn them.
      return product.engine !== 'sponsored-products' ? booking.budget / price / CLICK_THROUGH_RATE : booking.budget / price;
    case 'per-store':
    case 'per-day': return booking.budget / price;
    default: return booking.budget / price;
  }
}

/** What a booking takes from one of its positions in the week starting
 *  `monday`. Print runs in its stores the whole time; everything else
 *  spreads its volume over the days it runs. */
export function bookingLoad(db: DbData, booking: Booking, position: Position, monday: string): number {
  if (!booking.positionIds.includes(position.id)) return 0;
  const days = daysInWeek(booking, monday);
  if (!days) return 0;
  const basis = productForBooking(db, booking)?.pricingBasis;
  // Bought by the day or as a flat flight: the booking takes its share of
  // the position for the days (or weeks) it paid for.
  if (!booking.goal && (basis === 'per-day' || basis === 'flat')) {
    const periods = basis === 'per-day' ? runDays(booking) : Math.max(1, runDays(booking) / 7);
    const share = Math.min(1, bookingVolume(db, booking) / periods);
    return weeklyCapacity(db, position) * share * (days / 7) / booking.positionIds.length;
  }
  // A booking on several positions (a shelf package, a screen group) takes
  // from each in proportion to what it can hold.
  const caps = booking.positionIds.map((id) => db.positions.find((p) => p.id === id)).filter((p): p is Position => !!p).map((p) => weeklyCapacity(db, p));
  const total = caps.reduce((a, b) => a + b, 0);
  const perPosition = bookingVolume(db, booking) * (total > 0 ? weeklyCapacity(db, position) / total : 1 / booking.positionIds.length);
  if (engineOfPosition(db, position) === 'offline-instore') return perPosition;
  return perPosition * (days / runDays(booking));
}

// ── A week of inventory ─────────────────────────────────────────────────

export interface InventoryWeek {
  monday: string;
  capacity: number;
  booked: number;
  confirmed: number;
  reserved: number;
  /** Everything taken, by state. */
  used: number;
  /** Left to sell — never below 0. */
  available: number;
  /** Taken beyond capacity. */
  overbooked: number;
  /** used / capacity (can exceed 1). */
  fill: number;
  /** The bookings holding it that week (drafts hold nothing). */
  bookings: Booking[];
  /** Budget the week carries: each booking's budget spread over its run. */
  revenue: number;
  /** Display's split of what is sold, by how it was sold. */
  channels: { soldManaged: number; action: number; programmatic: number };
}

/** How a booking was sold, for display's fill bar: auctions run
 *  programmatically; guaranteed sales are self service when an advertiser
 *  built the plan, managed when the retailer did. */
function saleChannelOf(db: DbData, booking: Booking): keyof InventoryWeek['channels'] {
  if (buyingTypeOf(db, booking) === 'auction') return 'programmatic';
  const campaign = db.campaigns.find((c) => c.id === booking.campaignId);
  const plan = campaign && db.mediaPlans.find((p) => p.id === campaign.mediaPlanId);
  const author = plan?.createdBy && db.users.find((u) => u.id === plan.createdBy);
  return author && author.side === 'advertiser' ? 'action' : 'soldManaged';
}

export interface WeekOptions {
  /** Narrows the store estate (in-store): the share of stores in scope. */
  storeShare?: number;
  /** Bookings that count. Default: all. */
  include?: (booking: Booking) => boolean;
}

/** One position, one week. */
export function positionWeek(db: DbData, position: Position, monday: string, opts: WeekOptions = {}): InventoryWeek {
  const share = opts.storeShare ?? 1;
  const capacity = weeklyCapacity(db, position) * share;
  const w: InventoryWeek = {
    monday, capacity, booked: 0, confirmed: 0, reserved: 0, used: 0, available: 0, overbooked: 0, fill: 0,
    bookings: [], revenue: 0, channels: { soldManaged: 0, action: 0, programmatic: 0 },
  };
  for (const b of db.bookings) {
    if (!b.positionIds.includes(position.id) || !daysInWeek(b, monday)) continue;
    if (opts.include && !opts.include(b)) continue;
    // A draft holds nothing yet, so it is not on the calendar at all.
    const state = loadStateOf(b);
    if (!state) continue;
    w.bookings.push(b);
    w.revenue += (b.budget / b.positionIds.length) * (daysInWeek(b, monday) / runDays(b));
    const load = bookingLoad(db, b, position, monday) * share;
    w[state] += load;
    w.channels[saleChannelOf(db, b)] += load;
  }
  return finish(w);
}

function finish(w: InventoryWeek): InventoryWeek {
  w.used = w.booked + w.confirmed + w.reserved;
  w.available = Math.max(0, w.capacity - w.used);
  w.overbooked = Math.max(0, w.used - w.capacity);
  w.fill = w.capacity > 0 ? w.used / w.capacity : 0;
  return w;
}

/** A media product's week: the positions of its package added up. */
export function productWeek(db: DbData, product: MediaProduct, monday: string, opts: WeekOptions = {}, positionIds?: string[]): InventoryWeek {
  return positionsWeek(db, db.positions.filter((p) => product.positionIds.includes(p.id) && (!positionIds || positionIds.includes(p.id))), monday, opts);
}

/** Any set of positions' week added up — a placement, a placement group. */
export function positionsWeek(db: DbData, positions: Position[], monday: string, opts: WeekOptions = {}): InventoryWeek {
  const weeks = positions.map((p) => positionWeek(db, p, monday, opts));
  const w: InventoryWeek = {
    monday, capacity: 0, booked: 0, confirmed: 0, reserved: 0, used: 0, available: 0, overbooked: 0, fill: 0,
    bookings: [], revenue: 0, channels: { soldManaged: 0, action: 0, programmatic: 0 },
  };
  for (const x of weeks) {
    w.capacity += x.capacity; w.booked += x.booked; w.confirmed += x.confirmed; w.reserved += x.reserved;
    w.revenue += x.revenue;
    w.channels.soldManaged += x.channels.soldManaged; w.channels.action += x.channels.action; w.channels.programmatic += x.channels.programmatic;
    for (const b of x.bookings) if (!w.bookings.includes(b)) w.bookings.push(b);
  }
  return finish(w);
}

/** Stores a position still has free that week (in-store). Print sells
 *  whole stores; screens sell loop slots, so a store is free while its
 *  loop has room — the same share as the fill. */
export function storesFree(db: DbData, position: Position, w: InventoryWeek, storeShare = 1): number {
  const stores = (position.stores ?? 0) * storeShare;
  if (engineOfPosition(db, position) === 'offline-instore') return w.capacity - w.used;
  return Math.round(stores * (1 - w.fill));
}

/** The fill rate of a position over a run time (default: the calendar's
 *  opening weeks): booked over capacity, 0–1. */
export function positionFillRate(db: DbData, position: Position, from?: string, to?: string): number {
  const frame = from && to ? { from, to } : defaultFrame();
  const weeks = mondaysBetween(frame.from, frame.to).map((m) => positionWeek(db, position, m));
  const capacity = weeks.reduce((s, w) => s + w.capacity, 0);
  if (!capacity) return 0;
  return Math.min(1, weeks.reduce((s, w) => s + w.used, 0) / capacity);
}

// ── Retail moments ──────────────────────────────────────────────────────

/** The dated pricing rules (seasons and retail moments) that apply to a
 *  proposition — the calendar's event bars, so the moments a calendar
 *  shows are the ones that move its prices. */
export function retailMomentsFor(db: DbData, engine: EngineId): PricingRule[] {
  return db.pricingRules.filter((r) =>
    (r.kind === 'seasonality' || r.kind === 'moment') && r.from && r.to && r.status === 'active' &&
    (r.engine === 'all' || r.engine === engine),
  );
}

// ── Store estate ────────────────────────────────────────────────────────

/** Store formats and their share of the estate — demo shares until store
 *  master data carries the real split. Picking formats narrows every
 *  in-store count (capacity and bookings alike) to that share. */
export const STORE_TYPES: Array<{ value: string; label: string; share: number }> = [
  { value: 'ah', label: 'AH', share: 0.72 },
  { value: 'ah-xl', label: 'AH XL', share: 0.13 },
  { value: 'ah-to-go', label: 'AH to go', share: 0.15 },
];

export function storeShareOf(types: string[]): number {
  if (!types.length) return 1;
  return types.reduce((s, t) => s + (STORE_TYPES.find((x) => x.value === t)?.share ?? 0), 0);
}

/** The stores a booking runs in on a position (in-store): print books
 *  stores outright; a screen booking takes one loop slot in each store. */
export function bookingStoresOn(db: DbData, booking: Booking, position: Position): number {
  const engine = engineOfPosition(db, position);
  if (engine === 'offline-instore') return Math.round(bookingVolume(db, booking) / booking.positionIds.length);
  if (engine === 'digital-instore') {
    const weeks = Math.max(1, runDays(booking) / 7);
    const perWeek = bookingVolume(db, booking) / booking.positionIds.length / weeks;
    return Math.min(position.stores ?? 0, Math.round(perWeek / IMPRESSIONS_PER_STORE_SLOT_WEEK));
  }
  return 0;
}
