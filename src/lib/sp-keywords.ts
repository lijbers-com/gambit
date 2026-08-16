import { type Level, LEVEL_LABELS } from '@/components/ui/level-meter';

/**
 * What a sponsored-products booking is bought with: keywords, and the
 * categories it can spill into.
 *
 * Shared because the create wizard and the booking detail page are the same
 * booking at two moments in its life — if the keyword list drifted between
 * them, editing a booking would show something different from what creating it
 * did.
 *
 * Long on purpose: a real feed suggests dozens, which is what the suggestion
 * list has to cope with. Each keyword carries what it is worth — how much it is
 * searched for, and how hard it is to win — on the same five-step scale. The
 * scale is what an advertiser gets: raw search counts are the retailer's own
 * numbers and are not shown outside.
 */
export const spKeywordMeta: Record<string, { searches: number; volume: Level; competition: Level }> = {
  'beer':              { searches: 48000, volume: 5, competition: 5 },
  'heineken':          { searches: 31000, volume: 5, competition: 4 },
  'craft beer':        { searches: 22000, volume: 4, competition: 5 },
  'lager':             { searches: 18000, volume: 4, competition: 3 },
  'alcohol free beer': { searches: 12000, volume: 4, competition: 3 },
  'beer cans':         { searches: 11000, volume: 3, competition: 3 },
  'party drinks':      { searches: 9400, volume: 3, competition: 3 },
  'beer bottles':      { searches: 8900, volume: 3, competition: 3 },
  'beer crate':        { searches: 7800, volume: 3, competition: 2 },
  'pilsner':           { searches: 6200, volume: 3, competition: 2 },
  'football snacks':   { searches: 5700, volume: 2, competition: 2 },
  'beer 6 pack':       { searches: 5100, volume: 2, competition: 2 },
  'cold beer':         { searches: 4400, volume: 2, competition: 1 },
  'dutch beer':        { searches: 3600, volume: 2, competition: 1 },
  'bbq drinks':        { searches: 3100, volume: 1, competition: 1 },
  'weekend drinks':    { searches: 2800, volume: 1, competition: 1 },
};

export const spKeywordSuggestions = Object.keys(spKeywordMeta);

/**
 * A keyword the user typed themselves is worth just as much to know about as
 * one we suggested, so every added keyword gets the same line. Off the
 * catalogue the numbers are derived from the word itself — stable per keyword,
 * so it never reshuffles between renders.
 */
export const spKeywordDetail = (keyword: string) => {
  const known = spKeywordMeta[keyword];
  if (known) return known;
  let hash = 0;
  for (let i = 0; i < keyword.length; i += 1) hash = (hash * 31 + keyword.charCodeAt(i)) % 100000;
  const searches = 800 + (hash % 9200);
  // Volume is what the search count says it is — the two have to agree.
  const volume = (searches < 1500 ? 1 : searches < 3000 ? 2 : searches < 5000 ? 3 : searches < 8000 ? 4 : 5) as Level;
  const competition = (((hash >> 3) % 5) + 1) as Level;
  return { searches, volume, competition };
};

/**
 * What a keyword is worth, in the words an advertiser sees — on the selected
 * card and on the suggestion pill alike, so the two lists read the same.
 */
export const spKeywordDescription = (keyword: string) => {
  const { volume, competition } = spKeywordDetail(keyword);
  return `Volume: ${LEVEL_LABELS[volume]} · Competition: ${LEVEL_LABELS[competition]}`;
};

export const spCategoryOptions = [
  { value: 'cat-primary', label: 'Global primary category', description: 'The product’s own category' },
  { value: 'cat-beer', label: 'Beer & cider', description: '1,240 products' },
  { value: 'cat-spirits', label: 'Spirits & liqueurs', description: '890 products' },
  { value: 'cat-wine', label: 'Wine', description: '2,100 products' },
  { value: 'cat-soft', label: 'Soft drinks & mixers', description: '560 products' },
  { value: 'cat-snacks', label: 'Snacks & crisps', description: '740 products' },
];

/** The retailer's banners a booking can be aimed at. */
export const localBrands = [
  { id: 'food-lion', label: 'Food Lion' },
  { id: 'giant-food', label: 'Giant Food' },
  { id: 'hannaford', label: 'Hannaford' },
  { id: 'martins', label: "Martin's" },
  { id: 'stop-shop', label: 'Stop & Shop' },
  { id: 'giant-company', label: 'The Giant Company' },
];
