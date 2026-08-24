'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Label } from './label';

/**
 * An entity's header: its name, the actions that work on it, and the handful
 * of governing facts — budget, run time, state — that apply to everything
 * below. It sits ON the page rather than in a card of its own: the fields
 * already carry their own borders, so a box around them only added a second
 * frame and stole the room the page could give them.
 *
 * Layout is a wrapping flex row: items sit side by side and fold on narrow
 * screens; a `fullWidth` item (a split bar, a progress strip) takes its own
 * row at the end.
 */
export const ControlBar: React.FC<{
  children: React.ReactNode;
  /** The entity's name. Given one, the card carries the page's title itself —
   *  the standard page header stands down, so the thing and the controls that
   *  govern it are one card instead of two stacked bands. */
  title?: string;
  titleIcon?: React.ReactNode;
  /** Everything that acts on the entity — run state, add, the overflow menu. */
  actions?: React.ReactNode;
  className?: string;
}> = ({ children, title, titleIcon, actions, className }) => (
  <section className={className}>
    {(title || actions) && (
      <div className="mb-5 flex items-start justify-between gap-4">
        <h1 className="flex min-w-0 items-center gap-3 text-3xl font-semibold leading-tight">
          {titleIcon}
          <span className="min-w-0 truncate" title={title}>{title}</span>
        </h1>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
    )}
    {/* gap-x-4, not 6 — the bar holds several things and the tighter gap is
        what lets them share one row on a laptop; wrapping stays the fallback. */}
    <div className="flex flex-wrap items-end gap-x-4 gap-y-3">
      {children}
    </div>
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
