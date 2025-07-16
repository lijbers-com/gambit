import * as React from 'react';
import { X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Popover, PopoverTrigger, PopoverContent } from './popover';
import { Checkbox } from './checkbox';

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterProps {
  name: string;
  options?: FilterOption[];
  selectedValues?: string[];
  onChange?: (values: string[]) => void;
  className?: string;
}

export const Filter: React.FC<FilterProps> = ({
  name,
  options = [],
  selectedValues = [],
  onChange,
  className,
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
      <PopoverContent align="start" className="p-0 w-72 min-w-[220px] max-w-[400px]">
        {showSearch && (
          <div className="sticky top-0 z-10 bg-white px-3 pt-3 pb-2">
            <div className="relative flex items-center">
              <span className="absolute left-3 text-muted-foreground">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search..."
                className="h-9 pl-9 pr-3 w-full rounded-md bg-muted/30 text-base shadow-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm border-0"
                style={{ boxShadow: 'none' }}
              />
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
                  "flex items-center gap-3 rounded-md px-2 py-1.5 text-sm cursor-pointer transition-colors hover:bg-accent select-none"
                )}
                tabIndex={0}
              >
                <Checkbox
                  checked={selectedValues.includes(opt.value)}
                  onCheckedChange={() => handleToggle(opt.value)}
                  tabIndex={-1}
                />
                <span className="truncate">{opt.label}</span>
              </label>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}; 