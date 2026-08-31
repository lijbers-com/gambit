'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Input } from './input';

/**
 * What one placement costs per click.
 *
 * On an auction campaign the bid belongs to the PLACEMENT, not to the booking:
 * a keyword, a category and a location each compete in their own auction and
 * are each worth a different amount. A single booking-level CPC could only ever
 * be an average of prices that are not comparable, so there isn't one — the row
 * sits on each selected placement instead.
 *
 * Shared, because the wizard and the booking form are the same form: one in
 * steps, one on a page. A bid that looked different in the two would be two
 * different questions about the same number.
 */

/** A stable suggested bid per placement — derived from its id, so the same
 *  keyword is always quoted the same price. */
export const suggestedBid = (id: string) => {
  const seed = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return (0.3 + (seed % 50) / 100).toFixed(2);
};

export const BidRow = ({
  id,
  value,
  onChange,
  className,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) => (
  <div className={cn('flex flex-wrap items-center gap-2', className ?? 'mt-2')} onClick={(e) => e.stopPropagation()}>
    <span className="text-xs text-muted-foreground">Bid (CPC)</span>
    <div className="relative w-24">
      <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">€</span>
      <Input
        type="number"
        min="0"
        step="0.05"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-7 pl-6 text-sm tabular-nums"
        placeholder={suggestedBid(id)}
        aria-label={`Bid for ${id}`}
      />
    </div>
    {value !== suggestedBid(id) && (
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-7 text-xs"
        onClick={() => onChange(suggestedBid(id))}
      >
        Use suggested €{suggestedBid(id)}
      </Button>
    )}
  </div>
);
