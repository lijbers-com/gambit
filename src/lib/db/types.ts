/**
 * Prototype data model — the single source of truth for the working flows.
 *
 * Hierarchy: MediaPlan → Campaign → Booking. Every campaign runs on exactly one
 * engine (proposition); each engine owns media products with positions, and each
 * position has bookable availability. Metric definitions are registered per
 * engine so templates render real, agreed metrics instead of ad-hoc numbers.
 *
 * This mirrors the contract the real backend should expose — the prototype
 * persists it client-side (localStorage) so it stays a zero-infra playground.
 */

// ── Engines (propositions) ─────────────────────────────────────────────

export type EngineId =
  | 'display'
  | 'sponsored-products'
  | 'digital-instore'
  | 'offline-instore'
  | 'offsite';

export interface Engine {
  id: EngineId;
  name: string;
}

// ── Users & organisations ──────────────────────────────────────────────

/** Which side of the platform a user works on. Drives branding + navigation:
 *  retailer users get the Edge (gambit) chrome incl. configuration; advertiser
 *  users get the retailer's own branding with the advertiser navigation. */
export type UserSide = 'retailer' | 'advertiser';

export interface DbUser {
  id: string;
  /** Display name shown in the chrome (human name for demo realism). */
  name: string;
  /** Role title — comes from the EpicContext persona. */
  role: string;
  /** EpicContext persona key this user maps to (users/personas/<key>.md). */
  personaKey: string;
  side: UserSide;
  /** Theme applied on login: retailer users → 'gambit' (Edge); advertiser
   *  users → the retailer brand they buy from (e.g. 'albert-heijn'). */
  theme: string;
  /** For advertiser-side users: the advertiser org they belong to. */
  advertiserId?: string;
}

export interface Brand {
  id: string;
  name: string;
  /** Brands with retail products unlock product-level features. */
  hasRetailProducts?: boolean;
}

export interface Advertiser {
  id: string;
  name: string;
  brands: Brand[];
}

// ── Media plan → campaign → booking ────────────────────────────────────

export type PlanStatus = 'draft' | 'in-option' | 'running' | 'paused' | 'completed';

export interface MediaPlan {
  id: string;
  name: string;
  poNumber?: string;
  advertiserId: string;
  brandIds: string[];
  status: PlanStatus;
  /** Campaign goal (awareness | consideration | purchase | loyalty). */
  goal?: string;
  /** Composite objective id (funnel__name) or slug. */
  objective?: string;
  kpis: string[];
  /** Total budget in euros. */
  budget: number;
  startDate: string; // ISO yyyy-mm-dd
  endDate: string;
  createdBy?: string; // DbUser id
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  id: string;
  mediaPlanId: string;
  name: string;
  engine: EngineId;
  status: PlanStatus;
  budget: number;
  spend: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  campaignId: string;
  name: string;
  status: PlanStatus;
  budget: number;
  spend: number;
  startDate: string;
  endDate: string;
  /** Position(s) this booking occupies, when placed. */
  positionIds: string[];
  createdAt: string;
  updatedAt: string;
}

// ── Metric registry (per engine) ───────────────────────────────────────

export type MetricScope = 'overview' | 'campaign' | 'booking';
export type MetricFormat = 'currency' | 'number' | 'percent' | 'ratio';

/** A metric that exists for an engine. The set of definitions per engine is
 *  THE agreed metric overview — templates render from this registry, so adding
 *  or removing a definition changes every metric row and insight dashboard. */
export interface MetricDefinition {
  key: string;
  label: string;
  engine: EngineId | 'all';
  scopes: MetricScope[];
  format: MetricFormat;
  description?: string;
}

// ── Media products, positions & availability ───────────────────────────

export interface MediaProduct {
  id: string;
  engine: EngineId;
  name: string;
  description?: string;
}

export interface Position {
  id: string;
  mediaProductId: string;
  name: string;
  description?: string;
  /** Bookable slots per day (capacity model kept deliberately simple). */
  dailyCapacity: number;
}

/** One position × ISO week → how much of the capacity is already booked. */
export interface AvailabilityEntry {
  positionId: string;
  /** ISO week key, e.g. "2026-W27". */
  week: string;
  booked: number;
}

// ── The database document ──────────────────────────────────────────────

export interface DbData {
  /** Bumped when the seed shape changes — mismatched stores are re-seeded. */
  version: number;
  engines: Engine[];
  users: DbUser[];
  advertisers: Advertiser[];
  mediaPlans: MediaPlan[];
  campaigns: Campaign[];
  bookings: Booking[];
  metricDefinitions: MetricDefinition[];
  mediaProducts: MediaProduct[];
  positions: Position[];
  availability: AvailabilityEntry[];
}
