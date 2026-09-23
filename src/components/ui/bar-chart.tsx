"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis, ReferenceLine } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { ChartDataPoint, ChartConfig, formatYAxisTick } from "./chart-types"
import { PropositionPatternDefs, patternFill, type PatternKey } from "@/lib/proposition-patterns"

/** Recharts' own tick text wraps a long category label onto a second line —
 *  and, once a row can't fit that second line, silently drops most of it —
 *  rather than cut it. A plain SVG text node sidesteps that wrapping
 *  entirely: one line, cut short with an ellipsis; the tooltip still
 *  carries the full name. */
const truncateLabel = (value: string, maxChars = 16) =>
  typeof value === "string" && value.length > maxChars ? `${value.slice(0, maxChars - 1)}…` : value

const CategoryAxisTick = ({ x, y, payload }: { x?: number; y?: number; payload?: { value: string } }) => (
  <text x={x} y={y} dy={4} textAnchor="end" fontSize={12} fill="#666">
    {truncateLabel(String(payload?.value ?? ""))}
  </text>
)

export interface BarChartProps {
  data: ChartDataPoint[]
  config: ChartConfig
  className?: string
  showGrid?: boolean
  showTooltip?: boolean
  showLegend?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
  showRightYAxis?: boolean
  rightAxisDataKey?: string
  stacked?: boolean
  horizontal?: boolean
  xAxisDataKey?: string
  benchmark?: { value: number; label?: string }
  /**
   * Colour each bar from a field on its own data point rather than from the
   * series. Use when the x-axis is a set of things that already own a colour —
   * propositions above all, which keep the same colour in every chart that
   * splits by engine (see lib/proposition-colors). Single-series charts only.
   */
  colorByPoint?: string
  /** Key on each data point holding its proposition id — the bar then wears
   *  that proposition's tint and pattern (the app-wide rule) instead of a
   *  flat colour. Single-series charts only. */
  patternByPoint?: string
}

export function BarChartComponent({
  data,
  config,
  className,
  showGrid = true,
  showTooltip = true,
  showLegend = false,
  showXAxis = true,
  showYAxis = true,
  showRightYAxis = false,
  rightAxisDataKey,
  stacked = false,
  horizontal = false,
  xAxisDataKey = "month",
  benchmark,
  colorByPoint,
  patternByPoint,
}: BarChartProps) {
  const dataKeys = Object.keys(config).filter(key => config[key].label)

  // Calculate Y-axis ticks for gridlines
  const { yAxisTicks, yAxisDomain } = React.useMemo(() => {
    if (!showGrid || !data.length) return { yAxisTicks: [], yAxisDomain: [0, 0] }

    const allValues = data.flatMap(item =>
      dataKeys.map(key => typeof item[key] === 'number' ? item[key] as number : 0)
    )
    const maxValue = Math.max(...allValues)
    const minValue = Math.min(...allValues, 0)

    // Generate approximately 5-6 ticks
    const tickCount = 6
    const range = maxValue - minValue
    const roughStep = range / (tickCount - 1)
    const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)))
    const step = Math.ceil(roughStep / magnitude) * magnitude

    const ticks: number[] = []
    for (let i = 0; i < tickCount; i++) {
      const value = Math.round((minValue + i * step) / step) * step
      if (value <= maxValue) ticks.push(value)
    }

    // Calculate domain from ticks to ensure both axes use same range
    const domain: [number, number] = ticks.length > 0
      ? [ticks[0], ticks[ticks.length - 1]]
      : [minValue, maxValue]

    return { yAxisTicks: ticks, yAxisDomain: domain }
  }, [data, dataKeys, showGrid])

  return (
    <ChartContainer config={config} className={className}>
      <BarChart
        accessibilityLayer
        data={data}
        // Recharts calls the ordinary up-down bar layout "horizontal" (the
        // category axis runs horizontally) and sideways bars "vertical" —
        // the inverse of what this component's own `horizontal` prop means
        // to its caller, so the two are deliberately swapped here.
        layout={horizontal ? "vertical" : "horizontal"}
        margin={{
          left: showYAxis ? 0 : 0,
          right: showRightYAxis ? 0 : 0,
          top: 4,
          bottom: 0,
        }}
      >
        {patternByPoint && <PropositionPatternDefs />}
        {showGrid && yAxisTicks.map(tick => (
          <ReferenceLine
            key={tick}
            {...(horizontal ? { x: tick } : { y: tick })}
            stroke="hsl(var(--border))"
            strokeOpacity={0.5}
            yAxisId={horizontal ? undefined : "left"}
          />
        ))}
        {benchmark != null && (
          <ReferenceLine
            {...(horizontal ? { x: benchmark.value } : { y: benchmark.value })}
            yAxisId={horizontal ? undefined : "left"}
            stroke="hsl(var(--muted-foreground))"
            strokeDasharray="4 4"
            strokeOpacity={0.8}
            label={
              benchmark.label
                ? { value: benchmark.label, position: 'insideTopRight', fill: 'hsl(var(--muted-foreground))', fontSize: 11 }
                : undefined
            }
          />
        )}
        {horizontal ? (
          <>
            {showXAxis && (
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                ticks={yAxisTicks}
                domain={yAxisDomain}
                style={{ fontSize: '12px' }}
                tickFormatter={formatYAxisTick}
              />
            )}
            {showYAxis && (
              <YAxis
                type="category"
                dataKey={xAxisDataKey}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={120}
                tick={<CategoryAxisTick />}
              />
            )}
          </>
        ) : (
          <>
            {showXAxis && (
              <XAxis
                dataKey={xAxisDataKey}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
            )}
            {showYAxis && (
              <YAxis
                yAxisId="left"
                orientation="left"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                ticks={yAxisTicks}
                domain={yAxisDomain}
                width={44}
                style={{ fontSize: '12px' }}
                tickFormatter={formatYAxisTick}
              />
            )}
            {showRightYAxis && (
              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                ticks={yAxisTicks}
                domain={yAxisDomain}
                width={40}
                style={{ fontSize: '12px' }}
                tick={{ dy: 4 }}
              />
            )}
          </>
        )}
        {dataKeys.map((key) => (
          <Bar
            key={key}
            dataKey={key}
            fill={`var(--color-${key})`}
            stackId={stacked ? "a" : undefined}
            /* The standard's rounded bar — except when stacked, where a
               rounded joint between segments would read as a gap. */
            radius={stacked ? 0 : 4}
            yAxisId={horizontal ? undefined : (rightAxisDataKey && key === rightAxisDataKey ? "right" : "left")}
          >
            {(patternByPoint || colorByPoint) &&
              data.map((point, i) => (
                <Cell
                  key={i}
                  fill={
                    patternByPoint && point[patternByPoint]
                      ? patternFill(point[patternByPoint] as PatternKey)
                      : ((colorByPoint && (point[colorByPoint] as string)) ?? `var(--color-${key})`)
                  }
                />
              ))}
          </Bar>
        ))}
        {showTooltip && (
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent />}
          />
        )}
        {showLegend && (
          <ChartLegend content={<ChartLegendContent />} />
        )}
      </BarChart>
    </ChartContainer>
  )
}