'use client';

import * as React from 'react';
import type { Booking, Campaign, DbData, DbUser, EngineId, FaqEntry, MediaPlan, MetricDefinition } from './types';
import { getDb, subscribe } from './store';
import { seedData } from './seed';
import { getCurrentUser, subscribeSession } from './session';
import { deriveTasksForUser } from './tasks';
import { faqsFor, type FaqQuery } from './faq';

/**
 * React bindings for the prototype database. Components subscribe with
 * useSyncExternalStore so every write (create/update/delete/reset) re-renders
 * the templates that read from the store.
 *
 * SSR note: the server snapshot is the seed-shaped store too (getDb falls back
 * to the seed when localStorage is unavailable), keeping hydration consistent.
 */

/**
 * The snapshot used for SSR *and* for the first client render during
 * hydration. It must never read localStorage: the server only knows the seed,
 * so reading a user's persisted store here would make the hydrated HTML
 * disagree with the server's (e.g. "9 media plans" vs "8"). React swaps in the
 * live snapshot immediately after hydration.
 */
function getHydrationSnapshot(): DbData {
  return seedData;
}

function useDbSnapshot(): DbData {
  return React.useSyncExternalStore(subscribe, getDb, getHydrationSnapshot);
}

export function useDb(): DbData {
  return useDbSnapshot();
}

export function useUsers(): DbUser[] {
  return useDbSnapshot().users;
}

export function useMediaPlans(): MediaPlan[] {
  return useDbSnapshot().mediaPlans;
}

export function useMediaPlan(id: string | undefined): MediaPlan | undefined {
  return useDbSnapshot().mediaPlans.find((p) => p.id === id);
}

export function useCampaigns(filter?: { mediaPlanId?: string; engine?: EngineId }): Campaign[] {
  const db = useDbSnapshot();
  return db.campaigns.filter(
    (c) =>
      (!filter?.mediaPlanId || c.mediaPlanId === filter.mediaPlanId) &&
      (!filter?.engine || c.engine === filter.engine),
  );
}

export function useBookings(filter?: { campaignId?: string }): Booking[] {
  const db = useDbSnapshot();
  return db.bookings.filter((b) => !filter?.campaignId || b.campaignId === filter.campaignId);
}

/** The registered metrics for an engine — the agreed per-engine overview. */
export function useMetricDefinitions(engine: EngineId | 'all'): MetricDefinition[] {
  return useDbSnapshot().metricDefinitions.filter((m) => m.engine === engine);
}

/** Derived to-dos for the logged-in user's role (empty when signed out). */
export function useMyTasks() {
  const db = useDbSnapshot();
  const user = useSession();
  return React.useMemo(
    () => (user ? deriveTasksForUser(db, user.personaKey, user.side) : []),
    [db, user],
  );
}

/** FAQ entries for a template, already filtered for the reader. Pass
 *  `includeDrafts` only in the configuration area. */
export function useFaqs(query: FaqQuery): FaqEntry[] {
  const db = useDbSnapshot();
  return React.useMemo(() => faqsFor(db, query), [db, query.surface, query.section, query.engine, query.side, query.includeDrafts]); // eslint-disable-line react-hooks/exhaustive-deps
}

/** The logged-in user (null when signed out). Re-renders on login/logout. */
export function useSession(): DbUser | null {
  return React.useSyncExternalStore(
    subscribeSession,
    getCurrentUser,
    // Server snapshot: no session during SSR.
    () => null,
  );
}
