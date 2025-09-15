"use client"

import * as React from "react"
import { Pie, PieChart, Cell, LabelList } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { ChartDataPoint, ChartConfig } from "./chart-types"

export interface PieChartProps {
  data: ChartDataPoint[]
  config: ChartConfig
  className?: string
  showTooltip?: boolean
  showLegend?: boolean
  innerRadius?: number
  outerRadius?: number
  dataKey?: string
  nameKey?: string
  showLabels?: boolean
  labelPosition?: "outside" | "inside" | "center"
}

export function PieChartComponent({
  data,
  config,
  className,
  showTooltip = true,
  showLegend = true,
  innerRadius = 0,
  outerRadius = 80,
  dataKey = "value",
  nameKey = "name",
  showLabels = false,
  labelPosition = "outside",
}: PieChartProps) {
  const renderCustomLabel = (entry: any) => {
    return `${entry[dataKey]}%`;
  };

  return (
    <ChartContainer config={config} className={className}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          fill="#8884d8"
          dataKey={dataKey}
          nameKey={nameKey}
          label={showLabels ? renderCustomLabel : undefined}
          labelLine={false}
        >
          {data.map((entry, index) => {
            const key = entry[nameKey] || entry.name
            const color = config[key]?.color || `hsl(${index * 45}, 70%, 50%)`
            return <Cell key={`cell-${index}`} fill={color} />
          })}
        </Pie>
        {showTooltip && (
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
        )}
        {showLegend && (
          <ChartLegend content={<ChartLegendContent />} />
        )}
      </PieChart>
    </ChartContainer>
  )
} 