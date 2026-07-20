import * as React from 'react';
import { WalletCards, Rows3, LayoutList, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export type PlanLevel = 'media-plan' | 'campaign' | 'booking';

const STEPS: { key: PlanLevel; Icon: typeof WalletCards; label: string }[] = [
  { key: 'media-plan', Icon: WalletCards, label: 'Media plan' },
  { key: 'campaign', Icon: Rows3, label: 'Campaign' },
  { key: 'booking', Icon: LayoutList, label: 'Booking' },
];

/**
 * Header indicator that shows where the user is in the Media plan → Campaign →
 * Booking hierarchy. The three level icons (matching the side-nav icons) are
 * shown as a path, with the current level highlighted. Used as the page header's
 * `titleIcon` in place of the proposition icon — the proposition name lives in
 * the title itself.
 */
export const HierarchyBadge: React.FC<{ level: PlanLevel; className?: string }> = ({ level, className }) => (
  <span className={cn('inline-flex items-center gap-1', className)} aria-label={`Level: ${STEPS.find(s => s.key === level)?.label}`}>
    {STEPS.map((step, i) => {
      const active = step.key === level;
      return (
        <React.Fragment key={step.key}>
          {i > 0 && <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/40" />}
          <span
            title={step.label}
            className={cn(
              'inline-flex h-8 w-8 items-center justify-center rounded-md',
              active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground',
            )}
          >
            <step.Icon className="h-4 w-4" />
          </span>
        </React.Fragment>
      );
    })}
  </span>
);
