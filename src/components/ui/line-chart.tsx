"use client"

import * as React from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ReferenceLine } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { ChartDataPoint, ChartConfig } from "./chart-types"

export interface LineChartProps {
  data: ChartDataPoint[]
  config: ChartConfig
  className?: string
  showGrid?: boolean
  showTooltip?: boolean
  showLegend?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
  curved?: boolean
  showDots?: boolean
  xAxisDataKey?: string
  yAxisLabel?: string
  secondaryYAxis?: {
    dataKey: string
    domain?: [number | 'auto' | 'dataMin' | 'dataMax', number | 'auto' | 'dataMin' | 'dataMax']
    label?: string
  }
}

export function LineChartComponent({
  data,
  config,
  className,
  showGrid = true,
  showTooltip = true,
  showLegend = false,
  showXAxis = true,
  showYAxis = true,
  curved = true,
  showDots = true,
  xAxisDataKey = "month",
  yAxisLabel,
  secondaryYAxis,
}: LineChartProps) {
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
      <LineChart
        accessibilityLayer
        data={data}
        margin={{
          left: showYAxis ? 32 : 0,
          right: secondaryYAxis ? 32 : 0,
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
            tickMargin={16}
            ticks={yAxisTicks}
            domain={yAxisDomain}
            width={1}
            style={{ fontSize: '12px' }}
            tick={({ x, y, payload }) => (
              <text x={0} y={y} textAnchor="start" fill="currentColor" fontSize="12px" dy={4}>
                {payload.value}
              </text>
            )}
          />
        )}
        {secondaryYAxis && (
          <YAxis
            yAxisId="right"
            orientation="right"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            ticks={yAxisTicks}
            width={40}
            style={{ fontSize: '12px' }}
            domain={secondaryYAxis.domain || yAxisDomain}
            tick={{ dy: 4 }}
          />
        )}
        {dataKeys.map((key) => (
          <Line
            key={key}
            yAxisId={secondaryYAxis && key === secondaryYAxis.dataKey ? "right" : "left"}
            dataKey={key}
            type={curved ? "monotone" : "linear"}
            stroke={config[key]?.color || `hsl(var(--chart-1))`}
            strokeWidth={2}
            dot={showDots ? { fill: config[key]?.color || `hsl(var(--chart-1))` } : false}
          />
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
      </LineChart>
    </ChartContainer>
  )
} 