import * as React from 'react';
import type { MetricDefinition } from '@/components/ui/metric-row';
import { useDb } from '@/lib/db/hooks';
import type { DbData, EngineId } from '@/lib/db/types';
import {
  BENCHMARKS,
  activeWindow,
  availableTime,
  liveStores,
  previousPeriod,
  ratesOf,
  seriesFor,
  shareOfVoice,
  totalsFor,
  type PerformanceScope,
  type Rates,
  type Totals,
} from '@/lib/db/performance';

/**
 * The metric cards of a proposition — the same keys and labels at every
 * level (overview, campaign, booking) so a user drilling in sees the same
 * row, with the values of what is in view.
 *
 * Every value comes from the performance model (lib/db/performance.ts): the
 * sum of the bookings in scope, up to the prototype's today. A card compares
 * with the period before when the scope has dates, else with the
 * proposition's benchmark. Nothing here is a fixed figure.
 */

/** Engine type strings used at the call sites. Both "digital-instore" and
 *  "digital in-store" are accepted; anything unknown reads as all. */
export type EngineType = EngineId | 'all' | string;

const normaliseEngine = (e: string): EngineId | 'all' => {
  const k = e.toLowerCase().replace(/in[-\s]?store/g, 'instore').replace(/[\s_]+/g, '-');
  return (['display', 'sponsored-products', 'digital-instore', 'offline-instore', 'offsite'] as const).find((x) => x === k) ?? 'all';
};

const CARDS: Record<EngineId | 'all', string[]> = {
  'sponsored-products': ['spend', 'roas', 'sales', 'clicks', 'conversions', 'ctr', 'cpc'],
  display: ['spend', 'impressions', 'reach', 'ctr', 'roas', 'frequency', 'viewability'],
  'digital-instore': ['spend', 'plays', 'impressions', 'reach', 'availableTime', 'roas'],
  'offline-instore': ['spend', 'stores', 'reach', 'sales', 'iroas', 'sov'],
  offsite: ['spend', 'impressions', 'reach', 'buyerReach', 'roas', 'frequency'],
  all: ['spend', 'roas', 'impressions', 'conversions', 'ctr'],
};

// ── Formatting ──────────────────────────────────────────────────────────

export const fmtEuro = (n: number): string =>
  n >= 1_000_000 ? `€${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `€${(n / 1000).toFixed(1)}K` : `€${Math.round(n).toLocaleString('en-GB')}`;
export const fmtCount = (n: number): string =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(1)}K` : Math.round(n).toLocaleString('en-GB');
const pct = (n: number, digits = 0) => `${(n * 100).toFixed(digits)}%`;

/** "+12%" / "-4%" — the change from the period before. */
function change(now: number, before: number | undefined): string | undefined {
  if (before === undefined || before <= 0) return undefined;
  const d = Math.round(((now - before) / before) * 100);
  return `${d > 0 ? '+' : ''}${d}%`;
}

const variantOf = (delta: string | undefined, lowerIsBetter = false): MetricDefinition['badgeVariant'] => {
  if (!delta) return 'secondary';
  const up = !delta.startsWith('-') && delta !== '+0%' && delta !== '0%';
  return up !== lowerIsBetter ? 'success' : 'warning';
};

// ── Cards ───────────────────────────────────────────────────────────────

interface CardSpec {
  label: string;
  /** The number behind the card — also what its chart plots per week. */
  value: (t: Totals, r: Rates) => number;
  format: (n: number) => string;
  sub: (t: Totals, r: Rates, engine: EngineId | 'all') => string;
  /** Rates compare with the benchmark; volumes with the period before. */
  target?: (engine: EngineId) => number;
  lowerIsBetter?: boolean;
}

const SPECS: Record<string, CardSpec> = {
  spend:       { label: 'Spend', value: (t) => t.spend, format: fmtEuro, sub: (t) => `of ${fmtEuro(t.budget)} budget` },
  roas:        { label: 'ROAS', value: (_, r) => r.roas, format: (n) => pct(n), sub: (_, __, e) => e === 'all' ? 'weighted avg' : `vs. ${pct(BENCHMARKS[e].roas)} target`, target: (e) => BENCHMARKS[e].roas },
  iroas:       { label: 'iROAS', value: (_, r) => r.iroas, format: (n) => pct(n), sub: (_, __, e) => e === 'all' ? 'incremental' : `vs. ${pct(BENCHMARKS[e].iroas)} target`, target: (e) => BENCHMARKS[e].iroas },
  sales:       { label: 'Sales', value: (t) => t.sales, format: fmtEuro, sub: () => 'attributed' },
  clicks:      { label: 'Clicks', value: (t) => t.clicks, format: fmtCount, sub: () => 'to the product page' },
  conversions: { label: 'Conversions', value: (t) => t.conversions, format: fmtCount, sub: (_, r, e) => e === 'sponsored-products' && r.cvr > 0 ? `${pct(r.cvr, 1)} CVR` : 'attributed' },
  ctr:         { label: 'CTR', value: (_, r) => r.ctr, format: (n) => pct(n, 2), sub: (_, __, e) => e === 'all' ? 'blended' : `vs. ${pct(BENCHMARKS[e].ctr, 1)} target`, target: (e) => BENCHMARKS[e].ctr },
  cpc:         { label: 'CPC', value: (_, r) => r.cpc, format: (n) => `€${n.toFixed(2)}`, sub: (_, __, e) => e === 'all' ? 'blended' : `vs. €${BENCHMARKS[e].cpc.toFixed(2)} target`, target: (e) => BENCHMARKS[e].cpc, lowerIsBetter: true },
  impressions: { label: 'Impressions', value: (t) => t.impressions, format: fmtCount, sub: (_, __, e) => e === 'digital-instore' ? 'estimated' : e === 'all' ? 'across propositions' : 'served' },
  reach:       { label: 'Reach', value: (t) => t.reach, format: fmtCount, sub: (_, __, e) => e === 'digital-instore' || e === 'offline-instore' ? 'unique shoppers' : 'unique users' },
  buyerReach:  { label: 'Buyer reach', value: (t) => t.conversions * 0.85, format: fmtCount, sub: () => 'buyers reached' },
  frequency:   { label: 'Frequency', value: (_, r) => r.frequency, format: (n) => `${n.toFixed(1)}x`, sub: () => 'avg per person', target: (e) => BENCHMARKS[e].frequency, lowerIsBetter: true },
  viewability: { label: 'Viewability', value: (_, r) => r.viewability, format: (n) => pct(n, 1), sub: (_, __, e) => e === 'all' ? 'in view' : `vs. ${pct(BENCHMARKS[e].viewability)} target`, target: (e) => BENCHMARKS[e].viewability },
  plays:       { label: 'Plays', value: (t) => t.plays, format: fmtCount, sub: () => 'across loops' },
};

const LABEL_OVERRIDES: Partial<Record<EngineId, Record<string, string>>> = {
  'digital-instore': { reach: 'Shopper reach' },
  'offline-instore': { reach: 'Shopper reach', sales: 'Incremental sales' },
};

export interface PropositionMetricOptions {
  /** Weekly chart under each card (MetricRow's expand panel). Default on. */
  charts?: boolean;
}

/**
 * The cards for a proposition (or 'all') over a scope: the bookings of a
 * media plan, a campaign, a booking, a filter, a date range.
 */
export function propositionMetrics(
  db: DbData,
  engineType: EngineType,
  scope: PerformanceScope = {},
  { charts = true }: PropositionMetricOptions = {},
): MetricDefinition[] {
  const engine = normaliseEngine(engineType);
  const s: PerformanceScope = engine === 'all' ? scope : { ...scope, engine };
  const t = totalsFor(db, s);
  const r = ratesOf(t);
  const prevScope = previousPeriod(s);
  const prev = prevScope ? totalsFor(db, prevScope) : undefined;
  const series = charts ? seriesFor(db, { ...s, ...activeWindow(db, s) }, 'week') : [];

  return CARDS[engine].map((key): MetricDefinition => {
    const label = (engine !== 'all' && LABEL_OVERRIDES[engine]?.[key]) || SPECS[key]?.label || key;
    if (key === 'spend') {
      return {
        key, label, value: fmtEuro(t.spend), subMetric: `of ${fmtEuro(t.budget)} budget`,
        badgeValue: t.budget > 0 ? `${Math.round(r.pacing * 100)}%` : undefined, badgeVariant: 'secondary',
        chartData: series.map((p) => ({ day: p.label, value: Math.round(p.totals.spend) })),
      };
    }
    if (key === 'stores') {
      const live = liveStores(db, s);
      return { key, label: 'Stores', value: fmtCount(live), subMetric: 'live today', badgeVariant: 'secondary' };
    }
    if (key === 'sov') {
      const sov = shareOfVoice(db, s);
      return { key, label: 'SOV', value: pct(sov), subMetric: 'of booked inventory', badgeVariant: 'secondary' };
    }
    if (key === 'availableTime') {
      const free = availableTime(db, s);
      return { key, label, value: pct(free), subMetric: 'of loop time free', badgeValue: free < 0.2 ? 'Tight' : 'Healthy', badgeVariant: free < 0.2 ? 'warning' : 'info' };
    }
    const spec = SPECS[key];
    const valueOf = (tt: Totals) => (key === 'sales' && engine === 'offline-instore' ? tt.incrementalSales : spec.value(tt, ratesOf(tt)));
    const now = valueOf(t);
    let badge: string | undefined;
    if (spec.target && engine !== 'all') {
      const target = spec.target(engine);
      badge = target > 0 && t.spend > 0 ? change(now, target) : undefined;
    } else if (prev) {
      badge = change(now, valueOf(prev));
    }
    return {
      key,
      label,
      value: t.spend > 0 || key === 'impressions' ? spec.format(now) : '—',
      subMetric: spec.sub(t, r, engine),
      badgeValue: badge,
      badgeVariant: variantOf(badge, spec.lowerIsBetter),
      chartData: series.map((p) => ({ day: p.label, value: Math.round(valueOf(p.totals) * (now < 10 ? 100 : 1)) / (now < 10 ? 100 : 1) })),
    };
  });
}

/** propositionMetrics bound to the live store. */
export function usePropositionMetrics(
  engineType: EngineType,
  scope: PerformanceScope = {},
  options: PropositionMetricOptions = {},
): MetricDefinition[] {
  const db = useDb();
  const key = JSON.stringify(scope);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useMemo(() => propositionMetrics(db, engineType, scope, options), [db, engineType, key, options.charts]);
}
