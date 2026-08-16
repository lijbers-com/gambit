'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from './input';
import { SearchSelectList, type SearchSelectOption } from './search-select-list';

/**
 * Targeting, everywhere it appears.
 *
 * A booking narrows its audience the same way whatever it is buying: pick a
 * target group — a keyword, a category, a region, a store type — and then say
 * which values inside it. So the group is the selectable option, and the
 * values are chips inside the group's selected card, added by typing or
 * searching. One control instead of a bank of filter dropdowns, and the same
 * one on every proposition.
 */

export interface TargetGroup {
  value: string;
  label: string;
  /** What this group targets, shown under the title once selected. */
  description?: string;
  /** Known values, offered as you type. Free text is allowed regardless — a
   *  postal code list has no catalogue to choose from. */
  suggestions?: string[];
}

/**
 * The chips inside one selected group. Module-level (not nested in a render
 * function) so the input keeps focus while typing.
 */
export const TargetChipEditor: React.FC<{
  chips: string[];
  suggestions: string[];
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
  placeholder?: string;
}> = ({ chips, suggestions, onAdd, onRemove, placeholder = 'Type or search to add…' }) => {
  const [text, setText] = React.useState('');
  const matches = suggestions.filter(
    (s) => s.toLowerCase().includes(text.toLowerCase()) && !chips.includes(s),
  );
  const add = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed || chips.includes(trimmed)) return;
    onAdd(trimmed);
    setText('');
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add(matches[0] ?? text);
            }
          }}
          placeholder={placeholder}
          className="h-8 bg-background text-sm"
        />
        {text && matches.length > 0 && (
          <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-md border bg-card shadow-lg">
            {matches.slice(0, 6).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => add(s)}
                className="block w-full px-3 py-1.5 text-left text-sm hover:bg-surface-hover"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
      {chips.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1.5">
          {chips.map((chip) => (
            <span
              key={chip}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1 text-xs"
            >
              {chip}
              <button
                type="button"
                onClick={() => onRemove(chip)}
                aria-label={`Remove ${chip}`}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export interface TargetSelectProps {
  groups: TargetGroup[];
  /** Which groups are open, and the values chosen inside each. */
  value: Record<string, string[]>;
  onChange: (value: Record<string, string[]>) => void;
  placeholder?: string;
  className?: string;
}

export const TargetSelect: React.FC<TargetSelectProps> = ({
  groups,
  value,
  onChange,
  placeholder = 'Add a target group…',
  className,
}) => {
  const options: SearchSelectOption[] = groups.map((g) => ({
    value: g.value,
    label: g.label,
    description: g.description,
  }));

  return (
    <SearchSelectList
      className={className}
      label={null}
      placeholder={placeholder}
      options={options}
      value={Object.keys(value)}
      onChange={(keys) => {
        // Dropping a group drops the values chosen inside it.
        const next: Record<string, string[]> = {};
        keys.forEach((k) => { next[k] = value[k] ?? []; });
        onChange(next);
      }}
      renderSelectedExtra={(opt) => (
        <TargetChipEditor
          chips={value[opt.value] ?? []}
          suggestions={groups.find((g) => g.value === opt.value)?.suggestions ?? []}
          onAdd={(v) => onChange({ ...value, [opt.value]: [...(value[opt.value] ?? []), v] })}
          onRemove={(v) =>
            onChange({ ...value, [opt.value]: (value[opt.value] ?? []).filter((c) => c !== v) })
          }
        />
      )}
    />
  );
};

/** Total values across every group — for summary lines and counts. */
export const countTargets = (value: Record<string, string[]>): number =>
  Object.values(value).flat().length;
