/**
 * One-line explanations for objectives and KPIs — shown in the searchable
 * selectors (dropdown + selected card) so users always see what a selection
 * stands for. Shared by the create wizard and the media-plan detail form.
 */

const objectiveCopy: Record<string, string> = {
  'Merkbekendheid': 'Grow how well shoppers know the brand — measured with awareness KPIs like top-of-mind and ad-recall.',
  'Productbekendheid': 'Make shoppers aware of a specific product — measured with product awareness and recall KPIs.',
  'Merk associaties': 'Strengthen what shoppers associate the brand with — values, occasions and category entry points.',
  'Verhogen merk/product overweging': 'Get the brand into shoppers’ consideration set when they plan a purchase.',
  'Nieuwe klanten': 'Attract shoppers who haven’t bought the brand before — measured with new-to-brand KPIs.',
  'Merkvoorkeur': 'Become the preferred choice within the category for shoppers who already consider you.',
  'Aankoopintentie': 'Raise the intent to buy on the next shopping trip — the bridge from consideration to conversion.',
  'Sales': 'Drive attributable sales and return on ad spend, online and in-store.',
  'Promotie ondersteuning': 'Support a promotion or bonus period with extra visibility while it runs.',
  // Media-plan detail slugs
  'merkbekendheid': 'Grow how well shoppers know the brand — measured with awareness KPIs like top-of-mind and ad-recall.',
  'productbekendheid': 'Make shoppers aware of a specific product — measured with product awareness and recall KPIs.',
  'merk-associaties': 'Strengthen what shoppers associate the brand with — values, occasions and category entry points.',
};

const kpiCopy: Record<string, string> = {
  'Top of Mind Awareness': 'Share of shoppers naming the brand first, unprompted — the strongest awareness signal.',
  'Spontane merk/productbekendheid': 'Share of shoppers naming the brand/product unprompted when asked about the category.',
  'Geholpen merk/productbekendheid': 'Share of shoppers recognising the brand/product when shown it.',
  'Reclamebekendheid (Ad-recall)': 'Share of shoppers who remember seeing the campaign.',
  'CEP': 'Category entry points — the buying situations in which shoppers think of the brand.',
  'Merk associaties/waardes': 'How strongly shoppers link the brand to its intended values and occasions.',
  'Merk/product overweging': 'Share of shoppers who would consider the brand/product for their next purchase.',
  'Merkvoorkeur': 'Share of shoppers who prefer the brand over alternatives in the category.',
  'Aankoopintentie': 'Share of shoppers intending to buy the brand on their next trip.',
  'Bereik': 'Total shoppers reached by the plan.',
  'Uniek bereik': 'Unique shoppers reached (deduplicated across channels).',
  'Frequentie': 'Average number of times each shopper sees the campaign.',
  'Average time on page': 'Average time shoppers spend on the destination page.',
  'Scroll depth': 'How far shoppers scroll on the destination page.',
  'VCR': 'Video completion rate — share of video views watched to the end.',
  'CTR': 'Click-through rate — clicks per impression.',
  'CPM': 'Cost per thousand impressions.',
  'SOV (categorie)': 'Share of voice — your share of ad presence within the category.',
  'Post Engagement rate (social)': 'Interactions per social post impression (likes, comments, shares).',
  'Conversion rate': 'Share of visitors who convert after clicking.',
  'Sales lift': 'Incremental sales versus a comparable baseline without media.',
  '(i)ROAS': 'Incremental return on ad spend — incremental revenue per euro of media.',
  'Sales online': 'Attributed online sales during the flight.',
  'Sales offline': 'Attributed in-store sales during the flight.',
  'New to brand': 'Buyers who hadn’t bought the brand in the lookback window.',
  'New to Category': 'Buyers new to the whole category.',
  'Sales driver: existing customers (i)': 'Incremental sales from shoppers who already buy the brand.',
  'Sales driver: sales per customer (i)': 'Incremental growth in spend per buying customer.',
  'CLV': 'Customer lifetime value of the buyers the campaign brings in.',
  'Redemptie (loyalty product only)': 'Share of issued loyalty offers actually redeemed.',
  'Basket size (SIS only)': 'Average basket value of buyers exposed in the shop-in-shop.',
  'Share of basket (SIS only)': 'The brand’s share within buyers’ baskets.',
  'Trial (New to product)': 'First-time buyers of the promoted product.',
  'Repeat': 'Buyers who purchase the product again after trial.',
  'Koop frequentie': 'How often buyers purchase within the period.',
  'Terugwinnen klanten': 'Lapsed buyers won back by the campaign.',
  // Media-plan detail slugs
  'toma': 'Share of shoppers naming the brand first, unprompted — the strongest awareness signal.',
  'spontaan': 'Share of shoppers naming the brand/product unprompted when asked about the category.',
  'adrecall': 'Share of shoppers who remember seeing the campaign.',
  'cep': 'Category entry points — the buying situations in which shoppers think of the brand.',
};

/** One-liner for an objective (undefined when we have no copy for it yet). */
export const describeObjective = (name: string): string | undefined => objectiveCopy[name];

/** One-liner for a KPI (undefined when we have no copy for it yet). */
export const describeKpi = (name: string): string | undefined => kpiCopy[name];
