'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NotificationDot } from './notification-dot';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu';

/**
 * The tab strip above a card.
 *
 * A tab title is always whole: "Recommendations" never becomes "Recomm…". When
 * the strip runs out of room the tabs that do not fit fold into one last tab,
 * "+3", that opens them as a list — the count says how much is behind it. The
 * active tab always stays in view; a hidden tab picked from the list takes the
 * last visible place.
 *
 * Widths come from a hidden copy of every tab (same classes, so the same
 * width) measured under a ResizeObserver, so the strip settles before paint
 * and re-settles as the row changes.
 */
export interface TabStripTab {
  value: string;
  label: React.ReactNode;
  /** Unread count: a dot on the tab, and on the "+N" tab when it hides one. */
  badgeCount?: number;
}

export interface TabStripProps {
  tabs: TabStripTab[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  /** Unread counts by tab value — for callers that keep them apart from the list. */
  badgeCounts?: Record<string, number | undefined>;
}

const TAB_CLASS = 'inline-flex shrink-0 items-center gap-2 whitespace-nowrap px-6 py-3 text-sm border border-b-0 rounded-t-lg focus:outline-none transition-colors';
const ACTIVE = 'font-medium bg-white text-card-foreground border-border z-10';
const IDLE = 'font-normal bg-transparent text-muted-foreground border-transparent hover:text-card-foreground';

export const TabStrip: React.FC<TabStripProps> = ({ tabs, value, onChange, className, badgeCounts }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const measureRef = React.useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = React.useState(tabs.length);
  const count = (t: TabStripTab) => t.badgeCount ?? badgeCounts?.[t.value] ?? 0;

  // Measured under a ResizeObserver, and again on every render and window
  // resize: a parent that folds a column re-renders the strip before the
  // observer gets a frame, and the strip should already be right by then.
  const measure = React.useCallback(() => {
    const el = ref.current;
    const m = measureRef.current;
    if (!el || !m) return;
    {
      const kids = Array.from(m.children) as HTMLElement[];
      const more = kids[kids.length - 1]?.offsetWidth ?? 0;
      const widths = kids.slice(0, -1).map((k) => k.offsetWidth);
      const room = el.clientWidth;
      let used = 0;
      let fit = 0;
      for (let i = 0; i < widths.length; i += 1) {
        const rest = i < widths.length - 1 ? more : 0;
        if (used + widths[i] + rest > room) break;
        used += widths[i];
        fit += 1;
      }
      // Everything fits, or at least one tab and the "+N" tab.
      const next = fit >= widths.length ? widths.length : Math.max(1, fit);
      setVisibleCount((prev) => (prev === next ? prev : next));
    }
  }, []);

  React.useLayoutEffect(measure);

  React.useLayoutEffect(() => {
    const el = ref.current;
    const m = measureRef.current;
    if (!el || !m) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    ro.observe(m);
    window.addEventListener('resize', measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, [measure]);

  // The active tab always shows: when it is folded away, it takes the last
  // visible place and that tab folds instead.
  const activeIndex = tabs.findIndex((t) => t.value === value);
  let visible = tabs.slice(0, visibleCount);
  let hidden = tabs.slice(visibleCount);
  if (activeIndex >= visibleCount && visibleCount > 0) {
    const swapped = visible[visible.length - 1];
    visible = [...visible.slice(0, -1), tabs[activeIndex]];
    hidden = [swapped, ...tabs.slice(visibleCount).filter((t) => t.value !== value)];
  }
  const hiddenUnread = hidden.reduce((s, t) => s + count(t), 0);

  const renderTab = (t: TabStripTab, interactive: boolean) => (
    <button
      key={t.value}
      type="button"
      role={interactive ? 'tab' : undefined}
      tabIndex={interactive ? undefined : -1}
      aria-selected={interactive ? value === t.value : undefined}
      onClick={interactive ? () => onChange(t.value) : undefined}
      className={cn(TAB_CLASS, value === t.value ? ACTIVE : IDLE)}
      style={{ position: 'relative', top: 1 }}
    >
      <span data-tab-label>{t.label}</span>
      {count(t) > 0 && <NotificationDot count={count(t)} />}
    </button>
  );

  return (
    <div ref={ref} role="tablist" className={cn('relative flex min-w-0 gap-0', className)}>
      {visible.map((t) => renderTab(t, true))}
      {hidden.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className={cn(TAB_CLASS, IDLE, 'gap-1')} style={{ position: 'relative', top: 1 }} title={`${hidden.length} more tab${hidden.length === 1 ? '' : 's'}`}>
              +{hidden.length}
              {hiddenUnread > 0 && <NotificationDot count={hiddenUnread} />}
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {hidden.map((t) => (
              <DropdownMenuItem key={t.value} onSelect={() => onChange(t.value)} className="gap-2">
                {t.label}
                {count(t) > 0 && <NotificationDot count={count(t)} />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      {/* The measuring copy: every tab at its natural width, plus the widest
          "+N" tab, invisible and out of the flow. */}
      <div ref={measureRef} data-tab-measure aria-hidden className="pointer-events-none invisible absolute left-0 top-0 flex whitespace-nowrap">
        {tabs.map((t) => renderTab(t, false))}
        <span className={cn(TAB_CLASS, IDLE, 'gap-1')}>+{Math.max(tabs.length - 1, 1)}<ChevronDown className="h-3.5 w-3.5" /></span>
      </div>
    </div>
  );
};
