"use client"

// Hand-rolled in SVG rather than wrapping Recharts' Funnel: each stage is
// its own clickable column with a synced breakdown header (label, share,
// volume, drop-off) above the drawing, which Recharts' Funnel does not give.
//
// The drawing is one continuous shape: the flow narrows smoothly from one
// stage's share to the next, centred on the baseline like a river seen from
// above, in one blue. Where the reader is (hover or selection) the
// column lifts; the rest steps back.

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ConversionFunnelStage {
  key: string
  label: string
  value: number
}

export interface ConversionFunnelProps {
  stages: ConversionFunnelStage[]
  className?: string
  showTooltip?: boolean
  /** The flow's fill. Defaults to the chart ramp's mid blue. */
  color?: string
  valueFormatter?: (value: number) => string
  barHeight?: number
  selectedKey?: string
  onStageClick?: (key: string) => void
}

const formatPercent = (n: number) => {
  if (n === 0) return "0%"
  if (n < 0.1) return `${n.toFixed(2)}%`
  if (n < 10) return `${n.toFixed(1)}%`
  return `${Math.round(n)}%`
}

/** Drawing units: each stage is 100 wide; the flow's full height is 100. */
const W = 100
const H = 100
/** The last stage never thins to nothing — a line still reads as flow. */
const MIN_HALF = 3
/** Room above the flow for each stage's label, share and volume. */
const LABEL_H = 76

export function ConversionFunnelComponent({
  stages,
  className,
  showTooltip = true,
  color = "hsl(var(--chart-400))",
  valueFormatter = (v) => v.toLocaleString(),
  barHeight = 160,
  selectedKey,
  onStageClick,
}: ConversionFunnelProps) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)

  const firstValue = stages[0]?.value ?? 0
  const maxValue = Math.max(...stages.map((s) => s.value), 1)
  const isInteractive = typeof onStageClick === "function"
  const n = stages.length

  const handleSelect = (key: string) => {
    if (onStageClick) onStageClick(key)
  }
  const isSelected = (key: string) => selectedKey !== undefined && selectedKey === key
  const activeIndex = selectedKey !== undefined ? stages.findIndex((s) => s.key === selectedKey) : hoveredIndex

  // Half-height of the flow at each stage boundary. A stage holds its width
  // across the first part of its column and eases into the next stage's
  // width at the boundary, so the narrowing sits where the drop-off is read.
  const half = (v: number) => Math.max(MIN_HALF, (v / maxValue) * (H / 2))
  const halves = stages.map((s) => half(s.value))

  const path = React.useMemo(() => {
    if (n === 0) return ""
    const mid = H / 2
    const top: string[] = []
    const bottom: string[] = []
    // Ease over the last 40% of each column into the next stage's width.
    const HOLD = 0.6
    for (let i = 0; i < n; i++) {
      const x0 = i * W
      const x1 = x0 + W * HOLD
      const x2 = x0 + W
      const a = halves[i]
      const b = i < n - 1 ? halves[i + 1] : halves[i]
      if (i === 0) top.push(`M ${x0} ${mid - a}`)
      top.push(`L ${x1} ${mid - a}`)
      const cx = (x1 + x2) / 2
      top.push(`C ${cx} ${mid - a}, ${cx} ${mid - b}, ${x2} ${mid - b}`)
      bottom.unshift(`C ${cx} ${mid + b}, ${cx} ${mid + a}, ${x1} ${mid + a}`, `L ${x0} ${mid + a}`)
      if (i === n - 1) bottom.unshift(`L ${x2} ${mid + b}`)
    }
    return `${top.join(" ")} ${bottom.join(" ")} Z`
  }, [halves, n])

  return (
    <div className={cn("flex flex-col w-full", className)}>
      {/* One area: the stage's label, share and volume sit at the top of its
          column, the flow runs beneath them — the numbers ride the shape. */}
      <div className="relative" style={{ height: barHeight + LABEL_H }}>
        <svg
          className="absolute inset-x-0 bottom-0 w-full"
          style={{ height: barHeight }}
          preserveAspectRatio="none"
          viewBox={`0 0 ${n * W} ${H}`}
        >
          <defs>
            {/* Where the reader is, the flow is fully inked; elsewhere it steps back. */}
            <clipPath id="cf-active">
              {activeIndex !== null && activeIndex >= 0 && <rect x={activeIndex * W} y={0} width={W} height={H} />}
            </clipPath>
          </defs>
          <path d={path} fill={color} opacity={activeIndex !== null && activeIndex >= 0 ? 0.35 : 0.8} />
          {activeIndex !== null && activeIndex >= 0 && (
            <path d={path} fill={color} clipPath="url(#cf-active)" />
          )}
        </svg>

        {/* Columns: label block on top, hit area for the whole height */}
        <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
          {stages.map((stage, i) => {
            const prev = i > 0 ? stages[i - 1].value : null
            const stageRate = firstValue > 0 ? (stage.value / firstValue) * 100 : 0
            const dropOff = prev !== null && prev > 0 ? ((prev - stage.value) / prev) * 100 : null
            const selected = isSelected(stage.key)
            return (
              <div
                key={stage.key}
                role={isInteractive ? "button" : undefined}
                tabIndex={isInteractive ? 0 : undefined}
                aria-pressed={isInteractive ? selected : undefined}
                className={cn(
                  "relative border-l border-border first:border-l-0 transition-colors",
                  isInteractive && "cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                  selected && "bg-muted/30",
                  !selected && hoveredIndex === i && "bg-muted/20",
                )}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => isInteractive && handleSelect(stage.key)}
                onKeyDown={(e) => {
                  if (isInteractive && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault()
                    handleSelect(stage.key)
                  }
                }}
              >
                <div className="px-4 py-3">
                  <div className="text-xs text-muted-foreground truncate">{stage.label}</div>
                  <div className="text-2xl font-semibold leading-tight">{formatPercent(stageRate)}</div>
                  <div className="text-xs text-muted-foreground">
                    {valueFormatter(stage.value)}
                    {dropOff !== null && <span className="ml-1">&#8600; {formatPercent(dropOff)}</span>}
                  </div>
                </div>
                {showTooltip && hoveredIndex === i && (
                  <ConversionFunnelTooltip
                    stage={stage}
                    stageRate={stageRate}
                    color={color}
                    valueFormatter={valueFormatter}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

interface TooltipProps {
  stage: ConversionFunnelStage
  stageRate: number
  color: string
  valueFormatter: (value: number) => string
}

function ConversionFunnelTooltip({ stage, stageRate, color, valueFormatter }: TooltipProps) {
  return (
    <div className="pointer-events-none absolute left-1/2 top-[84px] z-10 -translate-x-1/2">
      <div className="grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
        <div className="font-medium">{stage.label}</div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 shrink-0 rounded-[2px]" style={{ backgroundColor: color }} />
          <div className="flex flex-1 justify-between gap-3 leading-none">
            <span className="text-muted-foreground">Volume</span>
            <span className="font-mono font-medium tabular-nums text-foreground">{valueFormatter(stage.value)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 pl-[14px]">
          <div className="flex flex-1 justify-between gap-3 leading-none">
            <span className="text-muted-foreground">Share</span>
            <span className="font-mono font-medium tabular-nums text-foreground">{formatPercent(stageRate)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
