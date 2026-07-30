import type { DbData } from './types';

/**
 * Seed data for the prototype database. Users map 1:1 to the EpicContext
 * personas (ahold-delhaize/edge → users/personas). Media plans / campaigns /
 * bookings consolidate the mock data that previously lived scattered through
 * the page-template stories. Metric definitions per engine come from the
 * agreed proposition metric sets (previously src/lib/proposition-metrics.ts).
 *
 * Bump `version` whenever the seed shape changes — stale localStorage copies
 * are then replaced with this seed on next load.
 */
export const SEED_VERSION = 1;

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
    { id: 'u-agency-advertiser',   name: 'Alex Romero',      role: 'Media Agency Advertiser',                  personaKey: 'media-agency-advertiser',       side: 'advertiser', theme: 'albert-heijn', advertiserId: 'adv-acme' },
  ],

  // ── Advertisers & brands ─────────────────────────────────────────────
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
      id: 'adv-brandx',
      name: 'BrandX',
      brands: [
        { id: 'br-knorr', name: 'Knorr', hasRetailProducts: true },
        { id: 'br-dove', name: 'Dove' },
      ],
    },
    {
      id: 'adv-mediaworks',
      name: 'MediaWorks',
      brands: [{ id: 'br-pepsi', name: 'Pepsi', hasRetailProducts: true }],
    },
    {
      id: 'adv-adpartners',
      name: 'AdPartners',
      brands: [{ id: 'br-redbull', name: 'Red Bull', hasRetailProducts: true }],
    },
  ],

  // ── Media plans ──────────────────────────────────────────────────────
  mediaPlans: [
    {
      id: 'MP-001', name: 'Holiday Sale Plan', poNumber: 'PO-2026-0042',
      advertiserId: 'adv-acme', brandIds: ['br-coca-cola', 'br-heineken'],
      status: 'running', goal: 'awareness', objective: 'merkbekendheid',
      kpis: ['toma', 'cep'], budget: 15000,
      startDate: '2026-06-01', endDate: '2026-06-30',
      createdBy: 'u-campaign-builder', createdAt: now, updatedAt: now,
    },
    {
      id: 'MP-002', name: 'Summer Launch Plan', poNumber: 'PO-2026-0055',
      advertiserId: 'adv-brandx', brandIds: ['br-knorr'],
      status: 'in-option', goal: 'consideration', objective: 'merkoverweging',
      kpis: ['ctr', 'vcr'], budget: 8000,
      startDate: '2026-07-01', endDate: '2026-07-31',
      createdBy: 'u-campaign-manager', createdAt: now, updatedAt: now,
    },
    {
      id: 'MP-003', name: 'Back to School Plan', poNumber: 'PO-2026-0061',
      advertiserId: 'adv-mediaworks', brandIds: ['br-pepsi'],
      status: 'in-option', goal: 'purchase', objective: 'sales-zonder-promo',
      kpis: ['roas', 'sales-lift'], budget: 12000,
      startDate: '2026-08-10', endDate: '2026-09-10',
      createdBy: 'u-campaign-builder', createdAt: now, updatedAt: now,
    },
    {
      id: 'MP-004', name: 'Black Friday Plan', poNumber: 'PO-2026-0078',
      advertiserId: 'adv-adpartners', brandIds: ['br-redbull'],
      status: 'draft', goal: 'purchase', objective: 'bonus-promo',
      kpis: ['roas', 'sales-lift'], budget: 40000,
      startDate: '2026-11-01', endDate: '2026-11-30',
      createdBy: 'u-account-manager', createdAt: now, updatedAt: now,
    },
  ],

  // ── Campaigns ────────────────────────────────────────────────────────
  campaigns: [
    // Holiday Sale Plan
    { id: 'C-001', mediaPlanId: 'MP-001', name: 'Holiday Sale — Display',            engine: 'display',            status: 'running',   budget: 5000,  spend: 3800, startDate: '2026-06-01', endDate: '2026-06-30', createdAt: now, updatedAt: now },
    { id: 'C-002', mediaPlanId: 'MP-001', name: 'Holiday Sale — Sponsored products', engine: 'sponsored-products', status: 'running',   budget: 4000,  spend: 3600, startDate: '2026-06-01', endDate: '2026-06-30', createdAt: now, updatedAt: now },
    { id: 'C-003', mediaPlanId: 'MP-001', name: 'Holiday Sale — Digital in-store',   engine: 'digital-instore',    status: 'in-option', budget: 3000,  spend: 1200, startDate: '2026-06-08', endDate: '2026-06-30', createdAt: now, updatedAt: now },
    { id: 'C-004', mediaPlanId: 'MP-001', name: 'Holiday Sale — Offsite',            engine: 'offsite',            status: 'in-option', budget: 3000,  spend: 600,  startDate: '2026-06-08', endDate: '2026-06-30', createdAt: now, updatedAt: now },
    // Summer Launch Plan
    { id: 'C-005', mediaPlanId: 'MP-002', name: 'Summer Launch — Display',           engine: 'display',            status: 'in-option', budget: 5000,  spend: 1500, startDate: '2026-07-01', endDate: '2026-07-31', createdAt: now, updatedAt: now },
    { id: 'C-006', mediaPlanId: 'MP-002', name: 'Summer Launch — Offsite',           engine: 'offsite',            status: 'in-option', budget: 3000,  spend: 500,  startDate: '2026-07-01', endDate: '2026-07-31', createdAt: now, updatedAt: now },
    // Back to School Plan
    { id: 'C-007', mediaPlanId: 'MP-003', name: 'Back to School — Sponsored products', engine: 'sponsored-products', status: 'in-option', budget: 7000, spend: 2800, startDate: '2026-08-10', endDate: '2026-09-10', createdAt: now, updatedAt: now },
    { id: 'C-008', mediaPlanId: 'MP-003', name: 'Back to School — Offline in-store',   engine: 'offline-instore',    status: 'draft',     budget: 5000, spend: 0,    startDate: '2026-08-17', endDate: '2026-09-10', createdAt: now, updatedAt: now },
    // Black Friday Plan
    { id: 'C-009', mediaPlanId: 'MP-004', name: 'Black Friday — Display',            engine: 'display',            status: 'draft', budget: 15000, spend: 0, startDate: '2026-11-01', endDate: '2026-11-30', createdAt: now, updatedAt: now },
    { id: 'C-010', mediaPlanId: 'MP-004', name: 'Black Friday — Digital in-store',   engine: 'digital-instore',    status: 'draft', budget: 10000, spend: 0, startDate: '2026-11-15', endDate: '2026-11-30', createdAt: now, updatedAt: now },
    { id: 'C-011', mediaPlanId: 'MP-004', name: 'Black Friday — Offsite',            engine: 'offsite',            status: 'draft', budget: 15000, spend: 0, startDate: '2026-11-01', endDate: '2026-11-30', createdAt: now, updatedAt: now },
  ],

  // ── Bookings ─────────────────────────────────────────────────────────
  bookings: [
    { id: 'B-001', campaignId: 'C-001', name: 'Homepage Takeover',        status: 'running',   budget: 2500, spend: 2100, startDate: '2026-06-01', endDate: '2026-06-15', positionIds: ['pos-dsp-home-top'], createdAt: now, updatedAt: now },
    { id: 'B-002', campaignId: 'C-001', name: 'Category Banner — Drinks', status: 'running',   budget: 2500, spend: 1700, startDate: '2026-06-01', endDate: '2026-06-30', positionIds: ['pos-dsp-cat-top'],  createdAt: now, updatedAt: now },
    { id: 'B-003', campaignId: 'C-002', name: 'Keywords — cola zero',     status: 'running',   budget: 2000, spend: 1900, startDate: '2026-06-01', endDate: '2026-06-30', positionIds: ['pos-sp-search'],    createdAt: now, updatedAt: now },
    { id: 'B-004', campaignId: 'C-002', name: 'Keywords — beer & bbq',    status: 'running',   budget: 2000, spend: 1700, startDate: '2026-06-01', endDate: '2026-06-30', positionIds: ['pos-sp-search'],    createdAt: now, updatedAt: now },
    { id: 'B-005', campaignId: 'C-003', name: 'Entrance Screens',         status: 'in-option', budget: 3000, spend: 1200, startDate: '2026-06-08', endDate: '2026-06-30', positionIds: ['pos-dis-entrance'], createdAt: now, updatedAt: now },
    { id: 'B-006', campaignId: 'C-004', name: 'Open Web Display',         status: 'in-option', budget: 3000, spend: 600,  startDate: '2026-06-08', endDate: '2026-06-30', positionIds: ['pos-off-openweb'],  createdAt: now, updatedAt: now },
    { id: 'B-007', campaignId: 'C-005', name: 'Homepage Takeover',        status: 'in-option', budget: 3000, spend: 1000, startDate: '2026-07-01', endDate: '2026-07-15', positionIds: ['pos-dsp-home-top'], createdAt: now, updatedAt: now },
    { id: 'B-008', campaignId: 'C-005', name: 'PDP Banner',               status: 'in-option', budget: 2000, spend: 500,  startDate: '2026-07-01', endDate: '2026-07-31', positionIds: ['pos-dsp-pdp'],      createdAt: now, updatedAt: now },
    { id: 'B-009', campaignId: 'C-006', name: 'Social Retargeting',       status: 'in-option', budget: 3000, spend: 500,  startDate: '2026-07-01', endDate: '2026-07-31', positionIds: ['pos-off-social'],   createdAt: now, updatedAt: now },
    { id: 'B-010', campaignId: 'C-007', name: 'Keywords — school lunch',  status: 'in-option', budget: 7000, spend: 2800, startDate: '2026-08-10', endDate: '2026-09-10', positionIds: ['pos-sp-search'],    createdAt: now, updatedAt: now },
    { id: 'B-011', campaignId: 'C-008', name: 'Shelf Displays — Snacks',  status: 'draft',     budget: 5000, spend: 0,    startDate: '2026-08-17', endDate: '2026-09-10', positionIds: ['pos-ois-shelf'],    createdAt: now, updatedAt: now },
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

  // ── Media products & positions ───────────────────────────────────────
  mediaProducts: [
    { id: 'mprod-dsp-home', engine: 'display', name: 'Homepage',        description: 'Banners on the storefront homepage.' },
    { id: 'mprod-dsp-cat',  engine: 'display', name: 'Category pages',  description: 'Banners on category listing pages.' },
    { id: 'mprod-dsp-pdp',  engine: 'display', name: 'Product pages',   description: 'Banners on product detail pages.' },
    { id: 'mprod-sp-search', engine: 'sponsored-products', name: 'Search results', description: 'Sponsored product slots in search.' },
    { id: 'mprod-dis-instore', engine: 'digital-instore', name: 'In-store screens', description: 'Digital screens in physical stores.' },
    { id: 'mprod-ois-print',   engine: 'offline-instore', name: 'Printed materials', description: 'Shelf displays, floor stickers, posters.' },
    { id: 'mprod-off-web',    engine: 'offsite', name: 'Open web',      description: 'Programmatic display on the open web.' },
    { id: 'mprod-off-social', engine: 'offsite', name: 'Social',        description: 'Paid social placements.' },
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
    { id: 'pos-off-openweb',  mediaProductId: 'mprod-off-web',   name: 'Open web display',         dailyCapacity: 100 },
    { id: 'pos-off-social',   mediaProductId: 'mprod-off-social', name: 'Social retargeting',      dailyCapacity: 100 },
  ],

  // Seeded per-week booked load for the busy summer weeks; the calendar and
  // availability views derive free capacity as dailyCapacity×7 − booked.
  availability: [
    { positionId: 'pos-dsp-home-top', week: '2026-W23', booked: 24 },
    { positionId: 'pos-dsp-home-top', week: '2026-W24', booked: 28 },
    { positionId: 'pos-dsp-home-top', week: '2026-W25', booked: 20 },
    { positionId: 'pos-dsp-cat-top',  week: '2026-W23', booked: 30 },
    { positionId: 'pos-dsp-cat-top',  week: '2026-W24', booked: 42 },
    { positionId: 'pos-sp-search',    week: '2026-W23', booked: 180 },
    { positionId: 'pos-sp-search',    week: '2026-W24', booked: 210 },
    { positionId: 'pos-dis-entrance', week: '2026-W24', booked: 30 },
    { positionId: 'pos-ois-shelf',    week: '2026-W34', booked: 60 },
    { positionId: 'pos-off-openweb',  week: '2026-W24', booked: 350 },
  ],
};
