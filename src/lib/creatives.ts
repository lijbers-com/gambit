/**
 * The advertiser's creative library — what the Creatives portal holds, and
 * what a booking picks from on the creative step of its wizard.
 *
 * Shared so the two never disagree: a booking links an EXISTING creative,
 * it does not invent one. Formats are per proposition, because a shelf
 * display and an open-web banner are not interchangeable.
 */
import type { EngineId } from '@/lib/db';

export interface CreativeAsset {
  id: string;
  name: string;
  /** What kind of ad this is — the format the placement expects. */
  format: string;
  /** Dimensions, duration, or physical size, whichever the format is sold in. */
  size: string;
  /** Where it stands in the retailer's approval flow. */
  status: 'Approved' | 'In review' | 'Draft';
  /** Which propositions can run it. */
  engines: EngineId[];
  updated: string;
}

export const creativeLibrary: CreativeAsset[] = [
  { id: 'cr-hero', name: 'Summer hero banner', format: 'Billboard', size: '970×250', status: 'Approved', engines: ['display', 'offsite'], updated: '12 Jun 2026' },
  { id: 'cr-spotlight', name: 'Product spotlight set', format: 'Leaderboard', size: '728×90', status: 'Approved', engines: ['display', 'offsite'], updated: '2 Jul 2026' },
  { id: 'cr-side', name: 'Side rail refresh', format: 'Halfpage', size: '300×600', status: 'In review', engines: ['display'], updated: '18 Jul 2026' },
  { id: 'cr-video', name: 'Brand video 15s', format: 'Video', size: '15s · 16:9', status: 'Approved', engines: ['display', 'offsite', 'digital-instore'], updated: '28 Jun 2026' },
  { id: 'cr-screen', name: 'In-store screen loop', format: 'Screen', size: '1080×1920', status: 'Approved', engines: ['digital-instore'], updated: '5 Jul 2026' },
  { id: 'cr-aisle', name: 'Aisle takeover motion', format: 'Screen', size: '3840×2160', status: 'Draft', engines: ['digital-instore'], updated: '21 Jul 2026' },
  { id: 'cr-shelf', name: 'Shelf talker — September', format: 'Print', size: 'A6', status: 'Approved', engines: ['offline-instore'], updated: '1 Jul 2026' },
  { id: 'cr-floor', name: 'Floor sticker set', format: 'Print', size: '60×60 cm', status: 'In review', engines: ['offline-instore'], updated: '9 Jul 2026' },
  { id: 'cr-social', name: 'Social carousel', format: 'Social', size: '1080×1080', status: 'Approved', engines: ['offsite'], updated: '14 Jul 2026' },
];

/** The library narrowed to what a proposition can actually run. */
export const creativesForEngine = (engine: string): CreativeAsset[] =>
  creativeLibrary.filter((c) => c.engines.includes(engine as EngineId));
