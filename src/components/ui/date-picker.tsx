"use client"

import * as React from "react"
import { format, subDays, subWeeks, subMonths, addDays, addWeeks, addMonths, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns"
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar, type CalendarEvent } from "@/components/ui/calendar"
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
  /**
   * A moment, not just a day: pass both and the picker becomes one field for
   * date AND time — the trigger reads "Aug 6, 2026 · 00:00" and the popover
   * gets a time row under the calendar. One field, because they are one
   * answer ("when does this start?"), and a separate time box beside the
   * picker read as a second question.
   */
  time?: string
  onTimeChange?: (time: string) => void
}

// Range date picker props
export interface DateRangePickerProps {
  dateRange?: DateRange
  onDateRangeChange?: (dateRange: DateRange | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  showPresets?: boolean
  /** Preset list to use (defaults to the past-looking analytics presets) */
  presets?: DateRangePreset[]
  /** Preset label shown as selected by default */
  defaultPreset?: string
  /** Show week numbers in the calendar; clicking one selects that whole week */
  showWeekNumbers?: boolean
  showConversionWindow?: boolean
  conversionWindow?: number
  onConversionWindowChange?: (days: number) => void
  /**
   * Label for a reset button under the calendar, e.g. "All dates". Only shown
   * when a range is set. Without it a picker is one-way: once a window is
   * chosen the only route back to everything is guessing a wide enough one.
   * Clearing emits `undefined`.
   */
  clearLabel?: string
  /** Dated moments drawn as coloured dots in the calendar (retail events,
   *  holidays), with a legend underneath — the bookings calendar's marker
   *  language, inside the picker. */
  events?: CalendarEvent[]
}

// Conversion window options
const conversionWindowOptions = [
  { label: "7 days", value: 7 },
  { label: "14 days", value: 14 },
  { label: "28 days", value: 28 },
]

// Preset definitions
export type DateRangePreset = { label: string; value: () => DateRange }

// Forward-looking presets (e.g. for booking run times)
export const futureDateRangePresets: DateRangePreset[] = [
  {
    label: "This week",
    value: () => ({
      from: startOfWeek(new Date(), { weekStartsOn: 1 }),
      to: endOfWeek(new Date(), { weekStartsOn: 1 }),
    }),
  },
  {
    label: "Next week",
    value: () => {
      const next = addWeeks(new Date(), 1)
      return {
        from: startOfWeek(next, { weekStartsOn: 1 }),
        to: endOfWeek(next, { weekStartsOn: 1 }),
      }
    },
  },
  {
    label: "Next 2 weeks",
    value: () => ({
      from: startOfWeek(addWeeks(new Date(), 1), { weekStartsOn: 1 }),
      to: endOfWeek(addWeeks(new Date(), 2), { weekStartsOn: 1 }),
    }),
  },
  {
    label: "This month",
    value: () => ({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date()),
    }),
  },
  {
    label: "Next month",
    value: () => {
      const next = addMonths(new Date(), 1)
      return { from: startOfMonth(next), to: endOfMonth(next) }
    },
  },
  {
    label: "Next 7 days",
    value: () => ({ from: new Date(), to: addDays(new Date(), 6) }),
  },
  {
    label: "Next 30 days",
    value: () => ({ from: new Date(), to: addDays(new Date(), 29) }),
  },
]

const defaultPresets: DateRangePreset[] = [
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
  time,
  onTimeChange,
}: DatePickerProps) {
  const withTime = time !== undefined && !!onTimeChange
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
          <CalendarIcon className="h-4 w-4" />
          {date ? (
            <span className="min-w-0 truncate">
              {format(date, "PPP")}
              {withTime && <span className="text-muted-foreground"> · {time}</span>}
            </span>
          ) : (
            <span>{placeholder}</span>
          )}
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
        {withTime && (
          <div className="flex items-center justify-between gap-3 border-t p-3">
            <label className="text-sm font-medium text-foreground">Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => onTimeChange?.(e.target.value)}
              className={cn(
                "rounded-md border border-input bg-background px-3 py-1.5 text-sm",
                "focus:outline-none focus:ring-2 focus:ring-ring"
              )}
            />
          </div>
        )}
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
  presets,
  defaultPreset,
  showWeekNumbers = false,
  showConversionWindow = false,
  conversionWindow,
  onConversionWindowChange,
  clearLabel,
  events,
}: DateRangePickerProps) {
  const presetList = presets ?? defaultPresets
  const [selectedPreset, setSelectedPreset] = React.useState<string | undefined>(defaultPreset)
  const [fromInputValue, setFromInputValue] = React.useState(
    dateRange?.from ? format(dateRange.from, "dd/MM/yyyy") : ""
  )
  const [toInputValue, setToInputValue] = React.useState(
    dateRange?.to ? format(dateRange.to, "dd/MM/yyyy") : ""
  )

  /**
   * Compact enough to sit in a page header: "1 Jan – 28 Feb 2026", with the
   * year stated once when both ends share it. The long form ("January 1st,
   * 2026 - February 28th, 2026") ran past any sensible trigger width and was
   * cut off mid-date, which reads worse than an abbreviation.
   */
  const formatDateRange = (range: DateRange | undefined) => {
    if (!range || !range.from) return placeholder
    if (!range.to) return `${format(range.from, "d MMM yyyy")} – …`
    if (range.from.getTime() === range.to.getTime()) return format(range.from, "d MMM yyyy")

    const sameYear = range.from.getFullYear() === range.to.getFullYear()
    const from = format(range.from, sameYear ? "d MMM" : "d MMM yyyy")
    return `${from} – ${format(range.to, "d MMM yyyy")}`
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

  const handlePresetSelect = (preset: DateRangePreset) => {
    setSelectedPreset(preset.label)
    onDateRangeChange?.(preset.value())
  }

  // Any manual edit (calendar/input) clears the active preset
  const handleManualRangeChange = (range: DateRange | undefined) => {
    setSelectedPreset(undefined)
    onDateRangeChange?.(range)
  }

  // Selecting a week via its number sets the range to that whole week
  const handleWeekSelect = (dates: Date[]) => {
    if (!dates || dates.length === 0) return
    setSelectedPreset(undefined)
    onDateRangeChange?.({ from: dates[0], to: dates[dates.length - 1] })
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
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="h-4 w-4" />
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
                Enter dates
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
                    {selectedPreset ?? "Select preset"}
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
                  {presetList.map((preset) => (
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
              onSelect={handleManualRangeChange}
              numberOfMonths={2}
              initialFocus
              showWeekNumber={showWeekNumbers}
              onWeekClick={showWeekNumbers ? handleWeekSelect : undefined}
              events={events}
            />
          </div>
          {/* The dots decoded: which colour is which moment. */}
          {events && events.length > 0 && (
            <div className="flex flex-wrap gap-x-4 gap-y-1 border-t px-3 py-2">
              {events.map((ev) => (
                <span key={`${ev.date}-${ev.label}`} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: ev.color }} />
                  {ev.label}
                </span>
              ))}
            </div>
          )}
          {clearLabel && dateRange?.from && (
            <div className="border-t p-3 flex-shrink-0">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSelectedPreset(undefined)
                  onDateRangeChange?.(undefined)
                }}
              >
                {clearLabel}
              </Button>
            </div>
          )}
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