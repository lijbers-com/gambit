'use client';

import * as React from 'react';

/**
 * Filters the user carries with them across the app.
 *
 * A date range picked on the campaign overview should still be set when they
 * open bookings — it is a lens on the whole workspace, not a setting belonging
 * to one page. Component state resets on every navigation, so it lives here
 * instead, in one place both templates read.
 *
 * Stored per browser session rather than forever: the range answers "what am I
 * looking at right now", and reviving last month's window on Monday morning
 * would be worse than starting from the default.
 */

const STORAGE_KEY = 'gambit-session-filters';

export interface SessionFilters {
  /** ISO yyyy-mm-dd. Both ends set, or neither. */
  dateFrom?: string;
  dateTo?: string;
}

/**
 * Server render and first client render both use this. It must be a stable
 * reference and must never read storage, or the hydrated HTML disagrees with
 * the server's.
 */
const EMPTY: SessionFilters = {};

let state: SessionFilters | null = null;
const listeners = new Set<() => void>();

function read(): SessionFilters {
  if (typeof window === 'undefined') return EMPTY;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SessionFilters) : {};
  } catch {
    return {};
  }
}

export function getSessionFilters(): SessionFilters {
  if (state === null) state = read();
  return state;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setSessionFilters(patch: SessionFilters) {
  // A new object every write: useSyncExternalStore compares snapshots by
  // identity, so mutating in place would leave the change invisible.
  const next = { ...getSessionFilters(), ...patch };
  state = next;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Private mode or a full store: the filter still works for this page.
  }
  listeners.forEach((l) => l());
}

/** Clear the date range back to "everything". */
export function clearSessionDateRange() {
  setSessionFilters({ dateFrom: undefined, dateTo: undefined });
}

/** React binding. Hydration-safe: the server snapshot is the empty set. */
export function useSessionFilters(): SessionFilters {
  return React.useSyncExternalStore(subscribe, getSessionFilters, () => EMPTY);
}

/**
 * Whether something that runs `start`–`end` is visible under the session's
 * date range.
 *
 * Overlap, not containment: a campaign running May–September is part of what
 * happened in June, and hiding it because it started earlier would misreport
 * the month. No range set means everything is in scope.
 */
export function withinSessionRange(
  filters: SessionFilters,
  start?: string,
  end?: string,
): boolean {
  if (!filters.dateFrom || !filters.dateTo) return true;
  if (!start || !end) return true;
  return start <= filters.dateTo && end >= filters.dateFrom;
}
