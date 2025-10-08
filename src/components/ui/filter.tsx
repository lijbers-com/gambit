import * as React from 'react';
import { X, Search, Store } from 'lucide-react';
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
    type?: 'text' | 'number';
  };
}

export const Filter: React.FC<FilterProps> = ({
  name,
  options = [],
  selectedValues = [],
  onChange,
  className,
  customInput,
}) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const showSearch = options.length > 8;
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
    setOpen(false);
  };

  // Display logic for selected labels
  const selectedLabels = options
    .filter((opt) => selectedValues.includes(opt.value))
    .map((opt) => opt.label);
  let displayLabel = name;
  if (selectedLabels.length === 1) {
    displayLabel = selectedLabels[0];
  } else if (selectedLabels.length === 2) {
    displayLabel = `${selectedLabels[0]}, ${selectedLabels[1]}`;
  } else if (selectedLabels.length > 2) {
    displayLabel = `${selectedLabels[0]}, ${selectedLabels[1]} + ${selectedLabels.length - 2} more`;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            'inline-flex items-center gap-2',
            selectedLabels.length > 0 && 'bg-slate-100',
            className
          )}
          aria-label={name}
        >
          <span className="truncate max-w-[220px]">{displayLabel}</span>
          {selectedValues.length > 0 && (
            <span
              onClick={e => {
                e.stopPropagation();
                handleClear();
              }}
              className="ml-2 flex items-center justify-center rounded-full p-1 hover:bg-slate-200 focus:outline-none"
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
          <div className="sticky top-0 z-10 bg-white border-b border-slate-200">
            <div className="relative flex items-center">
              <span className="absolute left-3 text-muted-foreground">
                <Store className="w-4 h-4" />
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
                <div className="flex-1 space-y-1">
                  <span className="truncate block">{opt.label}</span>
                  {opt.description && (
                    <span className="text-xs text-muted-foreground block">
                      {opt.description}
                    </span>
                  )}
                </div>
              </label>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}; 