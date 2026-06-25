import * as React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Switch } from './switch';

export type AdviceTone = 'insight' | 'alert' | 'tip' | 'success';

export type Advice = {
  badge: string;
  tone: AdviceTone;
  message: React.ReactNode;
  /** Optional action button rendered under the message (e.g. "Set budget to automatic"). */
  action?: { label: string; onClick: () => void };
};

export const adviceToneClasses: Record<AdviceTone, string> = {
  insight: 'border-border bg-neutral-50 text-neutral-600',
  alert: 'border-amber-200 bg-amber-50 text-amber-700',
  tip: 'border-primary/20 bg-primary/5 text-primary',
  success: 'border-green-200 bg-green-50 text-green-700',
};

export interface OptimisationCardProps {
  assisted: boolean;
  onToggle: (v: boolean) => void;
  /** Advice notifications shown in the card (aim for 2–4). */
  items?: Advice[];
  className?: string;
}

/**
 * "Assisted optimisations" card — an advice feed styled like the notification
 * centre. The toggle lives in its header so it stays reachable even when off.
 * KPIs/metrics belong in the metric row, not here.
 */
export const OptimisationCard: React.FC<OptimisationCardProps> = ({ assisted, onToggle, items = [], className }) => (
  <div className={cn('rounded-lg border p-4 transition-colors', assisted ? 'bg-muted/40' : 'bg-transparent', className)}>
    <div className="mb-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Sparkles className={cn('h-4 w-4', assisted ? 'text-primary' : 'text-muted-foreground')} />
        Assisted optimisations
      </div>
      <Switch checked={assisted} onCheckedChange={onToggle} />
    </div>
    {!assisted ? (
      <p className="text-xs text-muted-foreground">
        Turn on for advice, campaign suggestions and budget optimisation.
      </p>
    ) : items.length === 0 ? (
      <p className="text-xs text-muted-foreground">Advice appears as you make selections.</p>
    ) : (
      <ul className="space-y-1">
        {items.map((a, i) => {
          const body = (
            <p className="text-xs text-muted-foreground">
              <span className={cn('mr-2 inline-flex items-center rounded-full border px-2 py-0.5 align-middle text-[10px] font-medium', adviceToneClasses[a.tone])}>{a.badge}</span>
              {a.message}
              {a.action && (
                <span className="ml-1.5 inline-flex items-center gap-0.5 align-middle font-medium text-primary">
                  {a.action.label}
                  <ArrowRight className="h-3 w-3" />
                </span>
              )}
            </p>
          );
          return a.action ? (
            <li key={i}>
              <button
                type="button"
                onClick={a.action.onClick}
                className="-mx-2 block w-full rounded-md px-2 py-1.5 text-left transition-colors hover:bg-accent/70"
              >
                {body}
              </button>
            </li>
          ) : (
            <li key={i} className="px-0 py-1.5">
              {body}
            </li>
          );
        })}
      </ul>
    )}
  </div>
);
