"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"
import { PropositionSwatch, type PatternKey } from "@/lib/proposition-patterns"

/**
 * The shadcn/ReUI chart contract — the standard the frontend team builds
 * against (reui.io/components/chart): a ChartContainer provides the config
 * through context, so tooltips and legends resolve their labels and colors
 * from ONE place; series colors become `--color-<key>` variables scoped to
 * this chart alone.
 *
 * One deliberate house deviation: the tooltip panel wears the app-wide
 * Tooltip surface (primary background) — a chart's tooltip and a control's
 * tooltip are the same thing to the reader.
 */

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode
    icon?: React.ComponentType
    /** The proposition this series stands for — a patterned fill's swatch,
     *  not a flat colour, shows in the tooltip. */
    engine?: PatternKey
    /** Where a row sits in the tooltip's sum. Parts are listed first; a
     *  `sum` row sits under a rule beneath them, the way a total is written
     *  under the figures it adds up; `outcome` rows come after a gap, and a
     *  `result` row sits under its own rule beneath those. */
    tooltipRole?: 'part' | 'sum' | 'outcome' | 'result'
    /** How the row's value is written — for a ratio, a percentage, euros. */
    format?: (value: number) => string
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
>

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig
    children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"]
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex h-full w-full justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "Chart"

/** Series colors as CSS variables, scoped to THIS chart — never to :root,
 *  so two charts on one page can reuse a key without clobbering each other. */
const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, itemConfig]) => itemConfig.theme || itemConfig.color
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ??
      itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .filter(Boolean)
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    active?: boolean
    payload?: any[]
    label?: string
    hideLabel?: boolean
    hideIndicator?: boolean
    indicator?: "line" | "dot" | "dashed"
    nameKey?: string
    labelKey?: string
    labelFormatter?: (value: any, payload: any[]) => React.ReactNode
    labelClassName?: string
    formatter?: (value: any, name: string, item: any, index: number, payload: any) => React.ReactNode
    color?: string
  }
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const { config } = useChart()

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null
      }

      const [item] = payload
      const key = `${labelKey || item?.dataKey || item?.name || "value"}`
      const itemConfig = getPayloadConfigFromPayload(config, item, key)
      const value =
        !labelKey && typeof label === "string"
          ? config[label]?.label ?? label
          : itemConfig?.label

      if (labelFormatter) {
        return labelFormatter(value, payload)
      }

      return value ?? null
    }, [label, labelFormatter, payload, hideLabel, config, labelKey])

    if (!active || !payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          // Same panel as the app-wide Tooltip (ui/tooltip.tsx): a chart's
          // tooltip and a control's tooltip are the same thing to the reader.
          "grid min-w-[8rem] items-start gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground shadow-md",
          className
        )}
      >
        {tooltipLabel ? (
          <div className={cn("font-medium", labelClassName)}>
            {tooltipLabel}
          </div>
        ) : null}
        {(() => {
          const items = payload.filter((item) => item.type !== "none")
          const roleOf = (item: any) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`
            return getPayloadConfigFromPayload(config, item, key)?.tooltipRole ?? "part"
          }
          const parts = items.filter((i) => roleOf(i) === "part")
          const sums = items.filter((i) => roleOf(i) === "sum")
          const outcomes = items.filter((i) => roleOf(i) === "outcome")
          const results = items.filter((i) => roleOf(i) === "result")

          const renderRow = (item: any, index: number, emphasis: boolean) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`
            const itemConfig = getPayloadConfigFromPayload(config, item, key)
            const indicatorColor = color || item.payload?.fill || item.color
            // A sum or result has no series of its own to swatch; an empty
            // swatch-sized gap keeps its label flush with the rows above.
            const swatchless = emphasis || (!itemConfig?.icon && !itemConfig?.engine && itemConfig?.color === "transparent")
            const value =
              item.value == null
                ? null
                : typeof item.value === "number"
                  ? (itemConfig?.format ? itemConfig.format(item.value) : item.value.toLocaleString())
                  : String(item.value)

            return (
              <div
                key={item.dataKey ?? index}
                className={cn(
                  "flex w-full items-stretch gap-2 whitespace-nowrap [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                  indicator === "dot" && "items-center"
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : itemConfig?.engine ? (
                      // A patterned series (fill is a `url(#…)` pattern
                      // reference, which a CSS background-color cannot
                      // read) shows the same swatch its legend chip wears.
                      !hideIndicator && <PropositionSwatch engine={itemConfig.engine} size={10} />
                    ) : swatchless ? (
                      !hideIndicator && <span className="h-2.5 w-2.5 shrink-0" />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
                            {
                              "h-2.5 w-2.5": indicator === "dot",
                              "w-1": indicator === "line",
                              "w-0 border-[1.5px] border-dashed bg-transparent":
                                indicator === "dashed",
                              "my-0.5": indicator === "dashed",
                            }
                          )}
                          style={
                            {
                              "--color-bg": indicatorColor,
                              "--color-border": indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        "flex flex-1 justify-between gap-4 leading-none",
                        hideIndicator ? "items-end" : "items-center"
                      )}
                    >
                      <div className="grid gap-1.5">
                        <span className={cn("whitespace-nowrap", emphasis ? "font-medium text-primary-foreground" : "text-primary-foreground/80")}>
                          {itemConfig?.label ?? item.name}
                        </span>
                      </div>
                      {value != null && (
                        <span className="font-medium tabular-nums text-primary-foreground">{value}</span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          }

          // Written like a sum: the parts, a rule, the total under it —
          // then, after a gap, what came of it, with its own result under
          // its own rule.
          const rule = "mt-0.5 border-t border-primary-foreground/25 pt-1.5"
          return (
            <div className="grid gap-1.5">
              {parts.map((item, i) => renderRow(item, i, false))}
              {sums.length > 0 && (
                <div className={cn("grid gap-1.5", parts.length > 0 && rule)}>
                  {sums.map((item, i) => renderRow(item, i, true))}
                </div>
              )}
              {outcomes.length > 0 && (
                <div className={cn("grid gap-1.5", (parts.length > 0 || sums.length > 0) && "mt-1.5")}>
                  {outcomes.map((item, i) => renderRow(item, i, false))}
                </div>
              )}
              {results.length > 0 && (
                <div className={cn("grid gap-1.5", outcomes.length > 0 && rule)}>
                  {results.map((item, i) => renderRow(item, i, true))}
                </div>
              )}
            </div>
          )
        })()}
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartLegend = RechartsPrimitive.Legend

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    payload?: any[]
    verticalAlign?: "top" | "bottom"
    hideIcon?: boolean
    nameKey?: string
  }
>(
  ({ className, hideIcon = false, payload, verticalAlign = "bottom", nameKey }, ref) => {
    const { config } = useChart()

    if (!payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4",
          verticalAlign === "top" ? "pb-3" : "pt-3",
          className
        )}
      >
        {payload
          .filter((item) => item.type !== "none")
          .map((item: any) => {
            const key = `${nameKey || item.dataKey || "value"}`
            const itemConfig = getPayloadConfigFromPayload(config, item, key)

            return (
              <div
                key={item.value}
                className={cn(
                  "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
                )}
              >
                {itemConfig?.icon && !hideIcon ? (
                  <itemConfig.icon />
                ) : (
                  !hideIcon && (
                    <div
                      className="h-2 w-2 shrink-0 rounded-[2px]"
                      style={{
                        backgroundColor: item.color,
                      }}
                    />
                  )
                )}
                <span className="text-muted-foreground">
                  {itemConfig?.label ?? item.value}
                </span>
              </div>
            )
          })}
      </div>
    )
  }
)
ChartLegendContent.displayName = "ChartLegendContent"

/** The standard's config resolver: a payload row names its series by
 *  dataKey/name (or, via nameKey, by a field on the data row itself), and
 *  that name looks the label and icon up in the chart's config. */
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string
  }

  return configLabelKey in config ? config[configLabelKey] : config[key]
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
}
