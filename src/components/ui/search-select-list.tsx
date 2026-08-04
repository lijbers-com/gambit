import * as React from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { SearchInput } from './search-input';

/** Below this many options the control drops the search field and acts as a
 *  plain select — searching a handful of items is friction, not help. */
const SEARCHABLE_THRESHOLD = 8;

export interface SearchSelectOption {
  value: string;
  label: string;
  /** Optional secondary line shown under the label. */
  description?: string;
}

export interface SearchSelectListProps {
  /** Selected option values (controlled). */
  value: string[];
  onChange: (values: string[]) => void;
  /** The catalogue to search. */
  options: SearchSelectOption[];
  /** Field label. Pass `null` for none. Accepts nodes so callers can add
   *  hints like a muted "(optional)". */
  label?: React.ReactNode | null;
  placeholder?: string;
  /** Leading icon for the search field. Defaults to a magnifier. */
  icon?: React.ReactNode;
  /** Single-select: choosing an option replaces the current selection. */
  multiple?: boolean;
  /** When set, the field is disabled and this muted hint is shown instead of results (e.g. "pick a channel first"). */
  disabledHint?: string;
  /** Optional extra content rendered inside each selected item's card (below the
   *  label) — e.g. an optional brand-lift study toggle under a selected KPI. */
  renderSelectedExtra?: (option: SearchSelectOption) => React.ReactNode;
  className?: string;
}

/**
 * Generic "search → dropdown → selected list below" multi-select. A search
 * field with a results dropdown, and the chosen options rendered as removable
 * rows underneath. The same control is reused wherever this pattern is needed
 * (media product, positions/slots, …) so they look and behave identically.
 */
export const SearchSelectList: React.FC<SearchSelectListProps> = ({
  value,
  onChange,
  options,
  label = null,
  placeholder = 'Search…',
  icon,
  multiple = true,
  disabledHint,
  renderSelectedExtra,
  className,
}) => {
  const [search, setSearch] = React.useState('');
  const [showResults, setShowResults] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  /** Only long catalogues get a search field; short ones act as a select. */
  const searchable = options.length >= SEARCHABLE_THRESHOLD;
  /** "Search KPIs…" → "Select KPIs…" when the field behaves as a select. */
  const selectPlaceholder = placeholder.replace(/^Search\b/i, 'Select');

  const q = search.toLowerCase();
  const results = options.filter(
    (o) =>
      !value.includes(o.value) &&
      (!searchable ||
        o.label.toLowerCase().includes(q) ||
        // The description carries identifiers (a product ID, a code), so it has
        // to be searchable too — people paste the number, not the name.
        (o.description ?? '').toLowerCase().includes(q)),
  );

  const add = (val: string) => {
    onChange(multiple ? (value.includes(val) ? value : [...value, val]) : [val]);
    setSearch('');
    setShowResults(false);
  };
  const remove = (val: string) => onChange(value.filter((v) => v !== val));

  React.useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const selected = value
    .map((v) => options.find((o) => o.value === v))
    .filter(Boolean) as SearchSelectOption[];

  return (
    <div className={cn('min-w-0 space-y-2', className)}>
      <div className="relative" ref={containerRef}>
        {label !== null && <label className="block text-sm font-medium mb-2">{label}</label>}
        {disabledHint ? (
          <div className="flex h-9 w-full items-center rounded-md border border-dashed border-input bg-surface-selected px-3 text-sm text-muted-foreground">
            {disabledHint}
          </div>
        ) : (
          <>
            {/* Short catalogues don't need a search field — they behave like a
                plain select: click to open, pick from the list. */}
            {searchable ? (
              <SearchInput
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowResults(true);
                }}
                onClick={() => setShowResults(true)}
                placeholder={placeholder}
                className="w-full"
                icon={icon ?? <Search className="w-4 h-4" />}
              />
            ) : (
              <button
                type="button"
                onClick={() => setShowResults((v) => !v)}
                className="flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <span className="flex min-w-0 items-center gap-2">
                  {icon}
                  <span className="truncate text-muted-foreground">{selectPlaceholder}</span>
                </span>
                <ChevronDown className={cn('h-4 w-4 shrink-0 text-muted-foreground transition-transform', showResults && 'rotate-180')} />
              </button>
            )}
            {showResults && (
              <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md border bg-card shadow-lg">
                {results.length > 0 ? (
                  results.map((option) => (
                    <div
                      key={option.value}
                      className="cursor-pointer border-b p-3 last:border-b-0 hover:bg-neutral-50"
                      onClick={() => add(option.value)}
                    >
                      <div className="text-sm font-medium">{option.label}</div>
                      {option.description && <div className="text-xs text-muted-foreground">{option.description}</div>}
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-sm text-muted-foreground">No matches</div>
                )}
              </div>
            )}
          </>
        )}
      </div>
      {selected.length > 0 && (
        <div className="space-y-1">
          {selected.map((option) => (
            <div key={option.value} className="rounded-md border border-surface-selected-border bg-surface-selected p-3">
              {/* Title line — vertically centred with the remove button. */}
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 truncate text-sm font-medium">{option.label}</div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => remove(option.value)}
                  className="h-8 w-8 shrink-0 p-0"
                  aria-label={`Remove ${option.label}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {/* Everything else sits underneath, full width. */}
              {option.description && (
                <div className="mt-1 text-xs text-muted-foreground">{option.description}</div>
              )}
              {/* The extra is a separate decision about this option (add a
                  brand-lift study), so it gets its own box rather than running
                  on from the description above it. */}
              {renderSelectedExtra && (
                <div className="mt-3 rounded-md border border-surface-selected-border bg-card p-3">
                  {renderSelectedExtra(option)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
