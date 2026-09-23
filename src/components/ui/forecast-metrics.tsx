import type { MetricDefinition } from './metric-row';
import { planForecast, fmtForecastRange, fmtForecastCount } from '@/lib/forecast';
import { kpiEstimates, stageEstimateKpis } from '@/lib/funnel';

/**
 * The one forecast metric row — the wizard while a plan is being drafted, and
 * the plan detail page until the plan runs, both call this builder. That is
 * the whole point: the cards, their order and their numbers are
 * decided once, so moving from the wizard to the plan page changes nothing on
 * screen. When the plan goes live the detail page swaps to actuals and the
 * Forecast badges disappear — that swap is the only difference the two
 * moments are allowed to have.
 */

export interface ForecastEngineBudget {
  name: string;
  budget: number;
  color: string;
}

export interface ForecastMetricsInput {
  /** The plan's total budget. Zero or missing renders honest empty cards. */
  budget: number;
  /** Run-time length, for the €/day line under the budget. */
  days?: number;
  /** Planned budget per proposition. Kept on the input so callers need not
   *  change; the cards themselves stay numbers only — the split lives in
   *  the campaigns list and the plan card, not in a chart on the metric. */
  engines?: ForecastEngineBudget[];
  /** Funnel stage of the plan's goal; appends the stage's KPI estimate cards. */
  stage?: string;
  /** Spend to date. Given it, the first card is SPEND against the budget
   *  rather than the budget itself — for surfaces whose control panel already
   *  states the budget, so the row never repeats it. */
  spend?: number;
}

const fmtK = (n: number) => (n >= 1000 ? `€${(n / 1000).toFixed(1)}K` : `€${Math.round(n)}`);

export function buildForecastMetrics({ budget, days = 0, stage, spend }: ForecastMetricsInput): MetricDefinition[] {
  const noBudget = budget <= 0;
  const fc = planForecast(budget);
  const perDay = days > 0 ? `€${(budget / days).toFixed(0)}/day over ${days} days` : 'No dates set';
  // Surfaces that already state the budget elsewhere (a control panel) lead
  // with spend instead, so the row never says the same number twice.
  const leadsWithSpend = spend !== undefined;

  const forecastBadge = noBudget
    ? {}
    : { badgeValue: 'Forecast', badgeVariant: 'secondary' as const };

  return [
    {
      key: 'budget',
      label: leadsWithSpend ? 'Spend' : 'Budget',
      value: noBudget ? '-' : leadsWithSpend ? fmtK(spend as number) : fmtK(budget),
      subMetric: noBudget ? 'No budget set' : leadsWithSpend ? `of ${fmtK(budget)} budget` : perDay,
      ...forecastBadge,
    },
    {
      key: 'impressions',
      label: 'Impressions',
      value: noBudget ? '-' : fmtForecastCount(fc.impressions),
      subMetric: noBudget ? 'Set budget to forecast' : 'Expected over the full run time',
      ...forecastBadge,
    },
    {
      key: 'conversions',
      label: 'Conversions',
      value: noBudget ? '-' : fmtForecastCount(fc.conversions),
      subMetric: noBudget ? 'Set budget to forecast' : 'Expected over the full run time',
      ...forecastBadge,
    },
    {
      key: 'roas',
      label: 'ROAS',
      value: noBudget ? '-' : fmtForecastRange(fc.roas, (v) => String(Math.round(v * 100)), '%'),
      subMetric: noBudget ? 'Set budget to forecast' : 'Predicted return at full delivery',
      ...forecastBadge,
    },
    // The stage's KPI estimate cards — the same derivation on both surfaces.
    ...stageEstimateKpis(stage).map((name) => ({
      key: `kpi-${name}`,
      label: name,
      value: kpiEstimates[name].value,
      subMetric: kpiEstimates[name].sub,
    })),
  ];
}
