'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Label } from './label';

/**
 * An entity's main controls: the handful of governing facts — budget, run
 * time, state — and the actions on the entity itself, sitting under the page
 * header and applying to everything below them. They live HERE rather than in
 * the header, because the header is the same on every page and carries the
 * session's own controls (the date range, the advertiser).
 *
 * Outlined but unfilled: the border says where the panel ends without the
 * white card that made it a second surface on top of the page.
 *
 * ONE ROW, ALWAYS. When the row runs out of width the panel DROPS items
 * rather than wrapping — least important first, in the order its items
 * declare with `dropOrder` — because a control panel folded onto two lines
 * reads as two bands. Nothing is lost by dropping: every fact stated here is
 * also on the entity's own tabs.
 */
export const ControlBar: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  const ref = React.useRef<HTMLElement>(null);
  /** Natural widths, cached while every item is still visible. */
  const widths = React.useRef<number[]>([]);
  const [dropped, setDropped] = React.useState(0);

  const items = React.Children.toArray(children);
  // Which children may be dropped, and in which order.
  const droppable = items
    .map((child, i) => ({
      i,
      order: React.isValidElement(child) ? (child.props as { dropOrder?: number }).dropOrder : undefined,
    }))
    .filter((x): x is { i: number; order: number } => typeof x.order === 'number')
    .sort((a, b) => a.order - b.order)
    .map((x) => x.i);
  const dropKey = droppable.join(',');

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el || droppable.length === 0) return;
    const GAP = 16;
    const measure = () => {
      const kids = Array.from(el.children) as HTMLElement[];
      // Widths are only true while nothing is hidden — cache them then, and
      // measure against the cache to know when the row can grow back.
      const allVisible = kids.every((k) => k.style.display !== 'none');
      if (allVisible) widths.current = kids.map((k) => k.offsetWidth);
      if (widths.current.length !== kids.length) return;
      const style = getComputedStyle(el);
      const avail = el.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      let need = widths.current.reduce((s, w) => s + w, 0) + GAP * (kids.length - 1);
      let d = 0;
      while (need > avail && d < droppable.length) {
        need -= widths.current[droppable[d]] + GAP;
        d += 1;
      }
      setDropped(d);
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length, dropKey, dropped]);

  const hidden = new Set(droppable.slice(0, dropped));

  return (
    // No wrapping: the row sheds rather than folds.
    <section ref={ref} className={cn('flex items-end gap-x-4 overflow-hidden rounded-xl border border-border p-4', className)}>
      {items.map((child, i) => {
        // Each item gets a wrapper so it can be dropped without touching the
        // item itself; an item that asked to be pushed to the end (`ml-auto`)
        // has to say so on the wrapper instead, or the flex row won't hear it.
        const cls = React.isValidElement(child) ? (child.props as { className?: string }).className ?? '' : '';
        return (
          <div
            key={i}
            // shrink-0 so a measured width is the item's REAL width: left to
            // squeeze, the fields would compress to fit and the row would
            // never know it had run out of room.
            className={cn('shrink-0', cls.includes('ml-auto') && 'ml-auto')}
            style={hidden.has(i) ? { display: 'none' } : undefined}
          >
            {child}
          </div>
        );
      })}
    </section>
  );
};

export const ControlBarItem: React.FC<{
  label: string;
  children: React.ReactNode;
  /** Take a full row at the end of the bar — for bars and strips. */
  fullWidth?: boolean;
  /** Lower numbers drop first when the row runs out of width. Leave unset for
   *  the facts that must stay on screen at any width. */
  dropOrder?: number;
  className?: string;
}> = ({ label, children, fullWidth, className }) => (
  <div className={cn('space-y-2', fullWidth && 'order-last w-full basis-full', className)}>
    <Label className="block">{label}</Label>
    {children}
  </div>
);
