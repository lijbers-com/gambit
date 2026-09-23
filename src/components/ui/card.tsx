import * as React from "react"
import { PropositionPatternDefs, PropositionSwatch, patternFill, patternFor, patternBackground, type PatternKey } from "@/lib/proposition-patterns"
import { LineChart, Line, PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts'
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Badge } from "./badge"
import { formatYAxisTick } from "./chart-types"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"
import { TabActionGroup, TAB_LABEL } from "./tab-actions"
import { NotificationDot } from "./notification-dot"
import { TabStrip } from "./tab-strip"

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
  /** Unread count for this tab. Anything above 0 puts a red dot on the tab so
   *  the reader sees there is something new without opening it; the number
   *  shows once there is room for it (capped at 9, like the header bell). */
  badgeCount?: number;
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

/**
 * Reorder a CardWithTabs tab list so one tab leads. The work tab — Bookings,
 * Campaigns & bookings — is both the landing tab and the first in the strip on
 * every template, so the reorder lives here rather than in ten hand-sorted
 * arrays. Unknown values leave the list untouched.
 */
export function tabFirst<T extends { value: string }>(tabs: T[], value: string): T[] {
  const i = tabs.findIndex((t) => t.value === value);
  return i <= 0 ? tabs : [tabs[i], ...tabs.slice(0, i), ...tabs.slice(i + 1)];
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
        <TabStrip className="flex-1" tabs={tabs} value={activeTab ?? ''} onChange={setActiveTab} />
        {/* Actions collapse to icons when the tabs need the room. */}
        {action && <TabActionGroup className="mb-2">{action}</TabActionGroup>}
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
  /** The headline number. Leave unset on a chart card — a card is either a
   *  number or a chart, and `chart` only renders when there is no value. */
  value?: string;
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
  /** The proposition behind each slice — drawn in its pattern, so a donut
   *  splits the same way the stacked charts do. Wins over donutColors. */
  donutEngines?: PatternKey[];
  /** For barHorizontal variant — top categories with a value each */
  productData?: Array<{ name: string; value: number; color?: string }>;
  /** For barVertical variant — time-series with a value per period */
  dateData?: Array<{ date: string; value: number; color?: string }>;
  /** For budgetStacked variant — per-proposition spent vs total budget */
  /** `engine` lets a segment wear its proposition's tint and pattern — the
   *  same mark it has on every chart — instead of a flat colour. */
  budgetData?: Array<{ name: string; spent: number; budget: number; color?: string; engine?: PatternKey }>;
  /** For barHorizontal / donutLegend — an aggregate row shown bold at the top */
  totalRow?: { label: string; value: number };
  /** Optional formatter for chart values (e.g. currency). Defaults to toLocaleString. */
  valueFormatter?: (value: number) => string;
  /** Arbitrary content rendered in the card body below the value — use to
   *  drop in a bespoke chart (e.g. a FillRateBar) that the built-in
   *  variants don't cover. */
  chart?: React.ReactNode;
}

// ─────────────────────────────────────────────────────────────────────
// Multi-row card bodies render only the "Media plan" aggregate by
// default so the row stays compact. The full per-proposition
// breakdown is exposed via separate `<…Detail>` components that
// MetricRow can drop into its expand-on-click chart panel below
// the row.
// ─────────────────────────────────────────────────────────────────────

const colorFromIndex = (i: number, custom?: string) =>
  custom ?? `hsl(var(--chart-${(i % 5) + 1}))`;

const DonutLegendBody = ({
  donutData,
  totalRow,
  valueFormatter,
}: {
  donutData: NonNullable<MetricCardProps['donutData']>;
  totalRow?: MetricCardProps['totalRow'];
  valueFormatter?: MetricCardProps['valueFormatter'];
}) => {
  const fmt = valueFormatter ?? ((v: number) => v.toLocaleString());
  const total = donutData.reduce((sum, d) => sum + d.value, 0);
  return (
    <div className="flex-1 flex flex-col">
      {totalRow ? (
        <div>
          <div className="text-3xl font-bold text-foreground truncate">
            {fmt(totalRow.value)}
          </div>
          <div className="text-sm text-muted-foreground mt-2">{totalRow.label}</div>
        </div>
      ) : (
        <div className="text-3xl font-bold text-foreground truncate">{fmt(total)}</div>
      )}
    </div>
  );
};

const BarHorizontalBody = ({
  productData,
  totalRow,
  valueFormatter,
}: {
  productData: NonNullable<MetricCardProps['productData']>;
  totalRow?: MetricCardProps['totalRow'];
  valueFormatter?: MetricCardProps['valueFormatter'];
}) => {
  const fmt = valueFormatter ?? ((v: number) => v.toLocaleString());
  const max = Math.max(...productData.map((d) => d.value), totalRow?.value ?? 0, 0) || 1;
  const propSegments = productData.slice(0, 5).map((item, i) => ({
    name: item.name,
    value: item.value,
    color: colorFromIndex(i, item.color),
  }));
  const propSum = propSegments.reduce((s, p) => s + p.value, 0);
  const totalPct = totalRow ? (totalRow.value / max) * 100 : 0;
  return (
    <div className="flex-1 flex flex-col">
      {totalRow ? (
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="font-semibold text-foreground truncate">{totalRow.label}</span>
            <span className="font-medium tabular-nums whitespace-nowrap">{fmt(totalRow.value)}</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div className="flex h-full" style={{ width: `${totalPct}%` }}>
              {propSegments.map((seg, segIdx) => (
                <div
                  key={`${seg.name}-${segIdx}`}
                  style={{
                    width: `${propSum > 0 ? (seg.value / propSum) * 100 : 0}%`,
                    backgroundColor: seg.color,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-3xl font-bold text-foreground truncate">{fmt(propSum)}</div>
      )}
    </div>
  );
};

const BudgetStackedBody = ({
  budgetData,
  valueFormatter,
}: {
  budgetData: NonNullable<MetricCardProps['budgetData']>;
  valueFormatter?: MetricCardProps['valueFormatter'];
}) => {
  const fmt = valueFormatter ?? ((v: number) => v.toLocaleString());
  const remainingColor = 'rgb(var(--neutral-200))';
  const totalBudget = budgetData.reduce((sum, d) => sum + d.budget, 0);
  const totalSpent = budgetData.reduce((sum, d) => sum + d.spent, 0);
  const pct = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
  const totalSegments = budgetData.map((d, i) => ({
    name: d.name,
    value: d.spent,
    color: colorFromIndex(i, d.color),
  }));
  return (
    <div className="flex-1 flex flex-col">
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="font-semibold text-foreground truncate">Media plan</span>
          <span className="tabular-nums whitespace-nowrap text-muted-foreground">
            <span className="font-medium text-foreground">{pct}%</span> spent
          </span>
        </div>
        <div className="flex h-2.5 rounded-full overflow-hidden border border-border bg-background">
          {totalSegments.map((seg, segIdx) => (
            <div
              key={`${seg.name}-${segIdx}`}
              style={{
                width: `${totalBudget > 0 ? (seg.value / totalBudget) * 100 : 0}%`,
                backgroundColor: seg.color,
              }}
            />
          ))}
          <div className="flex-1" style={{ backgroundColor: remainingColor }} />
        </div>
      </div>
    </div>
  );
};

// ── Full per-proposition detail views — exposed for MetricRow's
// chart panel via MetricDefinition.expandedContent. ──────────────────

export const DonutLegendDetail = ({
  donutData,
  donutColors,
  donutEngines,
  totalRow,
  valueFormatter,
}: {
  donutData: NonNullable<MetricCardProps['donutData']>;
  donutColors?: MetricCardProps['donutColors'];
  donutEngines?: MetricCardProps['donutEngines'];
  totalRow?: MetricCardProps['totalRow'];
  valueFormatter?: MetricCardProps['valueFormatter'];
}) => {
  const fmt = valueFormatter ?? ((v: number) => v.toLocaleString());
  const total = donutData.reduce((sum, d) => sum + d.value, 0);
  const colorFor = (i: number) => donutColors?.[i] ?? `hsl(var(--chart-${(i % 5) + 1}))`;
  const fillFor = (i: number) => (donutEngines?.[i] ? patternFill(donutEngines[i]) : colorFor(i));
  return (
    <div className="flex items-center gap-6">
      <div className="aspect-square w-40 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            {donutEngines && <PropositionPatternDefs />}
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
                <Cell key={i} fill={fillFor(i)} stroke="hsl(var(--card))" strokeWidth={2} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="flex-1 min-w-0 space-y-1.5 text-sm">
        {totalRow && (
          <li className="flex items-center gap-2 min-w-0 pb-1 border-b border-border">
            <span className="font-semibold text-foreground truncate">{totalRow.label}</span>
            <span className="ml-auto font-semibold tabular-nums whitespace-nowrap text-foreground">
              {fmt(totalRow.value)}
            </span>
          </li>
        )}
        {donutData.map((item, i) => {
          const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
          return (
            <li key={`${item.name}-${i}`} className="flex items-center gap-2 min-w-0">
              {donutEngines?.[i] ? (
                <PropositionSwatch engine={donutEngines[i]} size={10} />
              ) : (
                <span aria-hidden className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: colorFor(i) }} />
              )}
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
};

export const BarHorizontalDetail = ({
  productData,
  totalRow,
  valueFormatter,
}: {
  productData: NonNullable<MetricCardProps['productData']>;
  totalRow?: MetricCardProps['totalRow'];
  valueFormatter?: MetricCardProps['valueFormatter'];
}) => {
  const fmt = valueFormatter ?? ((v: number) => v.toLocaleString());
  const max = Math.max(...productData.map((d) => d.value), totalRow?.value ?? 0, 0) || 1;
  const propSegments = productData.slice(0, 5).map((item, i) => ({
    name: item.name,
    value: item.value,
    color: colorFromIndex(i, item.color),
  }));
  const propSum = propSegments.reduce((s, p) => s + p.value, 0);
  type Row =
    | { name: string; value: number; color: string; isTotal: false }
    | { name: string; value: number; isTotal: true; segments: typeof propSegments };
  const rows: Row[] = [
    ...(totalRow ? [{ name: totalRow.label, value: totalRow.value, isTotal: true as const, segments: propSegments }] : []),
    ...propSegments.map((p) => ({ name: p.name, value: p.value, color: p.color, isTotal: false as const })),
  ];
  return (
    <ul className="space-y-3 text-sm">
      {rows.map((item, idx) => {
        const pct = (item.value / max) * 100;
        return (
          <li key={`${item.name}-${idx}`} className={cn('space-y-1', item.isTotal && 'pb-2 border-b border-border')}>
            <div className="flex items-center justify-between gap-2">
              <span className={cn('truncate', item.isTotal ? 'font-semibold text-foreground' : 'text-muted-foreground')}>
                {item.name}
              </span>
              <span className="font-medium tabular-nums whitespace-nowrap">{fmt(item.value)}</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              {item.isTotal ? (
                <div className="flex h-full transition-all duration-500" style={{ width: `${pct}%` }}>
                  {item.segments.map((seg, segIdx) => (
                    <div
                      key={`${seg.name}-${segIdx}`}
                      style={{
                        width: `${propSum > 0 ? (seg.value / propSum) * 100 : 0}%`,
                        backgroundColor: seg.color,
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: item.color }}
                />
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

/** One segment of a budget bar — a campaign's ALLOCATION, in its
 *  proposition's tint with the proposition's pattern laid faintly over it,
 *  the same mark it wears on every chart. Without an engine, a flat colour. */
const BudgetSegment = ({ widthPct, color, engine }: { widthPct: number; color: string; engine?: PatternKey }) => {
  if (widthPct <= 0) return null;
  const p = engine ? patternFor(engine) : undefined;
  return (
    <div className="relative shrink-0" style={{ width: `${widthPct}%`, backgroundColor: p ? p.base : color }}>
      {p && engine && (
        <div className="absolute inset-0" style={{ ...patternBackground(engine, { ink: p.ink, size: 8 }), opacity: 0.45 }} />
      )}
    </div>
  );
};

/** Spend, drawn under the allocations as one thin dark line from the left —
 *  a progress mark, not another colour, so the bar stays the split of the
 *  budget and the eye reads "this far in" without a second palette. */
const BudgetSpentLine = ({ widthPct }: { widthPct: number }) => (
  <div className="pointer-events-none absolute inset-x-1.5 bottom-[3px] h-[3px]">
    <div className="h-full rounded-full bg-foreground/55" style={{ width: `${Math.min(widthPct, 100)}%` }} />
  </div>
);

/** The swatch for a segment in a tooltip — the pattern itself when the
 *  segment has a proposition, a colour dot otherwise. */
const BudgetSwatch = ({ color, engine, round }: { color: string; engine?: PatternKey; round?: boolean }) =>
  engine ? (
    <PropositionSwatch engine={engine} size={10} className="shrink-0" />
  ) : (
    <span className={cn('h-2.5 w-2.5 shrink-0', round ? 'rounded-full' : 'rounded-sm')} style={{ backgroundColor: color }} />
  );

/** The spend line's swatch in a tooltip. */
const SpentSwatch = () => <span className="inline-block h-[3px] w-2.5 shrink-0 rounded-full bg-foreground/55" />;

/** Open budget — money the plan has but no campaign has been given yet:
 *  the bare track, plain, so nothing competes with the allocations. */
const OPEN_BUDGET_FILL: React.CSSProperties = { backgroundColor: 'hsl(var(--background))' };

export const BudgetStackedDetail = ({
  budgetData,
  valueFormatter,
  total,
  showSpend = true,
}: {
  budgetData: NonNullable<MetricCardProps['budgetData']>;
  valueFormatter?: MetricCardProps['valueFormatter'];
  /** See BudgetStackedMini — spend is only drawn and stated for a plan that
   *  is running or paused. */
  showSpend?: boolean;
  /** The plan's own budget. The "Media plan" row is then scaled to it: each
   *  campaign's allocation in its tint and pattern, whatever no campaign has
   *  yet as the bare track — open budget — and spend as the line beneath. */
  total?: number;
}) => {
  const fmt = valueFormatter ?? ((v: number) => v.toLocaleString());
  const hasPlanTotal = total !== undefined;
  const allocated = budgetData.reduce((sum, d) => sum + d.budget, 0);
  const totalBudget = Math.max(total ?? 0, allocated);
  const openBudget = Math.max(totalBudget - allocated, 0);
  type Segment = { name: string; value: number; spent: number; color: string; engine?: PatternKey };
  const rows: Array<{ name: string; budget: number; segments: Segment[]; isTotal: boolean }> = [
    {
      name: 'Media plan',
      budget: totalBudget,
      segments: budgetData.map((d, i) => ({ name: d.name, value: d.budget, spent: Math.min(d.spent, d.budget), color: colorFromIndex(i, d.color), engine: d.engine })),
      isTotal: true,
    },
    ...budgetData.map((d, i) => ({
      name: d.name,
      budget: d.budget,
      segments: [{ name: d.name, value: d.budget, spent: Math.min(d.spent, d.budget), color: colorFromIndex(i, d.color), engine: d.engine }],
      isTotal: false,
    })),
  ];
  return (
    <TooltipProvider>
      <ul className="space-y-3 text-sm">
        {rows.map((row, idx) => {
          const rowSpent = row.segments.reduce((s, seg) => s + seg.spent, 0);
          const pct = row.budget > 0 ? Math.round((rowSpent / row.budget) * 100) : 0;
          const remaining = Math.max(row.budget - rowSpent, 0);
          const share = (n: number) => (row.budget > 0 ? Math.round((n / row.budget) * 100) : 0);
          return (
            <li key={`${row.name}-${idx}`} className={cn('space-y-1', row.isTotal && 'pb-2')}>
              <div className="flex items-center justify-between gap-2">
                <span className={cn('truncate', row.isTotal ? 'font-semibold text-foreground' : 'text-muted-foreground')}>
                  {row.name}
                </span>
                <span className="tabular-nums whitespace-nowrap text-muted-foreground">
                  {row.isTotal && hasPlanTotal ? (
                    <>
                      <span className="font-medium text-foreground">{fmt(allocated)}</span> allocated · <span className="font-medium text-foreground">{fmt(openBudget)}</span> open
                      {showSpend && <> · <span className="font-medium text-foreground">{pct}%</span> spent</>}
                    </>
                  ) : showSpend ? (
                    <>
                      <span className="font-medium text-foreground">{fmt(rowSpent)}</span> of {fmt(row.budget)} · <span className="font-medium text-foreground">{pct}%</span> spent
                    </>
                  ) : (
                    <><span className="font-medium text-foreground">{fmt(row.budget)}</span> allocated</>
                  )}
                </span>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-pointer w-full">
                    <div className="relative flex h-4 overflow-hidden rounded-full border border-border bg-background">
                      {row.segments.map((seg, segIdx) => (
                        <BudgetSegment
                          key={`${seg.name}-${segIdx}`}
                          widthPct={row.budget > 0 ? (seg.value / row.budget) * 100 : 0}
                          color={seg.color}
                          engine={seg.engine}
                        />
                      ))}
                      <div className="flex-1" style={OPEN_BUDGET_FILL} />
                      {showSpend && <BudgetSpentLine widthPct={row.budget > 0 ? (rowSpent / row.budget) * 100 : 0} />}
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
                    {row.isTotal && row.segments.map((seg, segIdx) => (
                      <div key={`${seg.name}-${segIdx}`} className="flex items-center gap-2">
                        <BudgetSwatch color={seg.color} engine={seg.engine} />
                        <span className="text-muted-foreground flex-1">{seg.name}</span>
                        <span className="font-medium tabular-nums text-foreground">
                          {fmt(seg.value)}
                          {row.budget > 0 ? ` (${share(seg.value)}%)` : ''}
                        </span>
                      </div>
                    ))}
                    {row.isTotal && hasPlanTotal && (
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-sm shrink-0 border border-border" style={OPEN_BUDGET_FILL} />
                        <span className="text-muted-foreground flex-1">Open budget</span>
                        <span className="font-medium tabular-nums text-foreground">
                          {fmt(openBudget)} ({share(openBudget)}%)
                        </span>
                      </div>
                    )}
                    {showSpend && (
                      <div className="flex items-center gap-2">
                        <SpentSwatch />
                        <span className="text-muted-foreground flex-1">Spent</span>
                        <span className="font-medium tabular-nums text-foreground">
                          {fmt(rowSpent)} ({pct}%)
                        </span>
                      </div>
                    )}
                    {showSpend && !row.isTotal && (
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 shrink-0" />
                        <span className="text-muted-foreground flex-1">Remaining</span>
                        <span className="font-medium tabular-nums text-foreground">
                          {fmt(remaining)} ({100 - pct}%)
                        </span>
                      </div>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </li>
          );
        })}
      </ul>
    </TooltipProvider>
  );
};

// ── Compact, chart-only previews — drop into MetricCardProps.chart so
// the simple value+sub card grows a small visual breakdown without
// leaving its single-row layout. The full detail still lives in the
// click-to-expand panel below the row.

/** Multi-color stacked bar: per-proposition spend vs total budget. */
/** Shared styling for the small figures on the mini charts. */
const CHART_FIGURE = 'text-[11px] font-medium tabular-nums text-muted-foreground';

export const BudgetStackedMini = ({
  budgetData,
  caption,
  total,
  labelled = false,
  emptyLabel,
  showSpend = true,
}: {
  budgetData: NonNullable<MetricCardProps['budgetData']>;
  /** Small line above the bar — where the bar's own scale is stated, so the
   *  card keeps the same shape as the others: figure, then chart. */
  caption?: React.ReactNode;
  /** The plan's own budget. When it is more than the campaigns add up to,
   *  the bar is scaled to it and the difference shows as open budget —
   *  money not yet given to any campaign. Defaults to the campaigns' sum. */
  total?: number;
  /** A taller bar that states its own figures — spent and allocated at the
   *  left, open at the right — and draws spend as a line beneath the
   *  allocations, so the card needs no budget line under it. */
  labelled?: boolean;
  /** What the empty track says when there is nothing to show (labelled only). */
  emptyLabel?: string;
  /** Whether spend is a fact worth showing. A plan still in review has none;
   *  a completed plan's is history. Only a running or paused plan is
   *  "this far in", so only then is the line drawn and the figure stated. */
  showSpend?: boolean;
}) => {
  const allocated = budgetData.reduce((sum, d) => sum + d.budget, 0);
  const spent = budgetData.reduce((sum, d) => sum + Math.min(d.spent, d.budget), 0);
  const scale = Math.max(total ?? 0, allocated);
  const open = Math.max(scale - allocated, 0);
  const fmtBar = (n: number) =>
    n >= 1000 ? `€${(n / 1000).toFixed(1)}K` : `€${Math.round(n).toLocaleString()}`;
  const pct = (n: number) => (scale > 0 ? (n / scale) * 100 : 0);
  // The figures ride on the bar as badges, so they read on any segment
  // colour under them.
  const chip = 'bg-background tabular-nums';
  return (
    <div>
    {caption && (
      <div className={cn('mb-1', CHART_FIGURE)}>{caption}</div>
    )}
    {/* The bar is the split of the budget: each campaign's allocation in its
        proposition's tint and pattern, what no campaign has yet as the bare
        track. Spend is the one thin line beneath — how far in the plan is. */}
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn('relative flex cursor-default overflow-hidden rounded-full border border-border bg-background', labelled ? 'h-8' : 'h-2.5')}>
            {budgetData.map((d, i) => (
              <BudgetSegment key={`${d.name}-${i}`} widthPct={pct(d.budget)} color={colorFromIndex(i, d.color)} engine={d.engine} />
            ))}
            <div className="flex-1" style={OPEN_BUDGET_FILL} />
            {labelled && showSpend && scale > 0 && <BudgetSpentLine widthPct={pct(spent)} />}
            {labelled && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-between gap-2 px-1">
                {scale > 0 ? (
                  <>
                    <Badge className={cn(chip, 'min-w-0')}>
                      <span className="truncate">{showSpend ? `${fmtBar(spent)} spent · ` : ''}{fmtBar(allocated)} allocated</span>
                    </Badge>
                    {open > 0 && <Badge className={cn(chip, 'shrink-0')}>{fmtBar(open)} open</Badge>}
                  </>
                ) : (
                  emptyLabel && <Badge variant="info" className="bg-background">{emptyLabel}</Badge>
                )}
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="p-2.5">
          <div className="space-y-1.5">
            {budgetData.map((d, i) => (
              <div key={`${d.name}-tip-${i}`} className="flex items-center justify-between gap-4 text-xs">
                <span className="inline-flex items-center gap-1.5">
                  <BudgetSwatch color={colorFromIndex(i, d.color)} engine={d.engine} round />
                  {d.name}
                </span>
                <span className="tabular-nums">
                  {fmtBar(d.budget)}
                  {scale > 0 && (
                    <span className="ml-1 text-muted-foreground">
                      ({Math.round(pct(d.budget))}%)
                    </span>
                  )}
                </span>
              </div>
            ))}
            {total !== undefined && open > 0 && (
              <div className="flex items-center justify-between gap-4 text-xs">
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <span className="h-2 w-2 shrink-0 rounded-sm border border-border" style={OPEN_BUDGET_FILL} />
                  Open
                </span>
                <span className="tabular-nums">
                  {fmtBar(open)}
                  {scale > 0 && <span className="ml-1 text-muted-foreground">({Math.round(pct(open))}%)</span>}
                </span>
              </div>
            )}
            {showSpend && (
              <div className="flex items-center justify-between gap-4 border-t border-border/60 pt-1.5 text-xs">
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <SpentSwatch />
                  Spent
                </span>
                <span className="tabular-nums">
                  {fmtBar(spent)}
                  {scale > 0 && <span className="ml-1 text-muted-foreground">({Math.round(pct(spent))}%)</span>}
                </span>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    </div>
  );
};

/** Compact donut: per-proposition share of a total. */
export const DonutMini = ({
  donutData,
  donutColors,
  donutEngines,
}: {
  donutData: NonNullable<MetricCardProps['donutData']>;
  donutColors?: MetricCardProps['donutColors'];
  donutEngines?: MetricCardProps['donutEngines'];
}) => {
  const colorFor = (i: number) => donutColors?.[i] ?? `hsl(var(--chart-${(i % 5) + 1}))`;
  const fillFor = (i: number) => (donutEngines?.[i] ? patternFill(donutEngines[i]) : colorFor(i));
  return (
    <div className="h-16 w-16">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          {donutEngines && <PropositionPatternDefs />}
          <Pie
            data={donutData}
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="100%"
            dataKey="value"
            strokeWidth={0}
            startAngle={90}
            endAngle={-270}
          >
            {donutData.map((_, i) => (
              <Cell key={i} fill={fillFor(i)} stroke="hsl(var(--card))" strokeWidth={1.5} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

/** Stacked vertical bars — one slim bar per proposition value. */
/** Compact trend line — for a metric read over time rather than split by
 *  proposition (ROAS, CTR). Same family as the other *Mini charts. */
export const LineMini = ({
  data,
  color = 'hsl(var(--chart-1))',
}: {
  data: Array<{ value: number }>;
  color?: string;
}) => (
  <div className="h-14 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 2, right: 0, bottom: 2, left: 0 }}>
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

/**
 * One bar per item, standing on a shared baseline — for comparing a rate
 * (ROAS, CTR) across propositions, where the horizontal variant's stacked
 * tracks read as a ranking rather than a comparison.
 */
export const BarVerticalMini = ({
  productData,
  valueFormatter,
}: {
  productData: NonNullable<MetricCardProps['productData']>;
  /** Formats the small figure above each bar. Defaults to a plain number. */
  valueFormatter?: (value: number) => string;
}) => {
  const max = Math.max(...productData.map((d) => d.value), 1);
  const fmt = valueFormatter ?? ((v: number) => v.toLocaleString());
  // Nothing delivered yet: keep the shape, drop the colour and the ranking.
  const empty = productData.every((d) => d.value === 0);
  return (
    <div className="flex h-16 items-end gap-1.5">
      {productData.slice(0, 6).map((item, i) => (
        <div key={`${item.name}-${i}`} className="flex h-full flex-1 flex-col justify-end" title={`${item.name}: ${fmt(item.value)}`}>
          {/* The bars compare, the figure states — without it the reader can
              rank the propositions but can't name any of the values. */}
          <div className={cn('mb-0.5 truncate text-center', CHART_FIGURE)}>
            {fmt(item.value)}
          </div>
          <div
            className="w-full rounded-sm transition-all duration-500"
            style={{
              // A zero-value bar still gets a sliver so the proposition is
              // visibly present rather than missing from the chart.
              height: empty ? '20%' : `${Math.max((item.value / max) * 100, 4)}%`,
              backgroundColor: empty ? 'rgb(var(--neutral-200))' : colorFromIndex(i, item.color),
            }}
          />
        </div>
      ))}
    </div>
  );
};

export const BarHorizontalMini = ({
  productData,
}: {
  productData: NonNullable<MetricCardProps['productData']>;
}) => {
  const max = Math.max(...productData.map((d) => d.value), 1);
  return (
    <div className="space-y-1">
      {productData.slice(0, 5).map((item, i) => (
        <div key={`${item.name}-${i}`} className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${(item.value / max) * 100}%`,
              backgroundColor: colorFromIndex(i, item.color),
            }}
          />
        </div>
      ))}
    </div>
  );
};

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
    donutEngines,
    productData,
    dateData,
    budgetData,
    totalRow,
    valueFormatter,
    chart,
    ...props
  }, ref) => {

    return (
    <Card
      ref={ref}
      padding="compact"
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md relative group flex flex-col",
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
        {/* Every card leads with its number: the headline figure is what the
            row is read for, and the chart underneath says how that figure is
            made up. A card without a `value` simply starts at its sub-line. */}
        {(value || subMetric) && (
          // The headline takes its natural height; the chart block below takes
          // the slack and centres in it, and the badge row anchors the bottom —
          // so cards stretched to the tallest in the row centre their charts
          // instead of pinning them to the floor.
          <div>
            {value && (
              <div className="text-3xl font-bold text-foreground truncate transition-all duration-500 ease-in-out">
                {value}
              </div>
            )}
            {subMetric && (
              <div
                className={cn(
                  "text-xs text-muted-foreground transition-all duration-500 ease-in-out",
                  value && "mt-2",
                )}
              >
                {subMetric}
              </div>
            )}
          </div>
        )}
        {chart && <div className="mt-4 flex flex-1 flex-col justify-center">{chart}</div>}
        {variant === "graph" && graphData && (
          <div className="mt-4 flex min-h-14 w-full flex-1 flex-col justify-center">
          <div className="h-14 w-full">
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
          </div>
        )}
        {variant === "donut" && donutData && (() => {
          // The share of the biggest slice, in the hole. The headline number
          // already says how much in total, so repeating it here would add
          // nothing — what the donut is actually saying is how concentrated
          // the split is.
          const donutTotal = donutData.reduce((sum, d) => sum + d.value, 0);
          const topShare = donutTotal > 0
            ? Math.round((Math.max(...donutData.map((d) => d.value)) / donutTotal) * 100)
            : 0;
          // A donut of zeroes draws nothing at all, so an empty plan loses the
          // card's shape entirely. Draw the ring in grey instead — the same
          // move the budget bar makes with its unspent track.
          const donutSlices = donutTotal > 0 ? donutData : [{ name: 'No data', value: 1 }];
          const donutFills = donutTotal > 0 ? donutColors : ['rgb(var(--neutral-200))'];
          return (
          <div className="mt-4 flex flex-1 items-center">
          <div className="relative aspect-square w-20">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutSlices}
                  cx="50%"
                  cy="50%"
                  innerRadius="68%"
                  outerRadius="100%"
                  dataKey="value"
                  strokeWidth={0}
                  startAngle={90}
                  endAngle={-270}
                >
                  {donutSlices.map((_, index) => (
                    <Cell
                      key={index}
                      fill={
                        donutFills?.[index] ??
                        (index === 0
                          ? 'hsl(var(--chart-1))'
                          : 'hsl(var(--chart-2))')
                      }
                    />
                  ))}
                </Pie>
                <RechartsTooltip
                  cursor={false}
                  wrapperStyle={{ zIndex: 20 }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const item = payload[0];
                    return (
                      <div className="flex items-center gap-2 whitespace-nowrap rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground shadow-md">
                        <span
                          className="inline-block h-2 w-2 flex-shrink-0 rounded-full"
                          style={{ backgroundColor: item.payload?.fill ?? (item.color as string) }}
                        />
                        <span className="text-primary-foreground/80">{item.name}</span>
                        <span className="ml-1 font-medium tabular-nums">{(item.value as number).toLocaleString()}</span>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className={cn(CHART_FIGURE, 'font-semibold text-foreground')}>{topShare}%</span>
            </div>
          </div>
          </div>
          );
        })()}
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
        {/* donutLegend, barHorizontal and budgetStacked variants render
            the same simple `value + subMetric + badge` body as the
            default cards above. Their per-proposition breakdown lives
            in MetricRow's click-to-expand panel via
            MetricDefinition.expandedContent (see {Donut,BarHorizontal,
            BudgetStacked}Detail components below). */}
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
                    wrapperStyle={{ zIndex: 20 }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const item = payload[0];
                      return (
                        <div className="rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground shadow-md">
                          <div className="text-primary-foreground/80">{item.payload.date}</div>
                          <div className="font-medium tabular-nums">{fmt(item.value as number)}</div>
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
          <div className="mt-auto flex justify-end pt-3">
            <Badge variant={badgeVariant} className="text-xs transition-all duration-500 ease-in-out">
              {badgeValue}
            </Badge>
          </div>
        )}
      </CardContent>
      {/* Arrow pointing down from the selected card */}
      {isSelected && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <div className="w-4 h-4 bg-card border-r border-b border-border rotate-45 shadow-sm"></div>
        </div>
      )}
    </Card>
    );
  }
)
MetricCard.displayName = "MetricCard"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, CardSummary, CardSummaryContent, CardSummaryTitle, MetricCard };
