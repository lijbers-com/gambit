"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { ChartDataPoint, ChartConfig } from "./chart-types"

export interface AreaChartProps {
  data: ChartDataPoint[]
  config: ChartConfig
  className?: string
  showGrid?: boolean
  showTooltip?: boolean
  showLegend?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
  stacked?: boolean
  curved?: boolean
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
  stacked = false,
  curved = true,
}: AreaChartProps) {
  const dataKeys = Object.keys(config).filter(key => config[key].label)

  return (
    <ChartContainer config={config} className={className}>
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{
          left: 12,
          right: 12,
        }}
        stackOffset={stacked ? "expand" : undefined}
      >
        {showGrid && <CartesianGrid vertical={false} />}
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
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
        )}
        {dataKeys.map((key) => (
          <Area
            key={key}
            dataKey={key}
            type={curved ? "monotone" : "linear"}
            fill={`var(--color-${key})`}
            fillOpacity={0.4}
            stroke={`var(--color-${key})`}
            stackId={stacked ? "a" : undefined}
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
      </AreaChart>
    </ChartContainer>
  )
} 