'use client';

import * as React from 'react';
import { CheckCircle2, Undo2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

/**
 * Bottom-right toasts — the app's receipt for a change that already happened.
 *
 * A toast is confirmation, not a question: the change is done, the toast says
 * so, and when the change is reversible it carries the one action that makes
 * regret cheap — Undo. That is why it lives here and not in a dialog: nothing
 * is waiting on the user.
 *
 * One provider at the app root; anything below it calls `useToast()` and
 * `toast({ title, undo })`. Toasts stack bottom-right, newest at the bottom,
 * and dismiss themselves after a few seconds — longer when there is an Undo,
 * because the whole point of that toast is the time to change your mind.
 */

export interface ToastOptions {
  title: string;
  /** One quieter line under the title, e.g. what the change amounted to. */
  description?: string;
  /** Reverses the change. Its presence adds the Undo button and buys the
   *  toast a longer life. */
  undo?: () => void;
  /** ms before auto-dismiss. Defaults: 4s, 7s with an Undo. */
  duration?: number;
}

interface ToastEntry extends ToastOptions {
  id: number;
  leaving?: boolean;
}

const ToastContext = React.createContext<((opts: ToastOptions) => void) | null>(null);

/** Fire a toast from anywhere under the provider. */
export function useToast(): (opts: ToastOptions) => void {
  const fire = React.useContext(ToastContext);
  // A missing provider should not crash a page over a receipt — warn and drop.
  return fire ?? ((opts) => console.warn('useToast without ToastProvider:', opts.title));
}

/**
 * Queue a toast to fire after the next full page load. The create flows
 * navigate with window.location, which tears the React tree down before a
 * live toast could be seen — so the receipt rides sessionStorage and the
 * provider fires it on mount. No Undo across a reload: the queued kind is
 * purely a confirmation.
 */
const QUEUE_KEY = 'gambit-queued-toast';
export function queueToast(opts: Pick<ToastOptions, 'title' | 'description'>): void {
  try { window.sessionStorage.setItem(QUEUE_KEY, JSON.stringify(opts)); } catch { /* private mode */ }
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = React.useState<ToastEntry[]>([]);
  const nextId = React.useRef(1);
  const timers = React.useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const dismiss = React.useCallback((id: number) => {
    const t = timers.current.get(id);
    if (t) { clearTimeout(t); timers.current.delete(id); }
    // Two-step leave so the exit animation can play before removal.
    setToasts((prev) => prev.map((x) => (x.id === id ? { ...x, leaving: true } : x)));
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 180);
  }, []);

  const fire = React.useCallback((opts: ToastOptions) => {
    const id = nextId.current++;
    setToasts((prev) => [...prev, { ...opts, id }]);
    const life = opts.duration ?? (opts.undo ? 7000 : 4000);
    timers.current.set(id, setTimeout(() => dismiss(id), life));
  }, [dismiss]);

  // Fire anything a previous page queued before navigating here.
  React.useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(QUEUE_KEY);
      if (raw) {
        window.sessionStorage.removeItem(QUEUE_KEY);
        fire(JSON.parse(raw));
      }
    } catch { /* ignore malformed queue */ }
  }, [fire]);

  return (
    <ToastContext.Provider value={fire}>
      {children}
      {/* Bottom-right, above drawers (z-50) so a receipt is never hidden by
          the panel that produced it. */}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[360px] max-w-[calc(100vw-2rem)] flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={cn(
              'pointer-events-auto flex items-start gap-3 rounded-lg border bg-card p-3.5 shadow-lg transition-all duration-200',
              t.leaving ? 'translate-y-1 opacity-0' : 'translate-y-0 opacity-100',
            )}
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success-600" />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-foreground">{t.title}</div>
              {t.description && <div className="mt-0.5 text-xs text-muted-foreground">{t.description}</div>}
            </div>
            {t.undo && (
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 gap-1"
                onClick={() => { t.undo?.(); dismiss(t.id); }}
              >
                <Undo2 className="h-3.5 w-3.5" />
                Undo
              </Button>
            )}
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => dismiss(t.id)}
              className="shrink-0 rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
