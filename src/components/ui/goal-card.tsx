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

  // Chosen KPI first, so it is always inside the visible rows.
  const orderedKpis = (kpis ?? []).slice().sort(
    (a, b) => (isChosenKpi(a) ? 0 : 1) - (isChosenKpi(b) ? 0 : 1),
  );

  /**
   * Two rows of badges, then the rest on request. Clamped by height rather
   * than by count: the names run from "CLV" to "Unaided brand/product
   * awareness", so any fixed number of badges is three lines on one card and
   * one line on another.
   */
  const [kpisExpanded, setKpisExpanded] = React.useState(false);
  const kpiListRef = React.useRef<HTMLSpanElement>(null);
  /**
   * Two rows, fixed from the first paint. Measuring a rendered badge meant
   * the list drew at full height for one frame before the clamp landed, and
   * anything sizing itself off this card caught that taller frame. A badge is
   * a known height instead — `leading-4` (16px) + py-0.5 + the border = 22px —
   * so two of them plus one 4px gap is 48px, and the clamp is right
   * immediately.
   */
  const KPI_CLAMP_HEIGHT = 48;
  const [hiddenCount, setHiddenCount] = React.useState(0);
  React.useEffect(() => {
    const el = kpiListRef.current;
    if (!el || kpisExpanded) return;
    const check = () => {
      const cutoff = el.getBoundingClientRect().top + KPI_CLAMP_HEIGHT;
      setHiddenCount(
        Array.from(el.children).filter((child) => child.getBoundingClientRect().top >= cutoff - 2).length,
      );
    };
    check();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [orderedKpis.length, kpisExpanded]);

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
      {/* Title line — icon and title centred together, description beneath.
          The info sits here, on the choice itself: what picking a goal (and
          then an objective and a KPI) actually commits the plan to. */}
      <div className="flex items-center gap-2">
        <span className={cn('shrink-0', selected ? 'text-foreground' : 'text-muted-foreground')}>{icon}</span>
        <span className="min-w-0 truncate text-sm font-medium">{title}</span>
        <TooltipProvider delayDuration={150}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                role="img"
                aria-label="What does choosing this mean?"
                className="inline-flex shrink-0 cursor-help text-muted-foreground"
                onClick={(e) => e.stopPropagation()}
              >
                <Info className="h-3.5 w-3.5" />
              </span>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-[280px]">
              The goal, objective and KPI you choose are what the plan is steered and judged on. Everything else is still measured and reported, but the plan optimises for this choice — not for the goals, objectives and KPIs you did not pick.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{description}</p>
      {kpis && kpis.length > 0 && (
        <div className="mt-2">
          <span className="mb-1.5 flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
            Focus KPIs:
          </span>
          {/* Own row, so the label reads as a heading rather than the first
              item in the list. Long frameworks are capped — the card names
              what the goal is judged on, it is not the KPI reference. */}
          <span
            ref={kpiListRef}
            className="flex flex-wrap gap-1 overflow-hidden"
            style={{ maxHeight: kpisExpanded ? undefined : KPI_CLAMP_HEIGHT }}
          >
          {orderedKpis.map((k) => {
            const chosen = isChosenKpi(k);
            return (
              <span
                key={k}
                className={cn(
                  'rounded-full border px-1.5 py-0.5 text-[11px] leading-4',
                  chosen
                    ? 'border-primary/30 bg-primary/10 font-medium text-primary'
                    : 'border-border bg-background text-muted-foreground',
                )}
              >
                {k}
              </span>
            );
          })}
          </span>
          {(hiddenCount > 0 || kpisExpanded) && (
            <span
              role="button"
              tabIndex={0}
              // A span, not a button: this card is itself a button, and a
              // button inside one is invalid and un-clickable. It wears the
              // badge's own shape — dashed, so it reads as the way into the
              // rest of the list rather than as another KPI.
              onClick={(e) => { e.stopPropagation(); setKpisExpanded((v) => !v); }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); setKpisExpanded((v) => !v); }
              }}
              className="mt-1 inline-block cursor-pointer rounded-full border border-border bg-background px-1.5 py-0.5 text-[11px] leading-4 text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              {kpisExpanded ? 'Show fewer' : `+${hiddenCount} more`}
            </span>
          )}
        </div>
      )}
    </Tag>
  );
};
