"use client"

import * as React from "react"
import { useState } from "react"
import { Plus, Settings2, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { MetricCard, MetricCardProps } from "./card"
import { Button } from "./button"
import { LineChartComponent } from "./line-chart"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog"

export interface MetricDefinition {
  key: string
  label: string
  value: string
  badgeValue?: string
  badgeVariant?: MetricCardProps["badgeVariant"]
  graphData?: Array<{ value: number }>
  graphColor?: string
  subMetric?: string
  variant?: MetricCardProps["variant"]
  /** Time-series data for the expandable chart panel */
  chartData?: Array<{ day: string; value: number }>
  /** Data for donut / donutLegend variants */
  donutData?: MetricCardProps["donutData"]
  donutColors?: MetricCardProps["donutColors"]
  /** Data for barHorizontal variant */
  productData?: MetricCardProps["productData"]
  /** Data for barVertical variant */
  dateData?: MetricCardProps["dateData"]
  /** Data for budgetStacked variant */
  budgetData?: MetricCardProps["budgetData"]
  /** Aggregate row shown bold at the top of barHorizontal / donutLegend */
  totalRow?: MetricCardProps["totalRow"]
  /** Optional value formatter shared by chart variants */
  valueFormatter?: MetricCardProps["valueFormatter"]
  /** Bespoke chart node rendered in the card body (e.g. a FillRateBar). */
  chart?: MetricCardProps["chart"]
}

export interface MetricRowProps {
  /** All available metrics that can be selected */
  metrics: MetricDefinition[]
  /** Keys of initially selected metrics */
  selectedKeys?: string[]
  /** Called when the selection changes */
  onSelectionChange?: (selectedKeys: string[]) => void
  /** Maximum number of visible metric cards (excluding the add button) */
  maxVisible?: number
  /** Additional class name */
  className?: string
  /** Fallback variant when MetricDefinition doesn't specify one */
  defaultVariant?: MetricCardProps["variant"]
  /** Which card shows the isSelected arrow indicator (for chart filtering) */
  activeKey?: string | null
  /** Fires when a card is clicked for selection */
  onActiveKeyChange?: (key: string | null) => void
  /** Whether cards show remove (X) button on hover */
  removable?: boolean
  /** Extra metrics only shown in the dialog (not part of the visible/selectable pool) */
  dialogMetrics?: MetricDefinition[]
  /** Fires when a dialog-only metric is clicked */
  onDialogMetricClick?: (key: string) => void
  /** Whether to show built-in chart panel when clicking a metric that has chartData */
  showCharts?: boolean
  /** Suppress the "Edit metrics" affordance and the picker dialog entirely.
   *  Use for fixed, non-configurable rows (e.g. cell drawer summaries). */
  hideEditButton?: boolean
  /** Lay the cards out in a single horizontally-scrolling row instead of a
   *  responsive grid. Cards keep a fixed min-width and overflow scrolls —
   *  use when a narrow container (e.g. the cell drawer) can't fit them all. */
  scrollable?: boolean
}

const MetricRow = React.forwardRef<HTMLDivElement, MetricRowProps>(
  ({
    metrics,
    selectedKeys: controlledSelectedKeys,
    onSelectionChange,
    maxVisible = 4,
    className,
    defaultVariant = "graph",
    activeKey: controlledActiveKey,
    onActiveKeyChange,
    removable = true,
    dialogMetrics,
    onDialogMetricClick,
    showCharts = false,
    hideEditButton = false,
    scrollable = false,
    ...props
  }, ref) => {
    const [internalSelectedKeys, setInternalSelectedKeys] = useState<string[]>(
      controlledSelectedKeys ?? metrics.slice(0, maxVisible).map(m => m.key)
    )
    const [internalActiveKey, setInternalActiveKey] = useState<string | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)

    const selectedKeys = controlledSelectedKeys ?? internalSelectedKeys
    const activeKey = controlledActiveKey !== undefined ? controlledActiveKey : internalActiveKey

    const updateSelection = (newKeys: string[]) => {
      if (!controlledSelectedKeys) {
        setInternalSelectedKeys(newKeys)
      }
      onSelectionChange?.(newKeys)
    }

    const removeMetric = (key: string) => {
      updateSelection(selectedKeys.filter(k => k !== key))
    }

    /** Toggle a metric in the picker. No cap — users can select all. */
    const toggleMetric = (key: string) => {
      if (selectedKeys.includes(key)) {
        updateSelection(selectedKeys.filter(k => k !== key))
      } else {
        updateSelection([...selectedKeys, key])
      }
    }

    const selectedMetrics = selectedKeys
      .map(key => metrics.find(m => m.key === key))
      .filter(Boolean) as MetricDefinition[]

    const hasDialogContent = metrics.length > 0 || (dialogMetrics?.length ?? 0) > 0
    const showAddButton = hasDialogContent && !hideEditButton && selectedMetrics.length < metrics.length

    const handleCardClick = (key: string) => {
      const newKey = activeKey === key ? null : key
      if (showCharts) {
        setInternalActiveKey(newKey)
      }
      if (onActiveKeyChange) {
        onActiveKeyChange(newKey)
      }
    }

    const generateDemoChartData = (key: string): Array<{ day: string; value: number }> => {
      const seed = key.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
      const base = 1000 + (seed % 9000)
      const days = []
      for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dayLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        const pseudoRandom = ((seed * (i + 1) * 1337) % 1000) / 1000
        days.push({ day: dayLabel, value: Math.round(base + pseudoRandom * base * 0.4) })
      }
      return days
    }

    const activeMetric = selectedMetrics.find(m => m.key === activeKey)
    const chartPanelData = showCharts && activeKey && activeMetric
      ? (activeMetric.chartData ?? generateDemoChartData(activeKey))
      : null

    return (
      <div ref={ref} className={cn("space-y-3", className)} {...props}>
      {hasDialogContent && !hideEditButton && (
        <div className="flex items-center justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setDialogOpen(true)}
            className="text-muted-foreground hover:text-foreground gap-1.5"
          >
            <Settings2 className="h-4 w-4" />
            Edit metrics
          </Button>
        </div>
      )}
      <div className="flex items-stretch gap-4 overflow-x-auto pb-1">
        {selectedMetrics.map((metric) => (
          <MetricCard
            key={metric.key}
            label={metric.label}
            value={metric.value}
            badgeValue={metric.badgeValue}
            badgeVariant={metric.badgeVariant}
            subMetric={metric.subMetric}
            variant={metric.variant ?? defaultVariant}
            graphData={metric.graphData}
            graphColor={metric.graphColor}
            donutData={metric.donutData}
            donutColors={metric.donutColors}
            productData={metric.productData}
            dateData={metric.dateData}
            budgetData={metric.budgetData}
            totalRow={metric.totalRow}
            valueFormatter={metric.valueFormatter}
            chart={metric.chart}
            className="flex-1 min-w-[240px]"
            onRemove={removable ? () => removeMetric(metric.key) : undefined}
            isSelected={activeKey !== undefined ? activeKey === metric.key : false}
            onClick={(showCharts || onActiveKeyChange) ? () => handleCardClick(metric.key) : undefined}
          />
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Edit metrics</DialogTitle>
            <DialogDescription>
              Pick the metrics to show in the row. The row scrolls horizontally if there are more than fit.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[500px] overflow-y-auto p-4">
            <div className="grid grid-cols-3 gap-4">
              {metrics.map((metric) => {
                const isPicked = selectedKeys.includes(metric.key)
                return (
                  <MetricCard
                    key={metric.key}
                    label={metric.label}
                    value={metric.value}
                    badgeValue={metric.badgeValue}
                    badgeVariant={metric.badgeVariant}
                    subMetric={metric.subMetric}
                    variant={metric.variant ?? defaultVariant}
                    graphData={metric.graphData}
                    graphColor={metric.graphColor}
                    donutData={metric.donutData}
                    donutColors={metric.donutColors}
                    productData={metric.productData}
                    dateData={metric.dateData}
                    budgetData={metric.budgetData}
                    totalRow={metric.totalRow}
                    valueFormatter={metric.valueFormatter}
                    className={cn(
                      "cursor-pointer transition-shadow",
                      isPicked
                        ? "ring-2 ring-primary shadow-md"
                        : "hover:ring-2 hover:ring-primary/40 opacity-90 hover:opacity-100"
                    )}
                    onClick={() => toggleMetric(metric.key)}
                  />
                )
              })}
              {dialogMetrics?.map((metric) => (
                <MetricCard
                  key={metric.key}
                  label={metric.label}
                  value={metric.value}
                  badgeValue={metric.badgeValue}
                  badgeVariant={metric.badgeVariant}
                  subMetric={metric.subMetric}
                  variant={metric.variant ?? defaultVariant}
                  graphData={metric.graphData}
                  graphColor={metric.graphColor}
                  className="cursor-pointer hover:ring-2 hover:ring-primary"
                  onClick={() => onDialogMetricClick?.(metric.key)}
                />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {chartPanelData && (
        <div className="relative bg-white border rounded-lg p-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setInternalActiveKey(null)
              onActiveKeyChange?.(null)
            }}
            aria-label="Close chart"
            className="absolute top-2 right-2 z-10"
          >
            <X className="w-4 h-4" />
          </Button>
          <LineChartComponent
            data={chartPanelData}
            config={{
              value: {
                label: activeMetric?.label || 'Value',
                color: "hsl(var(--chart-1))",
              },
            }}
            showLegend={false}
            showGrid={true}
            showTooltip={true}
            showXAxis={true}
            showYAxis={true}
            className="h-52 w-full"
            xAxisDataKey="day"
          />
        </div>
      )}
      </div>
    )
  }
)
MetricRow.displayName = "MetricRow"

export { MetricRow }
