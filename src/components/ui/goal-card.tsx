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
  /** Another card is selected and this one isn't: tone it down. */
  dimmed?: boolean;
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
export const GoalCard: React.FC<GoalCardProps> = ({ icon, title, description, selected, onClick, readOnly, kpis, highlightKpis, dimmed, className }) => {
  // Read-only renders a div: a button that cannot do anything still shows a
  // pointer and a hover state, which reads as "click me" and then disappoints.
  const Tag = readOnly ? 'div' : 'button';
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
        dimmed && 'opacity-55 hover:opacity-100',
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
        <div className="mt-2 flex flex-wrap items-center gap-1">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
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
          {kpis.map((k) => {
            const chosen = highlightKpis?.some((h) => h === k || h.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(h.toLowerCase()));
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
        </div>
      )}
    </Tag>
  );
};
