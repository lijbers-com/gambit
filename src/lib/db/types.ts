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

/**
 * A retail product: what the store sells and what a booking advertises. It
 * belongs to a brand, and the brand to an organisation (the advertiser, or
 * media partner) — the way the retailer's SAP master data has it. Every flow
 * that picks retail products picks them from the brands in play.
 */
export interface RetailProduct {
  id: string;
  brandId: string;
  name: string;
  /** Global trade item number — the barcode. */
  gtin: string;
  /** Further barcodes of the same product (other pack sizes, multipacks). */
  upcs?: string[];
  image: string;
  category: string;
  packSize?: string;
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
  /** Retail products this campaign advertises — a booking made under it
   *  starts from these rather than from an empty list. */
  retailProductIds?: string[];
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

// ── Media products, placements, positions ──────────────────────────────
//
// What the retailer sells. A media product is the sellable thing — composed
// by the retailer (today in AdCRM, from here on in Edge) with its rate card,
// its buying models and the rules it comes with. Inside it sit placements,
// and inside those the positions the ad server fills. How deep that goes
// differs per proposition: display and offsite group positions into
// placements; sponsored products and the in-store engines put positions
// straight under the product.

export type BuyingModel = 'guaranteed' | 'auction';
/** What the list price is a price of. */
export type PricingBasis = 'cpm' | 'cpc' | 'per-day' | 'flat';
export type MediaProductStatus = 'draft' | 'active' | 'archived';

export interface MediaProduct {
  id: string;
  engine: EngineId;
  name: string;
  description?: string;
  /** Executing partner behind this channel (e.g. Epsilon, Chicory, Vistar). */
  partner?: string;
  status?: MediaProductStatus;
  /** How it can be bought; a product can offer both. */
  buyingModels?: BuyingModel[];
  /** The rate card: what the list price is a price of, and the price itself. */
  pricingBasis?: PricingBasis;
  listPrice?: number;
  /** Auction: the lowest bid accepted. */
  floorPrice?: number;
  /** How long a booking in review holds inventory — and its price — before
   *  the hold is released. */
  holdDays?: number;
  /** The rules the product comes with: minimum run time, formats, share caps. */
  constraints?: string[];
  owner?: string;
}

/** A grouping of positions inside a media product — "Above the fold". */
export interface Placement {
  id: string;
  mediaProductId: string;
  name: string;
  description?: string;
}

// ── Pricing rules ───────────────────────────────────────────────────────
//
// How the list price moves. Each rule is an index on the price for the
// dates or the demand it applies to: seasonality (Q4, retail moments), the
// market (what the category commands), demand (fill rate), and the booking
// itself (early, or big). The rules stack in priority order; the build-up
// is shown wherever a price is.

export type PricingRuleKind = 'seasonality' | 'moment' | 'market' | 'demand' | 'early-booking' | 'volume';

export interface PricingRule {
  id: string;
  name: string;
  kind: PricingRuleKind;
  /** The proposition it applies to, or every one. */
  engine: EngineId | 'all';
  /** Only these products; empty means every product of the engine. */
  mediaProductIds?: string[];
  /** Multiplier on the price: 1.25 is +25%, 0.9 is −10%. */
  index: number;
  /** Seasonality and moments: the dates the index holds for. */
  from?: string;
  to?: string;
  /** Demand: applies when the position's fill rate is at least this share. */
  minFillRate?: number;
  /** Early booking: applies when booked at least this many days ahead. */
  minDaysAhead?: number;
  /** Volume: applies from this booking budget. */
  minBudget?: number;
  /** What it is for, in the retailer's words. */
  description?: string;
  priority: number;
  status: 'active' | 'draft' | 'paused';
  updatedAt: string;
}

// ── Inventory holds ─────────────────────────────────────────────────────
//
// A booking in review holds inventory: units on a position for its run
// time, at the price that stood when it was booked. The hold expires after
// the product's hold days unless the booking is confirmed, and is released
// when the booking is cancelled.

export interface InventoryHold {
  id: string;
  bookingId: string;
  positionId: string;
  from: string;
  to: string;
  units: number;
  /** The price locked with the hold, in the product's basis. */
  priceLocked: number;
  heldAt: string;
  expiresAt: string;
  status: 'held' | 'confirmed' | 'released' | 'expired';
}

export interface Position {
  id: string;
  mediaProductId: string;
  /** The placement it sits in, where the proposition groups positions. */
  placementId?: string;
  name: string;
  description?: string;
  /** Bookable slots per day (capacity model kept deliberately simple). */
  /** Creative format this slot takes, e.g. "Billboard 970x250". */
  format?: string;
  dailyCapacity: number;
  /** Auction: the lowest bid the position accepts, € CPM. */
  floorPrice?: number;
  /** Guaranteed: the fixed price of a day on the position, €. */
  listPrice?: number;
}

// ── Allow and block lists ───────────────────────────────────────────────

/**
 * Who may, and who may not, buy a proposition. A retailer keeps an allow
 * list (only these) or a block list (never these) per proposition — an
 * advertiser, a brand or a whole category — with the reason on record.
 */
export interface PropositionListing {
  id: string;
  engine: EngineId;
  kind: 'allow' | 'block';
  subject: 'advertiser' | 'brand' | 'category';
  name: string;
  reason?: string;
  addedAt: string;
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

// ── Creatives ──────────────────────────────────────────────────────────

/** Where a creative stands in the approval workflow — the shared vocabulary
 *  of the creative portal. `requested` is an open ask to the advertiser;
 *  approval logic itself lives with the engine. */
export type CreativeApprovalStatus =
  | 'requested'
  | 'draft'
  | 'submitted'
  | 'in-review'
  | 'approved'
  | 'rejected';

/** One setting a template asks for — the schema the builder renders. */
export interface CreativeTemplateField {
  key: string;
  label: string;
  type: 'text' | 'color' | 'image' | 'number' | 'toggle' | 'select';
  required?: boolean;
  placeholder?: string;
  hint?: string;
  /** Text fields that differ per language (header, CTA). */
  localized?: boolean;
  /** The list a 'select' field chooses from (CTA list, colour list). */
  options?: string[];
  /** Character limit on a text field — shown as "max. N characters". */
  maxLength?: number;
  /** How much of the form row the field takes. Text and images default to
   *  the full row — a headline or URL needs the room — everything else to
   *  half, so short controls sit in pairs. */
  width?: 'full' | 'half';
}

/**
 * A creative template — the engine's own definition of what a format needs.
 * Template logic lives with the proposition: a shelf wobbler and an open-web
 * banner ask for different things. One template renders to ALL its sizes
 * (fill it once, every size follows), which is what later format automation
 * builds on.
 */
export interface CreativeTemplate {
  id: string;
  engine: EngineId;
  name: string;
  /** One line: when to use this template. */
  description: string;
  /** The sizes this template renders to — "970x250", "A6", "1080x1920 15s". */
  sizes: string[];
  /** Which preview rig draws it. */
  preview: 'banner' | 'app-screen' | 'video' | 'instore-screen' | 'print' | 'social';
  fields: CreativeTemplateField[];
  /** File guidance shown as the format requirements. */
  fileHint?: string;
}

/** A creative: a filled-in template, linked to the bookings it runs on. */
export interface Creative {
  id: string;
  name: string;
  engine: EngineId;
  templateId: string;
  status: CreativeApprovalStatus;
  /** Field values by field key; localized fields store per language under
   *  `${lang}:${key}` with the bare key as the default language (EN). */
  values: Record<string, string>;
  /** Languages this creative carries text for; first is the default. */
  languages: string[];
  /** The SKUs this creative promotes — comma-entered, chip-shown. */
  skus?: string[];
  bookingIds: string[];
  /** Why the engine rejected it — always given with a rejection. */
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Workflows ───────────────────────────────────────────────────────────

/** What a step is: a lifecycle stage, a human approval, a derived check, a
 *  to-do for a person or partner (print, install), or a notification. A
 *  configuration rule is a card on a check. */
export type WorkflowStepKind = 'stage' | 'approval' | 'check' | 'todo' | 'notification';
/** Whose move it is. */
export type WorkflowOwner = 'advertiser' | 'retailer' | 'edge' | 'external';
/** What Edge does when a step is reached or completed. */
export type WorkflowActionType = 'email' | 'notification' | 'todo' | 'check' | 'rule' | 'set-status' | 'kafka' | 'log';

export interface WorkflowAction {
  id: string;
  type: WorkflowActionType;
  /** The card's title — the preset it was made from ("Booking approved"). */
  title?: string;
  /** "Email the advertiser the upload link" — what it does, in words. */
  label: string;
  /** Who receives it, for email / notification / to-do. */
  to?: WorkflowOwner;
  /** The configuration rule a 'rule' card applies, by id. */
  rule?: string;
}

/**
 * The setup work Edge can see for itself: a workflow step that carries one of
 * these keys is ticked off from the data (a campaign approved, bookings
 * made, creatives linked) rather than by hand. The media plan's setup cards
 * and the campaign's workflow bar both list exactly these steps, so the
 * retailer's board is the one place the setup is defined.
 */
export type SetupStepKey = 'approve-campaign' | 'create-bookings' | 'approve-bookings' | 'link-creatives' | 'add-targeting' | 'add-campaigns' | 'approve-campaigns';

export interface WorkflowStep {
  id: string;
  kind: WorkflowStepKind;
  /** Which setup step this stands for, when Edge derives its done state. */
  setup?: SetupStepKey;
  name: string;
  description?: string;
  owner: WorkflowOwner;
  /** A mandatory step blocks the next stage until it is done. */
  mandatory: boolean;
  /** Due this many days before the flight starts (OMI: creatives X-4). */
  dueDaysBeforeStart?: number;
  /** How long the owner has before Edge escalates. */
  slaDays?: number;
  /** Who is told when the SLA passes. */
  escalateTo?: WorkflowOwner;
  /** Who steps in when the owner is absent. */
  deputy?: string;
  actions: WorkflowAction[];
  /** Position on the board. */
  x: number;
  y: number;
}

export interface WorkflowTransition {
  id: string;
  from: string;
  to: string;
  /** The condition or outcome this edge stands for ("approved", "changes requested"). */
  label?: string;
}

/**
 * A retailer's workflow for one proposition — the statuses, checks,
 * approvals, fulfilment steps and notifications a booking passes through,
 * and the order they come in. The vocabulary is shared; what is mandatory,
 * who approves, deputies and SLAs are the retailer's to set, on the board.
 */
/** What a workflow governs: a proposition's campaigns, or the media plan above them. */
export type WorkflowScope = EngineId | 'media-plan';

export interface Workflow {
  id: string;
  engine: WorkflowScope;
  name: string;
  description: string;
  status: 'draft' | 'published';
  steps: WorkflowStep[];
  transitions: WorkflowTransition[];
  updatedAt: string;
  publishedAt?: string;
}

// ── The database document ──────────────────────────────────────────────

export interface DbData {
  /** Bumped when the seed shape changes — mismatched stores are re-seeded. */
  version: number;
  engines: Engine[];
  users: DbUser[];
  advertisers: Advertiser[];
  retailProducts: RetailProduct[];
  mediaPlans: MediaPlan[];
  campaigns: Campaign[];
  bookings: Booking[];
  metricDefinitions: MetricDefinition[];
  mediaProducts: MediaProduct[];
  placements: Placement[];
  positions: Position[];
  pricingRules: PricingRule[];
  inventoryHolds: InventoryHold[];
  availability: AvailabilityEntry[];
  faqs: FaqEntry[];
  terms: TermEntry[];
  releaseNotes: ReleaseNote[];
  creativeTemplates: CreativeTemplate[];
  creatives: Creative[];
  workflows: Workflow[];
  listings: PropositionListing[];
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
