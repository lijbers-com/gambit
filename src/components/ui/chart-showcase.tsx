"use client"

import * as React from "react"
import { AreaChartComponent } from "./area-chart"
import { BarChartComponent } from "./bar-chart"
import { LineChartComponent } from "./line-chart"
import { PieChartComponent } from "./pie-chart"
import { RadarChartComponent } from "./radar-chart"

// Sample data for all charts
const chartData = [
  { month: "Jan", desktop: 186, mobile: 80, tablet: 120 },
  { month: "Feb", desktop: 305, mobile: 200, tablet: 180 },
  { month: "Mar", desktop: 237, mobile: 120, tablet: 150 },
  { month: "Apr", desktop: 173, mobile: 190, tablet: 160 },
  { month: "May", desktop: 209, mobile: 130, tablet: 140 },
  { month: "Jun", desktop: 214, mobile: 140, tablet: 170 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile", 
    color: "hsl(var(--chart-2))",
  },
  tablet: {
    label: "Tablet",
    color: "hsl(var(--chart-3))",
  },
}

const pieData = [
  { name: "desktop", value: 186 },
  { name: "mobile", value: 305 },
  { name: "tablet", value: 237 },
]

export function ChartShowcase() {
  return (
    <div className="w-full space-y-8 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Chart Components Showcase</h1>
        <p className="text-muted-foreground">
          A comprehensive collection of chart components built with Recharts and Shadcn/ui
        </p>
      </div>

      {/* Area Charts */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Area Charts</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Basic Area Chart</h3>
            <AreaChartComponent 
              data={chartData} 
              config={chartConfig} 
              showLegend={true}
              className="h-[300px]"
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Stacked Area Chart</h3>
            <AreaChartComponent 
              data={chartData} 
              config={chartConfig} 
              showLegend={true}
              stacked={true}
              className="h-[300px]"
            />
          </div>
        </div>
      </section>

      {/* Bar Charts */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Bar Charts</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Vertical Bar Chart</h3>
            <BarChartComponent 
              data={chartData} 
              config={chartConfig} 
              showLegend={true}
              className="h-[300px]"
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Horizontal Bar Chart</h3>
            <BarChartComponent 
              data={chartData} 
              config={chartConfig} 
              showLegend={true}
              horizontal={true}
              className="h-[300px]"
            />
          </div>
        </div>
      </section>

      {/* Line Charts */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Line Charts</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Curved Line Chart</h3>
            <LineChartComponent 
              data={chartData} 
              config={chartConfig} 
              showLegend={true}
              curved={true}
              className="h-[300px]"
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Linear Line Chart</h3>
            <LineChartComponent 
              data={chartData} 
              config={chartConfig} 
              showLegend={true}
              curved={false}
              className="h-[300px]"
            />
          </div>
        </div>
      </section>

      {/* Pie Charts */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Pie Charts</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Pie Chart</h3>
            <PieChartComponent 
              data={pieData} 
              config={chartConfig} 
              showLegend={true}
              className="h-[300px]"
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Donut Chart</h3>
            <PieChartComponent 
              data={pieData} 
              config={chartConfig} 
              showLegend={true}
              innerRadius={60}
              className="h-[300px]"
            />
          </div>
        </div>
      </section>

      {/* Radar Charts */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Radar Charts</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Skills Comparison</h3>
            <RadarChartComponent 
              data={[
                { subject: 'React', desktop: 90, mobile: 75 },
                { subject: 'TypeScript', desktop: 85, mobile: 80 },
                { subject: 'Node.js', desktop: 80, mobile: 70 },
                { subject: 'Design', desktop: 60, mobile: 95 },
                { subject: 'Testing', desktop: 75, mobile: 85 },
              ]}
              config={chartConfig} 
              showLegend={true}
              className="h-[300px]"
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Performance Metrics</h3>
            <RadarChartComponent 
              data={[
                { subject: 'Speed', desktop: 85, mobile: 78 },
                { subject: 'Reliability', desktop: 90, mobile: 95 },
                { subject: 'Security', desktop: 78, mobile: 92 },
                { subject: 'Usability', desktop: 95, mobile: 70 },
                { subject: 'Scalability', desktop: 82, mobile: 88 },
              ]}
              config={chartConfig} 
              showLegend={true}
              showRadiusAxis={true}
              className="h-[300px]"
            />
          </div>
        </div>
      </section>

      {/* Mixed Charts */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Chart Variations</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Minimal Area</h3>
            <AreaChartComponent 
              data={chartData} 
              config={chartConfig} 
              showGrid={false}
              showXAxis={false}
              showYAxis={false}
              className="h-[200px]"
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Stacked Bar</h3>
            <BarChartComponent 
              data={chartData} 
              config={chartConfig} 
              stacked={true}
              showLegend={true}
              className="h-[200px]"
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Line without Dots</h3>
            <LineChartComponent 
              data={chartData} 
              config={chartConfig} 
              showDots={false}
              className="h-[200px]"
            />
          </div>
        </div>
      </section>
    </div>
  )
} 