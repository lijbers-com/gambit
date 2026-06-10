import type { MetricDefinition } from '@/components/ui/metric-row';

/**
 * Per-proposition metric cards shared across three navigation scopes:
 *
 *  - `overview` — the channel's campaign-overview page
 *    (e.g. /campaigns/display), aggregating every campaign in the
 *    proposition.
 *  - `campaign` — a single campaign detail page
 *    (e.g. /campaigns/display/C-001), scoped to one campaign within
 *    that proposition.
 *  - `booking` — a single booking / line-item page
 *    (e.g. /campaigns/display/booking/LI-001), scoped to one booking
 *    within that campaign.
 *
 * The KEYS and LABELS are identical across all three scopes so the user
 * always sees the same row of cards regardless of where they drill in.
 * Only the VALUES change: absolute counts (Spend, Impressions, Reach,
 * Sales, Stores …) scale down as the scope narrows; rates (CTR, ROAS,
 * Frequency, Viewability, Available time, SOV) stay roughly constant
 * because they don't depend on volume.
 *
 * The numbers are illustrative — production binds them to the
 * advertiser × media-plan × date-range scope.
 */

export type PropositionScope = 'overview' | 'campaign' | 'booking';

/** Engine type strings used at the call sites. We accept both the
 *  hyphenated form ("digital-instore") and the spaced form
 *  ("digital in-store") so callers don't have to normalise. */
export type EngineType =
  | 'all'
  | 'sponsored products'
  | 'sponsored-products'
  | 'display'
  | 'digital in-store'
  | 'digital-instore'
  | 'digital instore'
  | 'offline instore'
  | 'offline-instore'
  | 'offsite'
  | string;

const normaliseEngine = (e: string): string =>
  e
    .toLowerCase()
    // Collapse "in store" / "in-store" → "instore" so both the spaced
    // ("digital in-store") and hyphenated ("digital-instore") forms map
    // to the same definition key.
    .replace(/in[-\s]?store/g, 'instore')
    .replace(/[\s_]+/g, '-');

/**
 * Per-channel × scope card definitions. Same label/key list per channel
 * so a user moving overview → campaign → booking sees the same row of
 * cards with scoped values, not a different set.
 */
const definitions: Record<string, Record<PropositionScope, MetricDefinition[]>> = {
  // ── Sponsored Products ────────────────────────────────────────────
  'sponsored-products': {
    overview: [
      { key: 'spend',       label: 'Spend',       value: '$42.8K', subMetric: 'of $60K budget',   badgeValue: '71%',  badgeVariant: 'secondary' },
      { key: 'roas',        label: 'ROAS',        value: '4.6x',   subMetric: 'vs. 3.5x target',  badgeValue: '+31%', badgeVariant: 'success'   },
      { key: 'sales',       label: 'Sales',       value: '$197K',  subMetric: 'attributed',       badgeValue: '+18%', badgeVariant: 'success'   },
      { key: 'clicks',      label: 'Clicks',      value: '128K',   subMetric: 'last 30d',         badgeValue: '+9%',  badgeVariant: 'success'   },
      { key: 'conversions', label: 'Conversions', value: '6.4K',   subMetric: '5.0% CVR',         badgeValue: '+12%', badgeVariant: 'success'   },
      { key: 'ctr',         label: 'CTR',         value: '2.34%',  subMetric: 'vs. 2.1% target',  badgeValue: '+11%', badgeVariant: 'success'   },
      { key: 'cpc',         label: 'CPC',         value: '$0.33',  subMetric: 'vs. $0.40 target', badgeValue: '-17%', badgeVariant: 'success'   },
    ],
    campaign: [
      { key: 'spend',       label: 'Spend',       value: '$9.5K',  subMetric: 'of $14K budget',   badgeValue: '68%',  badgeVariant: 'secondary' },
      { key: 'roas',        label: 'ROAS',        value: '4.4x',   subMetric: 'vs. 3.5x target',  badgeValue: '+26%', badgeVariant: 'success'   },
      { key: 'sales',       label: 'Sales',       value: '$42K',   subMetric: 'attributed',       badgeValue: '+14%', badgeVariant: 'success'   },
      { key: 'clicks',      label: 'Clicks',      value: '28K',    subMetric: 'last 30d',         badgeValue: '+7%',  badgeVariant: 'success'   },
      { key: 'conversions', label: 'Conversions', value: '1.4K',   subMetric: '5.0% CVR',         badgeValue: '+10%', badgeVariant: 'success'   },
      { key: 'ctr',         label: 'CTR',         value: '2.20%',  subMetric: 'vs. 2.1% target',  badgeValue: '+5%',  badgeVariant: 'success'   },
      { key: 'cpc',         label: 'CPC',         value: '$0.34',  subMetric: 'vs. $0.40 target', badgeValue: '-15%', badgeVariant: 'success'   },
    ],
    booking: [
      { key: 'spend',       label: 'Spend',       value: '$2.1K',  subMetric: 'of $3.2K budget',  badgeValue: '66%',  badgeVariant: 'secondary' },
      { key: 'roas',        label: 'ROAS',        value: '4.2x',   subMetric: 'vs. 3.5x target',  badgeValue: '+20%', badgeVariant: 'success'   },
      { key: 'sales',       label: 'Sales',       value: '$8.8K',  subMetric: 'attributed',       badgeValue: '+8%',  badgeVariant: 'success'   },
      { key: 'clicks',      label: 'Clicks',      value: '6.2K',   subMetric: 'last 30d',         badgeValue: '+5%',  badgeVariant: 'success'   },
      { key: 'conversions', label: 'Conversions', value: '310',    subMetric: '5.0% CVR',         badgeValue: '+6%',  badgeVariant: 'success'   },
      { key: 'ctr',         label: 'CTR',         value: '2.10%',  subMetric: 'vs. 2.1% target',  badgeValue: '0%',   badgeVariant: 'secondary' },
      { key: 'cpc',         label: 'CPC',         value: '$0.34',  subMetric: 'vs. $0.40 target', badgeValue: '-15%', badgeVariant: 'success'   },
    ],
  },

  // ── Display ───────────────────────────────────────────────────────
  'display': {
    overview: [
      { key: 'spend',       label: 'Spend',       value: '$58.3K', subMetric: 'of $80K budget',  badgeValue: '73%',     badgeVariant: 'secondary' },
      { key: 'impressions', label: 'Impressions', value: '12.4M',  subMetric: 'served',          badgeValue: '+14%',    badgeVariant: 'success'   },
      { key: 'reach',       label: 'Reach',       value: '2.8M',   subMetric: 'unique users',    badgeValue: '+8%',     badgeVariant: 'success'   },
      { key: 'ctr',         label: 'CTR',         value: '0.84%',  subMetric: 'vs. 0.7% target', badgeValue: '+20%',    badgeVariant: 'success'   },
      { key: 'roas',        label: 'ROAS',        value: '3.2x',   subMetric: 'vs. 2.8x target', badgeValue: '+14%',    badgeVariant: 'success'   },
      { key: 'frequency',   label: 'Frequency',   value: '4.4x',   subMetric: 'avg per user',    badgeValue: 'Optimal', badgeVariant: 'success'   },
      { key: 'viewability', label: 'Viewability', value: '87.3%',  subMetric: 'above bench.',    badgeValue: '+5%',     badgeVariant: 'success'   },
    ],
    campaign: [
      { key: 'spend',       label: 'Spend',       value: '$12.8K', subMetric: 'of $18K budget',  badgeValue: '71%',     badgeVariant: 'secondary' },
      { key: 'impressions', label: 'Impressions', value: '2.7M',   subMetric: 'served',          badgeValue: '+11%',    badgeVariant: 'success'   },
      { key: 'reach',       label: 'Reach',       value: '612K',   subMetric: 'unique users',    badgeValue: '+6%',     badgeVariant: 'success'   },
      { key: 'ctr',         label: 'CTR',         value: '0.81%',  subMetric: 'vs. 0.7% target', badgeValue: '+16%',    badgeVariant: 'success'   },
      { key: 'roas',        label: 'ROAS',        value: '3.1x',   subMetric: 'vs. 2.8x target', badgeValue: '+11%',    badgeVariant: 'success'   },
      { key: 'frequency',   label: 'Frequency',   value: '4.4x',   subMetric: 'avg per user',    badgeValue: 'Optimal', badgeVariant: 'success'   },
      { key: 'viewability', label: 'Viewability', value: '87.3%',  subMetric: 'above bench.',    badgeValue: '+5%',     badgeVariant: 'success'   },
    ],
    booking: [
      { key: 'spend',       label: 'Spend',       value: '$2.8K',  subMetric: 'of $4K budget',   badgeValue: '70%',     badgeVariant: 'secondary' },
      { key: 'impressions', label: 'Impressions', value: '596K',   subMetric: 'served',          badgeValue: '+8%',     badgeVariant: 'success'   },
      { key: 'reach',       label: 'Reach',       value: '134K',   subMetric: 'unique users',    badgeValue: '+4%',     badgeVariant: 'success'   },
      { key: 'ctr',         label: 'CTR',         value: '0.79%',  subMetric: 'vs. 0.7% target', badgeValue: '+13%',    badgeVariant: 'success'   },
      { key: 'roas',        label: 'ROAS',        value: '3.0x',   subMetric: 'vs. 2.8x target', badgeValue: '+7%',     badgeVariant: 'success'   },
      { key: 'frequency',   label: 'Frequency',   value: '4.4x',   subMetric: 'avg per user',    badgeValue: 'Optimal', badgeVariant: 'success'   },
      { key: 'viewability', label: 'Viewability', value: '87.3%',  subMetric: 'above bench.',    badgeValue: '+5%',     badgeVariant: 'success'   },
    ],
  },

  // ── Digital In-Store ──────────────────────────────────────────────
  'digital-instore': {
    overview: [
      { key: 'spend',         label: 'Spend',          value: '$24.6K', subMetric: 'of $35K budget',  badgeValue: '70%',     badgeVariant: 'secondary' },
      { key: 'plays',         label: 'Plays',          value: '186K',   subMetric: 'across loops',    badgeValue: '+22%',    badgeVariant: 'success'   },
      { key: 'impressions',   label: 'Impressions',    value: '3.1M',   subMetric: 'estimated',       badgeValue: '+11%',    badgeVariant: 'success'   },
      { key: 'reach',         label: 'Shopper reach',  value: '1.4M',   subMetric: 'unique shoppers', badgeValue: '+9%',     badgeVariant: 'success'   },
      { key: 'availableTime', label: 'Available time', value: '38%',    subMetric: 'of weekly loops', badgeValue: 'Healthy', badgeVariant: 'info'      },
      { key: 'roas',          label: 'ROAS',           value: '2.4x',   subMetric: 'vs. 2.0x target', badgeValue: '+20%',    badgeVariant: 'success'   },
    ],
    campaign: [
      { key: 'spend',         label: 'Spend',          value: '$5.4K',  subMetric: 'of $7.5K budget', badgeValue: '72%',     badgeVariant: 'secondary' },
      { key: 'plays',         label: 'Plays',          value: '41K',    subMetric: 'across loops',    badgeValue: '+17%',    badgeVariant: 'success'   },
      { key: 'impressions',   label: 'Impressions',    value: '682K',   subMetric: 'estimated',       badgeValue: '+8%',     badgeVariant: 'success'   },
      { key: 'reach',         label: 'Shopper reach',  value: '308K',   subMetric: 'unique shoppers', badgeValue: '+6%',     badgeVariant: 'success'   },
      { key: 'availableTime', label: 'Available time', value: '38%',    subMetric: 'of weekly loops', badgeValue: 'Healthy', badgeVariant: 'info'      },
      { key: 'roas',          label: 'ROAS',           value: '2.3x',   subMetric: 'vs. 2.0x target', badgeValue: '+15%',    badgeVariant: 'success'   },
    ],
    booking: [
      { key: 'spend',         label: 'Spend',          value: '$1.2K',  subMetric: 'of $1.7K budget', badgeValue: '71%',     badgeVariant: 'secondary' },
      { key: 'plays',         label: 'Plays',          value: '9.2K',   subMetric: 'across loops',    badgeValue: '+12%',    badgeVariant: 'success'   },
      { key: 'impressions',   label: 'Impressions',    value: '152K',   subMetric: 'estimated',       badgeValue: '+6%',     badgeVariant: 'success'   },
      { key: 'reach',         label: 'Shopper reach',  value: '68K',    subMetric: 'unique shoppers', badgeValue: '+4%',     badgeVariant: 'success'   },
      { key: 'availableTime', label: 'Available time', value: '38%',    subMetric: 'of weekly loops', badgeValue: 'Healthy', badgeVariant: 'info'      },
      { key: 'roas',          label: 'ROAS',           value: '2.2x',   subMetric: 'vs. 2.0x target', badgeValue: '+10%',    badgeVariant: 'success'   },
    ],
  },

  // ── Offline In-Store ──────────────────────────────────────────────
  'offline-instore': {
    overview: [
      { key: 'spend',  label: 'Spend',             value: '$31.5K', subMetric: 'of $45K budget', badgeValue: '70%',    badgeVariant: 'secondary' },
      { key: 'stores', label: 'Stores',            value: '482',    subMetric: 'live in window', badgeValue: '+12%',   badgeVariant: 'success'   },
      { key: 'reach',  label: 'Shopper reach',     value: '6.2M',   subMetric: 'estimated POS',  badgeValue: '+8%',    badgeVariant: 'success'   },
      { key: 'sales',  label: 'Incremental sales', value: '$294K',  subMetric: 'attributed',     badgeValue: '+22%',   badgeVariant: 'success'   },
      { key: 'iroas',  label: 'iROAS',             value: '2.1x',   subMetric: 'vs. 1.8x target',badgeValue: '+17%',   badgeVariant: 'success'   },
      { key: 'sov',    label: 'SOV',               value: '38%',    subMetric: 'in category',    badgeValue: '+4 pts', badgeVariant: 'secondary' },
    ],
    campaign: [
      { key: 'spend',  label: 'Spend',             value: '$6.9K',  subMetric: 'of $10K budget', badgeValue: '69%',    badgeVariant: 'secondary' },
      { key: 'stores', label: 'Stores',            value: '343',    subMetric: 'live in window', badgeValue: '+9%',    badgeVariant: 'success'   },
      { key: 'reach',  label: 'Shopper reach',     value: '1.4M',   subMetric: 'estimated POS',  badgeValue: '+6%',    badgeVariant: 'success'   },
      { key: 'sales',  label: 'Incremental sales', value: '$66K',   subMetric: 'attributed',     badgeValue: '+17%',   badgeVariant: 'success'   },
      { key: 'iroas',  label: 'iROAS',             value: '2.1x',   subMetric: 'vs. 1.8x target',badgeValue: '+17%',   badgeVariant: 'success'   },
      { key: 'sov',    label: 'SOV',               value: '38%',    subMetric: 'in category',    badgeValue: '+4 pts', badgeVariant: 'secondary' },
    ],
    booking: [
      { key: 'spend',  label: 'Spend',             value: '$1.5K',  subMetric: 'of $2.2K budget',badgeValue: '68%',    badgeVariant: 'secondary' },
      { key: 'stores', label: 'Stores',            value: '124',    subMetric: 'live in window', badgeValue: '+5%',    badgeVariant: 'success'   },
      { key: 'reach',  label: 'Shopper reach',     value: '308K',   subMetric: 'estimated POS',  badgeValue: '+3%',    badgeVariant: 'success'   },
      { key: 'sales',  label: 'Incremental sales', value: '$14K',   subMetric: 'attributed',     badgeValue: '+12%',   badgeVariant: 'success'   },
      { key: 'iroas',  label: 'iROAS',             value: '2.0x',   subMetric: 'vs. 1.8x target',badgeValue: '+11%',   badgeVariant: 'success'   },
      { key: 'sov',    label: 'SOV',               value: '38%',    subMetric: 'in category',    badgeValue: '+4 pts', badgeVariant: 'secondary' },
    ],
  },

  // ── Offsite ───────────────────────────────────────────────────────
  'offsite': {
    overview: [
      { key: 'spend',       label: 'Spend',       value: '$67.1K', subMetric: 'of $90K budget',  badgeValue: '75%',     badgeVariant: 'secondary' },
      { key: 'impressions', label: 'Impressions', value: '24.6M',  subMetric: 'served',          badgeValue: '+16%',    badgeVariant: 'success'   },
      { key: 'reach',       label: 'Reach',       value: '5.4M',   subMetric: 'unique users',    badgeValue: '+13%',    badgeVariant: 'success'   },
      { key: 'buyerReach',  label: 'Buyer reach', value: '1.1M',   subMetric: 'qualified buyers',badgeValue: '+9%',     badgeVariant: 'success'   },
      { key: 'roas',        label: 'ROAS',        value: '2.7x',   subMetric: 'vs. 2.5x target', badgeValue: '+8%',     badgeVariant: 'success'   },
      { key: 'frequency',   label: 'Frequency',   value: '4.6x',   subMetric: 'avg per user',    badgeValue: 'Optimal', badgeVariant: 'success'   },
    ],
    campaign: [
      { key: 'spend',       label: 'Spend',       value: '$14.8K', subMetric: 'of $20K budget',  badgeValue: '74%',     badgeVariant: 'secondary' },
      { key: 'impressions', label: 'Impressions', value: '5.4M',   subMetric: 'served',          badgeValue: '+12%',    badgeVariant: 'success'   },
      { key: 'reach',       label: 'Reach',       value: '1.2M',   subMetric: 'unique users',    badgeValue: '+9%',     badgeVariant: 'success'   },
      { key: 'buyerReach',  label: 'Buyer reach', value: '246K',   subMetric: 'qualified buyers',badgeValue: '+6%',     badgeVariant: 'success'   },
      { key: 'roas',        label: 'ROAS',        value: '2.6x',   subMetric: 'vs. 2.5x target', badgeValue: '+4%',     badgeVariant: 'success'   },
      { key: 'frequency',   label: 'Frequency',   value: '4.6x',   subMetric: 'avg per user',    badgeValue: 'Optimal', badgeVariant: 'success'   },
    ],
    booking: [
      { key: 'spend',       label: 'Spend',       value: '$3.3K',  subMetric: 'of $4.6K budget', badgeValue: '72%',     badgeVariant: 'secondary' },
      { key: 'impressions', label: 'Impressions', value: '1.2M',   subMetric: 'served',          badgeValue: '+8%',     badgeVariant: 'success'   },
      { key: 'reach',       label: 'Reach',       value: '264K',   subMetric: 'unique users',    badgeValue: '+5%',     badgeVariant: 'success'   },
      { key: 'buyerReach',  label: 'Buyer reach', value: '54K',    subMetric: 'qualified buyers',badgeValue: '+3%',     badgeVariant: 'success'   },
      { key: 'roas',        label: 'ROAS',        value: '2.5x',   subMetric: 'vs. 2.5x target', badgeValue: '0%',      badgeVariant: 'secondary' },
      { key: 'frequency',   label: 'Frequency',   value: '4.6x',   subMetric: 'avg per user',    badgeValue: 'Optimal', badgeVariant: 'success'   },
    ],
  },

  // ── All engines (aggregate) — only overview is meaningful ─────────
  'all': {
    overview: [
      { key: 'spend',       label: 'Spend',       value: '$224K', subMetric: 'of $310K budget', badgeValue: '72%',  badgeVariant: 'secondary' },
      { key: 'roas',        label: 'ROAS',        value: '3.1x',  subMetric: 'weighted avg',    badgeValue: '+12%', badgeVariant: 'success'   },
      { key: 'impressions', label: 'Impressions', value: '43.2M', subMetric: 'across engines',  badgeValue: '+15%', badgeVariant: 'success'   },
      { key: 'conversions', label: 'Conversions', value: '32.4K', subMetric: 'attributed',      badgeValue: '+9%',  badgeVariant: 'success'   },
      { key: 'ctr',         label: 'CTR',         value: '1.42%', subMetric: 'blended',         badgeValue: '+6%',  badgeVariant: 'success'   },
    ],
    campaign: [],  // not used
    booking: [],   // not used
  },
};

/**
 * Return the per-proposition metric cards for the given engine + scope.
 * Falls back to the "all engines" overview set when the engine isn't
 * recognised, so the call site never renders an empty row.
 */
export const getPropositionMetrics = (
  engineType: string,
  scope: PropositionScope = 'overview',
): MetricDefinition[] => {
  const key = normaliseEngine(engineType);
  const set = definitions[key] ?? definitions['all'];
  const metrics = set[scope];
  // Campaign/booking scopes on "all" are intentionally empty; fall back
  // to the engine's overview so the row never disappears.
  return metrics.length > 0 ? metrics : set.overview;
};
