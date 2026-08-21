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

/**
 * The ONE status lifecycle, shared by all three levels of the hierarchy so
 * statuses always read the same everywhere:
 *
 *   draft → in-option → running → paused ↔ running → completed
 *
 * - draft      — being set up; not yet reserved.
 * - in-option  — inventory held in option; awaiting confirmation/approvals.
 * - running    — live and delivering.
 * - paused     — temporarily stopped (can resume to running).
 * - completed  — flight finished.
 *
 * A parent's status summarises its children: a plan is only `running` when at
 * least one campaign runs; blockers that keep an entity from advancing are NOT
 * extra statuses — they surface as derived to-dos (see tasks.ts).
 */
export type PlanStatus = 'draft' | 'in-option' | 'running' | 'paused' | 'completed';

/** Creative readiness on a booking — drives "creative missing/approval" to-dos. */
export type CreativeStatus = 'missing' | 'submitted' | 'approved';

export interface MediaPlan {
  id: string;
  name: string;
  poNumber?: string;
  /** While a plan is still being built, the wizard step (0-based) the user
   *  left off at. Cleared the moment the plan is saved out of the wizard. */
  wizardStep?: number;
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
  /**
   * Let the platform split the budget across the plan's propositions instead
   * of the user setting each campaign by hand. Editing a campaign budget turns
   * it off — the moment a number is set by hand the split is no longer
   * automatic, and silently overwriting that edit would be worse than stopping.
   */
  autoBudget?: boolean;
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
  /** How the campaign was set up in the media plan wizard. Assisted campaigns
   *  carry AI-prefilled defaults all the way down: the follow-up booking and
   *  creative wizards open fully filled, for the user to check rather than
   *  type. Absent means the campaign was built by hand (expert). */
  mode?: 'assisted' | 'expert';
  /** How the inventory is bought. Auction campaigns bid per placement (the
   *  CPC lives on each selected placement card); guaranteed campaigns buy at
   *  a fixed price and show no bids. Only sponsored products, display and
   *  digital in-store ask this; absent reads as auction. */
  buyingType?: 'auction' | 'guaranteed';
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
  /** Creative readiness — a booking cannot go live without an approved creative. */
  creativeStatus: CreativeStatus;
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

// ── Channels, positions & availability ─────────────────────────────────
//
// Every engine offers inventory the same way: a CHANNEL (also called media
// product or platform — one name to be settled later) groups POSITIONS, and a
// position is the smallest bookable unit. Offsite illustrates the model best:
// channels like Display, Online Video, CTV, Contextual Commerce Media, Social
// Media and Digital Out Of Home — where for Social Media the positions are the
// platforms themselves (Meta, TikTok, Pinterest, YouTube).

/** A channel within an engine (aka media product / platform — naming TBD). */
export interface MediaProduct {
  id: string;
  engine: EngineId;
  name: string;
  description?: string;
  /** Executing partner behind this channel (e.g. Epsilon, Chicory, Vistar). */
  partner?: string;
}

export interface Position {
  id: string;
  mediaProductId: string;
  name: string;
  description?: string;
  /** Bookable slots per day (capacity model kept deliberately simple). */
  /** Creative format this slot takes, e.g. "Billboard 970x250". */
  format?: string;
  dailyCapacity: number;
}

/** One position × ISO week → how much of the capacity is already booked. */
export interface AvailabilityEntry {
  positionId: string;
  /** ISO week key, e.g. "2026-W27". */
  week: string;
  booked: number;
}

// ── FAQ ────────────────────────────────────────────────────────────────

/**
 * Which template an FAQ entry belongs to. The ids are stable keys, not URLs —
 * a template can be reachable from several routes, and the FAQ follows the
 * template. See FAQ_SURFACES in faq.ts for the labels and the sections each
 * surface offers.
 */
export type FaqSurfaceId =
  | 'home'
  | 'create-media-plan'
  | 'create-campaign'
  | 'media-plan-detail'
  | 'campaign-detail'
  | 'booking-detail'
  | 'campaign-overview'
  | 'bookings-overview'
  | 'creatives'
  | 'insights';

/** Who an entry is written for. Retailer staff and advertisers ask different
 *  questions about the same screen, so an entry can be aimed at one side. */
export type FaqAudience = 'all' | 'retailer' | 'advertiser';

export interface FaqEntry {
  id: string;
  question: string;
  /** Plain text. Blank lines start a new paragraph; no markup is parsed. */
  answer: string;
  surface: FaqSurfaceId;
  /** Optional step/tab within the surface (see FAQ_SURFACES[surface].sections).
   *  Entries without one apply to the whole template. */
  section?: string;
  /** Restricts the entry to one proposition, for engine-specific rules. */
  engine?: EngineId;
  audience: FaqAudience;
  /** Drafts are editable in the configuration area but never shown in-product. */
  published: boolean;
  /** Sort order within a surface. Lower comes first. */
  order: number;
  updatedAt: string;
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
  faqs: FaqEntry[];
  terms: TermEntry[];
  releaseNotes: ReleaseNote[];
}

/**
 * A glossary entry for a metric or term used across the product, shown in the
 * Help section. The retailer writes these once, in their own words, instead of
 * every template explaining ROAS its own way.
 */
export interface TermEntry {
  id: string;
  term: string;
  definition: string;
  published: boolean;
  order: number;
  updatedAt: string;
}

/**
 * A "What's new" note — release notes the retailer writes for advertisers.
 * The homepage widget and the Help section read the same list.
 */
export interface ReleaseNote {
  id: string;
  version: string;
  /** Display date, e.g. "June 2026". */
  date: string;
  title: string;
  items: string[];
  published: boolean;
  order: number;
  updatedAt: string;
}
