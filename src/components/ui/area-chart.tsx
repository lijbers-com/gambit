"use client"

import * as React from "react"
import { Area, ComposedChart, Line, XAxis, YAxis, ReferenceLine } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { ChartDataPoint, ChartConfig, formatYAxisTick } from "./chart-types"
import { PropositionPatternDefs, patternFor, patternFill } from "@/lib/proposition-patterns"

export interface AreaChartProps {
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
  curved?: boolean
  benchmark?: { value: number; label?: string }
}

/** The benchmark's name as a small pill on the chart surface — text over
 *  patterned fills is unreadable, a badge is not. Recharts hands the
 *  reference line's box in via viewBox. */
const BenchmarkBadge = ({ text, viewBox }: { text: string; viewBox?: { x: number; y: number; width: number; height: number } }) => {
  if (!viewBox) return null
  const w = text.length * 6.2 + 16
  const h = 18
  const x = viewBox.x + viewBox.width - w - 4
  const y = viewBox.y - h / 2
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={h / 2} fill="hsl(var(--card))" stroke="hsl(var(--border))" />
      <text x={x + w / 2} y={y + h / 2 + 3.5} textAnchor="middle" fontSize={11} fill="hsl(var(--foreground))">{text}</text>
    </g>
  )
}

export function AreaChartComponent({
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
  curved = true,
  benchmark,
}: AreaChartProps) {
  const allKeys = Object.keys(config).filter(key => config[key].label)
  // Lines ride the right axis when one is shown; the areas own the left.
  const dataKeys = allKeys.filter(key => config[key].kind !== 'line')
  const lineKeys = allKeys.filter(key => config[key].kind === 'line')
  const rightKey = rightAxisDataKey ?? lineKeys[0]
  const rightFormat = rightKey ? config[rightKey]?.format : undefined

  // Calculate Y-axis ticks for gridlines
  const { yAxisTicks, yAxisDomain } = React.useMemo(() => {
    if (!showGrid || !data.length) return { yAxisTicks: [], yAxisDomain: [0, 0] }

    const allValues = data.flatMap(item =>
      dataKeys.map(key => typeof item[key] === 'number' ? item[key] as number : 0)
    )
    const stackedTotals = stacked
      ? data.map(item =>
          dataKeys.reduce((sum, key) => sum + (typeof item[key] === 'number' ? (item[key] as number) : 0), 0)
        )
      : []
    const maxValue = stacked ? Math.max(...stackedTotals) : Math.max(...allValues)
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
  }, [data, dataKeys, showGrid, stacked])

  return (
    <ChartContainer config={config} className={className}>
      <ComposedChart
        accessibilityLayer
        data={data}
        margin={{
          left: showYAxis ? 0 : 0,
          right: showRightYAxis ? 0 : 0,
          top: 4,
          bottom: 0,
        }}
      >
        {showGrid && yAxisTicks.map(tick => (
          <ReferenceLine
            key={tick}
            y={tick}
            stroke="hsl(var(--border))"
            strokeOpacity={0.5}
            yAxisId="left"
          />
        ))}
        {showXAxis && (
          <XAxis
            dataKey="month"
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
            width={48}
            style={{ fontSize: '12px' }}
            tickFormatter={rightFormat ?? formatYAxisTick}
          />
        )}
        {dataKeys.some((key) => config[key].engine) && <PropositionPatternDefs />}
        {dataKeys.map((key) => {
          const engine = config[key].engine
          return (
            <Area
              key={key}
              dataKey={key}
              type={curved ? "monotone" : "linear"}
              fill={engine ? patternFill(engine) : `var(--color-${key})`}
              fillOpacity={engine ? (stacked ? 1 : 0.55) : 0.4}
              stroke={engine ? patternFor(engine).ink : `var(--color-${key})`}
              strokeWidth={engine ? 1 : undefined}
              stackId={stacked ? "a" : undefined}
              yAxisId={showRightYAxis && rightAxisDataKey && key === rightAxisDataKey ? "right" : "left"}
            />
          )
        })}
        {lineKeys.map((key) => (
          <Line
            key={key}
            dataKey={key}
            type={curved ? "monotone" : "linear"}
            stroke={config[key].color ?? 'hsl(var(--foreground))'}
            strokeWidth={2}
            strokeDasharray="6 4"
            dot={false}
            activeDot={{ r: 4 }}
            yAxisId={showRightYAxis && key === rightKey ? "right" : "left"}
          />
        ))}
        {benchmark != null && (
          <ReferenceLine
            y={benchmark.value}
            yAxisId="left"
            stroke="hsl(var(--muted-foreground))"
            strokeDasharray="4 4"
            strokeOpacity={0.8}
            ifOverflow="extendDomain"
            label={benchmark.label ? <BenchmarkBadge text={benchmark.label} /> : undefined}
          />
        )}
        {showTooltip && (
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent />}
          />
        )}
        {showLegend && (
          <ChartLegend content={<ChartLegendContent />} />
        )}
      </ComposedChart>
    </ChartContainer>
  )
} 