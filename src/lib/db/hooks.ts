'use client';

import * as React from 'react';
import type { Booking, Campaign, DbData, DbUser, EngineId, MediaPlan, MetricDefinition } from './types';
import { getDb, subscribe } from './store';
import { getCurrentUser, subscribeSession } from './session';

/**
 * React bindings for the prototype database. Components subscribe with
 * useSyncExternalStore so every write (create/update/delete/reset) re-renders
 * the templates that read from the store.
 *
 * SSR note: the server snapshot is the seed-shaped store too (getDb falls back
 * to the seed when localStorage is unavailable), keeping hydration consistent.
 */

function useDbSnapshot(): DbData {
  return React.useSyncExternalStore(subscribe, getDb, getDb);
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

/** The logged-in user (null when signed out). Re-renders on login/logout. */
export function useSession(): DbUser | null {
  return React.useSyncExternalStore(
    subscribeSession,
    getCurrentUser,
    // Server snapshot: no session during SSR.
    () => null,
  );
}
