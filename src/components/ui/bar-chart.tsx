"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"

export interface BarChartProps {
  data: any[]
  config: Record<string, any>
  className?: string
  showGrid?: boolean
  showTooltip?: boolean
  showLegend?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
  stacked?: boolean
  horizontal?: boolean
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
  stacked = false,
  horizontal = false,
}: BarChartProps) {
  const dataKeys = Object.keys(config).filter(key => config[key].label)

  return (
    <ChartContainer config={config} className={className}>
      <BarChart
        accessibilityLayer
        data={data}
        layout={horizontal ? "horizontal" : "vertical"}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        {showGrid && <CartesianGrid vertical={!horizontal} horizontal={horizontal} />}
        {showXAxis && (
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
            type={horizontal ? "number" : "category"}
          />
        )}
        {showYAxis && (
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => `${value}`}
            type={horizontal ? "category" : "number"}
          />
        )}
        {dataKeys.map((key) => (
          <Bar
            key={key}
            dataKey={key}
            fill={`var(--color-${key})`}
            stackId={stacked ? "a" : undefined}
            radius={4}
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
      </BarChart>
    </ChartContainer>
  )
} 