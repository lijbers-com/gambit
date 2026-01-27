"use client"

import * as React from "react"
import { useState } from "react"
import { Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { MetricCard, MetricCardProps } from "./card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  variant?: "default" | "graph"
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
  defaultVariant?: "default" | "graph"
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
}

const MetricRow = React.forwardRef<HTMLDivElement, MetricRowProps>(
  ({
    metrics,
    selectedKeys: controlledSelectedKeys,
    onSelectionChange,
    maxVisible = 4,
    className,
    defaultVariant = "graph",
    activeKey,
    onActiveKeyChange,
    removable = true,
    dialogMetrics,
    onDialogMetricClick,
    ...props
  }, ref) => {
    const [internalSelectedKeys, setInternalSelectedKeys] = useState<string[]>(
      controlledSelectedKeys ?? metrics.slice(0, 3).map(m => m.key)
    )

    const selectedKeys = controlledSelectedKeys ?? internalSelectedKeys

    const updateSelection = (newKeys: string[]) => {
      if (!controlledSelectedKeys) {
        setInternalSelectedKeys(newKeys)
      }
      onSelectionChange?.(newKeys)
    }

    const addMetric = (key: string) => {
      if (selectedKeys.length < maxVisible) {
        updateSelection([...selectedKeys, key])
      }
    }

    const removeMetric = (key: string) => {
      updateSelection(selectedKeys.filter(k => k !== key))
    }

    const selectedMetrics = selectedKeys
      .map(key => metrics.find(m => m.key === key))
      .filter(Boolean) as MetricDefinition[]

    const availableMetrics = metrics.filter(m => !selectedKeys.includes(m.key))

    const hasDialogContent = availableMetrics.length > 0 || (dialogMetrics?.length ?? 0) > 0
    const showAddButton = hasDialogContent && selectedMetrics.length < maxVisible

    const colCount = Math.min(selectedMetrics.length + (showAddButton ? 1 : 0), maxVisible + 1)

    return (
      <div
        ref={ref}
        className={cn(
          `grid grid-cols-1 gap-4`,
          colCount === 2 && "md:grid-cols-2",
          colCount === 3 && "md:grid-cols-3",
          colCount === 4 && "md:grid-cols-4",
          colCount >= 5 && "md:grid-cols-5",
          className
        )}
        {...props}
      >
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
            onRemove={removable ? () => removeMetric(metric.key) : undefined}
            isSelected={activeKey !== undefined ? activeKey === metric.key : false}
            onClick={onActiveKeyChange ? () => onActiveKeyChange(
              activeKey === metric.key ? null : metric.key
            ) : undefined}
          />
        ))}
        {showAddButton && (
          <Dialog>
            <DialogTrigger asChild>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors"
              >
                <Plus className="h-8 w-8 text-gray-400" />
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>Select a Metric</DialogTitle>
                <DialogDescription>
                  Choose a metric to add to your dashboard. Click on any metric card to select it.
                </DialogDescription>
              </DialogHeader>
              <div className="max-h-[500px] overflow-y-auto p-4">
                <div className="grid grid-cols-3 gap-4">
                  {availableMetrics.map((metric) => (
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
                      onClick={() => addMetric(metric.key)}
                    />
                  ))}
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
        )}
      </div>
    )
  }
)
MetricRow.displayName = "MetricRow"

export { MetricRow }
