"use client"

import * as React from "react"
import { Funnel, FunnelChart, Cell, LabelList } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { ChartDataPoint, ChartConfig } from "./chart-types"

export interface FunnelChartProps {
  data: ChartDataPoint[]
  config: ChartConfig
  className?: string
  showTooltip?: boolean
  showLabels?: boolean
  dataKey?: string
  nameKey?: string
}

export function FunnelChartComponent({
  data,
  config,
  className,
  showTooltip = true,
  showLabels = true,
  dataKey = "value",
  nameKey = "name",
}: FunnelChartProps) {
  // Normalize the data to prevent segments from becoming too small
  const normalizedData = data.map((item, index) => {
    if (index === 0) return item; // Keep first item as is
    
    // Calculate a minimum width for visibility (e.g., 5% of the first value)
    const minWidth = Number(data[0][dataKey]) * 0.05;
    const normalizedValue = Math.max(Number(item[dataKey]), minWidth);
    
    return {
      ...item,
      [dataKey]: normalizedValue,
      originalValue: item[dataKey], // Keep original for tooltip
    };
  });

  const renderCustomLabel = (entry: any) => {
    const percentage = entry.percentage || Math.round(Number(entry.originalValue || entry[dataKey]) / Number(data[0][dataKey]) * 100);
    const value = entry.originalValue || entry[dataKey];
    return `${entry[nameKey]}: ${value.toLocaleString()} (${percentage}%)`;
  };

  const renderCustomTooltip = (props: any) => {
    if (props.active && props.payload && props.payload.length) {
      const data = props.payload[0].payload;
      const value = data.originalValue || data[dataKey];
      const percentage = data.percentage || Math.round((Number(value) / Number(normalizedData[0].originalValue || normalizedData[0][dataKey])) * 100);
      
      return (
        <div className="bg-white p-2 border rounded shadow">
          <p>{`${data[nameKey]}: ${value.toLocaleString()}`}</p>
          <p>{`Percentage: ${percentage}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ChartContainer config={config} className={className}>
      <FunnelChart>
        <Funnel
          data={normalizedData}
          dataKey={dataKey}
          nameKey={nameKey}
          label={false}
        >
          {normalizedData.map((entry, index) => {
            const key = String(entry[nameKey] || entry.name || `item-${index}`)
            const color = config[key]?.color || `hsl(${index * 45}, 70%, 50%)`
            return <Cell key={`cell-${index}`} fill={color} />
          })}
        </Funnel>
        {showTooltip && (
          <ChartTooltip
            cursor={false}
            content={renderCustomTooltip}
          />
        )}
      </FunnelChart>
    </ChartContainer>
  )
}