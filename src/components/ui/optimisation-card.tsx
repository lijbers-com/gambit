import * as React from 'react';
import { Sparkles, ChevronRight, MessageSquare, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './dialog';
import { AreaChartComponent } from './area-chart';
import { BarChartComponent } from './bar-chart';
import type { ChartDataPoint, ChartConfig } from './chart-types';

export type AdviceTone = 'insight' | 'alert' | 'tip' | 'success';

/** Rich "why this is good" content shown in the suggestion modal. */
export type AdviceExplain = {
  stats?: { label: string; value: string; sub?: string; tone?: AdviceTone }[];
  chart?: {
    data: ChartDataPoint[];
    config: ChartConfig;
    /** 'area' (default) trends over time; 'bar' compares categories. */
    kind?: 'area' | 'bar';
    /** Category key for bar charts (defaults to 'month'). */
    xKey?: string;
    /** Render bars horizontally — better for long category labels. */
    horizontal?: boolean;
    /** Plot this series against a secondary right-hand axis. */
    rightAxisKey?: string;
    title?: string;
  };
  insights?: { title: string; text: string }[];
};

export type Advice = {
  badge: string;
  tone: AdviceTone;
  message: React.ReactNode;
  /** The "accept / improve" action offered in the modal (e.g. "Set budget to automatic"). */
  action?: { label: string; onClick: () => void };
  /** Rich explanation (stats + chart + insights) shown in the modal. */
  explain?: AdviceExplain;
};

export const adviceToneClasses: Record<AdviceTone, string> = {
  insight: 'border-border bg-neutral-50 text-neutral-600',
  alert: 'border-amber-200 bg-amber-50 text-amber-700',
  tip: 'border-primary/20 bg-primary/5 text-primary',
  success: 'border-green-200 bg-green-50 text-green-700',
};

/**
 * Ready-made explainer for the "set budget to automatic" suggestion — a stat
 * row, a spend-vs-performance chart and key insights, mirroring the Campaign
 * Agent's budget recommendation. Reused by the wizard and the media-plan cards.
 */
export function budgetOptimisationExplain(): AdviceExplain {
  return {
    stats: [
      { label: 'Current ROAS', value: '3.0×', sub: 'On target' },
      { label: 'With auto budget', value: '3.5×', sub: '+18% projected', tone: 'success' },
      { label: 'Extra revenue', value: '+€8.4K', sub: 'Over the flight', tone: 'success' },
    ],
    chart: {
      rightAxisKey: 'roas',
      title: 'Spend vs performance forecast',
      data: [
        { month: '€2K', revenue: 90, roas: 520 },
        { month: '€3K', revenue: 165, roas: 430 },
        { month: '€4K', revenue: 230, roas: 365 },
        { month: '€5K', revenue: 300, roas: 320 },
        { month: '€6K', revenue: 360, roas: 285 },
        { month: '€7K', revenue: 410, roas: 255 },
      ],
      config: {
        revenue: { label: 'Revenue', color: 'hsl(var(--chart-1))' },
        roas: { label: 'ROAS index', color: 'hsl(var(--chart-2))' },
      },
    },
    insights: [
      { title: 'Real-time rebalancing', text: 'Spend shifts to the propositions converting best right now.' },
      { title: 'Stays within budget', text: 'The agent reallocates inside your total cap — you keep control.' },
      { title: 'Average uplift', text: 'Plans using automatic budget see ~18% higher ROAS.' },
    ],
  };
}

/**
 * Explainer for the "improve CTR with optimised targeting" insight — shows which
 * audience segments gain the most CTR (current vs optimised) as a bar chart.
 */
export function ctrTargetingExplain(): AdviceExplain {
  return {
    stats: [
      { label: 'Current CTR', value: '0.84%', sub: 'Blended' },
      { label: 'Optimised CTR', value: '1.03%', sub: '+23% projected', tone: 'success' },
      { label: 'Extra clicks', value: '+18.2K', sub: 'Over the flight', tone: 'success' },
    ],
    chart: {
      kind: 'bar',
      xKey: 'segment',
      horizontal: true,
      title: 'CTR by targeting segment — current vs optimised',
      data: [
        { segment: 'Retargeting', current: 1.1, optimised: 1.6 },
        { segment: 'In-market', current: 0.8, optimised: 1.25 },
        { segment: 'Loyalty members', current: 0.9, optimised: 1.15 },
        { segment: 'Category browsers', current: 0.85, optimised: 1.0 },
        { segment: 'Broad lookalikes', current: 0.7, optimised: 0.78 },
      ],
      config: {
        current: { label: 'Current CTR %', color: 'hsl(var(--chart-2))' },
        optimised: { label: 'Optimised CTR %', color: 'hsl(var(--chart-1))' },
      },
    },
    insights: [
      { title: 'Highest-impact targets', text: 'Retargeting and in-market shoppers gain most — tighter intent signals lift CTR ~45%.' },
      { title: 'Trim the weak segment', text: 'Broad lookalikes barely move; capping them concentrates spend on clickers.' },
      { title: 'Dayparting', text: 'Shifting spend to evening hours adds a further ~20% CTR on top.' },
    ],
  };
}

/**
 * Explainer for the budget-pacing "Budget Alert" — cumulative spend against an
 * even-pace line, showing the plan is front-loaded and may deplete early.
 */
export function budgetPacingExplain(): AdviceExplain {
  return {
    stats: [
      { label: 'Budget used', value: '82%', sub: 'To date' },
      { label: 'Pace vs even', value: '+30%', sub: 'Spending faster' },
      { label: 'Depletes', value: '~6 days', sub: 'Before flight ends' },
    ],
    chart: {
      rightAxisKey: undefined,
      title: 'Cumulative spend vs even pace',
      data: [
        { month: 'W1', actual: 18, ideal: 14 },
        { month: 'W2', actual: 38, ideal: 28 },
        { month: 'W3', actual: 62, ideal: 43 },
        { month: 'W4', actual: 82, ideal: 57 },
        { month: 'W5', actual: 100, ideal: 71 },
      ],
      config: {
        actual: { label: 'Spend %', color: 'hsl(var(--chart-1))' },
        ideal: { label: 'Even pace %', color: 'hsl(var(--chart-2))' },
      },
    },
    insights: [
      { title: 'Front-loaded delivery', text: "You're spending ~30% faster than an even daily pace." },
      { title: 'Risk', text: 'At this rate the budget runs out roughly 6 days before the flight ends.' },
      { title: 'Fix', text: 'Lower daily caps or turn on automatic budget to smooth pacing.' },
    ],
  };
}

/**
 * Explainer for the advertiser/brand insight — estimated reach, category ROAS
 * and where the reach comes from. Parameterised so the modal matches the advice.
 */
export function brandReachExplain(opts: { reach: number; roas: number; category: string }): AdviceExplain {
  const { reach, roas } = opts;
  const category = opts.category || 'this category';
  const r = (f: number) => Math.round(reach * f * 10) / 10;
  return {
    stats: [
      { label: 'Estimated reach', value: `${reach.toFixed(1)}M`, sub: 'Shoppers' },
      { label: 'Avg ROAS', value: `${roas.toFixed(1)}×`, sub: category, tone: 'success' },
      { label: 'Repeat buyers', value: '42%', sub: 'Of category' },
    ],
    chart: {
      kind: 'bar',
      xKey: 'channel',
      horizontal: true,
      title: 'Where this reach comes from',
      data: [
        { channel: 'Display', reach: r(0.38) },
        { channel: 'Sponsored products', reach: r(0.26) },
        { channel: 'Digital in-store', reach: r(0.21) },
        { channel: 'Offsite', reach: r(0.15) },
      ],
      config: { reach: { label: 'Reach (M)', color: 'hsl(var(--chart-1))' } },
    },
    insights: [
      { title: 'First-party data', text: `Reach and ${category} benchmarks come from observed loyalty-card behaviour — no modelling lag.` },
      { title: 'Strong ROAS base', text: `${category} buyers return ${roas.toFixed(1)}× on average, a solid foundation for a conversion goal.` },
      { title: 'Add products', text: 'Attaching SKUs unlocks sales attribution and product-level KPIs.' },
    ],
  };
}

/**
 * Explainer for the "start with €5,000" starter-budget suggestion — projected
 * conversions across budget levels, showing why €5K is a sensible opening bid.
 */
export function budgetStarterExplain(): AdviceExplain {
  return {
    stats: [
      { label: 'Suggested budget', value: '€5,000', sub: 'Starter' },
      { label: 'Est. reach', value: '6.2M', sub: 'At this budget', tone: 'success' },
      { label: 'Est. conversions', value: '4.1K', sub: '~3.4× ROAS', tone: 'success' },
    ],
    chart: {
      rightAxisKey: 'roas',
      title: 'Projected conversions by budget',
      data: [
        { month: '€2K', conversions: 1.7, roas: 360 },
        { month: '€3K', conversions: 2.6, roas: 350 },
        { month: '€5K', conversions: 4.1, roas: 340 },
        { month: '€7K', conversions: 5.2, roas: 300 },
        { month: '€10K', conversions: 6.3, roas: 250 },
      ],
      config: {
        conversions: { label: 'Conversions (K)', color: 'hsl(var(--chart-1))' },
        roas: { label: 'ROAS index', color: 'hsl(var(--chart-2))' },
      },
    },
    insights: [
      { title: 'Common starting point', text: '€5,000 is a typical budget for plans with this reach and flight length.' },
      { title: 'Diminishing returns', text: 'Past ~€7K extra spend still adds conversions, but ROAS starts to soften.' },
      { title: 'Change anytime', text: 'Raise it later, or turn on automatic budget to optimise pacing for you.' },
    ],
  };
}

/**
 * Explainer for the goal→funnel→KPI insight — where the chosen goal sits in the
 * funnel and which KPIs it is now reported on.
 */
export function funnelKpiExplain(opts: { stage: string; kpis: string[] }): AdviceExplain {
  const { stage, kpis } = opts;
  const order = ['Awareness', 'Consideration', 'Conversion'];
  const volumes: Record<string, number> = { Awareness: 100, Consideration: 48, Conversion: 18 };
  return {
    stats: [
      { label: 'Funnel stage', value: stage, sub: 'Selected' },
      { label: 'KPIs tracked', value: String(kpis.length), sub: 'In metric row' },
      { label: 'Primary KPI', value: kpis[0] ?? '—', sub: 'Headline' },
    ],
    chart: {
      kind: 'bar',
      xKey: 'stage',
      horizontal: true,
      title: 'Where this goal sits in the funnel',
      data: order.map((s) => ({ stage: s, volume: volumes[s] })),
      config: { volume: { label: 'Relative funnel volume', color: 'hsl(var(--chart-1))' } },
    },
    insights: [
      { title: 'KPIs that matter', text: `${stage} is judged on ${kpis.slice(0, 3).join(', ')}${kpis.length > 3 ? '…' : ''}.` },
      { title: 'Channel fit', text: stage === 'Conversion' ? 'Sponsored Products + Display work best together at this stage.' : 'Display and Digital in-store drive the broad, high-frequency reach this stage needs.' },
      { title: 'Reported automatically', text: 'These KPIs now appear in the metric row and the plan summary.' },
    ],
  };
}

export interface OptimisationCardProps {
  /** Recommendation notifications shown in the card (aim for 2–4). */
  items?: Advice[];
  className?: string;
  /** @deprecated kept for caller compatibility — recommendations are always shown. */
  assisted?: boolean;
  /** @deprecated kept for caller compatibility — the on/off toggle was removed. */
  onToggle?: (v: boolean) => void;
}

/**
 * "Recommendations" card — an advice feed styled like the notification centre.
 * It is always on: every suggestion is clickable and opens a modal that explains
 * it with data and a chart, and lets the user accept the recommendation, decline
 * it, or ask the Campaign Agent for detail. KPIs/metrics belong in the metric
 * row, not here.
 */
export const OptimisationCard: React.FC<OptimisationCardProps> = ({ items = [], className }) => {
  const [active, setActive] = React.useState<Advice | null>(null);
  const [question, setQuestion] = React.useState('');

  const close = () => {
    setActive(null);
    setQuestion('');
  };

  const accept = () => {
    active?.action?.onClick();
    close();
  };

  const askAgent = () => {
    const base = typeof active?.message === 'string' ? active.message : active?.badge ?? '';
    const q = question.trim() ? `${question.trim()} (re: ${base})` : `Tell me more: ${base}`;
    if (typeof window !== 'undefined') window.location.href = `/chat?q=${encodeURIComponent(q)}`;
  };

  return (
    <div className={cn('rounded-lg border bg-muted/40 p-4 transition-colors', className)}>
      <div className="mb-3 flex items-center gap-2 text-sm font-medium">
        <Sparkles className="h-4 w-4 text-primary" />
        Recommendations
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground">Recommendations appear as you make selections.</p>
      ) : (
        <ul className="space-y-1">
          {items.map((a, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => setActive(a)}
                className="group/advice -mx-2 flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-accent/70"
              >
                <p className="flex-1 text-xs text-muted-foreground">
                  <span className={cn('mr-2 inline-flex items-center rounded-full border px-2 py-0.5 align-middle text-[10px] font-medium', adviceToneClasses[a.tone])}>{a.badge}</span>
                  {a.message}
                </p>
                <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/50 transition-colors group-hover/advice:text-foreground" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={active != null} onOpenChange={(open) => { if (!open) close(); }}>
        <DialogContent className="flex max-h-[88vh] max-w-lg flex-col gap-4 overflow-y-auto">
          {active && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium', adviceToneClasses[active.tone])}>{active.badge}</span>
                </DialogTitle>
                <DialogDescription className="pt-1 text-sm text-foreground">{active.message}</DialogDescription>
              </DialogHeader>

              {active.explain && (
                <div className="space-y-4">
                  {active.explain.stats && (
                    <div className="grid grid-cols-3 gap-2">
                      {active.explain.stats.map((s, i) => (
                        <div key={i} className="rounded-lg border p-2.5">
                          <div className="text-[11px] text-muted-foreground">{s.label}</div>
                          <div className="text-base font-semibold leading-tight">{s.value}</div>
                          {s.sub && (
                            <div className={cn('mt-0.5 text-[10px]', s.tone === 'success' ? 'text-green-600' : 'text-muted-foreground')}>{s.sub}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {active.explain.chart && (
                    <div>
                      {active.explain.chart.title && (
                        <div className="mb-1 text-xs font-medium text-muted-foreground">{active.explain.chart.title}</div>
                      )}
                      {active.explain.chart.kind === 'bar' ? (
                        <BarChartComponent
                          data={active.explain.chart.data}
                          config={active.explain.chart.config}
                          className="h-[190px] w-full"
                          showLegend
                          horizontal={active.explain.chart.horizontal}
                          xAxisDataKey={active.explain.chart.xKey ?? 'month'}
                        />
                      ) : (
                        <AreaChartComponent
                          data={active.explain.chart.data}
                          config={active.explain.chart.config}
                          className="h-[170px] w-full"
                          showLegend
                          showRightYAxis={!!active.explain.chart.rightAxisKey}
                          rightAxisDataKey={active.explain.chart.rightAxisKey}
                        />
                      )}
                    </div>
                  )}

                  {active.explain.insights && (
                    <ul className="space-y-2">
                      {active.explain.insights.map((it, i) => (
                        <li key={i} className="flex gap-2 text-xs">
                          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                          <span className="text-muted-foreground">
                            <span className="font-medium text-foreground">{it.title}: </span>
                            {it.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Ask the Campaign Agent</label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask a follow-up to get more detail…"
                  rows={2}
                  className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
                <Button variant="outline" size="sm" className="gap-1.5" onClick={askAgent}>
                  <MessageSquare className="h-4 w-4" />
                  Ask the agent
                </Button>
              </div>

              <DialogFooter className="gap-2 sm:justify-between">
                <Button variant="outline" className="gap-1.5" onClick={close}>
                  <X className="h-4 w-4" />
                  Decline
                </Button>
                <Button className="gap-1.5" onClick={accept}>
                  <Check className="h-4 w-4" />
                  {active.action ? active.action.label : 'Accept'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
