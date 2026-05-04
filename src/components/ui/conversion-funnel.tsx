"use client"

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

export function ConversionFunnelComponent({
  stages,
  className,
  showTooltip = true,
  color = "hsl(var(--chart-1))",
  valueFormatter = (v) => v.toLocaleString(),
  barHeight = 160,
  selectedKey,
  onStageClick,
}: ConversionFunnelProps) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)

  const firstValue = stages[0]?.value ?? 0
  const maxValue = Math.max(...stages.map((s) => s.value), 1)
  const isInteractive = typeof onStageClick === "function"

  const handleSelect = (key: string) => {
    if (onStageClick) onStageClick(key)
  }

  const isSelected = (key: string) =>
    selectedKey !== undefined && selectedKey === key

  const isDimmed = (i: number, key: string) => {
    if (selectedKey !== undefined) return !isSelected(key)
    return hoveredIndex !== null && hoveredIndex !== i
  }

  return (
    <div className={cn("flex flex-col w-full", className)}>
      <div
        className="grid border-b border-border"
        style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(0, 1fr))` }}
      >
        {stages.map((stage, i) => {
          const prev = i > 0 ? stages[i - 1].value : null
          const stageRate = firstValue > 0 ? (stage.value / firstValue) * 100 : 0
          const dropOff =
            prev !== null && prev > 0 ? ((prev - stage.value) / prev) * 100 : null
          const selected = isSelected(stage.key)

          return (
            <div
              key={stage.key}
              role={isInteractive ? "button" : undefined}
              tabIndex={isInteractive ? 0 : undefined}
              aria-pressed={isInteractive ? selected : undefined}
              className={cn(
                "px-4 py-3 border-l border-border first:border-l-0 transition-colors",
                isInteractive && "cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                selected && "bg-muted/60",
                !selected && hoveredIndex === i && "bg-muted/30"
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
              <div className="text-xs text-muted-foreground truncate">{stage.label}</div>
              <div className="text-2xl font-semibold leading-tight">
                {formatPercent(stageRate)}
              </div>
              <div className="text-xs text-muted-foreground">
                {valueFormatter(stage.value)}
                {dropOff !== null && (
                  <span className="ml-1">&#8600; {formatPercent(dropOff)}</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div
        className="relative grid"
        style={{
          gridTemplateColumns: `repeat(${stages.length}, minmax(0, 1fr))`,
          height: barHeight,
        }}
      >
        {stages.map((stage, i) => {
          const next = i < stages.length - 1 ? stages[i + 1].value : stage.value
          const leftPct = (stage.value / maxValue) * 100
          const rightPct = (next / maxValue) * 100
          const isLast = i === stages.length - 1
          const dimmed = isDimmed(i, stage.key)

          return (
            <div
              key={stage.key}
              className={cn(
                "relative border-l border-border first:border-l-0",
                isInteractive && "cursor-pointer"
              )}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => isInteractive && handleSelect(stage.key)}
            >
              <svg
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="none"
                viewBox="0 0 100 100"
              >
                <rect
                  x={0}
                  y={100 - leftPct}
                  width={75}
                  height={leftPct}
                  fill={dimmed ? "hsl(var(--muted-foreground))" : color}
                  opacity={dimmed ? 0.25 : 1}
                />
                {!isLast && (
                  <polygon
                    points={`75,${100 - leftPct} 100,${100 - rightPct} 100,100 75,100`}
                    fill={dimmed ? "hsl(var(--muted-foreground))" : color}
                    opacity={dimmed ? 0.12 : 0.3}
                  />
                )}
              </svg>

              {showTooltip && hoveredIndex === i && (
                <ConversionFunnelTooltip
                  stage={stage}
                  stageRate={
                    firstValue > 0 ? (stage.value / firstValue) * 100 : 0
                  }
                  color={color}
                  valueFormatter={valueFormatter}
                />
              )}
            </div>
          )
        })}
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

function ConversionFunnelTooltip({
  stage,
  stageRate,
  color,
  valueFormatter,
}: TooltipProps) {
  return (
    <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-2 -translate-y-full z-10">
      <div className="grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
        <div className="font-medium">{stage.label}</div>
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
            style={{ backgroundColor: color }}
          />
          <div className="flex flex-1 justify-between gap-3 leading-none">
            <span className="text-muted-foreground">Volume</span>
            <span className="font-mono font-medium tabular-nums text-foreground">
              {valueFormatter(stage.value)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 pl-[14px]">
          <div className="flex flex-1 justify-between gap-3 leading-none">
            <span className="text-muted-foreground">Share</span>
            <span className="font-mono font-medium tabular-nums text-foreground">
              {formatPercent(stageRate)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
