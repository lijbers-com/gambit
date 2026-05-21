"use client"

// Small inline stacked bar for showing fill-rate breakdowns
// (booked / confirmed / reserved / available / overbooked / overreserved)
// inside tight UI surfaces — calendar cells, summary rows, etc.
//
// CSS-only rather than Recharts: a Recharts <BarChart> stack at 32×70px
// is heavy and gives no win — it doesn't render axes/tooltips at that
// size. Same approach as MetricCard's barHorizontal variant.
//
// Colors pull from the per-theme accent ramps (--success-*, --warning-*,
// --destructive-*, --neutral-*) so each retailer's theme gets its own
// shading automatically.

import * as React from "react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"

export type FillRateSegmentKey =
  | "booked"
  | "confirmed"
  | "reserved"
  | "available"
  | "overbooked"
  | "overreserved"
  // Sales-channel breakdown — used by Display where each booking
  // came in via a different sales pathway (managed sales / IO action
  // / programmatic) rather than going through booking states.
  | "soldManaged"
  | "action"
  | "programmatic"

export interface FillRateValue {
  booked?: number
  confirmed?: number
  reserved?: number
  available?: number
  overbooked?: number
  overreserved?: number
  // Display / programmatic sales-channel split
  soldManaged?: number
  action?: number
  programmatic?: number
}

/** Default color mapping. Override via `segmentColors` for bespoke palettes. */
export const defaultFillRateColors: Record<FillRateSegmentKey, string> = {
  booked:       "hsl(var(--success-900))",
  confirmed:    "hsl(var(--success-600))",
  reserved:     "hsl(var(--success-300))",
  available:    "rgb(var(--neutral-200))",
  overbooked:   "hsl(var(--destructive-500))",
  overreserved: "hsl(var(--warning-500))",
  // Sales-channel split reuses the same shade ramp so it visually
  // matches the booking-state bar.
  soldManaged:  "hsl(var(--success-900))",
  action:       "hsl(var(--success-600))",
  programmatic: "hsl(var(--success-300))",
}

export const defaultFillRateLabels: Record<FillRateSegmentKey, string> = {
  booked:       "Booked",
  confirmed:    "Confirmed",
  reserved:     "Reserved",
  available:    "Available",
  overbooked:   "Overbooked",
  overreserved: "Overreserved",
  soldManaged:  "Sold (managed)",
  action:       "Action",
  programmatic: "Programmatic",
}

/** Order in which segments stack left-to-right. */
const segmentOrder: FillRateSegmentKey[] = [
  "soldManaged",
  "action",
  "programmatic",
  "booked",
  "confirmed",
  "reserved",
  "available",
  "overbooked",
  "overreserved",
]

export interface FillRateBarProps {
  /** Breakdown values. Treated as percentages of the total when `total` is omitted. */
  value: FillRateValue
  /** When provided, segments are normalized against this total. Otherwise they're divided by their own sum. */
  total?: number
  /** Bar height in px. Default 8. */
  height?: number
  /** Show segment percentages below the bar. */
  showLabels?: boolean
  /** Only render labels for these segments (defaults to all non-zero segments). */
  labelSegments?: FillRateSegmentKey[]
  /** Override the default color mapping. */
  segmentColors?: Partial<Record<FillRateSegmentKey, string>>
  /** Override the default label text. */
  segmentLabels?: Partial<Record<FillRateSegmentKey, string>>
  className?: string
  /** Title attribute for native hover tooltip; defaults to a summary string. */
  title?: string
  /** Render a Radix tooltip on hover with a structured legend. Requires a
   *  TooltipProvider somewhere in the parent tree. Default: true. */
  hoverTooltip?: boolean
}

export const FillRateBar = React.forwardRef<HTMLDivElement, FillRateBarProps>(
  (
    {
      value,
      total,
      height = 8,
      showLabels = false,
      labelSegments,
      segmentColors,
      segmentLabels,
      className,
      title,
      hoverTooltip = true,
    },
    ref
  ) => {
    const colors = { ...defaultFillRateColors, ...segmentColors }
    const labels = { ...defaultFillRateLabels, ...segmentLabels }

    const present = segmentOrder
      .map((key) => ({ key, raw: value[key] ?? 0 }))
      .filter((s) => s.raw > 0)

    const sum = present.reduce((acc, s) => acc + s.raw, 0)
    const denom = total ?? sum
    const pct = (raw: number) => (denom > 0 ? (raw / denom) * 100 : 0)

    const tooltipText =
      title ??
      present
        .map((s) => `${labels[s.key]}: ${pct(s.raw).toFixed(0)}%`)
        .join(" • ")

    const visibleLabels = labelSegments ?? present.map((s) => s.key)

    const bar = (
      <div
        className="flex w-full overflow-hidden rounded-sm bg-muted"
        style={{ height }}
        role="img"
        aria-label={tooltipText}
      >
        {present.map((s) => (
          <div
            key={s.key}
            style={{
              width: `${pct(s.raw)}%`,
              backgroundColor: colors[s.key],
            }}
          />
        ))}
      </div>
    )

    const legend = (
      <div className="space-y-1.5">
        {segmentOrder.map((key) => {
          const raw = value[key] ?? 0
          if (raw <= 0) return null
          return (
            <div key={key} className="flex items-center gap-2 text-xs">
              <span
                className="h-2.5 w-2.5 rounded-sm shrink-0"
                style={{ backgroundColor: colors[key] }}
              />
              <span className="text-muted-foreground flex-1">{labels[key]}</span>
              <span className="font-medium tabular-nums text-foreground">
                {Math.round(pct(raw))}%
              </span>
            </div>
          )
        })}
      </div>
    )

    const labelRow = (() => {
      // Skip "available" (the grey remainder reads as available implicitly)
      // unless the caller explicitly requested it via labelSegments.
      const defaultLabelKeys = segmentOrder.filter((k) => k !== "available")
      const keys = (labelSegments ?? defaultLabelKeys).filter(
        (k) => (value[k] ?? 0) > 0
      )
      if (keys.length === 0) return null
      return (
        <div className="flex w-full justify-between gap-1 text-[10px] leading-none tabular-nums whitespace-nowrap">
          {keys.map((key) => (
            <span key={key} style={{ color: colors[key] }}>
              {Math.round(pct(value[key] ?? 0))}%
            </span>
          ))}
        </div>
      )
    })()

    const content = (
      <div
        className={cn("w-full flex flex-col gap-1", className)}
        title={hoverTooltip ? undefined : tooltipText}
      >
        {bar}
        {showLabels && labelRow}
      </div>
    )

    if (!hoverTooltip) {
      return <div ref={ref}>{content}</div>
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div ref={ref} className="block w-full cursor-pointer">
            {content}
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="bg-background text-foreground border border-border p-3 shadow-lg"
        >
          {legend}
        </TooltipContent>
      </Tooltip>
    )
  }
)
FillRateBar.displayName = "FillRateBar"
