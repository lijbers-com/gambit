import type { DbData } from './types';

/**
 * Seed data for the prototype database. Users map 1:1 to the EpicContext
 * personas (ahold-delhaize/edge → users/personas). Media plans / campaigns /
 * bookings cover all five engines with varied statuses — including completed
 * history — so overviews, insights and metrics read realistically. Several
 * entities deliberately miss creatives/placements to exercise the derived
 * to-do engine (tasks.ts).
 *
 * Bump `version` whenever the seed shape changes — stale localStorage copies
 * are then replaced with this seed on next load.
 */
export const SEED_VERSION = 5;

const now = '2026-07-30T00:00:00.000Z';

export const seedData: DbData = {
  version: SEED_VERSION,

  // ── Engines ──────────────────────────────────────────────────────────
  engines: [
    { id: 'display', name: 'Display' },
    { id: 'sponsored-products', name: 'Sponsored products' },
    { id: 'digital-instore', name: 'Digital in-store' },
    { id: 'offline-instore', name: 'Offline in-store' },
    { id: 'offsite', name: 'Offsite' },
  ],

  // ── Users (EpicContext personas) ─────────────────────────────────────
  users: [
    { id: 'u-campaign-builder',    name: 'Emma van Dijk',    role: 'Campaign Builder (Media Specialist)',      personaKey: 'campaign-builder',              side: 'retailer',   theme: 'gambit' },
    { id: 'u-campaign-manager',    name: 'Lucas Meijer',     role: 'Campaign Manager (Managed Service)',       personaKey: 'campaign-manager-managed',      side: 'retailer',   theme: 'gambit' },
    { id: 'u-account-manager',     name: 'Sophie Bakker',    role: 'Account Manager (Sales)',                  personaKey: 'account-manager-sales',         side: 'retailer',   theme: 'gambit' },
    { id: 'u-yield-manager',       name: 'Daan Visser',      role: 'Yield Manager',                            personaKey: 'yield-manager',                 side: 'retailer',   theme: 'gambit' },
    { id: 'u-performance-analyst', name: 'Julia de Vries',   role: 'Performance Analyst',                      personaKey: 'performance-analyst',           side: 'retailer',   theme: 'gambit' },
    { id: 'u-selfservice-support', name: 'Tim Jansen',       role: 'Self-Service Support Specialist',          personaKey: 'self-service-support-specialist', side: 'retailer', theme: 'gambit' },
    { id: 'u-proposition-dev',     name: 'Nora Smit',        role: 'Media Proposition Developer',              personaKey: 'media-proposition-developer',   side: 'retailer',   theme: 'gambit' },
    { id: 'u-tech-ops',            name: 'Ruben Mulder',     role: 'Technology & Operations Support',          personaKey: 'tech-ops-support',              side: 'retailer',   theme: 'gambit' },
    { id: 'u-ecommerce-manager',   name: 'Fleur Hendriks',   role: 'eCommerce Manager – Qcom & New Channels',  personaKey: 'ecommerce-manager',             side: 'retailer',   theme: 'gambit' },
    // Advertiser side — the two roles a retailer's self-service platform serves:
    // the media agency buying on behalf of advertisers, and the advertiser
    // themselves (in-house shopper/brand marketeer).
    { id: 'u-agency-advertiser',   name: 'Alex Romero',      role: 'Media Agency Advertiser',                  personaKey: 'media-agency-advertiser',       side: 'advertiser', theme: 'albert-heijn', advertiserId: 'adv-acme' },
    { id: 'u-advertiser',          name: 'Lotte Peters',     role: 'Advertiser (Unilever Shopper Marketing)',  personaKey: 'advertiser',                    side: 'advertiser', theme: 'albert-heijn', advertiserId: 'adv-unilever-shopper' },
  ],

  // ── Advertisers & brands (aligned with the create wizard's options) ──
  advertisers: [
    {
      id: 'adv-acme',
      name: 'Acme Media',
      brands: [
        { id: 'br-coca-cola', name: 'Coca-Cola', hasRetailProducts: true },
        { id: 'br-heineken', name: 'Heineken', hasRetailProducts: true },
        { id: 'br-nutella', name: 'Nutella', hasRetailProducts: true },
      ],
    },
    {
      id: 'adv-brand-alliance',
      name: 'Brand Alliance',
      brands: [
        { id: 'br-knorr', name: 'Knorr', hasRetailProducts: true },
        { id: 'br-dove', name: 'Dove' },
      ],
    },
    {
      id: 'adv-global-brands',
      name: 'Global Brands Co.',
      brands: [
        { id: 'br-pepsi', name: 'Pepsi', hasRetailProducts: true },
        { id: 'br-redbull', name: 'Red Bull', hasRetailProducts: true },
      ],
    },
    {
      id: 'adv-unilever-shopper',
      name: 'Unilever Shopper Marketing',
      brands: [
        { id: 'br-magnum', name: 'Magnum', hasRetailProducts: true },
        { id: 'br-lipton', name: 'Lipton', hasRetailProducts: true },
      ],
    },
    {
      id: 'adv-nestle-trade',
      name: 'Nestlé Trade Marketing',
      brands: [
        { id: 'br-kitkat', name: 'KitKat', hasRetailProducts: true },
        { id: 'br-nescafe', name: 'Nescafé', hasRetailProducts: true },
      ],
    },
  ],

  // ── Media plans ──────────────────────────────────────────────────────
  mediaPlans: [
    // Completed history (feeds insights with a full delivered flight).
    {
      id: 'MP-001', name: 'Spring Refresh', poNumber: 'PO-2026-0011',
      advertiserId: 'adv-unilever-shopper', brandIds: ['br-magnum'],
      status: 'completed', goal: 'awareness', objective: 'merkbekendheid',
      kpis: ['toma'], budget: 20000,
      startDate: '2026-03-01', endDate: '2026-04-15',
      createdBy: 'u-campaign-manager', createdAt: now, updatedAt: now,
    },
    {
      id: 'MP-002', name: 'Holiday Sale Plan', poNumber: 'PO-2026-0042',
      advertiserId: 'adv-acme', brandIds: ['br-coca-cola', 'br-heineken'],
      status: 'running', goal: 'awareness', objective: 'merkbekendheid',
      kpis: ['toma', 'cep'], budget: 15000,
      startDate: '2026-06-01', endDate: '2026-08-15',
      createdBy: 'u-campaign-builder', createdAt: now, updatedAt: now,
    },
    {
      id: 'MP-003', name: 'Summer Launch Plan', poNumber: 'PO-2026-0055',
      advertiserId: 'adv-brand-alliance', brandIds: ['br-knorr'],
      status: 'running', goal: 'consideration', objective: 'merkoverweging',
      kpis: ['ctr', 'vcr'], budget: 8000,
      startDate: '2026-07-01', endDate: '2026-08-31',
      createdBy: 'u-campaign-manager', createdAt: now, updatedAt: now,
    },
    {
      id: 'MP-004', name: 'Back to School Plan', poNumber: 'PO-2026-0061',
      advertiserId: 'adv-global-brands', brandIds: ['br-pepsi'],
      status: 'in-option', goal: 'purchase', objective: 'sales-zonder-promo',
      kpis: ['roas', 'sales-lift'], budget: 12000,
      startDate: '2026-08-10', endDate: '2026-09-10',
      createdBy: 'u-campaign-builder', createdAt: now, updatedAt: now,
    },
    {
      id: 'MP-005', name: 'Coffee Moments', poNumber: 'PO-2026-0068',
      advertiserId: 'adv-nestle-trade', brandIds: ['br-nescafe'],
      status: 'running', goal: 'loyalty', objective: 'herhaalaankoop',
      kpis: ['roas', 'frequency'], budget: 10000,
      startDate: '2026-07-01', endDate: '2026-09-30',
      createdBy: 'u-account-manager', createdAt: now, updatedAt: now,
    },
    {
      id: 'MP-006', name: 'Ice Cream Summer', poNumber: 'PO-2026-0071',
      advertiserId: 'adv-unilever-shopper', brandIds: ['br-magnum', 'br-lipton'],
      status: 'paused', goal: 'purchase', objective: 'sales-zonder-promo',
      kpis: ['roas'], budget: 9000,
      startDate: '2026-06-15', endDate: '2026-08-31',
      createdBy: 'u-campaign-manager', createdAt: now, updatedAt: now,
    },
    {
      id: 'MP-007', name: 'Black Friday Plan', poNumber: 'PO-2026-0078',
      advertiserId: 'adv-global-brands', brandIds: ['br-redbull'],
      status: 'draft', goal: 'purchase', objective: 'bonus-promo',
      kpis: ['roas', 'sales-lift'], budget: 40000,
      startDate: '2026-11-01', endDate: '2026-11-30',
      createdBy: 'u-account-manager', createdAt: now, updatedAt: now,
    },
    {
      id: 'MP-008', name: 'Winter Warmers', poNumber: '',
      advertiserId: 'adv-brand-alliance', brandIds: ['br-knorr'],
      status: 'draft', goal: 'consideration', objective: 'merkoverweging',
      kpis: ['ctr'], budget: 0, // budget deliberately unset → derived to-do
      startDate: '2026-12-01', endDate: '2026-12-31',
      createdBy: 'u-agency-advertiser', createdAt: now, updatedAt: now,
    },
  ],

  // ── Campaigns (all five engines, varied statuses) ────────────────────
  campaigns: [
    // MP-001 Spring Refresh — completed history
    { id: 'C-001', mediaPlanId: 'MP-001', name: 'Spring Refresh — Display',            engine: 'display',            status: 'completed', budget: 8000, spend: 7900, startDate: '2026-03-01', endDate: '2026-04-15', createdAt: now, updatedAt: now },
    { id: 'C-002', mediaPlanId: 'MP-001', name: 'Spring Refresh — Digital in-store',   engine: 'digital-instore',    status: 'completed', budget: 7000, spend: 6800, startDate: '2026-03-01', endDate: '2026-04-15', createdAt: now, updatedAt: now },
    { id: 'C-003', mediaPlanId: 'MP-001', name: 'Spring Refresh — Offsite',            engine: 'offsite',            status: 'completed', budget: 5000, spend: 4950, startDate: '2026-03-08', endDate: '2026-04-15', createdAt: now, updatedAt: now },
    // MP-002 Holiday Sale — live flagship
    { id: 'C-004', mediaPlanId: 'MP-002', name: 'Holiday Sale — Display',              engine: 'display',            status: 'running',   budget: 5000, spend: 3800, startDate: '2026-06-01', endDate: '2026-08-15', createdAt: now, updatedAt: now },
    { id: 'C-005', mediaPlanId: 'MP-002', name: 'Holiday Sale — Sponsored products',   engine: 'sponsored-products', status: 'running',   budget: 4000, spend: 3600, startDate: '2026-06-01', endDate: '2026-08-15', createdAt: now, updatedAt: now },
    { id: 'C-006', mediaPlanId: 'MP-002', name: 'Holiday Sale — Digital in-store',     engine: 'digital-instore',    status: 'in-option', budget: 3000, spend: 1200, startDate: '2026-06-08', endDate: '2026-08-15', createdAt: now, updatedAt: now },
    { id: 'C-007', mediaPlanId: 'MP-002', name: 'Holiday Sale — Offsite',              engine: 'offsite',            status: 'in-option', budget: 3000, spend: 600,  startDate: '2026-06-08', endDate: '2026-08-15', createdAt: now, updatedAt: now },
    // MP-003 Summer Launch — live
    { id: 'C-008', mediaPlanId: 'MP-003', name: 'Summer Launch — Display',             engine: 'display',            status: 'running',   budget: 5000, spend: 2100, startDate: '2026-07-01', endDate: '2026-08-31', createdAt: now, updatedAt: now },
    { id: 'C-009', mediaPlanId: 'MP-003', name: 'Summer Launch — Offsite',             engine: 'offsite',            status: 'running',   budget: 3000, spend: 900,  startDate: '2026-07-01', endDate: '2026-08-31', createdAt: now, updatedAt: now },
    // MP-004 Back to School — in option
    { id: 'C-010', mediaPlanId: 'MP-004', name: 'Back to School — Sponsored products', engine: 'sponsored-products', status: 'in-option', budget: 7000, spend: 0, startDate: '2026-08-10', endDate: '2026-09-10', createdAt: now, updatedAt: now },
    { id: 'C-011', mediaPlanId: 'MP-004', name: 'Back to School — Offline in-store',   engine: 'offline-instore',    status: 'draft',     budget: 5000, spend: 0, startDate: '2026-08-17', endDate: '2026-09-10', createdAt: now, updatedAt: now },
    // MP-005 Coffee Moments — running loyalty
    { id: 'C-012', mediaPlanId: 'MP-005', name: 'Coffee Moments — Sponsored products', engine: 'sponsored-products', status: 'running',   budget: 4000, spend: 1400, startDate: '2026-07-01', endDate: '2026-09-30', createdAt: now, updatedAt: now },
    { id: 'C-013', mediaPlanId: 'MP-005', name: 'Coffee Moments — Digital in-store',   engine: 'digital-instore',    status: 'running',   budget: 3000, spend: 900,  startDate: '2026-07-01', endDate: '2026-09-30', createdAt: now, updatedAt: now },
    { id: 'C-014', mediaPlanId: 'MP-005', name: 'Coffee Moments — Offline in-store',   engine: 'offline-instore',    status: 'in-option', budget: 3000, spend: 0,    startDate: '2026-08-01', endDate: '2026-09-30', createdAt: now, updatedAt: now },
    // MP-006 Ice Cream Summer — paused
    { id: 'C-015', mediaPlanId: 'MP-006', name: 'Ice Cream Summer — Display',          engine: 'display',            status: 'paused',    budget: 5000, spend: 2600, startDate: '2026-06-15', endDate: '2026-08-31', createdAt: now, updatedAt: now },
    { id: 'C-016', mediaPlanId: 'MP-006', name: 'Ice Cream Summer — Offline in-store', engine: 'offline-instore',    status: 'paused',    budget: 4000, spend: 1800, startDate: '2026-06-15', endDate: '2026-08-31', createdAt: now, updatedAt: now },
    // MP-007 Black Friday — draft, no bookings yet (create-flow demo)
    { id: 'C-017', mediaPlanId: 'MP-007', name: 'Black Friday — Display',              engine: 'display',            status: 'draft', budget: 15000, spend: 0, startDate: '2026-11-01', endDate: '2026-11-30', createdAt: now, updatedAt: now },
    { id: 'C-018', mediaPlanId: 'MP-007', name: 'Black Friday — Digital in-store',     engine: 'digital-instore',    status: 'draft', budget: 10000, spend: 0, startDate: '2026-11-15', endDate: '2026-11-30', createdAt: now, updatedAt: now },
    { id: 'C-019', mediaPlanId: 'MP-007', name: 'Black Friday — Offsite',              engine: 'offsite',            status: 'draft', budget: 15000, spend: 0, startDate: '2026-11-01', endDate: '2026-11-30', createdAt: now, updatedAt: now },
    // MP-008 Winter Warmers — advertiser draft without budget
    { id: 'C-020', mediaPlanId: 'MP-008', name: 'Winter Warmers — Display',            engine: 'display',            status: 'draft', budget: 0, spend: 0, startDate: '2026-12-01', endDate: '2026-12-31', createdAt: now, updatedAt: now },
  ],

  // ── Bookings ─────────────────────────────────────────────────────────
  bookings: [
    // Spring Refresh (completed, creatives approved)
    { id: 'B-001', campaignId: 'C-001', name: 'Homepage Takeover',          status: 'completed', budget: 4000, spend: 3950, startDate: '2026-03-01', endDate: '2026-03-21', positionIds: ['pos-dsp-home-top'], creativeStatus: 'approved', createdAt: now, updatedAt: now },
    { id: 'B-002', campaignId: 'C-001', name: 'Category Banner — Ice',     status: 'completed', budget: 4000, spend: 3950, startDate: '2026-03-08', endDate: '2026-04-15', positionIds: ['pos-dsp-cat-top'],  creativeStatus: 'approved', createdAt: now, updatedAt: now },
    { id: 'B-003', campaignId: 'C-002', name: 'Entrance Screens',           status: 'completed', budget: 7000, spend: 6800, startDate: '2026-03-01', endDate: '2026-04-15', positionIds: ['pos-dis-entrance'], creativeStatus: 'approved', createdAt: now, updatedAt: now },
    { id: 'B-004', campaignId: 'C-003', name: 'Open Web Display',           status: 'completed', budget: 5000, spend: 4950, startDate: '2026-03-08', endDate: '2026-04-15', positionIds: ['pos-off-web-standard'],  creativeStatus: 'approved', createdAt: now, updatedAt: now },
    // Holiday Sale (live; one creative awaiting approval)
    { id: 'B-005', campaignId: 'C-004', name: 'Homepage Takeover',          status: 'running',   budget: 2500, spend: 2100, startDate: '2026-06-01', endDate: '2026-07-15', positionIds: ['pos-dsp-home-top'], creativeStatus: 'approved',  createdAt: now, updatedAt: now },
    { id: 'B-006', campaignId: 'C-004', name: 'Category Banner — Drinks',   status: 'running',   budget: 2500, spend: 1700, startDate: '2026-06-01', endDate: '2026-08-15', positionIds: ['pos-dsp-cat-top'],  creativeStatus: 'approved',  createdAt: now, updatedAt: now },
    { id: 'B-007', campaignId: 'C-005', name: 'Keywords — cola zero',       status: 'running',   budget: 2000, spend: 1900, startDate: '2026-06-01', endDate: '2026-08-15', positionIds: ['pos-sp-search'],    creativeStatus: 'approved',  createdAt: now, updatedAt: now },
    { id: 'B-008', campaignId: 'C-005', name: 'Keywords — beer & bbq',      status: 'running',   budget: 2000, spend: 1700, startDate: '2026-06-01', endDate: '2026-08-15', positionIds: ['pos-sp-search'],    creativeStatus: 'approved',  createdAt: now, updatedAt: now },
    { id: 'B-009', campaignId: 'C-006', name: 'Entrance Screens',           status: 'in-option', budget: 3000, spend: 1200, startDate: '2026-06-08', endDate: '2026-08-15', positionIds: ['pos-dis-entrance'], creativeStatus: 'submitted', createdAt: now, updatedAt: now },
    { id: 'B-010', campaignId: 'C-007', name: 'Open Web Display',           status: 'in-option', budget: 3000, spend: 600,  startDate: '2026-06-08', endDate: '2026-08-15', positionIds: ['pos-off-web-standard'],  creativeStatus: 'missing',   createdAt: now, updatedAt: now },
    // Summer Launch (live; one placement missing)
    { id: 'B-011', campaignId: 'C-008', name: 'Homepage Takeover',          status: 'running',   budget: 3000, spend: 1400, startDate: '2026-07-01', endDate: '2026-07-31', positionIds: ['pos-dsp-home-top'], creativeStatus: 'approved',  createdAt: now, updatedAt: now },
    { id: 'B-012', campaignId: 'C-008', name: 'PDP Banner',                 status: 'in-option', budget: 2000, spend: 700,  startDate: '2026-07-01', endDate: '2026-08-31', positionIds: [],                   creativeStatus: 'approved',  createdAt: now, updatedAt: now },
    { id: 'B-013', campaignId: 'C-009', name: 'Social Retargeting',         status: 'running',   budget: 3000, spend: 900,  startDate: '2026-07-01', endDate: '2026-08-31', positionIds: ['pos-off-soc-meta'],   creativeStatus: 'approved',  createdAt: now, updatedAt: now },
    // Back to School (in option; creative work outstanding)
    { id: 'B-014', campaignId: 'C-010', name: 'Keywords — school lunch',    status: 'in-option', budget: 7000, spend: 0, startDate: '2026-08-10', endDate: '2026-09-10', positionIds: ['pos-sp-search'], creativeStatus: 'approved', createdAt: now, updatedAt: now },
    { id: 'B-015', campaignId: 'C-011', name: 'Shelf Displays — Snacks',    status: 'draft',     budget: 5000, spend: 0, startDate: '2026-08-17', endDate: '2026-09-10', positionIds: ['pos-ois-shelf'], creativeStatus: 'missing',  createdAt: now, updatedAt: now },
    // Coffee Moments (live loyalty)
    { id: 'B-016', campaignId: 'C-012', name: 'Keywords — coffee & pads',   status: 'running',   budget: 4000, spend: 1400, startDate: '2026-07-01', endDate: '2026-09-30', positionIds: ['pos-sp-search'],    creativeStatus: 'approved',  createdAt: now, updatedAt: now },
    { id: 'B-017', campaignId: 'C-013', name: 'Aisle Screens — Coffee',     status: 'running',   budget: 3000, spend: 900,  startDate: '2026-07-01', endDate: '2026-09-30', positionIds: ['pos-dis-aisle'],    creativeStatus: 'approved',  createdAt: now, updatedAt: now },
    { id: 'B-018', campaignId: 'C-014', name: 'Floor Stickers — Coffee',    status: 'in-option', budget: 3000, spend: 0,    startDate: '2026-08-01', endDate: '2026-09-30', positionIds: ['pos-ois-floor'],    creativeStatus: 'submitted', createdAt: now, updatedAt: now },
    // Ice Cream Summer (paused)
    { id: 'B-019', campaignId: 'C-015', name: 'Homepage Takeover',          status: 'paused',    budget: 5000, spend: 2600, startDate: '2026-06-15', endDate: '2026-08-31', positionIds: ['pos-dsp-home-mid'], creativeStatus: 'approved', createdAt: now, updatedAt: now },
    { id: 'B-020', campaignId: 'C-016', name: 'Shelf Displays — Ice cream', status: 'paused',    budget: 4000, spend: 1800, startDate: '2026-06-15', endDate: '2026-08-31', positionIds: ['pos-ois-shelf'],    creativeStatus: 'approved', createdAt: now, updatedAt: now },
    // Black Friday: campaigns exist, bookings deliberately absent (create-flow demo)
  ],

  // ── Metric registry (the per-engine metric overview) ─────────────────
  metricDefinitions: [
    // Display
    { key: 'spend',       label: 'Spend',       engine: 'display', scopes: ['overview', 'campaign', 'booking'], format: 'currency', description: 'Media spend against budget.' },
    { key: 'impressions', label: 'Impressions', engine: 'display', scopes: ['overview', 'campaign', 'booking'], format: 'number',   description: 'Ad impressions served.' },
    { key: 'reach',       label: 'Reach',       engine: 'display', scopes: ['overview', 'campaign', 'booking'], format: 'number',   description: 'Unique users reached.' },
    { key: 'ctr',         label: 'CTR',         engine: 'display', scopes: ['overview', 'campaign', 'booking'], format: 'percent',  description: 'Click-through rate.' },
    { key: 'roas',        label: 'ROAS',        engine: 'display', scopes: ['overview', 'campaign', 'booking'], format: 'ratio',    description: 'Return on ad spend.' },
    { key: 'frequency',   label: 'Frequency',   engine: 'display', scopes: ['overview', 'campaign', 'booking'], format: 'ratio',    description: 'Average impressions per user.' },
    { key: 'viewability', label: 'Viewability', engine: 'display', scopes: ['overview', 'campaign', 'booking'], format: 'percent',  description: 'Share of impressions actually viewable.' },
    // Sponsored products
    { key: 'spend',       label: 'Spend',       engine: 'sponsored-products', scopes: ['overview', 'campaign', 'booking'], format: 'currency', description: 'Media spend against budget.' },
    { key: 'roas',        label: 'ROAS',        engine: 'sponsored-products', scopes: ['overview', 'campaign', 'booking'], format: 'ratio',    description: 'Return on ad spend.' },
    { key: 'sales',       label: 'Sales',       engine: 'sponsored-products', scopes: ['overview', 'campaign', 'booking'], format: 'currency', description: 'Attributed sales.' },
    { key: 'clicks',      label: 'Clicks',      engine: 'sponsored-products', scopes: ['overview', 'campaign', 'booking'], format: 'number',   description: 'Product ad clicks.' },
    { key: 'conversions', label: 'Conversions', engine: 'sponsored-products', scopes: ['overview', 'campaign', 'booking'], format: 'number',   description: 'Attributed conversions.' },
    { key: 'ctr',         label: 'CTR',         engine: 'sponsored-products', scopes: ['overview', 'campaign', 'booking'], format: 'percent',  description: 'Click-through rate.' },
    { key: 'cpc',         label: 'CPC',         engine: 'sponsored-products', scopes: ['overview', 'campaign', 'booking'], format: 'currency', description: 'Cost per click.' },
    // Digital in-store
    { key: 'spend',         label: 'Spend',          engine: 'digital-instore', scopes: ['overview', 'campaign', 'booking'], format: 'currency', description: 'Media spend against budget.' },
    { key: 'plays',         label: 'Plays',          engine: 'digital-instore', scopes: ['overview', 'campaign', 'booking'], format: 'number',   description: 'Screen plays across loops.' },
    { key: 'impressions',   label: 'Impressions',    engine: 'digital-instore', scopes: ['overview', 'campaign', 'booking'], format: 'number',   description: 'Estimated shopper impressions.' },
    { key: 'reach',         label: 'Shopper reach',  engine: 'digital-instore', scopes: ['overview', 'campaign', 'booking'], format: 'number',   description: 'Unique shoppers reached in store.' },
    { key: 'availableTime', label: 'Available time', engine: 'digital-instore', scopes: ['overview', 'campaign', 'booking'], format: 'percent',  description: 'Remaining share of weekly loop time.' },
    { key: 'roas',          label: 'ROAS',           engine: 'digital-instore', scopes: ['overview', 'campaign', 'booking'], format: 'ratio',    description: 'Return on ad spend.' },
    // Offline in-store
    { key: 'spend',  label: 'Spend',             engine: 'offline-instore', scopes: ['overview', 'campaign', 'booking'], format: 'currency', description: 'Media spend against budget.' },
    { key: 'stores', label: 'Stores',            engine: 'offline-instore', scopes: ['overview', 'campaign', 'booking'], format: 'number',   description: 'Stores live in the window.' },
    { key: 'reach',  label: 'Shopper reach',     engine: 'offline-instore', scopes: ['overview', 'campaign', 'booking'], format: 'number',   description: 'Estimated POS shopper reach.' },
    { key: 'sales',  label: 'Incremental sales', engine: 'offline-instore', scopes: ['overview', 'campaign', 'booking'], format: 'currency', description: 'Attributed incremental sales.' },
    { key: 'iroas',  label: 'iROAS',             engine: 'offline-instore', scopes: ['overview', 'campaign', 'booking'], format: 'ratio',    description: 'Incremental return on ad spend.' },
    { key: 'sov',    label: 'SOV',               engine: 'offline-instore', scopes: ['overview', 'campaign', 'booking'], format: 'percent',  description: 'Share of voice in category.' },
    // Offsite
    { key: 'spend',       label: 'Spend',       engine: 'offsite', scopes: ['overview', 'campaign', 'booking'], format: 'currency', description: 'Media spend against budget.' },
    { key: 'impressions', label: 'Impressions', engine: 'offsite', scopes: ['overview', 'campaign', 'booking'], format: 'number',   description: 'Ad impressions served.' },
    { key: 'reach',       label: 'Reach',       engine: 'offsite', scopes: ['overview', 'campaign', 'booking'], format: 'number',   description: 'Unique users reached.' },
    { key: 'buyerReach',  label: 'Buyer reach', engine: 'offsite', scopes: ['overview', 'campaign', 'booking'], format: 'number',   description: 'Qualified buyers reached.' },
    { key: 'roas',        label: 'ROAS',        engine: 'offsite', scopes: ['overview', 'campaign', 'booking'], format: 'ratio',    description: 'Return on ad spend.' },
    { key: 'frequency',   label: 'Frequency',   engine: 'offsite', scopes: ['overview', 'campaign', 'booking'], format: 'ratio',    description: 'Average impressions per user.' },
  ],

  // ── Channels & positions ─────────────────────────────────────────────
  // Channel (media product/platform) → positions, per engine. Offsite follows
  // the activation-arm diagram: channels with executing partners; for Social
  // Media the positions ARE the platforms (Meta, TikTok, Pinterest, YouTube).
  mediaProducts: [
    // Display (onsite)
    { id: 'mprod-dsp-home', engine: 'display', name: 'Homepage',        description: 'Banners on the storefront homepage.' },
    { id: 'mprod-dsp-cat',  engine: 'display', name: 'Category pages',  description: 'Banners on category listing pages.' },
    { id: 'mprod-dsp-pdp',  engine: 'display', name: 'Product pages',   description: 'Banners on product detail pages.' },
    // Sponsored products
    { id: 'mprod-sp-search', engine: 'sponsored-products', name: 'Search results', description: 'Sponsored product slots in search.' },
    // Digital in-store
    { id: 'mprod-dis-instore', engine: 'digital-instore', name: 'In-store screens', description: 'Digital screens in physical stores.' },
    // Offline in-store
    { id: 'mprod-ois-print',   engine: 'offline-instore', name: 'Printed materials', description: 'Shelf displays, floor stickers, posters.' },
    // Offsite — channel terminology per the activation-arm diagram
    { id: 'mprod-off-display',    engine: 'offsite', name: 'Display',                    description: 'Programmatic display on the open web.', partner: 'Epsilon' },
    { id: 'mprod-off-olv',        engine: 'offsite', name: 'Online Video (OLV)',         description: 'In-stream and out-stream online video.', partner: 'Epsilon' },
    { id: 'mprod-off-ctv',        engine: 'offsite', name: 'Connected TV (CTV)',         description: 'Streaming TV inventory on connected devices.', partner: 'Epsilon' },
    { id: 'mprod-off-contextual', engine: 'offsite', name: 'Contextual Commerce Media',  description: 'Recipe and contextual commerce placements.', partner: 'Chicory' },
    { id: 'mprod-off-social',     engine: 'offsite', name: 'Social Media',               description: 'Paid social — the positions are the platforms.' },
    { id: 'mprod-off-dooh',       engine: 'offsite', name: 'Digital Out Of Home',        description: 'Digital screens out of home.', partner: 'Vistar' },
  ],
  positions: [
    { id: 'pos-dsp-home-top', mediaProductId: 'mprod-dsp-home',  name: 'Homepage top banner',      dailyCapacity: 4 },
    { id: 'pos-dsp-home-mid', mediaProductId: 'mprod-dsp-home',  name: 'Homepage mid banner',      dailyCapacity: 6 },
    { id: 'pos-dsp-cat-top',  mediaProductId: 'mprod-dsp-cat',   name: 'Category top banner',      dailyCapacity: 8 },
    { id: 'pos-dsp-pdp',      mediaProductId: 'mprod-dsp-pdp',   name: 'PDP banner',               dailyCapacity: 12 },
    { id: 'pos-sp-search',    mediaProductId: 'mprod-sp-search', name: 'Search results slot',      dailyCapacity: 40 },
    { id: 'pos-dis-entrance', mediaProductId: 'mprod-dis-instore', name: 'Entrance screens',       dailyCapacity: 6 },
    { id: 'pos-dis-aisle',    mediaProductId: 'mprod-dis-instore', name: 'Aisle screens',          dailyCapacity: 10 },
    { id: 'pos-ois-shelf',    mediaProductId: 'mprod-ois-print', name: 'Shelf displays',           dailyCapacity: 20 },
    { id: 'pos-ois-floor',    mediaProductId: 'mprod-ois-print', name: 'Floor stickers',           dailyCapacity: 15 },
    // Offsite positions per channel
    { id: 'pos-off-web-standard', mediaProductId: 'mprod-off-display',    name: 'Open web display',      dailyCapacity: 100 },
    { id: 'pos-off-olv-instream', mediaProductId: 'mprod-off-olv',        name: 'In-stream video',       dailyCapacity: 60 },
    { id: 'pos-off-ctv-spot',     mediaProductId: 'mprod-off-ctv',        name: 'CTV spot',              dailyCapacity: 30 },
    { id: 'pos-off-ctx-recipe',   mediaProductId: 'mprod-off-contextual', name: 'Recipe placements',     dailyCapacity: 50 },
    // Social Media: positions are the platforms
    { id: 'pos-off-soc-meta',      mediaProductId: 'mprod-off-social', name: 'Meta',            dailyCapacity: 100 },
    { id: 'pos-off-soc-tiktok',    mediaProductId: 'mprod-off-social', name: 'TikTok',          dailyCapacity: 100 },
    { id: 'pos-off-soc-pinterest', mediaProductId: 'mprod-off-social', name: 'Pinterest',       dailyCapacity: 100 },
    { id: 'pos-off-soc-youtube',   mediaProductId: 'mprod-off-social', name: 'YouTube (DV360)', dailyCapacity: 100 },
    { id: 'pos-off-dooh-screens',  mediaProductId: 'mprod-off-dooh',   name: 'DOOH screens',    dailyCapacity: 40 },
  ],

  // Seeded per-week booked load across the summer flights; the calendar and
  // availability views derive free capacity as dailyCapacity×7 − booked.
  availability: [
    { positionId: 'pos-dsp-home-top', week: '2026-W27', booked: 24 },
    { positionId: 'pos-dsp-home-top', week: '2026-W28', booked: 28 },
    { positionId: 'pos-dsp-home-top', week: '2026-W29', booked: 26 },
    { positionId: 'pos-dsp-home-top', week: '2026-W30', booked: 20 },
    { positionId: 'pos-dsp-home-mid', week: '2026-W28', booked: 30 },
    { positionId: 'pos-dsp-cat-top',  week: '2026-W27', booked: 40 },
    { positionId: 'pos-dsp-cat-top',  week: '2026-W28', booked: 48 },
    { positionId: 'pos-dsp-pdp',      week: '2026-W28', booked: 55 },
    { positionId: 'pos-sp-search',    week: '2026-W27', booked: 190 },
    { positionId: 'pos-sp-search',    week: '2026-W28', booked: 230 },
    { positionId: 'pos-sp-search',    week: '2026-W29', booked: 210 },
    { positionId: 'pos-dis-entrance', week: '2026-W28', booked: 32 },
    { positionId: 'pos-dis-aisle',    week: '2026-W28', booked: 45 },
    { positionId: 'pos-ois-shelf',    week: '2026-W33', booked: 70 },
    { positionId: 'pos-ois-floor',    week: '2026-W32', booked: 40 },
    { positionId: 'pos-off-web-standard',  week: '2026-W28', booked: 380 },
    { positionId: 'pos-off-soc-meta',  week: '2026-W28', booked: 300 },
  ],
};
