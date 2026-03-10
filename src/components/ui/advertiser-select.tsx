"use client"

import * as React from "react"
import { ChevronDown, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface AdvertiserOption {
  label: string
  value: string
}

export interface AdvertiserSelectProps {
  value?: string
  onChange?: (value: string) => void
  options?: AdvertiserOption[]
  placeholder?: string
  className?: string
  disabled?: boolean
}

const defaultAdvertiserOptions: AdvertiserOption[] = [
  { label: "Coca-Cola", value: "coca-cola" },
  { label: "Unilever", value: "unilever" },
  { label: "Procter & Gamble", value: "procter-gamble" },
  { label: "Nestlé", value: "nestle" },
  { label: "PepsiCo", value: "pepsico" },
]

export function AdvertiserSelect({
  value,
  onChange,
  options = defaultAdvertiserOptions,
  placeholder = "Select Advertiser",
  className,
  disabled = false,
}: AdvertiserSelectProps) {
  const selectedOption = options.find((o) => o.value === value)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-between text-left font-normal gap-2",
            !selectedOption && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <Building2 className="h-4 w-4 shrink-0" />
          <span className="truncate">{selectedOption?.label || placeholder}</span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="bottom" avoidCollisions={true} collisionPadding={8}>
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
