"use client"

import * as React from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
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

  return (
    <ChartContainer config={config} className={className}>
      <LineChart
        accessibilityLayer
        data={data}
        margin={{
          left: 12,
          right: secondaryYAxis ? 12 : 12,
        }}
      >
        {showGrid && <CartesianGrid vertical={false} />}
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
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
          />
        )}
        {secondaryYAxis && (
          <YAxis
            yAxisId="right"
            orientation="right"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            domain={secondaryYAxis.domain}
            label={secondaryYAxis.label ? { value: secondaryYAxis.label, angle: 90, position: 'insideRight' } : undefined}
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