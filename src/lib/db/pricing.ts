import type { DbData, EngineId, InventoryHold, MediaProduct, Position, PricingBasis, PricingRule } from './types';

/**
 * The product & pricing engine, first cut.
 *
 * A price is the product's list price with the pricing rules that apply
 * stacked on top: each active rule whose scope, dates and conditions match
 * multiplies the running price by its index, in priority order. The build-up
 * is returned alongside the number so every price on screen can show where
 * it came from — the retailer manages indexes, not prices.
 */

export interface PriceStep {
  rule: PricingRule;
  before: number;
  after: number;
}

export interface PriceBuildUp {
  basis: PricingBasis;
  listPrice: number;
  steps: PriceStep[];
  price: number;
  /** The auction floor, when the product has one. */
  floorPrice?: number;
}

export interface PriceContext {
  /** The run time the price is for. */
  from?: string;
  to?: string;
  /** How far ahead it is booked, in days. */
  daysAhead?: number;
  /** The booking's budget. */
  budget?: number;
  /** The fill rate of the position over the run time, 0–1. */
  fillRate?: number;
}

const overlaps = (aFrom?: string, aTo?: string, bFrom?: string, bTo?: string) => {
  if (!aFrom || !aTo || !bFrom || !bTo) return true;
  return aFrom <= bTo && bFrom <= aTo;
};

export const BASIS_LABEL: Record<PricingBasis, string> = {
  cpm: 'CPM',
  cpc: 'CPC',
  'per-day': 'per day',
  flat: 'flat',
};

export const RULE_KIND_LABEL: Record<PricingRule['kind'], string> = {
  seasonality: 'Seasonality',
  moment: 'Retail moment',
  market: 'Market index',
  demand: 'Demand',
  'early-booking': 'Early booking',
  volume: 'Volume',
};

/** Whether a rule applies to this product in this context. */
export function ruleApplies(rule: PricingRule, product: MediaProduct, ctx: PriceContext): boolean {
  if (rule.status !== 'active') return false;
  if (rule.engine !== 'all' && rule.engine !== product.engine) return false;
  if (rule.mediaProductIds?.length && !rule.mediaProductIds.includes(product.id)) return false;
  switch (rule.kind) {
    case 'seasonality':
    case 'moment':
      return overlaps(rule.from, rule.to, ctx.from, ctx.to);
    case 'demand':
      return ctx.fillRate !== undefined && rule.minFillRate !== undefined && ctx.fillRate >= rule.minFillRate;
    case 'early-booking':
      return ctx.daysAhead !== undefined && rule.minDaysAhead !== undefined && ctx.daysAhead >= rule.minDaysAhead;
    case 'volume':
      return ctx.budget !== undefined && rule.minBudget !== undefined && ctx.budget >= rule.minBudget;
    case 'market':
      return true;
  }
}

/** The rules that could ever apply to a product, regardless of context. */
export function rulesForProduct(db: DbData, product: MediaProduct): PricingRule[] {
  return db.pricingRules
    .filter((r) => (r.engine === 'all' || r.engine === product.engine) && (!r.mediaProductIds?.length || r.mediaProductIds.includes(product.id)))
    .sort((a, b) => a.priority - b.priority);
}

/** The price of a product — or of one of its positions, which inherits the product's card. */
export function priceFor(db: DbData, target: MediaProduct | Position, ctx: PriceContext = {}): PriceBuildUp | undefined {
  const product = 'engine' in target ? target : db.mediaProducts.find((p) => p.id === target.mediaProductId);
  if (!product || !product.pricingBasis) return undefined;
  // Positions inherit the product's rate card: one price per product is
  // what the retailer sells, and what a booking locks.
  const listPrice = product.listPrice ?? 0;
  const floorPrice = product.floorPrice;
  const steps: PriceStep[] = [];
  let price = listPrice;
  for (const rule of rulesForProduct(db, product)) {
    if (!ruleApplies(rule, product, ctx)) continue;
    const after = round(price * rule.index, product.pricingBasis);
    steps.push({ rule, before: price, after });
    price = after;
  }
  return { basis: product.pricingBasis, listPrice, steps, price, floorPrice };
}

const round = (v: number, basis: PricingBasis) => (basis === 'cpc' ? Math.round(v * 100) / 100 : basis === 'cpm' ? Math.round(v * 10) / 10 : Math.round(v));

export function formatPrice(value: number, basis: PricingBasis): string {
  const n = basis === 'cpc' ? value.toFixed(2) : basis === 'cpm' ? value.toFixed(2).replace(/\.?0+$/, '') : Math.round(value).toLocaleString('en-US');
  return `€${n}`;
}

/** The ISO week key ("2026-W27") a date falls in. */
export function isoWeek(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00Z');
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = Date.UTC(d.getUTCFullYear(), 0, 1);
  const week = Math.ceil(((d.getTime() - yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

/** The fill rate of a position over a run time: booked over capacity, 0–1. */
export function fillRateFor(db: DbData, position: Position, from?: string, to?: string): number {
  const entries = db.availability.filter((a) => a.positionId === position.id);
  if (!entries.length || !position.dailyCapacity) return 0;
  const weeks = from && to ? weeksBetween(from, to) : entries.map((e) => e.week);
  const inRange = entries.filter((e) => weeks.includes(e.week));
  if (!inRange.length) return 0;
  const booked = inRange.reduce((s, e) => s + e.booked, 0);
  return Math.min(1, booked / (inRange.length * position.dailyCapacity * 7));
}

export function weeksBetween(from: string, to: string): string[] {
  const out: string[] = [];
  const d = new Date(from + 'T00:00:00Z');
  const end = new Date(to + 'T00:00:00Z');
  while (d <= end) {
    const w = isoWeek(d.toISOString().slice(0, 10));
    if (!out.includes(w)) out.push(w);
    d.setUTCDate(d.getUTCDate() + 7);
  }
  const last = isoWeek(to);
  if (!out.includes(last)) out.push(last);
  return out;
}

// ── Hierarchy helpers ────────────────────────────────────────────────────

export const ENGINE_LABEL: Record<EngineId, string> = {
  display: 'Display',
  'sponsored-products': 'Sponsored products',
  'digital-instore': 'Digital in-store',
  'offline-instore': 'Offline in-store',
  offsite: 'Offsite',
};

export function placementsOf(db: DbData, productId: string) {
  return db.placements.filter((p) => p.mediaProductId === productId);
}

export function positionsOf(db: DbData, productId: string, placementId?: string | null) {
  return db.positions.filter((p) => p.mediaProductId === productId && (placementId === undefined ? true : (p.placementId ?? null) === placementId));
}

export function holdsFor(db: DbData, filter: { productId?: string; positionId?: string; bookingId?: string }): InventoryHold[] {
  const positionIds = filter.productId ? new Set(db.positions.filter((p) => p.mediaProductId === filter.productId).map((p) => p.id)) : undefined;
  return db.inventoryHolds.filter((h) =>
    (!filter.positionId || h.positionId === filter.positionId)
    && (!filter.bookingId || h.bookingId === filter.bookingId)
    && (!positionIds || positionIds.has(h.positionId)),
  );
}

/** A hold that has run past its expiry without confirmation reads as expired. */
export function effectiveHoldStatus(hold: InventoryHold, now = new Date()): InventoryHold['status'] {
  if (hold.status === 'held' && new Date(hold.expiresAt) < now) return 'expired';
  return hold.status;
}
