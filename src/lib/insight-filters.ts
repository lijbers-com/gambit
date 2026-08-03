/**
 * Which metrics a media plan is actually judged on.
 *
 * A plan's goal places it at a funnel stage, and that stage decides its KPI
 * framework (see funnelKpis in the create-media-plan wizard): an awareness plan
 * is measured on reach, frequency and CTR; a conversion plan on ROAS and sales.
 * This module maps that framework onto the metric keys the insight charts use,
 * so the Insights tab can open pre-filtered to the metrics that matter for the
 * plan instead of showing every chart the engine can produce.
 */

export type FunnelStage = 'Awareness' | 'Consideration' | 'Conversion';

/** Goal id (as stored on a media plan) → funnel stage. */
export const stageForGoal = (goal?: string): FunnelStage | undefined => {
  switch (goal) {
    case 'awareness':
      return 'Awareness';
    case 'consideration':
      return 'Consideration';
    case 'purchase':
    case 'loyalty':
      return 'Conversion';
    default:
      return undefined;
  }
};

/**
 * Metric keys per stage, following the funnel KPI framework:
 *
 *  - Awareness    media KPIs only — reach, frequency, impressions, CTR, viewability
 *  - Consideration adds the engagement metrics that show intent
 *  - Conversion   adds the sales metrics — ROAS, sales, conversions
 *
 * Spend is in every stage: a plan is always judged on what it cost.
 */
const stageMetricKeys: Record<FunnelStage, string[]> = {
  Awareness: ['spend', 'impressions', 'plays', 'reach', 'frequency', 'viewability', 'ctr', 'sov', 'stores'],
  Consideration: ['spend', 'impressions', 'plays', 'reach', 'frequency', 'viewability', 'ctr', 'clicks', 'cpc', 'sov', 'stores'],
  Conversion: ['spend', 'impressions', 'reach', 'ctr', 'clicks', 'cpc', 'conversions', 'roas', 'iroas', 'sales'],
};

/**
 * The metric keys this goal is judged on, narrowed to the ones the engine
 * actually reports. Returns every available key when the goal is unknown —
 * better to show all the data than to hide it on a guess.
 */
export function metricKeysForGoal(goal: string | undefined, availableKeys: string[]): string[] {
  const stage = stageForGoal(goal);
  if (!stage) return availableKeys;
  const wanted = stageMetricKeys[stage];
  const matched = availableKeys.filter((k) => wanted.includes(k));
  // Never filter down to nothing: if the engine and the stage don't overlap,
  // the honest answer is the full set rather than an empty tab.
  return matched.length > 0 ? matched : availableKeys;
}
