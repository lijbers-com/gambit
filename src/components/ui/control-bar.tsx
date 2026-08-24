'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Label } from './label';

/**
 * An entity's main controls: the handful of governing facts — budget, run
 * time, state — that sit under the page header and apply to everything below
 * them. It sits ON the page rather than in a card of its own: the fields
 * already carry their own borders, so a box around them only added a second
 * frame and stole the room the page could give them.
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
  <section className={cn('flex flex-wrap items-end gap-x-4 gap-y-3', className)}>
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
