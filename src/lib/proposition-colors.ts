import type { EngineId } from '@/lib/db';
import { patternFor } from '@/lib/proposition-patterns';

/**
 * A proposition's colours, taken from the one place they are decided —
 * lib/proposition-patterns. `propositionColor` is the tint a filled mark
 * wears (a bar, a segment, a donut slice); `propositionInk` is the darker
 * step a line or a swatch border wears. Never a chart-N slot: those are for
 * series that are not propositions.
 */
export const propositionColor = (engine: EngineId): string => patternFor(engine).base;
export const propositionInk = (engine: EngineId): string => patternFor(engine).ink;

/** The short engine ids some older surfaces still carry (`sponsored`,
 *  `digital`…) mapped onto the proposition ids the rest of the app uses. */
export const engineIdFromShort: Record<string, EngineId> = {
  display: 'display',
  sponsored: 'sponsored-products',
  'sponsored-products': 'sponsored-products',
  digital: 'digital-instore',
  'digital-instore': 'digital-instore',
  offline: 'offline-instore',
  'offline-instore': 'offline-instore',
  offsite: 'offsite',
};

/** Display label for a proposition, matching the rest of the UI. */
export const propositionLabel = (engine: EngineId): string =>
  engine
    .replace('-instore', ' in-store')
    .replace(/-/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase());

/**
 * "Holiday Sale — Display" → "Holiday Sale". The proposition belongs to the
 * frame around a campaign — a summary card's title, a table's Proposition
 * column — never inside the campaign's own name, where it would say the same
 * thing twice. Strips a trailing "— <proposition>" whatever dash it used.
 */
export const stripPropositionSuffix = (name: string): string =>
  name.replace(
    /\s*[—–-]\s*(display|sponsored products|digital in-store|offline in-store|offsite)\s*$/i,
    '',
  );
