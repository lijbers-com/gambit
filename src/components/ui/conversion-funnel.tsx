"use client"

// Hand-rolled in SVG rather than wrapping Recharts' Funnel: each stage is
// its own clickable column with a synced breakdown header (label, share,
// volume, drop-off) above the drawing, which Recharts' Funnel does not give.
//
// The drawing is one continuous shape: the flow narrows smoothly from one
// stage's share to the next, centred on the baseline like a river seen from
// above, in one blue. Where the reader is (hover or selection) the
// column lifts; the rest steps back.

import * as React from "react"
import { cn } from "@/lib/utils"
import type { EngineId } from "@/lib/db"
import { PROPOSITION_PATTERNS, PropositionPatternDefs, patternFill, patternFor } from "@/lib/proposition-patterns"

/** Bottom-to-top stacking order for a funnel's engine bands — the same
 *  order the pattern system declares them in. */
const ENGINE_ORDER = Object.keys(PROPOSITION_PATTERNS) as EngineId[]

export interface ConversionFunnelStage {
  key: string
  label: string
  value: number
  /** This stage's volume by proposition. When every stage carries one, the
   *  flow renders as stacked, patterned bands — one per engine — instead of
   *  one flat colour, so composition reads at every point in the funnel. */
  breakdown?: Partial<Record<EngineId, number>>
}

export interface ConversionFunnelProps {
  stages: ConversionFunnelStage[]
  className?: string
  showTooltip?: boolean
  /** The flow's fill. Defaults to the chart ramp's mid blue. */
  color?: string
  valueFormatter?: (value: number) => string
  barHeight?: number
  selectedKey?: string
  onStageClick?: (key: string) => void
}

const formatPercent = (n: number) => {
  if (n === 0) return "0%"
  if (n < 0.1) return `${n.toFixed(2)}%`
  if (n < 10) return `${n.toFixed(1)}%`
  return `${Math.round(n)}%`
}

/** The last stage never thins to nothing — a line still reads as flow. */
const MIN_HALF = 4
/** Room above the flow for each stage's label, share and volume. */
const LABEL_H = 76

export function ConversionFunnelComponent({
  stages,
  className,
  showTooltip = true,
  color = "hsl(var(--chart-400))",
  valueFormatter = (v) => v.toLocaleString(),
  barHeight = 160,
  selectedKey,
  onStageClick,
}: ConversionFunnelProps) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)

  // Drawing units are real pixels, one to one with the box on screen — not
  // an abstract 100-wide/100-tall grid stretched to fit. A pattern (its
  // dots, its diagonals) is defined in the same units everywhere it is
  // used, so it has to render at the same density here as it does on an
  // area chart; a stretched coordinate system would distort it unevenly on
  // each axis and the same texture would read as a different shade.
  const svgRef = React.useRef<SVGSVGElement>(null)
  const [measuredWidth, setMeasuredWidth] = React.useState(0)
  React.useLayoutEffect(() => {
    const el = svgRef.current
    if (!el || typeof ResizeObserver === "undefined") return
    const measure = () => setMeasuredWidth(el.clientWidth)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const firstValue = stages[0]?.value ?? 0
  const maxValue = Math.max(...stages.map((s) => s.value), 1)
  const isInteractive = typeof onStageClick === "function"
  const n = stages.length
  const H = barHeight
  const W = n > 0 ? (measuredWidth || 800) / n : 100
  const mid = H / 2

  const handleSelect = (key: string) => {
    if (onStageClick) onStageClick(key)
  }
  const isSelected = (key: string) => selectedKey !== undefined && selectedKey === key
  const activeIndex = selectedKey !== undefined ? stages.findIndex((s) => s.key === selectedKey) : hoveredIndex

  // Half-height of the flow at each stage boundary. A stage holds its width
  // across the first part of its column and eases into the next stage's
  // width at the boundary, so the narrowing sits where the drop-off is read.
  const half = (v: number) => Math.max(MIN_HALF, (v / maxValue) * (H / 2))
  const halves = stages.map((s) => half(s.value))

  /**
   * One taper, generalised: given the y-edge at every stage boundary (top
   * and bottom), build the ribbon between them — the same "hold, then ease
   * into the next stage's edge" curve the whole flow uses. The outer shape
   * is `buildRibbon(edge => mid - half, edge => mid + half)`; a sub-band is
   * the same call with edges cut from the stack instead of the full width.
   *
   * The very first stage also eases IN, from a single point on the
   * centreline — the flow starts at nothing, same as it ends at next to
   * nothing, rather than snapping straight to full width at the left edge.
   */
  const buildRibbon = React.useCallback((topEdges: number[], bottomEdges: number[]) => {
    const top: string[] = []
    const bottom: string[] = []
    const HOLD = 0.6
    const LEAD = 0.3
    for (let i = 0; i < n; i++) {
      const x0 = i * W
      const x1 = x0 + W * HOLD
      const x2 = x0 + W
      const aTop = topEdges[i]
      const bTop = i < n - 1 ? topEdges[i + 1] : topEdges[i]
      const aBot = bottomEdges[i]
      const bBot = i < n - 1 ? bottomEdges[i + 1] : bottomEdges[i]
      if (i === 0) {
        const leadX = x0 + W * LEAD
        const leadCx = (x0 + leadX) / 2
        top.push(`M ${x0} ${mid}`)
        top.push(`C ${leadCx} ${mid}, ${leadCx} ${aTop}, ${leadX} ${aTop}`)
        top.push(`L ${x1} ${aTop}`)
        const cx = (x1 + x2) / 2
        top.push(`C ${cx} ${aTop}, ${cx} ${bTop}, ${x2} ${bTop}`)
        bottom.unshift(
          `C ${cx} ${bBot}, ${cx} ${aBot}, ${x1} ${aBot}`,
          `L ${leadX} ${aBot}`,
          `C ${leadCx} ${aBot}, ${leadCx} ${mid}, ${x0} ${mid}`,
        )
        continue
      }
      top.push(`L ${x1} ${aTop}`)
      const cx = (x1 + x2) / 2
      top.push(`C ${cx} ${aTop}, ${cx} ${bTop}, ${x2} ${bTop}`)
      bottom.unshift(`C ${cx} ${bBot}, ${cx} ${aBot}, ${x1} ${aBot}`, `L ${x0} ${aBot}`)
      if (i === n - 1) bottom.unshift(`L ${x2} ${bBot}`)
    }
    return `${top.join(" ")} ${bottom.join(" ")} Z`
  }, [n, mid])

  const path = React.useMemo(
    () => (n === 0 ? "" : buildRibbon(halves.map((h) => mid - h), halves.map((h) => mid + h))),
    [halves, n, buildRibbon, mid],
  )

  // A band per proposition, stacked bottom to top by each stage's own
  // composition — so the flow's narrowing is the sum of each engine's own
  // drop-off, not a fixed split carried over from the first stage.
  const hasBreakdown = n > 0 && stages.every((s) => s.breakdown && Object.values(s.breakdown).some((v) => (v ?? 0) > 0))
  const bandPaths = React.useMemo(() => {
    if (!hasBreakdown) return null
    // Cumulative share, bottom to top, at every stage boundary.
    const edges: number[][] = stages.map((s, i) => {
      const total = ENGINE_ORDER.reduce((sum, e) => sum + (s.breakdown?.[e] ?? 0), 0) || 1
      const bottom = mid + halves[i]
      let cum = 0
      const out = [bottom]
      for (const e of ENGINE_ORDER) {
        cum += (s.breakdown?.[e] ?? 0) / total
        out.push(bottom - 2 * halves[i] * cum)
      }
      return out
    })
    return ENGINE_ORDER.map((engine, k) => ({
      engine,
      d: buildRibbon(edges.map((e) => e[k + 1]), edges.map((e) => e[k])),
    }))
  }, [hasBreakdown, stages, halves, mid, buildRibbon])

  return (
    <div className={cn("flex flex-col w-full", className)}>
      {/* One area: the stage's label, share and volume sit at the top of its
          column, the flow runs beneath them — the numbers ride the shape. */}
      <div className="relative" style={{ height: barHeight + LABEL_H }}>
        <svg
          ref={svgRef}
          className="absolute inset-x-0 bottom-0 w-full"
          style={{ height: barHeight }}
          // The viewBox is the element's own measured pixel size, so one
          // unit is one screen pixel on both axes — no stretch for
          // `preserveAspectRatio="none"` to introduce.
          viewBox={`0 0 ${n * W} ${H}`}
        >
          <defs>
            {/* Where the reader is, the flow is fully inked; elsewhere it steps back. */}
            <clipPath id="cf-active">
              {activeIndex !== null && activeIndex >= 0 && <rect x={activeIndex * W} y={0} width={W} height={H} />}
            </clipPath>
            {bandPaths && <PropositionPatternDefs engines={ENGINE_ORDER} />}
          </defs>
          {bandPaths ? (
            // Composition, not just volume: each proposition keeps its own
            // pattern through the flow, so the mix at Awareness and the mix
            // at Purchase both read at a glance.
            bandPaths.map(({ engine, d }) => (
              <React.Fragment key={engine}>
                <path
                  d={d}
                  fill={patternFill(engine)}
                  stroke={patternFor(engine).ink}
                  strokeWidth={0.5}
                  strokeOpacity={0.5}
                  opacity={activeIndex !== null && activeIndex >= 0 ? 0.4 : 0.85}
                />
                {activeIndex !== null && activeIndex >= 0 && (
                  <path d={d} fill={patternFill(engine)} stroke={patternFor(engine).ink} strokeWidth={0.5} strokeOpacity={0.5} clipPath="url(#cf-active)" />
                )}
              </React.Fragment>
            ))
          ) : (
            <>
              <path d={path} fill={color} opacity={activeIndex !== null && activeIndex >= 0 ? 0.35 : 0.8} />
              {activeIndex !== null && activeIndex >= 0 && (
                <path d={path} fill={color} clipPath="url(#cf-active)" />
              )}
            </>
          )}
        </svg>

        {/* Columns: label block on top, hit area for the whole height */}
        <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
          {stages.map((stage, i) => {
            const prev = i > 0 ? stages[i - 1].value : null
            const stageRate = firstValue > 0 ? (stage.value / firstValue) * 100 : 0
            const dropOff = prev !== null && prev > 0 ? ((prev - stage.value) / prev) * 100 : null
            const selected = isSelected(stage.key)
            return (
              <div
                key={stage.key}
                role={isInteractive ? "button" : undefined}
                tabIndex={isInteractive ? 0 : undefined}
                aria-pressed={isInteractive ? selected : undefined}
                className={cn(
                  "relative border-l border-border first:border-l-0 transition-colors",
                  isInteractive && "cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                  selected && "bg-muted/30",
                  !selected && hoveredIndex === i && "bg-muted/20",
                )}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => isInteractive && handleSelect(stage.key)}
                onKeyDown={(e) => {
                  if (isInteractive && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault()
                    handleSelect(stage.key)
                  }
                }}
              >
                <div className="px-4 py-3">
                  <div className="text-xs text-muted-foreground truncate">{stage.label}</div>
                  <div className="text-2xl font-semibold leading-tight">{formatPercent(stageRate)}</div>
                  <div className="text-xs text-muted-foreground">
                    {valueFormatter(stage.value)}
                    {dropOff !== null && <span className="ml-1">&#8600; {formatPercent(dropOff)}</span>}
                  </div>
                </div>
                {showTooltip && hoveredIndex === i && (
                  <ConversionFunnelTooltip
                    stage={stage}
                    stageRate={stageRate}
                    color={color}
                    valueFormatter={valueFormatter}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

interface TooltipProps {
  stage: ConversionFunnelStage
  stageRate: number
  color: string
  valueFormatter: (value: number) => string
}

function ConversionFunnelTooltip({ stage, stageRate, color, valueFormatter }: TooltipProps) {
  return (
    <div className="pointer-events-none absolute left-1/2 top-[84px] z-10 -translate-x-1/2">
      <div className="grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
        <div className="font-medium">{stage.label}</div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 shrink-0 rounded-[2px]" style={{ backgroundColor: color }} />
          <div className="flex flex-1 justify-between gap-3 leading-none">
            <span className="text-muted-foreground">Volume</span>
            <span className="font-mono font-medium tabular-nums text-foreground">{valueFormatter(stage.value)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 pl-[14px]">
          <div className="flex flex-1 justify-between gap-3 leading-none">
            <span className="text-muted-foreground">Share</span>
            <span className="font-mono font-medium tabular-nums text-foreground">{formatPercent(stageRate)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
