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
import { GoalSelect } from '@/components/ui/goal-select';
import { CheckboxCard } from '@/components/ui/checkbox-card';
import { LifecycleActions } from '@/components/ui/lifecycle-actions';
import { AddCampaignMenu } from '@/components/ui/add-campaign-menu';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FillRateBar } from '@/components/ui/fill-rate-bar';
import { ReadOnlyField } from '@/components/ui/read-only-field';
import { SearchSelectList } from '@/components/ui/search-select-list';
import { RetailProductSelect } from '@/components/ui/retail-product-select';
import { Input, FieldHint } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DateRangePicker, futureDateRangePresets } from '@/components/ui/date-picker';
import { Switch } from '@/components/ui/switch';
import { BuyingTypePicker } from '@/components/ui/buying-type-picker';
import { allocateBudget } from '@/lib/budget-allocation';
import { Euro, FlaskConical, Lock, MoreHorizontal, Pencil } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import type { DateRange } from 'react-day-picker';
import { HierarchyBadge } from '@/components/ui/hierarchy-badge';
import { getRoutesForTheme } from '@/lib/theme-navigation';
import { useStorybookTheme } from '@/contexts/storybook-theme-context';
import { cn } from '@/lib/utils';
import { retailMoments } from '@/lib/retail-moments';
import { buildForecastMetrics } from '@/components/ui/forecast-metrics';
import { stageForGoal, funnelKpis } from '@/lib/funnel';
import { MiniSelect } from '@/components/ui/delivery-settings';
import { ControlBar, ControlBarItem } from '@/components/ui/control-bar';
import { WorkflowProgress } from '@/components/ui/workflow-progress';
import { BudgetPopover, DatesCell, HealthCell, NotificationsCell, RecommendationsCell } from '@/components/ui/control-cells';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronDown, ChevronRight, Plus, HeartPulse, ListStart, MonitorSpeaker, MonitorPlay, Store, Globe, Eye, Brain, ShoppingCart, Heart, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { scoreHealth, type HealthIndicator, type HealthScore } from '@/lib/db/health';
import type { CardInsight } from '@/components/ui/insights-notifications';
import { useDb, updateMediaPlan, createCampaign, updateCampaign, deleteMediaPlan, deleteCampaign, deleteBooking, deriveMessages, derivePlanHealth, planHealth, campaignHealth, bookingHealth, useInboxState, markRead, markDone, applyPlanLifecycle, setupStepDone, type Campaign, type EngineId, type PlanStatus, type WorkflowStep } from '@/lib/db';
import { InboxPanel } from '@/components/ui/inbox-panel';
import { InsightsTab } from './insights-tab';
import { MessageDrawer } from '@/components/ui/message-drawer';
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
  { label: 'In review', value: 'in-option' },
  { label: 'Live', value: 'running' },
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
  { id: 'LOG-006', timestamp: '2026-05-30 16:20:58', user: 'Jane Doe', action: 'Status changed', field: 'Status', oldValue: 'Draft', newValue: 'In review', description: 'Media plan moved to in-option' },
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
/**
 * The plan budget, without a split. Budgets are given to CAMPAIGNS, not
 * divided over propositions from here — and a plan deliberately keeps free
 * room so more campaigns can be added. So this popover edits one number,
 * the ceiling, and shows what of it is committed vs still free.
 */
const statusBadge: Record<PlanStatus, { variant: 'success' | 'secondary' | 'warning' | 'outline'; label: string }> = {
  'running': { variant: 'success', label: 'Live' },
  'completed': { variant: 'secondary', label: 'Completed' },
  'paused': { variant: 'warning', label: 'Paused' },
  'in-option': { variant: 'outline', label: 'In review' },
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
  /** Health for this row from the concern-only model: absent when nothing
   *  was found on it or below it. */
  health?: 'good' | 'attention' | 'risk';
  healthIndicators?: HealthIndicator[];
  healthScore?: HealthScore;
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
      engine: e.engine,
    }));
    const budgetVsSpend = byEngine.map((e) => ({ name: e.name, spent: e.spend, budget: e.budget, color: e.color, engine: e.engine }));
    const propositionColors = byEngine.map((e) => e.color);

    const impressionsTotal = impressionsByEngine.reduce((s, e) => s + e.value, 0);
    const conversionsTotal = conversionsByEngine.reduce((s, e) => s + e.value, 0);
    const roasWeighted = planSpend > 0
      ? Math.round((byEngine.reduce((s, e, i) => s + roasByEngine[i].value * e.spend, 0) / planSpend) * 10) / 10
      : 0;


    const fmtNumberCompact = (n: number) =>
      n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(Math.round(n));
    const fmtRoasValue = (v: number) => `${Math.round(v * 100)}%`;

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
    const [activeRecommendationId, setActiveRecommendationId] = React.useState<string | null>(null);
    const unreadCount = plan
      ? deriveMessages(db, { mediaPlanId: plan.id }).filter(
          (m) => m.kind === 'recommendation' && (inboxStatus[m.id] ?? 'unread') === 'unread',
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
    // The plan's recommendations, for the control bar's dropdown; one can be
    // open in the message panel straight from there.
    const planRecommendations = planAllMsgs.filter((m) => m.kind === 'recommendation');
    const activeRecommendation = planRecommendations.find((m) => m.id === activeRecommendationId) ?? null;
    const planOwnCounts = {
      actions: planAllMsgs.filter((m) => m.kind === 'action' || m.kind === 'health').length,
      recommendations: planAllMsgs.filter((m) => m.kind === 'recommendation').length,
      insights: planAllMsgs.filter((m) => m.kind === 'insight').length,
    };

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
    React.useEffect(() => {
      if (plan && plan.status === 'draft' && !awaitingApproval) {
        updateMediaPlan(plan.id, { status: 'in-option' });
      }
    }, [plan, awaitingApproval]);

    // Whether the plan is still being set up decides how the page reads
    // (the forecast row, the open workflow steps) — anything that has ever
    // run — running, paused, completed — is judged in the table instead.
    const planHasRun = !!plan && ['running', 'paused', 'completed'].includes(plan.status);
    const planNeedsSetup = !!plan && db.campaigns.some((c) => {
      if (c.mediaPlanId !== plan.id || c.status === 'completed') return false;
      if (c.status === 'draft') return true;
      const bookings = db.bookings.filter((b) => b.campaignId === c.id);
      if (bookings.length === 0) return true;
      if (bookings.some((b) => b.status === 'draft')) return true;
      return c.engine === 'sponsored-products'
        ? bookings.some((b) => b.positionIds.length === 0)
        : bookings.some((b) => b.creativeStatus === 'missing');
    });
    // The gate is the WORK, not the status field: any plan that has never run
    // and still has setup to finish — proposals awaiting approval, or approved
    // campaigns missing bookings, placements or creatives — gets the focused
    // view, however its status was spelled on the way in. Skipping the cards
    // releases it.
    const inSetup = !!plan && !planHasRun && (plan.status === 'draft' || awaitingApproval || planNeedsSetup);

    /**
     * At the end of a workflow step row: for a setup step, how many
     * campaigns still need it and a Start that opens the first one's wizard —
     * the same doors the setup cards open.
     */
    const planStepExtra = (step: WorkflowStep, done: boolean): React.ReactNode => {
      if (!plan || done) return null;
      // The retailer's approval of the plan: in this prototype approving
      // is launching — the same move the Launch button makes, blocked by
      // the same blockers.
      if (step.kind === 'approval' && !step.setup && step.owner === 'retailer') {
        return (
          <Button size="sm" onClick={() => applyPlanLifecycle(plan.id, 'play')} disabled={!canLaunch} title={canLaunch ? undefined : 'Clear the blockers first — see Notifications'}>
            Approve & launch
          </Button>
        );
      }
      if (!step.setup) return null;
      const key = step.setup;
      const planCampaigns = db.campaigns.filter((c) => c.mediaPlanId === plan.id);
      if (key === 'add-campaigns') {
        return <Button size="sm" onClick={() => addCampaign('display')}>Add campaign</Button>;
      }
      const isOpen = (c: Campaign) => (key === 'approve-campaigns' ? c.status === 'draft' : !setupStepDone(db, c, key));
      const waiting = planCampaigns.filter(isOpen);
      const first = waiting[0];
      const start = () => {
        if (!first) return;
        const bookings = db.bookings.filter((b) => b.campaignId === first.id);
        const draft = bookings.find((b) => b.status === 'draft');
        const seg = routeSeg[first.engine];
        switch (key) {
          case 'approve-campaigns':
          case 'approve-campaign': window.location.href = `/create/${seg}?campaignId=${first.id}&step=campaign${backToPlan}`; break;
          case 'create-bookings':
          case 'add-targeting': addBookingTo(first.id); break;
          case 'approve-bookings': approveBooking(draft?.id ?? bookings[0]?.id, first.id); break;
          case 'link-creatives': {
            const missing = bookings.find((b) => b.creativeStatus === 'missing');
            window.location.href = missing
              ? `/create/${seg}?bookingId=${missing.id}&step=creatives${backToPlan}`
              : `/create/${seg}?campaignId=${first.id}${backToPlan}`;
            break;
          }
        }
      };
      return (
        <span className="flex shrink-0 items-center gap-3">
          <span className="text-xs text-muted-foreground">{waiting.length} of {planCampaigns.length} campaign{planCampaigns.length === 1 ? '' : 's'}</span>
          <Button size="sm" onClick={start} disabled={!first}>Start</Button>
        </span>
      );
    };

    const planBlockers = plan
      ? deriveMessages(db, { mediaPlanId: plan.id }).filter((m) => m.kind === 'action' && m.severity === 'blocking')
      : [];
    const canLaunch = !!plan && planBlockers.length === 0;

    /**
     * What the plan's health is judged on — the same facts the to-do engine
     * reads, laid out as checks so the chip can show its evidence.
     */
    const planHealthSummary = plan ? planHealth(db, plan.id) : undefined;
    const planVerdict = plan ? derivePlanHealth(db, plan) : undefined;
    // The plan's insights, for the health dropdown — never its
    // recommendations, which are upside and must not sit with condition.
    const planInsightCards: CardInsight[] = planAllMsgs
      .filter((m) => m.kind === 'insight')
      .map((m) => ({ id: m.id, kind: m.kind, subject: m.subject, preview: m.preview, context: m.context, caseData: { stats: m.evidence?.stats?.map((st) => ({ ...st, tone: st.tone === 'success' ? 'success' as const : undefined })), insights: m.evidence?.insights } }));

    /**
     * Add a campaign of a chosen proposition to this plan and open it.
     *
     * It starts as a draft inside the plan's flight with no budget of its own:
     * the plan already answered who and when, and the budget is either split
     * automatically or typed into the row — asking again here would duplicate
     * both.
     */
    /**
     * "Add existing campaign" — a full picker, not a bare list. The dialog
     * leads with the plan's budget bar (what is FREE is the point), filters
     * by proposition / status / run time / budget, and lists campaigns as a
     * sortable table whose rows expand into their bookings. For now only a
     * campaign that fits INSIDE the free budget and the plan's run time can
     * be picked: the rest stay findable but unselectable, each saying why,
     * with Edit as the way out.
     */
    /** The row menu's Delete goes through a confirmation that names the
     *  object — deleting a campaign takes its bookings with it. */
    const [deleteTarget, setDeleteTarget] = React.useState<{ type: 'campaign' | 'booking'; id: string; name: string } | null>(null);
    const [linkExistingOpen, setLinkExistingOpen] = React.useState(false);
    const [pickPropFilter, setPickPropFilter] = React.useState<string[]>([]);
    const [pickStateFilter, setPickStateFilter] = React.useState<string[]>([]);
    const [pickBudgetFilter, setPickBudgetFilter] = React.useState<string[]>([]);
    const [pickRange, setPickRange] = React.useState<DateRange | undefined>(undefined);
    const [pickSearch, setPickSearch] = React.useState('');
    const [pickExpanded, setPickExpanded] = React.useState<string[]>([]);
    const [pickSelectedId, setPickSelectedId] = React.useState<string | undefined>(undefined);

    const claimedBudget = plan
      ? db.campaigns.filter((c) => c.mediaPlanId === plan.id).reduce((sum, c) => sum + c.budget, 0)
      : 0;
    const freeBudget = plan ? Math.max(plan.budget - claimedBudget, 0) : 0;

    type PickRow = {
      _kind: 'campaign' | 'booking';
      id: string; parentId: string; childIdx: number;
      name: string; engine: EngineId; budget: number;
      startDate: string; endDate: string; status: PlanStatus;
      fits: boolean; fitReason?: string;
      // Sorting reads the PARENT's values so expanded bookings travel with
      // their campaign instead of scattering through the list.
      sortName: string; sortBudget: number; sortStart: string; sortStatus: string;
    };

    const pickRows: PickRow[] = React.useMemo(() => {
      if (!plan) return [];
      const iso = (d?: Date) => (d ? d.toISOString().slice(0, 10) : undefined);
      const rFrom = iso(pickRange?.from);
      const rTo = iso(pickRange?.to);
      const q = pickSearch.trim().toLowerCase();
      const candidates = db.campaigns
        .filter((c) => c.mediaPlanId !== plan.id)
        .filter((c) => pickPropFilter.length === 0 || pickPropFilter.includes(c.engine))
        .filter((c) => pickStateFilter.length === 0 || pickStateFilter.includes(c.status))
        .filter((c) => {
          if (pickBudgetFilter.length === 0) return true;
          return pickBudgetFilter.some((b) =>
            b === 'lt5' ? c.budget < 5000 : b === '5to15' ? c.budget >= 5000 && c.budget <= 15000 : c.budget > 15000,
          );
        })
        // Run time filter = overlap with the picked range.
        .filter((c) => (!rFrom || c.endDate >= rFrom) && (!rTo || c.startDate <= rTo))
        .filter((c) => !q || c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q));
      return candidates.flatMap((c) => {
        const overBudget = c.budget > freeBudget;
        const outsideRuntime = c.startDate < plan.startDate || c.endDate > plan.endDate;
        const fits = !overBudget && !outsideRuntime;
        const fitReason = fits
          ? undefined
          : overBudget && outsideRuntime
            ? 'Outside the free budget and the run time'
            : overBudget
              ? `Needs ${fmtEuro(c.budget)} — ${fmtEuro(freeBudget)} free`
              : 'Runs outside the plan run time';
        const base = {
          parentId: c.id, engine: c.engine, fits, fitReason,
          sortName: c.name.toLowerCase(), sortBudget: c.budget, sortStart: c.startDate, sortStatus: c.status,
        };
        const bookings = db.bookings.filter((b) => b.campaignId === c.id);
        return [
          { ...base, _kind: 'campaign' as const, id: c.id, childIdx: 0, name: c.name, budget: c.budget, startDate: c.startDate, endDate: c.endDate, status: c.status },
          ...(pickExpanded.includes(c.id)
            ? bookings.map((b, i) => ({
                ...base, _kind: 'booking' as const, id: b.id, childIdx: i + 1,
                name: b.name, budget: b.budget, startDate: b.startDate, endDate: b.endDate, status: b.status,
              }))
            : []),
        ];
      });
    }, [plan, db.campaigns, db.bookings, pickPropFilter, pickStateFilter, pickBudgetFilter, pickRange, pickSearch, pickExpanded, freeBudget]);

    /** Child rows sort by their parent's value, then stay in booking order. */
    const bySortField = (field: 'sortName' | 'sortBudget' | 'sortStart' | 'sortStatus') =>
      (a: PickRow, b: PickRow) => {
        const av = a[field]; const bv = b[field];
        if (av !== bv) return av < bv ? -1 : 1;
        if (a.parentId !== b.parentId) return a.parentId < b.parentId ? -1 : 1;
        return a.childIdx - b.childIdx;
      };

    const pickSelected = pickSelectedId ? db.campaigns.find((c) => c.id === pickSelectedId) : undefined;

    /**
     * The approval after the pick is SIMPLE by design: only fitting campaigns
     * are selectable, so nothing on the plan changes — the dialog shows the
     * addition on the budget bar, the run time inside the plan's, and Approve.
     */
    const [pendingExistingId, setPendingExistingId] = React.useState<string | undefined>(undefined);
    const pendingExisting = pendingExistingId ? db.campaigns.find((x) => x.id === pendingExistingId) : undefined;

    const approveExistingCampaign = () => {
      if (!plan || !pendingExisting) return;
      const prevPlanId = pendingExisting.mediaPlanId;
      updateCampaign(pendingExisting.id, { mediaPlanId: plan.id });
      toast({
        title: 'Campaign added to this plan',
        description: pendingExisting.name,
        undo: () => updateCampaign(pendingExisting.id, { mediaPlanId: prevPlanId }),
      });
      setPendingExistingId(undefined);
      setPickSelectedId(undefined);
    };

    /** Open the campaign wizard for the chosen proposition, inside this plan.
     *  The wizard runs the campaign steps and continues into bookings and
     *  creatives; the campaign record is created when it finishes. */
    /**
     * Add a campaign without leaving the plan: the same form the plan wizard
     * ends with, in a dialog, and the campaign lands in the table as a new
     * row — proposed, for the setup steps to approve.
     */
    const [newCampaign, setNewCampaign] = React.useState<{
      engine: EngineId; name: string; mode: 'assisted' | 'expert'; budget: string; dateRange?: DateRange; buyingType: 'auction' | 'guaranteed';
    } | null>(null);
    const addCampaign = (engine: EngineId) => {
      if (!plan) return;
      setNewCampaign({ engine, name: '', mode: 'assisted', budget: '', dateRange: undefined, buyingType: 'auction' });
    };
    const saveNewCampaign = () => {
      if (!plan || !newCampaign) return;
      const label = propositionMeta[newCampaign.engine].label;
      const name = newCampaign.name.trim() || `${plan.name} — ${label}`;
      const committed = db.campaigns.filter((c) => c.mediaPlanId === plan.id).reduce((sum, c) => sum + c.budget, 0);
      const budget = parseFloat(newCampaign.budget) || Math.max(plan.budget - committed, 0);
      const startDate = newCampaign.dateRange?.from ? newCampaign.dateRange.from.toISOString().slice(0, 10) : plan.startDate;
      const endDate = newCampaign.dateRange?.to ? newCampaign.dateRange.to.toISOString().slice(0, 10) : plan.endDate;
      const created = createCampaign({
        mediaPlanId: plan.id,
        name,
        engine: newCampaign.engine,
        mode: newCampaign.mode,
        buyingType: newCampaign.buyingType,
        // Proposed, not yet approved: the plan's setup steps ask for that.
        status: 'draft',
        budget,
        spend: 0,
        startDate,
        endDate,
      });
      setNewCampaign(null);
      toast({ title: 'Campaign added', description: `${created.name} — proposed, to review. Its bookings and creatives are the next steps.` });
    };

    const countsFor = (scope: { campaignId?: string; bookingId?: string }) => {
      const msgs = deriveMessages(db, scope);
      const actions = msgs.filter((m) => m.kind === 'action');
      return {
        actionCount: actions.length,
        recommendationCount: msgs.filter((m) => m.kind === 'recommendation').length,
        insightCount: msgs.filter((m) => m.kind === 'insight').length,
        // Health is the concern-only model's status for the row, or nothing.
        health: (() => {
          const h = scope.campaignId ? campaignHealth(db, scope.campaignId) : scope.bookingId ? bookingHealth(db, scope.bookingId) : undefined;
          return h ? (h.status === 'AT_RISK' ? ('risk' as const) : ('attention' as const)) : undefined;
        })(),
        healthIndicators: (scope.campaignId ? campaignHealth(db, scope.campaignId) : scope.bookingId ? bookingHealth(db, scope.bookingId) : undefined)?.indicators,
        healthScore: scoreHealth(scope.campaignId ? campaignHealth(db, scope.campaignId) : scope.bookingId ? bookingHealth(db, scope.bookingId) : undefined),
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
        // The chip opens its own findings; only the row click is kept out.
        render: (r) => (r._type === 'add' ? null : (
          <div onClick={(e) => e.stopPropagation()}>
            {(r._type === 'campaign' ? r.state : r.status) === 'draft'
              ? <span className="text-sm text-muted-foreground">—</span>
              : <HealthCell health={r.health} score={r.healthScore?.score} reason={r.healthScore?.reason} indicators={r.healthIndicators} />}
          </div>
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
          {/* In setup the panel opens its to-dos: the page is about getting
              the plan approved, so the steps sit in view, each with what is
              left and a way to start it. */}
          <ControlBar
            className="mb-section"
            // Where the plan stands in its own workflow — each stage a chip that opens its steps.
            // The workflow row, the same as on campaigns and bookings: the
            // stages left, each a chip that opens its steps, and the run
            // controls right — launch, pause, resume, stop.
            footer={plan ? (
              <WorkflowProgress
                variant="bar"
                hideNext
                expanded={inSetup}
                engine="media-plan"
                mediaPlanId={plan.id}
                renderStepExtra={planStepExtra}
                trailing={(
                  <LifecycleActions
                  level="media-plan"
                  entityId={plan.id}
                  status={plan.status}
                  name={plan.name}
                  playDisabled={!canLaunch}
                  playDisabledReason={`${planBlockers.length} blocker${planBlockers.length === 1 ? '' : 's'} to clear first — see Notifications`}
                  />
                )}
              />
            ) : undefined}
          >
            <ControlBarItem label="Media plan budget">
              {/* One number: the ceiling. Budgets are given to campaigns,
                  not split over propositions here — and free room is a
                  feature, kept open so more campaigns can be added. */}
              <BudgetPopover
                hint="Campaign budgets are set on the campaigns themselves — free room stays open for adding more."
                className="w-40"
                total={plan?.budget ?? 0}
                committed={db.campaigns
                  .filter((c) => c.mediaPlanId === plan?.id)
                  .reduce((sum, c) => sum + c.budget, 0)}
                allocations={db.campaigns
                  .filter((c) => c.mediaPlanId === plan?.id)
                  .map((c) => ({ name: c.name, budget: c.budget, spent: c.spend, engine: c.engine }))}
                showSpend={plan?.status === 'running' || plan?.status === 'paused'}
                onApply={(nextTotal) => {
                  if (!plan) return;
                  const prevBudget = plan.budget;
                  updateMediaPlan(plan.id, { budget: nextTotal });
                  toast({
                    title: 'Media plan budget updated',
                    description: `€${prevBudget.toLocaleString()} → €${nextTotal.toLocaleString()}. Campaign budgets are untouched.`,
                    undo: () => updateMediaPlan(plan.id, { budget: prevBudget }),
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
                {/* The chip opens what it is judged on. */}
                {/* A draft has nothing to judge yet. */}
                {plan?.status === 'draft' ? (
                  <span className="text-sm text-muted-foreground" title="Health is judged once the plan leaves draft.">—</span>
                ) : (
                  <HealthCell
                    health={planVerdict?.level}
                    score={planVerdict?.score}
                    reason={planVerdict?.reason}
                    message={planVerdict?.message}
                    indicators={planHealthSummary?.indicators}
                    insights={planInsightCards}
                  />
                )}
              </div>
            </ControlBarItem>
            {/* Recommendations only: to-dos are the workflow steps right
                below, and every notification lives in the notification
                centre. The count opens the Recommendations tab. */}
            <ControlBarItem label="Recommendations" dropOrder={1}>
              <div className="flex h-9 items-center">
                <RecommendationsCell
                  items={planRecommendations.map((m) => ({ id: m.id, subject: m.subject, preview: m.preview, context: m.context, done: inboxStatus[m.id] === 'done' }))}
                  onOpen={(id) => { markRead(id); setActiveRecommendationId(id); }}
                  onOpenAll={() => setActiveTab('inbox')}
                />
              </div>
            </ControlBarItem>
          </ControlBar>

          {/* The row's own pb-3 plus this mb-1 makes the same 16px the cards
              keep between themselves — the whole column shares one gap. */}
          <div className="mb-section">
            {/* showCharts lets a card expand in place to the per-proposition
                breakdown below the row; the cards themselves stay numbers. */}
            <MetricRow
              // In setup the row reads like the wizard's estimate row: the
              // promised numbers, plainly — no donuts, no expand-on-click.
              // Charts are for a plan being watched, not one being built.
              metrics={
                inSetup
                  ? (preLive ? forecastMetrics : liveMetrics).map(({ key, label, value, subMetric, badgeValue, badgeVariant }) => ({ key, label, value, subMetric, badgeValue, badgeVariant }))
                  // Otherwise the cards carry numbers only — the chart is
                  // what a click opens beneath the row, like everywhere else.
                  : (preLive ? forecastMetrics : liveMetrics).map(
                      ({ chart, donutData, donutColors, donutEngines, budgetData, graphData, productData, dateData, totalRow, ...rest }) => rest,
                    )
              }
              maxVisible={preLive ? 6 : 4}
              defaultVariant="default"
              showCharts={!inSetup}
              hideEditButton={inSetup}
              hideDateRange={inSetup}
              hideMeasurement={inSetup}
              removable={false}
              bleedEdges
            />
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
                      <div className="space-y-field">
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
                      <div className="space-y-field">
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
                          <RetailProductSelect value={retailProducts} onChange={setRetailProducts} brands={brands} optional showCount />
                        )}
                      </div>
                    </FormSection>

                    <FormSection title="Goal and objectives" bordered>
                      <div className="space-y-field">
                        {/* The wizard's own goal card, one card only: the goal
                            is fixed once the plan exists (the KPIs and the
                            reporting hang off it), so the alternatives are not
                            shown — but what IS shown reads exactly like the
                            wizard: the goal with its KPI columns, and the
                            objective and KPIs inside the goal's own card. */}
                        <div className="space-y-2">
                          <Label className="flex items-center gap-1.5 text-muted-foreground">
                            Media plan goal
                            <Lock className="h-3 w-3" aria-label="Cannot be changed" />
                          </Label>
                          {(() => {
                            const g = goals.find((x) => x.id === goal);
                            if (!g) {
                              return (
                                <div className="flex min-h-9 items-center rounded-md bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                                  No goal set
                                </div>
                              );
                            }
                            const stage = stageForGoal[g.id];
                            const k = stage ? funnelKpis[stage] : undefined;
                            return (
                              <GoalSelect
                                goals={[{
                                  id: g.id,
                                  icon: g.icon,
                                  title: g.title,
                                  description: g.description,
                                  brandKpis: k?.brand ?? [],
                                  mediaKpis: k?.media ?? [],
                                  salesKpis: k?.sales ?? [],
                                }]}
                                value={goal}
                                onChange={() => {}}
                                openContent={(
                                  <>
                                    <ReadOnlyField
                                      label="Objective"
                                      value={objectiveOptions.find((o) => o.value === objective)?.label}
                                      hint={objective ? describeObjective(objective) : 'Set when the media plan was created'}
                                    />
                                    <SearchSelectList
                                      label="KPIs"
                                      placeholder="Search KPIs…"
                                      options={kpiFilterOptions}
                                      value={kpis}
                                      onChange={(vals) => { setKpis(vals); setKpiStudies((s) => s.filter((v) => vals.includes(v))); }}
                                      renderSelectedExtra={(opt) => (
                                        <CheckboxCard
                                          icon={<FlaskConical />}
                                          title="Add a brand-lift study"
                                          description="Measures the uplift this KPI drives against a control group."
                                          checked={kpiStudies.includes(opt.value)}
                                          onCheckedChange={(c) => setKpiStudies((s) => (c ? [...s, opt.value] : s.filter((v) => v !== opt.value)))}
                                        />
                                      )}
                                    />
                                  </>
                                )}
                              />
                            );
                          })()}
                          <p className="text-xs text-muted-foreground">
                            The goal sets the objective and the KPIs this plan is judged on
                          </p>
                        </div>
                      </div>
                    </FormSection>

                    {/* What the plan may spend and when it runs — the SAME
                        live controls the control bar carries, so an edit here
                        and an edit there can never fight (both write to the
                        store directly; Save changes below does not touch
                        them). In setup, where the control bar steps aside,
                        this is the one place to reach them. */}
                    <FormSection title="Run time & budget" bordered>
                      <div className="space-y-field">
                        <div className="space-y-2">
                          <Label>Media plan run time</Label>
                          <DatesCell
                            className="h-9 w-full max-w-xs text-sm font-normal"
                            start={plan?.startDate}
                            end={plan?.endDate}
                            onSave={(startDate, endDate) => plan && updateMediaPlan(plan.id, { startDate, endDate })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="block">Media plan budget</Label>
                          <BudgetPopover
                            hint="Campaign budgets are set on the campaigns themselves — free room stays open for adding more."
                            className="w-full max-w-xs"
                            total={plan?.budget ?? 0}
                            committed={db.campaigns
                              .filter((c) => c.mediaPlanId === plan?.id)
                              .reduce((sum, c) => sum + c.budget, 0)}
                            allocations={db.campaigns
                              .filter((c) => c.mediaPlanId === plan?.id)
                              .map((c) => ({ name: c.name, budget: c.budget, spent: c.spend, engine: c.engine }))}
                            showSpend={plan?.status === 'running' || plan?.status === 'paused'}
                            onApply={(nextTotal) => {
                              if (!plan) return;
                              const prevBudget = plan.budget;
                              updateMediaPlan(plan.id, { budget: nextTotal });
                              toast({
                                title: 'Media plan budget updated',
                                description: `€${prevBudget.toLocaleString()} → €${nextTotal.toLocaleString()}. Campaign budgets are untouched.`,
                                undo: () => updateMediaPlan(plan.id, { budget: prevBudget }),
                              });
                            }}
                          />
                          <FieldHint>
                            The ceiling, applied immediately. Campaign budgets are set on the campaigns themselves — free room stays open for adding more.
                          </FieldHint>
                        </div>
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
                label: 'Recommendations',
                value: 'inbox',
                badgeCount: unreadCount,
                content: <InboxPanel scope="media-plan" entityId={plan?.id} kinds={['recommendation']} className="mt-6" />,
              },
              {
                label: 'Campaigns & bookings',
                value: 'campaigns',
                content: (
                  <div className="mt-6 space-y-6">
                    {/* One filter row over the campaigns table. Setup is
                        no longer a card view here: the workflow bar above
                        carries what is left to do. */}
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
                    </div>
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
                      // The row menu users asked for: edit opens the record,
                      // delete confirms first. The CTA rows carry none.
                      rowActions={(r) => {
                        if (r._type === 'add') return null;
                        const seg = routeSeg[r.engine ?? 'display'];
                        const editHref = r._type === 'campaign'
                          ? `/campaigns/${seg}/${r._id}`
                          : r.engine === 'sponsored-products'
                            ? `/campaigns/${seg}/${db.bookings.find((b) => b.id === r._id)?.campaignId ?? r._id}`
                            : `/campaigns/${seg}/booking/${r._id}`;
                        return (
                          <span onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="flex h-8 w-8 items-center justify-center rounded hover:bg-neutral-100 focus:outline-none" aria-label={`Actions for ${r.name}`}>
                                  <MoreHorizontal className="h-5 w-5" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start">
                                <DropdownMenuItem onClick={() => { if (typeof window !== 'undefined') window.location.href = editHref; }}>Edit</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => setDeleteTarget({ type: r._type as 'campaign' | 'booking', id: r._id, name: r.name })}
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </span>
                        );
                      }}
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
      {/* New campaign — the plan wizard's campaign form, in place. */}
      {newCampaign && plan && (() => {
        const meta = propositionMeta[newCampaign.engine];
        const NewIcon = meta.icon;
        const committed = db.campaigns.filter((c) => c.mediaPlanId === plan.id).reduce((sum, c) => sum + c.budget, 0);
        const free = Math.max(plan.budget - committed, 0);
        const isAssisted = newCampaign.mode === 'assisted';
        return (
          <Dialog open onOpenChange={(o) => { if (!o) setNewCampaign(null); }}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground"><NewIcon className="h-3.5 w-3.5" /></span>
                  {meta.label} campaign
                </DialogTitle>
                <DialogDescription>
                  Added to {plan.name} as a proposal — its bookings and creatives are the setup steps that follow.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <label className="flex cursor-pointer items-center justify-between gap-3 rounded-md border border-border p-3">
                  <span className="min-w-0">
                    <span className="block text-sm font-medium">{isAssisted ? 'Assisted' : 'Expert'}</span>
                    <span className="block text-xs text-muted-foreground">{isAssisted ? 'Prefilled by the AI presets — bookings are proposed for you.' : 'Starts blank — you make the bookings yourself.'}</span>
                  </span>
                  <Switch checked={isAssisted} onCheckedChange={(checked: boolean) => setNewCampaign({ ...newCampaign, mode: checked ? 'assisted' : 'expert' })} aria-label="Campaign mode" />
                </label>
                <div className="space-y-2">
                  <Label>Campaign name</Label>
                  <Input value={newCampaign.name} placeholder={`${plan.name} — ${meta.label}`} onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })} />
                </div>
                <div className="grid grid-cols-1 gap-x-2 gap-y-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Campaign budget</Label>
                    <Input type="number" min="0" value={newCampaign.budget} placeholder={free > 0 ? String(free) : 'Enter budget amount'} onChange={(e) => setNewCampaign({ ...newCampaign, budget: e.target.value })} />
                    <FieldHint>€{free.toLocaleString()} of the plan's €{plan.budget.toLocaleString()} is still free.</FieldHint>
                  </div>
                  <div className="space-y-2">
                    <Label>Campaign run time</Label>
                    <DateRangePicker
                      dateRange={newCampaign.dateRange}
                      onDateRangeChange={(r) => setNewCampaign({ ...newCampaign, dateRange: r })}
                      placeholder="Inherits the plan run time"
                      showPresets
                      presets={futureDateRangePresets}
                      className="w-full"
                    />
                  </div>
                </div>
                <BuyingTypePicker value={newCampaign.buyingType} onChange={(v) => setNewCampaign({ ...newCampaign, buyingType: v })} />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewCampaign(null)}>Cancel</Button>
                <Button onClick={saveNewCampaign}>Add campaign</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        );
      })()}

      {/* Delete confirmation — names the object; a campaign takes its
          bookings with it, and there is no undo for a delete. */}
      {deleteTarget && (
      <Dialog open onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete {deleteTarget.type === 'campaign' ? 'campaign' : 'booking'}?</DialogTitle>
            <DialogDescription>
              {deleteTarget.name}
              {deleteTarget.type === 'campaign' ? ' and its bookings will be deleted.' : ' will be deleted.'} This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteTarget.type === 'campaign') deleteCampaign(deleteTarget.id);
                else deleteBooking(deleteTarget.id);
                toast({ title: `${deleteTarget.type === 'campaign' ? 'Campaign' : 'Booking'} deleted`, description: deleteTarget.name });
                setDeleteTarget(null);
              }}
            >
              Delete {deleteTarget.type === 'campaign' ? 'campaign' : 'booking'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      )}

      {/* ── Add existing campaign — the picker ─────────────────────────────
          Leads with what is FREE on the plan, then a filterable, sortable
          table of candidates; rows expand into their bookings. Only fitting
          campaigns are selectable; the rest say why and offer Edit. */}
      {plan && (
      <Dialog open={linkExistingOpen} onOpenChange={(o) => { setLinkExistingOpen(o); if (!o) setPickSelectedId(undefined); }}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Add existing campaign</DialogTitle>
            <DialogDescription>
              Pick a campaign that fits inside the plan&rsquo;s free budget and run time — the rest stay listed, with why they don&rsquo;t fit.
            </DialogDescription>
          </DialogHeader>

          {/* The plan's budget, free space first. */}
          <div className="space-y-2 rounded-md border border-border bg-neutral-50 p-3">
            <div className="flex items-baseline justify-between gap-3 text-xs">
              <span className="font-medium">{fmtEuro(freeBudget)} free of {fmtEuro(plan.budget)}</span>
              <span className="text-muted-foreground">Run time {fmtDate(plan.startDate)} – {fmtDate(plan.endDate)}</span>
            </div>
            <FillRateBar
              total={plan.budget}
              value={{ booked: claimedBudget, reserved: pickSelected ? pickSelected.budget : 0, available: Math.max(freeBudget - (pickSelected?.budget ?? 0), 0) }}
              segmentLabels={{ booked: 'Committed', reserved: pickSelected ? pickSelected.name : 'Selected', available: 'Free' }}
              hoverTooltip={false}
              height={10}
            />
            <div className="flex gap-4 text-[11px] text-muted-foreground">
              <span>Committed {fmtEuro(claimedBudget)}</span>
              {pickSelected && <span>Selected {fmtEuro(pickSelected.budget)}</span>}
              <span>Free {fmtEuro(Math.max(freeBudget - (pickSelected?.budget ?? 0), 0))}</span>
            </div>
          </div>

          {/* Filters: proposition / status as the page's own filter bar,
              run time and budget beside it. */}
          <div className="flex flex-wrap items-start gap-3">
            <FilterBar
              className="min-w-0 flex-1"
              filters={[
                {
                  name: 'Proposition',
                  options: (Object.keys(propositionMeta) as EngineId[]).map((e) => ({ label: propositionMeta[e].label, value: e })),
                  selectedValues: pickPropFilter,
                  onChange: setPickPropFilter,
                },
                {
                  name: 'Status',
                  options: (Object.keys(statusBadge) as PlanStatus[]).map((st) => ({ label: statusBadge[st].label, value: st })),
                  selectedValues: pickStateFilter,
                  onChange: setPickStateFilter,
                },
                {
                  name: 'Budget',
                  options: [
                    { label: '< €5,000', value: 'lt5' },
                    { label: '€5,000 – €15,000', value: '5to15' },
                    { label: '> €15,000', value: 'gt15' },
                  ],
                  selectedValues: pickBudgetFilter,
                  onChange: setPickBudgetFilter,
                },
              ]}
              searchValue={pickSearch}
              onSearchChange={setPickSearch}
              searchPlaceholder="Search campaigns..."
            />
            <div className="w-56 shrink-0">
              <DateRangePicker
                dateRange={pickRange}
                onDateRangeChange={setPickRange}
                placeholder="Run time"
              />
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            <Table<PickRow>
              columns={[
                {
                  key: 'name', header: 'Name', sortable: true, sortFn: bySortField('sortName'),
                  render: (r) => {
                    const Icon = propositionMeta[r.engine].icon;
                    return (
                      <span className={cn('flex min-w-0 items-center gap-2', !r.fits && 'opacity-50')}>
                        {r._kind === 'campaign' && <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />}
                        <span className="truncate">{r.name}</span>
                      </span>
                    );
                  },
                },
                { key: 'externalId', header: 'External ID', sortable: true, sortFn: (a, b) => bySortField('sortName')(a, b), render: (r) => <span className={cn('text-muted-foreground', !r.fits && 'opacity-50')}>{r.id}</span> },
                { key: 'budget', header: 'Budget', sortable: true, sortFn: bySortField('sortBudget'), render: (r) => <span className={cn('tabular-nums', !r.fits && 'opacity-50')}>{fmtEuro(r.budget)}</span> },
                { key: 'runtime', header: 'Run time', sortable: true, sortFn: bySortField('sortStart'), render: (r) => <span className={cn(!r.fits && 'opacity-50')}>{fmtRange(r.startDate, r.endDate)}</span> },
                {
                  key: 'status', header: 'Status', sortable: true, sortFn: bySortField('sortStatus'),
                  render: (r) => <span className={cn(!r.fits && 'opacity-50')}><Badge variant={statusBadge[r.status].variant}>{statusBadge[r.status].label}</Badge></span>,
                },
                {
                  key: 'fit', header: '',
                  render: (r) => {
                    if (r._kind !== 'campaign' || r.fits) return null;
                    return (
                      <span className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
                        <span className="max-w-48 truncate" title={r.fitReason}>{r.fitReason}</span>
                        {/* Editing the campaign is the way to MAKE it fit. */}
                        <Button
                          variant="outline" size="sm" className="h-7 gap-1 px-2 text-xs"
                          onClick={(e) => { e.stopPropagation(); window.location.href = `/campaigns/${routeSeg[r.engine]}/${r.id}`; }}
                        >
                          <Pencil className="h-3 w-3" /> Edit
                        </Button>
                      </span>
                    );
                  },
                },
              ]}
              data={pickRows}
              rowKey={(r) => `${r._kind}-${r.id}`}
              hideActions
              hideRefreshedAt
              expandable={{
                isExpandable: (r) => r._kind === 'campaign' && db.bookings.some((b) => b.campaignId === r.id),
                isExpanded: (r) => r._kind === 'campaign' && pickExpanded.includes(r.id),
                onToggle: (r) => setPickExpanded((prev) => prev.includes(r.id) ? prev.filter((x) => x !== r.id) : [...prev, r.id]),
                isChild: (r) => r._kind === 'booking',
                getLabel: (r, expanded) => `${expanded ? 'Collapse' : 'Expand'} ${r.name}`,
              }}
              onRowClick={(r) => { if (r._kind === 'campaign' && r.fits) setPickSelectedId((prev) => (prev === r.id ? undefined : r.id)); }}
              rowClassName={(r) =>
                cn(
                  r._kind === 'campaign' && r.fits && 'cursor-pointer',
                  r._kind === 'campaign' && !r.fits && 'cursor-not-allowed',
                  r._kind === 'campaign' && pickSelectedId === r.id && 'bg-surface-selected',
                )
              }
              emptyState={<span className="text-sm text-muted-foreground">No campaigns match these filters.</span>}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setLinkExistingOpen(false); setPickSelectedId(undefined); }}>Cancel</Button>
            <Button
              disabled={!pickSelected}
              onClick={() => { setLinkExistingOpen(false); setPendingExistingId(pickSelectedId); }}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      )}

      {/* ── The approval — clean and simple ────────────────────────────────
          Only fitting campaigns reach this point, so nothing on the plan
          changes: the addition on the budget bar, the run time, Approve. */}
      {plan && pendingExisting && (
      <Dialog open onOpenChange={(o) => { if (!o) setPendingExistingId(undefined); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add {pendingExisting.name}?</DialogTitle>
            <DialogDescription>
              It fits inside the plan&rsquo;s budget and run time — nothing on the plan changes.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 rounded-md border border-border bg-neutral-50 p-3">
            <FillRateBar
              total={plan.budget}
              value={{ booked: claimedBudget, reserved: pendingExisting.budget, available: Math.max(freeBudget - pendingExisting.budget, 0) }}
              segmentLabels={{ booked: 'Committed', reserved: pendingExisting.name, available: 'Free' }}
              hoverTooltip={false}
              height={10}
            />
            <div className="flex gap-4 text-[11px] text-muted-foreground">
              <span>Committed {fmtEuro(claimedBudget)}</span>
              <span>+ {fmtEuro(pendingExisting.budget)} this campaign</span>
              <span>{fmtEuro(Math.max(freeBudget - pendingExisting.budget, 0))} left free</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Runs {fmtDate(pendingExisting.startDate)} – {fmtDate(pendingExisting.endDate)}, inside the plan&rsquo;s {fmtDate(plan.startDate)} – {fmtDate(plan.endDate)}.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setPendingExistingId(undefined); setLinkExistingOpen(true); }}>Back</Button>
            <Button onClick={approveExistingCampaign}>Approve</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      )}
      {/* A recommendation opened from the control bar's dropdown: the same
        panel the inbox opens, with its case and its two answers. */}
    {activeRecommendation && (
      <MessageDrawer
        open
        onOpenChange={(isOpen) => { if (!isOpen) setActiveRecommendationId(null); }}
        kind="recommendation"
        severity={activeRecommendation.severity}
        subject={activeRecommendation.subject}
        context={activeRecommendation.context}
        level={activeRecommendation.level}
        message={activeRecommendation.preview}
        businessCase={activeRecommendation.evidence ? { stats: activeRecommendation.evidence.stats, insights: activeRecommendation.evidence.insights, move: activeRecommendation.evidence.move } : undefined}
        acceptLabel={activeRecommendation.acceptLabel}
        onAccept={inboxStatus[activeRecommendation.id] !== 'done' ? () => { markDone(activeRecommendation.id); setActiveRecommendationId(null); } : undefined}
        onDecline={inboxStatus[activeRecommendation.id] !== 'done' ? () => { markDone(activeRecommendation.id); setActiveRecommendationId(null); } : undefined}
      />
    )}
    </AppLayout>
      </MenuContextProvider>
    );
  },
};
