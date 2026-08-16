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
 * list has to cope with. Each keyword carries what it is worth — how much is
 * searched for it, and how hard it is to win — on the same five-step scale, so
 * they can be weighed against each other.
 */
export const spKeywordMeta: Record<string, { reach: string; volume: Level; competition: Level }> = {
  'beer':              { reach: '48K searches',  volume: 5, competition: 5 },
  'heineken':          { reach: '31K searches',  volume: 5, competition: 4 },
  'craft beer':        { reach: '22K searches',  volume: 4, competition: 5 },
  'lager':             { reach: '18K searches',  volume: 4, competition: 3 },
  'alcohol free beer': { reach: '12K searches',  volume: 4, competition: 3 },
  'beer cans':         { reach: '11K searches',  volume: 3, competition: 3 },
  'party drinks':      { reach: '9.4K searches', volume: 3, competition: 3 },
  'beer bottles':      { reach: '8.9K searches', volume: 3, competition: 3 },
  'beer crate':        { reach: '7.8K searches', volume: 3, competition: 2 },
  'pilsner':           { reach: '6.2K searches', volume: 3, competition: 2 },
  'football snacks':   { reach: '5.7K searches', volume: 2, competition: 2 },
  'beer 6 pack':       { reach: '5.1K searches', volume: 2, competition: 2 },
  'cold beer':         { reach: '4.4K searches', volume: 2, competition: 1 },
  'dutch beer':        { reach: '3.6K searches', volume: 2, competition: 1 },
  'bbq drinks':        { reach: '3.1K searches', volume: 1, competition: 1 },
  'weekend drinks':    { reach: '2.8K searches', volume: 1, competition: 1 },
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
  // Volume is what the search count says it is — the two lines have to agree.
  const volume = (searches < 1500 ? 1 : searches < 3000 ? 2 : searches < 5000 ? 3 : searches < 8000 ? 4 : 5) as Level;
  const competition = (((hash >> 3) % 5) + 1) as Level;
  return {
    reach: searches >= 1000 ? `${(searches / 1000).toFixed(1)}K searches` : `${searches} searches`,
    volume,
    competition,
  };
};

/** The one muted sub-line a selected keyword card carries. */
export const spKeywordDescription = (keyword: string) => {
  const { reach, volume, competition } = spKeywordDetail(keyword);
  return `Volume: ${LEVEL_LABELS[volume]} · Competition: ${LEVEL_LABELS[competition]} · ${reach}`;
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
