import * as React from "react";
import { Filter, FilterOption } from "./filter";
import { SearchInput } from "./search-input";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./dropdown-menu";
import { BarChart3, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterBarFilter {
  name: string;
  options: FilterOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  customInput?: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: 'text' | 'number';
  };
  /** Force the search field in the popover even when options is small. */
  forceSearch?: boolean;
}

/** A single view option for the FilterBar's view-switcher dropdown. */
export interface FilterBarViewOption {
  value: string;
  label: string;
  disabled?: boolean;
  /** Optional leading icon rendered before the label so each metric has a
   *  distinct visual identity (eye for impressions, euro for revenue,
   *  percent for fill rate, etc.). Pass any lucide-react component or
   *  matching shape. */
  icon?: React.ComponentType<{ className?: string; size?: number }>;
}

export interface FilterBarProps {
  filters: FilterBarFilter[];
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  className?: string;
  searchPlaceholder?: string;
  hideSearch?: boolean;
  /** When provided, a "view" dropdown appears to the right of the search
   *  input, showing the active view + an icon. Used by the booking
   *  calendars to switch between Impressions / Fill Rate / Bookings /
   *  Revenue / etc. instead of an above-table tab strip. */
  viewOptions?: FilterBarViewOption[];
  activeView?: string;
  onViewChange?: (value: string) => void;
  /** Optional icon for the view dropdown. Defaults to BarChart3. */
  viewIcon?: React.ComponentType<{ className?: string; size?: number }>;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  searchValue = "",
  onSearchChange = () => {},
  className,
  searchPlaceholder = "Search...",
  hideSearch = false,
  viewOptions,
  activeView,
  onViewChange,
  viewIcon: ViewIcon = BarChart3,
}) => {
  const activeOption = viewOptions?.find((o) => o.value === activeView);
  const showViewDropdown = !!viewOptions && viewOptions.length > 0;
  // Prefer the active option's own icon (so the trigger shows €€€ for
  // Revenue, eye for Impressions, etc.). Falls back to the explicit
  // viewIcon prop, then to BarChart3 from the default.
  const TriggerIcon = activeOption?.icon ?? ViewIcon;

  return (
    <div className={cn("flex items-center gap-3 w-full", className)}>
      <div className="flex items-center gap-3">
        {filters.map((filter) => (
          <Filter
            key={filter.name}
            name={filter.name}
            options={filter.options}
            selectedValues={filter.selectedValues}
            onChange={filter.onChange}
            customInput={filter.customInput}
            forceSearch={filter.forceSearch}
          />
        ))}
      </div>
      {(!hideSearch || showViewDropdown) && (
        <>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            {!hideSearch && (
              <div className="w-[300px]">
                <SearchInput
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={searchPlaceholder}
                />
              </div>
            )}
            {showViewDropdown && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 gap-2 px-3 font-medium"
                    aria-label="Switch view"
                  >
                    <TriggerIcon className="h-4 w-4 text-muted-foreground" size={16} />
                    <span className="whitespace-nowrap">
                      {activeOption?.label ?? "View"}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[200px]">
                  {viewOptions!.map((opt) => {
                    const isActive = opt.value === activeView;
                    const OptIcon = opt.icon;
                    return (
                      <DropdownMenuItem
                        key={opt.value}
                        disabled={opt.disabled}
                        onSelect={() => onViewChange?.(opt.value)}
                        className="flex items-center gap-2"
                      >
                        {OptIcon && (
                          <OptIcon
                            className={cn(
                              "h-4 w-4 shrink-0",
                              isActive ? "text-foreground" : "text-muted-foreground"
                            )}
                            size={16}
                          />
                        )}
                        <span className={cn("flex-1", isActive && "font-medium")}>
                          {opt.label}
                        </span>
                        <Check
                          className={cn(
                            "h-4 w-4 shrink-0 text-foreground",
                            isActive ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </>
      )}
    </div>
  );
};
