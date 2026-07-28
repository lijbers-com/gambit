import * as React from 'react';
import { WalletCards, Rows3, LayoutList } from 'lucide-react';
import { cn } from '@/lib/utils';

export type PlanLevel = 'media-plan' | 'campaign' | 'booking';

const STEPS: { key: PlanLevel; Icon: typeof WalletCards; label: string }[] = [
  { key: 'media-plan', Icon: WalletCards, label: 'Media plan' },
  { key: 'campaign', Icon: Rows3, label: 'Campaign' },
  { key: 'booking', Icon: LayoutList, label: 'Booking' },
];

/**
 * Header indicator that shows where the user is in the Media plan → Campaign →
 * Booking hierarchy. The level icons (matching the side-nav icons) are rendered
 * as an overlapping stack — one layer per level from the top down to the current
 * one, with the current level highlighted and sitting on top. Levels below the
 * current one aren't shown (e.g. a campaign view stacks Media plan + Campaign,
 * without Booking). Used as the page header's `titleIcon`.
 */
export const HierarchyBadge: React.FC<{ level: PlanLevel; className?: string }> = ({ level, className }) => {
  const currentIndex = Math.max(0, STEPS.findIndex((s) => s.key === level));
  const visible = STEPS.slice(0, currentIndex + 1);
  return (
    <span className={cn('inline-flex items-center', className)} aria-label={`Level: ${STEPS[currentIndex]?.label}`}>
      {visible.map((step, i) => {
        const last = visible.length - 1;
        const fromTop = last - i; // 0 = active/top layer
        return (
          <span
            key={step.key}
            title={step.label}
            style={{ zIndex: i + 1 }}
            className={cn(
              'relative inline-flex h-8 w-8 items-center justify-center rounded-md border transition-colors',
              i > 0 && '-ml-3.5',
              fromTop === 0
                // Current level, on top.
                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                : fromTop === 1
                  // The layer directly under the active one — a mid shade.
                  ? 'bg-muted text-muted-foreground border-border'
                  // Only present with three levels: blends into the background.
                  : 'bg-transparent text-muted-foreground border-border',
            )}
          >
            <step.Icon className="h-4 w-4" />
          </span>
        );
      })}
    </span>
  );
};
