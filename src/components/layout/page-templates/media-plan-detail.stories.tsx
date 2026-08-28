import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { MenuContextProvider } from '@/contexts/menu-context';
import { AppLayout } from '../app-layout';
import { MetricRow, type MetricDefinition } from '@/components/ui/metric-row';
import { Badge } from '@/components/ui/badge';
import {
  CardWithTabs,
  tabFirst,
  BudgetStackedMini,
  BudgetStackedDetail,
  DonutLegendDetail,
  BarVerticalMini,
  BarHorizontalDetail,
} from '@/components/ui/card';
import { Table, type TableColumn } from '@/components/ui/table';
import { FilterBar } from '@/components/ui/filter-bar';
import { FormSection } from '@/components/ui/form-section';
import { GoalCard } from '@/components/ui/goal-card';
import { LifecycleActions } from '@/components/ui/lifecycle-actions';
import { AddCampaignMenu } from '@/components/ui/add-campaign-menu';
import { LinkPickerDialog } from '@/components/ui/link-picker';
import { ReadOnlyField } from '@/components/ui/read-only-field';
import { SearchSelectList } from '@/components/ui/search-select-list';
import { Checkbox } from '@/components/ui/checkbox';
import { RetailProductSelect } from '@/components/ui/retail-product-select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DateRangePicker, futureDateRangePresets } from '@/components/ui/date-picker';
import { Switch } from '@/components/ui/switch';
import { allocateBudget } from '@/lib/budget-allocation';
import { Euro, Lock, Pencil } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import type { DateRange } from 'react-day-picker';
import { HierarchyBadge } from '@/components/ui/hierarchy-badge';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { useStorybookTheme } from '@/contexts/storybook-theme-context';
import { cn } from '@/lib/utils';
import { retailMoments } from '@/lib/retail-moments';
import { buildForecastMetrics } from '@/components/ui/forecast-metrics';
import { stageForGoal } from '@/lib/funnel';
import { SetupChecklist } from '@/components/ui/setup-checklist';
import { MiniSelect } from '@/components/ui/delivery-settings';
import { ControlBar, ControlBarItem } from '@/components/ui/control-bar';
import { BudgetSelect } from '@/components/ui/budget-select';
import { Check, ChevronDown, ChevronRight, Plus, LayoutGrid, Table2, HeartPulse, ListStart, MonitorSpeaker, MonitorPlay, Store, Globe, Eye, Brain, ShoppingCart, Heart, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useDb, updateMediaPlan, updateCampaign, deleteMediaPlan, deriveMessages, derivePlanHealth, useInboxState, type EngineId, type PlanStatus } from '@/lib/db';
import { InboxPanel } from '@/components/ui/inbox-panel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  RightDrawer,
  RightDrawerContent,
  RightDrawerHeader,
  RightDrawerTitle,
  RightDrawerDescription,
  RightDrawerBody,
} from '@/components/ui/right-drawer';
import { InsightsTab } from './insights-tab';
import { describeObjective, describeKpi, goalLabel, objectiveLabel, kpiLabel } from '@/lib/objective-kpi-copy';
import { propositionColor, propositionLabel } from '@/lib/proposition-colors';

const meta: Meta<typeof AppLayout> = {
  title: 'Page templates/Media Plan Detail',
  component: AppLayout,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

// The campaigns & bookings table renders live rows from the prototype
// database (media plan → campaigns → bookings), formatted via these helpers.

const fmtEuro = (n: number) => `€${n.toLocaleString()}`;
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const fmtRange = (start: string, end: string) => `${fmtDate(start)} → ${fmtDate(end)}`;
// Goal catalog — same shape as the create-media-plan wizard's goal cards.
const goals = [
  { id: 'awareness', kpis: ['Reach', 'Frequency', 'Brand awareness', 'Ad recall'], icon: <Eye size={24} />, title: 'Awareness', description: 'Reach a broad audience and make them aware of your brand, product or service' },
  { id: 'consideration', kpis: ['CTR', 'Purchase intent', 'Brand preference', 'Engagement'], icon: <Brain size={24} />, title: 'Consideration', description: 'Encourage people to think about your brand and seek out more information' },
  { id: 'purchase', kpis: ['Incremental ROAS', 'Conversion rate', 'Sales lift'], icon: <ShoppingCart size={24} />, title: 'Purchase', description: 'Drive sales and conversions on your website, in your app or in physical stores' },
  { id: 'loyalty', kpis: ['Repeat purchases', 'Incremental ROAS', 'Sales lift'], icon: <Heart size={24} />, title: 'Loyalty', description: 'Strengthen existing customer relationships and drive repeat purchases' },
];
// Each option carries a one-liner so the selected card explains what the
// objective/KPI stands for (shared copy: src/lib/objective-kpi-copy.ts).
const objectiveOptions = ['merkbekendheid', 'productbekendheid', 'merk-associaties'].map((id) => ({
  label: objectiveLabel(id),
  value: id,
  description: describeObjective(id),
}));
const kpiFilterOptions = ['toma', 'spontaan', 'adrecall', 'cep'].map((id) => ({
  label: kpiLabel(id),
  value: id,
  description: describeKpi(id),
}));
const statusOptions = [
  { label: 'Draft', value: 'draft' },
  { label: 'In-option', value: 'in-option' },
  { label: 'Running', value: 'running' },
  { label: 'Paused', value: 'paused' },
  { label: 'Completed', value: 'completed' },
];

// Change history for the Logs tab.
type LogRow = { id: string; timestamp: string; user: string; action: string; field: string; oldValue: string; newValue: string; description: string };
const logData: LogRow[] = [
  { id: 'LOG-001', timestamp: '2026-05-28 14:30:00', user: 'Jane Doe', action: 'Media plan created', field: 'Media plan', oldValue: '-', newValue: 'Holiday Sale Plan', description: 'Initial media plan creation' },
  { id: 'LOG-002', timestamp: '2026-05-28 14:35:12', user: 'Jane Doe', action: 'Budget updated', field: 'Budget', oldValue: '€10,000', newValue: '€15,000', description: 'Budget increased for holiday push' },
  { id: 'LOG-003', timestamp: '2026-05-29 09:15:33', user: 'Sarah Wilson', action: 'Campaign added', field: 'Campaigns', oldValue: '-', newValue: 'SP - Early Capout Candidate', description: 'Added sponsored products campaign' },
  { id: 'LOG-004', timestamp: '2026-05-29 10:45:21', user: 'John Smith', action: 'Objective set', field: 'Objective', oldValue: '-', newValue: 'Brand awareness', description: 'Awareness objective selected' },
  { id: 'LOG-005', timestamp: '2026-05-30 11:30:14', user: 'Mike Johnson', action: 'Dates modified', field: 'Run time', oldValue: 'Jun 5, 2026', newValue: 'Jun 1, 2026', description: 'Brought the start date forward' },
  { id: 'LOG-006', timestamp: '2026-05-30 16:20:58', user: 'Jane Doe', action: 'Status changed', field: 'Status', oldValue: 'Draft', newValue: 'In-option', description: 'Media plan moved to in-option' },
];

// Proposition shown as icon + text (not a coloured badge) — one per engine.
const propositionMeta: Record<EngineId, { icon: LucideIcon; label: string }> = {
  'sponsored-products': { icon: ListStart, label: 'Sponsored products' },
  'display': { icon: MonitorSpeaker, label: 'Display' },
  'digital-instore': { icon: MonitorPlay, label: 'Digital in-store' },
  'offline-instore': { icon: Store, label: 'Offline in-store' },
  'offsite': { icon: Globe, label: 'Offsite' },
};
// Entity status → badge (campaign State + booking status share the treatment).
const statusBadge: Record<PlanStatus, { variant: 'success' | 'secondary' | 'warning' | 'outline'; label: string }> = {
  'running': { variant: 'success', label: 'Running' },
  'completed': { variant: 'secondary', label: 'Completed' },
  'paused': { variant: 'warning', label: 'Paused' },
  'in-option': { variant: 'outline', label: 'In-option' },
  'draft': { variant: 'outline', label: 'Draft' },
};

// One row type covering both levels so the whole hierarchy renders in a single
// shared Table. Campaign-only fields are blank on booking rows and vice-versa.
type Row = {
  /** 'add' is the trailing row under an expanded campaign that creates a
   *  booking in place, so a plan can be filled in without leaving the table. */
  _type: 'campaign' | 'booking' | 'add';
  _id: string;
  name: string;
  engine?: EngineId;
  /** How the campaign buys — auction or guaranteed. */
  buyingType?: 'auction' | 'guaranteed';
  state?: PlanStatus;
  status?: PlanStatus;
  budget: string;
  /** Raw values behind the formatted strings, for the inline editors. */
  budgetValue?: number;
  startDate?: string;
  endDate?: string;
  dailyCap?: string;
  dates?: string;
  objectiveKpi: string;
  inherits?: boolean;
  bookingsCount?: number;
  /** Open inbox messages for this row, so the table shows the same numbers the
   *  Inbox tab does rather than a second opinion. */
  actionCount?: number;
  recommendationCount?: number;
  insightCount?: number;
  /** Health for this row, derived from its own blocking work — the same rule
   *  derivePlanHealth applies one level up. */
  health?: 'good' | 'attention' | 'risk';
};

/** Health for a row, matching the chip the media plan card shows. */
/**
 * Budget cell that edits in place. Reads as plain text until it is focused, so
 * the table still scans as a table — the point is to tweak an allocation
 * without leaving the plan, not to turn every row into a form.
 */
const BudgetCell = ({ value, onSave, className, fullWidth }: { value: number; onSave: (next: number) => void; className?: string; fullWidth?: boolean }) => {
  const [draft, setDraft] = React.useState(String(value));
  const [editing, setEditing] = React.useState(false);
  React.useEffect(() => { if (!editing) setDraft(String(value)); }, [value, editing]);

  const parsed = Number(draft.replace(/[^0-9.]/g, ''));
  const dirty = editing && Number.isFinite(parsed) && parsed >= 0 && parsed !== value;

  // A budget change moves money on every campaign below it, so it commits on
  // the tick (or Enter) — never as a side effect of the field losing focus.
  const confirm = () => {
    setEditing(false);
    if (dirty) onSave(parsed);
    else setDraft(String(value));
  };
  const cancel = () => { setDraft(String(value)); setEditing(false); };

  return (
    <span className={cn('relative inline-flex items-center', fullWidth && 'flex w-full', dirty && '[&>input]:pr-8')} onClick={(e) => e.stopPropagation()}>
      <input
        value={editing ? draft : fmtEuro(value)}
        onChange={(e) => setDraft(e.target.value)}
        onFocus={() => { setEditing(true); setDraft(String(value)); }}
        onBlur={cancel}
        onKeyDown={(e) => {
          if (e.key === 'Enter') confirm();
          if (e.key === 'Escape') { cancel(); (e.target as HTMLInputElement).blur(); }
        }}
        aria-label="Budget"
        // No drop shadow: inside a table row it collected in the rounded
        // corners and read as dirt rather than depth.
        className={cn(
          'w-28 rounded-md border border-input bg-background px-2 py-1 text-sm tabular-nums transition-colors focus:outline-none focus:ring-1 focus:ring-ring',
          // Standalone (a checklist card, not a table cell) it matches the
          // date field beside it: same height, same full-row width.
          fullWidth && 'h-9 w-full px-3',
          className,
        )}
      />
      {dirty && (
        <button
          type="button"
          aria-label="Confirm budget change"
          title="Confirm budget change"
          // mousedown, because click would arrive after the input's blur has
          // already cancelled the edit.
          onMouseDown={(e) => { e.preventDefault(); confirm(); }}
          className="absolute right-1.5 flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Check className="h-3.5 w-3.5" />
        </button>
      )}
    </span>
  );
};

/** Run-time cell that edits in place, using the same picker as the forms. */
const DatesCell = ({
  start,
  end,
  onSave,
  className = 'h-8 px-2 text-sm font-normal',
}: {
  start?: string;
  end?: string;
  onSave: (startDate: string, endDate: string) => void;
  className?: string;
}) => (
  <div onClick={(e) => e.stopPropagation()}>
    <DateRangePicker
      dateRange={start && end ? { from: new Date(start), to: new Date(end) } : undefined}
      onDateRangeChange={(range) => {
        if (range?.from && range?.to) {
          onSave(range.from.toISOString().slice(0, 10), range.to.toISOString().slice(0, 10));
        }
      }}
      showPresets={false}
      showWeekNumbers
      events={retailMoments}
      className={className}
      placeholder="Set run time"
    />
  </div>
);

const HealthCell = ({ health }: { health: 'good' | 'attention' | 'risk' }) => {
  const cfg = {
    good: { label: 'Healthy', className: 'border-success-200 bg-success-50 text-success-700' },
    attention: { label: 'Health needs attention', className: 'border-warning-200 bg-warning-50 text-warning-700' },
    risk: { label: 'Health at risk', className: 'border-destructive-200 bg-destructive-50 text-destructive-700' },
  }[health];
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium', cfg.className)}>
      <HeartPulse className="h-3 w-3" />
      {cfg.label}
    </span>
  );
};

/** A count of open inbox messages for a row. */
/**
 * What a row's inbox holds, in one column.
 *
 * Three columns of counts made the reader add up their own total and left most
 * cells empty; one column says how many of what, and stays silent when there
 * is nothing. Actions lead because they block delivery — a recommendation can
 * wait, a missing creative cannot.
 */
const NotificationsCell = ({
  actions = 0,
  recommendations = 0,
  insights = 0,
  onOpen,
}: {
  actions?: number;
  recommendations?: number;
  insights?: number;
  /** Clicking any badge opens this row's notifications in the side panel. */
  onOpen?: () => void;
}) => {
  const parts = [
    { count: actions, label: 'action', plural: 'actions', variant: 'todo' as const },
    { count: recommendations, label: 'recommendation', plural: 'recommendations', variant: 'secondary' as const },
    { count: insights, label: 'insight', plural: 'insights', variant: 'secondary' as const },
  ].filter((p) => p.count > 0);

  if (parts.length === 0) return <span className="text-muted-foreground">—</span>;

  return (
    <span className="flex flex-wrap items-center gap-1">
      {parts.map((p) => (
        <button
          key={p.label}
          type="button"
          onClick={(e) => { e.stopPropagation(); onOpen?.(); }}
          title="Open notifications"
        >
          <Badge variant={p.variant} className="whitespace-nowrap tabular-nums transition-colors hover:opacity-80">
            {p.count} {p.count === 1 ? p.label : p.plural}
          </Badge>
        </button>
      ))}
    </span>
  );
};

export const MediaPlanDetail: Story = {
  // `planId` and `tab` come from the route via the app page; Storybook renders
  // without them and falls back to the first seeded plan on its first tab.
  render: (args) => {
    const { planId, tab } = (args ?? {}) as { planId?: string; tab?: string };
    // Which tab is open, so the FAQ under the card answers questions about
    // what the user is actually looking at.
    const [activeTab, setActiveTab] = React.useState(tab ?? 'campaigns');
    const toast = useToast();
    const { theme: storybookTheme } = useStorybookTheme();
    const routes = getRoutesForTheme(storybookTheme || 'retailMedia');
    const [expanded, setExpanded] = React.useState<string[]>([]);
    // Checklist cards the user skipped. Loaded in an effect, never during
    // render — localStorage at render time breaks hydration.
    /**
     * The campaigns tab has two presentations of the same campaigns: setup
     * cards while the plan is being built, the performance table once it
     * runs. The plan's status picks the default; the switch top-right lets
     * the user look at the other one without changing that default.
     */
    const [campaignViewOverride, setCampaignViewOverride] = React.useState<'cards' | 'table' | null>(null);
    const [skippedChecklist, setSkippedChecklist] = React.useState<string[]>([]);
    const skipKey = 'gambit-setup-skipped';
    React.useEffect(() => {
      try { setSkippedChecklist(JSON.parse(window.localStorage.getItem(skipKey) ?? '[]')); } catch { /* fresh */ }
    }, []);
    const skipChecklistCards = (ids: string[]) => {
      setSkippedChecklist((prev) => {
        const next = Array.from(new Set([...prev, ...ids]));
        try { window.localStorage.setItem(skipKey, JSON.stringify(next)); } catch { /* private mode */ }
        return next;
      });
    };
    // The table exists to show the plan's contents, so campaigns start open.
    // Keyed on the plan so navigating between plans re-opens the new one's rows.
    const expandedInitFor = React.useRef<string | null>(null);
    const [logUsers, setLogUsers] = React.useState<string[]>([]);
    const [logActions, setLogActions] = React.useState<string[]>([]);
    // A row's notifications, opened in the side panel from the table.
    const [inboxRow, setInboxRow] = React.useState<{ level: 'media-plan' | 'campaign' | 'booking'; id: string; name: string } | null>(null);
    const [confirmingDelete, setConfirmingDelete] = React.useState(false);

    // ── Live plan from the prototype database ──────────────────────────
    // The id comes from the route via the page (`planId`), so the server and
    // the hydrated client resolve the same plan. Storybook passes nothing, so
    // it falls back to the first seeded plan.
    const db = useDb();
    const plan = db.mediaPlans.find((p) => p.id === planId) ?? db.mediaPlans[0];
    React.useEffect(() => {
      if (!plan || expandedInitFor.current === plan.id) return;
      expandedInitFor.current = plan.id;
      setExpanded(db.campaigns.filter((c) => c.mediaPlanId === plan.id).map((c) => c.id));
    }, [plan, db.campaigns]);
    const planAdvertiser = db.advertisers.find((a) => a.id === plan?.advertiserId);

    // Form option lists come from the store.
    const advertiserOptions = db.advertisers.map((a) => ({ label: a.name, value: a.id }));
    const brandFilterOptions = (planAdvertiser?.brands ?? []).map((b) => ({
      label: b.name,
      value: b.id,
      hasRetailProducts: Boolean(b.hasRetailProducts),
    }));

    // Editable "Media plan details" form state — seeded from the plan.
    const [planName, setPlanName] = React.useState(plan?.name ?? '');
    const [poNumber, setPoNumber] = React.useState(plan?.poNumber ?? '');
    const [advertiser, setAdvertiser] = React.useState(plan?.advertiserId ?? '');
    const [brands, setBrands] = React.useState<string[]>(plan?.brandIds ?? []);
    const [retailProducts, setRetailProducts] = React.useState<string[]>([]);
    const brandsHaveRetailProducts = brands.some((v) => brandFilterOptions.find((b) => b.value === v)?.hasRetailProducts);
    const [goal, setGoal] = React.useState(plan?.goal ?? 'awareness');
    const [objective, setObjective] = React.useState(plan?.objective ?? '');
    const [kpis, setKpis] = React.useState<string[]>(plan?.kpis ?? []);
    const [kpiStudies, setKpiStudies] = React.useState<string[]>([]);
    const [status, setStatus] = React.useState(plan?.status ?? 'draft');

    // Re-seed the form when the plan id changes (client navigation).
    const seededPlanId = React.useRef(plan?.id);
    React.useEffect(() => {
      if (!plan || seededPlanId.current === plan.id) return;
      seededPlanId.current = plan.id;
      setPlanName(plan.name);
      setPoNumber(plan.poNumber ?? '');
      setAdvertiser(plan.advertiserId);
      setBrands(plan.brandIds);
      setGoal(plan.goal ?? 'awareness');
      setObjective(plan.objective ?? '');
      setKpis(plan.kpis);
      setStatus(plan.status);
    }, [plan]);

    // Persist the form back into the store.
    const savePlan = () => {
      if (!plan) return;
      updateMediaPlan(plan.id, {
        name: planName,
        poNumber: poNumber || undefined,
        advertiserId: advertiser,
        brandIds: brands,
        goal,
        objective: objective || undefined,
        kpis,
        status: status as PlanStatus,
        // Budget and run time belong to the control bar (BudgetSelect and the
        // date picker), which write to the store directly. Saving them from
        // here again reverted control-bar edits to this form's stale copies.
      });
    };

    // Campaigns & bookings filters (surface once the plan grows).
    const [rowSearch, setRowSearch] = React.useState('');
    const [propFilter, setPropFilter] = React.useState<string[]>([]);
    const [stateFilter, setStateFilter] = React.useState<string[]>([]);
    const toggle = (id: string) =>
      setExpanded((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

    // Live campaigns + bookings for this plan.
    const planCampaignRows = db.campaigns
      .filter((c) => plan && c.mediaPlanId === plan.id)
      .map((c) => ({ campaign: c, bookings: db.bookings.filter((b) => b.campaignId === c.id) }));

    const planSpend = planCampaignRows.reduce((s, r) => s + r.campaign.spend, 0);
    const spentPct = plan && plan.budget > 0 ? Math.round((planSpend / plan.budget) * 100) : 0;
    const fmtK = (n: number) => (n >= 1000 ? `€${(n / 1000).toFixed(1)}K` : `€${n}`);

    // Per-proposition rollup — the plan's campaigns grouped by engine. Every
    // metric card below splits on this, so the breakdowns always add up to the
    // headline figure.
    const byEngine = (() => {
      const acc = new Map<EngineId, { budget: number; spend: number }>();
      planCampaignRows.forEach(({ campaign: c }) => {
        const cur = acc.get(c.engine) ?? { budget: 0, spend: 0 };
        acc.set(c.engine, { budget: cur.budget + c.budget, spend: cur.spend + c.spend });
      });
      return [...acc.entries()].map(([engine, v]) => ({
        engine,
        name: propositionLabel(engine),
        color: propositionColor(engine),
        ...v,
      }));
    })();

    // Impressions, conversions and ROAS are not in the prototype database yet,
    // so they are derived from real spend with fixed factors. That keeps the
    // breakdowns internally consistent and moving with the data, rather than
    // being fixed strings that never change.
    const IMPRESSIONS_PER_EURO = 120;
    const CONVERSIONS_PER_EURO = 0.04;
    const impressionsByEngine = byEngine.map((e) => ({ name: e.name, value: Math.round(e.spend * IMPRESSIONS_PER_EURO) }));
    const conversionsByEngine = byEngine.map((e) => ({ name: e.name, value: Math.round(e.spend * CONVERSIONS_PER_EURO) }));
    const roasByEngine = byEngine.map((e) => ({
      name: e.name,
      value: e.spend > 0 && e.budget > 0 ? Math.round((2.4 + (e.spend / e.budget) * 2.2) * 10) / 10 : 0,
      color: e.color,
    }));
    const budgetVsSpend = byEngine.map((e) => ({ name: e.name, spent: e.spend, budget: e.budget, color: e.color }));
    const propositionColors = byEngine.map((e) => e.color);

    const impressionsTotal = impressionsByEngine.reduce((s, e) => s + e.value, 0);
    const conversionsTotal = conversionsByEngine.reduce((s, e) => s + e.value, 0);
    const roasWeighted = planSpend > 0
      ? Math.round((byEngine.reduce((s, e, i) => s + roasByEngine[i].value * e.spend, 0) / planSpend) * 10) / 10
      : 0;


    const fmtNumberCompact = (n: number) =>
      n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(Math.round(n));
    const fmtRoasValue = (v: number) => `${v.toFixed(1)}x`;

    /**
     * Before the plan runs there are no actuals — a row of zeros read as the
     * wizard's forecast being wiped the moment the plan was created. So a
     * pre-live plan keeps the forecast reading, from the same model the
     * wizard used: the identical four cards, ranges instead of measurements,
     * each wearing a Forecast badge that disappears when the plan goes live.
     */
    const preLive = !!plan && (plan.status === 'draft' || plan.status === 'in-option');
    // The identical row the wizard showed while this plan was drafted — one
    // builder decides the cards, charts and numbers for both surfaces, so
    // creating the plan changes nothing on screen. Live plans swap to actuals
    // below and the Forecast badges disappear.
    const planDays = plan
      ? Math.max(1, Math.round((new Date(plan.endDate).getTime() - new Date(plan.startDate).getTime()) / 86400000) + 1)
      : 0;
    const forecastMetrics: MetricDefinition[] = buildForecastMetrics({
      budget: plan?.budget ?? 0,
      days: planDays,
      engines: byEngine.map((e) => ({ name: e.name, budget: e.budget, color: e.color })),
      stage: plan?.goal ? stageForGoal[plan.goal] : undefined,
      // The control panel already states the budget, so the row leads with
      // what has actually been spent against it.
      spend: planSpend,
    });

    // The same cards the media plan card shows, each expanding in place to its
    // per-proposition breakdown.
    const liveMetrics: MetricDefinition[] = [
      {
        key: 'budget',
        // The number is what has been SPENT; the budget is the "of €15.0K"
        // context underneath. Labelling it Budget said the opposite.
        label: 'Spend',
        value: fmtK(planSpend),
        subMetric: `of ${fmtK(plan?.budget ?? 0)} budget`,
        badgeValue: `${spentPct}%`,
        badgeVariant: 'secondary',
        variant: 'budgetStacked',
        budgetData: budgetVsSpend,
        valueFormatter: fmtK,
        chart: <BudgetStackedMini budgetData={budgetVsSpend} />,
        expandedContent: <BudgetStackedDetail budgetData={budgetVsSpend} valueFormatter={fmtK} />,
      },
      {
        key: 'impressions',
        label: 'Impressions',
        value: fmtNumberCompact(impressionsTotal),
        variant: 'donut',
        donutData: impressionsByEngine,
        donutColors: propositionColors,
        totalRow: { label: 'Media plan', value: impressionsTotal },
        valueFormatter: fmtNumberCompact,
        expandedContent: (
          <DonutLegendDetail
            donutData={impressionsByEngine}
            donutColors={propositionColors}
            totalRow={{ label: 'Media plan', value: impressionsTotal }}
            valueFormatter={fmtNumberCompact}
          />
        ),
      },
      {
        key: 'conversions',
        label: 'Conversions',
        value: fmtNumberCompact(conversionsTotal),
        variant: 'donut',
        donutData: conversionsByEngine,
        donutColors: propositionColors,
        totalRow: { label: 'Media plan', value: conversionsTotal },
        valueFormatter: fmtNumberCompact,
        expandedContent: (
          <DonutLegendDetail
            donutData={conversionsByEngine}
            donutColors={propositionColors}
            totalRow={{ label: 'Media plan', value: conversionsTotal }}
            valueFormatter={fmtNumberCompact}
          />
        ),
      },
      {
        key: 'roas',
        label: 'ROAS',
        value: fmtRoasValue(roasWeighted),
        variant: 'barHorizontal',
        productData: roasByEngine,
        chart: <BarVerticalMini productData={roasByEngine} valueFormatter={fmtRoasValue} />,
        totalRow: { label: 'Media plan', value: roasWeighted },
        valueFormatter: fmtRoasValue,
        expandedContent: (
          <BarHorizontalDetail
            productData={roasByEngine}
            totalRow={{ label: 'Media plan', value: roasWeighted }}
            valueFormatter={fmtRoasValue}
          />
        ),
      },
    ];

    // Apply the Campaigns & bookings filters (search / proposition / state).
    const filteredCampaigns = planCampaignRows.filter(({ campaign: c, bookings }) => {
      const q = rowSearch.trim().toLowerCase();
      const searchMatch = !q || c.name.toLowerCase().includes(q) || bookings.some((b) => b.name.toLowerCase().includes(q));
      const propMatch = propFilter.length === 0 || propFilter.includes(c.engine);
      const stateMatch = stateFilter.length === 0 || stateFilter.includes(c.status) || bookings.some((b) => stateFilter.includes(b.status));
      return searchMatch && propMatch && stateMatch;
    });

    // The stored ids are keys, not copy — always render them through the
    // vocabulary so the table reads "Awareness / Brand awareness".
    const objectiveKpiLabel =
      [plan?.goal && goalLabel(plan.goal), plan?.objective && objectiveLabel(plan.objective)]
        .filter(Boolean)
        .join(' / ') || '—';

    // What the Notifications tab badges: messages for this plan the reader has
    // not opened yet — the same state the inbox list marks with its dot.
    const inboxStatus = useInboxState();
    const unreadCount = plan
      ? deriveMessages(db, { mediaPlanId: plan.id }).filter(
          (m) => (inboxStatus[m.id] ?? 'unread') === 'unread',
        ).length
      : 0;

    const autoBudget = plan?.autoBudget ?? false;
    /** Split the plan budget across its campaigns and write the result. */
    const reallocate = (planBudget: number) => {
      if (!plan) return;
      const planCampaigns = db.campaigns.filter((c) => c.mediaPlanId === plan.id);
      const shares = allocateBudget({
        planBudget,
        campaigns: planCampaigns,
        // Weight by what each proposition returns, using the same per-engine
        // ROAS the metric row shows.
        roasFor: (c) => roasByEngine.find((r) => r.name === propositionMeta[c.engine].label)?.value ?? 1,
      });
      Object.entries(shares).forEach(([id, budget]) => updateCampaign(id, { budget }));
    };

    // Flatten campaigns + (when expanded) their bookings into the table's rows.
    // Engine → route segment, shared by the add-booking jump and the row links.
    const routeSeg: Record<EngineId, string> = {
      'display': 'display',
      'sponsored-products': 'sponsored-products',
      'digital-instore': 'digital-instore',
      'offline-instore': 'offline-instore',
      'offsite': 'offsite',
    };

    /** Open the booking wizard for this campaign — the campaign wizard
     *  entered at its booking step, ending in the creative step. The booking
     *  detail page is the RESULT of that flow, not the starting point. */
    /** Runs started here come back here when they are done. */
    const backToPlan = plan ? `&returnTo=${encodeURIComponent(`/campaigns/plan/${plan.id}`)}` : '';

    const addBookingTo = (campaignId: string) => {
      const c = db.campaigns.find((x) => x.id === campaignId);
      if (!c || typeof window === 'undefined') return;
      window.location.href = `/create/${routeSeg[c.engine]}?campaignId=${c.id}${backToPlan}`;
    };

    /** Open a prefilled booking in its wizard, where saving approves it. */
    const approveBooking = (bookingId: string | undefined, campaignId: string) => {
      const c = db.campaigns.find((x) => x.id === campaignId);
      if (!c || typeof window === 'undefined') return;
      window.location.href = bookingId
        ? `/create/${routeSeg[c.engine]}?bookingId=${bookingId}${backToPlan}`
        : `/create/${routeSeg[c.engine]}?campaignId=${c.id}${backToPlan}`;
    };

    // The control bar summarises the whole plan, so its Notifications cell
    // counts every message under it — plan, campaigns and bookings — the same
    // population the Notifications tab badges. Counting only the plan-level
    // ones showed "—" while the tab said 4.
    const planAllMsgs = plan ? deriveMessages(db, { mediaPlanId: plan.id }) : [];
    const planOwnCounts = {
      actions: planAllMsgs.filter((m) => m.kind === 'action' || m.kind === 'health').length,
      recommendations: planAllMsgs.filter((m) => m.kind === 'recommendation').length,
      insights: planAllMsgs.filter((m) => m.kind === 'insight').length,
    };

    /**
     * The setup checklist: per campaign, the steps between here and live —
     * derived from the data, so a step completes itself the moment the work
     * exists, and a finished card leaves on its own. Each step opens the
     * surface where that work is done.
     */
    const checklistCards = plan
      ? db.campaigns
          .filter((c) => c.mediaPlanId === plan.id && c.status !== 'completed' && !skippedChecklist.includes(c.id))
          // The same filters and search the table obeys — one filter row
          // governs both presentations of the campaigns.
          .filter((c) => {
            const q = rowSearch.trim().toLowerCase();
            return (!q || c.name.toLowerCase().includes(q))
              && (propFilter.length === 0 || propFilter.includes(c.engine))
              && (stateFilter.length === 0 || stateFilter.includes(c.status));
          })
          .map((c) => {
            const bookings = db.bookings.filter((b) => b.campaignId === c.id);
            const meta = propositionMeta[c.engine];
            const CardIcon = meta.icon;
            // Each step IS a wizard run — the same booking-and-creatives flow
            // "Add campaign" continues into, entered at the right step. The
            // media plan wizard stopped at campaigns; these cards carry what
            // it deliberately left open.
            // A booking the plan wizard proposed is still a draft: it exists,
            // but nobody has checked it. Approving one means running the
            // prefilled booking wizard and saving it.
            const openCampaign = () => { if (typeof window !== 'undefined') window.location.href = `/campaigns/${routeSeg[c.engine]}/${c.id}`; };
            const draftBookings = bookings.filter((b) => b.status === 'draft');
            const steps = [
              {
                id: `${c.id}-campaign`,
                title: 'Approve campaign',
                description: 'Check what the media plan proposed — name, budget, run time and type.',
                done: c.status !== 'draft',
                onClick: () => {
                  if (typeof window !== 'undefined') window.location.href = `/create/${routeSeg[c.engine]}?campaignId=${c.id}&step=campaign${backToPlan}`;
                },
              },
              // An assisted campaign arrives with its bookings proposed, so
              // creating them is not work the user has left — approving them
              // is. An expert campaign starts empty and still has to make
              // them, so only it carries this step.
              ...(c.mode === 'assisted' && bookings.length > 0 ? [] : [{
                id: `${c.id}-bookings`,
                title: 'Create bookings',
                description: 'The guided setup walks through schedule, placement and delivery.',
                done: bookings.length > 0,
                onClick: () => addBookingTo(c.id),
              }]),
              {
                id: `${c.id}-approve`,
                title: 'Approve bookings',
                description: draftBookings.length > 0
                  ? `Check what was prefilled — ${draftBookings.length} booking${draftBookings.length === 1 ? '' : 's'} still to approve.`
                  : 'Check the prefilled bookings and approve them.',
                done: bookings.length > 0 && draftBookings.length === 0,
                onClick: () => approveBooking(draftBookings[0]?.id ?? bookings[0]?.id, c.id),
              },
              c.engine === 'sponsored-products'
                ? {
                    id: `${c.id}-targeting`,
                    title: 'Add products and keywords',
                    description: 'Part of the booking setup — target the right products and terms.',
                    done: bookings.length > 0 && bookings.every((b) => b.positionIds.length > 0),
                    onClick: () => addBookingTo(c.id),
                  }
                : {
                    id: `${c.id}-creatives`,
                    title: 'Link creatives',
                    description: 'The creative step of the setup wizard, for bookings still missing one.',
                    done: bookings.length > 0 && bookings.every((b) => b.creativeStatus !== 'missing'),
                    // The creative step belongs to the booking's own wizard —
                    // opened on the booking that still needs one.
                    onClick: () => {
                      const missing = bookings.find((b) => b.creativeStatus === 'missing');
                      window.location.href = missing
                        ? `/create/${routeSeg[c.engine]}?bookingId=${missing.id}&step=creatives${backToPlan}`
                        : `/create/${routeSeg[c.engine]}?campaignId=${c.id}${backToPlan}`;
                    },
                  },
            ];
            return {
              id: c.id,
              icon: <CardIcon />,
              title: `${meta.label} proposition`,
              // The campaign itself, as opposed to the setup steps: opening it
              // is where everything not on this card is edited.
              menu: [
                { label: 'Edit campaign', icon: <Pencil className="h-4 w-4" />, onClick: openCampaign },
              ],
              steps,
            };
          })
          .filter((card) => card.steps.some((step) => !step.done))
      : [];

    /**
     * A plan fresh out of the wizard is still being set up: its campaigns and
     * bookings are proposals nobody has checked. Until they are approved the
     * page is about that work — the setup cards — and not about numbers a
     * plan that has never run cannot have. It leaves the state on its own,
     * the moment nothing is waiting.
     */
    const awaitingApproval = !!plan && db.campaigns
      .filter((c) => c.mediaPlanId === plan.id)
      .some((c) => c.status === 'draft' || db.bookings.some((b) => b.campaignId === c.id && b.status === 'draft'));
    const inSetup = !!plan && plan.status === 'draft';
    React.useEffect(() => {
      if (plan && plan.status === 'draft' && !awaitingApproval) {
        updateMediaPlan(plan.id, { status: 'in-option' });
      }
    }, [plan, awaitingApproval]);

    // Cards are for setup that is still open; anything that has ever run —
    // running, paused, completed — opens on the table it is judged in, and so
    // does a pre-live plan whose campaigns are all set up (or skipped): a
    // checklist with nothing left is not worth greeting the user with.
    const planHasRun = !!plan && ['running', 'paused', 'completed'].includes(plan.status);
    // Unfiltered, unlike checklistCards — a search must not flip the view.
    const planNeedsSetup = !!plan && db.campaigns.some((c) => {
      if (c.mediaPlanId !== plan.id || c.status === 'completed' || skippedChecklist.includes(c.id)) return false;
      if (c.status === 'draft') return true;
      const bookings = db.bookings.filter((b) => b.campaignId === c.id);
      if (bookings.length === 0) return true;
      if (bookings.some((b) => b.status === 'draft')) return true;
      return c.engine === 'sponsored-products'
        ? bookings.some((b) => b.positionIds.length === 0)
        : bookings.some((b) => b.creativeStatus === 'missing');
    });
    const campaignsView = campaignViewOverride ?? (planHasRun || !planNeedsSetup ? 'table' : 'cards');

    const planBlockers = plan
      ? deriveMessages(db, { mediaPlanId: plan.id }).filter((m) => m.kind === 'action' && m.severity === 'blocking')
      : [];
    const canLaunch = !!plan && planBlockers.length === 0;

    /**
     * Add a campaign of a chosen proposition to this plan and open it.
     *
     * It starts as a draft inside the plan's flight with no budget of its own:
     * the plan already answered who and when, and the budget is either split
     * automatically or typed into the row — asking again here would duplicate
     * both.
     */
    // "Add existing campaign" — relink a campaign from elsewhere into this
    // plan, picked from a searchable table like every other link change.
    const [linkExistingOpen, setLinkExistingOpen] = React.useState(false);
    const existingCampaignOptions = db.campaigns
      .filter((c) => c.mediaPlanId !== plan?.id)
      .map((c) => ({
        value: c.id,
        label: c.name,
        details: {
          Proposition: propositionMeta[c.engine].label,
          Status: c.status,
          Budget: fmtEuro(c.budget),
          'Current plan': db.mediaPlans.find((mp) => mp.id === c.mediaPlanId)?.name ?? '—',
        },
      }));
    const addExistingCampaign = (id?: string) => {
      if (!id || !plan) return;
      const c = db.campaigns.find((x) => x.id === id);
      if (!c) return;
      const prevPlanId = c.mediaPlanId;
      updateCampaign(id, { mediaPlanId: plan.id });
      toast({
        title: 'Campaign added to this plan',
        description: c.name,
        undo: () => updateCampaign(id, { mediaPlanId: prevPlanId }),
      });
    };

    /** Open the campaign wizard for the chosen proposition, inside this plan.
     *  The wizard runs the campaign steps and continues into bookings and
     *  creatives; the campaign record is created when it finishes. */
    const addCampaign = (engine: EngineId) => {
      if (!plan || typeof window === 'undefined') return;
      window.location.href = `/create/${routeSeg[engine]}?planId=${plan.id}`;
    };

    const countsFor = (scope: { campaignId?: string; bookingId?: string }) => {
      const msgs = deriveMessages(db, scope);
      const actions = msgs.filter((m) => m.kind === 'action');
      return {
        actionCount: actions.length,
        recommendationCount: msgs.filter((m) => m.kind === 'recommendation').length,
        insightCount: msgs.filter((m) => m.kind === 'insight').length,
        health: actions.some((m) => m.severity === 'blocking')
          ? ('risk' as const)
          : actions.length > 0
            ? ('attention' as const)
            : ('good' as const),
      };
    };

    const rows: Row[] = filteredCampaigns.flatMap(({ campaign: c, bookings }) => [
      {
        _type: 'campaign' as const, _id: c.id, name: c.name, engine: c.engine, buyingType: c.buyingType, state: c.status,
        budget: fmtEuro(c.budget), budgetValue: c.budget, startDate: c.startDate, endDate: c.endDate,
        dates: fmtRange(c.startDate, c.endDate),
        objectiveKpi: objectiveKpiLabel, bookingsCount: bookings.length,
        ...countsFor({ campaignId: c.id }),
      },
      ...(expanded.includes(c.id)
        ? [
            ...bookings.map((b): Row => ({
              _type: 'booking' as const, _id: b.id, name: b.name, engine: c.engine, status: b.status,
              budget: fmtEuro(b.budget), dailyCap: '—', dates: fmtRange(b.startDate, b.endDate),
              objectiveKpi: 'Inherits from campaign', inherits: true,
              ...countsFor({ bookingId: b.id }),
            })),
            {
              _type: 'add' as const, _id: `add-${c.id}`, name: '', engine: c.engine,
              budget: '', objectiveKpi: '',
            },
          ]
        : []),
    ]);
    // The same affordance one level up: the table ends with an Add campaign
    // row, so growing the plan reads the same as growing a campaign.
    if (rows.length > 0) {
      rows.push({ _type: 'add' as const, _id: 'add-campaign', name: '', budget: '', objectiveKpi: '' } as Row);
    }

    const columns: TableColumn<Row>[] = [
      {
        key: 'name', header: 'Name', render: (r) =>
          r._type === 'booking' ? r.name : r._type === 'campaign' ? (
            <span className="flex items-center gap-2 min-w-0">
              {/* The chevron lives in the table's own leading column; the rest
                  of the row navigates to the campaign. */}
              <span className="font-medium truncate">{r.name}</span>
              <span className="text-xs text-muted-foreground shrink-0">
                ({r.bookingsCount} booking{r.bookingsCount === 1 ? '' : 's'})
              </span>
            </span>
          ) : null,
      },
      {
        key: 'id', header: 'ID',
        render: (r) => (r._type === 'add' ? null : <span className="tabular-nums text-muted-foreground">{r._id}</span>),
      },
      {
        key: 'state', header: 'Status', render: (r) => {
          const s = r._type === 'campaign' ? r.state : r.status;
          const badge = s ? statusBadge[s] : undefined;
          return badge ? <Badge variant={badge.variant}>{badge.label}</Badge> : null;
        },
      },
      {
        key: 'proposition', header: 'Proposition', render: (r) => {
          if (r._type !== 'campaign' || !r.engine) return null;
          const p = propositionMeta[r.engine];
          const Icon = p.icon;
          return (
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <Icon size={15} className="shrink-0 text-muted-foreground" />
              {p.label}
            </span>
          );
        },
      },
      {
        // How the campaign buys — auction bids per placement, guaranteed
        // reserves it. Beside the proposition, because it is what KIND of
        // campaign this is rather than how it is doing.
        key: 'buyingType', header: 'Type', width: 130,
        render: (r) => r._type !== 'campaign' ? null : (
          <span className="whitespace-nowrap text-muted-foreground">
            {(r.buyingType ?? 'auction') === 'guaranteed' ? 'Guaranteed' : 'Auction'}
          </span>
        ),
      },
      {
        // Right after budget & run time: what still needs doing. Health sits
        // in here — it is a notification, not a metric.
        key: 'notifications', header: 'Notifications', width: 280,
        render: (r) => r._type === 'add' ? null : (
          <NotificationsCell
            actions={r.actionCount}
            recommendations={r.recommendationCount}
            insights={r.insightCount}
            onOpen={() => setInboxRow({ level: r._type as 'campaign' | 'booking', id: r._id, name: r.name })}
          />
        ),
      },
      {
        key: 'dates', header: 'Run time', width: 260,
        render: (r) => r._type !== 'campaign'
          ? (r._type === 'add' ? null : <span className="text-muted-foreground">{r.dates}</span>)
          : <DatesCell start={r.startDate} end={r.endDate} onSave={(startDate, endDate) => updateCampaign(r._id, { startDate, endDate })} />,
      },
      {
        key: 'budget', header: 'Budget',
        render: (r) => r._type !== 'campaign' || r.budgetValue === undefined
          ? (r._type === 'add' ? null : <span className="tabular-nums">{r.budget}</span>)
          : (
            <BudgetCell
              value={r.budgetValue}
              onSave={(next) => {
                const prev = r.budgetValue ?? 0;
                updateCampaign(r._id, { budget: next });
                // A hand-set number means the split is no longer automatic.
                if (plan?.autoBudget) updateMediaPlan(plan.id, { autoBudget: false });
                toast({
                  title: 'Campaign budget updated',
                  description: `${r.name}: €${prev.toLocaleString()} → €${next.toLocaleString()}.`,
                  undo: () => updateCampaign(r._id, { budget: prev }),
                });
              }}
            />
          ),
      },
      {
        key: 'health', header: 'Health',
        render: (r) => (r._type === 'add' ? null : (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setInboxRow({ level: r._type as 'campaign' | 'booking', id: r._id, name: r.name }); }}
            title="Open notifications"
          >
            <HealthCell health={r.health ?? 'good'} />
          </button>
        )),
      },
      { key: 'dailyCap', header: 'Daily cap', render: (r) => (r._type === 'add' ? null : <span className="tabular-nums text-muted-foreground">{r._type === 'booking' ? r.dailyCap : '—'}</span>) },
      { key: 'objectiveKpi', header: 'Objective / KPI', render: (r) => (r._type === 'add' ? null : <span className={cn('text-muted-foreground', r.inherits && 'italic')}>{r.objectiveKpi}</span>) },
    ];

    return (
      <MenuContextProvider>
        <AppLayout
          routes={routes}
          logo={{ src: '/next.svg', alt: 'Logo', width: 40, height: 40 }}
          user={{ name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' }}
          onLogout={() => {}}
          breadcrumbProps={{ namespace: '' }}
          pageHeaderProps={{
            title: plan?.name ?? 'Media plan',
            titleIcon: <HierarchyBadge level="media-plan" />,
            onEdit: () => {},
            onExport: () => {},
            onSettings: () => {},
            onDelete: () => setConfirmingDelete(true),
            // No plan-specific actions here: the header is the same on every
            // page and carries the session's own controls. What acts on the
            // plan lives in the control panel below it.
          }}
        >
          {/* The plan's main controls: what it may spend and when it runs,
              with the health and notification state that follows from them.
              They govern every campaign in the plan, so they sit with the
              metrics above the tabs rather than inside one of them. */}
          {/* mb-1 + the tab card's built-in 12px above its strip = the same
              16px gap the metric cards keep. */}
          {/* In setup the controls step aside: what the plan may spend and
              when it runs were just answered in the wizard, and the page is
              about approving what it proposed. */}
          {!inSetup && (
          <ControlBar className="mb-4">
            <ControlBarItem label="Media plan budget">
              {/* The budget opens like the date field beside it: click, see
                  the split per campaign, edit either the total (rows rescale)
                  or a row (the total follows), Apply to commit. */}
              <BudgetSelect
                className="w-40"
                total={plan?.budget ?? 0}
                rows={db.campaigns
                  .filter((c) => c.mediaPlanId === plan?.id)
                  .map((c) => ({ id: c.id, label: c.name, color: propositionColor(c.engine), budget: c.budget }))}
                onApply={(nextTotal, budgets) => {
                  if (!plan) return;
                  const prevBudget = plan.budget;
                  const prevSplit = db.campaigns
                    .filter((c) => c.mediaPlanId === plan.id)
                    .map((c) => ({ id: c.id, budget: c.budget }));
                  updateMediaPlan(plan.id, { budget: nextTotal });
                  Object.entries(budgets).forEach(([id, budget]) => updateCampaign(id, { budget }));
                  toast({
                    title: 'Media plan budget updated',
                    description: `€${prevBudget.toLocaleString()} → €${nextTotal.toLocaleString()} across ${prevSplit.length} campaign${prevSplit.length === 1 ? '' : 's'}.`,
                    undo: () => {
                      updateMediaPlan(plan.id, { budget: prevBudget });
                      prevSplit.forEach(({ id, budget }) => updateCampaign(id, { budget }));
                    },
                  });
                }}
              />
            </ControlBarItem>
            <ControlBarItem label="Media plan run time" dropOrder={3}>
              <DatesCell
                className="h-9 w-64 text-sm font-normal"
                start={plan?.startDate}
                end={plan?.endDate}
                onSave={(startDate, endDate) => plan && updateMediaPlan(plan.id, { startDate, endDate })}
              />
            </ControlBarItem>
            {/* The split lives inside the budget picker now — repeating it as
                a bar here said the same thing twice on one card. */}
            <ControlBarItem label="Health" dropOrder={2}>
              <div className="flex h-9 items-center">
                <button
                  type="button"
                  onClick={() => plan && setInboxRow({ level: 'media-plan', id: plan.id, name: plan.name })}
                  title="Open notifications"
                >
                  <HealthCell health={plan ? ({ good: 'good', attention: 'attention', risk: 'risk' } as const)[derivePlanHealth(db, plan).level] : 'good'} />
                </button>
              </div>
            </ControlBarItem>
            <ControlBarItem label="Notifications" dropOrder={1}>
              <div className="flex h-9 items-center">
                <NotificationsCell
                  actions={planOwnCounts.actions}
                  recommendations={planOwnCounts.recommendations}
                  insights={planOwnCounts.insights}
                  onOpen={() => plan && setInboxRow({ level: 'media-plan', id: plan.id, name: plan.name })}
                />
              </div>
            </ControlBarItem>
            {/* Launch, pause, resume, stop — the plan's run state, with the
                facts that govern it. */}
            <div className="ml-auto flex items-center gap-2">
              {plan && (
                <LifecycleActions
                  level="media-plan"
                  entityId={plan.id}
                  status={plan.status}
                  name={plan.name}
                  playDisabled={!canLaunch}
                  playDisabledReason={`${planBlockers.length} blocker${planBlockers.length === 1 ? '' : 's'} to clear first — see Notifications`}
                />
              )}
            </div>
          </ControlBar>
          )}

          {/* The row's own pb-3 plus this mb-1 makes the same 16px the cards
              keep between themselves — the whole column shares one gap. */}
          <div className="mb-1">
            {/* showCharts turns each card into its chart and lets it expand in place to
                the per-proposition breakdown below the row. */}
            <MetricRow metrics={preLive ? forecastMetrics : liveMetrics} maxVisible={preLive ? 6 : 4} defaultVariant="graph" showCharts removable={false} bleedEdges />
          </div>

          <CardWithTabs
            // A plan arrived at straight from the wizard opens on its Inbox, so
            // the first thing the user sees is what still has to be done.
            defaultTab={tab}
            // Controlled only so the FAQ below can follow the open tab.
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={tabFirst([
              {
                label: 'Media plan details',
                value: 'details',
                content: (
                  <div className="mt-6 space-y-6">
                    {/* Sections mirror the create-media-plan wizard steps, each
                        in its own card so a long form stays scannable. */}
                    <FormSection title="Setup" bordered>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="mp-name">Media plan name</Label>
                          <Input id="mp-name" value={planName} onChange={(e) => setPlanName(e.target.value)} hint="Give your media plan a descriptive name to easily identify it later" />
                        </div>
                        {/* Same read-only ID a booking's details show — the
                            handle other systems and colleagues refer to. */}
                        <div className="space-y-2">
                          <Label htmlFor="mp-id">Media plan ID</Label>
                          <Input id="mp-id" value={plan?.id ?? ''} readOnly disabled />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="mp-po">PO number <span className="font-normal text-muted-foreground">(optional)</span></Label>
                          <Input id="mp-po" value={poNumber} onChange={(e) => setPoNumber(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label>Status</Label>
                          <Input dropdown options={statusOptions} value={status} onChange={(v: string) => setStatus(v as PlanStatus)} placeholder="Select status" />
                        </div>
                      </div>
                    </FormSection>

                    <FormSection title="Advertiser" bordered>
                      <div className="space-y-6">
                        {/* Who the plan advertises for is fixed once it exists:
                            the campaigns, bookings and reporting underneath are
                            all attributed to this advertiser and brand. */}
                        <ReadOnlyField
                          label="Advertiser"
                          value={advertiserOptions.find((o) => o.value === advertiser)?.label}
                          hint="Set when the media plan was created and cannot be changed"
                        />
                        {/* One card per brand — the same stack the wizard shows
                            when these were chosen, just without the remove. */}
                        <ReadOnlyField
                          label="Brands"
                          values={brands.map((b) => ({
                            label: brandFilterOptions.find((o) => o.value === b)?.label ?? b,
                          }))}
                          hint="The brand(s) this media plan advertises for"
                        />

                        {/* Retail products — only for a selected advertiser + brand carried in-store. */}
                        {advertiser && brands.length > 0 && brandsHaveRetailProducts && (
                          <RetailProductSelect value={retailProducts} onChange={setRetailProducts} optional showCount />
                        )}
                      </div>
                    </FormSection>

                    <FormSection title="Goals & objectives" bordered>
                      <div className="space-y-5">
                        {/* Only the chosen goal — showing all four invited a
                            change the plan's KPIs and reporting can't absorb,
                            and took four cards to say one thing. */}
                        <div className="space-y-2">
                          <Label className="flex items-center gap-1.5 text-muted-foreground">
                            Media plan goal
                            <Lock className="h-3 w-3" aria-label="Cannot be changed" />
                          </Label>
                          {(() => {
                            const g = goals.find((x) => x.id === goal);
                            return g ? (
                              <GoalCard icon={g.icon} title={g.title} description={g.description} kpis={g.kpis} selected readOnly className="w-full" />
                            ) : (
                              <div className="flex min-h-9 items-center rounded-md bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                                No goal set
                              </div>
                            );
                          })()}
                          <p className="text-xs text-muted-foreground">
                            The goal sets the objective and the KPIs this plan is judged on
                          </p>
                        </div>
                        <ReadOnlyField
                          label="Objective"
                          value={objectiveOptions.find((o) => o.value === objective)?.label}
                          hint={objective ? describeObjective(objective) : undefined}
                        />
                        <SearchSelectList
                          label="KPIs"
                          placeholder="Search KPIs…"
                          options={kpiFilterOptions}
                          value={kpis}
                          onChange={(vals) => { setKpis(vals); setKpiStudies((s) => s.filter((v) => vals.includes(v))); }}
                          selectedExtraBoxed
                          renderSelectedExtra={(opt) => (
                            <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
                              <Checkbox
                                checked={kpiStudies.includes(opt.value)}
                                onCheckedChange={(c) => setKpiStudies((s) => (c ? [...s, opt.value] : s.filter((v) => v !== opt.value)))}
                              />
                              Add a brand-lift study to measure this KPI
                            </label>
                          )}
                        />
                      </div>
                    </FormSection>

                    <div className="flex justify-end gap-3">
                      <Button variant="outline">Cancel</Button>
                      <Button onClick={savePlan}>Save changes</Button>
                    </div>
                  </div>
                ),
              },
              {
                // Everything the user should do or know for this plan: the
                // derived to-dos plus its recommendations and insights.
                label: 'Notifications',
                value: 'inbox',
                badgeCount: unreadCount,
                content: <InboxPanel scope="media-plan" entityId={plan?.id} className="mt-6" />,
              },
              {
                label: 'Campaigns & bookings',
                value: 'campaigns',
                content: (
                  <div className="mt-6 space-y-6">
                    {/* One filter row for both presentations of the same
                        campaigns, with the cards/table switch at its right —
                        the icons say what the views are, and the plan's
                        status picks which one greets you. */}
                    <div className="flex items-start gap-3">
                      <FilterBar
                        className="min-w-0 flex-1"
                        filters={[
                          {
                            name: 'Proposition',
                            options: (Object.keys(propositionMeta) as EngineId[]).map((e) => ({
                              label: propositionMeta[e].label,
                              value: e,
                            })),
                            selectedValues: propFilter,
                            onChange: setPropFilter,
                          },
                          {
                            name: 'State',
                            options: (Object.keys(statusBadge) as PlanStatus[]).map((st) => ({
                              label: statusBadge[st].label,
                              value: st,
                            })),
                            selectedValues: stateFilter,
                            onChange: setStateFilter,
                          },
                        ]}
                        searchValue={rowSearch}
                        onSearchChange={setRowSearch}
                        searchPlaceholder="Search campaigns & bookings..."
                      />
                      <span className="flex shrink-0 gap-1">
                        <Button
                          variant={campaignsView === 'cards' ? 'secondary' : 'ghost'}
                          size="sm"
                          iconOnly
                          aria-label="Setup cards view"
                          title="Setup cards"
                          className={cn('h-9', campaignsView === 'cards' && 'border border-input')}
                          onClick={() => setCampaignViewOverride('cards')}
                        >
                          <LayoutGrid className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={campaignsView === 'table' ? 'secondary' : 'ghost'}
                          size="sm"
                          iconOnly
                          aria-label="Table view"
                          title="Table"
                          className={cn('h-9', campaignsView === 'table' && 'border border-input')}
                          onClick={() => setCampaignViewOverride('table')}
                        >
                          <Table2 className="h-4 w-4" />
                        </Button>
                      </span>
                    </div>
                    {campaignsView === 'cards' && (
                      checklistCards.length > 0 ? (
                        <SetupChecklist
                          heading=""
                          subtitle=""
                          cards={checklistCards}
                          onDismiss={(id) => skipChecklistCards([id])}
                          onSkipAll={() => skipChecklistCards(checklistCards.map((card) => card.id))}
                          addCard={
                            <AddCampaignMenu
                              onSelect={addCampaign}
                              onAddExisting={() => setLinkExistingOpen(true)}
                              trigger={
                                <button type="button" className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                                  <Plus className="h-3.5 w-3.5" />
                                  Add campaign
                                </button>
                              }
                            />
                          }
                        />
                      ) : planCampaignRows.length === 0 ? (
                        // No campaigns at all — the same empty state the table
                        // shows, so both views tell one story and offer the
                        // same fix.
                        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-10 text-center">
                          <p className="text-sm text-muted-foreground">
                            No campaigns in this media plan yet — add the first proposition.
                          </p>
                          <AddCampaignMenu onSelect={addCampaign} onAddExisting={() => setLinkExistingOpen(true)} />
                        </div>
                      ) : (
                        // Everything set up (or skipped): the cards have done
                        // their job, so say so and hand over to the table.
                        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-10 text-center">
                          <p className="text-sm text-muted-foreground">Every campaign is set up — nothing left to prepare.</p>
                          <Button variant="outline" onClick={() => setCampaignViewOverride('table')}>
                            Open the table view
                          </Button>
                        </div>
                      )
                    )}
                    {campaignsView === 'table' && (<>
                    <Table
                      columns={columns}
                      data={rows}
                      rowKey={(r) => r._id}
                      // Row-level action, so it spans rather than sitting in a
                      // column — see Table.fullWidthRow.
                      fullWidthRow={(r) => {
                        if (r._type !== 'add') return null;
                        if (r._id === 'add-campaign') {
                          return (
                            <span onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-2">
                              <AddCampaignMenu
                                onSelect={addCampaign}
                                onAddExisting={() => setLinkExistingOpen(true)}
                                trigger={
                                  <button type="button" className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                                    <Plus className="h-3.5 w-3.5" />
                                    Add campaign
                                  </button>
                                }
                              />
                            </span>
                          );
                        }
                        return (
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); addBookingTo(r._id.replace(/^add-/, '')); }}
                            className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Add booking
                          </button>
                        );
                      }}
                      hideActions
                      // A plan without campaigns explains itself and offers
                      // the fix in place — same menu as the header button.
                      emptyState={
                        <div className="flex flex-col items-center gap-3 py-2">
                          <p className="text-sm text-muted-foreground">
                            No campaigns in this media plan yet — add the first proposition.
                          </p>
                          <AddCampaignMenu onSelect={addCampaign} onAddExisting={() => setLinkExistingOpen(true)} />
                        </div>
                      }
                      expandable={{
                        isExpandable: (r) => r._type === 'campaign' && (r.bookingsCount ?? 0) > 0,
                        isExpanded: (r) => expanded.includes(r._id),
                        onToggle: (r) => toggle(r._id),
                        getLabel: (r, isOpen) => `${isOpen ? 'Collapse' : 'Expand'} ${r.name}`,
                        isChild: (r) => r._type === 'booking',
                      }}
                      onRowClick={(r) => {
                        // Rows link to the campaign / booking; only the chevron toggles.
                        // Engine → route segment (route names differ slightly from ids).
                        const routeSeg: Record<EngineId, string> = {
                          'display': 'display',
                          'sponsored-products': 'sponsored-products',
                          'digital-instore': 'digital-instore',
                          'offline-instore': 'offline-instore',
                          'offsite': 'offsite',
                        };
                        const seg = routeSeg[r.engine ?? 'display'];
                        let href: string;
                        if (r._type === 'campaign') {
                          href = `/campaigns/${seg}/${r._id}`;
                        } else if (r.engine === 'sponsored-products') {
                          // Sponsored-products keyword bookings live inside the campaign,
                          // so open the parent campaign detail.
                          const parent = db.bookings.find((b) => b.id === r._id)?.campaignId;
                          href = `/campaigns/${seg}/${parent ?? r._id}`;
                        } else {
                          href = `/campaigns/${seg}/booking/${r._id}`;
                        }
                        if (typeof window !== 'undefined') window.location.href = href;
                      }}
                      rowClassName={(r) =>
                        r._type === 'booking'
                          // Sub rows: lighter base + their own hover, so hovering a
                          // booking is distinct from hovering a campaign row.
                          ? '[&>td]:bg-muted/20 [&:hover>td]:bg-muted/40'
                          // Campaign rows: expanded (selected) gets a darker tone than the hover.
                          : cn('cursor-pointer', expanded.includes(r._id) && '[&>td]:!bg-muted')
                      }
                    />
                    </>)}
                  </div>
                ),
              },
              // Insights and Logs have nothing to say about a plan that has
              // not run yet, so a plan in setup does not carry them.
              ...(inSetup ? [] : [{
                label: 'Insights',
                value: 'insights',
                content: <InsightsTab engineType="all" scope="campaign" mediaPlanId={plan?.id} />,
              }]),
              ...(inSetup ? [] : [{
                label: 'Logs',
                value: 'logs',
                content: (
                  <div className="mt-6 space-y-6">
                    <FilterBar
                      filters={[
                        {
                          name: 'Users',
                          options: [
                            { label: 'Jane Doe', value: 'Jane Doe' },
                            { label: 'John Smith', value: 'John Smith' },
                            { label: 'Sarah Wilson', value: 'Sarah Wilson' },
                            { label: 'Mike Johnson', value: 'Mike Johnson' },
                          ],
                          selectedValues: logUsers,
                          onChange: setLogUsers,
                        },
                        {
                          name: 'Actions',
                          options: [
                            { label: 'Media plan created', value: 'Media plan created' },
                            { label: 'Budget updated', value: 'Budget updated' },
                            { label: 'Campaign added', value: 'Campaign added' },
                            { label: 'Objective set', value: 'Objective set' },
                            { label: 'Dates modified', value: 'Dates modified' },
                            { label: 'Status changed', value: 'Status changed' },
                          ],
                          selectedValues: logActions,
                          onChange: setLogActions,
                        },
                      ]}
                      searchValue={''}
                      onSearchChange={() => {}}
                      searchPlaceholder="Search logs..."
                    />
                    <Table
                      columns={[
                        { key: 'timestamp', header: 'Timestamp', render: (row: LogRow) => new Date(row.timestamp).toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) },
                        { key: 'user', header: 'User' },
                        { key: 'action', header: 'Action', render: (row: LogRow) => <Badge variant="outline">{row.action}</Badge> },
                        { key: 'field', header: 'Field' },
                        { key: 'oldValue', header: 'Old value' },
                        { key: 'newValue', header: 'New value' },
                        { key: 'description', header: 'Description' },
                      ]}
                      data={logData.filter((row) => {
                        const userMatch = logUsers.length === 0 || logUsers.includes(row.user);
                        const actionMatch = logActions.length === 0 || logActions.includes(row.action);
                        return userMatch && actionMatch;
                      })}
                      rowKey={(row: LogRow) => row.id}
                    />
                  </div>
                ),
              }]),
            ], 'campaigns')}
          />

        {/* Deleting a plan takes its campaigns and bookings with it, so the
            dialog says exactly how much is going before anything goes. */}
        <Dialog open={confirmingDelete} onOpenChange={(open) => !open && setConfirmingDelete(false)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete {plan?.name ?? 'this media plan'}?</DialogTitle>
              <DialogDescription>
                {(() => {
                  const c = db.campaigns.filter((x) => x.mediaPlanId === plan?.id).length;
                  const ids = new Set(db.campaigns.filter((x) => x.mediaPlanId === plan?.id).map((x) => x.id));
                  const b = db.bookings.filter((x) => ids.has(x.campaignId)).length;
                  const parts = [c > 0 && `${c} campaign${c === 1 ? '' : 's'}`, b > 0 && `${b} booking${b === 1 ? '' : 's'}`].filter(Boolean).join(' and ');
                  return parts
                    ? `This permanently removes the plan and the ${parts} inside it. It cannot be undone.`
                    : 'This permanently removes the plan. It cannot be undone.';
                })()}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmingDelete(false)}>Cancel</Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (plan) deleteMediaPlan(plan.id);
                  if (typeof window !== 'undefined') window.location.href = '/campaigns';
                }}
              >
                Delete media plan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Side panel: the clicked row's notifications, without leaving the tab. */}
        <RightDrawer open={inboxRow !== null} onOpenChange={(open) => !open && setInboxRow(null)}>
          <RightDrawerContent>
            <RightDrawerHeader>
              <RightDrawerTitle>Notifications</RightDrawerTitle>
              <RightDrawerDescription>{inboxRow?.name}</RightDrawerDescription>
            </RightDrawerHeader>
            <RightDrawerBody>
              {inboxRow && <InboxPanel scope={inboxRow.level} entityId={inboxRow.id} detailInline />}
            </RightDrawerBody>
          </RightDrawerContent>
        </RightDrawer>
        <LinkPickerDialog
        open={linkExistingOpen}
        onOpenChange={setLinkExistingOpen}
        entityLabel="campaign"
        options={existingCampaignOptions}
        onChange={addExistingCampaign}
      />
      </AppLayout>
      </MenuContextProvider>
    );
  },
};
