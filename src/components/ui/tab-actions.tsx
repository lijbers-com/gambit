'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * The action buttons that share a row with a tab strip.
 *
 * Tabs and actions compete for one line, and on a narrow screen the tabs lose:
 * their titles truncate to "Notifica…" while the buttons keep spelling out
 * words the icons already carry. So the group watches the row, and when the
 * tabs' natural width plus the buttons no longer fits, the buttons drop their
 * labels — a `+` and a play icon say enough — and the tabs get the space back.
 *
 * Buttons opt their label in with TAB_ACTION_LABEL on the text span; icons and
 * anything unlabelled are untouched. Measurement uses the label-visible width,
 * cached, so collapsing (which frees space) cannot argue itself back open.
 */

/** Class for a button label that should give way to the tabs when space runs out. */
export const TAB_ACTION_LABEL = 'group-data-[compact]/tab-actions:hidden';

export const TabActionGroup: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [compact, setCompact] = React.useState(false);
  // Width with labels showing — the number that decides, held across collapse.
  const fullWidth = React.useRef(0);

  React.useLayoutEffect(() => {
    const el = ref.current;
    const row = el?.parentElement;
    if (!el || !row) return;

    const measure = () => {
      if (!el.dataset.compact) fullWidth.current = el.offsetWidth;
      const tabs = Array.from(row.children).find((c) => c !== el);
      if (!tabs) return;
      // Natural tab width: rendered width plus whatever truncation clipped.
      let natural = 0;
      for (const b of Array.from(tabs.children) as HTMLElement[]) {
        const span = b.querySelector('span');
        natural += b.offsetWidth + (span ? span.scrollWidth - span.clientWidth : 0);
      }
      setCompact(natural + fullWidth.current + 16 > row.clientWidth);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(row);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-compact={compact ? '' : undefined}
      className={cn('group/tab-actions flex shrink-0 items-center gap-2', className)}
    >
      {children}
    </div>
  );
};
