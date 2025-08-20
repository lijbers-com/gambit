"use client"

import * as React from "react"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { ChartDataPoint, ChartConfig } from "./chart-types"

export interface RadarChartProps {
  data: ChartDataPoint[]
  config: ChartConfig
  className?: string
  showTooltip?: boolean
  showLegend?: boolean
  showGrid?: boolean
  showAngleAxis?: boolean
  showRadiusAxis?: boolean
  outerRadius?: number
}

export function RadarChartComponent({
  data,
  config,
  className,
  showTooltip = true,
  showLegend = false,
  showGrid = true,
  showAngleAxis = true,
  showRadiusAxis = false,
  outerRadius = 80,
}: RadarChartProps) {
  const dataKeys = Object.keys(config).filter(key => config[key].label)

  return (
    <ChartContainer config={config} className={className}>
      <RadarChart
        data={data}
        margin={{
          top: 20,
          right: 80,
          bottom: 20,
          left: 80,
        }}
        outerRadius={outerRadius}
      >
        {showGrid && <PolarGrid />}
        {showAngleAxis && (
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fontSize: 12 }}
          />
        )}
        {showRadiusAxis && (
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]}
            tick={{ fontSize: 10 }}
          />
        )}
        {dataKeys.map((key) => (
          <Radar
            key={key}
            name={config[key].label}
            dataKey={key}
            stroke={`var(--color-${key})`}
            fill={`var(--color-${key})`}
            fillOpacity={0.1}
            strokeWidth={2}
          />
        ))}
        {showTooltip && (
          <ChartTooltip
            content={<ChartTooltipContent />}
          />
        )}
        {showLegend && (
          <ChartLegend content={<ChartLegendContent />} />
        )}
      </RadarChart>
    </ChartContainer>
  )
} 