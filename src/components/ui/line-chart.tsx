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

export interface LineChartProps {
  data: any[]
  config: Record<string, any>
  className?: string
  showGrid?: boolean
  showTooltip?: boolean
  showLegend?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
  curved?: boolean
  showDots?: boolean
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
}: LineChartProps) {
  const dataKeys = Object.keys(config).filter(key => config[key].label)

  return (
    <ChartContainer config={config} className={className}>
      <LineChart
        accessibilityLayer
        data={data}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        {showGrid && <CartesianGrid vertical={false} />}
        {showXAxis && (
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
        )}
        {showYAxis && (
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => `${value}`}
          />
        )}
        {dataKeys.map((key) => (
          <Line
            key={key}
            dataKey={key}
            type={curved ? "monotone" : "linear"}
            stroke={`var(--color-${key})`}
            strokeWidth={2}
            dot={showDots ? { fill: `var(--color-${key})` } : false}
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