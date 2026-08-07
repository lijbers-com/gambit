import type { Booking, Campaign, DbData, FaqEntry, MediaPlan, TermEntry, ReleaseNote } from './types';
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
  notify();
  return booking;
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
  bookings.forEach((b) => {
    const next = nextStatus(action, b.status);
    if (next) Object.assign(b, { status: next, updatedAt: stamp });
  });
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
    .forEach((b) => {
      const bookingNext = nextStatus(action, b.status);
      if (bookingNext) Object.assign(b, { status: bookingNext, updatedAt: stamp });
    });
  notify();
}

/** A single booking. Nothing sits under it, so nothing cascades. */
export function applyBookingLifecycle(bookingId: string, action: LifecycleAction) {
  const db = load();
  const booking = db.bookings.find((b) => b.id === bookingId);
  if (!booking) return;
  const next = nextStatus(action, booking.status);
  if (next) {
    Object.assign(booking, { status: next, updatedAt: timestamp() });
    notify();
  }
}
