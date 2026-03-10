"use client"

import * as React from "react"
import { ChevronDown, Settings2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface AttributionWindowSelectProps {
  value?: number
  onChange?: (days: number) => void
  options?: { label: string; value: number }[]
  label?: string
  className?: string
  disabled?: boolean
}

const defaultOptions = [
  { label: "7 days", value: 7 },
  { label: "14 days", value: 14 },
  { label: "28 days", value: 28 },
]

export function AttributionWindowSelect({
  value = 14,
  onChange,
  options = defaultOptions,
  label = "Attribution Window",
  className,
  disabled = false,
}: AttributionWindowSelectProps) {
  const selectedOption = options.find((o) => o.value === value)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-between text-left font-normal gap-2",
            className
          )}
          disabled={disabled}
        >
          <Settings2 className="h-4 w-4 shrink-0" />
          <span className="truncate">{selectedOption?.label || `${value} days`}</span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="bottom" avoidCollisions={true} collisionPadding={8}>
        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">{label}</div>
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onChange?.(option.value)}
            className={cn(
              option.value === value && "bg-accent font-medium"
            )}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
