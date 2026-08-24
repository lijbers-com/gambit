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
 * Layout is a wrapping flex row: items sit side by side and fold on narrow
 * screens; a `fullWidth` item (a split bar, a progress strip) takes its own
 * row at the end.
 */
export const ControlBar: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  // gap-x-4, not 6 — the bar holds several things and the tighter gap is what
  // lets them share one row on a laptop; wrapping stays the fallback.
  <section className={cn('flex flex-wrap items-end gap-x-4 gap-y-3 rounded-xl border border-border p-4', className)}>
    {children}
  </section>
);

export const ControlBarItem: React.FC<{
  label: string;
  children: React.ReactNode;
  /** Take a full row at the end of the bar — for bars and strips. */
  fullWidth?: boolean;
  className?: string;
}> = ({ label, children, fullWidth, className }) => (
  <div className={cn('space-y-2', fullWidth && 'order-last w-full basis-full', className)}>
    <Label className="block">{label}</Label>
    {children}
  </div>
);
