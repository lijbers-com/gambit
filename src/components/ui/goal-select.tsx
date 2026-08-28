'use client';

import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Choosing what a plan is for.
 *
 * The goals stack rather than sit in a grid, and only the chosen one is open:
 * an unpicked goal is a single line — its name and what it is for — and the
 * picked one unfolds into the whole framework it commits the plan to. That is
 * the point of the step: the KPIs a goal is judged on (brand, media and
 * sales), the strategies it is steered by, and the propositions that can carry
 * it are what make a goal a choice rather than a word. Folding the others away
 * is what makes room to show all of it.
 */

export interface GoalSelectOption {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  brandKpis: string[];
  mediaKpis: string[];
  salesKpis: string[];
  strategies: string[];
  propositions: { id: string; name: string; icon?: React.ReactNode }[];
}

/** One column of the opened goal — a plain list, so every entry fits. */
const Column: React.FC<{ title: string; empty?: string; children: React.ReactNode; count?: number }> = ({
  title,
  children,
  count,
}) => (
  <div className="min-w-0">
    <div className="mb-1.5 flex items-baseline gap-1.5">
      {/* The heading reads as one: same size as its list, but darker and
          heavier — smaller than the items it introduces read as a footnote. */}
      <span className="text-xs font-semibold text-foreground">{title}</span>
      {count !== undefined && count > 0 && <span className="text-xs text-muted-foreground/70">{count}</span>}
    </div>
    <div className="space-y-1">{children}</div>
  </div>
);

const KpiList: React.FC<{ items: string[]; highlight: Set<string>; empty: string }> = ({ items, highlight, empty }) => {
  if (items.length === 0) return <p className="text-xs italic text-muted-foreground/70">{empty}</p>;
  return (
    <>
      {items.map((k) => (
        <div
          key={k}
          className={cn(
            'flex items-start gap-1.5 text-xs leading-relaxed',
            highlight.has(k) ? 'font-medium text-primary' : 'text-muted-foreground',
          )}
        >
          {highlight.has(k) && <Check className="mt-0.5 h-3 w-3 shrink-0" />}
          <span className="min-w-0">{k}</span>
        </div>
      ))}
    </>
  );
};

export const GoalSelect: React.FC<{
  goals: GoalSelectOption[];
  value: string | null;
  onChange: (id: string) => void;
  /** The KPI the plan is judged on, marked wherever it appears. */
  highlightKpis?: string[];
  /** Rendered inside the open goal, under its framework — the choices the
   *  goal itself asks for (its objective, its KPI) belong to the goal, not to
   *  the page below it. */
  openContent?: React.ReactNode;
  className?: string;
}> = ({ goals, value, onChange, highlightKpis, openContent, className }) => {
  const highlight = new Set(highlightKpis ?? []);
  return (
    <div className={cn('space-y-2', className)}>
      {goals.map((goal) => {
        const open = value === goal.id;
        return (
          <div
            key={goal.id}
            className={cn(
              'rounded-md border transition-colors',
              open ? 'border-surface-selected-border bg-surface-selected' : 'border-border bg-background hover:bg-surface-hover',
            )}
          >
            {/* The whole header is the control — a closed goal is one line. */}
            <button
              type="button"
              onClick={() => onChange(goal.id)}
              aria-pressed={open}
              className="flex w-full items-center gap-3 p-3 text-left [&_svg]:h-4 [&_svg]:w-4"
            >
              <span className={cn('shrink-0', open ? 'text-foreground' : 'text-muted-foreground')}>{goal.icon}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{goal.title}</span>
                <span className={cn('block text-xs text-muted-foreground', !open && 'truncate')}>{goal.description}</span>
              </span>
              {open && (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  {/* Half the dot's width, so the tick sits in it rather than
                      filling it to the edges. */}
                  <Check className="h-2.5 w-2.5" strokeWidth={2.5} />
                </span>
              )}
            </button>

            {open && (
              <div className="space-y-4 border-t border-surface-selected-border px-3 pb-3 pt-3">
                {/* What the goal is judged on — the whole framework, in the
                    three families it is written in. */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <Column title="Brand KPIs" count={goal.brandKpis.length}>
                    <KpiList items={goal.brandKpis} highlight={highlight} empty="None at this stage" />
                  </Column>
                  <Column title="Media KPIs" count={goal.mediaKpis.length}>
                    <KpiList items={goal.mediaKpis} highlight={highlight} empty="None at this stage" />
                  </Column>
                  <Column title="Sales KPIs" count={goal.salesKpis.length}>
                    <KpiList items={goal.salesKpis} highlight={highlight} empty="None at this stage" />
                  </Column>
                </div>
                <div className="grid gap-4 border-t border-surface-selected-border pt-3 sm:grid-cols-2">
                  <Column title="Strategies">
                    {goal.strategies.map((s) => (
                      <div key={s} className="text-xs leading-relaxed text-muted-foreground">{s}</div>
                    ))}
                  </Column>
                  <Column title="Propositions">
                    {goal.propositions.map((p) => (
                      <div key={p.id} className="flex items-center gap-1.5 text-xs leading-relaxed text-muted-foreground [&_svg]:h-3.5 [&_svg]:w-3.5">
                        {p.icon}
                        <span className="min-w-0 truncate">{p.name}</span>
                      </div>
                    ))}
                  </Column>
                </div>
                {openContent && (
                  <div className="space-y-6 border-t border-surface-selected-border pt-4">{openContent}</div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
