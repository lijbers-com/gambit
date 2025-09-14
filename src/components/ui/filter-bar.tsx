import * as React from "react";
import { Filter, FilterOption } from "./filter";
import { SearchInput } from "./search-input";
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
}

export interface FilterBarProps {
  filters: FilterBarFilter[];
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  className?: string;
  searchPlaceholder?: string;
  hideSearch?: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  searchValue = "",
  onSearchChange = () => {},
  className,
  searchPlaceholder = "Search...",
  hideSearch = false,
}) => {
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
          />
        ))}
      </div>
      {!hideSearch && (
        <>
          <div className="flex-1" />
          <div className="w-[300px]">
            <SearchInput
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
            />
          </div>
        </>
      )}
    </div>
  );
}; 