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
 * Header indicator of where the user is in the Media plan → Campaign →
 * Booking hierarchy: one icon per level from the top down to the current
 * one (matching the side-nav icons), side by side with a chevron between,
 * the current level highlighted. The levels above are links — to the plan
 * or campaign this page belongs to, else to that level's overview — so the
 * badge is also the way back up. Used as the page header's `titleIcon`.
 */
export const HierarchyBadge: React.FC<{
  level: PlanLevel;
  /** Where each level above the current one leads. A level without a link
   *  renders as a plain icon. */
  links?: Partial<Record<PlanLevel, string>>;
  className?: string;
}> = ({ level, links, className }) => {
  const currentIndex = Math.max(0, STEPS.findIndex((s) => s.key === level));
  const visible = STEPS.slice(0, currentIndex + 1);
  return (
    <nav className={cn('inline-flex items-center gap-1', className)} aria-label={`Level: ${STEPS[currentIndex]?.label}`}>
      {visible.map((step, i) => {
        const current = i === visible.length - 1;
        const href = current ? undefined : links?.[step.key];
        const box = cn(
          'inline-flex h-8 w-8 items-center justify-center rounded-md border transition-colors',
          current
            ? 'bg-primary text-primary-foreground border-primary shadow-sm'
            : 'bg-background text-muted-foreground border-border',
          href && 'hover:bg-accent hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        );
        return (
          <React.Fragment key={step.key}>
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />}
            {href ? (
              <a href={href} title={`Go to ${step.label.toLowerCase()}`} className={box}>
                <step.Icon className="h-4 w-4" />
              </a>
            ) : (
              <span title={step.label} className={box} aria-current={current ? 'page' : undefined}>
                <step.Icon className="h-4 w-4" />
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
