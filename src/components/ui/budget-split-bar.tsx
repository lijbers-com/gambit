'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { BudgetSegment, OPEN_BUDGET_FILL } from './card';
import type { PatternKey } from '@/lib/proposition-patterns';

/**
 * The plan's budget bar, with the lines between the campaigns draggable:
 * pull a line and budget moves from one campaign to its neighbour — or, on
 * the last line, between the last campaign and the open budget. The same
 * bar the plan card draws (each allocation in its proposition's tint and
 * pattern, the open budget the bare track), so what is split here is what
 * the card shows afterwards.
 */

export interface BudgetSplitSegment {
  id: string;
  name: string;
  budget: number;
  engine?: PatternKey;
  color?: string;
}

export interface BudgetSplitBarProps {
  /** The plan's own budget — what the bar is scaled to. */
  total: number;
  segments: BudgetSplitSegment[];
  /** The budgets after a drag, keyed by segment id — only the two that moved. */
  onChange: (next: Record<string, number>) => void;
  /** Amounts snap to this while dragging (€50 by default). */
  step?: number;
  /** A line under the bar saying how it works, shown until the first drag. */
  hint?: string;
  className?: string;
}

const fmt = (n: number) => `€${Math.round(n).toLocaleString()}`;

export const BudgetSplitBar: React.FC<BudgetSplitBarProps> = ({ total, segments, onChange, step = 50, hint = 'Drag a line to move budget between campaigns, or the last line to leave some open.', className }) => {
  const barRef = React.useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = React.useState<number | null>(null);
  // The bar's width in pixels, so a figure only shows where it fits.
  const [barWidth, setBarWidth] = React.useState(0);
  React.useLayoutEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const measure = () => setBarWidth(bar.getBoundingClientRect().width);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(bar);
    return () => ro.disconnect();
  }, []);
  const fits = (n: number, px: number) => barWidth > 0 && (n / scale) * barWidth >= px;
  const [touched, setTouched] = React.useState(false);
  const drag = React.useRef<{ index: number; startX: number; left: number; right: number; width: number } | null>(null);

  const allocated = segments.reduce((s, seg) => s + seg.budget, 0);
  const scale = Math.max(total, allocated, 1);
  const open = Math.max(total - allocated, 0);
  const pct = (n: number) => (n / scale) * 100;

  // Where each line sits: after every segment — the last one against the
  // open budget (or the bar's end when the budget is fully given out).
  const bounds: number[] = [];
  let acc = 0;
  for (const seg of segments) { acc += seg.budget; bounds.push(acc); }

  const onPointerDown = (index: number) => (e: React.PointerEvent<HTMLDivElement>) => {
    const bar = barRef.current;
    if (!bar) return;
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const left = segments[index].budget;
    const right = index + 1 < segments.length ? segments[index + 1].budget : open;
    drag.current = { index, startX: e.clientX, left, right, width: bar.getBoundingClientRect().width };
    setDragging(index);
    setTouched(true);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const delta = Math.round(((e.clientX - d.startX) / d.width) * scale / step) * step;
    const left = Math.max(0, Math.min(d.left + d.right, d.left + delta));
    const right = d.left + d.right - left;
    const next: Record<string, number> = { [segments[d.index].id]: left };
    if (d.index + 1 < segments.length) next[segments[d.index + 1].id] = right;
    onChange(next);
  };
  const onPointerUp = () => { drag.current = null; setDragging(null); };

  /** Keyboard: one step per arrow press, the same move as a drag. */
  const onKeyDown = (index: number) => (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const leftNow = segments[index].budget;
    const rightNow = index + 1 < segments.length ? segments[index + 1].budget : open;
    const delta = e.key === 'ArrowRight' ? step : -step;
    const left = Math.max(0, Math.min(leftNow + rightNow, leftNow + delta));
    const right = leftNow + rightNow - left;
    const next: Record<string, number> = { [segments[index].id]: left };
    if (index + 1 < segments.length) next[segments[index + 1].id] = right;
    onChange(next);
    setTouched(true);
  };

  return (
    <div className={cn('space-y-1.5', className)}>
      <div
        ref={barRef}
        className={cn('relative flex h-8 select-none overflow-visible rounded-full border border-border bg-background', dragging !== null && 'cursor-col-resize')}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* The fills, clipped to the pill; the handles sit above, unclipped,
            so their grips can stand proud of the bar. */}
        <div className="absolute inset-0 flex overflow-hidden rounded-full">
          {segments.map((seg, i) => (
            <BudgetSegment key={seg.id} widthPct={pct(seg.budget)} color={seg.color ?? 'hsl(var(--chart-500))'} engine={seg.engine} />
          ))}
          <div className="flex-1" style={OPEN_BUDGET_FILL} />
        </div>

        {/* The figures, one per segment wide enough to hold one, and the open
            budget at the end. */}
        <div className="pointer-events-none absolute inset-0 flex">
          {segments.map((seg) => (
            <div key={`${seg.id}-label`} className="flex items-center justify-center overflow-hidden" style={{ width: `${pct(seg.budget)}%` }}>
              {fits(seg.budget, 64) && <Badge className="bg-background tabular-nums">{fmt(seg.budget)}</Badge>}
            </div>
          ))}
          {open > 0 && (
            <div className="flex flex-1 items-center justify-end overflow-hidden pr-1">
              {fits(open, 96) && <Badge className="bg-background tabular-nums">{fmt(open)} open</Badge>}
            </div>
          )}
        </div>

        {/* The lines. Each is the boundary it moves: between two campaigns,
            or between the last campaign and what is still open. */}
        {segments.map((seg, i) => {
          const isLast = i === segments.length - 1;
          if (isLast && open <= 0 && total <= allocated) return (
            <div
              key={`${seg.id}-handle`}
              role="slider"
              tabIndex={0}
              aria-label={`Budget line after ${seg.name}`}
              aria-valuemin={0}
              aria-valuemax={Math.round(seg.budget)}
              aria-valuenow={Math.round(seg.budget)}
              onKeyDown={onKeyDown(i)}
              onPointerDown={onPointerDown(i)}
              className={cn('group absolute -top-1 -bottom-1 z-10 w-4 -translate-x-1/2 cursor-col-resize touch-none focus:outline-none', dragging === i && 'z-20')}
              style={{ left: `${Math.min(pct(bounds[i]), 100)}%` }}
            >
              <span className={cn('absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 rounded-full bg-foreground/70 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100', dragging === i && 'opacity-100')} />
            </div>
          );
          return (
            <div
              key={`${seg.id}-handle`}
              role="slider"
              tabIndex={0}
              aria-label={isLast ? `Budget line between ${seg.name} and open budget` : `Budget line between ${seg.name} and ${segments[i + 1].name}`}
              aria-valuemin={0}
              aria-valuemax={Math.round(seg.budget + (isLast ? open : segments[i + 1].budget))}
              aria-valuenow={Math.round(seg.budget)}
              onKeyDown={onKeyDown(i)}
              onPointerDown={onPointerDown(i)}
              className={cn('group absolute -top-1 -bottom-1 z-10 w-4 -translate-x-1/2 cursor-col-resize touch-none focus:outline-none', dragging === i && 'z-20')}
              style={{ left: `${pct(bounds[i])}%` }}
            >
              {/* The line itself, and a grip that shows on hover, focus and drag. */}
              <span className="absolute inset-y-1 left-1/2 w-0.5 -translate-x-1/2 rounded-full bg-background shadow-[0_0_0_1px_rgba(0,0,0,0.25)]" />
              <span className={cn('absolute left-1/2 top-1/2 h-4 w-2 -translate-x-1/2 -translate-y-1/2 rounded-sm border border-border bg-background shadow-sm transition-opacity', dragging === i ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100')} />
            </div>
          );
        })}
      </div>
      {hint && !touched && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
};
