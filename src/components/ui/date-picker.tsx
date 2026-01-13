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
  showConversionWindow?: boolean
  conversionWindow?: number
  onConversionWindowChange?: (days: number) => void
}

// Conversion window options
const conversionWindowOptions = [
  { label: "7 days", value: 7 },
  { label: "14 days", value: 14 },
  { label: "28 days", value: 28 },
]

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
  const [inputValue, setInputValue] = React.useState(
    date ? format(date, "dd/MM/yyyy") : ""
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)

    // Try to parse the date
    if (value.length === 10) {
      const parts = value.split("/")
      if (parts.length === 3) {
        const [day, month, year] = parts
        const parsedDate = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day)
        )

        // Validate the date
        if (
          !isNaN(parsedDate.getTime()) &&
          parsedDate.getDate() === parseInt(day) &&
          parsedDate.getMonth() === parseInt(month) - 1
        ) {
          onDateChange?.(parsedDate)
        }
      }
    }
  }

  // Update input when date changes externally
  React.useEffect(() => {
    if (date) {
      setInputValue(format(date, "dd/MM/yyyy"))
    } else {
      setInputValue("")
    }
  }, [date])

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
        <div className="p-3 border-b space-y-2">
          <label className="text-sm font-medium text-foreground block">
            Enter date (dd/MM/yyyy)
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="dd/MM/yyyy"
            className={cn(
              "w-full px-3 py-2 border rounded-md text-sm",
              "border-input bg-background",
              "focus:outline-none focus:ring-2 focus:ring-ring"
            )}
          />
        </div>
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
  showConversionWindow = false,
  conversionWindow,
  onConversionWindowChange,
}: DateRangePickerProps) {
  const [fromInputValue, setFromInputValue] = React.useState(
    dateRange?.from ? format(dateRange.from, "dd/MM/yyyy") : ""
  )
  const [toInputValue, setToInputValue] = React.useState(
    dateRange?.to ? format(dateRange.to, "dd/MM/yyyy") : ""
  )

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

  const parseDate = (dateString: string): Date | null => {
    if (dateString.length !== 10) return null

    const parts = dateString.split("/")
    if (parts.length !== 3) return null

    const [day, month, year] = parts
    const parsedDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day)
    )

    // Validate the date
    if (
      !isNaN(parsedDate.getTime()) &&
      parsedDate.getDate() === parseInt(day) &&
      parsedDate.getMonth() === parseInt(month) - 1
    ) {
      return parsedDate
    }

    return null
  }

  const handleFromInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFromInputValue(value)

    const parsedDate = parseDate(value)
    if (parsedDate) {
      onDateRangeChange?.({
        from: parsedDate,
        to: dateRange?.to,
      })
    }
  }

  const handleToInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setToInputValue(value)

    const parsedDate = parseDate(value)
    if (parsedDate) {
      onDateRangeChange?.({
        from: dateRange?.from,
        to: parsedDate,
      })
    }
  }

  const handlePresetSelect = (preset: typeof presets[0]) => {
    const range = preset.value()
    onDateRangeChange?.(range)
  }

  // Update input when dateRange changes externally
  React.useEffect(() => {
    if (dateRange?.from) {
      setFromInputValue(format(dateRange.from, "dd/MM/yyyy"))
    } else {
      setFromInputValue("")
    }

    if (dateRange?.to) {
      setToInputValue(format(dateRange.to, "dd/MM/yyyy"))
    } else {
      setToInputValue("")
    }
  }, [dateRange])

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
          <div className="border-b p-3 flex-shrink-0 space-y-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">
                Enter dates (dd/MM/yyyy)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={fromInputValue}
                  onChange={handleFromInputChange}
                  placeholder="From"
                  className={cn(
                    "flex-1 px-3 py-2 border rounded-md text-sm",
                    "border-input bg-background",
                    "focus:outline-none focus:ring-2 focus:ring-ring"
                  )}
                />
                <input
                  type="text"
                  value={toInputValue}
                  onChange={handleToInputChange}
                  placeholder="To"
                  className={cn(
                    "flex-1 px-3 py-2 border rounded-md text-sm",
                    "border-input bg-background",
                    "focus:outline-none focus:ring-2 focus:ring-ring"
                  )}
                />
              </div>
            </div>
            {showPresets && (
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
            )}
          </div>
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
          {showConversionWindow && (
            <div className="border-t p-3 flex-shrink-0">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Conversion Window
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {conversionWindowOptions.map((option) => (
                    <Button
                      key={option.value}
                      size="sm"
                      variant={conversionWindow === option.value ? "default" : "outline"}
                      onClick={() => onConversionWindowChange?.(option.value)}
                      className="text-xs"
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Export default
export { DatePicker as default } 