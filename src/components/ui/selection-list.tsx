"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Switch } from "./switch"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SelectionListItem {
  id: string
  label: string
  meta?: string
  /** Optional image URL shown as a small thumbnail (list variant only) */
  image?: string
}

export interface SelectionListProps {
  items: SelectionListItem[]
  /**
   * `list`   — item row with an × remove button (keywords, retail products)
   * `switch` — item row with a toggle switch (placements, categories)
   */
  variant?: "list" | "switch"
  onRemove?: (id: string) => void
  onToggle?: (id: string, checked: boolean) => void
  className?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

const SelectionList = React.forwardRef<HTMLDivElement, SelectionListProps>(
  ({ items, variant = "list", onRemove, onToggle, className }, ref) => {
    if (items.length === 0) return null

    return (
      <div ref={ref} className={cn("space-y-1", className)}>
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg border bg-background hover:bg-muted/30 transition-colors"
          >
            {variant === "switch" && (
              <Switch
                checked={true}
                onCheckedChange={(checked) => onToggle?.(item.id, checked)}
              />
            )}

            {variant === "list" && item.image && (
              <div className="flex-shrink-0 w-9 h-9 rounded-md overflow-hidden">
                <img
                  src={item.image}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <span className="text-sm font-medium flex-1 min-w-0 truncate">
              {item.label}
            </span>

            {item.meta && (
              <span className="text-xs text-muted-foreground flex-shrink-0">
                {item.meta}
              </span>
            )}

            {variant === "list" && (
              <button
                type="button"
                onClick={() => onRemove?.(item.id)}
                className="flex-shrink-0 text-muted-foreground hover:text-destructive transition-colors rounded-full p-0.5"
                aria-label={`Remove ${item.label}`}
              >
                <X size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
    )
  }
)
SelectionList.displayName = "SelectionList"

export { SelectionList }
