'use client';

import * as React from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

/**
 * Things the platform is offering, next to the things the user has chosen.
 *
 * Suggestions must not look like selections: a selected item is a full-width
 * card with a remove button, so a suggestion is the opposite shape — a pill
 * carrying a plus. You add it by clicking it, and it leaves the list the
 * moment it becomes a real selection above.
 *
 * Suggestion sets can be long (a hundred keywords from a product feed), so
 * only the first handful show until the user asks for the rest.
 */
/** A suggestion is a value, optionally with what it is worth. */
export interface Suggestion {
  value: string;
  /** e.g. "22K searches" — what taking it is worth. */
  meta?: string;
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
    <div className={cn(!bare && 'rounded-md border border-dashed border-border bg-card p-3', className)}>
      {!bare && (
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-muted-foreground">
          {label} ({all.length})
        </span>
        {/* The same button "Select all" is, in the same corner — taking the
            whole list is one action, wherever the list happens to be. */}
        {onAddAll && (
          <Button variant="outline" size="sm" onClick={onAddAll} className="shrink-0">
            Add all
          </Button>
        )}
      </div>
      )}
      <div className="flex flex-wrap gap-1.5">
        {visible.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => onAdd(item.value)}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-xs text-foreground transition-colors hover:border-primary hover:bg-surface-hover"
          >
            <Plus className="h-3 w-3 text-muted-foreground" />
            {item.value}
            {item.meta && <span className="text-muted-foreground">{item.meta}</span>}
          </button>
        ))}
      </div>
      {/* The way into the rest of the list sits under it, where the eye ends
          up after reading the pills. */}
      {(hidden > 0 || (expanded && all.length > initialVisible)) && (
        <div className="mt-3">
          {hidden > 0 ? (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="text-xs text-primary underline-offset-2 hover:underline"
            >
              Show {hidden} more
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="text-xs text-muted-foreground underline-offset-2 hover:underline"
            >
              Show less
            </button>
          )}
        </div>
      )}
    </div>
  );
};
