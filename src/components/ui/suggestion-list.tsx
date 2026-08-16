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
export interface SuggestionListProps {
  items: string[];
  onAdd: (value: string) => void;
  onAddAll?: () => void;
  /** Copy above the pills. */
  label?: string;
  /** How many to show before "Show N more". */
  initialVisible?: number;
  className?: string;
}

export const SuggestionList: React.FC<SuggestionListProps> = ({
  items,
  onAdd,
  onAddAll,
  label = 'Suggested for you',
  initialVisible = 8,
  className,
}) => {
  const [expanded, setExpanded] = React.useState(false);
  if (items.length === 0) return null;

  const visible = expanded ? items : items.slice(0, initialVisible);
  const hidden = items.length - visible.length;

  return (
    <div className={cn('rounded-md border border-dashed border-border bg-page p-3', className)}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5" />
          {label} ({items.length})
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
      <div className="flex flex-wrap gap-1.5">
        {visible.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onAdd(item)}
            className="inline-flex items-center gap-1 rounded-full border border-dashed border-muted-foreground/40 bg-background px-2.5 py-1 text-xs text-foreground transition-colors hover:border-primary hover:bg-surface-hover"
          >
            <Plus className="h-3 w-3 text-muted-foreground" />
            {item}
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
        {expanded && items.length > initialVisible && (
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
