'use client';

import * as React from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Things the platform is offering, next to the things the user has chosen.
 *
 * Suggestions must not look like selections: a selected item is a card with a
 * remove button, so a suggestion is the opposite shape — a dashed outline pill
 * carrying a plus. You add it by clicking it, and it leaves the list the
 * moment it becomes a real selection above.
 *
 * Suggestion sets can be long (a hundred keywords from a product feed), so
 * only the first handful show until the user asks for the rest.
 */
/** A suggestion is a value, optionally with what it is worth: its reach and
 *  how contested it is. */
export interface Suggestion {
  value: string;
  /** e.g. "22K searches" — what taking it is worth. */
  meta?: string;
  /** How contested it is; drives the dot colour. */
  competition?: 'low' | 'medium' | 'high';
}

export interface SuggestionListProps {
  items: (string | Suggestion)[];
  onAdd: (value: string) => void;
  onAddAll?: () => void;
  /** Copy above the pills. */
  label?: string;
  /** How many to show before "Show N more". */
  initialVisible?: number;
  /** Drop the tray and its header — for when the suggestions have their own
   *  section, which already carries the title and the Add all action. */
  bare?: boolean;
  className?: string;
}

/** Contested keywords cost more and win less often, so the level is a colour
 *  rather than a word — it is read at a glance, next to the number. */
export const COMPETITION: Record<'low' | 'medium' | 'high', { label: string; dot: string; text: string }> = {
  low: { label: 'Low', dot: 'bg-success-500', text: 'text-success-700' },
  medium: { label: 'Medium', dot: 'bg-warning-500', text: 'text-warning-700' },
  high: { label: 'High', dot: 'bg-destructive-500', text: 'text-destructive-700' },
};

export const SuggestionList: React.FC<SuggestionListProps> = ({
  items,
  onAdd,
  onAddAll,
  label = 'Suggested for you',
  initialVisible = 8,
  bare,
  className,
}) => {
  const [expanded, setExpanded] = React.useState(false);
  if (items.length === 0) return null;

  const all: Suggestion[] = items.map((i) => (typeof i === 'string' ? { value: i } : i));
  const visible = expanded ? all : all.slice(0, initialVisible);
  const hidden = all.length - visible.length;

  return (
    <div className={cn(!bare && 'rounded-md border border-dashed border-border bg-page p-3', className)}>
      {!bare && (
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5" />
          {label} ({all.length})
        </span>
        {onAddAll && (
          <button
            type="button"
            onClick={onAddAll}
            className="shrink-0 text-xs text-primary underline-offset-2 hover:underline"
          >
            Add all
          </button>
        )}
      </div>
      )}
      <div className="flex flex-wrap gap-1.5">
        {visible.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => onAdd(item.value)}
            className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-muted-foreground/40 bg-background px-2.5 py-1 text-xs text-foreground transition-colors hover:border-primary hover:bg-surface-hover"
          >
            <Plus className="h-3 w-3 text-muted-foreground" />
            {item.value}
            {item.meta && <span className="text-muted-foreground">{item.meta}</span>}
            {item.competition && (
              <span
                title={`${COMPETITION[item.competition].label} competition`}
                className={cn('h-1.5 w-1.5 shrink-0 rounded-full', COMPETITION[item.competition].dot)}
              />
            )}
          </button>
        ))}
        {hidden > 0 && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="rounded-full px-2.5 py-1 text-xs text-primary underline-offset-2 hover:underline"
          >
            Show {hidden} more
          </button>
        )}
        {expanded && all.length > initialVisible && (
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="rounded-full px-2.5 py-1 text-xs text-muted-foreground underline-offset-2 hover:underline"
          >
            Show less
          </button>
        )}
      </div>
    </div>
  );
};
