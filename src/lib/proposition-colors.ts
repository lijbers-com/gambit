import type { EngineId } from '@/lib/db';

/**
 * One colour per proposition, so a proposition keeps its colour across every
 * chart that splits by engine — the budget bar, the impressions donut, the ROAS
 * bars and their legends all agree.
 */
const byEngine: Record<EngineId, string> = {
  'display': 'hsl(var(--chart-1))',
  'sponsored-products': 'hsl(var(--chart-2))',
  'digital-instore': 'hsl(var(--chart-3))',
  'offline-instore': 'hsl(var(--chart-4))',
  'offsite': 'hsl(var(--chart-5))',
};

export const propositionColor = (engine: EngineId): string =>
  byEngine[engine] ?? 'hsl(var(--chart-1))';

/** Display label for a proposition, matching the rest of the UI. */
export const propositionLabel = (engine: EngineId): string =>
  engine
    .replace('-instore', ' in-store')
    .replace(/-/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase());
