import * as React from 'react';
import { Search, X, ChevronDown, Plus, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { SearchInput } from './search-input';
import { OptionCard } from './option-card';

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
  /** Frame the extra content in its own box. Off by default: extra detail
   *  belongs inside the selected card, not in a card within a card. Turn it
   *  on for something genuinely separate, like a paid add-on. */
  selectedExtraBoxed?: boolean;
  /** Drop the option's description once it is selected — for cards that
   *  summarise what is inside instead of repeating the catalogue blurb. */
  hideSelectedDescription?: boolean;
  /** Let the user add a value that is not in the catalogue — the typed text
   *  appears as the first row, "Add \"…\"". For lists like keywords, where the
   *  options are suggestions rather than the whole world of valid answers. */
  allowCreate?: boolean;
  /** Cap the selected list at this many cards and scroll past them. A long
   *  selection otherwise pushes the rest of the form off the screen. The last
   *  card is cut in half so the list reads as continuing rather than ending. */
  maxVisibleSelected?: number;
  /** Required single choices (pacing): no picker field on top — the selected
   *  card is the whole control, its trailing button a settings glyph that
   *  opens the chooser in place. Remove makes no sense where a value must
   *  always exist, so there is no ×. Implies single-select. */
  settingsPicker?: boolean;
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
  selectedExtraBoxed,
  hideSelectedDescription,
  allowCreate,
  maxVisibleSelected,
  settingsPicker,
  className,
}) => {
  const [search, setSearch] = React.useState('');
  const [showResults, setShowResults] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  /** Only long catalogues get a search field; short ones act as a select. */
  // Typing is the point when values can be created, however short the
  // suggestion list is.
  const searchable = allowCreate || options.length >= SEARCHABLE_THRESHOLD;
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

  /**
   * The cap is a height, not a count: the list scrolls, and the card at the
   * cut is left half-showing so it is obvious there is more below. Card
   * heights differ (a description adds a line), so it is measured rather than
   * guessed.
   */
  const listRef = React.useRef<HTMLDivElement>(null);
  const [rowHeight, setRowHeight] = React.useState<number | null>(null);
  const scrolls = Boolean(maxVisibleSelected && value.length > maxVisibleSelected);
  React.useEffect(() => {
    const first = listRef.current?.firstElementChild as HTMLElement | null;
    if (first) setRowHeight(first.offsetHeight);
  }, [value, scrolls]);
  const SELECTED_GAP = 8; // space-y-2
  const maxListHeight =
    scrolls && rowHeight
      ? (maxVisibleSelected! - 1) * (rowHeight + SELECTED_GAP) + rowHeight / 2
      : undefined;

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

  // A created value has no catalogue entry, so it stands for itself.
  const selected: SearchSelectOption[] = value.map(
    (v) => options.find((o) => o.value === v) ?? { value: v, label: v },
  );

  return (
    <div className={cn('min-w-0 space-y-2', className)}>
      <div className="relative" ref={containerRef}>
        {label !== null && <label className="block text-sm font-medium mb-2">{label}</label>}
        {settingsPicker ? null : disabledHint ? (
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
                onKeyDown={(e) => {
                  if (allowCreate && e.key === 'Enter' && search.trim()) {
                    e.preventDefault();
                    add(results[0]?.value ?? search.trim());
                  }
                }}
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
                {allowCreate && search.trim() && !value.includes(search.trim()) &&
                  !results.some((o) => o.label.toLowerCase() === search.trim().toLowerCase()) && (
                  <div
                    className="cursor-pointer border-b p-3 last:border-b-0 hover:bg-neutral-50"
                    onClick={() => add(search.trim())}
                  >
                    <div className="flex items-center gap-1.5 text-sm font-medium">
                      <Plus className="h-3.5 w-3.5 text-muted-foreground" />
                      Add “{search.trim()}”
                    </div>
                  </div>
                )}
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
                ) : !allowCreate || !search.trim() ? (
                  <div className="p-3 text-center text-sm text-muted-foreground">No matches</div>
                ) : null}
              </div>
            )}
          </>
        )}
      </div>
      {selected.length > 0 && (
        <div
          ref={listRef}
          className={cn('space-y-2', scrolls && 'overflow-y-auto pr-1')}
          style={maxListHeight ? { maxHeight: maxListHeight } : undefined}
        >
          {selected.map((option) => {
            /* One anatomy for every chosen card: header, full-width rule,
               content — the extra renders in the card's body section, never
               ad-hoc under the title. An extra that returns nothing draws no
               rule. */
            const extra = renderSelectedExtra?.(option);
            return (
              <OptionCard
                key={option.value}
                selected
                title={option.label}
                description={hideSelectedDescription ? undefined : option.description}
                control={
                  settingsPicker ? (
                    /* A required choice cannot be removed, only changed — so
                       the control is the way into the chooser, not an ×. */
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowResults((v) => !v)}
                      className="h-8 w-8 shrink-0 p-0"
                      aria-label={typeof label === 'string' ? `Change ${label}` : `Change ${option.label}`}
                    >
                      <Settings2 className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => remove(option.value)}
                      className="h-8 w-8 shrink-0 p-0"
                      aria-label={`Remove ${option.label}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )
                }
              >
                {extra ? (
                  <div className={cn(selectedExtraBoxed && 'rounded-md border border-surface-selected-border bg-surface-selected p-3')}>
                    {extra}
                  </div>
                ) : undefined}
              </OptionCard>
            );
          })}
        </div>
      )}
      {settingsPicker && showResults && (
        <div className="relative">
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
              <div className="p-3 text-center text-sm text-muted-foreground">No other options</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
