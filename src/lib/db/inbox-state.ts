import * as React from 'react';

/**
 * Which messages the user has read or finished.
 *
 * Messages themselves are derived (see messages.ts) and never stored, so the
 * only thing worth persisting is what the user did with them. Keyed by the
 * message's stable id, so a message that disappears and comes back — a creative
 * removed and re-added — is correctly unread again only if its id changed.
 *
 * Kept in its own localStorage key rather than inside the seeded database: it is
 * per-user interaction state, not prototype data, and resetting the database
 * should not silently mark everything unread.
 */

const STORAGE_KEY = 'gambit-inbox-state';

export type MessageStatus = 'unread' | 'read' | 'done';

export interface InboxStateMap {
  [messageId: string]: MessageStatus;
}

/**
 * The snapshot used for the server render and for hydration. It must be a
 * stable reference and must never read localStorage — otherwise the server HTML
 * and the first client render disagree and React throws a hydration error.
 * Everything starts unread, which is also the honest default.
 */
const EMPTY: InboxStateMap = {};

let state: InboxStateMap | null = null;
const listeners = new Set<() => void>();

function read(): InboxStateMap {
  if (typeof window === 'undefined') return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as InboxStateMap) : {};
  } catch {
    return {};
  }
}

function write(next: InboxStateMap) {
  state = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // A full or blocked localStorage shouldn't break the page; the state simply
    // lives for this session only.
  }
  listeners.forEach((l) => l());
}

export function getInboxState(): InboxStateMap {
  if (state === null) state = read();
  return state;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function statusOf(id: string): MessageStatus {
  return getInboxState()[id] ?? 'unread';
}

export function setStatus(id: string, status: MessageStatus) {
  const current = getInboxState();
  if (current[id] === status) return;
  write({ ...current, [id]: status });
}

/** Mark read, but never downgrade something already finished. */
export function markRead(id: string) {
  if (statusOf(id) === 'done') return;
  setStatus(id, 'read');
}

export function markDone(id: string) {
  setStatus(id, 'done');
}

/** Move a finished message back to the to-do list. */
export function markUndone(id: string) {
  setStatus(id, 'read');
}

export function markAllRead(ids: string[]) {
  const current = getInboxState();
  const next = { ...current };
  let changed = false;
  for (const id of ids) {
    if ((current[id] ?? 'unread') === 'unread') {
      next[id] = 'read';
      changed = true;
    }
  }
  if (changed) write(next);
}

/** Forget all read/done state — used by the prototype's reset. */
export function resetInboxState() {
  write({});
}

/** React binding. Hydration-safe: the server snapshot is the empty map. */
export function useInboxState(): InboxStateMap {
  return React.useSyncExternalStore(subscribe, getInboxState, () => EMPTY);
}
