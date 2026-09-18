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
import { PropositionPatternDefs, patternFill } from "@/lib/proposition-patterns"

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
  startAngle?: number
  endAngle?: number
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
  startAngle = 0,
  endAngle = 360,
}: PieChartProps) {
  const renderCustomLabel = (entry: any) => {
    // If entry has a label field, use it; otherwise show name + value%
    if (entry.label) {
      return entry.label;
    }
    return entry[nameKey] ? `${entry[nameKey]} ${entry[dataKey]}%` : `${entry[dataKey]}%`;
  };

  const hasPatternedSlice = data.some((entry, index) => {
    const key = String(entry[nameKey] || entry.name || `item-${index}`)
    return !!config[key]?.engine
  })

  return (
    <ChartContainer config={config} className={className}>
      <PieChart>
        {hasPatternedSlice && (
          <defs>
            <PropositionPatternDefs />
          </defs>
        )}
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
          startAngle={startAngle}
          endAngle={endAngle}
        >
          {data.map((entry, index) => {
            const key = String(entry[nameKey] || entry.name || `item-${index}`)
            const engine = config[key]?.engine
            // A slice standing for a proposition wears its pattern, like
            // every other chart; a plain slice (competitors, a total) keeps
            // its flat colour.
            const color = engine ? patternFill(engine) : config[key]?.color || `hsl(${index * 45}, 70%, 50%)`
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