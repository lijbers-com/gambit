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
import { deriveTasks, derivePlanHealth } from '../src/lib/db/tasks';
import { deriveMessages } from '../src/lib/db/messages';
import { FAQ_SURFACES, faqsFor, canManageFaq, FAQ_EDITOR_PERSONAS } from '../src/lib/db/faq';

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

// ── 4. Derived to-do engine ────────────────────────────────────────────
console.log('\n4. Derived to-do engine');

const derived = deriveTasks(d);
if (derived.length === 0) fail('no derived tasks — seed should contain deliberate to-do triggers');
// Every task must reference a real entity.
for (const t of derived) {
  const pool = t.level === 'media-plan' ? d.mediaPlans : t.level === 'campaign' ? d.campaigns : d.bookings;
  if (!pool.some((e) => e.id === t.entityId)) fail(`task ${t.id}: unknown ${t.level} ${t.entityId}`);
  if (!planIds.has(t.mediaPlanId)) fail(`task ${t.id}: unknown plan ${t.mediaPlanId}`);
}
ok(`${derived.length} to-dos derived, all referencing real entities`);

// Expected triggers from the seed must fire.
const has = (id: string) => derived.some((t) => t.id === id);
if (!has('B-010-creative')) fail('missing expected task: B-010 creative missing');
if (!has('B-009-approve')) fail('missing expected task: B-009 creative approval');
if (!has('B-012-placement')) fail('missing expected task: B-012 placement missing');
if (!has('MP-008-budget')) fail('missing expected task: MP-008 budget unset');
if (!has('C-017-bookings')) fail('missing expected task: C-017 no bookings');
ok('expected seed triggers all fire (creative, approval, placement, budget, bookings)');

// Health must derive consistently from tasks.
const holidayHealth = derivePlanHealth(d, d.mediaPlans.find((p) => p.id === 'MP-002')!);
if (holidayHealth.level !== 'risk') fail(`MP-002 (running, missing creative) should be at risk, got ${holidayHealth.level}`);
const springHealth = derivePlanHealth(d, d.mediaPlans.find((p) => p.id === 'MP-001')!);
if (springHealth.level !== 'good') fail(`MP-001 (completed, all approved) should be good, got ${springHealth.level}`);
ok(`health derives from tasks (MP-002 → ${holidayHealth.level}, MP-001 → ${springHealth.level})`);

// ── 5. Inbox messages ──────────────────────────────────────────────────
console.log('\n5. Inbox messages');

const messages = deriveMessages(d);

// Ids key the read/done state, so a duplicate would make two messages share it.
const messageIds = new Set(messages.map((m) => m.id));
if (messageIds.size !== messages.length) fail('message ids are not unique');

// Every message must link somewhere real — a dead link is worse than no message.
const msgPlanIds = new Set(d.mediaPlans.map((p) => p.id));
const msgCampaignIds = new Set(d.campaigns.map((c) => c.id));
const msgBookingIds = new Set(d.bookings.map((b) => b.id));
for (const m of messages) {
  const known =
    (m.level === 'media-plan' && msgPlanIds.has(m.entityId)) ||
    (m.level === 'campaign' && msgCampaignIds.has(m.entityId)) ||
    (m.level === 'booking' && msgBookingIds.has(m.entityId));
  if (!known) fail(`message ${m.id} points at unknown ${m.level} ${m.entityId}`);
  if (!m.href.startsWith('/campaigns/')) fail(`message ${m.id} has no usable href (${m.href})`);
  if (!m.subject || !m.preview) fail(`message ${m.id} is missing subject or preview`);
}
ok(`${messages.length} messages derived, ids unique, all linking to real entities`);

// A healthy plan must produce no health message — an inbox full of "all fine"
// is an inbox nobody reads.
const springMessages = deriveMessages(d, { mediaPlanId: 'MP-001' });
if (springMessages.some((m) => m.kind === 'health')) fail('MP-001 is healthy but produced a health message');
const holidayMessages = deriveMessages(d, { mediaPlanId: 'MP-002' });
if (!holidayMessages.some((m) => m.kind === 'health')) fail('MP-002 is at risk but produced no health message');
ok('health messages only appear for plans that are not healthy');

// Scoping must narrow, never invent.
const displayMessages = deriveMessages(d, { engine: 'display' });
if (displayMessages.some((m) => m.engine !== 'display')) fail('engine scope leaked other engines');
if (!displayMessages.every((m) => messageIds.has(m.id))) fail('engine scope produced messages not in the full set');
const perPlan = d.mediaPlans.flatMap((p) => deriveMessages(d, { mediaPlanId: p.id }));
if (perPlan.length !== messages.length) fail(`plan scopes cover ${perPlan.length} of ${messages.length} messages`);
ok('scoping narrows without inventing (engine, plan scopes partition the set)');

// ── 6. CRUD smoke test (in-memory store) ───────────────────────────────
console.log('\n6. CRUD smoke test');

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
  creativeStatus: 'missing',
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

// ── 7. FAQ ─────────────────────────────────────────────────────────────
console.log('\n7. FAQ');

const faqIds = new Set(d.faqs.map((f) => f.id));
if (faqIds.size !== d.faqs.length) fail('faq ids are not unique');

const surfaceIds = new Set(FAQ_SURFACES.map((s) => s.id));
for (const f of d.faqs) {
  if (!surfaceIds.has(f.surface)) fail(`faq ${f.id} targets unknown surface ${f.surface}`);
  const sections = FAQ_SURFACES.find((s) => s.id === f.surface)!.sections.map((s) => s.id);
  if (f.section && !sections.includes(f.section)) fail(`faq ${f.id} targets unknown section ${f.surface}/${f.section}`);
  if (!f.question.trim() || !f.answer.trim()) fail(`faq ${f.id} is missing a question or answer`);
  if (f.question.length > 120) fail(`faq ${f.id} question is too long to read as a question`);
}
ok(`${d.faqs.length} entries, ids unique, every surface and section known`);

// Drafts must never reach a template.
const publishedOnly = FAQ_SURFACES.flatMap((s) => faqsFor(d, { surface: s.id }));
if (publishedOnly.some((f) => !f.published)) fail('faqsFor returned a draft without includeDrafts');
ok(`${publishedOnly.length} published entries visible in-product, ${d.faqs.length - publishedOnly.length} draft(s) held back`);

// A step query must also return the entries written for the whole surface.
const goalStep = faqsFor(d, { surface: 'create-media-plan', section: 'targeting' });
if (!goalStep.length) fail('no FAQ entries on the wizard goal step');
ok(`section query widens to surface-wide entries (goal step → ${goalStep.length})`);

// Audience filtering: a retailer must not be shown advertiser-only copy.
const retailerSide = faqsFor(d, { surface: 'create-media-plan', side: 'retailer' });
if (retailerSide.some((f) => f.audience === 'advertiser')) fail('advertiser-only entry leaked to a retailer');
ok(`audience filter holds (retailer sees ${retailerSide.length} of ${faqsFor(d, { surface: 'create-media-plan' }).length})`);

// Only the editor personas may manage entries.
const editors = d.users.filter((u) => canManageFaq(u));
if (editors.length !== FAQ_EDITOR_PERSONAS.length) fail(`expected ${FAQ_EDITOR_PERSONAS.length} FAQ editors, got ${editors.length}`);
if (d.users.some((u) => u.side === 'advertiser' && canManageFaq(u))) fail('an advertiser-side user can manage FAQs');
ok(`${editors.length} editors: ${editors.map((u) => u.name).join(', ')}`);

// ── Result ─────────────────────────────────────────────────────────────
console.log(
  failures === 0
    ? `\nAll checks passed — ${d.mediaPlans.length} plans, ${d.campaigns.length} campaigns, ${d.bookings.length} bookings, ${d.metricDefinitions.length} metric definitions, ${d.positions.length} positions, ${d.faqs.length} FAQ entries.`
    : `\n${failures} check(s) FAILED.`,
);
process.exit(failures === 0 ? 0 : 1);
