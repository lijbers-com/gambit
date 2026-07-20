import * as React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { SearchInput } from './search-input';

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
  label?: string | null;
  placeholder?: string;
  /** Leading icon for the search field. Defaults to a magnifier. */
  icon?: React.ReactNode;
  /** Single-select: choosing an option replaces the current selection. */
  multiple?: boolean;
  /** When set, the field is disabled and this muted hint is shown instead of results (e.g. "pick a channel first"). */
  disabledHint?: string;
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
  className,
}) => {
  const [search, setSearch] = React.useState('');
  const [showResults, setShowResults] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const results = options.filter(
    (o) => !value.includes(o.value) && o.label.toLowerCase().includes(search.toLowerCase()),
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
          <div className="flex h-9 w-full items-center rounded-md border border-dashed border-input bg-muted/40 px-3 text-sm text-muted-foreground">
            {disabledHint}
          </div>
        ) : (
          <>
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
            {showResults && (
              <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md border bg-white shadow-lg">
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
            <div key={option.value} className="flex items-center justify-between gap-3 rounded-md border bg-muted/40 p-2">
              <div className="min-w-0">
                <div className="text-sm font-medium">{option.label}</div>
                {option.description && <div className="text-xs text-muted-foreground">{option.description}</div>}
              </div>
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
          ))}
        </div>
      )}
    </div>
  );
};
