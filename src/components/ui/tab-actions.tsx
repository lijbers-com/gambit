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

/**
 * A tab strip is the top edge of the card beneath it, so it must never be
 * wider than that card.
 *
 * On the booking forms the card is the two-of-three form column while the tab
 * row spans the whole grid, so the last tab used to hang out over the summary
 * column with no card under it. The width is that column's: two of three
 * tracks plus the gap between them, which for `grid-cols-3 gap-6` works out as
 * `2/3 - g/3`, i.e. 0.5rem off two thirds.
 */
export const TAB_STRIP_FORM_COLUMN = 'min-w-0 lg:max-w-[calc(66.6667%-0.5rem)]';

/** The part of a tab that gives way first: its label shortens, the tab stays. */
export const TAB_LABEL = 'min-w-0 truncate';

export const TabActionGroup: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [compact, setCompact] = React.useState(false);
  // Width with labels showing — the number that decides. Cached the moment we
  // measure expanded and NEVER refreshed while collapsed: re-reading the
  // collapsed width would make the group conclude it fits, expand, overflow,
  // collapse — a visible flicker loop.
  const fullWidth = React.useRef(0);
  const compactRef = React.useRef(false);

  React.useLayoutEffect(() => {
    const el = ref.current;
    const row = el?.parentElement;
    if (!el || !row) return;

    const measure = () => {
      if (!compactRef.current) fullWidth.current = el.offsetWidth;
      const tabs = Array.from(row.children).find((c) => c !== el);
      if (!tabs) return;
      // Natural tab width: rendered width plus whatever truncation clipped.
      // The clipping happens on the label (TAB_LABEL), which may sit inside
      // other spans — measuring the wrong one would read zero and conclude
      // everything already fits.
      let natural = 0;
      for (const b of Array.from(tabs.children) as HTMLElement[]) {
        const label = b.querySelector<HTMLElement>('[data-tab-label]') ?? b.querySelector('span');
        natural += b.offsetWidth + (label ? label.scrollWidth - label.clientWidth : 0);
      }
      // A little slack on the way back out, so a borderline width settles
      // instead of trembling on the threshold.
      const needed = natural + fullWidth.current + 16;
      const next = compactRef.current ? needed + 24 > row.clientWidth : needed > row.clientWidth;
      if (next !== compactRef.current) {
        compactRef.current = next;
        setCompact(next);
      }
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
      data-compact={compact ? 'true' : undefined}
      className={cn(
        'group/tab-actions flex shrink-0 items-center gap-2',
        // Once the labels are gone these are icon-only buttons, so they take
        // the icon-only shape: square. Applied here rather than per button so
        // every control in the row obeys it — same rule as Button's `iconOnly`,
        // in CSS because the state is responsive. See ICON_ONLY_BUTTON.
        compact && '[&_button]:aspect-square [&_button]:px-0 [&_button]:gap-0',
        className,
      )}
    >
      {children}
    </div>
  );
};
