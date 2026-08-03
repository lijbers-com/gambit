import * as React from 'react';
import { Sparkles, ChevronRight, Check, X, HeartPulse, AlertCircle, Lightbulb, Bell, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import {
  RightDrawer,
  RightDrawerContent,
  RightDrawerHeader,
  RightDrawerFooter,
  RightDrawerTitle,
  RightDrawerDescription,
  RightDrawerBody,
} from './right-drawer';
import { ConversationTemplate } from './conversation-template';
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
  /** Bold first line, like a mail subject. Falls back to the badge label. */
  title?: string;
  /** The preview line under the title. */
  message: React.ReactNode;
  /** The "accept / improve" action offered in the modal (e.g. "Set budget to automatic"). */
  action?: { label: string; onClick: () => void };
  /** Rich explanation (stats + chart + insights) shown in the modal. */
  explain?: AdviceExplain;
  /** Seed this recommendation as already actioned — it renders under "Done". */
  done?: boolean;
};

/**
 * The notification vocabulary is deliberately small. Every notification is one of
 * four kinds so the card (and the notification centre) stay legible:
 *   • Health         — the plan's overall status (handled by HealthNotification)
 *   • Recommendation — an optimisation you can accept (e.g. automatic budget)
 *   • Insight        — an informational finding (e.g. CTR could improve)
 *   • Action needed  — something you must do (incomplete setup, approvals, alerts)
 */
export type NotificationKind = 'recommendation' | 'insight' | 'action';

export const notificationKindConfig: Record<NotificationKind, { label: string; Icon: LucideIcon; badge: string; icon: string; text: string }> = {
  recommendation: { label: 'Recommendation', Icon: Lightbulb,   badge: 'border-primary/20 bg-primary/5 text-primary',    icon: 'border border-primary/20 bg-primary/5 text-primary', text: 'text-primary' },
  insight:        { label: 'Insight',         Icon: Sparkles,    badge: 'border-border bg-neutral-50 text-neutral-600',   icon: 'border border-border bg-neutral-50 text-neutral-600', text: 'text-muted-foreground' },
  action:         { label: 'Action needed',   Icon: AlertCircle, badge: 'border-amber-200 bg-amber-50 text-amber-700',    icon: 'bg-amber-100 text-amber-700', text: 'text-amber-700' },
};

/** Collapse the loose per-item badges (Suggestion, Tip, AI Insight, Incomplete…) into one of the four kinds. */
export const adviceKind = (a: Advice): NotificationKind => {
  const badge = a.badge.toLowerCase();
  if (badge.includes('insight')) return 'insight';
  if (a.tone === 'alert' || badge.includes('incomplete') || badge.includes('alert') || badge.includes('approval') || badge.includes('action')) return 'action';
  return 'recommendation';
};

/**
 * Media-plan health check — surfaced as a notification. Red ("At risk") means the
 * plan is not performing; amber needs attention; green is healthy. Clicking it
 * opens the same side panel with the detail behind the status.
 */
export type HealthLevel = 'good' | 'attention' | 'risk';

export type HealthNotification = {
  level: HealthLevel;
  /** One-line status message shown on the notification row. */
  message: React.ReactNode;
  explain?: AdviceExplain;
};

export const healthConfig: Record<HealthLevel, { label: string; Icon: LucideIcon; row: string; icon: string; badge: string; text: string }> = {
  good:      { label: 'Healthy',         Icon: HeartPulse, row: 'border-green-200 bg-green-50/60 hover:bg-green-50', icon: 'bg-green-100 text-green-700', badge: 'border-green-200 bg-green-100 text-green-700', text: 'text-green-700' },
  attention: { label: 'Needs attention', Icon: HeartPulse, row: 'border-amber-200 bg-amber-50/60 hover:bg-amber-50', icon: 'bg-amber-100 text-amber-700', badge: 'border-amber-200 bg-amber-100 text-amber-700', text: 'text-amber-700' },
  risk:      { label: 'At risk',         Icon: HeartPulse, row: 'border-red-200 bg-red-50/60 hover:bg-red-50',       icon: 'bg-red-100 text-red-700',     badge: 'border-red-200 bg-red-100 text-red-700', text: 'text-red-700' },
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
  /** Media-plan health check, rendered as the first (prominent) notification. */
  health?: HealthNotification;
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
export const OptimisationCard: React.FC<OptimisationCardProps> = ({ items = [], health, className }) => {
  const [active, setActive] = React.useState<Advice | null>(null);
  const [activeIdx, setActiveIdx] = React.useState<number | null>(null);
  // When the health notification is the one opened in the side panel.
  const [activeHealth, setActiveHealth] = React.useState(false);
  const [question, setQuestion] = React.useState('');
  // Recommendations the user has actioned — seeded from any items flagged `done`,
  // then grown as the user accepts suggestions in the modal.
  const [completed, setCompleted] = React.useState<Set<number>>(
    () => new Set(items.map((a, i) => (a.done ? i : -1)).filter((i) => i >= 0)),
  );

  const openAdvice = (a: Advice, i: number) => {
    setActiveHealth(false);
    setActive(a);
    setActiveIdx(i);
  };

  // The health notification reuses the same side panel; modelled as an advice so
  // the drawer body (question + stats + chart) renders identically.
  const healthAdvice: Advice | null = health
    ? { badge: healthConfig[health.level].label, tone: health.level === 'good' ? 'success' : health.level === 'attention' ? 'alert' : 'alert', message: health.message, explain: health.explain }
    : null;

  const openHealth = () => {
    if (!healthAdvice) return;
    setActive(healthAdvice);
    setActiveIdx(null);
    setActiveHealth(true);
  };

  const close = () => {
    setActive(null);
    setActiveIdx(null);
    setActiveHealth(false);
    setQuestion('');
  };

  const accept = () => {
    active?.action?.onClick();
    if (activeIdx != null) setCompleted((prev) => new Set(prev).add(activeIdx));
    close();
  };

  const todo = items.map((a, i) => ({ a, i })).filter(({ i }) => !completed.has(i));
  const done = items.map((a, i) => ({ a, i })).filter(({ i }) => completed.has(i));

  const askAgent = () => {
    const base = typeof active?.message === 'string' ? active.message : active?.badge ?? '';
    const q = question.trim() ? `${question.trim()} (re: ${base})` : `Tell me more: ${base}`;
    if (typeof window !== 'undefined') window.location.href = `/chat?q=${encodeURIComponent(q)}`;
  };

  /**
   * A single notification, styled like a mail-list item: a small status dot,
   * a bold subject line with its type on the right, and a preview line under
   * it. Rows are divided rather than boxed so a long list stays compact.
   */
  const NotificationRow = ({ icon: Icon, iconClass, badge, badgeClass, title, message, onClick, muted }: {
    icon: LucideIcon; iconClass: string; badge: string; badgeClass: string;
    title: string; message: React.ReactNode; onClick: () => void; muted?: boolean;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group/notif flex w-full items-start gap-3 border-b border-border/60 px-3 py-2.5 text-left transition-colors last:border-b-0 hover:bg-accent/50',
        muted && 'opacity-60 hover:opacity-100',
      )}
    >
      <span className={cn('mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full', iconClass)}>
        <Icon className="h-3 w-3" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline gap-2">
          <span className={cn('min-w-0 truncate text-sm font-medium text-foreground', muted && 'line-through')}>
            {title}
          </span>
          <span className={cn('ml-auto shrink-0 text-[11px] font-medium', badgeClass)}>{badge}</span>
        </span>
        <span className="mt-0.5 block truncate text-xs text-muted-foreground">{message}</span>
      </span>
      <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/40 transition-colors group-hover/notif:text-foreground" />
    </button>
  );

  /** The bold subject line — an explicit title, else the type label. */
  const subjectOf = (a: Advice) => a.title ?? notificationKindConfig[adviceKind(a)].label;

  return (
    <div className={cn('overflow-hidden rounded-lg border bg-card transition-colors', className)}>
      <div className="flex items-center gap-2 border-b bg-muted/40 px-3 py-2 text-sm font-medium">
        <Bell className="h-4 w-4 text-primary" />
        Notifications
      </div>

      <div>
        {/* Health check — the plan's overall status, always first. */}
        {health && (
          <NotificationRow
            icon={healthConfig[health.level].Icon}
            iconClass={healthConfig[health.level].icon}
            badge={healthConfig[health.level].label}
            badgeClass={healthConfig[health.level].text}
            title={`Media plan health — ${healthConfig[health.level].label}`}
            message={health.message}
            onClick={openHealth}
          />
        )}

        {items.length === 0 && !health ? (
          <p className="px-3 py-3 text-sm text-muted-foreground">Notifications appear as you make selections.</p>
        ) : (
          <>
            {/* To do — open notifications the user still has to action. The
                heading only shows once there's also a Done section. */}
            {todo.length > 0 && (
              <div>
                {done.length > 0 && (
                  <div className="border-b bg-muted/20 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                    To do ({todo.length})
                  </div>
                )}
                {todo.map(({ a, i }) => {
                  const kc = notificationKindConfig[adviceKind(a)];
                  return (
                    <NotificationRow
                      key={i}
                      icon={kc.Icon}
                      iconClass={kc.icon}
                      badge={kc.label}
                      badgeClass={kc.text}
                      title={subjectOf(a)}
                      message={a.message}
                      onClick={() => openAdvice(a, i)}
                    />
                  );
                })}
              </div>
            )}

            {/* Done — notifications already actioned, kept as a record. */}
            {done.length > 0 && (
              <div>
                <div className="border-y bg-muted/20 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                  Done ({done.length})
                </div>
                {done.map(({ a, i }) => (
                  <NotificationRow
                    key={i}
                    icon={Check}
                    iconClass="bg-green-100 text-green-700"
                    badge={notificationKindConfig[adviceKind(a)].label}
                    badgeClass="text-muted-foreground"
                    title={subjectOf(a)}
                    message={a.message}
                    onClick={() => openAdvice(a, i)}
                    muted
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <RightDrawer open={active != null} onOpenChange={(open) => { if (!open) close(); }}>
        <RightDrawerContent className="sm:max-w-xl">
          {active && (
            <>
              <RightDrawerHeader onClose={close}>
                <RightDrawerTitle className="flex items-center gap-2">
                  {activeHealth && health ? (
                    <>
                      {(() => { const HIcon = healthConfig[health.level].Icon; return <HIcon className="h-4 w-4" />; })()}
                      <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium', healthConfig[health.level].badge)}>{healthConfig[health.level].label}</span>
                    </>
                  ) : (
                    <>
                      {(() => { const KIcon = notificationKindConfig[adviceKind(active)].Icon; return <KIcon className="h-4 w-4 text-primary" />; })()}
                      <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium', notificationKindConfig[adviceKind(active)].badge)}>{notificationKindConfig[adviceKind(active)].label}</span>
                    </>
                  )}
                </RightDrawerTitle>
                <RightDrawerDescription>{activeHealth ? 'Media plan health' : 'Campaign Agent recommendation'}</RightDrawerDescription>
              </RightDrawerHeader>

              <RightDrawerBody>
                <ConversationTemplate
                  question={activeHealth ? 'How is this media plan doing?' : active.action ? `Should I ${String(active.action.label).toLowerCase()}?` : 'Can you tell me more about this recommendation?'}
                  answer={active.message}
                  stats={active.explain?.stats}
                  chart={active.explain?.chart}
                  insights={active.explain?.insights}
                  followUp={question}
                  onFollowUpChange={setQuestion}
                  onAskAgent={askAgent}
                />
              </RightDrawerBody>

              <RightDrawerFooter className="justify-between">
                {activeHealth ? (
                  <Button variant="outline" className="ml-auto" onClick={close}>Close</Button>
                ) : activeIdx != null && completed.has(activeIdx) ? (
                  <>
                    <Button
                      variant="outline"
                      className="gap-1.5"
                      onClick={() => {
                        if (activeIdx != null) setCompleted((prev) => { const n = new Set(prev); n.delete(activeIdx); return n; });
                        close();
                      }}
                    >
                      Move back to to-do
                    </Button>
                    <Button variant="outline" onClick={close}>Close</Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="gap-1.5" onClick={close}>
                      <X className="h-4 w-4" />
                      Decline
                    </Button>
                    <Button className="gap-1.5" onClick={accept}>
                      <Check className="h-4 w-4" />
                      {active.action ? active.action.label : 'Accept'}
                    </Button>
                  </>
                )}
              </RightDrawerFooter>
            </>
          )}
        </RightDrawerContent>
      </RightDrawer>
    </div>
  );
};
