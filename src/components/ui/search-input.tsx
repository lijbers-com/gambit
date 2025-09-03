import * as React from "react";
import { Input } from "./input";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onChange, icon, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(value ?? "");
    const isControlled = value !== undefined;
    const inputValue = isControlled ? value : internalValue;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setInternalValue(e.target.value);
      onChange?.(e);
    };

    const handleClear = () => {
      if (!isControlled) setInternalValue("");
      const event = { target: { value: "" } } as React.ChangeEvent<HTMLInputElement>;
      onChange?.(event);
    };

    return (
      <div className={cn("relative flex items-center", className)}>
        <span className="absolute left-3 text-muted-foreground">
          {icon || <Search className="w-4 h-4" />}
        </span>
        <Input
          ref={ref}
          type="search"
          value={inputValue}
          onChange={handleInputChange}
          className="pl-9 pr-9"
          {...props}
        />
        {!!inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 text-muted-foreground hover:text-blue-600 focus:outline-none"
            tabIndex={0}
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }
);
SearchInput.displayName = "SearchInput"; 