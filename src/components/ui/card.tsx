import * as React from "react"
import { LineChart, Line, ResponsiveContainer } from 'recharts'

import { cn } from "@/lib/utils"
import { Badge } from "./badge"

export interface CardWithTabsTab {
  label: string;
  value: string;
  content: React.ReactNode;
}

export interface CardWithTabsProps extends React.HTMLAttributes<HTMLDivElement> {
  tabs: CardWithTabsTab[];
  action?: React.ReactNode;
  defaultTab?: string;
  header?: React.ReactNode;
  className?: string;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function CardWithTabs({
  tabs,
  action,
  defaultTab,
  header,
  className,
  activeTab: controlledActiveTab,
  onTabChange,
  ...props
}: CardWithTabsProps) {
  const [internalActiveTab, setInternalActiveTab] = React.useState(defaultTab || tabs[0]?.value);
  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;
  const setActiveTab = onTabChange || setInternalActiveTab;
  const firstTabValue = tabs[0]?.value;
  const cardClass = firstTabValue && activeTab === firstTabValue ? "w-full rounded-tl-none" : "w-full";
  return (
    <div className={className} {...props}>
      <div className="flex items-end justify-between w-full mb-0" style={{ minHeight: 56 }}>
        <div className="flex gap-0 flex-1">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              className={
                `px-6 py-3 text-sm border border-b-0 rounded-t-lg focus:outline-none transition-colors ` +
                (activeTab === tab.value
                  ? 'font-medium bg-white text-card-foreground border-slate-200 z-10'
                  : 'font-normal bg-transparent text-muted-foreground border-transparent hover:text-card-foreground')
              }
              style={{ position: 'relative', top: 1 }}
              onClick={() => setActiveTab(tab.value)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
        {action && <div className="mb-2">{action}</div>}
      </div>
      <Card className={cardClass}>
        {header && (
          <CardHeader>
            {header}
          </CardHeader>
        )}
        <CardContent>
          {tabs.map((tab) => (
            <div key={tab.value} style={{ display: activeTab === tab.value ? 'block' : 'none' }}>
              {tab.content}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground overflow-hidden",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-[18px] font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// CardSummary: for summary cards with slate-100 background and 14px body text
const CardSummary = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-slate-100 text-card-foreground",
      className
    )}
    {...props}
  />
))
CardSummary.displayName = "CardSummary"

const CardSummaryContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0 text-[14px]", className)} {...props} />
))
CardSummaryContent.displayName = "CardSummaryContent"

// CardSummaryTitle: 18px, font-semibold, h2, for use in CardSummary only
const CardSummaryTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-[18px] font-semibold leading-tight tracking-tight", className)}
    {...props}
  />
))
CardSummaryTitle.displayName = "CardSummaryTitle"

// Usage: <CardSummary><CardHeader><CardSummaryTitle>...</CardSummaryTitle></CardHeader><CardSummaryContent>...</CardSummaryContent></CardSummary>

export interface MetricCardProps {
  label: string;
  value: string;
  subMetric?: string;
  badgeValue?: string;
  badgeVariant?: "default" | "destructive" | "secondary" | "outline" | "success" | "warning" | "info";
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "graph";
  graphData?: Array<{ value: number }>;
  graphColor?: string;
  progress?: number;
}

const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  ({
    label,
    value,
    subMetric,
    badgeValue,
    badgeVariant = "default",
    isSelected = false,
    onClick,
    className,
    variant = "default",
    graphData,
    graphColor = "#8884d8",
    progress,
    ...props
  }, ref) => (
    <Card
      ref={ref}
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md relative",
        isSelected && "shadow-md",
        className
      )}
      onClick={onClick}
      {...props}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-normal text-muted-foreground truncate">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4 pt-0">
        <div>
          <div className="text-3xl font-bold text-foreground truncate transition-all duration-500 ease-in-out">
            {value}
          </div>
          {subMetric && (
            <div className="text-sm text-muted-foreground mt-2 transition-all duration-500 ease-in-out">
              {subMetric}
            </div>
          )}
        </div>
        {variant === "graph" && graphData && (
          <div className="h-10 w-full mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={graphData}>
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={graphColor} 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 3, stroke: graphColor, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        {variant === "graph" && !graphData && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${progress || 75}%` }}
              />
            </div>
          </div>
        )}
        {badgeValue && (
          <div className="flex justify-end mt-3">
            <Badge variant={badgeVariant} className="text-xs transition-all duration-500 ease-in-out">
              {badgeValue}
            </Badge>
          </div>
        )}
      </CardContent>
      {/* Arrow pointing down from the selected card */}
      {isSelected && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <div className="w-4 h-4 bg-white border-r border-b border-gray-200 rotate-45 shadow-sm"></div>
        </div>
      )}
    </Card>
  )
)
MetricCard.displayName = "MetricCard"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, CardSummary, CardSummaryContent, CardSummaryTitle, MetricCard };
