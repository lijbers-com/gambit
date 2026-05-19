"use client"

import * as React from "react"
import { ChevronDown, Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

export interface SearchableSelectOption {
  label: string
  value: string
  description?: string
}

export interface SearchableSelectProps {
  options: SearchableSelectOption[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  className?: string
  /** Disable the always-on search input — falls back to a plain list. */
  hideSearch?: boolean
}

/**
 * Single-select dropdown with a search field on top, intended for pickers
 * where the list can grow long (e.g. media plans, advertisers). Trigger
 * styling mirrors <Input dropdown> so it slots into forms without visual
 * drift.
 */
export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  className,
  hideSearch = false,
}) => {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const selected = options.find((opt) => opt.value === value)

  const filtered = hideSearch || !search
    ? options
    : options.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase())
      )

  const handleSelect = (next: string) => {
    onChange(next)
    setOpen(false)
    setSearch("")
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setSearch("")
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          className={cn(
            "flex h-9 w-full items-center rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
        >
          <span
            className={cn(
              "flex-1 truncate flex items-center h-full",
              !selected && "text-muted-foreground"
            )}
          >
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDown className="w-4 h-4 ml-2 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={4}
        className="p-0 w-[var(--radix-popover-trigger-width)] min-w-[260px]"
      >
        {!hideSearch && (
          <div className="sticky top-0 z-10 bg-white">
            <div className="relative flex items-center border-b border-border">
              <span className="absolute left-3 text-muted-foreground">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="pl-9 pr-3 py-3 w-full rounded-none bg-muted/30 text-base shadow-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm border-0"
                style={{ boxShadow: "none" }}
              />
            </div>
          </div>
        )}
        <div className="max-h-72 overflow-y-auto p-1">
          {filtered.length === 0 ? (
            <div className="px-4 py-6 text-center text-muted-foreground text-sm">
              No results
            </div>
          ) : (
            filtered.map((opt) => (
              <button
                type="button"
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={cn(
                  "w-full text-left rounded-md px-3 py-2 mb-0.5 text-sm transition-colors hover:bg-accent focus:bg-accent focus:outline-none",
                  opt.value === value && "bg-accent font-medium"
                )}
              >
                <span className="block truncate">{opt.label}</span>
                {opt.description && (
                  <span className="block text-xs text-muted-foreground">
                    {opt.description}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
