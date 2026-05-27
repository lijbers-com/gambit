import * as React from "react"
import { LineChart, Line, PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts'
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Badge } from "./badge"
import { formatYAxisTick } from "./chart-types"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"

const cardVariants = cva(
  "group/card rounded-xl border bg-card text-card-foreground",
  {
    variants: {
      padding: {
        default: "",
        compact: "",
      },
    },
    defaultVariants: { padding: "default" },
  }
)

export type CardPadding = NonNullable<VariantProps<typeof cardVariants>["padding"]>

export interface CardWithTabsTab {
  label: React.ReactNode;
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
                  ? 'font-medium bg-white text-card-foreground border-border z-10'
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

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, padding, ...props }, ref) => (
    <div
      ref={ref}
      data-padding={padding ?? "default"}
      className={cn(cardVariants({ padding }), className)}
      {...props}
    />
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="header"
    className={cn(
      "flex flex-col space-y-1.5 p-6 group-data-[padding=compact]/card:p-4 group-data-[padding=compact]/card:pb-2",
      className
    )}
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
  <div
    ref={ref}
    data-slot="content"
    className={cn(
      "p-6 pt-0 group-data-[padding=compact]/card:px-4 group-data-[padding=compact]/card:pb-4 group-data-[padding=compact]/card:pt-0",
      className
    )}
    {...props}
  />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="footer"
    className={cn(
      "flex items-center p-6 pt-0 group-data-[padding=compact]/card:px-4 group-data-[padding=compact]/card:pb-4 group-data-[padding=compact]/card:pt-0",
      className
    )}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// CardSummary: for summary cards with neutral-100 background and 14px body text
const CardSummary = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-neutral-100 text-card-foreground",
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
  onRemove?: () => void;
  className?: string;
  variant?: "default" | "graph" | "donut" | "donutLegend" | "barHorizontal" | "barVertical" | "budgetStacked";
  graphData?: Array<{ value: number }>;
  graphColor?: string;
  progress?: number;
  donutData?: Array<{ name: string; value: number }>;
  donutColors?: string[];
  /** For barHorizontal variant — top categories with a value each */
  productData?: Array<{ name: string; value: number; color?: string }>;
  /** For barVertical variant — time-series with a value per period */
  dateData?: Array<{ date: string; value: number; color?: string }>;
  /** For budgetStacked variant — per-proposition spent vs total budget */
  budgetData?: Array<{ name: string; spent: number; budget: number; color?: string }>;
  /** For barHorizontal / donutLegend — an aggregate row shown bold at the top */
  totalRow?: { label: string; value: number };
  /** Optional formatter for chart values (e.g. currency). Defaults to toLocaleString. */
  valueFormatter?: (value: number) => string;
  /** Arbitrary content rendered in the card body below the value — use to
   *  drop in a bespoke chart (e.g. a FillRateBar) that the built-in
   *  variants don't cover. */
  chart?: React.ReactNode;
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
    onRemove,
    className,
    variant = "default",
    graphData,
    graphColor = "#8884d8",
    progress,
    donutData,
    donutColors,
    productData,
    dateData,
    budgetData,
    totalRow,
    valueFormatter,
    chart,
    ...props
  }, ref) => (
    <Card
      ref={ref}
      padding="compact"
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md relative group flex flex-col h-full",
        isSelected && "shadow-md",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="absolute top-2 right-2 z-10 h-5 w-5 rounded-full bg-muted/80 hover:bg-muted flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      )}
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-foreground truncate">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {variant !== "donut" && variant !== "donutLegend" && variant !== "barHorizontal" && variant !== "barVertical" && variant !== "budgetStacked" && (
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
        )}
        {chart && <div className="mt-4">{chart}</div>}
        {variant === "graph" && graphData && (
          <div className="h-14 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={graphData} margin={{ top: 2, right: 0, bottom: 2, left: 0 }}>
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
        {variant === "donut" && donutData && (
          <div className="relative mx-auto aspect-square w-40 md:w-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius="68%"
                  outerRadius="100%"
                  dataKey="value"
                  strokeWidth={0}
                  startAngle={90}
                  endAngle={-270}
                >
                  {donutData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={
                        donutColors?.[index] ??
                        (index === 0
                          ? 'hsl(var(--chart-1))'
                          : 'hsl(var(--chart-2))')
                      }
                    />
                  ))}
                </Pie>
                <RechartsTooltip
                  cursor={false}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const item = payload[0];
                    return (
                      <div className="rounded-lg border bg-background px-3 py-2 shadow-md text-sm flex items-center gap-2">
                        <span
                          className="inline-block h-2.5 w-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: item.payload?.fill ?? (item.color as string) }}
                        />
                        <span className="text-muted-foreground">{item.name}</span>
                        <span className="font-semibold ml-1">{(item.value as number).toLocaleString()}</span>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-foreground">{value}</span>
            </div>
          </div>
        )}
        {variant === "graph" && !graphData && progress !== undefined && progress > 0 && (
          <div className="mt-3">
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
        {variant === "donutLegend" && donutData && (() => {
          const fmt = valueFormatter ?? ((v: number) => v.toLocaleString());
          const total = donutData.reduce((sum, d) => sum + d.value, 0);
          const colorFor = (i: number) => donutColors?.[i] ?? `hsl(var(--chart-${(i % 5) + 1}))`;
          return (
            <div className="flex flex-1 items-center gap-4">
              <div className="aspect-square w-24 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius="62%"
                      outerRadius="100%"
                      dataKey="value"
                      strokeWidth={0}
                      startAngle={90}
                      endAngle={-270}
                    >
                      {donutData.map((_, i) => (
                        <Cell key={i} fill={colorFor(i)} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="flex-1 min-w-0 space-y-1 text-xs">
                {totalRow && (
                  <li className="flex items-center gap-1.5 min-w-0 pb-0.5">
                    <span className="font-semibold text-foreground truncate">{totalRow.label}</span>
                    <span className="ml-auto font-semibold tabular-nums whitespace-nowrap text-foreground">
                      {fmt(totalRow.value)}
                    </span>
                  </li>
                )}
                {donutData.map((item, i) => {
                  const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
                  return (
                    <li key={item.name} className="flex items-center gap-1.5 min-w-0">
                      <span
                        aria-hidden
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: colorFor(i) }}
                      />
                      <span className="text-muted-foreground truncate">{item.name}</span>
                      <span className="ml-auto font-medium tabular-nums whitespace-nowrap">
                        {fmt(item.value)}
                        <span className="text-muted-foreground ml-1">({pct}%)</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })()}
        {variant === "barHorizontal" && productData && (() => {
          const fmt = valueFormatter ?? ((v: number) => v.toLocaleString());
          const max = Math.max(...productData.map(d => d.value), totalRow?.value ?? 0, 0) || 1;
          const rows = [
            ...(totalRow ? [{ name: totalRow.label, value: totalRow.value, color: "hsl(var(--foreground))", isTotal: true }] : []),
            ...productData.slice(0, 5).map((item, i) => ({
              name: item.name,
              value: item.value,
              color: item.color ?? `hsl(var(--chart-${(i % 5) + 1}))`,
              isTotal: false,
            })),
          ];
          return (
            <ul className="space-y-2.5 text-xs">
              {rows.map((item) => {
                const pct = (item.value / max) * 100;
                return (
                  <li key={item.name} className={cn("space-y-1", item.isTotal && "pb-1")}>
                    <div className="flex items-center justify-between gap-2">
                      <span className={cn("truncate", item.isTotal ? "font-semibold text-foreground" : "text-muted-foreground")}>{item.name}</span>
                      <span className="font-medium tabular-nums whitespace-nowrap">{fmt(item.value)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          );
        })()}
        {variant === "budgetStacked" && budgetData && (() => {
          const fmt = valueFormatter ?? ((v: number) => v.toLocaleString());
          const spentColor = "hsl(var(--chart-800))";
          const remainingColor = "hsl(var(--chart-300))";
          const totalSpent = budgetData.reduce((sum, d) => sum + d.spent, 0);
          const totalBudget = budgetData.reduce((sum, d) => sum + d.budget, 0);
          const rows = [
            { name: "Media plan", spent: totalSpent, budget: totalBudget, isTotal: true },
            ...budgetData.map((d) => ({ name: d.name, spent: d.spent, budget: d.budget, isTotal: false })),
          ];
          return (
            <TooltipProvider>
              <ul className="space-y-2.5 text-xs">
                {rows.map((row) => {
                  const pct = row.budget > 0 ? Math.round((row.spent / row.budget) * 100) : 0;
                  const spentPct = row.budget > 0 ? (row.spent / row.budget) * 100 : 0;
                  const remaining = Math.max(row.budget - row.spent, 0);
                  return (
                    <li key={row.name} className={cn("space-y-1", row.isTotal && "pb-1")}>
                      <div className="flex items-center justify-between gap-2">
                        <span className={cn("truncate", row.isTotal ? "font-semibold text-foreground" : "text-muted-foreground")}>
                          {row.name}
                        </span>
                        <span className="tabular-nums whitespace-nowrap text-muted-foreground">
                          <span className="font-medium text-foreground">{pct}%</span> spent
                        </span>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="cursor-pointer w-full">
                            <div className="flex h-2.5 rounded-full overflow-hidden border border-border bg-background">
                              <div style={{ width: `${spentPct}%`, backgroundColor: spentColor }} />
                              <div className="flex-1" style={{ backgroundColor: remainingColor }} />
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-background text-foreground border border-border p-3 shadow-lg">
                          <div className="space-y-1.5 text-xs">
                            <div className="font-semibold text-foreground">{row.name}</div>
                            <div className="flex items-center gap-2">
                              <span className="h-2.5 w-2.5 rounded-sm shrink-0 border border-border bg-background" />
                              <span className="text-muted-foreground flex-1">Total budget</span>
                              <span className="font-medium tabular-nums text-foreground">{fmt(row.budget)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="h-2.5 w-2.5 rounded-sm shrink-0" style={{ backgroundColor: spentColor }} />
                              <span className="text-muted-foreground flex-1">Spend</span>
                              <span className="font-medium tabular-nums text-foreground">{fmt(row.spent)} ({pct}%)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="h-2.5 w-2.5 rounded-sm shrink-0" style={{ backgroundColor: remainingColor }} />
                              <span className="text-muted-foreground flex-1">Remaining</span>
                              <span className="font-medium tabular-nums text-foreground">{fmt(remaining)} ({100 - pct}%)</span>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </li>
                  );
                })}
              </ul>
            </TooltipProvider>
          );
        })()}
        {variant === "barVertical" && dateData && (() => {
          const fmt = valueFormatter ?? ((v: number) => v.toLocaleString());
          const tickFmt = valueFormatter ?? formatYAxisTick;
          const lastIndex = dateData.length - 1;
          return (
            <div className="flex-1 w-full min-h-[8rem]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dateData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    width={36}
                    tickCount={3}
                    style={{ fontSize: '10px' }}
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    tickFormatter={tickFmt}
                  />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={4}
                    style={{ fontSize: '10px' }}
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    interval={0}
                    ticks={[dateData[0]?.date, dateData[lastIndex]?.date].filter(Boolean) as string[]}
                  />
                  <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                    {dateData.map((d, i) => (
                      <Cell key={i} fill={d.color ?? "hsl(var(--chart-1))"} />
                    ))}
                  </Bar>
                  <RechartsTooltip
                    cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const item = payload[0];
                      return (
                        <div className="rounded-lg border bg-background px-2 py-1.5 shadow-md text-xs">
                          <div className="text-muted-foreground">{item.payload.date}</div>
                          <div className="font-semibold tabular-nums">{fmt(item.value as number)}</div>
                        </div>
                      );
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          );
        })()}
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
          <div className="w-4 h-4 bg-white border-r border-b border-border rotate-45 shadow-sm"></div>
        </div>
      )}
    </Card>
  )
)
MetricCard.displayName = "MetricCard"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, CardSummary, CardSummaryContent, CardSummaryTitle, MetricCard };
