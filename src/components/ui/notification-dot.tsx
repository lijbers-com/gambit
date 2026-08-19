'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * The one red count dot, everywhere something is unread — the header bell,
 * tab strips, anywhere else that needs it. One component because the header's
 * dot and a tab's dot were drifting apart (bg-red-500 vs bg-destructive,
 * "9+" vs a plain count), and a reader should never have to wonder whether
 * two different-looking dots mean two different things.
 *
 * Counts cap at 9 with no "+": past nine the exact number no longer changes
 * what the reader does, and the plus was noise on a 16px circle.
 */
export const NotificationDot: React.FC<{ count: number; className?: string }> = ({ count, className }) => {
  if (count <= 0) return null;
  return (
    <span
      className={cn(
        'flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold tabular-nums text-white',
        className,
      )}
    >
      {Math.min(count, 9)}
    </span>
  );
};
