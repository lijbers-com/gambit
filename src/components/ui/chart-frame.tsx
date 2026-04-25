import * as React from "react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "./card"

export interface ChartFrameProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode
  subtitle?: React.ReactNode
  metric?: React.ReactNode
  trend?: React.ReactNode
  action?: React.ReactNode
  footer?: React.ReactNode
  chartHeight?: number
  children: React.ReactNode
}

const ChartFrame = React.forwardRef<HTMLDivElement, ChartFrameProps>(
  (
    {
      title,
      subtitle,
      metric,
      trend,
      action,
      footer,
      chartHeight = 240,
      className,
      children,
      ...props
    },
    ref
  ) => (
    <Card ref={ref} padding="compact" className={className} {...props}>
      <CardHeader className="space-y-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-sm font-semibold text-foreground">
              {title}
            </CardTitle>
            {subtitle && (
              <div className="mt-1 text-xs text-muted-foreground">
                {subtitle}
              </div>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
        {(metric || trend) && (
          <div className="mt-2 flex items-baseline gap-2">
            {metric && (
              <div className="text-3xl font-bold leading-tight text-foreground">
                {metric}
              </div>
            )}
            {trend && <div className="text-xs">{trend}</div>}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className={cn("w-full")} style={{ height: chartHeight }}>
          {children}
        </div>
        {footer && (
          <div className="mt-2 flex justify-end">{footer}</div>
        )}
      </CardContent>
    </Card>
  )
)
ChartFrame.displayName = "ChartFrame"

export { ChartFrame }
