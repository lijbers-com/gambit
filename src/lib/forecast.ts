import type { DbData, EngineId, MediaProduct } from './db/types';
import { DELIVERY_RATES } from './db/performance';
import { seedData } from './db/seed';

/**
 * The one forecast model, shared by every surface that predicts.
 *
 * The wizard shows what a plan should deliver before it exists; the plan
 * detail page shows the same prediction until the plan runs, then swaps to
 * actuals. Both must read from this module — two surfaces each inventing
 * their own estimate is how the numbers "reset" the moment a plan is created.
 *
 * A forecast is the performance model (lib/db/performance.ts) applied to
 * BUDGET instead of spend: what a booking would deliver if it spent its whole
 * budget at its proposition's list price. Per proposition that is worked out
 * from the media products on the rate card (the database) and the model's
 * DELIVERY_RATES, by exactly the rules bookingTotals uses:
 *
 *   cpm            impressions = € / CPM × 1000, purchases per mille
 *   cpc            clicks = € / CPC, impressions = clicks / CTR, purchases = clicks × CVR
 *   offline POS    impressions = € / base reach CPM × 1000 (AH's reach pricing)
 *   sales          purchases × order value;  ROAS = sales / €
 *
 * A proposition's yield is the mean over its active products that the model
 * can price. A plan without a split forecasts at the blend of the
 * propositions, weighted by how the platform's booked budget is spread across
 * them (equal weights when nothing is booked yet). Nothing here is a fixed
 * per-euro figure; the only numbers are the band below.
 *
 * Pass the live database (useDb()) wherever there is one. Without it the
 * forecast reads the seeded rate card — never getDb() during render, which
 * reads localStorage and would make the server and the first client render
 * disagree.
 *
 * A forecast is a band, not a point: ±8% around the midpoint, because
 * "€8,208" promises a precision the model doesn't have.
 */

const BAND = 0.08;
const ENGINES: EngineId[] = ['display', 'sponsored-products', 'digital-instore', 'offline-instore', 'offsite'];

/** What one euro of budget buys on a proposition, per the performance model. */
export interface EngineYield {
  impressionsPerEuro: number;
  conversionsPerEuro: number;
  /** Sales per euro — the ROAS at full delivery. */
  roas: number;
}

const ZERO_YIELD: EngineYield = { impressionsPerEuro: 0, conversionsPerEuro: 0, roas: 0 };

/** One product's yield per euro at its list price, or undefined when the
 *  model cannot turn its pricing basis into delivery. */
function productYield(engine: EngineId, p: MediaProduct): EngineYield | undefined {
  const r = DELIVERY_RATES[engine];
  const price = p.listPrice ?? 0;
  let impressions = 0;
  let conversions = 0;
  if (p.pricingBasis === 'cpc' && price > 0) {
    const clicks = 1 / price;
    // Offsite click-bought media (Demand Gen) runs at 1% CTR in the model.
    const ctr = engine === 'offsite' ? 0.01 : r.ctr;
    impressions = ctr > 0 ? clicks / ctr : 0;
    conversions = clicks * r.cvr;
  } else if (engine === 'offline-instore') {
    impressions = 1000 / (r.reachCpm ?? 17);
    conversions = (impressions / 1000) * r.conversionsPerMille;
  } else if (p.pricingBasis === 'cpm' && price > 0) {
    impressions = 1000 / price;
    conversions = (impressions / 1000) * r.conversionsPerMille;
  } else {
    return undefined;
  }
  return { impressionsPerEuro: impressions, conversionsPerEuro: conversions, roas: conversions * r.orderValue };
}

/** A proposition's yield per euro: the mean over its active rate-card products. */
export function engineYield(engine: EngineId, db: DbData = seedData): EngineYield {
  const yields = db.mediaProducts
    .filter((p) => p.engine === engine && p.status !== 'archived' && p.status !== 'draft')
    .map((p) => productYield(engine, p))
    .filter((y): y is EngineYield => !!y);
  if (!yields.length) return ZERO_YIELD;
  const mean = (k: keyof EngineYield) => yields.reduce((s, y) => s + y[k], 0) / yields.length;
  return { impressionsPerEuro: mean('impressionsPerEuro'), conversionsPerEuro: mean('conversionsPerEuro'), roas: mean('roas') };
}

/** Accepts an engine id or its label ("Sponsored products", "Digital in-store"). */
function engineIdOf(key: string | undefined): EngineId | undefined {
  if (!key) return undefined;
  const k = key.toLowerCase().replace(/in[-\s]?store/g, 'instore').replace(/[\s_]+/g, '-');
  return ENGINES.find((e) => e === k);
}

/** The blend for a budget with no split: propositions weighted by the
 *  platform's booked budget, equal weights when nothing is booked. */
function blendedYield(db: DbData): EngineYield {
  const weights = ENGINES.map((engine) => {
    const ids = new Set(db.campaigns.filter((c) => c.engine === engine).map((c) => c.id));
    return db.bookings.filter((b) => b.status !== 'draft' && ids.has(b.campaignId)).reduce((s, b) => s + b.budget, 0);
  });
  const total = weights.reduce((s, w) => s + w, 0);
  const share = (i: number) => (total > 0 ? weights[i] / total : 1 / ENGINES.length);
  return ENGINES.reduce<EngineYield>((acc, engine, i) => {
    const y = engineYield(engine, db);
    return {
      impressionsPerEuro: acc.impressionsPerEuro + y.impressionsPerEuro * share(i),
      conversionsPerEuro: acc.conversionsPerEuro + y.conversionsPerEuro * share(i),
      roas: acc.roas + y.roas * share(i),
    };
  }, ZERO_YIELD);
}

export interface ForecastRange {
  low: number;
  high: number;
  mid: number;
}

const range = (mid: number): ForecastRange => ({ low: mid * (1 - BAND), high: mid * (1 + BAND), mid });

export interface PlanForecast {
  impressions: ForecastRange;
  conversions: ForecastRange;
  roas: ForecastRange;
}

/** A budget split over propositions, by engine id or proposition label. */
export interface ForecastSplit {
  engine?: string;
  name?: string;
  budget: number;
}

/**
 * What a budget should deliver, as ranges. Given a split, each proposition's
 * share is forecast at its own yield (ROAS is then budget-weighted); without
 * one, at the platform blend. Zero budget forecasts zero.
 */
export function planForecast(budget: number, split?: ForecastSplit[], db: DbData = seedData): PlanForecast {
  if (budget <= 0) return { impressions: range(0), conversions: range(0), roas: range(0) };
  const parts = (split ?? [])
    .map((s) => ({ engine: engineIdOf(s.engine) ?? engineIdOf(s.name), budget: s.budget }))
    .filter((s): s is { engine: EngineId; budget: number } => !!s.engine && s.budget > 0);
  const splitTotal = parts.reduce((s, p) => s + p.budget, 0);
  if (!parts.length || splitTotal <= 0) {
    const y = blendedYield(db);
    return {
      impressions: range(budget * y.impressionsPerEuro),
      conversions: range(budget * y.conversionsPerEuro),
      roas: range(y.roas),
    };
  }
  // Scale the split to the budget being forecast.
  const f = budget / splitTotal;
  let impressions = 0;
  let conversions = 0;
  let sales = 0;
  for (const p of parts) {
    const y = engineYield(p.engine, db);
    impressions += p.budget * f * y.impressionsPerEuro;
    conversions += p.budget * f * y.conversionsPerEuro;
    sales += p.budget * f * y.roas;
  }
  return { impressions: range(impressions), conversions: range(conversions), roas: range(sales / budget) };
}

/** "610.0K–720.0K" — both ends formatted the same way, unit stated once. */
export function fmtForecastRange(r: ForecastRange, fmt: (n: number) => string, unit = ''): string {
  return `${fmt(r.low)}–${fmt(r.high)}${unit}`;
}

/**
 * A count range for a metric card: "552–648K", "2.2–2.6M", "184–216". One
 * magnitude suffix for the whole range — repeating it on both ends made the
 * string too wide for the card and it truncated to "552.0K–64…".
 */
export function fmtForecastCount(r: ForecastRange): string {
  const unit = r.high >= 1_000_000 ? 1_000_000 : r.high >= 1000 ? 1000 : 1;
  const suffix = unit === 1_000_000 ? 'M' : unit === 1000 ? 'K' : '';
  const f = (n: number) => {
    const v = n / unit;
    return v >= 100 || unit === 1 ? String(Math.round(v)) : v.toFixed(1).replace(/\.0$/, '');
  };
  return `${f(r.low)}–${f(r.high)}${suffix}`;
}

/**
 * The forecast split across a plan's engines, for the donut and bar
 * breakdowns — midpoints, because a chart of ranges is unreadable. Sums back
 * to (the midpoint of) the headline, the same invariant the actuals keep.
 *
 * `perEuro` is either one figure for every engine, or the yield to read per
 * engine ('impressionsPerEuro' | 'conversionsPerEuro'), which then comes from
 * each engine's own rate card.
 */
export function forecastByEngine<T extends { name: string; budget: number; engine?: string }>(
  engines: T[],
  perEuro: number | 'impressionsPerEuro' | 'conversionsPerEuro',
  db?: DbData,
): Array<{ name: string; value: number }> {
  return engines.map((e) => {
    if (typeof perEuro === 'number') return { name: e.name, value: Math.round(e.budget * perEuro) };
    const id = engineIdOf(e.engine) ?? engineIdOf(e.name);
    const y = id ? engineYield(id, db ?? seedData) : ZERO_YIELD;
    return { name: e.name, value: Math.round(e.budget * y[perEuro]) };
  });
}
