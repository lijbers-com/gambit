/**
 * The goal / objective / KPI vocabulary.
 *
 * Two things live here:
 *  - `…Label` turns a stored id into the words a user reads. Media plans store
 *    ids that came from the Dutch measurement framework (`merkbekendheid`,
 *    `toma`); those ids stay as they are — they are keys, not copy — but the
 *    interface is English everywhere.
 *  - `describe…` gives the one-line explanation shown in the selectors and on
 *    the selected card, so a user always sees what a selection stands for.
 *
 * Both accept an id *or* a display name, because the wizard works in names
 * (its catalogue is a list of labels) while the media-plan detail form works in
 * stored ids. Anything unknown falls back to the input, so a new option shows
 * its own name rather than a blank.
 */

// ── Labels ─────────────────────────────────────────────────────────────

/** Campaign goals — the four funnel positions a plan can take. */
const goalLabels: Record<string, string> = {
  awareness: 'Awareness',
  consideration: 'Consideration',
  purchase: 'Purchase',
  loyalty: 'Loyalty',
};

/** Objectives, keyed by stored id. */
const objectiveLabels: Record<string, string> = {
  'merkbekendheid': 'Brand awareness',
  'productbekendheid': 'Product awareness',
  'merk-associaties': 'Brand associations',
  'merkoverweging': 'Brand consideration',
  'merkvoorkeur': 'Brand preference',
  'aankoopintentie': 'Purchase intent',
  'nieuwe-klanten': 'New customers',
  'sales': 'Sales',
  'sales-zonder-promo': 'Sales without promotion',
  'bonus-promo': 'Promotion support',
  'herhaalaankoop': 'Repeat purchase',
  'promotie-ondersteuning': 'Promotion support',
};

/** KPIs, keyed by stored id. */
const kpiLabels: Record<string, string> = {
  'toma': 'Top-of-mind awareness',
  'spontaan': 'Unaided brand/product awareness',
  'geholpen': 'Aided brand/product awareness',
  'adrecall': 'Ad recall',
  'cep': 'Category entry points',
  'reach': 'Reach',
  'frequency': 'Frequency',
  'ctr': 'Click-through rate',
  'vcr': 'Video completion rate',
  'cpm': 'CPM',
  'roas': 'ROAS',
  'iroas': 'Incremental ROAS',
  'sales-lift': 'Sales lift',
  'conversion-rate': 'Conversion rate',
};

const labelFrom = (map: Record<string, string>, value?: string): string =>
  !value ? '—' : map[value] ?? map[value.toLowerCase()] ?? value;

/** Display name for a campaign goal. */
export const goalLabel = (goal?: string): string => labelFrom(goalLabels, goal);

/** Display name for an objective — accepts a stored id or a display name. */
export const objectiveLabel = (objective?: string): string => labelFrom(objectiveLabels, objective);

/** Display name for a KPI — accepts a stored id or a display name. */
export const kpiLabel = (kpi?: string): string => labelFrom(kpiLabels, kpi);

// ── One-line explanations ──────────────────────────────────────────────

const objectiveCopy: Record<string, string> = {
  'Brand awareness': 'Grow how well shoppers know the brand — measured with awareness KPIs like top-of-mind and ad recall.',
  'Product awareness': 'Make shoppers aware of a specific product — measured with product awareness and recall KPIs.',
  'Brand associations': 'Strengthen what shoppers associate the brand with — values, occasions and category entry points.',
  'Brand/product consideration': 'Get the brand into shoppers’ consideration set when they plan a purchase.',
  'Brand consideration': 'Get the brand into shoppers’ consideration set when they plan a purchase.',
  'New customers': 'Attract shoppers who haven’t bought the brand before — measured with new-to-brand KPIs.',
  'Brand preference': 'Become the preferred choice within the category for shoppers who already consider you.',
  'Purchase intent': 'Raise the intent to buy on the next shopping trip — the bridge from consideration to conversion.',
  'Sales': 'Drive attributable sales and return on ad spend, online and in-store.',
  'Sales without promotion': 'Drive attributable sales at the regular price, without leaning on a bonus period.',
  'Promotion support': 'Support a promotion or bonus period with extra visibility while it runs.',
  'Repeat purchase': 'Bring existing buyers back for another purchase within the period.',
  // Objective ids, for the media-plan detail form.
  'merkbekendheid': 'Grow how well shoppers know the brand — measured with awareness KPIs like top-of-mind and ad recall.',
  'productbekendheid': 'Make shoppers aware of a specific product — measured with product awareness and recall KPIs.',
  'merk-associaties': 'Strengthen what shoppers associate the brand with — values, occasions and category entry points.',
  // Objectives as the wizard's own catalogue names them.
  'Grow brand awareness': 'Grow how well shoppers know the brand — measured with awareness KPIs like top-of-mind and ad recall.',
  'Grow product awareness': 'Make shoppers aware of a specific product — measured with product awareness and recall KPIs.',
  'Strengthen brand associations': 'Strengthen what shoppers associate the brand with — values, occasions and category entry points.',
  'Grow brand consideration': 'Get the brand into shoppers’ consideration set when they plan a purchase.',
  'Grow brand preference': 'Become the preferred choice within the category for shoppers who already consider you.',
  'Grow purchase intent': 'Raise the intent to buy on the next shopping trip — the bridge from consideration to conversion.',
  'Attract new customers': 'Attract shoppers who haven’t bought the brand before — measured with new-to-brand KPIs.',
  'Generate sales without promotion': 'Drive attributable sales at the regular price, without leaning on a bonus period.',
  'Support a promotion': 'Support a promotion or bonus period with extra visibility while it runs.',
};

const kpiCopy: Record<string, string> = {
  'Top-of-mind awareness': 'Share of shoppers naming the brand first, unprompted — the strongest awareness signal.',
  'Top-of-mind brand awareness': 'Share of shoppers naming the brand first, unprompted — the strongest awareness signal.',
  'Top-of-mind product awareness': 'Share of shoppers naming the product first, unprompted.',
  'Unaided brand/product awareness': 'Share of shoppers naming the brand or product unprompted when asked about the category.',
  'Unaided brand awareness': 'Share of shoppers naming the brand unprompted when asked about the category.',
  'Unaided product awareness': 'Share of shoppers naming the product unprompted when asked about the category.',
  'Aided brand/product awareness': 'Share of shoppers recognising the brand or product when shown it.',
  'Aided brand awareness': 'Share of shoppers recognising the brand when shown it.',
  'Aided product awareness': 'Share of shoppers recognising the product when shown it.',
  'Ad recall': 'Share of shoppers who remember seeing the campaign.',
  'Category entry points': 'The buying situations in which shoppers think of the brand.',
  'CEP': 'Category entry points — the buying situations in which shoppers think of the brand.',
  'Brand associations & values': 'How strongly shoppers link the brand to its intended values and occasions.',
  'Brand/product consideration': 'Share of shoppers who would consider the brand or product for their next purchase.',
  'Brand consideration': 'Share of shoppers who would consider the brand for their next purchase.',
  'Brand preference': 'Share of shoppers who prefer the brand over alternatives in the category.',
  'Purchase intent': 'Share of shoppers intending to buy the brand on their next trip.',
  'Reach': 'Total shoppers reached by the plan.',
  'Reach (within audience)': 'Shoppers reached inside the targeted audience.',
  'Unique reach': 'Unique shoppers reached, deduplicated across channels.',
  'Frequency': 'Average number of times each shopper sees the campaign.',
  'Average time on page': 'Average time shoppers spend on the destination page.',
  'Scroll depth': 'How far shoppers scroll on the destination page.',
  'VCR': 'Video completion rate — share of video views watched to the end.',
  'Video completion rate': 'Share of video views watched to the end.',
  'CTR': 'Click-through rate — clicks per impression.',
  'Click-through rate': 'Clicks per impression.',
  'CPM': 'Cost per thousand impressions.',
  'Share of voice (category)': 'Your share of ad presence within the category.',
  'Post engagement rate': 'Interactions per social post impression — likes, comments, shares.',
  'Conversion rate': 'Share of visitors who convert after clicking.',
  'Sales lift': 'Incremental sales versus a comparable baseline without media.',
  'ROAS': 'Return on ad spend — revenue per euro of media.',
  'Incremental ROAS': 'Incremental revenue per euro of media, over the no-media baseline.',
  '(i)ROAS': 'Incremental return on ad spend — incremental revenue per euro of media.',
  'Sales online': 'Attributed online sales during the flight.',
  'Sales offline': 'Attributed in-store sales during the flight.',
  'New to brand': 'Buyers who hadn’t bought the brand in the lookback window.',
  'New to category': 'Buyers new to the whole category.',
  'Sales driver: existing customers': 'Incremental sales from shoppers who already buy the brand.',
  'Sales per customer': 'Incremental growth in spend per buying customer.',
  'CLV': 'Customer lifetime value of the buyers the campaign brings in.',
  'Redemption (loyalty product only)': 'Share of issued loyalty offers actually redeemed.',
  'Basket size (SIS only)': 'Average basket value of buyers exposed in the shop-in-shop.',
  'Share of basket (SIS only)': 'The brand’s share within buyers’ baskets.',
  'Share of basket': 'The brand’s share within buyers’ baskets.',
  'Trial (new to product)': 'First-time buyers of the promoted product.',
  'Repeat': 'Buyers who purchase the product again after trial.',
  'Purchase frequency': 'How often buyers purchase within the period.',
  'Win-back customers': 'Lapsed buyers won back by the campaign.',
  'Recipe saved to favourites (Allerhande only)': 'Shoppers who saved the featured recipe.',
  // KPI ids, for the media-plan detail form.
  'toma': 'Share of shoppers naming the brand first, unprompted — the strongest awareness signal.',
  'spontaan': 'Share of shoppers naming the brand or product unprompted when asked about the category.',
  'adrecall': 'Share of shoppers who remember seeing the campaign.',
  'cep': 'Category entry points — the buying situations in which shoppers think of the brand.',
};

/** One-liner for an objective (undefined when we have no copy for it yet). */
export const describeObjective = (name: string): string | undefined => objectiveCopy[name];

/** One-liner for a KPI (undefined when we have no copy for it yet). */
export const describeKpi = (name: string): string | undefined => kpiCopy[name];
