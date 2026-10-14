import * as React from 'react';
import { X, Search, Store, Calendar as CalendarIcon, Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Popover, PopoverTrigger, PopoverContent } from './popover';
import { Checkbox } from './checkbox';

export interface FilterOption {
  label: string;
  value: string;
  description?: string;
}

export interface FilterProps {
  name: string;
  options?: FilterOption[];
  selectedValues?: string[];
  onChange?: (values: string[]) => void;
  className?: string;
  customInput?: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: 'text' | 'number' | 'date';
    /** Shown after the value on the chip, so a set threshold reads as
     *  "300 stores" without opening the popover. */
    unit?: string;
  };
  /** How many of each selected option — a booking asks for "Vloersticker ×2".
   *  When given, a selected option gets a stepper and the chip reads "×n". */
  quantities?: Record<string, number>;
  onQuantitiesChange?: (quantities: Record<string, number>) => void;
  /** Force the search field to render even when the option list is short.
   *  Useful for filters whose option set grows over time (e.g. Channel,
   *  Publisher) and where users expect a search box from the first click. */
  forceSearch?: boolean;
  /** Keep the trigger showing the filter `name` instead of the selected
   *  value(s), and hide the inline clear button. Use when the selection is
   *  already surfaced elsewhere (e.g. as cards below the filter row). */
  keepName?: boolean;
}

export const Filter: React.FC<FilterProps> = ({
  name,
  options = [],
  selectedValues = [],
  onChange,
  className,
  customInput,
  forceSearch = false,
  keepName = false,
  quantities,
  onQuantitiesChange,
}) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const showSearch = forceSearch || options.length > 8;
  const filteredOptions = showSearch
    ? options.filter(opt =>
        opt.label.toLowerCase().includes(search.toLowerCase())
      )
    : options;

  const handleToggle = (value: string) => {
    if (!onChange) return;
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const handleClear = () => {
    if (onChange) onChange([]);
    if (customInput?.value) customInput.onChange('');
    setOpen(false);
  };

  const quantityOf = (value: string) => quantities?.[value] ?? 1;
  const setQuantity = (value: string, next: number) => {
    if (!onQuantitiesChange) return;
    onQuantitiesChange({ ...quantities, [value]: Math.min(9, Math.max(1, next)) });
  };

  const selectedLabels = options
    .filter((opt) => selectedValues.includes(opt.value))
    .map((opt) => (quantities ? `${opt.label} ×${quantityOf(opt.value)}` : opt.label));
  let optionsLabel = '';
  if (selectedLabels.length === 1) {
    optionsLabel = selectedLabels[0];
  } else if (selectedLabels.length === 2) {
    optionsLabel = `${selectedLabels[0]}, ${selectedLabels[1]}`;
  } else if (selectedLabels.length > 2) {
    optionsLabel = `${selectedLabels[0]}, ${selectedLabels[1]} + ${selectedLabels.length - 2} more`;
  }
  const inputLabel = customInput?.value
    ? [customInput.value, customInput.unit].filter(Boolean).join(' ')
    : '';
  const isActive = selectedLabels.length > 0 || !!inputLabel;
  const displayLabel = keepName || !isActive
    ? name
    : [inputLabel, optionsLabel].filter(Boolean).join(' · ');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            'inline-flex items-center gap-2',
            // An active filter is a made choice, so it uses the same surface
            // as every other selected thing in a form rather than a brand tint.
            isActive && 'border-foreground/20 bg-surface-selected text-foreground',
            className
          )}
          aria-label={name}
        >
          <span className="truncate max-w-[260px]">{displayLabel}</span>
          {isActive && !keepName && (
            <span
              onClick={e => {
                e.stopPropagation();
                handleClear();
              }}
              className="ml-2 flex items-center justify-center rounded-full p-1 hover:bg-surface-active focus:outline-none"
              tabIndex={0}
              aria-label="Clear filter"
              role="button"
            >
              <X className="w-4 h-4" />
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="p-0 w-96 min-w-[300px] max-w-[500px]">
        {showSearch && (
          <div className="sticky top-0 z-10 bg-white">
            <div className="relative flex items-center">
              <span className="absolute left-3 text-muted-foreground">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search..."
                className="pl-9 pr-3 py-3 w-full rounded-none bg-muted/30 text-base shadow-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm border-0"
                style={{ boxShadow: 'none' }}
              />
            </div>
          </div>
        )}
        {customInput && (
          <div className="sticky top-0 z-10 bg-white border-b border-border">
            <div className="relative flex items-center">
              <span className="absolute left-3 text-muted-foreground">
                {customInput.type === 'date' ? <CalendarIcon className="w-4 h-4" /> : <Store className="w-4 h-4" />}
              </span>
              <input
                type={customInput.type || 'text'}
                value={customInput.value}
                onChange={(e) => customInput.onChange(e.target.value)}
                placeholder={customInput.placeholder}
                className="pl-9 pr-10 py-3 w-full rounded-none bg-muted/30 text-base shadow-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm border-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                style={{ boxShadow: 'none' }}
              />
              {customInput.value && (
                <button
                  type="button"
                  onClick={() => customInput.onChange('')}
                  className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
        {/* A filter that is only its input (a date, a number) has no list
            to show — and no "No results" to apologise for. */}
        {(options.length > 0 || !customInput) && (
        <div className={cn(
          showSearch ? "max-h-96 overflow-y-auto divide-y divide-transparent p-1" : "p-1"
        )}>
          {filteredOptions.length === 0 ? (
            <div className="px-4 py-6 text-center text-muted-foreground text-sm">No results</div>
          ) : (
            filteredOptions.map(opt => (
              <label
                key={opt.value}
                className={cn(
                  "flex items-start gap-3 rounded-md px-2 py-2.5 mb-1 text-sm cursor-pointer transition-colors hover:bg-accent select-none"
                )}
                tabIndex={0}
              >
                <Checkbox
                  checked={selectedValues.includes(opt.value)}
                  onCheckedChange={() => handleToggle(opt.value)}
                  tabIndex={-1}
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <span className="truncate block">{opt.label}</span>
                  {opt.description && (
                    <span className="text-xs text-muted-foreground block">
                      {opt.description}
                    </span>
                  )}
                </div>
                {quantities && selectedValues.includes(opt.value) && (
                  // preventDefault keeps a click on the stepper from toggling
                  // the label's checkbox.
                  <div
                    className="flex shrink-0 items-center gap-1"
                    onClick={(e) => e.preventDefault()}
                  >
                    <button
                      type="button"
                      aria-label={`Fewer ${opt.label}`}
                      disabled={quantityOf(opt.value) <= 1}
                      onClick={() => setQuantity(opt.value, quantityOf(opt.value) - 1)}
                      className="flex h-6 w-6 items-center justify-center rounded-md border border-border hover:bg-surface-hover disabled:opacity-40"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center text-sm tabular-nums">×{quantityOf(opt.value)}</span>
                    <button
                      type="button"
                      aria-label={`More ${opt.label}`}
                      disabled={quantityOf(opt.value) >= 9}
                      onClick={() => setQuantity(opt.value, quantityOf(opt.value) + 1)}
                      className="flex h-6 w-6 items-center justify-center rounded-md border border-border hover:bg-surface-hover disabled:opacity-40"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </label>
            ))
          )}
        </div>
        )}
      </PopoverContent>
    </Popover>
  );
}; 