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

export type FillRateSegmentKey =
  | "booked"
  | "confirmed"
  | "reserved"
  | "available"
  | "overbooked"
  | "overreserved"

export interface FillRateValue {
  booked?: number
  confirmed?: number
  reserved?: number
  available?: number
  overbooked?: number
  overreserved?: number
}

/** Default color mapping. Override via `segmentColors` for bespoke palettes. */
export const defaultFillRateColors: Record<FillRateSegmentKey, string> = {
  booked:       "hsl(var(--success-900))",
  confirmed:    "hsl(var(--success-600))",
  reserved:     "hsl(var(--success-300))",
  available:    "rgb(var(--neutral-200))",
  overbooked:   "hsl(var(--destructive-500))",
  overreserved: "hsl(var(--warning-500))",
}

export const defaultFillRateLabels: Record<FillRateSegmentKey, string> = {
  booked:       "Booked",
  confirmed:    "Confirmed",
  reserved:     "Reserved",
  available:    "Available",
  overbooked:   "Overbooked",
  overreserved: "Overreserved",
}

/** Order in which segments stack left-to-right. */
const segmentOrder: FillRateSegmentKey[] = [
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

    return (
      <div ref={ref} className={cn("w-full flex flex-col gap-1", className)} title={tooltipText}>
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
        {showLabels && (
          <div className="flex w-full text-[10px] leading-none tabular-nums">
            {segmentOrder.map((key) => {
              const raw = value[key] ?? 0
              if (raw <= 0 || !visibleLabels.includes(key)) return null
              return (
                <div
                  key={key}
                  className="text-muted-foreground"
                  style={{
                    width: `${pct(raw)}%`,
                    color: colors[key],
                  }}
                >
                  {Math.round(pct(raw))}%
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }
)
FillRateBar.displayName = "FillRateBar"
