"use client"

// Small inline stacked bar for showing the distribution of available
// time across loop tiers (no / low / medium / high available time).
// Digital media in-store specific — a loop is one ad-rotation cycle,
// and the bar shows what share of loops fall in each capacity tier.
//
// Built on the same CSS-stacked-bar pattern as FillRateBar; pulls
// colors from the shared semantic ramps so each theme retunes
// automatically.

import * as React from "react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"

export type AvailableTimeSegmentKey =
  | "noAvailable"
  | "lowAvailable"
  | "mediumAvailable"
  | "highAvailable"

export interface AvailableTimeValue {
  noAvailable?: number
  lowAvailable?: number
  mediumAvailable?: number
  highAvailable?: number
  /** Optional threshold labels shown under each segment. */
  thresholds?: Partial<Record<AvailableTimeSegmentKey, string>>
}

/** Default color mapping. Pulls from the per-theme chart shade ramp
 *  so the bar retunes per theme. highAvailable keeps the warning
 *  amber because "lots of unsold loop time" is an attention state. */
export const defaultAvailableTimeColors: Record<AvailableTimeSegmentKey, string> = {
  noAvailable:     "hsl(var(--chart-800))",
  lowAvailable:    "hsl(var(--chart-500))",
  mediumAvailable: "hsl(var(--chart-300))",
  highAvailable:   "hsl(var(--warning-500))",
}

export const defaultAvailableTimeLabels: Record<AvailableTimeSegmentKey, string> = {
  noAvailable:     "No available time",
  lowAvailable:    "Low available time",
  mediumAvailable: "Medium available time",
  highAvailable:   "High available time",
}

export const defaultAvailableTimeThresholds: Record<AvailableTimeSegmentKey, string> = {
  noAvailable:     "0s",
  lowAvailable:    "4s+",
  mediumAvailable: "9s+",
  highAvailable:   "18s+",
}

const segmentOrder: AvailableTimeSegmentKey[] = [
  "noAvailable",
  "lowAvailable",
  "mediumAvailable",
  "highAvailable",
]

export interface AvailableTimeBarProps {
  value: AvailableTimeValue
  total?: number
  height?: number
  /** Show threshold labels under the bar. */
  showLabels?: boolean
  segmentColors?: Partial<Record<AvailableTimeSegmentKey, string>>
  segmentLabels?: Partial<Record<AvailableTimeSegmentKey, string>>
  className?: string
  hoverTooltip?: boolean
}

export const AvailableTimeBar = React.forwardRef<HTMLDivElement, AvailableTimeBarProps>(
  (
    {
      value,
      total,
      height = 10,
      showLabels = false,
      segmentColors,
      segmentLabels,
      className,
      hoverTooltip = true,
    },
    ref
  ) => {
    const colors = { ...defaultAvailableTimeColors, ...segmentColors }
    const labels = { ...defaultAvailableTimeLabels, ...segmentLabels }
    const thresholds = { ...defaultAvailableTimeThresholds, ...(value.thresholds ?? {}) }

    const present = segmentOrder
      .map((key) => ({ key, raw: value[key] ?? 0 }))
      .filter((s) => s.raw > 0)

    const sum = present.reduce((acc, s) => acc + s.raw, 0)
    const denom = total ?? sum
    const pct = (raw: number) => (denom > 0 ? (raw / denom) * 100 : 0)

    const tooltipText = present
      .map((s) => `${labels[s.key]}: ${pct(s.raw).toFixed(0)}%`)
      .join(" • ")

    const bar = (
      <div
        className="flex w-full overflow-hidden rounded-full bg-muted"
        style={{ height }}
        role="img"
        aria-label={tooltipText}
      >
        {present.map((s) => (
          <div
            key={s.key}
            style={{ width: `${pct(s.raw)}%`, backgroundColor: colors[s.key] }}
          />
        ))}
      </div>
    )

    const labelRow = (() => {
      const keys = present.map((s) => s.key)
      if (keys.length === 0) return null
      return (
        <div className="flex w-full justify-between gap-1 text-[10px] leading-none tabular-nums whitespace-nowrap">
          {keys.map((key) => (
            <span key={key} style={{ color: colors[key] }}>
              {thresholds[key]}
            </span>
          ))}
        </div>
      )
    })()

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
AvailableTimeBar.displayName = "AvailableTimeBar"
