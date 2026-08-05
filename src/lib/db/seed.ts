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
export const SEED_VERSION = 9;

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
      kpis: ['ctr', 'vcr'], budget: 8000, autoBudget: true,
      startDate: '2026-07-01', endDate: '2026-08-31',
      createdBy: 'u-campaign-manager', createdAt: now, updatedAt: now,
    },
    {
      id: 'MP-004', name: 'Back to School Plan', poNumber: 'PO-2026-0061',
      advertiserId: 'adv-global-brands', brandIds: ['br-pepsi'],
      status: 'in-option', goal: 'purchase', objective: 'sales-zonder-promo',
      kpis: ['roas', 'sales-lift'], budget: 12000, autoBudget: true,
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
    // Plans across the rest of the year. Without flights outside the summer
    // every date range returns the same rows, and the header's date filter
    // looks like it does nothing.
    {
      id: 'MP-009', name: 'New Year Reset', poNumber: 'PO-2026-0003',
      advertiserId: 'adv-nestle-trade', brandIds: ['br-nescafe'],
      status: 'completed', goal: 'awareness', objective: 'merkbekendheid',
      kpis: ['toma'], budget: 6000,
      startDate: '2026-01-05', endDate: '2026-02-15',
      createdBy: 'u-campaign-manager', createdAt: now, updatedAt: now,
    },
    {
      id: 'MP-010', name: 'Coffee Moments — Spring', poNumber: 'PO-2026-0019',
      advertiserId: 'adv-nestle-trade', brandIds: ['br-nescafe'],
      status: 'completed', goal: 'loyalty', objective: 'herhaalaankoop',
      kpis: ['roas', 'frequency'], budget: 8000,
      startDate: '2026-02-01', endDate: '2026-05-31',
      createdBy: 'u-account-manager', createdAt: now, updatedAt: now,
    },
    {
      id: 'MP-011', name: 'Early Summer Push', poNumber: 'PO-2026-0047',
      advertiserId: 'adv-unilever-shopper', brandIds: ['br-magnum'],
      status: 'running', goal: 'purchase', objective: 'sales-zonder-promo',
      kpis: ['roas'], budget: 6500, autoBudget: true,
      startDate: '2026-05-04', endDate: '2026-07-31',
      createdBy: 'u-campaign-builder', createdAt: now, updatedAt: now,
    },
    {
      id: 'MP-012', name: 'Autumn Season', poNumber: 'PO-2026-0082',
      advertiserId: 'adv-global-brands', brandIds: ['br-pepsi', 'br-redbull'],
      status: 'in-option', goal: 'consideration', objective: 'merkoverweging',
      kpis: ['ctr', 'vcr'], budget: 20000,
      startDate: '2026-08-24', endDate: '2026-11-30',
      createdBy: 'u-account-manager', createdAt: now, updatedAt: now,
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
    // A year's worth of history and forward bookings, so the header date range
    // has something to narrow: without flights outside the summer, every
    // window would return the same rows and the filter would look broken.
    { id: 'C-021', mediaPlanId: 'MP-009', name: 'Spring Refresh — Sponsored products', engine: 'sponsored-products', status: 'completed', budget: 3000, spend: 2980, startDate: '2026-01-12', endDate: '2026-02-15', createdAt: now, updatedAt: now },
    { id: 'C-022', mediaPlanId: 'MP-009', name: 'New Year Reset — Digital in-store',   engine: 'digital-instore',    status: 'completed', budget: 2500, spend: 2500, startDate: '2026-01-05', endDate: '2026-01-31', createdAt: now, updatedAt: now },
    { id: 'C-023', mediaPlanId: 'MP-010', name: 'Coffee Moments — Offsite',            engine: 'offsite',            status: 'completed', budget: 4200, spend: 4100, startDate: '2026-02-01', endDate: '2026-03-15', createdAt: now, updatedAt: now },
    { id: 'C-024', mediaPlanId: 'MP-010', name: 'Coffee Moments — Offline in-store',   engine: 'offline-instore',    status: 'running',   budget: 3600, spend: 1450, startDate: '2026-04-01', endDate: '2026-05-31', createdAt: now, updatedAt: now },
    { id: 'C-025', mediaPlanId: 'MP-011', name: 'Summer Launch — Digital in-store',    engine: 'digital-instore',    status: 'running',   budget: 2800, spend: 900,  startDate: '2026-05-04', endDate: '2026-06-30', createdAt: now, updatedAt: now },
    { id: 'C-026', mediaPlanId: 'MP-011', name: 'Ice Cream Summer — Sponsored products', engine: 'sponsored-products', status: 'paused',  budget: 3200, spend: 2100, startDate: '2026-05-18', endDate: '2026-07-31', createdAt: now, updatedAt: now },
    { id: 'C-027', mediaPlanId: 'MP-012', name: 'Back to School — Offsite',            engine: 'offsite',            status: 'in-option', budget: 5400, spend: 0,    startDate: '2026-09-01', endDate: '2026-09-30', createdAt: now, updatedAt: now },
    { id: 'C-028', mediaPlanId: 'MP-012', name: 'Back to School — Offline in-store',   engine: 'offline-instore',    status: 'in-option', budget: 4100, spend: 0,    startDate: '2026-08-24', endDate: '2026-09-20', createdAt: now, updatedAt: now },
    { id: 'C-029', mediaPlanId: 'MP-012', name: 'Black Friday — Digital in-store',     engine: 'digital-instore',    status: 'draft',     budget: 6000, spend: 0,    startDate: '2026-11-20', endDate: '2026-11-30', createdAt: now, updatedAt: now },
    { id: 'C-030', mediaPlanId: 'MP-012', name: 'Winter Warmers — Offsite',            engine: 'offsite',            status: 'draft',     budget: 3500, spend: 0,    startDate: '2026-10-05', endDate: '2026-11-15', createdAt: now, updatedAt: now },
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
    // Bookings for the campaigns above, spread across the year for the same
    // reason: a date range should visibly change what the table holds.
    { id: 'B-021', campaignId: 'C-021', name: 'Search — New Year',           status: 'completed', budget: 3000, spend: 2980, startDate: '2026-01-12', endDate: '2026-02-15', positionIds: ['pos-sp-search'],    creativeStatus: 'approved', createdAt: now, updatedAt: now },
    { id: 'B-022', campaignId: 'C-022', name: 'Entrance Screens — January',  status: 'completed', budget: 2500, spend: 2500, startDate: '2026-01-05', endDate: '2026-01-31', positionIds: ['pos-dis-entrance'], creativeStatus: 'approved', createdAt: now, updatedAt: now },
    { id: 'B-023', campaignId: 'C-023', name: 'Open Web — Coffee',           status: 'completed', budget: 2400, spend: 2350, startDate: '2026-02-01', endDate: '2026-03-15', positionIds: ['pos-off-web-standard'], creativeStatus: 'approved', createdAt: now, updatedAt: now },
    { id: 'B-024', campaignId: 'C-023', name: 'Social — Coffee moments',     status: 'completed', budget: 1800, spend: 1750, startDate: '2026-02-10', endDate: '2026-03-15', positionIds: ['pos-off-soc-meta'],  creativeStatus: 'approved', createdAt: now, updatedAt: now },
    { id: 'B-025', campaignId: 'C-024', name: 'Floor Graphics — Spring',     status: 'running',   budget: 3600, spend: 1450, startDate: '2026-04-01', endDate: '2026-05-31', positionIds: ['pos-ois-floor'],    creativeStatus: 'approved', createdAt: now, updatedAt: now },
    { id: 'B-026', campaignId: 'C-025', name: 'Aisle Screens — Summer',      status: 'running',   budget: 2800, spend: 900,  startDate: '2026-05-04', endDate: '2026-06-30', positionIds: ['pos-dis-aisle'],    creativeStatus: 'approved', createdAt: now, updatedAt: now },
    { id: 'B-027', campaignId: 'C-026', name: 'Search — Ice cream',          status: 'paused',    budget: 3200, spend: 2100, startDate: '2026-05-18', endDate: '2026-07-31', positionIds: ['pos-sp-search'],    creativeStatus: 'approved', createdAt: now, updatedAt: now },
    { id: 'B-028', campaignId: 'C-027', name: 'Open Web — Back to school',   status: 'in-option', budget: 5400, spend: 0,    startDate: '2026-09-01', endDate: '2026-09-30', positionIds: ['pos-off-web-standard'], creativeStatus: 'submitted', createdAt: now, updatedAt: now },
    { id: 'B-029', campaignId: 'C-028', name: 'Shelf Displays — September',  status: 'in-option', budget: 4100, spend: 0,    startDate: '2026-08-24', endDate: '2026-09-20', positionIds: ['pos-ois-shelf'],    creativeStatus: 'missing',   createdAt: now, updatedAt: now },
    { id: 'B-030', campaignId: 'C-030', name: 'Open Web — Winter',           status: 'draft',     budget: 3500, spend: 0,    startDate: '2026-10-05', endDate: '2026-11-15', positionIds: [],                   creativeStatus: 'missing',   createdAt: now, updatedAt: now },
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

  // ── FAQ ──────────────────────────────────────────────────────────────
  // Authored help per template (see faq.ts). Written the way a retailer would
  // write them: answering the question actually asked, in the retailer's own
  // terms, rather than restating the label on the field.
  faqs: [
    // Create media plan — the wizard advertisers meet first.
    {
      id: 'FAQ-001', surface: 'create-media-plan', section: 'setup', audience: 'all', published: true, order: 1,
      question: 'What is a media plan, and how is it different from a campaign?',
      answer:
        'A media plan is the container for everything you buy for one brief: the budget, the run time and the goal it is judged on.\n\n' +
        'Inside it sit campaigns — one per proposition, such as display or sponsored products — and inside those sit the bookings that actually run. ' +
        'You set the goal once on the plan, and every campaign underneath is reported against it.',
      updatedAt: now,
    },
    {
      id: 'FAQ-002', surface: 'create-media-plan', section: 'setup', audience: 'advertiser', published: true, order: 2,
      question: 'Do I need a PO number before I can start?',
      answer:
        'No. The PO number is optional while you build the plan and can be added later from the plan\'s Details tab.\n\n' +
        'It has to be filled in before the plan is invoiced, so adding it now saves a chase at the end of the month.',
      updatedAt: now,
    },
    {
      id: 'FAQ-003', surface: 'create-media-plan', section: 'advertiser', audience: 'all', published: true, order: 3,
      question: 'Why would I add retail products to a plan?',
      answer:
        'Selecting the SKUs the plan is advertising switches on sales attribution: we can then report on units sold, revenue and basket size for those products, not just clicks and impressions.\n\n' +
        'Leave it empty for pure brand campaigns — the plan still runs, you simply get media metrics rather than sales metrics.',
      updatedAt: now,
    },
    {
      id: 'FAQ-004', surface: 'create-media-plan', section: 'targeting', audience: 'all', published: true, order: 4,
      question: 'How do I choose between awareness, consideration, purchase and loyalty?',
      answer:
        'Pick the change you want in the shopper, not the format you have in mind.\n\n' +
        'Awareness reaches people who do not know the product yet. Consideration is for shoppers comparing options. Purchase is for converting shoppers already close to the basket. Loyalty is for bringing existing buyers back.\n\n' +
        'The goal sets which objective and KPIs the plan is judged on, so it also decides which numbers you will be shown at the end.',
      updatedAt: now,
    },
    {
      id: 'FAQ-005', surface: 'create-media-plan', section: 'targeting', audience: 'all', published: true, order: 5,
      question: 'Can I change the goal after the plan is live?',
      answer:
        'No. The goal fixes the objective and the KPIs the plan reports on, and changing it mid-flight would make the reporting meaningless — half the results would be measured against a different yardstick.\n\n' +
        'If the brief genuinely changed, create a new plan for the new goal and let the current one finish.',
      updatedAt: now,
    },
    {
      id: 'FAQ-006', surface: 'create-media-plan', section: 'budget', audience: 'all', published: true, order: 6,
      question: 'What does the daily cap do?',
      answer:
        'It limits how much of the budget can be spent in a single day, so a plan cannot burn through its budget in the first week.\n\n' +
        'Leave it empty and the budget is spent as fast as the inventory allows. Set it to roughly the total budget divided by the number of days for even delivery.',
      updatedAt: now,
    },
    {
      id: 'FAQ-007', surface: 'create-media-plan', section: 'review', audience: 'advertiser', published: true, order: 7,
      question: 'What happens when I create the plan — is it booked?',
      answer:
        'Not yet. Creating the plan saves it as a draft: nothing is reserved and nothing is charged.\n\n' +
        'Inventory is held when you launch the plan, and only for bookings that have a placement and an approved creative. Anything incomplete stays in draft until you finish it.',
      updatedAt: now,
    },

    // Media plan detail.
    {
      id: 'FAQ-008', surface: 'media-plan-detail', audience: 'all', published: true, order: 1,
      question: 'What makes a plan "at risk"?',
      answer:
        'A plan is at risk when something is blocking it from delivering: a booking without a placement, a creative that was never uploaded, or a flight that has started with nothing live behind it.\n\n' +
        'Every blocking issue appears in the Notifications tab with the action that clears it. "Needs attention" means the plan will still deliver, but something is worth a look.',
      updatedAt: now,
    },
    {
      id: 'FAQ-009', surface: 'media-plan-detail', section: 'campaigns', audience: 'all', published: true, order: 2,
      question: 'Why can I not launch my media plan?',
      answer:
        'Launching requires every campaign in the plan to be complete: a budget, a run time, at least one booking, a placement on each booking and — for everything except sponsored products — an approved creative.\n\n' +
        'The Notifications tab lists exactly what is still missing. Once that list is empty the Launch media plan button becomes available.',
      updatedAt: now,
    },
    {
      id: 'FAQ-010', surface: 'media-plan-detail', section: 'insights', audience: 'all', published: true, order: 3,
      question: 'Why do the numbers differ from my own reporting?',
      answer:
        'Two reasons, usually. Attribution window: we count a sale against the campaign when it happens within the conversion window set on the plan, which may be shorter or longer than your own.\n\n' +
        'And timing: in-store data lands a day later than online, so the last 24 hours are always incomplete.',
      updatedAt: now,
    },

    // Campaign detail.
    {
      id: 'FAQ-011', surface: 'campaign-detail', audience: 'all', published: true, order: 1,
      question: 'What is the difference between a campaign and a booking?',
      answer:
        'A campaign is everything you run on one proposition — all your display, for example — with its own budget and targeting.\n\n' +
        'A booking is one concrete piece of that: a position, for a run time, at a price. A campaign usually holds several.',
      updatedAt: now,
    },
    {
      id: 'FAQ-012', surface: 'campaign-detail', section: 'creatives', audience: 'advertiser', published: true, order: 2,
      question: 'How long does creative approval take?',
      answer:
        'Most creatives are reviewed within one working day. Approval checks brand safety, the format specification and — where products are named — that the claims match the pack.\n\n' +
        'Upload at least three working days before the flight starts so there is room for one round of changes.',
      updatedAt: now,
    },
    {
      id: 'FAQ-013', surface: 'campaign-detail', section: 'creatives', engine: 'sponsored-products', audience: 'all', published: true, order: 3,
      question: 'Why does sponsored products not ask for a creative?',
      answer:
        'Sponsored products uses the product content already in the shop — the pack shot, title and price from the catalogue — so there is nothing to upload.\n\n' +
        'If the ad looks wrong, the fix is in the product data rather than in the campaign.',
      updatedAt: now,
    },

    // Booking detail.
    {
      id: 'FAQ-014', surface: 'booking-detail', section: 'placements', audience: 'all', published: true, order: 1,
      question: 'A position shows as unavailable — what are my options?',
      answer:
        'Positions sell out per week, so availability depends on your run time rather than on the position itself.\n\n' +
        'Shift the flight by a week, pick an adjacent position in the same proposition, or lower the volume you are asking for. The availability calendar shows which weeks still have room.',
      updatedAt: now,
    },
    {
      id: 'FAQ-015', surface: 'booking-detail', audience: 'retailer', published: true, order: 2,
      question: 'Can I overbook a position for a key account?',
      answer:
        'Yield managers can release extra capacity on a position from the proposition configuration; nobody else can book past the cap.\n\n' +
        'Overbooking affects delivery for everyone already on that position, so agree it with yield before you promise it to the advertiser.',
      updatedAt: now,
    },

    // Overviews and reporting.
    {
      id: 'FAQ-016', surface: 'campaign-overview', audience: 'all', published: true, order: 1,
      question: 'What do the campaign states mean?',
      answer:
        'Draft is still being built and holds no inventory. In option holds inventory for a limited time but is not live. Running is delivering now. Paused keeps its bookings but stops delivery. Completed has finished its flight.',
      updatedAt: now,
    },
    {
      id: 'FAQ-017', surface: 'insights', audience: 'all', published: true, order: 1,
      question: 'Which KPIs are shown, and who decides?',
      answer:
        'The KPIs follow the goal set on the media plan: awareness reports reach and impressions, purchase reports sales, ROAS and conversions.\n\n' +
        'The proposition adds its own — in-store shows visits and dwell time, offsite adds platform-level reach. You cannot swap a KPI on a live plan, but you can add a brand-lift study when the plan is created.',
      updatedAt: now,
    },
    {
      id: 'FAQ-018', surface: 'creatives', audience: 'advertiser', published: true, order: 1,
      question: 'My creative was rejected. What now?',
      answer:
        'The rejection names the rule that was not met — a format specification, a brand-safety rule, or a claim that cannot be substantiated.\n\n' +
        'Upload a corrected version against the same booking; it goes back into review straight away and keeps its place in the flight as long as the run time has not started.',
      updatedAt: now,
    },
    {
      id: 'FAQ-019', surface: 'home', audience: 'advertiser', published: true, order: 1,
      question: 'Where do I start?',
      answer:
        'Create a media plan for the brief you are working on, then add a campaign per proposition you want to use.\n\n' +
        'Notifications on this page tell you what each plan still needs, so you can work from the list rather than checking every plan.',
      updatedAt: now,
    },
    // A draft, to show the configuration area's published/draft split.
    {
      id: 'FAQ-020', surface: 'home', audience: 'all', published: false, order: 2,
      question: 'Who do I contact about an invoice?',
      answer: 'Billing questions go to your account manager. Awaiting the new finance mailbox before this goes live.',
      updatedAt: now,
    },
  ],
};
