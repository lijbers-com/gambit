import type { Booking, BookingGoal, Campaign, Creative, CreativeApprovalStatus, DbData, FaqEntry, Invoice, InventoryHold, MediaPlan, MediaProduct, Placement, Position, PricingRule, TermEntry, ReleaseNote, Workflow } from './types';
import { bookingPrice, checkBookingAvailability, isGuaranteed, productForBooking } from './guaranteed';
import { billableLines } from './billing';
import { billingService, type InvoiceRecord } from '@/lib/billing-service';
import { fillRateFor, priceFor } from './pricing';
import { SEED_VERSION, seedData } from './seed';
import { nextStatus, type LifecycleAction } from './lifecycle';

/**
 * The prototype "database": seed JSON + localStorage persistence + a tiny
 * subscribe API so React can re-render on writes (see hooks.ts).
 *
 * The CRUD surface is deliberately shaped like the future backend contract
 * (create/update/remove per entity, ids generated server-side-style) so the
 * templates consume data exactly the way the real application will.
 */

const STORAGE_KEY = 'gambit-db';

let data: DbData | null = null;
const listeners = new Set<() => void>();

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));

function load(): DbData {
  if (data) return data;
  if (typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as DbData;
        // Re-seed when the seed shape has moved on since this copy was saved.
        if (parsed.version === SEED_VERSION) {
          data = parsed;
          return data;
        }
      }
    } catch {
      /* corrupt store → fall through to seed */
    }
  }
  data = clone(seedData);
  persist();
  return data;
}

function persist() {
  if (typeof window !== 'undefined' && data) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* storage full/unavailable — keep the in-memory copy working */
    }
  }
}

function notify() {
  // Mutations edit the document in place (Object.assign on the entity, push
  // onto an array), which leaves the top-level reference untouched — and
  // useSyncExternalStore compares snapshots by identity, so React would bail
  // out and the change would persist without ever reaching the screen. A new
  // top-level object per write is what makes a mutation visible.
  if (data) data = { ...data };
  persist();
  listeners.forEach((l) => l());
}

// ── Read API ───────────────────────────────────────────────────────────

export function getDb(): DbData {
  return load();
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Wipe local changes and restore the seed (the demo reset). */
export function resetDb() {
  data = clone(seedData);
  notify();
}

// ── Id generation (matches the seeded id style) ────────────────────────

function nextId(prefix: string, existing: { id: string }[]): string {
  const max = existing
    .map((e) => parseInt(e.id.replace(`${prefix}-`, ''), 10))
    .filter((n) => !Number.isNaN(n))
    .reduce((a, b) => Math.max(a, b), 0);
  return `${prefix}-${String(max + 1).padStart(3, '0')}`;
}

const timestamp = () => new Date().toISOString();

// ── Media plans ────────────────────────────────────────────────────────

export function createMediaPlan(input: Omit<MediaPlan, 'id' | 'createdAt' | 'updatedAt'>): MediaPlan {
  const db = load();
  const plan: MediaPlan = { ...input, id: nextId('MP', db.mediaPlans), createdAt: timestamp(), updatedAt: timestamp() };
  db.mediaPlans.push(plan);
  notify();
  return plan;
}

export function updateMediaPlan(id: string, patch: Partial<Omit<MediaPlan, 'id' | 'createdAt'>>): MediaPlan | undefined {
  const db = load();
  const plan = db.mediaPlans.find((p) => p.id === id);
  if (!plan) return undefined;
  Object.assign(plan, patch, { updatedAt: timestamp() });
  notify();
  return plan;
}

/** Deleting a plan cascades to its campaigns and their bookings. */
export function deleteMediaPlan(id: string) {
  const db = load();
  const campaignIds = db.campaigns.filter((c) => c.mediaPlanId === id).map((c) => c.id);
  db.bookings = db.bookings.filter((b) => !campaignIds.includes(b.campaignId));
  db.campaigns = db.campaigns.filter((c) => c.mediaPlanId !== id);
  db.mediaPlans = db.mediaPlans.filter((p) => p.id !== id);
  notify();
}

// ── Campaigns ──────────────────────────────────────────────────────────

export function createCampaign(input: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>): Campaign {
  const db = load();
  const campaign: Campaign = { ...input, id: nextId('C', db.campaigns), createdAt: timestamp(), updatedAt: timestamp() };
  db.campaigns.push(campaign);
  notify();
  return campaign;
}

export function updateCampaign(id: string, patch: Partial<Omit<Campaign, 'id' | 'createdAt'>>): Campaign | undefined {
  const db = load();
  const campaign = db.campaigns.find((c) => c.id === id);
  if (!campaign) return undefined;
  Object.assign(campaign, patch, { updatedAt: timestamp() });
  notify();
  return campaign;
}

/** Deleting a campaign cascades to its bookings. */
export function deleteCampaign(id: string) {
  const db = load();
  db.bookings = db.bookings.filter((b) => b.campaignId !== id);
  db.campaigns = db.campaigns.filter((c) => c.id !== id);
  notify();
}

// ── Bookings ───────────────────────────────────────────────────────────

export function createBooking(input: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Booking {
  const db = load();
  const booking: Booking = { ...input, id: nextId('B', db.bookings), createdAt: timestamp(), updatedAt: timestamp() };
  db.bookings.push(booking);
  holdInventory(db, booking);
  notify();
  return booking;
}

/**
 * A new booking holds its positions for its run time, at today's price —
 * the price stays locked for the product's hold days, so a reviewer's
 * pause does not cost the advertiser the rate they were quoted.
 */
function holdInventory(db: DbData, booking: Booking) {
  const daysAhead = Math.max(0, Math.round((new Date(booking.startDate).getTime() - Date.now()) / 86400000));
  for (const positionId of booking.positionIds) {
    const position = db.positions.find((p) => p.id === positionId);
    const product = position && db.mediaProducts.find((m) => m.id === position.mediaProductId);
    if (!position || !product) continue;
    const build = priceFor(db, position, { from: booking.startDate, to: booking.endDate, daysAhead, budget: booking.budget, fillRate: fillRateFor(db, position, booking.startDate, booking.endDate) });
    const heldAt = new Date();
    const expiresAt = new Date(heldAt.getTime() + (product.holdDays ?? 5) * 86400000);
    db.inventoryHolds.push({
      id: nextId('IH', db.inventoryHolds),
      bookingId: booking.id,
      positionId,
      from: booking.startDate,
      to: booking.endDate,
      units: 1,
      priceLocked: build?.price ?? position.listPrice ?? product.listPrice ?? 0,
      heldAt: heldAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
      status: 'held',
    });
  }
}

// ── Guaranteed bookings ────────────────────────────────────────────────

/** Set what a guaranteed booking promises to deliver — a delivery setting,
 *  apart from its price, so it can change without touching a quote. */
export function setBookingGoal(bookingId: string, goal: BookingGoal | undefined) {
  const db = load();
  const booking = db.bookings.find((b) => b.id === bookingId);
  if (!booking || booking.price?.state === 'agreed') return;
  booking.goal = goal;
  booking.updatedAt = timestamp();
  notify();
}

/** Set a booking's budget. On a guaranteed booking the budget is its price,
 *  so a new budget releases an unagreed quote; an agreed one cannot change. */
export function setBookingBudget(bookingId: string, budget: number) {
  const db = load();
  const booking = db.bookings.find((b) => b.id === bookingId);
  if (!booking || booking.price?.state === 'agreed' || booking.budget === budget) return;
  booking.budget = budget;
  if (booking.price?.state === 'quoted') {
    const hold = booking.price.holdId && db.inventoryHolds.find((h) => h.id === booking.price!.holdId);
    if (hold && hold.status === 'held') hold.status = 'released';
    booking.price = undefined;
  }
  booking.updatedAt = timestamp();
  notify();
}

/**
 * "Check availability": hold the booking's inventory for the product's hold
 * days and lock today's price as a quote. A preview holds nothing; this does.
 */
export function quoteBookingPrice(bookingId: string): 'quoted' | 'no-budget' | 'agreed' {
  const db = load();
  const booking = db.bookings.find((b) => b.id === bookingId);
  if (!booking) return 'no-budget';
  if (booking.price?.state === 'agreed') return 'agreed';
  const view = bookingPrice(db, { ...booking, price: undefined });
  if (view.state !== 'indicative') return 'no-budget';
  const product = productForBooking(db, booking);
  const positionId = booking.positionIds[0] ?? db.positions.find((p) => p.mediaProductId === product?.id)?.id;
  const heldAt = new Date();
  const hold: InventoryHold | undefined = positionId ? {
    id: nextId('IH', db.inventoryHolds),
    bookingId: booking.id,
    positionId,
    from: booking.startDate,
    to: booking.endDate,
    units: 1,
    priceLocked: view.unitPrice ?? 0,
    heldAt: heldAt.toISOString(),
    expiresAt: new Date(heldAt.getTime() + (product?.holdDays ?? 5) * 86400000).toISOString(),
    status: 'held',
  } : undefined;
  if (hold) db.inventoryHolds.push(hold);
  booking.price = { state: 'quoted', basis: view.basis ?? product?.pricingBasis ?? 'cpm', unitPrice: view.unitPrice ?? 0, amount: booking.budget, lockedAt: heldAt.toISOString(), holdId: hold?.id };
  booking.updatedAt = timestamp();
  notify();
  return 'quoted';
}

/**
 * Submit a booking for approval. The system checks availability over all
 * its settings first; only a booking that passes goes into review, and a
 * guaranteed one has its inventory held and its budget locked as a quote
 * on the way — the hold is part of submitting, not a separate step.
 */
export function submitBooking(bookingId: string): { ok: true; held: boolean } | { ok: false; reason: string } {
  const db = load();
  const booking = db.bookings.find((b) => b.id === bookingId);
  if (!booking) return { ok: false, reason: 'Booking not found.' };
  const check = checkBookingAvailability(db, booking);
  if (check.status === 'incomplete' || check.status === 'unavailable') return { ok: false, reason: check.summary };
  let held = false;
  if (isGuaranteed(db, booking) && booking.price?.state !== 'agreed') held = quoteBookingPrice(bookingId) === 'quoted';
  const current = load().bookings.find((b) => b.id === bookingId)!;
  if (current.status === 'draft') {
    current.status = 'in-option';
    current.updatedAt = timestamp();
    notify();
  }
  return { ok: true, held };
}

// ── Billing ────────────────────────────────────────────────────────────

const client = () => billingService(() => load().invoices);

function upsertInvoice(db: DbData, record: InvoiceRecord, syncedAt: string) {
  const invoice: Invoice = { ...record, syncedAt };
  const at = db.invoices.findIndex((i) => i.id === invoice.id || i.number === invoice.number);
  if (at >= 0) db.invoices[at] = invoice;
  else db.invoices.push(invoice);
}

/**
 * Send a plan's completed bookings to the billing service. They go as one
 * request, so they land on one invoice under the plan's PO number; the
 * invoice the service returns is stored as its mirror.
 */
export async function sendToBilling(mediaPlanId: string): Promise<{ ok: true; invoice: Invoice } | { ok: false; reason: string }> {
  const db = load();
  const plan = db.mediaPlans.find((p) => p.id === mediaPlanId);
  if (!plan) return { ok: false, reason: 'Media plan not found.' };
  if (!plan.poNumber?.trim()) return { ok: false, reason: 'The plan has no PO number — ask the advertiser for it first.' };
  const ready = billableLines(db, { mediaPlanId }).filter((l) => l.state === 'ready');
  if (!ready.length) return { ok: false, reason: 'Nothing on this plan is ready to invoice.' };
  try {
    const record = await client().submitBillableLines({
      mediaPlanId,
      advertiserId: plan.advertiserId,
      poNumber: plan.poNumber,
      currency: 'EUR',
      lines: ready.map((l) => ({
        bookingId: l.bookingId,
        campaignId: l.campaignId,
        description: l.booking.name,
        basis: l.basis,
        amount: l.amount,
        adjustment: l.adjustment,
        adjustmentReason: l.adjustmentReason,
      })),
    });
    const current = load();
    upsertInvoice(current, record, timestamp());
    notify();
    return { ok: true, invoice: current.invoices.find((i) => i.number === record.number)! };
  } catch (e) {
    return { ok: false, reason: e instanceof Error ? e.message : 'The billing service did not answer.' };
  }
}

/** Pull invoice changes from the billing service — paid, overdue, credited. */
export async function syncBilling(): Promise<{ ok: boolean; count: number; reason?: string }> {
  try {
    const records = await client().listInvoices();
    const db = load();
    const stamp = timestamp();
    records.forEach((r) => upsertInvoice(db, r, stamp));
    notify();
    return { ok: true, count: records.length };
  } catch (e) {
    return { ok: false, count: 0, reason: e instanceof Error ? e.message : 'The billing service did not answer.' };
  }
}

/** Which billing service answers: the mock, or the live one. */
export const billingServiceMode = () => client().mode;

export function setHoldStatus(id: string, status: InventoryHold['status']) {
  const db = load();
  const hold = db.inventoryHolds.find((h) => h.id === id);
  if (!hold) return;
  hold.status = status;
  notify();
}

// ── Media products, placements, positions ──────────────────────────────

export function createMediaProduct(input: Omit<MediaProduct, 'id'>): MediaProduct {
  const db = load();
  const product: MediaProduct = { ...input, id: nextId('mprod', db.mediaProducts) };
  db.mediaProducts.push(product);
  notify();
  return product;
}

export function updateMediaProduct(id: string, patch: Partial<Omit<MediaProduct, 'id'>>): MediaProduct | undefined {
  const db = load();
  const product = db.mediaProducts.find((p) => p.id === id);
  if (!product) return undefined;
  Object.assign(product, patch);
  notify();
  return product;
}

export function createPlacement(input: Omit<Placement, 'id'>): Placement {
  const db = load();
  const placement: Placement = { ...input, id: nextId('plc', db.placements) };
  db.placements.push(placement);
  notify();
  return placement;
}

export function createPosition(input: Omit<Position, 'id'>): Position {
  const db = load();
  const position: Position = { ...input, id: nextId('pos', db.positions) };
  db.positions.push(position);
  notify();
  return position;
}

export function updatePosition(id: string, patch: Partial<Omit<Position, 'id'>>): Position | undefined {
  const db = load();
  const position = db.positions.find((p) => p.id === id);
  if (!position) return undefined;
  Object.assign(position, patch);
  notify();
  return position;
}

// ── Pricing rules ──────────────────────────────────────────────────────

export function createPricingRule(input: Omit<PricingRule, 'id' | 'updatedAt'>): PricingRule {
  const db = load();
  const rule: PricingRule = { ...input, id: nextId('PR', db.pricingRules), updatedAt: timestamp() };
  db.pricingRules.push(rule);
  notify();
  return rule;
}

export function updatePricingRule(id: string, patch: Partial<Omit<PricingRule, 'id'>>): PricingRule | undefined {
  const db = load();
  const rule = db.pricingRules.find((r) => r.id === id);
  if (!rule) return undefined;
  Object.assign(rule, patch, { updatedAt: timestamp() });
  notify();
  return rule;
}

export function deletePricingRule(id: string) {
  const db = load();
  db.pricingRules = db.pricingRules.filter((r) => r.id !== id);
  notify();
}

export function updateBooking(id: string, patch: Partial<Omit<Booking, 'id' | 'createdAt'>>): Booking | undefined {
  const db = load();
  const booking = db.bookings.find((b) => b.id === id);
  if (!booking) return undefined;
  Object.assign(booking, patch, { updatedAt: timestamp() });
  notify();
  return booking;
}

export function deleteBooking(id: string) {
  const db = load();
  db.bookings = db.bookings.filter((b) => b.id !== id);
  notify();
}

// ── Metric registry ────────────────────────────────────────────────────

export function addMetricDefinition(def: DbData['metricDefinitions'][number]) {
  const db = load();
  const exists = db.metricDefinitions.some((m) => m.engine === def.engine && m.key === def.key);
  if (!exists) {
    db.metricDefinitions.push(def);
    notify();
  }
}

export function removeMetricDefinition(engine: string, key: string) {
  const db = load();
  db.metricDefinitions = db.metricDefinitions.filter((m) => !(m.engine === engine && m.key === key));
  notify();
}

// ── FAQ ────────────────────────────────────────────────────────────────

/** New entries land at the end of their surface's list. */
export function createFaq(input: Omit<FaqEntry, 'id' | 'order' | 'updatedAt'> & { order?: number }): FaqEntry {
  const db = load();
  const lastOrder = db.faqs
    .filter((f) => f.surface === input.surface)
    .reduce((max, f) => Math.max(max, f.order), 0);
  const entry: FaqEntry = {
    ...input,
    id: nextId('FAQ', db.faqs),
    order: input.order ?? lastOrder + 1,
    updatedAt: timestamp(),
  };
  db.faqs.push(entry);
  notify();
  return entry;
}

export function updateFaq(id: string, patch: Partial<Omit<FaqEntry, 'id'>>): FaqEntry | undefined {
  const db = load();
  const entry = db.faqs.find((f) => f.id === id);
  if (!entry) return undefined;
  Object.assign(entry, patch, { updatedAt: timestamp() });
  notify();
  return entry;
}

export function deleteFaq(id: string) {
  const db = load();
  db.faqs = db.faqs.filter((f) => f.id !== id);
  notify();
}

// Metric terms and release notes share the FAQ's editing model: retailer-
// written content, ordered lists, drafts hidden from readers.

export function createTerm(input: Omit<TermEntry, 'id' | 'order' | 'updatedAt'> & { order?: number }): TermEntry {
  const db = load();
  const last = db.terms.reduce((max, t) => Math.max(max, t.order), 0);
  const entry: TermEntry = { ...input, id: nextId('TERM', db.terms), order: input.order ?? last + 1, updatedAt: timestamp() };
  db.terms.push(entry);
  notify();
  return entry;
}

export function updateTerm(id: string, patch: Partial<Omit<TermEntry, 'id'>>): TermEntry | undefined {
  const db = load();
  const entry = db.terms.find((t) => t.id === id);
  if (!entry) return undefined;
  Object.assign(entry, patch, { updatedAt: timestamp() });
  notify();
  return entry;
}

export function deleteTerm(id: string) {
  const db = load();
  db.terms = db.terms.filter((t) => t.id !== id);
  notify();
}

export function createReleaseNote(input: Omit<ReleaseNote, 'id' | 'order' | 'updatedAt'> & { order?: number }): ReleaseNote {
  const db = load();
  const last = db.releaseNotes.reduce((max, n) => Math.max(max, n.order), 0);
  const entry: ReleaseNote = { ...input, id: nextId('NOTE', db.releaseNotes), order: input.order ?? last + 1, updatedAt: timestamp() };
  db.releaseNotes.push(entry);
  notify();
  return entry;
}

export function updateReleaseNote(id: string, patch: Partial<Omit<ReleaseNote, 'id'>>): ReleaseNote | undefined {
  const db = load();
  const entry = db.releaseNotes.find((n) => n.id === id);
  if (!entry) return undefined;
  Object.assign(entry, patch, { updatedAt: timestamp() });
  notify();
  return entry;
}

export function deleteReleaseNote(id: string) {
  const db = load();
  db.releaseNotes = db.releaseNotes.filter((n) => n.id !== id);
  notify();
}

/**
 * Move an entry one place up or down within its surface, by swapping order
 * with its neighbour. Editors think in "this should come first", not in
 * order numbers.
 */
export function moveFaq(id: string, direction: 'up' | 'down') {
  const db = load();
  const entry = db.faqs.find((f) => f.id === id);
  if (!entry) return;
  const siblings = db.faqs.filter((f) => f.surface === entry.surface).sort((a, b) => a.order - b.order);
  const index = siblings.findIndex((f) => f.id === id);
  const swapWith = siblings[direction === 'up' ? index - 1 : index + 1];
  if (!swapWith) return;
  const order = entry.order;
  entry.order = swapWith.order;
  swapWith.order = order;
  entry.updatedAt = timestamp();
  notify();
}

// ── Lifecycle (play / pause / stop) ────────────────────────────────────

/**
 * Approval: the booking passes its workflow's approval step. A guaranteed
 * booking's budget is agreed there — frozen as the billable amount — and
 * its inventory hold confirmed; from here neither moves.
 */
function approve(db: DbData, booking: Booking, stamp: string) {
  if (!booking.approvedAt) booking.approvedAt = stamp;
  if (booking.price?.state === 'agreed' || !isGuaranteed(db, booking)) return;
  const view = bookingPrice(db, booking);
  if (view.state !== 'indicative' && view.state !== 'quoted') return;
  booking.price = { state: 'agreed', basis: view.basis ?? 'cpm', unitPrice: view.unitPrice ?? 0, amount: view.amount ?? booking.budget, lockedAt: stamp, holdId: booking.price?.holdId };
  const hold = booking.price.holdId && db.inventoryHolds.find((h) => h.id === booking.price!.holdId);
  if (hold && hold.status === 'held') hold.status = 'confirmed';
}

/** Approve a booking in review: the workflow's approval step passes and a
 *  guaranteed booking's budget becomes its agreed, billable amount. */
export function approveBooking(bookingId: string): { ok: true; agreed?: number } | { ok: false; reason: string } {
  const db = load();
  const booking = db.bookings.find((b) => b.id === bookingId);
  if (!booking) return { ok: false, reason: 'Booking not found.' };
  if (booking.approvedAt) return { ok: false, reason: 'Already approved.' };
  approve(db, booking, timestamp());
  if (booking.status === 'draft') booking.status = 'in-option';
  booking.updatedAt = timestamp();
  notify();
  return { ok: true, agreed: booking.price?.state === 'agreed' ? booking.price.amount : undefined };
}

/** Launching a booking that was never approved approves it on the way. */
function agreeOnApproval(db: DbData, booking: Booking, from: Booking['status'], to: Booking['status'], stamp: string) {
  if (to !== 'running' || (from !== 'draft' && from !== 'in-option')) return;
  approve(db, booking, stamp);
}

/** Move a booking to its next status, agreeing its price when approved. */
function moveBooking(db: DbData, booking: Booking, action: LifecycleAction, stamp: string): boolean {
  const next = nextStatus(action, booking.status);
  if (!next) return false;
  agreeOnApproval(db, booking, booking.status, next, stamp);
  Object.assign(booking, { status: next, updatedAt: stamp });
  return true;
}

/**
 * Apply a lifecycle action to a media plan and everything under it.
 *
 * One write, one notify: pausing a plan and its twelve bookings should be a
 * single change the UI reacts to once, not thirteen renders. Entities the
 * action doesn't apply to (a draft booking under a running campaign, say) are
 * left exactly as they are — see canApply in lifecycle.ts.
 */
export function applyPlanLifecycle(planId: string, action: LifecycleAction) {
  const db = load();
  const plan = db.mediaPlans.find((p) => p.id === planId);
  if (!plan) return;

  const campaigns = db.campaigns.filter((c) => c.mediaPlanId === planId);
  const campaignIds = new Set(campaigns.map((c) => c.id));
  const bookings = db.bookings.filter((b) => campaignIds.has(b.campaignId));

  const stamp = timestamp();
  const planNext = nextStatus(action, plan.status);
  if (planNext) Object.assign(plan, { status: planNext, updatedAt: stamp });
  campaigns.forEach((c) => {
    const next = nextStatus(action, c.status);
    if (next) Object.assign(c, { status: next, updatedAt: stamp });
  });
  bookings.forEach((b) => moveBooking(db, b, action, stamp));
  notify();
}

/** The same, scoped to one campaign and its bookings. */
export function applyCampaignLifecycle(campaignId: string, action: LifecycleAction) {
  const db = load();
  const campaign = db.campaigns.find((c) => c.id === campaignId);
  if (!campaign) return;

  const stamp = timestamp();
  const next = nextStatus(action, campaign.status);
  if (next) Object.assign(campaign, { status: next, updatedAt: stamp });
  db.bookings
    .filter((b) => b.campaignId === campaignId)
    .forEach((b) => moveBooking(db, b, action, stamp));
  notify();
}

/** A single booking. Nothing sits under it, so nothing cascades. */
export function applyBookingLifecycle(bookingId: string, action: LifecycleAction) {
  const db = load();
  const booking = db.bookings.find((b) => b.id === bookingId);
  if (!booking) return;
  if (moveBooking(db, booking, action, timestamp())) notify();
}


// ── Creatives ──────────────────────────────────────────────────────────

export function createCreative(
  input: Omit<Creative, 'id' | 'createdAt' | 'updatedAt'>,
): Creative {
  const db = load();
  const creative: Creative = { ...input, id: nextId('CR', db.creatives), createdAt: timestamp(), updatedAt: timestamp() };
  db.creatives.push(creative);
  syncBookingCreativeStatus(db, creative.bookingIds);
  notify();
  return creative;
}

export function updateCreative(id: string, patch: Partial<Omit<Creative, 'id' | 'createdAt'>>): Creative | undefined {
  const db = load();
  const creative = db.creatives.find((c) => c.id === id);
  if (!creative) return undefined;
  const before = creative.bookingIds;
  Object.assign(creative, patch, { updatedAt: timestamp() });
  syncBookingCreativeStatus(db, [...new Set([...before, ...creative.bookingIds])]);
  notify();
  return creative;
}

/** Save a workflow's board — steps, transitions, name — and optionally its status. */
export function updateWorkflow(id: string, patch: Partial<Omit<Workflow, 'id' | 'engine'>>): Workflow | undefined {
  const db = load();
  const wf = db.workflows.find((w) => w.id === id);
  if (!wf) return undefined;
  Object.assign(wf, patch, { updatedAt: timestamp() });
  notify();
  return wf;
}

export function deleteCreative(id: string) {
  const db = load();
  const creative = db.creatives.find((c) => c.id === id);
  db.creatives = db.creatives.filter((c) => c.id !== id);
  if (creative) syncBookingCreativeStatus(db, creative.bookingIds);
  notify();
}

/** Move a creative through the approval flow. A rejection carries its reason. */
export function setCreativeStatus(id: string, status: CreativeApprovalStatus, rejectionReason?: string) {
  const db = load();
  const creative = db.creatives.find((c) => c.id === id);
  if (!creative) return;
  creative.status = status;
  creative.rejectionReason = status === 'rejected' ? rejectionReason : undefined;
  creative.updatedAt = timestamp();
  syncBookingCreativeStatus(db, creative.bookingIds);
  notify();
}

/**
 * A booking's creativeStatus is DERIVED from the creatives linked to it, so
 * the existing to-dos and the setup checklist stay truthful: any approved
 * creative makes the booking ready; anything on its way keeps it at
 * submitted; nothing linked means missing.
 */
function syncBookingCreativeStatus(db: DbData, bookingIds: string[]) {
  for (const bookingId of bookingIds) {
    const booking = db.bookings.find((b) => b.id === bookingId);
    if (!booking) continue;
    const linked = db.creatives.filter((c) => c.bookingIds.includes(bookingId));
    booking.creativeStatus = linked.some((c) => c.status === 'approved')
      ? 'approved'
      : linked.some((c) => c.status === 'submitted' || c.status === 'in-review')
        ? 'submitted'
        : 'missing';
    booking.updatedAt = timestamp();
  }
}
