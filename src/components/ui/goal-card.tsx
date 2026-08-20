import * as React from 'react';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

export interface GoalCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  selected?: boolean;
  onClick?: () => void;
  /** Display only — renders the chosen goal without hover, cursor or focus
   *  affordances, for forms where the goal is fixed. */
  readOnly?: boolean;
  /** The KPIs this goal is judged on — and nothing else. Spelled out on the
   *  card so the trade-off is part of choosing, not a surprise later. */
  kpis?: string[];
  /** KPIs the user has since chosen — their chips light up so the card shows
   *  which of its promises the plan is actually being judged on. */
  highlightKpis?: string[];
  className?: string;
}

/**
 * Selectable goal card — icon, title and description.
 *
 * Styled as the same card a SearchSelectList shows for a selected option
 * (`rounded-md border bg-surface-selected p-3`, title at text-sm/medium, description at
 * text-xs/muted), so a chosen goal sits alongside a chosen objective or KPI
 * without looking like a different kind of thing. Used by the create-media-plan
 * wizard and the media-plan details form.
 */
export const GoalCard: React.FC<GoalCardProps> = ({ icon, title, description, selected, onClick, readOnly, kpis, highlightKpis, className }) => {
  // Read-only renders a div: a button that cannot do anything still shows a
  // pointer and a hover state, which reads as "click me" and then disappoints.
  const Tag = readOnly ? 'div' : 'button';
  /**
   * Exact matches only. Substring matching lit up every chip that merely
   * contained the chosen KPI's words — picking "Top-of-mind awareness" also
   * highlighted "Unaided brand/product awareness" and "Aided brand/product
   * awareness", so three KPIs looked chosen when only one can be.
   */
  const chosenSet = new Set(highlightKpis ?? []);
  const isChosenKpi = (k: string) => chosenSet.has(k);

  // Cap the badge list, but never hide a KPI the user has actually chosen.
  const MAX_KPI_BADGES = 6;
  const orderedKpis = (kpis ?? []).slice().sort(
    (a, b) => (isChosenKpi(a) ? 0 : 1) - (isChosenKpi(b) ? 0 : 1),
  );
  const visibleKpis = orderedKpis.slice(0, MAX_KPI_BADGES);
  const hiddenKpis = orderedKpis.slice(MAX_KPI_BADGES);

  return (
    <Tag
      {...(readOnly ? {} : { type: 'button' as const, onClick })}
      className={cn(
        // The icon is sized here rather than by the caller, so goals stay
        // consistent however the icon was passed in.
        'flex h-full w-full flex-col rounded-md border p-3 text-left transition-colors [&_svg]:h-4 [&_svg]:w-4',
        !readOnly && 'cursor-pointer hover:bg-surface-hover',
        selected ? 'border-surface-selected-border bg-surface-selected' : 'border-border bg-background',
        // Once one goal is chosen the rest step back — still readable, still
        // clickable, but no longer competing with the choice already made.
        className,
      )}
    >
      {/* Title line — icon and title centred together, description beneath. */}
      <div className="flex items-center gap-2">
        <span className={cn('shrink-0', selected ? 'text-foreground' : 'text-muted-foreground')}>{icon}</span>
        <span className="min-w-0 truncate text-sm font-medium">{title}</span>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{description}</p>
      {kpis && kpis.length > 0 && (
        <div className="mt-2">
          <span className="mb-1.5 flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
            Focus KPIs:
            {/* What "focus" means has to be said, or the list reads as
                everything that will be reported. */}
            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    role="img"
                    aria-label="What are focus KPIs?"
                    className="inline-flex cursor-help"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Info className="h-3 w-3" />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[260px]">
                  These are the KPIs this goal is steered and judged on. Other metrics are still measured and reported, but the plan optimises for these — not for them.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </span>
          {/* Own row, so the label reads as a heading rather than the first
              item in the list. Long frameworks are capped — the card names
              what the goal is judged on, it is not the KPI reference. */}
          <span className="flex flex-wrap gap-1">
          {visibleKpis.map((k) => {
            const chosen = isChosenKpi(k);
            return (
              <span
                key={k}
                className={cn(
                  'rounded-full border px-1.5 py-0.5 text-[11px]',
                  chosen
                    ? 'border-primary/30 bg-primary/10 font-medium text-primary'
                    : 'border-border bg-background text-muted-foreground',
                )}
              >
                {k}
              </span>
            );
          })}
          {hiddenKpis.length > 0 && (
            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    className="cursor-help rounded-full border border-dashed border-border px-1.5 py-0.5 text-[11px] text-muted-foreground"
                    onClick={(e) => e.stopPropagation()}
                  >
                    +{hiddenKpis.length} more
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[260px]">
                  {hiddenKpis.join(' · ')}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          </span>
        </div>
      )}
    </Tag>
  );
};
