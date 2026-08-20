/**
 * The one forecast model, shared by every surface that predicts.
 *
 * The wizard shows what a plan should deliver before it exists; the plan
 * detail page shows the same prediction until the plan runs, then swaps to
 * actuals. Both must read from this module — two surfaces each inventing
 * their own estimate is how the numbers "reset" the moment a plan is created.
 *
 * The factors are the prototype's fixed delivery constants — the same ones
 * the detail page derives its per-engine actuals from — applied to budget
 * instead of spend. A forecast is a band, not a point: ±8% around the
 * midpoint, because "€8,208" promises a precision the model doesn't have.
 */

export const IMPRESSIONS_PER_EURO = 120;
export const CONVERSIONS_PER_EURO = 0.04;
/** ROAS at full delivery — the detail page's 2.4 base + 2.2 slope at spend=budget. */
export const ROAS_AT_FULL_DELIVERY = 4.6;

const BAND = 0.08;

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

/** What a budget should deliver, as ranges. Zero budget forecasts zero. */
export function planForecast(budget: number): PlanForecast {
  return {
    impressions: range(budget * IMPRESSIONS_PER_EURO),
    conversions: range(budget * CONVERSIONS_PER_EURO),
    roas: budget > 0 ? range(ROAS_AT_FULL_DELIVERY) : range(0),
  };
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
 */
export function forecastByEngine<T extends { name: string; budget: number }>(
  engines: T[],
  perEuro: number,
): Array<{ name: string; value: number }> {
  return engines.map((e) => ({ name: e.name, value: Math.round(e.budget * perEuro) }));
}
