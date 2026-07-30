/**
 * Prototype database verification — run with: npx tsx scripts/verify-db.ts
 *
 * Checks that the seed's example media plans → campaigns → bookings stand
 * correctly (referential integrity, dates, budgets, registry coverage) and
 * that the CRUD layer works (create/update/cascade-delete smoke test).
 */
import { seedData } from '../src/lib/db/seed';
import {
  getDb,
  createMediaPlan,
  createCampaign,
  createBooking,
  updateCampaign,
  deleteMediaPlan,
} from '../src/lib/db/store';

let failures = 0;
const fail = (msg: string) => {
  failures++;
  console.log(`  ✗ ${msg}`);
};
const ok = (msg: string) => console.log(`  ✓ ${msg}`);

const d = seedData;

// ── 1. Referential integrity ───────────────────────────────────────────
console.log('\n1. Referential integrity');

const advertiserIds = new Set(d.advertisers.map((a) => a.id));
const brandIds = new Set(d.advertisers.flatMap((a) => a.brands.map((b) => b.id)));
const planIds = new Set(d.mediaPlans.map((p) => p.id));
const campaignIds = new Set(d.campaigns.map((c) => c.id));
const engineIds = new Set(d.engines.map((e) => e.id));
const userIds = new Set(d.users.map((u) => u.id));
const mediaProductIds = new Set(d.mediaProducts.map((m) => m.id));
const positionIds = new Set(d.positions.map((p) => p.id));

for (const p of d.mediaPlans) {
  if (!advertiserIds.has(p.advertiserId)) fail(`${p.id}: unknown advertiser ${p.advertiserId}`);
  for (const b of p.brandIds) if (!brandIds.has(b)) fail(`${p.id}: unknown brand ${b}`);
  if (p.createdBy && !userIds.has(p.createdBy)) fail(`${p.id}: unknown creator ${p.createdBy}`);
}
ok(`media plans → advertisers/brands/users (${d.mediaPlans.length} plans)`);

for (const c of d.campaigns) {
  if (!planIds.has(c.mediaPlanId)) fail(`${c.id}: unknown media plan ${c.mediaPlanId}`);
  if (!engineIds.has(c.engine)) fail(`${c.id}: unknown engine ${c.engine}`);
}
ok(`campaigns → media plans/engines (${d.campaigns.length} campaigns)`);

for (const b of d.bookings) {
  if (!campaignIds.has(b.campaignId)) fail(`${b.id}: unknown campaign ${b.campaignId}`);
  for (const pos of b.positionIds) if (!positionIds.has(pos)) fail(`${b.id}: unknown position ${pos}`);
}
ok(`bookings → campaigns/positions (${d.bookings.length} bookings)`);

for (const u of d.users) {
  if (u.advertiserId && !advertiserIds.has(u.advertiserId)) fail(`${u.id}: unknown advertiser ${u.advertiserId}`);
  if (u.side === 'advertiser' && !u.advertiserId) fail(`${u.id}: advertiser-side user without advertiserId`);
}
ok(`users → advertisers (${d.users.length} users)`);

for (const m of d.mediaProducts) if (!engineIds.has(m.engine)) fail(`${m.id}: unknown engine ${m.engine}`);
for (const p of d.positions) if (!mediaProductIds.has(p.mediaProductId)) fail(`${p.id}: unknown media product ${p.mediaProductId}`);
for (const a of d.availability) if (!positionIds.has(a.positionId)) fail(`availability: unknown position ${a.positionId}`);
ok(`media products → engines; positions → products; availability → positions`);

for (const m of d.metricDefinitions) {
  if (m.engine !== 'all' && !engineIds.has(m.engine)) fail(`metric ${m.key}: unknown engine ${m.engine}`);
}
ok(`metric definitions → engines (${d.metricDefinitions.length} definitions)`);

// ── 2. Hierarchy consistency ───────────────────────────────────────────
console.log('\n2. Hierarchy consistency');

for (const p of d.mediaPlans) {
  const campaigns = d.campaigns.filter((c) => c.mediaPlanId === p.id);
  if (campaigns.length === 0) fail(`${p.id} (${p.name}): no campaigns`);

  // Campaign budgets must not exceed the plan budget.
  const totalBudget = campaigns.reduce((s, c) => s + c.budget, 0);
  if (totalBudget > p.budget) fail(`${p.id}: campaign budgets €${totalBudget} exceed plan budget €${p.budget}`);

  // Campaign flights must fall inside the plan run time.
  for (const c of campaigns) {
    if (c.startDate < p.startDate || c.endDate > p.endDate)
      fail(`${c.id}: flight ${c.startDate}→${c.endDate} outside plan ${p.startDate}→${p.endDate}`);
    if (c.spend > c.budget) fail(`${c.id}: spend €${c.spend} exceeds budget €${c.budget}`);
  }
}
ok('every plan has campaigns; campaign budgets/flights within plan');

for (const c of d.campaigns) {
  const bookings = d.bookings.filter((b) => b.campaignId === c.id);
  const totalBudget = bookings.reduce((s, b) => s + b.budget, 0);
  if (totalBudget > c.budget) fail(`${c.id}: booking budgets €${totalBudget} exceed campaign budget €${c.budget}`);
  for (const b of bookings) {
    if (b.startDate < c.startDate || b.endDate > c.endDate)
      fail(`${b.id}: flight ${b.startDate}→${b.endDate} outside campaign ${c.startDate}→${c.endDate}`);
    if (b.spend > b.budget) fail(`${b.id}: spend €${b.spend} exceeds budget €${b.budget}`);
    // Booking positions must belong to the campaign's engine.
    for (const posId of b.positionIds) {
      const pos = d.positions.find((p) => p.id === posId)!;
      const product = d.mediaProducts.find((m) => m.id === pos.mediaProductId)!;
      if (product.engine !== c.engine)
        fail(`${b.id}: position ${posId} belongs to engine ${product.engine}, campaign is ${c.engine}`);
    }
  }
}
ok('booking budgets/flights within campaign; positions match campaign engine');

// ── 3. Registry coverage ───────────────────────────────────────────────
console.log('\n3. Coverage');

for (const e of d.engines) {
  const metrics = d.metricDefinitions.filter((m) => m.engine === e.id);
  if (metrics.length === 0) fail(`engine ${e.id}: no metric definitions`);
  const products = d.mediaProducts.filter((m) => m.engine === e.id);
  if (products.length === 0) fail(`engine ${e.id}: no media products`);
}
ok('every engine has metric definitions and media products');

const usedEngines = new Set(d.campaigns.map((c) => c.engine));
for (const e of d.engines) {
  if (!usedEngines.has(e.id)) console.log(`  ⚠ engine ${e.id}: no seeded campaign uses it`);
}

for (const a of d.availability) {
  const pos = d.positions.find((p) => p.id === a.positionId)!;
  if (a.booked > pos.dailyCapacity * 7) fail(`availability ${a.positionId} ${a.week}: booked ${a.booked} exceeds weekly capacity ${pos.dailyCapacity * 7}`);
}
ok('availability bookings within weekly capacity');

// ── 4. CRUD smoke test (in-memory store) ───────────────────────────────
console.log('\n4. CRUD smoke test');

const before = getDb().mediaPlans.length;
const plan = createMediaPlan({
  name: 'Verify Test Plan', advertiserId: 'adv-acme', brandIds: ['br-coca-cola'],
  status: 'draft', kpis: [], budget: 1000, startDate: '2026-09-01', endDate: '2026-09-30',
});
const campaign = createCampaign({
  mediaPlanId: plan.id, name: 'Verify Campaign', engine: 'display', status: 'draft',
  budget: 500, spend: 0, startDate: '2026-09-01', endDate: '2026-09-30',
});
const booking = createBooking({
  campaignId: campaign.id, name: 'Verify Booking', status: 'draft',
  budget: 250, spend: 0, startDate: '2026-09-01', endDate: '2026-09-15', positionIds: ['pos-dsp-home-top'],
});
if (!getDb().mediaPlans.find((p) => p.id === plan.id)) fail('createMediaPlan did not persist');
if (!getDb().campaigns.find((c) => c.id === campaign.id)) fail('createCampaign did not persist');
if (!getDb().bookings.find((b) => b.id === booking.id)) fail('createBooking did not persist');
ok(`created ${plan.id} → ${campaign.id} → ${booking.id} (ids continue seed sequence)`);

updateCampaign(campaign.id, { status: 'in-option', budget: 600 });
const updated = getDb().campaigns.find((c) => c.id === campaign.id)!;
if (updated.status !== 'in-option' || updated.budget !== 600) fail('updateCampaign did not apply');
else ok('update applied (status + budget)');

deleteMediaPlan(plan.id);
if (getDb().mediaPlans.length !== before) fail('deleteMediaPlan did not remove the plan');
if (getDb().campaigns.find((c) => c.id === campaign.id)) fail('cascade delete missed the campaign');
if (getDb().bookings.find((b) => b.id === booking.id)) fail('cascade delete missed the booking');
ok('cascade delete removed plan → campaign → booking');

// ── Result ─────────────────────────────────────────────────────────────
console.log(
  failures === 0
    ? `\nAll checks passed — ${d.mediaPlans.length} plans, ${d.campaigns.length} campaigns, ${d.bookings.length} bookings, ${d.metricDefinitions.length} metric definitions, ${d.positions.length} positions.`
    : `\n${failures} check(s) FAILED.`,
);
process.exit(failures === 0 ? 0 : 1);
