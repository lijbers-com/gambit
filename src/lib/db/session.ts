import type { DbUser } from './types';
import { getDb } from './store';

/**
 * The logged-in user for the prototype. Selecting a user on the login screen
 * stores their id here; branding follows the user:
 *  - retailer-side users → Edge (gambit) chrome with the full navigation
 *  - advertiser-side users → the retailer's brand theme with advertiser nav
 *
 * The theme itself is applied through the existing ThemeProvider key so all
 * current theming keeps working unchanged.
 */

const SESSION_KEY = 'gambit-session';
const THEME_KEY = 'gambit-theme';

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

export function subscribeSession(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getCurrentUser(): DbUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const id = window.localStorage.getItem(SESSION_KEY);
    if (!id) return null;
    return getDb().users.find((u) => u.id === id) ?? null;
  } catch {
    return null;
  }
}

/**
 * Log in as a user and apply the branding.
 *
 * The theme comes from the login screen when given: the Edge theme is the
 * retailer's own workspace, while each retailer theme (Albert Heijn, Delhaize,
 * AD USA, Alfa Beta) is that retailer's self-service platform, where only
 * advertiser-side users sign in. Falls back to the user's default theme.
 */
export function login(userId: string, theme?: string): DbUser | null {
  const user = getDb().users.find((u) => u.id === userId) ?? null;
  if (!user || typeof window === 'undefined') return null;
  try {
    window.localStorage.setItem(SESSION_KEY, user.id);
    window.localStorage.setItem(THEME_KEY, theme ?? user.theme);
  } catch {
    /* storage unavailable (e.g. sandboxed iframe) */
  }
  notify();
  return user;
}

export function logout() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(SESSION_KEY);
  } catch {
    /* storage unavailable */
  }
  notify();
}
