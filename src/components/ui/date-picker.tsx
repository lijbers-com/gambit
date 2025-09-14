"use client"

import * as React from "react"
import { format, subDays, subWeeks, subMonths, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns"
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Single date picker props
export interface DatePickerProps {
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

// Range date picker props
export interface DateRangePickerProps {
  dateRange?: DateRange
  onDateRangeChange?: (dateRange: DateRange | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  showPresets?: boolean
}

// Preset definitions
const presets = [
  {
    label: "Today",
    value: () => ({
      from: new Date(),
      to: new Date(),
    }),
  },
  {
    label: "Yesterday",
    value: () => ({
      from: subDays(new Date(), 1),
      to: subDays(new Date(), 1),
    }),
  },
  {
    label: "Last 7 days",
    value: () => ({
      from: subDays(new Date(), 6),
      to: new Date(),
    }),
  },
  {
    label: "Last 30 days",
    value: () => ({
      from: subDays(new Date(), 29),
      to: new Date(),
    }),
  },
  {
    label: "This week",
    value: () => ({
      from: startOfWeek(new Date(), { weekStartsOn: 1 }),
      to: endOfWeek(new Date(), { weekStartsOn: 1 }),
    }),
  },
  {
    label: "Last week",
    value: () => {
      const lastWeek = subWeeks(new Date(), 1)
      return {
        from: startOfWeek(lastWeek, { weekStartsOn: 1 }),
        to: endOfWeek(lastWeek, { weekStartsOn: 1 }),
      }
    },
  },
  {
    label: "This month",
    value: () => ({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date()),
    }),
  },
  {
    label: "Last month",
    value: () => {
      const lastMonth = subMonths(new Date(), 1)
      return {
        from: startOfMonth(lastMonth),
        to: endOfMonth(lastMonth),
      }
    },
  },
]

// Single date picker component
export function DatePicker({
  date,
  onDateChange,
  placeholder = "Pick a date",
  disabled = false,
  className,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
} 

// Range date picker component
export function DateRangePicker({
  dateRange,
  onDateRangeChange,
  placeholder = "Pick a date range",
  disabled = false,
  className,
  showPresets = false,
}: DateRangePickerProps) {
  const formatDateRange = (range: DateRange | undefined) => {
    if (!range || !range.from) return placeholder
    
    if (range.from && range.to) {
      if (range.from.getTime() === range.to.getTime()) {
        return format(range.from, "PPP")
      }
      return `${format(range.from, "PPP")} - ${format(range.to, "PPP")}`
    }
    
    return `${format(range.from, "PPP")} - ...`
  }

  const handlePresetSelect = (preset: typeof presets[0]) => {
    const range = preset.value()
    onDateRangeChange?.(range)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !dateRange?.from && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span className="truncate">{formatDateRange(dateRange)}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0" 
        align="end" 
        side="bottom"
        sideOffset={4}
        avoidCollisions={true}
        collisionPadding={16}
      >
        <div className="flex flex-col max-h-[80vh] overflow-hidden">
          {showPresets && (
            <div className="border-b p-3 flex-shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    Select preset
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="w-full"
                  align="start"
                  side="bottom"
                  avoidCollisions={true}
                  collisionPadding={8}
                >
                  {presets.map((preset) => (
                    <DropdownMenuItem
                      key={preset.label}
                      onClick={() => handlePresetSelect(preset)}
                    >
                      {preset.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          <div className="overflow-auto">
            <Calendar
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={onDateRangeChange}
              numberOfMonths={2}
              initialFocus
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Export default
export { DatePicker as default } 