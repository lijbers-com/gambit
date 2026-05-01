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
}

const formatPercent = (n: number) => `${n.toFixed(n > 0 && n < 10 ? 1 : 0)}%`

export function ConversionFunnelComponent({
  stages,
  className,
  showTooltip = true,
  color = "hsl(var(--chart-1))",
  valueFormatter = (v) => v.toLocaleString(),
  barHeight = 160,
}: ConversionFunnelProps) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)

  const firstValue = stages[0]?.value ?? 0
  const maxValue = Math.max(...stages.map((s) => s.value), 1)

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

          return (
            <div
              key={stage.key}
              className={cn(
                "px-4 py-3 border-l border-border first:border-l-0 transition-colors",
                hoveredIndex === i && "bg-muted/40"
              )}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
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

          return (
            <div
              key={stage.key}
              className="relative border-l border-border first:border-l-0"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
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
                  fill={color}
                  opacity={hoveredIndex === null || hoveredIndex === i ? 1 : 0.4}
                />
                {!isLast && (
                  <polygon
                    points={`75,${100 - leftPct} 100,${100 - rightPct} 100,100 75,100`}
                    fill={color}
                    opacity={hoveredIndex === null || hoveredIndex === i ? 0.3 : 0.15}
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
