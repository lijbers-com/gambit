'use client';

import * as React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChartComponent } from '@/components/ui/line-chart';
import { BarChartComponent } from '@/components/ui/bar-chart';
import { PieChartComponent } from '@/components/ui/pie-chart';
import {
  getPropositionMetrics,
  PropositionScope,
} from '@/lib/proposition-metrics';

/**
 * Insights tab body — used on the campaign overview and the campaign
 * detail page. Renders one detailed chart per KPI from the same
 * per-proposition metric set, picking the chart type that fits each
 * metric: bar for volume, line for rates and cumulative trends,
 * pie/donut for composition.
 *
 * The `scope` mirrors getPropositionMetrics: pass 'overview' on the
 * proposition campaign-overview page, 'campaign' on a single
 * campaign detail page, 'booking' on a single booking detail page.
 * Labels stay identical across scopes; only the headline values
 * and the synthesized chart magnitudes scale down with scope.
 */

type InsightChart =
  | { kind: 'bar'; data: Array<{ period: string; value: number }>; color: string }
  | { kind: 'line'; data: Array<{ period: string; value: number }>; color: string; benchmark?: { value: number; label?: string } }
  | { kind: 'pie'; data: Array<{ name: string; value: number; fill?: string }>; donut?: boolean };

// Deterministic 0..1 pseudo-random derived from a key + index so the
// same metric always renders the same chart shape (visually stable
// across renders, no rerolling on every navigate).
const seededPseudo = (key: string, i: number): number => {
  const seed = key
    .split('')
    .reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) >>> 0, 0);
  return ((seed * (i + 1) * 9301 + 49297) % 233280) / 233280;
};

const buildTimeSeries = (
  key: string,
  length: number,
  base: number,
  drift: number,
  jitter: number,
): Array<{ period: string; value: number }> => {
  const out: Array<{ period: string; value: number }> = [];
  for (let i = 0; i < length; i++) {
    const noise = (seededPseudo(key, i) - 0.5) * jitter;
    const v = Math.max(0, base + drift * i + noise);
    out.push({ period: `Wk ${i + 1}`, value: Math.round(v * 100) / 100 });
  }
  return out;
};

const chartColor = (idx: number) => `hsl(var(--chart-${(idx % 5) + 1}))`;

// Scale the synthetic chart magnitudes by scope so a campaign-level
// "Spend" trend doesn't show the same numbers as the proposition-wide
// "Spend" trend. Rates (CTR / ROAS / Frequency / Viewability) stay
// roughly constant — matching getPropositionMetrics.
const scopeScale = (scope: PropositionScope): number => {
  switch (scope) {
    case 'campaign':
      return 0.22; // ~1/5 of proposition overview
    case 'booking':
      return 0.05; // ~1/4 of campaign
    case 'overview':
    default:
      return 1;
  }
};

const buildInsightChart = (
  key: string,
  idx: number,
  scope: PropositionScope,
): InsightChart => {
  const color = chartColor(idx);
  const s = scopeScale(scope);
  switch (key) {
    // ── Volume → bar ───────────────────────────────────────────────
    case 'spend':       return { kind: 'bar', color, data: buildTimeSeries(key, 12, 4500 * s, 200 * s, 1200 * s) };
    case 'impressions': return { kind: 'bar', color, data: buildTimeSeries(key, 12, 950000 * s, 30000 * s, 200000 * s) };
    case 'plays':       return { kind: 'bar', color, data: buildTimeSeries(key, 12, 14000 * s, 600 * s, 4000 * s) };
    case 'sales':       return { kind: 'bar', color, data: buildTimeSeries(key, 12, 14000 * s, 800 * s, 4500 * s) };
    case 'clicks':      return { kind: 'bar', color, data: buildTimeSeries(key, 12, 9000 * s, 500 * s, 2500 * s) };
    case 'conversions': return { kind: 'bar', color, data: buildTimeSeries(key, 12, 450 * s, 30 * s, 130 * s) };

    // ── Rates / cumulative → line ─────────────────────────────────
    case 'roas':        return { kind: 'line', color, data: buildTimeSeries(key, 12, 2.8, 0.06, 0.4), benchmark: { value: 2.8, label: 'Target' } };
    case 'iroas':       return { kind: 'line', color, data: buildTimeSeries(key, 12, 1.7, 0.04, 0.3), benchmark: { value: 1.8, label: 'Target' } };
    case 'reach':       return { kind: 'line', color, data: buildTimeSeries(key, 12, 220000 * s, 9000 * s, 35000 * s) };
    case 'buyerReach':  return { kind: 'line', color, data: buildTimeSeries(key, 12, 78000 * s, 3000 * s, 12000 * s) };
    case 'ctr':         return { kind: 'line', color, data: buildTimeSeries(key, 12, 0.68, 0.018, 0.12), benchmark: { value: 0.7, label: 'Target' } };
    case 'cpc':         return { kind: 'line', color, data: buildTimeSeries(key, 12, 0.42, -0.008, 0.07), benchmark: { value: 0.4, label: 'Target' } };
    case 'frequency':   return { kind: 'line', color, data: buildTimeSeries(key, 12, 3.4, 0.08, 0.5) };
    case 'viewability': return { kind: 'line', color, data: buildTimeSeries(key, 12, 82, 0.4, 4) };
    case 'availableTime': return { kind: 'line', color, data: buildTimeSeries(key, 12, 36, 0.3, 4) };

    // ── Composition → pie / donut ─────────────────────────────────
    case 'stores':
      return {
        kind: 'pie',
        donut: true,
        data: [
          { name: 'XL',      value: 142, fill: 'hsl(var(--chart-1))' },
          { name: 'Premium', value: 118, fill: 'hsl(var(--chart-2))' },
          { name: 'Compact', value: 96,  fill: 'hsl(var(--chart-3))' },
          { name: 'Express', value: 76,  fill: 'hsl(var(--chart-4))' },
          { name: 'To Go',   value: 50,  fill: 'hsl(var(--chart-5))' },
        ],
      };
    case 'sov':
      return {
        kind: 'pie',
        donut: false,
        data: [
          { name: 'Edge',         value: 38, fill: 'hsl(var(--chart-1))' },
          { name: 'Competitor A', value: 28, fill: 'hsl(var(--chart-2))' },
          { name: 'Competitor B', value: 19, fill: 'hsl(var(--chart-3))' },
          { name: 'Other',        value: 15, fill: 'hsl(var(--chart-4))' },
        ],
      };

    default:
      return { kind: 'line', color, data: buildTimeSeries(key, 12, 50, 1.5, 12) };
  }
};

const InsightChartCard = ({
  spec,
  label,
}: {
  spec: InsightChart;
  label: string;
}) => {
  if (spec.kind === 'pie') {
    return (
      <PieChartComponent
        data={spec.data}
        config={spec.data.reduce(
          (acc, d, i) => ({
            ...acc,
            [d.name]: { label: d.name, color: d.fill ?? chartColor(i) },
          }),
          {} as Record<string, { label: string; color: string }>,
        )}
        innerRadius={spec.donut ? 50 : 0}
        outerRadius={80}
        showLegend
        showLabels={false}
        className="h-[200px] w-full"
      />
    );
  }
  if (spec.kind === 'bar') {
    return (
      <BarChartComponent
        data={spec.data}
        config={{ value: { label, color: spec.color } }}
        xAxisDataKey="period"
        showLegend={false}
        showGrid
        showTooltip
        className="h-[200px] w-full"
      />
    );
  }
  return (
    <LineChartComponent
      data={spec.data}
      config={{ value: { label, color: spec.color } }}
      xAxisDataKey="period"
      showLegend={false}
      showGrid
      showTooltip
      showDots={false}
      benchmark={spec.benchmark}
      className="h-[200px] w-full"
    />
  );
};

export interface InsightsTabProps {
  engineType: string;
  scope?: PropositionScope;
  className?: string;
}

/**
 * Insights tab body. Drop into any CardWithTabs tabs[].content slot.
 *
 *   <InsightsTab engineType="display" scope="campaign" />
 */
export const InsightsTab: React.FC<InsightsTabProps> = ({
  engineType,
  scope = 'overview',
  className,
}) => {
  const metrics = getPropositionMetrics(engineType, scope);
  return (
    <div
      className={
        'mt-6 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 ' +
        (className ?? '')
      }
    >
      {metrics.map((m, i) => {
        const spec = buildInsightChart(m.key, i, scope);
        return (
          <Card key={m.key} padding="compact" className="flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex items-baseline justify-between gap-2">
                <div className="text-sm font-semibold text-foreground truncate">
                  {m.label}
                </div>
                {m.badgeValue && (
                  <Badge
                    variant={
                      (m.badgeVariant ?? 'secondary') as
                        | 'default'
                        | 'destructive'
                        | 'secondary'
                        | 'outline'
                        | 'success'
                        | 'warning'
                        | 'info'
                    }
                    className="text-[10px]"
                  >
                    {m.badgeValue}
                  </Badge>
                )}
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <div className="text-2xl font-bold text-foreground">
                  {m.value}
                </div>
                {m.subMetric && (
                  <div className="text-xs text-muted-foreground">
                    {m.subMetric}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-1 min-h-0">
              <InsightChartCard spec={spec} label={m.label} />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
