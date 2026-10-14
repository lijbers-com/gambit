'use client';

import * as React from 'react';
import { objectiveLabel } from '@/lib/objective-kpi-copy';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChartComponent } from '@/components/ui/line-chart';
import { BarChartComponent } from '@/components/ui/bar-chart';
import { PieChartComponent } from '@/components/ui/pie-chart';
import { FilterBar } from '@/components/ui/filter-bar';
import { usePropositionMetrics } from '@/lib/proposition-metrics';
import { metricKeysForGoal } from '@/lib/insight-filters';
import { useDb } from '@/lib/db';
import { BENCHMARKS, liveStores, shareOfVoice, type PerformanceScope } from '@/lib/db/performance';
import { STORE_TYPES } from '@/lib/db/inventory';
import type { DbData, EngineId } from '@/lib/db/types';

// Goal and objective options mirror the create-media-plan wizard, so the
// filters read in the same vocabulary the plan was set up with.
const goalFilterOptions = [
  { label: 'Awareness', value: 'awareness' },
  { label: 'Consideration', value: 'consideration' },
  { label: 'Purchase', value: 'purchase' },
  { label: 'Loyalty', value: 'loyalty' },
];
const objectiveFilterOptions = [
  'merkbekendheid',
  'productbekendheid',
  'merk-associaties',
  'sales',
  'promotie-ondersteuning',
].map((id) => ({ label: objectiveLabel(id), value: id }));

/**
 * Insights tab body — on the proposition overview, a media plan, a campaign
 * and a booking. One chart per KPI card, plotting the card's own weekly
 * series from the performance model (lib/db/performance.ts): the same
 * bookings the headline number sums, week by week. Bar for volumes, line
 * for rates (with the proposition's benchmark), pie for composition.
 */

type InsightChart =
  | { kind: 'bar'; data: Array<{ period: string; value: number }>; color: string }
  | { kind: 'line'; data: Array<{ period: string; value: number }>; color: string; benchmark?: { value: number; label?: string } }
  | { kind: 'pie'; data: Array<{ name: string; value: number; fill?: string }>; donut?: boolean };

const chartColor = (idx: number) => `hsl(var(--chart-${(idx % 5) + 1}))`;

const VOLUME_KEYS = new Set(['spend', 'impressions', 'plays', 'sales', 'clicks', 'conversions']);
/** Rates shown as a percentage in the line chart (the series holds a share). */
const PERCENT_KEYS = new Set(['roas', 'iroas', 'ctr', 'viewability']);

const buildInsightChart = (
  db: DbData,
  metric: { key: string; chartData?: Array<{ day: string; value: number }> },
  idx: number,
  engine: EngineId | undefined,
  scope: PerformanceScope,
): InsightChart => {
  const color = chartColor(idx);
  if (metric.key === 'stores') {
    // Live stores split by store type, at the network's shares.
    const live = liveStores(db, scope);
    return { kind: 'pie', donut: true, data: STORE_TYPES.map((t, i) => ({ name: t.label, value: Math.round(live * t.share), fill: chartColor(i) })) };
  }
  if (metric.key === 'sov') {
    const sov = shareOfVoice(db, scope);
    return { kind: 'pie', donut: false, data: [
      { name: 'This selection', value: Math.round(sov * 100), fill: chartColor(0) },
      { name: 'Other advertisers', value: 100 - Math.round(sov * 100), fill: 'rgb(var(--neutral-200))' },
    ] };
  }
  const factor = PERCENT_KEYS.has(metric.key) ? 100 : 1;
  const data = (metric.chartData ?? []).map((p) => ({ period: p.day, value: Math.round(p.value * factor * 100) / 100 }));
  if (VOLUME_KEYS.has(metric.key)) return { kind: 'bar', color, data };
  const bench = engine ? BENCHMARKS[engine] : undefined;
  const target = bench && (metric.key === 'roas' ? bench.roas : metric.key === 'iroas' ? bench.iroas : metric.key === 'ctr' ? bench.ctr : metric.key === 'viewability' ? bench.viewability : metric.key === 'cpc' ? bench.cpc : undefined);
  return { kind: 'line', color, data, benchmark: target ? { value: Math.round(target * factor * 100) / 100, label: 'Target' } : undefined };
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
  /** @deprecated The level is read from performanceScope now. */
  scope?: 'overview' | 'campaign' | 'booking';
  /** Which bookings the tab is about: a media plan, a campaign, a booking.
   *  Without it, the plan's (when mediaPlanId is set) or the proposition's. */
  performanceScope?: PerformanceScope;
  /** The plan whose goal, objective and KPIs preset the filters. Without it the
   *  filters still render, opened on every metric the engine reports. */
  mediaPlanId?: string;
  className?: string;
}

/**
 * Insights tab body. Drop into any CardWithTabs tabs[].content slot.
 *
 *   <InsightsTab engineType="display" performanceScope={{ campaignIds: ['C-004'] }} mediaPlanId="MP-002" />
 *
 * The filter bar opens preset to what the plan is judged on: its goal places it
 * at a funnel stage, and that stage's KPI framework decides which charts show
 * (see src/lib/insight-filters.ts). Everything else stays one click away.
 */
export const InsightsTab: React.FC<InsightsTabProps> = ({
  engineType,
  performanceScope,
  mediaPlanId,
  className,
}) => {
  const db = useDb();
  const plan = mediaPlanId ? db.mediaPlans.find((p) => p.id === mediaPlanId) : undefined;
  const perfScope: PerformanceScope = performanceScope ?? (mediaPlanId ? { mediaPlanId } : {});
  const engine = (['display', 'sponsored-products', 'digital-instore', 'offline-instore', 'offsite'] as const)
    .find((e) => e === engineType.toLowerCase().replace(/in[-\s]?store/g, 'instore').replace(/[\s_]+/g, '-'));

  const metrics = usePropositionMetrics(engineType, perfScope);
  const availableKeys = React.useMemo(() => metrics.map((m) => m.key), [metrics]);

  // Preset once per plan/engine: the goal's stage decides the opening
  // selection. Re-derived when the plan or the engine changes, not on
  // every render, so a user's own choices are not overwritten.
  const preset = React.useMemo(
    () => metricKeysForGoal(plan?.goal, availableKeys),
    [plan?.goal, availableKeys],
  );
  const [goal, setGoal] = React.useState<string[]>(plan?.goal ? [plan.goal] : []);
  const [objective, setObjective] = React.useState<string[]>(plan?.objective ? [plan.objective] : []);
  const [selectedKpis, setSelectedKpis] = React.useState<string[]>(preset);
  const presetKey = preset.join(',');
  React.useEffect(() => {
    setGoal(plan?.goal ? [plan.goal] : []);
    setObjective(plan?.objective ? [plan.objective] : []);
    setSelectedKpis(preset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan?.id, plan?.goal, plan?.objective, presetKey]);

  // Changing the goal re-presets the KPIs to that stage's framework — the goal
  // is what decides them, so leaving the old selection would be a lie.
  const changeGoal = (vals: string[]) => {
    setGoal(vals);
    setSelectedKpis(metricKeysForGoal(vals[0], availableKeys));
  };

  const shown = metrics.filter((m) => selectedKpis.length === 0 || selectedKpis.includes(m.key));

  return (
    <div className={'mt-6 space-y-6 ' + (className ?? '')}>
      <FilterBar
        hideSearch
        filters={[
          {
            name: 'Goal',
            options: goalFilterOptions,
            selectedValues: goal,
            onChange: (vals) => changeGoal(vals.slice(-1)),
          },
          {
            name: 'Objective',
            options: objectiveFilterOptions,
            selectedValues: objective,
            onChange: (vals) => setObjective(vals.slice(-1)),
          },
          {
            name: 'KPI',
            options: metrics.map((m) => ({ label: m.label, value: m.key })),
            selectedValues: selectedKpis,
            onChange: setSelectedKpis,
          },
        ]}
      />

    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {shown.map((m, i) => {
        const spec = buildInsightChart(db, m, i, engine, engine ? { ...perfScope, engine } : perfScope);
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
    </div>
  );
};
