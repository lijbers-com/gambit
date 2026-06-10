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

/** Default color mapping. Pulls from the per-theme chart shade ramp
 *  (--chart-50 ... --chart-950) so each theme retunes the bar's
 *  palette automatically. Override via `segmentColors` for bespoke
 *  per-cell palettes.
 *
 *  Overbooked / overreserved deliberately stay on destructive /
 *  warning — those are semantic alert states, not chart data. */
export const defaultFillRateColors: Record<FillRateSegmentKey, string> = {
  booked:       "hsl(var(--chart-800))",
  confirmed:    "hsl(var(--chart-500))",
  reserved:     "hsl(var(--chart-300))",
  available:    "rgb(var(--neutral-200))",
  overbooked:   "hsl(var(--destructive-500))",
  overreserved: "hsl(var(--warning-500))",
  // Sales-channel split reuses the same shade slots so it visually
  // matches the booking-state bar.
  soldManaged:  "hsl(var(--chart-800))",
  action:       "hsl(var(--chart-500))",
  programmatic: "hsl(var(--chart-300))",
}

export const defaultFillRateLabels: Record<FillRateSegmentKey, string> = {
  booked:       "Booked",
  confirmed:    "Confirmed",
  reserved:     "Reserved",
  available:    "Available",
  overbooked:   "Overbooked",
  overreserved: "Overreserved",
  soldManaged:  "Sold (managed)",
  // The "action" segment key historically referred to advertiser-driven
  // sales (advertisers booking via the self-service / Edge Advertiser UI).
  // "Self service" is the term yield managers actually use — keep the
  // key name for back-compat but surface the human-readable label.
  action:       "Self service",
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
  /** When set, the below-bar labels are extended with the absolute volume
   *  used vs the total — used by the Impressions view so a cell reads
   *  "85% / 330K" instead of just "85%". The total is the cell's
   *  impressions target; the used count is derived from the percentage
   *  already computed inside the bar. */
  impressionsTotal?: number
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
      impressionsTotal,
    },
    ref
  ) => {
    // Compact number formatter for the impressions absolute value
    // (e.g. 330_000 → "330K", 1_250_000 → "1.3M").
    const fmtK = (n: number): string => {
      if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
      if (n >= 1_000) {
        const k = n / 1_000
        return k >= 100 ? `${Math.round(k)}K` : `${k.toFixed(1)}K`
      }
      return `${Math.round(n)}`
    }
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

    // Rolled-up numbers shared by the inside-bar labels and the below-bar row:
    // - filled: everything used (booked / confirmed / reserved / sales channels)
    // - right: overbooked (red, prefixed +) if any, otherwise available (grey)
    const usedKeys: FillRateSegmentKey[] = [
      "booked", "confirmed", "reserved",
      "soldManaged", "action", "programmatic",
    ]
    const usedTotal = usedKeys.reduce((s, k) => s + (value[k] ?? 0), 0)
    const availableRaw = value.available ?? 0
    const overbookedRaw = (value.overbooked ?? 0) + (value.overreserved ?? 0)
    const hasRollup = usedTotal > 0 || availableRaw > 0 || overbookedRaw > 0
    const usedPct = Math.round(pct(usedTotal))
    const rightPct = overbookedRaw > 0 ? Math.round(pct(overbookedRaw)) : Math.round(pct(availableRaw))
    const rightPrefix = overbookedRaw > 0 ? '+' : ''
    const rightColor = overbookedRaw > 0 ? colors.overbooked : 'rgb(var(--neutral-500))'
    const showRight = availableRaw > 0 || overbookedRaw > 0

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

    // Below-bar variant of the rolled-up numbers.
    //
    // - Fill-rate view (no `impressionsTotal`): show used% on the left and
    //   available% (or +over%) on the right — both are useful at a glance.
    // - Impressions view (`impressionsTotal` set): show ONLY the booked side
    //   as `used% / 160K`. The right number duplicates the left when the cell
    //   is 50/50 and adds noise the rest of the time; one label per bar is
    //   enough for "how much is sold".
    const impressionsMode = impressionsTotal !== undefined
    const usedImpressions = impressionsTotal
      ? Math.round((impressionsTotal * Math.min(usedPct, 100)) / 100)
      : undefined

    const leftLabel =
      usedImpressions !== undefined ? `${usedPct}% / ${fmtK(usedImpressions)}` : `${usedPct}%`
    const rightLabel = `${rightPrefix}${rightPct}%`

    const labelRow = hasRollup ? (
      <div className="flex w-full justify-between gap-1 text-[10px] leading-none tabular-nums whitespace-nowrap">
        <span style={{ color: colors.booked }}>{leftLabel}</span>
        {!impressionsMode && showRight && (
          <span style={{ color: rightColor }}>{rightLabel}</span>
        )}
      </div>
    ) : null

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
