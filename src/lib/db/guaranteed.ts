import type { Booking, BookingGoal, BookingPriceState, BuyingModel, Campaign, DbData, EngineId, GoalMetric, MediaProduct, PricingBasis } from './types';
import { effectiveHoldStatus, fillRateFor, formatPrice, priceFor, type PriceBuildUp } from './pricing';

/**
 * Guaranteed bookings.
 *
 * A guaranteed campaign sells a fixed amount — impressions on screens and
 * pages, stores for printed materials — at an agreed unit price, and every
 * booking under it is guaranteed too. That gives a guaranteed booking three
 * things an auction booking does not have: a GOAL, how much of it has been
 * DELIVERED, and a PRICE that moves from indicative to quoted to agreed and
 * then never moves again.
 */

// ── Buying type ─────────────────────────────────────────────────────────

/** Whether a proposition only sells guaranteed: every active product it has
 *  offers guaranteed and nothing else. In-store is bought that way. */
function guaranteedOnly(db: DbData, engine: EngineId): boolean {
  const products = db.mediaProducts.filter((m) => m.engine === engine && m.status !== 'archived');
  return products.length > 0 && products.every((m) => (m.buyingModels ?? ['auction']).every((b) => b === 'guaranteed'));
}

/** How a campaign buys: what it was set to, else what its proposition sells. */
export function buyingTypeOfCampaign(db: DbData, campaign: Campaign): BuyingModel {
  return campaign.buyingType ?? (guaranteedOnly(db, campaign.engine) ? 'guaranteed' : 'auction');
}

/** A booking buys the way its campaign does — it is never set on its own. */
export function buyingTypeOf(db: DbData, booking: Booking): BuyingModel {
  const campaign = db.campaigns.find((c) => c.id === booking.campaignId);
  return campaign ? buyingTypeOfCampaign(db, campaign) : 'auction';
}

export const isGuaranteed = (db: DbData, booking: Booking) => buyingTypeOf(db, booking) === 'guaranteed';

// ── Goal ────────────────────────────────────────────────────────────────

/** What a guaranteed goal counts on each proposition. */
export function goalMetricFor(engine: EngineId): GoalMetric {
  // Sponsored products sells clicks at a fixed CPC when bought guaranteed.
  return engine === 'offline-instore' ? 'stores' : engine === 'sponsored-products' ? 'clicks' : 'impressions';
}

export const GOAL_LABEL: Record<GoalMetric, { one: string; many: string }> = {
  impressions: { one: 'impression', many: 'impressions' },
  stores: { one: 'store', many: 'stores' },
  clicks: { one: 'click', many: 'clicks' },
};

/** 1,000,000 → "1.0M", 500,000 → "500k", 30 → "30". */
export function compactNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `${Math.round(n / 1000)}k`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return Math.round(n).toLocaleString('en-US');
}

/** "1.0M impressions", "30 stores". */
export function formatGoal(goal: BookingGoal): string {
  const label = GOAL_LABEL[goal.metric];
  return `${compactNumber(goal.amount)} ${goal.amount === 1 ? label.one : label.many}`;
}

// ── Price ───────────────────────────────────────────────────────────────

/** The product a booking buys: the one its first position sits in, else the
 *  proposition's first guaranteed product. */
export function productForBooking(db: DbData, booking: Booking): MediaProduct | undefined {
  // The product chosen in the booking's form wins.
  const chosen = booking.mediaProductId && db.mediaProducts.find((m) => m.id === booking.mediaProductId);
  if (chosen) return chosen;
  const position = booking.positionIds.map((id) => db.positions.find((p) => p.id === id)).find(Boolean);
  const fromPosition = position && db.mediaProducts.find((m) => m.id === position.mediaProductId);
  if (fromPosition) return fromPosition;
  const campaign = db.campaigns.find((c) => c.id === booking.campaignId);
  return db.mediaProducts.find((m) => m.engine === campaign?.engine && m.status !== 'archived' && (m.buyingModels ?? []).includes('guaranteed'));
}

/** How many priced units a goal is: thousands of impressions for a CPM,
 *  stores for a per-store price, clicks for a CPC. */
export function unitsFor(basis: PricingBasis, goal: BookingGoal): number {
  return basis === 'cpm' ? goal.amount / 1000 : goal.amount;
}

/** The unit price times the goal, rounded to the cent. */
export function amountFor(basis: PricingBasis, unitPrice: number, goal: BookingGoal): number {
  return Math.round(unitsFor(basis, goal) * unitPrice * 100) / 100;
}

/** What a price is called in each state, and the line beneath it. */
export const PRICE_STATE_LABEL: Record<BookingPriceState, { label: string; note: string }> = {
  'not-priced': { label: 'Not yet priced', note: 'Set a budget to price the booking' },
  indicative: { label: 'Indicative', note: 'Check availability to get a quote' },
  quoted: { label: 'Quoted', note: 'Price held until the quote expires' },
  agreed: { label: 'Agreed', note: 'Invoiced afterwards' },
};

export interface BookingPriceView {
  state: BookingPriceState;
  basis?: PricingBasis;
  unitPrice?: number;
  amount?: number;
  lockedAt?: string;
  /** For a quote: when its hold runs out. */
  expiresAt?: string;
  /** For an indicative price: where the unit price came from. */
  buildUp?: PriceBuildUp;
}

/** The product's price for this booking today: list price with the pricing
 *  rules that apply to its dates, budget and fill. */
export function listPriceFor(db: DbData, booking: Booking, now = new Date()) {
  const product = productForBooking(db, booking);
  if (!product) return undefined;
  const position = booking.positionIds.map((id) => db.positions.find((p) => p.id === id)).find(Boolean);
  const daysAhead = Math.max(0, Math.round((new Date(booking.startDate).getTime() - now.getTime()) / 86400000));
  return priceFor(db, product, {
    from: booking.startDate, to: booking.endDate, daysAhead, budget: booking.budget,
    fillRate: position ? fillRateFor(db, position, booking.startDate, booking.endDate) : undefined,
  });
}

/**
 * Where a guaranteed booking's price stands. The price IS the budget: it is
 * indicative while the budget can still change, quoted while a hold locks
 * it, and agreed — the billable amount — from approval on. The unit price
 * is what the budget pays per unit of the goal when there is one, else the
 * product's list price. A quote whose hold has run out falls back to
 * indicative, because what it locked is gone.
 */
export function bookingPrice(db: DbData, booking: Booking, now = new Date()): BookingPriceView {
  const stored = booking.price;
  if (stored?.state === 'agreed') {
    return { state: 'agreed', basis: stored.basis, unitPrice: stored.unitPrice, amount: stored.amount, lockedAt: stored.lockedAt };
  }
  if (stored?.state === 'quoted') {
    const hold = stored.holdId ? db.inventoryHolds.find((h) => h.id === stored.holdId) : undefined;
    if (!hold || effectiveHoldStatus(hold, now) === 'held' || effectiveHoldStatus(hold, now) === 'confirmed') {
      return { state: 'quoted', basis: stored.basis, unitPrice: stored.unitPrice, amount: stored.amount, lockedAt: stored.lockedAt, expiresAt: hold?.expiresAt };
    }
  }
  if (!booking.budget || booking.budget <= 0) return { state: 'not-priced' };
  const buildUp = listPriceFor(db, booking, now);
  const basis = buildUp?.basis;
  const unitPrice = basis && booking.goal?.amount ? effectiveUnitPrice(booking.budget, basis, booking.goal) : buildUp?.price;
  return { state: 'indicative', basis, unitPrice, amount: booking.budget, buildUp };
}

/** What the budget pays per unit of the goal — the booking's own CPM. */
export function effectiveUnitPrice(budget: number, basis: PricingBasis, goal: BookingGoal): number {
  const units = unitsFor(basis, goal);
  return units > 0 ? Math.round((budget / units) * 100) / 100 : 0;
}

/** "€4,500.00" — invoices and agreed prices are read to the cent. */
export const formatEuro = (n: number) => `${n < 0 ? '−' : ''}€${Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** "€9 CPM", "€32 per store". */
export function formatUnitPrice(unitPrice: number, basis: PricingBasis): string {
  const label = basis === 'cpm' ? 'CPM' : basis === 'per-store' ? 'per store' : basis === 'per-day' ? 'per day' : basis === 'cpc' ? 'CPC' : 'flat';
  return `${formatPrice(unitPrice, basis)} ${label}`;
}

// ── Delivery ────────────────────────────────────────────────────────────

export interface DeliveryProgress {
  goal: BookingGoal;
  delivered: number;
  /** Delivered over goal, 0–1 (can pass 1 when over-delivered). */
  share: number;
  /** Where delivery should be by now: the elapsed share of the flight. */
  expectedShare: number;
  /** Ahead, on track or behind, with a five-point margin. */
  pace: 'ahead' | 'on-track' | 'behind';
}

/** The elapsed share of a run time, 0 before it starts and 1 after it ends. */
export function elapsedShare(startDate: string, endDate: string, now = Date.now()): number {
  const start = new Date(startDate + 'T00:00:00').getTime();
  const end = new Date(endDate + 'T23:59:59').getTime();
  if (now <= start) return 0;
  if (now >= end) return 1;
  return (now - start) / (end - start);
}

/** How far a guaranteed booking is towards its goal. Only a booking that has
 *  started delivering has progress; a draft or a booking in review has none. */
export function deliveryProgress(booking: Booking, now = Date.now()): DeliveryProgress | undefined {
  if (!booking.goal || booking.goal.amount <= 0) return undefined;
  if (booking.status === 'draft' || booking.status === 'in-option') return undefined;
  const delivered = booking.delivered ?? 0;
  const share = delivered / booking.goal.amount;
  const expectedShare = booking.status === 'completed' ? 1 : elapsedShare(booking.startDate, booking.endDate, now);
  const gap = share - expectedShare;
  return { goal: booking.goal, delivered, share, expectedShare, pace: gap > 0.05 ? 'ahead' : gap < -0.05 ? 'behind' : 'on-track' };
}

/** A campaign's guaranteed totals: its bookings' goals, delivery and price,
 *  summed — only when every goal counts the same thing. */
export function campaignGuaranteedTotals(db: DbData, campaign: Campaign, now = new Date()) {
  const bookings = db.bookings.filter((b) => b.campaignId === campaign.id && b.goal);
  if (!bookings.length) return undefined;
  const metric = bookings[0].goal!.metric;
  if (bookings.some((b) => b.goal!.metric !== metric)) return undefined;
  const goal = bookings.reduce((n, b) => n + b.goal!.amount, 0);
  const started = bookings.filter((b) => deliveryProgress(b, now.getTime()));
  const delivered = started.reduce((n, b) => n + (b.delivered ?? 0), 0);
  const startedGoal = started.reduce((n, b) => n + b.goal!.amount, 0);
  const expected = started.reduce((n, b) => n + b.goal!.amount * (deliveryProgress(b, now.getTime())?.expectedShare ?? 0), 0);
  const prices = bookings.map((b) => bookingPrice(db, b, now));
  const priced = prices.filter((p) => p.amount !== undefined);
  const amount = priced.length ? Math.round(priced.reduce((n, p) => n + p.amount!, 0) * 100) / 100 : undefined;
  // A campaign's price is only as firm as its least firm booking.
  const order: BookingPriceState[] = ['not-priced', 'indicative', 'quoted', 'agreed'];
  const state = prices.reduce<BookingPriceState>((least, p) => (order.indexOf(p.state) < order.indexOf(least) ? p.state : least), 'agreed');
  return {
    goal: { metric, amount: goal } as BookingGoal,
    progress: startedGoal > 0 ? { share: delivered / startedGoal, expectedShare: expected / startedGoal } : undefined,
    price: { state, amount } as BookingPriceView,
  };
}
