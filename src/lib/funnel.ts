/**
 * The funnel → KPI framework, shared. The wizard picks goals and KPIs from
 * it, and the plan detail page reads the same maps back — so the KPI cards a
 * draft plan shows are the ones the wizard showed while it was being drafted,
 * not a second opinion.
 */

/** KPIs the plan is judged on per funnel stage. Awareness has no sales KPIs;
 *  Conversion has no standalone brand KPIs. */
export const funnelKpis: Record<string, { brand: string[]; media: string[]; sales: string[] }> = {
  Awareness: {
    brand: ['Top-of-mind awareness', 'Unaided brand/product awareness', 'Aided brand/product awareness', 'Ad recall', 'Category entry points', 'Brand associations & values'],
    media: ['Reach', 'Unique reach', 'Frequency', 'Average time on page', 'Scroll depth', 'Video completion rate', 'Click-through rate', 'CPM', 'Share of voice (category)', 'Post engagement rate'],
    sales: [],
  },
  Consideration: {
    brand: ['Brand/product consideration', 'Brand associations & values', 'Brand preference', 'Purchase intent'],
    media: ['Reach', 'Unique reach', 'Frequency', 'Average time on page', 'Scroll depth', 'Video completion rate', 'Click-through rate', 'CPM', 'Share of voice (category)', 'Post engagement rate', 'Conversion rate'],
    sales: ['Sales lift', 'Trial (new to product)', 'New to brand', 'New to category', 'Purchase frequency', 'Recipe saved to favourites (Allerhande only)'],
  },
  Conversion: {
    brand: [],
    media: ['Reach', 'Unique reach', 'Frequency', 'Average time on page', 'Scroll depth', 'Video completion rate', 'Click-through rate', 'CPM', 'Share of voice (category)', 'Post engagement rate', 'Conversion rate'],
    sales: ['Sales lift', 'Incremental ROAS', 'Sales online', 'Sales offline', 'New to brand', 'New to category', 'Sales driver: existing customers', 'Sales per customer', 'CLV', 'Redemption (loyalty product only)', 'Basket size (SIS only)', 'Share of basket (SIS only)', 'Trial (new to product)', 'Repeat', 'Purchase frequency', 'Win-back customers'],
  },
};

/** Which funnel stage each goal belongs to. Purchase and Loyalty are both
 *  Conversion-stage goals. */
export const stageForGoal: Record<string, string> = {
  awareness: 'Awareness',
  consideration: 'Consideration',
  purchase: 'Conversion',
  loyalty: 'Conversion',
};

/** Demo estimates for the headline KPIs surfaced as metric cards. Only KPIs
 *  with an estimate here are promoted to a card. */
export const kpiEstimates: Record<string, { value: string; sub: string }> = {
  // Rounded, shared-suffix range — "19.9M–23.3M" was the one value wide
  // enough to truncate at the card's minimum width, and an estimate does
  // not earn a decimal anyway.
  'Reach': { value: '20–23M', sub: 'Estimated reach' },
  'Frequency': { value: '3.1–3.7', sub: 'Avg. per shopper' },
  'CTR': { value: '0.77–0.91%', sub: 'vs. 0.7% target' },
  'CPM': { value: '€4.14–4.86', sub: 'Blended' },
  'VCR': { value: '63–73%', sub: 'Video completion' },
  'Conversion rate': { value: '1.9–2.3%', sub: 'Estimated' },
  'Incremental ROAS': { value: '3.5–4.1×', sub: 'Incremental' },
  'Sales lift': { value: '+10–14%', sub: 'vs. baseline' },
};

/**
 * The stage's KPI estimate cards, in framework order, capped at four — the
 * same derivation everywhere, so the wizard's row and the draft plan's row
 * carry the same extra cards.
 */
export function stageEstimateKpis(stage: string | undefined): string[] {
  const k = stage ? funnelKpis[stage] : undefined;
  if (!k) return [];
  return [...k.media, ...k.sales].filter((name) => kpiEstimates[name]).slice(0, 4);
}

/**
 * What a goal actually buys with, beyond its KPIs: the delivery strategies it
 * is steered by, and the propositions that can serve it. Keyed by GOAL rather
 * than by stage — Purchase and Loyalty are both Conversion-stage, but they buy
 * differently.
 */
export const goalStrategies: Record<string, string[]> = {
  awareness: ['Maximise reach', 'Maximise viewable impressions', 'Target CPM', 'Frequency capping', 'Share of voice'],
  consideration: ['Maximise clicks', 'Target CPC', 'Maximise engagement', 'Video completion', 'Audience expansion'],
  purchase: ['Maximise conversions', 'Target ROAS', 'Target CPA', 'Keyword bidding', 'Basket-based retargeting'],
  loyalty: ['Retention audiences', 'Repeat-purchase optimisation', 'Win-back targeting', 'Loyalty-segment bidding'],
};

/** Propositions that can carry a goal, as engine ids. */
export const goalPropositions: Record<string, string[]> = {
  awareness: ['display', 'offsite', 'digital-instore', 'offline-instore'],
  consideration: ['display', 'offsite', 'digital-instore', 'sponsored-products'],
  purchase: ['sponsored-products', 'display', 'digital-instore', 'offline-instore'],
  loyalty: ['sponsored-products', 'offsite', 'offline-instore'],
};
