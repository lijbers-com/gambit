import type { Booking, Campaign, DbData, MediaPlan } from './types';
import { SEED_VERSION, seedData } from './seed';

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
