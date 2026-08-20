import * as React from 'react';
import type { MetricDefinition } from './metric-row';
import { BudgetStackedMini } from './card';
import { planForecast, fmtForecastRange, fmtForecastCount, forecastByEngine, IMPRESSIONS_PER_EURO, CONVERSIONS_PER_EURO } from '@/lib/forecast';
import { kpiEstimates, stageEstimateKpis } from '@/lib/funnel';

/**
 * The one forecast metric row — the wizard while a plan is being drafted, and
 * the plan detail page until the plan runs, both call this builder. That is
 * the whole point: the cards, their order, their charts and their numbers are
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
  /** Planned budget per proposition — when present the budget card gets its
   *  split bar and impressions/conversions their donuts. */
  engines?: ForecastEngineBudget[];
  /** Funnel stage of the plan's goal; appends the stage's KPI estimate cards. */
  stage?: string;
}

const fmtK = (n: number) => (n >= 1000 ? `€${(n / 1000).toFixed(1)}K` : `€${Math.round(n)}`);
const fmtCompact = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(Math.round(n));

export function buildForecastMetrics({ budget, days = 0, engines = [], stage }: ForecastMetricsInput): MetricDefinition[] {
  const noBudget = budget <= 0;
  const fc = planForecast(budget);
  const withEngines = !noBudget && engines.length > 0;
  const perDay = days > 0 ? `€${(budget / days).toFixed(0)}/day over ${days} days` : 'No dates set';

  const forecastBadge = noBudget
    ? {}
    : { badgeValue: 'Forecast', badgeVariant: 'secondary' as const };

  return [
    {
      key: 'budget',
      label: 'Budget',
      value: noBudget ? '-' : fmtK(budget),
      ...(noBudget
        ? { subMetric: 'No budget set' }
        : withEngines
          ? {
              // The split bar, with the pace as its caption — the two facts a
              // planned budget is made of.
              ...forecastBadge,
              variant: 'budgetStacked' as const,
              budgetData: engines.map((e) => ({ name: e.name, spent: e.budget, budget: e.budget, color: e.color })),
              valueFormatter: fmtK,
              chart: (
                <BudgetStackedMini
                  budgetData={engines.map((e) => ({ name: e.name, spent: e.budget, budget: e.budget, color: e.color }))}
                  caption={perDay}
                />
              ),
            }
          : { subMetric: perDay }),
    },
    {
      key: 'impressions',
      label: 'Impressions',
      value: noBudget ? '-' : fmtForecastCount(fc.impressions),
      subMetric: noBudget ? 'Set budget to forecast' : 'Expected over the full run time',
      ...forecastBadge,
      ...(withEngines
        ? {
            variant: 'donut' as const,
            donutData: forecastByEngine(engines, IMPRESSIONS_PER_EURO),
            donutColors: engines.map((e) => e.color),
            valueFormatter: fmtCompact,
          }
        : {}),
    },
    {
      key: 'conversions',
      label: 'Conversions',
      value: noBudget ? '-' : fmtForecastCount(fc.conversions),
      subMetric: noBudget ? 'Set budget to forecast' : 'Expected over the full run time',
      ...forecastBadge,
      ...(withEngines
        ? {
            variant: 'donut' as const,
            donutData: forecastByEngine(engines, CONVERSIONS_PER_EURO),
            donutColors: engines.map((e) => e.color),
            valueFormatter: fmtCompact,
          }
        : {}),
    },
    {
      key: 'roas',
      label: 'ROAS',
      value: noBudget ? '-' : fmtForecastRange(fc.roas, (v) => v.toFixed(1), 'x'),
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
